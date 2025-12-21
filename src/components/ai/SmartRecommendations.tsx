import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAI } from "@/contexts/AIContext";
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  ChevronRight,
  X,
  RefreshCw,
  BookOpen,
  Heart,
  Users,
  Clock,
  Star,
  Zap,
  Eye,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SmartRecommendationsProps {
  className?: string;
  showHeader?: boolean;
  maxRecommendations?: number;
}

export default function SmartRecommendations({ 
  className, 
  showHeader = true, 
  maxRecommendations = 4 
}: SmartRecommendationsProps) {
  const navigate = useNavigate();
  const { aiRecommendations, refreshRecommendations, aiInsights } = useAI();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshRecommendations();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleDismiss = (id: string) => {
    setDismissedRecommendations(prev => [...prev, id]);
  };

  const handleRecommendationClick = (action: string) => {
    navigate(`/${action}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spiritual': return Heart;
      case 'learning': return BookOpen;
      case 'community': return Users;
      case 'productivity': return Clock;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spiritual': return 'text-green-400';
      case 'learning': return 'text-blue-400';
      case 'community': return 'text-purple-400';
      case 'productivity': return 'text-amber-400';
      default: return 'text-primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const visibleRecommendations = aiRecommendations
    .filter(rec => !dismissedRecommendations.includes(rec.id))
    .slice(0, maxRecommendations);

  if (visibleRecommendations.length === 0) {
    return (
      <div className={cn("bg-card rounded-xl p-6 border border-border/30", className)}>
        <div className="text-center py-8">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <h3 className="font-display text-lg mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground text-sm mb-4">
            You've addressed all AI recommendations. Great job!
          </p>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw size={16} />
            Check for New Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border/30", className)}>
      {showHeader && (
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg tracking-wide">AI Recommendations</h3>
                <p className="text-xs text-muted-foreground">
                  Personalized suggestions based on your activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {visibleRecommendations.length} active
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-8 h-8 p-0"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {visibleRecommendations.map((recommendation) => {
          const CategoryIcon = getCategoryIcon(recommendation.category);
          
          return (
            <div
              key={recommendation.id}
              className="group relative bg-secondary/30 rounded-lg p-4 border border-transparent hover:border-primary/30 transition-all duration-300 hover:bg-secondary/50"
            >
              <button
                onClick={() => handleDismiss(recommendation.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <CategoryIcon size={18} className={getCategoryColor(recommendation.category)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {recommendation.title}
                    </h4>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge className={cn("text-xs", getPriorityColor(recommendation.priority))}>
                        {recommendation.priority}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400" />
                        <span className="text-xs text-muted-foreground">
                          {recommendation.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {recommendation.category}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleRecommendationClick(recommendation.action)}
                      className="bg-primary hover:bg-primary/90 text-xs px-3 py-1 h-7 gap-1"
                    >
                      <Zap size={12} />
                      Take Action
                      <ChevronRight size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Insights Summary */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              Your AI Wellness Score
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/ai-insights')}
              className="text-xs px-2 py-1 h-6"
            >
              <Eye size={12} className="mr-1" />
              View Details
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-lg font-display text-primary">{aiInsights.overallWellness}</p>
              <p className="text-xs text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-lg font-display">{aiInsights.spiritualScore}</p>
              <p className="text-xs text-muted-foreground">Spiritual Health</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/ai-insights')}
            className="flex-1 text-xs gap-1"
          >
            <Brain size={12} />
            AI Insights
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 text-xs gap-1"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}