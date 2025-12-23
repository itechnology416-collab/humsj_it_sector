import { useState, useCallback } from 'react';
import { uploadImageToCloudinary, uploadMultipleImages } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface UseCloudinaryUploadOptions {
  folder?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  onSuccess?: (urls: string | string[]) => void;
  onError?: (error: Error) => void;
}

export function useCloudinaryUpload(options: UseCloudinaryUploadOptions = {}) {
  const {
    folder = 'humsj',
    maxSize = 5,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    onSuccess,
    onError
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size too large. Maximum size: ${maxSize}MB`);
      return false;
    }

    return true;
  }, [acceptedFormats, maxSize]);

  const uploadSingle = useCallback(async (file: File): Promise<string | null> => {
    if (!validateFile(file)) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadImageToCloudinary(file, folder);
      setUploadedUrls(prev => [...prev, url]);
      setUploadProgress(100);
      
      if (onSuccess) {
        onSuccess(url);
      }
      
      toast.success('Image uploaded successfully');
      return url;
    } catch (error) {
      const err = error as Error;
      console.error('Upload error:', err);
      toast.error('Failed to upload image. Please try again.');
      
      if (onError) {
        onError(err);
      }
      
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [validateFile, folder, onSuccess, onError]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<string[]> => {
    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const urls: string[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const url = await uploadImageToCloudinary(validFiles[i], folder);
        urls.push(url);
        setUploadProgress(((i + 1) / validFiles.length) * 100);
      }

      setUploadedUrls(prev => [...prev, ...urls]);
      
      if (onSuccess) {
        onSuccess(urls);
      }
      
      toast.success(`Successfully uploaded ${urls.length} images`);
      return urls;
    } catch (error) {
      const err = error as Error;
      console.error('Upload error:', err);
      toast.error('Failed to upload images. Please try again.');
      
      if (onError) {
        onError(err);
      }
      
      return [];
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [validateFile, folder, onSuccess, onError]);

  const uploadFromUrl = useCallback(async (imageUrl: string): Promise<string | null> => {
    setIsUploading(true);
    
    try {
      // Convert URL to File object
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      
      return await uploadSingle(file);
    } catch (error) {
      const err = error as Error;
      console.error('Upload from URL error:', err);
      toast.error('Failed to upload image from URL');
      
      if (onError) {
        onError(err);
      }
      
      return null;
    }
  }, [uploadSingle, onError]);

  const reset = useCallback(() => {
    setUploadedUrls([]);
    setUploadProgress(0);
    setIsUploading(false);
  }, []);

  return {
    // State
    isUploading,
    uploadProgress,
    uploadedUrls,
    
    // Actions
    uploadSingle,
    uploadMultiple,
    uploadFromUrl,
    reset,
    
    // Utilities
    validateFile
  };
}