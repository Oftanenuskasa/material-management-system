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
          console.log("=".repeat(60));
          console.log("🔐 AUTHORIZATION ATTEMPT");
          console.log("=".repeat(60));
          console.log("Email:", credentials?.email);
          console.log("Password provided:", credentials?.password ? "[HIDDEN]" : "MISSING");
          
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ ERROR: Missing email or password");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.log(`❌ ERROR: User not found: ${credentials.email}`);
            return null;
          }

          console.log(`✅ User found: ${user.email}`);
          console.log(`   Name: ${user.name}`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Active: ${user.isActive}`);
          console.log(`   Password hash: ${user.password.substring(0, 30)}...`);
          console.log(`   Password hash length: ${user.password.length}`);

          if (!user.isActive) {
            console.log(`❌ ERROR: User is not active`);
            return null;
          }

          console.log(`\n🔑 PASSWORD VERIFICATION`);
          console.log(`Input password length: ${credentials.password.length}`);
          console.log(`Stored hash length: ${user.password.length}`);
          
          // CRITICAL: Add timeout and detailed logging
          const passwordCheckStart = Date.now();
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          const passwordCheckTime = Date.now() - passwordCheckStart;
          
          console.log(`Password check took: ${passwordCheckTime}ms`);
          console.log(`Password valid: ${isValidPassword}`);
          
          // Additional debug: Try to hash the input and compare
          if (!isValidPassword) {
            console.log(`\n⚠️ DEBUG: Creating new hash for comparison`);
            const testHash = await bcrypt.hash(credentials.password, 10);
            console.log(`Test hash: ${testHash.substring(0, 30)}...`);
            console.log(`Stored hash: ${user.password.substring(0, 30)}...`);
            console.log(`Hashes match? ${testHash === user.password}`);
          }

          if (!isValidPassword) {
            console.log(`❌ ERROR: Invalid password`);
            return null;
          }

          console.log(`\n✅ AUTHENTICATION SUCCESSFUL!`);
          console.log(`User: ${user.email} (${user.role})`);
          console.log("=".repeat(60) + "\n");
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "USER"
          };
        } catch (error) {
          console.error("❌ AUTHORIZE ERROR:", error.message);
          console.error("Stack:", error.stack);
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
  debug: true  // Enable debug mode
};

// Create the handler
const handler = NextAuth(authOptions);

// Export both the handler and authOptions
export { handler as GET, handler as POST };
// Export authOptions for use in other files
export { authOptions };
