import { APP_CONFIG, isProduction } from '@/config/app';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  userId?: string;
  userAgent: string;
  url: string;
  metadata?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 100;
  private reportingEnabled = APP_CONFIG.features.errorReporting;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH,
        metadata: {
          type: 'unhandledrejection',
          promise: event.promise,
        }
      });
    });

    // Handle React error boundaries (if using)
    if (typeof window !== 'undefined') {
      (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {
        onBuildError: (error: Error) => {
          this.handleError(error, {
            category: ErrorCategory.UI,
            severity: ErrorSeverity.MEDIUM,
            metadata: { type: 'build_error' }
          });
        }
      };
    }
  }

  handleError(
    error: Error | string | any,
    options: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      userId?: string;
      metadata?: Record<string, any>;
    } = {}
  ): void {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: this.extractErrorMessage(error),
      stack: error instanceof Error ? error.stack : undefined,
      category: options.category || this.categorizeError(error),
      severity: options.severity || this.determineSeverity(error),
      timestamp: new Date(),
      userId: options.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata: {
        ...options.metadata,
        errorType: typeof error,
        errorName: error instanceof Error ? error.name : 'Unknown',
      }
    };

    // Log to console in development
    if (!isProduction) {
      this.logToConsole(errorReport);
    }

    // Add to queue for reporting
    this.addToQueue(errorReport);

    // Report immediately for critical errors
    if (errorReport.severity === ErrorSeverity.CRITICAL) {
      this.reportError(errorReport);
    }
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (error && typeof error.message === 'string') {
      return error.message;
    }
    
    return 'Unknown error occurred';
  }

  private categorizeError(error: any): ErrorCategory {
    const message = this.extractErrorMessage(error).toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return ErrorCategory.NETWORK;
    }
    
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
      return ErrorCategory.AUTH;
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return ErrorCategory.VALIDATION;
    }
    
    if (message.includes('permission') || message.includes('access denied')) {
      return ErrorCategory.PERMISSION;
    }
    
    if (message.includes('api') || message.includes('server') || message.includes('response')) {
      return ErrorCategory.API;
    }
    
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return ErrorCategory.SYSTEM;
    }
    
    return ErrorCategory.UNKNOWN;
  }

  private determineSeverity(error: any): ErrorSeverity {
    const message = this.extractErrorMessage(error).toLowerCase();
    
    // Critical errors that break core functionality
    if (
      message.includes('chunk load') ||
      message.includes('script error') ||
      message.includes('out of memory') ||
      error instanceof ReferenceError
    ) {
      return ErrorSeverity.CRITICAL;
    }
    
    // High severity errors that affect user experience
    if (
      message.includes('network') ||
      message.includes('auth') ||
      message.includes('permission') ||
      error instanceof TypeError
    ) {
      return ErrorSeverity.HIGH;
    }
    
    // Medium severity errors that are recoverable
    if (
      message.includes('validation') ||
      message.includes('not found') ||
      message.includes('timeout')
    ) {
      return ErrorSeverity.MEDIUM;
    }
    
    return ErrorSeverity.LOW;
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logToConsole(errorReport: ErrorReport): void {
    const style = this.getConsoleStyle(errorReport.severity);
    
    console.group(`%c🚨 ${errorReport.severity.toUpperCase()} ERROR`, style);
    console.log('Message:', errorReport.message);
    console.log('Category:', errorReport.category);
    console.log('Timestamp:', errorReport.timestamp.toISOString());
    console.log('URL:', errorReport.url);
    
    if (errorReport.stack) {
      console.log('Stack:', errorReport.stack);
    }
    
    if (errorReport.metadata) {
      console.log('Metadata:', errorReport.metadata);
    }
    
    console.groupEnd();
  }

  private getConsoleStyle(severity: ErrorSeverity): string {
    const styles = {
      [ErrorSeverity.LOW]: 'color: #3b82f6; font-weight: bold;',
      [ErrorSeverity.MEDIUM]: 'color: #f59e0b; font-weight: bold;',
      [ErrorSeverity.HIGH]: 'color: #ef4444; font-weight: bold;',
      [ErrorSeverity.CRITICAL]: 'color: #dc2626; font-weight: bold; background: #fee2e2; padding: 2px 4px;'
    };
    
    return styles[severity];
  }

  private addToQueue(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport);
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  private async reportError(errorReport: ErrorReport): Promise<void> {
    if (!this.reportingEnabled || !isProduction) {
      return;
    }

    try {
      // In a real application, you would send this to your error reporting service
      // Examples: Sentry, LogRocket, Bugsnag, or your own API
      
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });

      if (!response.ok) {
        console.warn('Failed to report error to server');
      }
    } catch (reportingError) {
      console.warn('Error reporting failed:', reportingError);
    }
  }

  // Public methods for manual error reporting
  reportNetworkError(error: any, url: string, method: string): void {
    this.handleError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      metadata: { url, method }
    });
  }

  reportAuthError(error: any, action: string): void {
    this.handleError(error, {
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.HIGH,
      metadata: { action }
    });
  }

  reportValidationError(error: any, field: string, value: any): void {
    this.handleError(error, {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      metadata: { field, value }
    });
  }

  reportApiError(error: any, endpoint: string, statusCode?: number): void {
    this.handleError(error, {
      category: ErrorCategory.API,
      severity: ErrorSeverity.HIGH,
      metadata: { endpoint, statusCode }
    });
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    recent: ErrorReport[];
  } {
    const bySeverity = Object.values(ErrorSeverity).reduce((acc, severity) => {
      acc[severity] = this.errorQueue.filter(e => e.severity === severity).length;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    const byCategory = Object.values(ErrorCategory).reduce((acc, category) => {
      acc[category] = this.errorQueue.filter(e => e.category === category).length;
      return acc;
    }, {} as Record<ErrorCategory, number>);

    return {
      total: this.errorQueue.length,
      bySeverity,
      byCategory,
      recent: this.errorQueue.slice(-10).reverse(),
    };
  }

  // Clear error queue
  clearErrors(): void {
    this.errorQueue = [];
  }

  // Flush all queued errors to reporting service
  async flushErrors(): Promise<void> {
    const errors = [...this.errorQueue];
    this.errorQueue = [];

    for (const error of errors) {
      await this.reportError(error);
    }
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallback?: T,
  errorOptions?: Parameters<typeof errorHandler.handleError>[1]
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler.handleError(error, errorOptions);
    return fallback;
  }
};

export const withErrorBoundary = <T extends any[], R>(
  fn: (...args: T) => R,
  errorOptions?: Parameters<typeof errorHandler.handleError>[1]
) => {
  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      errorHandler.handleError(error, errorOptions);
      return undefined;
    }
  };
};