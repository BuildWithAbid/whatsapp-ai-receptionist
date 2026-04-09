import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../lib/auth/password";
import { env } from "../lib/env";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword(env.SEED_OWNER_PASSWORD);

  const user = await prisma.user.upsert({
    where: {
      email: env.SEED_OWNER_EMAIL,
    },
    update: {
      name: "Demo Owner",
      passwordHash,
    },
    create: {
      email: env.SEED_OWNER_EMAIL,
      name: "Demo Owner",
      passwordHash,
    },
  });

  const business = await prisma.business.upsert({
    where: {
      ownerUserId: user.id,
    },
    update: {
      name: "Bright Smiles Dental",
      category: "Dental clinic",
      timezone: "America/New_York",
      phoneNumber: "+1 555 0100",
      location: "245 Cedar Ave, Brooklyn, NY",
      whatsappPhoneNumberId: "demo-phone-number-id",
      whatsappBusinessAccountId: "demo-business-account-id",
      whatsappDisplayPhone: "+1 555 0100",
    },
    create: {
      ownerUserId: user.id,
      name: "Bright Smiles Dental",
      category: "Dental clinic",
      timezone: "America/New_York",
      phoneNumber: "+1 555 0100",
      location: "245 Cedar Ave, Brooklyn, NY",
      whatsappPhoneNumberId: "demo-phone-number-id",
      whatsappBusinessAccountId: "demo-business-account-id",
      whatsappDisplayPhone: "+1 555 0100",
    },
  });

  await prisma.botSetting.upsert({
    where: {
      businessId: business.id,
    },
    update: {
      openingHours: "Mon-Fri: 9am-6pm\nSat: 10am-2pm\nSun: Closed",
      servicesOffered:
        "Dental cleaning\nWhitening\nDental fillings\nEmergency consultation\nFollow-up appointments",
      pricingNotes:
        "Consultations start at $45. Final pricing depends on treatment type and the consultation outcome.",
      toneOfVoice: "Calm, reassuring, concise, and helpful",
      escalationMessage:
        "Thanks for reaching out. A team member will review your message and reply shortly with the right details.",
      leadCaptureEnabled: true,
      bookingCaptureEnabled: true,
      autoReplyEnabled: true,
    },
    create: {
      businessId: business.id,
      openingHours: "Mon-Fri: 9am-6pm\nSat: 10am-2pm\nSun: Closed",
      servicesOffered:
        "Dental cleaning\nWhitening\nDental fillings\nEmergency consultation\nFollow-up appointments",
      pricingNotes:
        "Consultations start at $45. Final pricing depends on treatment type and the consultation outcome.",
      toneOfVoice: "Calm, reassuring, concise, and helpful",
      escalationMessage:
        "Thanks for reaching out. A team member will review your message and reply shortly with the right details.",
      leadCaptureEnabled: true,
      bookingCaptureEnabled: true,
      autoReplyEnabled: true,
    },
  });

  await prisma.fAQ.deleteMany({
    where: {
      businessId: business.id,
    },
  });

  await prisma.fAQ.createMany({
    data: [
      {
        businessId: business.id,
        question: "What are your opening hours?",
        answer: "We are open Monday to Friday from 9am to 6pm, Saturday from 10am to 2pm, and closed on Sunday.",
        sortOrder: 1,
      },
      {
        businessId: business.id,
        question: "Do you offer emergency appointments?",
        answer: "Yes. Please tell us what happened and your preferred contact number, and we will prioritize the follow-up.",
        sortOrder: 2,
      },
      {
        businessId: business.id,
        question: "How much is a consultation?",
        answer: "Consultations start at $45. Final pricing depends on the treatment and what the dentist recommends after assessment.",
        sortOrder: 3,
      },
    ],
  });

  const conversation = await prisma.conversation.upsert({
    where: {
      businessId_customerPhone: {
        businessId: business.id,
        customerPhone: "+15550111",
      },
    },
    update: {
      customerName: "Emily Torres",
      status: "OPEN",
      lastMessageAt: new Date(),
      unansweredCount: 0,
    },
    create: {
      businessId: business.id,
      customerPhone: "+15550111",
      customerName: "Emily Torres",
      status: "OPEN",
      lastMessageAt: new Date(),
      unansweredCount: 0,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        businessId: business.id,
        conversationId: conversation.id,
        channelMessageId: "demo-inbound-1",
        direction: "INBOUND",
        role: "CUSTOMER",
        messageType: "text",
        content: "Hi, do you do whitening and how much is the consultation?",
        deliveryStatus: "RECEIVED",
      },
      {
        businessId: business.id,
        conversationId: conversation.id,
        channelMessageId: "demo-outbound-1",
        direction: "OUTBOUND",
        role: "ASSISTANT",
        messageType: "text",
        content:
          "Yes, we offer whitening. Consultations start at $45. If you want, I can also help capture your details for a booking request.",
        deliveryStatus: "SENT",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.lead.createMany({
    data: [
      {
        businessId: business.id,
        conversationId: conversation.id,
        name: "Emily Torres",
        phone: "+15550111",
        serviceNeeded: "Whitening",
        status: "NEW",
        notes: "Asked about whitening and consultation pricing.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.bookingRequest.createMany({
    data: [
      {
        businessId: business.id,
        conversationId: conversation.id,
        name: "Emily Torres",
        phone: "+15550111",
        serviceRequested: "Whitening consultation",
        preferredDateText: "Next Tuesday",
        preferredTimeText: "Morning",
        status: "NEW",
        notes: "Needs callback to confirm availability.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed.");
  console.log(`Owner email: ${env.SEED_OWNER_EMAIL}`);
  console.log(`Owner password: ${env.SEED_OWNER_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
