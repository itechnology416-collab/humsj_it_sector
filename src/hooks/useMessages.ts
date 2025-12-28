import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { messagesApi, Message, MessageTemplate, MessageLog, CreateMessageData, CreateTemplateData, MessageStats } from '@/services/messagesApi';

export type { Message, MessageLog, MessageTemplate, CreateMessageData, CreateTemplateData };

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAdmin) {
        setMessages([]);
        return;
      }

      const data = await messagesApi.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchTemplates = useCallback(async () => {
    try {
      if (!isAdmin) return;

      const data = await messagesApi.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err as Error);
    }
  }, [isAdmin]);

  const createMessage = async (messageData: CreateMessageData): Promise<Message | null> => {
    try {
      if (!user || !isAdmin) {
        throw new Error('Only admins can create messages');
      }

      const newMessage = await messagesApi.createMessage(messageData, user.id);
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      console.error('Error creating message:', err);
      setError(err as Error);
      return null;
    }
  };

  const updateMessage = async (messageId: string, updates: Partial<CreateMessageData>): Promise<boolean> => {
    try {
      const updatedMessage = await messagesApi.updateMessage(messageId, updates);
      setMessages(prev => prev.map(message => 
        message.id === messageId ? updatedMessage : message
      ));
      return true;
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err as Error);
      return false;
    }
  };

  const deleteMessage = async (messageId: string): Promise<boolean> => {
    try {
      await messagesApi.deleteMessage(messageId);
      setMessages(prev => prev.filter(message => message.id !== messageId));
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err as Error);
      return false;
    }
  };

  const sendMessage = async (messageId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can send messages');
      }

      await messagesApi.sendMessage(messageId);
      
      // Update local state to reflect sent status
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              status: 'sent' as const,
              sent_at: new Date().toISOString()
            } 
          : msg
      ));

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      return false;
    }
  };

  const createTemplate = async (templateData: CreateTemplateData): Promise<MessageTemplate | null> => {
    try {
      if (!user || !isAdmin) {
        throw new Error('Only admins can create templates');
      }

      const newTemplate = await messagesApi.createTemplate(templateData, user.id);
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      console.error('Error creating template:', err);
      setError(err as Error);
      return null;
    }
  };

  const deleteTemplate = async (templateId: string): Promise<boolean> => {
    try {
      await messagesApi.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      setError(err as Error);
      return false;
    }
  };

  const getMessageLogs = async (messageId: string): Promise<MessageLog[]> => {
    try {
      return await messagesApi.getMessageLogs(messageId);
    } catch (err) {
      console.error('Error fetching message logs:', err);
      setError(err as Error);
      return [];
    }
  };

  const getMessageStats = async (messageId: string): Promise<MessageStats | null> => {
    try {
      return await messagesApi.getMessageStats(messageId);
    } catch (err) {
      console.error('Error fetching message stats:', err);
      setError(err as Error);
      return null;
    }
  };

  // Search and filtering
  const searchMessages = async (query: string, filters?: {
    type?: Message['type'];
    status?: Message['status'];
    priority?: Message['priority'];
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Message[]> => {
    try {
      return await messagesApi.searchMessages(query, filters);
    } catch (err) {
      console.error('Error searching messages:', err);
      setError(err as Error);
      return [];
    }
  };

  // Bulk operations
  const bulkDeleteMessages = async (messageIds: string[]): Promise<boolean> => {
    try {
      await messagesApi.bulkDeleteMessages(messageIds);
      setMessages(prev => prev.filter(message => !messageIds.includes(message.id)));
      return true;
    } catch (err) {
      console.error('Error bulk deleting messages:', err);
      setError(err as Error);
      return false;
    }
  };

  const bulkUpdateMessageStatus = async (messageIds: string[], status: Message['status']): Promise<boolean> => {
    try {
      await messagesApi.bulkUpdateMessageStatus(messageIds, status);
      setMessages(prev => prev.map(message => 
        messageIds.includes(message.id) ? { ...message, status } : message
      ));
      return true;
    } catch (err) {
      console.error('Error bulk updating messages:', err);
      setError(err as Error);
      return false;
    }
  };

  // Analytics
  const getMessageAnalytics = async (dateFrom?: string, dateTo?: string) => {
    try {
      return await messagesApi.getMessageAnalytics(dateFrom, dateTo);
    } catch (err) {
      console.error('Error fetching message analytics:', err);
      setError(err as Error);
      return null;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      fetchTemplates();
    }
  }, [isAdmin, fetchMessages, fetchTemplates]);

  return {
    messages,
    templates,
    loading,
    error,
    useMockData: false, // Always use real database now
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
    searchMessages,
    bulkDeleteMessages,
    bulkUpdateMessageStatus,
    getMessageAnalytics,
    refetch: fetchMessages
  };
};