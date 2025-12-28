import { supabase } from '@/integrations/supabase/client';

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  category: string;
  location?: string;
  is_remote: boolean;
  time_commitment?: string;
  skills_required: string[];
  max_volunteers?: number;
  current_volunteers: number;
  start_date?: string;
  end_date?: string;
  application_deadline?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplication {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  motivation?: string;
  experience?: string;
  availability?: string;
  skills: string[];
  references: unknown[];
  emergency_contact?: unknown;
  background_check_status: 'not_required' | 'pending' | 'approved' | 'rejected';
  orientation_completed: boolean;
  orientation_date?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  applied_at: string;
  updated_at: string;
  // Joined data
  opportunity?: VolunteerOpportunity;
  user_profile?: {
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
}

export interface VolunteerHours {
  id: string;
  application_id: string;
  user_id: string;
  opportunity_id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  hours_worked: number;
  description?: string;
  location?: string;
  supervisor_id?: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
}

export interface VolunteerSkill {
  id: string;
  name: string;
  category?: string;
  description?: string;
  is_active: boolean;
}

export interface VolunteerFilters {
  category?: string;
  location?: string;
  is_remote?: boolean;
  status?: string;
  priority?: string;
  skills?: string[];
  search?: string;
  available_only?: boolean;
}

// Get volunteer opportunities with filtering
export const getVolunteerOpportunities = async (
  filters: VolunteerFilters = {},
  page = 1,
  limit = 20
): Promise<{
  opportunities: VolunteerOpportunity[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    let query = supabase
      .from('volunteer_opportunities')
      .select(`
        *,
        contact_person_profile:profiles!volunteer_opportunities_contact_person_fkey(full_name, email),
        created_by_profile:profiles!volunteer_opportunities_created_by_fkey(full_name)
      `, { count: 'exact' });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.is_remote !== undefined) {
      query = query.eq('is_remote', filters.is_remote);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      // Default to active opportunities
      query = query.eq('status', 'active');
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.available_only) {
      query = query.or('max_volunteers.is.null,current_volunteers.lt.max_volunteers');
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills_required', filters.skills);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by priority and creation date
    query = query.order('priority', { ascending: false })
                 .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching volunteer opportunities:', error);
      throw new Error(`Failed to fetch opportunities: ${error.message}`);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      opportunities: data || [],
      total: count || 0,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get volunteer opportunity by ID
export const getVolunteerOpportunityById = async (
  opportunityId: string
): Promise<VolunteerOpportunity | null> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .select(`
        *,
        contact_person_profile:profiles!volunteer_opportunities_contact_person_fkey(full_name, email, phone),
        created_by_profile:profiles!volunteer_opportunities_created_by_fkey(full_name)
      `)
      .eq('id', opportunityId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch opportunity: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Create volunteer opportunity
export const createVolunteerOpportunity = async (
  opportunity: Omit<VolunteerOpportunity, 'id' | 'current_volunteers' | 'created_at' | 'updated_at'>
): Promise<VolunteerOpportunity> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .insert({
        ...opportunity,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create opportunity: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Update volunteer opportunity
export const updateVolunteerOpportunity = async (
  opportunityId: string,
  updates: Partial<VolunteerOpportunity>
): Promise<VolunteerOpportunity> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', opportunityId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update opportunity: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Delete volunteer opportunity
export const deleteVolunteerOpportunity = async (opportunityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('volunteer_opportunities')
      .delete()
      .eq('id', opportunityId);

    if (error) {
      throw new Error(`Failed to delete opportunity: ${error.message}`);
    }
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Apply for volunteer opportunity
export const applyForOpportunity = async (
  opportunityId: string,
  applicationData: {
    motivation?: string;
    experience?: string;
    availability?: string;
    skills: string[];
    references?: unknown[];
    emergency_contact?: unknown;
  }
): Promise<VolunteerApplication> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .insert({
        opportunity_id: opportunityId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...applicationData
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('You have already applied for this opportunity');
      }
      throw new Error(`Failed to submit application: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get user's volunteer applications
export const getUserApplications = async (
  userId?: string,
  status?: string
): Promise<VolunteerApplication[]> => {
  try {
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    let query = supabase
      .from('volunteer_applications')
      .select(`
        *,
        opportunity:volunteer_opportunities(*)
      `)
      .eq('user_id', currentUserId);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('applied_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get applications for an opportunity
export const getOpportunityApplications = async (
  opportunityId: string,
  status?: string
): Promise<VolunteerApplication[]> => {
  try {
    let query = supabase
      .from('volunteer_applications')
      .select(`
        *,
        user_profile:profiles!volunteer_applications_user_id_fkey(full_name, email, phone, avatar_url)
      `)
      .eq('opportunity_id', opportunityId);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('applied_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string,
  status: 'approved' | 'rejected' | 'withdrawn',
  notes?: string
): Promise<VolunteerApplication> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .update({
        status,
        notes,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Log volunteer hours
export const logVolunteerHours = async (
  hoursData: {
    application_id: string;
    opportunity_id: string;
    date: string;
    start_time?: string;
    end_time?: string;
    hours_worked: number;
    description?: string;
    location?: string;
  }
): Promise<VolunteerHours> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_hours')
      .insert({
        ...hoursData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to log hours: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get volunteer hours for user
export const getUserVolunteerHours = async (
  userId?: string,
  opportunityId?: string
): Promise<VolunteerHours[]> => {
  try {
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    let query = supabase
      .from('volunteer_hours')
      .select(`
        *,
        opportunity:volunteer_opportunities(title),
        supervisor:profiles!volunteer_hours_supervisor_id_fkey(full_name)
      `)
      .eq('user_id', currentUserId);

    if (opportunityId) {
      query = query.eq('opportunity_id', opportunityId);
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch volunteer hours: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Verify volunteer hours
export const verifyVolunteerHours = async (
  hoursId: string,
  verified: boolean,
  notes?: string
): Promise<VolunteerHours> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_hours')
      .update({
        verified,
        verified_by: (await supabase.auth.getUser()).data.user?.id,
        verified_at: verified ? new Date().toISOString() : null,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', hoursId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to verify hours: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get volunteer categories
export const getVolunteerCategories = async (): Promise<VolunteerCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get volunteer skills
export const getVolunteerSkills = async (): Promise<VolunteerSkill[]> => {
  try {
    const { data, error } = await supabase
      .from('volunteer_skills')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get volunteer statistics
export const getVolunteerStatistics = async (userId?: string): Promise<{
  totalHours: number;
  verifiedHours: number;
  totalOpportunities: number;
  activeApplications: number;
  completedOpportunities: number;
  averageRating?: number;
}> => {
  try {
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;

    // Get total and verified hours
    const { data: hoursData } = await supabase
      .from('volunteer_hours')
      .select('hours_worked, verified')
      .eq('user_id', currentUserId);

    const totalHours = hoursData?.reduce((sum, record) => sum + record.hours_worked, 0) || 0;
    const verifiedHours = hoursData?.filter(record => record.verified)
                                   .reduce((sum, record) => sum + record.hours_worked, 0) || 0;

    // Get application statistics
    const { data: applicationsData } = await supabase
      .from('volunteer_applications')
      .select('status')
      .eq('user_id', currentUserId);

    const totalOpportunities = applicationsData?.length || 0;
    const activeApplications = applicationsData?.filter(app => 
      ['pending', 'approved'].includes(app.status)
    ).length || 0;
    const completedOpportunities = applicationsData?.filter(app => 
      app.status === 'approved'
    ).length || 0;

    return {
      totalHours,
      verifiedHours,
      totalOpportunities,
      activeApplications,
      completedOpportunities
    };
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};

// Get volunteer dashboard statistics (admin)
export const getVolunteerDashboardStats = async (): Promise<{
  totalOpportunities: number;
  activeOpportunities: number;
  totalApplications: number;
  pendingApplications: number;
  totalVolunteers: number;
  totalHoursLogged: number;
  opportunitiesByCategory: Record<string, number>;
  applicationsByStatus: Record<string, number>;
}> => {
  try {
    // Get opportunity statistics
    const { count: totalOpportunities } = await supabase
      .from('volunteer_opportunities')
      .select('*', { count: 'exact', head: true });

    const { count: activeOpportunities } = await supabase
      .from('volunteer_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get application statistics
    const { count: totalApplications } = await supabase
      .from('volunteer_applications')
      .select('*', { count: 'exact', head: true });

    const { count: pendingApplications } = await supabase
      .from('volunteer_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get unique volunteers count
    const { data: volunteersData } = await supabase
      .from('volunteer_applications')
      .select('user_id')
      .eq('status', 'approved');

    const totalVolunteers = new Set(volunteersData?.map(v => v.user_id)).size;

    // Get total hours logged
    const { data: hoursData } = await supabase
      .from('volunteer_hours')
      .select('hours_worked')
      .eq('verified', true);

    const totalHoursLogged = hoursData?.reduce((sum, record) => sum + record.hours_worked, 0) || 0;

    // Get opportunities by category
    const { data: categoryData } = await supabase
      .from('volunteer_opportunities')
      .select('category')
      .eq('status', 'active');

    const opportunitiesByCategory: Record<string, number> = {};
    categoryData?.forEach(opp => {
      opportunitiesByCategory[opp.category] = (opportunitiesByCategory[opp.category] || 0) + 1;
    });

    // Get applications by status
    const { data: statusData } = await supabase
      .from('volunteer_applications')
      .select('status');

    const applicationsByStatus: Record<string, number> = {};
    statusData?.forEach(app => {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    });

    return {
      totalOpportunities: totalOpportunities || 0,
      activeOpportunities: activeOpportunities || 0,
      totalApplications: totalApplications || 0,
      pendingApplications: pendingApplications || 0,
      totalVolunteers,
      totalHoursLogged,
      opportunitiesByCategory,
      applicationsByStatus
    };
  } catch (error) {
    console.error('Volunteer API error:', error);
    throw error;
  }
};