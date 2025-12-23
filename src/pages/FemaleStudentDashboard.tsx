import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { IslamicProgramsSchedule } from "@/components/islamic/IslamicProgramsSchedule";
import { PrayerReminderWidget } from "@/components/islamic/PrayerReminderWidget";
import { 
  User, 
  Calendar, 
  BookOpen, 
  Users,
  Clock,
  Bell,
  Award,
  Target,
  MessageCircle,
  Heart,
  TrendingUp,
  CheckCircle,
  Star,
  MapPin,
  Shield,
  Globe,
  Play,
  Download,
  Settings,
  Activity,
  BarChart3,
  Bookmark,
  Coffee,
  Compass,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Flower,
  Moon,
  Sun,
  Sparkles,
  Feather,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FemaleStudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [privacyMode, setPrivacyMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Prayer times (would come from API)
  const prayerTimes = {
    fajr: { time: "05:30", status: "completed" },
    dhuhr: { time: "12:15", status: "current" },
    asr: { time: "15:45", status: "upcoming" },
    maghrib: { time: "18:20", status: "upcoming" },
    isha: { time: "19:45", status: "upcoming" }
  };

  const quickStats = [
    { label: "Prayer Consistency", value: "18 days", icon: Target, color: "text-emerald-600", bg: "bg-emerald-500/20" },
    { label: "Sisters Events", value: "6", icon: Calendar, color: "text-rose-600", bg: "bg-rose-500/20" },
    { label: "Study Hours", value: "32h", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-500/20" },
    { label: "Mentorship", value: "Active", icon: Heart, color: "text-pink-600", bg: "bg-pink-500/20" }
  ];

  const upcomingSistersEvents = [
    {
      id: 1,
      title: "Sisters' Halaqa",
      time: "3:00 PM",
      date: "Today",
      location: "Sisters Hall",
      type: "learning",
      attendees: 35,
      privacy: "sisters-only"
    },
    {
      id: 2,
      title: "Islamic Parenting Workshop",
      time: "10:00 AM",
      date: "Saturday",
      location: "Community Center",
      type: "workshop",
      attendees: 28,
      privacy: "sisters-only"
    },
    {
      id: 3,
      title: "Quran Memorization Circle",
      time: "4:30 PM",
      date: "Sunday",
      location: "Learning Center",
      type: "memorization",
      attendees: 20,
      privacy: "sisters-only"
    }
  ];

  const learningProgress = [
    { subject: "Quran Recitation", progress: 75, total: "Tajweed Mastery", color: "bg-emerald-500" },
    { subject: "Islamic History", progress: 60, total: "Women in Islam", color: "bg-rose-500" },
    { subject: "Fiqh for Women", progress: 85, total: "Family Law", color: "bg-purple-500" },
    { subject: "Arabic Calligraphy", progress: 40, total: "Basic Scripts", color: "bg-pink-500" }
  ];

  const mentorshipRequests = [
    { name: "Sister Aisha", topic: "Academic Guidance", status: "pending", priority: "high" },
    { name: "Sister Fatima", topic: "Career Counseling", status: "active", priority: "medium" },
    { name: "Sister Zainab", topic: "Islamic Studies", status: "completed", priority: "low" }
  ];

  const wellbeingResources = [
    {
      title: "Mental Health Support",
      description: "Confidential counseling services",
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-500/20"
    },
    {
      title: "Academic Guidance",
      description: "Study support and tutoring",
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-500/20"
    },
    {
      title: "Career Counseling",
      description: "Professional development guidance",
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-500/20"
    },
    {
      title: "Spiritual Guidance",
      description: "Islamic counseling and support",
      icon: Sparkles,
      color: "text-pink-600",
      bg: "bg-pink-500/20"
    }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "Sisters' Retreat Registration Open",
      content: "Join us for a weekend of spiritual growth and sisterhood",
      time: "3 hours ago",
      priority: "high",
      privacy: "sisters-only"
    },
    {
      id: 2,
      title: "New Hijab Styling Workshop",
      content: "Learn modest fashion tips and hijab styling techniques",
      time: "1 day ago",
      priority: "medium",
      privacy: "sisters-only"
    }
  ];

  return (
    <PageLayout 
      title="Sister's Dashboard" 
      subtitle="Assalamu Alaikum, welcome to your safe Islamic space"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header with Gender Switch Option */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg animate-glow">
              <Heart size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display tracking-wide">Sister's Dashboard</h1>
              <p className="text-muted-foreground">Your safe Islamic space and sisterhood community</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('userGender');
                navigate('/gender-selection');
              }}
              className="border-border/50 hover:border-primary hover:bg-primary/5 gap-2"
            >
              <Settings size={16} />
              Switch Dashboard
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              className="bg-rose-600 hover:bg-rose-700 shadow-lg gap-2"
            >
              <User size={16} />
              Profile Settings
            </Button>
          </div>
        </div>

        {/* Admin Access Indicator */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-500/10 via-card to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Administrative Access - Sister's Dashboard
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-300">
                  You are viewing this dashboard with administrative privileges for oversight and support purposes.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10 gap-2 ml-auto"
              >
                <ArrowLeft size={14} />
                Back to Admin Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/floral-pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-display tracking-wide mb-2">
                  Assalamu Alaikum, Sister {privacyMode ? "***" : user?.email?.split('@')[0]}
                </h1>
                <p className="text-emerald-100">
                  May Allah grant you knowledge, peace, and barakah in your journey
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className="text-white hover:bg-white/20"
                  >
                    {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Shield size={16} className="text-emerald-200" />
                </div>
                <p className="text-emerald-100 text-sm">Current Time</p>
                <p className="text-2xl font-bold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-emerald-100 text-sm">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => navigate('/prayer-times')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Compass size={16} className="mr-2" />
                Prayer Times
              </Button>
              <Button 
                onClick={() => navigate('/islamic-education')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <BookOpen size={16} className="mr-2" />
                Sisters' Learning Hub
              </Button>
              <Button 
                onClick={() => navigate('/events')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Calendar size={16} className="mr-2" />
                Sisters Events
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <Sparkles size={16} className="text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prayer Times */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Compass size={20} className="text-emerald-600" />
                  Today's Prayer Times
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/prayer-times')}>
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(prayerTimes).map(([prayer, data]) => (
                  <div key={prayer} className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto",
                      data.status === 'completed' ? 'bg-emerald-500/20 text-emerald-600' :
                      data.status === 'current' ? 'bg-rose-500/20 text-rose-600' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {data.status === 'completed' && <CheckCircle size={20} />}
                      {data.status === 'current' && <Clock size={20} />}
                      {data.status === 'upcoming' && <Clock size={20} />}
                    </div>
                    <p className="font-medium capitalize">{prayer}</p>
                    <p className="text-sm text-muted-foreground">{data.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen size={20} className="text-purple-600" />
                  Learning Journey
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/islamic-education')}>
                  Continue Learning
                </Button>
              </div>
              
              <div className="space-y-4">
                {learningProgress.map((subject, index) => (
                  <div key={subject.subject} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">{subject.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${subject.color} transition-all duration-500`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{subject.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sisters Events */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar size={20} className="text-rose-600" />
                  Sisters' Events
                  <Lock size={16} className="text-muted-foreground" />
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingSistersEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-950/30 dark:hover:to-pink-950/30 transition-colors cursor-pointer animate-slide-up border border-rose-200/50 dark:border-rose-800/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigate('/events')}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      event.type === 'learning' ? 'bg-emerald-500/20 text-emerald-600' :
                      event.type === 'workshop' ? 'bg-purple-500/20 text-purple-600' :
                      'bg-rose-500/20 text-rose-600'
                    )}>
                      {event.type === 'learning' && <BookOpen size={20} />}
                      {event.type === 'workshop' && <Users size={20} />}
                      {event.type === 'memorization' && <Heart size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <Shield size={12} className="text-rose-500" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{event.date} at {event.time}</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck size={12} />
                          {event.attendees} sisters
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Mentorship & Counseling */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Heart size={18} className="text-pink-600" />
                  Mentorship
                </h2>
                <Button variant="outline" size="sm">
                  <Settings size={14} />
                </Button>
              </div>
              
              <div className="space-y-4">
                {mentorshipRequests.map((request, index) => (
                  <div key={request.name} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{privacyMode ? "Sister ***" : request.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        request.status === 'active' ? 'bg-emerald-500/20 text-emerald-600' :
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                        'bg-gray-500/20 text-gray-600'
                      )}>
                        {request.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{request.topic}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <MessageCircle size={14} className="mr-2" />
                Request Mentorship
              </Button>
            </div>

            {/* Prayer Reminders */}
            <PrayerReminderWidget compact={true} />

            {/* Well-being Resources */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-600" />
                  Well-being
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {wellbeingResources.map((resource, index) => (
                  <div 
                    key={resource.title}
                    className="p-3 rounded-lg bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/50 hover:to-secondary/20 transition-colors cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${resource.bg} flex items-center justify-center mb-2`}>
                      <resource.icon size={16} className={resource.color} />
                    </div>
                    <h3 className="font-medium text-xs mb-1">{resource.title}</h3>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Announcements */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bell size={18} className="text-emerald-600" />
                  Sisters' Updates
                  <Lock size={14} className="text-muted-foreground" />
                </h2>
              </div>
              
              <div className="space-y-4">
                {recentAnnouncements.map((announcement, index) => (
                  <div 
                    key={announcement.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 animate-slide-up border border-emerald-200/50 dark:border-emerald-800/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{announcement.title}</h3>
                      <div className="flex items-center gap-1">
                        <Shield size={12} className="text-emerald-500" />
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          announcement.priority === 'high' ? 'bg-rose-500/20 text-rose-600' :
                          'bg-emerald-500/20 text-emerald-600'
                        )}>
                          {announcement.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground">{announcement.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Feather size={18} className="text-pink-600" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2 border-rose-200 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  onClick={() => navigate('/donations')}
                >
                  <Heart size={16} className="text-rose-600" />
                  <span className="text-xs">Contribute</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  onClick={() => navigate('/volunteer-opportunities')}
                >
                  <Users size={16} className="text-purple-600" />
                  <span className="text-xs">Volunteer</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  onClick={() => navigate('/discussion-forum')}
                >
                  <MessageCircle size={16} className="text-emerald-600" />
                  <span className="text-xs">Sisters Chat</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  onClick={() => navigate('/feedback')}
                >
                  <Star size={16} className="text-pink-600" />
                  <span className="text-xs">Feedback</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-rose-200/50 dark:border-rose-800/50 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <Flower size={24} className="text-rose-600" />
          </div>
          <p className="text-lg font-arabic text-rose-600 mb-2" dir="rtl">
            وَالْمُؤْمِنُونَ وَالْمُؤْمِنَاتُ بَعْضُهُمْ أَوْلِيَاءُ بَعْضٍ
          </p>
          <p className="text-muted-foreground italic">
            "The believing men and believing women are allies of one another" - Quran 9:71
          </p>
        </div>

        {/* Islamic Programs Schedule */}
        <IslamicProgramsSchedule className="mt-8" />
      </div>
    </PageLayout>
  );
}