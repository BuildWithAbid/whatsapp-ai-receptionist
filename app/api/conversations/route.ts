import { requireApiSession } from "@/lib/tenant/api";
import { jsonError, jsonOk } from "@/lib/http/response";
import { listConversations } from "@/lib/services/dashboard-service";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const conversations = await listConversations(session.user.businessId, 50);
  return jsonOk(conversations);
}
