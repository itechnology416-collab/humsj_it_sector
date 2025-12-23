import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";
import IslamicSpaceFiller from "@/components/islamic/IslamicSpaceFiller";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  MapPin, 
  Users, 
  Clock,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  Sparkles,
  Play,
  Save,
  Loader2,
  CheckCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  type: "friday" | "dars" | "workshop" | "special" | "meeting";
  date: string;
  time: string;
  endTime: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees?: number;
  speaker?: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Friday Jumu'ah Prayer",
    type: "friday",
    date: "2024-02-16",
    time: "12:30",
    endTime: "13:30",
    location: "Main Mosque",
    description: "Weekly Friday prayer and khutba",
    attendees: 180,
    speaker: "Imam Yusuf Ahmed"
  },
  {
    id: "2",
    title: "Tafsir Halaqa - Surah Kahf",
    type: "dars",
    date: "2024-02-17",
    time: "16:00",
    endTime: "17:30",
    location: "Room 201, Islamic Center",
    description: "Weekly Quran study circle focusing on Surah Al-Kahf",
    attendees: 45,
    maxAttendees: 60,
    speaker: "Sheikh Ibrahim"
  },
  {
    id: "3",
    title: "IT Workshop: Web Development",
    type: "workshop",
    date: "2024-02-19",
    time: "14:00",
    endTime: "17:00",
    location: "Computer Lab 3",
    description: "Introduction to HTML, CSS, and JavaScript",
    attendees: 28,
    maxAttendees: 35,
    speaker: "Ahmed Hassan"
  },
  {
    id: "4",
    title: "Ramadan Preparation Meeting",
    type: "special",
    date: "2024-02-22",
    time: "17:00",
    endTime: "18:30",
    location: "Main Auditorium",
    description: "Planning session for Ramadan activities and programs",
    attendees: 120,
    maxAttendees: 200
  },
  {
    id: "5",
    title: "Academic Sector Weekly Meeting",
    type: "meeting",
    date: "2024-02-18",
    time: "10:00",
    endTime: "11:00",
    location: "Online (Google Meet)",
    description: "Weekly progress update and task assignment",
    attendees: 8
  },
  {
    id: "6",
    title: "Sisters' Halaqa",
    type: "dars",
    date: "2024-02-18",
    time: "15:00",
    endTime: "16:30",
    location: "Sisters Hall",
    description: "Weekly Islamic knowledge session for sisters",
    attendees: 35,
    maxAttendees: 50,
    speaker: "Ustadha Fatima"
  },
];

const typeConfig = {
  friday: { label: "Friday Prayer", color: "bg-primary text-primary-foreground", border: "border-l-primary" },
  dars: { label: "Dars/Halaqa", color: "bg-accent/20 text-accent", border: "border-l-accent" },
  workshop: { label: "Workshop", color: "bg-blue-500/20 text-blue-400", border: "border-l-blue-500" },
  special: { label: "Special Event", color: "bg-purple-500/20 text-purple-400", border: "border-l-purple-500" },
  meeting: { label: "Meeting", color: "bg-muted text-muted-foreground", border: "border-l-muted-foreground" },
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [eventsList, setEventsList] = useState(events);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "meeting" as Event["type"],
    date: "",
    time: "",
    endTime: "",
    location: "",
    description: "",
    maxAttendees: "",
    speaker: ""
  });

  const filteredEvents = eventsList.filter(event => 
    selectedType === "all" || event.type === selectedType
  );

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const event: Event = {
        id: (eventsList.length + 1).toString(),
        title: newEvent.title,
        type: newEvent.type,
        date: newEvent.date,
        time: newEvent.time,
        endTime: newEvent.endTime || newEvent.time,
        location: newEvent.location,
        description: newEvent.description,
        attendees: 0,
        maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : undefined,
        speaker: newEvent.speaker || undefined
      };

      setEventsList([event, ...eventsList]);
      toast.success("Event created successfully!");
      
      // Reset form
      setNewEvent({
        title: "",
        type: "meeting",
        date: "",
        time: "",
        endTime: "",
        location: "",
        description: "",
        maxAttendees: "",
        speaker: ""
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRegisterForEvent = async (eventId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEventsList(eventsList.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      ));
      
      toast.success("Successfully registered for event!");
    } catch (error) {
      toast.error("Failed to register for event");
    }
  };

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

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                <Plus size={18} />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Friday Jumu'ah Prayer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Event Type *</Label>
                    <Select value={newEvent.type} onValueChange={(value: Event["type"]) => setNewEvent(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friday">Friday Prayer</SelectItem>
                        <SelectItem value="dars">Dars/Halaqa</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="special">Special Event</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Start Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Main Mosque"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="speaker">Speaker/Facilitator</Label>
                  <Input
                    id="speaker"
                    value={newEvent.speaker}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, speaker: e.target.value }))}
                    placeholder="Imam Yusuf Ahmed"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description and details..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateEvent} 
                    disabled={isCreating}
                    className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Create Event
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} delay={index * 80} onRegister={handleRegisterForEvent} />
            ))}
          </div>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <CalendarView events={filteredEvents} month={currentMonth} year={currentYear} />
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

function EventCard({ event, delay, onRegister }: { event: Event; delay: number; onRegister: (eventId: string) => void }) {
  const config = typeConfig[event.type];
  const [isRegistering, setIsRegistering] = useState(false);
  
  const handleRegister = async () => {
    setIsRegistering(true);
    await onRegister(event.id);
    setIsRegistering(false);
  };
  
  return (
    <div 
      className={cn(
        "group bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-500 border-l-4 animate-slide-up opacity-0 hover:-translate-y-1 hover:shadow-red cursor-pointer",
        config.border
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display text-xl tracking-wide group-hover:text-primary transition-colors">{event.title}</h3>
            <span className={cn("text-xs px-2.5 py-1 rounded-md font-medium", config.color)}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <CalendarIcon size={14} className="text-primary" />
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Clock size={14} className="text-primary" />
              {event.time} - {event.endTime}
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <MapPin size={14} className="text-primary" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Users size={14} className="text-primary" />
              {event.attendees}{event.maxAttendees && `/${event.maxAttendees}`} attending
            </span>
          </div>
          
          {event.speaker && (
            <p className="text-sm mt-2">
              <span className="text-muted-foreground">Speaker:</span>{" "}
              <span className="font-medium text-primary">{event.speaker}</span>
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border/50 hover:border-primary">
            <Sparkles size={14} className="mr-1" />
            Details
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 shadow-red gap-1"
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} className="fill-current" />
            )}
            {isRegistering ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CalendarView({ events, month, year }: { events: Event[]; month: number; year: number }) {
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