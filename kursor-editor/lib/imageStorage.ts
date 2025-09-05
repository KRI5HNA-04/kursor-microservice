import crypto from 'crypto';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// For Vercel deployment, we'll store optimized images in database
// but with much smaller sizes to avoid header issues
export async function saveImageToDisk(base64Data: string, userId: string): Promise<ImageUploadResult> {
  try {
    // Parse base64 data
    const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return { success: false, error: 'Invalid image format' };
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');

    // Check file size (should be under 200KB for optimized images)
    if (imageBuffer.length > 200 * 1024) {
      return { success: false, error: 'Image too large after compression' };
    }

    // For Vercel, we'll return the base64 data but heavily compressed
    // This is safer than trying to write files on serverless
    return { success: true, url: base64Data };

  } catch (error) {
    console.error('Error processing image:', error);
    return { success: false, error: 'Failed to process image' };
  }
}

export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=random&format=png`;
}
