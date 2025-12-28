import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Heart, 
  Star, 
  Calendar, 
  Bell, 
  Store,
  Play,
  Target,
  Moon,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IslamicFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  path: string;
  category: 'worship' | 'learning' | 'community' | 'tools' | 'education';
  isNew?: boolean;
  color: string;
  bgColor: string;
  requiresAuth?: boolean;
}

const ISLAMIC_FEATURES: IslamicFeature[] = [
  {
    id: 'quran-audio',
    title: 'Quran Audio Player',
    description: 'Listen to beautiful Quran recitations with multiple reciters, playlist functionality, and verse-by-verse navigation.',
    icon: BookOpen,
    path: '/quran-audio',
    category: 'worship',
    isNew: true,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20'
  },
  {
    id: 'prayer-tracker',
    title: 'Prayer Tracker',
    description: 'Track your daily prayers, build consistent habits, and monitor your spiritual progress with detailed analytics.',
    icon: Clock,
    path: '/prayer-tracker',
    category: 'worship',
    isNew: true,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20'
  },
  {
    id: 'islamic-course-enrollment',
    title: 'Islamic Course Enrollment',
    description: 'Enroll in comprehensive Islamic courses covering Quran, Hadith, Fiqh, Arabic, and more. Authenticated access only.',
    icon: GraduationCap,
    path: '/islamic-course-enrollment',
    category: 'education',
    isNew: true,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20',
    requiresAuth: true
  },
  {
    id: 'dhikr-counter',
    title: 'Digital Tasbih',
    description: 'Keep track of your dhikr and remembrance of Allah with customizable counters and goal tracking.',
    icon: Heart,
    path: '/dhikr-counter',
    category: 'worship',
    isNew: true,
    color: 'text-red-500',
    bgColor: 'bg-red-500/20'
  },
  {
    id: 'hijri-calendar',
    title: 'Hijri Calendar',
    description: 'Islamic lunar calendar with important dates, events, and conversion between Hijri and Gregorian dates.',
    icon: Calendar,
    path: '/hijri-calendar',
    category: 'tools',
    isNew: true,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20'
  },
  {
    id: 'islamic-notifications',
    title: 'Islamic Notifications',
    description: 'Stay connected with prayer reminders, dhikr alerts, and important Islamic events with smart notifications.',
    icon: Bell,
    path: '/islamic-notifications',
    category: 'tools',
    isNew: true,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20'
  },
  {
    id: 'halal-marketplace',
    title: 'Halal Marketplace',
    description: 'Discover halal businesses, restaurants, and services in your community with reviews and ratings.',
    icon: Store,
    path: '/halal-marketplace',
    category: 'community',
    isNew: true,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/20'
  },
  {
    id: 'prayer-times',
    title: 'Prayer Times',
    description: 'Accurate prayer times for your location with multiple calculation methods and customizable settings.',
    icon: Clock,
    path: '/prayer-times',
    category: 'worship',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/20'
  },
  {
    id: 'qibla-finder',
    title: 'Qibla Finder',
    description: 'Find the direction of Qibla from anywhere in the world using GPS and compass functionality.',
    icon: Target,
    path: '/qibla-finder',
    category: 'tools',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20'
  },
  {
    id: 'islamic-calendar',
    title: 'Islamic Events Calendar',
    description: 'Complete Islamic calendar with major events, holidays, and important dates throughout the year.',
    icon: Moon,
    path: '/islamic-calendar',
    category: 'learning',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Features', count: ISLAMIC_FEATURES.length },
  { id: 'worship', name: 'Worship & Prayer', count: ISLAMIC_FEATURES.filter(f => f.category === 'worship').length },
  { id: 'learning', name: 'Learning & Education', count: ISLAMIC_FEATURES.filter(f => f.category === 'learning').length },
  { id: 'education', name: 'Course Enrollment', count: ISLAMIC_FEATURES.filter(f => f.category === 'education').length },
  { id: 'community', name: 'Community & Social', count: ISLAMIC_FEATURES.filter(f => f.category === 'community').length },
  { id: 'tools', name: 'Islamic Tools', count: ISLAMIC_FEATURES.filter(f => f.category === 'tools').length }
];

export default function IslamicFeaturesShowcase() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const newFeaturesCount = ISLAMIC_FEATURES.filter(f => f.isNew).length;

  const handleFeatureClick = (feature: IslamicFeature) => {
    if (feature.requiresAuth && !user) {
      toast.error("Please login to access this feature");
      navigate("/auth");
      return;
    }
    navigate(feature.path);
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Features" 
      subtitle="Comprehensive Islamic tools and resources for your spiritual journey"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        {/* Header Banner */}
        <Card className="bg-gradient-to-r from-primary/20 via-card to-accent/20 border-primary/30">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-lg animate-glow">
                <Sparkles size={32} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-display tracking-wide mb-2">
                  Complete Islamic Digital Experience
                </h2>
                <p className="text-muted-foreground mb-4">
                  Discover our comprehensive suite of Islamic tools designed to support your faith, 
                  enhance your worship, and connect you with the Muslim community.
                </p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {ISLAMIC_FEATURES.length} Total Features
                  </Badge>
                  {newFeaturesCount > 0 && (
                    <Badge variant="outline" className="border-green-500/50 text-green-600 animate-pulse">
                      <Zap size={12} className="mr-1" />
                      {newFeaturesCount} New Features
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((category, index) => (
            <Card 
              key={category.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{category.count}</p>
                <p className="text-sm font-medium">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Features Highlight */}
        {newFeaturesCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap size={20} className="text-primary" />
              <h3 className="text-xl font-display tracking-wide">Latest Features</h3>
              <Badge variant="outline" className="border-green-500/50 text-green-600 animate-pulse">
                New
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ISLAMIC_FEATURES.filter(feature => feature.isNew).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={feature.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-slide-up border-primary/20"
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => handleFeatureClick(feature)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", feature.bgColor)}>
                          <IconComponent size={24} className={feature.color} />
                        </div>
                        <Badge className="bg-green-500 text-white animate-pulse">
                          <Sparkles size={10} className="mr-1" />
                          New
                        </Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs capitalize">
                          {feature.category}
                        </Badge>
                        <Button 
                          size="sm" 
                          className="gap-2 group-hover:gap-3 transition-all"
                        >
                          <Play size={14} />
                          Try Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Features by Category */}
        <div>
          <h3 className="text-xl font-display tracking-wide mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-primary" />
            All Islamic Features
          </h3>

          {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => {
            const categoryFeatures = ISLAMIC_FEATURES.filter(f => f.category === category.id);
            
            return (
              <div key={category.id} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-lg font-semibold">{category.name}</h4>
                  <Badge variant="outline">{categoryFeatures.length} features</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryFeatures.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Card 
                        key={feature.id}
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => handleFeatureClick(feature)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", feature.bgColor)}>
                              <IconComponent size={20} className={feature.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className="font-medium group-hover:text-primary transition-colors">
                                    {feature.title}
                                  </h5>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {feature.description}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {feature.isNew && (
                                    <Badge className="bg-green-500 text-white text-xs animate-pulse">
                                      New
                                    </Badge>
                                  )}
                                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 via-card to-accent/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <BookOpen size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-display tracking-wide mb-2">
              Start Your Islamic Digital Journey
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore these comprehensive Islamic tools designed to enhance your worship, 
              deepen your knowledge, and strengthen your connection with Allah and the Muslim community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/prayer-times')}
                className="gap-2"
              >
                <Clock size={16} />
                Start with Prayer Times
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/quran-audio')}
                className="gap-2"
              >
                <BookOpen size={16} />
                Listen to Quran
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}