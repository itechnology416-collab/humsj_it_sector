import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Search, 
  Star,
  Copy,
  Share2,
  Bookmark,
  Eye,
  Heart,
  User,
  CheckCircle,
  Volume2,
  Play,
  Pause,
  Tag,
  Globe,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Hadith {
  id: string;
  arabicText: string;
  englishTranslation: string;
  narrator: string;
  collection: 'bukhari' | 'muslim' | 'tirmidhi' | 'abudawud' | 'nasai' | 'ibnmajah' | 'malik' | 'ahmad';
  bookNumber: number;
  hadithNumber: number;
  grade: 'sahih' | 'hasan' | 'daif' | 'mawdu';
  topic: string;
  category: 'faith' | 'worship' | 'morals' | 'social' | 'family' | 'business' | 'knowledge' | 'afterlife';
  keywords: string[];
  explanation?: string;
  context?: string;
  lessons: string[];
  isFavorite: boolean;
  views: number;
  bookmarks: number;
}

const mockHadiths: Hadith[] = [
  {
    id: '1',
    arabicText: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    englishTranslation: 'Actions are but by intention and every man shall have only that which he intended.',
    narrator: 'Umar ibn al-Khattab (RA)',
    collection: 'bukhari',
    bookNumber: 1,
    hadithNumber: 1,
    grade: 'sahih',
    topic: 'The Importance of Intention',
    category: 'faith',
    keywords: ['intention', 'niyyah', 'actions', 'sincerity'],
    explanation: 'This hadith emphasizes that the value of any action depends on the intention behind it.',
    context: 'This was narrated in the context of the migration (Hijra) to Medina.',
    lessons: [
      'Intention is the foundation of all righteous deeds',
      'Allah judges actions based on the heart\'s intention',
      'Pure intention transforms ordinary acts into worship'
    ],
    isFavorite: true,
    views: 25400,
    bookmarks: 1250
  },
  {
    id: '2',
    arabicText: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    englishTranslation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Abu Hurairah (RA)',
    collection: 'bukhari',
    bookNumber: 76,
    hadithNumber: 31,
    grade: 'sahih',
    topic: 'Good Speech and Silence',
    category: 'morals',
    keywords: ['speech', 'silence', 'good words', 'manners'],
    explanation: 'This hadith teaches the importance of controlling our speech and speaking only what is beneficial.',
    context: 'Part of the Prophet\'s guidance on social etiquette and moral behavior.',
    lessons: [
      'Think before you speak',
      'Silence is better than harmful speech',
      'Good speech is a sign of faith'
    ],
    isFavorite: true,
    views: 18900,
    bookmarks: 890
  },
  {
    id: '3',
    arabicText: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    englishTranslation: 'The Muslim is one from whose tongue and hand the Muslims are safe.',
    narrator: 'Abdullah ibn Amr (RA)',
    collection: 'bukhari',
    bookNumber: 2,
    hadithNumber: 10,
    grade: 'sahih',
    topic: 'True Muslim Character',
    category: 'social',
    keywords: ['Muslim', 'character', 'safety', 'harm'],
    explanation: 'This hadith defines a true Muslim as one who causes no harm to others through words or actions.',
    context: 'The Prophet\'s definition of what makes a person a true Muslim.',
    lessons: [
      'A Muslim should be a source of peace for others',
      'Control your tongue and hands from causing harm',
      'True faith is reflected in how we treat others'
    ],
    isFavorite: false,
    views: 16750,
    bookmarks: 720
  },
  {
    id: '4',
    arabicText: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    englishTranslation: 'Seeking knowledge is an obligation upon every Muslim.',
    narrator: 'Anas ibn Malik (RA)',
    collection: 'ibnmajah',
    bookNumber: 1,
    hadithNumber: 224,
    grade: 'hasan',
    topic: 'Seeking Knowledge',
    category: 'knowledge',
    keywords: ['knowledge', 'learning', 'obligation', 'education'],
    explanation: 'This hadith emphasizes that acquiring knowledge is a religious duty for all Muslims.',
    context: 'The Prophet\'s emphasis on the importance of education and learning.',
    lessons: [
      'Learning is a lifelong obligation',
      'Knowledge is essential for proper worship',
      'Both religious and worldly knowledge are important'
    ],
    isFavorite: true,
    views: 22100,
    bookmarks: 1100
  },
  {
    id: '5',
    arabicText: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    englishTranslation: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik (RA)',
    collection: 'bukhari',
    bookNumber: 2,
    hadithNumber: 12,
    grade: 'sahih',
    topic: 'Love for Others',
    category: 'social',
    keywords: ['love', 'brotherhood', 'faith', 'selflessness'],
    explanation: 'This hadith teaches that true faith includes wanting good for others as much as for oneself.',
    context: 'The Prophet\'s teaching on the essence of Islamic brotherhood.',
    lessons: [
      'True faith includes love for others',
      'Selfishness contradicts Islamic values',
      'Brotherhood in Islam goes beyond blood relations'
    ],
    isFavorite: false,
    views: 19800,
    bookmarks: 950
  },
  {
    id: '6',
    arabicText: 'الدِّينُ النَّصِيحَةُ',
    englishTranslation: 'Religion is sincere advice.',
    narrator: 'Tamim ad-Dari (RA)',
    collection: 'muslim',
    bookNumber: 1,
    hadithNumber: 95,
    grade: 'sahih',
    topic: 'Sincere Advice',
    category: 'morals',
    keywords: ['advice', 'sincerity', 'religion', 'counsel'],
    explanation: 'This hadith shows that giving and accepting sincere advice is at the heart of Islamic practice.',
    context: 'The Prophet\'s explanation of what religion truly means.',
    lessons: [
      'Sincere advice is a religious duty',
      'Accept advice with an open heart',
      'Advise others with wisdom and kindness'
    ],
    isFavorite: true,
    views: 14200,
    bookmarks: 680
  },
  {
    id: '7',
    arabicText: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    englishTranslation: 'The best of people are those who are most beneficial to people.',
    narrator: 'Jabir ibn Abdullah (RA)',
    collection: 'ahmad',
    bookNumber: 3,
    hadithNumber: 3289,
    grade: 'sahih',
    topic: 'Serving Humanity',
    category: 'social',
    keywords: ['service', 'benefit', 'humanity', 'goodness'],
    explanation: 'This hadith emphasizes that the measure of a person\'s worth is how much they benefit others.',
    context: 'The Prophet\'s teaching on what makes a person truly valuable in Allah\'s sight.',
    lessons: [
      'True worth comes from serving others',
      'Benefit to humanity is a noble goal',
      'Good deeds should extend beyond oneself'
    ],
    isFavorite: true,
    views: 18750,
    bookmarks: 920
  },
  {
    id: '8',
    arabicText: 'خَيْرُ الْأُمُورِ أَوْسَطُهَا',
    englishTranslation: 'The best of matters are those that are moderate.',
    narrator: 'Ali ibn Abi Talib (RA)',
    collection: 'bukhari',
    bookNumber: 78,
    hadithNumber: 15,
    grade: 'sahih',
    topic: 'Balance and Moderation',
    category: 'morals',
    keywords: ['moderation', 'balance', 'middle path', 'wisdom'],
    explanation: 'Islam teaches the importance of moderation and avoiding extremes in all aspects of life.',
    context: 'The Prophet\'s guidance on maintaining balance in religious and worldly matters.',
    lessons: [
      'Avoid extremes in religion and life',
      'Moderation leads to sustainability',
      'Balance is a sign of wisdom'
    ],
    isFavorite: false,
    views: 15600,
    bookmarks: 780
  },
  {
    id: '9',
    arabicText: 'إِنَّ الْمُؤْمِنَ لَيُدْرِكُ بِحُسْنِ خُلُقِهِ دَرَجَةَ الصَّائِمِ الْقَائِمِ',
    englishTranslation: 'Indeed, the believer can reach by his good character the degree of one who fasts and stands in prayer.',
    narrator: 'Aisha (RA)',
    collection: 'abudawud',
    bookNumber: 41,
    hadithNumber: 4798,
    grade: 'sahih',
    topic: 'Good Character',
    category: 'morals',
    keywords: ['character', 'akhlaq', 'reward', 'virtue'],
    explanation: 'This hadith shows that good character can earn the same reward as intensive worship.',
    context: 'The Prophet\'s emphasis on the importance of moral excellence.',
    lessons: [
      'Good character is highly rewarded by Allah',
      'Moral excellence equals intensive worship',
      'Character development is essential for believers'
    ],
    isFavorite: true,
    views: 21300,
    bookmarks: 1150
  },
  {
    id: '10',
    arabicText: 'فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ',
    englishTranslation: 'In every living being there is a reward (for showing kindness).',
    narrator: 'Abu Hurairah (RA)',
    collection: 'bukhari',
    bookNumber: 59,
    hadithNumber: 3321,
    grade: 'sahih',
    topic: 'Compassion to All Creation',
    category: 'morals',
    keywords: ['kindness', 'animals', 'compassion', 'reward'],
    explanation: 'This hadith teaches that showing kindness to any living creature is rewarded by Allah.',
    context: 'The Prophet\'s teaching about universal compassion and mercy.',
    lessons: [
      'Kindness to animals is rewarded by Allah',
      'Compassion should extend to all creation',
      'Every act of mercy has spiritual value'
    ],
    isFavorite: false,
    views: 17890,
    bookmarks: 890
  },
  {
    id: '11',
    arabicText: 'الطَّهُورُ شَطْرُ الْإِيمَانِ',
    englishTranslation: 'Cleanliness is half of faith.',
    narrator: 'Abu Malik al-Ash\'ari (RA)',
    collection: 'muslim',
    bookNumber: 2,
    hadithNumber: 432,
    grade: 'sahih',
    topic: 'Purity and Cleanliness',
    category: 'worship',
    keywords: ['cleanliness', 'purity', 'faith', 'hygiene'],
    explanation: 'This hadith emphasizes that physical and spiritual cleanliness are fundamental to Islamic faith.',
    context: 'The Prophet\'s teaching on the connection between cleanliness and spirituality.',
    lessons: [
      'Cleanliness is essential to faith',
      'Physical purity reflects spiritual purity',
      'Hygiene is a religious obligation'
    ],
    isFavorite: false,
    views: 19200,
    bookmarks: 960
  },
  {
    id: '12',
    arabicText: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    englishTranslation: 'Your smile in the face of your brother is charity for you.',
    narrator: 'Abu Dharr (RA)',
    collection: 'tirmidhi',
    bookNumber: 25,
    hadithNumber: 1956,
    grade: 'sahih',
    topic: 'Simple Acts of Kindness',
    category: 'social',
    keywords: ['smile', 'charity', 'kindness', 'brotherhood'],
    explanation: 'This hadith shows that even simple acts like smiling are considered charitable deeds in Islam.',
    context: 'The Prophet\'s teaching on how easy it is to earn reward through kindness.',
    lessons: [
      'Simple acts of kindness are rewarded',
      'A smile is a form of charity',
      'Small gestures have great spiritual value'
    ],
    isFavorite: true,
    views: 23400,
    bookmarks: 1200
  }
];

export default function HadithCollection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hadiths, setHadiths] = useState<Hadith[]>(mockHadiths);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const collections = [
    { value: 'all', label: 'All Collections' },
    { value: 'bukhari', label: 'Sahih Bukhari' },
    { value: 'muslim', label: 'Sahih Muslim' },
    { value: 'tirmidhi', label: 'Jami\' at-Tirmidhi' },
    { value: 'abudawud', label: 'Sunan Abu Dawud' },
    { value: 'nasai', label: 'Sunan an-Nasa\'i' },
    { value: 'ibnmajah', label: 'Sunan Ibn Majah' },
    { value: 'malik', label: 'Muwatta Malik' },
    { value: 'ahmad', label: 'Musnad Ahmad' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'faith', label: 'Faith & Belief' },
    { value: 'worship', label: 'Worship & Prayer' },
    { value: 'morals', label: 'Morals & Ethics' },
    { value: 'social', label: 'Social Relations' },
    { value: 'family', label: 'Family Life' },
    { value: 'business', label: 'Business & Trade' },
    { value: 'knowledge', label: 'Knowledge & Learning' },
    { value: 'afterlife', label: 'Afterlife & Judgment' }
  ];

  const grades = [
    { value: 'all', label: 'All Grades' },
    { value: 'sahih', label: 'Sahih (Authentic)' },
    { value: 'hasan', label: 'Hasan (Good)' },
    { value: 'daif', label: 'Da\'if (Weak)' },
    { value: 'mawdu', label: 'Mawdu\' (Fabricated)' }
  ];

  const filteredHadiths = hadiths.filter(hadith => {
    const matchesCollection = selectedCollection === 'all' || hadith.collection === selectedCollection;
    const matchesCategory = selectedCategory === 'all' || hadith.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || hadith.grade === selectedGrade;
    const matchesSearch = searchQuery === '' || 
      hadith.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCollection && matchesCategory && matchesGrade && matchesSearch;
  });

  const favoriteHadiths = filteredHadiths.filter(h => h.isFavorite);
  const regularHadiths = filteredHadiths.filter(h => !h.isFavorite);

  const getCollectionColor = (collection: string) => {
    switch (collection) {
      case 'bukhari': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'muslim': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'tirmidhi': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'abudawud': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'nasai': return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30';
      case 'ibnmajah': return 'bg-pink-500/20 text-pink-600 border-pink-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'sahih': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'hasan': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'daif': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'mawdu': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleFavorite = (id: string) => {
    setHadiths(prev => prev.map(hadith => 
      hadith.id === id ? { ...hadith, isFavorite: !hadith.isFavorite } : hadith
    ));
    toast.success("Hadith added to favorites");
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleView = (id: string) => {
    setHadiths(prev => prev.map(hadith => 
      hadith.id === id ? { ...hadith, views: hadith.views + 1 } : hadith
    ));
  };

  return (
    <PageLayout 
      title="Hadith Collection" 
      subtitle="Authentic sayings and teachings of Prophet Muhammad (PBUH)"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Prophetic Guidance</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Hadith Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore authentic sayings, actions, and approvals of Prophet Muhammad (PBUH) 
            from the most trusted hadith collections in Islamic literature.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hadiths by text, topic, or narrator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {collections.map(collection => (
              <option key={collection.value} value={collection.value}>{collection.label}</option>
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
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {grades.map(grade => (
              <option key={grade.value} value={grade.value}>{grade.label}</option>
            ))}
          </select>
        </div>

        {/* Favorite Hadiths */}
        {favoriteHadiths.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={24} />
              Favorite Hadiths
            </h2>
            <div className="space-y-6">
              {favoriteHadiths.map((hadith, index) => (
                <div 
                  key={hadith.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleView(hadith.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={cn("text-xs", getCollectionColor(hadith.collection))}>
                          {hadith.collection}
                        </Badge>
                        <Badge className={cn("text-xs", getGradeColor(hadith.grade))}>
                          {hadith.grade}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {hadith.category}
                        </Badge>
                      </div>
                      <h3 className="font-display text-xl mb-2">{hadith.topic}</h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(hadith.id);
                      }}
                      className="text-red-500 hover:scale-110 transition-transform"
                    >
                      <Heart size={20} className="fill-red-500" />
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
                    <p className="text-right text-xl leading-relaxed font-arabic" dir="rtl">
                      {hadith.arabicText}
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="mb-4">
                    <p className="text-lg leading-relaxed text-foreground">
                      "{hadith.englishTranslation}"
                    </p>
                  </div>

                  {/* Hadith Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Narrator:</p>
                      <p className="text-sm text-primary">{hadith.narrator}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Reference:</p>
                      <p className="text-sm text-primary">
                        {hadith.collection} {hadith.bookNumber}:{hadith.hadithNumber}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  {hadith.explanation && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Explanation:</strong> {hadith.explanation}
                      </p>
                    </div>
                  )}

                  {/* Lessons */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Key Lessons:</p>
                    <ul className="space-y-1">
                      {hadith.lessons.map((lesson, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hadith.keywords.map(keyword => (
                      <span key={keyword} className="text-xs px-2 py-1 bg-secondary rounded-md">
                        #{keyword}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {hadith.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark size={14} />
                        {hadith.bookmarks}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(hadith.arabicText, 'Arabic text');
                        }}
                        className="gap-1"
                      >
                        <Copy size={12} />
                        Arabic
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(hadith.englishTranslation, 'Translation');
                        }}
                        className="gap-1"
                      >
                        <Copy size={12} />
                        English
                      </Button>
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
              ))}
            </div>
          </div>
        )}

        {/* All Hadiths */}
        <div>
          <h2 className="text-2xl font-display mb-6">All Hadiths</h2>
          <div className="space-y-6">
            {regularHadiths.map((hadith, index) => (
              <div 
                key={hadith.id}
                className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleView(hadith.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn("text-xs", getCollectionColor(hadith.collection))}>
                        {hadith.collection}
                      </Badge>
                      <Badge className={cn("text-xs", getGradeColor(hadith.grade))}>
                        {hadith.grade}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {hadith.category}
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg mb-2">{hadith.topic}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(hadith.id);
                    }}
                    className="text-muted-foreground hover:text-red-500 hover:scale-110 transition-all"
                  >
                    <Heart size={20} />
                  </button>
                </div>

                {/* Arabic Text */}
                <div className="mb-3 p-3 bg-secondary/30 rounded-lg">
                  <p className="text-right text-lg leading-relaxed font-arabic" dir="rtl">
                    {hadith.arabicText}
                  </p>
                </div>

                {/* English Translation */}
                <div className="mb-3">
                  <p className="text-base leading-relaxed text-foreground">
                    "{hadith.englishTranslation}"
                  </p>
                </div>

                {/* Hadith Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {hadith.narrator}
                  </span>
                  <span>
                    {hadith.collection} {hadith.bookNumber}:{hadith.hadithNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {hadith.views.toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {hadith.keywords.slice(0, 3).map(keyword => (
                      <span key={keyword} className="text-xs px-2 py-1 bg-secondary rounded-md">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(hadith.englishTranslation, 'Translation');
                    }}
                    className="gap-1"
                  >
                    <Copy size={12} />
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredHadiths.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Hadiths Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more hadiths.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}