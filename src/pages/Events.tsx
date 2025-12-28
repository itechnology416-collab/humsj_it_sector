import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";
import IslamicSpaceFiller from "@/components/islamic/IslamicSpaceFiller";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  Sparkles,
  Play,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Star,
  DollarSign,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { toast } from "sonner";
import { eventsApi, type Event, type EventFilters } from "@/services/eventsApi";

const typeConfig = {
  friday: { label: "Friday Prayer", color: "bg-primary text-primary-foreground", border: "border-l-primary" },
  dars: { label: "Dars/Halaqa", color: "bg-accent/20 text-accent", border: "border-l-accent" },
  workshop: { label: "Workshop", color: "bg-blue-500/20 text-blue-400", border: "border-l-blue-500" },
  special: { label: "Special Event", color: "bg-purple-500/20 text-purple-400", border: "border-l-purple-500" },
  meeting: { label: "Meeting", color: "bg-muted text-muted-foreground", border: "border-l-muted-foreground" },
  conference: { label: "Conference", color: "bg-indigo-500/20 text-indigo-400", border: "border-l-indigo-500" },
  social: { label: "Social Event", color: "bg-pink-500/20 text-pink-400", border: "border-l-pink-500" },
  charity: { label: "Charity Event", color: "bg-green-500/20 text-green-400", border: "border-l-green-500" },
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [view, setView] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // API state
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [registering, setRegistering] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: EventFilters = {};
      
      if (selectedType !== "all") {
        filters.type = selectedType;
      }
      
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      // Filter by current month/year for calendar view
      if (view === "calendar") {
        const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
        filters.date_from = startDate;
        filters.date_to = endDate;
      }

      const response = await eventsApi.getEvents({
        page: currentPage,
        limit: 20,
        sort_by: 'date',
        sort_order: 'asc',
        filters
      });

      setEvents(response.events);
      setTotalEvents(response.total);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [selectedType, searchQuery, view, currentYear, currentMonth, currentPage]);

  // Load events from API
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleRegisterForEvent = async (eventId: string) => {
    if (!user) {
      toast.error('Please sign in to register for events');
      navigate('/auth');
      return;
    }

    try {
      setRegistering(eventId);
      await eventsApi.registerForEvent(eventId);
      toast.success("Successfully registered for event!");
      
      // Refresh events to update attendee count
      await loadEvents();
    } catch (error: unknown) {
      console.error('Registration error:', error);
      toast.error(error.message || "Failed to register for event");
    } finally {
      setRegistering(null);
    }
  };

  const filteredEvents = events.filter(event => 
    selectedType === "all" || event.type === selectedType
  );

  return (
    <PublicPageLayout 
      title="Events" 
      subtitle="Manage and schedule events"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-2 bg-card rounded-lg p-1 border border-border/30">
              <button 
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-display text-lg tracking-wide px-3 min-w-[140px] text-center">
                {months[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-card rounded-lg p-1 border border-border/30">
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  view === "list" ? "bg-primary text-primary-foreground shadow-red" : "hover:bg-secondary"
                )}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setView("calendar")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  view === "calendar" ? "bg-primary text-primary-foreground shadow-red" : "hover:bg-secondary"
                )}
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-card rounded-xl p-4 border border-border/30 space-y-4">
            <h3 className="font-semibold text-lg">Filter Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Event Type</Label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  {Object.entries(typeConfig).map(([type, config]) => (
                    <option key={type} value={type}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="Filter by location..." className="mt-1" />
              </div>
              <div>
                <Label>Speaker</Label>
                <Input placeholder="Filter by speaker..." className="mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Events</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadEvents} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Events Content */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 border border-border/30">
                <div className="flex items-center gap-3">
                  <CalendarIcon size={24} className="text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{totalEvents}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border/30">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{events.reduce((sum, e) => sum + e.current_attendees, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Attendees</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border/30">
                <div className="flex items-center gap-3">
                  <Star size={24} className="text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{events.filter(e => e.is_featured).length}</p>
                    <p className="text-sm text-muted-foreground">Featured Events</p>
                  </div>
                </div>
              </div>
            </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              selectedType === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-red"
                : "bg-card text-muted-foreground border-border/30 hover:border-primary/50 hover:text-foreground"
            )}
          >
            All Events
          </button>
          {Object.entries(typeConfig).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                selectedType === type
                  ? config.color + " border-transparent"
                  : "bg-card text-muted-foreground border-border/30 hover:border-primary/50"
              )}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Events List View */}
        {view === "list" && (
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No events match your current filters'}
                </p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  delay={index * 80} 
                  onRegister={handleRegisterForEvent}
                  isRegistering={registering === event.id}
                />
              ))
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <CalendarView 
            events={filteredEvents} 
            month={currentMonth} 
            year={currentYear}
            typeConfig={typeConfig} 
          />
        )}
        </>
        )}

        {/* Islamic Event Guidelines & Knowledge */}
        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-green-500/20 mt-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <CalendarIcon size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Islamic Event Guidelines & Etiquettes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the Islamic principles and etiquettes that guide our community events and gatherings
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Etiquettes */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Event Etiquettes (Adab al-Majlis)
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Entering the Gathering",
                    guideline: "Say 'Assalamu Alaikum' and seek permission before joining",
                    hadith: "The Prophet (ﷺ) said: 'When one of you comes to a gathering, let him give the greeting of peace.'",
                    reference: "Abu Dawud"
                  },
                  {
                    title: "Seating Arrangement",
                    guideline: "Sit where there is space, don't ask people to move",
                    hadith: "The Prophet (ﷺ) said: 'It is not permissible for a man to separate two people except with their permission.'",
                    reference: "Abu Dawud, Tirmidhi"
                  },
                  {
                    title: "Speaking in Gatherings",
                    guideline: "Speak with wisdom, listen attentively, and avoid interrupting",
                    hadith: "The Prophet (ﷺ) said: 'Whoever believes in Allah and the Last Day should speak good or remain silent.'",
                    reference: "Bukhari, Muslim"
                  },
                  {
                    title: "Leaving the Gathering",
                    guideline: "Seek forgiveness and say the gathering's closing dua",
                    hadith: "The Prophet (ﷺ) would say when leaving a gathering: 'Subhanaka Allahumma wa bihamdika, ashhadu an la ilaha illa anta, astaghfiruka wa atubu ilayk'",
                    reference: "Abu Dawud, Tirmidhi"
                  }
                ].map((etiquette, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{etiquette.title}</h4>
                    <p className="text-sm mb-3 font-medium">{etiquette.guideline}</p>
                    <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                      "{etiquette.hadith}"
                    </blockquote>
                    <p className="text-xs text-accent font-medium">- {etiquette.reference}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Islamic Event Types */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Types of Islamic Gatherings
              </h3>
              <div className="space-y-4">
                {[
                  {
                    type: "Halaqah (Study Circle)",
                    purpose: "Learning and discussing Islamic knowledge",
                    benefits: "Spiritual growth, knowledge sharing, community bonding",
                    hadith: "No people gather in one of the houses of Allah, reciting the Book of Allah and studying it among themselves, except that tranquility descends upon them.",
                    reference: "Muslim"
                  },
                  {
                    type: "Dhikr Gathering",
                    purpose: "Remembrance of Allah collectively",
                    benefits: "Spiritual purification, heart softening, divine mercy",
                    hadith: "Allah has angels who go around on the roads seeking those who remember Allah. When they find people remembering Allah, they call to each other: 'Come to what you are looking for!'",
                    reference: "Bukhari, Muslim"
                  },
                  {
                    type: "Da'wah Session",
                    purpose: "Inviting others to Islam and Islamic values",
                    benefits: "Spreading knowledge, earning reward, community outreach",
                    hadith: "Whoever calls to guidance will have a reward similar to that of those who follow it, without the reward being lessened at all.",
                    reference: "Muslim"
                  }
                ].map((gathering, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{gathering.type}</h4>
                    <p className="text-sm mb-2"><strong>Purpose:</strong> {gathering.purpose}</p>
                    <p className="text-sm mb-3"><strong>Benefits:</strong> {gathering.benefits}</p>
                    <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                      "{gathering.hadith}"
                    </blockquote>
                    <p className="text-xs text-accent font-medium">- {gathering.reference}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Educational Content - Between Events and Prayer Times */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="hadith" size="large" />
          <IslamicSpaceFiller preferredContent="educational" minHeight={300} maxHeight={400} />
        </div>

        {/* Prayer Times & Event Scheduling */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Clock size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Prayer Times & Event Scheduling</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding how Islamic prayer times influence our event scheduling and community activities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                prayer: "Fajr",
                arabic: "الفجر",
                time: "Dawn Prayer",
                description: "The pre-dawn prayer that starts the day with remembrance of Allah",
                eventConsiderations: [
                  "Early morning study sessions after Fajr",
                  "Spiritual reflection gatherings",
                  "Community service planning meetings"
                ],
                virtue: "The Prophet (ﷺ) said: 'Whoever prays Fajr is under Allah's protection.'",
                color: "from-orange-500 to-yellow-500",
                icon: "🌅"
              },
              {
                prayer: "Dhuhr",
                arabic: "الظهر",
                time: "Midday Prayer",
                description: "The noon prayer that breaks the day's activities",
                eventConsiderations: [
                  "Lunch break during day-long events",
                  "Midday educational workshops",
                  "Community announcements"
                ],
                virtue: "The middle prayer that Allah specifically mentioned in the Quran",
                color: "from-blue-500 to-cyan-500",
                icon: "☀️"
              },
              {
                prayer: "Asr",
                arabic: "العصر",
                time: "Afternoon Prayer",
                description: "The afternoon prayer before sunset",
                eventConsiderations: [
                  "Afternoon study circles",
                  "Sports and recreational activities",
                  "Community service projects"
                ],
                virtue: "The Prophet (ﷺ) said: 'Whoever misses Asr prayer, it is as if he has lost his family and wealth.'",
                color: "from-amber-500 to-orange-500",
                icon: "🌤️"
              },
              {
                prayer: "Maghrib",
                arabic: "المغرب",
                time: "Sunset Prayer",
                description: "The prayer immediately after sunset",
                eventConsiderations: [
                  "Iftar gatherings during Ramadan",
                  "Evening program openings",
                  "Community dinner events"
                ],
                virtue: "The time when duas are most likely to be accepted",
                color: "from-red-500 to-pink-500",
                icon: "🌅"
              },
              {
                prayer: "Isha",
                arabic: "العشاء",
                time: "Night Prayer",
                description: "The final prayer of the day",
                eventConsiderations: [
                  "Evening lectures and seminars",
                  "Night study sessions",
                  "Community social gatherings"
                ],
                virtue: "The Prophet (ﷺ) said: 'The most burdensome prayers for the hypocrites are Isha and Fajr.'",
                color: "from-purple-500 to-indigo-500",
                icon: "🌙"
              }
            ].map((prayer, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${prayer.color} p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-transform duration-300`}>
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{prayer.icon}</span>
                  <h3 className="text-xl font-semibold">{prayer.prayer}</h3>
                  <p className="text-lg font-arabic opacity-90">{prayer.arabic}</p>
                  <p className="text-sm opacity-80">{prayer.time}</p>
                </div>
                <p className="text-sm mb-4 opacity-90">{prayer.description}</p>
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Event Considerations:</h4>
                  <ul className="text-xs space-y-1">
                    {prayer.eventConsiderations.map((consideration, cIdx) => (
                      <li key={cIdx}>• {consideration}</li>
                    ))}
                  </ul>
                </div>
                <blockquote className="text-xs italic opacity-80 border-l-2 border-white/50 pl-2">
                  "{prayer.virtue}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* Community Event Benefits */}
        <div className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 rounded-3xl p-8 border border-purple-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Users size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Benefits of Community Gatherings in Islam</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the spiritual, social, and educational benefits of participating in Islamic community events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                benefit: "Spiritual Growth",
                description: "Collective worship and remembrance strengthen faith",
                examples: ["Group prayers", "Dhikr circles", "Quran recitation"],
                hadith: "The example of the believers in their affection, mercy, and compassion for each other is that of a body. When a limb suffers, the whole body responds to it with wakefulness and fever.",
                reference: "Bukhari, Muslim",
                icon: "🤲",
                color: "from-green-500 to-emerald-500"
              },
              {
                benefit: "Knowledge Sharing",
                description: "Learning from scholars and fellow community members",
                examples: ["Study circles", "Lectures", "Q&A sessions"],
                hadith: "Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him.",
                reference: "Muslim",
                icon: "📚",
                color: "from-blue-500 to-cyan-500"
              },
              {
                benefit: "Social Bonding",
                description: "Building strong relationships and brotherhood/sisterhood",
                examples: ["Community meals", "Social gatherings", "Group activities"],
                hadith: "The believers in their mutual kindness, compassion, and sympathy are just one body. When a limb suffers, the whole body responds to it with wakefulness and fever.",
                reference: "Bukhari, Muslim",
                icon: "❤️",
                color: "from-red-500 to-pink-500"
              },
              {
                benefit: "Character Development",
                description: "Learning patience, cooperation, and Islamic manners",
                examples: ["Leadership roles", "Volunteer work", "Conflict resolution"],
                hadith: "I was sent to perfect good character.",
                reference: "Ahmad",
                icon: "⭐",
                color: "from-amber-500 to-yellow-500"
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{benefit.icon}</span>
                  <h3 className="text-lg font-semibold text-primary">{benefit.benefit}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{benefit.description}</p>
                <div className="bg-secondary/20 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Examples:</h4>
                  <ul className="text-xs space-y-1">
                    {benefit.examples.map((example, eIdx) => (
                      <li key={eIdx} className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-accent" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
                <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                  "{benefit.hadith}"
                </blockquote>
                <p className="text-xs text-accent font-medium">- {benefit.reference}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

function EventCard({ 
  event, 
  delay, 
  onRegister, 
  isRegistering = false 
}: { 
  event: Event; 
  delay: number; 
  onRegister: (eventId: string) => void;
  isRegistering?: boolean;
}) {
  const config = typeConfig[event.type];
  
  const handleRegister = async () => {
    await onRegister(event.id);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventFull = event.max_attendees && event.current_attendees >= event.max_attendees;
  const spotsLeft = event.max_attendees ? event.max_attendees - event.current_attendees : null;
  
  return (
    <div 
      className={cn(
        "group bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-500 border-l-4 animate-slide-up opacity-0 hover:-translate-y-1 hover:shadow-red cursor-pointer",
        config.border,
        "hover:shadow-lg",
        isEventFull && "opacity-75"
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards"
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            {event.is_featured && (
              <Star size={16} className="text-yellow-500 fill-current ml-2" />
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarIcon size={14} />
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {event.speaker && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <UserIcon size={14} />
              Speaker: {event.speaker}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span 
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap",
              config.color
            )}
          >
            {config.label}
          </span>
          {event.price && event.price > 0 && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <DollarSign size={12} />
              {event.currency || 'USD'} {event.price}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          {formatTime(event.start_time)} - {formatTime(event.end_time)}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          {event.location}
        </div>
      </div>

      {event.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(3, event.current_attendees) }).map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
              >
                {i < 2 ? 'U' : event.current_attendees > 3 ? `+${event.current_attendees - 2}` : 'U'}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            <span>{event.current_attendees} {event.current_attendees === 1 ? 'attendee' : 'attendees'}</span>
            {spotsLeft !== null && (
              <span className={cn(
                "ml-2",
                spotsLeft <= 5 ? "text-red-500" : "text-muted-foreground"
              )}>
                • {spotsLeft} spots left
              </span>
            )}
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRegister}
          disabled={isRegistering || isEventFull}
          className="group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary"
        >
          {isRegistering ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
              Registering...
            </>
          ) : isEventFull ? (
            'Event Full'
          ) : (
            'Register'
          )}
        </Button>
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/30">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{event.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarView({ 
  events, 
  month, 
  year,
  typeConfig 
}: { 
  events: Event[]; 
  month: number; 
  year: number;
  typeConfig: unknown; 
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="bg-card rounded-xl border border-border/30 p-6 animate-scale-in">
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center text-sm font-display tracking-wide text-muted-foreground py-3">
            {day}
          </div>
        ))}
        
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const isToday = new Date().getDate() === day && 
                         new Date().getMonth() === month && 
                         new Date().getFullYear() === year;
          
          return (
            <div 
              key={day}
              className={cn(
                "aspect-square p-1.5 rounded-lg border border-transparent hover:border-primary/30 transition-all cursor-pointer group",
                isToday && "bg-primary/10 border-primary/30"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-1 group-hover:text-primary transition-colors",
                isToday ? "text-primary" : "text-foreground"
              )}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map(event => (
                  <div 
                    key={event.id}
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded truncate",
                      typeConfig[event.type].color
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-primary font-medium">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}