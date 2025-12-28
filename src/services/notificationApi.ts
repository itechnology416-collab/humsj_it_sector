import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analytics } from './analytics';

export interface NotificationTemplate {
  id: string;
  name: string;
  title_template: string;
  body_template: string;
  type: string;
  channels: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

export interface CreateNotificationData {
  user_id?: string;
  user_ids?: string[];
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
  action_url?: string;
  channels?: string[];
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  in_app_notifications: boolean;
  notification_types: {
    [key: string]: boolean;
  };
}

class NotificationApiService {
  // =============================================
  // USER NOTIFICATIONS
  // =============================================

  async getUserNotifications(filters?: {
    unread_only?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<UserNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id);

      if (filters?.unread_only) {
        query = query.eq('is_read', false);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_user_notifications', filters }
      });
      throw error;
    }
  }

  async getUnreadNotificationCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_unread_count' }
      });
      return 0;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      analytics.track('notification_read', {
        notification_id: notificationId
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'mark_notification_read', notification_id: notificationId }
      });
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      analytics.track('all_notifications_read', {
        user_id: user.id
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'mark_all_notifications_read' }
      });
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      analytics.track('notification_deleted', {
        notification_id: notificationId
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'delete_notification', notification_id: notificationId }
      });
      throw error;
    }
  }

  // =============================================
  // SENDING NOTIFICATIONS
  // =============================================

  async sendNotification(notificationData: CreateNotificationData): Promise<UserNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const recipients = notificationData.user_ids || 
                        (notificationData.user_id ? [notificationData.user_id] : []);

      if (recipients.length === 0) {
        throw new Error('No recipients specified');
      }

      const notifications = recipients.map(userId => ({
        user_id: userId,
        title: notificationData.title,
        body: notificationData.body,
        type: notificationData.type,
        data: notificationData.data,
        action_url: notificationData.action_url
      }));

      const { data, error } = await supabase
        .from('user_notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      // Track notification sending
      analytics.track('notifications_sent', {
        count: recipients.length,
        type: notificationData.type,
        channels: notificationData.channels
      });

      // Send via other channels if specified
      if (notificationData.channels) {
        await this.sendViaChannels(notificationData, recipients);
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'send_notification', notification_data: notificationData }
      });
      throw error;
    }
  }

  async sendBulkNotification(
    userIds: string[], 
    title: string, 
    body: string, 
    type: string,
    data?: Record<string, unknown>,
    actionUrl?: string
  ): Promise<void> {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title,
        body,
        type,
        data,
        action_url: actionUrl
      }));

      const { error } = await supabase
        .from('user_notifications')
        .insert(notifications);

      if (error) throw error;

      analytics.track('bulk_notifications_sent', {
        count: userIds.length,
        type
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'send_bulk_notification', user_count: userIds.length, type }
      });
      throw error;
    }
  }

  // =============================================
  // NOTIFICATION TEMPLATES
  // =============================================

  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_notification_templates' }
      });
      throw error;
    }
  }

  async sendTemplatedNotification(
    templateName: string,
    recipients: string[],
    variables: Record<string, string>,
    actionUrl?: string
  ): Promise<void> {
    try {
      // Get template
      const { data: template, error: templateError } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('name', templateName)
        .eq('is_active', true)
        .single();

      if (templateError || !template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      // Replace variables in template
      let title = template.title_template;
      let body = template.body_template;

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        title = title.replace(new RegExp(placeholder, 'g'), value);
        body = body.replace(new RegExp(placeholder, 'g'), value);
      });

      // Send notifications
      await this.sendBulkNotification(
        recipients,
        title,
        body,
        template.type,
        { template_name: templateName, variables },
        actionUrl
      );

      analytics.track('templated_notification_sent', {
        template_name: templateName,
        recipient_count: recipients.length
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'send_templated_notification', template_name: templateName }
      });
      throw error;
    }
  }

  // =============================================
  // NOTIFICATION PREFERENCES
  // =============================================

  async getNotificationPreferences(): Promise<NotificationPreferences | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // This would typically come from a user_preferences table
      // For now, return default preferences
      return {
        user_id: user.id,
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        in_app_notifications: true,
        notification_types: {
          course_enrollment: true,
          event_registration: true,
          course_completion: true,
          payment_received: true,
          system_updates: true,
          marketing: false
        }
      };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_notification_preferences' }
      });
      return null;
    }
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // This would typically update a user_preferences table
      // For now, just track the update
      analytics.track('notification_preferences_updated', {
        user_id: user.id,
        updated_fields: Object.keys(preferences)
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'update_notification_preferences', preferences }
      });
      throw error;
    }
  }

  // =============================================
  // REAL-TIME NOTIFICATIONS
  // =============================================

  subscribeToNotifications(callback: (notification: UserNotification) => void): () => void {
    const { data: { user } } = supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const subscription = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          callback(payload.new as UserNotification);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private async sendViaChannels(
    notificationData: CreateNotificationData,
    recipients: string[]
  ): Promise<void> {
    const channels = notificationData.channels || [];

    for (const channel of channels) {
      switch (channel) {
        case 'email':
          await this.sendEmailNotifications(notificationData, recipients);
          break;
        case 'push':
          await this.sendPushNotifications(notificationData, recipients);
          break;
        case 'sms':
          await this.sendSMSNotifications(notificationData, recipients);
          break;
        default:
          console.warn(`Unknown notification channel: ${channel}`);
      }
    }
  }

  private async sendEmailNotifications(
    notificationData: CreateNotificationData,
    recipients: string[]
  ): Promise<void> {
    // This would integrate with an email service like SendGrid, Mailgun, etc.
    console.log('Sending email notifications:', {
      recipients: recipients.length,
      title: notificationData.title
    });
  }

  private async sendPushNotifications(
    notificationData: CreateNotificationData,
    recipients: string[]
  ): Promise<void> {
    // This would integrate with a push notification service like FCM, APNs, etc.
    console.log('Sending push notifications:', {
      recipients: recipients.length,
      title: notificationData.title
    });
  }

  private async sendSMSNotifications(
    notificationData: CreateNotificationData,
    recipients: string[]
  ): Promise<void> {
    // This would integrate with an SMS service like Twilio, AWS SNS, etc.
    console.log('Sending SMS notifications:', {
      recipients: recipients.length,
      title: notificationData.title
    });
  }
}

export const notificationApi = new NotificationApiService();