import { env } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

export async function sendWhatsAppTextMessage({
  phoneNumberId,
  recipientPhone,
  text,
}: {
  phoneNumberId: string;
  recipientPhone: string;
  text: string;
}) {
  if (!env.WHATSAPP_ACCESS_TOKEN) {
    logger.warn("WHATSAPP_ACCESS_TOKEN is not configured. Skipping outbound send.");
    return {
      ok: false,
      messageId: null,
      error: "Missing WhatsApp access token.",
    };
  }

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipientPhone,
      type: "text",
      text: {
        preview_url: false,
        body: text,
      },
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    logger.error({ payload, status: response.status }, "WhatsApp send failed.");
    return {
      ok: false,
      messageId: null,
      error: payload,
    };
  }

  const payload = (await response.json()) as {
    messages?: Array<{ id: string }>;
  };

  return {
    ok: true,
    messageId: payload.messages?.[0]?.id ?? null,
    error: null,
  };
}
