import { parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { updateLeadStatus } from "@/lib/services/crm-service";
import { requireApiSession } from "@/lib/tenant/api";
import { updateLeadSchema } from "@/lib/validation/crm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const body = await parseJsonBody(request);
  const parsed = updateLeadSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid lead payload.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const { leadId } = await params;

  try {
    const lead = await updateLeadStatus({
      businessId: session.user.businessId,
      leadId,
      notes: parsed.data.notes,
      status: parsed.data.status,
      userId: session.user.id,
    });

    return jsonOk(lead);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update lead.", 404);
  }
}
