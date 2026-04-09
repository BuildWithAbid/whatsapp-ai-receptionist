import { env } from "@/lib/env";
import { getRequestIp } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { logger } from "@/lib/logging/logger";
import { checkRateLimit } from "@/lib/rate-limit/memory";
import { applyWhatsAppStatusUpdates, processInboundWhatsAppMessage } from "@/lib/services/receptionist-service";
import { normalizeWhatsAppMessages, verifyWhatsAppSignature } from "@/lib/whatsapp/webhook";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const verifyToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode !== "subscribe" || verifyToken !== env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || !challenge) {
    return jsonError("Webhook verification failed.", 403);
  }

  return new Response(challenge, {
    status: 200,
  });
}

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const rateLimit = checkRateLimit({
    key: `webhook:${ip}`,
    max: env.RATE_LIMIT_MAX_WEBHOOK_EVENTS,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.success) {
    return jsonError("Too many webhook requests.", 429);
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWhatsAppSignature(rawBody, signature)) {
    return jsonError("Invalid webhook signature.", 401);
  }

  try {
    const payload = JSON.parse(rawBody);
    const { messages, statusUpdates } = normalizeWhatsAppMessages(payload);

    if (statusUpdates.length) {
      await applyWhatsAppStatusUpdates(statusUpdates);
    }

    for (const message of messages) {
      await processInboundWhatsAppMessage(message);
    }

    return jsonOk({ received: true });
  } catch (error) {
    logger.error({ error }, "Failed to process WhatsApp webhook.");
    return jsonError("Webhook payload could not be processed.", 400);
  }
}
