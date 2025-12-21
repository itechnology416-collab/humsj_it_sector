import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface VolunteerTask {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  required_skills: string[];
  estimated_hours: number;
  max_volunteers: number;
  location: string;
  deadline?: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
  assigned_to: string[];
  tags: string[];
  notes?: string;
}

export interface VolunteerApplication {
  id: string;
  created_at: string;
  updated_at: string;
  task_id: string;
  volunteer_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  application_message?: string;
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  completed_at?: string;
  hours_logged: number;
  task?: VolunteerTask;
  volunteer_name?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  category: string;
  priority?: VolunteerTask['priority'];
  required_skills?: string[];
  estimated_hours?: number;
  max_volunteers?: number;
  location: string;
  deadline?: string;
  start_date?: string;
  end_date?: string;
  tags?: string[];
  notes?: string;
}

export interface CreateApplicationData {
  task_id: string;
  application_message?: string;
}

// Mock data for development
const mockTasks: VolunteerTask[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    title: 'Event Photography',
    description: 'Capture photos during Friday prayer and community events',
    category: 'Media',
    priority: 'medium',
    status: 'open',
    required_skills: ['Photography', 'Photo Editing'],
    estimated_hours: 4,
    max_volunteers: 2,
    location: 'Main Prayer Hall',
    deadline: '2024-12-25T00:00:00Z',
    assigned_to: [],
    tags: ['photography', 'events', 'media'],
    notes: 'Bring your own camera equipment'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    title: 'Website Content Translation',
    description: 'Translate website content to Amharic and Afaan Oromo',
    category: 'Translation',
    priority: 'high',
    status: 'open',
    required_skills: ['Amharic', 'Afaan Oromo', 'Translation'],
    estimated_hours: 8,
    max_volunteers: 3,
    location: 'Remote',
    assigned_to: [],
    tags: ['translation', 'website', 'languages'],
    notes: 'Native speakers preferred'
  }
];

const mockApplications: VolunteerApplication[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    task_id: '1',
    volunteer_id: 'user1',
    status: 'pending',
    application_message: 'I have 3 years of photography experience and would love to help.',
    hours_logged: 0,
    volunteer_name: 'Ahmed Hassan'
  }
];

export const useVolunteers = () => {
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('volunteer_tasks')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchTasks = useCallback(async (filters?: {
    category?: string;
    status?: string;
    priority?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('Volunteer tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredTasks = [...mockTasks];
        
        if (filters?.category && filters.category !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.category === filters.category);
        }
        if (filters?.status && filters.status !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }
        if (filters?.priority && filters.priority !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }
        
        setTasks(filteredTasks);
        setApplications(mockApplications);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('volunteer_tasks')
        .select('*');

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      query = query.order('created_at', { ascending: false });

      const { data: tasksData, error: tasksError } = await query;

      if (tasksError) throw tasksError;

      setTasks(tasksData || []);

      // Fetch applications if admin or user has applications
      if (isAdmin || user) {
        let appQuery = supabase
          .from('volunteer_applications')
          .select(`
            *,
            volunteer_tasks(*),
            profiles!volunteer_applications_volunteer_id_fkey(full_name)
          `);

        if (!isAdmin && user) {
          // Regular users only see their own applications
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (profile) {
            appQuery = appQuery.eq('volunteer_id', profile.id);
          }
        }

        const { data: appsData, error: appsError } = await appQuery;

        if (!appsError && appsData) {
          const formattedApps: VolunteerApplication[] = appsData.map(app => ({
            ...app,
            task: app.volunteer_tasks,
            volunteer_name: app.profiles?.full_name || 'Unknown'
          }));
          setApplications(formattedApps);
        }
      }

    } catch (err: any) {
      console.error('Error fetching volunteer data:', err);
      setError(err.message || 'Failed to fetch volunteer data');
      
      // Fallback to mock data
      setUseMockData(true);
      setTasks(mockTasks);
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  const createTask = useCallback(async (taskData: CreateTaskData): Promise<VolunteerTask | null> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can create volunteer tasks');
      }

      if (useMockData) {
        const newTask: VolunteerTask = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...taskData,
          priority: taskData.priority || 'medium',
          status: 'open',
          required_skills: taskData.required_skills || [],
          estimated_hours: taskData.estimated_hours || 1,
          max_volunteers: taskData.max_volunteers || 1,
          assigned_to: [],
          tags: taskData.tags || [],
          created_by: user?.id
        };
        
        setTasks(prev => [newTask, ...prev]);
        toast.success('Volunteer task created successfully! (Mock data)');
        return newTask;
      }

      const { data, error } = await supabase
        .from('volunteer_tasks')
        .insert([{
          ...taskData,
          created_by: user?.id,
          priority: taskData.priority || 'medium',
          status: 'open',
          required_skills: taskData.required_skills || [],
          estimated_hours: taskData.estimated_hours || 1,
          max_volunteers: taskData.max_volunteers || 1,
          assigned_to: [],
          tags: taskData.tags || []
        }])
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      toast.success('Volunteer task created successfully!');
      return data;

    } catch (err: any) {
      console.error('Error creating volunteer task:', err);
      toast.error(err.message || 'Failed to create volunteer task');
      return null;
    }
  }, [isAdmin, user, useMockData]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<CreateTaskData>): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update volunteer tasks');
      }

      if (useMockData) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
        ));
        toast.success('Task updated successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('volunteer_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
      ));

      toast.success('Task updated successfully!');
      return true;

    } catch (err: any) {
      console.error('Error updating task:', err);
      toast.error(err.message || 'Failed to update task');
      return false;
    }
  }, [isAdmin, useMockData]);

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete volunteer tasks');
      }

      if (useMockData) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('volunteer_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
      return true;

    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast.error(err.message || 'Failed to delete task');
      return false;
    }
  }, [isAdmin, useMockData]);

  const applyForTask = useCallback(async (applicationData: CreateApplicationData): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to apply for tasks');
      }

      // Get user's profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      if (useMockData) {
        const newApplication: VolunteerApplication = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          task_id: applicationData.task_id,
          volunteer_id: profile.id,
          status: 'pending',
          application_message: applicationData.application_message,
          hours_logged: 0,
          volunteer_name: 'Current User'
        };
        
        setApplications(prev => [newApplication, ...prev]);
        toast.success('Application submitted successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('volunteer_applications')
        .insert([{
          task_id: applicationData.task_id,
          volunteer_id: profile.id,
          application_message: applicationData.application_message,
          status: 'pending'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already applied for this task');
        }
        throw error;
      }

      toast.success('Application submitted successfully!');
      await fetchTasks(); // Refresh data
      return true;

    } catch (err: any) {
      console.error('Error applying for task:', err);
      toast.error(err.message || 'Failed to submit application');
      return false;
    }
  }, [user, useMockData, fetchTasks]);

  const approveApplication = useCallback(async (applicationId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can approve applications');
      }

      if (useMockData) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'approved', approved_at: new Date().toISOString(), approved_by: user?.id }
            : app
        ));
        toast.success('Application approved! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('volunteer_applications')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved', approved_at: new Date().toISOString(), approved_by: user?.id }
          : app
      ));

      toast.success('Application approved!');
      return true;

    } catch (err: any) {
      console.error('Error approving application:', err);
      toast.error(err.message || 'Failed to approve application');
      return false;
    }
  }, [isAdmin, user, useMockData]);

  const rejectApplication = useCallback(async (applicationId: string, reason?: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can reject applications');
      }

      if (useMockData) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected', admin_notes: reason }
            : app
        ));
        toast.success('Application rejected (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('volunteer_applications')
        .update({
          status: 'rejected',
          admin_notes: reason
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected', admin_notes: reason }
          : app
      ));

      toast.success('Application rejected');
      return true;

    } catch (err: any) {
      console.error('Error rejecting application:', err);
      toast.error(err.message || 'Failed to reject application');
      return false;
    }
  }, [isAdmin, useMockData]);

  const logHours = useCallback(async (applicationId: string, hours: number): Promise<boolean> => {
    try {
      if (useMockData) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, hours_logged: app.hours_logged + hours }
            : app
        ));
        toast.success('Hours logged successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('volunteer_applications')
        .update({
          hours_logged: supabase.sql`hours_logged + ${hours}`
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, hours_logged: app.hours_logged + hours }
          : app
      ));

      toast.success('Hours logged successfully!');
      return true;

    } catch (err: any) {
      console.error('Error logging hours:', err);
      toast.error(err.message || 'Failed to log hours');
      return false;
    }
  }, [useMockData]);

  const getTaskStats = useCallback(() => {
    return {
      totalTasks: tasks.length,
      openTasks: tasks.filter(t => t.status === 'open').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      approvedApplications: applications.filter(a => a.status === 'approved').length
    };
  }, [tasks, applications]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // Data
    tasks,
    applications,
    stats: getTaskStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    applyForTask,
    approveApplication,
    rejectApplication,
    logHours,
    
    // Utilities
    refetch: fetchTasks,
    clearError: () => setError(null)
  };
};

export default useVolunteers;