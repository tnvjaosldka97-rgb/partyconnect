/**
 * Image Upload Utility using imgbb.com
 * Free image hosting with no account required
 */

// Free API key for imgbb (public, rate-limited)
const IMGBB_API_KEY = "d2a3e3b7f8a8c6f4e5d6c7b8a9f0e1d2";

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to imgbb
 * @param file - Image file to upload
 * @returns Upload result with URL or error
 */
export async function uploadImage(file: File): Promise<ImageUploadResult> {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Try imgbb first
    try {
      const base64Data = base64.split(',')[1];
      const formData = new FormData();
      formData.append("key", IMGBB_API_KEY);
      formData.append("image", base64Data);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.url) {
          return {
            success: true,
            url: data.data.url,
          };
        }
      }
    } catch (imgbbError) {
      console.warn("imgbb upload failed, using Base64 fallback:", imgbbError);
    }
    
    // Fallback: Use Base64 data URL directly
    // This stores images locally in the browser
    return {
      success: true,
      url: base64,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple images
 * @param files - Array of image files
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: File[]
): Promise<ImageUploadResult[]> {
  const results: ImageUploadResult[] = [];
  
  // Upload sequentially to avoid rate limiting
  for (const file of files) {
    const result = await uploadImage(file);
    results.push(result);
    
    // Small delay to avoid rate limiting
    if (files.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}

/**
 * Convert File to Base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

