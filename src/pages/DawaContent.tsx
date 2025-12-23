import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { RotatingQuranVerses } from "@/components/islamic/RotatingQuranVerses";
import { 
  BookOpen, 
  Users, 
  Globe, 
  Heart, 
  MessageCircle,
  Download,
  Share2,
  Play,
  FileText,
  Video,
  Headphones,
  Image,
  Link,
  Star,
  Eye,
  ThumbsUp,
  Clock,
  Tag,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DawaResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'infographic' | 'book' | 'pamphlet';
  category: 'basics' | 'comparative' | 'contemporary' | 'youth' | 'family' | 'community';
  language: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  author: string;
  views: number;
  likes: number;
  downloadUrl?: string;
  shareUrl: string;
  tags: string[];
  createdAt: string;
  featured: boolean;
}

const dawaResources: DawaResource[] = [
  {
    id: '1',
    title: 'Introduction to Islam: A Comprehensive Guide',
    description: 'A complete introduction to Islamic beliefs, practices, and way of life for newcomers and those seeking to understand Islam.',
    type: 'book',
    category: 'basics',
    language: ['English', 'Amharic', 'Oromo'],
    difficulty: 'beginner',
    author: 'Dr. Ahmad Hassan',
    views: 15420,
    likes: 892,
    downloadUrl: '/resources/intro-to-islam.pdf',
    shareUrl: '/dawa/intro-to-islam',
    tags: ['Islam', 'Basics', 'Faith', 'Pillars'],
    createdAt: '2024-01-15',
    featured: true
  },
  {
    id: '2',
    title: 'The Beauty of Islamic Character',
    description: 'Exploring the moral and ethical teachings of Islam and how they shape a Muslim\'s character and interactions.',
    type: 'video',
    category: 'contemporary',
    language: ['English', 'Arabic'],
    difficulty: 'intermediate',
    duration: '45 minutes',
    author: 'Sheikh Omar Abdullah',
    views: 8750,
    likes: 654,
    shareUrl: '/dawa/islamic-character',
    tags: ['Character', 'Ethics', 'Morality', 'Behavior'],
    createdAt: '2024-02-20',
    featured: true
  },
  {
    id: '3',
    title: 'Islam and Science: A Historical Perspective',
    description: 'Examining the relationship between Islamic teachings and scientific advancement throughout history.',
    type: 'article',
    category: 'comparative',
    language: ['English'],
    difficulty: 'advanced',
    author: 'Prof. Fatima Al-Zahra',
    views: 12300,
    likes: 789,
    shareUrl: '/dawa/islam-science',
    tags: ['Science', 'History', 'Knowledge', 'Innovation'],
    createdAt: '2024-03-10',
    featured: false
  },
  {
    id: '4',
    title: 'Raising Muslim Children in Modern Society',
    description: 'Practical guidance for Muslim parents on nurturing Islamic values in children while navigating contemporary challenges.',
    type: 'audio',
    category: 'family',
    language: ['English', 'Amharic'],
    difficulty: 'intermediate',
    duration: '60 minutes',
    author: 'Dr. Aisha Mohamed',
    views: 6890,
    likes: 445,
    shareUrl: '/dawa/muslim-parenting',
    tags: ['Parenting', 'Children', 'Family', 'Education'],
    createdAt: '2024-04-05',
    featured: true
  },
  {
    id: '5',
    title: 'Common Misconceptions About Islam',
    description: 'Addressing frequently asked questions and misconceptions about Islamic beliefs and practices.',
    type: 'infographic',
    category: 'comparative',
    language: ['English', 'Oromo'],
    difficulty: 'beginner',
    author: 'Islamic Outreach Team',
    views: 9870,
    likes: 567,
    downloadUrl: '/resources/misconceptions-infographic.png',
    shareUrl: '/dawa/misconceptions',
    tags: ['Misconceptions', 'FAQ', 'Clarification', 'Truth'],
    createdAt: '2024-05-12',
    featured: false
  },
  {
    id: '6',
    title: 'Youth and Islamic Identity',
    description: 'Helping young Muslims maintain their Islamic identity while engaging positively with diverse communities.',
    type: 'pamphlet',
    category: 'youth',
    language: ['English', 'Amharic', 'Oromo'],
    difficulty: 'beginner',
    author: 'Youth Development Committee',
    views: 4560,
    likes: 298,
    downloadUrl: '/resources/youth-identity.pdf',
    shareUrl: '/dawa/youth-identity',
    tags: ['Youth', 'Identity', 'Community', 'Integration'],
    createdAt: '2024-06-18',
    featured: true
  }
];

const dawaStrategies = [
  {
    title: "Wisdom and Beautiful Preaching",
    description: "Following the Quranic guidance of inviting to Islam with wisdom and beautiful preaching",
    verse: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
    translation: "Invite to the way of your Lord with wisdom and good instruction",
    reference: "Quran 16:125",
    icon: "💡",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Leading by Example",
    description: "Demonstrating Islamic values through personal conduct and character",
    verse: "وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا",
    translation: "And who is better in speech than one who invites to Allah and does righteousness",
    reference: "Quran 41:33",
    icon: "⭐",
    color: "from-emerald-500 to-green-500"
  },
  {
    title: "Building Relationships",
    description: "Establishing genuine connections and trust before sharing Islamic teachings",
    verse: "وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ",
    translation: "And if you had been rude and harsh in heart, they would have disbanded from about you",
    reference: "Quran 3:159",
    icon: "🤝",
    color: "from-purple-500 to-violet-500"
  },
  {
    title: "Addressing Contemporary Issues",
    description: "Connecting Islamic solutions to modern challenges and concerns",
    verse: "وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِّكُلِّ شَيْءٍ",
    translation: "And We have sent down to you the Book as clarification for all things",
    reference: "Quran 16:89",
    icon: "🌍",
    color: "from-amber-500 to-orange-500"
  }
];

export default function DawaContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Da'wah related Quranic verses
  const dawaVerses = [
    {
      arabic: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
      english: "Invite to the way of your Lord with wisdom and good instruction",
      reference: "Quran 16:125",
      theme: "Wisdom in Da'wah",
      icon: "💡",
      color: "from-blue-500 to-cyan-500"
    },
    {
      arabic: "وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا",
      english: "And who is better in speech than one who invites to Allah and does righteousness",
      reference: "Quran 41:33",
      theme: "Excellence in Da'wah",
      icon: "⭐",
      color: "from-emerald-500 to-green-500"
    },
    {
      arabic: "وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ",
      english: "And if you had been rude and harsh in heart, they would have disbanded from about you",
      reference: "Quran 3:159",
      theme: "Gentle Approach",
      icon: "🤝",
      color: "from-purple-500 to-violet-500"
    },
    {
      arabic: "وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِّكُلِّ شَيْءٍ",
      english: "And We have sent down to you the Book as clarification for all things",
      reference: "Quran 16:89",
      theme: "Comprehensive Guidance",
      icon: "🌍",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'basics', label: 'Islamic Basics' },
    { value: 'comparative', label: 'Comparative Religion' },
    { value: 'contemporary', label: 'Contemporary Issues' },
    { value: 'youth', label: 'Youth & Students' },
    { value: 'family', label: 'Family & Parenting' },
    { value: 'community', label: 'Community Building' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'infographic', label: 'Infographics' },
    { value: 'book', label: 'Books' },
    { value: 'pamphlet', label: 'Pamphlets' }
  ];

  const filteredResources = dawaResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const featuredResources = dawaResources.filter(resource => resource.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'infographic': return Image;
      case 'book': return BookOpen;
      case 'pamphlet': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'video': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'audio': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'infographic': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'book': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'pamphlet': return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDownload = (resource: DawaResource) => {
    if (resource.downloadUrl) {
      toast.success(`Downloading: ${resource.title}`);
    } else {
      toast.error("Download not available for this resource");
    }
  };

  const handleShare = (resource: DawaResource) => {
    toast.success(`Sharing: ${resource.title}`);
  };

  const handleLike = (resourceId: string) => {
    toast.success("Resource liked!");
  };

  return (
    <PublicPageLayout 
      title="Da'wah Content & Resources" 
      subtitle="Comprehensive materials for Islamic outreach and education"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section with 360 Rotating Verses */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <MessageCircle size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Da'wah Content & Resources</h1>
            <p className="text-muted-foreground max-w-4xl mx-auto text-lg mb-8">
              Discover comprehensive materials for Islamic outreach, education, and community building. 
              Share the beauty of Islam through wisdom, knowledge, and beautiful preaching.
            </p>
            
            {/* 360 Degree Rotating Quranic Verses */}
            <RotatingQuranVerses 
              verses={dawaVerses}
              rotationSpeed={9}
              className="max-w-5xl mx-auto"
            />
          </div>
        </div>

        {/* Da'wah Strategies */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Heart size={28} className="text-primary" />
              Islamic Da'wah Principles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Following the Quranic guidance and Prophetic example in inviting others to Islam
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dawaStrategies.map((strategy, index) => (
              <div 
                key={strategy.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${strategy.color} mb-4`} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{strategy.icon}</div>
                  <h3 className="text-xl font-semibold">{strategy.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{strategy.description}</p>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-lg font-arabic text-primary mb-2 text-right" dir="rtl">
                    {strategy.verse}
                  </p>
                  <p className="text-sm text-muted-foreground italic mb-1">
                    "{strategy.translation}"
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {strategy.reference}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search da'wah resources..."
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Featured Resources */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Star size={28} className="text-primary" />
              Featured Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Highlighted materials for effective Islamic outreach and education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div 
                  key={resource.id}
                  className="bg-card rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <TypeIcon size={24} className="text-primary" />
                        </div>
                        <div>
                          <Badge className={cn("text-xs", getTypeColor(resource.type))}>
                            {resource.type}
                          </Badge>
                          <Badge className={cn("text-xs ml-2", getDifficultyColor(resource.difficulty))}>
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Star size={16} className="text-yellow-500 fill-current" />
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{resource.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users size={12} />
                        <span>By {resource.author}</span>
                      </div>
                      {resource.duration && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye size={12} />
                        <span>{resource.views.toLocaleString()} views</span>
                        <ThumbsUp size={12} />
                        <span>{resource.likes} likes</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLike(resource.id)}
                          className="gap-1"
                        >
                          <ThumbsUp size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(resource)}
                          className="gap-1"
                        >
                          <Share2 size={12} />
                        </Button>
                      </div>
                      
                      {resource.downloadUrl && (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(resource)}
                          className="gap-1"
                        >
                          <Download size={12} />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-display mb-6">All Da'wah Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div 
                  key={resource.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <TypeIcon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">{resource.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className={cn("text-xs", getTypeColor(resource.type))}>
                          {resource.type}
                        </Badge>
                        <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>By {resource.author}</span>
                    <span>{resource.views.toLocaleString()} views</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLike(resource.id)}
                        className="gap-1"
                      >
                        <ThumbsUp size={10} />
                        {resource.likes}
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare(resource)}
                        className="gap-1"
                      >
                        <Share2 size={10} />
                      </Button>
                      {resource.downloadUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(resource)}
                          className="gap-1"
                        >
                          <Download size={10} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Resources Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more resources.
            </p>
          </div>
        )}

        {/* Quranic Inspiration */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={20} className="text-primary" />
          </div>
          <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
            وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا وَقَالَ إِنَّنِي مِنَ الْمُسْلِمِينَ
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And who is better in speech than one who invites to Allah and does righteousness and says, 'Indeed, I am of the Muslims.'" - Quran 41:33
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}