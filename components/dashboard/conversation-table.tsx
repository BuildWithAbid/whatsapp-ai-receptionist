import { formatDistanceToNow } from "date-fns";
import { MessageSquareOff } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ConversationListItem } from "@/types/domain";

export function ConversationTable({
  conversations,
  title = "Recent conversations",
}: {
  conversations: ConversationListItem[];
  title?: string;
}) {
  if (!conversations.length) {
    return (
      <EmptyState
        icon={MessageSquareOff}
        title="No conversations yet"
        description="Inbound WhatsApp messages will appear here once the webhook is connected and active."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Last message</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => (
              <tr key={conversation.id} className="border-t border-border/70">
                <td className="py-4 pr-4 align-top">
                  <div className="font-semibold">{conversation.customerName || "Unknown customer"}</div>
                  <div className="text-muted-foreground">{conversation.customerPhone}</div>
                </td>
                <td className="max-w-md py-4 pr-4 align-top text-muted-foreground">{conversation.lastMessagePreview}</td>
                <td className="py-4 pr-4 align-top">
                  <div className="space-y-2">
                    <StatusBadge status={conversation.status} />
                    {conversation.unansweredCount > 0 ? (
                      <div className="text-xs text-muted-foreground">
                        {conversation.unansweredCount} pending follow-up
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="py-4 align-top text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
