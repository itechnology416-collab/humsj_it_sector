import React from 'react';
import { Bell, Clock, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayerReminders } from '@/hooks/usePrayerReminders';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PrayerReminderWidgetProps {
  className?: string;
  compact?: boolean;
}

export const PrayerReminderWidget: React.FC<PrayerReminderWidgetProps> = ({ 
  className, 
  compact = false 
}) => {
  const navigate = useNavigate();
  const { 
    nextPrayer, 
    timeUntilNext, 
    settings, 
    hasNotificationPermission,
    requestNotificationPermission,
    updateSettings
  } = usePrayerReminders();

  const handleEnableReminders = async () => {
    if (!hasNotificationPermission) {
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSettings({ enabled: true });
      }
    } else {
      updateSettings({ enabled: !settings.enabled });
    }
  };

  if (compact) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Next Prayer</h3>
                {nextPrayer ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{nextPrayer.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {timeUntilNext}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {settings.enabled && hasNotificationPermission ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-amber-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/prayer-reminders')}
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell size={24} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Prayer Reminders</CardTitle>
              <CardDescription>
                {settings.enabled && hasNotificationPermission 
                  ? 'Active reminders' 
                  : 'Set up prayer notifications'
                }
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/prayer-reminders')}
            className="gap-2"
          >
            <Settings size={16} />
            Settings
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Next Prayer Info */}
        {nextPrayer ? (
          <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Next Prayer</h4>
              <Clock size={16} className="text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-display">{nextPrayer.name}</p>
                <p className="text-sm text-right font-arabic" dir="rtl">{nextPrayer.arabic}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono text-primary">{nextPrayer.time}</p>
                <Badge variant="outline" className="text-xs">
                  in {timeUntilNext}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Clock size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Loading prayer times...</p>
          </div>
        )}

        {/* Status and Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                settings.enabled && hasNotificationPermission 
                  ? "bg-green-100 dark:bg-green-900/20" 
                  : "bg-amber-100 dark:bg-amber-900/20"
              )}>
                {settings.enabled && hasNotificationPermission ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertCircle size={16} className="text-amber-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {settings.enabled && hasNotificationPermission 
                    ? 'Reminders Active' 
                    : 'Enable Reminders'
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {settings.enabled && hasNotificationPermission 
                    ? `${settings.reminderInterval} min before prayers`
                    : 'Get notified before prayer times'
                  }
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant={settings.enabled && hasNotificationPermission ? "outline" : "default"}
              onClick={handleEnableReminders}
            >
              {settings.enabled && hasNotificationPermission ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {/* Permission Request */}
          {settings.enabled && !hasNotificationPermission && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Permission Required
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                    Allow notifications to receive prayer reminders.
                  </p>
                  <Button
                    size="sm"
                    onClick={requestNotificationPermission}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                  >
                    Allow Notifications
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Islamic Quote */}
        <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-arabic text-green-800 dark:text-green-200 text-center mb-1" dir="rtl">
            وَأَقِمِ الصَّلَاةَ لِذِكْرِي
          </p>
          <p className="text-xs text-green-700 dark:text-green-300 text-center">
            "And establish prayer for My remembrance." - Quran 20:14
          </p>
        </div>
      </CardContent>
    </Card>
  );
};