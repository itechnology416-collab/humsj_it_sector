import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Play, 
  Pause,
  Download,
  Heart,
  Share2,
  Search,
  Clock,
  User,
  Star,
  TrendingUp,
  Eye,
  ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface VideoContent {
  id: string;
  title: string;
  description: string;
  speaker: string;
  duration: string;
  category: string;
  language: string;
  video_url: string;
  thumbnail: string;
  published_date: string;
  views: number;
  likes: number;
  rating: number;
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
}

const mockVideos: VideoContent[] = [
  {
    id: '1',
    title: 'The Beautiful Names of Allah - Al-Rahman',
    description: 'An in-depth exploration of one of Allah\'s most beautiful names, Ar-Rahman (The Most Merciful).',
    speaker: 'Sheikh Omar Suleiman',
    duration: '28:45',
    category: 'Aqeedah',
    language: 'English',
    video_url: 'https://example.com/video1.mp4',
    thumbnail: 'https://example.com/thumb1.jpg',
    published_date: '2024-12-20',
    views: 45230,
    likes: 3420,
    rating: 4.9,
    tags: ['Names of Allah', 'Mercy', 'Spirituality'],
    is_featured: true,
    is_new: false
  },
  {
    id: '2',
    title: 'Understanding Salah: The Spiritual Connection',
    description: 'Discover the deeper meaning behind Islamic prayer and how it transforms our relationship with Allah.',
    speaker: 'Dr. Yasir Qadhi',
    duration: '35:20',
    category: 'Worship',
    language: 'English',
    video_url: 'https://example.com/video2.mp4',
    thumbnail: 'https://example.com/thumb2.jpg',
    published_date: '2024-12-18',
    views: 28950,
    likes: 2150,
    rating: 4.8,
    tags: ['Salah', 'Prayer', 'Spirituality'],
    is_featured: false,
    is_new: true
  }
];

const categories = ['All', 'Aqeedah', 'Worship', 'Finance', 'History', 'Spirituality', 'Family', 'Youth'];
const languages = ['All', 'English', 'Arabic', 'Amharic', 'Oromo'];

export default function IslamicVideos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [videos, setVideos] = useState<VideoContent[]>(mockVideos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('video-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || video.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const toggleFavorite = (videoId: string) => {
    const newFavorites = favorites.includes(videoId)
      ? favorites.filter(id => id !== videoId)
      : [...favorites, videoId];
    
    setFavorites(newFavorites);
    localStorage.setItem('video-favorites', JSON.stringify(newFavorites));
  };

  const handlePlay = (videoId: string) => {
    if (currentlyPlaying === videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(videoId);
      setIsPlaying(true);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Aqeedah': 'bg-blue-500/20 text-blue-600',
      'Worship': 'bg-green-500/20 text-green-600',
      'Finance': 'bg-purple-500/20 text-purple-600',
      'History': 'bg-orange-500/20 text-orange-600',
      'Spirituality': 'bg-pink-500/20 text-pink-600',
      'Family': 'bg-yellow-500/20 text-yellow-600',
      'Youth': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Videos" 
      subtitle="Watch inspiring Islamic content from renowned scholars and speakers"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Video size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Video Library</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Watch and learn from Islamic scholars worldwide
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <Video size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium">{videos.length}+ Videos</p>
                <p className="text-xs text-muted-foreground">HD Quality</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Expert Speakers</p>
                <p className="text-xs text-muted-foreground">Renowned scholars</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Offline Viewing</p>
                <p className="text-xs text-muted-foreground">Download & watch</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <TrendingUp size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">New Content</p>
                <p className="text-xs text-muted-foreground">Added weekly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search videos, speakers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[100px]"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <Card 
              key={video.id}
              className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <Button
                  onClick={() => handlePlay(video.id)}
                  className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                >
                  {currentlyPlaying === video.id && isPlaying ? (
                    <Pause size={24} className="text-white" />
                  ) : (
                    <Play size={24} className="text-white ml-1" />
                  )}
                </Button>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  {video.is_featured && (
                    <Badge className="bg-yellow-500 text-black text-xs">
                      Featured
                    </Badge>
                  )}
                  {video.is_new && (
                    <Badge className="bg-green-500 text-white text-xs">
                      New
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Badge className={cn("text-xs", getCategoryColor(video.category))}>
                    {video.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Eye size={12} />
                    {video.views.toLocaleString()}
                  </div>
                </div>

                <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                
                <p className="text-xs text-muted-foreground">
                  by {video.speaker}
                </p>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={12} />
                      {video.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-current" />
                      {video.rating}
                    </span>
                  </div>
                  <span>{new Date(video.published_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                  <Button
                    size="sm"
                    onClick={() => handlePlay(video.id)}
                    className="flex-1 gap-2"
                  >
                    <Play size={14} />
                    Watch
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(video.id)}
                    className={cn(
                      "w-9 h-8 p-0",
                      favorites.includes(video.id) && "text-red-500 border-red-300"
                    )}
                  >
                    <Heart size={14} className={favorites.includes(video.id) ? "fill-current" : ""} />
                  </Button>

                  <Button variant="outline" size="sm" className="w-9 h-8 p-0">
                    <Clock size={14} />
                  </Button>

                  <Button variant="outline" size="sm" className="w-9 h-8 p-0">
                    <Share2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}