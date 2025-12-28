import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface Message {
  id: string;
  type: 'announcement' | 'newsletter' | 'reminder' | 'urgent' | 'general';
  title: string;
  content: string;
  recipients: 'all' | 'members' | 'admins' | 'specific' | 'college';
  recipient_filter?: Json;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_for?: string;
  sent_at?: string;
  delivery_count: number;
  open_count: number;
  click_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MessageLog {
  id: string;
  message_id: string;
  recipient_email: string;
  recipient_user_id?: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  error_message?: string;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: Message['type'];
  subject_template: string;
  content_template: string;
  variables?: Json;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  type: Message['type'];
  title: string;
  content: string;
  recipients: Message['recipients'];
  recipient_filter?: Json;
  priority?: Message['priority'];
  scheduled_for?: string;
}

export interface CreateTemplateData {
  name: string;
  type: MessageTemplate['type'];
  subject_template: string;
  content_template: string;
  variables?: Json;
}

export interface MessageStats {
  total: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  announcement_notifications: boolean;
  reminder_notifications: boolean;
  newsletter_notifications: boolean;
  urgent_notifications: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

class MessagesApiService {
  // =============================================
  // MESSAGE MANAGEMENT
  // =============================================

  async getMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
      throw error;
    }
  }

  async getMessageById(messageId: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error fetching message:', error);
      toast.error('Failed to fetch message');
      throw error;
    }
  }

  async createMessage(messageData: CreateMessageData, userId: string): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          created_by: userId,
          status: messageData.scheduled_for ? 'scheduled' : 'draft',
          priority: messageData.priority || 'normal',
          delivery_count: 0,
          open_count: 0,
          click_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(messageData.scheduled_for ? 'Message scheduled successfully!' : 'Message created successfully!');
      return data as Message;
    } catch (error) {
      console.error('Error creating message:', error);
      toast.error('Failed to create message');
      throw error;
    }
  }

  async updateMessage(messageId: string, updates: Partial<CreateMessageData>): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Message updated successfully!');
      return data as Message;
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast.success('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
      throw error;
    }
  }

  // =============================================
  // MESSAGE SENDING & DELIVERY
  // =============================================

  async sendMessage(messageId: string): Promise<void> {
    try {
      // Get message details
      const message = await this.getMessageById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Get recipient list based on message recipients setting
      let recipientEmails: string[] = [];
      
      if (message.recipients === 'all') {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email')
          .not('email', 'is', null);
        recipientEmails = profiles?.map(p => p.email).filter(Boolean) || [];
      } else if (message.recipients === 'members') {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email')
          .not('email', 'is', null);
        recipientEmails = profiles?.map(p => p.email).filter(Boolean) || [];
      } else if (message.recipients === 'admins') {
        const { data: adminProfiles } = await supabase
          .from('profiles')
          .select('email, user_roles!inner(role)')
          .in('user_roles.role', ['super_admin', 'it_head', 'sys_admin'])
          .not('email', 'is', null);
        recipientEmails = adminProfiles?.map(p => p.email).filter(Boolean) || [];
      } else if (message.recipients === 'college' && message.recipient_filter) {
        const filter = message.recipient_filter as Record<string, unknown>;
        if (filter.college) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('email')
            .eq('college', filter.college as string)
            .not('email', 'is', null);
          recipientEmails = profiles?.map(p => p.email).filter(Boolean) || [];
        }
      }

      // Create message logs for tracking
      const messageLogs = recipientEmails.map(email => ({
        message_id: messageId,
        recipient_email: email,
        status: 'pending' as const
      }));

      if (messageLogs.length > 0) {
        const { error: logError } = await supabase
          .from('message_logs')
          .insert(messageLogs);

        if (logError) throw logError;
      }

      // Update message status
      const { error: updateError } = await supabase
        .from('messages')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString(),
          delivery_count: recipientEmails.length
        })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, we'll simulate the sending process
      console.log(`Sending message "${message.title}" to ${recipientEmails.length} recipients`);

      // Simulate delivery status updates
      setTimeout(async () => {
        await this.updateMessageLogsStatus(messageId, 'sent');
      }, 1000);

      setTimeout(async () => {
        await this.updateMessageLogsStatus(messageId, 'delivered');
      }, 3000);

      toast.success(`Message sent to ${recipientEmails.length} recipients!`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }

  private async updateMessageLogsStatus(messageId: string, status: MessageLog['status']): Promise<void> {
    try {
      const updateData: Record<string, unknown> = { status };
      
      // Add timestamp field based on status
      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      } else if (status === 'opened') {
        updateData.opened_at = new Date().toISOString();
      } else if (status === 'clicked') {
        updateData.clicked_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('message_logs')
        .update(updateData)
        .eq('message_id', messageId)
        .eq('status', status === 'sent' ? 'pending' : 'sent');

      if (error) throw error;
    } catch (error) {
      console.error(`Error updating message logs to ${status}:`, error);
    }
  }

  // =============================================
  // MESSAGE TEMPLATES
  // =============================================

  async getTemplates(): Promise<MessageTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return (data || []) as MessageTemplate[];
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
      throw error;
    }
  }

  async createTemplate(templateData: CreateTemplateData, userId: string): Promise<MessageTemplate> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .insert({
          ...templateData,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Template created successfully!');
      return data as MessageTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
      throw error;
    }
  }

  async updateTemplate(templateId: string, updates: Partial<CreateTemplateData>): Promise<MessageTemplate> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .update(updates)
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Template updated successfully!');
      return data as MessageTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      throw error;
    }
  }

  async deleteTemplate(templateId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast.success('Template deleted successfully!');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      throw error;
    }
  }

  // =============================================
  // MESSAGE LOGS & ANALYTICS
  // =============================================

  async getMessageLogs(messageId: string): Promise<MessageLog[]> {
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching message logs:', error);
      toast.error('Failed to fetch message logs');
      throw error;
    }
  }

  async getMessageStats(messageId: string): Promise<MessageStats> {
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .select('status')
        .eq('message_id', messageId);

      if (error) throw error;

      const logs = data || [];
      const stats: MessageStats = {
        total: logs.length,
        sent: logs.filter(l => ['sent', 'delivered', 'opened', 'clicked'].includes(l.status)).length,
        delivered: logs.filter(l => ['delivered', 'opened', 'clicked'].includes(l.status)).length,
        opened: logs.filter(l => ['opened', 'clicked'].includes(l.status)).length,
        clicked: logs.filter(l => l.status === 'clicked').length,
        failed: logs.filter(l => ['failed', 'bounced'].includes(l.status)).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }

  async markMessageOpened(messageId: string, recipientEmail: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('message_logs')
        .update({ 
          status: 'opened',
          opened_at: new Date().toISOString()
        })
        .eq('message_id', messageId)
        .eq('recipient_email', recipientEmail)
        .eq('status', 'delivered');

      if (error) throw error;

      // Update message open count manually
      const { data: currentMessage } = await supabase
        .from('messages')
        .select('open_count')
        .eq('id', messageId)
        .single();

      if (currentMessage) {
        await supabase
          .from('messages')
          .update({ open_count: (currentMessage.open_count || 0) + 1 })
          .eq('id', messageId);
      }
    } catch (error) {
      console.error('Error marking message as opened:', error);
    }
  }

  async markMessageClicked(messageId: string, recipientEmail: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('message_logs')
        .update({ 
          status: 'clicked',
          clicked_at: new Date().toISOString()
        })
        .eq('message_id', messageId)
        .eq('recipient_email', recipientEmail)
        .in('status', ['delivered', 'opened']);

      if (error) throw error;

      // Update message click count manually
      const { data: currentMessage } = await supabase
        .from('messages')
        .select('click_count')
        .eq('id', messageId)
        .single();

      if (currentMessage) {
        await supabase
          .from('messages')
          .update({ click_count: (currentMessage.click_count || 0) + 1 })
          .eq('id', messageId);
      }
    } catch (error) {
      console.error('Error marking message as clicked:', error);
    }
  }

  // =============================================
  // NOTIFICATION PREFERENCES
  // =============================================

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<NotificationPreferences> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Notification preferences updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
      throw error;
    }
  }

  // =============================================
  // BULK OPERATIONS
  // =============================================

  async bulkDeleteMessages(messageIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .in('id', messageIds);

      if (error) throw error;

      toast.success(`${messageIds.length} messages deleted successfully!`);
    } catch (error) {
      console.error('Error bulk deleting messages:', error);
      toast.error('Failed to delete messages');
      throw error;
    }
  }

  async bulkUpdateMessageStatus(messageIds: string[], status: Message['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status })
        .in('id', messageIds);

      if (error) throw error;

      toast.success(`${messageIds.length} messages updated successfully!`);
    } catch (error) {
      console.error('Error bulk updating messages:', error);
      toast.error('Failed to update messages');
      throw error;
    }
  }

  // =============================================
  // SEARCH & FILTERING
  // =============================================

  async searchMessages(query: string, filters?: {
    type?: Message['type'];
    status?: Message['status'];
    priority?: Message['priority'];
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Message[]> {
    try {
      let queryBuilder = supabase
        .from('messages')
        .select('*');

      // Text search
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
      }

      // Apply filters
      if (filters?.type) {
        queryBuilder = queryBuilder.eq('type', filters.type);
      }
      if (filters?.status) {
        queryBuilder = queryBuilder.eq('status', filters.status);
      }
      if (filters?.priority) {
        queryBuilder = queryBuilder.eq('priority', filters.priority);
      }
      if (filters?.dateFrom) {
        queryBuilder = queryBuilder.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        queryBuilder = queryBuilder.lte('created_at', filters.dateTo);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Message[];
    } catch (error) {
      console.error('Error searching messages:', error);
      toast.error('Failed to search messages');
      throw error;
    }
  }

  // =============================================
  // ANALYTICS & REPORTING
  // =============================================

  async getMessageAnalytics(dateFrom?: string, dateTo?: string) {
    try {
      let queryBuilder = supabase
        .from('messages')
        .select('type, status, priority, created_at, delivery_count, open_count, click_count');

      if (dateFrom) {
        queryBuilder = queryBuilder.gte('created_at', dateFrom);
      }
      if (dateTo) {
        queryBuilder = queryBuilder.lte('created_at', dateTo);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      const analytics = {
        totalMessages: data?.length || 0,
        messagesByType: {} as Record<string, number>,
        messagesByStatus: {} as Record<string, number>,
        messagesByPriority: {} as Record<string, number>,
        totalDeliveries: 0,
        totalOpens: 0,
        totalClicks: 0,
        averageOpenRate: 0,
        averageClickRate: 0
      };

      data?.forEach(message => {
        // Count by type
        analytics.messagesByType[message.type] = (analytics.messagesByType[message.type] || 0) + 1;
        
        // Count by status
        analytics.messagesByStatus[message.status] = (analytics.messagesByStatus[message.status] || 0) + 1;
        
        // Count by priority
        analytics.messagesByPriority[message.priority] = (analytics.messagesByPriority[message.priority] || 0) + 1;
        
        // Sum totals
        analytics.totalDeliveries += message.delivery_count || 0;
        analytics.totalOpens += message.open_count || 0;
        analytics.totalClicks += message.click_count || 0;
      });

      // Calculate rates
      if (analytics.totalDeliveries > 0) {
        analytics.averageOpenRate = (analytics.totalOpens / analytics.totalDeliveries) * 100;
        analytics.averageClickRate = (analytics.totalClicks / analytics.totalDeliveries) * 100;
      }

      return analytics;
    } catch (error) {
      console.error('Error fetching message analytics:', error);
      throw error;
    }
  }
}

export const messagesApi = new MessagesApiService();