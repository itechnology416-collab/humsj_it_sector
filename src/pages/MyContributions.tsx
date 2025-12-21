import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Award, 
  Clock, 
  TrendingUp, 
  Star,
  Trophy,
  Medal,
  Target,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Zap,
  Crown,
  Gift,
  CheckCircle,
  BarChart3,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const serviceHours = {
  thisMonth: 12,
  lastMonth: 8,
  thisYear: 96,
  total: 248,
  goal: 120,
  weeklyAverage: 3.2
};

const participationPoints = {
  current: 1250,
  thisMonth: 180,
  lastMonth: 145,
  rank: 15,
  totalMembers: 150,
  nextMilestone: 1500
};

const badges = [
  {
    id: 1,
    name: "Volunteer Champion",
    description: "Completed 50+ volunteer hours",
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    earned: true,
    earnedDate: "2024-11-15",
    rarity: "gold"
  },
  {
    id: 2,
    name: "Event Organizer",
    description: "Successfully organized 5 events",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    earned: true,
    earnedDate: "2024-10-20",
    rarity: "silver"
  },
  {
    id: 3,
    name: "Knowledge Seeker",
    description: "Completed 10 educational courses",
    icon: BookOpen,
    color: "text-green-400",
    bg: "bg-green-500/20",
    earned: true,
    earnedDate: "2024-09-30",
    rarity: "bronze"
  },
  {
    id: 4,
    name: "Community Builder",
    description: "Helped 100+ community members",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-500/20",
    earned: false,
    progress: 75,
    target: 100,
    rarity: "gold"
  },
  {
    id: 5,
    name: "Tech Innovator",
    description: "Contributed to 3 tech projects",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    earned: false,
    progress: 2,
    target: 3,
    rarity: "platinum"
  },
  {
    id: 6,
    name: "Leadership Excellence",
    description: "Led 5 successful initiatives",
    icon: Crown,
    color: "text-indigo-400",
    bg: "bg-indigo-500/20",
    earned: false,
    progress: 1,
    target: 5,
    rarity: "diamond"
  }
];

const monthlyContributions = [
  { month: "Jan", hours: 18, points: 120 },
  { month: "Feb", hours: 22, points: 145 },
  { month: "Mar", hours: 15, points: 98 },
  { month: "Apr", hours: 28, points: 180 },
  { month: "May", hours: 20, points: 135 },
  { month: "Jun", hours: 25, points: 165 },
  { month: "Jul", hours: 30, points: 195 },
  { month: "Aug", hours: 24, points: 158 },
  { month: "Sep", hours: 26, points: 172 },
  { month: "Oct", hours: 32, points: 210 },
  { month: "Nov", hours: 28, points: 185 },
  { month: "Dec", hours: 12, points: 80 }
];

const recentActivities = [
  {
    id: 1,
    type: "volunteer",
    title: "IT Support Session",
    points: 25,
    hours: 3,
    date: "2024-12-20",
    description: "Helped members with technical issues"
  },
  {
    id: 2,
    type: "event",
    title: "Friday Prayer Organization",
    points: 15,
    hours: 2,
    date: "2024-12-19",
    description: "Assisted in prayer setup and coordination"
  },
  {
    id: 3,
    type: "education",
    title: "Quran Study Circle",
    points: 20,
    hours: 2.5,
    date: "2024-12-18",
    description: "Participated in weekly Quran study"
  },
  {
    id: 4,
    type: "community",
    title: "New Member Orientation",
    points: 30,
    hours: 4,
    date: "2024-12-17",
    description: "Guided new members through onboarding"
  }
];

export default function MyContributions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "hours", label: "Service Hours", icon: Clock },
    { id: "points", label: "Participation Points", icon: Star },
    { id: "badges", label: "Badges & Recognition", icon: Award }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "bronze": return "border-amber-600/50 bg-amber-600/10";
      case "silver": return "border-gray-400/50 bg-gray-400/10";
      case "gold": return "border-yellow-400/50 bg-yellow-400/10";
      case "platinum": return "border-purple-400/50 bg-purple-400/10";
      case "diamond": return "border-blue-400/50 bg-blue-400/10";
      default: return "border-border/50 bg-secondary/10";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "volunteer": return Heart;
      case "event": return Calendar;
      case "education": return BookOpen;
      case "community": return Users;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "volunteer": return "text-red-400";
      case "event": return "text-blue-400";
      case "education": return "text-green-400";
      case "community": return "text-purple-400";
      default: return "text-muted-foreground";
    }
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const progressBadges = badges.filter(badge => !badge.earned);
  const yearProgress = Math.round((serviceHours.thisYear / serviceHours.goal) * 100);
  const pointsToNext = participationPoints.nextMilestone - participationPoints.current;

  return (
    <PageLayout 
      title="My Contributions" 
      subtitle="Track your service hours, participation points, and achievements"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Hero Stats */}
        <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-red animate-glow">
                <Clock size={24} className="text-primary-foreground" />
              </div>
              <p className="text-3xl font-display text-primary">{serviceHours.total}</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="text-amber-400" />
              </div>
              <p className="text-3xl font-display text-amber-400">{participationPoints.current}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Award size={24} className="text-green-400" />
              </div>
              <p className="text-3xl font-display text-green-400">{earnedBadges.length}</p>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
              <p className="text-3xl font-display text-blue-400">#{participationPoints.rank}</p>
              <p className="text-sm text-muted-foreground">Community Rank</p>
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
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    This Month
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Service Hours</span>
                      <span className="font-medium">{serviceHours.thisMonth}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Points Earned</span>
                      <span className="font-medium">{participationPoints.thisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Activities</span>
                      <span className="font-medium">{recentActivities.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                    <Target size={18} className="text-primary" />
                    Annual Goal
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{serviceHours.thisYear}/{serviceHours.goal} hours</span>
                    </div>
                    <Progress value={yearProgress} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {yearProgress}% complete • {serviceHours.goal - serviceHours.thisYear} hours remaining
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                    <Trophy size={18} className="text-primary" />
                    Next Milestone
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Points to Next Level</span>
                      <span>{pointsToNext} points</span>
                    </div>
                    <Progress value={(participationPoints.current / participationPoints.nextMilestone) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round((participationPoints.current / participationPoints.nextMilestone) * 100)}% to {participationPoints.nextMilestone} points
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div 
                        key={activity.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <ActivityIcon size={16} className={getActivityColor(activity.type)} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="text-right text-xs">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={12} />
                            <span>{activity.points}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock size={12} />
                            <span>{activity.hours}h</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === "hours" && (
            <div className="space-y-6">
              {/* Hours Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "This Month", value: `${serviceHours.thisMonth}h`, change: `+${serviceHours.thisMonth - serviceHours.lastMonth}h`, positive: true },
                  { label: "This Year", value: `${serviceHours.thisYear}h`, change: `${yearProgress}%`, positive: true },
                  { label: "Weekly Average", value: `${serviceHours.weeklyAverage}h`, change: "+0.5h", positive: true },
                  { label: "Total Lifetime", value: `${serviceHours.total}h`, change: "All time", positive: true }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="bg-card rounded-xl p-4 border border-border/30"
                  >
                    <p className="text-2xl font-display mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                    <Badge variant={stat.positive ? "default" : "secondary"} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Monthly Chart */}
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h3 className="font-display text-lg mb-4">Monthly Service Hours</h3>
                <div className="grid grid-cols-12 gap-2 h-40">
                  {monthlyContributions.map((month, index) => {
                    const maxHours = Math.max(...monthlyContributions.map(m => m.hours));
                    const height = (month.hours / maxHours) * 100;
                    return (
                      <div key={month.month} className="flex flex-col items-center justify-end">
                        <div 
                          className="w-full bg-primary rounded-t-sm transition-all duration-500 hover:bg-primary/80 cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${month.month}: ${month.hours} hours`}
                        />
                        <p className="text-xs text-muted-foreground mt-2">{month.month}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "points" && (
            <div className="space-y-6">
              {/* Points Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Star size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-display">{participationPoints.current}</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    +{participationPoints.thisMonth} this month
                  </Badge>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-display">#{participationPoints.rank}</p>
                      <p className="text-sm text-muted-foreground">Community Rank</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Top {Math.round((participationPoints.rank / participationPoints.totalMembers) * 100)}% of {participationPoints.totalMembers} members
                  </p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Target size={20} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-display">{pointsToNext}</p>
                      <p className="text-sm text-muted-foreground">To Next Level</p>
                    </div>
                  </div>
                  <Progress value={(participationPoints.current / participationPoints.nextMilestone) * 100} className="h-2" />
                </div>
              </div>

              {/* Points Chart */}
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <h3 className="font-display text-lg mb-4">Monthly Points Earned</h3>
                <div className="grid grid-cols-12 gap-2 h-40">
                  {monthlyContributions.map((month, index) => {
                    const maxPoints = Math.max(...monthlyContributions.map(m => m.points));
                    const height = (month.points / maxPoints) * 100;
                    return (
                      <div key={month.month} className="flex flex-col items-center justify-end">
                        <div 
                          className="w-full bg-amber-400 rounded-t-sm transition-all duration-500 hover:bg-amber-400/80 cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${month.month}: ${month.points} points`}
                        />
                        <p className="text-xs text-muted-foreground mt-2">{month.month}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "badges" && (
            <div className="space-y-6">
              {/* Earned Badges */}
              <div>
                <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                  <Trophy size={18} className="text-primary" />
                  Earned Badges ({earnedBadges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={cn(
                        "bg-card rounded-xl p-5 border transition-all duration-300 hover:scale-105",
                        getRarityColor(badge.rarity)
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", badge.bg)}>
                          <badge.icon size={20} className={badge.color} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                        <CheckCircle size={16} className="text-green-400" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {badge.rarity}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Earned {new Date(badge.earnedDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Badges */}
              <div>
                <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  In Progress ({progressBadges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {progressBadges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={cn(
                        "bg-card rounded-xl p-5 border transition-all duration-300 hover:scale-105 opacity-75",
                        getRarityColor(badge.rarity)
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", badge.bg)}>
                          <badge.icon size={20} className={badge.color} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.target}</span>
                        </div>
                        <Progress value={(badge.progress! / badge.target!) * 100} className="h-2" />
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs capitalize">
                            {badge.rarity}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {badge.target! - badge.progress!} remaining
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}