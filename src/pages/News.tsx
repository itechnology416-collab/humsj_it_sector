import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { PageLayout } from "@/components/layout/PageLayout";
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  isPinned: boolean;
  views: number;
  comments: number;
  tags: string[];
  imageUrl?: string;
}

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Ramadan 2024 Schedule and Programs Announced",
    excerpt: "Join us for a blessed month of fasting, prayer, and community gathering. Special programs and iftar arrangements have been organized.",
    content: "We are pleased to announce our comprehensive Ramadan 2024 program schedule...",
    author: "Admin Team",
    publishedAt: "2024-03-15T10:00:00Z",
    category: "Religious Events",
    isPinned: true,
    views: 1250,
    comments: 45,
    tags: ["Ramadan", "Prayer", "Community", "Iftar"]
  },
  {
    id: "2",
    title: "New Islamic Learning Center Opens",
    excerpt: "Our state-of-the-art learning center is now open with courses for all ages. Registration is now available for spring semester.",
    content: "After months of preparation, we are excited to announce the opening of our new Islamic Learning Center...",
    author: "Education Committee",
    publishedAt: "2024-03-10T14:30:00Z",
    category: "Education",
    isPinned: true,
    views: 890,
    comments: 23,
    tags: ["Education", "Learning", "Courses", "Registration"]
  },
  {
    id: "3",
    title: "Community Volunteer Drive Success",
    excerpt: "Thanks to our amazing volunteers, we successfully completed our winter charity drive, helping over 200 families in need.",
    content: "We are grateful to announce the tremendous success of our winter volunteer drive...",
    author: "Volunteer Coordinator",
    publishedAt: "2024-03-08T09:15:00Z",
    category: "Community Service",
    isPinned: false,
    views: 567,
    comments: 18,
    tags: ["Volunteer", "Charity", "Community", "Success"]
  },
  {
    id: "4",
    title: "Youth Program Expansion",
    excerpt: "Exciting new programs for our youth including sports activities, mentorship programs, and leadership development workshops.",
    content: "We are thrilled to announce the expansion of our youth programs...",
    author: "Youth Committee",
    publishedAt: "2024-03-05T16:45:00Z",
    category: "Youth Programs",
    isPinned: false,
    views: 423,
    comments: 12,
    tags: ["Youth", "Sports", "Leadership", "Mentorship"]
  },
  {
    id: "5",
    title: "Technology Upgrade Complete",
    excerpt: "Our website and mobile app have been upgraded with new features including AI-powered recommendations and enhanced user experience.",
    content: "We are excited to share that our major technology upgrade has been completed...",
    author: "IT Department",
    publishedAt: "2024-03-01T11:20:00Z",
    category: "Technology",
    isPinned: false,
    views: 789,
    comments: 34,
    tags: ["Technology", "AI", "Mobile", "Upgrade"]
  }
];

const categories = [
  "All",
  "Religious Events",
  "Education",
  "Community Service",
  "Youth Programs",
  "Technology",
  "Announcements"
];

export default function News() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filteredNews = newsData.filter(news => {
    const matchesCategory = selectedCategory === "All" || news.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const pinnedNews = filteredNews.filter(news => news.isPinned);
  const regularNews = filteredNews.filter(news => !news.isPinned);

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
    <PageLayout 
      title="News & Announcements" 
      subtitle="Stay updated with community news"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
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

        {/* Pinned News */}
        {pinnedNews.length > 0 && (
          <div>
            <h3 className="font-display text-xl mb-4 flex items-center gap-2">
              <Pin size={20} className="text-primary" />
              Pinned Announcements
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
                        {news.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(news.publishedAt)}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg mb-2 text-primary">{news.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{news.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {news.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {news.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {news.comments}
                      </span>
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
                        {news.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(news.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-display text-xl mb-2 hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {news.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {news.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          {news.comments} comments
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {news.tags.slice(0, 3).map((tag) => (
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
      </div>
    </PageLayout>
  );
}