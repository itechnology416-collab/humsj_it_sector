import { APP_CONFIG } from '@/config/app';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';

export interface OfflineData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline = navigator.onLine;
  private syncQueue: SyncQueueItem[] = [];
  private offlineData = new Map<string, OfflineData>();
  private syncInProgress = false;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second base delay

  private constructor() {
    this.setupEventListeners();
    this.loadOfflineData();
    this.loadSyncQueue();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onOffline();
    });

    // Sync when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncPendingChanges();
      }
    });
  }

  private onOnline(): void {
    console.log('🌐 Connection restored - syncing offline changes');
    this.syncPendingChanges();
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('connection-restored'));
  }

  private onOffline(): void {
    console.log('📱 Offline mode activated');
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('connection-lost'));
  }

  // Check if currently online
  getConnectionStatus(): boolean {
    return this.isOnline;
  }

  // Store data for offline access
  storeOfflineData(key: string, data: any, expirationHours?: number): void {
    const offlineItem: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: expirationHours ? Date.now() + (expirationHours * 60 * 60 * 1000) : undefined,
      version: APP_CONFIG.version,
    };

    this.offlineData.set(key, offlineItem);
    this.saveOfflineData();
  }

  // Retrieve offline data
  getOfflineData<T>(key: string): T | null {
    const item = this.offlineData.get(key);
    
    if (!item) {
      return null;
    }

    // Check if data has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.offlineData.delete(key);
      this.saveOfflineData();
      return null;
    }

    return item.data as T;
  }

  // Remove offline data
  removeOfflineData(key: string): void {
    this.offlineData.delete(key);
    this.saveOfflineData();
  }

  // Clear all offline data
  clearOfflineData(): void {
    this.offlineData.clear();
    localStorage.removeItem('offline_data');
  }

  // Add operation to sync queue
  addToSyncQueue(
    type: SyncQueueItem['type'],
    endpoint: string,
    data: any,
    maxRetries: number = this.maxRetries
  ): string {
    const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const syncItem: SyncQueueItem = {
      id,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingChanges();
    }

    return id;
  }

  // Sync all pending changes
  async syncPendingChanges(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    console.log(`🔄 Syncing ${this.syncQueue.length} pending changes`);

    const itemsToSync = [...this.syncQueue];
    const successfulSyncs: string[] = [];
    const failedSyncs: SyncQueueItem[] = [];

    for (const item of itemsToSync) {
      try {
        await this.syncItem(item);
        successfulSyncs.push(item.id);
        console.log(`✅ Synced: ${item.type} ${item.endpoint}`);
      } catch (error) {
        item.retryCount++;
        
        if (item.retryCount >= item.maxRetries) {
          console.error(`❌ Max retries exceeded for: ${item.type} ${item.endpoint}`, error);
          errorHandler.handleError(error, {
            category: ErrorCategory.NETWORK,
            severity: ErrorSeverity.HIGH,
            metadata: {
              syncItem: item,
              type: 'sync_failed'
            }
          });
        } else {
          failedSyncs.push(item);
          console.warn(`⚠️ Sync failed, will retry: ${item.type} ${item.endpoint} (${item.retryCount}/${item.maxRetries})`);
        }
      }
    }

    // Remove successful syncs from queue
    this.syncQueue = this.syncQueue.filter(item => !successfulSyncs.includes(item.id));
    
    // Update failed items in queue
    failedSyncs.forEach(failedItem => {
      const index = this.syncQueue.findIndex(item => item.id === failedItem.id);
      if (index !== -1) {
        this.syncQueue[index] = failedItem;
      }
    });

    this.saveSyncQueue();
    this.syncInProgress = false;

    // Schedule retry for failed items
    if (failedSyncs.length > 0) {
      setTimeout(() => {
        this.syncPendingChanges();
      }, this.retryDelay * Math.pow(2, failedSyncs[0].retryCount)); // Exponential backoff
    }

    // Dispatch sync completion event
    window.dispatchEvent(new CustomEvent('sync-completed', {
      detail: {
        successful: successfulSyncs.length,
        failed: failedSyncs.length,
        remaining: this.syncQueue.length
      }
    }));
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const { type, endpoint, data } = item;
    
    let method: string;
    let body: string | undefined;

    switch (type) {
      case 'CREATE':
        method = 'POST';
        body = JSON.stringify(data);
        break;
      case 'UPDATE':
        method = 'PUT';
        body = JSON.stringify(data);
        break;
      case 'DELETE':
        method = 'DELETE';
        break;
      default:
        throw new Error(`Unknown sync type: ${type}`);
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get sync queue status
  getSyncStatus(): {
    pending: number;
    inProgress: boolean;
    lastSync: number | null;
    items: SyncQueueItem[];
  } {
    return {
      pending: this.syncQueue.length,
      inProgress: this.syncInProgress,
      lastSync: this.syncQueue.length > 0 ? Math.max(...this.syncQueue.map(item => item.timestamp)) : null,
      items: [...this.syncQueue],
    };
  }

  // Clear sync queue
  clearSyncQueue(): void {
    this.syncQueue = [];
    localStorage.removeItem('sync_queue');
  }

  // Offline-first data operations
  async getData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    cacheHours: number = 24
  ): Promise<T> {
    // Try to get from offline cache first
    const cachedData = this.getOfflineData<T>(key);
    
    if (cachedData) {
      // Return cached data immediately
      if (!this.isOnline) {
        return cachedData;
      }
      
      // If online, fetch fresh data in background and update cache
      fetchFn()
        .then(freshData => {
          this.storeOfflineData(key, freshData, cacheHours);
        })
        .catch(error => {
          console.warn('Background fetch failed:', error);
        });
      
      return cachedData;
    }

    // No cached data, try to fetch if online
    if (this.isOnline) {
      try {
        const freshData = await fetchFn();
        this.storeOfflineData(key, freshData, cacheHours);
        return freshData;
      } catch (error) {
        errorHandler.handleError(error, {
          category: ErrorCategory.NETWORK,
          severity: ErrorSeverity.HIGH,
          metadata: { key, operation: 'fetch' }
        });
        throw error;
      }
    }

    throw new Error('No cached data available and device is offline');
  }

  // Offline-first write operations
  async writeData<T>(
    endpoint: string,
    data: T,
    type: 'CREATE' | 'UPDATE' | 'DELETE' = 'CREATE'
  ): Promise<void> {
    if (this.isOnline) {
      try {
        // Try to sync immediately if online
        await this.syncItem({
          id: 'immediate',
          type,
          endpoint,
          data,
          timestamp: Date.now(),
          retryCount: 0,
          maxRetries: 1
        });
        return;
      } catch (error) {
        // If immediate sync fails, add to queue
        console.warn('Immediate sync failed, adding to queue:', error);
      }
    }

    // Add to sync queue for later
    this.addToSyncQueue(type, endpoint, data);
  }

  // Persistence methods
  private saveOfflineData(): void {
    try {
      const dataArray = Array.from(this.offlineData.entries());
      localStorage.setItem('offline_data', JSON.stringify(dataArray));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  private loadOfflineData(): void {
    try {
      const stored = localStorage.getItem('offline_data');
      if (stored) {
        const dataArray = JSON.parse(stored);
        this.offlineData = new Map(dataArray);
        
        // Clean up expired data
        const now = Date.now();
        for (const [key, item] of this.offlineData.entries()) {
          if (item.expiresAt && now > item.expiresAt) {
            this.offlineData.delete(key);
          }
        }
        this.saveOfflineData();
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
      this.offlineData.clear();
    }
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private loadSyncQueue(): void {
    try {
      const stored = localStorage.getItem('sync_queue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  // Get offline storage statistics
  getStorageStats(): {
    offlineDataCount: number;
    syncQueueCount: number;
    totalStorageSize: number;
    oldestData: number | null;
    newestData: number | null;
  } {
    const timestamps = Array.from(this.offlineData.values()).map(item => item.timestamp);
    
    return {
      offlineDataCount: this.offlineData.size,
      syncQueueCount: this.syncQueue.length,
      totalStorageSize: this.calculateStorageSize(),
      oldestData: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestData: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  }

  private calculateStorageSize(): number {
    try {
      const offlineData = localStorage.getItem('offline_data') || '';
      const syncQueue = localStorage.getItem('sync_queue') || '';
      return offlineData.length + syncQueue.length;
    } catch {
      return 0;
    }
  }
}

export const offlineManager = OfflineManager.getInstance();