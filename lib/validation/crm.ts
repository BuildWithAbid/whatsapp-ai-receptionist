import { z } from "zod";

export const updateLeadSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const updateBookingSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "CLOSED"]),
  notes: z.string().max(2000).optional().or(z.literal("")),
});
