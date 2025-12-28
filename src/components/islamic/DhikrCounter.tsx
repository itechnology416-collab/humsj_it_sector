import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Target,
  Trophy,
  Clock,
  BookOpen,
  Heart,
  Star,
  Zap,
  Volume2,
  VolumeX,
  Settings,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dhikrApi, DhikrType, DhikrSession, DhikrSettings, DhikrStreak, DhikrStatistics } from '@/services/dhikrApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DhikrCounterProps {
  className?: string;
}

export default function DhikrCounter({ className }: DhikrCounterProps) {
  const { user } = useAuth();
  
  // State management
  const [dhikrTypes, setDhikrTypes] = useState<DhikrType[]>([]);
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrType | null>(null);
  const [currentSession, setCurrentSession] = useState<DhikrSession | null>(null);
  const [settings, setSettings] = useState<DhikrSettings | null>(null);
  const [streaks, setStreaks] = useState<DhikrStreak[]>([]);
  const [statistics, setStatistics] = useState<DhikrStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Local state for real-time updates
  const [count, setCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(33);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user, loadInitialData]);

  // Update session when count changes
  useEffect(() => {
    if (selectedDhikr && count !== (currentSession?.count || 0)) {
      const timeoutId = setTimeout(() => {
        updateSession();
      }, 1000); // Debounce updates

      return () => clearTimeout(timeoutId);
    }
  }, [count, selectedDhikr, currentSession?.count, updateSession]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load dhikr types
      const types = await dhikrApi.getDhikrTypes();
      setDhikrTypes(types);
      
      // Load user settings
      const userSettings = await dhikrApi.getUserSettings();
      setSettings(userSettings);
      
      // Set initial dhikr type
      const initialDhikr = userSettings.preferred_dhikr_type || types[0];
      if (initialDhikr) {
        await selectDhikrType(initialDhikr);
      }
      
      // Load streaks and statistics
      const [userStreaks, userStats] = await Promise.all([
        dhikrApi.getUserStreaks(),
        dhikrApi.getUserStatistics()
      ]);
      
      setStreaks(userStreaks);
      setStatistics(userStats);
      
    } catch (error) {
      console.error('Error loading dhikr data:', error);
      toast.error('Failed to load dhikr data');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectDhikrType = async (dhikr: DhikrType) => {
    try {
      setSelectedDhikr(dhikr);
      setDailyGoal(dhikr.default_target);
      
      // Load today's session for this dhikr type
      const session = await dhikrApi.getTodaySession(dhikr.id);
      setCurrentSession(session);
      setCount(session?.count || 0);
      
      if (session) {
        setDailyGoal(session.target);
      }
    } catch (error) {
      console.error('Error selecting dhikr type:', error);
      toast.error('Failed to load dhikr session');
    }
  };

  const updateSession = useCallback(async () => {
    if (!selectedDhikr || updating) return;
    
    try {
      setUpdating(true);
      
      const sessionData = {
        dhikr_type_id: selectedDhikr.id,
        count: count,
        target: dailyGoal,
        session_duration_minutes: Math.floor((Date.now() - (currentSession?.created_at ? new Date(currentSession.created_at).getTime() : Date.now())) / 60000)
      };
      
      const updatedSession = await dhikrApi.createOrUpdateSession(sessionData);
      setCurrentSession(updatedSession);
      
      // Refresh streaks and statistics
      const [userStreaks, userStats] = await Promise.all([
        dhikrApi.getUserStreaks(),
        dhikrApi.getUserStatistics()
      ]);
      
      setStreaks(userStreaks);
      setStatistics(userStats);
      
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to save progress');
    } finally {
      setUpdating(false);
    }
  }, [selectedDhikr, updating, count, dailyGoal, currentSession?.created_at]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);

    // Sound feedback
    if (settings?.sound_enabled) {
      playSound(newCount % dailyGoal === 0 ? 800 : 400);
    }

    // Vibration feedback
    if (settings?.vibration_enabled && 'vibrate' in navigator) {
      if (newCount % dailyGoal === 0) {
        navigator.vibrate([100, 50, 100]); // Goal reached pattern
      } else if (newCount % 10 === 0) {
        navigator.vibrate(50); // Every 10th count
      } else {
        navigator.vibrate(20); // Regular count
      }
    }

    // Show achievement toast for goal completion
    if (newCount === dailyGoal) {
      toast.success('🎉 Daily goal completed! Barakallahu feeki!');
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const resetAll = async () => {
    if (!selectedDhikr) return;
    
    try {
      setCount(0);
      await dhikrApi.createOrUpdateSession({
        dhikr_type_id: selectedDhikr.id,
        count: 0,
        target: dailyGoal
      });
      
      toast.success('Counter reset successfully');
    } catch (error) {
      console.error('Error resetting counter:', error);
      toast.error('Failed to reset counter');
    }
  };

  const updateSettings = async (newSettings: Partial<DhikrSettings>) => {
    try {
      const updatedSettings = await dhikrApi.updateUserSettings(newSettings);
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const playSound = (frequency: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const progress = Math.min((count / dailyGoal) * 100, 100);
  const isGoalReached = count >= dailyGoal;
  
  // Get current streak for selected dhikr
  const currentStreak = selectedDhikr ? streaks.find(s => s.dhikr_type_id === selectedDhikr.id) : null;
  
  // Get statistics for selected dhikr
  const currentStats = selectedDhikr ? statistics.find(s => s.dhikr_type_id === selectedDhikr.id) : null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tasbih': return Heart;
      case 'istighfar': return Star;
      case 'salawat': return BookOpen;
      case 'dua': return Target;
      case 'quran': return BookOpen;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasbih': return 'text-green-500 bg-green-500/20';
      case 'istighfar': return 'text-blue-500 bg-blue-500/20';
      case 'salawat': return 'text-purple-500 bg-purple-500/20';
      case 'dua': return 'text-amber-500 bg-amber-500/20';
      case 'quran': return 'text-red-500 bg-red-500/20';
      default: return 'text-green-500 bg-green-500/20';
    }
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dhikr data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedDhikr) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No dhikr types available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(selectedDhikr.category);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display">Digital Tasbih</h3>
              <p className="text-sm text-muted-foreground">Keep track of your dhikr</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Dhikr Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Dhikr</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedDhikr.id} 
            onValueChange={(value) => {
              const dhikr = dhikrTypes.find(d => d.id === value);
              if (dhikr) selectDhikrType(dhikr);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dhikrTypes.map((dhikr) => (
                <SelectItem key={dhikr.id} value={dhikr.id}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getCategoryColor(dhikr.category))}>
                      {React.createElement(getCategoryIcon(dhikr.category), { size: 16 })}
                    </div>
                    <div>
                      <p className="font-medium">{dhikr.name}</p>
                      <p className="text-xs text-muted-foreground">{dhikr.translation}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Current Dhikr Display */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardContent className="relative p-8 text-center">
          <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4", getCategoryColor(selectedDhikr.category))}>
            <CategoryIcon size={32} />
          </div>
          
          <h2 className="text-3xl font-arabic text-primary mb-2" dir="rtl">
            {selectedDhikr.arabic_text}
          </h2>
          
          <p className="text-lg font-semibold mb-1">{selectedDhikr.transliteration}</p>
          <p className="text-sm text-muted-foreground mb-4">{selectedDhikr.translation}</p>
          
          <Badge variant="outline" className="text-xs">
            {selectedDhikr.reward_description}
          </Badge>
        </CardContent>
      </Card>

      {/* Counter Display */}
      <Card>
        <CardContent className="p-8 text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted-foreground/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={cn(
                  "transition-all duration-300",
                  isGoalReached ? "text-green-500" : "text-primary"
                )}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Count Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-4xl font-display font-bold transition-colors",
                isGoalReached ? "text-green-500" : "text-primary"
              )}>
                {count}
              </span>
              <span className="text-sm text-muted-foreground">
                of {dailyGoal}
              </span>
              {isGoalReached && (
                <div className="flex items-center gap-1 mt-2">
                  <Trophy size={16} className="text-green-500" />
                  <span className="text-xs text-green-500 font-medium">Goal Reached!</span>
                </div>
              )}
            </div>
          </div>

          {/* Counter Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={decrement}
              disabled={count === 0}
              className="w-16 h-16 rounded-full p-0"
            >
              <Minus size={24} />
            </Button>

            <Button
              onClick={increment}
              size="lg"
              className="w-20 h-20 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-lg text-2xl font-bold"
            >
              <Plus size={32} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={reset}
              className="w-16 h-16 rounded-full p-0"
            >
              <RotateCcw size={24} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2 mb-4">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isGoalReached ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}% of daily goal completed
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Target size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
              <Zap size={20} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold">{currentStats?.total_count || 0}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
              <Trophy size={20} className="text-amber-500" />
            </div>
            <p className="text-2xl font-bold">{currentStreak?.current_streak || 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              <Clock size={20} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{dailyGoal}</p>
            <p className="text-xs text-muted-foreground">Daily Goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                {settings?.sound_enabled ? <Volume2 size={20} className="text-blue-500" /> : <VolumeX size={20} className="text-blue-500" />}
              </div>
              <div>
                <p className="font-medium">Sound Feedback</p>
                <p className="text-sm text-muted-foreground">Audio confirmation for each count</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ sound_enabled: !settings?.sound_enabled })}
              className={settings?.sound_enabled ? "bg-primary/10 border-primary/30" : ""}
            >
              {settings?.sound_enabled ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Vibration</p>
                <p className="text-sm text-muted-foreground">Haptic feedback for counting</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ vibration_enabled: !settings?.vibration_enabled })}
              className={settings?.vibration_enabled ? "bg-primary/10 border-primary/30" : ""}
            >
              {settings?.vibration_enabled ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <RotateCcw size={20} className="text-red-500" />
              </div>
              <div>
                <p className="font-medium">Reset All Data</p>
                <p className="text-sm text-muted-foreground">Clear all counts and statistics</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={resetAll}
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}