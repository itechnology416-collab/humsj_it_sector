import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Baby, 
  Search, 
  Heart,
  Star,
  Filter,
  BookOpen,
  User,
  Users,
  Crown,
  Sparkles,
  Copy,
  Share2,
  Bookmark,
  Eye,
  TrendingUp,
  Globe,
  Volume2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IslamicName {
  id: string;
  name: string;
  arabicName: string;
  meaning: string;
  origin: string;
  gender: 'male' | 'female' | 'unisex';
  category: 'prophetic' | 'quranic' | 'companions' | 'attributes' | 'traditional';
  popularity: number;
  pronunciation: string;
  variations: string[];
  famousPersons: string[];
  significance?: string;
  references?: string[];
  isFavorite: boolean;
  views: number;
}

const mockNames: IslamicName[] = [
  {
    id: '1',
    name: 'Muhammad',
    arabicName: 'مُحَمَّد',
    meaning: 'Praised, Praiseworthy',
    origin: 'Arabic',
    gender: 'male',
    category: 'prophetic',
    popularity: 100,
    pronunciation: 'Mu-HAM-mad',
    variations: ['Ahmed', 'Mahmud', 'Hamid'],
    famousPersons: ['Prophet Muhammad (PBUH)', 'Muhammad Ali', 'Muhammad ibn Abd al-Wahhab'],
    significance: 'The name of the final Prophet and Messenger of Allah',
    references: ['Quran 47:2', 'Sahih Bukhari'],
    isFavorite: true,
    views: 15420
  },
  {
    id: '2',
    name: 'Aisha',
    arabicName: 'عَائِشَة',
    meaning: 'Living, Alive, Prosperous',
    origin: 'Arabic',
    gender: 'female',
    category: 'companions',
    popularity: 95,
    pronunciation: 'AH-ee-shah',
    variations: ['Aishah', 'Ayesha', 'Aysha'],
    famousPersons: ['Aisha bint Abu Bakr (RA)', 'Aisha Abdel Rahman'],
    significance: 'Name of the beloved wife of Prophet Muhammad (PBUH)',
    references: ['Sahih Bukhari', 'Sahih Muslim'],
    isFavorite: true,
    views: 12850
  },
  {
    id: '3',
    name: 'Abdullah',
    arabicName: 'عَبْدُ ٱللَّٰه',
    meaning: 'Servant of Allah',
    origin: 'Arabic',
    gender: 'male',
    category: 'attributes',
    popularity: 90,
    pronunciation: 'Ab-dul-LAH',
    variations: ['Abdul', 'Abdallah', 'Abdollah'],
    famousPersons: ['Abdullah ibn Abbas (RA)', 'Abdullah ibn Umar (RA)'],
    significance: 'Expresses servitude and devotion to Allah',
    references: ['Quran (multiple verses)', 'Hadith collections'],
    isFavorite: false,
    views: 11200
  },
  {
    id: '4',
    name: 'Fatima',
    arabicName: 'فَاطِمَة',
    meaning: 'One who abstains, Captivating',
    origin: 'Arabic',
    gender: 'female',
    category: 'prophetic',
    popularity: 88,
    pronunciation: 'FAH-ti-mah',
    variations: ['Fatimah', 'Fatma', 'Fatime'],
    famousPersons: ['Fatima bint Muhammad (RA)', 'Fatima al-Zahra'],
    significance: 'Name of the beloved daughter of Prophet Muhammad (PBUH)',
    references: ['Sahih Bukhari', 'Tirmidhi'],
    isFavorite: true,
    views: 10950
  },
  {
    id: '5',
    name: 'Ibrahim',
    arabicName: 'إِبْرَاهِيم',
    meaning: 'Father of many, Friend of Allah',
    origin: 'Hebrew/Arabic',
    gender: 'male',
    category: 'prophetic',
    popularity: 85,
    pronunciation: 'Ib-ra-HEEM',
    variations: ['Abraham', 'Brahim', 'Ebrahim'],
    famousPersons: ['Prophet Ibrahim (AS)', 'Ibrahim ibn Adham'],
    significance: 'Name of the great Prophet and friend of Allah',
    references: ['Quran 2:124', 'Quran 4:125'],
    isFavorite: false,
    views: 9800
  },
  {
    id: '6',
    name: 'Khadija',
    arabicName: 'خَدِيجَة',
    meaning: 'Premature child, Early baby',
    origin: 'Arabic',
    gender: 'female',
    category: 'companions',
    popularity: 82,
    pronunciation: 'Kha-DEE-jah',
    variations: ['Khadijah', 'Hadija', 'Cadija'],
    famousPersons: ['Khadija bint Khuwaylid (RA)'],
    significance: 'Name of the first wife of Prophet Muhammad (PBUH)',
    references: ['Sahih Bukhari', 'Ibn Ishaq'],
    isFavorite: true,
    views: 8750
  },
  {
    id: '7',
    name: 'Omar',
    arabicName: 'عُمَر',
    meaning: 'Long-lived, Flourishing',
    origin: 'Arabic',
    gender: 'male',
    category: 'companions',
    popularity: 80,
    pronunciation: 'OH-mar',
    variations: ['Umar', 'Omer', 'Omair'],
    famousPersons: ['Umar ibn al-Khattab (RA)', 'Umar ibn Abd al-Aziz'],
    significance: 'Name of the second Caliph of Islam',
    references: ['Sahih Bukhari', 'Sahih Muslim'],
    isFavorite: false,
    views: 8200
  },
  {
    id: '8',
    name: 'Zainab',
    arabicName: 'زَيْنَب',
    meaning: 'Fragrant flower, Beauty of the father',
    origin: 'Arabic',
    gender: 'female',
    category: 'prophetic',
    popularity: 78,
    pronunciation: 'ZAY-nab',
    variations: ['Zaynab', 'Zinab', 'Zenab'],
    famousPersons: ['Zainab bint Muhammad (RA)', 'Zainab bint Ali (RA)'],
    significance: 'Name of the daughter of Prophet Muhammad (PBUH)',
    references: ['Sahih Bukhari', 'Ibn Sa\'d'],
    isFavorite: false,
    views: 7650
  }
];

export default function IslamicNames() {
  const navigate = useNavigate();
  const location = useLocation();
  const [names, setNames] = useState<IslamicName[]>(mockNames);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'alphabetical' | 'views'>('popularity');

  const genders = [
    { value: 'all', label: 'All Names' },
    { value: 'male', label: 'Boys Names' },
    { value: 'female', label: 'Girls Names' },
    { value: 'unisex', label: 'Unisex Names' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'prophetic', label: 'Prophetic Names' },
    { value: 'quranic', label: 'Quranic Names' },
    { value: 'companions', label: 'Companions Names' },
    { value: 'attributes', label: 'Divine Attributes' },
    { value: 'traditional', label: 'Traditional Names' }
  ];

  const filteredNames = names.filter(name => {
    const matchesGender = selectedGender === 'all' || name.gender === selectedGender;
    const matchesCategory = selectedCategory === 'all' || name.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.arabicName.includes(searchQuery) ||
      name.variations.some(variation => variation.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesGender && matchesCategory && matchesSearch;
  });

  const sortedNames = [...filteredNames].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'views':
        return b.views - a.views;
      case 'popularity':
      default:
        return b.popularity - a.popularity;
    }
  });

  const popularNames = sortedNames.filter(n => n.popularity >= 85);
  const favoriteNames = sortedNames.filter(n => n.isFavorite);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prophetic': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'quranic': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'companions': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'attributes': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'traditional': return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return User;
      case 'female': return Users;
      case 'unisex': return Crown;
      default: return User;
    }
  };

  const handleFavorite = (id: string) => {
    setNames(prev => prev.map(name => 
      name.id === id ? { ...name, isFavorite: !name.isFavorite } : name
    ));
    toast.success("Name added to favorites");
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleView = (id: string) => {
    setNames(prev => prev.map(name => 
      name.id === id ? { ...name, views: name.views + 1 } : name
    ));
  };

  return (
    <PageLayout 
      title="Islamic Names" 
      subtitle="Discover beautiful Islamic names with meanings and significance"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Baby size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Name Discovery</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Islamic Names</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of beautiful Islamic names with their meanings, 
            origins, and significance in Islamic tradition.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search names, meanings, or variations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {genders.map(gender => (
              <option key={gender.value} value={gender.value}>{gender.label}</option>
            ))}
          </select>

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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            <option value="popularity">Most Popular</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Popular Names */}
        {popularNames.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <TrendingUp className="text-primary" size={24} />
              Most Popular Names
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularNames.slice(0, 6).map((name, index) => {
                const GenderIcon = getGenderIcon(name.gender);
                return (
                  <div 
                    key={name.id}
                    className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleView(name.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <GenderIcon size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl">{name.name}</h3>
                          <p className="text-right text-lg font-arabic" dir="rtl">{name.arabicName}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(name.id);
                        }}
                        className={cn(
                          "transition-colors",
                          name.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                        )}
                      >
                        <Heart size={20} className={name.isFavorite ? "fill-red-500" : ""} />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", getCategoryColor(name.category))}>
                          {name.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {name.gender}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          {name.popularity}%
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Meaning:</p>
                        <p className="text-primary font-medium">{name.meaning}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Pronunciation:</p>
                        <p className="text-sm italic">{name.pronunciation}</p>
                      </div>

                      {name.significance && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary">
                            <strong>Significance:</strong> {name.significance}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {name.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {name.origin}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(name.name, 'Name');
                          }}
                          className="gap-1"
                        >
                          <Copy size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Pronunciation playing...");
                          }}
                          className="gap-1"
                        >
                          <Play size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Favorite Names */}
        {favoriteNames.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={24} />
              Favorite Names
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteNames.map((name, index) => (
                <div 
                  key={name.id}
                  className="bg-card rounded-xl border border-border/30 p-4 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-center">
                    <h3 className="font-display text-lg mb-1">{name.name}</h3>
                    <p className="text-right text-base font-arabic mb-2" dir="rtl">{name.arabicName}</p>
                    <p className="text-sm text-primary font-medium mb-2">{name.meaning}</p>
                    <Badge className={cn("text-xs", getCategoryColor(name.category))}>
                      {name.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Names */}
        <div>
          <h2 className="text-2xl font-display mb-6">
            All Names ({sortedNames.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNames.map((name, index) => {
              const GenderIcon = getGenderIcon(name.gender);
              return (
                <div 
                  key={name.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleView(name.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <GenderIcon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg">{name.name}</h3>
                        <p className="text-right text-sm font-arabic" dir="rtl">{name.arabicName}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(name.id);
                      }}
                      className={cn(
                        "transition-colors",
                        name.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                      )}
                    >
                      <Heart size={16} className={name.isFavorite ? "fill-red-500" : ""} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getCategoryColor(name.category))}>
                        {name.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {name.gender}
                      </Badge>
                    </div>
                    <p className="text-sm text-primary font-medium">{name.meaning}</p>
                    <p className="text-xs text-muted-foreground italic">{name.pronunciation}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{name.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{name.popularity}% popular</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(name.name, 'Name');
                      }}
                      className="gap-1"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sortedNames.length === 0 && (
          <div className="text-center py-12">
            <Baby size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Names Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more names.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}