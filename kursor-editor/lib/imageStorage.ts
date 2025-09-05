import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Store images in public/uploads directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars');

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function saveImageToDisk(base64Data: string, userId: string): Promise<ImageUploadResult> {
  try {
    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Parse base64 data
    const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return { success: false, error: 'Invalid image format' };
    }

    const fileExtension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');

    // Check file size (should be under 1MB for optimized images)
    if (imageBuffer.length > 1024 * 1024) {
      return { success: false, error: 'Image too large after compression' };
    }

    // Generate filename with hash to prevent conflicts
    const hash = crypto.createHash('md5').update(imageBuffer).digest('hex');
    const filename = `${userId}_${hash}.${fileExtension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Save file
    await writeFile(filepath, imageBuffer);

    // Return public URL
    const publicUrl = `/uploads/avatars/${filename}`;
    return { success: true, url: publicUrl };

  } catch (error) {
    console.error('Error saving image:', error);
    return { success: false, error: 'Failed to save image' };
  }
}

export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=random&format=png`;
}
