import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Headphones, 
  Play, 
  Pause,
  Download,
  Heart,
  Share2,
  Search,
  Filter,
  Clock,
  User,
  Star,
  TrendingUp,
  Calendar,
  Volume2,
  SkipBack,
  SkipForward
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  duration: string;
  category: string;
  language: string;
  audio_url: string;
  thumbnail: string;
  published_date: string;
  downloads: number;
  rating: number;
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  series?: string;
  episode_number?: number;
}

const mockPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'Understanding Tawheed in Modern Times',
    description: 'A comprehensive discussion on the concept of Islamic monotheism and its relevance in contemporary society.',
    host: 'Sheikh Ahmad Al-Hakeem',
    duration: '45:30',
    category: 'Aqeedah',
    language: 'English',
    audio_url: 'https://example.com/podcast1.mp3',
    thumbnail: 'https://example.com/thumb1.jpg',
    published_date: '2024-12-20',
    downloads: 15420,
    rating: 4.8,
    tags: ['Tawheed', 'Aqeedah', 'Modern Islam'],
    is_featured: true,
    is_new: false,
    series: 'Foundations of Faith',
    episode_number: 1
  },
  {
    id: '2',
    title: 'The Beauty of Salah: Beyond the Ritual',
    description: 'Exploring the spiritual dimensions of Islamic prayer and its impact on daily life.',
    host: 'Dr. Aisha Rahman',
    duration: '32:15',
    category: 'Worship',
    language: 'English',
    audio_url: 'https://example.com/podcast2.mp3',
    thumbnail: 'https://example.com/thumb2.jpg',
    published_date: '2024-12-18',
    downloads: 8930,
    rating: 4.9,
    tags: ['Salah', 'Prayer', 'Spirituality'],
    is_featured: false,
    is_new: true
  },
  {
    id: '3',
    title: 'Islamic Finance: Principles and Practice',
    description: 'An in-depth look at Shariah-compliant financial systems and their global impact.',
    host: 'Prof. Yusuf Al-Maliki',
    duration: '58:45',
    category: 'Finance',
    language: 'English',
    audio_url: 'https://example.com/podcast3.mp3',
    thumbnail: 'https://example.com/thumb3.jpg',
    published_date: '2024-12-15',
    downloads: 12350,
    rating: 4.7,
    tags: ['Islamic Banking', 'Finance', 'Economics'],
    is_featured: true,
    is_new: false
  }
];

const categories = ['All', 'Aqeedah', 'Worship', 'Finance', 'History', 'Spirituality', 'Family', 'Youth'];
const languages = ['All', 'English', 'Arabic', 'Amharic', 'Oromo'];

export default function IslamicPodcasts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [podcasts, setPodcasts] = useState<Podcast[]>(mockPodcasts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('podcast-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = !searchQuery || 
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || podcast.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || podcast.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const featuredPodcasts = podcasts.filter(p => p.is_featured);
  const newPodcasts = podcasts.filter(p => p.is_new);

  const toggleFavorite = (podcastId: string) => {
    const newFavorites = favorites.includes(podcastId)
      ? favorites.filter(id => id !== podcastId)
      : [...favorites, podcastId];
    
    setFavorites(newFavorites);
    localStorage.setItem('podcast-favorites', JSON.stringify(newFavorites));
  };

  const handlePlay = (podcastId: string) => {
    if (currentlyPlaying === podcastId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(podcastId);
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
      title="Islamic Podcasts" 
      subtitle="Listen to inspiring Islamic content from renowned scholars and speakers"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Headphones size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Podcasts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover knowledge through audio content
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Headphones size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{podcasts.length}+ Episodes</p>
                <p className="text-xs text-muted-foreground">Available now</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Expert Hosts</p>
                <p className="text-xs text-muted-foreground">Scholars & speakers</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Offline Access</p>
                <p className="text-xs text-muted-foreground">Download & listen</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <TrendingUp size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Regular Updates</p>
                <p className="text-xs text-muted-foreground">New content weekly</p>
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
                  placeholder="Search podcasts, hosts, or topics..."
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

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Podcasts</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New Episodes</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast, index) => (
                <Card 
                  key={podcast.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Headphones size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(podcast.category))}>
                            {podcast.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {podcast.is_featured && (
                              <Badge variant="outline" className="text-xs">
                                <Star size={10} className="mr-1" />
                                Featured
                              </Badge>
                            )}
                            {podcast.is_new && (
                              <Badge className="bg-green-500 text-white text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {podcast.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          by {podcast.host}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {podcast.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {podcast.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={12} />
                          {podcast.downloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-current" />
                        {podcast.rating}
                      </div>
                    </div>

                    {podcast.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {podcast.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                      <Button
                        size="sm"
                        onClick={() => handlePlay(podcast.id)}
                        className="flex-1 gap-2"
                      >
                        {currentlyPlaying === podcast.id && isPlaying ? (
                          <>
                            <Pause size={14} />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Play
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(podcast.id)}
                        className={cn(
                          "w-9 h-8 p-0",
                          favorites.includes(podcast.id) && "text-red-500 border-red-300"
                        )}
                      >
                        <Heart size={14} className={favorites.includes(podcast.id) ? "fill-current" : ""} />
                      </Button>

                      <Button variant="outline" size="sm" className="w-9 h-8 p-0">
                        <Download size={14} />
                      </Button>

                      <Button variant="outline" size="sm" className="w-9 h-8 p-0">
                        <Share2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPodcasts.map((podcast, index) => (
                <Card 
                  key={podcast.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Headphones size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(podcast.category))}>
                            {podcast.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Star size={10} className="mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{podcast.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {podcast.host}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {podcast.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {podcast.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              {podcast.rating}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handlePlay(podcast.id)}
                            className="gap-2"
                          >
                            <Play size={14} />
                            Play Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {newPodcasts.map((podcast, index) => (
                <Card 
                  key={podcast.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Headphones size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white text-xs">
                            New
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(podcast.category))}>
                            {podcast.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(podcast.published_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{podcast.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {podcast.host}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {podcast.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {podcast.downloads.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handlePlay(podcast.id)}
                        className="gap-2"
                      >
                        <Play size={16} />
                        Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">
                    Start adding podcasts to your favorites to see them here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts
                  .filter(podcast => favorites.includes(podcast.id))
                  .map((podcast, index) => (
                    <Card 
                      key={podcast.id}
                      className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-white fill-current" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                              {podcast.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              by {podcast.host}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePlay(podcast.id)}
                          className="w-full gap-2"
                        >
                          <Play size={14} />
                          Play Favorite
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Currently Playing Bar */}
        {currentlyPlaying && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Headphones size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {podcasts.find(p => p.id === currentlyPlaying)?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {podcasts.find(p => p.id === currentlyPlaying)?.host}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <SkipBack size={16} />
                  </Button>
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full p-0"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <SkipForward size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Volume2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}