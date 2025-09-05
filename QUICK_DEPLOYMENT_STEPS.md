# Quick Deployment Steps - Header Size Fix

## Immediate Steps:

1. **Deploy the code changes**

   ```bash
   git add .
   git commit -m "Fix: Resolve REQUEST_HEADER_TOO_LARGE error by implementing file-based image storage"
   git push
   ```

2. **Test the fix**

   - Try uploading a profile picture
   - Verify it compresses to <150KB
   - Check that no header size errors occur

3. **Optional: Migrate existing images**
   ```bash
   cd kursor-editor
   npx ts-node scripts/migrate-images.ts
   ```

## What to Expect:

### ✅ Fixed Issues:

- No more `REQUEST_HEADER_TOO_LARGE` (494) errors
- Profile pictures work with images up to 2MB
- Faster page loads (smaller cookies)
- Better performance overall

### 🔄 Changes Users Will Notice:

- Profile pictures are now square (300x300px)
- Slightly more aggressive compression for smaller file sizes
- Upload limit reduced from 5MB to 2MB (but images compress better)

### 🚨 If Issues Occur:

- Check Vercel logs for any file storage issues
- Ensure `/public/uploads/avatars/` directory permissions are correct
- Users with very large sessions may be redirected to login once (cookies cleared)

## Rollback Plan:

If critical issues arise, temporarily revert these files:

- `lib/auth.ts` - restore image in JWT tokens
- `middleware.ts` - reduce header size threshold to 16KB

The fix is designed to be backward compatible, so existing users won't lose their profile pictures.
