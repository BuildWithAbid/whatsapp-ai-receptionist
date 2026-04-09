export type DashboardSummary = {
  totalConversations: number;
  leadsCaptured: number;
  bookingRequests: number;
  unansweredMessages: number;
};

export type ConversationListItem = {
  id: string;
  customerName: string | null;
  customerPhone: string;
  status: "OPEN" | "NEEDS_HUMAN" | "CLOSED";
  unansweredCount: number;
  lastMessageAt: Date;
  lastMessagePreview: string;
};

export type LeadListItem = {
  id: string;
  name: string | null;
  phone: string;
  serviceNeeded: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  notes: string | null;
  createdAt: Date;
};

export type BookingRequestListItem = {
  id: string;
  name: string | null;
  phone: string;
  serviceRequested: string | null;
  preferredDateText: string | null;
  preferredTimeText: string | null;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CLOSED";
  notes: string | null;
  createdAt: Date;
};
