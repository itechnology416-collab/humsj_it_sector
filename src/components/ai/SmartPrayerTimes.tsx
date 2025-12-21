import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Clock, 
  Bell, 
  BellRing,
  Sun, 
  Sunrise, 
  Sunset,
  Moon,
  Star,
  MapPin,
  Settings,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PrayerTime {
  name: string;
  time: string;
  icon: any;
  completed: boolean;
  reminded: boolean;
  optimal: boolean;
  aiSuggestion?: string;
}

interface SmartPrayerTimesProps {
  className?: string;
  showAIInsights?: boolean;
}

export default function SmartPrayerTimes({ className, showAIInsights = true }: SmartPrayerTimesProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerConsistency, setPrayerConsistency] = useState(85);
  const [weeklyStreak, setWeeklyStreak] = useState(7);

  const prayerTimes: PrayerTime[] = [
    {
      name: "Fajr",
      time: "05:30",
      icon: Sunrise,
      completed: true,
      reminded: true,
      optimal: true,
      aiSuggestion: "Perfect timing! Your consistency for Fajr is excellent."
    },
    {
      name: "Dhuhr",
      time: "12:15",
      icon: Sun,
      completed: true,
      reminded: true,
      optimal: true,
      aiSuggestion: "Consider praying 10 minutes earlier to avoid work conflicts."
    },
    {
      name: "Asr",
      time: "15:45",
      icon: Sun,
      completed: false,
      reminded: false,
      optimal: false,
      aiSuggestion: "AI suggests setting a reminder 15 minutes before Asr."
    },
    {
      name: "Maghrib",
      time: "18:20",
      icon: Sunset,
      completed: false,
      reminded: true,
      optimal: true,
      aiSuggestion: "Great timing! This aligns with your evening routine."
    },
    {
      name: "Isha",
      time: "19:45",
      icon: Moon,
      completed: false,
      reminded: true,
      optimal: true,
      aiSuggestion: "Perfect for your sleep schedule optimization."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getNextPrayer = () => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 5);
    
    for (const prayer of prayerTimes) {
      if (prayer.time > currentTimeStr && !prayer.completed) {
        return prayer;
      }
    }
    return prayerTimes[0]; // Return Fajr if all prayers are done
  };

  const getTimeUntilNext = (nextPrayer: PrayerTime) => {
    const now = new Date();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    if (prayerTime < now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }
    
    const diff = prayerTime.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  const completedPrayers = prayerTimes.filter(p => p.completed).length;
  const prayerProgress = (completedPrayers / prayerTimes.length) * 100;
  const nextPrayer = getNextPrayer();

  return (
    <div className={cn("bg-card rounded-xl border border-border/30", className)}>
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg tracking-wide">Smart Prayer Times</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>Addis Ababa, Ethiopia</span>
                {showAIInsights && (
                  <>
                    <span>•</span>
                    <Brain size={12} className="text-purple-400" />
                    <span className="text-purple-400">AI Optimized</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/spiritual-progress")}
            className="border-border/50 hover:border-primary gap-1"
          >
            <Settings size={14} />
            Settings
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium mb-1">Next Prayer: {nextPrayer.name}</h4>
            <p className="text-sm text-muted-foreground">
              {nextPrayer.time} • in {getTimeUntilNext(nextPrayer)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display text-primary">{Math.round(prayerProgress)}%</p>
            <p className="text-xs text-muted-foreground">Today's Progress</p>
          </div>
        </div>
        <Progress value={prayerProgress} className="h-2" />
      </div>

      {/* Prayer Times List */}
      <div className="p-6 space-y-3">
        {prayerTimes.map((prayer, index) => {
          const PrayerIcon = prayer.icon;
          const isNext = prayer.name === nextPrayer.name;
          
          return (
            <div
              key={prayer.name}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all",
                prayer.completed 
                  ? "bg-green-500/10 border border-green-500/20" 
                  : isNext 
                    ? "bg-primary/10 border border-primary/20" 
                    : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                prayer.completed 
                  ? "bg-green-500/20" 
                  : isNext 
                    ? "bg-primary/20" 
                    : "bg-muted"
              )}>
                {prayer.completed ? (
                  <CheckCircle size={20} className="text-green-400" />
                ) : (
                  <PrayerIcon size={20} className={isNext ? "text-primary" : "text-muted-foreground"} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">{prayer.name}</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{prayer.time}</span>
                    {prayer.reminded && (
                      <BellRing size={14} className="text-primary" />
                    )}
                    {prayer.optimal && showAIInsights && (
                      <Zap size={14} className="text-amber-400" />
                    )}
                  </div>
                </div>
                
                {showAIInsights && prayer.aiSuggestion && (
                  <p className="text-xs text-muted-foreground italic">
                    💡 {prayer.aiSuggestion}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      {showAIInsights && (
        <div className="p-6 border-t border-border/30">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Brain size={16} className="text-purple-400" />
            AI Prayer Insights
          </h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-lg font-display text-primary">{prayerConsistency}%</p>
              <p className="text-xs text-muted-foreground">Consistency Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-lg font-display text-green-400">{weeklyStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} className="text-green-400" />
              <span>Your Fajr consistency improved by 15% this week</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle size={14} className="text-amber-400" />
              <span>Consider setting Asr reminder 15 minutes earlier</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star size={14} className="text-purple-400" />
              <span>You're in the top 20% of consistent community members</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => navigate("/spiritual-progress")}
              className="flex-1 bg-primary hover:bg-primary/90 text-xs gap-1"
            >
              <Calendar size={12} />
              View Progress
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/quran-tracker")}
              className="flex-1 text-xs gap-1"
            >
              <Brain size={12} />
              AI Coaching
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}