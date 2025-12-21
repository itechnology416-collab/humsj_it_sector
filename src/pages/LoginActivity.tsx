import { useState, useEffect } from "react";
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
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const loginHistory = [
  {
    id: 1,
    timestamp: "2024-12-21T16:30:00Z",
    device: "Windows PC",
    deviceType: "desktop",
    browser: "Chrome 120.0",
    location: "Addis Ababa, Ethiopia",
    ipAddress: "192.168.1.100",
    status: "success",
    isCurrentSession: true,
    suspicious: false
  },
  {
    id: 2,
    timestamp: "2024-12-21T08:15:00Z",
    device: "iPhone 15",
    deviceType: "mobile",
    browser: "Safari 17.0",
    location: "Addis Ababa, Ethiopia",
    ipAddress: "192.168.1.101",
    status: "success",
    isCurrentSession: false,
    suspicious: false
  },
  {
    id: 3,
    timestamp: "2024-12-20T19:45:00Z",
    device: "MacBook Pro",
    deviceType: "desktop",
    browser: "Firefox 121.0",
    location: "Addis Ababa, Ethiopia",
    ipAddress: "192.168.1.102",
    status: "success",
    isCurrentSession: false,
    suspicious: false
  },
  {
    id: 4,
    timestamp: "2024-12-20T14:22:00Z",
    device: "Android Phone",
    deviceType: "mobile",
    browser: "Chrome Mobile 120.0",
    location: "Dire Dawa, Ethiopia",
    ipAddress: "10.0.0.50",
    status: "failed",
    isCurrentSession: false,
    suspicious: true,
    failureReason: "Invalid password"
  },
  {
    id: 5,
    timestamp: "2024-12-19T22:10:00Z",
    device: "iPad Air",
    deviceType: "tablet",
    browser: "Safari 17.0",
    location: "Addis Ababa, Ethiopia",
    ipAddress: "192.168.1.103",
    status: "success",
    isCurrentSession: false,
    suspicious: false
  },
  {
    id: 6,
    timestamp: "2024-12-19T11:30:00Z",
    device: "Unknown Device",
    deviceType: "unknown",
    browser: "Unknown Browser",
    location: "Lagos, Nigeria",
    ipAddress: "41.203.72.45",
    status: "blocked",
    isCurrentSession: false,
    suspicious: true,
    failureReason: "Suspicious location"
  }
];

const activeSessions = [
  {
    id: 1,
    device: "Windows PC",
    deviceType: "desktop",
    browser: "Chrome 120.0",
    location: "Addis Ababa, Ethiopia",
    ipAddress: "192.168.1.100",
    lastActivity: "2024-12-21T16:30:00Z",
    isCurrentSession: true
  },
  {
    id: 2,
    device: "iPhone 15",
    deviceType: "mobile",
    browser: "Safari 17.0",
    location: "Addis Ababa, Ethiopia",
    ipAddress: "192.168.1.101",
    lastActivity: "2024-12-21T15:45:00Z",
    isCurrentSession: false
  }
];

const securityAlerts = [
  {
    id: 1,
    type: "suspicious_login",
    title: "Suspicious login attempt blocked",
    description: "Login attempt from unusual location (Lagos, Nigeria) was automatically blocked",
    timestamp: "2024-12-19T11:30:00Z",
    severity: "high",
    resolved: true
  },
  {
    id: 2,
    type: "failed_login",
    title: "Multiple failed login attempts",
    description: "3 consecutive failed login attempts from Dire Dawa, Ethiopia",
    timestamp: "2024-12-20T14:22:00Z",
    severity: "medium",
    resolved: false
  },
  {
    id: 3,
    type: "new_device",
    title: "New device login",
    description: "Successful login from a new iPad Air device",
    timestamp: "2024-12-19T22:10:00Z",
    severity: "low",
    resolved: true
  }
];

export default function LoginActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("history");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");

  const tabs = [
    { id: "history", label: "Login History", icon: Clock },
    { id: "sessions", label: "Active Sessions", icon: Monitor },
    { id: "alerts", label: "Security Alerts", icon: AlertTriangle }
  ];

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop": return Monitor;
      case "mobile": return Smartphone;
      case "tablet": return Tablet;
      default: return Globe;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400";
      case "failed": return "text-red-400";
      case "blocked": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return CheckCircle;
      case "failed": return XCircle;
      case "blocked": return Shield;
      default: return Clock;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const filteredHistory = loginHistory.filter(entry => {
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
    const matchesDevice = filterDevice === "all" || entry.deviceType === filterDevice;
    return matchesStatus && matchesDevice;
  });

  const successfulLogins = loginHistory.filter(entry => entry.status === "success").length;
  const failedAttempts = loginHistory.filter(entry => entry.status === "failed" || entry.status === "blocked").length;
  const suspiciousActivity = loginHistory.filter(entry => entry.suspicious).length;
  const uniqueLocations = [...new Set(loginHistory.map(entry => entry.location))].length;

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
            { label: "Successful Logins", value: successfulLogins.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Failed Attempts", value: failedAttempts.toString(), icon: XCircle, color: "text-red-400" },
            { label: "Active Sessions", value: activeSessions.length.toString(), icon: Monitor, color: "text-blue-400" },
            { label: "Security Alerts", value: securityAlerts.filter(a => !a.resolved).length.toString(), icon: AlertTriangle, color: "text-amber-400" }
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