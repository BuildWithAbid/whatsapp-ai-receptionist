import { requireApiSession } from "@/lib/tenant/api";
import { jsonError, jsonOk } from "@/lib/http/response";
import { getDashboardSummary } from "@/lib/services/dashboard-service";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const summary = await getDashboardSummary(session.user.businessId);
  return jsonOk(summary);
}
