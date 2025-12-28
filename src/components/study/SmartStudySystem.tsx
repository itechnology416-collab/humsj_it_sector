import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  BookOpen, 
  Target, 
  Clock,
  TrendingUp,
  CheckCircle,
  Play,
  Pause,
  Star,
  BarChart3,
  ArrowUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused';
  notes: string;
  rating?: number;
  tags: string[];
}

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  status: 'active' | 'completed' | 'paused';
}

interface SmartStudySystemProps {
  className?: string;
}

export function SmartStudySystem({ className }: SmartStudySystemProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'goals' | 'resources' | 'analytics'>('dashboard');
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);

  // Sample data
  const studySessions: StudySession[] = [
    {
      id: "1",
      subject: "Quran Studies",
      topic: "Surah Al-Baqarah Tafsir",
      duration: 120,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(),
      status: 'completed',
      notes: "Completed verses 1-20 with detailed analysis",
      rating: 5,
      tags: ["tafsir", "quran", "arabic"]
    },
    {
      id: "2",
      subject: "Arabic Language",
      topic: "Grammar - Verb Conjugation",
      duration: 90,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 22.5 * 60 * 60 * 1000),
      status: 'completed',
      notes: "Practiced past tense conjugations",
      rating: 4,
      tags: ["arabic", "grammar", "verbs"]
    }
  ];

  const studyGoals: StudyGoal[] = [
    {
      id: "1",
      title: "Complete Quran Memorization",
      description: "Memorize 5 new verses daily with proper Tajweed",
      targetHours: 200,
      currentHours: 45,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      priority: 'high',
      category: 'Quran',
      status: 'active'
    },
    {
      id: "2",
      title: "Arabic Fluency",
      description: "Achieve conversational Arabic proficiency",
      targetHours: 150,
      currentHours: 78,
      deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'Language',
      status: 'active'
    },
    {
      id: "3",
      title: "Islamic History Mastery",
      description: "Study comprehensive Islamic history from Prophet's time to modern era",
      targetHours: 100,
      currentHours: 25,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'History',
      status: 'active'
    }
  ];

  // Timer effect for active sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && currentSession) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, currentSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startStudySession = (subject: string, topic: string) => {
    const session: StudySession = {
      id: Date.now().toString(),
      subject,
      topic,
      duration: 0,
      startTime: new Date(),
      status: 'active',
      notes: "",
      tags: []
    };
    setCurrentSession(session);
    setIsSessionActive(true);
    setSessionTimer(0);
    toast.success("Study session started!");
  };

  const pauseSession = () => {
    setIsSessionActive(false);
    if (currentSession) {
      setCurrentSession({...currentSession, status: 'paused'});
    }
    toast.info("Session paused");
  };

  const resumeSession = () => {
    setIsSessionActive(true);
    if (currentSession) {
      setCurrentSession({...currentSession, status: 'active'});
    }
    toast.success("Session resumed");
  };

  const endSession = () => {
    if (currentSession) {
      setCurrentSession(null);
      setIsSessionActive(false);
      setSessionTimer(0);
      toast.success("Study session completed!");
    }
  };

  const getTotalStudyHours = () => {
    return studySessions.reduce((total, session) => total + (session.duration / 3600), 0);
  };

  const getWeeklyProgress = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekSessions = studySessions.filter(session => session.startTime > weekAgo);
    return weekSessions.reduce((total, session) => total + (session.duration / 3600), 0);
  };

  const getAverageRating = () => {
    const ratedSessions = studySessions.filter(session => session.rating);
    if (ratedSessions.length === 0) return 0;
    return ratedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / ratedSessions.length;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Current Session */}
      {currentSession && (
        <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{currentSession.subject}</h3>
              <p className="text-muted-foreground">{currentSession.topic}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-primary">{formatTime(sessionTimer)}</div>
              <p className="text-sm text-muted-foreground">Active Session</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isSessionActive ? (
              <Button onClick={pauseSession} variant="outline" className="gap-2">
                <Pause size={16} />
                Pause
              </Button>
            ) : (
              <Button onClick={resumeSession} className="gap-2">
                <Play size={16} />
                Resume
              </Button>
            )}
            <Button onClick={endSession} variant="outline" className="gap-2">
              <CheckCircle size={16} />
              End Session
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total Study Hours", 
            value: getTotalStudyHours().toFixed(1), 
            icon: Clock, 
            color: "text-blue-600", 
            bg: "bg-blue-500/20",
            change: "+12h this week"
          },
          { 
            label: "Weekly Progress", 
            value: getWeeklyProgress().toFixed(1) + "h", 
            icon: TrendingUp, 
            color: "text-green-600", 
            bg: "bg-green-500/20",
            change: "+15% from last week"
          },
          { 
            label: "Active Goals", 
            value: studyGoals.filter(g => g.status === 'active').length.toString(), 
            icon: Target, 
            color: "text-purple-600", 
            bg: "bg-purple-500/20",
            change: "3 in progress"
          },
          { 
            label: "Average Rating", 
            value: getAverageRating().toFixed(1), 
            icon: Star, 
            color: "text-amber-600", 
            bg: "bg-amber-500/20",
            change: "Excellent performance"
          }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <ArrowUp size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-xs text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Start Session */}
      <div className="bg-card rounded-xl p-6 border border-border/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Play size={18} className="text-primary" />
          Quick Start Study Session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { subject: "Quran Studies", topic: "Daily Recitation & Memorization", color: "from-green-500 to-emerald-500" },
            { subject: "Arabic Language", topic: "Grammar & Vocabulary", color: "from-blue-500 to-cyan-500" },
            { subject: "Islamic History", topic: "Prophetic Biography", color: "from-purple-500 to-violet-500" }
          ].map((session, index) => (
            <div 
              key={session.subject}
              className={`bg-gradient-to-br ${session.color} p-4 rounded-lg text-white cursor-pointer hover:scale-105 transition-transform animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => startStudySession(session.subject, session.topic)}
            >
              <h4 className="font-semibold mb-2">{session.subject}</h4>
              <p className="text-sm opacity-90 mb-3">{session.topic}</p>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Play size={14} className="mr-2" />
                Start Session
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Goals Progress */}
      <div className="bg-card rounded-xl p-6 border border-border/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target size={18} className="text-primary" />
            Goals Progress
          </h3>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('goals')}>
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {studyGoals.slice(0, 3).map((goal, index) => (
            <div key={goal.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{goal.title}</span>
                <span className="text-sm text-muted-foreground">
                  {goal.currentHours}h / {goal.targetHours}h
                </span>
              </div>
              <Progress value={(goal.currentHours / goal.targetHours) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((goal.currentHours / goal.targetHours) * 100)}% complete
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-3xl p-8 border border-purple-500/20", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
          <Brain size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-display tracking-wide mb-4">Smart Study System</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Enhance your Islamic learning journey with AI-powered study tracking, goal management, and personalized recommendations. 
          Track your progress in Quran, Hadith, Arabic, and other Islamic sciences with intelligent insights and analytics.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'sessions', label: 'Study Sessions', icon: Clock },
          { id: 'goals', label: 'Goals', icon: Target },
          { id: 'resources', label: 'Resources', icon: BookOpen },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id as unknown)}
            className="gap-2"
          >
            <tab.icon size={16} />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sessions' && (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Study Sessions</h3>
            <p className="text-muted-foreground">Track and manage your study sessions</p>
          </div>
        )}
        {activeTab === 'goals' && (
          <div className="text-center py-20">
            <Target size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Study Goals</h3>
            <p className="text-muted-foreground">Set and track your learning objectives</p>
          </div>
        )}
        {activeTab === 'resources' && (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Study Resources</h3>
            <p className="text-muted-foreground">Access curated Islamic learning materials</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-20">
            <TrendingUp size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Study Analytics</h3>
            <p className="text-muted-foreground">Analyze your learning progress and patterns</p>
          </div>
        )}
      </div>

      {/* Islamic Quote */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={20} className="text-primary" />
        </div>
        <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
          وَقُل رَّبِّ زِدْنِي عِلْمًا
        </p>
        <p className="text-muted-foreground italic text-sm">
          "And say: My Lord, increase me in knowledge" - Quran 20:114
        </p>
      </div>
    </div>
  );
}