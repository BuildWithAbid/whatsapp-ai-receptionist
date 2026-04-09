import { parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { updateBusinessProfile, getBusinessWorkspace } from "@/lib/services/business-service";
import { requireApiSession } from "@/lib/tenant/api";
import { businessProfileSchema } from "@/lib/validation/business";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const business = await getBusinessWorkspace(session.user.businessId);
  return jsonOk(business);
}

export async function PUT(request: Request) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const body = await parseJsonBody(request);
  const parsed = businessProfileSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid business profile.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const business = await updateBusinessProfile({
    businessId: session.user.businessId,
    input: parsed.data,
    userId: session.user.id,
  });

  return jsonOk(business);
}
