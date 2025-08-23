import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // default client

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  // Only return true if user exists and has a password set
  return NextResponse.json({ exists: !!(user && user.password) });
} 