import type { BookingRequestListItem, ConversationListItem, DashboardSummary, LeadListItem } from "@/types/domain";
import { prisma } from "@/lib/db";

export async function getDashboardSummary(businessId: string): Promise<DashboardSummary> {
  const [totalConversations, leadsCaptured, bookingRequests, unansweredMessages] = await Promise.all([
    prisma.conversation.count({
      where: { businessId },
    }),
    prisma.lead.count({
      where: { businessId },
    }),
    prisma.bookingRequest.count({
      where: { businessId },
    }),
    prisma.conversation.count({
      where: {
        businessId,
        OR: [{ status: "NEEDS_HUMAN" }, { unansweredCount: { gt: 0 } }],
      },
    }),
  ]);

  return {
    totalConversations,
    leadsCaptured,
    bookingRequests,
    unansweredMessages,
  };
}

export async function listConversations(
  businessId: string,
  take = 12,
): Promise<ConversationListItem[]> {
  const conversations = await prisma.conversation.findMany({
    where: { businessId },
    orderBy: { lastMessageAt: "desc" },
    take,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return conversations.map((conversation) => ({
    id: conversation.id,
    customerName: conversation.customerName,
    customerPhone: conversation.customerPhone,
    status: conversation.status,
    unansweredCount: conversation.unansweredCount,
    lastMessageAt: conversation.lastMessageAt,
    lastMessagePreview: conversation.messages[0]?.content ?? "No messages yet.",
  }));
}

export async function listLeads(businessId: string, take = 25): Promise<LeadListItem[]> {
  return prisma.lead.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      name: true,
      phone: true,
      serviceNeeded: true,
      status: true,
      notes: true,
      createdAt: true,
    },
  });
}

export async function listBookingRequests(
  businessId: string,
  take = 25,
): Promise<BookingRequestListItem[]> {
  return prisma.bookingRequest.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      name: true,
      phone: true,
      serviceRequested: true,
      preferredDateText: true,
      preferredTimeText: true,
      status: true,
      notes: true,
      createdAt: true,
    },
  });
}
