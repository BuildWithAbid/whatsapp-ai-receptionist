import { requireApiSession } from "@/lib/tenant/api";
import { jsonError, jsonOk } from "@/lib/http/response";
import { listLeads } from "@/lib/services/dashboard-service";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const leads = await listLeads(session.user.businessId, 50);
  return jsonOk(leads);
}
