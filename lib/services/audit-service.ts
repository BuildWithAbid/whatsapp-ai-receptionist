import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function createAuditLog({
  action,
  businessId,
  entityId,
  entityType,
  payload,
  userId,
}: {
  action: string;
  businessId?: string;
  entityId: string;
  entityType: string;
  payload?: Record<string, unknown>;
  userId?: string;
}) {
  return prisma.auditLog.create({
    data: {
      action,
      businessId,
      entityId,
      entityType,
      payload: payload as Prisma.InputJsonValue | undefined,
      userId,
    },
  });
}
