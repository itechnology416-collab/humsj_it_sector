import { APP_CONFIG } from '@/config/app';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: NotificationAction[];
  timestamp?: number;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface ScheduledNotification extends NotificationOptions {
  id: string;
  scheduledTime: Date;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval?: number;
    daysOfWeek?: number[]; // 0-6, Sunday = 0
    endDate?: Date;
  };
  category: 'prayer' | 'dhikr' | 'event' | 'reminder' | 'system';
}

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private scheduledNotifications = new Map<string, ScheduledNotification>();
  private activeTimeouts = new Map<string, NodeJS.Timeout>();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.checkPermission();
    this.loadScheduledNotifications();
    this.setupServiceWorker();
    this.scheduleAllNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  private async setupServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && APP_CONFIG.features.pwa) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered for notifications');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (this.permission === 'granted') {
      return this.permission;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      errorHandler.handleError(error, {
        category: ErrorCategory.PERMISSION,
        severity: ErrorSeverity.MEDIUM,
        metadata: { type: 'notification_permission' }
      });
      throw error;
    }
  }

  // Show immediate notification
  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notificationOptions: NotificationOptions = {
        icon: '/logo.jpg',
        badge: '/logo.jpg',
        ...options,
        timestamp: options.timestamp || Date.now(),
      };

      if (this.serviceWorkerRegistration) {
        // Use service worker for better reliability
        await this.serviceWorkerRegistration.showNotification(
          options.title,
          notificationOptions
        );
      } else {
        // Fallback to regular notification
        const notification = new Notification(options.title, notificationOptions);
        
        // Auto-close after 10 seconds if not requiring interaction
        if (!options.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 10000);
        }

        // Handle click events
        notification.onclick = () => {
          window.focus();
          notification.close();
          
          // Handle custom data
          if (options.data?.url) {
            window.location.href = options.data.url;
          }
        };
      }
    } catch (error) {
      errorHandler.handleError(error, {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        metadata: { type: 'show_notification', options }
      });
    }
  }

  // Schedule a notification
  scheduleNotification(notification: Omit<ScheduledNotification, 'id'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const scheduledNotification: ScheduledNotification = {
      ...notification,
      id,
    };

    this.scheduledNotifications.set(id, scheduledNotification);
    this.saveScheduledNotifications();
    this.scheduleNotificationTimeout(scheduledNotification);

    return id;
  }

  // Cancel a scheduled notification
  cancelNotification(id: string): boolean {
    const timeout = this.activeTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.activeTimeouts.delete(id);
    }

    const success = this.scheduledNotifications.delete(id);
    if (success) {
      this.saveScheduledNotifications();
    }

    return success;
  }

  // Update a scheduled notification
  updateNotification(id: string, updates: Partial<ScheduledNotification>): boolean {
    const notification = this.scheduledNotifications.get(id);
    if (!notification) {
      return false;
    }

    // Cancel existing timeout
    this.cancelNotification(id);

    // Update notification
    const updatedNotification = { ...notification, ...updates, id };
    this.scheduledNotifications.set(id, updatedNotification);
    this.saveScheduledNotifications();
    this.scheduleNotificationTimeout(updatedNotification);

    return true;
  }

  // Get all scheduled notifications
  getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  // Get notifications by category
  getNotificationsByCategory(category: ScheduledNotification['category']): ScheduledNotification[] {
    return this.getScheduledNotifications().filter(n => n.category === category);
  }

  // Schedule prayer time notifications
  schedulePrayerNotifications(prayerTimes: Record<string, string>, date: Date = new Date()): void {
    const prayers = [
      { name: 'Fajr', arabicName: 'الفجر', time: prayerTimes.fajr },
      { name: 'Dhuhr', arabicName: 'الظهر', time: prayerTimes.dhuhr },
      { name: 'Asr', arabicName: 'العصر', time: prayerTimes.asr },
      { name: 'Maghrib', arabicName: 'المغرب', time: prayerTimes.maghrib },
      { name: 'Isha', arabicName: 'العشاء', time: prayerTimes.isha },
    ];

    prayers.forEach(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerDate = new Date(date);
      prayerDate.setHours(hours, minutes, 0, 0);

      // Only schedule if the time hasn't passed today
      if (prayerDate > new Date()) {
        this.scheduleNotification({
          title: `${prayer.name} Prayer Time`,
          body: `It's time for ${prayer.name} prayer (${prayer.arabicName}). May Allah accept your worship.`,
          tag: `prayer-${prayer.name.toLowerCase()}-${date.toDateString()}`,
          category: 'prayer',
          scheduledTime: prayerDate,
          requireInteraction: true,
          vibrate: [200, 100, 200],
          actions: [
            { action: 'mark-prayed', title: 'Mark as Prayed' },
            { action: 'snooze', title: 'Remind in 5 min' }
          ],
          data: {
            prayerName: prayer.name,
            prayerTime: prayer.time,
            url: '/prayer-tracker'
          }
        });
      }
    });
  }

  // Schedule dhikr reminders
  scheduleDhikrReminders(intervals: number[] = [60, 180, 360]): void { // minutes
    intervals.forEach((interval, index) => {
      const reminderTime = new Date(Date.now() + interval * 60 * 1000);
      
      this.scheduleNotification({
        title: 'Dhikr Reminder',
        body: 'Remember Allah with dhikr. SubhanAllah, Alhamdulillah, Allahu Akbar.',
        tag: `dhikr-reminder-${index}`,
        category: 'dhikr',
        scheduledTime: reminderTime,
        recurring: {
          type: 'daily',
          interval: 1
        },
        vibrate: [100],
        data: {
          url: '/dhikr-counter'
        }
      });
    });
  }

  // Schedule Quran reading reminder
  scheduleQuranReminder(time: string = '20:00'): void {
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    this.scheduleNotification({
      title: 'Quran Reading Time',
      body: 'Continue your daily Quran recitation. May Allah increase you in knowledge.',
      tag: 'quran-daily-reminder',
      category: 'reminder',
      scheduledTime: reminderTime,
      recurring: {
        type: 'daily',
        interval: 1
      },
      data: {
        url: '/quran-audio'
      }
    });
  }

  // Schedule Friday prayer reminder
  scheduleFridayReminder(): void {
    const now = new Date();
    const friday = new Date();
    
    // Find next Friday
    const daysUntilFriday = (5 - now.getDay() + 7) % 7;
    if (daysUntilFriday === 0 && now.getHours() >= 11) {
      // If it's Friday after 11 AM, schedule for next Friday
      friday.setDate(now.getDate() + 7);
    } else {
      friday.setDate(now.getDate() + daysUntilFriday);
    }
    
    friday.setHours(11, 0, 0, 0); // 11 AM reminder

    this.scheduleNotification({
      title: 'Jummah Prayer Reminder',
      body: 'Friday prayer (Jummah) is approaching. Prepare for the congregational prayer.',
      tag: 'friday-prayer-reminder',
      category: 'prayer',
      scheduledTime: friday,
      recurring: {
        type: 'weekly',
        interval: 1,
        daysOfWeek: [5] // Friday
      },
      requireInteraction: true,
      data: {
        url: '/prayer-times'
      }
    });
  }

  private scheduleNotificationTimeout(notification: ScheduledNotification): void {
    const now = Date.now();
    const scheduledTime = notification.scheduledTime.getTime();
    const delay = scheduledTime - now;

    if (delay <= 0) {
      // Time has passed, handle recurring or skip
      this.handlePastNotification(notification);
      return;
    }

    const timeout = setTimeout(() => {
      this.showNotification(notification);
      this.handleRecurringNotification(notification);
    }, delay);

    this.activeTimeouts.set(notification.id, timeout);
  }

  private handlePastNotification(notification: ScheduledNotification): void {
    if (notification.recurring) {
      this.rescheduleRecurringNotification(notification);
    } else {
      // Remove non-recurring past notifications
      this.cancelNotification(notification.id);
    }
  }

  private handleRecurringNotification(notification: ScheduledNotification): void {
    if (notification.recurring) {
      this.rescheduleRecurringNotification(notification);
    } else {
      // Remove non-recurring notifications after showing
      this.cancelNotification(notification.id);
    }
  }

  private rescheduleRecurringNotification(notification: ScheduledNotification): void {
    if (!notification.recurring) return;

    const { type, interval = 1, daysOfWeek, endDate } = notification.recurring;
    const nextTime = new Date(notification.scheduledTime);

    switch (type) {
      case 'daily':
        nextTime.setDate(nextTime.getDate() + interval);
        break;
      case 'weekly':
        nextTime.setDate(nextTime.getDate() + (7 * interval));
        break;
      case 'monthly':
        nextTime.setMonth(nextTime.getMonth() + interval);
        break;
    }

    // Check if we should continue recurring
    if (endDate && nextTime > endDate) {
      this.cancelNotification(notification.id);
      return;
    }

    // Handle specific days of week for weekly recurring
    if (type === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
      const currentDay = nextTime.getDay();
      if (!daysOfWeek.includes(currentDay)) {
        // Find next valid day
        const nextValidDay = daysOfWeek.find(day => day > currentDay) || daysOfWeek[0];
        const daysToAdd = nextValidDay > currentDay ? 
          nextValidDay - currentDay : 
          7 - currentDay + nextValidDay;
        nextTime.setDate(nextTime.getDate() + daysToAdd);
      }
    }

    // Update the notification with new time
    const updatedNotification = {
      ...notification,
      scheduledTime: nextTime
    };

    this.scheduledNotifications.set(notification.id, updatedNotification);
    this.saveScheduledNotifications();
    this.scheduleNotificationTimeout(updatedNotification);
  }

  private scheduleAllNotifications(): void {
    this.scheduledNotifications.forEach(notification => {
      this.scheduleNotificationTimeout(notification);
    });
  }

  private saveScheduledNotifications(): void {
    try {
      const notifications = Array.from(this.scheduledNotifications.values());
      const serializable = notifications.map(n => ({
        ...n,
        scheduledTime: n.scheduledTime.toISOString(),
        recurring: n.recurring ? {
          ...n.recurring,
          endDate: n.recurring.endDate?.toISOString()
        } : undefined
      }));
      localStorage.setItem('scheduled_notifications', JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save scheduled notifications:', error);
    }
  }

  private loadScheduledNotifications(): void {
    try {
      const stored = localStorage.getItem('scheduled_notifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        notifications.forEach((n: any) => {
          const notification: ScheduledNotification = {
            ...n,
            scheduledTime: new Date(n.scheduledTime),
            recurring: n.recurring ? {
              ...n.recurring,
              endDate: n.recurring.endDate ? new Date(n.recurring.endDate) : undefined
            } : undefined
          };
          this.scheduledNotifications.set(notification.id, notification);
        });
      }
    } catch (error) {
      console.error('Failed to load scheduled notifications:', error);
    }
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.activeTimeouts.forEach(timeout => clearTimeout(timeout));
    this.activeTimeouts.clear();
    this.scheduledNotifications.clear();
    localStorage.removeItem('scheduled_notifications');
  }

  // Get notification statistics
  getNotificationStats(): {
    total: number;
    byCategory: Record<string, number>;
    upcoming: number;
    recurring: number;
  } {
    const notifications = this.getScheduledNotifications();
    const now = new Date();
    
    const byCategory = notifications.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: notifications.length,
      byCategory,
      upcoming: notifications.filter(n => n.scheduledTime > now).length,
      recurring: notifications.filter(n => n.recurring).length,
    };
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

export const notificationService = NotificationService.getInstance();