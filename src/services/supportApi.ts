import { supabase } from '@/integrations/supabase/client';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id?: string;
  subject: string;
  description: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  assigned_to?: string;
  resolution?: string;
  satisfaction_rating?: number;
  tags?: string[];
  attachments?: unknown;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  assigned_agent?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  responses?: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  attachments?: unknown;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category?: string;
  priority?: SupportTicket['priority'];
  tags?: string[];
  attachments?: unknown;
}

export interface CreateResponseData {
  message: string;
  is_internal?: boolean;
  attachments?: unknown;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  assigned_to?: string;
  user_id?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export const supportApi = {
  // Create support ticket
  async createTicket(ticketData: CreateTicketData): Promise<{ data: SupportTicket | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user?.id,
          subject: ticketData.subject,
          description: ticketData.description,
          category: ticketData.category,
          priority: ticketData.priority || 'medium',
          tags: ticketData.tags,
          attachments: ticketData.attachments,
          status: 'open'
        }])
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error creating support ticket:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in createTicket:', error);
      return { data: null, error: 'Failed to create support ticket' };
    }
  },

  // Get support tickets with filters
  async getTickets(
    filters: TicketFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: SupportTicket[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned_agent:profiles!support_tickets_assigned_to_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.search) {
        query = query.or(`subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%,ticket_number.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching support tickets:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getTickets:', error);
      return { data: [], count: 0, error: 'Failed to fetch support tickets' };
    }
  },

  // Get user's tickets
  async getUserTickets(
    userId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: SupportTicket[]; count: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], count: 0, error: 'User not authenticated' };
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('support_tickets')
        .select(`
          *,
          assigned_agent:profiles!support_tickets_assigned_to_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching user tickets:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getUserTickets:', error);
      return { data: [], count: 0, error: 'Failed to fetch user tickets' };
    }
  },

  // Get single ticket with responses
  async getTicket(id: string): Promise<{ data: SupportTicket | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned_agent:profiles!support_tickets_assigned_to_fkey(id, full_name, avatar_url),
          responses:support_responses(
            *,
            user:profiles!support_responses_user_id_fkey(id, full_name, avatar_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching support ticket:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getTicket:', error);
      return { data: null, error: 'Failed to fetch support ticket' };
    }
  },

  // Update ticket
  async updateTicket(
    id: string,
    updates: {
      status?: SupportTicket['status'];
      priority?: SupportTicket['priority'];
      category?: string;
      assigned_to?: string;
      resolution?: string;
      tags?: string[];
    }
  ): Promise<{ data: SupportTicket | null; error?: string }> {
    try {
      const updateData: unknown = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Set resolved_at when status changes to resolved
      if (updates.status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      // Set closed_at when status changes to closed
      if (updates.status === 'closed') {
        updateData.closed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned_agent:profiles!support_tickets_assigned_to_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error updating support ticket:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in updateTicket:', error);
      return { data: null, error: 'Failed to update support ticket' };
    }
  },

  // Add response to ticket
  async addResponse(
    ticketId: string,
    responseData: CreateResponseData
  ): Promise<{ data: SupportResponse | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('support_responses')
        .insert([{
          ticket_id: ticketId,
          user_id: user.id,
          message: responseData.message,
          is_internal: responseData.is_internal || false,
          attachments: responseData.attachments
        }])
        .select(`
          *,
          user:profiles!support_responses_user_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error adding response:', error);
        return { data: null, error: error.message };
      }

      // Update ticket status if it's a customer response
      if (!responseData.is_internal) {
        await supabase
          .from('support_tickets')
          .update({
            status: 'waiting_response',
            updated_at: new Date().toISOString()
          })
          .eq('id', ticketId);
      }

      return { data };
    } catch (error) {
      console.error('Error in addResponse:', error);
      return { data: null, error: 'Failed to add response' };
    }
  },

  // Get ticket responses
  async getTicketResponses(ticketId: string): Promise<{ data: SupportResponse[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('support_responses')
        .select(`
          *,
          user:profiles!support_responses_user_id_fkey(id, full_name, avatar_url)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching ticket responses:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getTicketResponses:', error);
      return { data: [], error: 'Failed to fetch ticket responses' };
    }
  },

  // Assign ticket to agent
  async assignTicket(ticketId: string, agentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          assigned_to: agentId,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) {
        console.error('Error assigning ticket:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in assignTicket:', error);
      return { success: false, error: 'Failed to assign ticket' };
    }
  },

  // Close ticket
  async closeTicket(ticketId: string, resolution?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: 'closed',
          resolution,
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) {
        console.error('Error closing ticket:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in closeTicket:', error);
      return { success: false, error: 'Failed to close ticket' };
    }
  },

  // Rate ticket resolution
  async rateTicket(ticketId: string, rating: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('support_tickets')
        .update({
          satisfaction_rating: rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error rating ticket:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in rateTicket:', error);
      return { success: false, error: 'Failed to rate ticket' };
    }
  },

  // Get support statistics
  async getSupportStats(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{ 
    data: {
      total_tickets: number;
      open_tickets: number;
      resolved_tickets: number;
      average_resolution_time: number;
      satisfaction_rating: number;
      tickets_by_priority: Record<string, number>;
      tickets_by_category: Record<string, number>;
      agent_performance: Array<{
        agent_id: string;
        agent_name: string;
        tickets_handled: number;
        average_rating: number;
      }>;
    } | null; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .rpc('get_support_statistics', {
          date_from: dateFrom,
          date_to: dateTo
        });

      if (error) {
        console.error('Error fetching support stats:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getSupportStats:', error);
      return { data: null, error: 'Failed to fetch support statistics' };
    }
  },

  // Get ticket categories
  async getTicketCategories(): Promise<{ data: Array<{ category: string; count: number }>; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching ticket categories:', error);
        return { data: [], error: error.message };
      }

      // Count categories
      const categoryCount = data?.reduce((acc, item) => {
        const category = item.category;
        if (category) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const categories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      return { data: categories };
    } catch (error) {
      console.error('Error in getTicketCategories:', error);
      return { data: [], error: 'Failed to fetch ticket categories' };
    }
  },

  // Search tickets
  async searchTickets(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: SupportTicket[]; count: number; error?: string }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned_agent:profiles!support_tickets_assigned_to_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .or(`subject.ilike.%${query}%,description.ilike.%${query}%,ticket_number.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error searching tickets:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in searchTickets:', error);
      return { data: [], count: 0, error: 'Failed to search tickets' };
    }
  },

  // Get agent workload
  async getAgentWorkload(agentId?: string): Promise<{ 
    data: Array<{
      agent_id: string;
      agent_name: string;
      open_tickets: number;
      in_progress_tickets: number;
      resolved_today: number;
      average_response_time: number;
    }>; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .rpc('get_agent_workload', { agent_uuid: agentId });

      if (error) {
        console.error('Error fetching agent workload:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getAgentWorkload:', error);
      return { data: [], error: 'Failed to fetch agent workload' };
    }
  }
};

export default supportApi;