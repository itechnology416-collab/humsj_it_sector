import { useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAI } from "@/contexts/AIContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import SmartRecommendations from "@/components/ai/SmartRecommendations";
import SmartPrayerTimes from "@/components/ai/SmartPrayerTimes";
import { IslamicProgramsSchedule } from "@/components/islamic/IslamicProgramsSchedule";
import { PrayerReminderWidget } from "@/components/islamic/PrayerReminderWidget";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";
import IslamicSidebarWidget from "@/components/islamic/IslamicSidebarWidget";
import { 
  Calendar, 
  Bell, 
  BookOpen, 
  MessageSquare, 
  Award, 
  Clock,
  ChevronRight,
  Loader2,
  User,
  GraduationCap,
  Play,
  Zap,
  TrendingUp,
  Home,
  ArrowLeft,
  Sparkles,
  Shield,
  Heart,
  Users,
  Star,
  CheckCircle,
  Brain,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const upcomingEvents = [
  { id: 1, title: "Friday Prayer", time: "12:30 PM", date: "Today", type: "prayer" },
  { id: 2, title: "Quran Circle", time: "4:00 PM", date: "Tomorrow", type: "education" },
  { id: 3, title: "IT Workshop", time: "2:00 PM", date: "Dec 21", type: "workshop" },
];

const notifications = [
  { id: 1, title: "New announcement from Academic Sector", time: "2 hours ago", read: false },
  { id: 2, title: "Ramadan program schedule released", time: "Yesterday", read: false },
  { id: 3, title: "Your attendance was recorded", time: "2 days ago", read: true },
];

const resources = [
  { id: 1, title: "Islamic Ethics Guide", category: "Education", icon: BookOpen },
  { id: 2, title: "Prayer Times App", category: "Tools", icon: Clock },
  { id: 3, title: "Quran Audio Library", category: "Media", icon: MessageSquare },
];

export default function UserDashboard() {
  const { user, profile, roles, isLoading, isAdmin } = useAuth();
  const { toggleAIAssistant, aiInsights } = useAI();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  // Check for gender preference and redirect to appropriate dashboard
  useEffect(() => {
    if (user && !isLoading) {
      // Admins bypass automatic gender routing and stay on main dashboard
      if (isAdmin) {
        return; // Let admins stay on the main dashboard
      }

      const userGender = localStorage.getItem('userGender');
      const profileGender = profile?.gender;
      
      // If user has a gender preference, redirect to appropriate dashboard
      if (userGender === 'male') {
        navigate('/male-dashboard', { replace: true });
      } else if (userGender === 'female') {
        navigate('/female-dashboard', { replace: true });
      } else if (profileGender === 'male') {
        localStorage.setItem('userGender', 'male');
        navigate('/male-dashboard', { replace: true });
      } else if (profileGender === 'female') {
        localStorage.setItem('userGender', 'female');
        navigate('/female-dashboard', { replace: true });
      } else {
        // No gender preference set, redirect to gender selection
        navigate('/gender-selection', { replace: true });
      }
    }
  }, [user, profile, isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProtectedPageLayout 
      title="Dashboard" 
      subtitle="Welcome back"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Enhanced Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
                <Home size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display tracking-wide">
                  {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? "Administrative control panel" : "Your personal hub"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-red gap-2 group"
              >
                <Shield size={16} className="group-hover:rotate-12 transition-transform" />
                Admin Panel
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/events")}
              className="border-border/50 hover:border-primary hover:bg-primary/5 gap-2"
            >
              <Calendar size={16} />
              Browse Events
            </Button>
          </div>
        </div>

        {/* Admin Gender Dashboard Access */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-500/10 via-card to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center animate-pulse">
                <Shield size={32} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-display tracking-wide mb-2">Admin Dashboard Access</h3>
                <p className="text-muted-foreground">
                  As an administrator, you have access to both gender-specific dashboards for oversight and management purposes.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Male Dashboard Access */}
              <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <User size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Brother's Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Male student dashboard view</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={12} className="text-green-600" />
                    <span>Leadership & Community Features</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={12} className="text-green-600" />
                    <span>Brotherhood Engagement Tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={12} className="text-green-600" />
                    <span>Committee Management</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/male-dashboard')}
                  className="w-full bg-green-600 hover:bg-green-700 shadow-lg gap-2"
                >
                  <User size={16} />
                  View Brother's Dashboard
                </Button>
              </div>

              {/* Female Dashboard Access */}
              <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-rose-500/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/30 transition-colors">
                    <Heart size={24} className="text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Sister's Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Female student dashboard view</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={12} className="text-rose-600" />
                    <span>Sisterhood & Mentorship</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={12} className="text-rose-600" />
                    <span>Privacy-First Environment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={12} className="text-rose-600" />
                    <span>Well-being Support</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/female-dashboard')}
                  className="w-full bg-rose-600 hover:bg-rose-700 shadow-lg gap-2"
                >
                  <Heart size={16} />
                  View Sister's Dashboard
                </Button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                    Administrative Access Notice
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-300">
                    This access is provided for administrative oversight, member support, and system management. 
                    Please respect the privacy and Islamic principles governing these spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Profile Summary */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center shadow-red animate-glow">
              <span className="text-3xl font-display text-primary-foreground">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-display tracking-wide">{profile?.full_name || "Member"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {roles.map((role) => (
                  <span 
                    key={role} 
                    className="px-3 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                  >
                    {role.replace("_", " ").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/settings")} className="border-border/50 hover:border-primary">
                <User size={16} className="mr-2" />
                Edit Profile
              </Button>
              {isAdmin && (
                <Button onClick={() => navigate("/admin")} className="bg-primary hover:bg-primary/90 shadow-red">
                  <GraduationCap size={16} className="mr-2" />
                  Admin Panel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Events Attended", value: "12", icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
            { label: "Unread Messages", value: "3", icon: Bell, color: "text-primary", bg: "bg-primary/10" },
            { label: "Resources", value: "28", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "AI Wellness Score", value: aiInsights.overallWellness.toString(), icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="group bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-red cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => stat.label === "AI Wellness Score" ? navigate("/ai-insights") : null}
            >
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-3xl font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {stat.label === "AI Wellness Score" && (
                <div className="mt-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-purple-400" />
                  <span className="text-xs text-purple-400">AI Powered</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Assistant Quick Access */}
        <div className="bg-gradient-to-r from-purple-500/20 via-card to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center animate-pulse">
                <Bot size={32} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-display tracking-wide mb-2">AI Assistant Ready</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations, prayer reminders, and Islamic guidance powered by AI
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">Online & Learning</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={toggleAIAssistant}
                className="bg-purple-500 hover:bg-purple-500/90 shadow-red gap-2"
              >
                <Bot size={16} />
                Chat with AI
              </Button>
              <Button
                onClick={() => navigate("/ai-insights")}
                variant="outline"
                className="border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 gap-2"
              >
                <Brain size={16} />
                AI Insights
              </Button>
            </div>
          </div>
        </div>

        {/* Islamic Educational Content - Between Stats and Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicSidebarWidget variant="daily-verse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Upcoming Events
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-events")} className="text-primary hover:text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Play size={16} className="text-primary fill-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                Notifications
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/messages")} className="text-primary hover:text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "group flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer border",
                    notification.read 
                      ? "bg-transparent border-transparent hover:bg-secondary/50" 
                      : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    notification.read ? "bg-muted-foreground/30" : "bg-primary animate-pulse"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium text-sm", !notification.read && "text-primary")}>{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                Quick Resources
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/learning-center")} className="text-primary hover:text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div 
                  key={resource.id}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <resource.icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.category}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="font-display text-xl tracking-wide mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Learning Center", icon: BookOpen, path: "/learning-center", color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Course Enrollment", icon: GraduationCap, path: "/islamic-course-enrollment", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Quran Audio", icon: Star, path: "/quran-audio", color: "text-green-400", bg: "bg-green-500/10" },
              { label: "Prayer Tracker", icon: Clock, path: "/prayer-tracker", color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Digital Tasbih", icon: Heart, path: "/dhikr-counter", color: "text-red-400", bg: "bg-red-500/10" },
              { label: "AI Voice", icon: Bot, path: "/ai-voice-assistant", color: "text-amber-400", bg: "bg-amber-500/10" }
            ].map((action, index) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={cn(
                  "group p-4 rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-red text-left animate-slide-up",
                  action.bg
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform", action.bg)}>
                    <action.icon className={cn("h-6 w-6", action.color)} />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
                  {(action.label === "AI Insights" || action.label === "AI Voice") && (
                    <div className="flex items-center gap-1">
                      <Sparkles size={10} className="text-purple-400" />
                      <span className="text-xs text-purple-400">AI</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning & Spiritual Growth */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h3 className="font-display text-lg tracking-wide mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Learning & Spiritual Growth
            </h3>
            <div className="space-y-3">
              {[
                { label: "My Learning Center", desc: "Saved lectures and courses", path: "/learning-center", icon: BookOpen },
                { label: "Qur'an & Hadith Tracker", desc: "Track your Islamic studies", path: "/quran-tracker", icon: Star },
                { label: "Spiritual Progress", desc: "Prayer and fasting tracking", path: "/spiritual-progress", icon: Heart }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Smart Prayer Times */}
          <div className="lg:col-span-1">
            <SmartPrayerTimes showAIInsights={true} />
          </div>

          {/* Prayer Reminders */}
          <div className="lg:col-span-1">
            <PrayerReminderWidget />
          </div>

          {/* Community & Participation */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h3 className="font-display text-lg tracking-wide mb-4 flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Community & Participation
            </h3>
            <div className="space-y-3">
              {[
                { label: "My Events", desc: "Registered events and attendance", path: "/my-events", icon: Calendar },
                { label: "Volunteer Opportunities", desc: "Available volunteer tasks", path: "/volunteer-opportunities", icon: Heart },
                { label: "My Contributions", desc: "Service hours and achievements", path: "/my-contributions", icon: Award },
                { label: "Discussion Forum", desc: "Community discussions", path: "/discussion-forum", icon: MessageSquare }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Smart Recommendations */}
        <div>
          <h3 className="font-display text-xl tracking-wide mb-4 flex items-center gap-2">
            <Brain size={20} className="text-primary" />
            AI-Powered Recommendations
          </h3>
          <SmartRecommendations maxRecommendations={3} showHeader={false} />
        </div>

        {/* Daily Reminder */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-accent/10 rounded-xl p-6 border border-primary/20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 animate-float">
              <BookOpen className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide mb-2">Daily Reminder</h3>
              <p className="text-muted-foreground text-sm italic">
                "The best among you are those who learn the Quran and teach it."
              </p>
              <p className="text-xs text-primary mt-2">— Prophet Muhammad ﷺ (Sahih Bukhari)</p>
            </div>
          </div>
        </div>

        {/* Islamic Programs Schedule */}
        <IslamicProgramsSchedule className="mt-8" />
      </div>
    </ProtectedPageLayout>
  );
}