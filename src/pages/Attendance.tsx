import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Search,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventType: string;
  userId: string;
  userName: string;
  userEmail: string;
  attended: boolean;
  markedAt?: string;
  markedBy?: string;
}

interface EventAttendance {
  id: string;
  title: string;
  date: string;
  type: string;
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Mock attendance data
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Friday Jumu\'ah Prayer',
    eventDate: '2024-12-22',
    eventType: 'friday',
    userId: 'user1',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed@hu.edu.et',
    attended: true,
    markedAt: '2024-12-22T12:45:00Z',
    markedBy: 'admin'
  },
  {
    id: '2',
    eventId: '1',
    eventTitle: 'Friday Jumu\'ah Prayer',
    eventDate: '2024-12-22',
    eventType: 'friday',
    userId: 'user2',
    userName: 'Fatima Ali',
    userEmail: 'fatima@hu.edu.et',
    attended: true,
    markedAt: '2024-12-22T12:45:00Z',
    markedBy: 'admin'
  },
  {
    id: '3',
    eventId: '2',
    eventTitle: 'Islamic Tech Workshop',
    eventDate: '2024-12-25',
    eventType: 'workshop',
    userId: 'user1',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed@hu.edu.et',
    attended: false,
    markedAt: '2024-12-25T16:30:00Z',
    markedBy: 'admin'
  }
];

const mockEventAttendance: EventAttendance[] = [
  {
    id: '1',
    title: 'Friday Jumu\'ah Prayer',
    date: '2024-12-22',
    type: 'friday',
    totalRegistered: 145,
    totalAttended: 132,
    attendanceRate: 91,
    status: 'completed'
  },
  {
    id: '2',
    title: 'Islamic Tech Workshop',
    date: '2024-12-25',
    type: 'workshop',
    totalRegistered: 30,
    totalAttended: 25,
    attendanceRate: 83,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Dars - Quran Study Circle',
    date: '2024-12-24',
    type: 'dars',
    totalRegistered: 50,
    totalAttended: 42,
    attendanceRate: 84,
    status: 'completed'
  }
];

const eventTypeColors = {
  friday: "bg-green-500/20 text-green-600",
  dars: "bg-blue-500/20 text-blue-600",
  workshop: "bg-purple-500/20 text-purple-600",
  special: "bg-primary/20 text-primary",
  meeting: "bg-orange-500/20 text-orange-600",
  conference: "bg-pink-500/20 text-pink-600"
};

export default function AttendancePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { events, markAttendance } = useEvents();
  const { isAdmin } = useAuth();
  
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'attended' | 'absent'>('all');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [eventAttendance, setEventAttendance] = useState<EventAttendance[]>(mockEventAttendance);
  const [loading, setLoading] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      toast.error("Access denied. Admin privileges required.");
    }
  }, [isAdmin, navigate]);

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesEvent = !selectedEvent || record.eventId === selectedEvent;
    const matchesSearch = !searchQuery || 
      record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAttendance = attendanceFilter === 'all' || 
      (attendanceFilter === 'attended' && record.attended) ||
      (attendanceFilter === 'absent' && !record.attended);
    
    return matchesEvent && matchesSearch && matchesAttendance;
  });

  const handleMarkAttendance = async (recordId: string, attended: boolean) => {
    setLoading(true);
    try {
      // Update local state
      setAttendanceRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, attended, markedAt: new Date().toISOString() }
          : record
      ));
      
      toast.success(`Attendance ${attended ? 'marked' : 'unmarked'} successfully`);
    } catch (error) {
      toast.error('Failed to update attendance');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = () => {
    const total = filteredRecords.length;
    const attended = filteredRecords.filter(r => r.attended).length;
    const absent = total - attended;
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
    
    return { total, attended, absent, rate };
  };

  const stats = getAttendanceStats();

  if (!isAdmin) return null;

  return (
    <PageLayout 
      title="Attendance Tracking" 
      subtitle="Monitor and manage event attendance"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.attended}</p>
                <p className="text-sm text-muted-foreground">Attended</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.absent}</p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.rate}%</p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
            
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
            
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="attended">Attended</option>
              <option value="absent">Absent</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Event Attendance Overview */}
        <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <h3 className="font-display text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Event Attendance Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventAttendance.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge className={cn("text-xs", eventTypeColors[event.type as keyof typeof eventTypeColors])}>
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registered:</span>
                      <span>{event.totalRegistered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attended:</span>
                      <span className="text-green-600">{event.totalAttended}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className={cn(
                        "font-semibold",
                        event.attendanceRate >= 90 ? "text-green-600" :
                        event.attendanceRate >= 70 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {event.attendanceRate}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          event.attendanceRate >= 90 ? "bg-green-500" :
                          event.attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${event.attendanceRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <h3 className="font-display text-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Attendance Records ({filteredRecords.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Users className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No attendance records found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/30">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Member</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Event</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Marked</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{record.userName}</p>
                          <p className="text-xs text-muted-foreground">{record.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{record.eventTitle}</p>
                          <Badge className={cn("text-xs mt-1", eventTypeColors[record.eventType as keyof typeof eventTypeColors])}>
                            {record.eventType}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-muted-foreground" />
                          {new Date(record.eventDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={cn(
                          "text-xs",
                          record.attended 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-red-500/20 text-red-600"
                        )}>
                          {record.attended ? "Present" : "Absent"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {record.markedAt && (
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(record.markedAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={record.attended ? "outline" : "default"}
                            onClick={() => handleMarkAttendance(record.id, true)}
                            className={cn(
                              "text-xs",
                              record.attended ? "border-green-500/30 text-green-600" : "bg-green-600 hover:bg-green-700 text-white"
                            )}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={!record.attended ? "outline" : "default"}
                            onClick={() => handleMarkAttendance(record.id, false)}
                            className={cn(
                              "text-xs",
                              !record.attended ? "border-red-500/30 text-red-600" : "bg-red-600 hover:bg-red-700 text-white"
                            )}
                          >
                            <XCircle size={14} className="mr-1" />
                            Absent
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}