import { CalendarRange, MessageSquareText, PhoneCall, TriangleAlert } from "lucide-react";

import { ConversationTable } from "@/components/dashboard/conversation-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";
import { getDashboardSummary, listConversations } from "@/lib/services/dashboard-service";

export default async function DashboardPage() {
  const { business } = await requireCurrentBusiness();
  const [summary, conversations] = await Promise.all([
    getDashboardSummary(business.id),
    listConversations(business.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Track inbound conversations, captured leads, booking requests, and messages that still need a human follow-up."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total conversations"
          description="All WhatsApp conversations stored in the workspace."
          value={summary.totalConversations}
          icon={MessageSquareText}
        />
        <StatCard
          title="Leads captured"
          description="Customer records captured by the receptionist workflow."
          value={summary.leadsCaptured}
          icon={PhoneCall}
        />
        <StatCard
          title="Booking requests"
          description="Manual booking requests awaiting follow-up."
          value={summary.bookingRequests}
          icon={CalendarRange}
        />
        <StatCard
          title="Needs follow-up"
          description="Conversations flagged for a human response."
          value={summary.unansweredMessages}
          icon={TriangleAlert}
        />
      </div>

      <ConversationTable conversations={conversations} />
    </div>
  );
}
