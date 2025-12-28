import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scale, 
  Brain,
  MessageCircle,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  User,
  Search,
  Filter,
  Send,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface FatwaRequest {
  id: string;
  question: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'ai_reviewed' | 'scholar_reviewed' | 'answered';
  submitted_date: string;
  answered_date?: string;
  ai_confidence: number;
  ai_answer?: string;
  scholar_answer?: string;
  scholar_name?: string;
  sources: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
  views: number;
}

interface ScholarProfile {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience_years: number;
  fatwas_answered: number;
  rating: number;
  verified: boolean;
  bio: string;
}

const mockFatwas: FatwaRequest[] = [
  {
    id: '1',
    question: 'Is it permissible to use cryptocurrency for Islamic transactions?',
    category: 'Finance',
    urgency: 'medium',
    status: 'answered',
    submitted_date: '2024-12-20T10:00:00Z',
    answered_date: '2024-12-21T14:30:00Z',
    ai_confidence: 85,
    ai_answer: 'Based on contemporary Islamic finance principles, cryptocurrency can be permissible if it meets certain conditions: it should have intrinsic value, be free from excessive speculation (gharar), and not involve interest (riba). However, scholars have different opinions on this matter.',
    scholar_answer: 'Cryptocurrency is a complex matter in Islamic finance. While some scholars permit it under specific conditions, others express concerns about its volatility and speculative nature. The key considerations are avoiding gharar (excessive uncertainty) and riba (interest). I recommend consulting with local scholars familiar with your specific circumstances.',
    scholar_name: 'Dr. Ahmad Al-Maliki',
    sources: ['Quran 2:275', 'Sahih Bukhari 2085', 'Contemporary Fiqh Council Decisions'],
    tags: ['cryptocurrency', 'finance', 'halal', 'haram'],
    upvotes: 45,
    downvotes: 8,
    views: 1250
  },
  {
    id: '2',
    question: 'Can I pray Salah while wearing clothes with small images on them?',
    category: 'Worship',
    urgency: 'low',
    status: 'ai_reviewed',
    submitted_date: '2024-12-24T16:20:00Z',
    ai_confidence: 92,
    ai_answer: 'According to most Islamic scholars, small images or logos on clothing do not invalidate prayer if they are not prominent or distracting. The prohibition is mainly against large, prominent images that could distract from worship. However, it is preferable to avoid such clothing during prayer when possible.',
    sources: ['Sahih Muslim 2107', 'Fatawa Ibn Taymiyyah'],
    tags: ['prayer', 'clothing', 'images'],
    upvotes: 23,
    downvotes: 2,
    views: 456
  },
  {
    id: '3',
    question: 'What is the ruling on working in a company that has some haram income?',
    category: 'Business Ethics',
    urgency: 'high',
    status: 'pending',
    submitted_date: '2024-12-25T09:15:00Z',
    ai_confidence: 78,
    sources: [],
    tags: ['work', 'halal income', 'business'],
    upvotes: 0,
    downvotes: 0,
    views: 12
  }
];

const mockScholars: ScholarProfile[] = [
  {
    id: '1',
    name: 'Dr. Ahmad Al-Maliki',
    title: 'Professor of Islamic Jurisprudence',
    specialization: ['Islamic Finance', 'Contemporary Fiqh', 'Business Ethics'],
    experience_years: 25,
    fatwas_answered: 1250,
    rating: 4.9,
    verified: true,
    bio: 'Dr. Ahmad Al-Maliki is a renowned scholar specializing in Islamic finance and contemporary jurisprudence with over 25 years of experience.'
  },
  {
    id: '2',
    name: 'Sheikh Fatima Al-Zahra',
    title: 'Islamic Studies Scholar',
    specialization: ['Family Law', 'Women\'s Issues', 'Worship'],
    experience_years: 18,
    fatwas_answered: 890,
    rating: 4.8,
    verified: true,
    bio: 'Sheikh Fatima specializes in Islamic family law and women\'s issues in Islam, providing guidance based on Quran and Sunnah.'
  }
];

const categories = ['All Categories', 'Worship', 'Finance', 'Family', 'Business Ethics', 'Social Issues', 'Medical Ethics'];
const urgencyLevels = ['All Urgency', 'low', 'medium', 'high'];
const statusOptions = ['All Status', 'pending', 'ai_reviewed', 'scholar_reviewed', 'answered'];

export default function SmartFatwa() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fatwas, setFatwas] = useState<FatwaRequest[]>(mockFatwas);
  const [scholars, setScholars] = useState<ScholarProfile[]>(mockScholars);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedUrgency, setSelectedUrgency] = useState('All Urgency');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedFatwa, setSelectedFatwa] = useState<FatwaRequest | null>(null);

  const filteredFatwas = fatwas.filter(fatwa => {
    const matchesSearch = !searchQuery || 
      fatwa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fatwa.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || fatwa.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'All Urgency' || fatwa.urgency === selectedUrgency;
    const matchesStatus = selectedStatus === 'All Status' || fatwa.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesUrgency && matchesStatus;
  });

  const pendingFatwas = fatwas.filter(f => f.status === 'pending');
  const aiReviewedFatwas = fatwas.filter(f => f.status === 'ai_reviewed');
  const answeredFatwas = fatwas.filter(f => f.status === 'answered');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'ai_reviewed': return 'bg-blue-500/20 text-blue-600';
      case 'scholar_reviewed': return 'bg-purple-500/20 text-purple-600';
      case 'answered': return 'bg-green-500/20 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-500/20 text-green-600';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'high': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Worship': 'bg-green-500/20 text-green-600',
      'Finance': 'bg-blue-500/20 text-blue-600',
      'Family': 'bg-purple-500/20 text-purple-600',
      'Business Ethics': 'bg-orange-500/20 text-orange-600',
      'Social Issues': 'bg-pink-500/20 text-pink-600',
      'Medical Ethics': 'bg-red-500/20 text-red-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const submitQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const newFatwa: FatwaRequest = {
      id: Date.now().toString(),
      question: newQuestion,
      category: 'General',
      urgency: 'medium',
      status: 'pending',
      submitted_date: new Date().toISOString(),
      ai_confidence: 0,
      sources: [],
      tags: [],
      upvotes: 0,
      downvotes: 0,
      views: 0
    };
    
    setFatwas(prev => [newFatwa, ...prev]);
    setNewQuestion('');
  };

  const voteFatwa = (fatwaId: string, type: 'up' | 'down') => {
    setFatwas(prev => prev.map(fatwa => 
      fatwa.id === fatwaId 
        ? { 
            ...fatwa, 
            upvotes: type === 'up' ? fatwa.upvotes + 1 : fatwa.upvotes,
            downvotes: type === 'down' ? fatwa.downvotes + 1 : fatwa.downvotes
          }
        : fatwa
    ));
  };

  return (
    <ProtectedPageLayout 
      title="Smart Fatwa System" 
      subtitle="AI-assisted Islamic rulings with scholar verification"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Scale size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Smart Fatwa System</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Get Islamic rulings with AI assistance and scholar verification
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <p className="text-sm font-medium">{pendingFatwas.length} Pending</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Brain size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{aiReviewedFatwas.length} AI Reviewed</p>
                <p className="text-xs text-muted-foreground">AI analysis complete</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{answeredFatwas.length} Answered</p>
                <p className="text-xs text-muted-foreground">Scholar verified</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{scholars.length} Scholars</p>
                <p className="text-xs text-muted-foreground">Verified experts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="ask" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ask">Ask Question</TabsTrigger>
            <TabsTrigger value="browse">Browse Fatwas</TabsTrigger>
            <TabsTrigger value="scholars">Scholars</TabsTrigger>
            <TabsTrigger value="my-questions">My Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="ask" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ask Your Islamic Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Question</label>
                  <textarea
                    placeholder="Please describe your question in detail. Include relevant context and circumstances..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full min-h-[120px] px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer">
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Urgency</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Scholar</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer">
                      <option value="">Any Available Scholar</option>
                      {scholars.map(scholar => (
                        <option key={scholar.id} value={scholar.id}>{scholar.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>I want AI analysis before scholar review</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Make this question public for community benefit</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Send me email notification when answered</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={submitQuestion}
                    disabled={!newQuestion.trim()}
                    className="gap-2"
                  >
                    <Send size={16} />
                    Submit Question
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Brain size={16} />
                    Get AI Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search fatwas by question, topic, or tags..."
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFatwas.map((fatwa, index) => (
                <Card 
                  key={fatwa.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <Scale size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(fatwa.category))}>
                            {fatwa.category}
                          </Badge>
                          <Badge className={cn("text-xs", getStatusColor(fatwa.status))}>
                            {fatwa.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={cn("text-xs", getUrgencyColor(fatwa.urgency))}>
                            {fatwa.urgency}
                          </Badge>
                          {fatwa.ai_confidence > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Brain size={10} className="mr-1" />
                              AI: {fatwa.ai_confidence}%
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{fatwa.question}</h3>
                        
                        {fatwa.ai_answer && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain size={14} className="text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">AI Analysis</span>
                            </div>
                            <p className="text-sm text-blue-900 dark:text-blue-100 line-clamp-3">
                              {fatwa.ai_answer}
                            </p>
                          </div>
                        )}
                        
                        {fatwa.scholar_answer && (
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <User size={14} className="text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                Scholar Answer - {fatwa.scholar_name}
                              </span>
                            </div>
                            <p className="text-sm text-green-900 dark:text-green-100 line-clamp-3">
                              {fatwa.scholar_answer}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>Asked: {new Date(fatwa.submitted_date).toLocaleDateString()}</span>
                          {fatwa.answered_date && (
                            <span>Answered: {new Date(fatwa.answered_date).toLocaleDateString()}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {fatwa.views}
                          </span>
                        </div>

                        {fatwa.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {fatwa.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {fatwa.sources.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Sources:</span>
                            <div className="flex flex-wrap gap-1">
                              {fatwa.sources.map((source, sourceIndex) => (
                                <Badge key={sourceIndex} variant="outline" className="text-xs">
                                  <BookOpen size={10} className="mr-1" />
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedFatwa(fatwa)}
                          className="gap-2"
                        >
                          <Eye size={14} />
                          View Full
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => voteFatwa(fatwa.id, 'up')}
                            className="w-8 h-8 p-0"
                          >
                            <ThumbsUp size={12} />
                          </Button>
                          <span className="text-xs text-muted-foreground px-1">
                            {fatwa.upvotes - fatwa.downvotes}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => voteFatwa(fatwa.id, 'down')}
                            className="w-8 h-8 p-0"
                          >
                            <ThumbsDown size={12} />
                          </Button>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                          <Share2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholars" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholars.map((scholar, index) => (
                <Card 
                  key={scholar.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{scholar.name}</h3>
                          {scholar.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              <CheckCircle size={10} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{scholar.title}</p>
                        <p className="text-sm mb-4 line-clamp-2">{scholar.bio}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Experience:</span>
                            <span>{scholar.experience_years} years</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Fatwas Answered:</span>
                            <span>{scholar.fatwas_answered.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              <span>{scholar.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium">Specializations:</span>
                          <div className="flex flex-wrap gap-1">
                            {scholar.specialization.map((spec, specIndex) => (
                              <Badge key={specIndex} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                      <Button size="sm" className="gap-2">
                        <MessageCircle size={14} />
                        Ask Question
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye size={14} />
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-questions" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't asked any questions yet. Start by asking your first Islamic question.
                </p>
                <Button className="gap-2">
                  <Send size={16} />
                  Ask Your First Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Fatwa Details Modal */}
        {selectedFatwa && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Fatwa Details</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFatwa(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={cn("text-xs", getCategoryColor(selectedFatwa.category))}>
                      {selectedFatwa.category}
                    </Badge>
                    <Badge className={cn("text-xs", getStatusColor(selectedFatwa.status))}>
                      {selectedFatwa.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={cn("text-xs", getUrgencyColor(selectedFatwa.urgency))}>
                      {selectedFatwa.urgency}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">{selectedFatwa.question}</h3>
                  
                  {selectedFatwa.ai_answer && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-600">AI Analysis</span>
                        <Badge variant="outline" className="text-xs">
                          Confidence: {selectedFatwa.ai_confidence}%
                        </Badge>
                      </div>
                      <p className="text-blue-900 dark:text-blue-100 leading-relaxed">
                        {selectedFatwa.ai_answer}
                      </p>
                    </div>
                  )}
                  
                  {selectedFatwa.scholar_answer && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User size={16} className="text-green-600" />
                        <span className="font-medium text-green-600">
                          Scholar Answer - {selectedFatwa.scholar_name}
                        </span>
                      </div>
                      <p className="text-green-900 dark:text-green-100 leading-relaxed">
                        {selectedFatwa.scholar_answer}
                      </p>
                    </div>
                  )}
                </div>

                {selectedFatwa.sources.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Sources & References</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFatwa.sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <BookOpen size={10} className="mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Asked: {new Date(selectedFatwa.submitted_date).toLocaleDateString()}</span>
                    {selectedFatwa.answered_date && (
                      <span>Answered: {new Date(selectedFatwa.answered_date).toLocaleDateString()}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {selectedFatwa.views} views
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => voteFatwa(selectedFatwa.id, 'up')}
                      className="gap-2"
                    >
                      <ThumbsUp size={14} />
                      {selectedFatwa.upvotes}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 size={14} />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}