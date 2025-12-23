import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { uploadVideoToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';
import {
  Upload,
  X,
  Video,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  FileVideo,
  Trash2,
  Eye,
  Download,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  onVideoUpload?: (videoUrl: string) => void;
  onVideoRemove?: () => void;
  currentVideo?: string;
  folder?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  multiple?: boolean;
  onMultipleUpload?: (videoUrls: string[]) => void;
  showPreview?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function VideoUpload({
  onVideoUpload,
  onVideoRemove,
  currentVideo,
  folder = 'humsj/videos',
  maxSize = 100, // 100MB default for videos
  acceptedFormats = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/mkv'],
  className = '',
  multiple = false,
  onMultipleUpload,
  showPreview = true,
  disabled = false,
  placeholder = 'Click to upload video or drag and drop'
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
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
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (disabled) return;

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (multiple && onMultipleUpload) {
        const uploadPromises = validFiles.map(async (file, index) => {
          const videoUrl = await uploadVideoToCloudinary(file, folder);
          setUploadProgress(((index + 1) / validFiles.length) * 100);
          return videoUrl;
        });

        const videoUrls = await Promise.all(uploadPromises);
        onMultipleUpload(videoUrls);
        setPreviewVideos(videoUrls);
        toast.success(`Successfully uploaded ${videoUrls.length} videos`);
      } else if (onVideoUpload) {
        const videoUrl = await uploadVideoToCloudinary(validFiles[0], folder);
        onVideoUpload(videoUrl);
        setPreviewVideos([videoUrl]);
        toast.success('Video uploaded successfully');
      } else {
        // Fallback: just set preview videos
        const videoUrl = await uploadVideoToCloudinary(validFiles[0], folder);
        setPreviewVideos([videoUrl]);
        toast.success('Video uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [disabled, multiple, onMultipleUpload, onVideoUpload, folder, maxSize, acceptedFormats]);

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

  const handleRemoveVideo = () => {
    if (onVideoRemove) {
      onVideoRemove();
    }
    setPreviewVideos([]);
    setPlayingVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleVideoPlay = (videoUrl: string) => {
    if (playingVideo === videoUrl) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(videoUrl);
    }
  };

  const toggleVideoMute = (videoUrl: string) => {
    const newMutedVideos = new Set(mutedVideos);
    if (mutedVideos.has(videoUrl)) {
      newMutedVideos.delete(videoUrl);
    } else {
      newMutedVideos.add(videoUrl);
    }
    setMutedVideos(newMutedVideos);
  };

  const displayVideo = currentVideo || previewVideos[0];

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
              <p className="text-sm font-medium">Uploading video...</p>
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
                <Video size={32} className="text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {dragActive ? 'Drop videos here' : placeholder}
              </p>
              <p className="text-xs text-muted-foreground">
                {multiple ? 'Multiple videos supported' : 'Single video only'} • Max {maxSize}MB • {acceptedFormats.map(format => format.split('/')[1]).join(', ').toUpperCase()}
              </p>
            </div>
            <Button variant="outline" size="sm" disabled={disabled}>
              <Film size={16} className="mr-2" />
              Choose {multiple ? 'Videos' : 'Video'}
            </Button>
          </div>
        )}
      </div>

      {/* Video Preview */}
      {showPreview && displayVideo && (
        <div className="space-y-4">
          <div className="relative group bg-black rounded-xl overflow-hidden">
            <video
              src={displayVideo}
              className="w-full max-h-96 object-contain"
              controls={playingVideo === displayVideo}
              muted={mutedVideos.has(displayVideo)}
              autoPlay={playingVideo === displayVideo}
              onEnded={() => setPlayingVideo(null)}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoPlay(displayVideo);
                  }}
                >
                  {playingVideo === displayVideo ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoMute(displayVideo);
                  }}
                >
                  {mutedVideos.has(displayVideo) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(displayVideo, '_blank');
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
                    link.href = displayVideo;
                    link.download = 'video';
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
                    handleRemoveVideo();
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Videos Preview */}
      {multiple && previewVideos.length > 1 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploaded Videos ({previewVideos.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewVideos.map((videoUrl, index) => (
              <div key={index} className="relative group bg-black rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  className="w-full h-32 object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleVideoPlay(videoUrl)}
                  >
                    <Play size={14} />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const newVideos = previewVideos.filter((_, i) => i !== index);
                    setPreviewVideos(newVideos);
                    if (onMultipleUpload) {
                      onMultipleUpload(newVideos);
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