import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { eventApi, type Event, type EventRegistration } from "@/services/eventApi";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare,
  Award,
  Filter,
  Search,
  Eye,
  Edit,
  Share2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data
  const [registeredEvents, setRegisteredEvents] = useState<EventRegistration[]>([]);
  const [eventCertificates, setEventCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState("registered");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user) {
        const userRegistrations = await eventApi.getUserRegistrations();
        setRegisteredEvents(userRegistrations);
        
        // Mock certificates for now - would come from a certificates API
        setEventCertificates([
          {
            id: 1,
            eventTitle: "Islamic Ethics Workshop",
            issueDate: "2024-12-15",
            certificateId: "IEC-2024-001",
            type: "Completion Certificate"
          },
          {
            id: 2,
            eventTitle: "Quran Recitation Competition",
            issueDate: "2024-11-30",
            certificateId: "QRC-2024-002",
            type: "Participation Certificate"
          }
        ]);
      }
    } catch (err: unknown) {
      console.error('Error loading events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [user, loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getAttendanceIcon = (attendance: string) => {
    switch (attendance) {
      case "present": return CheckCircle;
      case "absent": return XCircle;
      case "pending": return AlertCircle;
      default: return Clock;
    }
  };

  const getAttendanceColor = (attendance: string) => {
    switch (attendance) {
      case "present": return "text-green-400";
      case "absent": return "text-red-400";
      case "pending": return "text-amber-400";
      default: return "text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prayer": return Calendar;
      case "workshop": return Users;
      case "education": return Star;
      case "social": return MessageSquare;
      default: return Calendar;
    }
  };

  const tabs = [
    { id: "registered", label: "Registered Events", icon: Calendar },
    { id: "attendance", label: "Attendance Status", icon: CheckCircle },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "feedback", label: "Event Feedback", icon: MessageSquare }
  ];

  const filteredEvents = registeredEvents.filter(registration => {
    const event = registration.event;
    if (!event) return false;
    
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || registration.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageLayout 
      title="My Events" 
      subtitle="Manage your event registrations and attendance"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              ×
            </Button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: "Registered Events", 
              value: registeredEvents.length.toString(), 
              icon: Calendar, 
              color: "text-primary" 
            },
            { 
              label: "Attended", 
              value: registeredEvents.filter(r => r.status === "attended").length.toString(), 
              icon: CheckCircle, 
              color: "text-green-400" 
            },
            { 
              label: "Certificates", 
              value: eventCertificates.length.toString(), 
              icon: Award, 
              color: "text-amber-400" 
            },
            { 
              label: "Pending Feedback", 
              value: registeredEvents.filter(r => r.status === "attended").length.toString(), 
              icon: MessageSquare, 
              color: "text-blue-400" 
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your events...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "registered" && (
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((registration) => {
                      const event = registration.event;
                      if (!event) return null;
                      
                      const TypeIcon = getTypeIcon(event.category?.name || 'general');
                      const AttendanceIcon = getAttendanceIcon(registration.attendance_status || 'pending');
                      
                      return (
                        <div 
                          key={registration.id}
                          className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <TypeIcon size={24} className="text-primary" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-display tracking-wide mb-2">{event.title}</h3>
                                  <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      {new Date(event.start_date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock size={14} />
                                      {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin size={14} />
                                      {event.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users size={14} />
                                      {event.category?.name || 'General'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                  <Badge className={cn("text-xs", getStatusColor(registration.status))}>
                                    {registration.status.toUpperCase()}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs">
                                    <AttendanceIcon size={14} className={getAttendanceColor(registration.attendance_status || 'pending')} />
                                    <span className={getAttendanceColor(registration.attendance_status || 'pending')}>
                                      {(registration.attendance_status || 'pending').charAt(0).toUpperCase() + (registration.attendance_status || 'pending').slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" className="border-border/50 hover:border-primary gap-1">
                                  <Eye size={14} />
                                  View Details
                                </Button>
                                
                                {registration.status === "confirmed" && (
                                  <Button size="sm" variant="outline" className="border-border/50 hover:border-primary gap-1">
                                    <Edit size={14} />
                                    Modify Registration
                                  </Button>
                                )}
                                
                                {registration.status === "attended" && (
                                  <Button size="sm" variant="outline" className="border-border/50 hover:border-primary gap-1">
                                    <Download size={14} />
                                    Certificate
                                  </Button>
                                )}
                                
                                {registration.status === "attended" && (
                                  <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                                    <MessageSquare size={14} />
                                    Give Feedback
                                  </Button>
                                )}
                                
                                <Button size="sm" variant="outline" className="border-border/50 hover:border-primary gap-1">
                                  <Share2 size={14} />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20">
                      <Calendar size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Registered Events</h3>
                      <p className="text-muted-foreground">Start registering for events to see them here.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "attendance" && (
                <div className="space-y-4">
                  <div className="bg-card rounded-xl p-6 border border-border/30">
                    <h3 className="text-lg font-display mb-4">Attendance Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        { 
                          label: "Present", 
                          count: registeredEvents.filter(r => r.status === "attended").length,
                          color: "text-green-400",
                          bg: "bg-green-500/10"
                        },
                        { 
                          label: "Absent", 
                          count: registeredEvents.filter(r => r.status === "no_show").length,
                          color: "text-red-400",
                          bg: "bg-red-500/10"
                        },
                        { 
                          label: "Pending", 
                          count: registeredEvents.filter(r => r.status === "registered").length,
                          color: "text-amber-400",
                          bg: "bg-amber-500/10"
                        }
                      ].map((stat) => (
                        <div key={stat.label} className={cn("p-4 rounded-lg", stat.bg)}>
                          <p className={cn("text-2xl font-display", stat.color)}>{stat.count}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {registeredEvents.map((registration) => {
                        const event = registration.event;
                        if (!event) return null;
                        
                        const AttendanceIcon = getAttendanceIcon(registration.attendance_status || 'pending');
                        return (
                          <div 
                            key={registration.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                          >
                            <div className="flex items-center gap-3">
                              <AttendanceIcon size={20} className={getAttendanceColor(registration.attendance_status || 'pending')} />
                              <div>
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.start_date).toLocaleDateString()} • {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <Badge className={cn("text-xs", getAttendanceColor(registration.attendance_status || 'pending'))}>
                              {(registration.attendance_status || 'pending').charAt(0).toUpperCase() + (registration.attendance_status || 'pending').slice(1)}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

          {activeTab === "certificates" && (
            <div className="space-y-4">
              {eventCertificates.length > 0 ? (
                <div className="grid gap-4">
                  {eventCertificates.map((cert) => (
                    <div 
                      key={cert.id}
                      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <Award size={24} className="text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg mb-1">{cert.eventTitle}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{cert.type}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Certificate ID: {cert.certificateId}</span>
                            <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                            <Download size={14} />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/50 gap-1">
                            <Share2 size={14} />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Award size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display mb-2">No Certificates Yet</h3>
                  <p className="text-muted-foreground">Complete events to earn certificates.</p>
                </div>
              )}
            </div>
          )}

              {activeTab === "feedback" && (
                <div className="space-y-4">
                  <div className="text-center py-20">
                    <MessageSquare size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-display mb-2">Event Feedback</h3>
                    <p className="text-muted-foreground">Share your experience and help us improve.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}