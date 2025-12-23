import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Heart, 
  Search, 
  BookOpen,
  Copy,
  Share2,
  Volume2,
  VolumeX,
  Star,
  Filter,
  Clock,
  Sun,
  Moon,
  Utensils,
  Car,
  Home,
  Plane,
  Shield,
  Sparkles,
  Play,
  Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Dua {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: 'daily' | 'morning' | 'evening' | 'food' | 'travel' | 'protection' | 'special';
  occasion: string;
  benefits?: string;
  audioUrl?: string;
  isFavorite: boolean;
  tags: string[];
}

const mockDuas: Dua[] = [
  {
    id: '1',
    title: 'Dua for Starting Any Task',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    transliteration: 'Bismillahi ar-Rahman ar-Raheem',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    reference: 'Quran 1:1',
    category: 'daily',
    occasion: 'Before starting any task',
    benefits: 'Seeking Allah\'s blessing and protection in all endeavors',
    isFavorite: true,
    tags: ['Basmala', 'Beginning', 'Blessing']
  },
  {
    id: '2',
    title: 'Morning Remembrance',
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illa Allah wahdahu la shareeka lah',
    translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    reference: 'Abu Dawud 4/317',
    category: 'morning',
    occasion: 'Upon waking up in the morning',
    benefits: 'Protection and blessing for the day ahead',
    isFavorite: false,
    tags: ['Morning', 'Sovereignty', 'Praise']
  },
  {
    id: '3',
    title: 'Before Eating',
    arabicText: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    reference: 'Abu Dawud 3/347',
    category: 'food',
    occasion: 'Before eating or drinking',
    benefits: 'Seeking Allah\'s blessing in sustenance',
    isFavorite: true,
    tags: ['Food', 'Blessing', 'Sustenance']
  },
  {
    id: '4',
    title: 'After Eating',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-ladhi at\'amani hadha wa razaqaneehi min ghayri hawlin minnee wa la quwwah',
    translation: 'All praise is due to Allah who has fed me this and provided it for me without any might or power on my part.',
    reference: 'Abu Dawud 4/318',
    category: 'food',
    occasion: 'After finishing a meal',
    benefits: 'Expressing gratitude for Allah\'s provision',
    isFavorite: false,
    tags: ['Gratitude', 'Food', 'Provision']
  },
  {
    id: '5',
    title: 'Travel Dua',
    arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila rabbina lamunqaliboon',
    translation: 'Glory be to Him who has subjected this to us, and we could never have it (by our efforts). And verily, to our Lord we indeed are to return!',
    reference: 'Quran 43:13-14',
    category: 'travel',
    occasion: 'When starting a journey',
    benefits: 'Protection and safe travel',
    isFavorite: true,
    tags: ['Travel', 'Journey', 'Protection']
  },
  {
    id: '6',
    title: 'Evening Protection',
    arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Amseyna wa amsal-mulku lillah, walhamdu lillah, la ilaha illa Allah wahdahu la shareeka lah',
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    reference: 'Abu Dawud 4/317',
    category: 'evening',
    occasion: 'In the evening',
    benefits: 'Protection throughout the night',
    isFavorite: false,
    tags: ['Evening', 'Protection', 'Night']
  },
  {
    id: '7',
    title: 'Seeking Forgiveness (Sayyid al-Istighfar)',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliteration: 'Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wa\'dika mastata\'t',
    translation: 'O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant, and I abide to Your covenant and promise as best I can.',
    reference: 'Sahih Bukhari 6306',
    category: 'daily',
    occasion: 'Morning and evening remembrance',
    benefits: 'The master of seeking forgiveness - whoever says it with conviction and dies that day will enter Paradise',
    isFavorite: true,
    tags: ['Forgiveness', 'Istighfar', 'Master Dua', 'Paradise']
  },
  {
    id: '8',
    title: 'Protection from Evil Eye',
    arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bi kalimatillahi at-tammati min sharri ma khalaq',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    reference: 'Sahih Muslim 2708',
    category: 'protection',
    occasion: 'When seeking protection from harm',
    benefits: 'Protection from all evil and harm, including evil eye and black magic',
    isFavorite: true,
    tags: ['Protection', 'Evil Eye', 'Refuge', 'Safety']
  },
  {
    id: '9',
    title: 'Dua for Entering the Mosque',
    arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahumma aftah li abwaba rahmatik',
    translation: 'O Allah, open for me the doors of Your mercy.',
    reference: 'Sahih Muslim 713',
    category: 'daily',
    occasion: 'When entering the mosque',
    benefits: 'Seeking Allah\'s mercy and blessing when entering His house',
    isFavorite: false,
    tags: ['Mosque', 'Mercy', 'Worship', 'Entry']
  },
  {
    id: '10',
    title: 'Dua for Leaving the Mosque',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ',
    transliteration: 'Allahumma inni as\'aluka min fadlika wa rahmatik',
    translation: 'O Allah, I ask You from Your bounty and mercy.',
    reference: 'Sahih Muslim 713',
    category: 'daily',
    occasion: 'When leaving the mosque',
    benefits: 'Seeking Allah\'s continued bounty and mercy after worship',
    isFavorite: false,
    tags: ['Mosque', 'Bounty', 'Mercy', 'Exit']
  },
  {
    id: '11',
    title: 'Dua for Anxiety and Distress',
    arabicText: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ',
    transliteration: 'Allahumma inni abduka ibn abdika ibn amatika, nasiyati biyadik, madin fiyya hukmuk, adlun fiyya qada\'uk',
    translation: 'O Allah, I am Your servant, son of Your servant, son of Your maidservant, my forelock is in Your hand, Your command over me is forever executed and Your decree over me is just.',
    reference: 'Musnad Ahmad 3712',
    category: 'special',
    occasion: 'During times of anxiety, grief, or distress',
    benefits: 'Allah will remove anxiety and replace it with joy - authentic Hadith promise',
    isFavorite: true,
    tags: ['Anxiety', 'Distress', 'Relief', 'Comfort', 'Healing']
  },
  {
    id: '12',
    title: 'Dua for Seeking Guidance (Istikhara)',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
    transliteration: 'Allahumma inni astakhiruka bi\'ilmik, wa astaqdiruka bi qudratik, wa as\'aluka min fadlikal azeem',
    translation: 'O Allah, I seek guidance from Your knowledge, and Power from Your Might and I ask for Your great blessings.',
    reference: 'Sahih Bukhari 1162',
    category: 'special',
    occasion: 'When making important decisions',
    benefits: 'Seeking Allah\'s guidance in making the right choice in any matter',
    isFavorite: true,
    tags: ['Guidance', 'Istikhara', 'Decision', 'Wisdom', 'Choice']
  },
  {
    id: '13',
    title: 'Dua for Parents',
    arabicText: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi ghfir li wa li walidayya, rabbi rhamhuma kama rabbayani saghira',
    translation: 'My Lord, forgive me and my parents. My Lord, have mercy upon them as they brought me up when I was small.',
    reference: 'Quran 17:24',
    category: 'special',
    occasion: 'Praying for parents',
    benefits: 'Seeking Allah\'s mercy and forgiveness for parents - a duty of every Muslim child',
    isFavorite: true,
    tags: ['Parents', 'Forgiveness', 'Mercy', 'Family', 'Duty']
  },
  {
    id: '14',
    title: 'Dua for Entering the Home',
    arabicText: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa ala Allah rabbina tawakkalna',
    translation: 'In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we depend.',
    reference: 'Abu Dawud 5096',
    category: 'daily',
    occasion: 'When entering the home',
    benefits: 'Seeking Allah\'s blessing and protection for the household',
    isFavorite: false,
    tags: ['Home', 'Entry', 'Protection', 'Trust', 'Blessing']
  },
  {
    id: '15',
    title: 'Dua for Good Health',
    arabicText: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي',
    transliteration: 'Allahumma afini fi badani, Allahumma afini fi sam\'i, Allahumma afini fi basari',
    translation: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.',
    reference: 'Abu Dawud 5090',
    category: 'daily',
    occasion: 'Morning and evening remembrance',
    benefits: 'Seeking Allah\'s protection for physical health and senses',
    isFavorite: false,
    tags: ['Health', 'Body', 'Senses', 'Protection', 'Wellness']
  },
  {
    id: '16',
    title: 'Dua for Seeking Knowledge',
    arabicText: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ilma',
    translation: 'My Lord, increase me in knowledge.',
    reference: 'Quran 20:114',
    category: 'special',
    occasion: 'When seeking knowledge or before studying',
    benefits: 'Seeking Allah\'s help in gaining beneficial knowledge',
    isFavorite: true,
    tags: ['Knowledge', 'Learning', 'Study', 'Wisdom', 'Education']
  },
  {
    id: '17',
    title: 'Dua for Debt Relief',
    arabicText: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: 'Allahumma akfini bi halalika an haramik, wa aghnini bi fadlika amman siwak',
    translation: 'O Allah, make what You have made lawful enough for me, as opposed to what You have made unlawful, and make me independent of all others besides You.',
    reference: 'Tirmidhi 3563',
    category: 'special',
    occasion: 'When facing financial difficulties',
    benefits: 'Seeking Allah\'s help for lawful sustenance and freedom from debt',
    isFavorite: false,
    tags: ['Debt', 'Financial', 'Sustenance', 'Independence', 'Lawful']
  },
  {
    id: '18',
    title: 'Dua Before Sleep',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name O Allah, I die and I live.',
    reference: 'Sahih Bukhari 6312',
    category: 'evening',
    occasion: 'Before going to sleep',
    benefits: 'Entrusting one\'s soul to Allah during sleep',
    isFavorite: false,
    tags: ['Sleep', 'Night', 'Trust', 'Protection', 'Rest']
  }
];

export default function DuaCollection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [duas, setDuas] = useState<Dua[]>(mockDuas);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const categories = [
    { value: 'all', label: 'All Duas', icon: Sparkles },
    { value: 'daily', label: 'Daily Duas', icon: Clock },
    { value: 'morning', label: 'Morning', icon: Sun },
    { value: 'evening', label: 'Evening', icon: Moon },
    { value: 'food', label: 'Food & Drink', icon: Utensils },
    { value: 'travel', label: 'Travel', icon: Car },
    { value: 'protection', label: 'Protection', icon: Shield },
    { value: 'special', label: 'Special Occasions', icon: Star }
  ];

  const filteredDuas = duas.filter(dua => {
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const favoriteDuas = filteredDuas.filter(d => d.isFavorite);
  const regularDuas = filteredDuas.filter(d => !d.isFavorite);

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || Clock;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'morning': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'evening': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'food': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'travel': return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30';
      case 'protection': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'special': return 'bg-pink-500/20 text-pink-600 border-pink-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleFavorite = (id: string) => {
    setDuas(prev => prev.map(dua => 
      dua.id === id ? { ...dua, isFavorite: !dua.isFavorite } : dua
    ));
    toast.success("Dua added to favorites");
  };

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      toast.success("Playing audio recitation");
    }
  };

  return (
    <PageLayout 
      title="Dua Collection" 
      subtitle="Authentic supplications from Quran and Sunnah"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Heart size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Spiritual Connection</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Dua Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover authentic supplications from the Quran and Sunnah for various occasions and daily needs. 
            Connect with Allah through these beautiful prayers.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground border-primary shadow-red"
                    : "bg-card border-border/50 hover:border-primary/50"
                )}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search duas by title, occasion, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {/* Audio Control */}
        <div className="flex justify-center">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
              audioEnabled
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border/50 hover:border-primary/50"
            )}
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="text-sm font-medium">
              Audio {audioEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        </div>

        {/* Favorite Duas */}
        {favoriteDuas.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={24} />
              Favorite Duas
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteDuas.map((dua, index) => {
                const CategoryIcon = getCategoryIcon(dua.category);
                return (
                  <div 
                    key={dua.id}
                    className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <CategoryIcon size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg">{dua.title}</h3>
                          <Badge className={cn("text-xs mt-1", getCategoryColor(dua.category))}>
                            {dua.occasion}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFavorite(dua.id)}
                        className="text-red-500 hover:scale-110 transition-transform"
                      >
                        <Heart size={20} className="fill-red-500" />
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
                      <p className="text-right text-xl leading-relaxed font-arabic" dir="rtl">
                        {dua.arabicText}
                      </p>
                    </div>

                    {/* Transliteration */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Transliteration:</p>
                      <p className="italic text-primary">{dua.transliteration}</p>
                    </div>

                    {/* Translation */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Translation:</p>
                      <p className="text-foreground">{dua.translation}</p>
                    </div>

                    {/* Reference */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground">
                        <strong>Reference:</strong> {dua.reference}
                      </p>
                    </div>

                    {/* Benefits */}
                    {dua.benefits && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          <strong>Benefits:</strong> {dua.benefits}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dua.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(dua.arabicText, 'Arabic text')}
                          className="gap-1"
                        >
                          <Copy size={12} />
                          Arabic
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(dua.transliteration, 'Transliteration')}
                          className="gap-1"
                        >
                          <Copy size={12} />
                          Text
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        {audioEnabled && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlay(dua.id)}
                            className="gap-1"
                          >
                            {playingId === dua.id ? <Pause size={12} /> : <Play size={12} />}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Share2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Duas */}
        <div>
          <h2 className="text-2xl font-display mb-6">All Duas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularDuas.map((dua, index) => {
              const CategoryIcon = getCategoryIcon(dua.category);
              return (
                <div 
                  key={dua.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <CategoryIcon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg">{dua.title}</h3>
                        <Badge className={cn("text-xs mt-1", getCategoryColor(dua.category))}>
                          {dua.occasion}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFavorite(dua.id)}
                      className="text-muted-foreground hover:text-red-500 hover:scale-110 transition-all"
                    >
                      <Heart size={20} />
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
                    <p className="text-right text-lg leading-relaxed font-arabic" dir="rtl">
                      {dua.arabicText}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Transliteration:</p>
                    <p className="italic text-primary text-sm">{dua.transliteration}</p>
                  </div>

                  {/* Translation */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Translation:</p>
                    <p className="text-foreground text-sm">{dua.translation}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(dua.arabicText, 'Arabic text')}
                      className="gap-1"
                    >
                      <Copy size={12} />
                      Copy
                    </Button>

                    {audioEnabled && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlay(dua.id)}
                        className="gap-1"
                      >
                        {playingId === dua.id ? <Pause size={12} /> : <Play size={12} />}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredDuas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Duas Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or category filter to find more duas.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}