import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/ui/ImageUpload";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { uploadMediaToCloudinary, generateCloudinaryUrl } from "@/lib/cloudinary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Folder,
  Search,
  Filter,
  Download,
  Share2,
  Trash2,
  Edit,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreVertical,
  Grid,
  List,
  Calendar,
  Tag,
  FileText,
  Camera,
  Film,
  Music,
  Archive,
  Star,
  Heart,
  MessageSquare,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  tags: string[];
  uploaded_at: string;
  uploaded_by: string;
  file_size?: number;
  dimensions?: { width: number; height: number };
  duration?: number; // for videos
  views?: number;
  likes?: number;
  public_id: string;
}

export default function AdminMediaManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // State management
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUpload, setCurrentUpload] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: '',
    files: [] as File[]
  });

  // Categories for organization
  const categories = [
    { value: 'all', label: 'All Categories', icon: Archive },
    { value: 'events', label: 'Events', icon: Calendar },
    { value: 'education', label: 'Education', icon: FileText },
    { value: 'announcements', label: 'Announcements', icon: MessageSquare },
    { value: 'gallery', label: 'Gallery', icon: ImageIcon },
    { value: 'promotional', label: 'Promotional', icon: Star },
    { value: 'documentation', label: 'Documentation', icon: Archive }
  ];

  // Check admin access
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [isAdmin, navigate]);

  // Load media items
  const loadMediaItems = useCallback(async () => {
    try {
      // In a real implementation, you would fetch from your database
      // For now, we'll use mock data
      const mockData: MediaItem[] = [
        {
          id: '1',
          title: 'HUMSJ Annual Conference 2024',
          description: 'Highlights from our annual Islamic conference',
          url: 'https://res.cloudinary.com/diufyrlyou/image/upload/v1/humsj/events/conference-2024.jpg',
          type: 'image',
          category: 'events',
          tags: ['conference', 'annual', '2024'],
          uploaded_at: new Date().toISOString(),
          uploaded_by: user?.email || 'admin',
          views: 150,
          likes: 25,
          public_id: 'humsj/events/conference-2024'
        },
        {
          id: '2',
          title: 'Islamic Education Workshop',
          description: 'Educational workshop on Islamic studies',
          url: 'https://res.cloudinary.com/diufyrlyou/video/upload/v1/humsj/education/workshop-intro.mp4',
          type: 'video',
          category: 'education',
          tags: ['workshop', 'education', 'islamic-studies'],
          uploaded_at: new Date().toISOString(),
          uploaded_by: user?.email || 'admin',
          duration: 180,
          views: 89,
          likes: 12,
          public_id: 'humsj/education/workshop-intro'
        }
      ];
      setMediaItems(mockData);
    } catch (error) {
      console.error('Error loading media items:', error);
      toast.error('Failed to load media items');
    }
  }, [user?.email]);

  // Load media items
  useEffect(() => {
    loadMediaItems();
  }, [loadMediaItems]);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = mediaItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [mediaItems, selectedCategory, selectedType, searchQuery]);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedItems: MediaItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const folder = `humsj/${currentUpload.category}`;
        
        // Upload to Cloudinary
        const url = await uploadMediaToCloudinary(file, folder);
        
        // Create media item
        const mediaItem: MediaItem = {
          id: Date.now().toString() + i,
          title: currentUpload.title || file.name,
          description: currentUpload.description,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          category: currentUpload.category,
          tags: currentUpload.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          uploaded_at: new Date().toISOString(),
          uploaded_by: user?.email || 'admin',
          file_size: file.size,
          public_id: `${folder}/${file.name.split('.')[0]}`
        };

        uploadedItems.push(mediaItem);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Add to media items
      setMediaItems(prev => [...uploadedItems, ...prev]);
      
      // Reset upload form
      setCurrentUpload({
        title: '',
        description: '',
        category: 'general',
        tags: '',
        files: []
      });
      setShowUploadModal(false);
      
      toast.success(`Successfully uploaded ${uploadedItems.length} file(s)`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      setMediaItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Media item deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete media item');
    }
  };

  const handleBulkDelete = async () => {
    try {
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      toast.success(`Deleted ${selectedItems.length} items`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete selected items');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <PageLayout 
      title="Media Management" 
      subtitle="Upload and manage images and videos for HUMSJ"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Camera size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display tracking-wide">Media Library</h1>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} items • {mediaItems.filter(i => i.type === 'image').length} images • {mediaItems.filter(i => i.type === 'video').length} videos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            </Button>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Upload size={16} />
              Upload Media
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search media by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedItems.length} item(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                    Clear Selection
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 size={14} className="mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media Grid/List */}
        <div className={cn(
          "transition-all duration-300",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        )}>
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={cn(
                "group hover:shadow-lg transition-all duration-300 cursor-pointer",
                selectedItems.includes(item.id) && "ring-2 ring-primary",
                viewMode === 'list' && "flex flex-row"
              )}
              onClick={() => {
                if (selectedItems.includes(item.id)) {
                  setSelectedItems(prev => prev.filter(id => id !== item.id));
                } else {
                  setSelectedItems(prev => [...prev, item.id]);
                }
              }}
            >
              {/* Media Preview */}
              <div className={cn(
                "relative overflow-hidden",
                viewMode === 'grid' ? "aspect-video" : "w-32 h-24 flex-shrink-0"
              )}>
                {item.type === 'image' ? (
                  <CloudinaryImage
                    src={item.url}
                    alt={item.title}
                    width={viewMode === 'grid' ? 400 : 128}
                    height={viewMode === 'grid' ? 225 : 96}
                    crop="fill"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play size={20} className="text-white ml-1" />
                      </div>
                    </div>
                    {item.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                        {formatDuration(item.duration)}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Type Badge */}
                <Badge 
                  className={cn(
                    "absolute top-2 left-2",
                    item.type === 'video' ? "bg-red-500" : "bg-blue-500"
                  )}
                >
                  {item.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>

                {/* Selection Indicator */}
                {selectedItems.includes(item.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={20} className="text-primary bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className={cn(
                "p-4",
                viewMode === 'list' && "flex-1"
              )}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more actions
                      }}
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </div>

                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      {item.views && (
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {item.views}
                        </span>
                      )}
                      {item.likes && (
                        <span className="flex items-center gap-1">
                          <Heart size={10} />
                          {item.likes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(item.file_size)} • {item.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                <ImageIcon size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No media found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first image or video to get started'
                }
              </p>
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload size={16} className="mr-2" />
                Upload Media
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload size={20} />
                  Upload Media Files
                </CardTitle>
                <CardDescription>
                  Upload images and videos to the HUMSJ media library
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={currentUpload.title}
                      onChange={(e) => setCurrentUpload(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter media title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={currentUpload.category}
                      onChange={(e) => setCurrentUpload(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentUpload.description}
                    onChange={(e) => setCurrentUpload(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter media description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={currentUpload.tags}
                    onChange={(e) => setCurrentUpload(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., conference, education, announcement"
                  />
                </div>

                {/* File Upload */}
                <ImageUpload
                  onMultipleUpload={(urls) => {
                    // This will be handled by handleFileUpload
                  }}
                  folder={`humsj/${currentUpload.category}`}
                  multiple={true}
                  maxSize={50} // 50MB for videos
                  acceptedFormats={[
                    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
                    'video/mp4', 'video/webm', 'video/mov', 'video/avi'
                  ]}
                  placeholder="Upload images and videos (max 50MB each)"
                />

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // This would be triggered by the ImageUpload component
                      // For now, we'll simulate it
                      if (currentUpload.files.length > 0) {
                        handleFileUpload(currentUpload.files);
                      }
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Upload Files
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}