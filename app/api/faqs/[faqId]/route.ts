import { parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { deleteFaq, upsertFaq } from "@/lib/services/business-service";
import { requireApiSession } from "@/lib/tenant/api";
import { faqSchema } from "@/lib/validation/business";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ faqId: string }> },
) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const body = await parseJsonBody<Record<string, unknown>>(request);
  const { faqId } = await params;
  const parsed = faqSchema.safeParse({
    ...body,
    id: faqId,
  });

  if (!parsed.success) {
    return jsonError("Invalid FAQ payload.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  try {
    const faq = await upsertFaq({
      businessId: session.user.businessId,
      input: parsed.data,
      userId: session.user.id,
    });

    return jsonOk(faq);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update FAQ.", 404);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ faqId: string }> },
) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const { faqId } = await params;

  try {
    await deleteFaq({
      businessId: session.user.businessId,
      faqId,
      userId: session.user.id,
    });

    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete FAQ.", 404);
  }
}
