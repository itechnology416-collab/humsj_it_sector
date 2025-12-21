import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAI } from "@/contexts/AIContext";
import { PageLayout } from "@/components/layout/PageLayout";
import AdminAIInsights from "@/components/ai/AdminAIInsights";
import AdminMemberAnalytics from "@/components/ai/AdminMemberAnalytics";
import SmartRecommendations from "@/components/ai/SmartRecommendations";
import { 
  Users, 
  Shield, 
  Activity, 
  TrendingUp,
  Calendar,
  Settings,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  ArrowLeft,
  Sparkles,
  Brain,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const userGrowthData = [
  { month: "Jul", users: 120 },
  { month: "Aug", users: 145 },
  { month: "Sep", users: 280 },
  { month: "Oct", users: 310 },
  { month: "Nov", users: 350 },
  { month: "Dec", users: 420 },
];

const roleDistribution = [
  { name: "Active Users", value: 380, color: "#e50914" },
  { name: "Coordinators", value: 25, color: "#ff4d4d" },
  { name: "Leaders", value: 10, color: "#ff6b6b" },
  { name: "Admins", value: 5, color: "#ff8080" },
];

const recentActivities = [
  { id: 1, action: "New user registration", user: "Ahmed Hassan", time: "5 mins ago", type: "success" },
  { id: 2, action: "Event created", user: "Fatima Ali", time: "1 hour ago", type: "info" },
  { id: 3, action: "Content published", user: "Mohammed Ibrahim", time: "2 hours ago", type: "info" },
  { id: 4, action: "System alert", user: "System", time: "3 hours ago", type: "warning" },
];

const pendingTasks = [
  { id: 1, title: "Review new applications", count: 12, priority: "high" },
  { id: 2, title: "Approve content submissions", count: 5, priority: "medium" },
  { id: 3, title: "Update event schedules", count: 3, priority: "low" },
];

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toggleAIAssistant, aiInsights } = useAI();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeAITab, setActiveAITab] = useState("insights");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <PageLayout 
      title="Admin Panel" 
      subtitle="System overview and management"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Enhanced Header with Back to Dashboard */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
            <div className="h-8 w-px bg-border/50"></div>
            <div>
              <h2 className="text-2xl font-display tracking-wide flex items-center gap-2">
                <Shield size={24} className="text-primary animate-pulse" />
                Admin Control Center
              </h2>
              <p className="text-sm text-muted-foreground">Manage your organization efficiently</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/user-management")}
              className="border-border/50 hover:border-primary hover:bg-primary/5 gap-2"
            >
              <Users size={16} />
              User Management
            </Button>
            <Button
              onClick={() => navigate("/analytics")}
              className="bg-primary hover:bg-primary/90 shadow-red gap-2"
            >
              <BarChart3 size={16} />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-red animate-glow">
              <Shield size={32} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-display tracking-wide mb-2">Welcome back, Admin!</h3>
              <p className="text-muted-foreground">
                Monitor your organization's performance and manage operations from this central hub.
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm text-primary">
                <Sparkles size={14} className="animate-pulse" />
                <span>System running smoothly • Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/settings")}
              className="border-border/50 hover:border-primary hover:bg-primary/5 gap-2"
            >
              <Settings size={16} />
              System Settings
            </Button>
          </div>
        </div>

        {/* AI Assistant Quick Access for Admins */}
        <div className="bg-gradient-to-r from-purple-500/20 via-card to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center animate-pulse">
                <Bot size={32} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-display tracking-wide mb-2">AI Admin Assistant</h3>
                <p className="text-muted-foreground">
                  Get intelligent insights, predictive analytics, and automated recommendations for community management
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">AI Analytics Active</span>
                  <span className="text-sm text-muted-foreground">• Community Health: {aiInsights.overallWellness}%</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={toggleAIAssistant}
                className="bg-purple-500 hover:bg-purple-500/90 shadow-red gap-2"
              >
                <Bot size={16} />
                AI Assistant
              </Button>
              <Button
                onClick={() => navigate("/ai-insights")}
                variant="outline"
                className="border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 gap-2"
              >
                <Brain size={16} />
                AI Insights
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "420", change: "+12%", icon: Users, color: "bg-primary/20 text-primary" },
            { label: "AI Health Score", value: aiInsights.overallWellness.toString(), change: "+5%", icon: Brain, color: "bg-purple-500/20 text-purple-400" },
            { label: "Events This Month", value: "24", change: "+15%", icon: Calendar, color: "bg-amber-500/20 text-amber-400" },
            { label: "Engagement Rate", value: "87%", change: "+8%", icon: Activity, color: "bg-green-500/20 text-green-400" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="group bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-red cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => stat.label === "AI Health Score" ? navigate("/ai-insights") : null}
            >
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", stat.color)}>
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-display">{stat.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-xs text-green-400 font-medium">{stat.change}</span>
              </div>
              {stat.label === "AI Health Score" && (
                <div className="mt-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-purple-400" />
                  <span className="text-xs text-purple-400">AI Powered</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl p-5 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                User Growth
              </h3>
              <select className="text-sm bg-secondary rounded-lg px-3 py-1.5 border border-border/50 outline-none">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e50914" stopOpacity={0.4}/>
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
                    dataKey="users" 
                    stroke="#e50914" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <h3 className="font-display text-lg tracking-wide flex items-center gap-2 mb-4">
              <Shield size={18} className="text-primary" />
              Role Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {roleDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI-Powered Admin Features */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl tracking-wide flex items-center gap-2">
              <Brain size={20} className="text-primary" />
              AI-Powered Admin Intelligence
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeAITab === "insights" ? "default" : "outline"}
                onClick={() => setActiveAITab("insights")}
                className="text-xs gap-1"
              >
                <Brain size={14} />
                AI Insights
              </Button>
              <Button
                size="sm"
                variant={activeAITab === "analytics" ? "default" : "outline"}
                onClick={() => setActiveAITab("analytics")}
                className="text-xs gap-1"
              >
                <BarChart3 size={14} />
                Member Analytics
              </Button>
              <Button
                size="sm"
                variant={activeAITab === "recommendations" ? "default" : "outline"}
                onClick={() => setActiveAITab("recommendations")}
                className="text-xs gap-1"
              >
                <Zap size={14} />
                Recommendations
              </Button>
            </div>
          </div>

          {activeAITab === "insights" && <AdminAIInsights />}
          {activeAITab === "analytics" && <AdminMemberAnalytics />}
          {activeAITab === "recommendations" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmartRecommendations 
                maxRecommendations={4} 
                showHeader={true}
                className="lg:col-span-1"
              />
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h4 className="font-display text-lg mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  Admin Action Items
                </h4>
                <div className="space-y-3">
                  {[
                    { title: "Review member engagement metrics", priority: "high", time: "15 min" },
                    { title: "Approve pending event proposals", priority: "medium", time: "10 min" },
                    { title: "Update community guidelines", priority: "low", time: "30 min" },
                    { title: "Schedule leadership meeting", priority: "medium", time: "5 min" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        item.priority === "high" ? "bg-red-400 animate-pulse" :
                        item.priority === "medium" ? "bg-amber-400" : "bg-green-400"
                      )} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Est. {item.time}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Action
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <h3 className="font-display text-lg tracking-wide flex items-center gap-2 mb-4">
              <Activity size={18} className="text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    activity.type === "success" && "bg-green-500/20 text-green-400",
                    activity.type === "info" && "bg-blue-500/20 text-blue-400",
                    activity.type === "warning" && "bg-amber-500/20 text-amber-400"
                  )}>
                    {activity.type === "success" && <CheckCircle size={16} />}
                    {activity.type === "info" && <Activity size={16} />}
                    {activity.type === "warning" && <AlertTriangle size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <h3 className="font-display text-lg tracking-wide flex items-center gap-2 mb-4">
              <Clock size={18} className="text-primary" />
              Pending Tasks
            </h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all cursor-pointer">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    task.priority === "high" && "bg-primary animate-pulse",
                    task.priority === "medium" && "bg-amber-500",
                    task.priority === "low" && "bg-green-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{task.title}</p>
                  </div>
                  <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-md">
                    {task.count}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-border/50 hover:border-primary">
              View All Tasks
            </Button>
          </div>

          {/* System Health */}
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                System Health
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/system-status")} className="text-primary hover:text-primary">
                View Details
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Database", status: "Operational", color: "bg-green-500", icon: CheckCircle },
                { label: "API Services", status: "Operational", color: "bg-green-500", icon: CheckCircle },
                { label: "Authentication", status: "Operational", color: "bg-green-500", icon: CheckCircle },
                { label: "File Storage", status: "Operational", color: "bg-green-500", icon: CheckCircle },
                { label: "Email Service", status: "Degraded", color: "bg-amber-500", icon: AlertTriangle }
              ].map((service, index) => (
                <div key={index} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className={cn("w-2 h-2 rounded-full", service.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{service.label}</p>
                    <p className="text-xs text-muted-foreground">{service.status}</p>
                  </div>
                  <service.icon size={16} className={cn(
                    service.status === "Operational" ? "text-green-400" : "text-amber-400"
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "AI Insights", icon: Brain, path: "/ai-insights", color: "bg-purple-500/20 text-purple-400" },
            { label: "Member Management", icon: Users, path: "/admin-members", color: "bg-primary/20 text-primary" },
            { label: "Events", icon: Calendar, path: "/events", color: "bg-amber-500/20 text-amber-400" },
            { label: "Analytics", icon: BarChart3, path: "/analytics", color: "bg-blue-500/20 text-blue-400" },
          ].map((action, index) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto py-6 flex-col gap-3 border-border/30 hover:border-primary/50 hover:bg-secondary/50 group animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => navigate(action.path)}
            >
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", action.color)}>
                <action.icon size={28} />
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
              {action.label === "AI Insights" && (
                <div className="flex items-center gap-1">
                  <Sparkles size={10} className="text-purple-400" />
                  <span className="text-xs text-purple-400">AI</span>
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}