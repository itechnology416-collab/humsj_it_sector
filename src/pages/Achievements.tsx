import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star,
  Award,
  Target,
  Zap,
  Crown,
  Medal,
  Gift,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  Code,
  Heart,
  Flame,
  Shield,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'participation' | 'learning' | 'leadership' | 'community' | 'special';
  type: 'badge' | 'milestone' | 'streak' | 'challenge';
  icon: string;
  color: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: AchievementRequirement[];
  unlockedBy: string[];
  totalUnlocked: number;
  createdAt: string;
  isActive: boolean;
}

interface AchievementRequirement {
  type: 'event_attendance' | 'skill_completion' | 'project_contribution' | 'community_engagement' | 'streak' | 'points';
  target: number;
  current?: number;
  description: string;
}

interface UserAchievement {
  id: string;
  achievementId: string;
  userId: string;
  unlockedAt: string;
  progress: number;
  isCompleted: boolean;
}

interface Leaderboard {
  userId: string;
  userName: string;
  userEmail: string;
  totalPoints: number;
  totalAchievements: number;
  rank: number;
  recentAchievements: string[];
}

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your profile and join the community',
    category: 'participation',
    type: 'milestone',
    icon: 'star',
    color: 'blue',
    points: 50,
    rarity: 'common',
    requirements: [
      {
        type: 'community_engagement',
        target: 1,
        current: 1,
        description: 'Complete profile setup'
      }
    ],
    unlockedBy: ['user1', 'user2', 'user3'],
    totalUnlocked: 156,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    title: 'Prayer Warrior',
    description: 'Attend 10 Friday prayers',
    category: 'participation',
    type: 'milestone',
    icon: 'heart',
    color: 'green',
    points: 200,
    rarity: 'uncommon',
    requirements: [
      {
        type: 'event_attendance',
        target: 10,
        current: 7,
        description: 'Attend Friday prayers'
      }
    ],
    unlockedBy: ['user1', 'user4'],
    totalUnlocked: 89,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    title: 'Tech Enthusiast',
    description: 'Complete 5 programming workshops',
    category: 'learning',
    type: 'milestone',
    icon: 'code',
    color: 'purple',
    points: 300,
    rarity: 'rare',
    requirements: [
      {
        type: 'skill_completion',
        target: 5,
        current: 3,
        description: 'Complete programming workshops'
      }
    ],
    unlockedBy: ['user2'],
    totalUnlocked: 34,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '4',
    title: 'Community Leader',
    description: 'Help organize 3 community events',
    category: 'leadership',
    type: 'milestone',
    icon: 'crown',
    color: 'gold',
    points: 500,
    rarity: 'epic',
    requirements: [
      {
        type: 'community_engagement',
        target: 3,
        current: 1,
        description: 'Organize community events'
      }
    ],
    unlockedBy: [],
    totalUnlocked: 12,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '5',
    title: 'Streak Master',
    description: 'Maintain a 30-day activity streak',
    category: 'special',
    type: 'streak',
    icon: 'flame',
    color: 'red',
    points: 400,
    rarity: 'rare',
    requirements: [
      {
        type: 'streak',
        target: 30,
        current: 15,
        description: 'Daily activity streak'
      }
    ],
    unlockedBy: ['user1'],
    totalUnlocked: 23,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '6',
    title: 'Knowledge Seeker',
    description: 'Read 20 Islamic tech articles',
    category: 'learning',
    type: 'milestone',
    icon: 'book',
    color: 'indigo',
    points: 250,
    rarity: 'uncommon',
    requirements: [
      {
        type: 'community_engagement',
        target: 20,
        current: 12,
        description: 'Read educational content'
      }
    ],
    unlockedBy: ['user3', 'user4'],
    totalUnlocked: 67,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

const mockLeaderboard: Leaderboard[] = [
  {
    userId: 'user1',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed@hu.edu.et',
    totalPoints: 1250,
    totalAchievements: 8,
    rank: 1,
    recentAchievements: ['Prayer Warrior', 'Streak Master', 'First Steps']
  },
  {
    userId: 'user2',
    userName: 'Fatima Ali',
    userEmail: 'fatima@hu.edu.et',
    totalPoints: 950,
    totalAchievements: 6,
    rank: 2,
    recentAchievements: ['Tech Enthusiast', 'First Steps']
  },
  {
    userId: 'user3',
    userName: 'Omar Ibrahim',
    userEmail: 'omar@hu.edu.et',
    totalPoints: 750,
    totalAchievements: 5,
    rank: 3,
    recentAchievements: ['Knowledge Seeker', 'First Steps']
  },
  {
    userId: 'user4',
    userName: 'Aisha Mohamed',
    userEmail: 'aisha@hu.edu.et',
    totalPoints: 650,
    totalAchievements: 4,
    rank: 4,
    recentAchievements: ['Prayer Warrior', 'Knowledge Seeker']
  }
];

const categoryColors = {
  participation: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  learning: "bg-green-500/20 text-green-600 border-green-500/30",
  leadership: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  community: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  special: "bg-pink-500/20 text-pink-600 border-pink-500/30"
};

const rarityColors = {
  common: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  uncommon: "bg-green-500/20 text-green-600 border-green-500/30",
  rare: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  epic: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  legendary: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
};

const iconMap = {
  star: Star,
  heart: Heart,
  code: Code,
  crown: Crown,
  flame: Flame,
  book: BookOpen,
  trophy: Trophy,
  award: Award,
  medal: Medal,
  shield: Shield,
  sparkles: Sparkles
};

export default function AchievementsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>(mockLeaderboard);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'my-progress'>('achievements');
  const [userProgress, setUserProgress] = useState<UserAchievement[]>([]);

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = !searchQuery || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter;
    const matchesRarity = rarityFilter === 'all' || achievement.rarity === rarityFilter;
    
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const getAchievementStats = () => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlockedBy.includes(user?.id || '')).length;
    const totalPoints = achievements
      .filter(a => a.unlockedBy.includes(user?.id || ''))
      .reduce((sum, a) => sum + a.points, 0);
    const completionRate = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    
    return { total, unlocked, totalPoints, completionRate };
  };

  const stats = getAchievementStats();
  const currentUserRank = leaderboard.find(l => l.userId === user?.id)?.rank || 0;

  const handleUnlockAchievement = (achievementId: string) => {
    // In a real app, this would check requirements and unlock the achievement
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { 
            ...achievement, 
            unlockedBy: [...achievement.unlockedBy, user?.id || ''],
            totalUnlocked: achievement.totalUnlocked + 1
          }
        : achievement
    ));
    toast.success('Achievement unlocked! 🎉');
  };

  return (
    <PageLayout 
      title="Achievements & Badges" 
      subtitle="Track your progress and celebrate milestones"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.unlocked}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Medal className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">#{currentUserRank || '-'}</p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            {(['achievements', 'my-progress', 'leaderboard'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all capitalize",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'achievements' && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search achievements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border"
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="participation">Participation</option>
                  <option value="learning">Learning</option>
                  <option value="leadership">Leadership</option>
                  <option value="community">Community</option>
                  <option value="special">Special</option>
                </select>
                
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              
              {isAdmin && (
                <Button className="bg-primary hover:bg-primary/90 shadow-red" size="sm">
                  <Plus size={16} className="mr-2" />
                  Create Achievement
                </Button>
              )}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((achievement, index) => {
                const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
                const isUnlocked = achievement.unlockedBy.includes(user?.id || '');
                const progress = achievement.requirements[0]?.current || 0;
                const target = achievement.requirements[0]?.target || 1;
                const progressPercentage = Math.min((progress / target) * 100, 100);
                
                return (
                  <div 
                    key={achievement.id}
                    className={cn(
                      "bg-card rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0",
                      isUnlocked 
                        ? "border-primary/50 shadow-red hover:shadow-red-lg" 
                        : "border-border/30 hover:border-primary/30",
                      "hover:shadow-lg"
                    )}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center",
                        isUnlocked ? "bg-primary/20" : "bg-muted/50"
                      )}>
                        <IconComponent 
                          size={24} 
                          className={cn(
                            isUnlocked ? "text-primary" : "text-muted-foreground"
                          )} 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={cn("text-xs", categoryColors[achievement.category])}>
                          {achievement.category}
                        </Badge>
                        <Badge className={cn("text-xs", rarityColors[achievement.rarity])}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className={cn(
                          "font-semibold text-lg",
                          isUnlocked ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Points:</span>
                        <span className="font-semibold text-primary">{achievement.points}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Unlocked by:</span>
                        <span className="font-semibold">{achievement.totalUnlocked} members</span>
                      </div>
                      
                      {!isUnlocked && achievement.requirements[0] && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-semibold">{progress}/{target}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {achievement.requirements[0].description}
                          </p>
                        </div>
                      )}
                      
                      {isUnlocked && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle size={16} />
                          <span>Unlocked!</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'my-progress' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border/30">
              <h3 className="font-display text-xl mb-4">Your Achievement Journey</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-2xl font-display text-foreground">{stats.unlocked}</p>
                  <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                    <Star className="w-10 h-10 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-display text-foreground">{stats.totalPoints}</p>
                  <p className="text-sm text-muted-foreground">Total Points Earned</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Medal className="w-10 h-10 text-blue-500" />
                  </div>
                  <p className="text-2xl font-display text-foreground">#{currentUserRank || '-'}</p>
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Recent Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements
                    .filter(a => a.unlockedBy.includes(user?.id || ''))
                    .slice(0, 4)
                    .map(achievement => {
                      const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
                      return (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <IconComponent size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{achievement.title}</p>
                            <p className="text-xs text-muted-foreground">{achievement.points} points</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
              <div className="p-6 border-b border-border/30">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Community Leaderboard
                </h3>
              </div>
              
              <div className="divide-y divide-border/30">
                {leaderboard.map((member, index) => (
                  <div 
                    key={member.userId}
                    className={cn(
                      "p-6 flex items-center gap-4 hover:bg-muted/20 transition-colors",
                      member.userId === user?.id && "bg-primary/5 border-l-4 border-primary"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                      member.rank === 1 ? "bg-yellow-500/20 text-yellow-600" :
                      member.rank === 2 ? "bg-gray-400/20 text-gray-600" :
                      member.rank === 3 ? "bg-orange-500/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {member.rank === 1 ? <Crown size={20} /> :
                       member.rank === 2 ? <Medal size={20} /> :
                       member.rank === 3 ? <Award size={20} /> :
                       `#${member.rank}`}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{member.userName}</p>
                        {member.userId === user?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.userEmail}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          {member.totalPoints} points
                        </span>
                        <span className="text-muted-foreground">
                          {member.totalAchievements} achievements
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex gap-1 mb-2">
                        {member.recentAchievements.slice(0, 3).map((achievement, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
                            title={achievement}
                          >
                            <Trophy size={14} className="text-primary" />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Recent achievements</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}