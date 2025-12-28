import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  MessageCircle,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Star,
  Send,
  Mic,
  Volume2,
  RefreshCw,
  Settings,
  Award,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface LearningSession {
  id: string;
  topic: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  started_at: string;
  last_activity: string;
  questions_answered: number;
  correct_answers: number;
  ai_insights: string[];
}

interface AIResponse {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  confidence: number;
  sources: string[];
  follow_up_questions: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  subject: string;
  total_lessons: number;
  completed_lessons: number;
  estimated_time: string;
  difficulty: string;
  prerequisites: string[];
  learning_outcomes: string[];
}

const mockSessions: LearningSession[] = [
  {
    id: '1',
    topic: 'Understanding Tawheed',
    subject: 'Aqeedah',
    difficulty: 'beginner',
    duration: 45,
    progress: 75,
    status: 'active',
    started_at: '2024-12-25T09:00:00Z',
    last_activity: '2024-12-25T09:30:00Z',
    questions_answered: 12,
    correct_answers: 10,
    ai_insights: [
      'You show strong understanding of basic concepts',
      'Consider reviewing the 99 Names of Allah',
      'Practice with more practical examples'
    ]
  },
  {
    id: '2',
    topic: 'Fiqh of Prayer',
    subject: 'Fiqh',
    difficulty: 'intermediate',
    duration: 60,
    progress: 100,
    status: 'completed',
    started_at: '2024-12-24T14:00:00Z',
    last_activity: '2024-12-24T15:00:00Z',
    questions_answered: 20,
    correct_answers: 18,
    ai_insights: [
      'Excellent mastery of prayer rulings',
      'Ready for advanced topics',
      'Consider studying different madhabs'
    ]
  }
];

const mockConversation: AIResponse[] = [
  {
    id: '1',
    question: 'What is the difference between Fard and Sunnah prayers?',
    answer: 'Fard prayers are the five obligatory daily prayers that every Muslim must perform. They are: Fajr, Dhuhr, Asr, Maghrib, and Isha. Sunnah prayers are recommended prayers that Prophet Muhammad (PBUH) regularly performed. While Fard prayers are mandatory and missing them is considered a sin, Sunnah prayers are highly recommended and bring additional spiritual benefits.',
    timestamp: '2024-12-25T10:15:00Z',
    confidence: 95,
    sources: ['Quran 4:103', 'Sahih Bukhari 528', 'Sahih Muslim 681'],
    follow_up_questions: [
      'What are the different types of Sunnah prayers?',
      'How many rakats are in each Fard prayer?',
      'What happens if someone misses a Fard prayer?'
    ]
  },
  {
    id: '2',
    question: 'Can you explain the concept of Ihsan?',
    answer: 'Ihsan is the highest level of worship in Islam, meaning "excellence" or "perfection." It is to worship Allah as if you see Him, and if you cannot see Him, then know that He sees you. This concept encompasses both the external acts of worship and the internal spiritual state of consciousness and sincerity.',
    timestamp: '2024-12-25T10:20:00Z',
    confidence: 98,
    sources: ['Hadith of Jibreel', 'Sahih Muslim 8'],
    follow_up_questions: [
      'How can one achieve Ihsan in daily life?',
      'What is the relationship between Ihsan and Taqwa?',
      'Are there practical steps to develop Ihsan?'
    ]
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Foundations of Islamic Faith',
    description: 'Comprehensive introduction to the core beliefs and practices of Islam',
    subject: 'Aqeedah',
    total_lessons: 20,
    completed_lessons: 8,
    estimated_time: '4-6 weeks',
    difficulty: 'beginner',
    prerequisites: [],
    learning_outcomes: [
      'Understand the Six Articles of Faith',
      'Learn the Five Pillars of Islam',
      'Develop strong foundation in Tawheed'
    ]
  },
  {
    id: '2',
    title: 'Advanced Quranic Studies',
    description: 'Deep dive into Quranic interpretation and linguistic analysis',
    subject: 'Quran',
    total_lessons: 35,
    completed_lessons: 12,
    estimated_time: '8-10 weeks',
    difficulty: 'advanced',
    prerequisites: ['Basic Arabic', 'Foundations of Faith'],
    learning_outcomes: [
      'Master Tafsir methodology',
      'Understand Quranic Arabic',
      'Analyze rhetorical devices in Quran'
    ]
  }
];

export default function IslamicAITutor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState<LearningSession[]>(mockSessions);
  const [conversation, setConversation] = useState<AIResponse[]>(mockConversation);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalQuestions = sessions.reduce((sum, s) => sum + s.questions_answered, 0);
  const averageAccuracy = sessions.reduce((sum, s) => sum + (s.correct_answers / s.questions_answered), 0) / sessions.length * 100;

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const newResponse: AIResponse = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer: 'This is a simulated AI response. In a real implementation, this would be generated by an Islamic AI model trained on authentic Islamic sources.',
        timestamp: new Date().toISOString(),
        confidence: Math.floor(Math.random() * 20) + 80,
        sources: ['Quran', 'Sahih Hadith', 'Classical Scholars'],
        follow_up_questions: [
          'Can you provide more details about this topic?',
          'What are the practical applications?',
          'Are there different scholarly opinions?'
        ]
      };
      
      setConversation(prev => [newResponse, ...prev]);
      setCurrentQuestion('');
      setIsLoading(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Aqeedah': 'bg-blue-500/20 text-blue-600',
      'Fiqh': 'bg-purple-500/20 text-purple-600',
      'Quran': 'bg-green-500/20 text-green-600',
      'Hadith': 'bg-orange-500/20 text-orange-600',
      'Seerah': 'bg-pink-500/20 text-pink-600'
    };
    return colors[subject] || 'bg-muted text-muted-foreground';
  };

  return (
    <ProtectedPageLayout 
      title="Islamic AI Tutor" 
      subtitle="AI-powered Islamic learning with personalized guidance and insights"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic AI Tutor</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Personalized Islamic education powered by artificial intelligence
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
                  <Brain size={20} className="text-violet-600" />
                </div>
                <p className="text-sm font-medium">{activeSessions.length} Active</p>
                <p className="text-xs text-muted-foreground">Learning sessions</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Target size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{Math.round(averageAccuracy)}%</p>
                <p className="text-xs text-muted-foreground">Accuracy rate</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <MessageCircle size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Questions answered</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">{completedSessions.length}</p>
                <p className="text-xs text-muted-foreground">Completed sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="sessions">Learning Sessions</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle size={20} />
                      Ask Your Islamic AI Tutor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {conversation.map((response, index) => (
                        <div key={response.id} className="space-y-3">
                          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                              {response.question}
                            </p>
                          </div>
                          <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm leading-relaxed mb-3">{response.answer}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Star size={12} />
                                Confidence: {response.confidence}%
                              </span>
                              <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
                            </div>
                            
                            {response.sources.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium mb-1">Sources:</p>
                                <div className="flex flex-wrap gap-1">
                                  {response.sources.map((source, sourceIndex) => (
                                    <Badge key={sourceIndex} variant="outline" className="text-xs">
                                      {source}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {response.follow_up_questions.length > 0 && (
                              <div>
                                <p className="text-xs font-medium mb-2">Follow-up questions:</p>
                                <div className="space-y-1">
                                  {response.follow_up_questions.map((question, qIndex) => (
                                    <Button
                                      key={qIndex}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setCurrentQuestion(question)}
                                      className="text-xs h-auto p-2 justify-start"
                                    >
                                      {question}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask any Islamic question..."
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={isLoading || !currentQuestion.trim()}
                        className="gap-2"
                      >
                        {isLoading ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                        <Mic size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      'Five Pillars of Islam',
                      'Prayer (Salah) guidance',
                      'Zakat calculation',
                      'Fasting rules',
                      'Hajj requirements',
                      'Islamic ethics',
                      'Quran interpretation',
                      'Hadith authenticity'
                    ].map((topic, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentQuestion(`Tell me about ${topic}`)}
                        className="w-full justify-start text-sm"
                      >
                        {topic}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Brain size={16} className="text-violet-600" />
                      <span>Contextual understanding</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen size={16} className="text-blue-600" />
                      <span>Authentic source references</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lightbulb size={16} className="text-yellow-600" />
                      <span>Personalized insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Volume2 size={16} className="text-green-600" />
                      <span>Voice interaction</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Learning Sessions</h3>
              <Button className="gap-2">
                <Brain size={16} />
                Start New Session
              </Button>
            </div>

            <div className="space-y-4">
              {sessions.map((session, index) => (
                <Card 
                  key={session.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getSubjectColor(session.subject))}>
                            {session.subject}
                          </Badge>
                          <Badge className={cn("text-xs", getDifficultyColor(session.difficulty))}>
                            {session.difficulty}
                          </Badge>
                          <Badge variant={session.status === 'active' ? 'default' : 'outline'} className="text-xs">
                            {session.status}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{session.topic}</h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{session.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-violet-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${session.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <span className="font-medium">Duration:</span>
                            <p>{session.duration} min</p>
                          </div>
                          <div>
                            <span className="font-medium">Questions:</span>
                            <p>{session.questions_answered}</p>
                          </div>
                          <div>
                            <span className="font-medium">Accuracy:</span>
                            <p>{Math.round((session.correct_answers / session.questions_answered) * 100)}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Activity:</span>
                            <p>{new Date(session.last_activity).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {session.ai_insights.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-sm font-medium">AI Insights:</span>
                            <div className="space-y-1">
                              {session.ai_insights.map((insight, insightIndex) => (
                                <div key={insightIndex} className="flex items-start gap-2 text-sm">
                                  <Lightbulb size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{insight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {session.status === 'active' && (
                          <Button size="sm" className="gap-2">
                            <Brain size={14} />
                            Continue
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline" className="gap-2">
                          <TrendingUp size={14} />
                          Analytics
                        </Button>
                        
                        {session.status === 'completed' && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <RefreshCw size={14} />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Personalized Learning Paths</h3>
              <Button variant="outline" className="gap-2">
                <Settings size={16} />
                Customize Paths
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <Card 
                  key={path.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Target size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getSubjectColor(path.subject))}>
                            {path.subject}
                          </Badge>
                          <Badge className={cn("text-xs", getDifficultyColor(path.difficulty))}>
                            {path.difficulty}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{path.completed_lessons}/{path.total_lessons} lessons</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-violet-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(path.completed_lessons / path.total_lessons) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <span className="font-medium">Duration:</span>
                            <p>{path.estimated_time}</p>
                          </div>
                          <div>
                            <span className="font-medium">Lessons:</span>
                            <p>{path.total_lessons}</p>
                          </div>
                        </div>

                        {path.prerequisites.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <span className="text-sm font-medium">Prerequisites:</span>
                            <div className="flex flex-wrap gap-1">
                              {path.prerequisites.map((prereq, prereqIndex) => (
                                <Badge key={prereqIndex} variant="outline" className="text-xs">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <span className="text-sm font-medium">Learning Outcomes:</span>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {path.learning_outcomes.slice(0, 3).map((outcome, outcomeIndex) => (
                              <li key={outcomeIndex} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0"></div>
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                      <Button
                        size="sm"
                        onClick={() => setSelectedPath(path)}
                        className="flex-1 gap-2"
                      >
                        <Brain size={14} />
                        {path.completed_lessons > 0 ? 'Continue' : 'Start'}
                      </Button>
                      
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye size={14} />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-600">{Math.round(averageAccuracy)}%</div>
                      <p className="text-sm text-muted-foreground">Average Accuracy</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Questions Answered</span>
                        <span>{totalQuestions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sessions Completed</span>
                        <span>{completedSessions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Active Sessions</span>
                        <span>{activeSessions.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subject Mastery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Aqeedah', 'Fiqh', 'Quran', 'Hadith', 'Seerah'].map((subject, index) => (
                      <div key={subject} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{subject}</span>
                          <span>{Math.floor(Math.random() * 40) + 60}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-violet-500 h-2 rounded-full" 
                            style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Award size={16} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">First Session</p>
                        <p className="text-xs text-muted-foreground">Completed your first learning session</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Target size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">High Accuracy</p>
                        <p className="text-xs text-muted-foreground">Achieved 90%+ accuracy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Active Learner</p>
                        <p className="text-xs text-muted-foreground">7 days learning streak</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Path Details Modal */}
        {selectedPath && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedPath.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPath(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-4">{selectedPath.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="font-medium">Subject:</span>
                      <p>{selectedPath.subject}</p>
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>
                      <p className="capitalize">{selectedPath.difficulty}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{selectedPath.estimated_time}</p>
                    </div>
                    <div>
                      <span className="font-medium">Lessons:</span>
                      <p>{selectedPath.total_lessons}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                  <ul className="space-y-2">
                    {selectedPath.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0"></div>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedPath.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedPath(null)}
                    className="gap-2"
                  >
                    <Brain size={16} />
                    Start Learning Path
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPath(null)}
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
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}