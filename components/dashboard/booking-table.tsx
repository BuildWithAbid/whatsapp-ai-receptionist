import { formatDistanceToNow } from "date-fns";
import { CalendarSearch } from "lucide-react";

import { BookingStatusForm } from "@/components/forms/booking-status-form";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingRequestListItem } from "@/types/domain";

export function BookingTable({ bookings }: { bookings: BookingRequestListItem[] }) {
  if (!bookings.length) {
    return (
      <EmptyState
        icon={CalendarSearch}
        title="No booking requests yet"
        description="Booking intent detected by the bot will appear here for manual confirmation and follow-up."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking requests</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Request</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-border/70">
                <td className="py-4 pr-4 align-top">
                  <div className="font-semibold">{booking.name || "Unknown customer"}</div>
                  <div className="text-muted-foreground">{booking.phone}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Captured {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top text-muted-foreground">
                  <div>{booking.serviceRequested || "Not specified"}</div>
                  <div className="mt-1 text-xs">
                    {booking.preferredDateText || "Date not provided"}
                    {" · "}
                    {booking.preferredTimeText || "Time not provided"}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="min-w-60 py-4 align-top">
                  <BookingStatusForm bookingId={booking.id} notes={booking.notes} status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
