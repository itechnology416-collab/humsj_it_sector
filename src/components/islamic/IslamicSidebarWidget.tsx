import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Clock,
  Compass,
  Calendar,
  Moon,
  Sun,
  Star,
  Heart,
  Zap,
  ChevronRight,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IslamicSidebarWidgetProps {
  className?: string;
  variant?: 'prayer-times' | 'daily-verse' | 'islamic-calendar' | 'dhikr-counter' | 'qibla-direction';
}

export default function IslamicSidebarWidget({ 
  className = '', 
  variant = 'daily-verse' 
}: IslamicSidebarWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dhikrCount, setDhikrCount] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Daily verses for rotation
  const dailyVerses = [
    {
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      english: "And whoever fears Allah - He will make for him a way out",
      reference: "65:2"
    },
    {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english: "Indeed, with hardship comes ease",
      reference: "94:6"
    },
    {
      arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
      english: "And He is with you wherever you are",
      reference: "57:4"
    }
  ];

  // Mock prayer times (would come from API)
  const prayerTimes = {
    fajr: "05:30",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45"
  };

  // Islamic months
  const islamicMonths = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];

  // Dhikr phrases
  const dhikrPhrases = [
    "سُبْحَانَ اللَّهِ", // SubhanAllah
    "الْحَمْدُ لِلَّهِ", // Alhamdulillah
    "اللَّهُ أَكْبَرُ", // Allahu Akbar
    "لَا إِلَٰهَ إِلَّا اللَّهُ" // La ilaha illa Allah
  ];

  const getCurrentPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const times = Object.entries(prayerTimes).map(([name, time]) => {
      const [hours, minutes] = time.split(':').map(Number);
      return { name, minutes: hours * 60 + minutes };
    });
    
    for (let i = 0; i < times.length; i++) {
      if (now < times[i].minutes) {
        return { current: times[i].name, time: prayerTimes[times[i].name as keyof typeof prayerTimes] };
      }
    }
    return { current: 'fajr', time: prayerTimes.fajr };
  };

  const getHijriDate = () => {
    // Mock Hijri date (would come from Islamic calendar API)
    return {
      day: 15,
      month: "Jumada al-Thani",
      year: 1446
    };
  };

  const renderPrayerTimes = () => (
    <Card className={cn("bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Clock size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Prayer Times</h3>
            <p className="text-xs text-muted-foreground">Today's Schedule</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {Object.entries(prayerTimes).map(([prayer, time]) => {
            const nextPrayer = getCurrentPrayer();
            const isNext = nextPrayer.current === prayer;
            return (
              <div key={prayer} className={cn(
                "flex justify-between items-center p-2 rounded-lg transition-all",
                isNext ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" : "hover:bg-secondary/50"
              )}>
                <span className={cn("capitalize text-sm", isNext && "font-semibold text-green-700 dark:text-green-300")}>
                  {prayer}
                </span>
                <span className={cn("text-sm", isNext && "font-semibold text-green-700 dark:text-green-300")}>
                  {time}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="pt-2 border-t border-green-200 dark:border-green-800">
          <p className="text-xs text-center text-muted-foreground">
            Next: <span className="font-medium text-green-600 dark:text-green-400">{getCurrentPrayer().current}</span> at {getCurrentPrayer().time}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderDailyVerse = () => (
    <Card className={cn("bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Daily Verse</h3>
              <p className="text-xs text-muted-foreground">Quran {dailyVerses[currentVerse].reference}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => setCurrentVerse((prev) => (prev + 1) % dailyVerses.length)}
          >
            <RefreshCw size={12} />
          </Button>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-arabic text-center text-blue-700 dark:text-blue-300 leading-relaxed" dir="rtl">
            {dailyVerses[currentVerse].arabic}
          </p>
          <p className="text-xs text-center text-muted-foreground italic leading-relaxed">
            "{dailyVerses[currentVerse].english}"
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs">
            Quran {dailyVerses[currentVerse].reference}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Volume2 size={10} />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Heart size={10} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderIslamicCalendar = () => {
    const hijriDate = getHijriDate();
    return (
      <Card className={cn("bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800", className)}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <Calendar size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Islamic Calendar</h3>
              <p className="text-xs text-muted-foreground">Hijri Date</p>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {hijriDate.day}
            </div>
            <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {hijriDate.month}
            </div>
            <div className="text-xs text-muted-foreground">
              {hijriDate.year} AH
            </div>
          </div>
          
          <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
            <p className="text-xs text-center text-muted-foreground">
              Gregorian: {currentTime.toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDhikrCounter = () => (
    <Card className={cn("bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Dhikr Counter</h3>
            <p className="text-xs text-muted-foreground">Remember Allah</p>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <div className="text-lg font-arabic text-amber-700 dark:text-amber-300">
            {dhikrPhrases[dhikrCount % dhikrPhrases.length]}
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {dhikrCount}
          </div>
          <Button 
            onClick={() => setDhikrCount(prev => prev + 1)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            size="sm"
          >
            <Heart size={14} className="mr-1" />
            Count
          </Button>
        </div>
        
        <div className="flex justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDhikrCount(0)}
            className="text-xs"
          >
            Reset
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
          >
            Goal: 100
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderQiblaDirection = () => (
    <Card className={cn("bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <Compass size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Qibla Direction</h3>
            <p className="text-xs text-muted-foreground">Towards Makkah</p>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-full h-full rounded-full border-4 border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <div className="w-1 h-8 bg-emerald-500 rounded-full transform rotate-45 origin-bottom"></div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">N</div>
            </div>
          </div>
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            45° Northeast
          </div>
          <p className="text-xs text-muted-foreground">
            Distance: 1,247 km
          </p>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          <Compass size={12} className="mr-1" />
          Open Qibla Finder
        </Button>
      </CardContent>
    </Card>
  );

  switch (variant) {
    case 'prayer-times':
      return renderPrayerTimes();
    case 'daily-verse':
      return renderDailyVerse();
    case 'islamic-calendar':
      return renderIslamicCalendar();
    case 'dhikr-counter':
      return renderDhikrCounter();
    case 'qibla-direction':
      return renderQiblaDirection();
    default:
      return renderDailyVerse();
  }
}

// Specialized exports
export function PrayerTimesWidget(props: Omit<IslamicSidebarWidgetProps, 'variant'>) {
  return <IslamicSidebarWidget {...props} variant="prayer-times" />;
}

export function DailyVerseWidget(props: Omit<IslamicSidebarWidgetProps, 'variant'>) {
  return <IslamicSidebarWidget {...props} variant="daily-verse" />;
}

export function IslamicCalendarWidget(props: Omit<IslamicSidebarWidgetProps, 'variant'>) {
  return <IslamicSidebarWidget {...props} variant="islamic-calendar" />;
}

export function DhikrCounterWidget(props: Omit<IslamicSidebarWidgetProps, 'variant'>) {
  return <IslamicSidebarWidget {...props} variant="dhikr-counter" />;
}

export function QiblaDirectionWidget(props: Omit<IslamicSidebarWidgetProps, 'variant'>) {
  return <IslamicSidebarWidget {...props} variant="qibla-direction" />;
}