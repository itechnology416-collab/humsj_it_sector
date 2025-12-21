import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Clock, 
  MapPin, 
  Calendar,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Star,
  Bell,
  Settings,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ElementType;
  color: string;
  isNext?: boolean;
}

interface DailyPrayers {
  date: string;
  hijriDate: string;
  location: string;
  prayers: PrayerTime[];
}

export default function PrayerTimesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mock prayer times data - in production, this would come from an Islamic API
  const todayPrayers: DailyPrayers = {
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    hijriDate: "15 Rajab 1446 AH",
    location: "Haramaya, Ethiopia",
    prayers: [
      { name: "Fajr", time: "05:45", icon: Sunrise, color: "text-blue-400", isNext: false },
      { name: "Dhuhr", time: "12:30", icon: Sun, color: "text-yellow-400", isNext: true },
      { name: "Asr", time: "15:45", icon: Sun, color: "text-orange-400", isNext: false },
      { name: "Maghrib", time: "18:15", icon: Sunset, color: "text-red-400", isNext: false },
      { name: "Isha", time: "19:30", icon: Moon, color: "text-purple-400", isNext: false },
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getTimeUntilNext = (prayerTime: string) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayer = new Date();
    prayer.setHours(hours, minutes, 0, 0);
    
    if (prayer < now) {
      prayer.setDate(prayer.getDate() + 1);
    }
    
    const diff = prayer.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  return (
    <PageLayout 
      title="Prayer Times" 
      subtitle="Daily prayer schedule and Islamic calendar"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-glow flex items-center justify-center animate-glow">
              <Clock size={32} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Prayer Times</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {todayPrayers.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {todayPrayers.hijriDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-border/50 hover:border-primary"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border/50 hover:border-primary"
            >
              <Settings size={16} />
              Settings
            </Button>
          </div>
        </div>

        {/* Current Time */}
        <div className="bg-card rounded-2xl p-6 border border-border/30 text-center">
          <p className="text-sm text-muted-foreground mb-2">{todayPrayers.date}</p>
          <p className="text-4xl font-display tracking-wide mb-2">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
          <p className="text-sm text-muted-foreground">{todayPrayers.hijriDate}</p>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {todayPrayers.prayers.map((prayer, index) => {
            const Icon = prayer.icon;
            const timeUntil = prayer.isNext ? getTimeUntilNext(prayer.time) : null;
            
            return (
              <div 
                key={prayer.name}
                className={cn(
                  "bg-card rounded-xl p-5 border transition-all duration-300 hover:scale-105 animate-slide-up opacity-0",
                  prayer.isNext 
                    ? "border-primary bg-primary/5 shadow-red" 
                    : "border-border/30 hover:border-primary/50"
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    prayer.isNext ? "bg-primary/20" : "bg-secondary/50"
                  )}>
                    <Icon size={24} className={prayer.isNext ? "text-primary" : prayer.color} />
                  </div>
                  {prayer.isNext && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Bell size={12} />
                      Next
                    </div>
                  )}
                </div>
                
                <h3 className={cn(
                  "font-display text-lg tracking-wide mb-1",
                  prayer.isNext && "text-primary"
                )}>
                  {prayer.name}
                </h3>
                
                <p className={cn(
                  "text-2xl font-bold mb-2",
                  prayer.isNext && "text-primary"
                )}>
                  {prayer.time}
                </p>
                
                {timeUntil && (
                  <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">
                    in {timeUntil}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Islamic Calendar Events */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h3 className="font-display text-xl tracking-wide mb-4 flex items-center gap-2">
            <Star size={20} className="text-primary" />
            Upcoming Islamic Events
          </h3>
          
          <div className="space-y-3">
            {[
              { name: "Laylat al-Isra wa al-Mi'raj", date: "27 Rajab 1446", days: "12 days" },
              { name: "Beginning of Sha'ban", date: "1 Sha'ban 1446", days: "17 days" },
              { name: "Laylat al-Bara'at", date: "15 Sha'ban 1446", days: "31 days" },
              { name: "Beginning of Ramadan", date: "1 Ramadan 1446", days: "46 days" },
            ].map((event, index) => (
              <div 
                key={event.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <span className="text-sm text-primary font-medium">
                  {event.days}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Qibla Direction */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h3 className="font-display text-xl tracking-wide mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Qibla Direction
          </h3>
          
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-emerald-glow/10">
              <div className="absolute inset-4 rounded-full border-2 border-primary/30">
                <div className="absolute inset-4 rounded-full border border-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
              
              {/* Qibla indicator */}
              <div 
                className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-8 bg-primary rounded-full"
                style={{ transformOrigin: 'bottom center', transform: 'translateX(-50%) rotate(45deg)' }}
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                <p className="text-xs text-muted-foreground">Qibla</p>
                <p className="text-sm font-medium text-primary">45° NE</p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Direction to Makkah from {todayPrayers.location}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}