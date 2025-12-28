import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Plus, Minus, Volume2, VolumeX, Share2 } from 'lucide-react';

type Dhikr = {
  id: number;
  name: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  target: number;
  benefits?: string;
};

export default function DhikrCounterSection() {
  const [activeDhikr, setActiveDhikr] = useState<Dhikr | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const dhikrList: Dhikr[] = [
    {
      id: 1,
      name: 'SubhanAllah',
      arabic: 'سُبْحَانَ اللَّهِ',
      transliteration: 'SubhanAllah',
      translation: 'Glory be to Allah',
      count: 0,
      target: 33,
      benefits: 'A tree will be planted for you in Jannah',
    },
    {
      id: 2,
      name: 'Alhamdulillah',
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Alhamdulillah',
      translation: 'All praise is for Allah',
      count: 0,
      target: 33,
      benefits: 'Scales will be heavy on the Day of Judgment',
    },
    {
      id: 3,
      name: 'Allahu Akbar',
      arabic: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      translation: 'Allah is the Greatest',
      count: 0,
      target: 34,
      benefits: 'Your sins will be forgiven even if they are like the foam of the sea',
    },
  ];

  const [dhikrs, setDhikrs] = useState<Dhikr[]>(() => {
    const saved = localStorage.getItem('dhikrCounts');
    return saved ? JSON.parse(saved) : dhikrList;
  });

  // Save to localStorage whenever counts change
  useEffect(() => {
    localStorage.setItem('dhikrCounts', JSON.stringify(dhikrs));
  }, [dhikrs]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCount = (id: number, increment: number) => {
    setDhikrs(dhikrs.map(dhikr => 
      dhikr.id === id 
        ? { ...dhikr, count: Math.max(0, dhikr.count + increment) } 
        : dhikr
    ));

    // Haptic feedback
    if (increment > 0 && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const resetCount = (id: number) => {
    setDhikrs(dhikrs.map(dhikr => 
      dhikr.id === id ? { ...dhikr, count: 0 } : dhikr
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = (dhikr: Dhikr) => {
    setActiveDhikr(dhikr);
    setElapsedTime(0);
    setIsRunning(true);
  };

  const endSession = () => {
    setIsRunning(false);
    setActiveDhikr(null);
  };

  if (activeDhikr) {
    const currentDhikr = dhikrs.find(d => d.id === activeDhikr.id) || activeDhikr;
    const progress = Math.min(100, (currentDhikr.count / currentDhikr.target) * 100);

    return (
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={endSession} size="sm">
              ← Back
            </Button>
            <div className="text-sm text-muted-foreground">
              {formatTime(elapsedTime)}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          <CardTitle className="text-3xl mt-4">{currentDhikr.arabic}</CardTitle>
          <p className="text-lg text-muted-foreground">{currentDhikr.transliteration}</p>
          <p className="text-sm">{currentDhikr.translation}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-6xl font-bold my-8">{currentDhikr.count}</div>
          
          <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {currentDhikr.count} of {currentDhikr.target} ({Math.round(progress)}%)
          </p>
          
          <div className="flex justify-center space-x-4 pt-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-14 w-14"
              onClick={() => handleCount(currentDhikr.id, -1)}
              disabled={currentDhikr.count <= 0}
            >
              <Minus className="h-6 w-6" />
            </Button>
            
            <Button 
              className="h-14 w-14 text-xl"
              onClick={() => handleCount(currentDhikr.id, 1)}
            >
              +
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-14 w-14"
              onClick={() => resetCount(currentDhikr.id)}
              disabled={currentDhikr.count === 0}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2">
          <p className="text-sm text-muted-foreground max-w-md">
            <span className="font-medium">Benefit:</span> {currentDhikr.benefits}
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dhikrs.map((dhikr) => (
          <Card 
            key={dhikr.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => startSession(dhikr)}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-center">{dhikr.arabic}</CardTitle>
              <p className="text-center text-muted-foreground">{dhikr.name}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold mb-2">{dhikr.count}</div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(100, (dhikr.count / dhikr.target) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {dhikr.count} of {dhikr.target}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="text-sm text-muted-foreground">
          Total Dhikr Today: {dhikrs.reduce((sum, d) => sum + d.count, 0)}
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Progress
        </Button>
      </div>
    </div>
  );
}
