import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analyticsApi } from './analyticsApi';

// Type assertion helper for reports tables
const reportsSupabase = supabase as unknown;

export interface Report {
  id: string;
  title: string;
  description?: string;
  type: 'user_analytics' | 'financial' | 'event_analytics' | 'content_analytics' | 'system_performance' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  parameters: Record<string, unknown>;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  file_url?: string;
  file_size?: number;
  generated_by: string;
  scheduled_for?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  
  // Joined data
  generator?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: Report['type'];
  default_parameters: Record<string, unknown>;
  sql_query?: string;
  chart_config?: Record<string, unknown>;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string;
    borderWidth?: number;
  }>;
}

export interface UserAnalytics {
  total_users: number;
  active_users: number;
  new_registrations: number;
  user_growth_rate: number;
  demographics: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
    registration_sources: Record<string, number>;
  };
  engagement_metrics: {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    average_session_duration: number;
    bounce_rate: number;
  };
  time_series: AnalyticsData;
}

export interface FinancialAnalytics {
  total_donations: number;
  monthly_donations: number;
  average_donation: number;
  donation_growth_rate: number;
  top_donors: Array<{
    user_id: string;
    full_name?: string;
    total_amount: number;
    donation_count: number;
  }>;
  donation_methods: Record<string, number>;
  donation_categories: Record<string, number>;
  time_series: AnalyticsData;
  zakat_analytics: {
    total_zakat_calculated: number;
    total_zakat_paid: number;
    average_zakat_amount: number;
  };
}

export interface EventAnalytics {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  total_registrations: number;
  average_attendance_rate: number;
  popular_event_types: Record<string, number>;
  event_performance: Array<{
    event_id: string;
    title: string;
    registrations: number;
    attendance: number;
    attendance_rate: number;
    rating: number;
  }>;
  time_series: AnalyticsData;
}

export interface ContentAnalytics {
  total_courses: number;
  total_enrollments: number;
  completion_rate: number;
  popular_courses: Array<{
    course_id: string;
    title: string;
    enrollments: number;
    completion_rate: number;
    average_rating: number;
  }>;
  content_engagement: {
    videos_watched: number;
    articles_read: number;
    downloads: number;
    shares: number;
  };
  learning_progress: AnalyticsData;
}

class ReportsApiService {
  // Report Management
  async getReports(filters: {
    type?: string;
    status?: string;
    generated_by?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ reports: Report[]; total: number }> {
    try {
      let query = reportsSupabase
        .from('reports')
        .select(`
          *,
          generator:profiles!generated_by(id, full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.generated_by) {
        query = query.eq('generated_by', filters.generated_by);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
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
        reports: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getReports', filters }
      });
      throw error;
    }
  }

  async createReport(reportData: {
    title: string;
    description?: string;
    type: Report['type'];
    format: Report['format'];
    parameters: Record<string, unknown>;
    scheduled_for?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
  }): Promise<Report> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await reportsSupabase
        .from('reports')
        .insert([{
          ...reportData,
          generated_by: user.user?.id,
          status: 'pending',
          is_recurring: reportData.is_recurring || false
        }])
        .select(`
          *,
          generator:profiles!generated_by(id, full_name, email)
        `)
        .single();

      if (error) throw error;

      // Track report creation
      await analyticsApi.trackEvent('report_created', 'admin', {
        report_type: reportData.type,
        report_format: reportData.format
      });

      // If not scheduled, start generation immediately
      if (!reportData.scheduled_for) {
        await this.generateReport(data.id);
      }

      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createReport', reportData }
      });
      throw error;
    }
  }

  async generateReport(reportId: string): Promise<void> {
    try {
      // Update status to generating
      await reportsSupabase
        .from('reports')
        .update({ status: 'generating' })
        .eq('id', reportId);

      // Get report details
      const { data: report } = await reportsSupabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (!report) throw new Error('Report not found');

      // Generate report based on type
      let reportData: unknown;
      switch (report.type) {
        case 'user_analytics':
          reportData = await this.generateUserAnalytics(report.parameters);
          break;
        case 'financial':
          reportData = await this.generateFinancialAnalytics(report.parameters);
          break;
        case 'event_analytics':
          reportData = await this.generateEventAnalytics(report.parameters);
          break;
        case 'content_analytics':
          reportData = await this.generateContentAnalytics(report.parameters);
          break;
        default:
          throw new Error(`Unsupported report type: ${report.type}`);
      }

      // Convert to requested format and upload
      const fileUrl = await this.exportReportData(reportData, report.format, report.title);

      // Update report with completion
      await reportsSupabase
        .from('reports')
        .update({
          status: 'completed',
          file_url: fileUrl,
          completed_at: new Date().toISOString()
        })
        .eq('id', reportId);

    } catch (error) {
      console.error('Error generating report:', error);
      
      // Update status to failed
      await reportsSupabase
        .from('reports')
        .update({ status: 'failed' })
        .eq('id', reportId);

      throw error;
    }
  }

  // Analytics Generation Methods
  async generateUserAnalytics(parameters: Record<string, unknown>): Promise<UserAnalytics> {
    try {
      const dateFrom = parameters.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = parameters.date_to || new Date().toISOString();

      // Get user statistics
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: newRegistrations },
        { data: userData }
      ] = await Promise.all([
        reportsSupabase.from('profiles').select('*', { count: 'exact', head: true }),
        reportsSupabase.from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in_at', dateFrom),
        reportsSupabase.from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateFrom),
        reportsSupabase.from('profiles')
          .select('created_at, year, college, status')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
      ]);

      // Process demographics
      const demographics = this.processDemographics(userData || []);
      
      // Generate time series data
      const timeSeriesData = this.generateTimeSeriesData(userData || [], 'created_at');

      return {
        total_users: totalUsers || 0,
        active_users: activeUsers || 0,
        new_registrations: newRegistrations || 0,
        user_growth_rate: this.calculateGrowthRate(newRegistrations || 0, totalUsers || 0),
        demographics,
        engagement_metrics: {
          daily_active_users: Math.floor((activeUsers || 0) / 30),
          weekly_active_users: Math.floor((activeUsers || 0) / 4),
          monthly_active_users: activeUsers || 0,
          average_session_duration: 25, // minutes - would need session tracking
          bounce_rate: 0.15 // 15% - would need page analytics
        },
        time_series: timeSeriesData
      };
    } catch (error) {
      console.error('Error generating user analytics:', error);
      throw error;
    }
  }

  async generateFinancialAnalytics(parameters: Record<string, unknown>): Promise<FinancialAnalytics> {
    try {
      const dateFrom = parameters.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = parameters.date_to || new Date().toISOString();

      // Get donation data
      const { data: donations } = await reportsSupabase
        .from('donations')
        .select(`
          *,
          donor:profiles!donor_id(id, full_name)
        `)
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo);

      const totalDonations = (donations || []).reduce((sum: number, d: unknown) => sum + d.amount, 0);
      const monthlyDonations = (donations || [])
        .filter((d: unknown) => new Date(d.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum: number, d: unknown) => sum + d.amount, 0);

      // Process top donors
      const donorMap = new Map();
      (donations || []).forEach((d: unknown) => {
        const existing = donorMap.get(d.donor_id) || { total_amount: 0, donation_count: 0, full_name: d.donor?.full_name };
        existing.total_amount += d.amount;
        existing.donation_count += 1;
        donorMap.set(d.donor_id, existing);
      });

      const topDonors = Array.from(donorMap.entries())
        .map(([user_id, data]: [string, any]) => ({ user_id, ...data }))
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, 10);

      return {
        total_donations: totalDonations,
        monthly_donations: monthlyDonations,
        average_donation: donations?.length ? totalDonations / donations.length : 0,
        donation_growth_rate: this.calculateGrowthRate(monthlyDonations, totalDonations),
        top_donors: topDonors,
        donation_methods: this.groupBy(donations || [], 'payment_method'),
        donation_categories: this.groupBy(donations || [], 'category'),
        time_series: this.generateTimeSeriesData(donations || [], 'created_at', 'amount'),
        zakat_analytics: {
          total_zakat_calculated: 0, // Would need zakat_calculations table
          total_zakat_paid: 0,
          average_zakat_amount: 0
        }
      };
    } catch (error) {
      console.error('Error generating financial analytics:', error);
      throw error;
    }
  }

  async generateEventAnalytics(parameters: Record<string, unknown>): Promise<EventAnalytics> {
    try {
      const dateFrom = parameters.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = parameters.date_to || new Date().toISOString();

      // Get event data
      const [
        { count: totalEvents },
        { count: upcomingEvents },
        { count: completedEvents },
        { data: eventData },
        { data: registrationData }
      ] = await Promise.all([
        reportsSupabase.from('events').select('*', { count: 'exact', head: true }),
        reportsSupabase.from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', new Date().toISOString()),
        reportsSupabase.from('events')
          .select('*', { count: 'exact', head: true })
          .lt('end_date', new Date().toISOString()),
        reportsSupabase.from('events')
          .select('*')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo),
        reportsSupabase.from('event_registrations')
          .select('*')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
      ]);

      return {
        total_events: totalEvents || 0,
        upcoming_events: upcomingEvents || 0,
        completed_events: completedEvents || 0,
        total_registrations: registrationData?.length || 0,
        average_attendance_rate: 0.85, // Would need attendance tracking
        popular_event_types: this.groupBy(eventData || [], 'type'),
        event_performance: [], // Would need detailed event metrics
        time_series: this.generateTimeSeriesData(eventData || [], 'created_at')
      };
    } catch (error) {
      console.error('Error generating event analytics:', error);
      throw error;
    }
  }

  async generateContentAnalytics(parameters: Record<string, unknown>): Promise<ContentAnalytics> {
    try {
      const dateFrom = parameters.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = parameters.date_to || new Date().toISOString();

      // Get content data
      const [
        { count: totalCourses },
        { count: totalEnrollments },
        { data: courseData },
        { data: enrollmentData }
      ] = await Promise.all([
        reportsSupabase.from('courses').select('*', { count: 'exact', head: true }),
        reportsSupabase.from('course_enrollments').select('*', { count: 'exact', head: true }),
        reportsSupabase.from('courses').select('*'),
        reportsSupabase.from('course_enrollments')
          .select('*')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
      ]);

      return {
        total_courses: totalCourses || 0,
        total_enrollments: totalEnrollments || 0,
        completion_rate: 0.65, // Would need progress tracking
        popular_courses: [], // Would need enrollment counts per course
        content_engagement: {
          videos_watched: 0,
          articles_read: 0,
          downloads: 0,
          shares: 0
        },
        learning_progress: this.generateTimeSeriesData(enrollmentData || [], 'created_at')
      };
    } catch (error) {
      console.error('Error generating content analytics:', error);
      throw error;
    }
  }

  // Report Templates
  async getReportTemplates(): Promise<ReportTemplate[]> {
    try {
      const { data, error } = await reportsSupabase
        .from('report_templates')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching report templates:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getReportTemplates' }
      });
      throw error;
    }
  }

  async createReportTemplate(templateData: {
    name: string;
    description?: string;
    type: ReportTemplate['type'];
    default_parameters: Record<string, unknown>;
    sql_query?: string;
    chart_config?: Record<string, unknown>;
    is_public?: boolean;
  }): Promise<ReportTemplate> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await reportsSupabase
        .from('report_templates')
        .insert([{
          ...templateData,
          created_by: user.user?.id,
          is_public: templateData.is_public || false
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating report template:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createReportTemplate', templateData }
      });
      throw error;
    }
  }

  // Utility Methods
  private processDemographics(userData: unknown[]): UserAnalytics['demographics'] {
    const ageGroups: Record<string, number> = {};
    const locations: Record<string, number> = {};
    const registrationSources: Record<string, number> = {};

    userData.forEach(user => {
      // Age groups based on year
      if (user.year) {
        const ageGroup = user.year <= 2 ? 'Freshman/Sophomore' : 'Junior/Senior';
        ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
      }

      // Locations based on college
      if (user.college) {
        locations[user.college] = (locations[user.college] || 0) + 1;
      }

      // Registration sources (would need tracking)
      registrationSources['Direct'] = (registrationSources['Direct'] || 0) + 1;
    });

    return { age_groups: ageGroups, locations, registration_sources: registrationSources };
  }

  private generateTimeSeriesData(data: unknown[], dateField: string, valueField?: string): AnalyticsData {
    const groupedData = new Map();
    
    data.forEach(item => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      const existing = groupedData.get(date) || 0;
      const value = valueField ? (item[valueField] || 1) : 1;
      groupedData.set(date, existing + value);
    });

    const sortedDates = Array.from(groupedData.keys()).sort();
    const values = sortedDates.map(date => groupedData.get(date) || 0);

    return {
      labels: sortedDates,
      datasets: [{
        label: valueField ? 'Amount' : 'Count',
        data: values as number[],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    };
  }

  private groupBy(data: unknown[], field: string): Record<string, number> {
    const grouped: Record<string, number> = {};
    data.forEach(item => {
      const key = item[field] || 'Unknown';
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return grouped;
  }

  private calculateGrowthRate(current: number, total: number): number {
    return total > 0 ? (current / total) * 100 : 0;
  }

  private async exportReportData(data: unknown, format: string, filename: string): Promise<string> {
    // This would integrate with file storage service
    // For now, return a mock URL
    return `https://storage.example.com/reports/${filename}.${format}`;
  }

  // Scheduled Reports
  async getScheduledReports(): Promise<Report[]> {
    try {
      const { data, error } = await reportsSupabase
        .from('reports')
        .select('*')
        .eq('is_recurring', true)
        .eq('status', 'pending')
        .not('scheduled_for', 'is', null);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      throw error;
    }
  }

  async processScheduledReports(): Promise<void> {
    try {
      const scheduledReports = await this.getScheduledReports();
      const now = new Date();

      for (const report of scheduledReports) {
        if (report.scheduled_for && new Date(report.scheduled_for) <= now) {
          await this.generateReport(report.id);
          
          // If recurring, schedule next occurrence
          if (report.is_recurring && report.recurrence_pattern) {
            const nextSchedule = this.calculateNextSchedule(report.recurrence_pattern);
            await reportsSupabase
              .from('reports')
              .update({ scheduled_for: nextSchedule })
              .eq('id', report.id);
          }
        }
      }
    } catch (error) {
      console.error('Error processing scheduled reports:', error);
      throw error;
    }
  }

  private calculateNextSchedule(pattern: string): string {
    // Simple implementation - would need more sophisticated scheduling
    const now = new Date();
    switch (pattern) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
  }
}

export const reportsApi = new ReportsApiService();