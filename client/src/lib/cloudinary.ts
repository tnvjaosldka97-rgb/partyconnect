/**
 * Cloudinary Image Upload Utility
 * 
 * This uses Cloudinary's unsigned upload preset for client-side uploads.
 * No API keys needed in the client code.
 */

const CLOUDINARY_CLOUD_NAME = "demo"; // Will be replaced with actual cloud name
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // Will be replaced with actual preset

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to Cloudinary
 * @param file - Image file to upload
 * @returns Upload result with URL or error
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    formData.append("folder", "partybear"); // Organize uploads in folder

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url, // HTTPS URL
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of image files
 * @returns Array of upload results
 */
export async function uploadMultipleToCloudinary(
  files: File[]
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
}

/**
 * Get optimized image URL from Cloudinary
 * @param url - Original Cloudinary URL
 * @param width - Target width
 * @param quality - Image quality (1-100)
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  quality: number = 80
): string {
  if (!url.includes("cloudinary.com")) {
    return url; // Not a Cloudinary URL
  }

  // Insert transformation parameters
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/w_${width},q_${quality},f_auto/${parts[1]}`;
}

