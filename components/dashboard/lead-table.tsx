import { formatDistanceToNow } from "date-fns";
import { UserRoundPlus } from "lucide-react";

import { LeadStatusForm } from "@/components/forms/lead-status-form";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeadListItem } from "@/types/domain";

export function LeadTable({ leads }: { leads: LeadListItem[] }) {
  if (!leads.length) {
    return (
      <EmptyState
        icon={UserRoundPlus}
        title="No leads captured yet"
        description="When the bot captures lead information, records will appear here for your team to follow up."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Service</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border/70">
                <td className="py-4 pr-4 align-top">
                  <div className="font-semibold">{lead.name || "Unknown customer"}</div>
                  <div className="text-muted-foreground">{lead.phone}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Captured {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top text-muted-foreground">{lead.serviceNeeded || "Not provided"}</td>
                <td className="py-4 pr-4 align-top">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="min-w-60 py-4 align-top">
                  <LeadStatusForm leadId={lead.id} notes={lead.notes} status={lead.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
