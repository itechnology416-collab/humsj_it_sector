import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSystemMonitoring } from "@/hooks/useSystemMonitoring";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Shield, 
  Activity, 
  Database, 
  Server, 
  Wifi, 
  Mail, 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  TrendingUp,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SystemService {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: string;
  responseTime: string;
  lastChecked: string;
  icon: any;
  description: string;
}

export default function SystemStatus() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    logs,
    metrics,
    overview,
    recentAlerts,
    loading,
    error,
    useMockData,
    fetchLogs,
    fetchMetrics,
    clearOldLogs,
    refetch
  } = useSystemMonitoring();
  
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    // Simulate fetching system status
    const fetchSystemStatus = () => {
      setLoading(true);
      setTimeout(() => {
        setServices([
          {
            name: "Database",
            status: "operational",
            uptime: "99.9%",
            responseTime: "12ms",
            lastChecked: "2 minutes ago",
            icon: Database,
            description: "Primary PostgreSQL database cluster"
          },
          {
            name: "API Services",
            status: "operational",
            uptime: "99.8%",
            responseTime: "45ms",
            lastChecked: "1 minute ago",
            icon: Server,
            description: "REST API and GraphQL endpoints"
          },
          {
            name: "Authentication",
            status: "operational",
            uptime: "100%",
            responseTime: "23ms",
            lastChecked: "30 seconds ago",
            icon: Shield,
            description: "Supabase Auth service"
          },
          {
            name: "File Storage",
            status: "operational",
            uptime: "99.7%",
            responseTime: "89ms",
            lastChecked: "1 minute ago",
            icon: Cloud,
            description: "Document and media storage"
          },
          {
            name: "Email Service",
            status: "degraded",
            uptime: "95.2%",
            responseTime: "234ms",
            lastChecked: "5 minutes ago",
            icon: Mail,
            description: "SMTP email delivery service"
          },
          {
            name: "CDN",
            status: "operational",
            uptime: "99.9%",
            responseTime: "15ms",
            lastChecked: "1 minute ago",
            icon: Wifi,
            description: "Content delivery network"
          }
        ]);
        setLoading(false);
        setLastUpdate(new Date());
      }, 1000);
    };

    fetchSystemStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'degraded': return 'text-amber-400';
      case 'outage': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20';
      case 'degraded': return 'bg-amber-500/20';
      case 'outage': return 'bg-red-500/20';
      default: return 'bg-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      default: return Activity;
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'operational' 
    : services.some(s => s.status === 'outage') 
    ? 'outage' 
    : 'degraded';

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <PageLayout 
      title="System Status" 
      subtitle="Real-time system health monitoring"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Overall Status */}
        <div className={cn(
          "relative overflow-hidden rounded-xl p-6 border",
          overallStatus === 'operational' ? "bg-green-500/10 border-green-500/30" :
          overallStatus === 'degraded' ? "bg-amber-500/10 border-amber-500/30" :
          "bg-red-500/10 border-red-500/30"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center",
                getStatusBg(overallStatus)
              )}>
                {overallStatus === 'operational' && <CheckCircle size={32} className="text-green-400" />}
                {overallStatus === 'degraded' && <AlertTriangle size={32} className="text-amber-400" />}
                {overallStatus === 'outage' && <XCircle size={32} className="text-red-400" />}
              </div>
              <div>
                <h2 className="text-2xl font-display tracking-wide">
                  {overallStatus === 'operational' && "All Systems Operational"}
                  {overallStatus === 'degraded' && "Some Systems Degraded"}
                  {overallStatus === 'outage' && "System Outage Detected"}
                </h2>
                <p className="text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const StatusIcon = getStatusIcon(service.status);
            return (
              <div 
                key={service.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", getStatusBg(service.status))}>
                      <service.icon size={24} className={getStatusColor(service.status)} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg">{service.name}</h3>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <StatusIcon size={20} className={getStatusColor(service.status)} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={cn("text-sm font-medium capitalize", getStatusColor(service.status))}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">{service.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Checked</span>
                    <span className="text-sm font-medium">{service.lastChecked}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              {[
                { label: "Average Response Time", value: "45ms", change: "-12%" },
                { label: "Requests per Minute", value: "1,247", change: "+8%" },
                { label: "Error Rate", value: "0.02%", change: "-45%" },
                { label: "Active Users", value: "342", change: "+15%" }
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.value}</span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-md",
                      metric.change.startsWith('+') ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Recent Incidents
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: "Email service degradation",
                  time: "2 hours ago",
                  status: "resolved",
                  duration: "45 minutes"
                },
                {
                  title: "Database connection timeout",
                  time: "1 day ago",
                  status: "resolved",
                  duration: "12 minutes"
                },
                {
                  title: "CDN cache refresh",
                  time: "3 days ago",
                  status: "resolved",
                  duration: "5 minutes"
                }
              ].map((incident, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{incident.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {incident.time} • Duration: {incident.duration}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-green-500/20 text-green-400">
                    {incident.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}