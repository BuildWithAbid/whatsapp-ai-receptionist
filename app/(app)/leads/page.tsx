import { LeadTable } from "@/components/dashboard/lead-table";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";
import { listLeads } from "@/lib/services/dashboard-service";

export default async function LeadsPage() {
  const { business } = await requireCurrentBusiness();
  const leads = await listLeads(business.id, 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every captured lead lands here with contact details, service interest, and follow-up notes."
      />
      <LeadTable leads={leads} />
    </div>
  );
}
