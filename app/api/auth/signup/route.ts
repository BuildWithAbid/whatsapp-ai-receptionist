import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { hashPassword } from "@/lib/auth/password";
import { getRequestIp, parseJsonBody } from "@/lib/http/request";
import { jsonError, jsonOk } from "@/lib/http/response";
import { logger } from "@/lib/logging/logger";
import { checkRateLimit } from "@/lib/rate-limit/memory";
import { createAuditLog } from "@/lib/services/audit-service";
import { signUpSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const rateLimit = checkRateLimit({
    key: `signup:${ip}`,
    max: env.RATE_LIMIT_MAX_AUTH_ATTEMPTS,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.success) {
    return jsonError("Too many sign-up attempts. Please wait and try again.", 429);
  }

  try {
    const body = await parseJsonBody(request);
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Invalid sign-up payload.", 422, {
        issues: parsed.error.flatten(),
      });
    }

    const email = parsed.data.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return jsonError("An account already exists for that email.", 409);
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const { business, user } = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          name: parsed.data.name,
          passwordHash,
        },
      });

      const createdBusiness = await tx.business.create({
        data: {
          ownerUserId: createdUser.id,
          name: parsed.data.businessName,
          category: parsed.data.businessCategory,
          timezone: parsed.data.timezone,
          botSetting: {
            create: {
              escalationMessage:
                "Thanks for reaching out. A team member will follow up shortly with the right details.",
              toneOfVoice: "Professional, warm, and concise",
            },
          },
        },
      });

      return {
        business: createdBusiness,
        user: createdUser,
      };
    });

    await createAuditLog({
      action: "workspace.created",
      businessId: business.id,
      entityId: business.id,
      entityType: "business",
      payload: {
        category: business.category,
        ownerEmail: user.email,
      },
      userId: user.id,
    });

    return jsonOk({
      ok: true,
      businessId: business.id,
      email: user.email,
    });
  } catch (error) {
    logger.error({ error }, "Failed to sign up new workspace.");
    return jsonError("We could not create the account. Please try again.", 500);
  }
}
