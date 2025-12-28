import { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Moon, 
  Sun, 
  Star,
  BookOpen,
  Heart,
  Calendar,
  Volume2,
  VolumeX,
  Settings,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface IslamicNotificationsProps {
  className?: string;
}

interface NotificationSettings {
  prayerReminders: boolean;
  dhikrReminders: boolean;
  quranReminders: boolean;
  islamicEvents: boolean;
  fridayReminders: boolean;
  ramadanSpecial: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderInterval: number; // minutes
}

interface IslamicNotification {
  id: string;
  type: 'prayer' | 'dhikr' | 'quran' | 'event' | 'friday' | 'ramadan';
  title: string;
  message: string;
  arabicText?: string;
  time: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  prayerReminders: true,
  dhikrReminders: true,
  quranReminders: true,
  islamicEvents: true,
  fridayReminders: true,
  ramadanSpecial: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderInterval: 30
};

// Mock notifications
const MOCK_NOTIFICATIONS: IslamicNotification[] = [
  {
    id: '1',
    type: 'prayer',
    title: 'Maghrib Prayer Time',
    message: 'It\'s time for Maghrib prayer. May Allah accept your worship.',
    arabicText: 'حَانَ وَقْتُ صَلَاةِ المَغْرِب',
    time: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '2',
    type: 'dhikr',
    title: 'Evening Dhikr Reminder',
    message: 'Remember to recite your evening adhkar for protection.',
    arabicText: 'أَذْكَارُ المَسَاء',
    time: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'quran',
    title: 'Daily Quran Reading',
    message: 'Continue your daily Quran recitation. Today\'s portion: Surah Al-Baqarah.',
    time: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'friday',
    title: 'Jummah Preparation',
    message: 'Friday prayer is in 1 hour. Prepare for Jummah.',
    arabicText: 'صَلَاةُ الجُمُعَة',
    time: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '5',
    type: 'event',
    title: 'Islamic Event Reminder',
    message: 'Tonight is Laylat al-Qadr. Increase your worship and dua.',
    arabicText: 'لَيْلَةُ القَدْر',
    time: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    priority: 'high'
  }
];

export default function IslamicNotifications({ className }: IslamicNotificationsProps) {
  const [notifications, setNotifications] = useState<IslamicNotification[]>(MOCK_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('islamic-notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Check notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('islamic-notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed.map((n: { time: string; [key: string]: unknown }) => ({
        ...n,
        time: new Date(n.time)
      })));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('islamic-notification-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem('islamic-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast.success('Notification permission granted');
      } else {
        toast.error('Notification permission denied');
      }
    }
  };

  const sendNotification = (notification: IslamicNotification) => {
    if (permissionStatus === 'granted' && settings.soundEnabled) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.jpg',
        badge: '/logo.jpg',
        tag: notification.type,
        requireInteraction: notification.actionRequired,
        silent: !settings.soundEnabled
      });

      browserNotification.onclick = () => {
        markAsRead(notification.id);
        browserNotification.close();
      };

      // Auto close after 10 seconds if not action required
      if (!notification.actionRequired) {
        setTimeout(() => {
          browserNotification.close();
        }, 10000);
      }
    }

    // Vibration feedback
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      const pattern = notification.priority === 'high' ? [200, 100, 200] : [100];
      navigator.vibrate(pattern);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: IslamicNotification['type']) => {
    switch (type) {
      case 'prayer': return Clock;
      case 'dhikr': return Heart;
      case 'quran': return BookOpen;
      case 'event': return Star;
      case 'friday': return Calendar;
      case 'ramadan': return Moon;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: IslamicNotification['type'], priority: string) => {
    const baseColors = {
      prayer: 'text-green-500 bg-green-500/20',
      dhikr: 'text-blue-500 bg-blue-500/20',
      quran: 'text-purple-500 bg-purple-500/20',
      event: 'text-amber-500 bg-amber-500/20',
      friday: 'text-primary bg-primary/20',
      ramadan: 'text-indigo-500 bg-indigo-500/20'
    };

    if (priority === 'high') {
      return 'text-red-500 bg-red-500/20 animate-pulse';
    }

    return baseColors[type] || 'text-gray-500 bg-gray-500/20';
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  if (showSettings) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Notification Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(false)}
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status */}
          {permissionStatus !== 'granted' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell size={20} className="text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-amber-700 dark:text-amber-400">
                    Enable Browser Notifications
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Allow notifications to receive Islamic reminders and prayer alerts.
                  </p>
                  <Button
                    size="sm"
                    onClick={requestNotificationPermission}
                    className="mt-2 bg-amber-500 hover:bg-amber-600"
                  >
                    Enable Notifications
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="font-medium">Notification Types</h4>
            
            {[
              { key: 'prayerReminders', label: 'Prayer Reminders', desc: 'Get notified for prayer times' },
              { key: 'dhikrReminders', label: 'Dhikr Reminders', desc: 'Daily dhikr and remembrance alerts' },
              { key: 'quranReminders', label: 'Quran Reminders', desc: 'Daily Quran reading reminders' },
              { key: 'islamicEvents', label: 'Islamic Events', desc: 'Important Islamic dates and events' },
              { key: 'fridayReminders', label: 'Friday Reminders', desc: 'Jummah prayer and preparation' },
              { key: 'ramadanSpecial', label: 'Ramadan Special', desc: 'Iftar, Suhur, and Tarawih reminders' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={settings[item.key as keyof NotificationSettings] as boolean}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>

          {/* Audio & Vibration */}
          <div className="space-y-4">
            <h4 className="font-medium">Feedback Settings</h4>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <div>
                  <p className="font-medium text-sm">Sound Notifications</p>
                  <p className="text-xs text-muted-foreground">Play sound for notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, soundEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <div>
                  <p className="font-medium text-sm">Vibration</p>
                  <p className="text-xs text-muted-foreground">Vibrate for notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.vibrationEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, vibrationEnabled: checked }))
                }
              />
            </div>
          </div>

          {/* Reminder Interval */}
          <div className="space-y-2">
            <label className="font-medium text-sm">Reminder Interval</label>
            <Select 
              value={settings.reminderInterval.toString()} 
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, reminderInterval: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="120">Every 2 hours</SelectItem>
                <SelectItem value="240">Every 4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Bell size={20} className="text-primary" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            Islamic Notifications
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                {highPriorityCount} urgent
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check size={14} className="mr-1" />
                Mark All Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications</p>
            <p className="text-sm text-muted-foreground">
              You're all caught up with your Islamic reminders
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type, notification.priority);
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                    notification.read 
                      ? "bg-secondary/30 border-border/30" 
                      : "bg-card border-primary/30 hover:bg-primary/5",
                    notification.priority === 'high' && !notification.read && "ring-2 ring-primary/20"
                  )}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
                    <IconComponent size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn("font-medium text-sm", !notification.read && "text-primary")}>
                          {notification.title}
                        </p>
                        {notification.arabicText && (
                          <p className="text-sm font-arabic text-muted-foreground mt-1" dir="rtl">
                            {notification.arabicText}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.time.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}