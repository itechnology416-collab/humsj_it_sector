import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Eye,
  Share,
  Printer,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell
} from "recharts";

const membershipData = [
  { month: "Jan", total: 180, new: 15, active: 165 },
  { month: "Feb", total: 195, new: 18, active: 178 },
  { month: "Mar", total: 220, new: 25, active: 200 },
  { month: "Apr", total: 245, new: 28, active: 225 },
  { month: "May", total: 270, new: 30, active: 250 },
  { month: "Jun", total: 295, new: 25, active: 275 },
];

const eventAttendanceData = [
  { name: "Friday Prayer", attendance: 180, capacity: 200, percentage: 90 },
  { name: "Dars/Halaqa", attendance: 85, capacity: 100, percentage: 85 },
  { name: "IT Workshop", attendance: 45, capacity: 50, percentage: 90 },
  { name: "Special Events", attendance: 120, capacity: 150, percentage: 80 },
];

const collegeDistribution = [
  { name: "Computing", value: 45, color: "#e50914" },
  { name: "Business", value: 38, color: "#ff4d4d" },
  { name: "Health", value: 32, color: "#ff6b6b" },
  { name: "Agriculture", value: 28, color: "#ff8080" },
  { name: "Engineering", value: 42, color: "#ffb3b3" },
  { name: "Others", value: 35, color: "#ffd6d6" },
];

const communicationStats = [
  { type: "Announcements", sent: 24, delivered: 23, opened: 18, rate: 78 },
  { type: "Email Campaigns", sent: 12, delivered: 12, opened: 9, rate: 75 },
  { type: "SMS Notifications", sent: 36, delivered: 35, opened: 32, rate: 91 },
  { type: "Push Notifications", sent: 48, delivered: 46, opened: 38, rate: 83 },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In real implementation, this would trigger a download
    }, 2000);
  };

  const reportTypes = [
    { value: "overview", label: "System Overview", icon: BarChart3 },
    { value: "membership", label: "Membership Report", icon: Users },
    { value: "events", label: "Events Analysis", icon: Calendar },
    { value: "communication", label: "Communication Stats", icon: Mail },
    { value: "engagement", label: "Engagement Metrics", icon: Activity },
  ];

  const kpiCards = [
    {
      title: "Total Members",
      value: "295",
      change: "+8.5%",
      trend: "up",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Event Attendance Rate",
      value: "86%",
      change: "+5.2%",
      trend: "up",
      icon: Calendar,
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    {
      title: "Communication Reach",
      value: "92%",
      change: "+2.1%",
      trend: "up",
      icon: Mail,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      title: "Content Engagement",
      value: "74%",
      change: "-1.3%",
      trend: "down",
      icon: Eye,
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
  ];

  if (!isAdmin) return null;

  return (
    <PageLayout 
      title="Reports & Analytics" 
      subtitle="Comprehensive system insights and reports"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
              <FileText size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Analytics Dashboard</h2>
              <p className="text-sm text-muted-foreground">Generate comprehensive reports and insights</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-card border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90 shadow-red gap-2"
            >
              {isGenerating ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isGenerating ? "Generating..." : "Export Report"}
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedReport(type.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedReport === type.value
                  ? "bg-primary text-primary-foreground shadow-red"
                  : "bg-card text-muted-foreground hover:bg-secondary border border-border/30"
              )}
            >
              <type.icon size={16} />
              {type.label}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <div 
              key={kpi.title}
              className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <kpi.icon size={24} className={kpi.color} />
                </div>
                <span className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  kpi.trend === "up" ? "text-green-400" : "text-red-400"
                )}>
                  {kpi.trend === "up" ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-3xl font-display mb-1">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Membership Growth */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl tracking-wide flex items-center gap-2">
                <Users size={20} className="text-primary" />
                Membership Growth
              </h3>
              <Button variant="ghost" size="sm">
                <Eye size={16} className="mr-2" />
                View Details
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={membershipData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e50914" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#e50914" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#ff6b6b" 
                    strokeWidth={1}
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* College Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl tracking-wide flex items-center gap-2">
                <PieChart size={20} className="text-primary" />
                College Distribution
              </h3>
              <Button variant="ghost" size="sm">
                <Share size={16} className="mr-2" />
                Share
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={collegeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {collegeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {collegeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Attendance Analysis */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl tracking-wide flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Event Attendance Analysis
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Printer size={16} className="mr-2" />
                Print
              </Button>
              <Button variant="ghost" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="attendance" fill="#e50914" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" fill="#ff6b6b" radius={[4, 4, 0, 0]} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {eventAttendanceData.map((event) => (
              <div key={event.name} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{event.name}</h4>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    event.percentage >= 90 ? "bg-green-500/20 text-green-400" :
                    event.percentage >= 80 ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    {event.percentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.attendance}/{event.capacity} attendees
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Statistics */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl tracking-wide flex items-center gap-2">
              <Mail size={20} className="text-primary" />
              Communication Performance
            </h3>
            <Button variant="ghost" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Refresh Data
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Channel</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Sent</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Delivered</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Opened</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Rate</th>
                </tr>
              </thead>
              <tbody>
                {communicationStats.map((stat) => (
                  <tr key={stat.type} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{stat.type}</td>
                    <td className="py-3 px-4 text-right">{stat.sent}</td>
                    <td className="py-3 px-4 text-right">{stat.delivered}</td>
                    <td className="py-3 px-4 text-right">{stat.opened}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        stat.rate >= 85 ? "bg-green-500/20 text-green-400" :
                        stat.rate >= 75 ? "bg-amber-500/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      )}>
                        {stat.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-3 border-border/30 hover:border-primary/50 hover:bg-secondary/50 group"
            onClick={() => navigate("/analytics")}
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <BarChart3 size={28} className="text-primary" />
            </div>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              Detailed Analytics
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-3 border-border/30 hover:border-primary/50 hover:bg-secondary/50 group"
            onClick={() => navigate("/user-management")}
          >
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <Users size={28} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              User Management
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-3 border-border/30 hover:border-primary/50 hover:bg-secondary/50 group"
            onClick={() => navigate("/communication")}
          >
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <Mail size={28} className="text-green-400" />
            </div>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              Communication Hub
            </span>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}