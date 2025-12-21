import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Globe, 
  FileText, 
  Image, 
  Video, 
  Edit, 
  Eye, 
  Plus,
  Search,
  Calendar,
  User,
  Languages,
  Save,
  Upload,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  type: "page" | "article" | "media" | "section";
  status: "published" | "draft" | "review" | "archived";
  language: string;
  author: string;
  lastModified: string;
  publishDate?: string;
  category: string;
  views?: number;
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Home Page - Hero Section",
    type: "section",
    status: "published",
    language: "English",
    author: "Admin",
    lastModified: "2024-03-15T10:30:00Z",
    publishDate: "2024-03-15T10:30:00Z",
    category: "Homepage",
    views: 1250
  },
  {
    id: "2",
    title: "Islamic History - Golden Age",
    type: "article",
    status: "published",
    language: "English",
    author: "Dr. Ahmed Hassan",
    lastModified: "2024-03-14T15:20:00Z",
    publishDate: "2024-03-14T15:20:00Z",
    category: "Islamic History",
    views: 890
  },
  {
    id: "3",
    title: "የእስልምና ታሪክ - ወርቃማ ዘመን",
    type: "article",
    status: "review",
    language: "Amharic",
    author: "Translator Team",
    lastModified: "2024-03-13T09:15:00Z",
    category: "Islamic History"
  },
  {
    id: "4",
    title: "Prayer Times Widget",
    type: "section",
    status: "published",
    language: "Multilingual",
    author: "IT Team",
    lastModified: "2024-03-12T14:45:00Z",
    publishDate: "2024-03-12T14:45:00Z",
    category: "Components",
    views: 2100
  },
  {
    id: "5",
    title: "Community Guidelines",
    type: "page",
    status: "draft",
    language: "English",
    author: "Leadership Team",
    lastModified: "2024-03-11T11:30:00Z",
    category: "Policies"
  }
];

const contentTypes = [
  { value: "all", label: "All Content", icon: Globe },
  { value: "page", label: "Pages", icon: FileText },
  { value: "article", label: "Articles", icon: FileText },
  { value: "section", label: "Sections", icon: Image },
  { value: "media", label: "Media", icon: Video }
];

const languages = [
  { code: "all", name: "All Languages" },
  { code: "en", name: "English" },
  { code: "am", name: "Amharic" },
  { code: "or", name: "Afaan Oromo" },
  { code: "ar", name: "Arabic" },
  { code: "multi", name: "Multilingual" }
];

const categories = [
  "All Categories",
  "Homepage",
  "Islamic History", 
  "Components",
  "Policies",
  "Events",
  "Education",
  "Community"
];

export default function WebsiteContentManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const filteredContent = content.filter(item => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesLanguage = selectedLanguage === "all" || 
      item.language.toLowerCase().includes(selectedLanguage) ||
      (selectedLanguage === "multi" && item.language === "Multilingual");
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesLanguage && matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20';
      case 'draft': return 'text-amber-400 bg-amber-500/20';
      case 'review': return 'text-blue-400 bg-blue-500/20';
      case 'archived': return 'text-muted-foreground bg-muted/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return CheckCircle;
      case 'draft': return Edit;
      case 'review': return Clock;
      case 'archived': return Trash2;
      default: return AlertTriangle;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return FileText;
      case 'article': return FileText;
      case 'section': return Image;
      case 'media': return Video;
      default: return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <PageLayout 
      title="Website Content Management" 
      subtitle="Manage website content and multilingual pages"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Globe size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Content Management</h2>
              <p className="text-sm text-muted-foreground">Manage website content across multiple languages</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/content")}
              className="gap-2"
            >
              <Eye size={16} />
              View Content
            </Button>
            <Button
              onClick={() => toast.info("Content creation modal would open here")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              Create Content
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {contentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Content", value: content.length.toString(), icon: Globe, color: "text-primary" },
            { label: "Published", value: content.filter(c => c.status === 'published').length.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "In Review", value: content.filter(c => c.status === 'review').length.toString(), icon: Clock, color: "text-blue-400" },
            { label: "Drafts", value: content.filter(c => c.status === 'draft').length.toString(), icon: Edit, color: "text-amber-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-5 border border-border/30 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content List */}
        <div className="bg-card rounded-xl border border-border/30">
          <div className="p-6 border-b border-border/30">
            <h3 className="font-display text-lg flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Content Items ({filteredContent.length})
            </h3>
          </div>
          
          <div className="divide-y divide-border/30">
            {filteredContent.map((item, index) => {
              const StatusIcon = getStatusIcon(item.status);
              const TypeIcon = getTypeIcon(item.type);
              
              return (
                <div 
                  key={item.id}
                  className="p-6 hover:bg-secondary/50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <TypeIcon size={20} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getStatusColor(item.status))}>
                            {item.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground">
                            {item.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Languages size={14} />
                            {item.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {item.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(item.lastModified)}
                          </span>
                          {item.views && (
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {item.views} views
                            </span>
                          )}
                        </div>
                        
                        <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye size={14} />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Upload size={14} />
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* No Results */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Globe size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Bulk Upload", icon: Upload, action: () => toast.info("Bulk upload modal would open") },
            { label: "Translation Queue", icon: Languages, action: () => navigate("/translation-queue") },
            { label: "Content Analytics", icon: Eye, action: () => navigate("/content-analytics") },
            { label: "SEO Settings", icon: Search, action: () => navigate("/seo-settings") }
          ].map((action, index) => (
            <Button
              key={action.label}
              variant="outline"
              onClick={action.action}
              className="h-auto py-6 flex-col gap-3 border-border/30 hover:border-primary/50 hover:bg-secondary/50 group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <action.icon size={24} className="text-primary" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}