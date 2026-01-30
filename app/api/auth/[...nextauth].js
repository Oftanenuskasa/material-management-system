import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Login attempt:", credentials);
        const user = await prisma.user.findUnique({ where: { email: credentials.email }});
        console.log("Found user in DB:", user);

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log("Password valid:", isValid);

        if (!isValid) throw new Error("Invalid password");

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      console.log("JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  },
  pages: { signIn: "/auth/login" }
};

export default NextAuth(authOptions);
