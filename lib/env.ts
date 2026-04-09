import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5432/whatsapp_ai_receptionist?schema=public"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().min(16).default("development-only-secret-change-me"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  WHATSAPP_ACCESS_TOKEN: z.string().optional().default(""),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().min(1).default("development-verify-token"),
  WHATSAPP_APP_SECRET: z.string().optional().default(""),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_AUTH_ATTEMPTS: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_MAX_WEBHOOK_EVENTS: z.coerce.number().int().positive().default(120),
  SEED_OWNER_EMAIL: z.string().email().default("owner@example.com"),
  SEED_OWNER_PASSWORD: z.string().min(8).default("Passw0rd!"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
  APP_BASE_URL: process.env.APP_BASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_AUTH_ATTEMPTS: process.env.RATE_LIMIT_MAX_AUTH_ATTEMPTS,
  RATE_LIMIT_MAX_WEBHOOK_EVENTS: process.env.RATE_LIMIT_MAX_WEBHOOK_EVENTS,
  SEED_OWNER_EMAIL: process.env.SEED_OWNER_EMAIL,
  SEED_OWNER_PASSWORD: process.env.SEED_OWNER_PASSWORD,
});
