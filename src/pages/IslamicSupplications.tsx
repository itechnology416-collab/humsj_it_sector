import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Search, 
  Star, 
  Play,
  Pause,
  Volume2,
  Share2,
  Download,
  BookOpen,
  Clock,
  Calendar,
  Filter,
  Bookmark,
  Copy,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface Supplication {
  id: string;
  title: string;
  arabic_text: string;
  transliteration: string;
  english_translation: string;
  category: string;
  occasion: string;
  source: string;
  benefits: string[];
  audio_url?: string;
  times_to_recite?: number;
  best_time?: string;
  difficulty_level: 'easy' | 'medium' | 'advanced';
  is_favorite: boolean;
}

const mockSupplications: Supplication[] = [
  {
    id: '1',
    title: 'Morning Dhikr - Ayat al-Kursi',
    arabic_text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    transliteration: 'Allahu la ilaha illa huwa al-hayyu al-qayyum, la ta\'khudhuhu sinatun wa la nawm',
    english_translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.',
    category: 'Morning Adhkar',
    occasion: 'Daily Morning',
    source: 'Quran 2:255',
    benefits: ['Protection from evil', 'Spiritual strength', 'Divine blessings'],
    audio_url: 'https://example.com/audio/ayat-kursi.mp3',
    times_to_recite: 1,
    best_time: 'After Fajr prayer',
    difficulty_level: 'easy',
    is_favorite: true
  },
  {
    id: '2',
    title: 'Evening Protection Dua',
    arabic_text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bi kalimat Allah at-tammat min sharri ma khalaq',
    english_translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
    category: 'Evening Adhkar',
    occasion: 'Daily Evening',
    source: 'Sahih Muslim',
    benefits: ['Protection from harm', 'Peace of mind', 'Safety during night'],
    audio_url: 'https://example.com/audio/evening-protection.mp3',
    times_to_recite: 3,
    best_time: 'After Maghrib prayer',
    difficulty_level: 'easy',
    is_favorite: false
  },
  {
    id: '3',
    title: 'Dua for Seeking Knowledge',
    arabic_text: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    transliteration: 'Rabbi zidni \'ilman warzuqni fahman',
    english_translation: 'My Lord, increase me in knowledge and grant me understanding',
    category: 'Study & Learning',
    occasion: 'Before studying',
    source: 'Quran 20:114 (adapted)',
    benefits: ['Enhanced learning', 'Better understanding', 'Academic success'],
    audio_url: 'https://example.com/audio/knowledge-dua.mp3',
    times_to_recite: 7,
    best_time: 'Before studying',
    difficulty_level: 'easy',
    is_favorite: true
  },
  {
    id: '4',
    title: 'Dua for Anxiety Relief',
    arabic_text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ',
    transliteration: 'Allahumma inni a\'udhu bika min al-hammi wal-hazan wal-\'ajzi wal-kasal',
    english_translation: 'O Allah, I seek refuge in You from anxiety, grief, incapacity, and laziness',
    category: 'Emotional Healing',
    occasion: 'When feeling anxious',
    source: 'Sahih Bukhari',
    benefits: ['Anxiety relief', 'Emotional peace', 'Mental clarity'],
    audio_url: 'https://example.com/audio/anxiety-relief.mp3',
    times_to_recite: 3,
    best_time: 'Anytime needed',
    difficulty_level: 'medium',
    is_favorite: false
  }
];

const categories = ['All Categories', 'Morning Adhkar', 'Evening Adhkar', 'Study & Learning', 'Emotional Healing', 'Travel', 'Health', 'Forgiveness'];
const occasions = ['All Occasions', 'Daily Morning', 'Daily Evening', 'Before studying', 'When feeling anxious', 'Before travel', 'When sick'];

export default function IslamicSupplications() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedOccasion, setSelectedOccasion] = useState('All Occasions');
  const [supplications, setSupplications] = useState<Supplication[]>(mockSupplications);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('supplications-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredSupplications = supplications.filter(supplication => {
    const matchesSearch = !searchQuery || 
      supplication.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplication.arabic_text.includes(searchQuery) ||
      supplication.english_translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplication.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || supplication.category === selectedCategory;
    const matchesOccasion = selectedOccasion === 'All Occasions' || supplication.occasion === selectedOccasion;
    
    return matchesSearch && matchesCategory && matchesOccasion;
  });

  const toggleFavorite = (supplicationId: string) => {
    const newFavorites = favorites.includes(supplicationId)
      ? favorites.filter(id => id !== supplicationId)
      : [...favorites, supplicationId];
    
    setFavorites(newFavorites);
    localStorage.setItem('supplications-favorites', JSON.stringify(newFavorites));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500/20 text-green-600';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Supplications" 
      subtitle="Comprehensive collection of authentic Islamic duas and dhikr"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Supplications & Dhikr</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect with Allah through authentic prayers and remembrance
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Heart size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{supplications.length}+ Duas</p>
                <p className="text-xs text-muted-foreground">Authentic collection</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Volume2 size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Audio Support</p>
                <p className="text-xs text-muted-foreground">Listen & learn</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Multiple Categories</p>
                <p className="text-xs text-muted-foreground">Organized collection</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Star size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Favorites</p>
                <p className="text-xs text-muted-foreground">Personal collection</p>
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
                  placeholder="Search duas, Arabic text, or translations..."
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
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSupplications.map((supplication, index) => (
            <Card 
              key={supplication.id}
              className="hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {supplication.category}
                      </Badge>
                      <Badge className={cn("text-xs", getDifficultyColor(supplication.difficulty_level))}>
                        {supplication.difficulty_level}
                      </Badge>
                      {supplication.times_to_recite && (
                        <Badge variant="secondary" className="text-xs">
                          {supplication.times_to_recite}x
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{supplication.title}</h3>
                    
                    <div className="space-y-3">
                      <div className="text-right">
                        <p className="text-xl font-arabic leading-relaxed" dir="rtl">
                          {supplication.arabic_text}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground italic mb-1">
                          {supplication.transliteration}
                        </p>
                        <p className="text-sm font-medium">
                          {supplication.english_translation}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(supplication.id)}
                      className={cn(
                        "w-8 h-8 p-0",
                        favorites.includes(supplication.id) && "text-red-500"
                      )}
                    >
                      <Heart size={16} className={favorites.includes(supplication.id) ? "fill-current" : ""} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(supplication.arabic_text, supplication.id)}
                      className="w-8 h-8 p-0"
                    >
                      {copiedId === supplication.id ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Benefits */}
                  {supplication.benefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Star size={14} />
                        Benefits
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {supplication.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Occasion and Best Time */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{supplication.occasion}</span>
                    </div>
                    {supplication.best_time && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{supplication.best_time}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      {supplication.audio_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPlayingAudio(playingAudio === supplication.id ? null : supplication.id)}
                          className="text-xs gap-1"
                        >
                          {playingAudio === supplication.id ? (
                            <>
                              <Pause size={12} />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play size={12} />
                              Play
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        <Share2 size={12} />
                        Share
                      </Button>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {supplication.source}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSupplications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No supplications found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="dua" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}