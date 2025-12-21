import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Search, 
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
  Volume2,
  Heart,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Clock,
  BookOpen,
  Sparkles,
  UserPlus,
  DollarSign,
  AlertCircle,
  Accessibility,
  Plus,
  Minus,
  Contrast,
  HelpCircle,
  Download,
  FileText,
  Shield
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [fontSize, setFontSize] = useState(16);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [notifications, setNotifications] = useState(5);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
    { name: "Home", href: "/", icon: Home },
    { name: "About Us", href: "/about", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "News", href: "/communication", icon: Newspaper },
    { name: "Gallery", href: "/gallery", icon: Camera },
    { name: "Contact", href: "/contact", icon: Phone }
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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const adjustFontSize = (increase: boolean) => {
    const newSize = increase ? Math.min(fontSize + 2, 24) : Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast', !isHighContrast);
  };

  const handleLanguageChange = (language: typeof languages[0]) => {
    setCurrentLanguage(language.name);
    setIsLanguageDropdownOpen(false);
    // Implement language change logic here
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

  return (
    <>
      {/* Important Notice Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-2 text-center text-sm shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          <span>Next Prayer: {nextPrayer.current.charAt(0).toUpperCase() + nextPrayer.current.slice(1)} at {nextPrayer.time}</span>
          <span className="mx-2">•</span>
          <span>Hijri: {hijriDate}</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 header-gradient backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-lg animate-glow backdrop-blur-sm border border-white/20">
                  <span className="text-2xl font-bold text-white font-display">H</span>
                </div>
                <div className="hidden md:block">
                  <span className="font-display text-2xl tracking-wider text-white">HUMSJ</span>
                  <p className="text-xs text-white/80">Information Technology Sector</p>
                </div>
              </button>
            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 hover-lift hover-glow group",
                    location.pathname === item.href 
                      ? "text-white bg-white/20 shadow-lg" 
                      : "text-white/90 hover:text-white"
                  )}
                >
                  <item.icon size={16} className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 text-sm transition-all outline-none text-white placeholder-white/60 backdrop-blur-sm"
                />
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="gap-2 hover-3d hover-magnetic group text-white/90 hover:text-white hover:bg-white/10"
                >
                  <Globe size={16} className="group-hover:animate-3d-rotate" />
                  <span className="hidden md:inline">{currentLanguage}</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </Button>
                {isLanguageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center gap-3"
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
                  className="gap-2 hover-pulse hover-glow group text-white/90 hover:text-white hover:bg-white/10"
                >
                  <Clock size={16} className="group-hover:animate-wiggle" />
                  <span className="hidden md:inline">Prayer</span>
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
                className="relative hover-bounce hover-glow group text-white/90 hover:text-white hover:bg-white/10"
              >
                <Bell size={16} className="group-hover:animate-wiggle" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse-slow">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* Theme Switcher */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover-flip hover-glow group text-white/90 hover:text-white hover:bg-white/10"
              >
                {theme === 'dark' ? 
                  <Sun size={16} className="group-hover:animate-3d-rotate" /> : 
                  <Moon size={16} className="group-hover:animate-3d-rotate" />
                }
              </Button>

              {/* Accessibility Options */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                  className="text-white/90 hover:text-white hover:bg-white/10"
                >
                  <Accessibility size={16} />
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
                    className="gap-2 text-white/90 hover:text-white hover:bg-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-sm font-bold text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown size={14} />
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
                          onClick={signOut}
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
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => navigate("/auth")} className="text-white/90 hover:text-white hover:bg-white/10 hover-slide hover-glow">
                    Login
                  </Button>
                  <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/20 shadow-lg gap-2 hover-lift hover-glow hover-gradient backdrop-blur-sm">
                    <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                    Join Us
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white/90 hover:text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 header-gradient backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 text-sm transition-all outline-none text-white placeholder-white/60 backdrop-blur-sm"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {mainNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all hover:bg-white/10",
                      location.pathname === item.href 
                        ? "text-white bg-white/20" 
                        : "text-white/90 hover:text-white"
                    )}
                  >
                    <item.icon size={18} />
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
            <Facebook size={16} className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
          </Button>
          <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white hover-bounce hover-glow group">
            <Youtube size={16} className="group-hover:scale-125 transition-transform duration-300" />
          </Button>
          <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white hover-flip hover-glow group">
            <Twitter size={16} className="group-hover:scale-125 transition-transform duration-300" />
          </Button>
          <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white hover-rotate hover-glow group">
            <Instagram size={16} className="group-hover:scale-125 transition-transform duration-300" />
          </Button>
        </div>

        {/* Help/Chat Icon */}
        <Button size="sm" className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover-lift hover-glow hover-pulse group">
          <MessageCircle size={20} className="group-hover:animate-wiggle" />
        </Button>
      </div>

      {/* Quranic Quote Rotator - Fixed Position */}
      <div className="fixed bottom-6 left-6 z-40 max-w-sm">
        <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-arabic text-primary mb-1" dir="rtl">
                وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
              </p>
              <p className="text-xs text-muted-foreground italic">
                "And whoever fears Allah - He will make for him a way out" - Quran 65:2
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}