// Migration script to convert existing base64 images to files
// Run this once after deploying the new changes

import { PrismaClient } from '@prisma/client';
import { saveImageToDisk } from '../lib/imageStorage';

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('Starting image migration...');
  
  try {
    // Find all users with base64 images
    const usersWithImages = await prisma.user.findMany({
      where: {
        image: {
          startsWith: 'data:image'
        }
      },
      select: {
        id: true,
        email: true,
        image: true
      }
    });

    console.log(`Found ${usersWithImages.length} users with base64 images`);

    let migrated = 0;
    let failed = 0;

    for (const user of usersWithImages) {
      try {
        if (user.image) {
          console.log(`Migrating image for user ${user.email}...`);
          
          const result = await saveImageToDisk(user.image, user.id);
          
          if (result.success && result.url) {
            // Update user record with file path
            await prisma.user.update({
              where: { id: user.id },
              data: { image: result.url }
            });
            
            migrated++;
            console.log(`✓ Migrated ${user.email}`);
          } else {
            console.error(`✗ Failed to migrate ${user.email}: ${result.error}`);
            failed++;
          }
        }
      } catch (error) {
        console.error(`✗ Error migrating ${user.email}:`, error);
        failed++;
      }
    }

    console.log(`\nMigration complete:`);
    console.log(`✓ Migrated: ${migrated}`);
    console.log(`✗ Failed: ${failed}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
if (require.main === module) {
  migrateImages().catch(console.error);
}

export { migrateImages };
