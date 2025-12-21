import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Message {
  id: string;
  type: 'announcement' | 'newsletter' | 'reminder' | 'urgent' | 'general';
  title: string;
  content: string;
  recipients: 'all' | 'members' | 'admins' | 'specific' | 'college';
  recipient_filter?: Record<string, any>;
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
  variables?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  type: Message['type'];
  title: string;
  content: string;
  recipients: Message['recipients'];
  recipient_filter?: Record<string, any>;
  priority?: Message['priority'];
  scheduled_for?: string;
}

export interface CreateTemplateData {
  name: string;
  type: MessageTemplate['type'];
  subject_template: string;
  content_template: string;
  variables?: Record<string, any>;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAdmin) {
        setMessages([]);
        return;
      }

      const { data, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      if (!isAdmin) return;

      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const createMessage = async (messageData: CreateMessageData): Promise<Message | null> => {
    try {
      if (!user || !isAdmin) {
        throw new Error('Only admins can create messages');
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          ...messageData,
          created_by: user.id,
          status: messageData.scheduled_for ? 'scheduled' : 'draft',
          priority: messageData.priority || 'normal',
          delivery_count: 0,
          open_count: 0,
          click_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const newMessage: Message = data;
      setMessages(prev => [newMessage, ...prev]);
      
      toast.success(messageData.scheduled_for ? 'Message scheduled successfully!' : 'Message created successfully!');
      return newMessage;
    } catch (err) {
      console.error('Error creating message:', err);
      toast.error('Failed to create message');
      return null;
    }
  };

  const updateMessage = async (messageId: string, updates: Partial<CreateMessageData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(message => 
        message.id === messageId ? { ...message, ...updates } : message
      ));

      toast.success('Message updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating message:', err);
      toast.error('Failed to update message');
      return false;
    }
  };

  const deleteMessage = async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(message => message.id !== messageId));
      toast.success('Message deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Failed to delete message');
      return false;
    }
  };

  const sendMessage = async (messageId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can send messages');
      }

      // Get message details
      const message = messages.find(m => m.id === messageId);
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
        recipientEmails = profiles?.map(p => p.email) || [];
      } else if (message.recipients === 'members') {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email')
          .not('email', 'is', null);
        recipientEmails = profiles?.map(p => p.email) || [];
      } else if (message.recipients === 'admins') {
        const { data: adminProfiles } = await supabase
          .from('profiles')
          .select('email, user_roles!inner(role)')
          .in('user_roles.role', ['super_admin', 'it_head', 'sys_admin'])
          .not('email', 'is', null);
        recipientEmails = adminProfiles?.map(p => p.email) || [];
      } else if (message.recipients === 'college' && message.recipient_filter?.college) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email')
          .eq('college', message.recipient_filter.college)
          .not('email', 'is', null);
        recipientEmails = profiles?.map(p => p.email) || [];
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

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              status: 'sent' as const,
              sent_at: new Date().toISOString(),
              delivery_count: recipientEmails.length
            } 
          : msg
      ));

      // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, we'll just simulate the sending process
      console.log(`Sending message "${message.title}" to ${recipientEmails.length} recipients`);

      toast.success(`Message sent to ${recipientEmails.length} recipients!`);
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return false;
    }
  };

  const createTemplate = async (templateData: CreateTemplateData): Promise<MessageTemplate | null> => {
    try {
      if (!user || !isAdmin) {
        throw new Error('Only admins can create templates');
      }

      const { data, error } = await supabase
        .from('message_templates')
        .insert([{
          ...templateData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newTemplate: MessageTemplate = data;
      setTemplates(prev => [...prev, newTemplate]);
      
      toast.success('Template created successfully!');
      return newTemplate;
    } catch (err) {
      console.error('Error creating template:', err);
      toast.error('Failed to create template');
      return null;
    }
  };

  const deleteTemplate = async (templateId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== templateId));
      toast.success('Template deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Failed to delete template');
      return false;
    }
  };

  const getMessageLogs = async (messageId: string): Promise<MessageLog[]> => {
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching message logs:', err);
      return [];
    }
  };

  const getMessageStats = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .select('status')
        .eq('message_id', messageId);

      if (error) throw error;

      const logs = data || [];
      const stats = {
        total: logs.length,
        sent: logs.filter(l => ['sent', 'delivered', 'opened', 'clicked'].includes(l.status)).length,
        delivered: logs.filter(l => ['delivered', 'opened', 'clicked'].includes(l.status)).length,
        opened: logs.filter(l => ['opened', 'clicked'].includes(l.status)).length,
        clicked: logs.filter(l => l.status === 'clicked').length,
        failed: logs.filter(l => ['failed', 'bounced'].includes(l.status)).length
      };

      return stats;
    } catch (err) {
      console.error('Error fetching message stats:', err);
      return null;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      fetchTemplates();
    }
  }, [user, isAdmin]);

  return {
    messages,
    templates,
    loading,
    error,
    fetchMessages,
    fetchTemplates,
    createMessage,
    updateMessage,
    deleteMessage,
    sendMessage,
    createTemplate,
    deleteTemplate,
    getMessageLogs,
    getMessageStats,
    refetch: fetchMessages
  };
};