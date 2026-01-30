import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Define authOptions separately
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Authorization attempt for:", credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing email or password");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.log(`❌ User not found: ${credentials.email}`);
            return null;
          }

          console.log(`✅ User found: ${user.email}, Active: ${user.isActive}`);
          
          if (!user.isActive) {
            console.log(`❌ User is not active: ${credentials.email}`);
            return null;
          }

          console.log(`🔑 Verifying password for ${user.email}...`);
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log(`   Password valid: ${isValidPassword}`);
          
          if (!isValidPassword) {
            console.log(`❌ Invalid password for ${credentials.email}`);
            return null;
          }

          console.log(`✅ Authentication successful for ${user.email}`);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "USER"
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role
        };
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false
};

// Create the handler
const handler = NextAuth(authOptions);

// Export both the handler and authOptions
export { handler as GET, handler as POST };
// Export authOptions for use in other files
export { authOptions };
