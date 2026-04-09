"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/fetcher";
import { updateBookingSchema } from "@/lib/validation/crm";

type BookingFormInput = {
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CLOSED";
  notes?: string;
};

export function BookingStatusForm({
  bookingId,
  notes,
  status,
}: {
  bookingId: string;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CLOSED";
  notes: string | null;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<BookingFormInput>({
    resolver: zodResolver(updateBookingSchema),
    defaultValues: {
      status,
      notes: notes ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      await apiFetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Booking request updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update booking request.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Select {...form.register("status")}>
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CLOSED">Closed</option>
      </Select>
      <Textarea rows={3} placeholder="Add follow-up notes" {...form.register("notes")} />
      <Button disabled={isSaving} size="sm" type="submit">
        {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
        Save
      </Button>
    </form>
  );
}
