import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    const name = session?.user?.name || "User";
    const serveBuffer = (buf: Buffer, contentType = "image/png") =>
      new Response(new Uint8Array(buf), {
        status: 200,
        headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
      });
    const fetchAndStream = async (url: string) => {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return null;
      const ct = r.headers.get("content-type") || "image/png";
      const ab = await r.arrayBuffer();
      return serveBuffer(Buffer.from(ab), ct);
    };
    if (!session?.user?.email) {
      // Unauthenticated: stream a generic avatar
      const url = `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(
        name
      )}`;
      const res = await fetchAndStream(url);
      return res || new NextResponse("", { status: 204 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { image: true, name: true },
    });
    const displayName = user?.name || name;
    const fallback = `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(
      displayName
    )}`;
    const img = user?.image;
    if (!img) {
      const res = await fetchAndStream(fallback);
      return res || new NextResponse("", { status: 204 });
    }

    if (img.startsWith("data:image")) {
      // data URL: data:<type>;base64,<payload>
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
    return new NextResponse("", { status: 204 });
  }
}
