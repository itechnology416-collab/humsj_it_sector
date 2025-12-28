import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  type: 'announcement' | 'email' | 'sms' | 'notification' | 'push';
  title: string;
  content: string;
  html_content?: string;
  sender_id: string;
  sender_name?: string;
  recipient_type: 'all' | 'group' | 'individual' | 'role' | 'sector';
  recipient_criteria: unknown; // JSON object defining recipient selection
  recipient_count: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_for?: string;
  sent_at?: string;
  delivery_stats?: MessageDeliveryStats;
  tags: string[];
  attachments?: MessageAttachment[];
  template_id?: string;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MessageDeliveryStats {
  total_recipients: number;
  delivered: number;
  failed: number;
  opened?: number;
  clicked?: number;
  bounced?: number;
  unsubscribed?: number;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mime_type: string;
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  user_id: string;
  user_email?: string;
  user_phone?: string;
  user_name?: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  delivery_method: 'email' | 'sms' | 'push' | 'in_app';
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
  description?: string;
  type: Message['type'];
  subject_template: string;
  content_template: string;
  html_template?: string;
  variables: string[]; // Array of variable names like ['name', 'event_title']
  is_active: boolean;
  usage_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'one_time' | 'recurring' | 'drip';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  recurrence_pattern?: unknown; // JSON for recurring campaigns
  target_audience: unknown; // JSON defining audience criteria
  messages: string[]; // Array of message IDs
  stats: CampaignStats;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total_messages: number;
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  engagement_rate: number;
}

export interface RecipientGroup {
  id: string;
  name: string;
  description?: string;
  criteria: unknown; // JSON object defining selection criteria
  member_count: number;
  is_dynamic: boolean; // Whether membership is automatically updated
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  categories: string[]; // Which types of notifications to receive
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  type: Message['type'];
  title: string;
  content: string;
  html_content?: string;
  recipient_type: Message['recipient_type'];
  recipient_criteria: unknown;
  priority?: Message['priority'];
  scheduled_for?: string;
  tags?: string[];
  attachments?: Omit<MessageAttachment, 'id'>[];
  template_id?: string;
  campaign_id?: string;
}

export interface MessageFilters {
  type?: string;
  status?: string;
  priority?: string;
  sender_id?: string;
  date_from?: string;
  date_to?: string;
  tags?: string[];
  campaign_id?: string;
  search?: string;
}

export interface MessagesListOptions {
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'sent_at' | 'title' | 'recipient_count';
  sort_order?: 'asc' | 'desc';
  filters?: MessageFilters;
}

// Communication API Service
export const communicationApi = {
  // Get messages with filtering and pagination
  async getMessages(options: MessagesListOptions = {}): Promise<{
    messages: Message[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc',
        filters = {}
      } = options;

      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, email),
          recipients:message_recipients(count),
          attachments:message_attachments(*)
        `, { count: 'exact' });

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.sender_id) {
        query = query.eq('sender_id', filters.sender_id);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.campaign_id) {
        query = query.eq('campaign_id', filters.campaign_id);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      // Apply sorting
      const ascending = sort_order === 'asc';
      query = query.order(sort_by, { ascending });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to fetch messages');
      }

      const total = count || 0;
      const total_pages = Math.ceil(total / limit);

      return {
        messages: data || [],
        total,
        page,
        limit,
        total_pages
      };
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  },

  // Get single message by ID
  async getMessage(messageId: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, email),
          recipients:message_recipients(*),
          attachments:message_attachments(*)
        `)
        .eq('id', messageId)
        .single();

      if (error) {
        console.error('Error fetching message:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getMessage:', error);
      return null;
    }
  },

  // Create new message
  async createMessage(messageData: CreateMessageData): Promise<Message | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate recipient count based on criteria
      const recipientCount = await this.calculateRecipientCount(
        messageData.recipient_type,
        messageData.recipient_criteria
      );

      const { attachments, ...messageFields } = messageData;

      // Create the message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          ...messageFields,
          sender_id: user.id,
          recipient_count: recipientCount,
          status: messageData.scheduled_for ? 'scheduled' : 'draft',
          priority: messageData.priority || 'normal',
          tags: messageData.tags || []
        }])
        .select()
        .single();

      if (messageError) {
        console.error('Error creating message:', messageError);
        throw new Error('Failed to create message');
      }

      // Add attachments if provided
      if (attachments && attachments.length > 0) {
        const attachmentItems = attachments.map(attachment => ({
          ...attachment,
          message_id: message.id
        }));

        const { error: attachmentError } = await supabase
          .from('message_attachments')
          .insert(attachmentItems);

        if (attachmentError) {
          console.error('Error creating attachments:', attachmentError);
        }
      }

      return await this.getMessage(message.id);
    } catch (error) {
      console.error('Error in createMessage:', error);
      throw error;
    }
  },

  // Send message immediately
  async sendMessage(messageId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update message status to sending
      const { error: updateError } = await supabase
        .from('messages')
        .update({
          status: 'sending',
          sent_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (updateError) {
        console.error('Error updating message status:', updateError);
        throw new Error('Failed to send message');
      }

      // Get message details
      const message = await this.getMessage(messageId);
      if (!message) throw new Error('Message not found');

      // Create recipient records and send
      await this.processMessageDelivery(message);

      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  // Process message delivery to recipients
  async processMessageDelivery(message: Message): Promise<void> {
    try {
      // Get recipients based on criteria
      const recipients = await this.getMessageRecipients(
        message.recipient_type,
        message.recipient_criteria
      );

      // Create recipient records
      const recipientRecords = recipients.map(recipient => ({
        message_id: message.id,
        user_id: recipient.id,
        user_email: recipient.email,
        user_phone: recipient.phone,
        user_name: recipient.full_name,
        delivery_status: 'pending' as const,
        delivery_method: this.getDeliveryMethod(message.type)
      }));

      const { error: recipientError } = await supabase
        .from('message_recipients')
        .insert(recipientRecords);

      if (recipientError) {
        console.error('Error creating recipient records:', recipientError);
        throw new Error('Failed to create recipient records');
      }

      // Process actual delivery (email, SMS, push notifications)
      await this.deliverMessage(message, recipients);

      // Update message status to sent
      const { error: statusError } = await supabase
        .from('messages')
        .update({ status: 'sent' })
        .eq('id', message.id);

      if (statusError) {
        console.error('Error updating message status:', statusError);
      }
    } catch (error) {
      console.error('Error in processMessageDelivery:', error);
      
      // Update message status to failed
      await supabase
        .from('messages')
        .update({ status: 'failed' })
        .eq('id', message.id);
      
      throw error;
    }
  },

  // Get recipients based on criteria
  async getMessageRecipients(recipientType: string, criteria: unknown): Promise<any[]> {
    try {
      let query = supabase.from('profiles').select('id, email, phone, full_name');

      switch (recipientType) {
        case 'all':
          // No additional filters
          break;
        case 'role':
          if (criteria.roles) {
            query = query.in('role', criteria.roles);
          }
          break;
        case 'sector':
          if (criteria.sectors) {
            query = query.in('sector', criteria.sectors);
          }
          break;
        case 'group':
          if (criteria.group_id) {
            // Join with group members table
            query = query
              .select('id, email, phone, full_name, group_members!inner(*)')
              .eq('group_members.group_id', criteria.group_id);
          }
          break;
        case 'individual':
          if (criteria.user_ids) {
            query = query.in('id', criteria.user_ids);
          }
          break;
      }

      // Apply additional filters
      if (criteria.active_only) {
        query = query.eq('is_active', true);
      }
      if (criteria.verified_only) {
        query = query.eq('email_verified', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipients:', error);
        throw new Error('Failed to fetch recipients');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMessageRecipients:', error);
      throw error;
    }
  },

  // Calculate recipient count
  async calculateRecipientCount(recipientType: string, criteria: unknown): Promise<number> {
    try {
      const recipients = await this.getMessageRecipients(recipientType, criteria);
      return recipients.length;
    } catch (error) {
      console.error('Error calculating recipient count:', error);
      return 0;
    }
  },

  // Get delivery method based on message type
  getDeliveryMethod(messageType: string): 'email' | 'sms' | 'push' | 'in_app' {
    switch (messageType) {
      case 'email':
        return 'email';
      case 'sms':
        return 'sms';
      case 'notification':
      case 'push':
        return 'push';
      default:
        return 'in_app';
    }
  },

  // Deliver message to recipients
  async deliverMessage(message: Message, recipients: unknown[]): Promise<void> {
    try {
      // This would integrate with actual delivery services
      // For now, we'll simulate the delivery process
      
      for (const recipient of recipients) {
        try {
          // Simulate delivery delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Update recipient status to sent
          await supabase
            .from('message_recipients')
            .update({
              delivery_status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('message_id', message.id)
            .eq('user_id', recipient.id);

          // Simulate delivery confirmation (would be webhook in real implementation)
          setTimeout(async () => {
            await supabase
              .from('message_recipients')
              .update({
                delivery_status: 'delivered',
                delivered_at: new Date().toISOString()
              })
              .eq('message_id', message.id)
              .eq('user_id', recipient.id);
          }, 1000);

        } catch (error) {
          console.error(`Error delivering to recipient ${recipient.id}:`, error);
          
          // Update recipient status to failed
          await supabase
            .from('message_recipients')
            .update({
              delivery_status: 'failed',
              error_message: error instanceof Error ? error.message : 'Delivery failed'
            })
            .eq('message_id', message.id)
            .eq('user_id', recipient.id);
        }
      }
    } catch (error) {
      console.error('Error in deliverMessage:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  },

  // Get message templates
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMessageTemplates:', error);
      throw error;
    }
  },

  // Get recipient groups
  async getRecipientGroups(): Promise<RecipientGroup[]> {
    try {
      const { data, error } = await supabase
        .from('recipient_groups')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching recipient groups:', error);
        throw new Error('Failed to fetch recipient groups');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecipientGroups:', error);
      throw error;
    }
  },

  // Get message delivery statistics
  async getMessageStats(messageId: string): Promise<MessageDeliveryStats | null> {
    try {
      const { data, error } = await supabase
        .from('message_recipients')
        .select('delivery_status, opened_at, clicked_at')
        .eq('message_id', messageId);

      if (error) {
        console.error('Error fetching message stats:', error);
        return null;
      }

      const stats: MessageDeliveryStats = {
        total_recipients: data.length,
        delivered: data.filter(r => r.delivery_status === 'delivered').length,
        failed: data.filter(r => r.delivery_status === 'failed').length,
        opened: data.filter(r => r.opened_at).length,
        clicked: data.filter(r => r.clicked_at).length,
        bounced: data.filter(r => r.delivery_status === 'bounced').length,
        unsubscribed: 0 // Would be calculated from unsubscribe records
      };

      return stats;
    } catch (error) {
      console.error('Error in getMessageStats:', error);
      return null;
    }
  },

  // Get user's notification preferences
  async getNotificationPreferences(userId?: string): Promise<NotificationPreference | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getNotificationPreferences:', error);
      return null;
    }
  },

  // Update user's notification preferences
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreference>,
    userId?: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert([{
          user_id: targetUserId,
          ...preferences
        }]);

      if (error) {
        console.error('Error updating notification preferences:', error);
        throw new Error('Failed to update notification preferences');
      }

      return true;
    } catch (error) {
      console.error('Error in updateNotificationPreferences:', error);
      return false;
    }
  }
};

export default communicationApi;