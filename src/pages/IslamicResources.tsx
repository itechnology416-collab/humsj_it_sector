import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Download, 
  ExternalLink,
  Search,
  Filter,
  Star,
  Eye,
  Heart,
  Share2,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  Globe,
  BookMarked,
  Sparkles,
  Tag,
  Calendar,
  User,
  Youtube,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'video' | 'audio' | 'infographic';
  category: 'quran' | 'hadith' | 'fiqh' | 'seerah' | 'aqeedah' | 'general';
  language: 'english' | 'arabic' | 'amharic' | 'oromo';
  author: string;
  source: string;
  url?: string;
  downloadUrl?: string;
  views: number;
  downloads: number;
  rating: number;
  tags: string[];
  featured: boolean;
  dateAdded: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Tawheed: The Oneness of Allah',
    description: 'A comprehensive guide to understanding the fundamental concept of Tawheed in Islam.',
    type: 'book',
    category: 'aqeedah',
    language: 'english',
    author: 'Dr. Bilal Philips',
    source: 'Islamic Online University',
    downloadUrl: '#',
    views: 2500,
    downloads: 450,
    rating: 4.8,
    tags: ['Tawheed', 'Aqeedah', 'Fundamentals', 'Belief'],
    featured: true,
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    title: 'The Life of Prophet Muhammad (PBUH)',
    description: 'A detailed biography of the final messenger of Allah, covering his life from birth to death.',
    type: 'video',
    category: 'seerah',
    language: 'english',
    author: 'Sheikh Yasir Qadhi',
    source: 'Islamic Lectures',
    url: '#',
    views: 5200,
    downloads: 0,
    rating: 4.9,
    tags: ['Seerah', 'Prophet', 'Biography', 'History'],
    featured: true,
    dateAdded: '2024-02-20'
  },
  {
    id: '3',
    title: 'Tafsir Ibn Kathir - Surah Al-Fatiha',
    description: 'Classical interpretation of the opening chapter of the Quran by the renowned scholar Ibn Kathir.',
    type: 'article',
    category: 'quran',
    language: 'english',
    author: 'Ibn Kathir',
    source: 'Tafsir Collection',
    url: '#',
    views: 1800,
    downloads: 320,
    rating: 4.7,
    tags: ['Tafsir', 'Quran', 'Al-Fatiha', 'Interpretation'],
    featured: false,
    dateAdded: '2024-03-10'
  },
  {
    id: '4',
    title: 'Sahih Bukhari - Book of Faith',
    description: 'Authentic hadith collection from Sahih Bukhari focusing on matters of faith and belief.',
    type: 'book',
    category: 'hadith',
    language: 'english',
    author: 'Imam Bukhari',
    source: 'Hadith Collections',
    downloadUrl: '#',
    views: 3100,
    downloads: 580,
    rating: 5.0,
    tags: ['Hadith', 'Bukhari', 'Faith', 'Authentic'],
    featured: true,
    dateAdded: '2024-01-25'
  },
  {
    id: '5',
    title: 'Fiqh of Salah: A Practical Guide',
    description: 'Step-by-step guide to performing the five daily prayers according to authentic sources.',
    type: 'infographic',
    category: 'fiqh',
    language: 'english',
    author: 'Islamic Education Center',
    source: 'Educational Resources',
    downloadUrl: '#',
    views: 4200,
    downloads: 890,
    rating: 4.6,
    tags: ['Fiqh', 'Salah', 'Prayer', 'Practical'],
    featured: false,
    dateAdded: '2024-02-05'
  },
  {
    id: '6',
    title: 'Quran Recitation - Juz Amma',
    description: 'Beautiful recitation of the 30th part of the Quran with translation and explanation.',
    type: 'audio',
    category: 'quran',
    language: 'arabic',
    author: 'Sheikh Mishary Rashid',
    source: 'Quran Recitations',
    url: '#',
    views: 6500,
    downloads: 1200,
    rating: 4.9,
    tags: ['Quran', 'Recitation', 'Juz Amma', 'Audio'],
    featured: true,
    dateAdded: '2024-03-01'
  }
];

export default function IslamicResources() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const types = [
    { value: 'all', label: 'All Types', icon: Sparkles },
    { value: 'book', label: 'Books', icon: BookOpen },
    { value: 'article', label: 'Articles', icon: FileText },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Headphones },
    { value: 'infographic', label: 'Infographics', icon: ImageIcon }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'quran', label: 'Quran & Tafsir' },
    { value: 'hadith', label: 'Hadith' },
    { value: 'fiqh', label: 'Fiqh (Jurisprudence)' },
    { value: 'seerah', label: 'Seerah (Biography)' },
    { value: 'aqeedah', label: 'Aqeedah (Creed)' },
    { value: 'general', label: 'General Islamic Knowledge' }
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'amharic', label: 'Amharic' },
    { value: 'oromo', label: 'Afaan Oromo' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesCategory && matchesLanguage && matchesSearch;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'article': return FileText;
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'infographic': return ImageIcon;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quran': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'hadith': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'fiqh': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'seerah': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'aqeedah': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleDownload = (resource: Resource) => {
    toast.success(`Downloading: ${resource.title}`);
  };

  const handleView = (resource: Resource) => {
    setResources(prev => prev.map(r => 
      r.id === resource.id ? { ...r, views: r.views + 1 } : r
    ));
    toast.success("Opening resource...");
  };

  return (
    <PageLayout 
      title="Islamic Resources" 
      subtitle="Access authentic Islamic knowledge and educational materials"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <BookMarked size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Knowledge Library</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Islamic Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of authentic Islamic resources including books, articles, 
            videos, and audio lectures from trusted scholars and sources.
          </p>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap gap-3 justify-center">
          {types.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
                  selectedType === type.value
                    ? "bg-primary text-primary-foreground border-primary shadow-red"
                    : "bg-card border-border/50 hover:border-primary/50"
                )}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources, authors, or topics..."
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

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
              <Star className="text-amber-500" size={24} />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredResources.map((resource, index) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <div 
                    key={resource.id}
                    className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <TypeIcon size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(resource.category))}>
                            {resource.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.language}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <h3 className="font-display text-xl mb-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {resource.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe size={14} />
                            {resource.source}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {resource.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download size={14} />
                              {resource.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-amber-500 fill-amber-500" />
                              {resource.rating}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {resource.url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(resource)}
                                className="gap-1"
                              >
                                <ExternalLink size={14} />
                                View
                              </Button>
                            )}
                            {resource.downloadUrl && (
                              <Button
                                size="sm"
                                onClick={() => handleDownload(resource)}
                                className="gap-1"
                              >
                                <Download size={14} />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* External Islamic Resources */}
        <div>
          <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
            <Globe className="text-blue-500" size={24} />
            External Islamic Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dr. Zakir Naik YouTube Channel */}
            <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <Youtube size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    Dr. Zakir Naik Channel
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      <Video size={12} className="mr-1" />
                      Video Lectures
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      English
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Comprehensive Islamic lectures, Q&A sessions, and comparative religion discussions 
                by renowned Islamic scholar Dr. Zakir Naik. Educational content covering various 
                aspects of Islam with logical and scientific approach.
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {['Islamic Lectures', 'Q&A', 'Comparative Religion', 'Dawah', 'Scientific Approach'].map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    Dr. Zakir Naik
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    YouTube
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-muted-foreground">4.8</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => window.open('https://www.youtube.com/@Drzakirchannel', '_blank')}
                  className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Play size={14} />
                  Watch Videos
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText('https://www.youtube.com/@Drzakirchannel');
                    toast.success('Link copied to clipboard');
                  }}
                  className="gap-1"
                >
                  <Share2 size={14} />
                  Share
                </Button>
              </div>
            </div>

            {/* Placeholder for future external resources */}
            <div className="bg-card rounded-xl p-6 border border-border/30 border-dashed opacity-60">
              <div className="text-center py-8">
                <Globe size={32} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">More Resources Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  We're continuously adding more external Islamic resources and educational content.
                </p>
              </div>
            </div>

            {/* Placeholder for future external resources */}
            <div className="bg-card rounded-xl p-6 border border-border/30 border-dashed opacity-60">
              <div className="text-center py-8">
                <BookOpen size={32} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Suggest a Resource</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Know of a valuable Islamic resource? Let us know and we'll consider adding it.
                </p>
                <Button size="sm" variant="outline">
                  Suggest Resource
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Resources */}
        <div>
          <h2 className="text-2xl font-display mb-6">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResources.map((resource, index) => {
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
                      <Badge className={cn("text-xs", getCategoryColor(resource.category))}>
                        {resource.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-display text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {resource.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      {resource.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{resource.views} views</span>
                      {resource.downloads > 0 && <span>{resource.downloads} downloads</span>}
                    </div>
                    
                    {resource.downloadUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(resource)}
                        className="gap-1"
                      >
                        <Download size={12} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Resources Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more resources.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
