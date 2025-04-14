import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import Naver from "next-auth/providers/naver";
import { db } from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Role } from "./db/schemas";
import { users } from "./db/schemas/auth";
import { eq } from "drizzle-orm";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      role: Role;
    };
  }
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "InvalidCredentials";
}
class UserNotFoundError extends CredentialsSignin {
  code = "UserNotFound";
}

// import { hashPassword } from "@/lib/utils/hashPassword";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = null;

        // return user object with their profile data
        return user;
      },
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as Role;
      return session;
    },
    async jwt({ token, user, session, trigger }) {
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.id, token.sub as string));

      token.role = foundUser[0].role;

      return token;
    },
  },
});
