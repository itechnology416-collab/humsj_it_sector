import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  Search, 
  Heart, 
  Play,
  Pause,
  Volume2,
  Share2,
  BookOpen,
  Lightbulb,
  Crown,
  Sparkles,
  Eye,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface AsmaUlHusna {
  id: number;
  arabic: string;
  transliteration: string;
  english_meaning: string;
  detailed_meaning: string;
  quranic_reference?: string;
  benefits: string[];
  dhikr_count: number;
  category: string;
  pronunciation_guide: string;
  related_attributes: string[];
  audio_url?: string;
}

const asmaUlHusna: AsmaUlHusna[] = [
  {
    id: 1,
    arabic: "الرَّحْمَنُ",
    transliteration: "Ar-Rahman",
    english_meaning: "The Most Merciful",
    detailed_meaning: "The One who shows mercy to all creation without exception. His mercy encompasses everything in existence.",
    quranic_reference: "Quran 1:3",
    benefits: ["Increases compassion", "Brings divine mercy", "Softens the heart"],
    dhikr_count: 100,
    category: "Mercy & Compassion",
    pronunciation_guide: "Ar-Rah-maan",
    related_attributes: ["Ar-Raheem", "Al-Ghafoor", "At-Tawwab"],
    audio_url: "https://example.com/audio/ar-rahman.mp3"
  },
  {
    id: 2,
    arabic: "الرَّحِيمُ",
    transliteration: "Ar-Raheem",
    english_meaning: "The Most Compassionate",
    detailed_meaning: "The One who shows special mercy to the believers. His compassion is specifically directed towards those who believe.",
    quranic_reference: "Quran 1:3",
    benefits: ["Spiritual comfort", "Divine forgiveness", "Inner peace"],
    dhikr_count: 100,
    category: "Mercy & Compassion",
    pronunciation_guide: "Ar-Ra-heem",
    related_attributes: ["Ar-Rahman", "Al-Ghafoor", "Ar-Ra'oof"],
    audio_url: "https://example.com/audio/ar-raheem.mp3"
  },
  {
    id: 3,
    arabic: "الْمَلِكُ",
    transliteration: "Al-Malik",
    english_meaning: "The King",
    detailed_meaning: "The absolute Sovereign who owns everything and has complete authority over all creation.",
    quranic_reference: "Quran 59:23",
    benefits: ["Increases dignity", "Brings leadership qualities", "Strengthens authority"],
    dhikr_count: 100,
    category: "Sovereignty & Power",
    pronunciation_guide: "Al-Ma-lik",
    related_attributes: ["Al-Hakeem", "Al-Aziz", "Al-Qahhar"],
    audio_url: "https://example.com/audio/al-malik.mp3"
  },
  {
    id: 4,
    arabic: "الْقُدُّوسُ",
    transliteration: "Al-Quddus",
    english_meaning: "The Most Holy",
    detailed_meaning: "The One who is pure and free from all imperfections, defects, and anything that diminishes His perfection.",
    quranic_reference: "Quran 59:23",
    benefits: ["Purifies the soul", "Increases spirituality", "Removes sins"],
    dhikr_count: 100,
    category: "Purity & Perfection",
    pronunciation_guide: "Al-Qud-doos",
    related_attributes: ["As-Sabbooh", "At-Tayyib", "An-Noor"],
    audio_url: "https://example.com/audio/al-quddus.mp3"
  },
  {
    id: 5,
    arabic: "السَّلَامُ",
    transliteration: "As-Salaam",
    english_meaning: "The Source of Peace",
    detailed_meaning: "The One who is free from all defects and the source of peace and safety for all creation.",
    quranic_reference: "Quran 59:23",
    benefits: ["Brings inner peace", "Removes anxiety", "Provides safety"],
    dhikr_count: 100,
    category: "Peace & Safety",
    pronunciation_guide: "As-Sa-laam",
    related_attributes: ["Al-Hakeem", "Ar-Rasheed", "Al-Latif"],
    audio_url: "https://example.com/audio/as-salaam.mp3"
  },
  {
    id: 6,
    arabic: "الْمُؤْمِنُ",
    transliteration: "Al-Mu'min",
    english_meaning: "The Giver of Security",
    detailed_meaning: "The One who grants security and removes fear, who is trustworthy and keeps His promises.",
    quranic_reference: "Quran 59:23",
    benefits: ["Increases faith", "Provides security", "Strengthens trust"],
    dhikr_count: 100,
    category: "Faith & Security",
    pronunciation_guide: "Al-Mu'-min",
    related_attributes: ["Al-Wakeel", "Al-Hafiz", "Ar-Raqeeb"],
    audio_url: "https://example.com/audio/al-mumin.mp3"
  }
];

const categories = [
  'All Categories',
  'Mercy & Compassion',
  'Sovereignty & Power', 
  'Purity & Perfection',
  'Peace & Safety',
  'Faith & Security',
  'Knowledge & Wisdom',
  'Creation & Sustenance'
];

export default function NamesOfAllah() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<AsmaUlHusna | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('asma-ul-husna-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Auto-rotate through names every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % asmaUlHusna.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredNames = asmaUlHusna.filter(name => {
    const matchesSearch = !searchQuery || 
      name.arabic.includes(searchQuery) ||
      name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.english_meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.detailed_meaning.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || name.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (nameId: number) => {
    const newFavorites = favorites.includes(nameId)
      ? favorites.filter(id => id !== nameId)
      : [...favorites, nameId];
    
    setFavorites(newFavorites);
    localStorage.setItem('asma-ul-husna-favorites', JSON.stringify(newFavorites));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mercy & Compassion': return Heart;
      case 'Sovereignty & Power': return Crown;
      case 'Purity & Perfection': return Sparkles;
      case 'Peace & Safety': return Shield;
      case 'Faith & Security': return Star;
      case 'Knowledge & Wisdom': return Lightbulb;
      case 'Creation & Sustenance': return Globe;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mercy & Compassion': return 'from-pink-500 to-rose-500';
      case 'Sovereignty & Power': return 'from-purple-500 to-violet-500';
      case 'Purity & Perfection': return 'from-blue-500 to-cyan-500';
      case 'Peace & Safety': return 'from-green-500 to-emerald-500';
      case 'Faith & Security': return 'from-yellow-500 to-amber-500';
      case 'Knowledge & Wisdom': return 'from-orange-500 to-red-500';
      case 'Creation & Sustenance': return 'from-indigo-500 to-purple-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const currentName = asmaUlHusna[currentIndex];

  return (
    <ProtectedPageLayout 
      title="99 Names of Allah" 
      subtitle="Asma ul-Husna - The Most Beautiful Names of Allah"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Featured Name Display */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <CardHeader className="text-center relative z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-white" />
            </div>
            <CardTitle className="text-3xl font-display mb-2">
              Asma ul-Husna
            </CardTitle>
            <p className="text-muted-foreground">
              The 99 Most Beautiful Names of Allah
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Current Name Display */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border/30">
              <div className="space-y-4">
                <Badge className="text-sm px-4 py-1">
                  {currentName.id}/99
                </Badge>
                
                <div className="space-y-3">
                  <h2 className="text-4xl font-arabic text-primary" dir="rtl">
                    {currentName.arabic}
                  </h2>
                  <p className="text-2xl font-semibold text-secondary">
                    {currentName.transliteration}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {currentName.english_meaning}
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentName.detailed_meaning}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(currentName.id)}
                    className={cn(
                      "gap-2",
                      favorites.includes(currentName.id) && "text-red-500 border-red-500"
                    )}
                  >
                    <Heart size={16} className={favorites.includes(currentName.id) ? "fill-current" : ""} />
                    {favorites.includes(currentName.id) ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  {currentName.audio_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlayingAudio(playingAudio === currentName.id ? null : currentName.id)}
                      className="gap-2"
                    >
                      {playingAudio === currentName.id ? (
                        <>
                          <Pause size={16} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Listen
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex justify-center gap-1">
              {Array.from({ length: Math.min(asmaUlHusna.length, 10) }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex % 10 ? "bg-primary scale-125" : "bg-border"
                  )}
                />
              ))}
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
                  placeholder="Search by Arabic, transliteration, or meaning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[180px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Names Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNames.map((name, index) => {
            const CategoryIcon = getCategoryIcon(name.category);
            
            return (
              <Card 
                key={name.id}
                className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedName(name)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          #{name.id}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {name.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-arabic text-primary group-hover:scale-105 transition-transform" dir="rtl">
                          {name.arabic}
                        </h3>
                        <p className="text-lg font-semibold text-secondary">
                          {name.transliteration}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {name.english_meaning}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(name.id);
                        }}
                        className={cn(
                          "w-8 h-8 p-0",
                          favorites.includes(name.id) && "text-red-500"
                        )}
                      >
                        <Heart size={16} className={favorites.includes(name.id) ? "fill-current" : ""} />
                      </Button>
                      
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getCategoryColor(name.category)} flex items-center justify-center`}>
                        <CategoryIcon size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {name.detailed_meaning}
                    </p>
                    
                    {name.quranic_reference && (
                      <Badge variant="outline" className="text-xs">
                        {name.quranic_reference}
                      </Badge>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap size={12} />
                        {name.dhikr_count}x recommended
                      </span>
                      {name.audio_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingAudio(playingAudio === name.id ? null : name.id);
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <Volume2 size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Name Detail Modal */}
        {selectedName && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-center flex-1">
                    <Badge className="mb-4">#{selectedName.id}/99</Badge>
                    <h2 className="text-4xl font-arabic text-primary mb-2" dir="rtl">
                      {selectedName.arabic}
                    </h2>
                    <p className="text-2xl font-semibold text-secondary mb-1">
                      {selectedName.transliteration}
                    </p>
                    <p className="text-lg text-muted-foreground mb-4">
                      {selectedName.english_meaning}
                    </p>
                    <Badge variant="secondary">
                      {selectedName.category}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedName(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Detailed Meaning */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen size={16} />
                    Detailed Meaning
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedName.detailed_meaning}
                  </p>
                </div>
                
                {/* Pronunciation Guide */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Volume2 size={16} />
                    Pronunciation
                  </h4>
                  <p className="text-muted-foreground font-mono">
                    {selectedName.pronunciation_guide}
                  </p>
                </div>
                
                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Star size={16} />
                    Spiritual Benefits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedName.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Related Attributes */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles size={16} />
                    Related Names
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedName.related_attributes.map((attr, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Quranic Reference */}
                {selectedName.quranic_reference && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Quranic Reference
                    </h4>
                    <Badge variant="outline">
                      {selectedName.quranic_reference}
                    </Badge>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => toggleFavorite(selectedName.id)}
                    variant={favorites.includes(selectedName.id) ? "default" : "outline"}
                    className="flex-1 gap-2"
                  >
                    <Heart size={16} className={favorites.includes(selectedName.id) ? "fill-current" : ""} />
                    {favorites.includes(selectedName.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  {selectedName.audio_url && (
                    <Button
                      variant="outline"
                      onClick={() => setPlayingAudio(playingAudio === selectedName.id ? null : selectedName.id)}
                      className="gap-2"
                    >
                      {playingAudio === selectedName.id ? (
                        <>
                          <Pause size={16} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Listen
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button variant="outline" className="gap-2">
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredNames.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Star size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No names found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="fact" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}