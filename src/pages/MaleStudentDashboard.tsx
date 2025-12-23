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
  Zap,
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
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MaleStudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

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
    { label: "Prayer Streak", value: "15 days", icon: Target, color: "text-green-600", bg: "bg-green-500/20" },
    { label: "Events Attended", value: "8", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/20" },
    { label: "Volunteer Hours", value: "24h", icon: Heart, color: "text-purple-600", bg: "bg-purple-500/20" },
    { label: "Learning Progress", value: "78%", icon: BookOpen, color: "text-orange-600", bg: "bg-orange-500/20" }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Jumu'ah Prayer",
      time: "12:30 PM",
      date: "Today",
      location: "Main Mosque",
      type: "prayer",
      attendees: 180
    },
    {
      id: 2,
      title: "Tafsir Study Circle",
      time: "4:00 PM",
      date: "Tomorrow",
      location: "Islamic Center",
      type: "learning",
      attendees: 45
    },
    {
      id: 3,
      title: "Community Service",
      time: "9:00 AM",
      date: "Saturday",
      location: "Local Community",
      type: "volunteer",
      attendees: 25
    }
  ];

  const learningProgress = [
    { subject: "Quran Memorization", progress: 65, total: "30 Surahs", color: "bg-green-500" },
    { subject: "Hadith Studies", progress: 80, total: "40 Hadith", color: "bg-blue-500" },
    { subject: "Fiqh Basics", progress: 45, total: "12 Chapters", color: "bg-purple-500" },
    { subject: "Arabic Language", progress: 70, total: "Level 3", color: "bg-orange-500" }
  ];

  const responsibilities = [
    { title: "IT Committee Lead", status: "active", tasks: 3, priority: "high" },
    { title: "Event Coordinator", status: "active", tasks: 2, priority: "medium" },
    { title: "Study Group Mentor", status: "active", tasks: 1, priority: "low" }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "Ramadan Preparation Meeting",
      content: "Join us for planning Ramadan activities and programs",
      time: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      title: "New Learning Resources Available",
      content: "Check out the latest Islamic education materials",
      time: "1 day ago",
      priority: "medium"
    }
  ];

  return (
    <PageLayout 
      title="Brother's Dashboard" 
      subtitle="Assalamu Alaikum, welcome to your Islamic journey"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header with Gender Switch Option */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg animate-glow">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display tracking-wide">Brother's Dashboard</h1>
              <p className="text-muted-foreground">Your Islamic journey and community engagement</p>
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
              className="bg-green-600 hover:bg-green-700 shadow-lg gap-2"
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
                  Administrative Access - Brother's Dashboard
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
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/islamic-pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-display tracking-wide mb-2">
                  Assalamu Alaikum, Brother {user?.email?.split('@')[0]}
                </h1>
                <p className="text-green-100">
                  May Allah bless your day with knowledge, worship, and service
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Current Time</p>
                <p className="text-2xl font-bold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-green-100 text-sm">
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
                <Clock size={16} className="mr-2" />
                Prayer Times
              </Button>
              <Button 
                onClick={() => navigate('/islamic-education')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <BookOpen size={16} className="mr-2" />
                Learning Center
              </Button>
              <Button 
                onClick={() => navigate('/events')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Calendar size={16} className="mr-2" />
                Events
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
                <TrendingUp size={16} className="text-muted-foreground" />
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
                  <Compass size={20} className="text-primary" />
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
                      data.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                      data.status === 'current' ? 'bg-primary/20 text-primary' :
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
                  <BookOpen size={20} className="text-primary" />
                  Learning Progress
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

            {/* Upcoming Events */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  Upcoming Events
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigate('/events')}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      event.type === 'prayer' ? 'bg-green-500/20 text-green-600' :
                      event.type === 'learning' ? 'bg-blue-500/20 text-blue-600' :
                      'bg-purple-500/20 text-purple-600'
                    )}>
                      {event.type === 'prayer' && <Compass size={20} />}
                      {event.type === 'learning' && <BookOpen size={20} />}
                      {event.type === 'volunteer' && <Heart size={20} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{event.date} at {event.time}</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {event.attendees}
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
            {/* Leadership & Responsibilities */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Shield size={18} className="text-primary" />
                  Leadership Roles
                </h2>
                <Button variant="outline" size="sm">
                  <Settings size={14} />
                </Button>
              </div>
              
              <div className="space-y-4">
                {responsibilities.map((role, index) => (
                  <div key={role.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{role.title}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        role.priority === 'high' ? 'bg-red-500/20 text-red-600' :
                        role.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                        'bg-green-500/20 text-green-600'
                      )}>
                        {role.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{role.tasks} pending tasks</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Target size={14} className="mr-2" />
                View All Responsibilities
              </Button>
            </div>

            {/* Prayer Reminders */}
            <PrayerReminderWidget compact={true} />

            {/* Recent Announcements */}
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bell size={18} className="text-primary" />
                  Announcements
                </h2>
                <Button variant="outline" size="sm">
                  <Bell size={14} />
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentAnnouncements.map((announcement, index) => (
                  <div 
                    key={announcement.id}
                    className="p-4 rounded-lg bg-secondary/30 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{announcement.title}</h3>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        announcement.priority === 'high' ? 'bg-red-500/20 text-red-600' :
                        'bg-blue-500/20 text-blue-600'
                      )}>
                        {announcement.priority}
                      </span>
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
                <Zap size={18} className="text-primary" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => navigate('/donations')}
                >
                  <Heart size={16} />
                  <span className="text-xs">Donate</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => navigate('/volunteer-opportunities')}
                >
                  <Users size={16} />
                  <span className="text-xs">Volunteer</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => navigate('/discussion-forum')}
                >
                  <MessageCircle size={16} />
                  <span className="text-xs">Discuss</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => navigate('/feedback')}
                >
                  <Star size={16} />
                  <span className="text-xs">Feedback</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-primary" />
          </div>
          <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-muted-foreground italic">
            "And whoever fears Allah - He will make for him a way out" - Quran 65:2
          </p>
        </div>

        {/* Islamic Programs Schedule */}
        <IslamicProgramsSchedule className="mt-8" />
      </div>
    </PageLayout>
  );
}