import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Lazy initialization to avoid build-time database connection
let _auth: ReturnType<typeof betterAuth> | null = null;
let _prisma: PrismaClient | null = null;

function getPrisma() {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

function getAuth() {
  if (!_auth) {
    _auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET || "test-secret-key-for-development-only",
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      database: prismaAdapter(getPrisma(), {
        provider: "postgresql",
      }),
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
      },
      session: {
        expiresIn: 60 * 60 * 24,
        updateAge: 60 * 60,
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5,
        },
      },
      trustedOrigins: [
        "http://localhost:3000",
        "https://frontend-murex-eta-83.vercel.app",
        process.env.BETTER_AUTH_URL || "",
      ].filter(Boolean),
    });
  }
  return _auth;
}

// Export a proxy that lazily initializes auth
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    return getAuth()[prop as keyof ReturnType<typeof betterAuth>];
  },
});

export type Session = ReturnType<typeof betterAuth>["$Infer"]["Session"];
export type User = Session["user"];
