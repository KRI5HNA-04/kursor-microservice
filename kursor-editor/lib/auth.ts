import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  // In some hosted environments, setting trustHost helps with callback URL generation
  // when relying on headers forwarded by the platform.
  // Safe to enable for Vercel.
  // @ts-ignore - available in recent next-auth v4
  trustHost: true,
  
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
          console.error("Google OAuth missing client ID/secret");
          return false;
        }
        if (!profile?.email) return false;
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        // @ts-ignore
        token.uid = (user as any).id;
        // NEVER store image data in JWT to avoid large tokens
        // Images will be fetched separately via API
        token.picture = null;
      }
      
      // When the client calls useSession().update(data), NextAuth passes trigger==='update'
      if (trigger === "update" && session) {
        // @ts-ignore
        if (session.name) token.name = (session.name as string).substring(0, 50); // Limit name length
        // Don't store image in token - will be fetched from API
        token.picture = null;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          // @ts-ignore
          id: (token as any).uid as string | undefined,
          name: (token.name as string) || null,
          email: (token.email as string) || null,
          image: null, // Images will be fetched separately to avoid large sessions
        } as any;
      }
      return session;
    },
  },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        // Don't include image in auth response to keep tokens small
        return { id: user.id, name: user.name, email: user.email, image: null } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60, // 15 minutes
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
      }
    }
  },
  pages: { signIn: "/login", error: "/login" },
  // Enable verbose logs when NEXTAUTH_DEBUG=true (useful on Vercel)
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
