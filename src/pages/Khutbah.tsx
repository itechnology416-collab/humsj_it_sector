import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock,
  Download,
  Play,
  Pause,
  Volume2,
  Share2,
  Heart,
  MessageCircle,
  Search,
  Filter,
  ChevronDown,
  Star,
  Eye,
  Bookmark,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Khutbah {
  id: string;
  title: string;
  imam: string;
  date: string;
  duration: string;
  topic: string;
  category: 'friday' | 'eid' | 'special' | 'ramadan';
  description: string;
  audioUrl?: string;
  videoUrl?: string;
  transcript?: string;
  views: number;
  likes: number;
  bookmarks: number;
  tags: string[];
  language: 'english' | 'arabic' | 'amharic' | 'oromo';
  featured: boolean;
}

const mockKhutbahs: Khutbah[] = [
  {
    id: '1',
    title: 'The Importance of Unity in Islam',
    imam: 'Sheikh Ahmed Hassan',
    date: '2024-12-20',
    duration: '25:30',
    topic: 'Unity and Brotherhood',
    category: 'friday',
    description: 'A powerful reminder about the importance of unity among Muslims and how it strengthens our community.',
    views: 1250,
    likes: 89,
    bookmarks: 34,
    tags: ['Unity', 'Brotherhood', 'Community', 'Quran'],
    language: 'english',
    featured: true
  },
  {
    id: '2',
    title: 'Seeking Knowledge: A Muslim\'s Duty',
    imam: 'Dr. Fatima Al-Zahra',
    date: '2024-12-13',
    duration: '22:15',
    topic: 'Education and Knowledge',
    category: 'friday',
    description: 'Exploring the Islamic perspective on education and the pursuit of knowledge in both religious and worldly matters.',
    views: 980,
    likes: 67,
    bookmarks: 28,
    tags: ['Education', 'Knowledge', 'Islam', 'Learning'],
    language: 'english',
    featured: false
  },
  {
    id: '3',
    title: 'Preparing for Ramadan',
    imam: 'Imam Omar Ibrahim',
    date: '2024-03-15',
    duration: '28:45',
    topic: 'Spiritual Preparation',
    category: 'ramadan',
    description: 'Guidance on how to spiritually and physically prepare for the blessed month of Ramadan.',
    views: 2100,
    likes: 156,
    bookmarks: 78,
    tags: ['Ramadan', 'Fasting', 'Spirituality', 'Preparation'],
    language: 'english',
    featured: true
  }
];

export default function Khutbah() {
  const navigate = useNavigate();
  const location = useLocation();
  const [khutbahs, setKhutbahs] = useState<Khutbah[]>(mockKhutbahs);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const categories = [
    { value: 'all', label: 'All Khutbahs' },
    { value: 'friday', label: 'Friday Khutbah' },
    { value: 'eid', label: 'Eid Khutbah' },
    { value: 'ramadan', label: 'Ramadan Special' },
    { value: 'special', label: 'Special Occasions' }
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'amharic', label: 'Amharic' },
    { value: 'oromo', label: 'Afaan Oromo' }
  ];

  const filteredKhutbahs = khutbahs.filter(khutbah => {
    const matchesCategory = selectedCategory === 'all' || khutbah.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || khutbah.language === selectedLanguage;
    const matchesSearch = searchQuery === '' || 
      khutbah.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      khutbah.imam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      khutbah.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      khutbah.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const featuredKhutbahs = filteredKhutbahs.filter(k => k.featured);
  const regularKhutbahs = filteredKhutbahs.filter(k => !k.featured);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'friday': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'eid': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'ramadan': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'special': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      toast.success("Audio playback started");
    }
  };

  const handleBookmark = (id: string) => {
    setKhutbahs(prev => prev.map(k => 
      k.id === id ? { ...k, bookmarks: k.bookmarks + 1 } : k
    ));
    toast.success("Khutbah bookmarked");
  };

  const handleLike = (id: string) => {
    setKhutbahs(prev => prev.map(k => 
      k.id === id ? { ...k, likes: k.likes + 1 } : k
    ));
    toast.success("Khutbah liked");
  };

  return (
    <PageLayout 
      title="Khutbah Collection" 
      subtitle="Listen to inspiring Friday sermons and special occasion speeches"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Islamic Guidance</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Khutbah Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access our comprehensive collection of Friday sermons, Eid khutbahs, and special occasion speeches 
            delivered by our respected imams and scholars.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search khutbahs, imams, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {languages.map(language => (
              <option key={language.value} value={language.value}>{language.label}</option>
            ))}
          </select>
        </div>

        {/* Featured Khutbahs */}
        {featuredKhutbahs.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <Star className="text-amber-500" size={24} />
              Featured Khutbahs
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredKhutbahs.map((khutbah, index) => (
                <div 
                  key={khutbah.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-xs", getCategoryColor(khutbah.category))}>
                          {khutbah.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {khutbah.language}
                        </Badge>
                      </div>
                      <h3 className="font-display text-xl mb-2">{khutbah.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{khutbah.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {khutbah.imam}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(khutbah.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {khutbah.duration}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {khutbah.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {khutbah.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {khutbah.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark size={14} />
                        {khutbah.bookmarks}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlay(khutbah.id)}
                        className="gap-1"
                      >
                        {playingId === khutbah.id ? <Pause size={14} /> : <Play size={14} />}
                        {playingId === khutbah.id ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookmark(khutbah.id)}
                        className="gap-1"
                      >
                        <Bookmark size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLike(khutbah.id)}
                        className="gap-1"
                      >
                        <Heart size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Khutbahs */}
        <div>
          <h2 className="text-2xl font-display mb-6">All Khutbahs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularKhutbahs.map((khutbah, index) => (
              <div 
                key={khutbah.id}
                className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={cn("text-xs", getCategoryColor(khutbah.category))}>
                    {khutbah.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {khutbah.language}
                  </Badge>
                </div>
                
                <h3 className="font-display text-lg mb-2">{khutbah.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{khutbah.description}</p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {khutbah.imam}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {khutbah.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{khutbah.views} views</span>
                    <span>{khutbah.likes} likes</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlay(khutbah.id)}
                    className="gap-1"
                  >
                    {playingId === khutbah.id ? <Pause size={12} /> : <Play size={12} />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredKhutbahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Khutbahs Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more khutbahs.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}