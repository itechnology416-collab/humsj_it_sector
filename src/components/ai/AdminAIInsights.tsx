import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  Eye,
  RefreshCw,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  Shield,
  Lightbulb,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdminAIInsightsProps {
  className?: string;
}

const communityHealthMetrics = {
  overall: 87,
  engagement: 92,
  spiritual: 84,
  growth: 89,
  satisfaction: 91
};

const aiPredictions = [
  {
    title: "Member Growth Forecast",
    prediction: "Expected 15% growth in next quarter",
    confidence: 94,
    trend: "up",
    category: "growth",
    impact: "high"
  },
  {
    title: "Event Attendance Pattern",
    prediction: "Friday events show 23% higher attendance",
    confidence: 89,
    trend: "up",
    category: "events",
    impact: "medium"
  },
  {
    title: "Volunteer Engagement",
    prediction: "Need 3 more IT volunteers by next month",
    confidence: 91,
    trend: "stable",
    category: "volunteers",
    impact: "high"
  },
  {
    title: "Content Engagement",
    prediction: "Islamic studies content performs 40% better",
    confidence: 86,
    trend: "up",
    category: "content",
    impact: "medium"
  }
];

const adminRecommendations = [
  {
    id: 1,
    title: "Optimize Event Scheduling",
    description: "AI suggests scheduling major events on Fridays for 23% higher attendance",
    priority: "high",
    category: "events",
    impact: "Increase attendance by ~50 members",
    effort: "Low",
    confidence: 89
  },
  {
    id: 2,
    title: "Expand IT Volunteer Program",
    description: "Community needs more technical support. Recruit from engineering students",
    priority: "high",
    category: "volunteers",
    impact: "Improve system reliability",
    effort: "Medium",
    confidence: 91
  },
  {
    id: 3,
    title: "Enhance Islamic Content",
    description: "Focus on practical Islamic guidance - 40% higher engagement than theory",
    priority: "medium",
    category: "content",
    impact: "Boost learning participation",
    effort: "Medium",
    confidence: 86
  },
  {
    id: 4,
    title: "Member Retention Strategy",
    description: "AI identified at-risk members. Implement personalized engagement plan",
    priority: "high",
    category: "retention",
    impact: "Prevent 12% member churn",
    effort: "High",
    confidence: 88
  }
];

const systemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Declining Prayer Attendance",
    description: "15% drop in prayer hall usage over past 2 weeks",
    severity: "medium",
    aiSuggestion: "Consider adjusting prayer time notifications or improving facilities"
  },
  {
    id: 2,
    type: "info",
    title: "High Learning Engagement",
    description: "Islamic studies courses showing 34% increase in enrollment",
    severity: "low",
    aiSuggestion: "Expand course offerings to meet growing demand"
  },
  {
    id: 3,
    type: "success",
    title: "Volunteer Program Success",
    description: "Volunteer satisfaction scores increased to 94%",
    severity: "low",
    aiSuggestion: "Use this model for other community programs"
  }
];

export default function AdminAIInsights({ className }: AdminAIInsightsProps) {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return ArrowUp;
      case "down": return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-400";
      case "down": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return AlertTriangle;
      case "success": return CheckCircle;
      case "info": return Activity;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning": return "text-amber-400";
      case "success": return "text-green-400";
      case "info": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* AI Overview Header */}
      <div className="bg-gradient-to-r from-purple-500/20 via-card to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center animate-pulse">
              <Brain size={32} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-display tracking-wide mb-2">AI Admin Intelligence</h3>
              <p className="text-muted-foreground">
                Advanced analytics and predictive insights for community management
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400">AI Engine Active</span>
                <span className="text-sm text-muted-foreground">• Last analysis: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 gap-2"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Analyzing..." : "Refresh AI"}
            </Button>
            <Button
              onClick={() => navigate("/ai-insights")}
              className="bg-purple-500 hover:bg-purple-500/90 shadow-red gap-2"
            >
              <Eye size={16} />
              Detailed Insights
            </Button>
          </div>
        </div>
      </div>

      {/* Community Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(communityHealthMetrics).map(([key, value], index) => (
          <div 
            key={key}
            className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <div className="flex items-center gap-1">
                <ArrowUp size={12} className="text-green-400" />
                <span className="text-xs text-green-400">+{Math.floor(Math.random() * 5) + 2}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-display text-primary">{value}</p>
              <Progress value={value} className="h-2" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Predictions */}
      <div className="bg-card rounded-xl p-6 border border-border/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            AI Predictions & Forecasts
          </h3>
          <Badge variant="outline" className="text-xs">
            Next 30 days
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiPredictions.map((prediction, index) => {
            const TrendIcon = getTrendIcon(prediction.trend);
            return (
              <div 
                key={index}
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-sm">{prediction.title}</h4>
                  <div className="flex items-center gap-2">
                    <TrendIcon size={14} className={getTrendColor(prediction.trend)} />
                    <Badge variant="secondary" className="text-xs">
                      {prediction.confidence}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{prediction.prediction}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs capitalize">
                    {prediction.category}
                  </Badge>
                  <Badge className={cn(
                    "text-xs",
                    prediction.impact === "high" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  )}>
                    {prediction.impact} impact
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-card rounded-xl p-6 border border-border/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
            <Lightbulb size={18} className="text-primary" />
            AI Recommendations for Admins
          </h3>
          <Badge variant="outline" className="text-xs">
            {adminRecommendations.length} active
          </Badge>
        </div>

        <div className="space-y-4">
          {adminRecommendations.map((rec) => (
            <div 
              key={rec.id}
              className="p-5 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={cn("text-xs", getPriorityColor(rec.priority))}>
                    {rec.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rec.confidence}%
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Impact: </span>
                  <span className="font-medium">{rec.impact}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Effort: </span>
                  <span className="font-medium">{rec.effort}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category: </span>
                  <span className="font-medium capitalize">{rec.category}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                  <Zap size={12} />
                  Implement
                </Button>
                <Button size="sm" variant="outline" className="border-border/50 gap-1">
                  <Eye size={12} />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-card rounded-xl p-6 border border-border/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg tracking-wide flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            AI System Alerts
          </h3>
          <Button size="sm" variant="outline" className="text-xs">
            Mark All Read
          </Button>
        </div>

        <div className="space-y-3">
          {systemAlerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <div 
                key={alert.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <AlertIcon size={18} className={getAlertColor(alert.type)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{alert.title}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary">
                      <Lightbulb size={14} className="inline mr-2" />
                      AI Suggestion: {alert.aiSuggestion}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick AI Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Member Analytics", icon: Users, path: "/analytics", color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Event Optimization", icon: Calendar, path: "/events", color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Content Insights", icon: MessageSquare, path: "/content", color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "AI Settings", icon: Brain, path: "/ai-insights", color: "text-amber-400", bg: "bg-amber-500/10" }
        ].map((action, index) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={cn(
              "group p-4 rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-red text-left animate-slide-up",
              action.bg
            )}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform", action.bg)}>
                <action.icon className={cn("h-6 w-6", action.color)} />
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}