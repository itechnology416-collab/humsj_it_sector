import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { systemMonitoringApi } from '@/services/systemMonitoringApi';
import { toast } from 'sonner';

export interface SystemLog {
  id: string;
  created_at: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  category: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  service_name: string;
  environment: string;
}

export interface SystemHealthMetric {
  id: string;
  created_at: string;
  service_name: string;
  metric_name: string;
  metric_value?: number;
  metric_unit?: string;
  status: 'operational' | 'degraded' | 'outage';
  metadata?: Record<string, unknown>;
}

export interface CreateLogData {
  level: SystemLog['level'];
  message: string;
  category: string;
  metadata?: Record<string, unknown>;
  service_name?: string;
}

export interface CreateMetricData {
  service_name: string;
  metric_name: string;
  metric_value?: number;
  metric_unit?: string;
  status: SystemHealthMetric['status'];
  metadata?: Record<string, unknown>;
}

// Mock data for development
const mockLogs: SystemLog[] = [
  {
    id: '1',
    created_at: '2024-12-20T10:30:00Z',
    level: 'info',
    message: 'User login successful',
    category: 'authentication',
    user_id: 'user1',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    service_name: 'webapp',
    environment: 'production'
  },
  {
    id: '2',
    created_at: '2024-12-20T10:25:00Z',
    level: 'warning',
    message: 'High memory usage detected',
    category: 'performance',
    metadata: { memory_usage: '85%', threshold: '80%' },
    service_name: 'webapp',
    environment: 'production'
  },
  {
    id: '3',
    created_at: '2024-12-20T10:20:00Z',
    level: 'error',
    message: 'Database connection timeout',
    category: 'database',
    metadata: { timeout_duration: '30s', query: 'SELECT * FROM profiles' },
    service_name: 'database',
    environment: 'production'
  },
  {
    id: '4',
    created_at: '2024-12-20T10:15:00Z',
    level: 'critical',
    message: 'Payment gateway service unavailable',
    category: 'external_service',
    metadata: { service: 'stripe', error_code: '503' },
    service_name: 'payment',
    environment: 'production'
  }
];

const mockMetrics: SystemHealthMetric[] = [
  {
    id: '1',
    created_at: '2024-12-20T10:30:00Z',
    service_name: 'webapp',
    metric_name: 'response_time',
    metric_value: 250,
    metric_unit: 'ms',
    status: 'operational'
  },
  {
    id: '2',
    created_at: '2024-12-20T10:30:00Z',
    service_name: 'database',
    metric_name: 'cpu_usage',
    metric_value: 45,
    metric_unit: '%',
    status: 'operational'
  },
  {
    id: '3',
    created_at: '2024-12-20T10:30:00Z',
    service_name: 'webapp',
    metric_name: 'memory_usage',
    metric_value: 85,
    metric_unit: '%',
    status: 'degraded'
  },
  {
    id: '4',
    created_at: '2024-12-20T10:30:00Z',
    service_name: 'payment',
    metric_name: 'availability',
    metric_value: 0,
    metric_unit: '%',
    status: 'outage'
  }
];

export const useSystemMonitoring = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [metrics, setMetrics] = useState<SystemHealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('system_logs')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchLogs = useCallback(async (filters?: {
    level?: string;
    category?: string;
    service?: string;
    limit?: number;
  }) => {
    try {
      if (!isAdmin) {
        setLogs([]);
        return;
      }

      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('System monitoring tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredLogs = [...mockLogs];
        
        if (filters?.level && filters.level !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.level === filters.level);
        }
        if (filters?.category && filters.category !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.category === filters.category);
        }
        if (filters?.service && filters.service !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.service_name === filters.service);
        }
        if (filters?.limit) {
          filteredLogs = filteredLogs.slice(0, filters.limit);
        }
        
        setLogs(filteredLogs);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('system_logs')
        .select('*');

      // Apply filters
      if (filters?.level && filters.level !== 'all') {
        query = query.eq('level', filters.level);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.service && filters.service !== 'all') {
        query = query.eq('service_name', filters.service);
      }

      query = query.order('created_at', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data: logsData, error: logsError } = await query;

      if (logsError) throw logsError;

      setLogs(logsData || []);

    } catch (err: unknown) {
      console.error('Error fetching system logs:', err);
      setError(err.message || 'Failed to fetch system logs');
      
      // Fallback to mock data
      setUseMockData(true);
      setLogs(mockLogs);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchMetrics = useCallback(async (filters?: {
    service?: string;
    metric?: string;
    status?: string;
  }) => {
    try {
      if (!isAdmin) {
        setMetrics([]);
        return;
      }

      const tableExists = await checkTableExists();
      
      if (!tableExists || useMockData) {
        let filteredMetrics = [...mockMetrics];
        
        if (filters?.service && filters.service !== 'all') {
          filteredMetrics = filteredMetrics.filter(metric => metric.service_name === filters.service);
        }
        if (filters?.metric && filters.metric !== 'all') {
          filteredMetrics = filteredMetrics.filter(metric => metric.metric_name === filters.metric);
        }
        if (filters?.status && filters.status !== 'all') {
          filteredMetrics = filteredMetrics.filter(metric => metric.status === filters.status);
        }
        
        setMetrics(filteredMetrics);
        return;
      }

      let query = supabase
        .from('system_health_metrics')
        .select('*');

      // Apply filters
      if (filters?.service && filters.service !== 'all') {
        query = query.eq('service_name', filters.service);
      }
      if (filters?.metric && filters.metric !== 'all') {
        query = query.eq('metric_name', filters.metric);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      const { data: metricsData, error: metricsError } = await query;

      if (metricsError) throw metricsError;

      setMetrics(metricsData || []);

    } catch (err: unknown) {
      console.error('Error fetching system metrics:', err);
      setMetrics(mockMetrics);
    }
  }, [isAdmin, useMockData]);

  const createLog = useCallback(async (logData: CreateLogData): Promise<SystemLog | null> => {
    try {
      if (useMockData) {
        const newLog: SystemLog = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          ...logData,
          user_id: user?.id,
          service_name: logData.service_name || 'webapp',
          environment: 'production'
        };
        
        setLogs(prev => [newLog, ...prev]);
        return newLog;
      }

      const { data, error } = await supabase
        .from('system_logs')
        .insert([{
          ...logData,
          user_id: user?.id,
          service_name: logData.service_name || 'webapp',
          environment: 'production'
        }])
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => [data, ...prev]);
      return data;

    } catch (err: unknown) {
      console.error('Error creating log:', err);
      return null;
    }
  }, [user, useMockData]);

  const createMetric = useCallback(async (metricData: CreateMetricData): Promise<SystemHealthMetric | null> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can create metrics');
      }

      if (useMockData) {
        const newMetric: SystemHealthMetric = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          ...metricData
        };
        
        setMetrics(prev => [newMetric, ...prev]);
        toast.success('Metric recorded! (Mock data)');
        return newMetric;
      }

      const { data, error } = await supabase
        .from('system_health_metrics')
        .insert([metricData])
        .select()
        .single();

      if (error) throw error;

      setMetrics(prev => [data, ...prev]);
      toast.success('Metric recorded successfully!');
      return data;

    } catch (err: unknown) {
      console.error('Error creating metric:', err);
      toast.error(err.message || 'Failed to record metric');
      return null;
    }
  }, [isAdmin, useMockData]);

  const clearOldLogs = useCallback(async (daysToKeep: number = 30): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can clear logs');
      }

      if (useMockData) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        setLogs(prev => prev.filter(log => new Date(log.created_at) > cutoffDate));
        toast.success(`Cleared logs older than ${daysToKeep} days! (Mock data)`);
        return true;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { error } = await supabase
        .from('system_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;

      toast.success(`Cleared logs older than ${daysToKeep} days!`);
      await fetchLogs(); // Refresh logs
      return true;

    } catch (err: unknown) {
      console.error('Error clearing logs:', err);
      toast.error(err.message || 'Failed to clear logs');
      return false;
    }
  }, [isAdmin, useMockData, fetchLogs]);

  const getSystemOverview = useCallback(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentLogs = logs.filter(log => new Date(log.created_at) > oneHourAgo);
    const dailyLogs = logs.filter(log => new Date(log.created_at) > oneDayAgo);

    const services = [...new Set(metrics.map(m => m.service_name))];
    const serviceStatus = services.reduce((acc, service) => {
      const serviceMetrics = metrics.filter(m => m.service_name === service);
      const hasOutage = serviceMetrics.some(m => m.status === 'outage');
      const hasDegraded = serviceMetrics.some(m => m.status === 'degraded');
      
      acc[service] = hasOutage ? 'outage' : hasDegraded ? 'degraded' : 'operational';
      return acc;
    }, {} as Record<string, string>);

    return {
      totalLogs: logs.length,
      recentLogs: recentLogs.length,
      dailyLogs: dailyLogs.length,
      errorLogs: logs.filter(l => l.level === 'error').length,
      criticalLogs: logs.filter(l => l.level === 'critical').length,
      warningLogs: logs.filter(l => l.level === 'warning').length,
      services: services.length,
      operationalServices: Object.values(serviceStatus).filter(s => s === 'operational').length,
      degradedServices: Object.values(serviceStatus).filter(s => s === 'degraded').length,
      outageServices: Object.values(serviceStatus).filter(s => s === 'outage').length,
      serviceStatus,
      recentErrors: recentLogs.filter(l => ['error', 'critical'].includes(l.level)),
      systemHealth: Object.values(serviceStatus).every(s => s === 'operational') ? 'healthy' : 
                   Object.values(serviceStatus).some(s => s === 'outage') ? 'critical' : 'warning'
    };
  }, [logs, metrics]);

  const getLogsByCategory = useCallback((category: string) => {
    return logs.filter(log => log.category === category);
  }, [logs]);

  const getMetricsByService = useCallback((service: string) => {
    return metrics.filter(metric => metric.service_name === service);
  }, [metrics]);

  const getRecentAlerts = useCallback(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return logs.filter(log => 
      ['error', 'critical'].includes(log.level) && 
      new Date(log.created_at) > oneHourAgo
    );
  }, [logs]);

  // Auto-refresh data every 30 seconds for real-time monitoring
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      fetchLogs({ limit: 100 });
      fetchMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin, fetchLogs, fetchMetrics]);

  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
      fetchMetrics();
    }
  }, [isAdmin, fetchLogs, fetchMetrics]);

  return {
    // Data
    logs,
    metrics,
    overview: getSystemOverview(),
    recentAlerts: getRecentAlerts(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchLogs,
    fetchMetrics,
    createLog,
    createMetric,
    clearOldLogs,
    
    // Utilities
    getLogsByCategory,
    getMetricsByService,
    refetch: () => {
      fetchLogs();
      fetchMetrics();
    },
    clearError: () => setError(null)
  };
};

export default useSystemMonitoring;