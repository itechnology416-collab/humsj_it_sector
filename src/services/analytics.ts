import { APP_CONFIG, isProduction } from '@/config/app';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';

export interface AnalyticsEvent {
  name: string;
  category: 'user_action' | 'navigation' | 'feature_usage' | 'performance' | 'error' | 'islamic_activity';
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  events: number;
  userAgent: string;
  referrer: string;
  location: {
    country?: string;
    city?: string;
    timezone: string;
  };
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private enabled = APP_CONFIG.features.analytics && isProduction;
  private sessionId: string;
  private currentSession: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private performanceObserver?: PerformanceObserver;
  private maxQueueSize = 50;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.currentSession = this.initializeSession();
    
    if (this.enabled) {
      this.setupPerformanceMonitoring();
      this.setupEventListeners();
      this.startFlushTimer();
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      id: this.sessionId,
      startTime: Date.now(),
      pageViews: 0,
      events: 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      location: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    };
  }

  private setupEventListeners(): void {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('session_pause', 'user_action');
        this.flushEvents();
      } else {
        this.trackEvent('session_resume', 'user_action');
      }
    });

    // Page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
      this.flushEvents();
    });

    // Navigation tracking
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', 'error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', 'error', {
        reason: event.reason?.toString(),
      });
    });
  }

  private setupPerformanceMonitoring(): void {
    // Web Vitals and Performance API
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      this.observePerformanceEntry('largest-contentful-paint', (entries) => {
        const lcp = entries[entries.length - 1];
        this.trackEvent('largest_contentful_paint', 'performance', {
          value: lcp.startTime,
          url: window.location.pathname,
        });
      });

      // First Input Delay
      this.observePerformanceEntry('first-input', (entries) => {
        const fid = entries[0];
        this.trackEvent('first_input_delay', 'performance', {
          value: fid.processingStart - fid.startTime,
          url: window.location.pathname,
        });
      });

      // Cumulative Layout Shift
      this.observePerformanceEntry('layout-shift', (entries) => {
        let clsValue = 0;
        for (const entry of entries) {
          if (!(entry as unknown).hadRecentInput) {
            clsValue += (entry as unknown).value;
          }
        }
        if (clsValue > 0) {
          this.trackEvent('cumulative_layout_shift', 'performance', {
            value: clsValue,
            url: window.location.pathname,
          });
        }
      });
    }

    // Page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.trackEvent('page_load_performance', 'performance', {
            loadTime: perfData.loadEventEnd - perfData.navigationStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
            firstByte: perfData.responseStart - perfData.navigationStart,
            url: window.location.pathname,
          });
        }
      }, 0);
    });
  }

  private observePerformanceEntry(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [type] });
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  // Public methods
  trackEvent(
    name: string, 
    category: AnalyticsEvent['category'], 
    properties?: Record<string, unknown>,
    userId?: string
  ): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      properties,
      timestamp: Date.now(),
      userId,
      sessionId: this.sessionId,
    };

    this.eventQueue.push(event);
    this.currentSession.events++;

    // Flush if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flushEvents();
    }
  }

  trackPageView(path: string, title?: string): void {
    this.currentSession.pageViews++;
    this.trackEvent('page_view', 'navigation', {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  // Islamic-specific tracking methods
  trackPrayerActivity(prayerName: string, action: 'completed' | 'reminded' | 'missed', onTime?: boolean): void {
    this.trackEvent('prayer_activity', 'islamic_activity', {
      prayerName,
      action,
      onTime,
      timestamp: new Date().toISOString(),
    });
  }

  trackQuranActivity(action: 'listen' | 'read' | 'search', surah?: string, reciter?: string): void {
    this.trackEvent('quran_activity', 'islamic_activity', {
      action,
      surah,
      reciter,
      timestamp: new Date().toISOString(),
    });
  }

  trackDhikrActivity(dhikrType: string, count: number, goal?: number): void {
    this.trackEvent('dhikr_activity', 'islamic_activity', {
      dhikrType,
      count,
      goal,
      completed: goal ? count >= goal : false,
      timestamp: new Date().toISOString(),
    });
  }

  trackFeatureUsage(featureName: string, action: string, metadata?: Record<string, unknown>): void {
    this.trackEvent('feature_usage', 'feature_usage', {
      feature: featureName,
      action,
      ...metadata,
    });
  }

  trackUserEngagement(action: string, element?: string, value?: number): void {
    this.trackEvent('user_engagement', 'user_action', {
      action,
      element,
      value,
    });
  }

  trackConversion(type: string, value?: number, metadata?: Record<string, unknown>): void {
    this.trackEvent('conversion', 'user_action', {
      type,
      value,
      ...metadata,
    });
  }

  // Session management
  setUserId(userId: string): void {
    this.currentSession.userId = userId;
  }

  endSession(): void {
    this.currentSession.endTime = Date.now();
    this.trackEvent('session_end', 'user_action', {
      duration: this.currentSession.endTime - this.currentSession.startTime,
      pageViews: this.currentSession.pageViews,
      events: this.currentSession.events,
    });
  }

  // Event flushing
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In production, send to your analytics service
      if (isProduction) {
        await this.sendToAnalyticsService(events);
      } else {
        // In development, log to console
        console.group('📊 Analytics Events');
        events.forEach(event => {
          console.log(`${event.category}:${event.name}`, event.properties);
        });
        console.groupEnd();
      }
    } catch (error) {
      // Re-queue events if sending fails
      this.eventQueue.unshift(...events);
      
      errorHandler.handleError(error, {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        metadata: { 
          type: 'analytics_flush_failed',
          eventCount: events.length 
        }
      });
    }
  }

  private async sendToAnalyticsService(events: AnalyticsEvent[]): Promise<void> {
    // Replace with your actual analytics service endpoint
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        session: this.currentSession,
      }),
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }

  // Utility methods
  getSessionInfo(): UserSession {
    return { ...this.currentSession };
  }

  getQueuedEventCount(): number {
    return this.eventQueue.length;
  }

  clearQueue(): void {
    this.eventQueue = [];
  }

  // A/B Testing support
  trackExperiment(experimentName: string, variant: string, metadata?: Record<string, unknown>): void {
    this.trackEvent('experiment_exposure', 'feature_usage', {
      experiment: experimentName,
      variant,
      ...metadata,
    });
  }

  // Custom dimensions
  setCustomDimension(key: string, value: unknown): void {
    if (!this.currentSession.location) {
      this.currentSession.location = { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    }
    (this.currentSession.location as unknown)[key] = value;
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.flushEvents();
  }
}

// Global analytics instance
export const analytics = AnalyticsService.getInstance();

// Convenience functions for common tracking scenarios
export const trackPageView = (path: string, title?: string) => analytics.trackPageView(path, title);
export const trackEvent = (name: string, category: AnalyticsEvent['category'], properties?: Record<string, unknown>) => 
  analytics.trackEvent(name, category, properties);
export const trackFeatureUsage = (feature: string, action: string, metadata?: Record<string, unknown>) => 
  analytics.trackFeatureUsage(feature, action, metadata);
export const trackPrayerActivity = (prayer: string, action: 'completed' | 'reminded' | 'missed', onTime?: boolean) => 
  analytics.trackPrayerActivity(prayer, action, onTime);
export const trackQuranActivity = (action: 'listen' | 'read' | 'search', surah?: string, reciter?: string) => 
  analytics.trackQuranActivity(action, surah, reciter);
export const trackDhikrActivity = (dhikrType: string, count: number, goal?: number) => 
  analytics.trackDhikrActivity(dhikrType, count, goal);