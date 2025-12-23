import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/ImageUpload';
import CloudinaryImage, { CloudinaryAvatar, CloudinaryThumbnail } from '@/components/ui/CloudinaryImage';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Upload,
  Image as ImageIcon,
  Users,
  Camera,
  Palette,
  Settings,
  Download,
  Share2,
  Heart,
  Eye
} from 'lucide-react';

export default function CloudinaryExample() {
  const [profileImage, setProfileImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [eventImages, setEventImages] = useState<string[]>([]);

  const profileUpload = useCloudinaryUpload({
    folder: 'humsj/profiles',
    maxSize: 2,
    onSuccess: (url) => {
      if (typeof url === 'string') {
        setProfileImage(url);
        toast.success('Profile image updated successfully!');
      }
    }
  });

  const galleryUpload = useCloudinaryUpload({
    folder: 'humsj/gallery',
    maxSize: 10,
    onSuccess: (urls) => {
      if (Array.isArray(urls)) {
        setGalleryImages(prev => [...prev, ...urls]);
        toast.success(`Added ${urls.length} images to gallery!`);
      }
    }
  });

  const eventUpload = useCloudinaryUpload({
    folder: 'humsj/events',
    maxSize: 5,
    onSuccess: (urls) => {
      if (Array.isArray(urls)) {
        setEventImages(prev => [...prev, ...urls]);
        toast.success(`Added ${urls.length} event images!`);
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2">
          <Camera size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">Cloudinary Integration</span>
        </div>
        <h1 className="text-4xl font-display tracking-wide">
          HUMSJ <span className="text-primary">Media Management</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful image upload and management system powered by Cloudinary
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Users size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Camera size={16} />
            Events
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings size={16} />
            Features
          </TabsTrigger>
        </TabsList>

        {/* Profile Image Upload */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Profile Image Management
              </CardTitle>
              <CardDescription>
                Upload and manage your profile picture with automatic optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upload New Profile Image</h3>
                  <ImageUpload
                    onImageUpload={setProfileImage}
                    currentImage={profileImage}
                    folder="humsj/profiles"
                    maxSize={2}
                    showTransformations={true}
                    placeholder="Upload your profile picture"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Profile</h3>
                  {profileImage ? (
                    <div className="space-y-4">
                      <CloudinaryAvatar
                        src={profileImage}
                        alt="Profile"
                        size={120}
                        className="mx-auto"
                      />
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Automatically optimized and resized
                        </p>
                        <div className="flex justify-center gap-2">
                          <Badge variant="secondary">WebP Format</Badge>
                          <Badge variant="secondary">Face Detection</Badge>
                          <Badge variant="secondary">Auto Quality</Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No profile image uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Upload */}
        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon size={20} />
                Image Gallery
              </CardTitle>
              <CardDescription>
                Upload multiple images for the HUMSJ gallery with batch processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                onMultipleUpload={setGalleryImages}
                folder="humsj/gallery"
                multiple={true}
                maxSize={10}
                placeholder="Upload multiple images for the gallery"
              />
              
              {galleryImages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Gallery Images ({galleryImages.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGalleryImages([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((imageUrl, index) => (
                      <div key={index} className="group relative">
                        <CloudinaryThumbnail
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary">
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Download size={14} />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Share2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Images */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera size={20} />
                Event Documentation
              </CardTitle>
              <CardDescription>
                Upload and organize images from HUMSJ events and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                onMultipleUpload={setEventImages}
                folder="humsj/events"
                multiple={true}
                maxSize={5}
                showPreview={true}
                placeholder="Upload event photos and documentation"
              />
              
              {eventImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Images ({eventImages.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventImages.map((imageUrl, index) => (
                      <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <CloudinaryImage
                            src={imageUrl}
                            alt={`Event image ${index + 1}`}
                            width={400}
                            height={250}
                            crop="fill"
                            className="w-full"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-black/50 text-white">
                              Event #{index + 1}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Uploaded {new Date().toLocaleDateString()}
                            </p>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Heart size={14} />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Share2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Overview */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload size={20} />
                  Upload Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    'Drag & drop file upload',
                    'Multiple file selection',
                    'File type validation',
                    'File size limits',
                    'Upload progress tracking',
                    'Error handling & retry',
                    'Folder organization',
                    'Batch processing'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette size={20} />
                  Image Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    'Automatic format conversion',
                    'Quality optimization',
                    'Responsive image delivery',
                    'Face detection & cropping',
                    'Custom transformations',
                    'Lazy loading support',
                    'Progressive image loading',
                    'CDN delivery worldwide'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Benefits</CardTitle>
              <CardDescription>
                Why Cloudinary is perfect for HUMSJ's media management needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto">
                    <Upload size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold">Easy Upload</h4>
                  <p className="text-sm text-muted-foreground">
                    Simple drag-and-drop interface for all users
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto">
                    <Settings size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">Auto Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Images automatically optimized for web delivery
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto">
                    <ImageIcon size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Smart Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Fast CDN delivery with responsive images
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}