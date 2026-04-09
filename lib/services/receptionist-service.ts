import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logging/logger";
import { generateReceptionistDecision } from "@/lib/ai/receptionist";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp/client";
import type { NormalizedWhatsAppMessage } from "@/types/api";

function mapDeliveryStatus(status: string) {
  if (status === "failed") {
    return "FAILED" as const;
  }

  if (status === "sent" || status === "delivered" || status === "read") {
    return "SENT" as const;
  }

  return "PENDING" as const;
}

async function upsertLeadForConversation({
  businessId,
  conversationId,
  customerPhone,
  leadData,
}: {
  businessId: string;
  conversationId: string;
  customerPhone: string;
  leadData: {
    name?: string | null;
    phone?: string | null;
    serviceNeeded?: string | null;
  };
}) {
  const existingLead = await prisma.lead.findFirst({
    where: {
      businessId,
      OR: [{ conversationId }, { phone: customerPhone, status: { not: "CLOSED" } }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingLead) {
    return prisma.lead.update({
      where: { id: existingLead.id },
      data: {
        name: leadData.name ?? existingLead.name,
        phone: leadData.phone ?? existingLead.phone,
        serviceNeeded: leadData.serviceNeeded ?? existingLead.serviceNeeded,
      },
    });
  }

  return prisma.lead.create({
    data: {
      businessId,
      conversationId,
      name: leadData.name ?? null,
      phone: leadData.phone ?? customerPhone,
      serviceNeeded: leadData.serviceNeeded ?? null,
    },
  });
}

async function upsertBookingRequest({
  bookingData,
  businessId,
  conversationId,
  customerPhone,
}: {
  businessId: string;
  conversationId: string;
  customerPhone: string;
  bookingData: {
    name?: string | null;
    phone?: string | null;
    serviceRequested?: string | null;
    preferredDateText?: string | null;
    preferredTimeText?: string | null;
  };
}) {
  const existingBooking = await prisma.bookingRequest.findFirst({
    where: {
      businessId,
      OR: [{ conversationId }, { phone: customerPhone, status: { not: "CLOSED" } }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingBooking) {
    return prisma.bookingRequest.update({
      where: { id: existingBooking.id },
      data: {
        name: bookingData.name ?? existingBooking.name,
        phone: bookingData.phone ?? existingBooking.phone,
        serviceRequested: bookingData.serviceRequested ?? existingBooking.serviceRequested,
        preferredDateText: bookingData.preferredDateText ?? existingBooking.preferredDateText,
        preferredTimeText: bookingData.preferredTimeText ?? existingBooking.preferredTimeText,
      },
    });
  }

  return prisma.bookingRequest.create({
    data: {
      businessId,
      conversationId,
      name: bookingData.name ?? null,
      phone: bookingData.phone ?? customerPhone,
      serviceRequested: bookingData.serviceRequested ?? null,
      preferredDateText: bookingData.preferredDateText ?? null,
      preferredTimeText: bookingData.preferredTimeText ?? null,
    },
  });
}

export async function applyWhatsAppStatusUpdates(
  statusUpdates: Array<{ externalMessageId: string; status: string }>,
) {
  await Promise.all(
    statusUpdates.map((update) =>
      prisma.message.updateMany({
        where: {
          channelMessageId: update.externalMessageId,
        },
        data: {
          deliveryStatus: mapDeliveryStatus(update.status),
        },
      }),
    ),
  );
}

export async function processInboundWhatsAppMessage(message: NormalizedWhatsAppMessage) {
  const duplicate = await prisma.message.findUnique({
    where: {
      channelMessageId: message.externalMessageId,
    },
    select: { id: true },
  });

  if (duplicate) {
    logger.info({ externalMessageId: message.externalMessageId }, "Skipping duplicate inbound WhatsApp message.");
    return;
  }

  const business = await prisma.business.findFirst({
    where: {
      whatsappPhoneNumberId: message.businessPhoneNumberId,
    },
    include: {
      botSetting: true,
      faqs: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!business) {
    logger.warn({ phoneNumberId: message.businessPhoneNumberId }, "No business matched inbound WhatsApp message.");
    return;
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      businessId_customerPhone: {
        businessId: business.id,
        customerPhone: message.customerPhone,
      },
    },
    update: {
      customerName: message.customerName ?? undefined,
      lastMessageAt: new Date(),
    },
    create: {
      businessId: business.id,
      customerPhone: message.customerPhone,
      customerName: message.customerName ?? null,
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      businessId: business.id,
      conversationId: conversation.id,
      channelMessageId: message.externalMessageId,
      direction: "INBOUND",
      role: "CUSTOMER",
      messageType: message.messageType,
      content: message.text,
      deliveryStatus: "RECEIVED",
      metadata: message.raw as Prisma.InputJsonValue,
    },
  });

  const recentMessages = await prisma.message.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: { createdAt: "asc" },
    take: 12,
  });

  const decision = await generateReceptionistDecision({
    businessName: business.name,
    businessCategory: business.category,
    customerName: message.customerName,
    customerPhone: message.customerPhone,
    customerMessage: message.text,
    openingHours: business.botSetting?.openingHours,
    location: business.location,
    servicesOffered: business.botSetting?.servicesOffered,
    pricingNotes: business.botSetting?.pricingNotes,
    toneOfVoice: business.botSetting?.toneOfVoice,
    escalationMessage:
      business.botSetting?.escalationMessage ??
      "Thanks for your message. A team member will reply shortly.",
    faqs: business.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    recentMessages: recentMessages.slice(0, -1).map((item) => ({
      role: item.role === "CUSTOMER" ? "customer" : "assistant",
      content: item.content,
    })),
  });

  if (decision.leadData && business.botSetting?.leadCaptureEnabled !== false) {
    await upsertLeadForConversation({
      businessId: business.id,
      conversationId: conversation.id,
      customerPhone: message.customerPhone,
      leadData: decision.leadData,
    });
  }

  if (decision.bookingData && business.botSetting?.bookingCaptureEnabled !== false) {
    await upsertBookingRequest({
      businessId: business.id,
      conversationId: conversation.id,
      customerPhone: message.customerPhone,
      bookingData: decision.bookingData,
    });
  }

  const shouldSendReply = business.botSetting?.autoReplyEnabled !== false && decision.replyText.trim().length > 0;

  let outboundChannelMessageId: string | null = null;
  let outboundStatus: "SENT" | "FAILED" | "PENDING" = "PENDING";

  if (shouldSendReply && business.whatsappPhoneNumberId) {
    const sendResult = await sendWhatsAppTextMessage({
      phoneNumberId: business.whatsappPhoneNumberId,
      recipientPhone: message.customerPhone,
      text: decision.replyText,
    });

    outboundChannelMessageId = sendResult.messageId;
    outboundStatus = sendResult.ok ? "SENT" : "FAILED";
  }

  if (shouldSendReply) {
    await prisma.message.create({
      data: {
        businessId: business.id,
        conversationId: conversation.id,
        channelMessageId: outboundChannelMessageId,
        direction: "OUTBOUND",
        role: "ASSISTANT",
        messageType: "text",
        content: decision.replyText,
        deliveryStatus: outboundStatus,
        metadata: {
          confidence: decision.confidence,
          reason: decision.reason,
        } as Prisma.InputJsonValue,
      },
    });
  }

  await prisma.conversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      status: decision.needsHumanFollowUp ? "NEEDS_HUMAN" : "OPEN",
      unansweredCount: decision.needsHumanFollowUp ? { increment: 1 } : 0,
      lastMessageAt: new Date(),
    },
  });
}
