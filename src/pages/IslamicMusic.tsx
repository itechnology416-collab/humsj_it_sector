import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Music, 
  Play, 
  Pause,
  Download,
  Heart,
  Share2,
  Search,
  Clock,
  User,
  Star,
  Volume2,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface NasheedTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  category: string;
  language: string;
  audio_url: string;
  cover_image: string;
  release_date: string;
  plays: number;
  likes: number;
  rating: number;
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  lyrics?: string;
}

const mockNasheeds: NasheedTrack[] = [
  {
    id: '1',
    title: 'Tala\'al Badru Alayna',
    artist: 'Mishary Rashid Alafasy',
    album: 'Classical Nasheeds',
    duration: '4:32',
    category: 'Classical',
    language: 'Arabic',
    audio_url: 'https://example.com/nasheed1.mp3',
    cover_image: 'https://example.com/cover1.jpg',
    release_date: '2020-01-15',
    plays: 125430,
    likes: 8920,
    rating: 4.9,
    tags: ['Prophet Muhammad', 'Classical', 'Traditional'],
    is_featured: true,
    is_new: false,
    lyrics: 'Tala\'al badru alayna min thaniyyatil wada...'
  },
  {
    id: '2',
    title: 'Hasbi Rabbi Jallallah',
    artist: 'Sami Yusuf',
    album: 'Spiritique',
    duration: '5:18',
    category: 'Contemporary',
    language: 'Arabic',
    audio_url: 'https://example.com/nasheed2.mp3',
    cover_image: 'https://example.com/cover2.jpg',
    release_date: '2021-03-20',
    plays: 89750,
    likes: 6540,
    rating: 4.8,
    tags: ['Dhikr', 'Contemporary', 'Spiritual'],
    is_featured: false,
    is_new: true
  },
  {
    id: '3',
    title: 'Allahu Allahu',
    artist: 'Maher Zain',
    album: 'Thank You Allah',
    duration: '3:45',
    category: 'Contemporary',
    language: 'English',
    audio_url: 'https://example.com/nasheed3.mp3',
    cover_image: 'https://example.com/cover3.jpg',
    release_date: '2019-11-10',
    plays: 67890,
    likes: 5230,
    rating: 4.7,
    tags: ['Praise', 'English', 'Modern'],
    is_featured: true,
    is_new: false
  }
];

const categories = ['All', 'Classical', 'Contemporary', 'Dhikr', 'Praise', 'Seerah', 'Ramadan', 'Hajj'];
const languages = ['All', 'Arabic', 'English', 'Urdu', 'Turkish', 'Malay'];
const artists = ['All Artists', 'Mishary Rashid Alafasy', 'Sami Yusuf', 'Maher Zain', 'Ahmed Bukhatir'];

export default function IslamicMusic() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nasheeds, setNasheeds] = useState<NasheedTrack[]>(mockNasheeds);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedArtist, setSelectedArtist] = useState('All Artists');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('nasheed-favorites');
    const savedPlaylist = localStorage.getItem('nasheed-playlist');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, []);

  const filteredNasheeds = nasheeds.filter(nasheed => {
    const matchesSearch = !searchQuery || 
      nasheed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nasheed.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nasheed.album?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || nasheed.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || nasheed.language === selectedLanguage;
    const matchesArtist = selectedArtist === 'All Artists' || nasheed.artist === selectedArtist;
    
    return matchesSearch && matchesCategory && matchesLanguage && matchesArtist;
  });

  const featuredNasheeds = nasheeds.filter(n => n.is_featured);
  const newNasheeds = nasheeds.filter(n => n.is_new);

  const toggleFavorite = (nasheedId: string) => {
    const newFavorites = favorites.includes(nasheedId)
      ? favorites.filter(id => id !== nasheedId)
      : [...favorites, nasheedId];
    
    setFavorites(newFavorites);
    localStorage.setItem('nasheed-favorites', JSON.stringify(newFavorites));
  };

  const togglePlaylist = (nasheedId: string) => {
    const newPlaylist = playlist.includes(nasheedId)
      ? playlist.filter(id => id !== nasheedId)
      : [...playlist, nasheedId];
    
    setPlaylist(newPlaylist);
    localStorage.setItem('nasheed-playlist', JSON.stringify(newPlaylist));
  };

  const handlePlay = (nasheedId: string) => {
    if (currentlyPlaying === nasheedId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(nasheedId);
      setIsPlaying(true);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Classical': 'bg-blue-500/20 text-blue-600',
      'Contemporary': 'bg-green-500/20 text-green-600',
      'Dhikr': 'bg-purple-500/20 text-purple-600',
      'Praise': 'bg-orange-500/20 text-orange-600',
      'Seerah': 'bg-pink-500/20 text-pink-600',
      'Ramadan': 'bg-yellow-500/20 text-yellow-600',
      'Hajj': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Music & Nasheeds" 
      subtitle="Listen to beautiful Islamic music and nasheeds from around the world"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Music size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Music & Nasheeds</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Spiritual melodies that touch the heart and soul
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
                  <Music size={20} className="text-violet-600" />
                </div>
                <p className="text-sm font-medium">{nasheeds.length}+ Tracks</p>
                <p className="text-xs text-muted-foreground">High quality audio</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Renowned Artists</p>
                <p className="text-xs text-muted-foreground">Global collection</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Offline Listening</p>
                <p className="text-xs text-muted-foreground">Download tracks</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Heart size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Playlists</p>
                <p className="text-xs text-muted-foreground">Create & share</p>
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
                  placeholder="Search nasheeds, artists, or albums..."
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

                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {artists.map(artist => (
                    <option key={artist} value={artist}>{artist}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Tracks</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New Releases</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="playlist">My Playlist</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="space-y-2">
              {filteredNasheeds.map((nasheed, index) => (
                <Card 
                  key={nasheed.id}
                  className="hover:shadow-md transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Music size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {nasheed.title}
                          </h3>
                          <Badge className={cn("text-xs", getCategoryColor(nasheed.category))}>
                            {nasheed.category}
                          </Badge>
                          {nasheed.is_featured && (
                            <Badge variant="outline" className="text-xs">
                              <Star size={10} className="mr-1" />
                              Featured
                            </Badge>
                          )}
                          {nasheed.is_new && (
                            <Badge className="bg-green-500 text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {nasheed.artist} {nasheed.album && `• ${nasheed.album}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {nasheed.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={12} />
                          {nasheed.likes.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(nasheed.id)}
                          className={cn(
                            "w-8 h-8 p-0",
                            favorites.includes(nasheed.id) && "text-red-500"
                          )}
                        >
                          <Heart size={14} className={favorites.includes(nasheed.id) ? "fill-current" : ""} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlaylist(nasheed.id)}
                          className="w-8 h-8 p-0"
                        >
                          <Music size={14} />
                        </Button>

                        <Button
                          onClick={() => handlePlay(nasheed.id)}
                          size="sm"
                          className="w-10 h-8 p-0"
                        >
                          {currentlyPlaying === nasheed.id && isPlaying ? (
                            <Pause size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNasheeds.map((nasheed, index) => (
                <Card 
                  key={nasheed.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Music size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(nasheed.category))}>
                            {nasheed.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Star size={10} className="mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{nasheed.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {nasheed.artist} {nasheed.album && `• ${nasheed.album}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {nasheed.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              {nasheed.rating}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handlePlay(nasheed.id)}
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
            <div className="space-y-2">
              {newNasheeds.map((nasheed, index) => (
                <Card 
                  key={nasheed.id}
                  className="hover:shadow-md transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Music size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-green-500 text-white text-xs">
                            New
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(nasheed.category))}>
                            {nasheed.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(nasheed.release_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{nasheed.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {nasheed.artist} • {nasheed.duration}
                        </p>
                      </div>

                      <Button
                        onClick={() => handlePlay(nasheed.id)}
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
                    Start adding nasheeds to your favorites to see them here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {nasheeds
                  .filter(nasheed => favorites.includes(nasheed.id))
                  .map((nasheed, index) => (
                    <Card 
                      key={nasheed.id}
                      className="hover:shadow-md transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-white fill-current" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{nasheed.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {nasheed.artist} • {nasheed.duration}
                            </p>
                          </div>

                          <Button
                            onClick={() => handlePlay(nasheed.id)}
                            className="gap-2"
                          >
                            <Play size={16} />
                            Play Favorite
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playlist" className="space-y-6">
            {playlist.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Music size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Playlist is empty</h3>
                  <p className="text-muted-foreground">
                    Add nasheeds to your playlist to create your personal collection.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">My Playlist ({playlist.length} tracks)</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Shuffle size={14} />
                      Shuffle
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Play size={14} />
                      Play All
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {nasheeds
                    .filter(nasheed => playlist.includes(nasheed.id))
                    .map((nasheed, index) => (
                      <Card 
                        key={nasheed.id}
                        className="hover:shadow-md transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground w-6">
                              {index + 1}
                            </span>
                            
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <Music size={16} className="text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">{nasheed.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {nasheed.artist} • {nasheed.duration}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePlaylist(nasheed.id)}
                                className="gap-2"
                              >
                                Remove
                              </Button>
                              <Button
                                onClick={() => handlePlay(nasheed.id)}
                                size="sm"
                                className="w-10 h-8 p-0"
                              >
                                <Play size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Currently Playing Bar */}
        {currentlyPlaying && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Music size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {nasheeds.find(n => n.id === currentlyPlaying)?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {nasheeds.find(n => n.id === currentlyPlaying)?.artist}
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
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Repeat size={16} />
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