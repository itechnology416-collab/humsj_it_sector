import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  type: "friday" | "dars" | "workshop" | "special";
  date: string;
  time: string;
  location: string;
  attendees: number;
}

const events: Event[] = [
  {
    id: "1",
    title: "Friday Jumu'ah Prayer",
    type: "friday",
    date: "Tomorrow",
    time: "12:30 PM",
    location: "Main Mosque",
    attendees: 180
  },
  {
    id: "2",
    title: "Tafsir Halaqa - Surah Kahf",
    type: "dars",
    date: "Saturday",
    time: "4:00 PM",
    location: "Room 201",
    attendees: 45
  },
  {
    id: "3",
    title: "IT Workshop: Web Development",
    type: "workshop",
    date: "Monday",
    time: "2:00 PM",
    location: "Lab 3",
    attendees: 28
  },
  {
    id: "4",
    title: "Ramadan Preparation Meeting",
    type: "special",
    date: "Next Week",
    time: "5:00 PM",
    location: "Auditorium",
    attendees: 120
  },
];

const typeStyles = {
  friday: "border-l-primary bg-primary/5",
  dars: "border-l-secondary bg-secondary/5",
  workshop: "border-l-accent bg-accent/5",
  special: "border-l-emerald-glow bg-emerald-glow/5",
};

const typeBadge = {
  friday: "bg-primary/10 text-primary",
  dars: "bg-secondary/10 text-secondary",
  workshop: "bg-accent/10 text-accent",
  special: "bg-emerald-glow/10 text-emerald-glow",
};

export function UpcomingEvents() {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Upcoming Events</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          See Calendar <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div 
            key={event.id}
            className={cn(
              "p-4 rounded-xl border-l-4 hover:shadow-soft transition-all cursor-pointer group",
              typeStyles[event.type]
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium capitalize", typeBadge[event.type])}>
                    {event.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {event.date} • {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {event.attendees} expected
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
