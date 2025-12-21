import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Heart, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Star,
  Award,
  Target,
  TrendingUp,
  Eye,
  UserPlus,
  UserMinus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const availableOpportunities = [
  {
    id: 1,
    title: "IT Support Volunteer",
    organization: "IT Sector",
    description: "Help maintain computer systems and provide technical support to members",
    category: "Technology",
    timeCommitment: "4 hours/week",
    location: "Computer Lab",
    skills: ["Computer Skills", "Problem Solving", "Communication"],
    urgency: "high",
    deadline: "2024-12-30",
    volunteers: 3,
    maxVolunteers: 5,
    status: "available"
  },
  {
    id: 2,
    title: "Event Photography",
    organization: "Media Committee",
    description: "Capture moments during Islamic events and community gatherings",
    category: "Media",
    timeCommitment: "2-3 hours/event",
    location: "Various Locations",
    skills: ["Photography", "Creativity", "Equipment Handling"],
    urgency: "medium",
    deadline: "2024-12-25",
    volunteers: 2,
    maxVolunteers: 3,
    status: "available"
  },
  {
    id: 3,
    title: "Quran Teaching Assistant",
    organization: "Education Committee",
    description: "Assist in teaching Quran recitation to younger members",
    category: "Education",
    timeCommitment: "6 hours/week",
    location: "Study Rooms",
    skills: ["Quran Recitation", "Teaching", "Patience"],
    urgency: "high",
    deadline: "2024-12-28",
    volunteers: 1,
    maxVolunteers: 4,
    status: "available"
  },
  {
    id: 4,
    title: "Community Outreach Coordinator",
    organization: "Social Committee",
    description: "Help organize community service projects and outreach programs",
    category: "Community Service",
    timeCommitment: "5 hours/week",
    location: "Community Center",
    skills: ["Organization", "Communication", "Leadership"],
    urgency: "low",
    deadline: "2025-01-15",
    volunteers: 4,
    maxVolunteers: 6,
    status: "available"
  }
];

const myApplications = [
  {
    id: 1,
    opportunityId: 1,
    title: "IT Support Volunteer",
    appliedDate: "2024-12-18",
    status: "pending",
    message: "Interested in contributing my technical skills to help the community."
  },
  {
    id: 2,
    opportunityId: 3,
    title: "Quran Teaching Assistant",
    appliedDate: "2024-12-15",
    status: "accepted",
    message: "Excited to help teach Quran to younger members."
  },
  {
    id: 3,
    opportunityId: 2,
    title: "Event Photography",
    appliedDate: "2024-12-10",
    status: "rejected",
    message: "Would love to capture beautiful moments during events."
  }
];

const volunteerHistory = [
  {
    id: 1,
    title: "Friday Prayer Setup",
    organization: "Prayer Committee",
    duration: "3 months",
    hoursContributed: 24,
    completedDate: "2024-11-30",
    rating: 5,
    feedback: "Excellent dedication and punctuality"
  },
  {
    id: 2,
    title: "Ramadan Iftar Helper",
    organization: "Social Committee",
    duration: "1 month",
    hoursContributed: 32,
    completedDate: "2024-10-15",
    rating: 4,
    feedback: "Great teamwork and enthusiasm"
  }
];

export default function VolunteerOpportunities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");

  const tabs = [
    { id: "available", label: "Available Tasks", icon: Heart },
    { id: "applications", label: "My Applications", icon: UserPlus },
    { id: "history", label: "Task History", icon: Clock }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return CheckCircle;
      case "pending": return AlertCircle;
      case "rejected": return XCircle;
      default: return Clock;
    }
  };

  const filteredOpportunities = availableOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || opp.category === filterCategory;
    const matchesUrgency = filterUrgency === "all" || opp.urgency === filterUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const totalHours = volunteerHistory.reduce((sum, task) => sum + task.hoursContributed, 0);
  const averageRating = volunteerHistory.reduce((sum, task) => sum + task.rating, 0) / volunteerHistory.length;

  return (
    <PageLayout 
      title="Volunteer Opportunities" 
      subtitle="Contribute to your community through meaningful service"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: "Available Tasks", 
              value: availableOpportunities.length.toString(), 
              icon: Heart, 
              color: "text-primary" 
            },
            { 
              label: "My Applications", 
              value: myApplications.length.toString(), 
              icon: UserPlus, 
              color: "text-blue-400" 
            },
            { 
              label: "Hours Contributed", 
              value: totalHours.toString(), 
              icon: Clock, 
              color: "text-green-400" 
            },
            { 
              label: "Average Rating", 
              value: averageRating ? averageRating.toFixed(1) : "0", 
              icon: Star, 
              color: "text-amber-400" 
            }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search volunteer opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Media">Media</option>
              <option value="Community Service">Community Service</option>
            </select>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="all">All Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "available" && (
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => (
                <div 
                  key={opportunity.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Heart size={24} className="text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-display tracking-wide mb-2">{opportunity.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{opportunity.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {opportunity.organization}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {opportunity.timeCommitment}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {opportunity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {opportunity.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-4 md:mt-0">
                          <Badge className={cn("text-xs", getUrgencyColor(opportunity.urgency))}>
                            {opportunity.urgency.toUpperCase()} PRIORITY
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {opportunity.category}
                          </Badge>
                          <div className="text-xs text-muted-foreground text-right">
                            {opportunity.volunteers}/{opportunity.maxVolunteers} volunteers
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button className="bg-primary hover:bg-primary/90 gap-1">
                          <UserPlus size={14} />
                          Apply Now
                        </Button>
                        <Button variant="outline" className="border-border/50 hover:border-primary gap-1">
                          <Eye size={14} />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-4">
              {myApplications.length > 0 ? (
                myApplications.map((application) => {
                  const StatusIcon = getStatusIcon(application.status);
                  return (
                    <div 
                      key={application.id}
                      className="bg-card rounded-xl p-6 border border-border/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <StatusIcon size={20} className={getStatusColor(application.status).split(' ')[1]} />
                          </div>
                          <div>
                            <h3 className="font-display text-lg mb-1">{application.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Applied on {new Date(application.appliedDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm italic">"{application.message}"</p>
                          </div>
                        </div>
                        <Badge className={cn("text-xs", getStatusColor(application.status))}>
                          {application.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border/50 gap-1">
                          <Eye size={14} />
                          View Details
                        </Button>
                        {application.status === "pending" && (
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-1">
                            <UserMinus size={14} />
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20">
                  <UserPlus size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground">Start applying for volunteer opportunities to make a difference.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {volunteerHistory.length > 0 ? (
                <>
                  {/* Summary Stats */}
                  <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30 mb-6">
                    <h3 className="text-lg font-display mb-4">Volunteer Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-display text-primary">{volunteerHistory.length}</p>
                        <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-display text-primary">{totalHours}</p>
                        <p className="text-sm text-muted-foreground">Hours Contributed</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-3xl font-display text-primary">{averageRating.toFixed(1)}</p>
                          <Star size={20} className="text-amber-400 fill-amber-400" />
                        </div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                      </div>
                    </div>
                  </div>

                  {/* History List */}
                  {volunteerHistory.map((task) => (
                    <div 
                      key={task.id}
                      className="bg-card rounded-xl p-6 border border-border/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle size={20} className="text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-display text-lg mb-1">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{task.organization}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>Duration: {task.duration}</span>
                              <span>Hours: {task.hoursContributed}</span>
                              <span>Completed: {new Date(task.completedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={cn(
                                  i < task.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
                                )} 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">{task.rating}/5 rating</p>
                        </div>
                      </div>
                      
                      {task.feedback && (
                        <div className="p-3 bg-secondary/30 rounded-lg">
                          <p className="text-sm italic">"{task.feedback}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-20">
                  <Clock size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display mb-2">No Volunteer History</h3>
                  <p className="text-muted-foreground">Complete volunteer tasks to build your service history.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}