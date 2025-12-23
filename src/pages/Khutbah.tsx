import React, { useState } from "react";
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
  Share2,
  Heart,
  MessageCircle,
  Search,
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
    description: 'A powerful reminder about the importance of unity among Muslims and how it strengthens our community. Based on Quran 3:103 and authentic Hadith about brotherhood.',
    audioUrl: '/audio/khutbah/unity-in-islam.mp3',
    videoUrl: '/video/khutbah/unity-in-islam.mp4',
    transcript: 'Full transcript available with Arabic text and English translation...',
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
    description: 'Exploring the Islamic perspective on education and the pursuit of knowledge in both religious and worldly matters. References Hadith: "Seek knowledge from the cradle to the grave."',
    audioUrl: '/audio/khutbah/seeking-knowledge.mp3',
    transcript: 'Complete khutbah transcript with Quranic verses and Hadith references...',
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
    description: 'Guidance on how to spiritually and physically prepare for the blessed month of Ramadan. Includes authentic Hadith about fasting and spiritual purification.',
    audioUrl: '/audio/khutbah/ramadan-preparation.mp3',
    videoUrl: '/video/khutbah/ramadan-preparation.mp4',
    transcript: 'Full Ramadan preparation guide with Quranic verses and prophetic traditions...',
    views: 2100,
    likes: 156,
    bookmarks: 78,
    tags: ['Ramadan', 'Fasting', 'Spirituality', 'Preparation'],
    language: 'english',
    featured: true
  },
  {
    id: '4',
    title: 'The Character of Prophet Muhammad (PBUH)',
    imam: 'Sheikh Abdullah Yusuf',
    date: '2024-12-06',
    duration: '32:20',
    topic: 'Prophetic Character and Morals',
    category: 'friday',
    description: 'An in-depth exploration of the noble character of Prophet Muhammad (PBUH) based on authentic Hadith from Sahih Bukhari and Muslim. Learn how to embody his teachings.',
    audioUrl: '/audio/khutbah/prophetic-character.mp3',
    videoUrl: '/video/khutbah/prophetic-character.mp4',
    transcript: 'Detailed analysis of prophetic character with authentic Hadith references and practical applications...',
    views: 1890,
    likes: 142,
    bookmarks: 89,
    tags: ['Prophet', 'Character', 'Sunnah', 'Morals', 'Hadith'],
    language: 'english',
    featured: true
  },
  {
    id: '5',
    title: 'Patience in Times of Trial',
    imam: 'Dr. Maryam Hassan',
    date: '2024-11-29',
    duration: '27:15',
    topic: 'Sabr and Perseverance',
    category: 'friday',
    description: 'Understanding the concept of Sabr (patience) in Islam through Quranic verses and Hadith. How to maintain faith during difficult times with authentic Islamic guidance.',
    audioUrl: '/audio/khutbah/patience-trials.mp3',
    transcript: 'Complete guide to Islamic patience with Quranic verses, Hadith, and real-life applications...',
    views: 1456,
    likes: 98,
    bookmarks: 67,
    tags: ['Patience', 'Sabr', 'Trials', 'Faith', 'Perseverance'],
    language: 'english',
    featured: false
  },
  {
    id: '6',
    title: 'The Rights of Parents in Islam',
    imam: 'Imam Hassan Ali',
    date: '2024-11-22',
    duration: '29:40',
    topic: 'Family Relations and Duties',
    category: 'friday',
    description: 'Comprehensive discussion on the rights of parents based on Quran 17:23-24 and authentic Hadith. Includes practical guidance for modern Muslim families.',
    audioUrl: '/audio/khutbah/parents-rights.mp3',
    videoUrl: '/video/khutbah/parents-rights.mp4',
    transcript: 'Full transcript with Quranic verses, authentic Hadith, and practical family guidance...',
    views: 2340,
    likes: 187,
    bookmarks: 123,
    tags: ['Parents', 'Family', 'Rights', 'Respect', 'Quran'],
    language: 'english',
    featured: false
  },
  {
    id: '7',
    title: 'Eid al-Fitr: Celebration and Gratitude',
    imam: 'Sheikh Muhammad Abdullahi',
    date: '2024-04-10',
    duration: '35:15',
    topic: 'Eid Celebration and Islamic Joy',
    category: 'eid',
    description: 'Special Eid khutbah focusing on gratitude, charity, and community celebration. Based on authentic Hadith about Eid traditions and the spirit of giving.',
    audioUrl: '/audio/khutbah/eid-fitr-celebration.mp3',
    videoUrl: '/video/khutbah/eid-fitr-celebration.mp4',
    transcript: 'Complete Eid khutbah with traditional prayers, Hadith references, and celebration guidelines...',
    views: 3200,
    likes: 245,
    bookmarks: 156,
    tags: ['Eid', 'Celebration', 'Gratitude', 'Charity', 'Community'],
    language: 'english',
    featured: true
  },
  {
    id: '8',
    title: 'The Night of Power (Laylat al-Qadr)',
    imam: 'Dr. Aisha Ibrahim',
    date: '2024-04-05',
    duration: '26:30',
    topic: 'The Blessed Night',
    category: 'ramadan',
    description: 'Deep exploration of Laylat al-Qadr based on Quran 97:1-5 and authentic Hadith. Guidance on worship, supplication, and seeking this blessed night.',
    audioUrl: '/audio/khutbah/laylat-qadr.mp3',
    transcript: 'Comprehensive guide to the Night of Power with Quranic verses, Hadith, and worship practices...',
    views: 1876,
    likes: 134,
    bookmarks: 98,
    tags: ['Laylat al-Qadr', 'Night of Power', 'Ramadan', 'Worship', 'Quran'],
    language: 'english',
    featured: false
  },
  {
    id: '9',
    title: 'Justice and Fairness in Islam',
    imam: 'Sheikh Omar Faruq',
    date: '2024-11-15',
    duration: '31:45',
    topic: 'Islamic Justice and Equity',
    category: 'friday',
    description: 'Exploring the concept of justice in Islam through Quranic teachings and prophetic traditions. Includes authentic Hadith about fairness and social responsibility.',
    audioUrl: '/audio/khutbah/islamic-justice.mp3',
    videoUrl: '/video/khutbah/islamic-justice.mp4',
    transcript: 'Complete discussion on Islamic justice with Quranic verses, Hadith, and contemporary applications...',
    views: 1654,
    likes: 112,
    bookmarks: 78,
    tags: ['Justice', 'Fairness', 'Equity', 'Social Responsibility', 'Hadith'],
    language: 'english',
    featured: false
  },
  {
    id: '10',
    title: 'The Importance of Salah in Daily Life',
    imam: 'Imam Yusuf Ahmed',
    date: '2024-11-08',
    duration: '28:20',
    topic: 'Prayer and Spiritual Connection',
    category: 'friday',
    description: 'Understanding the significance of the five daily prayers through Quranic verses and authentic Hadith. Practical guidance for maintaining consistent prayer habits.',
    audioUrl: '/audio/khutbah/importance-salah.mp3',
    transcript: 'Detailed guide to Salah with Quranic foundations, Hadith references, and practical tips...',
    views: 2145,
    likes: 167,
    bookmarks: 134,
    tags: ['Salah', 'Prayer', 'Worship', 'Spirituality', 'Daily Life'],
    language: 'english',
    featured: false
  },
  {
    id: '11',
    title: 'خطبة الجمعة: التوحيد والإيمان',
    imam: 'الشيخ محمد العربي',
    date: '2024-12-13',
    duration: '24:15',
    topic: 'التوحيد والإيمان بالله',
    category: 'friday',
    description: 'خطبة باللغة العربية حول أهمية التوحيد والإيمان بالله الواحد الأحد، مع الاستشهاد بالآيات القرآنية والأحاديث النبوية الصحيحة.',
    audioUrl: '/audio/khutbah/tawheed-arabic.mp3',
    transcript: 'النص الكامل للخطبة مع الآيات القرآنية والأحاديث النبوية الشريفة...',
    views: 987,
    likes: 76,
    bookmarks: 45,
    tags: ['التوحيد', 'الإيمان', 'العقيدة', 'القرآن', 'الحديث'],
    language: 'arabic',
    featured: false
  },
  {
    id: '12',
    title: 'Khutbaa Guyyaa Jimaataa: Haqaa fi Amantaa',
    imam: 'Sheekh Abdullahi Gammachuu',
    date: '2024-12-06',
    duration: '26:45',
    topic: 'Haqaa fi Amantaa Islaamaa',
    category: 'friday',
    description: 'Khutbaan kun afaan Oromootiin kan dubbatame yoo ta\'u, waa\'ee haqaa fi amantaa Islaamaa irratti xiyyeeffata. Qur\'aana fi Hadiisoota sahiiha irraa fudhatame.',
    audioUrl: '/audio/khutbah/truth-faith-oromo.mp3',
    transcript: 'Barreeffamni guutuu khutbaa kanaa Qur\'aana fi Hadiisota wajjin...',
    views: 654,
    likes: 43,
    bookmarks: 28,
    tags: ['Haqaa', 'Amantaa', 'Islaam', 'Qur\'aan', 'Hadiis'],
    language: 'oromo',
    featured: false
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