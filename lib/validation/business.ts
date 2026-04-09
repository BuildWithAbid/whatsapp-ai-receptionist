import { z } from "zod";

export const businessProfileSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(80),
  timezone: z.string().min(2).max(64),
  phoneNumber: z.string().max(40).optional().or(z.literal("")),
  location: z.string().max(255).optional().or(z.literal("")),
});

export const whatsappConfigSchema = z.object({
  whatsappPhoneNumberId: z.string().max(80).optional().or(z.literal("")),
  whatsappBusinessAccountId: z.string().max(80).optional().or(z.literal("")),
  whatsappDisplayPhone: z.string().max(40).optional().or(z.literal("")),
});

export const botSettingSchema = z.object({
  openingHours: z.string().max(3000).optional().or(z.literal("")),
  servicesOffered: z.string().max(5000).optional().or(z.literal("")),
  pricingNotes: z.string().max(3000).optional().or(z.literal("")),
  toneOfVoice: z.string().max(160).optional().or(z.literal("")),
  escalationMessage: z.string().min(10).max(500),
  leadCaptureEnabled: z.boolean(),
  bookingCaptureEnabled: z.boolean(),
  autoReplyEnabled: z.boolean(),
});

export const faqSchema = z.object({
  id: z.string().cuid().optional(),
  question: z.string().min(5).max(300),
  answer: z.string().min(5).max(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
export type WhatsAppConfigInput = z.infer<typeof whatsappConfigSchema>;
export type BotSettingInput = z.infer<typeof botSettingSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
