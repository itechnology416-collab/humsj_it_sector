import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Loader2,
  QrCode,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface QuickCheckInProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  className?: string;
}

export function QuickCheckIn({ 
  eventId, 
  eventTitle, 
  eventDate, 
  eventLocation,
  className 
}: QuickCheckInProps) {
  const { user } = useAuth();
  const { markAttendance, isMarkingAttendance } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [location, setLocation] = useState<string>('');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.warn('Location access denied:', error);
          setLocation('Location not available');
        }
      );
    }
  }, []);

  const handleCheckIn = async () => {
    if (!user?.id) {
      toast.error('Please log in to check in');
      return;
    }

    try {
      await markAttendance(eventId, user.id, true, {
        checkInTime: new Date().toISOString(),
        location: location || 'Unknown location',
        notes: `Self check-in at ${currentTime.toLocaleString()}`
      });
      
      setIsCheckedIn(true);
      toast.success('Successfully checked in!');
    } catch (error) {
      toast.error('Failed to check in. Please try again.');
    }
  };

  const isEventToday = () => {
    const eventDateObj = new Date(eventDate);
    const today = new Date();
    return eventDateObj.toDateString() === today.toDateString();
  };

  const isEventTime = () => {
    const eventDateObj = new Date(eventDate);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - eventDateObj.getTime());
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff <= 2; // Allow check-in 2 hours before/after event
  };

  const canCheckIn = isEventToday() && isEventTime() && !isCheckedIn;

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Quick Check-In
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Event Info */}
        <div className="text-center space-y-2">
          <h3 className="font-medium">{eventTitle}</h3>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(eventDate).toLocaleString()}
            </div>
            {eventLocation && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {eventLocation}
              </div>
            )}
          </div>
        </div>

        {/* Current Time */}
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-mono font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString()}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          {isCheckedIn ? (
            <Badge className="bg-green-500/20 text-green-600 px-4 py-2">
              <CheckCircle size={16} className="mr-2" />
              Checked In Successfully
            </Badge>
          ) : canCheckIn ? (
            <Badge className="bg-blue-500/20 text-blue-600 px-4 py-2">
              <Smartphone size={16} className="mr-2" />
              Ready to Check In
            </Badge>
          ) : (
            <Badge className="bg-muted text-muted-foreground px-4 py-2">
              <Clock size={16} className="mr-2" />
              {!isEventToday() ? 'Event not today' : 'Outside check-in window'}
            </Badge>
          )}
        </div>

        {/* Check-in Button */}
        <Button
          onClick={handleCheckIn}
          disabled={!canCheckIn || isMarkingAttendance || isCheckedIn}
          className="w-full"
          size="lg"
        >
          {isMarkingAttendance ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Checking In...
            </>
          ) : isCheckedIn ? (
            <>
              <CheckCircle size={20} className="mr-2" />
              Checked In
            </>
          ) : (
            <>
              <Users size={20} className="mr-2" />
              Check In Now
            </>
          )}
        </Button>

        {/* Location Info */}
        {location && (
          <div className="text-xs text-muted-foreground text-center">
            <MapPin size={12} className="inline mr-1" />
            Location: {location}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• Check-in is available 2 hours before/after the event</p>
          <p>• Location services help verify attendance</p>
          <p>• Contact admin if you have issues checking in</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickCheckIn;