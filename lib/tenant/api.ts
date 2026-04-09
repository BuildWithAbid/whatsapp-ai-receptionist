import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/config";

export async function requireApiSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.businessId) {
    return null;
  }

  return session;
}
