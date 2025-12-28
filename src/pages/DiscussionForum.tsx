import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Pin,
  Lock,
  Eye,
  Star,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const forumCategories = [
  { id: "general", name: "General Discussion", icon: MessageSquare, color: "text-blue-400", count: 45 },
  { id: "islamic", name: "Islamic Studies", icon: BookOpen, color: "text-green-400", count: 32 },
  { id: "tech", name: "Technology", icon: Lightbulb, color: "text-purple-400", count: 28 },
  { id: "questions", name: "Questions & Answers", icon: HelpCircle, color: "text-amber-400", count: 67 },
  { id: "announcements", name: "Announcements", icon: AlertCircle, color: "text-red-400", count: 12 }
];

const forumTopics = [
  {
    id: 1,
    title: "Best practices for daily prayer scheduling",
    category: "islamic",
    author: "Ahmed Hassan",
    authorRole: "member",
    content: "I'm looking for advice on maintaining consistent prayer times while managing a busy work schedule. What strategies have worked for you?",
    replies: 15,
    views: 234,
    likes: 8,
    dislikes: 0,
    isPinned: false,
    isLocked: false,
    isSolved: true,
    lastActivity: "2024-12-21T14:30:00Z",
    createdAt: "2024-12-20T09:15:00Z",
    tags: ["prayer", "schedule", "advice"]
  },
  {
    id: 2,
    title: "IT Committee: New website features discussion",
    category: "tech",
    author: "Omar Ali",
    authorRole: "admin",
    content: "We're planning to add new features to our community website. Please share your suggestions and feedback on what would be most helpful.",
    replies: 23,
    views: 456,
    likes: 12,
    dislikes: 1,
    isPinned: true,
    isLocked: false,
    isSolved: false,
    lastActivity: "2024-12-21T16:45:00Z",
    createdAt: "2024-12-19T11:20:00Z",
    tags: ["website", "features", "feedback"]
  },
  {
    id: 3,
    title: "Community Iftar - Volunteer coordination",
    category: "general",
    author: "Fatima Ahmed",
    authorRole: "committee",
    content: "We need volunteers for the upcoming community iftar. Please let us know if you can help with setup, serving, or cleanup.",
    replies: 31,
    views: 678,
    likes: 25,
    dislikes: 0,
    isPinned: false,
    isLocked: false,
    isSolved: false,
    lastActivity: "2024-12-21T18:20:00Z",
    createdAt: "2024-12-18T15:30:00Z",
    tags: ["iftar", "volunteers", "community"]
  },
  {
    id: 4,
    title: "Question: Proper etiquette for mosque visits",
    category: "questions",
    author: "New Member",
    authorRole: "member",
    content: "I'm new to the community and would like to know about proper etiquette when visiting the mosque. Any guidance would be appreciated.",
    replies: 8,
    views: 145,
    likes: 6,
    dislikes: 0,
    isPinned: false,
    isLocked: false,
    isSolved: true,
    lastActivity: "2024-12-21T12:10:00Z",
    createdAt: "2024-12-21T08:45:00Z",
    tags: ["etiquette", "mosque", "guidance"]
  },
  {
    id: 5,
    title: "ANNOUNCEMENT: System maintenance this weekend",
    category: "announcements",
    author: "IT Committee",
    authorRole: "admin",
    content: "Please be aware that we will be performing system maintenance this weekend. Some services may be temporarily unavailable.",
    replies: 5,
    views: 892,
    likes: 3,
    dislikes: 0,
    isPinned: true,
    isLocked: true,
    isSolved: false,
    lastActivity: "2024-12-21T10:00:00Z",
    createdAt: "2024-12-21T09:00:00Z",
    tags: ["maintenance", "system", "announcement"]
  }
];

export default function DiscussionForum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-400";
      case "committee": return "text-blue-400";
      case "moderator": return "text-purple-400";
      default: return "text-muted-foreground";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "committee": return "Committee";
      case "moderator": return "Moderator";
      default: return null;
    }
  };

  const filteredTopics = forumTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || topic.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      case "popular":
        return (b.likes + b.replies) - (a.likes + a.replies);
      case "views":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Separate pinned topics
  const pinnedTopics = sortedTopics.filter(topic => topic.isPinned);
  const regularTopics = sortedTopics.filter(topic => !topic.isPinned);

  return (
    <PageLayout 
      title="Discussion Forum" 
      subtitle="Engage in community discussions and Q&A"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowNewTopic(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              New Topic
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full lg:w-80 bg-secondary/50 border-border/50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            All Categories
          </button>
          {forumCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <category.icon size={16} className={activeCategory === category.id ? "" : category.color} />
              {category.name}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Forum Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Topics", value: forumTopics.length.toString(), icon: MessageSquare, color: "text-primary" },
            { label: "Total Replies", value: forumTopics.reduce((sum, t) => sum + t.replies, 0).toString(), icon: Reply, color: "text-blue-400" },
            { label: "Active Members", value: "89", icon: Users, color: "text-green-400" },
            { label: "Solved Questions", value: forumTopics.filter(t => t.isSolved).length.toString(), icon: CheckCircle, color: "text-amber-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
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

        {/* Topics List */}
        <div className="space-y-4">
          {/* Pinned Topics */}
          {pinnedTopics.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Pin size={14} />
                Pinned Topics
              </h3>
              {pinnedTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}

          {/* Regular Topics */}
          {regularTopics.length > 0 && (
            <div className="space-y-2">
              {pinnedTopics.length > 0 && (
                <h3 className="text-sm font-medium text-muted-foreground mt-6">
                  Recent Discussions
                </h3>
              )}
              {regularTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}

          {sortedTopics.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-display mb-2">No Topics Found</h3>
              <p className="text-muted-foreground">No discussions match your search criteria.</p>
            </div>
          )}
        </div>

        {/* New Topic Modal */}
        {showNewTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border/30 w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-border/30">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-display">Start New Discussion</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowNewTopic(false)}
                    className="border-border/50"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select className="w-full px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm">
                    {forumCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input placeholder="Enter discussion title..." className="bg-secondary/50 border-border/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea 
                    placeholder="Share your thoughts, ask questions, or start a discussion..." 
                    rows={8}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
                  <Input placeholder="Add tags separated by commas..." className="bg-secondary/50 border-border/50" />
                </div>
              </div>
              <div className="p-6 border-t border-border/30 flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowNewTopic(false)}
                  className="border-border/50"
                >
                  Cancel
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Create Topic
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function TopicCard({ topic }: { topic: unknown }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-400";
      case "committee": return "text-blue-400";
      case "moderator": return "text-purple-400";
      default: return "text-muted-foreground";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "committee": return "Committee";
      case "moderator": return "Moderator";
      default: return null;
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={20} className="text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {topic.isPinned && <Pin size={14} className="text-amber-400" />}
                {topic.isLocked && <Lock size={14} className="text-muted-foreground" />}
                {topic.isSolved && <CheckCircle size={14} className="text-green-400" />}
                <h3 className="font-medium text-lg hover:text-primary transition-colors">
                  {topic.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {topic.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {topic.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{topic.author}</span>
                {getRoleBadge(topic.authorRole) && (
                  <Badge variant="outline" className="text-xs">
                    {getRoleBadge(topic.authorRole)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Reply size={14} />
                <span>{topic.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{topic.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp size={14} />
                <span>{topic.likes}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {new Date(topic.lastActivity).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}