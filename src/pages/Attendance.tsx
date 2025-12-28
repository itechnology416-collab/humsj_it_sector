import { useState, useEffect , useCallback} from "react";
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
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MapPin,
  StickyNote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAttendance } from "@/hooks/useAttendance";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AttendanceFilters } from "@/services/attendanceApi";

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
  const { events } = useEvents();
  const { user, isAdmin } = useAuth();
  
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'attended' | 'absent'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Build filters for API
  const filters: AttendanceFilters = {
    event_id: selectedEvent || undefined,
    attended: attendanceFilter === 'all' ? undefined : attendanceFilter === 'attended',
    search: searchQuery || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit: 100
  };

  const {
    attendanceRecords,
    eventStats,
    isLoadingRecords,
    isLoadingStats,
    isMarkingAttendance,
    isBulkUpdating,
    isDeleting,
    markAttendance,
    bulkUpdateAttendance,
    deleteRecord,
    exportAttendanceData,
    refetchRecords,
    getAttendanceStats
  } = useAttendance(filters);

  // Redirect non-admins to user view
  useEffect(() => {
    if (!isAdmin) {
      navigate("/my-attendance");
      toast.error("Access denied. Admin privileges required.");
    }
  }, [isAdmin, navigate]);

  const handleMarkAttendance = async (recordId: string, eventId: string, userId: string, attended: boolean) => {
    markAttendance(eventId, userId, attended, {
      notes: `Marked by admin at ${new Date().toLocaleString()}`
    });
  };

  const handleBulkMarkAttendance = (attended: boolean) => {
    if (selectedRecords.length === 0) {
      toast.error("Please select records to update");
      return;
    }

    const recordsToUpdate = attendanceRecords
      .filter(record => selectedRecords.includes(record.id))
      .map(record => ({
        user_id: record.user_id,
        attended,
        notes: `Bulk ${attended ? 'marked present' : 'marked absent'} by admin`
      }));

    if (recordsToUpdate.length > 0 && selectedEvent) {
      bulkUpdateAttendance(selectedEvent, recordsToUpdate);
      setSelectedRecords([]);
      setShowBulkActions(false);
    }
  };

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === attendanceRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(attendanceRecords.map(record => record.id));
    }
  };

  const stats = getAttendanceStats();

  if (!isAdmin) return null;

  return (
    <PageLayout 
      title="Attendance Management" 
      subtitle="Monitor and manage event attendance with real-time tracking"
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
                <p className="text-sm text-muted-foreground">Present</p>
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

        {/* Filters and Actions */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <div className="space-y-4">
            {/* Search and Basic Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by member name, email, or event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
              
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer min-w-[200px]"
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
                onChange={(e) => setAttendanceFilter(e.target.value as unknown)}
                className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="attended">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            {/* Date Range and Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-background/50 border-border text-sm"
                  placeholder="From date"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-background/50 border-border text-sm"
                  placeholder="To date"
                />
              </div>

              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportAttendanceData(filters)}
                  disabled={isLoadingRecords}
                >
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refetchRecords}
                  disabled={isLoadingRecords}
                >
                  <RefreshCw size={16} className={cn("mr-2", isLoadingRecords && "animate-spin")} />
                  Refresh
                </Button>

                {selectedRecords.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowBulkActions(!showBulkActions)}
                  >
                    <Edit size={16} className="mr-2" />
                    Bulk Actions ({selectedRecords.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && selectedRecords.length > 0 && (
              <div className="flex gap-2 p-4 bg-muted/30 rounded-lg border border-border/30">
                <Button 
                  size="sm"
                  onClick={() => handleBulkMarkAttendance(true)}
                  disabled={isBulkUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserCheck size={14} className="mr-1" />
                  Mark Present
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleBulkMarkAttendance(false)}
                  disabled={isBulkUpdating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <UserX size={14} className="mr-1" />
                  Mark Absent
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedRecords([]);
                    setShowBulkActions(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
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
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : eventStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No event statistics available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventStats.map((event) => (
                  <div
                    key={event.event_id}
                    className="p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedEvent(event.event_id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-sm line-clamp-2">{event.event_title}</h4>
                      <Badge className={cn("text-xs ml-2", eventTypeColors[event.event_type as keyof typeof eventTypeColors] || "bg-muted")}>
                        {event.event_type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registered:</span>
                        <span>{event.total_registered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Attended:</span>
                        <span className="text-green-600">{event.total_attended}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className={cn(
                          "font-semibold",
                          event.attendance_rate >= 90 ? "text-green-600" :
                          event.attendance_rate >= 70 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {event.attendance_rate}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all",
                            event.attendance_rate >= 90 ? "bg-green-500" :
                            event.attendance_rate >= 70 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${event.attendance_rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Attendance Records ({attendanceRecords.length})
              </h3>
              
              {attendanceRecords.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === attendanceRecords.length}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">Select All</span>
                </div>
              )}
            </div>
          </div>
          
          {isLoadingRecords ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Users className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No attendance records found</p>
              <p className="text-sm">Try adjusting your filters or create new attendance records</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/30">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-semibold text-muted-foreground w-12">
                      <input
                        type="checkbox"
                        checked={selectedRecords.length === attendanceRecords.length}
                        onChange={handleSelectAll}
                        className="rounded border-border"
                      />
                    </th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Member</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Event</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Check In/Out</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Marked By</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className={cn(
                        "border-b border-border/20 hover:bg-muted/20 transition-colors animate-slide-up",
                        selectedRecords.includes(record.id) && "bg-primary/5"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {record.user?.avatar_url ? (
                            <img 
                              src={record.user.avatar_url} 
                              alt={record.user.full_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {record.user?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{record.user?.full_name || 'Unknown User'}</p>
                            <p className="text-xs text-muted-foreground">{record.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{record.event?.title || 'Unknown Event'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn("text-xs", eventTypeColors[record.event?.type as keyof typeof eventTypeColors] || "bg-muted")}>
                              {record.event?.type || 'unknown'}
                            </Badge>
                            {record.event?.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin size={10} />
                                <span className="truncate max-w-20">{record.event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-muted-foreground" />
                          {record.event?.date ? new Date(record.event.date).toLocaleDateString() : 'N/A'}
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
                        <div className="text-xs text-muted-foreground space-y-1">
                          {record.check_in_time && (
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">In:</span>
                              {new Date(record.check_in_time).toLocaleTimeString()}
                            </div>
                          )}
                          {record.check_out_time && (
                            <div className="flex items-center gap-1">
                              <span className="text-red-600">Out:</span>
                              {new Date(record.check_out_time).toLocaleTimeString()}
                            </div>
                          )}
                          {!record.check_in_time && !record.check_out_time && (
                            <span>No check-in data</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-muted-foreground">
                          <div>{record.marked_by_user?.full_name || 'System'}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} />
                            {new Date(record.marked_at).toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={record.attended ? "outline" : "default"}
                            onClick={() => handleMarkAttendance(record.id, record.event_id, record.user_id, true)}
                            disabled={isMarkingAttendance}
                            className={cn(
                              "text-xs h-7 px-2",
                              record.attended ? "border-green-500/30 text-green-600 hover:bg-green-50" : "bg-green-600 hover:bg-green-700 text-white"
                            )}
                          >
                            <CheckCircle size={12} className="mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={!record.attended ? "outline" : "default"}
                            onClick={() => handleMarkAttendance(record.id, record.event_id, record.user_id, false)}
                            disabled={isMarkingAttendance}
                            className={cn(
                              "text-xs h-7 px-2",
                              !record.attended ? "border-red-500/30 text-red-600 hover:bg-red-50" : "bg-red-600 hover:bg-red-700 text-white"
                            )}
                          >
                            <XCircle size={12} className="mr-1" />
                            Absent
                          </Button>
                          
                          {record.notes && (
                            <div className="relative group">
                              <StickyNote size={14} className="text-muted-foreground cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {record.notes}
                              </div>
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteRecord(record.id)}
                            disabled={isDeleting}
                            className="text-xs h-7 px-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={12} />
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