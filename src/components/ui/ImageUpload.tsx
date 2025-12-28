import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImageToCloudinary, generateCloudinaryUrl } from '@/lib/cloudinary';
import { toast } from 'sonner';
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Camera,
  FileImage,
  Trash2,
  Eye,
  Download,
  RotateCcw,
  Crop,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload?: (imageUrl: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  folder?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  multiple?: boolean;
  onMultipleUpload?: (imageUrls: string[]) => void;
  showPreview?: boolean;
  showTransformations?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  folder = 'humsj',
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
  multiple = false,
  onMultipleUpload,
  showPreview = true,
  showTransformations = false,
  disabled = false,
  placeholder = 'Click to upload image or drag and drop'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (disabled) return;

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (multiple && onMultipleUpload) {
        const uploadPromises = validFiles.map(async (file, index) => {
          const imageUrl = await uploadImageToCloudinary(file, folder);
          setUploadProgress(((index + 1) / validFiles.length) * 100);
          return imageUrl;
        });

        const imageUrls = await Promise.all(uploadPromises);
        onMultipleUpload(imageUrls);
        setPreviewImages(imageUrls);
        toast.success(`Successfully uploaded ${imageUrls.length} images`);
      } else if (onImageUpload) {
        const imageUrl = await uploadImageToCloudinary(validFiles[0], folder);
        onImageUpload(imageUrl);
        setPreviewImages([imageUrl]);
        toast.success('Image uploaded successfully');
      } else {
        // Fallback: just set preview images
        const imageUrl = await uploadImageToCloudinary(validFiles[0], folder);
        setPreviewImages([imageUrl]);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [disabled, multiple, onMultipleUpload, onImageUpload, folder, validateFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
    }
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getTransformedImageUrl = (imageUrl: string, transformation: string) => {
    // Extract public ID from Cloudinary URL
    const publicId = imageUrl.split('/').pop()?.split('.')[0];
    if (!publicId) return imageUrl;

    switch (transformation) {
      case 'thumbnail':
        return generateCloudinaryUrl(publicId, { width: 150, height: 150, crop: 'fill' });
      case 'medium':
        return generateCloudinaryUrl(publicId, { width: 400, height: 300, crop: 'fit' });
      case 'large':
        return generateCloudinaryUrl(publicId, { width: 800, height: 600, crop: 'fit' });
      case 'square':
        return generateCloudinaryUrl(publicId, { width: 300, height: 300, crop: 'fill', gravity: 'face' });
      case 'rounded':
        return generateCloudinaryUrl(publicId, { width: 200, height: 200, crop: 'fill', radius: 'max' });
      default:
        return imageUrl;
    }
  };

  const displayImage = currentImage || previewImages[0];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer',
          dragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border hover:border-primary/50 hover:bg-secondary/30',
          disabled && 'opacity-50 cursor-not-allowed',
          isUploading && 'pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 size={32} className="text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading...</p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
              {dragActive ? (
                <Download size={32} className="text-primary animate-bounce" />
              ) : (
                <Upload size={32} className="text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {dragActive ? 'Drop files here' : placeholder}
              </p>
              <p className="text-xs text-muted-foreground">
                {multiple ? 'Multiple files supported' : 'Single file only'} • Max {maxSize}MB • {acceptedFormats.map(format => format.split('/')[1]).join(', ').toUpperCase()}
              </p>
            </div>
            <Button variant="outline" size="sm" disabled={disabled}>
              <Camera size={16} className="mr-2" />
              Choose {multiple ? 'Files' : 'File'}
            </Button>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {showPreview && displayImage && (
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={displayImage}
              alt="Uploaded image"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg object-cover"
              style={{ maxHeight: '300px' }}
            />
            
            {/* Image Actions Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(displayImage, '_blank');
                  }}
                >
                  <Eye size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = displayImage;
                    link.download = 'image';
                    link.click();
                  }}
                >
                  <Download size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Transformations */}
          {showTransformations && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Palette size={16} />
                Image Transformations
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'thumbnail', label: 'Thumbnail', icon: Crop },
                  { key: 'medium', label: 'Medium', icon: ImageIcon },
                  { key: 'large', label: 'Large', icon: ImageIcon },
                  { key: 'square', label: 'Square', icon: Crop },
                  { key: 'rounded', label: 'Rounded', icon: RotateCcw },
                ].map((transform) => (
                  <div key={transform.key} className="space-y-2">
                    <p className="text-xs font-medium flex items-center gap-1">
                      <transform.icon size={12} />
                      {transform.label}
                    </p>
                    <img
                      src={getTransformedImageUrl(displayImage, transform.key)}
                      alt={`${transform.label} preview`}
                      className="w-full h-20 object-cover rounded-lg border border-border cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onImageUpload && onImageUpload(getTransformedImageUrl(displayImage, transform.key))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Multiple Images Preview */}
      {multiple && previewImages.length > 1 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploaded Images ({previewImages.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previewImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const newImages = previewImages.filter((_, i) => i !== index);
                    setPreviewImages(newImages);
                    if (onMultipleUpload) {
                      onMultipleUpload(newImages);
                    }
                  }}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}