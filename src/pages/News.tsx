import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { contentApi, type ContentItem } from "@/services/contentApi";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { 
  Newspaper, 
  Calendar, 
  User, 
  Eye, 
  MessageSquare, 
  Share2,
  Search,
  Clock,
  TrendingUp,
  Bell,
  Pin,
  Tag,
  AlertCircle,
  CheckCircle,
  Shield,
  Globe,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParallaxSection, ParallaxContainer } from "@/components/effects/ParallaxContainer";
import { toast } from "sonner";

export default function News() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data
  const [newsItems, setNewsItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState<ContentItem | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get news content (assuming news content type exists)
      const [newsResponse, contentTypesResponse] = await Promise.all([
        contentApi.getContentItems({ 
          status: 'published',
          limit: 50 
        }),
        contentApi.getContentTypes()
      ]);

      // Filter for news-type content
      const newsContent = newsResponse.filter(item => 
        item.content_type?.name?.toLowerCase().includes('news') ||
        item.content_type?.name?.toLowerCase().includes('announcement') ||
        item.tags?.some(tag => tag.toLowerCase().includes('news'))
      );

      setNewsItems(newsContent);
      
      // Extract categories from content types and tags
      const categorySet = new Set<string>(["All"]);
      newsContent.forEach(item => {
        if (item.content_type?.name) {
          categorySet.add(item.content_type.name);
        }
        item.tags?.forEach(tag => categorySet.add(tag));
      });
      
      setCategories(Array.from(categorySet));
      
    } catch (err: unknown) {
      console.error('Error loading news:', err);
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredNews = newsItems.filter(news => {
    const matchesCategory = selectedCategory === "All" || 
      news.content_type?.name === selectedCategory ||
      news.tags?.includes(selectedCategory);
    const matchesSearch = searchQuery === "" || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (news.excerpt && news.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      news.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const pinnedNews = filteredNews.filter(news => news.is_featured);
  const regularNews = filteredNews.filter(news => !news.is_featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <PublicPageLayout 
      title="News & Announcements" 
      subtitle="Stay updated with community news"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
                <Newspaper size={32} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display tracking-wide mb-2">Community Updates</h2>
                <p className="text-muted-foreground">
                  Stay informed about the latest news, events, and announcements from our community
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-primary">
                    <Newspaper size={14} />
                    {newsItems.length} Articles
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate("/notifications")}
              variant="outline"
              className="gap-2"
            >
              <Bell size={16} />
              Subscribe
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search news and announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pinned News */}
            {pinnedNews.length > 0 && (
              <div>
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <Pin size={20} className="text-primary" />
                  Featured Announcements
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pinnedNews.map((news, index) => (
                    <div 
                      key={news.id}
                      className="bg-card rounded-xl border border-primary/30 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedNews(news)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Pin size={16} className="text-primary" />
                          <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">
                            {news.content_type?.name || 'Featured'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {news.published_at && formatTimeAgo(news.published_at)}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-lg mb-2 text-primary">{news.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {news.excerpt || (typeof news.content === 'object' && news.content && 'excerpt' in news.content ? String(news.content.excerpt) : '') || 'No excerpt available'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {news.author?.full_name || 'Admin'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {news.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular News */}
            <div>
              <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Latest News
              </h3>
              <div className="space-y-4">
                {regularNews.map((news, index) => (
                  <div 
                    key={news.id}
                    className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${(index + pinnedNews.length) * 100}ms` }}
                    onClick={() => setSelectedNews(news)}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground">
                            {news.content_type?.name || 'News'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {news.published_at && formatDate(news.published_at)}
                          </span>
                        </div>
                        
                        <h3 className="font-display text-xl mb-2 hover:text-primary transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {news.excerpt || (typeof news.content === 'object' && news.content && 'excerpt' in news.content ? String(news.content.excerpt) : '') || 'No excerpt available'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {news.author?.full_name || 'Admin'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {news.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* No Results */}
            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <Newspaper size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No news found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-primary/10 via-card to-accent/10 rounded-xl p-6 border border-primary/20">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-display tracking-wide mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to receive the latest news and announcements directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-background border border-border/50 focus:border-primary outline-none"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Islamic News & Media Ethics */}
        <ParallaxSection 
          className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20 mt-12"
          backgroundPattern="islamic"
          speed={0.4}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Newspaper size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Islamic Media Ethics & News Guidelines</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding Islamic principles that guide truthful reporting, responsible sharing, and ethical communication
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Truth and Verification */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Truth and Verification (Tabayyun)
              </h3>
              <div className="space-y-4">
                <div className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                  <h4 className="font-semibold text-primary mb-2">Quranic Guidance</h4>
                  <p className="text-lg font-arabic text-right mb-2 text-green-600">
                    يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا
                  </p>
                  <p className="text-sm italic text-muted-foreground mb-2">
                    "O you who believe! If a wicked person comes to you with any news, ascertain the truth..."
                  </p>
                  <p className="text-xs text-accent font-medium">- Quran 49:6</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Verify information before sharing",
                    "Check multiple reliable sources",
                    "Avoid spreading unconfirmed reports",
                    "Correct mistakes when discovered"
                  ].map((principle, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <CheckCircle size={16} className="text-green-500" />
                      {principle}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Avoiding Harm */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                Avoiding Harm (La Darar wa la Dirar)
              </h3>
              <div className="space-y-4">
                <div className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                  <h4 className="font-semibold text-primary mb-2">Prophetic Teaching</h4>
                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                    "There should be neither harming nor reciprocating harm."
                  </blockquote>
                  <p className="text-xs text-accent font-medium">- Ibn Majah</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Avoid sensationalism and fear-mongering",
                    "Protect privacy and dignity of individuals",
                    "Consider the impact on community harmony",
                    "Focus on constructive and beneficial content"
                  ].map((principle, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <Shield size={16} className="text-blue-500" />
                      {principle}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>

        {/* Islamic Current Affairs Knowledge */}
        <ParallaxSection 
          className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-green-500/20"
          backgroundPattern="dots"
          speed={0.3}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Globe size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Understanding Current Affairs Through Islamic Lens</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Analyzing contemporary issues and events through Islamic principles and values
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                topic: "Social Justice",
                islamicPerspective: "Islam emphasizes justice (Adl) as a fundamental principle",
                keyPrinciples: [
                  "Equality before Allah regardless of race or status",
                  "Protection of the weak and vulnerable",
                  "Fair distribution of resources",
                  "Speaking truth to power"
                ],
                verse: "O you who believe! Stand out firmly for justice, as witnesses to Allah, even if it be against yourselves, your parents, and your relatives.",
                reference: "Quran 4:135",
                color: "from-blue-500 to-cyan-500",
                icon: "⚖️"
              },
              {
                topic: "Environmental Issues",
                islamicPerspective: "Humans are trustees (Khalifa) of Earth, responsible for its care",
                keyPrinciples: [
                  "Avoiding waste (Israf) and excess",
                  "Protecting natural resources",
                  "Maintaining ecological balance",
                  "Sustainable development practices"
                ],
                verse: "And it is He who has made you successors upon the earth.",
                reference: "Quran 35:39",
                color: "from-green-500 to-emerald-500",
                icon: "🌍"
              },
              {
                topic: "Economic Affairs",
                islamicPerspective: "Islamic economics promotes ethical trade and social welfare",
                keyPrinciples: [
                  "Prohibition of interest (Riba)",
                  "Fair trade and honest dealings",
                  "Wealth circulation through Zakat",
                  "Prohibition of exploitation"
                ],
                verse: "Allah has permitted trade and has forbidden interest.",
                reference: "Quran 2:275",
                color: "from-amber-500 to-yellow-500",
                icon: "💰"
              }
            ].map((topic, idx) => (
              <div key={idx} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{topic.icon}</span>
                  <h3 className="text-lg font-semibold text-primary">{topic.topic}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{topic.islamicPerspective}</p>
                <div className="bg-secondary/20 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Key Principles:</h4>
                  <ul className="text-xs space-y-1">
                    {topic.keyPrinciples.map((principle, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-accent" />
                        {principle}
                      </li>
                    ))}
                  </ul>
                </div>
                <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                  "{topic.verse}"
                </blockquote>
                <p className="text-xs text-accent font-medium">- {topic.reference}</p>
              </div>
            ))}
          </div>
        </ParallaxSection>
      </div>
    </PublicPageLayout>
  );
}