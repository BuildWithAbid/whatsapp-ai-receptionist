import { BookingTable } from "@/components/dashboard/booking-table";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";
import { listBookingRequests } from "@/lib/services/dashboard-service";

export default async function BookingsPage() {
  const { business } = await requireCurrentBusiness();
  const bookings = await listBookingRequests(business.id, 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking requests"
        description="Track booking intent detected by the bot and move requests through your manual follow-up workflow."
      />
      <BookingTable bookings={bookings} />
    </div>
  );
}
