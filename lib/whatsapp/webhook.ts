import crypto from "node:crypto";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/logger";
import { whatsappWebhookSchema } from "@/lib/validation/webhook";
import type { NormalizedWhatsAppMessage } from "@/types/api";

export function verifyWhatsAppSignature(rawBody: string, signatureHeader: string | null) {
  if (!env.WHATSAPP_APP_SECRET) {
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", env.WHATSAPP_APP_SECRET)
    .update(rawBody)
    .digest("hex")}`;

  try {
    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function normalizeWhatsAppMessages(payload: unknown): {
  messages: NormalizedWhatsAppMessage[];
  statusUpdates: Array<{ externalMessageId: string; status: string }>;
} {
  const parsed = whatsappWebhookSchema.parse(payload);

  const messages: NormalizedWhatsAppMessage[] = [];
  const statusUpdates: Array<{ externalMessageId: string; status: string }> = [];

  for (const entry of parsed.entry) {
    for (const change of entry.changes) {
      const phoneNumberId = change.value.metadata?.phone_number_id;

      if (change.value.statuses?.length) {
        for (const status of change.value.statuses) {
          statusUpdates.push({
            externalMessageId: status.id,
            status: status.status,
          });
        }
      }

      if (!phoneNumberId || !change.value.messages?.length) {
        continue;
      }

      const contactsByWaId = new Map(
        (change.value.contacts ?? []).map((contact) => [contact.wa_id, contact.profile.name ?? null]),
      );

      for (const message of change.value.messages) {
        const text = message.text?.body?.trim() ?? "";
        if (!text) {
          logger.warn({ type: message.type }, "Skipping unsupported inbound WhatsApp message.");
          continue;
        }

        messages.push({
          businessPhoneNumberId: phoneNumberId,
          customerPhone: message.from,
          customerName: contactsByWaId.get(message.from) ?? null,
          externalMessageId: message.id,
          messageType: message.type,
          text,
          raw: message as unknown as Record<string, unknown>,
        });
      }
    }
  }

  return {
    messages,
    statusUpdates,
  };
}
