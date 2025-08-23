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
        // @ts-ignore
        token.picture = (user as any).image || token.picture;
      }
      // When the client calls useSession().update(data), NextAuth passes trigger==='update'
      // and the partial session in 'session'. Use this to refresh token values like picture.
      if (trigger === "update" && session) {
        // @ts-ignore
        if (session.name) token.name = session.name as string;
        // @ts-ignore
        if (session.image) token.picture = session.image as string;
      }
      if (account?.provider === "google" && token.picture && token.picture.length > 500) {
        token.picture = `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(
          token.name || "User"
        )}`;
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
          image: (token.picture as string) || null,
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
        let image = user.image;
        if (image && image.length > 300) {
          image =
            "https://ui-avatars.com/api/?format=png&name=" +
            encodeURIComponent(user.name || "User");
        }
        return { id: user.id, name: user.name, email: user.email, image } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: { signIn: "/login", error: "/login" },
  // Enable verbose logs when NEXTAUTH_DEBUG=true (useful on Vercel)
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
