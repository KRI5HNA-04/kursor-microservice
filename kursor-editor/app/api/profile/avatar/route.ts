import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { generateAvatarUrl } from "../../../../lib/imageStorage";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    const name = session?.user?.name || "User";
    
    const serveBuffer = (buf: Buffer, contentType = "image/png") =>
      new Response(new Uint8Array(buf), {
        status: 200,
        headers: { 
          "Content-Type": contentType, 
          "Cache-Control": "public, max-age=3600" // Cache for 1 hour
        },
      });
    
    const fetchAndStream = async (url: string) => {
      const r = await fetch(url, { cache: "force-cache" });
      if (!r.ok) return null;
      const ct = r.headers.get("content-type") || "image/png";
      const ab = await r.arrayBuffer();
      return serveBuffer(Buffer.from(ab), ct);
    };
    
    if (!session?.user?.email) {
      // Unauthenticated: stream a generic avatar
      const url = generateAvatarUrl(name);
      const res = await fetchAndStream(url);
      return res || new NextResponse("", { status: 204 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { image: true, name: true },
    });
    
    const displayName = user?.name || name;
    const fallback = generateAvatarUrl(displayName);
    const img = user?.image;
    
    if (!img) {
      const res = await fetchAndStream(fallback);
      return res || new NextResponse("", { status: 204 });
    }

    // Handle file path (new format)
    if (img.startsWith('/uploads/avatars/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', img);
        const buffer = await readFile(filePath);
        const contentType = img.endsWith('.jpg') || img.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
        return serveBuffer(buffer, contentType);
      } catch (error) {
        console.error('Error reading avatar file:', error);
        // Fallback to generated avatar
        const res = await fetchAndStream(fallback);
        return res || new NextResponse("", { status: 204 });
      }
    }

    // Handle legacy base64 format (for existing users)
    if (img.startsWith("data:image")) {
      const match = img.match(/^data:(.*?);base64,(.*)$/);
      if (!match) {
        const res = await fetchAndStream(fallback);
        return res || new NextResponse("", { status: 204 });
      }
      const contentType = match[1] || "image/png";
      const base64 = match[2];
      const buffer = Buffer.from(base64, "base64");
      return serveBuffer(buffer, contentType);
    }

    if (img.startsWith("http://") || img.startsWith("https://")) {
      const res = await fetchAndStream(img);
      if (res) return res;
      const fb = await fetchAndStream(fallback);
      return fb || new NextResponse("", { status: 204 });
    }

    // Unknown format; fallback
    const res = await fetchAndStream(fallback);
    return res || new NextResponse("", { status: 204 });
  } catch (e) {
    console.error('Avatar API error:', e);
    return new NextResponse("", { status: 204 });
  }
}
