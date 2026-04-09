import { parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { updateBookingStatus } from "@/lib/services/crm-service";
import { requireApiSession } from "@/lib/tenant/api";
import { updateBookingSchema } from "@/lib/validation/crm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const session = await requireApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const body = await parseJsonBody(request);
  const parsed = updateBookingSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid booking payload.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const { bookingId } = await params;

  try {
    const booking = await updateBookingStatus({
      bookingId,
      businessId: session.user.businessId,
      notes: parsed.data.notes,
      status: parsed.data.status,
      userId: session.user.id,
    });

    return jsonOk(booking);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update booking.", 404);
  }
}
