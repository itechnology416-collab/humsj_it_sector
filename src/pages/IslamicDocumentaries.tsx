import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Film, 
  Play, 
  Clock,
  Star,
  Eye,
  Calendar,
  Search,
  Heart,
  Share2,
  Download,
  User,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface Documentary {
  id: string;
  title: string;
  description: string;
  director: string;
  narrator?: string;
  duration: string;
  category: string;
  language: string;
  video_url: string;
  thumbnail: string;
  release_date: string;
  views: number;
  rating: number;
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  awards?: string[];
  production_year: number;
}

const mockDocumentaries: Documentary[] = [
  {
    id: '1',
    title: 'The Message of Islam',
    description: 'A comprehensive documentary exploring the core teachings and principles of Islam, featuring interviews with renowned scholars and historians.',
    director: 'Ahmad Hassan',
    narrator: 'Dr. Tariq Ramadan',
    duration: '90:00',
    category: 'Islamic Teachings',
    language: 'English',
    video_url: 'https://example.com/doc1.mp4',
    thumbnail: 'https://example.com/thumb1.jpg',
    release_date: '2023-01-15',
    views: 245000,
    rating: 4.9,
    tags: ['Islam', 'Teachings', 'History'],
    is_featured: true,
    is_new: false,
    awards: ['Best Documentary 2023', 'Audience Choice Award'],
    production_year: 2023
  },
  {
    id: '2',
    title: 'Journey to Mecca: In the Footsteps of Ibn Battuta',
    description: 'Follow the incredible journey of the famous Muslim explorer Ibn Battuta as he travels to Mecca and beyond.',
    director: 'Bruce Neibaur',
    narrator: 'Ben Kingsley',
    duration: '45:30',
    category: 'History',
    language: 'English',
    video_url: 'https://example.com/doc2.mp4',
    thumbnail: 'https://example.com/thumb2.jpg',
    release_date: '2009-01-01',
    views: 189000,
    rating: 4.8,
    tags: ['Hajj', 'Travel', 'Ibn Battuta', 'History'],
    is_featured: false,
    is_new: false,
    awards: ['IMAX Excellence Award'],
    production_year: 2009
  },
  {
    id: '3',
    title: 'The Golden Age of Islam',
    description: 'Explore the remarkable achievements of Islamic civilization during its golden age, from science to art and philosophy.',
    director: 'Sarah Mitchell',
    narrator: 'Prof. Jim Al-Khalili',
    duration: '120:15',
    category: 'History',
    language: 'English',
    video_url: 'https://example.com/doc3.mp4',
    thumbnail: 'https://example.com/thumb3.jpg',
    release_date: '2024-03-20',
    views: 156000,
    rating: 4.7,
    tags: ['Golden Age', 'Science', 'Philosophy', 'Art'],
    is_featured: true,
    is_new: true,
    production_year: 2024
  }
];

const categories = ['All', 'Islamic Teachings', 'History', 'Biography', 'Science', 'Art & Culture', 'Modern Islam', 'Pilgrimage'];
const languages = ['All', 'English', 'Arabic', 'French', 'Spanish', 'Urdu'];

export default function IslamicDocumentaries() {
  const navigate = useNavigate();
  const location = useLocation();
  const [documentaries, setDocumentaries] = useState<Documentary[]>(mockDocumentaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchLater, setWatchLater] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('documentary-favorites');
    const savedWatchLater = localStorage.getItem('documentary-watch-later');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedWatchLater) {
      setWatchLater(JSON.parse(savedWatchLater));
    }
  }, []);

  const filteredDocumentaries = documentaries.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.director.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || doc.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const featuredDocumentaries = documentaries.filter(d => d.is_featured);
  const newDocumentaries = documentaries.filter(d => d.is_new);
  const awardWinningDocs = documentaries.filter(d => d.awards && d.awards.length > 0);

  const toggleFavorite = (docId: string) => {
    const newFavorites = favorites.includes(docId)
      ? favorites.filter(id => id !== docId)
      : [...favorites, docId];
    
    setFavorites(newFavorites);
    localStorage.setItem('documentary-favorites', JSON.stringify(newFavorites));
  };

  const toggleWatchLater = (docId: string) => {
    const newWatchLater = watchLater.includes(docId)
      ? watchLater.filter(id => id !== docId)
      : [...watchLater, docId];
    
    setWatchLater(newWatchLater);
    localStorage.setItem('documentary-watch-later', JSON.stringify(newWatchLater));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Islamic Teachings': 'bg-green-500/20 text-green-600',
      'History': 'bg-blue-500/20 text-blue-600',
      'Biography': 'bg-purple-500/20 text-purple-600',
      'Science': 'bg-orange-500/20 text-orange-600',
      'Art & Culture': 'bg-pink-500/20 text-pink-600',
      'Modern Islam': 'bg-indigo-500/20 text-indigo-600',
      'Pilgrimage': 'bg-yellow-500/20 text-yellow-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Documentaries" 
      subtitle="Explore Islamic history, culture, and teachings through compelling documentaries"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Film size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Documentaries</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Educational films that illuminate Islamic heritage and wisdom
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
                  <Film size={20} className="text-amber-600" />
                </div>
                <p className="text-sm font-medium">{documentaries.length}+ Films</p>
                <p className="text-xs text-muted-foreground">HD Quality</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Expert Directors</p>
                <p className="text-xs text-muted-foreground">Award-winning</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Award Winners</p>
                <p className="text-xs text-muted-foreground">Recognized films</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Offline Viewing</p>
                <p className="text-xs text-muted-foreground">Download & watch</p>
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
                  placeholder="Search documentaries, directors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Films</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New Releases</TabsTrigger>
            <TabsTrigger value="awards">Award Winners</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocumentaries.map((doc, index) => (
                <Card 
                  key={doc.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Button
                      className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                    >
                      <Play size={24} className="text-white ml-1" />
                    </Button>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {doc.duration}
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      {doc.is_featured && (
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Featured
                        </Badge>
                      )}
                      {doc.is_new && (
                        <Badge className="bg-green-500 text-white text-xs">
                          New
                        </Badge>
                      )}
                      {doc.awards && doc.awards.length > 0 && (
                        <Badge className="bg-purple-500 text-white text-xs">
                          <Award size={10} className="mr-1" />
                          Award Winner
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge className={cn("text-xs", getCategoryColor(doc.category))}>
                        {doc.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                        <Eye size={12} />
                        {doc.views.toLocaleString()}
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                      {doc.title}
                    </h3>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Directed by {doc.director}</p>
                      {doc.narrator && <p>Narrated by {doc.narrator}</p>}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {doc.production_year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-current" />
                          {doc.rating}
                        </span>
                      </div>
                      <span>{doc.language}</span>
                    </div>

                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {doc.awards && doc.awards.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-purple-600">Awards:</p>
                        <div className="flex flex-wrap gap-1">
                          {doc.awards.slice(0, 2).map((award, awardIndex) => (
                            <Badge key={awardIndex} className="bg-purple-500/20 text-purple-600 text-xs">
                              <Award size={10} className="mr-1" />
                              {award}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                      <Button
                        size="sm"
                        className="flex-1 gap-2"
                      >
                        <Play size={14} />
                        Watch
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(doc.id)}
                        className={cn(
                          "w-9 h-8 p-0",
                          favorites.includes(doc.id) && "text-red-500 border-red-300"
                        )}
                      >
                        <Heart size={14} className={favorites.includes(doc.id) ? "fill-current" : ""} />
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-9 h-8 p-0"
                        onClick={() => toggleWatchLater(doc.id)}
                      >
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
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredDocumentaries.map((doc, index) => (
                <Card 
                  key={doc.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative aspect-video md:w-48 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <Play size={20} className="text-white ml-1" />
                      </Button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {doc.duration}
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-xs", getCategoryColor(doc.category))}>
                          {doc.category}
                        </Badge>
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Featured
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Directed by {doc.director}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {doc.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {doc.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            {doc.rating}
                          </span>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Play size={14} />
                          Watch Now
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {newDocumentaries.map((doc, index) => (
                <Card 
                  key={doc.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Play size={20} className="text-white" />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                          {doc.duration}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white text-xs">
                            New Release
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(doc.category))}>
                            {doc.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.release_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Directed by {doc.director}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {doc.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            {doc.rating}
                          </span>
                        </div>
                      </div>
                      <Button className="gap-2">
                        <Play size={16} />
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="awards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {awardWinningDocs.map((doc, index) => (
                <Card 
                  key={doc.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Award size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-500 text-white text-xs">
                            <Award size={10} className="mr-1" />
                            Award Winner
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(doc.category))}>
                            {doc.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Directed by {doc.director}
                        </p>
                        {doc.awards && (
                          <div className="space-y-2 mb-4">
                            <p className="text-xs font-medium text-purple-600">Awards:</p>
                            <div className="flex flex-wrap gap-1">
                              {doc.awards.map((award, awardIndex) => (
                                <Badge key={awardIndex} className="bg-purple-500/20 text-purple-600 text-xs">
                                  {award}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {doc.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              {doc.rating}
                            </span>
                          </div>
                          <Button size="sm" className="gap-2">
                            <Play size={14} />
                            Watch
                          </Button>
                        </div>
                      </div>
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
                    Start adding documentaries to your favorites to see them here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentaries
                  .filter(doc => favorites.includes(doc.id))
                  .map((doc, index) => (
                    <Card 
                      key={doc.id}
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
                              {doc.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Directed by {doc.director}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full gap-2">
                          <Play size={14} />
                          Watch Favorite
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}