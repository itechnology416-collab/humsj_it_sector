import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Calendar as CalendarIcon, 
  Moon, 
  Sun,
  Star,
  Clock,
  MapPin,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Share2,
  Bookmark,
  QrCode,
  Users,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  location: string;
  date: string;
}

interface IslamicEvent {
  id: string;
  title: string;
  date: string;
  hijriDate: string;
  type: 'religious' | 'historical' | 'community';
  category: 'major' | 'minor' | 'local';
  description: string;
  significance: string;
  observances: string[];
  location?: string;
  isRecurring: boolean;
  nextOccurrence?: string;
  attendees?: number;
  maxAttendees?: number;
  qrCode?: string;
  registrationRequired?: boolean;
}

interface HijriMonth {
  number: number;
  name: string;
  arabicName: string;
  days: number;
  significance?: string;
}

const hijriMonths: HijriMonth[] = [
  { number: 1, name: "Muharram", arabicName: "مُحَرَّم", days: 30, significance: "Sacred month, Islamic New Year" },
  { number: 2, name: "Safar", arabicName: "صَفَر", days: 29, significance: "Month of departure" },
  { number: 3, name: "Rabi' al-Awwal", arabicName: "رَبِيع ٱلْأَوَّل", days: 30, significance: "Birth month of Prophet Muhammad (PBUH)" },
  { number: 4, name: "Rabi' al-Thani", arabicName: "رَبِيع ٱلثَّانِي", days: 29, significance: "Second spring month" },
  { number: 5, name: "Jumada al-Awwal", arabicName: "جُمَادَىٰ ٱلْأُولَىٰ", days: 30, significance: "First month of dryness" },
  { number: 6, name: "Jumada al-Thani", arabicName: "جُمَادَىٰ ٱلثَّانِيَة", days: 29, significance: "Second month of dryness" },
  { number: 7, name: "Rajab", arabicName: "رَجَب", days: 30, significance: "Sacred month, month of respect" },
  { number: 8, name: "Sha'ban", arabicName: "شَعْبَان", days: 29, significance: "Month of separation" },
  { number: 9, name: "Ramadan", arabicName: "رَمَضَان", days: 30, significance: "Holy month of fasting" },
  { number: 10, name: "Shawwal", arabicName: "شَوَّال", days: 29, significance: "Month of hunting, Eid al-Fitr" },
  { number: 11, name: "Dhu al-Qi'dah", arabicName: "ذُو ٱلْقِعْدَة", days: 30, significance: "Sacred month, month of rest" },
  { number: 12, name: "Dhu al-Hijjah", arabicName: "ذُو ٱلْحِجَّة", days: 29, significance: "Sacred month, month of Hajj, Eid al-Adha" }
];

const mockEvents: IslamicEvent[] = [
  {
    id: '1',
    title: 'Islamic New Year (Muharram 1)',
    date: '2024-07-07',
    hijriDate: '1 Muharram 1446',
    type: 'religious',
    category: 'major',
    description: 'The beginning of the Islamic lunar calendar year',
    significance: 'Marks the migration (Hijra) of Prophet Muhammad from Mecca to Medina',
    observances: ['Reflection on the Hijra', 'Community gatherings', 'Special prayers'],
    isRecurring: true,
    nextOccurrence: '2025-06-26',
    location: 'HUMSJ Main Hall',
    attendees: 245,
    maxAttendees: 300,
    qrCode: 'QR_MUHARRAM_2024',
    registrationRequired: false
  },
  {
    id: '2',
    title: 'Day of Ashura',
    date: '2024-07-16',
    hijriDate: '10 Muharram 1446',
    type: 'religious',
    category: 'major',
    description: 'The 10th day of Muharram, a day of great significance',
    significance: 'Day when Moses and the Israelites were saved from Pharaoh, recommended fasting day',
    observances: ['Voluntary fasting', 'Increased worship', 'Charity giving', 'Historical reflection'],
    isRecurring: true,
    nextOccurrence: '2025-07-05',
    location: 'HUMSJ Main Hall',
    attendees: 189,
    maxAttendees: 250,
    qrCode: 'QR_ASHURA_2024',
    registrationRequired: false
  },
  {
    id: '3',
    title: 'Mawlid an-Nabi',
    date: '2024-09-15',
    hijriDate: '12 Rabi\' al-Awwal 1446',
    type: 'religious',
    category: 'major',
    description: 'Celebration of the birth of Prophet Muhammad (PBUH)',
    significance: 'Commemorating the birth of the final messenger of Allah',
    observances: ['Recitation of Quran', 'Seerah study', 'Community celebrations', 'Charitable acts'],
    isRecurring: true,
    nextOccurrence: '2025-09-04',
    location: 'HUMSJ Main Hall',
    attendees: 312,
    maxAttendees: 400,
    qrCode: 'QR_MAWLID_2024',
    registrationRequired: true
  },
  {
    id: '4',
    title: 'Isra and Mi\'raj',
    date: '2025-01-27',
    hijriDate: '27 Rajab 1446',
    type: 'religious',
    category: 'major',
    description: 'The Night Journey and Ascension of Prophet Muhammad',
    significance: 'Miraculous journey from Mecca to Jerusalem and ascension to heavens',
    observances: ['Special prayers', 'Quran recitation', 'Reflection on the miracle', 'Community lectures'],
    isRecurring: true,
    nextOccurrence: '2026-01-16',
    location: 'HUMSJ Main Hall',
    attendees: 0,
    maxAttendees: 350,
    qrCode: 'QR_ISRA_2025',
    registrationRequired: true
  },
  {
    id: '5',
    title: 'Ramadan Begins',
    date: '2025-02-28',
    hijriDate: '1 Ramadan 1446',
    type: 'religious',
    category: 'major',
    description: 'Beginning of the holy month of fasting',
    significance: 'Month of fasting, prayer, reflection and community',
    observances: ['Daily fasting', 'Tarawih prayers', 'Increased charity', 'Quran recitation'],
    isRecurring: true,
    nextOccurrence: '2026-02-17',
    location: 'HUMSJ Main Hall',
    attendees: 0,
    maxAttendees: 500,
    qrCode: 'QR_RAMADAN_2025',
    registrationRequired: false
  },
  {
    id: '6',
    title: 'Laylat al-Qadr',
    date: '2025-03-25',
    hijriDate: '27 Ramadan 1446',
    type: 'religious',
    category: 'major',
    description: 'The Night of Power/Decree',
    significance: 'Night when the Quran was first revealed, better than 1000 months',
    observances: ['Intensive worship', 'Quran recitation', 'Dua and dhikr', 'I\'tikaf'],
    isRecurring: true,
    nextOccurrence: '2026-03-14',
    location: 'HUMSJ Main Hall',
    attendees: 0,
    maxAttendees: 400,
    qrCode: 'QR_LAYLAT_QADR_2025',
    registrationRequired: true
  },
  {
    id: '7',
    title: 'Eid al-Fitr',
    date: '2025-03-30',
    hijriDate: '1 Shawwal 1446',
    type: 'religious',
    category: 'major',
    description: 'Festival of Breaking the Fast',
    significance: 'Celebration marking the end of Ramadan fasting',
    observances: ['Eid prayers', 'Zakat al-Fitr', 'Family gatherings', 'Festive meals', 'Gift giving'],
    isRecurring: true,
    nextOccurrence: '2026-03-19',
    location: 'HUMSJ Main Hall & Outdoor Area',
    attendees: 0,
    maxAttendees: 800,
    qrCode: 'QR_EID_FITR_2025',
    registrationRequired: false
  },
  {
    id: '8',
    title: 'Eid al-Adha',
    date: '2025-06-06',
    hijriDate: '10 Dhu al-Hijjah 1446',
    type: 'religious',
    category: 'major',
    description: 'Festival of Sacrifice',
    significance: 'Commemorates Abraham\'s willingness to sacrifice his son for Allah',
    observances: ['Eid prayers', 'Animal sacrifice', 'Charity distribution', 'Family gatherings'],
    isRecurring: true,
    nextOccurrence: '2026-05-26',
    location: 'HUMSJ Main Hall & Outdoor Area',
    attendees: 0,
    maxAttendees: 800,
    qrCode: 'QR_EID_ADHA_2025',
    registrationRequired: false
  }
];

export default function IslamicCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<IslamicEvent[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [currentPrayerTimes, setCurrentPrayerTimes] = useState<PrayerTimes | null>(null);

  // Auto-calculate prayer times for current location
  useEffect(() => {
    const calculatePrayerTimes = () => {
      // This would normally use a prayer times API or calculation library
      // For demo purposes, using static times for Addis Ababa
      const today = new Date().toISOString().split('T')[0];
      setCurrentPrayerTimes({
        fajr: '05:15',
        sunrise: '06:35',
        dhuhr: '12:15',
        asr: '15:45',
        maghrib: '18:00',
        isha: '19:15',
        location: 'Addis Ababa, Ethiopia',
        date: today
      });
    };

    calculatePrayerTimes();
    // Update prayer times daily
    const interval = setInterval(calculatePrayerTimes, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get current Hijri date (enhanced calculation)
  const getCurrentHijriDate = () => {
    const gregorianDate = new Date();
    // This would normally use a proper Hijri conversion library
    // For demo purposes, using approximation
    const hijriYear = 1446; 
    const currentMonth = Math.floor(Math.random() * 12); // This would be calculated properly
    const hijriMonth = hijriMonths[currentMonth];
    const hijriDay = Math.floor(Math.random() * 29) + 1; // This would be calculated properly
    return `${hijriDay} ${hijriMonth.name} ${hijriYear}`;
  };

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'major', label: 'Major Events' },
    { value: 'minor', label: 'Minor Events' },
    { value: 'local', label: 'Local Events' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.significance.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'major': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'minor': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'local': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'religious': return Star;
      case 'historical': return Clock;
      case 'community': return MapPin;
      default: return CalendarIcon;
    }
  };

  const handleBookmark = (id: string) => {
    toast.success("Event bookmarked");
  };

  const handleShare = (event: IslamicEvent) => {
    toast.success(`Sharing: ${event.title}`);
  };

  const handleRegister = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event?.registrationRequired) {
      toast.success(`Registered for: ${event.title}`);
    } else {
      toast.info("No registration required for this event");
    }
  };

  const handleQRScan = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event?.qrCode) {
      toast.success(`QR Code scanned for: ${event.title}`);
    }
  };

  const addToCalendar = (event: IslamicEvent) => {
    toast.success(`Added ${event.title} to your calendar`);
  };

  return (
    <PageLayout 
      title="Islamic Calendar" 
      subtitle="Important Islamic dates and events throughout the year"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Moon size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Hijri Calendar</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Islamic Calendar</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Stay connected with important Islamic dates, religious observances, and community events 
            based on the lunar Hijri calendar.
          </p>
          <div className="inline-flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
            <CalendarIcon size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Today: {getCurrentHijriDate()}</span>
          </div>
        </div>

        {/* Current Prayer Times */}
        {currentPrayerTimes && (
          <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-2xl p-6 border border-blue-500/30">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Today's Prayer Times</h2>
              <p className="text-muted-foreground">
                <MapPin size={16} className="inline mr-1" />
                {currentPrayerTimes.location} - {new Date(currentPrayerTimes.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Fajr', time: currentPrayerTimes.fajr, icon: '🌅' },
                { name: 'Sunrise', time: currentPrayerTimes.sunrise, icon: '☀️' },
                { name: 'Dhuhr', time: currentPrayerTimes.dhuhr, icon: '🌞' },
                { name: 'Asr', time: currentPrayerTimes.asr, icon: '🌇' },
                { name: 'Maghrib', time: currentPrayerTimes.maghrib, icon: '🌅' },
                { name: 'Isha', time: currentPrayerTimes.isha, icon: '🌙' }
              ].map((prayer, index) => (
                <div 
                  key={prayer.name}
                  className="text-center p-4 rounded-lg bg-card/50 border border-border/30 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl mb-2">{prayer.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{prayer.name}</h3>
                  <p className="text-lg font-mono text-primary">{prayer.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Islamic events and observances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <CalendarIcon size={16} />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className="gap-2"
            >
              <CalendarIcon size={16} />
              Calendar
            </Button>
          </div>
        </div>

        {/* Hijri Months Overview */}
        <div>
          <h2 className="text-2xl font-display mb-6">Hijri Months</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hijriMonths.map((month, index) => (
              <div 
                key={month.number}
                className="bg-card rounded-xl border border-border/30 p-4 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-lg">{month.name}</h3>
                  <span className="text-sm text-muted-foreground">{month.days} days</span>
                </div>
                <p className="text-right text-lg font-arabic mb-2" dir="rtl">{month.arabicName}</p>
                {month.significance && (
                  <p className="text-xs text-muted-foreground">{month.significance}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
            <Clock className="text-primary" size={24} />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => {
              const TypeIcon = getTypeIcon(event.type);
              const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={event.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <TypeIcon size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs", getCategoryColor(event.category))}>
                            {event.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookmark(event.id)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon size={14} />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="text-primary">({event.hijriDate})</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.maxAttendees && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users size={14} />
                        <span>{event.attendees || 0} / {event.maxAttendees} attendees</span>
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((event.attendees || 0) / event.maxAttendees) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-primary">
                        <strong>Significance:</strong> {event.significance}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Observances:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.observances.map(observance => (
                          <span key={observance} className="text-xs px-2 py-1 bg-secondary rounded-md">
                            {observance}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Reminder set")}
                        className="gap-1"
                      >
                        <Bell size={12} />
                        Remind
                      </Button>
                      {event.registrationRequired && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRegister(event.id)}
                          className="gap-1"
                        >
                          <Plus size={12} />
                          Register
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {event.qrCode && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQRScan(event.id)}
                          className="gap-1"
                        >
                          <QrCode size={12} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare(event)}
                        className="gap-1"
                      >
                        <Share2 size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCalendar(event)}
                        className="gap-1"
                      >
                        <Download size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Events */}
        <div>
          <h2 className="text-2xl font-display mb-6">All Islamic Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const TypeIcon = getTypeIcon(event.type);
              return (
                <div 
                  key={event.id}
                  className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <TypeIcon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg">{event.title}</h3>
                      <Badge className={cn("text-xs", getCategoryColor(event.category))}>
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon size={14} />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-primary font-medium">{event.hijriDate}</p>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {event.isRecurring ? 'Annual' : 'One-time'}
                      </span>
                      {event.registrationRequired && (
                        <Badge className="text-xs bg-amber-500/20 text-amber-600">
                          Registration Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {event.qrCode && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQRScan(event.id)}
                          className="gap-1"
                        >
                          <QrCode size={12} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookmark(event.id)}
                        className="gap-1"
                      >
                        <Bookmark size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or category filter to find more events.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}