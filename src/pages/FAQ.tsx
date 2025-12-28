import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { contentApi, type ContentItem } from "@/services/contentApi";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings,
  MessageSquare,
  Shield,
  Heart,
  AlertCircle,
  ThumbsUp,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data
  const [faqItems, setFaqItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<{ name: string; icon: unknown; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get FAQ content (assuming FAQ content type exists)
      const [faqResponse, contentTypesResponse] = await Promise.all([
        contentApi.getContentItems({ 
          status: 'published',
          limit: 100 
        }),
        contentApi.getContentTypes()
      ]);

      // Filter for FAQ-type content
      const faqContent = faqResponse.filter(item => 
        item.content_type?.name?.toLowerCase().includes('faq') ||
        item.content_type?.name?.toLowerCase().includes('question') ||
        item.tags?.some(tag => tag.toLowerCase().includes('faq'))
      );

      setFaqItems(faqContent);
      
      // Extract categories from content and create category structure
      const categoryMap = new Map<string, number>();
      categoryMap.set("All", faqContent.length);
      
      faqContent.forEach(item => {
        const category = item.content_type?.name || 'General';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        
        item.tags?.forEach(tag => {
          categoryMap.set(tag, (categoryMap.get(tag) || 0) + 1);
        });
      });

      const categoryList = [
        { name: "All", icon: HelpCircle, count: faqContent.length },
        { name: "General", icon: BookOpen, count: categoryMap.get("General") || 0 },
        { name: "Prayer & Worship", icon: Heart, count: categoryMap.get("Prayer & Worship") || 0 },
        { name: "Events & Activities", icon: Calendar, count: categoryMap.get("Events & Activities") || 0 },
        { name: "Learning & Education", icon: Users, count: categoryMap.get("Learning & Education") || 0 },
        { name: "Community & Volunteering", icon: Shield, count: categoryMap.get("Community & Volunteering") || 0 },
        { name: "Technical Support", icon: Settings, count: categoryMap.get("Technical Support") || 0 }
      ].filter(cat => cat.count > 0);
      
      setCategories(categoryList);
      
    } catch (err: unknown) {
      console.error('Error loading FAQ:', err);
      setError(err instanceof Error ? err.message : 'Failed to load FAQ');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredFAQs = faqItems.filter(faq => {
    const matchesCategory = selectedCategory === "All" || 
      faq.content_type?.name === selectedCategory ||
      faq.tags?.includes(selectedCategory);
    const matchesSearch = searchQuery === "" || 
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof faq.content === 'object' && 
       JSON.stringify(faq.content).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <PageLayout 
      title="Frequently Asked Questions" 
      subtitle="Find answers to common questions"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              ×
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
              <HelpCircle size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-display tracking-wide mb-2">How can we help you?</h2>
              <p className="text-muted-foreground">
                Browse through our FAQ section to find answers to common questions.
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 text-primary">
                  <HelpCircle size={14} />
                  {faqItems.length} Questions
                </span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <MessageSquare size={16} />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading FAQ...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-5 border border-border/30">
                <h3 className="font-display text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                        selectedCategory === category.name
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <category.icon size={18} />
                      <span className="flex-1 text-sm">{category.name}</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-md">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="lg:col-span-3 space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-card rounded-xl border border-border/30">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <div className="flex-1">
                        <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary">
                          {faq.content_type?.name || 'FAQ'}
                        </span>
                        <h3 className="font-medium mt-2">{faq.title}</h3>
                      </div>
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp size={20} className="text-primary" />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    
                    {expandedItems.includes(faq.id) && (
                      <div className="px-6 pb-6 border-t border-border/30">
                        <div className="text-muted-foreground pt-4">
                          {typeof faq.content === 'object' && faq.content && 'answer' in faq.content ? (
                            <p>{String(faq.content.answer)}</p>
                          ) : typeof faq.content === 'string' ? (
                            <p>{faq.content}</p>
                          ) : (
                            <p>{faq.excerpt || 'No answer available'}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <HelpCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No FAQs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}