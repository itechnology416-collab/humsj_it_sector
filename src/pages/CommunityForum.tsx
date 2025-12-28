import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Search, 
  Plus,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Users,
  Clock,
  Pin,
  Lock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Star,
  Award,
  CheckCircle,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'member' | 'moderator' | 'admin';
    reputation: number;
  };
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  likes: number;
  dislikes: number;
  replies: number;
  views: number;
  is_pinned: boolean;
  is_locked: boolean;
  is_answered: boolean;
  user_vote?: 'like' | 'dislike';
  user_bookmarked: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  post_count: number;
  latest_post?: {
    title: string;
    author: string;
    created_at: string;
  };
}

const forumCategories: ForumCategory[] = [
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    description: 'Discussions about Quran, Hadith, Fiqh, and Islamic knowledge',
    icon: '📚',
    color: 'from-green-500 to-emerald-500',
    post_count: 245,
    latest_post: {
      title: 'Understanding Ayat al-Kursi',
      author: 'Ahmad Hassan',
      created_at: '2024-12-24T10:30:00Z'
    }
  },
  {
    id: 'community-life',
    name: 'Community Life',
    description: 'Campus life, events, and community activities',
    icon: '🏫',
    color: 'from-blue-500 to-cyan-500',
    post_count: 189,
    latest_post: {
      title: 'Upcoming Jumu\'ah Khutbah Topics',
      author: 'Fatima Ali',
      created_at: '2024-12-24T09:15:00Z'
    }
  },
  {
    id: 'spiritual-growth',
    name: 'Spiritual Growth',
    description: 'Personal development, spirituality, and self-improvement',
    icon: '🌱',
    color: 'from-purple-500 to-violet-500',
    post_count: 156,
    latest_post: {
      title: 'Tips for Consistent Prayer',
      author: 'Omar Ibrahim',
      created_at: '2024-12-24T08:45:00Z'
    }
  },
  {
    id: 'questions-answers',
    name: 'Q&A',
    description: 'Ask questions and get answers from the community',
    icon: '❓',
    color: 'from-orange-500 to-red-500',
    post_count: 312,
    latest_post: {
      title: 'Ruling on studying during Adhan?',
      author: 'Aisha Mohamed',
      created_at: '2024-12-24T07:20:00Z'
    }
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official announcements and important updates',
    icon: '📢',
    color: 'from-yellow-500 to-amber-500',
    post_count: 45,
    latest_post: {
      title: 'New Prayer Room Schedule',
      author: 'Admin Team',
      created_at: '2024-12-23T16:00:00Z'
    }
  }
];

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How to maintain focus during long study sessions while keeping up with prayers?',
    content: 'Assalamu alaikum brothers and sisters. I\'m struggling to balance my academic workload with my religious obligations. Sometimes I get so absorbed in studying that I miss prayer times or rush through them. Does anyone have practical advice on how to maintain both academic excellence and spiritual discipline?',
    author: {
      id: 'user1',
      name: 'Yusuf Ahmed',
      role: 'member',
      reputation: 245
    },
    category: 'spiritual-growth',
    tags: ['prayer', 'study', 'time-management', 'balance'],
    created_at: '2024-12-24T10:30:00Z',
    updated_at: '2024-12-24T10:30:00Z',
    likes: 15,
    dislikes: 0,
    replies: 8,
    views: 127,
    is_pinned: false,
    is_locked: false,
    is_answered: true,
    user_vote: 'like',
    user_bookmarked: true
  },
  {
    id: '2',
    title: 'Understanding the concept of Tawakkul in modern life',
    content: 'I\'ve been reflecting on the concept of Tawakkul (trust in Allah) and how it applies to our daily decisions, especially regarding career choices and life planning. How do we balance taking practical steps while maintaining complete trust in Allah\'s plan?',
    author: {
      id: 'user2',
      name: 'Khadija Hassan',
      role: 'moderator',
      reputation: 892
    },
    category: 'islamic-studies',
    tags: ['tawakkul', 'faith', 'life-planning', 'trust'],
    created_at: '2024-12-24T09:15:00Z',
    updated_at: '2024-12-24T09:15:00Z',
    likes: 23,
    dislikes: 1,
    replies: 12,
    views: 203,
    is_pinned: true,
    is_locked: false,
    is_answered: false,
    user_bookmarked: false
  },
  {
    id: '3',
    title: 'Organizing a Quran study circle - Need volunteers!',
    content: 'Assalamu alaikum everyone! We\'re planning to start a weekly Quran study circle focusing on Tafsir Ibn Kathir. We\'re looking for committed members who can attend regularly. The sessions will be every Friday after Maghrib prayer. Please comment if you\'re interested!',
    author: {
      id: 'user3',
      name: 'Ibrahim Yusuf',
      role: 'member',
      reputation: 156
    },
    category: 'community-life',
    tags: ['quran', 'study-circle', 'volunteers', 'tafsir'],
    created_at: '2024-12-24T08:45:00Z',
    updated_at: '2024-12-24T08:45:00Z',
    likes: 31,
    dislikes: 0,
    replies: 15,
    views: 89,
    is_pinned: false,
    is_locked: false,
    is_answered: false,
    user_bookmarked: false
  }
];

export default function CommunityForum() {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case 'replies':
        return b.replies - a.replies;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const handleVote = (postId: string, voteType: 'like' | 'dislike') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.user_vote;
        let newLikes = post.likes;
        let newDislikes = post.dislikes;
        let newUserVote: 'like' | 'dislike' | undefined = voteType;

        // Remove previous vote
        if (currentVote === 'like') newLikes--;
        if (currentVote === 'dislike') newDislikes--;

        // Add new vote or remove if same
        if (currentVote === voteType) {
          newUserVote = undefined;
        } else {
          if (voteType === 'like') newLikes++;
          if (voteType === 'dislike') newDislikes++;
        }

        return {
          ...post,
          likes: newLikes,
          dislikes: newDislikes,
          user_vote: newUserVote
        };
      }
      return post;
    }));
  };

  const toggleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, user_bookmarked: !post.user_bookmarked }
        : post
    ));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={14} className="text-red-500" />;
      case 'moderator': return <Star size={14} className="text-blue-500" />;
      default: return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-600';
      case 'moderator': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <ProtectedPageLayout 
      title="Community Forum" 
      subtitle="Connect, discuss, and learn with fellow Muslim students"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <MessageSquare size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Community Forum</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Engage in meaningful discussions with your Muslim community
                </p>
              </div>
              <Button onClick={() => setShowNewPostForm(true)} className="gap-2">
                <Plus size={16} />
                New Post
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <MessageSquare size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{posts.length} Posts</p>
                <p className="text-xs text-muted-foreground">Active discussions</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">150+ Members</p>
                <p className="text-xs text-muted-foreground">Active participants</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Daily Activity</p>
                <p className="text-xs text-muted-foreground">Growing community</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Moderated</p>
                <p className="text-xs text-muted-foreground">Quality discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Forum Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forumCategories.map((category, index) => (
              <Card 
                key={category.id}
                className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{category.post_count} posts</span>
                        {category.latest_post && (
                          <span>{formatTimeAgo(category.latest_post.created_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search posts, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  <option value="all">All Categories</option>
                  {forumCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="replies">Most Replies</option>
                  <option value="views">Most Views</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.map((post, index) => (
            <Card 
              key={post.id}
              className="hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_pinned && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Pin size={12} />
                            Pinned
                          </Badge>
                        )}
                        {post.is_locked && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Lock size={12} />
                            Locked
                          </Badge>
                        )}
                        {post.is_answered && (
                          <Badge className="bg-green-500/20 text-green-600 text-xs gap-1">
                            <CheckCircle size={12} />
                            Answered
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {forumCategories.find(c => c.id === post.category)?.name}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>

                  {/* Post Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{post.author.name}</span>
                          {getRoleIcon(post.author.role)}
                          {post.author.role !== 'member' && (
                            <Badge className={cn("text-xs", getRoleBadge(post.author.role))}>
                              {post.author.role}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {formatTimeAgo(post.created_at)}
                          <span>•</span>
                          <span>{post.author.reputation} reputation</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Stats & Actions */}
                    <div className="flex items-center gap-4">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          {post.replies}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'like')}
                          className={cn(
                            "h-8 px-2 gap-1",
                            post.user_vote === 'like' && "text-green-600 bg-green-50"
                          )}
                        >
                          <ThumbsUp size={14} />
                          {post.likes}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'dislike')}
                          className={cn(
                            "h-8 px-2 gap-1",
                            post.user_vote === 'dislike' && "text-red-600 bg-red-50"
                          )}
                        >
                          <ThumbsDown size={14} />
                          {post.dislikes}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(post.id)}
                          className={cn(
                            "h-8 px-2",
                            post.user_bookmarked && "text-yellow-600 bg-yellow-50"
                          )}
                        >
                          <Bookmark size={14} className={post.user_bookmarked ? "fill-current" : ""} />
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Share2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Post Form Modal */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Create New Post</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewPostForm(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Enter your post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                  >
                    <option value="">Select a category</option>
                    {forumCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <Input
                    placeholder="Enter tags separated by commas..."
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">
                    Create Post
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewPostForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="hadith" size="medium" />
          <IslamicEducationFiller type="quote" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}