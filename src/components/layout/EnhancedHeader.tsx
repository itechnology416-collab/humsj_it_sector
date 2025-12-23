import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Menu, 
  X,
  Globe, 
  User,
  ChevronDown,
  Home,
  Users,
  Calendar,
  Newspaper,
  Camera,
  Phone,
  Settings,
  LogOut,
  Sun,
  Moon,
  MessageCircle,
  Clock,
  BookOpen,
  UserPlus,
  AlertCircle,
  Accessibility,
  Plus,
  Minus,
  Contrast,
  Download,
  FileText,
  Shield,
  MessageSquare,
  Megaphone,
  ChevronRight,
  Star,
  Zap,
  Heart,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedHeaderProps {
  isLandingPage?: boolean;
}

export function EnhancedHeader({ isLandingPage = false }: EnhancedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isPrayerTimeOpen, setIsPrayerTimeOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fontSize, setFontSize] = useState(16);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [notifications] = useState(5);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  // Motion announcements data
  const announcements = [
    {
      id: 1,
      type: "urgent",
      icon: AlertCircle,
      title: "Important Notice",
      message: "New semester registration is now open. Register before January 15th, 2025.",
      action: "Register Now",
      link: "/registration",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      id: 2,
      type: "event",
      icon: Calendar,
      title: "Upcoming Event",
      message: "Islamic Knowledge Competition - January 20th, 2025 at 2:00 PM in Main Hall.",
      action: "Learn More",
      link: "/events",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 3,
      type: "achievement",
      icon: Star,
      title: "Congratulations",
      message: "HUMSJ IT Sector wins Best Innovation Award 2024 for Digital Islamic Education Platform.",
      action: "Read More",
      link: "/achievements",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      id: 4,
      type: "prayer",
      icon: Clock,
      title: "Prayer Reminder",
      message: "Don't forget Maghrib prayer at 6:20 PM today. Join us at the university mosque.",
      action: "Prayer Times",
      link: "/prayer-times",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      id: 5,
      type: "community",
      icon: Heart,
      title: "Community Service",
      message: "Join our weekly community service program every Saturday at 9:00 AM.",
      action: "Volunteer",
      link: "/volunteer-opportunities",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      id: 6,
      type: "education",
      icon: BookOpen,
      title: "New Course Available",
      message: "Advanced Arabic Language Course starts February 1st. Limited seats available.",
      action: "Enroll Now",
      link: "/courses",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-600 dark:text-indigo-400"
    }
  ];

  // Scientific Quranic verses collection
  const scientificVerses = [
    {
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      english: "And whoever fears Allah - He will make for him a way out",
      reference: "Quran 65:2",
      theme: "Divine Guidance"
    },
    {
      arabic: "وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ",
      english: "And We made from water every living thing",
      reference: "Quran 21:30",
      theme: "Origin of Life"
    },
    {
      arabic: "وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ",
      english: "And the heaven We constructed with strength, and indeed, We are [its] expander",
      reference: "Quran 51:47",
      theme: "Expanding Universe"
    },
    {
      arabic: "وَهُوَ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ فِي سِتَّةِ أَيَّامٍ",
      english: "And it is He who created the heavens and earth in six days",
      reference: "Quran 11:7",
      theme: "Creation Timeline"
    },
    {
      arabic: "وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ",
      english: "And the sun runs [on course] toward its stopping point. That is the determination of the Exalted in Might, the Knowing",
      reference: "Quran 36:38",
      theme: "Solar Motion"
    },
    {
      arabic: "وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ",
      english: "And all, in an orbit, are swimming",
      reference: "Quran 21:33",
      theme: "Celestial Orbits"
    },
    {
      arabic: "أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا",
      english: "Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them",
      reference: "Quran 21:30",
      theme: "Big Bang Theory"
    },
    {
      arabic: "وَلَقَدْ خَلَقْنَا الْإِنسَانَ مِن سُلَالَةٍ مِّن طِينٍ",
      english: "And certainly did We create man from an extract of clay",
      reference: "Quran 23:12",
      theme: "Human Origins"
    },
    {
      arabic: "وَالْجِبَالَ أَوْتَادًا",
      english: "And the mountains as stakes",
      reference: "Quran 78:7",
      theme: "Mountain Structure"
    },
    {
      arabic: "وَأَنزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ وَمَنَافِعُ لِلنَّاسِ",
      english: "And We sent down iron, wherein is great military might and benefits for the people",
      reference: "Quran 57:25",
      theme: "Iron from Space"
    },
    {
      arabic: "وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ",
      english: "And of all things We created two mates; perhaps you will remember",
      reference: "Quran 51:49",
      theme: "Pairs in Creation"
    },
    {
      arabic: "وَالْبَحْرِ الْمَسْجُورِ",
      english: "And [by] the sea filled [with fire]",
      reference: "Quran 52:6",
      theme: "Ocean Floor Fire"
    }
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Rotate verses every 10 seconds
  useEffect(() => {
    const verseTimer = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % scientificVerses.length);
    }, 10000);
    return () => clearInterval(verseTimer);
  }, [scientificVerses.length]);

  // Rotate announcements every 8 seconds
  useEffect(() => {
    const announcementTimer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 8000);
    return () => clearInterval(announcementTimer);
  }, [announcements.length]);

  // Prayer times (mock data - would come from API)
  const prayerTimes = {
    fajr: "05:30",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45"
  };

  // Hijri date (mock - would come from Islamic calendar API)
  const hijriDate = "15 Jumada al-Thani 1446";

  // Navigation items
  const mainNavItems = [
    { name: t('nav.home'), href: "/", icon: Home },
    { name: t('nav.about'), href: "/about", icon: Users },
    { name: t('nav.events'), href: "/events", icon: Calendar },
    { name: t('nav.news'), href: "/news", icon: Newspaper },
    { name: t('nav.gallery'), href: "/gallery", icon: Camera },
    { name: "Islamic Education", href: "/islamic-education", icon: BookOpen },
    { name: "Information Channels", href: "/information-channels", icon: MessageSquare },
    { name: t('nav.contact'), href: "/contact", icon: Phone }
  ];

  // Quick links
  const quickLinks = [
    { name: "Downloads", href: "/downloads", icon: Download },
    { name: "Forms", href: "/forms", icon: FileText },
    { name: "Policies", href: "/privacy", icon: Shield }
  ];

  // Languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'om', name: 'Afaan Oromo', flag: '🇪🇹' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguageData = languages.find(lang => lang.code === language) || languages[0];

  const adjustFontSize = (increase: boolean) => {
    const newSize = increase ? Math.min(fontSize + 2, 24) : Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast', !isHighContrast);
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as 'en' | 'am' | 'om' | 'ar');
    setIsLanguageDropdownOpen(false);
  };

  const getCurrentPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const times = Object.entries(prayerTimes).map(([name, time]) => {
      const [hours, minutes] = time.split(':').map(Number);
      return { name, minutes: hours * 60 + minutes };
    });
    
    for (let i = 0; i < times.length; i++) {
      if (now < times[i].minutes) {
        return { current: times[i].name, time: prayerTimes[times[i].name as keyof typeof prayerTimes] };
      }
    }
    return { current: 'fajr', time: prayerTimes.fajr };
  };

  const nextPrayer = getCurrentPrayer();

  // Manual announcement navigation (for testing/admin control)
  const goToNextAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
  };

  const goToPreviousAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div className="sticky-header-group">
      {/* Motion Announcement Banner */}
      {isAnnouncementVisible && (
        <div className={cn(
          "motion-announcement relative overflow-hidden transition-all duration-500 ease-in-out",
          isAnnouncementVisible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className={`bg-gradient-to-r ${announcements[currentAnnouncementIndex].color} text-white relative group`}>
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="flex space-x-4 animate-scroll-left">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-1 h-1 bg-white/20 rounded-full animate-pulse" 
                         style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Animated Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                      {(() => {
                        const IconComponent = announcements[currentAnnouncementIndex].icon;
                        return <IconComponent size={10} className="text-white animate-pulse" />;
                      })()}
                    </div>
                  </div>
                  
                  {/* Announcement Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Megaphone size={10} className="text-white/90 animate-wiggle flex-shrink-0" />
                      <span className="text-xs font-bold text-white/90 uppercase tracking-wide flex-shrink-0">
                        {announcements[currentAnnouncementIndex].title}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
                        {announcements.map((_, index) => (
                          <div
                            key={index}
                            className={cn(
                              "w-1 h-1 rounded-full transition-all duration-300",
                              index === currentAnnouncementIndex ? "bg-white scale-125" : "bg-white/40"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/95 truncate flex-1 min-w-0 ml-2">
                        {announcements[currentAnnouncementIndex].message}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {/* Manual Navigation (visible on hover) */}
                    <div className="hidden md:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={goToPreviousAnnouncement}
                        variant="ghost"
                        size="sm"
                        className="w-4 h-4 p-0 hover:bg-white/20 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronDown size={8} className="rotate-90" />
                      </Button>
                      <Button
                        onClick={goToNextAnnouncement}
                        variant="ghost"
                        size="sm"
                        className="w-4 h-4 p-0 hover:bg-white/20 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronDown size={8} className="-rotate-90" />
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => navigate(announcements[currentAnnouncementIndex].link)}
                      variant="ghost"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm px-2 py-0.5 h-6"
                    >
                      <span className="text-xs font-medium">{announcements[currentAnnouncementIndex].action}</span>
                      <ChevronRight size={10} className="ml-1 animate-pulse" />
                    </Button>
                    
                    {/* Close Button */}
                    <Button
                      onClick={() => setIsAnnouncementVisible(false)}
                      variant="ghost"
                      size="sm"
                      className="w-5 h-5 p-0 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                    >
                      <X size={10} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
              <div 
                className="h-full bg-white/60 transition-all duration-300 ease-linear animate-progress-bar"
                style={{ 
                  animation: 'progress-bar 8s linear infinite',
                  animationDelay: `${currentAnnouncementIndex * -8}s`
                }}
              ></div>
            </div>
          </div>
          
          {/* Thin Black Separator Line */}
          <div className="w-full h-px bg-black/20 dark:bg-white/10"></div>
        </div>
      )}

      {/* Important Notice Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-1 text-center text-sm shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          <span>Next Prayer: {nextPrayer.current.charAt(0).toUpperCase() + nextPrayer.current.slice(1)} at {nextPrayer.time}</span>
          <span className="mx-2">•</span>
          <span>Hijri: {hijriDate}</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="header-compact sticky top-0 z-50 header-gradient backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="enhanced-header-compact max-w-6xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="logo-compact w-8 h-8 rounded-xl overflow-hidden shadow-lg animate-glow backdrop-blur-sm border border-white/20">
                  <img 
                    src="/logo.jpg" 
                    alt="HUMSJ Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block">
                  <span className="font-display text-lg tracking-wider text-white">{t('org.short')}</span>
                  <p className="text-xs text-white/80 leading-tight">{t('org.sector')}</p>
                </div>
              </button>
            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-3">
              {mainNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-all hover:bg-orange-500/20 hover-lift hover-glow group",
                    location.pathname === item.href 
                      ? "text-white bg-white/20 shadow-lg" 
                      : "text-white/90 hover:text-orange-300"
                  )}
                >
                  <item.icon size={14} className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1">
              {/* Language Switcher */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="gap-1 hover-3d hover-magnetic group text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
                >
                  <Globe size={14} className="group-hover:animate-3d-rotate" />
                  <span className="hidden lg:inline text-xs">{currentLanguageData.name}</span>
                  <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                </Button>
                {isLanguageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-3",
                          language === lang.code && "bg-secondary/50"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Prayer Time Shortcut */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPrayerTimeOpen(!isPrayerTimeOpen)}
                  className="gap-1 hover-pulse hover-glow group text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
                >
                  <Clock size={14} className="group-hover:animate-wiggle" />
                  <span className="hidden lg:inline text-xs">Prayer</span>
                </Button>
                {isPrayerTimeOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border/50 rounded-xl shadow-lg p-4 z-50">
                    <h4 className="font-semibold mb-3">Today's Prayer Times</h4>
                    <div className="space-y-2">
                      {Object.entries(prayerTimes).map(([prayer, time]) => (
                        <div key={prayer} className="flex justify-between items-center">
                          <span className="capitalize text-sm">{prayer}</span>
                          <span className="text-sm font-medium">{time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">Next: {nextPrayer.current} at {nextPrayer.time}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
                className="relative hover-bounce hover-glow group text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
              >
                <Bell size={14} className="group-hover:animate-wiggle" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse-slow">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* Theme Switcher */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover-flip hover-glow group text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
              >
                {theme === 'dark' ? 
                  <Sun size={14} className="group-hover:animate-3d-rotate" /> : 
                  <Moon size={14} className="group-hover:animate-3d-rotate" />
                }
              </Button>

              {/* Accessibility Options */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                  className="text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
                >
                  <Accessibility size={14} />
                </Button>
                {isQuickLinksOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-lg p-4 z-50">
                    <h4 className="font-semibold mb-3">Accessibility</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Font Size</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => adjustFontSize(false)}>
                            <Minus size={12} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => adjustFontSize(true)}>
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>
                      <button
                        onClick={toggleHighContrast}
                        className="w-full text-left px-2 py-1 rounded hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <Contrast size={14} />
                        <span className="text-sm">High Contrast</span>
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <h5 className="font-medium mb-2 text-sm">Quick Links</h5>
                      {quickLinks.map((link) => (
                        <button
                          key={link.name}
                          onClick={() => navigate(link.href)}
                          className="w-full text-left px-2 py-1 rounded hover:bg-secondary/50 flex items-center gap-2"
                        >
                          <link.icon size={14} />
                          <span className="text-sm">{link.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile / Auth */}
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="gap-1 text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-xs font-bold text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown size={12} />
                  </Button>
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border/50">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{isAdmin ? 'Administrator' : 'Member'}</p>
                      </div>
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <User size={14} />
                        <span className="text-sm">My Profile</span>
                      </button>
                      <button
                        onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                        className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <Settings size={14} />
                        <span className="text-sm">Dashboard</span>
                      </button>
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <Settings size={14} />
                        <span className="text-sm">Settings</span>
                      </button>
                      <div className="border-t border-border/50 mt-2 pt-2">
                        <button
                          onClick={async () => {
                            try {
                              await signOut();
                              navigate("/");
                            } catch (error) {
                              console.error("Logout error:", error);
                            }
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-2 text-red-500"
                        >
                          <LogOut size={14} />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" onClick={() => navigate("/auth")} className="text-white/90 hover:text-orange-300 hover:bg-orange-500/20 hover-slide hover-glow px-2 py-1 text-sm">
                    {t('nav.login')}
                  </Button>
                  <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/20 shadow-lg gap-1 hover-lift hover-glow hover-gradient backdrop-blur-sm px-2 py-1 text-sm">
                    <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
                    {t('nav.join')}
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white/90 hover:text-orange-300 hover:bg-orange-500/20 px-2 py-1"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-compact lg:hidden border-t border-white/20 header-gradient backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 py-2">
              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "nav-item-compact w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-all hover:bg-orange-500/20",
                      location.pathname === item.href 
                        ? "text-white bg-white/20" 
                        : "text-white/90 hover:text-orange-300"
                    )}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Social Media & Help Icons - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Social Media Icons */}
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover-3d hover-glow group">
            <Globe size={16} className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
          </Button>
          <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white hover-bounce hover-glow group">
            <Camera size={16} className="group-hover:scale-125 transition-transform duration-300" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white hover-flip hover-glow group"
            onClick={() => window.open('https://t.me/humsjofficialchannel', '_blank')}
          >
            <MessageCircle size={16} className="group-hover:scale-125 transition-transform duration-300" />
          </Button>
          <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white hover-rotate hover-glow group">
            <Camera size={16} className="group-hover:scale-125 transition-transform duration-300" />
          </Button>
        </div>

        {/* Help/Chat Icon */}
        <Button size="sm" className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover-lift hover-glow hover-pulse group">
          <MessageCircle size={20} className="group-hover:animate-wiggle" />
        </Button>
      </div>

      {/* Scientific Quranic Verses Rotator - Fixed Position */}
      <div className="fixed bottom-6 left-6 z-40 max-w-sm">
        <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-lg transition-all duration-500 hover:scale-105">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className="text-primary mt-1 flex-shrink-0 animate-pulse" />
            <div className="min-h-[80px] flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
                  {scientificVerses[currentVerseIndex].theme}
                </span>
              </div>
              <p className="text-sm font-arabic text-primary mb-2 leading-relaxed transition-all duration-500" dir="rtl">
                {scientificVerses[currentVerseIndex].arabic}
              </p>
              <p className="text-xs text-muted-foreground italic leading-relaxed transition-all duration-500">
                "{scientificVerses[currentVerseIndex].english}" - {scientificVerses[currentVerseIndex].reference}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-1">
                  {scientificVerses.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentVerseIndex ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentVerseIndex + 1}/{scientificVerses.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}