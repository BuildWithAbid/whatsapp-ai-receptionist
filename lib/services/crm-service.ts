import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/services/audit-service";

export async function updateLeadStatus({
  businessId,
  leadId,
  notes,
  status,
  userId,
}: {
  businessId: string;
  leadId: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  notes?: string;
  userId: string;
}) {
  const existingLead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      businessId,
    },
    select: { id: true },
  });

  if (!existingLead) {
    throw new Error("Lead not found.");
  }

  const lead = await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status,
      notes: notes || null,
    },
  });

  await createAuditLog({
    action: "lead.updated",
    businessId,
    entityId: lead.id,
    entityType: "lead",
    payload: {
      status,
      notes,
    },
    userId,
  });

  return lead;
}

export async function updateBookingStatus({
  bookingId,
  businessId,
  notes,
  status,
  userId,
}: {
  bookingId: string;
  businessId: string;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CLOSED";
  notes?: string;
  userId: string;
}) {
  const existingBooking = await prisma.bookingRequest.findFirst({
    where: {
      id: bookingId,
      businessId,
    },
    select: { id: true },
  });

  if (!existingBooking) {
    throw new Error("Booking request not found.");
  }

  const booking = await prisma.bookingRequest.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
      notes: notes || null,
    },
  });

  await createAuditLog({
    action: "booking.updated",
    businessId,
    entityId: booking.id,
    entityType: "bookingRequest",
    payload: {
      status,
      notes,
    },
    userId,
  });

  return booking;
}
