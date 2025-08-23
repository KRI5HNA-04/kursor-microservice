import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // default client
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.password) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashed, image: name.charAt(0).toUpperCase() },
    create: { name, email, password: hashed, image: name.charAt(0).toUpperCase() },
  });
  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
} 