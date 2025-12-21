import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Eye,
  UserPlus,
  UserMinus,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdminMemberAnalyticsProps {
  className?: string;
}

const memberSegments = [
  {
    name: "Highly Active",
    count: 89,
    percentage: 21,
    trend: "up",
    description: "Regular event attendance, high engagement",
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
  {
    name: "Moderately Active",
    count: 156,
    percentage: 37,
    trend: "stable",
    description: "Occasional participation, good potential",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    name: "Low Activity",
    count: 98,
    percentage: 23,
    trend: "down",
    description: "Minimal engagement, needs attention",
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    name: "At Risk",
    count: 32,
    percentage: 8,
    trend: "down",
    description: "Very low activity, potential churn",
    color: "text-red-400",
    bg: "bg-red-500/10"
  },
  {
    name: "New Members",
    count: 45,
    percentage: 11,
    trend: "up",
    description: "Recently joined, onboarding phase",
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

const engagementMetrics = [
  {
    metric: "Prayer Attendance",
    value: 78,
    change: +5,
    trend: "up",
    insight: "Friday prayers show highest attendance (94%)"
  },
  {
    metric: "Event Participation",
    value: 65,
    change: +12,
    trend: "up",
    insight: "Educational events outperform social events by 23%"
  },
  {
    metric: "Volunteer Engagement",
    value: 34,
    change: -3,
    trend: "down",
    insight: "Need more IT and media volunteers"
  },
  {
    metric: "Learning Activity",
    value: 56,
    change: +8,
    trend: "up",
    insight: "Arabic courses have 89% completion rate"
  }
];

const memberInsights = [
  {
    title: "Peak Activity Times",
    insight: "Members most active between 7-9 PM on weekdays",
    recommendation: "Schedule important announcements during peak hours",
    confidence: 92
  },
  {
    title: "Demographic Patterns",
    insight: "Students show 40% higher engagement than working professionals",
    recommendation: "Create targeted programs for working members",
    confidence: 87
  },
  {
    title: "Retention Factors",
    insight: "Members who attend orientation stay 3x longer",
    recommendation: "Strengthen new member onboarding process",
    confidence: 94
  },
  {
    title: "Content Preferences",
    insight: "Practical Islamic guidance preferred over theoretical content",
    recommendation: "Focus on applicable Islamic teachings",
    confidence: 89
  }
];

const riskFactors = [
  {
    factor: "Declining Prayer Attendance",
    affected: 23,
    severity: "medium",
    action: "Personal outreach and prayer reminders"
  },
  {
    factor: "Low Event Participation",
    affected: 45,
    severity: "high",
    action: "Survey preferences and adjust event types"
  },
  {
    factor: "Missed Payments",
    affected: 12,
    severity: "low",
    action: "Payment reminder system and flexible options"
  },
  {
    factor: "No Recent Login",
    affected: 18,
    severity: "high",
    action: "Re-engagement campaign via phone/email"
  }
];

export default function AdminMemberAnalytics({ className }: AdminMemberAnalyticsProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("segments");

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-400";
      case "down": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl tracking-wide flex items-center gap-2">
            <Brain size={20} className="text-primary" />
            AI Member Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Intelligent insights into member behavior and engagement patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeView === "segments" ? "default" : "outline"}
            onClick={() => setActiveView("segments")}
            className="text-xs"
          >
            <Users size={14} className="mr-1" />
            Segments
          </Button>
          <Button
            size="sm"
            variant={activeView === "engagement" ? "default" : "outline"}
            onClick={() => setActiveView("engagement")}
            className="text-xs"
          >
            <Activity size={14} className="mr-1" />
            Engagement
          </Button>
          <Button
            size="sm"
            variant={activeView === "risks" ? "default" : "outline"}
            onClick={() => setActiveView("risks")}
            className="text-xs"
          >
            <AlertTriangle size={14} className="mr-1" />
            Risk Analysis
          </Button>
        </div>
      </div>

      {/* Member Segments View */}
      {activeView === "segments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {memberSegments.map((segment, index) => {
              const TrendIcon = getTrendIcon(segment.trend);
              return (
                <div 
                  key={segment.name}
                  className={cn(
                    "bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up",
                    segment.bg
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{segment.name}</h4>
                    <TrendIcon size={14} className={getTrendColor(segment.trend)} />
                  </div>
                  <div className="space-y-2">
                    <p className={cn("text-2xl font-display", segment.color)}>{segment.count}</p>
                    <p className="text-xs text-muted-foreground">{segment.percentage}% of members</p>
                    <Progress value={segment.percentage * 4} className="h-1" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {segment.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* AI Insights */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h4 className="font-display text-lg mb-4 flex items-center gap-2">
              <Brain size={18} className="text-primary" />
              AI Member Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memberInsights.map((insight, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm">{insight.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.insight}</p>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary">
                      <Target size={14} className="inline mr-2" />
                      {insight.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics View */}
      {activeView === "engagement" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementMetrics.map((metric, index) => {
              const TrendIcon = getTrendIcon(metric.trend);
              return (
                <div 
                  key={metric.metric}
                  className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{metric.metric}</h4>
                    <div className="flex items-center gap-1">
                      <TrendIcon size={14} className={getTrendColor(metric.trend)} />
                      <span className={cn("text-xs font-medium", getTrendColor(metric.trend))}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-3xl font-display text-primary">{metric.value}%</p>
                    <Progress value={metric.value} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metric.insight}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engagement Trends Chart Placeholder */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display text-lg">Engagement Trends</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <BarChart3 size={14} className="mr-1" />
                  Bar Chart
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <PieChart size={14} className="mr-1" />
                  Pie Chart
                </Button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Interactive engagement charts</p>
                <p className="text-sm text-muted-foreground">Real-time member activity visualization</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Analysis View */}
      {activeView === "risks" && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {riskFactors.map((risk, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">{risk.factor}</h4>
                      <p className="text-sm text-muted-foreground">
                        Affecting {risk.affected} members
                      </p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", getSeverityColor(risk.severity))}>
                    {risk.severity} risk
                  </Badge>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-primary">
                    <CheckCircle size={14} className="inline mr-2" />
                    Recommended Action: {risk.action}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                    <UserPlus size={12} />
                    Take Action
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/50 gap-1">
                    <Eye size={12} />
                    View Members
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Risk Summary */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h4 className="font-display text-lg mb-4 flex items-center gap-2">
              <Target size={18} className="text-primary" />
              Risk Mitigation Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-2xl font-display text-red-400">32</p>
                <p className="text-sm text-muted-foreground">High Risk Members</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-2xl font-display text-amber-400">68</p>
                <p className="text-sm text-muted-foreground">Medium Risk Members</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-2xl font-display text-green-400">87%</p>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/members")}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Users size={16} />
          Manage Members
        </Button>
        <Button
          onClick={() => navigate("/analytics")}
          variant="outline"
          className="border-border/50 hover:border-primary gap-2"
        >
          <BarChart3 size={16} />
          Detailed Analytics
        </Button>
        <Button
          onClick={() => navigate("/communication")}
          variant="outline"
          className="border-border/50 hover:border-primary gap-2"
        >
          <Calendar size={16} />
          Create Campaign
        </Button>
      </div>
    </div>
  );
}