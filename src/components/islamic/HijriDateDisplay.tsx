import { useState, useEffect } from 'react';
import { Calendar, Moon, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HijriDateDisplayProps {
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
  showGregorian?: boolean;
}

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameArabic: string;
  weekday: string;
  weekdayArabic: string;
}

interface IslamicEvent {
  name: string;
  arabicName: string;
  date: string;
  type: 'major' | 'minor' | 'monthly';
  description: string;
}

const HIJRI_MONTHS = [
  { name: 'Muharram', arabic: 'مُحَرَّم' },
  { name: 'Safar', arabic: 'صَفَر' },
  { name: 'Rabi\' al-Awwal', arabic: 'رَبِيع الأَوَّل' },
  { name: 'Rabi\' al-Thani', arabic: 'رَبِيع الثَّانِي' },
  { name: 'Jumada al-Awwal', arabic: 'جُمَادَىٰ الأُولَىٰ' },
  { name: 'Jumada al-Thani', arabic: 'جُمَادَىٰ الثَّانِيَة' },
  { name: 'Rajab', arabic: 'رَجَب' },
  { name: 'Sha\'ban', arabic: 'شَعْبَان' },
  { name: 'Ramadan', arabic: 'رَمَضَان' },
  { name: 'Shawwal', arabic: 'شَوَّال' },
  { name: 'Dhu al-Qi\'dah', arabic: 'ذُو القِعْدَة' },
  { name: 'Dhu al-Hijjah', arabic: 'ذُو الحِجَّة' }
];

const WEEKDAYS = [
  { name: 'Sunday', arabic: 'الأَحَد' },
  { name: 'Monday', arabic: 'الإِثْنَيْن' },
  { name: 'Tuesday', arabic: 'الثُّلَاثَاء' },
  { name: 'Wednesday', arabic: 'الأَرْبِعَاء' },
  { name: 'Thursday', arabic: 'الخَمِيس' },
  { name: 'Friday', arabic: 'الجُمُعَة' },
  { name: 'Saturday', arabic: 'السَّبْت' }
];

// Mock Islamic events (in a real app, this would come from an API)
const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    name: 'Laylat al-Qadr',
    arabicName: 'لَيْلَة القَدْر',
    date: '27 Ramadan',
    type: 'major',
    description: 'The Night of Power'
  },
  {
    name: 'Eid al-Fitr',
    arabicName: 'عِيد الفِطْر',
    date: '1 Shawwal',
    type: 'major',
    description: 'Festival of Breaking the Fast'
  },
  {
    name: 'Day of Arafah',
    arabicName: 'يَوْم عَرَفَة',
    date: '9 Dhu al-Hijjah',
    type: 'major',
    description: 'The Day of Arafah'
  },
  {
    name: 'Eid al-Adha',
    arabicName: 'عِيد الأَضْحَى',
    date: '10 Dhu al-Hijjah',
    type: 'major',
    description: 'Festival of Sacrifice'
  },
  {
    name: 'Ashura',
    arabicName: 'عَاشُورَاء',
    date: '10 Muharram',
    type: 'major',
    description: 'Day of Ashura'
  },
  {
    name: 'Mawlid an-Nabi',
    arabicName: 'مَوْلِد النَّبِيّ',
    date: '12 Rabi\' al-Awwal',
    type: 'minor',
    description: 'Birth of Prophet Muhammad ﷺ'
  }
];

export default function HijriDateDisplay({ 
  className, 
  variant = 'full', 
  showGregorian = true 
}: HijriDateDisplayProps) {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [gregorianDate, setGregorianDate] = useState(new Date());
  const [upcomingEvents, setUpcomingEvents] = useState<IslamicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Gregorian to Hijri (simplified calculation)
  const convertToHijri = (gregorianDate: Date): HijriDate => {
    // This is a simplified conversion. In a real app, use a proper Hijri calendar library
    const gregorianYear = gregorianDate.getFullYear();
    const gregorianMonth = gregorianDate.getMonth() + 1;
    const gregorianDay = gregorianDate.getDate();
    
    // Approximate conversion (not accurate, use proper library in production)
    const hijriYear = Math.floor(gregorianYear - 621.5643);
    const hijriMonth = Math.floor(Math.random() * 12) + 1; // Mock calculation
    const hijriDay = Math.floor(Math.random() * 29) + 1; // Mock calculation
    
    const weekdayIndex = gregorianDate.getDay();
    
    return {
      day: hijriDay,
      month: hijriMonth,
      year: hijriYear,
      monthName: HIJRI_MONTHS[hijriMonth - 1].name,
      monthNameArabic: HIJRI_MONTHS[hijriMonth - 1].arabic,
      weekday: WEEKDAYS[weekdayIndex].name,
      weekdayArabic: WEEKDAYS[weekdayIndex].arabic
    };
  };

  useEffect(() => {
    const now = new Date();
    setGregorianDate(now);
    setHijriDate(convertToHijri(now));
    
    // Mock upcoming events
    setUpcomingEvents(ISLAMIC_EVENTS.slice(0, 3));
    setIsLoading(false);

    // Update every minute
    const interval = setInterval(() => {
      const newDate = new Date();
      setGregorianDate(newDate);
      setHijriDate(convertToHijri(newDate));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !hijriDate) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Moon size={16} className="text-primary" />
        <span className="font-arabic" dir="rtl">
          {hijriDate.day} {hijriDate.monthNameArabic} {hijriDate.year}
        </span>
        <span className="text-muted-foreground">AH</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {hijriDate.day} {hijriDate.monthName} {hijriDate.year} AH
              </p>
              <p className="text-xs text-muted-foreground font-arabic" dir="rtl">
                {hijriDate.day} {hijriDate.monthNameArabic} {hijriDate.year}
              </p>
              {showGregorian && (
                <p className="text-xs text-muted-foreground">
                  {gregorianDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Date Display */}
      <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon size={20} className="text-primary" />
            Hijri Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hijri Date */}
          <div className="text-center">
            <p className="text-3xl font-arabic text-primary mb-2" dir="rtl">
              {hijriDate.weekdayArabic}
            </p>
            <p className="text-4xl font-display font-bold mb-2">
              {hijriDate.day}
            </p>
            <p className="text-xl font-arabic text-primary mb-1" dir="rtl">
              {hijriDate.monthNameArabic}
            </p>
            <p className="text-lg font-medium text-muted-foreground mb-2">
              {hijriDate.monthName}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-display font-bold">{hijriDate.year}</span>
              <Badge variant="outline" className="text-xs">AH</Badge>
            </div>
          </div>

          {/* Gregorian Date */}
          {showGregorian && (
            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground mb-1">Gregorian Date</p>
              <p className="font-medium">
                {gregorianDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Time */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Clock size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Current Time</p>
                <p className="text-sm text-muted-foreground">Local time</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">
                {gregorianDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {gregorianDate.toLocaleTimeString('en-US', {
                  hour12: true
                }).split(' ')[1]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Islamic Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star size={18} className="text-primary" />
            Upcoming Islamic Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  event.type === 'major' ? "bg-primary/20 text-primary" :
                  event.type === 'minor' ? "bg-blue-500/20 text-blue-500" :
                  "bg-green-500/20 text-green-500"
                )}>
                  <Star size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs font-arabic text-muted-foreground" dir="rtl">
                        {event.arabicName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs flex-shrink-0",
                        event.type === 'major' && "border-primary/30 text-primary"
                      )}
                    >
                      {event.date}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Islamic Calendar Info */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
              <Moon size={24} className="text-primary" />
            </div>
            <h4 className="font-medium">Islamic Calendar</h4>
            <p className="text-sm text-muted-foreground">
              The Islamic calendar is a lunar calendar consisting of 12 months in a year of 354 or 355 days.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Lunar Year</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>354-355 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>12 Months</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}