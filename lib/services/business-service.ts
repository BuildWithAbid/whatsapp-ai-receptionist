import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/services/audit-service";
import type { BotSettingInput, BusinessProfileInput, FAQInput, WhatsAppConfigInput } from "@/lib/validation/business";

export async function getBusinessWorkspace(businessId: string) {
  return prisma.business.findUnique({
    where: { id: businessId },
    include: {
      botSetting: true,
      faqs: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function updateBusinessProfile({
  businessId,
  input,
  userId,
}: {
  businessId: string;
  input: BusinessProfileInput;
  userId: string;
}) {
  const business = await prisma.business.update({
    where: { id: businessId },
    data: {
      name: input.name,
      category: input.category,
      timezone: input.timezone,
      phoneNumber: input.phoneNumber || null,
      location: input.location || null,
    },
  });

  await createAuditLog({
    action: "business.updated",
    businessId,
    entityId: business.id,
    entityType: "business",
    payload: input,
    userId,
  });

  return business;
}

export async function updateWhatsAppConfig({
  businessId,
  input,
  userId,
}: {
  businessId: string;
  input: WhatsAppConfigInput;
  userId: string;
}) {
  const business = await prisma.business.update({
    where: { id: businessId },
    data: {
      whatsappPhoneNumberId: input.whatsappPhoneNumberId || null,
      whatsappBusinessAccountId: input.whatsappBusinessAccountId || null,
      whatsappDisplayPhone: input.whatsappDisplayPhone || null,
    },
  });

  await createAuditLog({
    action: "whatsapp.updated",
    businessId,
    entityId: business.id,
    entityType: "business",
    payload: {
      ...input,
      whatsappPhoneNumberId: input.whatsappPhoneNumberId ? "[configured]" : null,
      whatsappBusinessAccountId: input.whatsappBusinessAccountId ? "[configured]" : null,
    },
    userId,
  });

  return business;
}

export async function updateBotSettings({
  businessId,
  input,
  userId,
}: {
  businessId: string;
  input: BotSettingInput;
  userId: string;
}) {
  const botSetting = await prisma.botSetting.upsert({
    where: {
      businessId,
    },
    update: {
      openingHours: input.openingHours || null,
      servicesOffered: input.servicesOffered || null,
      pricingNotes: input.pricingNotes || null,
      toneOfVoice: input.toneOfVoice || null,
      escalationMessage: input.escalationMessage,
      leadCaptureEnabled: input.leadCaptureEnabled,
      bookingCaptureEnabled: input.bookingCaptureEnabled,
      autoReplyEnabled: input.autoReplyEnabled,
    },
    create: {
      businessId,
      openingHours: input.openingHours || null,
      servicesOffered: input.servicesOffered || null,
      pricingNotes: input.pricingNotes || null,
      toneOfVoice: input.toneOfVoice || null,
      escalationMessage: input.escalationMessage,
      leadCaptureEnabled: input.leadCaptureEnabled,
      bookingCaptureEnabled: input.bookingCaptureEnabled,
      autoReplyEnabled: input.autoReplyEnabled,
    },
  });

  await createAuditLog({
    action: "bot-settings.updated",
    businessId,
    entityId: botSetting.id,
    entityType: "botSetting",
    payload: input,
    userId,
  });

  return botSetting;
}

export async function upsertFaq({
  businessId,
  input,
  userId,
}: {
  businessId: string;
  input: FAQInput;
  userId: string;
}) {
  if (input.id) {
    const existingFaq = await prisma.fAQ.findFirst({
      where: {
        id: input.id,
        businessId,
      },
      select: { id: true },
    });

    if (!existingFaq) {
      throw new Error("FAQ not found.");
    }

    const faq = await prisma.fAQ.update({
      where: {
        id: input.id,
      },
      data: {
        question: input.question,
        answer: input.answer,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
    });

    await createAuditLog({
      action: "faq.updated",
      businessId,
      entityId: faq.id,
      entityType: "faq",
      payload: input,
      userId,
    });

    return faq;
  }

  const faq = await prisma.fAQ.create({
    data: {
      businessId,
      question: input.question,
      answer: input.answer,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });

  await createAuditLog({
    action: "faq.created",
    businessId,
    entityId: faq.id,
    entityType: "faq",
    payload: input,
    userId,
  });

  return faq;
}

export async function deleteFaq({
  businessId,
  faqId,
  userId,
}: {
  businessId: string;
  faqId: string;
  userId: string;
}) {
  const existingFaq = await prisma.fAQ.findFirst({
    where: {
      id: faqId,
      businessId,
    },
    select: { id: true },
  });

  if (!existingFaq) {
    throw new Error("FAQ not found.");
  }

  const faq = await prisma.fAQ.delete({
    where: {
      id: faqId,
    },
  });

  await createAuditLog({
    action: "faq.deleted",
    businessId,
    entityId: faq.id,
    entityType: "faq",
    userId,
  });
}
