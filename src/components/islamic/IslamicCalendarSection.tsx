import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

type IslamicMonth = {
  id: number;
  name: string;
  days: number;
  isCurrent: boolean;
};

type IslamicEvent = {
  id: number;
  title: string;
  date: string; // Format: "MM-DD"
  type: 'islamic' | 'gregorian';
  isHoliday: boolean;
};

const islamicMonths: IslamicMonth[] = [
  { id: 1, name: 'Muharram', days: 30, isCurrent: false },
  { id: 2, name: 'Safar', days: 29, isCurrent: false },
  { id: 3, name: 'Rabi al-Awwal', days: 30, isCurrent: false },
  { id: 4, name: 'Rabi al-Thani', days: 29, isCurrent: true },
  { id: 5, name: 'Jumada al-Awwal', days: 30, isCurrent: false },
  { id: 6, name: 'Jumada al-Thani', days: 29, isCurrent: false },
  { id: 7, name: 'Rajab', days: 30, isCurrent: false },
  { id: 8, name: 'Sha\'ban', days: 29, isCurrent: false },
  { id: 9, name: 'Ramadan', days: 30, isCurrent: false },
  { id: 10, name: 'Shawwal', days: 29, isCurrent: false },
  { id: 11, name: 'Dhu al-Qi\'dah', days: 30, isCurrent: false },
  { id: 12, name: 'Dhu al-Hijjah', days: 29, isCurrent: false },
];

const islamicEvents: IslamicEvent[] = [
  { id: 1, title: 'Islamic New Year', date: '01-01', type: 'islamic', isHoliday: true },
  { id: 2, title: 'Day of Ashura', date: '01-10', type: 'islamic', isHoliday: true },
  { id: 3, title: 'Mawlid al-Nabi', date: '03-12', type: 'islamic', isHoliday: true },
  { id: 4, title: 'Start of Ramadan', date: '09-01', type: 'islamic', isHoliday: true },
  { id: 5, title: 'Laylat al-Qadr', date: '09-27', type: 'islamic', isHoliday: true },
  { id: 6, title: 'Eid al-Fitr', date: '10-01', type: 'islamic', isHoliday: true },
  { id: 7, title: 'Day of Arafah', date: '12-09', type: 'islamic', isHoliday: true },
  { id: 8, title: 'Eid al-Adha', date: '12-10', type: 'islamic', isHoliday: true },
];

export default function IslamicCalendarSection() {
  const [currentDate] = useState(new Date());
  const [currentHijriDate, setCurrentHijriDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState<IslamicMonth>(
    islamicMonths.find(month => month.isCurrent) || islamicMonths[0]
  );
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // Simulate fetching Hijri date
  useEffect(() => {
    // In a real app, you would fetch this from an API
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    // This is a mock conversion - use a proper Hijri date library in production
    const hijriDay = 15;
    const hijriMonth = hijriMonths[3]; // Rabi al-Thani
    const hijriYear = 1446;
    
    setCurrentHijriDate(`${hijriDay} ${hijriMonth}, ${hijriYear} AH`);
    
    // Filter events for the current month
    const monthEvents = islamicEvents.filter(event => {
      return event.date.startsWith(currentMonth.id.toString().padStart(2, '0'));
    });
    setEvents(monthEvents);
  }, [currentMonth]);

  const goToNextMonth = () => {
    const currentIndex = islamicMonths.findIndex(m => m.id === currentMonth.id);
    const nextIndex = (currentIndex + 1) % islamicMonths.length;
    setCurrentMonth(islamicMonths[nextIndex]);
  };

  const goToPrevMonth = () => {
    const currentIndex = islamicMonths.findIndex(m => m.id === currentMonth.id);
    const prevIndex = (currentIndex - 1 + islamicMonths.length) % islamicMonths.length;
    setCurrentMonth(islamicMonths[prevIndex]);
  };

  const renderMonthView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goToPrevMonth} size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{currentMonth.name}</h2>
        <Button variant="outline" onClick={goToNextMonth} size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: currentMonth.days }).map((_, index) => {
          const day = index + 1;
          const isToday = currentMonth.isCurrent && day === 15; // Mocking today's date
          const hasEvent = events.some(event => {
            const eventDay = parseInt(event.date.split('-')[1]);
            return eventDay === day;
          });
          
          return (
            <div 
              key={day} 
              className={`
                p-2 rounded-md text-center h-12 flex flex-col items-center justify-center
                ${isToday ? 'bg-primary text-primary-foreground' : ''}
                ${hasEvent ? 'border border-primary/50' : ''}
              `}
            >
              <span className="text-sm">{day}</span>
              {hasEvent && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderYearView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {islamicMonths.map(month => (
        <Card 
          key={month.id} 
          className={`${month.isCurrent ? 'border-primary' : ''} cursor-pointer hover:bg-accent/50`}
          onClick={() => {
            setCurrentMonth(month);
            setViewMode('month');
          }}
        >
          <CardHeader className="p-4">
            <CardTitle className="text-lg">{month.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{month.days} days</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Islamic Calendar</CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentHijriDate} • {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button 
                variant={viewMode === 'year' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('year')}
              >
                Year
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'month' ? renderMonthView() : renderYearView()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Islamic Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Important dates in the Islamic calendar
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {islamicEvents
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.date} • {event.isHoliday ? 'Public Holiday' : 'Observance'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost">View All Events</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
