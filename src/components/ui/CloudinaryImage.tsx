import { useState } from 'react';
import { generateCloudinaryUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import { ImageIcon, Loader2 } from 'lucide-react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit' | 'mfit' | 'mpad';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'gif';
  gravity?: 'auto' | 'face' | 'faces' | 'center' | 'north' | 'south' | 'east' | 'west';
  radius?: number | 'max';
  effect?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: boolean;
  blur?: boolean;
  grayscale?: boolean;
  sepia?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  crop = 'fill',
  quality = 'auto',
  format = 'auto',
  gravity = 'auto',
  radius,
  effect,
  className = '',
  loading = 'lazy',
  placeholder = true,
  blur = false,
  grayscale = false,
  sepia = false,
  onClick,
  onLoad,
  onError
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract public ID from Cloudinary URL or use src as is
  const getPublicId = (url: string): string => {
    if (url.includes('cloudinary.com')) {
      const parts = url.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
        return parts.slice(uploadIndex + 2).join('/').split('.')[0];
      }
    }
    return url;
  };

  const publicId = getPublicId(src);

  // Build transformations
  const transformations: any = {};
  
  if (width) transformations.width = width;
  if (height) transformations.height = height;
  if (crop) transformations.crop = crop;
  if (quality) transformations.quality = quality;
  if (format) transformations.format = format;
  if (gravity) transformations.gravity = gravity;
  if (radius) transformations.radius = radius;

  // Add effects
  const effects: string[] = [];
  if (effect) effects.push(effect);
  if (blur) effects.push('blur:300');
  if (grayscale) effects.push('grayscale');
  if (sepia) effects.push('sepia');
  
  if (effects.length > 0) {
    transformations.effect = effects.join(':');
  }

  // Generate optimized URL
  const optimizedUrl = src.includes('cloudinary.com') 
    ? generateCloudinaryUrl(publicId, transformations)
    : src;

  // Generate placeholder URL (low quality, blurred version)
  const placeholderUrl = src.includes('cloudinary.com')
    ? generateCloudinaryUrl(publicId, {
        ...transformations,
        quality: 10,
        effect: 'blur:1000',
        width: Math.min(width || 50, 50),
        height: Math.min(height || 50, 50)
      })
    : src;

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-secondary rounded-lg border border-border',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center space-y-2">
          <ImageIcon size={24} className="text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)} onClick={onClick}>
      {/* Placeholder/Loading state */}
      {isLoading && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          {src.includes('cloudinary.com') ? (
            <img
              src={placeholderUrl}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <Loader2 size={24} className="text-muted-foreground animate-spin" />
          )}
        </div>
      )}

      {/* Main image */}
      <img
        src={optimizedUrl}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          onClick && 'cursor-pointer hover:scale-105 transition-transform duration-300'
        )}
        style={{ width, height }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 size={20} className="text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}

// Preset components for common use cases
export function CloudinaryAvatar({ src, alt, size = 40, ...props }: CloudinaryImageProps & { size?: number }) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      crop="fill"
      gravity="face"
      radius="max"
      quality="auto"
      format="auto"
      className="rounded-full"
      {...props}
    />
  );
}

export function CloudinaryThumbnail({ src, alt, ...props }: CloudinaryImageProps) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      crop="fill"
      quality="auto"
      format="auto"
      className="rounded-lg"
      {...props}
    />
  );
}

export function CloudinaryHero({ src, alt, ...props }: CloudinaryImageProps) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={1200}
      height={600}
      crop="fill"
      quality="auto"
      format="auto"
      className="w-full h-full object-cover"
      {...props}
    />
  );
}