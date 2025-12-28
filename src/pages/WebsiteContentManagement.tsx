import { useEffect, useState , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { websiteContentApi, type WebsiteContent, type ContentCategory, type ContentType } from "@/services/websiteContentApi";
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
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const contentTypeOptions = [
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

export default function WebsiteContentManagement() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // API state
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContent, setTotalContent] = useState(0);
  
  // Filter state
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadData();
    }
  }, [user, isAdmin, selectedType, selectedLanguage, selectedCategory, searchQuery, currentPage]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load content with filters
      const filters: unknown = {};
      
      if (selectedType !== "all") {
        // Map UI types to content type IDs (would need to be dynamic in production)
        const typeMapping: Record<string, string> = {
          page: "page-type-id",
          article: "article-type-id", 
          section: "section-type-id",
          media: "media-type-id"
        };
        filters.content_type_id = typeMapping[selectedType];
      }
      
      if (selectedLanguage !== "all") {
        filters.language = selectedLanguage;
      }
      
      if (selectedCategory !== "all") {
        filters.category_id = selectedCategory;
      }
      
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const { content: contentData, total } = await websiteContentApi.getWebsiteContent({
        ...filters,
        limit: 20,
        offset: (currentPage - 1) * 20
      });

      setContent(contentData);
      setTotalContent(total);

      // Load categories and content types if not loaded
      if (categories.length === 0) {
        const categoriesData = await websiteContentApi.getContentCategories();
        setCategories(categoriesData);
      }

      if (contentTypes.length === 0) {
        const typesData = await websiteContentApi.getContentTypes();
        setContentTypes(typesData);
      }

    } catch (err: unknown) {
      console.error('Error loading content data:', err);
      setError(err.message || 'Failed to load content data');
      toast.error('Failed to load content data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishContent = async (contentId: string) => {
    try {
      await websiteContentApi.publishContent(contentId);
      toast.success('Content published successfully!');
      await loadData(); // Refresh data
    } catch (error: unknown) {
      console.error('Error publishing content:', error);
      toast.error(error.message || 'Failed to publish content');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await websiteContentApi.deleteContent(contentId);
      toast.success('Content deleted successfully!');
      await loadData(); // Refresh data
    } catch (error: unknown) {
      console.error('Error deleting content:', error);
      toast.error(error.message || 'Failed to delete content');
    }
  };

  const handleBulkAction = async (action: 'publish' | 'archive' | 'delete') => {
    if (selectedContent.length === 0) {
      toast.error('Please select content items first');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedContent.length} content item(s)?`;
    if (!confirm(confirmMessage)) return;

    try {
      if (action === 'delete') {
        await websiteContentApi.bulkDeleteContent(selectedContent);
      } else {
        const status = action === 'publish' ? 'published' : 'archived';
        await websiteContentApi.bulkUpdateContentStatus(selectedContent, status);
      }
      
      setSelectedContent([]);
      toast.success(`Successfully ${action}ed ${selectedContent.length} content item(s)`);
      await loadData(); // Refresh data
    } catch (error: unknown) {
      console.error(`Error ${action}ing content:`, error);
      toast.error(`Failed to ${action} content: ${error.message}`);
    }
  };

  const filteredContent = content; // Already filtered by API

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

  const getTypeIcon = (contentType?: ContentType) => {
    if (!contentType) return FileText;
    
    const typeName = contentType.name.toLowerCase();
    if (typeName.includes('page')) return FileText;
    if (typeName.includes('article')) return FileText;
    if (typeName.includes('section')) return Image;
    if (typeName.includes('media')) return Video;
    return FileText;
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
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
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>×</Button>
          </div>
        )}

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
              onClick={loadData}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
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
            {contentTypeOptions.map(type => (
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
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedContent.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedContent.length} content item(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkAction("publish")} className="bg-green-500 hover:bg-green-600">
                Publish
              </Button>
              <Button size="sm" onClick={() => handleBulkAction("archive")} variant="outline">
                Archive
              </Button>
              <Button size="sm" onClick={() => handleBulkAction("delete")} variant="outline" className="text-red-400 hover:text-red-300">
                Delete
              </Button>
              <Button size="sm" onClick={() => setSelectedContent([])} variant="ghost">
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Content Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Content", value: totalContent.toString(), icon: Globe, color: "text-primary" },
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
              const TypeIcon = getTypeIcon(item.content_type);
              
              return (
                <div 
                  key={item.id}
                  className="p-6 hover:bg-secondary/50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedContent.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContent(prev => [...prev, item.id]);
                          } else {
                            setSelectedContent(prev => prev.filter(id => id !== item.id));
                          }
                        }}
                        className="mt-2 rounded border-border"
                      />
                      
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
                            {item.content_type?.name || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Languages size={14} />
                            {item.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {item.author?.full_name || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(item.updated_at)}
                          </span>
                          {item.view_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {item.view_count} views
                            </span>
                          )}
                        </div>
                        
                        <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                          {item.category?.name || 'Uncategorized'}
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
                      {item.status !== 'published' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1"
                          onClick={() => handlePublishContent(item.id)}
                        >
                          <Upload size={14} />
                          Publish
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteContent(item.id)}
                      >
                        <Trash2 size={14} />
                        Delete
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