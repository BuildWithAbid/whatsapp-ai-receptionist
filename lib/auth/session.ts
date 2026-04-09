import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth/config";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireCurrentSession() {
  const session = await getCurrentSession();

  if (!session?.user?.id || !session.user.businessId) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireCurrentBusiness() {
  const session = await requireCurrentSession();

  const business = await prisma.business.findFirst({
    where: {
      id: session.user.businessId,
      ownerUserId: session.user.id,
    },
    include: {
      botSetting: true,
      faqs: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!business) {
    redirect("/sign-in");
  }

  return {
    session,
    business,
  };
}
