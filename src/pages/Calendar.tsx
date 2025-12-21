import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Plus,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'friday' | 'dars' | 'workshop' | 'special' | 'meeting' | 'conference';
  location: string;
  attendees?: number;
  status: 'active' | 'cancelled' | 'completed' | 'draft';
}

const eventTypeColors = {
  friday: "bg-green-500/20 text-green-600 border-green-500/30",
  dars: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  workshop: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  special: "bg-primary/20 text-primary border-primary/30",
  meeting: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  conference: "bg-pink-500/20 text-pink-600 border-pink-500/30"
};

const eventTypeLabels = {
  friday: "Friday Prayer",
  dars: "Dars/Halaqa",
  workshop: "Workshop",
  special: "Special Event",
  meeting: "Meeting",
  conference: "Conference"
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { events } = useEvents();
  const { isAdmin } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<string>('all');

  // Convert events to calendar format
  const calendarEvents: CalendarEvent[] = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    type: event.type,
    location: event.location,
    attendees: event.current_attendees,
    status: event.status
  }));

  const filteredEvents = calendarEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <PageLayout 
      title="Calendar" 
      subtitle="View and manage all events and activities"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="border-border/50 hover:border-primary"
              >
                <ChevronLeft size={16} />
              </Button>
              <h2 className="text-xl font-display tracking-wide min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="border-border/50 hover:border-primary"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="border-border/50 hover:border-primary"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-border/50 overflow-hidden">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-all capitalize",
                    viewMode === mode
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-card border border-border/50 text-sm outline-none cursor-pointer"
            >
              <option value="all">All Events</option>
              <option value="friday">Friday Prayer</option>
              <option value="dars">Dars/Halaqa</option>
              <option value="workshop">Workshops</option>
              <option value="special">Special Events</option>
              <option value="meeting">Meetings</option>
              <option value="conference">Conferences</option>
            </select>

            {isAdmin && (
              <Button
                onClick={() => navigate('/events')}
                className="bg-primary hover:bg-primary/90 shadow-red"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Add Event
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl shadow-soft border border-border/30 overflow-hidden">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b border-border/30">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center text-sm font-semibold text-muted-foreground bg-muted/30"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((date, index) => (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[120px] p-2 border-r border-b border-border/20 cursor-pointer transition-colors",
                      date ? "hover:bg-muted/30" : "",
                      date && isToday(date) ? "bg-primary/5 border-primary/20" : "",
                      date && isSelected(date) ? "bg-primary/10 border-primary/30" : ""
                    )}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                          isToday(date) ? "bg-primary text-primary-foreground" : "",
                          isSelected(date) && !isToday(date) ? "bg-muted text-foreground" : ""
                        )}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getEventsForDate(date).slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "text-xs px-2 py-1 rounded border text-center truncate",
                                eventTypeColors[event.type]
                              )}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {getEventsForDate(date).length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{getEventsForDate(date).length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            <div className="bg-card rounded-2xl shadow-soft border border-border/30 p-6">
              <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                <CalendarIcon size={20} className="text-primary" />
                {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
              </h3>
              
              {selectedDate ? (
                selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/events`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <Badge className={cn("text-xs", eventTypeColors[event.type])}>
                            {eventTypeLabels[event.type]}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={12} />
                            <span>{event.location}</span>
                          </div>
                          {event.attendees && (
                            <div className="flex items-center gap-2">
                              <Users size={12} />
                              <span>{event.attendees} attendees</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No events scheduled for this date.</p>
                )
              ) : (
                <p className="text-muted-foreground text-sm">Click on a date to view events.</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl shadow-soft border border-border/30 p-6">
              <h3 className="font-display text-lg mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Events</span>
                  <span className="font-semibold">{filteredEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Friday Prayers</span>
                  <span className="font-semibold">
                    {filteredEvents.filter(e => e.type === 'friday').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Workshops</span>
                  <span className="font-semibold">
                    {filteredEvents.filter(e => e.type === 'workshop').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Special Events</span>
                  <span className="font-semibold">
                    {filteredEvents.filter(e => e.type === 'special').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl shadow-soft border border-border/30 p-6">
              <h3 className="font-display text-lg mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/events')}
                >
                  <CalendarIcon size={16} className="mr-2" />
                  View All Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/prayer-times')}
                >
                  <Clock size={16} className="mr-2" />
                  Prayer Times
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate('/analytics')}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    View Analytics
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}