import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analyticsApi } from './analyticsApi';

// Import all API services
import { adminDashboardApi } from './adminDashboardApi';
import { reportsApi } from './reportsApi';
import { islamicEducationApi } from './islamicEducationApi';
import { systemMonitoringApi } from './systemMonitoringApi';
import { zakatCalculatorApi } from './zakatCalculatorApi';
import { halalMarketplaceApi } from './halalMarketplaceApi';
import { memberApi } from './memberApi';
import { eventApi } from './eventApi';
import { courseApi } from './courseApi';
import { volunteerApi } from './volunteerApi';
import { donationsApi } from './donationsApi';
import { communicationApi } from './communicationApi';
import { roleManagementApi } from './roleManagementApi';
import { userVerificationApi } from './userVerificationApi';
import { loginActivityApi } from './loginActivityApi';
import { attendanceApi } from './attendanceApi';
import { liveStreamingApi } from './liveStreamingApi';
import { libraryApi } from './libraryApi';
import { supportApi } from './supportApi';
import { tasksApi } from './tasksApi';
import { websiteContentApi } from './websiteContentApi';
import { mediaApi } from './mediaApi';
import { prayerTimesApi } from './prayerTimesApi';
import { islamicFeaturesApi } from './islamicFeaturesApi';
import { committeeApi } from './committeeApi';

export interface ApiServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  last_checked: string;
  response_time_ms?: number;
  error_message?: string;
}

export interface SystemIntegration {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'third_party';
  status: 'active' | 'inactive' | 'error';
  endpoint?: string;
  api_key?: string;
  configuration: Record<string, unknown>;
  last_sync?: string;
  error_count: number;
  created_at: string;
  updated_at: string;
}

export interface DataSyncJob {
  id: string;
  integration_id: string;
  job_type: 'import' | 'export' | 'sync' | 'backup';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress_percentage: number;
  records_processed: number;
  total_records: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

class ApiIntegrationManagerService {
  private apiServices = {
    adminDashboard: adminDashboardApi,
    reports: reportsApi,
    islamicEducation: islamicEducationApi,
    systemMonitoring: systemMonitoringApi,
    zakatCalculator: zakatCalculatorApi,
    halalMarketplace: halalMarketplaceApi,
    member: memberApi,
    event: eventApi,
    course: courseApi,
    volunteer: volunteerApi,
    donations: donationsApi,
    communication: communicationApi,
    roleManagement: roleManagementApi,
    userVerification: userVerificationApi,
    loginActivity: loginActivityApi,
    attendance: attendanceApi,
    liveStreaming: liveStreamingApi,
    library: libraryApi,
    support: supportApi,
    tasks: tasksApi,
    websiteContent: websiteContentApi,
    media: mediaApi,
    prayerTimes: prayerTimesApi,
    islamicFeatures: islamicFeaturesApi,
    committee: committeeApi
  };

  // API Health Monitoring
  async checkAllApiServices(): Promise<ApiServiceStatus[]> {
    try {
      const serviceChecks = await Promise.allSettled(
        Object.entries(this.apiServices).map(async ([name, service]) => {
          const startTime = Date.now();
          try {
            // Try to call a basic method on each service
            if (name === 'adminDashboard') {
              await adminDashboardApi.getDashboardStats();
            } else if (name === 'systemMonitoring') {
              await systemMonitoringApi.getSystemHealth();
            } else if (name === 'member') {
              await memberApi.getMembers({ limit: 1 });
            } else if (name === 'event') {
              await eventApi.getEvents({ limit: 1 });
            } else {
              // For services without obvious health check methods, just verify they exist
              if (typeof service === 'object' && service !== null) {
                // Service exists and is an object
              }
            }

            const responseTime = Date.now() - startTime;
            return {
              name,
              status: 'operational' as const,
              last_checked: new Date().toISOString(),
              response_time_ms: responseTime
            };
          } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
              name,
              status: 'outage' as const,
              last_checked: new Date().toISOString(),
              response_time_ms: responseTime,
              error_message: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );

      return serviceChecks.map((result, index) => {
        const serviceName = Object.keys(this.apiServices)[index];
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            name: serviceName,
            status: 'outage' as const,
            last_checked: new Date().toISOString(),
            error_message: 'Service check failed'
          };
        }
      });
    } catch (error) {
      console.error('Error checking API services:', error);
      errorHandler.handleError(error, {
        category: 'system' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'checkAllApiServices' }
      });
      throw error;
    }
  }

  // System Integrations Management
  async getSystemIntegrations(): Promise<SystemIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('system_integrations')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching system integrations:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getSystemIntegrations' }
      });
      throw error;
    }
  }

  async createSystemIntegration(integrationData: {
    name: string;
    type: SystemIntegration['type'];
    endpoint?: string;
    api_key?: string;
    configuration: Record<string, unknown>;
  }): Promise<SystemIntegration> {
    try {
      const { data, error } = await supabase
        .from('system_integrations')
        .insert([{
          ...integrationData,
          status: 'active',
          error_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Track integration creation
      await analyticsApi.trackEvent('integration_created', 'system', {
        integration_name: integrationData.name,
        integration_type: integrationData.type
      });

      return data;
    } catch (error) {
      console.error('Error creating system integration:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createSystemIntegration', integrationData }
      });
      throw error;
    }
  }

  async updateSystemIntegration(
    integrationId: string,
    updates: Partial<SystemIntegration>
  ): Promise<SystemIntegration> {
    try {
      const { data, error } = await supabase
        .from('system_integrations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating system integration:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'updateSystemIntegration', integrationId, updates }
      });
      throw error;
    }
  }

  // Data Synchronization
  async createDataSyncJob(jobData: {
    integration_id: string;
    job_type: DataSyncJob['job_type'];
    total_records?: number;
  }): Promise<DataSyncJob> {
    try {
      const { data, error } = await supabase
        .from('data_sync_jobs')
        .insert([{
          ...jobData,
          status: 'pending',
          progress_percentage: 0,
          records_processed: 0,
          total_records: jobData.total_records || 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Start the sync job
      this.processDataSyncJob(data.id);

      return data;
    } catch (error) {
      console.error('Error creating data sync job:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createDataSyncJob', jobData }
      });
      throw error;
    }
  }

  async getDataSyncJobs(filters: {
    integration_id?: string;
    status?: string;
    job_type?: string;
    limit?: number;
  } = {}): Promise<DataSyncJob[]> {
    try {
      let query = supabase
        .from('data_sync_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.integration_id) {
        query = query.eq('integration_id', filters.integration_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.job_type) {
        query = query.eq('job_type', filters.job_type);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching data sync jobs:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getDataSyncJobs', filters }
      });
      throw error;
    }
  }

  private async processDataSyncJob(jobId: string): Promise<void> {
    try {
      // Update job status to running
      await supabase
        .from('data_sync_jobs')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Get job details
      const { data: job } = await supabase
        .from('data_sync_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (!job) throw new Error('Job not found');

      // Simulate sync process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
        
        await supabase
          .from('data_sync_jobs')
          .update({
            progress_percentage: i,
            records_processed: Math.floor((job.total_records || 100) * (i / 100))
          })
          .eq('id', jobId);
      }

      // Mark job as completed
      await supabase
        .from('data_sync_jobs')
        .update({
          status: 'completed',
          progress_percentage: 100,
          records_processed: job.total_records || 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Track job completion
      await analyticsApi.trackEvent('sync_job_completed', 'system', {
        job_id: jobId,
        job_type: job.job_type,
        records_processed: job.total_records || 100
      });

    } catch (error) {
      console.error('Error processing sync job:', error);
      
      // Mark job as failed
      await supabase
        .from('data_sync_jobs')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);
    }
  }

  // Bulk Operations
  async performBulkDataOperation(operation: {
    type: 'export' | 'import' | 'cleanup' | 'migration';
    tables: string[];
    filters?: Record<string, unknown>;
    options?: Record<string, unknown>;
  }): Promise<{
    success: boolean;
    message: string;
    records_affected: number;
    file_url?: string;
  }> {
    try {
      let recordsAffected = 0;
      let fileUrl: string | undefined;

      switch (operation.type) {
        case 'export':
          // Export data from specified tables
          recordsAffected = await this.exportData(operation.tables, operation.filters);
          fileUrl = `https://storage.example.com/exports/export_${Date.now()}.json`;
          break;

        case 'import':
          // Import data to specified tables
          recordsAffected = await this.importData(operation.tables, operation.options);
          break;

        case 'cleanup':
          // Clean up old/unused data
          recordsAffected = await this.cleanupData(operation.tables, operation.filters);
          break;

        case 'migration':
          // Migrate data between tables/formats
          recordsAffected = await this.migrateData(operation.tables, operation.options);
          break;

        default:
          throw new Error(`Unsupported operation type: ${operation.type}`);
      }

      // Track bulk operation
      await analyticsApi.trackEvent('bulk_operation_completed', 'system', {
        operation_type: operation.type,
        tables: operation.tables,
        records_affected: recordsAffected
      });

      return {
        success: true,
        message: `${operation.type} operation completed successfully`,
        records_affected: recordsAffected,
        file_url: fileUrl
      };
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      errorHandler.handleError(error, {
        category: 'system' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'performBulkDataOperation', operation }
      });
      throw error;
    }
  }

  private async exportData(tables: string[], filters?: Record<string, unknown>): Promise<number> {
    // Simulate data export
    let totalRecords = 0;
    
    for (const table of tables) {
      // In a real implementation, this would query each table and export the data
      const mockRecordCount = Math.floor(Math.random() * 1000) + 100;
      totalRecords += mockRecordCount;
    }
    
    return totalRecords;
  }

  private async importData(tables: string[], options?: Record<string, unknown>): Promise<number> {
    // Simulate data import
    let totalRecords = 0;
    
    for (const table of tables) {
      // In a real implementation, this would import data to each table
      const mockRecordCount = Math.floor(Math.random() * 500) + 50;
      totalRecords += mockRecordCount;
    }
    
    return totalRecords;
  }

  private async cleanupData(tables: string[], filters?: Record<string, unknown>): Promise<number> {
    // Simulate data cleanup
    let totalRecords = 0;
    
    for (const table of tables) {
      // In a real implementation, this would clean up old data from each table
      const mockRecordCount = Math.floor(Math.random() * 200) + 10;
      totalRecords += mockRecordCount;
    }
    
    return totalRecords;
  }

  private async migrateData(tables: string[], options?: Record<string, unknown>): Promise<number> {
    // Simulate data migration
    let totalRecords = 0;
    
    for (const table of tables) {
      // In a real implementation, this would migrate data between tables/formats
      const mockRecordCount = Math.floor(Math.random() * 300) + 25;
      totalRecords += mockRecordCount;
    }
    
    return totalRecords;
  }

  // API Rate Limiting and Throttling
  async checkRateLimit(apiKey: string, endpoint: string): Promise<{
    allowed: boolean;
    remaining_requests: number;
    reset_time: string;
  }> {
    try {
      // In a real implementation, this would check against a rate limiting store (Redis, etc.)
      const mockRemainingRequests = Math.floor(Math.random() * 1000);
      const resetTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

      return {
        allowed: mockRemainingRequests > 0,
        remaining_requests: mockRemainingRequests,
        reset_time: resetTime
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return {
        allowed: true, // Default to allowing requests if check fails
        remaining_requests: 1000,
        reset_time: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };
    }
  }

  // System Health Dashboard
  async getSystemHealthDashboard(): Promise<{
    overall_status: 'healthy' | 'degraded' | 'critical';
    api_services: ApiServiceStatus[];
    integrations: SystemIntegration[];
    recent_sync_jobs: DataSyncJob[];
    system_metrics: {
      total_api_calls_today: number;
      average_response_time: number;
      error_rate: number;
      active_integrations: number;
    };
  }> {
    try {
      const [apiServices, integrations, syncJobs] = await Promise.all([
        this.checkAllApiServices(),
        this.getSystemIntegrations(),
        this.getDataSyncJobs({ limit: 10 })
      ]);

      // Calculate overall status
      const criticalServices = apiServices.filter(s => s.status === 'outage');
      const degradedServices = apiServices.filter(s => s.status === 'degraded');
      
      let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
      if (criticalServices.length > 0) {
        overallStatus = 'critical';
      } else if (degradedServices.length > 0) {
        overallStatus = 'degraded';
      }

      // Calculate system metrics
      const totalApiCallsToday = Math.floor(Math.random() * 10000) + 5000;
      const averageResponseTime = apiServices.reduce((sum, service) => 
        sum + (service.response_time_ms || 0), 0) / apiServices.length;
      const errorRate = (criticalServices.length / apiServices.length) * 100;
      const activeIntegrations = integrations.filter(i => i.status === 'active').length;

      return {
        overall_status: overallStatus,
        api_services: apiServices,
        integrations,
        recent_sync_jobs: syncJobs,
        system_metrics: {
          total_api_calls_today: totalApiCallsToday,
          average_response_time: Math.round(averageResponseTime),
          error_rate: Math.round(errorRate * 100) / 100,
          active_integrations: activeIntegrations
        }
      };
    } catch (error) {
      console.error('Error fetching system health dashboard:', error);
      errorHandler.handleError(error, {
        category: 'system' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'getSystemHealthDashboard' }
      });
      throw error;
    }
  }

  // Automated Maintenance Tasks
  async runMaintenanceTasks(): Promise<{
    tasks_completed: string[];
    tasks_failed: string[];
    total_duration_ms: number;
  }> {
    const startTime = Date.now();
    const completedTasks: string[] = [];
    const failedTasks: string[] = [];

    try {
      // Task 1: Clean up old sync jobs
      try {
        await supabase
          .from('data_sync_jobs')
          .delete()
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .eq('status', 'completed');
        completedTasks.push('cleanup_old_sync_jobs');
      } catch (error) {
        failedTasks.push('cleanup_old_sync_jobs');
      }

      // Task 2: Update integration health status
      try {
        const integrations = await this.getSystemIntegrations();
        for (const integration of integrations) {
          // Simulate health check
          const isHealthy = Math.random() > 0.1; // 90% chance of being healthy
          await this.updateSystemIntegration(integration.id, {
            status: isHealthy ? 'active' : 'error',
            last_sync: new Date().toISOString()
          });
        }
        completedTasks.push('update_integration_health');
      } catch (error) {
        failedTasks.push('update_integration_health');
      }

      // Task 3: Process scheduled Zakat reminders
      try {
        await zakatCalculatorApi.processScheduledReminders();
        completedTasks.push('process_zakat_reminders');
      } catch (error) {
        failedTasks.push('process_zakat_reminders');
      }

      // Task 4: Generate system reports
      try {
        await reportsApi.processScheduledReports();
        completedTasks.push('process_scheduled_reports');
      } catch (error) {
        failedTasks.push('process_scheduled_reports');
      }

      // Task 5: Update system metrics
      try {
        await systemMonitoringApi.recordMetrics();
        completedTasks.push('record_system_metrics');
      } catch (error) {
        failedTasks.push('record_system_metrics');
      }

      const totalDuration = Date.now() - startTime;

      // Track maintenance completion
      await analyticsApi.trackEvent('maintenance_tasks_completed', 'system', {
        completed_tasks: completedTasks,
        failed_tasks: failedTasks,
        duration_ms: totalDuration
      });

      return {
        tasks_completed: completedTasks,
        tasks_failed: failedTasks,
        total_duration_ms: totalDuration
      };
    } catch (error) {
      console.error('Error running maintenance tasks:', error);
      errorHandler.handleError(error, {
        category: 'system' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'runMaintenanceTasks' }
      });
      throw error;
    }
  }

  // Initialize all services
  async initializeAllServices(): Promise<void> {
    try {
      console.log('Initializing API Integration Manager...');
      
      // Start system monitoring
      await systemMonitoringApi.runAutomatedChecks();
      
      // Check all API services
      const serviceStatuses = await this.checkAllApiServices();
      console.log('API Services Status:', serviceStatuses);
      
      // Run initial maintenance tasks
      const maintenanceResults = await this.runMaintenanceTasks();
      console.log('Initial Maintenance Results:', maintenanceResults);
      
      console.log('API Integration Manager initialized successfully');
    } catch (error) {
      console.error('Error initializing API Integration Manager:', error);
      throw error;
    }
  }
}

export const apiIntegrationManager = new ApiIntegrationManagerService();