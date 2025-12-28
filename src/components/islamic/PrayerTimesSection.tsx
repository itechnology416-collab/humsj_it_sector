import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MapPin, Clock, Settings, Bell, BellOff, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
}

export default function PrayerTimesSection() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('Mecca, Saudi Arabia');
  const [hijriDate, setHijriDate] = useState('15 Jumada al-awwal 1446');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState('Dhuhr');
  const [timeRemaining, setTimeRemaining] = useState('2h 15m');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Initialize prayer times
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch from an API like:
        // const response = await fetch(`/api/prayer-times?location=${encodeURIComponent(location)}`);
        // const data = await response.json();
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPrayerTimes([
          { name: 'Fajr', time: '05:30', isNext: false },
          { name: 'Sunrise', time: '06:45', isNext: false },
          { name: 'Dhuhr', time: '12:30', isNext: true },
          { name: 'Asr', time: '15:45', isNext: false },
          { name: 'Maghrib', time: '18:15', isNext: false },
          { name: 'Isha', time: '19:45', isNext: false },
        ]);
        
      } catch (err) {
        console.error('Error loading prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load prayer times',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPrayerTimes();
  }, [location, toast]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Unable to load prayer times</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-muted-foreground">Loading prayer times...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant={notificationsEnabled ? "default" : "outline"} 
            size="sm" 
            className="gap-2"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? (
              <>
                <BellOff className="h-4 w-4" />
                Disable Notifications
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Enable Notifications
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Prayer Times</CardTitle>
            <p className="text-sm text-muted-foreground">{hijriDate}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prayerTimes.map((prayer) => (
                <div 
                  key={prayer.name}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    prayer.isNext 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted/50 hover:bg-muted/70'
                  }`}
                >
                  <span className="font-medium">{prayer.name}</span>
                  <div className="flex items-center space-x-2">
                    {prayer.isNext && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Next
                      </span>
                    )}
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{prayer.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Prayer</CardTitle>
            <p className="text-sm text-muted-foreground">Time remaining</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-56">
            <div className="text-3xl font-medium text-muted-foreground mb-1">Next Prayer</div>
            <div className="text-5xl font-bold mb-2 text-primary">{nextPrayer}</div>
            <div className="text-2xl font-mono mb-6">{timeRemaining}</div>
            <div className="w-full px-6">
              <Button className="w-full" size="lg">
                View Qibla
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t p-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>Today is {hijriDate}</p>
              <p className="text-xs mt-1">Location: {location}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
