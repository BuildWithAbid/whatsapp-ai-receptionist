import { ConversationTable } from "@/components/dashboard/conversation-table";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";
import { listConversations } from "@/lib/services/dashboard-service";

export default async function ConversationsPage() {
  const { business } = await requireCurrentBusiness();
  const conversations = await listConversations(business.id, 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversations"
        description="Review the latest customer interactions and see which threads still require manual attention."
      />
      <ConversationTable conversations={conversations} title="Conversation history" />
    </div>
  );
}
