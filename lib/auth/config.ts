import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { verifyPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/rate-limit/memory";
import { signInSchema } from "@/lib/validation/auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const rateLimit = checkRateLimit({
          key: `signin:${parsed.data.email.toLowerCase()}`,
          max: env.RATE_LIMIT_MAX_AUTH_ATTEMPTS,
          windowMs: env.RATE_LIMIT_WINDOW_MS,
        });

        if (!rateLimit.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: {
            business: true,
          },
        });

        if (!user?.business) {
          return null;
        }

        const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.business.name,
          businessId: user.business.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.businessId) {
        token.businessId = user.businessId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub && token.businessId) {
        session.user.id = token.sub;
        session.user.businessId = token.businessId;
      }

      return session;
    },
  },
};
