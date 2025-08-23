import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth"; // central auth options
import { prisma } from "../../../lib/prisma"; // shared client

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        mobile: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { name, image, mobile, bio, githubUrl, linkedinUrl } = body;
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        image,
        mobile,
        bio,
        githubUrl,
        linkedinUrl,
      },
      select: {
        name: true,
        email: true,
        image: true,
        mobile: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 