import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Star,
  Moon,
  Sun,
  BookOpen,
  Clock,
  Compass,
  Globe,
  Users,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IslamicFooterProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
  showIslamicQuote?: boolean;
  showPrayerReminder?: boolean;
  showHijriDate?: boolean;
}

export default function IslamicFooter({
  variant = 'full',
  className = '',
  showIslamicQuote = true,
  showPrayerReminder = true,
  showHijriDate = true
}: IslamicFooterProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuote, setCurrentQuote] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Rotate quotes every 15 seconds
  useEffect(() => {
    if (showIslamicQuote) {
      const quoteTimer = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % islamicQuotes.length);
      }, 15000);
      return () => clearInterval(quoteTimer);
    }
  }, [showIslamicQuote, islamicQuotes.length]);

  const islamicQuotes = [
    {
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      english: "And whoever fears Allah - He will make for him a way out",
      reference: "Quran 65:2"
    },
    {
      text: "The best of people are those who benefit others",
      author: "Prophet Muhammad (PBUH)",
      arabic: "خَيْرُ النَّاسِ أَنفَعُهُمْ لِلنَّاسِ"
    },
    {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english: "Indeed, with hardship comes ease",
      reference: "Quran 94:6"
    },
    {
      text: "Seek knowledge from the cradle to the grave",
      author: "Prophet Muhammad (PBUH)",
      arabic: "اطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ"
    }
  ];

  const getHijriDate = () => {
    // Mock Hijri date (would come from Islamic calendar API)
    return "15 Jumada al-Thani 1446 AH";
  };

  const getNextPrayerTime = () => {
    // Mock next prayer (would come from prayer times API)
    const hour = currentTime.getHours();
    if (hour < 5) return { name: 'Fajr', time: '05:30' };
    if (hour < 12) return { name: 'Dhuhr', time: '12:15' };
    if (hour < 15) return { name: 'Asr', time: '15:45' };
    if (hour < 18) return { name: 'Maghrib', time: '18:20' };
    if (hour < 19) return { name: 'Isha', time: '19:45' };
    return { name: 'Fajr', time: '05:30' };
  };

  const renderMinimalFooter = () => (
    <footer className={cn(
      "bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-t border-border/30 py-3",
      className
    )}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart size={12} className="text-primary" />
              </div>
              <span className="text-muted-foreground">HUMSJ IT Sector</span>
            </div>
            {showHijriDate && (
              <Badge variant="outline" className="text-xs">
                {getHijriDate()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {showPrayerReminder && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={12} />
                <span className="text-xs">Next: {getNextPrayerTime().name} at {getNextPrayerTime().time}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              © 2024 HUMSJ
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  const renderCompactFooter = () => (
    <footer className={cn(
      "bg-gradient-to-br from-card via-card/95 to-card border-t border-border/30 py-6",
      className
    )}>
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        {/* Islamic Quote */}
        {showIslamicQuote && (
          <div className="text-center space-y-2 py-4 border-b border-border/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Islamic Wisdom</span>
            </div>
            {islamicQuotes[currentQuote].arabic && (
              <p className="text-sm font-arabic text-primary" dir="rtl">
                {islamicQuotes[currentQuote].arabic}
              </p>
            )}
            <p className="text-sm text-muted-foreground italic">
              "{islamicQuotes[currentQuote].english || islamicQuotes[currentQuote].text}"
            </p>
            <Badge variant="outline" className="text-xs">
              {islamicQuotes[currentQuote].reference || islamicQuotes[currentQuote].author}
            </Badge>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <img src="/logo.jpg" alt="HUMSJ" className="w-6 h-6 rounded-full object-cover" />
              </div>
              <div>
                <div className="font-semibold text-sm">HUMSJ IT Sector</div>
                <div className="text-xs text-muted-foreground">Haramaya University Muslim Students Jama'a</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            {showHijriDate && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span className="text-muted-foreground">{getHijriDate()}</span>
              </div>
            )}
            {showPrayerReminder && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                <span className="text-muted-foreground">
                  Next Prayer: {getNextPrayerTime().name} at {getNextPrayerTime().time}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            © 2024 Haramaya University Muslim Students Jama'a - Information Technology Sector. 
            Built with ❤️ for the Muslim community.
          </p>
        </div>
      </div>
    </footer>
  );

  const renderFullFooter = () => (
    <footer className={cn(
      "bg-gradient-to-br from-card via-card/95 to-secondary/20 border-t border-border/30 py-12",
      className
    )}>
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Islamic Quote Section */}
        {showIslamicQuote && (
          <div className="text-center space-y-4 py-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border border-border/30">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Daily Islamic Wisdom</h3>
                <p className="text-xs text-muted-foreground">Guidance from Quran and Sunnah</p>
              </div>
            </div>
            
            {islamicQuotes[currentQuote].arabic && (
              <p className="text-lg font-arabic text-primary leading-relaxed max-w-2xl mx-auto" dir="rtl">
                {islamicQuotes[currentQuote].arabic}
              </p>
            )}
            <p className="text-base text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
              "{islamicQuotes[currentQuote].english || islamicQuotes[currentQuote].text}"
            </p>
            <Badge variant="secondary" className="text-sm">
              {islamicQuotes[currentQuote].reference || islamicQuotes[currentQuote].author}
            </Badge>
            
            {/* Quote Navigation */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {islamicQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentQuote ? "bg-primary scale-125" : "bg-border hover:bg-primary/50"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <img src="/logo.jpg" alt="HUMSJ" className="w-10 h-10 rounded-lg object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-lg">HUMSJ</h3>
                <p className="text-sm text-muted-foreground">IT Sector</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Haramaya University Muslim Students Jama'a - Information Technology Sector. 
              Serving the Muslim student community with innovative digital solutions.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Users size={14} className="mr-1" />
                Join Us
              </Button>
              <Button variant="outline" size="sm">
                <Heart size={14} className="mr-1" />
                Donate
              </Button>
            </div>
          </div>

          {/* Islamic Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              Islamic Resources
            </h4>
            <div className="space-y-2 text-sm">
              <a href="/quran-study" className="block text-muted-foreground hover:text-primary transition-colors">
                Quran Study
              </a>
              <a href="/hadith-collection" className="block text-muted-foreground hover:text-primary transition-colors">
                Hadith Collection
              </a>
              <a href="/prayer-times" className="block text-muted-foreground hover:text-primary transition-colors">
                Prayer Times
              </a>
              <a href="/islamic-calendar" className="block text-muted-foreground hover:text-primary transition-colors">
                Islamic Calendar
              </a>
              <a href="/dua-collection" className="block text-muted-foreground hover:text-primary transition-colors">
                Dua Collection
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              Our Services
            </h4>
            <div className="space-y-2 text-sm">
              <a href="/events" className="block text-muted-foreground hover:text-primary transition-colors">
                Islamic Events
              </a>
              <a href="/courses" className="block text-muted-foreground hover:text-primary transition-colors">
                Educational Courses
              </a>
              <a href="/volunteer-opportunities" className="block text-muted-foreground hover:text-primary transition-colors">
                Volunteer Programs
              </a>
              <a href="/digital-dawa" className="block text-muted-foreground hover:text-primary transition-colors">
                Digital Da'wa
              </a>
              <a href="/community-support" className="block text-muted-foreground hover:text-primary transition-colors">
                Community Support
              </a>
            </div>
          </div>

          {/* Contact & Prayer Info */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={12} />
                <span>info@humsj.edu.et</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={12} />
                <span>+251-25-553-0011</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={12} />
                <span>Haramaya University, Ethiopia</span>
              </div>
              
              {showHijriDate && (
                <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t border-border/30">
                  <Calendar size={12} />
                  <span>{getHijriDate()}</span>
                </div>
              )}
              
              {showPrayerReminder && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={12} />
                  <span>Next Prayer: {getNextPrayerTime().name} at {getNextPrayerTime().time}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 HUMSJ IT Sector</span>
              <span>•</span>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Built with</span>
              <Heart size={14} className="text-red-500" />
              <span className="text-sm text-muted-foreground">for the Ummah</span>
              <div className="flex items-center gap-1 ml-2">
                <Star size={12} className="text-yellow-500" />
                <Sparkles size={12} className="text-primary" />
                <Moon size={12} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  switch (variant) {
    case 'minimal':
      return renderMinimalFooter();
    case 'compact':
      return renderCompactFooter();
    case 'full':
    default:
      return renderFullFooter();
  }
}

// Specialized exports
export function MinimalIslamicFooter(props: Omit<IslamicFooterProps, 'variant'>) {
  return <IslamicFooter {...props} variant="minimal" />;
}

export function CompactIslamicFooter(props: Omit<IslamicFooterProps, 'variant'>) {
  return <IslamicFooter {...props} variant="compact" />;
}

export function FullIslamicFooter(props: Omit<IslamicFooterProps, 'variant'>) {
  return <IslamicFooter {...props} variant="full" />;
}