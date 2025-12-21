import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Heart,
  Star,
  Clock,
  User,
  Tag,
  FileText,
  Headphones,
  Video,
  Globe,
  CheckCircle,
  Plus,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LibraryItem {
  id: string;
  title: string;
  author: string;
  type: "book" | "audio" | "video" | "article";
  category: string;
  description: string;
  language: string;
  pages?: number;
  duration?: string;
  rating: number;
  downloads: number;
  isBookmarked: boolean;
  coverUrl?: string;
  tags: string[];
}

const libraryItems: LibraryItem[] = [
  {
    id: "1",
    title: "Tafsir Ibn Kathir",
    author: "Ibn Kathir",
    type: "book",
    category: "Quran & Tafsir",
    description: "Comprehensive commentary on the Holy Quran by the renowned Islamic scholar Ibn Kathir",
    language: "Arabic/English",
    pages: 4000,
    rating: 4.9,
    downloads: 1250,
    isBookmarked: true,
    tags: ["Tafsir", "Quran", "Classical", "Essential"]
  },
  {
    id: "2",
    title: "Sahih al-Bukhari",
    author: "Imam al-Bukhari",
    type: "book",
    category: "Hadith",
    description: "The most authentic collection of Prophetic traditions",
    language: "Arabic/English",
    pages: 2800,
    rating: 4.9,
    downloads: 980,
    isBookmarked: false,
    tags: ["Hadith", "Sahih", "Authentic", "Essential"]
  },
  {
    id: "3",
    title: "Quran Recitation - Mishary Rashid",
    author: "Mishary Rashid Alafasy",
    type: "audio",
    category: "Quran Recitation",
    description: "Beautiful recitation of the complete Quran with Tajweed",
    language: "Arabic",
    duration: "18 hours",
    rating: 4.8,
    downloads: 2100,
    isBookmarked: true,
    tags: ["Recitation", "Tajweed", "Complete", "Audio"]
  },
  {
    id: "4",
    title: "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    type: "book",
    category: "Seerah",
    description: "Award-winning biography of Prophet Muhammad ﷺ",
    language: "English",
    pages: 600,
    rating: 4.7,
    downloads: 1800,
    isBookmarked: false,
    tags: ["Seerah", "Biography", "Prophet", "Award-winning"]
  },
  {
    id: "5",
    title: "Islamic Jurisprudence Lectures",
    author: "Dr. Yasir Qadhi",
    type: "video",
    category: "Fiqh",
    description: "Comprehensive video series on Islamic jurisprudence and legal principles",
    language: "English",
    duration: "25 hours",
    rating: 4.6,
    downloads: 750,
    isBookmarked: true,
    tags: ["Fiqh", "Jurisprudence", "Contemporary", "Video"]
  },
  {
    id: "6",
    title: "The Fundamentals of Tawheed",
    author: "Dr. Abu Ameenah Bilal Philips",
    type: "book",
    category: "Aqeedah",
    description: "Essential guide to Islamic monotheism and belief system",
    language: "English",
    pages: 250,
    rating: 4.5,
    downloads: 1400,
    isBookmarked: false,
    tags: ["Tawheed", "Aqeedah", "Fundamentals", "Belief"]
  }
];

const categories = [
  "All Categories",
  "Quran & Tafsir",
  "Hadith",
  "Seerah",
  "Fiqh",
  "Aqeedah",
  "Islamic History",
  "Contemporary Issues",
  "Quran Recitation",
  "Lectures"
];

const typeIcons = {
  book: FileText,
  audio: Headphones,
  video: Video,
  article: Globe
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [items, setItems] = useState<LibraryItem[]>(libraryItems);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const toggleBookmark = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  return (
    <PageLayout 
      title="Digital Library" 
      subtitle="Islamic knowledge repository for HUMSJ community"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="book">Books</option>
              <option value="audio">Audio</option>
              <option value="video">Videos</option>
              <option value="article">Articles</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="default">
              <Filter size={18} />
              Advanced Filter
            </Button>
            <Button variant="default" size="default" className="bg-primary hover:bg-primary/90 shadow-red gap-2">
              <Plus size={18} />
              Request Resource
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Resources", value: "1,250+", icon: BookOpen, color: "text-primary" },
            { label: "Downloads", value: "8,280", icon: Download, color: "text-secondary" },
            { label: "Categories", value: "12", icon: Tag, color: "text-accent" },
            { label: "Languages", value: "5", icon: Globe, color: "text-green-500" }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Library Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <LibraryItemCard 
              key={item.id} 
              item={item} 
              delay={index * 100}
              onToggleBookmark={() => toggleBookmark(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function LibraryItemCard({ 
  item, 
  delay, 
  onToggleBookmark 
}: { 
  item: LibraryItem; 
  delay: number;
  onToggleBookmark: () => void;
}) {
  const TypeIcon = typeIcons[item.type];

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <TypeIcon size={24} className="text-primary" />
          </div>
          <div>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              item.type === "book" && "bg-blue-500/10 text-blue-500",
              item.type === "audio" && "bg-green-500/10 text-green-500",
              item.type === "video" && "bg-purple-500/10 text-purple-500",
              item.type === "article" && "bg-orange-500/10 text-orange-500"
            )}>
              {item.type.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={onToggleBookmark}
          className={cn(
            "p-2 rounded-lg transition-all",
            item.isBookmarked 
              ? "text-primary bg-primary/10 hover:bg-primary/20" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          <Bookmark size={18} className={item.isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground">by {item.author}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span>{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download size={14} />
              <span>{item.downloads}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{item.pages ? `${item.pages} pages` : item.duration}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 shadow-red gap-2">
            <Eye size={14} />
            View
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-border/50 hover:border-primary gap-2">
            <Download size={14} />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}