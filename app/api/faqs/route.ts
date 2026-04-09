import { parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { getBusinessWorkspace, upsertFaq } from "@/lib/services/business-service";
import { requireApiSession } from "@/lib/tenant/api";
import { faqSchema } from "@/lib/validation/business";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const business = await getBusinessWorkspace(session.user.businessId);
  return jsonOk(business?.faqs ?? []);
}

export async function POST(request: Request) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const body = await parseJsonBody(request);
  const parsed = faqSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid FAQ payload.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const faq = await upsertFaq({
    businessId: session.user.businessId,
    input: parsed.data,
    userId: session.user.id,
  });

  return jsonOk(faq, { status: 201 });
}
