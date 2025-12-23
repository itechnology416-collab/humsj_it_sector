import { useState, useEffect } from 'react';
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
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DhikrCounterProps {
  className?: string;
}

interface DhikrType {
  id: string;
  name: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  target: number;
  reward: string;
  category: 'tasbih' | 'istighfar' | 'salawat' | 'dua' | 'quran';
}

const DHIKR_TYPES: DhikrType[] = [
  {
    id: 'subhanallah',
    name: 'SubhanAllah',
    arabicText: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhan Allah',
    translation: 'Glory be to Allah',
    target: 33,
    reward: 'Each tasbih is rewarded',
    category: 'tasbih'
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    target: 33,
    reward: 'Fills the scales of good deeds',
    category: 'tasbih'
  },
  {
    id: 'allahu-akbar',
    name: 'Allahu Akbar',
    arabicText: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    target: 34,
    reward: 'Beloved to Ar-Rahman',
    category: 'tasbih'
  },
  {
    id: 'la-hawla',
    name: 'La Hawla wa la Quwwata',
    arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'There is no power except with Allah',
    target: 100,
    reward: 'Treasure from Paradise',
    category: 'dua'
  },
  {
    id: 'istighfar',
    name: 'Istighfar',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    target: 100,
    reward: 'Opens doors of mercy',
    category: 'istighfar'
  },
  {
    id: 'salawat',
    name: 'Salawat on Prophet ﷺ',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    translation: 'O Allah, send blessings upon Muhammad',
    target: 100,
    reward: 'Allah sends 10 blessings in return',
    category: 'salawat'
  }
];

export default function DhikrCounter({ className }: DhikrCounterProps) {
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_TYPES[0]);
  const [count, setCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(selectedDhikr.target);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`dhikr-${selectedDhikr.id}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setCount(data.count || 0);
      setTotalCount(data.totalCount || 0);
      setStreak(data.streak || 0);
      setDailyGoal(data.dailyGoal || selectedDhikr.target);
    } else {
      setCount(0);
      setDailyGoal(selectedDhikr.target);
    }
  }, [selectedDhikr]);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      count,
      totalCount,
      streak,
      dailyGoal,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`dhikr-${selectedDhikr.id}`, JSON.stringify(data));
  }, [count, totalCount, streak, dailyGoal, selectedDhikr.id]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount(prev => prev + 1);

    // Sound feedback
    if (soundEnabled) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = newCount % dailyGoal === 0 ? 800 : 400;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Vibration feedback
    if (vibrationEnabled && 'vibrate' in navigator) {
      if (newCount % dailyGoal === 0) {
        navigator.vibrate([100, 50, 100]); // Goal reached pattern
      } else if (newCount % 10 === 0) {
        navigator.vibrate(50); // Every 10th count
      } else {
        navigator.vibrate(20); // Regular count
      }
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
      setTotalCount(prev => Math.max(0, prev - 1));
    }
  };

  const reset = () => {
    setCount(0);
  };

  const resetAll = () => {
    setCount(0);
    setTotalCount(0);
    setStreak(0);
    localStorage.removeItem(`dhikr-${selectedDhikr.id}`);
  };

  const progress = Math.min((count / dailyGoal) * 100, 100);
  const isGoalReached = count >= dailyGoal;

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
              const dhikr = DHIKR_TYPES.find(d => d.id === value);
              if (dhikr) setSelectedDhikr(dhikr);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DHIKR_TYPES.map((dhikr) => (
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
            {selectedDhikr.arabicText}
          </h2>
          
          <p className="text-lg font-semibold mb-1">{selectedDhikr.transliteration}</p>
          <p className="text-sm text-muted-foreground mb-4">{selectedDhikr.translation}</p>
          
          <Badge variant="outline" className="text-xs">
            {selectedDhikr.reward}
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
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
              <Trophy size={20} className="text-amber-500" />
            </div>
            <p className="text-2xl font-bold">{streak}</p>
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
                {soundEnabled ? <Volume2 size={20} className="text-blue-500" /> : <VolumeX size={20} className="text-blue-500" />}
              </div>
              <div>
                <p className="font-medium">Sound Feedback</p>
                <p className="text-sm text-muted-foreground">Audio confirmation for each count</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? "bg-primary/10 border-primary/30" : ""}
            >
              {soundEnabled ? "On" : "Off"}
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
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={vibrationEnabled ? "bg-primary/10 border-primary/30" : ""}
            >
              {vibrationEnabled ? "On" : "Off"}
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