import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 8 * 60 * 60,
  },
  user: {
    additionalFields: {
      role: {
        type: [
          "ADMIN",
          "MANAGER",
          "CASHIER",
          "INVENTORY_MANAGER",
          "QC_MANAGER",
          "SUPERVISOR",
          "WORKER",
        ],
        required: true,
        defaultValue: "WORKER",
        input: false,
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
      pin: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
          });

          return user?.isActive ? { data: session } : false;
        },
      },
    },
  },
});
