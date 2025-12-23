// Cloudinary configuration for client-side uploads
export const cloudinaryConfig = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

// Upload image to Cloudinary using unsigned upload
export const uploadImageToCloudinary = async (file: File, folder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.upload_preset);
  
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Upload video to Cloudinary using unsigned upload
export const uploadVideoToCloudinary = async (file: File, folder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.upload_preset);
  formData.append('resource_type', 'video');
  
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload video');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
};

// Upload any media file (image or video)
export const uploadMediaToCloudinary = async (file: File, folder?: string): Promise<string> => {
  const isVideo = file.type.startsWith('video/');
  
  if (isVideo) {
    return uploadVideoToCloudinary(file, folder);
  } else {
    return uploadImageToCloudinary(file, folder);
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files: File[], folder?: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
  return Promise.all(uploadPromises);
};

// Generate Cloudinary URL with transformations
export const generateCloudinaryUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    gravity?: string;
    radius?: string | number;
    effect?: string;
  }
): string => {
  let url = `https://res.cloudinary.com/${cloudinaryConfig.cloud_name}/image/upload/`;
  
  if (transformations) {
    const transformParams: string[] = [];
    
    if (transformations.width) transformParams.push(`w_${transformations.width}`);
    if (transformations.height) transformParams.push(`h_${transformations.height}`);
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
    if (transformations.quality) transformParams.push(`q_${transformations.quality}`);
    if (transformations.format) transformParams.push(`f_${transformations.format}`);
    if (transformations.gravity) transformParams.push(`g_${transformations.gravity}`);
    if (transformations.radius) transformParams.push(`r_${transformations.radius}`);
    if (transformations.effect) transformParams.push(`e_${transformations.effect}`);
    
    if (transformParams.length > 0) {
      url += transformParams.join(',') + '/';
    }
  }
  
  url += publicId;
  return url;
};

// Note: Server-side operations like delete and getImageDetails 
// should be implemented in your backend API, not in the browser
// These functions are provided as examples for server-side implementation

// Delete image from Cloudinary (requires server-side implementation)
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    // This should be called from your backend API
    console.warn('deleteImageFromCloudinary should be implemented on the server side');
    return false;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

// Get image details (requires server-side implementation)
export const getImageDetails = async (publicId: string) => {
  try {
    // This should be called from your backend API
    console.warn('getImageDetails should be implemented on the server side');
    return null;
  } catch (error) {
    console.error('Error getting image details:', error);
    throw error;
  }
};