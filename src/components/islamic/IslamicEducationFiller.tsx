import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Star,
  Clock,
  Heart,
  Lightbulb,
  Quote,
  Calendar,
  Users,
  Globe,
  Compass,
  Moon,
  Sun,
  Zap,
  Award,
  Target,
  Bookmark,
  ChevronRight,
  Play,
  Volume2,
  Eye,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IslamicEducationFillerProps {
  type?: 'verse' | 'hadith' | 'dua' | 'fact' | 'tip' | 'quote' | 'mixed';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showRotation?: boolean;
  rotationInterval?: number;
}

export default function IslamicEducationFiller({
  type = 'mixed',
  size = 'medium',
  className = '',
  showRotation = true,
  rotationInterval = 10000
}: IslamicEducationFillerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Comprehensive Islamic educational content
  const islamicContent = {
    verses: [
      {
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        english: "And whoever fears Allah - He will make for him a way out",
        reference: "Quran 65:2",
        theme: "Trust in Allah",
        lesson: "When we have Taqwa (God-consciousness), Allah provides solutions to our problems."
      },
      {
        arabic: "وَبَشِّرِ الصَّابِرِينَ",
        english: "And give good tidings to the patient",
        reference: "Quran 2:155",
        theme: "Patience",
        lesson: "Patience (Sabr) is a virtue that brings Allah's blessings and good news."
      },
      {
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        english: "Indeed, with hardship comes ease",
        reference: "Quran 94:6",
        theme: "Hope",
        lesson: "After every difficulty, Allah provides relief and ease."
      },
      {
        arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
        english: "And He is with you wherever you are",
        reference: "Quran 57:4",
        theme: "Divine Presence",
        lesson: "Allah is always with us, watching over and guiding us."
      },
      {
        arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
        english: "So remember Me; I will remember you",
        reference: "Quran 2:152",
        theme: "Dhikr",
        lesson: "When we remember Allah, He remembers us and blesses us."
      }
    ],
    hadiths: [
      {
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        english: "Actions are but by intention",
        reference: "Bukhari & Muslim",
        theme: "Intention",
        lesson: "The value of our deeds depends on our sincere intentions."
      },
      {
        arabic: "الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
        english: "The believer to another believer is like a building whose different parts enforce each other",
        reference: "Bukhari & Muslim",
        theme: "Unity",
        lesson: "Muslims should support and strengthen each other like parts of a building."
      },
      {
        arabic: "مَن لَّا يَرْحَمُ النَّاسَ لَا يَرْحَمُهُ اللَّهُ",
        english: "He who does not show mercy to people, Allah will not show mercy to him",
        reference: "Bukhari & Muslim",
        theme: "Mercy",
        lesson: "Showing compassion to others brings Allah's mercy upon us."
      },
      {
        arabic: "خَيْرُ النَّاسِ أَنفَعُهُمْ لِلنَّاسِ",
        english: "The best of people are those who benefit others",
        reference: "Ahmad",
        theme: "Service",
        lesson: "True excellence comes from serving and helping others."
      }
    ],
    duas: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire",
        reference: "Quran 2:201",
        theme: "Comprehensive Dua",
        lesson: "A balanced prayer for success in both worlds."
      },
      {
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
        english: "My Lord, expand for me my breast and ease for me my task",
        reference: "Quran 20:25-26",
        theme: "Seeking Help",
        lesson: "Ask Allah to open your heart and make your affairs easy."
      },
      {
        arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
        english: "Our Lord, do not impose blame upon us if we forget or make mistakes",
        reference: "Quran 2:286",
        theme: "Forgiveness",
        lesson: "Seek Allah's forgiveness for our human weaknesses."
      }
    ],
    facts: [
      {
        title: "The Five Pillars of Islam",
        content: "Shahada (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), Hajj (Pilgrimage)",
        theme: "Fundamentals",
        lesson: "These are the foundation of Muslim practice and belief."
      },
      {
        title: "99 Names of Allah",
        content: "Allah has 99 beautiful names (Asma ul-Husna) that describe His attributes",
        theme: "Divine Attributes",
        lesson: "Learning Allah's names helps us understand His nature and draw closer to Him."
      },
      {
        title: "The Night of Power",
        content: "Laylat al-Qadr is better than a thousand months of worship",
        theme: "Special Nights",
        lesson: "Some moments in time carry extraordinary spiritual significance."
      },
      {
        title: "Islamic Calendar",
        content: "The Islamic calendar is lunar-based with 12 months, starting with Muharram",
        theme: "Time",
        lesson: "Muslims follow a calendar that connects them to Islamic history and events."
      }
    ],
    tips: [
      {
        title: "Start with Bismillah",
        content: "Begin every task by saying 'Bismillah' (In the name of Allah)",
        theme: "Daily Practice",
        lesson: "Invoking Allah's name brings blessings to our actions."
      },
      {
        title: "Make Dua Between Maghrib and Isha",
        content: "This is a blessed time when duas are more likely to be accepted",
        theme: "Prayer Times",
        lesson: "Certain times are more spiritually powerful for supplication."
      },
      {
        title: "Read Quran Daily",
        content: "Even if it's just one verse, maintain a daily connection with the Quran",
        theme: "Quran",
        lesson: "Consistent small actions are better than sporadic large ones."
      },
      {
        title: "Give Charity Regularly",
        content: "Even a small amount given regularly purifies wealth and brings blessings",
        theme: "Charity",
        lesson: "Generosity, no matter how small, has great spiritual benefits."
      }
    ],
    quotes: [
      {
        text: "The world is green and beautiful, and Allah has appointed you as His stewards over it",
        author: "Prophet Muhammad (PBUH)",
        theme: "Environment",
        lesson: "Muslims have a responsibility to care for the environment."
      },
      {
        text: "Seek knowledge from the cradle to the grave",
        author: "Prophet Muhammad (PBUH)",
        theme: "Education",
        lesson: "Learning is a lifelong obligation in Islam."
      },
      {
        text: "The best jihad is a word of truth spoken before a tyrannical ruler",
        author: "Prophet Muhammad (PBUH)",
        theme: "Justice",
        lesson: "Speaking truth to power is one of the highest forms of struggle."
      }
    ]
  };

  // Get content based on type
  const getContent = () => {
    if (type === 'mixed') {
      const allContent = [
        ...islamicContent.verses.map(v => ({ ...v, type: 'verse' })),
        ...islamicContent.hadiths.map(h => ({ ...h, type: 'hadith' })),
        ...islamicContent.duas.map(d => ({ ...d, type: 'dua' })),
        ...islamicContent.facts.map(f => ({ ...f, type: 'fact' })),
        ...islamicContent.tips.map(t => ({ ...t, type: 'tip' })),
        ...islamicContent.quotes.map(q => ({ ...q, type: 'quote' }))
      ];
      return allContent;
    }
    return islamicContent[type === 'verse' ? 'verses' : 
                       type === 'hadith' ? 'hadiths' :
                       type === 'dua' ? 'duas' :
                       type === 'fact' ? 'facts' :
                       type === 'tip' ? 'tips' : 'quotes'].map(item => ({ ...item, type }));
  };

  const content = getContent();

  // Rotation effect
  useEffect(() => {
    if (showRotation && content.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % content.length);
      }, rotationInterval);
      return () => clearInterval(interval);
    }
  }, [showRotation, content.length, rotationInterval]);

  const currentContent = content[currentIndex];

  const getIcon = (contentType: string) => {
    switch (contentType) {
      case 'verse': return BookOpen;
      case 'hadith': return Quote;
      case 'dua': return Heart;
      case 'fact': return Lightbulb;
      case 'tip': return Target;
      case 'quote': return Star;
      default: return BookOpen;
    }
  };

  const getColor = (contentType: string) => {
    switch (contentType) {
      case 'verse': return 'from-green-500 to-emerald-500';
      case 'hadith': return 'from-blue-500 to-cyan-500';
      case 'dua': return 'from-purple-500 to-violet-500';
      case 'fact': return 'from-yellow-500 to-amber-500';
      case 'tip': return 'from-orange-500 to-red-500';
      case 'quote': return 'from-pink-500 to-rose-500';
      default: return 'from-primary to-primary/80';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-3 text-sm';
      case 'large':
        return 'p-8 text-lg';
      default:
        return 'p-6 text-base';
    }
  };

  const IconComponent = getIcon(currentContent?.type || 'verse');

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-lg',
      getSizeClasses(),
      className
    )}>
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getColor(currentContent?.type || 'verse')} opacity-5`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(currentContent?.type || 'verse')} flex items-center justify-center shadow-lg`}>
              <IconComponent size={20} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {currentContent?.type === 'verse' ? 'Quranic Verse' :
                 currentContent?.type === 'hadith' ? 'Prophetic Hadith' :
                 currentContent?.type === 'dua' ? 'Islamic Dua' :
                 currentContent?.type === 'fact' ? 'Islamic Knowledge' :
                 currentContent?.type === 'tip' ? 'Islamic Tip' :
                 'Islamic Wisdom'}
              </CardTitle>
              <CardDescription className="text-sm">
                {currentContent?.theme}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1}/{content.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Arabic Text (for verses, hadiths, duas) */}
        {(currentContent?.arabic) && (
          <div className="text-center">
            <p className="text-lg font-arabic text-primary leading-relaxed" dir="rtl">
              {currentContent.arabic}
            </p>
          </div>
        )}

        {/* English Translation/Content */}
        <div className="text-center">
          <p className="text-muted-foreground italic leading-relaxed">
            "{currentContent?.english || currentContent?.content || currentContent?.text}"
          </p>
        </div>

        {/* Reference */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {currentContent?.reference || `${currentContent?.author}`}
          </Badge>
        </div>

        {/* Lesson/Insight */}
        {currentContent?.lesson && (
          <div className="bg-secondary/30 rounded-lg p-3 border-l-4 border-primary">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong>Lesson:</strong> {currentContent.lesson}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Bookmark size={14} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Share2 size={14} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Volume2 size={14} />
            </Button>
          </div>
          
          {content.length > 1 && (
            <div className="flex items-center gap-1">
              {content.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex ? "bg-primary scale-125" : "bg-border hover:bg-primary/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Progress Bar (if rotating) */}
      {showRotation && content.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary">
          <div 
            className={`h-full bg-gradient-to-r ${getColor(currentContent?.type || 'verse')} transition-all duration-300 ease-linear`}
            style={{ 
              animation: `progress-bar ${rotationInterval}ms linear infinite`,
              animationDelay: `${currentIndex * -rotationInterval}ms`
            }}
          />
        </div>
      )}
    </Card>
  );
}

// Specialized components for different use cases
export function IslamicVerseFiller(props: Omit<IslamicEducationFillerProps, 'type'>) {
  return <IslamicEducationFiller {...props} type="verse" />;
}

export function IslamicHadithFiller(props: Omit<IslamicEducationFillerProps, 'type'>) {
  return <IslamicEducationFiller {...props} type="hadith" />;
}

export function IslamicDuaFiller(props: Omit<IslamicEducationFillerProps, 'type'>) {
  return <IslamicEducationFiller {...props} type="dua" />;
}

export function IslamicFactFiller(props: Omit<IslamicEducationFillerProps, 'type'>) {
  return <IslamicEducationFiller {...props} type="fact" />;
}

export function IslamicTipFiller(props: Omit<IslamicEducationFillerProps, 'type'>) {
  return <IslamicEducationFiller {...props} type="tip" />;
}

export function IslamicQuoteFiller(props: Omit<IslamicEducationFillerProps, 'type'>) {
  return <IslamicEducationFiller {...props} type="quote" />;
}