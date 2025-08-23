import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

// GET: Get a single saved code snippet by id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await context.params;
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
    const code = await prisma.savedCode.findFirst({
      where: { id, userId: user.id },
    });
    if (!code) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(code);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update a saved code snippet by id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await context.params;
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
    const updated = await prisma.savedCode.update({
      where: { id },
      data: { title, code, language },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Delete a saved code snippet by id
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await context.params;
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
    await prisma.savedCode.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 