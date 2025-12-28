import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import { 
  FileText, 
  Video, 
  Music, 
  Image, 
  Upload,
  Search,
  Grid3X3,
  List,
  Download,
  Eye,
  MoreVertical,
  Folder,
  Trash2,
  AlertCircle,
  Heart,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  type: "document" | "video" | "audio" | "image";
  category: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  downloads: number;
  thumbnail?: string;
  description?: string;
  file_url?: string;
  file_path?: string;
}

export default function ContentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "document" as ContentItem["type"]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const categories = ["All", "Khutba", "Educational", "Guide", "Recitation", "Media", "Workshop", "Announcement"];

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const fetchContent = useCallback(async () => {
    try {
      // For now, using mock data. In production, this would fetch from Supabase
      const mockContent: ContentItem[] = [
        {
          id: "1",
          title: "Friday Khutba - Patience in Trials",
          type: "video",
          category: "Khutba",
          size: "245 MB",
          uploadedBy: "Media Team",
          uploadedAt: "2024-02-15",
          views: 156,
          downloads: 23,
          description: "Last Friday's khutba delivered by Imam Yusuf"
        },
        {
          id: "2",
          title: "Surah Al-Kahf Tafsir Notes",
          type: "document",
          category: "Educational",
          size: "2.4 MB",
          uploadedBy: "Education Sector",
          uploadedAt: "2024-02-14",
          views: 89,
          downloads: 45,
          description: "Comprehensive notes from weekly Tafsir halaqa"
        },
        {
          id: "3",
          title: "Ramadan Preparation Guide 2024",
          type: "document",
          category: "Guide",
          size: "5.1 MB",
          uploadedBy: "Da'wa Sector",
          uploadedAt: "2024-02-12",
          views: 234,
          downloads: 178,
          description: "Complete guide for preparing for the blessed month"
        },
        {
          id: "4",
          title: "Quran Recitation - Surah Rahman",
          type: "audio",
          category: "Recitation",
          size: "18 MB",
          uploadedBy: "Media Team",
          uploadedAt: "2024-02-10",
          views: 312,
          downloads: 156
        },
        {
          id: "5",
          title: "HUMSJ Event Posters Collection",
          type: "image",
          category: "Media",
          size: "45 MB",
          uploadedBy: "Design Team",
          uploadedAt: "2024-02-08",
          views: 67,
          downloads: 12,
          description: "Collection of event promotional materials"
        },
        {
          id: "6",
          title: "Islamic Finance Workshop Recording",
          type: "video",
          category: "Workshop",
          size: "890 MB",
          uploadedBy: "Academic Sector",
          uploadedAt: "2024-02-05",
          views: 78,
          downloads: 34
        },
      ];
      setContent(mockContent);
    } catch (error) {
      toast.error("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Auto-detect file type
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        setUploadForm(prev => ({ ...prev, type: 'image' }));
      } else if (fileType.startsWith('video/')) {
        setUploadForm(prev => ({ ...prev, type: 'video' }));
      } else if (fileType.startsWith('audio/')) {
        setUploadForm(prev => ({ ...prev, type: 'audio' }));
      } else {
        setUploadForm(prev => ({ ...prev, type: 'document' }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title || !uploadForm.category) {
      toast.error("Please fill all required fields and select a file");
      return;
    }

    setIsUploading(true);
    try {
      // In production, this would upload to Supabase Storage
      // For now, we'll simulate the upload
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: uploadForm.title,
        type: uploadForm.type,
        category: uploadForm.category,
        description: uploadForm.description,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: profile?.full_name || "Unknown",
        uploadedAt: new Date().toISOString().split('T')[0],
        views: 0,
        downloads: 0
      };

      setContent(prev => [newContent, ...prev]);
      toast.success("Content uploaded successfully!");
      
      // Reset form
      setUploadForm({
        title: "",
        description: "",
        category: "",
        type: "document"
      });
      setSelectedFile(null);
      setIsUploadOpen(false);
    } catch (error) {
      toast.error("Failed to upload content");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setContent(prev => prev.filter(item => item.id !== id));
      toast.success("Content deleted successfully");
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  const filteredContent = content.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const stats = {
    total: content.length,
    documents: content.filter(c => c.type === "document").length,
    videos: content.filter(c => c.type === "video").length,
    audio: content.filter(c => c.type === "audio").length,
  };

  const typeConfig = {
    document: { icon: FileText, color: "bg-primary/10 text-primary" },
    video: { icon: Video, color: "bg-secondary/10 text-secondary" },
    audio: { icon: Music, color: "bg-accent/10 text-accent" },
    image: { icon: Image, color: "bg-emerald-glow/10 text-emerald-glow" },
  };

  return (
    <PageLayout 
      title="Content Library" 
      subtitle="Manage and access educational resources"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Folder size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.documents}</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Video size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.videos}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Music size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.audio}</p>
                <p className="text-xs text-muted-foreground">Audio Files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search content..."
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
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex bg-card rounded-xl p-1 shadow-soft">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <List size={18} />
              </button>
            </div>
            
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Upload size={18} />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file">Select File</Label>
                    <div className="mt-1">
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full p-2 border border-border rounded-lg"
                        accept=".pdf,.doc,.docx,.mp4,.mp3,.jpg,.jpeg,.png,.gif"
                      />
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter content title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== "All").map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={uploadForm.type} onValueChange={(value: ContentItem["type"]) => setUploadForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter content description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleUpload} 
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsUploadOpen(false)}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {["all", "document", "video", "audio", "image"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted shadow-soft"
              )}
            >
              {type === "all" ? "All Types" : `${type}s`}
            </button>
          ))}
        </div>

        {/* Content Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item, index) => (
              <ContentCard key={item.id} item={item} delay={index * 50} onDelete={handleDelete} typeConfig={typeConfig} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContent.map((item, index) => (
              <ContentListItem key={item.id} item={item} delay={index * 50} onDelete={handleDelete} typeConfig={typeConfig} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function ContentCard({ item, delay, onDelete, typeConfig }: { 
  item: ContentItem; 
  delay: number; 
  onDelete: (id: string) => void;
  typeConfig: unknown;
}) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div 
      className="bg-card rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 overflow-hidden animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Thumbnail/Icon Area */}
      <div className={cn("h-32 flex items-center justify-center relative", config.color)}>
        <Icon size={48} />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-background"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold line-clamp-2">{item.title}</h3>
          <button className="p-1 rounded hover:bg-muted">
            <MoreVertical size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        {item.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {item.description}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mb-3">
          {item.category} • {item.size}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Download size={12} />
              {item.downloads}
            </span>
          </div>
          <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye size={14} className="mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download size={14} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

function ContentListItem({ item, delay, onDelete, typeConfig }: { 
  item: ContentItem; 
  delay: number; 
  onDelete: (id: string) => void;
  typeConfig: unknown;
}) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div 
      className="bg-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 flex items-center gap-4 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", config.color)}>
        <Icon size={24} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{item.title}</h3>
        <p className="text-sm text-muted-foreground">
          {item.category} • {item.size} • by {item.uploadedBy}
        </p>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {item.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {item.views}
        </span>
        <span className="flex items-center gap-1">
          <Download size={14} />
          {item.downloads}
        </span>
        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Eye size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <Download size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
