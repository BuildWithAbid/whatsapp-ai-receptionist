import { parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { getBusinessWorkspace, updateBotSettings } from "@/lib/services/business-service";
import { requireApiSession } from "@/lib/tenant/api";
import { botSettingSchema } from "@/lib/validation/business";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const business = await getBusinessWorkspace(session.user.businessId);
  return jsonOk(business?.botSetting ?? null);
}

export async function PUT(request: Request) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const body = await parseJsonBody(request);
  const parsed = botSettingSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid bot settings.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const botSetting = await updateBotSettings({
    businessId: session.user.businessId,
    input: parsed.data,
    userId: session.user.id,
  });

  return jsonOk(botSetting);
}
