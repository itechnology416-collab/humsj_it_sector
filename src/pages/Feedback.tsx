import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: 'event' | 'service' | 'website' | 'general' | 'suggestion' | 'complaint';
  type: 'feedback' | 'survey' | 'review';
  rating?: number;
  status: 'pending' | 'reviewed' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy: string;
  submitterEmail: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  response?: string;
  anonymous: boolean;
  tags: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  status: 'draft' | 'active' | 'closed';
  responses: number;
  createdAt: string;
  closesAt?: string;
  targetAudience: 'all' | 'members' | 'admins';
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'text' | 'rating' | 'multiple_choice' | 'checkbox';
  options?: string[];
  required: boolean;
}

// Mock feedback data
const mockFeedbackItems: FeedbackItem[] = [
  {
    id: '1',
    title: 'Great Friday Prayer Organization',
    description: 'The Friday prayer was very well organized. The sound system was clear and the timing was perfect.',
    category: 'event',
    type: 'feedback',
    rating: 5,
    status: 'reviewed',
    priority: 'low',
    submittedBy: 'Ahmed Hassan',
    submitterEmail: 'ahmed@hu.edu.et',
    submittedAt: '2024-12-20T10:30:00Z',
    reviewedBy: 'Admin',
    reviewedAt: '2024-12-20T14:00:00Z',
    response: 'Thank you for your positive feedback! We\'re glad you enjoyed the Friday prayer.',
    anonymous: false,
    tags: ['prayer', 'organization', 'positive']
  },
  {
    id: '2',
    title: 'Website Loading Issues',
    description: 'The website sometimes takes too long to load, especially on mobile devices.',
    category: 'website',
    type: 'feedback',
    rating: 2,
    status: 'pending',
    priority: 'medium',
    submittedBy: 'Anonymous User',
    submitterEmail: 'anonymous@system.local',
    submittedAt: '2024-12-19T16:45:00Z',
    anonymous: true,
    tags: ['website', 'performance', 'mobile']
  },
  {
    id: '3',
    title: 'Suggestion for More Tech Workshops',
    description: 'It would be great to have more workshops on modern Islamic tech topics like AI ethics and blockchain.',
    category: 'suggestion',
    type: 'feedback',
    status: 'reviewed',
    priority: 'medium',
    submittedBy: 'Fatima Ali',
    submitterEmail: 'fatima@hu.edu.et',
    submittedAt: '2024-12-18T09:15:00Z',
    reviewedBy: 'Admin',
    reviewedAt: '2024-12-19T11:30:00Z',
    response: 'Excellent suggestion! We\'re planning to add more tech workshops in the coming semester.',
    anonymous: false,
    tags: ['workshop', 'technology', 'suggestion']
  }
];

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Event Satisfaction Survey',
    description: 'Help us improve our events by sharing your experience',
    questions: [
      {
        id: '1',
        question: 'How would you rate the overall event organization?',
        type: 'rating',
        required: true
      },
      {
        id: '2',
        question: 'What did you like most about the event?',
        type: 'text',
        required: false
      },
      {
        id: '3',
        question: 'Which topics would you like to see in future events?',
        type: 'multiple_choice',
        options: ['AI & Ethics', 'Web Development', 'Mobile Apps', 'Blockchain', 'Cybersecurity'],
        required: false
      }
    ],
    status: 'active',
    responses: 45,
    createdAt: '2024-12-15T00:00:00Z',
    closesAt: '2024-12-30T23:59:59Z',
    targetAudience: 'all'
  },
  {
    id: '2',
    title: 'Website User Experience Survey',
    description: 'Share your thoughts on our website usability',
    questions: [
      {
        id: '1',
        question: 'How easy is it to navigate our website?',
        type: 'rating',
        required: true
      },
      {
        id: '2',
        question: 'What features would you like to see added?',
        type: 'text',
        required: false
      }
    ],
    status: 'active',
    responses: 23,
    createdAt: '2024-12-10T00:00:00Z',
    closesAt: '2024-12-25T23:59:59Z',
    targetAudience: 'members'
  }
];

const categoryColors = {
  event: "bg-blue-500/20 text-blue-600",
  service: "bg-green-500/20 text-green-600",
  website: "bg-purple-500/20 text-purple-600",
  general: "bg-gray-500/20 text-gray-600",
  suggestion: "bg-yellow-500/20 text-yellow-600",
  complaint: "bg-red-500/20 text-red-600"
};

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-600",
  reviewed: "bg-blue-500/20 text-blue-600",
  resolved: "bg-green-500/20 text-green-600",
  closed: "bg-gray-500/20 text-gray-600"
};

const priorityColors = {
  low: "bg-green-500/20 text-green-600",
  medium: "bg-yellow-500/20 text-yellow-600",
  high: "bg-orange-500/20 text-orange-600",
  urgent: "bg-red-500/20 text-red-600"
};

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(mockFeedbackItems);
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'surveys'>('feedback');
  const [loading, setLoading] = useState(false);

  const filteredFeedback = feedbackItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFeedbackStats = () => {
    const total = feedbackItems.length;
    const pending = feedbackItems.filter(item => item.status === 'pending').length;
    const resolved = feedbackItems.filter(item => item.status === 'resolved').length;
    const avgRating = feedbackItems
      .filter(item => item.rating)
      .reduce((sum, item) => sum + (item.rating || 0), 0) / 
      feedbackItems.filter(item => item.rating).length || 0;
    
    return { total, pending, resolved, avgRating: Math.round(avgRating * 10) / 10 };
  };

  const stats = getFeedbackStats();

  const handleSubmitFeedback = (formData: any) => {
    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: 'feedback',
      rating: formData.rating,
      status: 'pending',
      priority: 'medium',
      submittedBy: formData.anonymous ? 'Anonymous User' : user?.email || 'Unknown',
      submitterEmail: formData.anonymous ? 'anonymous@system.local' : user?.email || '',
      submittedAt: new Date().toISOString(),
      anonymous: formData.anonymous,
      tags: []
    };
    
    setFeedbackItems(prev => [newFeedback, ...prev]);
    setIsSubmitModalOpen(false);
    toast.success('Feedback submitted successfully!');
  };

  const handleRespondToFeedback = (feedbackId: string, response: string) => {
    setFeedbackItems(prev => prev.map(item => 
      item.id === feedbackId 
        ? { 
            ...item, 
            response, 
            status: 'reviewed' as const,
            reviewedBy: 'Admin',
            reviewedAt: new Date().toISOString()
          }
        : item
    ));
    toast.success('Response added successfully!');
  };

  return (
    <PageLayout 
      title="Feedback & Surveys" 
      subtitle="Collect and manage community feedback and surveys"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <button
              onClick={() => setActiveTab('feedback')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                activeTab === 'feedback'
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              Feedback & Reviews
            </button>
            <button
              onClick={() => setActiveTab('surveys')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                activeTab === 'surveys'
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              Surveys
            </button>
          </div>
        </div>

        {activeTab === 'feedback' && (
          <>
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border"
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="event">Events</option>
                  <option value="service">Services</option>
                  <option value="website">Website</option>
                  <option value="general">General</option>
                  <option value="suggestion">Suggestions</option>
                  <option value="complaint">Complaints</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 shadow-red" size="sm">
                      <Plus size={16} className="mr-2" />
                      Submit Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Submit Feedback</DialogTitle>
                    </DialogHeader>
                    <FeedbackForm onSubmit={handleSubmitFeedback} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.map((feedback, index) => (
                <div 
                  key={feedback.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{feedback.title}</h3>
                        <Badge className={cn("text-xs", categoryColors[feedback.category])}>
                          {feedback.category}
                        </Badge>
                        <Badge className={cn("text-xs", statusColors[feedback.status])}>
                          {feedback.status}
                        </Badge>
                        <Badge className={cn("text-xs", priorityColors[feedback.priority])}>
                          {feedback.priority}
                        </Badge>
                      </div>
                      
                      {feedback.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={cn(
                                  star <= feedback.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({feedback.rating}/5)</span>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground mb-3">{feedback.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By: {feedback.submittedBy}</span>
                        <span>•</span>
                        <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
                        {feedback.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {feedback.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                      {isAdmin && feedback.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const response = prompt('Enter your response:');
                            if (response) {
                              handleRespondToFeedback(feedback.id, response);
                            }
                          }}
                        >
                          <Send size={14} className="mr-1" />
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {feedback.response && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">Admin Response</Badge>
                        <span className="text-xs text-muted-foreground">
                          {feedback.reviewedAt && new Date(feedback.reviewedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{feedback.response}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredFeedback.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No feedback found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'surveys' && (
          <div className="space-y-6">
            {/* Survey Actions */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display">Active Surveys</h3>
              {isAdmin && (
                <Button className="bg-primary hover:bg-primary/90 shadow-red" size="sm">
                  <Plus size={16} className="mr-2" />
                  Create Survey
                </Button>
              )}
            </div>

            {/* Surveys Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {surveys.map((survey, index) => (
                <div 
                  key={survey.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{survey.title}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{survey.description}</p>
                    </div>
                    <Badge className={cn(
                      "text-xs",
                      survey.status === 'active' ? "bg-green-500/20 text-green-600" :
                      survey.status === 'draft' ? "bg-yellow-500/20 text-yellow-600" :
                      "bg-gray-500/20 text-gray-600"
                    )}>
                      {survey.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span>{survey.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Responses:</span>
                      <span className="text-green-600">{survey.responses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="capitalize">{survey.targetAudience}</span>
                    </div>
                    {survey.closesAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Closes:</span>
                        <span>{new Date(survey.closesAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {survey.status === 'active' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        Take Survey
                      </Button>
                    )}
                    {isAdmin && (
                      <Button variant="outline" size="sm">
                        <BarChart3 size={14} className="mr-1" />
                        Results
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Details Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>
            {selectedFeedback && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={cn("text-xs", categoryColors[selectedFeedback.category])}>
                    {selectedFeedback.category}
                  </Badge>
                  <Badge className={cn("text-xs", statusColors[selectedFeedback.status])}>
                    {selectedFeedback.status}
                  </Badge>
                  <Badge className={cn("text-xs", priorityColors[selectedFeedback.priority])}>
                    {selectedFeedback.priority}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedFeedback.title}</h3>
                  <p className="text-muted-foreground">{selectedFeedback.description}</p>
                </div>
                
                {selectedFeedback.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={cn(
                            star <= selectedFeedback.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({selectedFeedback.rating}/5)</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Submitted By</Label>
                    <p className="text-muted-foreground">{selectedFeedback.submittedBy}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Submitted At</Label>
                    <p className="text-muted-foreground">{new Date(selectedFeedback.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedFeedback.response && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Label className="font-medium">Admin Response</Label>
                    <p className="text-sm mt-1">{selectedFeedback.response}</p>
                    {selectedFeedback.reviewedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded on {new Date(selectedFeedback.reviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}

// Feedback Form Component
function FeedbackForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    rating: 0,
    anonymous: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      rating: 0,
      anonymous: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief title for your feedback"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background"
        >
          <option value="general">General</option>
          <option value="event">Event</option>
          <option value="service">Service</option>
          <option value="website">Website</option>
          <option value="suggestion">Suggestion</option>
          <option value="complaint">Complaint</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detailed description of your feedback"
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Rating (Optional)</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              className="p-1"
            >
              <Star
                size={20}
                className={cn(
                  star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                )}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: 0 }))}
              className="text-xs text-muted-foreground ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={formData.anonymous}
          onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
          className="rounded border-border"
        />
        <Label htmlFor="anonymous" className="text-sm">Submit anonymously</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Submit Feedback
        </Button>
      </div>
    </form>
  );
}