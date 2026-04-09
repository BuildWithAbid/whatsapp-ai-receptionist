import pino from "pino";

import { env } from "@/lib/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.x-hub-signature-256",
      "whatsappAccessToken",
      "openAiApiKey",
      "payload.messages",
    ],
    censor: "[REDACTED]",
  },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});
