import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

// GET: List all saved codes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const codes = await prisma.savedCode.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(codes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create a new saved code snippet
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { title, code, language } = await request.json();
    if (!title || !code || !language) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const saved = await prisma.savedCode.create({
      data: {
        userId: user.id,
        title,
        code,
        language,
      },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 