import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar,
  TrendingUp,
  Award,
  Target,
  RotateCcw,
  Plus,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Star,
  Loader2,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { prayerTimesService, type PrayerTimes, type Coordinates } from '@/services/prayerTimesApi';

interface PrayerTrackerProps {
  className?: string;
}

interface Prayer {
  name: string;
  arabicName: string;
  time: string;
  completed: boolean;
  onTime: boolean;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  color: string;
}

interface DayStats {
  date: string;
  prayers: Prayer[];
  totalCompleted: number;
  onTimeCount: number;
}

export default function PrayerTracker({ className }: PrayerTrackerProps) {
  const [weeklyStats, setWeeklyStats] = useState<DayStats[]>([]);
  const [monthlyStreak, setMonthlyStreak] = useState(0);
  const [todaysPrayers, setTodaysPrayers] = useState<Prayer[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load prayer times and location
  useEffect(() => {
    const loadPrayerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user location
        const userCoordinates = await prayerTimesService.getCurrentLocation();
        setCoordinates(userCoordinates);

        // Get today's prayer times
        const times = await prayerTimesService.getPrayerTimes(userCoordinates);
        setPrayerTimes(times);

        // Initialize prayers with real times
        const prayers = initializePrayersWithTimes(times);
        setTodaysPrayers(prayers);

        // Load saved prayer completion status from localStorage
        const savedStatus = localStorage.getItem(`prayer-status-${new Date().toDateString()}`);
        if (savedStatus) {
          const status = JSON.parse(savedStatus);
          setTodaysPrayers(prev => prev.map((prayer, index) => ({
            ...prayer,
            completed: status[index]?.completed || false,
            onTime: status[index]?.onTime || false
          })));
        }

      } catch (err) {
        console.error('Error loading prayer data:', err);
        setError('Failed to load prayer times. Using default times.');
        // Fallback to default prayers
        setTodaysPrayers(initializePrayers());
      } finally {
        setIsLoading(false);
      }
    };

    loadPrayerData();
  }, []);

  // Save prayer status to localStorage whenever it changes
  useEffect(() => {
    if (todaysPrayers.length > 0) {
      const status = todaysPrayers.map(prayer => ({
        completed: prayer.completed,
        onTime: prayer.onTime
      }));
      localStorage.setItem(`prayer-status-${new Date().toDateString()}`, JSON.stringify(status));
    }
  }, [todaysPrayers]);

  // Initialize prayers with real prayer times
  const initializePrayersWithTimes = (times: PrayerTimes): Prayer[] => [
    { name: 'Fajr', arabicName: 'الفجر', time: times.fajr, completed: false, onTime: false, icon: Sunrise, color: 'text-orange-500' },
    { name: 'Dhuhr', arabicName: 'الظهر', time: times.dhuhr, completed: false, onTime: false, icon: Sun, color: 'text-yellow-500' },
    { name: 'Asr', arabicName: 'العصر', time: times.asr, completed: false, onTime: false, icon: Sun, color: 'text-amber-500' },
    { name: 'Maghrib', arabicName: 'المغرب', time: times.maghrib, completed: false, onTime: false, icon: Sunset, color: 'text-red-500' },
    { name: 'Isha', arabicName: 'العشاء', time: times.isha, completed: false, onTime: false, icon: Moon, color: 'text-blue-500' }
  ];

  // Initialize default prayers (fallback)
  const initializePrayers = (): Prayer[] => [
    { name: 'Fajr', arabicName: 'الفجر', time: '05:30', completed: false, onTime: false, icon: Sunrise, color: 'text-orange-500' },
    { name: 'Dhuhr', arabicName: 'الظهر', time: '12:15', completed: false, onTime: false, icon: Sun, color: 'text-yellow-500' },
    { name: 'Asr', arabicName: 'العصر', time: '15:45', completed: false, onTime: false, icon: Sun, color: 'text-amber-500' },
    { name: 'Maghrib', arabicName: 'المغرب', time: '18:20', completed: false, onTime: false, icon: Sunset, color: 'text-red-500' },
    { name: 'Isha', arabicName: 'العشاء', time: '19:45', completed: false, onTime: false, icon: Moon, color: 'text-blue-500' }
  ];

  // Generate weekly stats (mock data)
  useEffect(() => {
    const generateWeeklyStats = () => {
      const stats: DayStats[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const prayers = initializePrayers().map(prayer => ({
          ...prayer,
          completed: Math.random() > 0.2, // 80% completion rate
          onTime: Math.random() > 0.3 // 70% on-time rate
        }));
        
        const totalCompleted = prayers.filter(p => p.completed).length;
        const onTimeCount = prayers.filter(p => p.onTime).length;
        
        stats.push({
          date: date.toISOString().split('T')[0],
          prayers,
          totalCompleted,
          onTimeCount
        });
      }
      setWeeklyStats(stats);
    };

    if (!isLoading) {
      generateWeeklyStats();
      setMonthlyStreak(Math.floor(Math.random() * 15) + 5); // Mock streak
    }
  }, [isLoading]);

  const togglePrayerCompletion = (prayerIndex: number, onTime: boolean = false) => {
    setTodaysPrayers(prev => prev.map((prayer, index) => 
      index === prayerIndex 
        ? { ...prayer, completed: !prayer.completed, onTime: onTime && !prayer.completed }
        : prayer
    ));
  };

  const getTodayStats = () => {
    const completed = todaysPrayers.filter(p => p.completed).length;
    const onTime = todaysPrayers.filter(p => p.onTime).length;
    const percentage = Math.round((completed / todaysPrayers.length) * 100);
    return { completed, onTime, percentage };
  };

  const getWeeklyAverage = () => {
    if (weeklyStats.length === 0) return 0;
    const totalCompleted = weeklyStats.reduce((sum, day) => sum + day.totalCompleted, 0);
    return Math.round((totalCompleted / (weeklyStats.length * 5)) * 100);
  };

  const getCurrentPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerTimes = todaysPrayers.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return { ...prayer, timeInMinutes: hours * 60 + minutes };
    });

    for (let i = 0; i < prayerTimes.length; i++) {
      if (currentTime < prayerTimes[i].timeInMinutes) {
        return prayerTimes[i];
      }
    }
    return prayerTimes[0]; // Next day's Fajr
  };

  const todayStats = getTodayStats();
  const weeklyAverage = getWeeklyAverage();
  const currentPrayer = getCurrentPrayer();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Loading State */}
      {isLoading && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-8 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-lg font-medium">Loading Prayer Tracker...</p>
            <p className="text-sm text-muted-foreground">Fetching prayer times for your location</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Location Notice</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prayer Times Info */}
      {prayerTimes && coordinates && (
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Prayer Times for Today</p>
                <p className="text-sm text-muted-foreground">
                  {prayerTimes.date} • {prayerTimes.hijriDate}
                </p>
              </div>
              <Badge variant="outline">
                <MapPin size={12} className="mr-1" />
                {coordinates.latitude.toFixed(2)}, {coordinates.longitude.toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Only show main content when not loading */}
      {!isLoading && (
        <>
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{todayStats.completed}/5</p>
                <p className="text-sm text-muted-foreground">Today's Prayers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                  <Clock size={24} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{todayStats.onTime}</p>
                <p className="text-sm text-muted-foreground">On Time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{weeklyAverage}%</p>
                <p className="text-sm text-muted-foreground">Weekly Avg</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-2">
                  <Award size={24} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{monthlyStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Prayer Alert */}
          {currentPrayer && (
            <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <currentPrayer.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Next Prayer: {currentPrayer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentPrayer.arabicName} • {currentPrayer.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="animate-pulse">
                    <Clock size={12} className="mr-1" />
                    Upcoming
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Today's Prayer Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Today's Prayer Tracker
                <Badge variant="secondary" className="ml-auto">
                  {todayStats.percentage}% Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysPrayers.map((prayer, index) => {
                const IconComponent = prayer.icon;
                return (
                  <div
                    key={prayer.name}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all",
                      prayer.completed 
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
                        : "bg-secondary/30 border-border/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePrayerCompletion(index)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          prayer.completed 
                            ? "bg-green-500 text-white" 
                            : "border-2 border-muted-foreground hover:border-primary"
                        )}
                      >
                        {prayer.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <IconComponent size={20} className={prayer.color} />
                        <div>
                          <p className="font-medium">{prayer.name}</p>
                          <p className="text-sm text-muted-foreground font-arabic" dir="rtl">
                            {prayer.arabicName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{prayer.time}</p>
                        {prayer.onTime && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            On Time
                          </Badge>
                        )}
                      </div>
                      
                      {!prayer.completed && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePrayerCompletion(index, true)}
                            className="text-xs px-2 py-1 h-7"
                          >
                            On Time
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePrayerCompletion(index, false)}
                            className="text-xs px-2 py-1 h-7"
                          >
                            Late
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weeklyStats.map((day) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                  const dayNumber = date.getDate();
                  const completionRate = (day.totalCompleted / 5) * 100;
                  
                  return (
                    <div key={day.date} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{dayName}</p>
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium mx-auto mb-2",
                        completionRate === 100 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                        completionRate >= 80 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                        completionRate >= 60 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      )}>
                        <span>{dayNumber}</span>
                        <span className="text-xs">{day.totalCompleted}/5</span>
                      </div>
                      <div className="flex justify-center gap-1">
                        {day.prayers.map((prayer, pIndex) => (
                          <div
                            key={pIndex}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              prayer.completed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => {
                    setTodaysPrayers(prev => prev.map(p => ({ ...p, completed: false, onTime: false })));
                  }}
                >
                  <RotateCcw size={20} />
                  <span className="text-xs">Reset Today</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col gap-2">
                  <Plus size={20} />
                  <span className="text-xs">Add Sunnah</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col gap-2">
                  <Star size={20} />
                  <span className="text-xs">Set Goal</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col gap-2">
                  <TrendingUp size={20} />
                  <span className="text-xs">View Stats</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}