import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import IslamicEducationFiller from './IslamicEducationFiller';
import IslamicSidebarWidget from './IslamicSidebarWidget';
import {
  BookOpen,
  Star,
  Heart,
  Clock,
  Compass,
  Calendar,
  Zap,
  Quote,
  Lightbulb,
  Target,
  Award,
  Globe,
  Users,
  MessageCircle,
  Volume2,
  Eye,
  Share2,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IslamicSpaceFillerProps {
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  autoDetectSize?: boolean;
  preferredContent?: 'educational' | 'prayer' | 'calendar' | 'mixed';
  showRotation?: boolean;
}

export default function IslamicSpaceFiller({
  className = '',
  minHeight = 200,
  maxHeight = 600,
  autoDetectSize = true,
  preferredContent = 'mixed',
  showRotation = true
}: IslamicSpaceFillerProps) {
  const [containerHeight, setContainerHeight] = useState(minHeight);
  const [currentContent, setCurrentContent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect container size
  useEffect(() => {
    if (autoDetectSize && containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height;
          if (height > minHeight) {
            setContainerHeight(Math.min(height, maxHeight));
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [autoDetectSize, minHeight, maxHeight]);

  // Content rotation
  useEffect(() => {
    if (showRotation) {
      const interval = setInterval(() => {
        setCurrentContent((prev) => (prev + 1) % contentOptions.length);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [showRotation]);

  // Different content options based on space size
  const contentOptions = [
    {
      type: 'verse',
      component: 'education',
      minHeight: 200,
      title: 'Quranic Wisdom'
    },
    {
      type: 'hadith',
      component: 'education',
      minHeight: 200,
      title: 'Prophetic Guidance'
    },
    {
      type: 'prayer-times',
      component: 'widget',
      minHeight: 250,
      title: 'Prayer Schedule'
    },
    {
      type: 'islamic-calendar',
      component: 'widget',
      minHeight: 200,
      title: 'Islamic Date'
    },
    {
      type: 'dhikr-counter',
      component: 'widget',
      minHeight: 220,
      title: 'Dhikr Counter'
    },
    {
      type: 'dua',
      component: 'education',
      minHeight: 180,
      title: 'Daily Dua'
    },
    {
      type: 'fact',
      component: 'education',
      minHeight: 160,
      title: 'Islamic Knowledge'
    },
    {
      type: 'tip',
      component: 'education',
      minHeight: 140,
      title: 'Islamic Tips'
    }
  ];

  // Filter content based on available height and preferences
  const getAvailableContent = () => {
    let filtered = contentOptions.filter(option => option.minHeight <= containerHeight);
    
    if (preferredContent !== 'mixed') {
      if (preferredContent === 'educational') {
        filtered = filtered.filter(option => option.component === 'education');
      } else if (preferredContent === 'prayer') {
        filtered = filtered.filter(option => option.type.includes('prayer') || option.type.includes('dhikr'));
      } else if (preferredContent === 'calendar') {
        filtered = filtered.filter(option => option.type.includes('calendar') || option.type.includes('time'));
      }
    }
    
    return filtered.length > 0 ? filtered : contentOptions.filter(option => option.minHeight <= containerHeight);
  };

  const availableContent = getAvailableContent();
  const selectedContent = availableContent[currentContent % availableContent.length];

  // Render compact Islamic facts for very small spaces
  const renderCompactFacts = () => {
    const facts = [
      { icon: Star, text: "There are 99 names of Allah", color: "text-yellow-500" },
      { icon: BookOpen, text: "Quran has 114 chapters (Surahs)", color: "text-green-500" },
      { icon: Clock, text: "Muslims pray 5 times daily", color: "text-blue-500" },
      { icon: Heart, text: "Charity purifies the soul", color: "text-red-500" },
      { icon: Compass, text: "Qibla points towards Makkah", color: "text-purple-500" },
      { icon: Calendar, text: "Islamic year has 12 lunar months", color: "text-orange-500" }
    ];

    return (
      <div className="grid grid-cols-2 gap-2">
        {facts.slice(0, 4).map((fact, index) => (
          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <fact.icon size={16} className={fact.color} />
            <span className="text-xs text-muted-foreground">{fact.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render Islamic reminders for medium spaces
  const renderIslamicReminders = () => {
    const reminders = [
      {
        title: "Remember Allah",
        subtitle: "In all your affairs",
        icon: Heart,
        color: "from-red-500 to-pink-500"
      },
      {
        title: "Seek Knowledge",
        subtitle: "From cradle to grave",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500"
      },
      {
        title: "Be Kind",
        subtitle: "To all of Allah's creation",
        icon: Users,
        color: "from-green-500 to-emerald-500"
      },
      {
        title: "Stay Patient",
        subtitle: "Allah is with the patient",
        icon: Clock,
        color: "from-purple-500 to-violet-500"
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {reminders.map((reminder, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 border border-border/30 hover:scale-105 transition-transform">
            <div className={`absolute inset-0 bg-gradient-to-br ${reminder.color} opacity-5`}></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${reminder.color} flex items-center justify-center shadow-lg`}>
                <reminder.icon size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{reminder.title}</h4>
                <p className="text-xs text-muted-foreground">{reminder.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render daily Islamic practices
  const renderDailyPractices = () => {
    const practices = [
      { name: "Fajr Prayer", time: "05:30", status: "completed", icon: Sun },
      { name: "Dhuhr Prayer", time: "12:15", status: "upcoming", icon: Clock },
      { name: "Quran Reading", progress: "2/4 pages", status: "in-progress", icon: BookOpen },
      { name: "Dhikr (100x)", progress: "67/100", status: "in-progress", icon: Heart },
      { name: "Charity", amount: "5 ETB", status: "pending", icon: Star }
    ];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Today's Islamic Practices</h3>
          <Badge variant="outline" className="text-xs">
            {practices.filter(p => p.status === 'completed').length}/{practices.length}
          </Badge>
        </div>
        {practices.map((practice, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                practice.status === 'completed' ? "bg-green-500" :
                practice.status === 'in-progress' ? "bg-yellow-500" : "bg-gray-400"
              )}>
                <practice.icon size={12} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{practice.name}</p>
                <p className="text-xs text-muted-foreground">
                  {practice.time || practice.progress || practice.amount}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ChevronRight size={12} />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // Main render logic based on container height
  const renderContent = () => {
    if (containerHeight < 120) {
      return renderCompactFacts();
    } else if (containerHeight < 200) {
      return renderIslamicReminders();
    } else if (containerHeight < 300) {
      return renderDailyPractices();
    } else if (selectedContent?.component === 'widget') {
      return (
        <IslamicSidebarWidget 
          variant={selectedContent.type as any}
          className="border-none shadow-none bg-transparent"
        />
      );
    } else {
      return (
        <IslamicEducationFiller
          type={selectedContent?.type as any}
          size={containerHeight > 400 ? 'large' : containerHeight > 250 ? 'medium' : 'small'}
          className="border-none shadow-none bg-transparent"
          showRotation={showRotation}
        />
      );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-card via-card/95 to-secondary/20 border border-border/30 p-4",
        className
      )}
      style={{ minHeight: `${minHeight}px` }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-lg"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        {renderContent()}
      </div>

      {/* Rotation Indicator */}
      {showRotation && availableContent.length > 1 && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <RefreshCw size={12} className="text-muted-foreground animate-spin" />
          <span className="text-xs text-muted-foreground">
            {currentContent + 1}/{availableContent.length}
          </span>
        </div>
      )}

      {/* Islamic Decoration */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-30">
        <Sparkles size={10} className="text-primary" />
        <Moon size={8} className="text-blue-500" />
        <Star size={6} className="text-yellow-500" />
      </div>
    </div>
  );
}

// Specialized variants
export function SmallIslamicFiller(props: Omit<IslamicSpaceFillerProps, 'minHeight' | 'maxHeight'>) {
  return <IslamicSpaceFiller {...props} minHeight={100} maxHeight={200} />;
}

export function MediumIslamicFiller(props: Omit<IslamicSpaceFillerProps, 'minHeight' | 'maxHeight'>) {
  return <IslamicSpaceFiller {...props} minHeight={200} maxHeight={400} />;
}

export function LargeIslamicFiller(props: Omit<IslamicSpaceFillerProps, 'minHeight' | 'maxHeight'>) {
  return <IslamicSpaceFiller {...props} minHeight={400} maxHeight={800} />;
}