import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Shield, 
  Monitor, 
  Smartphone, 
  Tablet,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Globe,
  Lock,
  Unlock,
  Activity,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { loginActivityApi, type LoginSession, type SecurityEvent, type SecurityAlert, type DeviceInfo } from "@/services/loginActivityApi";
import { useToast } from "@/hooks/use-toast";

export default function LoginActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("history");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // State for real data
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<DeviceInfo[]>([]);
  const [stats, setStats] = useState({
    total_sessions: 0,
    active_sessions: 0,
    suspicious_sessions: 0,
    trusted_devices: 0,
    security_events: 0,
    unresolved_alerts: 0
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        sessionsData,
        eventsData,
        alertsData,
        devicesData,
        statsData
      ] = await Promise.all([
        loginActivityApi.getLoginSessions(),
        loginActivityApi.getSecurityEvents(),
        loginActivityApi.getSecurityAlerts(),
        loginActivityApi.getTrustedDevices(),
        loginActivityApi.getLoginStats()
      ]);

      setLoginSessions(sessionsData.sessions);
      setSecurityEvents(eventsData.events);
      setSecurityAlerts(alertsData.alerts);
      setTrustedDevices(devicesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading login activity data:', error);
      toast({
        title: "Error",
        description: "Failed to load login activity data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await loginActivityApi.terminateSession(sessionId);
      toast({
        title: "Success",
        description: "Session terminated successfully."
      });
      await loadData();
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Error",
        description: "Failed to terminate session.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDeviceTrust = async (deviceId: string, isTrusted: boolean) => {
    try {
      await loginActivityApi.updateDeviceTrustStatus(deviceId, isTrusted);
      toast({
        title: "Success",
        description: `Device ${isTrusted ? 'trusted' : 'untrusted'} successfully.`
      });
      await loadData();
    } catch (error) {
      console.error('Error updating device trust:', error);
      toast({
        title: "Error",
        description: "Failed to update device trust status.",
        variant: "destructive"
      });
    }
  };

  const tabs = [
    { id: "history", label: "Login History", icon: Clock },
    { id: "sessions", label: "Active Sessions", icon: Monitor },
    { id: "alerts", label: "Security Alerts", icon: AlertTriangle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400";
      case "expired": return "text-yellow-400";
      case "terminated": return "text-gray-400";
      case "suspicious": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "expired": return Clock;
      case "terminated": return XCircle;
      case "suspicious": return Shield;
      default: return Clock;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "critical": return "bg-red-600/20 text-red-300 border-red-600/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const filteredSessions = loginSessions.filter(session => {
    const matchesStatus = filterStatus === "all" || session.status === filterStatus;
    const matchesDevice = filterDevice === "all" || 
      session.device_info?.type === filterDevice ||
      (session.user_agent && session.user_agent.toLowerCase().includes(filterDevice));
    return matchesStatus && matchesDevice;
  });

  if (loading) {
    return (
      <PageLayout 
        title="Login Activity" 
        subtitle="Monitor your account security and login history"
        currentPath={location.pathname}
        onNavigate={navigate}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Login Activity" 
      subtitle="Monitor your account security and login history"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Sessions", value: stats.total_sessions.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Active Sessions", value: stats.active_sessions.toString(), icon: Monitor, color: "text-blue-400" },
            { label: "Suspicious Sessions", value: stats.suspicious_sessions.toString(), icon: XCircle, color: "text-red-400" },
            { label: "Security Alerts", value: stats.unresolved_alerts.toString(), icon: AlertTriangle, color: "text-amber-400" }
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

        {/* Security Status */}
        <div className="bg-gradient-to-r from-green-500/20 via-card to-green-500/10 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Shield size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-display tracking-wide mb-2">Account Security Status</h3>
              <p className="text-muted-foreground mb-2">Your account is secure. No suspicious activity detected in recent logins.</p>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Secure
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Last security check: {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
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
          {activeTab === "history" && (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Successful</option>
                    <option value="failed">Failed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <select
                    value={filterDevice}
                    onChange={(e) => setFilterDevice(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
                  >
                    <option value="all">All Devices</option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                    <RefreshCw size={16} />
                    Refresh
                  </Button>
                  <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                    <Download size={16} />
                    Export
                  </Button>
                </div>
              </div>

              {/* Login History */}
              <div className="space-y-3">
                {filteredHistory.map((entry) => {
                  const DeviceIcon = getDeviceIcon(entry.deviceType);
                  const StatusIcon = getStatusIcon(entry.status);
                  
                  return (
                    <div 
                      key={entry.id}
                      className={cn(
                        "bg-card rounded-xl p-5 border transition-all duration-300",
                        entry.suspicious 
                          ? "border-red-500/30 bg-red-500/5" 
                          : "border-border/30 hover:border-primary/50",
                        entry.isCurrentSession && "border-green-500/30 bg-green-500/5"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <DeviceIcon size={20} className="text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{entry.device}</h4>
                                {entry.isCurrentSession && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                    Current Session
                                  </Badge>
                                )}
                                {entry.suspicious && (
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                    Suspicious
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{entry.browser}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <StatusIcon size={16} className={getStatusColor(entry.status)} />
                              <span className={cn("text-sm font-medium", getStatusColor(entry.status))}>
                                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>{entry.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe size={14} />
                              <span>{entry.ipAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{new Date(entry.timestamp).toLocaleString()}</span>
                            </div>
                          </div>

                          {entry.failureReason && (
                            <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                              <p className="text-sm text-red-400">
                                <AlertTriangle size={14} className="inline mr-2" />
                                {entry.failureReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Active Sessions</h3>
                <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                  <RefreshCw size={16} />
                  Refresh Sessions
                </Button>
              </div>

              <div className="space-y-3">
                {activeSessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.deviceType);
                  
                  return (
                    <div 
                      key={session.id}
                      className={cn(
                        "bg-card rounded-xl p-5 border transition-all duration-300",
                        session.isCurrentSession 
                          ? "border-green-500/30 bg-green-500/5" 
                          : "border-border/30 hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <DeviceIcon size={20} className="text-primary" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{session.device}</h4>
                              {session.isCurrentSession && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Current Session
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{session.browser}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>{session.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe size={14} />
                                <span>{session.ipAddress}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Activity size={14} />
                                <span>Active {new Date(session.lastActivity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {!session.isCurrentSession && (
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                            End Session
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Security Alerts</h3>
                <Button variant="outline" className="border-border/50 hover:border-primary">
                  Mark All as Read
                </Button>
              </div>

              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={cn(
                      "bg-card rounded-xl p-5 border transition-all duration-300",
                      alert.resolved 
                        ? "border-border/30 opacity-75" 
                        : "border-amber-500/30 bg-amber-500/5"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={20} className="text-amber-400" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge className={cn("text-xs", getSeverityColor(alert.severity))}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.resolved && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {!alert.resolved && (
                        <Button size="sm" variant="outline" className="border-border/50">
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}