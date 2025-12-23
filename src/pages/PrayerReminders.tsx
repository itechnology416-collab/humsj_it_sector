import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
// import PrayerReminderSettings from "@/components/islamic/PrayerReminderSettings";
import { usePrayerReminders } from "@/hooks/usePrayerReminders";
import { 
  Bell, 
  Clock, 
  Calendar,
  MapPin,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Star,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon
};

export default function PrayerReminders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextPrayer, timeUntilNext, prayerTimes, settings } = usePrayerReminders();

  const getCurrentPrayerStatus = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    let currentPrayer = null;
    let nextPrayerInfo = null;
    
    for (let i = 0; i < prayerTimes.length; i++) {
      const prayer = prayerTimes[i];
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        nextPrayerInfo = prayer;
        currentPrayer = i > 0 ? prayerTimes[i - 1] : prayerTimes[prayerTimes.length - 1];
        break;
      }
    }
    
    if (!nextPrayerInfo) {
      nextPrayerInfo = prayerTimes[0]; // Fajr tomorrow
      currentPrayer = prayerTimes[prayerTimes.length - 1]; // Isha
    }
    
    return { currentPrayer, nextPrayerInfo };
  };

  const { currentPrayer, nextPrayerInfo } = getCurrentPrayerStatus();

  return (
    <PageLayout 
      title="Prayer Reminders" 
      subtitle="Never miss a prayer with intelligent Islamic reminders"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Bell size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Islamic Reminders</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Prayer Reminders</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Stay connected to your faith with intelligent prayer reminders. 
            Get notified before each prayer time with customizable settings.
          </p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Next Prayer */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  {nextPrayerInfo && React.createElement(prayerIcons[nextPrayerInfo.name as keyof typeof prayerIcons] || Clock, { 
                    size: 24, 
                    className: "text-primary" 
                  })}
                </div>
                <div>
                  <CardTitle className="text-xl">Next Prayer</CardTitle>
                  <CardDescription>Upcoming prayer time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {nextPrayerInfo ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-display mb-1">{nextPrayerInfo.name}</h3>
                    <p className="text-right text-lg font-arabic mb-2" dir="rtl">{nextPrayerInfo.arabic}</p>
                    <p className="text-3xl font-mono text-primary mb-2">{nextPrayerInfo.time}</p>
                    <Badge variant="outline" className="text-sm">
                      {timeUntilNext ? `in ${timeUntilNext}` : 'Calculating...'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>Haramaya, Ethiopia</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Loading prayer times...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Prayer */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/10" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  {currentPrayer && React.createElement(prayerIcons[currentPrayer.name as keyof typeof prayerIcons] || Clock, { 
                    size: 24, 
                    className: "text-green-600" 
                  })}
                </div>
                <div>
                  <CardTitle className="text-xl">Current Prayer</CardTitle>
                  <CardDescription>Active prayer period</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {currentPrayer ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-display mb-1">{currentPrayer.name}</h3>
                    <p className="text-right text-lg font-arabic mb-2" dir="rtl">{currentPrayer.arabic}</p>
                    <p className="text-2xl font-mono text-green-600 mb-2">{currentPrayer.time}</p>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active Period
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Star size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Between prayers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Prayer Times */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-primary" />
              <div>
                <CardTitle>Today's Prayer Times</CardTitle>
                <CardDescription>All five daily prayers for {new Date().toLocaleDateString()}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {prayerTimes.map((prayer, index) => {
                const Icon = prayerIcons[prayer.name as keyof typeof prayerIcons] || Clock;
                const isNext = nextPrayerInfo?.name === prayer.name;
                const isCurrent = currentPrayer?.name === prayer.name;
                const prayerKey = prayer.name.toLowerCase();
                const isEnabled = settings.prayerSettings[prayerKey]?.enabled ?? true;
                
                return (
                  <div
                    key={prayer.name}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300",
                      isNext && "border-primary bg-primary/5 shadow-sm",
                      isCurrent && "border-green-500 bg-green-50 dark:bg-green-950/20",
                      !isNext && !isCurrent && "border-border bg-card"
                    )}
                  >
                    <div className="text-center space-y-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg mx-auto flex items-center justify-center",
                        isNext && "bg-primary/20",
                        isCurrent && "bg-green-500/20",
                        !isNext && !isCurrent && "bg-muted"
                      )}>
                        <Icon size={20} className={cn(
                          isNext && "text-primary",
                          isCurrent && "text-green-600",
                          !isNext && !isCurrent && "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg mb-1">{prayer.name}</h3>
                        <p className="text-right text-sm font-arabic mb-2" dir="rtl">{prayer.arabic}</p>
                        <p className="text-xl font-mono">{prayer.time}</p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {isEnabled ? (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle size={12} />
                            <span>Enabled</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <AlertCircle size={12} />
                            <span>Disabled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h3 className="text-lg font-semibold mb-4">Prayer Reminder Settings</h3>
          <p className="text-muted-foreground">Prayer reminder settings will be available here.</p>
        </div>

        {/* Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Info size={24} className="text-primary" />
              <div>
                <CardTitle>About Prayer Reminders</CardTitle>
                <CardDescription>How the Islamic reminder system works</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Browser notifications before prayer times
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Customizable reminder intervals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Individual prayer settings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Sound and vibration options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Accurate prayer times for Haramaya
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Prayer Times</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Prayer times are calculated for Haramaya University, Ethiopia. 
                  Times may vary slightly based on your exact location and Islamic calendar.
                </p>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> For the most accurate prayer times, 
                    consult your local mosque or Islamic authority.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Islamic Quote */}
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-lg font-arabic text-green-800 dark:text-green-200 mb-3" dir="rtl">
            إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            "Indeed, prayer has been decreed upon the believers a decree of specified times." - Quran 4:103
          </p>
        </div>
      </div>
    </PageLayout>
  );
}