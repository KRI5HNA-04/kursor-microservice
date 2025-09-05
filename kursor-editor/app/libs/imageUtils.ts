// Utility function to compress images on the client side
export const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      // For profile pictures, we want square images
      const targetSize = Math.min(maxWidth, Math.min(width, height));
      
      // Calculate crop dimensions for center square crop
      const cropSize = Math.min(width, height);
      const cropX = (width - cropSize) / 2;
      const cropY = (height - cropSize) / 2;
      
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      // Draw cropped and resized image
      ctx?.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, targetSize, targetSize);
      
      // Try different quality levels to ensure small file size
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // If still too large, reduce quality further
      let currentQuality = quality;
      while (compressedDataUrl.length > 200000 && currentQuality > 0.3) { // ~150KB base64 limit
        currentQuality -= 0.1;
        compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
      }
      
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    // Create object URL for the image
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
  });
};

// Utility to validate file before processing
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 2 * 1024 * 1024; // 2MB - reduced from 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 2MB. Please choose a smaller image."
    };
  }
  
  return { valid: true };
};
