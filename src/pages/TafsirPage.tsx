import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Star, 
  Heart,
  Share2,
  Download,
  Play,
  Volume2,
  Globe,
  User,
  Calendar,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface TafsirEntry {
  id: string;
  verse_key: string;
  chapter_name: string;
  verse_number: number;
  arabic_text: string;
  translation: string;
  tafsir_text: string;
  scholar: string;
  source: string;
  language: string;
  audio_url?: string;
  tags: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

const mockTafsirData: TafsirEntry[] = [
  {
    id: '1',
    verse_key: '1:1',
    chapter_name: 'Al-Fatihah',
    verse_number: 1,
    arabic_text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    tafsir_text: 'This verse is known as the Basmalah. It begins with "Bism" meaning "in the name of," followed by "Allah," the proper name of God in Arabic. Ar-Rahman and Ar-Raheem are two of the most beautiful names of Allah, both derived from the root r-h-m, relating to mercy and compassion.',
    scholar: 'Ibn Kathir',
    source: 'Tafsir Ibn Kathir',
    language: 'English',
    audio_url: 'https://example.com/audio/1-1.mp3',
    tags: ['Basmalah', 'Names of Allah', 'Mercy'],
    difficulty_level: 'beginner',
    created_at: '2024-01-01'
  },
  {
    id: '2',
    verse_key: '2:255',
    chapter_name: 'Al-Baqarah',
    verse_number: 255,
    arabic_text: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    tafsir_text: 'This is Ayat al-Kursi, one of the most powerful verses in the Quran. It describes the absolute oneness and sovereignty of Allah. "Al-Hayy" means the Ever-Living, indicating that Allah\'s life is perfect and eternal. "Al-Qayyum" means the Self-Sustaining, showing that Allah maintains and sustains all of creation.',
    scholar: 'Al-Tabari',
    source: 'Tafsir al-Tabari',
    language: 'English',
    audio_url: 'https://example.com/audio/2-255.mp3',
    tags: ['Ayat al-Kursi', 'Tawheed', 'Names of Allah'],
    difficulty_level: 'intermediate',
    created_at: '2024-01-02'
  }
];

const scholars = ['All Scholars', 'Ibn Kathir', 'Al-Tabari', 'Al-Qurtubi', 'As-Sa\'di', 'Ibn Abbas'];
const difficultyLevels = ['All Levels', 'beginner', 'intermediate', 'advanced'];

export default function TafsirPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholar, setSelectedScholar] = useState('All Scholars');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [tafsirEntries, setTafsirEntries] = useState<TafsirEntry[]>(mockTafsirData);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<TafsirEntry | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('tafsir-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredEntries = tafsirEntries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.arabic_text.includes(searchQuery) ||
      entry.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tafsir_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.chapter_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesScholar = selectedScholar === 'All Scholars' || entry.scholar === selectedScholar;
    const matchesLevel = selectedLevel === 'All Levels' || entry.difficulty_level === selectedLevel;
    
    return matchesSearch && matchesScholar && matchesLevel;
  });

  const toggleFavorite = (entryId: string) => {
    const newFavorites = favorites.includes(entryId)
      ? favorites.filter(id => id !== entryId)
      : [...favorites, entryId];
    
    setFavorites(newFavorites);
    localStorage.setItem('tafsir-favorites', JSON.stringify(newFavorites));
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedPageLayout 
      title="Quran Tafsir" 
      subtitle="Explore detailed commentary and interpretation of the Holy Quran"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Quran Tafsir & Commentary</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Deepen your understanding with scholarly interpretations
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{tafsirEntries.length}+ Verses</p>
                <p className="text-xs text-muted-foreground">With commentary</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Classical Scholars</p>
                <p className="text-xs text-muted-foreground">Authentic sources</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Volume2 size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Audio Support</p>
                <p className="text-xs text-muted-foreground">Listen & learn</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Globe size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Multi-language</p>
                <p className="text-xs text-muted-foreground">Global access</p>
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
                  placeholder="Search verses, commentary, or chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedScholar}
                  onChange={(e) => setSelectedScholar(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {scholars.map(scholar => (
                    <option key={scholar} value={scholar}>{scholar}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tafsir Entries */}
        <div className="grid grid-cols-1 gap-6">
          {filteredEntries.map((entry, index) => (
            <Card 
              key={entry.id}
              className="hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.chapter_name} {entry.verse_number}
                      </Badge>
                      <Badge className={cn("text-xs", getDifficultyColor(entry.difficulty_level))}>
                        {entry.difficulty_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entry.scholar}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-right">
                        <p className="text-2xl font-arabic leading-relaxed" dir="rtl">
                          {entry.arabic_text}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-lg font-medium text-primary">
                          {entry.translation}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(entry.id)}
                      className={cn(
                        "w-8 h-8 p-0",
                        favorites.includes(entry.id) && "text-red-500"
                      )}
                    >
                      <Heart size={16} className={favorites.includes(entry.id) ? "fill-current" : ""} />
                    </Button>
                    
                    {entry.audio_url && (
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Play size={16} />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <BookOpen size={14} />
                      Commentary ({entry.source})
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.tafsir_text}
                    </p>
                  </div>
                  
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {entry.scholar}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEntry(entry)}
                      className="text-xs"
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tafsir entries found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
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