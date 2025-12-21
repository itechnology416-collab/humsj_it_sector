import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Plus,
  Edit,
  Star,
  Moon,
  Sun,
  Heart,
  Award,
  Activity,
  BarChart3,
  Zap,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const prayerTimes = [
  { name: "Fajr", time: "05:30", completed: true, onTime: true },
  { name: "Dhuhr", time: "12:15", completed: true, onTime: true },
  { name: "Asr", time: "15:45", completed: true, onTime: false },
  { name: "Maghrib", time: "18:20", completed: false, onTime: false },
  { name: "Isha", time: "19:45", completed: false, onTime: false },
];

const weeklyStats = [
  { day: "Mon", prayers: 5, fasting: true },
  { day: "Tue", prayers: 4, fasting: true },
  { day: "Wed", prayers: 5, fasting: true },
  { day: "Thu", prayers: 3, fasting: false },
  { day: "Fri", prayers: 5, fasting: true },
  { day: "Sat", prayers: 4, fasting: true },
  { day: "Sun", prayers: 3, fasting: false },
];

const personalGoals = [
  { 
    id: 1, 
    title: "Pray all 5 daily prayers", 
    target: 35, 
    current: 28, 
    period: "weekly",
    category: "prayer",
    streak: 7
  },
  { 
    id: 2, 
    title: "Fast Mondays and Thursdays", 
    target: 8, 
    current: 6, 
    period: "monthly",
    category: "fasting",
    streak: 3
  },
  { 
    id: 3, 
    title: "Read Quran daily", 
    target: 30, 
    current: 22, 
    period: "monthly",
    category: "quran",
    streak: 5
  },
  { 
    id: 4, 
    title: "Night prayer (Tahajjud)", 
    target: 12, 
    current: 8, 
    period: "monthly",
    category: "prayer",
    streak: 2
  }
];

export default function SpiritualProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("salah");

  const tabs = [
    { id: "salah", label: "Salah Tracking", icon: Clock },
    { id: "fasting", label: "Fasting Log", icon: Moon },
    { id: "goals", label: "Personal Goals", icon: Target },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

  const completedPrayers = prayerTimes.filter(p => p.completed).length;
  const onTimePrayers = prayerTimes.filter(p => p.completed && p.onTime).length;
  const prayerPercentage = Math.round((completedPrayers / prayerTimes.length) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "prayer": return Clock;
      case "fasting": return Moon;
      case "quran": return Star;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prayer": return "text-primary";
      case "fasting": return "text-blue-400";
      case "quran": return "text-amber-400";
      default: return "text-green-400";
    }
  };

  return (
    <PageLayout 
      title="Spiritual Progress" 
      subtitle="Track your Islamic worship and spiritual growth"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Today's Overview */}
        <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-red animate-glow">
              <Sun size={32} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-display tracking-wide">Today's Progress</h3>
              <p className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Prayers Completed", value: `${completedPrayers}/5`, icon: Clock, color: "text-primary" },
              { label: "On Time", value: `${onTimePrayers}/5`, icon: CheckCircle, color: "text-green-400" },
              { label: "Fasting Today", value: "Yes", icon: Moon, color: "text-blue-400" },
              { label: "Quran Read", value: "30 min", icon: Star, color: "text-amber-400" }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-card/50 rounded-lg p-4 border border-border/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className={stat.color} />
                  <span className="text-lg font-display">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "salah" && (
            <div className="space-y-6">
              {/* Prayer Progress */}
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-display">Today's Prayers</h3>
                  <Badge variant={prayerPercentage === 100 ? "default" : "secondary"}>
                    {prayerPercentage}% Complete
                  </Badge>
                </div>

                <div className="space-y-3">
                  {prayerTimes.map((prayer, index) => (
                    <div 
                      key={prayer.name}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all",
                        prayer.completed 
                          ? prayer.onTime 
                            ? "bg-green-500/10 border-green-500/30" 
                            : "bg-amber-500/10 border-amber-500/30"
                          : "bg-secondary/30 border-border/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          prayer.completed 
                            ? prayer.onTime 
                              ? "bg-green-500/20" 
                              : "bg-amber-500/20"
                            : "bg-muted"
                        )}>
                          {prayer.completed ? (
                            <CheckCircle size={20} className={prayer.onTime ? "text-green-400" : "text-amber-400"} />
                          ) : (
                            <Clock size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{prayer.name}</h4>
                          <p className="text-sm text-muted-foreground">{prayer.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {prayer.completed && (
                          <Badge variant={prayer.onTime ? "default" : "secondary"} className="text-xs">
                            {prayer.onTime ? "On Time" : "Late"}
                          </Badge>
                        )}
                        {!prayer.completed && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Progress</span>
                    <span>{completedPrayers}/5 prayers</span>
                  </div>
                  <Progress value={prayerPercentage} className="h-3" />
                </div>
              </div>

              {/* Weekly Overview */}
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h3 className="text-lg font-display mb-4">This Week's Performance</h3>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyStats.map((day, index) => (
                    <div key={day.day} className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">{day.day}</p>
                      <div className="space-y-1">
                        <div className={cn(
                          "w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-xs font-medium",
                          day.prayers === 5 ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                        )}>
                          {day.prayers}
                        </div>
                        <div className={cn(
                          "w-2 h-2 rounded-full mx-auto",
                          day.fasting ? "bg-blue-400" : "bg-muted"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>5 Prayers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Fasting</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fasting" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Fasting Log</h3>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus size={16} />
                  Log Fast
                </Button>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/30">
                <div className="text-center py-20">
                  <Moon size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display mb-2">Fasting Tracker</h3>
                  <p className="text-muted-foreground">Track your voluntary and obligatory fasts.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Personal Spiritual Goals</h3>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus size={16} />
                  Add Goal
                </Button>
              </div>

              <div className="grid gap-4">
                {personalGoals.map((goal) => {
                  const CategoryIcon = getCategoryIcon(goal.category);
                  const progress = Math.round((goal.current / goal.target) * 100);
                  
                  return (
                    <div 
                      key={goal.id}
                      className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <CategoryIcon size={20} className={getCategoryColor(goal.category)} />
                          </div>
                          <div>
                            <h4 className="font-medium">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {goal.period} goal • {goal.streak} day streak
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-display text-primary">{progress}%</p>
                          <p className="text-xs text-muted-foreground">{goal.current}/{goal.target}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress this {goal.period.slice(0, -2)}</span>
                          <span>{goal.target - goal.current} remaining</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border/50 gap-1">
                          <Edit size={14} />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-border/50 gap-1">
                          <Activity size={14} />
                          Log Progress
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Prayer Consistency", value: "85%", trend: "+5%", icon: TrendingUp, color: "text-green-400" },
                  { label: "Weekly Average", value: "4.2/5", trend: "+0.3", icon: BarChart3, color: "text-blue-400" },
                  { label: "Best Streak", value: "21 days", trend: "Current", icon: Zap, color: "text-amber-400" }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="bg-card rounded-xl p-5 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon size={20} className={stat.color} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="text-2xl font-display mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h3 className="text-lg font-display mb-4">Monthly Trends</h3>
                <div className="text-center py-20">
                  <BarChart3 size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Detailed analytics and insights coming soon.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}