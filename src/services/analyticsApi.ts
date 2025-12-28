import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analytics } from './analytics';

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_type: string;
  event_category: string;
  event_data: Record<string, unknown>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  page_url?: string;
  referrer?: string;
  created_at: string;
}

export interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  metric_category: string;
  metadata: Record<string, unknown>;
  recorded_at: string;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  report_type: 'overview' | 'membership' | 'events' | 'communication' | 'engagement';
  parameters: Record<string, unknown>;
  generated_by?: string;
  file_url?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  generated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  user_id: string;
  widget_type: string;
  widget_config: Record<string, unknown>;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemHealthCheck {
  id: string;
  service_name: string;
  status: 'operational' | 'degraded' | 'outage';
  response_time_ms?: number;
  uptime_percentage?: number;
  last_checked: string;
  error_message?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SystemIncident {
  id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  affected_services: string[];
  started_at: string;
  resolved_at?: string;
  created_by?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardOverview {
  total_users: number;
  active_users: number;
  total_events: number;
  upcoming_events: number;
  engagement_rate: number;
  generated_at: string;
}

class AnalyticsApiService {
  // Analytics Events
  async trackEvent(
    eventType: string,
    eventCategory: string,
    eventData: Record<string, unknown> = {},
    sessionId?: string,
    pageUrl?: string,
    referrer?: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('track_analytics_event', {
        p_event_type: eventType,
        p_event_category: eventCategory,
        p_event_data: eventData,
        p_session_id: sessionId,
        p_page_url: pageUrl,
        p_referrer: referrer
      });

      if (error) throw error;

      // Also track with local analytics service
      await analytics.trackEvent(eventType, eventCategory, eventData);

      return data;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      throw errorHandler.handleError(error, 'Failed to track analytics event');
    }
  }

  async getAnalyticsEvents(filters: {
    user_id?: string;
    event_type?: string;
    event_category?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ events: AnalyticsEvent[]; total: number }> {
    try {
      let query = supabase
        .from('analytics_events')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.event_category) {
        query = query.eq('event_category', filters.event_category);
      }
      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        events: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching analytics events:', error);
      throw errorHandler.handleError(error, 'Failed to fetch analytics events');
    }
  }

  // System Metrics
  async recordMetric(
    metricName: string,
    metricValue: number,
    metricUnit?: string,
    metricCategory: string = 'general',
    metadata: Record<string, unknown> = {}
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('record_system_metric', {
        p_metric_name: metricName,
        p_metric_value: metricValue,
        p_metric_unit: metricUnit,
        p_metric_category: metricCategory,
        p_metadata: metadata
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error recording system metric:', error);
      throw errorHandler.handleError(error, 'Failed to record system metric');
    }
  }

  async getSystemMetrics(filters: {
    metric_name?: string;
    metric_category?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
  } = {}): Promise<SystemMetric[]> {
    try {
      let query = supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (filters.metric_name) {
        query = query.eq('metric_name', filters.metric_name);
      }
      if (filters.metric_category) {
        query = query.eq('metric_category', filters.metric_category);
      }
      if (filters.start_date) {
        query = query.gte('recorded_at', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('recorded_at', filters.end_date);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw errorHandler.handleError(error, 'Failed to fetch system metrics');
    }
  }

  // Dashboard Overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_overview');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw errorHandler.handleError(error, 'Failed to fetch dashboard overview');
    }
  }

  // Reports
  async createReport(reportData: {
    title: string;
    description?: string;
    report_type: Report['report_type'];
    parameters?: Record<string, unknown>;
  }): Promise<Report> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          ...reportData,
          generated_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Track report creation
      await this.trackEvent('report_created', 'admin_action', {
        report_type: reportData.report_type,
        report_title: reportData.title
      });

      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw errorHandler.handleError(error, 'Failed to create report');
    }
  }

  async getReports(filters: {
    report_type?: string;
    status?: string;
    generated_by?: string;
    limit?: number;
  } = {}): Promise<Report[]> {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.report_type) {
        query = query.eq('report_type', filters.report_type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.generated_by) {
        query = query.eq('generated_by', filters.generated_by);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw errorHandler.handleError(error, 'Failed to fetch reports');
    }
  }

  async updateReportStatus(reportId: string, status: Report['status'], fileUrl?: string): Promise<Report> {
    try {
      const updateData: unknown = { status };
      if (status === 'completed') {
        updateData.generated_at = new Date().toISOString();
        if (fileUrl) {
          updateData.file_url = fileUrl;
        }
      }

      const { data, error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating report status:', error);
      throw errorHandler.handleError(error, 'Failed to update report status');
    }
  }

  // Dashboard Widgets
  async getDashboardWidgets(userId?: string): Promise<DashboardWidget[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await supabase
        .from('dashboard_widgets')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('is_visible', true)
        .order('position_y')
        .order('position_x');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching dashboard widgets:', error);
      throw errorHandler.handleError(error, 'Failed to fetch dashboard widgets');
    }
  }

  async saveDashboardWidget(widgetData: Omit<DashboardWidget, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardWidget> {
    try {
      const { data, error } = await supabase
        .from('dashboard_widgets')
        .upsert([widgetData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error saving dashboard widget:', error);
      throw errorHandler.handleError(error, 'Failed to save dashboard widget');
    }
  }

  // System Health
  async getSystemHealthChecks(): Promise<SystemHealthCheck[]> {
    try {
      const { data, error } = await supabase
        .from('system_health_checks')
        .select('*')
        .order('last_checked', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching system health checks:', error);
      throw errorHandler.handleError(error, 'Failed to fetch system health checks');
    }
  }

  async updateSystemHealth(
    serviceName: string,
    status: SystemHealthCheck['status'],
    responseTimeMs?: number,
    uptimePercentage?: number,
    errorMessage?: string,
    metadata: Record<string, unknown> = {}
  ): Promise<SystemHealthCheck> {
    try {
      const { data, error } = await supabase
        .from('system_health_checks')
        .upsert([{
          service_name: serviceName,
          status,
          response_time_ms: responseTimeMs,
          uptime_percentage: uptimePercentage,
          error_message: errorMessage,
          metadata,
          last_checked: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating system health:', error);
      throw errorHandler.handleError(error, 'Failed to update system health');
    }
  }

  // System Incidents
  async getSystemIncidents(filters: {
    status?: string;
    severity?: string;
    limit?: number;
  } = {}): Promise<SystemIncident[]> {
    try {
      let query = supabase
        .from('system_incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching system incidents:', error);
      throw errorHandler.handleError(error, 'Failed to fetch system incidents');
    }
  }

  async createSystemIncident(incidentData: {
    title: string;
    description?: string;
    severity: SystemIncident['severity'];
    affected_services: string[];
  }): Promise<SystemIncident> {
    try {
      const { data, error } = await supabase
        .from('system_incidents')
        .insert([{
          ...incidentData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Track incident creation
      await this.trackEvent('incident_created', 'system_event', {
        severity: incidentData.severity,
        affected_services: incidentData.affected_services
      });

      return data;
    } catch (error) {
      console.error('Error creating system incident:', error);
      throw errorHandler.handleError(error, 'Failed to create system incident');
    }
  }

  async updateSystemIncident(
    incidentId: string,
    updates: Partial<Pick<SystemIncident, 'status' | 'assigned_to' | 'resolved_at'>>
  ): Promise<SystemIncident> {
    try {
      const { data, error } = await supabase
        .from('system_incidents')
        .update(updates)
        .eq('id', incidentId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating system incident:', error);
      throw errorHandler.handleError(error, 'Failed to update system incident');
    }
  }

  // Analytics Aggregations
  async getEventAnalytics(filters: {
    event_type?: string;
    event_category?: string;
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month';
  } = {}): Promise<Array<{ date: string; count: number; event_type?: string }>> {
    try {
      const groupBy = filters.group_by || 'day';
      const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 
                        groupBy === 'week' ? 'YYYY-"W"WW' : 'YYYY-MM';

      let query = supabase
        .from('analytics_events')
        .select(`
          created_at,
          event_type,
          event_category
        `);

      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.event_category) {
        query = query.eq('event_category', filters.event_category);
      }
      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group and aggregate data
      const grouped = (data || []).reduce((acc: Record<string, unknown>, event) => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        const key = filters.event_type ? date : `${date}-${event.event_type}`;
        
        if (!acc[key]) {
          acc[key] = {
            date,
            count: 0,
            ...(filters.event_type ? {} : { event_type: event.event_type })
          };
        }
        acc[key].count++;
        return acc;
      }, {});

      return Object.values(grouped);
    } catch (error) {
      console.error('Error fetching event analytics:', error);
      throw errorHandler.handleError(error, 'Failed to fetch event analytics');
    }
  }

  async getMembershipGrowthData(period: string = '6months'): Promise<Array<{
    month: string;
    total: number;
    new: number;
    active: number;
  }>> {
    try {
      const months = period === '1year' ? 12 : period === '6months' ? 6 : period === '3months' ? 3 : 1;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      // Get user registration data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('created_at, status, last_sign_in_at')
        .gte('created_at', startDate.toISOString());

      if (userError) throw userError;

      // Process data by month
      const monthlyData: Record<string, { total: number; new: number; active: number }> = {};
      
      for (let i = 0; i < months; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthKey] = { total: 0, new: 0, active: 0 };
      }

      // Aggregate user data
      (userData || []).forEach(user => {
        const userDate = new Date(user.created_at);
        const monthKey = userDate.toLocaleDateString('en-US', { month: 'short' });
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].new++;
          if (user.status === 'active') {
            monthlyData[monthKey].active++;
          }
        }
      });

      // Calculate cumulative totals
      let cumulativeTotal = 0;
      const result = Object.entries(monthlyData).map(([month, data]) => {
        cumulativeTotal += data.new;
        return {
          month,
          total: cumulativeTotal,
          new: data.new,
          active: data.active
        };
      });

      return result.reverse(); // Show oldest to newest
    } catch (error) {
      console.error('Error fetching membership growth data:', error);
      throw errorHandler.handleError(error, 'Failed to fetch membership growth data');
    }
  }
}

export const analyticsApi = new AnalyticsApiService();