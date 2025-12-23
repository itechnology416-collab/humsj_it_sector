import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Image as ImageIcon, 
  Video, 
  Headphones,
  FileText,
  Play,
  Download,
  Share2,
  Heart,
  Eye,
  Calendar,
  Search,
  Grid3X3,
  List,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio' | 'document';
  category: 'events' | 'programs' | 'lectures' | 'ceremonies' | 'community' | 'education';
  url: string;
  thumbnailUrl?: string;
  duration?: string; // for video/audio
  size?: string;
  uploadDate: string;
  uploader: string;
  views: number;
  likes: number;
  tags: string[];
  featured: boolean;
}

// Mock data for demonstration
const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'HUMSJ Annual Conference 2024',
    description: 'Highlights from our annual Islamic conference featuring renowned scholars and community leaders.',
    type: 'video',
    category: 'events',
    url: '/videos/conference-2024.mp4',
    thumbnailUrl: '/mosques.jpg',
    duration: '45:30',
    uploadDate: '2024-03-15',
    uploader: 'HUMSJ Media Team',
    views: 1250,
    likes: 89,
    tags: ['Conference', 'Islamic Education', 'Scholars', 'Community'],
    featured: true
  },
  {
    id: '2',
    title: 'Friday Prayer Congregation',
    description: 'Beautiful moments from our weekly Jumu\'ah prayer gathering at the university mosque.',
    type: 'image',
    category: 'ceremonies',
    url: '/mosques.jpg',
    uploadDate: '2024-03-10',
    uploader: 'Photography Team',
    views: 890,
    likes: 156,
    tags: ['Jumu\'ah', 'Prayer', 'Mosque', 'Community'],
    featured: true
  },
  {
    id: '3',
    title: 'Quranic Recitation Competition',
    description: 'Audio recording from our annual Quran recitation competition featuring talented students.',
    type: 'audio',
    category: 'programs',
    url: '/audio/quran-competition.mp3',
    duration: '25:15',
    uploadDate: '2024-02-28',
    uploader: 'Islamic Programs Committee',
    views: 567,
    likes: 78,
    tags: ['Quran', 'Recitation', 'Competition', 'Students'],
    featured: false
  },
  {
    id: '4',
    title: 'Islamic History Documentary',
    description: 'Educational documentary about the spread of Islam in Ethiopia and the Horn of Africa.',
    type: 'document',
    category: 'education',
    url: '/documents/islam-ethiopia-history.pdf',
    size: '15.2 MB',
    uploadDate: '2024-02-20',
    uploader: 'Research Team',
    views: 445,
    likes: 67,
    tags: ['History', 'Ethiopia', 'Islam', 'Documentary'],
    featured: false
  },
  {
    id: '5',
    title: 'Ramadan Iftar Gathering',
    description: 'Community iftar event bringing together Muslim students during the holy month of Ramadan.',
    type: 'video',
    category: 'community',
    url: '/videos/ramadan-iftar.mp4',
    thumbnailUrl: '/mosques.jpg',
    duration: '12:45',
    uploadDate: '2024-04-05',
    uploader: 'Social Affairs Committee',
    views: 723,
    likes: 134,
    tags: ['Ramadan', 'Iftar', 'Community', 'Unity'],
    featured: true
  },
  {
    id: '6',
    title: 'Islamic Calligraphy Workshop',
    description: 'Students learning the beautiful art of Arabic calligraphy in our cultural workshop.',
    type: 'image',
    category: 'education',
    url: '/images/calligraphy-workshop.jpg',
    uploadDate: '2024-01-18',
    uploader: 'Cultural Committee',
    views: 334,
    likes: 45,
    tags: ['Calligraphy', 'Art', 'Arabic', 'Workshop'],
    featured: false
  }
];

export default function MediaGallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mediaTypes = [
    { value: 'all', label: 'All Media', icon: Grid3X3 },
    { value: 'image', label: 'Images', icon: ImageIcon },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Headphones },
    { value: 'document', label: 'Documents', icon: FileText }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'events', label: 'Events' },
    { value: 'programs', label: 'Programs' },
    { value: 'lectures', label: 'Lectures' },
    { value: 'ceremonies', label: 'Ceremonies' },
    { value: 'community', label: 'Community' },
    { value: 'education', label: 'Education' }
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesCategory && matchesSearch;
  });

  const featuredMedia = filteredMedia.filter(item => item.featured);
  const regularMedia = filteredMedia.filter(item => !item.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'document': return FileText;
      default: return Grid3X3;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-500/20 text-blue-600';
      case 'video': return 'bg-red-500/20 text-red-600';
      case 'audio': return 'bg-green-500/20 text-green-600';
      case 'document': return 'bg-purple-500/20 text-purple-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
    // Update views
    setMediaItems(prev => prev.map(item => 
      item.id === media.id ? { ...item, views: item.views + 1 } : item
    ));
  };

  const handleLike = (mediaId: string) => {
    setMediaItems(prev => prev.map(item => 
      item.id === mediaId ? { ...item, likes: item.likes + 1 } : item
    ));
    toast.success('Added to favorites!');
  };

  const handleDownload = (media: MediaItem) => {
    toast.success(`Downloading ${media.title}...`);
  };

  const handleShare = (media: MediaItem) => {
    navigator.clipboard.writeText(`${window.location.origin}/media/${media.id}`);
    toast.success('Link copied to clipboard!');
  };

  const MediaCard = ({ media }: { media: MediaItem }) => {
    const TypeIcon = getTypeIcon(media.type);
    
    return (
      <div 
        className="bg-card rounded-xl border border-border/30 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-105 group cursor-pointer animate-slide-up"
        onClick={() => handleMediaClick(media)}
      >
        {/* Thumbnail/Preview */}
        <div className="relative aspect-video bg-muted/30 overflow-hidden">
          {media.type === 'image' || media.thumbnailUrl ? (
            <img 
              src={media.thumbnailUrl || media.url} 
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <TypeIcon size={48} className="text-primary/60" />
            </div>
          )}
          
          {/* Type Badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(media.type)}`}>
            <TypeIcon size={12} className="inline mr-1" />
            {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
          </div>

          {/* Duration for video/audio */}
          {media.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
              {media.duration}
            </div>
          )}

          {/* Play button for video/audio */}
          {(media.type === 'video' || media.type === 'audio') && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
          )}

          {/* Featured badge */}
          {media.featured && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs rounded-md font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {media.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {media.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {media.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                #{tag}
              </span>
            ))}
            {media.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-secondary rounded-md">
                +{media.tags.length - 3}
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {media.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {media.likes}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(media.uploadDate).toLocaleDateString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(media.id);
              }}
              className="flex-1 gap-1"
            >
              <Heart size={14} />
              Like
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleShare(media);
              }}
              className="gap-1"
            >
              <Share2 size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(media);
              }}
              className="gap-1"
            >
              <Download size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout 
      title="Media Gallery" 
      subtitle="HUMSJ Images, Videos, Audio & Documents Collection"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <ImageIcon size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Media Collection</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">HUMSJ Media Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore our comprehensive collection of images, videos, audio recordings, and documents 
            showcasing HUMSJ activities, programs, and Islamic educational content.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Media', value: mediaItems.length.toString(), icon: Grid3X3, color: 'text-primary' },
            { label: 'Videos', value: mediaItems.filter(m => m.type === 'video').length.toString(), icon: Video, color: 'text-red-500' },
            { label: 'Images', value: mediaItems.filter(m => m.type === 'image').length.toString(), icon: ImageIcon, color: 'text-blue-500' },
            { label: 'Audio', value: mediaItems.filter(m => m.type === 'audio').length.toString(), icon: Headphones, color: 'text-green-500' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border/30 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
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
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mediaTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon size={14} />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Media */}
        {featuredMedia.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <Badge className="bg-amber-500">Featured</Badge>
              Featured Media
            </h2>
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}>
              {featuredMedia.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        )}

        {/* All Media */}
        <div>
          <h2 className="text-2xl font-display mb-6">
            All Media ({filteredMedia.length})
          </h2>
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No media found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}>
              {regularMedia.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          )}
        </div>

        {/* Media Modal */}
        {isModalOpen && selectedMedia && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedMedia.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="p-6">
                {/* Media content would be rendered here based on type */}
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Media player would be implemented here</p>
                </div>
                <p className="text-muted-foreground mb-4">{selectedMedia.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMedia.tags.map(tag => (
                    <Badge key={tag} variant="outline">#{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}