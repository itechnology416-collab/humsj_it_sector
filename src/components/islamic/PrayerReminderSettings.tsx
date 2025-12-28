import React, { useState } from 'react';
import { Bell, Clock, Settings, Volume2, VolumeX, Smartphone, Vibrate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrayerReminders } from '@/hooks/usePrayerReminders';
import { cn } from '@/lib/utils';

interface PrayerReminderSettingsProps {
  className?: string;
}

const PrayerReminderSettings: React.FC<PrayerReminderSettingsProps> = ({ className }) => {
  const {
    settings,
    updateSettings,
    requestNotificationPermission,
    hasNotificationPermission,
    testReminder
  } = usePrayerReminders();

  const [isExpanded, setIsExpanded] = useState(false);

  const handlePermissionRequest = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      updateSettings({ enabled: true });
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell size={20} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Prayer Reminders</CardTitle>
              <CardDescription>Get notified before prayer times</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <Settings size={16} />
            {isExpanded ? 'Hide' : 'Settings'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              {settings.enabled ? (
                <Bell size={16} className="text-primary" />
              ) : (
                <VolumeX size={16} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">Enable Prayer Reminders</p>
              <p className="text-sm text-muted-foreground">
                {hasNotificationPermission ? 'Notifications allowed' : 'Permission required'}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.enabled && hasNotificationPermission}
            onCheckedChange={(checked) => {
              if (checked && !hasNotificationPermission) {
                handlePermissionRequest();
              } else {
                updateSettings({ enabled: checked });
              }
            }}
          />
        </div>

        {/* Permission Request */}
        {!hasNotificationPermission && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone size={20} className="text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Enable Notifications
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  Allow notifications to receive prayer reminders on your device.
                </p>
                <Button
                  size="sm"
                  onClick={handlePermissionRequest}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Enable Notifications
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Test Reminder */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={testReminder}
            className="w-full gap-2"
          >
            <Bell size={16} />
            Test Reminder
          </Button>
        </div>

        {/* Islamic Reminder Text */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-center">
            <p className="text-sm font-arabic text-green-800 dark:text-green-200 mb-2">
              وَأَقِمِ الصَّلَاةَ لِذِكْرِي
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              "And establish prayer for My remembrance." - Quran 20:14
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerReminderSettings;