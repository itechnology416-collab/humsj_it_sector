import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { prayerTimesService, type PrayerTimes, type Coordinates } from '@/services/prayerTimesApi';

interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

interface PrayerSettings {
  enabled: boolean;
  customInterval?: number;
}

interface ReminderSettings {
  enabled: boolean;
  reminderInterval: number; // minutes before prayer
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  prayerSettings: { [key: string]: PrayerSettings };
}

export const usePrayerReminders = () => {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: false,
    reminderInterval: 15,
    soundEnabled: true,
    vibrationEnabled: true,
    prayerSettings: {
      fajr: { enabled: true },
      dhuhr: { enabled: true },
      asr: { enabled: true },
      maghrib: { enabled: true },
      isha: { enabled: true }
    }
  });
  
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load real prayer times
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setIsLoading(true);
        
        // Get user location
        const userCoordinates = await prayerTimesService.getCurrentLocation();
        setCoordinates(userCoordinates);

        // Get today's prayer times
        const times = await prayerTimesService.getPrayerTimes(userCoordinates);
        
        // Convert to PrayerTime format
        const formattedTimes: PrayerTime[] = [
          { name: 'Fajr', time: times.fajr, arabic: 'الفجر' },
          { name: 'Dhuhr', time: times.dhuhr, arabic: 'الظهر' },
          { name: 'Asr', time: times.asr, arabic: 'العصر' },
          { name: 'Maghrib', time: times.maghrib, arabic: 'المغرب' },
          { name: 'Isha', time: times.isha, arabic: 'العشاء' }
        ];
        
        setPrayerTimes(formattedTimes);
      } catch (error) {
        console.error('Error loading prayer times:', error);
        // Fallback to default times
        setPrayerTimes([
          { name: 'Fajr', time: '05:30', arabic: 'الفجر' },
          { name: 'Dhuhr', time: '12:15', arabic: 'الظهر' },
          { name: 'Asr', time: '15:30', arabic: 'العصر' },
          { name: 'Maghrib', time: '18:00', arabic: 'المغرب' },
          { name: 'Isha', time: '19:30', arabic: 'العشاء' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrayerTimes();
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasNotificationPermission(granted);
      return granted;
    }
    return false;
  }, []);

  const testReminder = useCallback(() => {
    if (hasNotificationPermission) {
      showPrayerNotification({ name: 'Test', time: 'Now', arabic: 'اختبار' }, 0);
      toast.success('Test reminder sent!');
    } else {
      toast.error('Notification permission required');
    }
  }, [hasNotificationPermission]);

  const showPrayerNotification = useCallback((prayer: PrayerTime, minutesBefore: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = minutesBefore === 0 
        ? `${prayer.name} Prayer Time` 
        : `${prayer.name} Prayer in ${minutesBefore} minutes`;
      
      const notification = new Notification(title, {
        body: `${prayer.arabic} - ${prayer.time}`,
        icon: '/logo.jpg',
        badge: '/logo.jpg',
        tag: `prayer-${prayer.name}-${minutesBefore}`,
        requireInteraction: minutesBefore === 0,
        silent: !reminderSettings.soundEnabled
      });

      // Auto close after 10 seconds for reminders, keep open for actual prayer time
      if (minutesBefore > 0) {
        setTimeout(() => notification.close(), 10000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Vibration if enabled and supported
      if (reminderSettings.vibrationEnabled && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }, [reminderSettings.soundEnabled, reminderSettings.vibrationEnabled]);

  const getNextPrayer = useCallback(() => {
    if (prayerTimes.length === 0) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        return { prayer, minutesUntil: prayerTime - currentTime };
      }
    }
    
    // If no prayer today, return Fajr tomorrow
    const fajr = prayerTimes[0];
    const [hours, minutes] = fajr.time.split(':').map(Number);
    const fajrTime = hours * 60 + minutes;
    const minutesUntilTomorrow = (24 * 60) - currentTime + fajrTime;
    
    return { prayer: fajr, minutesUntil: minutesUntilTomorrow };
  }, [prayerTimes]);

  const formatTimeUntil = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }, []);

  const checkPrayerReminders = useCallback(() => {
    if (!reminderSettings.enabled || prayerTimes.length === 0) return;

    const nextPrayerData = getNextPrayer();
    if (!nextPrayerData) return;

    const { prayer, minutesUntil } = nextPrayerData;
    setNextPrayer(prayer);
    setTimeUntilNext(formatTimeUntil(minutesUntil));

    const prayerKey = prayer.name.toLowerCase();
    const prayerSetting = reminderSettings.prayerSettings[prayerKey];
    
    // Skip if this specific prayer is disabled
    if (!prayerSetting?.enabled) return;

    // Get reminder interval for this prayer (use custom or default)
    const interval = prayerSetting.customInterval || reminderSettings.reminderInterval;

    // Check if we should show a reminder
    if (minutesUntil === interval) {
      showPrayerNotification(prayer, interval);
      toast.info(`${prayer.name} prayer in ${interval} minutes`, {
        description: `${prayer.arabic} - ${prayer.time}`,
        duration: 5000
      });
    }

    // Show notification at exact prayer time
    if (minutesUntil === 0) {
      showPrayerNotification(prayer, 0);
      toast.success(`${prayer.name} Prayer Time!`, {
        description: `${prayer.arabic} - ${prayer.time}`,
        duration: 10000
      });
    }
  }, [reminderSettings, prayerTimes, getNextPrayer, formatTimeUntil, showPrayerNotification]);

  const updateReminderSettings = useCallback((newSettings: Partial<ReminderSettings>) => {
    const updatedSettings = { ...reminderSettings, ...newSettings };
    setReminderSettings(updatedSettings);
    localStorage.setItem('prayerReminderSettings', JSON.stringify(updatedSettings));
  }, [reminderSettings]);

  // Initialize settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('prayerReminderSettings');
    if (saved) {
      try {
        setReminderSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading prayer reminder settings:', error);
      }
    }
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  // Request notification permission when enabled
  useEffect(() => {
    if (reminderSettings.enabled && !hasNotificationPermission) {
      requestNotificationPermission();
    }
  }, [reminderSettings.enabled, hasNotificationPermission, requestNotificationPermission]);

  // Register service worker for background notifications
  useEffect(() => {
    if ('serviceWorker' in navigator && reminderSettings.enabled) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered for prayer reminders');
          
          // Schedule background sync for prayer reminders (if supported)
          if ('sync' in window.ServiceWorkerRegistration.prototype) {
            (registration as any).sync.register('prayer-reminder');
          }
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [reminderSettings.enabled]);

  // Check for prayer reminders every minute
  useEffect(() => {
    checkPrayerReminders(); // Initial check
    const interval = setInterval(checkPrayerReminders, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkPrayerReminders]);

  return {
    settings: reminderSettings,
    updateSettings: updateReminderSettings,
    nextPrayer,
    timeUntilNext,
    prayerTimes,
    requestNotificationPermission,
    hasNotificationPermission,
    testReminder,
    coordinates,
    isLoading
  };
};