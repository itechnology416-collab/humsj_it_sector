import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Clock,
  Award,
  Heart,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Star,
  TrendingUp,
  Target,
  Handshake,
  BookOpen,
  Megaphone,
  Utensils,
  Building,
  Stethoscope,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VolunteerOpportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  skills: string[];
  impact: string;
  coordinator: string;
  isUrgent: boolean;
  icon: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hoursContributed: number;
  eventsParticipated: number;
  rating: number;
  joinDate: string;
  status: "active" | "inactive";
  badges: string[];
}

const opportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Friday Prayer Setup & Coordination",
    category: "Religious Services",
    description: "Help set up prayer area, manage crowd flow, and assist with post-prayer activities",
    location: "University Mosque",
    date: "Every Friday",
    duration: "2 hours",
    volunteersNeeded: 8,
    volunteersRegistered: 6,
    skills: ["Organization", "Communication", "Leadership"],
    impact: "Support 200+ students in weekly congregational prayer",
    coordinator: "Ahmed Hassan",
    isUrgent: true,
    icon: "🕌"
  },
  {
    id: "2",
    title: "Islamic Knowledge Workshop Assistant",
    category: "Education",
    description: "Assist in organizing and conducting Islamic education workshops for new Muslim students",
    location: "Student Center",
    date: "2024-02-25",
    duration: "4 hours",
    volunteersNeeded: 5,
    volunteersRegistered: 3,
    skills: ["Teaching", "Islamic Knowledge", "Patience"],
    impact: "Educate 30+ new Muslim students about Islamic fundamentals",
    coordinator: "Fatima Ali",
    isUrgent: false,
    icon: "📚"
  },
  {
    id: "3",
    title: "Ramadan Iftar Preparation",
    category: "Community Service",
    description: "Help prepare and serve iftar meals for students during Ramadan",
    location: "University Cafeteria",
    date: "March 2024 (Daily)",
    duration: "3 hours",
    volunteersNeeded: 15,
    volunteersRegistered: 8,
    skills: ["Cooking", "Food Service", "Teamwork"],
    impact: "Provide iftar for 300+ fasting students daily",
    coordinator: "Mohammed Ibrahim",
    isUrgent: true,
    icon: "🍽️"
  },
  {
    id: "4",
    title: "IT Support for Digital Initiatives",
    category: "Technology",
    description: "Provide technical support for HUMSJ digital platforms and help with system maintenance",
    location: "IT Lab",
    date: "Ongoing",
    duration: "Flexible",
    volunteersNeeded: 4,
    volunteersRegistered: 2,
    skills: ["Programming", "System Administration", "Troubleshooting"],
    impact: "Maintain digital infrastructure serving 500+ community members",
    coordinator: "Feysal Hussein Kedir",
    isUrgent: false,
    icon: "💻"
  },
  {
    id: "5",
    title: "Community Outreach Program",
    category: "Da'wa",
    description: "Engage with non-Muslim students to share Islamic values and build interfaith dialogue",
    location: "Campus Wide",
    date: "2024-03-10",
    duration: "6 hours",
    volunteersNeeded: 10,
    volunteersRegistered: 7,
    skills: ["Communication", "Islamic Knowledge", "Cultural Sensitivity"],
    impact: "Reach 100+ non-Muslim students with positive Islamic message",
    coordinator: "Aisha Hassan",
    isUrgent: false,
    icon: "🤝"
  },
  {
    id: "6",
    title: "Medical Camp Volunteer",
    category: "Healthcare",
    description: "Assist in organizing free medical checkups for underprivileged community members",
    location: "Community Health Center",
    date: "2024-02-28",
    duration: "8 hours",
    volunteersNeeded: 12,
    volunteersRegistered: 9,
    skills: ["Healthcare", "Organization", "Compassion"],
    impact: "Provide healthcare services to 150+ community members",
    coordinator: "Dr. Khadija Omar",
    isUrgent: true,
    icon: "🏥"
  }
];

const volunteers: Volunteer[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed.h@hu.edu.et",
    skills: ["Leadership", "Organization", "Public Speaking"],
    hoursContributed: 120,
    eventsParticipated: 15,
    rating: 4.9,
    joinDate: "2023-09-01",
    status: "active",
    badges: ["Top Contributor", "Event Organizer", "Community Leader"]
  },
  {
    id: "2",
    name: "Fatima Ali",
    email: "fatima.a@hu.edu.et",
    skills: ["Teaching", "Islamic Studies", "Mentoring"],
    hoursContributed: 95,
    eventsParticipated: 12,
    rating: 4.8,
    joinDate: "2023-10-15",
    status: "active",
    badges: ["Educator", "Mentor", "Knowledge Sharer"]
  },
  {
    id: "3",
    name: "Mohammed Ibrahim",
    email: "mohammed.i@hu.edu.et",
    skills: ["Event Planning", "Logistics", "Team Management"],
    hoursContributed: 85,
    eventsParticipated: 10,
    rating: 4.7,
    joinDate: "2023-11-01",
    status: "active",
    badges: ["Event Master", "Logistics Expert"]
  }
];

const categoryIcons = {
  "Religious Services": "🕌",
  "Education": "📚",
  "Community Service": "🤝",
  "Technology": "💻",
  "Da'wa": "📢",
  "Healthcare": "🏥"
};

export default function VolunteersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"opportunities" | "volunteers">("opportunities");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categories = ["All Categories", ...Array.from(new Set(opportunities.map(opp => opp.category)))];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVolunteers = volunteers.filter(vol => 
    vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vol.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageLayout 
      title="Volunteer Management" 
      subtitle="Coordinate community service and volunteer opportunities"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Volunteers", value: "45", icon: Users, color: "text-primary" },
            { label: "Hours This Month", value: "320", icon: Clock, color: "text-secondary" },
            { label: "Open Opportunities", value: "12", icon: Target, color: "text-accent" },
            { label: "Community Impact", value: "1,200+", icon: Heart, color: "text-green-500" }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: "opportunities", label: "Opportunities", icon: Target },
            { id: "volunteers", label: "Volunteers", icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as unknown)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-red"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={activeTab === "opportunities" ? "Search opportunities..." : "Search volunteers..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
              />
            </div>
            {activeTab === "opportunities" && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="default">
              <Filter size={18} />
              Advanced Filter
            </Button>
            <Button variant="default" size="default" className="bg-primary hover:bg-primary/90 shadow-red gap-2">
              <Plus size={18} />
              {activeTab === "opportunities" ? "Create Opportunity" : "Add Volunteer"}
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "opportunities" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity, index) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} delay={index * 100} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((volunteer, index) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} delay={index * 100} />
            ))}
          </div>
        )}

        {((activeTab === "opportunities" && filteredOpportunities.length === 0) || 
          (activeTab === "volunteers" && filteredVolunteers.length === 0)) && (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No {activeTab} found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function OpportunityCard({ opportunity, delay }: { opportunity: VolunteerOpportunity; delay: number }) {
  const progress = (opportunity.volunteersRegistered / opportunity.volunteersNeeded) * 100;
  
  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{opportunity.icon}</div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {opportunity.title}
            </h3>
            <span className="text-sm text-muted-foreground">{opportunity.category}</span>
          </div>
        </div>
        {opportunity.isUrgent && (
          <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded-full">
            Urgent
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
        {opportunity.description}
      </p>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{opportunity.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>{opportunity.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>{opportunity.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={14} />
          <span>Coordinator: {opportunity.coordinator}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-1">
          {opportunity.skills.map((skill, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Volunteers</span>
          <span>{opportunity.volunteersRegistered}/{opportunity.volunteersNeeded}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Impact */}
      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-primary font-medium mb-1">Expected Impact:</p>
        <p className="text-xs text-primary/80">{opportunity.impact}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 shadow-red">
          Volunteer Now
        </Button>
        <Button size="sm" variant="outline" className="border-border/50 hover:border-primary">
          Learn More
        </Button>
      </div>
    </div>
  );
}

function VolunteerCard({ volunteer, delay }: { volunteer: Volunteer; delay: number }) {
  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">
            {volunteer.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">{volunteer.name}</h3>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            volunteer.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
          )}>
            {volunteer.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{volunteer.hoursContributed}</p>
          <p className="text-xs text-muted-foreground">Hours</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">{volunteer.eventsParticipated}</p>
          <p className="text-xs text-muted-foreground">Events</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-4">
        <Star size={16} className="text-yellow-500 fill-current" />
        <span className="text-sm font-medium">{volunteer.rating}</span>
        <span className="text-xs text-muted-foreground ml-1">rating</span>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Skills:</p>
        <div className="flex flex-wrap gap-1">
          {volunteer.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md">
              {skill}
            </span>
          ))}
          {volunteer.skills.length > 3 && (
            <span className="text-xs px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md">
              +{volunteer.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Badges:</p>
        <div className="flex flex-wrap gap-1">
          {volunteer.badges.slice(0, 2).map((badge, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
              {badge}
            </span>
          ))}
          {volunteer.badges.length > 2 && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
              +{volunteer.badges.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 shadow-red">
          View Profile
        </Button>
        <Button size="sm" variant="outline" className="border-border/50 hover:border-primary">
          Contact
        </Button>
      </div>
    </div>
  );
}