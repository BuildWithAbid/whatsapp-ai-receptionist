export type NormalizedWhatsAppMessage = {
  businessPhoneNumberId: string;
  customerPhone: string;
  customerName?: string | null;
  externalMessageId: string;
  messageType: string;
  text: string;
  raw: Record<string, unknown>;
};

export type AIConversationDecision = {
  replyText: string;
  needsHumanFollowUp: boolean;
  leadData: {
    name?: string | null;
    phone?: string | null;
    serviceNeeded?: string | null;
  } | null;
  bookingData: {
    name?: string | null;
    phone?: string | null;
    serviceRequested?: string | null;
    preferredDateText?: string | null;
    preferredTimeText?: string | null;
  } | null;
  confidence: "high" | "medium" | "low";
  reason: string;
};
