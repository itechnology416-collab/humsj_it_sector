import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  BarChart3,
  RefreshCw,
  Award,
  Target,
  MapPin,
  StickyNote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/contexts/AuthContext";

const eventTypeColors = {
  friday: "bg-green-500/20 text-green-600",
  dars: "bg-blue-500/20 text-blue-600",
  workshop: "bg-purple-500/20 text-purple-600",
  special: "bg-primary/20 text-primary",
  meeting: "bg-orange-500/20 text-orange-600",
  conference: "bg-pink-500/20 text-pink-600"
};

export default function MyAttendancePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'quarter' | 'year'>('month');

  const {
    attendanceHistory,
    attendanceSummary,
    isLoadingHistory,
    isLoadingSummary,
    refetchHistory,
    refetchSummary
  } = useUserAttendance();

  // Calculate date range for summary
  const getDateRange = () => {
    const now = new Date();
    let dateFrom: string | undefined;
    
    switch (dateRange) {
      case 'month': {
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        break;
      }
      case 'quarter': {
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        dateFrom = new Date(now.getFullYear(), quarterStart, 1).toISOString();
        break;
      }
      case 'year': {
        dateFrom = new Date(now.getFullYear(), 0, 1).toISOString();
        break;
      }
      default: {
        dateFrom = undefined;
      }
    }
    
    return dateFrom;
  };

  const getAttendanceStreak = () => {
    if (!attendanceHistory || attendanceHistory.length === 0) return 0;
    
    let streak = 0;
    const sortedHistory = [...attendanceHistory]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    for (const record of sortedHistory) {
      if (record.attended) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getAttendanceGrade = (rate: number) => {
    if (rate >= 95) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-500/20' };
    if (rate >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-500/20' };
    if (rate >= 85) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-500/20' };
    if (rate >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-500/20' };
    if (rate >= 75) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-500/20' };
    if (rate >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-500/20' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-500/20' };
  };

  const streak = getAttendanceStreak();
  const grade = attendanceSummary ? getAttendanceGrade(attendanceSummary.attendance_rate) : null;

  return (
    <ProtectedPageLayout 
      title="My Attendance" 
      subtitle="Track your event participation and attendance history"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                  <UserCheck size={32} className="text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-display">
                    Assalamu Alaikum, {profile?.full_name || "Member"}!
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Here's your attendance overview and participation history
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    refetchHistory();
                    refetchSummary();
                  }}
                  disabled={isLoadingHistory || isLoadingSummary}
                >
                  <RefreshCw size={16} className={cn("mr-2", (isLoadingHistory || isLoadingSummary) && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Date Range Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">View Period:</span>
              <div className="flex gap-2">
                {[
                  { key: 'month', label: 'This Month' },
                  { key: 'quarter', label: 'This Quarter' },
                  { key: 'year', label: 'This Year' },
                  { key: 'all', label: 'All Time' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={dateRange === key ? "default" : "outline"}
                    onClick={() => setDateRange(key as unknown)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display text-foreground">
                    {isLoadingSummary ? "..." : attendanceSummary?.total_events || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-display text-foreground">
                    {isLoadingSummary ? "..." : attendanceSummary?.attended_events || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Attended</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-display text-foreground">{streak}</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", grade?.bg || "bg-muted")}>
                  <Award className={cn("w-6 h-6", grade?.color || "text-muted-foreground")} />
                </div>
                <div>
                  <p className={cn("text-2xl font-display", grade?.color || "text-foreground")}>
                    {isLoadingSummary ? "..." : grade?.grade || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isLoadingSummary ? "..." : `${attendanceSummary?.attendance_rate || 0}% Rate`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Attendance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : !attendanceHistory || attendanceHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">No attendance records found</p>
                <p className="text-sm">Your attendance will appear here once you attend events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendanceHistory.map((record, index) => (
                  <div
                    key={record.id}
                    className={cn(
                      "p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-all animate-slide-up",
                      record.attended ? "bg-green-50/50 dark:bg-green-950/20" : "bg-red-50/50 dark:bg-red-950/20"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            record.attended ? "bg-green-500/20" : "bg-red-500/20"
                          )}>
                            {record.attended ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">
                              {record.event?.title || 'Unknown Event'}
                            </h4>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {record.event?.date ? new Date(record.event.date).toLocaleDateString() : 'N/A'}
                              </div>
                              
                              {record.event?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {record.event.location}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                Marked: {new Date(record.marked_at).toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={cn(
                                "text-xs",
                                eventTypeColors[record.event?.type as keyof typeof eventTypeColors] || "bg-muted"
                              )}>
                                {record.event?.type || 'unknown'}
                              </Badge>
                              
                              <Badge className={cn(
                                "text-xs",
                                record.attended 
                                  ? "bg-green-500/20 text-green-600" 
                                  : "bg-red-500/20 text-red-600"
                              )}>
                                {record.attended ? "Present" : "Absent"}
                              </Badge>
                            </div>
                            
                            {record.notes && (
                              <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <StickyNote size={12} className="text-muted-foreground" />
                                  <span className="font-medium">Note:</span>
                                </div>
                                <p>{record.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {record.check_in_time && (
                          <div className="text-xs text-muted-foreground mb-1">
                            <span className="text-green-600">Check-in:</span><br />
                            {new Date(record.check_in_time).toLocaleTimeString()}
                          </div>
                        )}
                        {record.check_out_time && (
                          <div className="text-xs text-muted-foreground">
                            <span className="text-red-600">Check-out:</span><br />
                            {new Date(record.check_out_time).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Tips */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Improve Your Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Tips for Better Attendance:</h4>
                <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• Set reminders for upcoming events</li>
                  <li>• Plan your schedule in advance</li>
                  <li>• Arrive early to avoid missing check-in</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Attendance Benefits:</h4>
                <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• Build stronger community connections</li>
                  <li>• Gain knowledge and spiritual growth</li>
                  <li>• Earn recognition for participation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}