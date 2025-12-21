import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDawaContent } from "@/hooks/useDawaContent";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Heart, 
  FileText, 
  Video, 
  Calendar, 
  Eye, 
  ThumbsUp,
  MessageSquare,
  Share2,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Edit,
  Plus,
  Search,
  User,
  Globe,
  Play,
  BookOpen,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DawaContent {
  id: string;
  title: string;
  type: "article" | "video" | "audio" | "infographic";
  status: "pending" | "approved" | "rejected" | "scheduled";
  author: string;
  submittedAt: string;
  scheduledFor?: string;
  category: string;
  language: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  description: string;
  tags: string[];
}

const mockDawaContent: DawaContent[] = [
  {
    id: "1",
    title: "The Five Pillars of Islam - Complete Guide",
    type: "article",
    status: "approved",
    author: "Sheikh Ahmed Al-Mahmoud",
    submittedAt: "2024-03-15T10:30:00Z",
    scheduledFor: "2024-03-20T15:00:00Z",
    category: "Islamic Basics",
    language: "English",
    views: 1250,
    likes: 89,
    comments: 23,
    shares: 45,
    description: "Comprehensive guide explaining the fundamental pillars of Islamic faith and practice.",
    tags: ["Pillars", "Islam", "Basics", "Faith"]
  },
  {
    id: "2",
    title: "Beautiful Quran Recitation - Surah Al-Fatiha",
    type: "audio",
    status: "pending",
    author: "Qari Muhammad Hassan",
    submittedAt: "2024-03-14T14:20:00Z",
    category: "Quran Recitation",
    language: "Arabic",
    description: "Melodious recitation of the opening chapter of the Holy Quran with proper Tajweed.",
    tags: ["Quran", "Recitation", "Al-Fatiha", "Tajweed"]
  },
  {
    id: "3",
    title: "Islamic History: The Golden Age",
    type: "video",
    status: "scheduled",
    author: "Dr. Fatima Hassan",
    submittedAt: "2024-03-13T09:15:00Z",
    scheduledFor: "2024-03-25T18:00:00Z",
    category: "Islamic History",
    language: "English",
    description: "Documentary exploring the achievements and contributions during Islam's golden age.",
    tags: ["History", "Golden Age", "Science", "Culture"]
  },
  {
    id: "4",
    title: "Prayer Times Infographic",
    type: "infographic",
    status: "rejected",
    author: "Design Team",
    submittedAt: "2024-03-12T16:45:00Z",
    category: "Prayer",
    language: "Multilingual",
    description: "Visual guide showing prayer times and their significance throughout the day.",
    tags: ["Prayer", "Times", "Visual", "Guide"]
  },
  {
    id: "5",
    title: "Ramadan Preparation Checklist",
    type: "article",
    status: "pending",
    author: "Community Team",
    submittedAt: "2024-03-11T11:30:00Z",
    category: "Ramadan",
    language: "English",
    description: "Practical guide to prepare spiritually and physically for the holy month of Ramadan.",
    tags: ["Ramadan", "Preparation", "Fasting", "Spirituality"]
  }
];

const contentTypes = [
  { value: "all", label: "All Types", icon: Globe },
  { value: "article", label: "Articles", icon: FileText },
  { value: "video", label: "Videos", icon: Video },
  { value: "audio", label: "Audio", icon: Play },
  { value: "infographic", label: "Infographics", icon: Eye }
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "scheduled", label: "Scheduled" }
];

const categories = [
  "All Categories",
  "Islamic Basics",
  "Quran Recitation",
  "Islamic History",
  "Prayer",
  "Ramadan",
  "Hadith",
  "Fiqh",
  "Spirituality"
];

export default function DigitalDawaManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<DawaContent[]>(mockDawaContent);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return X;
      case 'scheduled': return Calendar;
      default: return AlertTriangle;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'audio': return Play;
      case 'infographic': return Eye;
      default: return FileText;
    }
  };

  const handleApprove = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, status: "approved" as const } : item
    ));
    toast.success("Content approved successfully");
  };

  const handleReject = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, status: "rejected" as const } : item
    ));
    toast.success("Content rejected");
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
      title="Digital Da'wa Management" 
      subtitle="Manage Islamic content and outreach materials"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Heart size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Da'wa Content</h2>
              <p className="text-sm text-muted-foreground">Review and manage Islamic outreach content</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/content")}
              className="gap-2"
            >
              <BookOpen size={16} />
              Content Library
            </Button>
            <Button
              onClick={() => toast.info("Content submission form would open")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              Submit Content
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
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
            { label: "Pending Review", value: content.filter(c => c.status === 'pending').length.toString(), icon: Clock, color: "text-amber-400" },
            { label: "Approved", value: content.filter(c => c.status === 'approved').length.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Scheduled", value: content.filter(c => c.status === 'scheduled').length.toString(), icon: Calendar, color: "text-blue-400" },
            { label: "Total Views", value: content.reduce((sum, c) => sum + (c.views || 0), 0).toLocaleString(), icon: Eye, color: "text-primary" }
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
              <Heart size={18} className="text-primary" />
              Da'wa Content ({filteredContent.length})
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
                          <span className={cn("text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1", getStatusColor(item.status))}>
                            <StatusIcon size={12} />
                            {item.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground">
                            {item.type}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {item.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(item.submittedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe size={14} />
                            {item.language}
                          </span>
                        </div>

                        {item.status === 'approved' && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            {item.views && (
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {item.views} views
                              </span>
                            )}
                            {item.likes && (
                              <span className="flex items-center gap-1">
                                <ThumbsUp size={14} />
                                {item.likes} likes
                              </span>
                            )}
                            {item.comments && (
                              <span className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                {item.comments} comments
                              </span>
                            )}
                            {item.shares && (
                              <span className="flex items-center gap-1">
                                <Share2 size={14} />
                                {item.shares} shares
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye size={14} />
                        Preview
                      </Button>
                      {item.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(item.id)}
                            className="bg-green-500 hover:bg-green-500/90 text-white gap-1"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(item.id)}
                            className="text-red-400 hover:text-red-300 gap-1"
                          >
                            <X size={14} />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit size={14} />
                        Edit
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
            <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}