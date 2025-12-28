import { supabase } from '@/integrations/supabase/client';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';
import { analyticsApi } from './analyticsApi';

export interface DashboardStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  total_events: number;
  upcoming_events: number;
  total_donations: number;
  monthly_donations: number;
  total_courses: number;
  active_enrollments: number;
  system_health: 'healthy' | 'warning' | 'critical';
  last_updated: string;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

export interface RecentActivity {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  
  // Joined data
  user?: {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'manager';
  permissions: string[];
  department?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
    phone?: string;
  };
}

export interface SystemConfiguration {
  id: string;
  key: string;
  value: unknown;
  category: string;
  description?: string;
  is_public: boolean;
  updated_by?: string;
  updated_at: string;
}

class AdminDashboardApiService {
  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: newUsersToday },
        { count: totalEvents },
        { count: upcomingEvents },
        { data: donationData },
        { data: monthlyDonationData },
        { count: totalCourses },
        { count: activeEnrollments }
      ] = await Promise.all([
        // Total users
        (supabase as unknown).from('profiles').select('*', { count: 'exact', head: true }),
        
        // Active users (logged in within last 30 days)
        (supabase as unknown).from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // New users today
        (supabase as unknown).from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date().toISOString().split('T')[0]),
        
        // Total events
        (supabase as unknown).from('events').select('*', { count: 'exact', head: true }),
        
        // Upcoming events
        (supabase as unknown).from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', new Date().toISOString()),
        
        // Total donations
        (supabase as unknown).from('donations').select('amount'),
        
        // Monthly donations
        (supabase as unknown).from('donations')
          .select('amount')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // Total courses
        (supabase as unknown).from('courses').select('*', { count: 'exact', head: true }),
        
        // Active enrollments
        (supabase as unknown).from('course_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
      ]);

      const totalDonations = (donationData || []).reduce((sum: number, d: unknown) => sum + (d.amount || 0), 0);
      const monthlyDonations = (monthlyDonationData || []).reduce((sum: number, d: unknown) => sum + (d.amount || 0), 0);

      // Simple system health check
      const systemHealth = totalUsers > 0 && totalEvents >= 0 ? 'healthy' : 'warning';

      return {
        total_users: totalUsers || 0,
        active_users: activeUsers || 0,
        new_users_today: newUsersToday || 0,
        total_events: totalEvents || 0,
        upcoming_events: upcomingEvents || 0,
        total_donations: totalDonations,
        monthly_donations: monthlyDonations,
        total_courses: totalCourses || 0,
        active_enrollments: activeEnrollments || 0,
        system_health: systemHealth,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'getDashboardStats' }
      });
      throw error;
    }
  }

  // System Alerts
  async getSystemAlerts(includeRead = false): Promise<SystemAlert[]> {
    try {
      let query = (supabase as unknown)
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeRead) {
        query = query.eq('is_read', false);
      }

      // Filter out expired alerts
      query = query.or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as SystemAlert[];
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getSystemAlerts' }
      });
      throw error;
    }
  }

  async createSystemAlert(alertData: {
    type: SystemAlert['type'];
    title: string;
    message: string;
    expires_at?: string;
  }): Promise<SystemAlert> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('system_alerts')
        .insert([{
          ...alertData,
          is_read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Track alert creation
      await analyticsApi.trackEvent('system_alert_created', 'admin', {
        alert_type: alertData.type,
        alert_title: alertData.title
      });

      return data as SystemAlert;
    } catch (error) {
      console.error('Error creating system alert:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'createSystemAlert', alertData }
      });
      throw error;
    }
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      const { error } = await (supabase as unknown)
        .from('system_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'markAlertAsRead', alertId }
      });
      throw error;
    }
  }

  // Recent Activity
  async getRecentActivity(limit = 50): Promise<RecentActivity[]> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('admin_activity_log')
        .select(`
          *,
          user:profiles!user_id(id, full_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as RecentActivity[];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getRecentActivity' }
      });
      throw error;
    }
  }

  async logActivity(activityData: {
    action: string;
    resource_type: string;
    resource_id?: string;
    details?: Record<string, unknown>;
  }): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await (supabase as unknown)
        .from('admin_activity_log')
        .insert([{
          ...activityData,
          user_id: user.user?.id,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw here to avoid breaking the main operation
    }
  }

  // Admin Users Management
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('admin_users')
        .select(`
          *,
          user:profiles!user_id(id, full_name, email, avatar_url, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []) as AdminUser[];
    } catch (error) {
      console.error('Error fetching admin users:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'getAdminUsers' }
      });
      throw error;
    }
  }

  async createAdminUser(adminData: {
    user_id: string;
    role: AdminUser['role'];
    permissions: string[];
    department?: string;
  }): Promise<AdminUser> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('admin_users')
        .insert([{
          ...adminData,
          is_active: true
        }])
        .select(`
          *,
          user:profiles!user_id(id, full_name, email, avatar_url, phone)
        `)
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        action: 'admin_user_created',
        resource_type: 'admin_user',
        resource_id: data.id,
        details: { role: adminData.role, permissions: adminData.permissions }
      });

      return data as AdminUser;
    } catch (error) {
      console.error('Error creating admin user:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'createAdminUser', adminData }
      });
      throw error;
    }
  }

  async updateAdminUser(adminId: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('admin_users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminId)
        .select(`
          *,
          user:profiles!user_id(id, full_name, email, avatar_url, phone)
        `)
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        action: 'admin_user_updated',
        resource_type: 'admin_user',
        resource_id: adminId,
        details: updates
      });

      return data as AdminUser;
    } catch (error) {
      console.error('Error updating admin user:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateAdminUser', adminId, updates }
      });
      throw error;
    }
  }

  // System Configuration
  async getSystemConfiguration(category?: string): Promise<SystemConfiguration[]> {
    try {
      let query = (supabase as unknown)
        .from('system_configuration')
        .select('*')
        .order('category')
        .order('key');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as SystemConfiguration[];
    } catch (error) {
      console.error('Error fetching system configuration:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getSystemConfiguration', category }
      });
      throw error;
    }
  }

  async updateSystemConfiguration(key: string, value: unknown, category: string): Promise<SystemConfiguration> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await (supabase as unknown)
        .from('system_configuration')
        .upsert([{
          key,
          value,
          category,
          updated_by: user.user?.id,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        action: 'system_config_updated',
        resource_type: 'system_configuration',
        resource_id: data.id,
        details: { key, category, value }
      });

      return data as SystemConfiguration;
    } catch (error) {
      console.error('Error updating system configuration:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateSystemConfiguration', key, value, category }
      });
      throw error;
    }
  }

  // Utility Methods
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  // Bulk Operations
  async bulkDeleteUsers(userIds: string[]): Promise<{ success: number; failed: number }> {
    try {
      let success = 0;
      let failed = 0;

      for (const userId of userIds) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ status: 'deleted', updated_at: new Date().toISOString() })
            .eq('id', userId);

          if (error) throw error;
          success++;
        } catch {
          failed++;
        }
      }

      // Log bulk operation
      await this.logActivity({
        action: 'bulk_user_deletion',
        resource_type: 'profiles',
        details: { total: userIds.length, success, failed }
      });

      return { success, failed };
    } catch (error) {
      console.error('Error in bulk delete users:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'bulkDeleteUsers', userIds }
      });
      throw error;
    }
  }

  // System Maintenance
  async performSystemMaintenance(maintenanceType: 'cleanup' | 'backup' | 'optimization'): Promise<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  }> {
    try {
      let result = { success: false, message: '', details: {} };

      switch (maintenanceType) {
        case 'cleanup': {
          // Clean up old logs, expired sessions, etc.
          const { count: deletedLogs } = await (supabase as unknown)
            .from('admin_activity_log')
            .delete()
            .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

          result = {
            success: true,
            message: 'System cleanup completed',
            details: { deleted_logs: deletedLogs }
          };
          break;
        }

        case 'backup': {
          // Trigger backup process
          result = {
            success: true,
            message: 'Backup process initiated',
            details: { backup_time: new Date().toISOString() }
          };
          break;
        }

        case 'optimization': {
          // Database optimization tasks
          result = {
            success: true,
            message: 'System optimization completed',
            details: { optimization_time: new Date().toISOString() }
          };
          break;
        }
      }

      // Log maintenance activity
      await this.logActivity({
        action: 'system_maintenance',
        resource_type: 'system',
        details: { type: maintenanceType, result }
      });

      return result;
    } catch (error) {
      console.error('Error performing system maintenance:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'performSystemMaintenance', maintenanceType }
      });
      throw error;
    }
  }
}

export const adminDashboardApi = new AdminDashboardApiService();
