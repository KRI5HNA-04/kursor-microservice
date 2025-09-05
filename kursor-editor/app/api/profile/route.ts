import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth"; // central auth options
import { prisma } from "../../../lib/prisma"; // shared client
import { saveImageToDisk } from "../../../lib/imageStorage";

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
    
    let finalImageUrl = null;
    
    // Handle image if provided
    if (image) {
      // Check if it's a valid data URL
      if (!image.startsWith('data:image/')) {
        return NextResponse.json({ 
          error: "Invalid image format. Only base64 image data URLs are allowed." 
        }, { status: 400 });
      }
      
      // Check image size (base64 encoded)
      const maxBase64Size = 300000; // ~225KB in base64 (much smaller than before)
      if (image.length > maxBase64Size) {
        return NextResponse.json({ 
          error: "Image too large. Please compress the image further." 
        }, { status: 400 });
      }
      
      // Validate image type from data URL
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const typeMatch = image.match(/^data:(.*?);base64,/);
      if (!typeMatch || !validTypes.includes(typeMatch[1])) {
        return NextResponse.json({ 
          error: "Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed." 
        }, { status: 400 });
      }

      // Get user ID for image storage
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Save image to disk instead of database
      const imageResult = await saveImageToDisk(image, currentUser.id);
      if (!imageResult.success) {
        return NextResponse.json({ 
          error: imageResult.error || "Failed to save image" 
        }, { status: 400 });
      }

      finalImageUrl = imageResult.url;
    }
    
    // Validate other fields
    if (name && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json({ 
        error: "Name must be a string with maximum 100 characters." 
      }, { status: 400 });
    }
    
    if (mobile && (typeof mobile !== 'string' || mobile.length > 20)) {
      return NextResponse.json({ 
        error: "Mobile must be a string with maximum 20 characters." 
      }, { status: 400 });
    }
    
    if (bio && (typeof bio !== 'string' || bio.length > 500)) {
      return NextResponse.json({ 
        error: "Bio must be a string with maximum 500 characters." 
      }, { status: 400 });
    }
    
    // Prepare update data - only include image if we have a new one
    const updateData: any = {
      name,
      mobile,
      bio,
      githubUrl,
      linkedinUrl,
    };

    if (finalImageUrl) {
      updateData.image = finalImageUrl;
    }
    
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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
    console.error('Profile update error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 