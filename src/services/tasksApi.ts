import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  task_type: 'personal' | 'committee' | 'project' | 'event' | 'administrative';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  assigned_to?: string;
  assigned_by?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage: number;
  project_id?: string;
  event_id?: string;
  committee_id?: string;
  dependencies?: unknown;
  tags?: string[];
  attachments?: unknown;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  assignee?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  assigner?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  comment_type: 'comment' | 'status_update' | 'time_log';
  hours_logged?: number;
  attachments?: unknown;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  task_type: 'personal' | 'committee' | 'project' | 'event' | 'administrative';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  project_id?: string;
  event_id?: string;
  committee_id?: string;
  dependencies?: unknown;
  tags?: string[];
  attachments?: unknown;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: Task['status'];
  completion_percentage?: number;
  actual_hours?: number;
}

export interface TaskFilters {
  task_type?: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
  assigned_by?: string;
  project_id?: string;
  event_id?: string;
  committee_id?: string;
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

class TaskApiService {
  // Task Management
  async getTasks(filters: TaskFilters = {}): Promise<{ tasks: Task[]; total: number }> {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
          assigner:profiles!tasks_assigned_by_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.task_type) query = query.eq('task_type', filters.task_type);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
      if (filters.assigned_by) query = query.eq('assigned_by', filters.assigned_by);
      if (filters.project_id) query = query.eq('project_id', filters.project_id);
      if (filters.event_id) query = query.eq('event_id', filters.event_id);
      if (filters.committee_id) query = query.eq('committee_id', filters.committee_id);
      if (filters.due_date_from) query = query.gte('due_date', filters.due_date_from);
      if (filters.due_date_to) query = query.lte('due_date', filters.due_date_to);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.limit) query = query.limit(filters.limit);
      if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return { tasks: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTaskById(taskId: string): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
          assigner:profiles!tasks_assigned_by_fkey(id, full_name, avatar_url),
          comments:task_comments(
            *,
            user:profiles(id, full_name, avatar_url)
          )
        `)
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          assigned_by: user.user?.id,
          completion_percentage: 0,
          status: 'pending'
        }])
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
          assigner:profiles!tasks_assigned_by_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: UpdateTaskData): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
          assigner:profiles!tasks_assigned_by_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Task Comments
  async addTaskComment(commentData: {
    task_id: string;
    comment: string;
    comment_type?: TaskComment['comment_type'];
    hours_logged?: number;
    attachments?: unknown;
  }): Promise<TaskComment> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('task_comments')
        .insert([{
          ...commentData,
          user_id: user.user?.id,
          comment_type: commentData.comment_type || 'comment'
        }])
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  }

  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching task comments:', error);
      throw error;
    }
  }
}

export const tasksApi = new TaskApiService();