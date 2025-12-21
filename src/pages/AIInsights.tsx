import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BarChart3,
  Calendar,
  BookOpen,
  Users,
  Heart,
  Star,
  Clock,
  Award,
  Zap,
  Eye,
  ArrowUp,
  ArrowDown,
  Activity,
  Sparkles,
  Bot,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const aiInsights = {
  spiritualHealth: {
    score: 85,
    trend: "up",
    insights: [
      "Your prayer consistency has improved by 15% this month",
      "You're maintaining a 7-day streak of daily Quran reading",
      "Consider adding more voluntary prayers to enhance spiritual growth"
    ],
    recommendations: [
      { text: "Set up Tahajjud reminders", action: "spiritual-progress", priority: "high" },
      { text: "Join advanced Quran study circle", action: "learning-center", priority: "medium" }
    ]
  },
  learningProgress: {
    score: 78,
    trend: "up",
    insights: [
      "You've completed 3 courses this month - excellent progress!",
      "Your Arabic comprehension has improved significantly",
      "You prefer audio content over text-based learning"
    ],
    recommendations: [
      { text: "Enroll in Hadith Sciences course", action: "learning-center", priority: "high" },
      { text: "Practice Arabic conversation", action: "discussion-forum", priority: "medium" }
    ]
  },
  communityEngagement: {
    score: 92,
    trend: "up",
    insights: [
      "You're in the top 10% of active community members",
      "Your volunteer contributions are highly valued",
      "You excel at mentoring new members"
    ],
    recommendations: [
      { text: "Consider leadership role in IT committee", action: "volunteer-opportunities", priority: "high" },
      { text: "Organize tech workshop for community", action: "my-events", priority: "medium" }
    ]
  },
  personalGrowth: {
    score: 73,
    trend: "stable",
    insights: [
      "You're consistent with goal setting but struggle with completion",
      "Your time management has room for improvement",
      "You respond well to community accountability"
    ],
    recommendations: [
      { text: "Use AI-powered goal tracking", action: "my-tasks", priority: "high" },
      { text: "Join accountability partner program", action: "discussion-forum", priority: "medium" }
    ]
  }
};

const predictiveAnalytics = [
  {
    title: "Optimal Prayer Times",
    description: "Based on your schedule, the best times for voluntary prayers are 6:30 AM and 9:00 PM",
    confidence: 94,
    category: "spiritual",
    icon: Clock
  },
  {
    title: "Learning Recommendation",
    description: "You're 87% likely to enjoy the 'Islamic Finance Principles' course based on your interests",
    confidence: 87,
    category: "education",
    icon: BookOpen
  },
  {
    title: "Community Match",
    description: "You have high compatibility with the Youth Outreach Committee (92% match)",
    confidence: 92,
    category: "community",
    icon: Users
  },
  {
    title: "Goal Achievement",
    description: "You're on track to exceed your monthly volunteer hours by 23%",
    confidence: 89,
    category: "goals",
    icon: Target
  }
];

const aiRecommendations = [
  {
    id: 1,
    title: "Enhance Your Spiritual Routine",
    description: "AI suggests adding 15 minutes of morning dhikr to boost your spiritual wellness score",
    impact: "High",
    effort: "Low",
    category: "spiritual",
    icon: Heart,
    actions: ["Set dhikr reminders", "Track spiritual activities"]
  },
  {
    id: 2,
    title: "Optimize Learning Path",
    description: "Based on your progress, focus on practical Islamic applications rather than theoretical studies",
    impact: "Medium",
    effort: "Medium",
    category: "education",
    icon: BookOpen,
    actions: ["Browse practical courses", "Join study groups"]
  },
  {
    id: 3,
    title: "Expand Community Network",
    description: "Connect with 3 members who share your interests in technology and Islamic studies",
    impact: "Medium",
    effort: "Low",
    category: "community",
    icon: Users,
    actions: ["View member suggestions", "Join tech discussions"]
  },
  {
    id: 4,
    title: "Improve Time Management",
    description: "AI detected scheduling conflicts. Optimize your calendar for better work-worship balance",
    impact: "High",
    effort: "Medium",
    category: "productivity",
    icon: Calendar,
    actions: ["Analyze schedule", "Set smart reminders"]
  }
];

const behaviorPatterns = [
  {
    pattern: "Most Active Time",
    value: "7:00 PM - 9:00 PM",
    insight: "You engage most with community activities in the evening",
    icon: Clock
  },
  {
    pattern: "Preferred Learning Style",
    value: "Audio + Interactive",
    insight: "You retain 40% more information through audio content",
    icon: BookOpen
  },
  {
    pattern: "Community Interaction",
    value: "Mentor & Helper",
    insight: "You naturally gravitate toward helping and teaching others",
    icon: Users
  },
  {
    pattern: "Goal Completion Rate",
    value: "73% Success Rate",
    insight: "You excel at short-term goals but struggle with long-term ones",
    icon: Target
  }
];

export default function AIInsights() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: "overview", label: "AI Overview", icon: Brain },
    { id: "predictions", label: "Predictions", icon: TrendingUp },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "patterns", label: "Behavior Patterns", icon: Activity }
  ];

  const handleRefreshInsights = async () => {
    setRefreshing(true);
    // Simulate AI processing
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500/10";
    if (score >= 60) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return ArrowUp;
      case "down": return ArrowDown;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "spiritual": return Heart;
      case "education": return BookOpen;
      case "community": return Users;
      case "goals": return Target;
      case "productivity": return Clock;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "spiritual": return "text-green-400";
      case "education": return "text-blue-400";
      case "community": return "text-purple-400";
      case "goals": return "text-amber-400";
      case "productivity": return "text-red-400";
      default: return "text-primary";
    }
  };

  return (
    <PageLayout 
      title="AI Insights & Analytics" 
      subtitle="Personalized insights powered by artificial intelligence"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* AI Status Header */}
        <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-red animate-glow">
                <Brain size={32} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-display tracking-wide mb-2">AI Analysis Complete</h3>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleString()} • Next analysis in 6 hours
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">AI Engine Active</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleRefreshInsights}
              disabled={refreshing}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Analyzing..." : "Refresh Insights"}
            </Button>
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
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              {/* AI Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(aiInsights).map(([key, data]) => {
                  const TrendIcon = getTrendIcon(data.trend);
                  return (
                    <div 
                      key={key}
                      className={cn(
                        "bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300",
                        getScoreBackground(data.score)
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <div className="flex items-center gap-1">
                          <TrendIcon size={14} className={getTrendColor(data.trend)} />
                          <span className={cn("text-2xl font-display", getScoreColor(data.score))}>
                            {data.score}
                          </span>
                        </div>
                      </div>
                      <Progress value={data.score} className="h-2 mb-3" />
                      <p className="text-xs text-muted-foreground">
                        {data.insights[0]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border/30">
                  <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-primary" />
                    Key Insights
                  </h3>
                  <div className="space-y-4">
                    {Object.values(aiInsights).flatMap(data => data.insights.slice(0, 1)).map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles size={12} className="text-primary" />
                        </div>
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border/30">
                  <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                    <Target size={18} className="text-primary" />
                    Priority Actions
                  </h3>
                  <div className="space-y-3">
                    {Object.values(aiInsights).flatMap(data => 
                      data.recommendations.filter(rec => rec.priority === "high")
                    ).slice(0, 4).map((rec, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/${rec.action}`)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Zap size={16} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.text}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            High Priority
                          </Badge>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "predictions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">AI Predictions & Forecasts</h3>
                <Badge variant="outline" className="text-xs">
                  Based on 30 days of data
                </Badge>
              </div>

              <div className="grid gap-4">
                {predictiveAnalytics.map((prediction, index) => {
                  const CategoryIcon = getCategoryIcon(prediction.category);
                  return (
                    <div 
                      key={index}
                      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <CategoryIcon size={20} className={getCategoryColor(prediction.category)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-lg">{prediction.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {prediction.category}
                              </Badge>
                              <Badge className={cn(
                                "text-xs",
                                prediction.confidence >= 90 ? "bg-green-500/20 text-green-400" : 
                                prediction.confidence >= 80 ? "bg-amber-500/20 text-amber-400" : 
                                "bg-blue-500/20 text-blue-400"
                              )}>
                                {prediction.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{prediction.description}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.confidence} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground">{prediction.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Personalized Recommendations</h3>
                <Badge variant="outline" className="text-xs">
                  Updated daily
                </Badge>
              </div>

              <div className="grid gap-4">
                {aiRecommendations.map((rec) => {
                  const CategoryIcon = getCategoryIcon(rec.category);
                  return (
                    <div 
                      key={rec.id}
                      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <CategoryIcon size={20} className={getCategoryColor(rec.category)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-lg mb-1">{rec.title}</h4>
                              <p className="text-muted-foreground text-sm">{rec.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={rec.impact === "High" ? "default" : "secondary"} className="text-xs">
                                {rec.impact} Impact
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {rec.effort} Effort
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {rec.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                className="text-xs border-primary/30 hover:bg-primary/10"
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "patterns" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Behavioral Patterns</h3>
                <Badge variant="outline" className="text-xs">
                  Machine Learning Analysis
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {behaviorPatterns.map((pattern, index) => (
                  <div 
                    key={index}
                    className="bg-card rounded-xl p-6 border border-border/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <pattern.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{pattern.pattern}</h4>
                        <p className="text-lg font-display text-primary mb-2">{pattern.value}</p>
                        <p className="text-sm text-muted-foreground">{pattern.insight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Learning Progress */}
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                  <Bot size={18} className="text-primary" />
                  AI Learning Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Collection</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pattern Recognition</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prediction Accuracy</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Personalization Level</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-primary">
                    <CheckCircle size={14} className="inline mr-2" />
                    AI model is continuously learning from your interactions to provide better insights.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}