import { supabase } from '@/integrations/supabase/client';

export interface Member {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  college?: string;
  department?: string;
  year?: number;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_activity_at?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
}

export interface MemberInvitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invited_by: string;
  invitation_token: string;
  expires_at: string;
  created_at: string;
}

export interface MemberRole {
  id: string;
  user_id: string;
  role_name: string;
  department?: string;
  position?: string;
  permissions: Record<string, unknown>;
  is_active: boolean;
  assigned_at: string;
  expires_at?: string;
}

export interface MemberStatistics {
  user_id: string;
  total_events_attended: number;
  total_courses_completed: number;
  total_volunteer_hours: number;
  total_contributions: number;
  join_date: string;
  last_activity_at?: string;
}

export interface MemberFilters {
  status?: string;
  role?: string;
  college?: string;
  department?: string;
  year?: number;
  search?: string;
  verified_only?: boolean;
}

// Get all members with filtering and pagination
export const getMembers = async (
  filters: MemberFilters = {},
  page = 1,
  limit = 20
): Promise<{
  members: Member[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        member_statistics(*)
      `, { count: 'exact' });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.role) {
      query = query.eq('role', filters.role);
    }
    if (filters.college) {
      query = query.eq('college', filters.college);
    }
    if (filters.department) {
      query = query.eq('department', filters.department);
    }
    if (filters.year) {
      query = query.eq('year', filters.year);
    }
    if (filters.verified_only) {
      query = query.eq('email_verified', true);
    }
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by last activity
    query = query.order('updated_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching members:', error);
      throw new Error(`Failed to fetch members: ${error.message}`);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      members: data || [],
      total: count || 0,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Get member by ID
export const getMemberById = async (userId: string): Promise<Member | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        member_statistics(*),
        member_roles(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Member not found
      }
      throw new Error(`Failed to fetch member: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Update member profile
export const updateMember = async (
  userId: string,
  updates: Partial<Member>
): Promise<Member> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update member: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Invite new member
export const inviteMember = async (
  email: string,
  role: string = 'member'
): Promise<MemberInvitation> => {
  try {
    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const { data, error } = await supabase
      .from('member_invitations')
      .insert({
        email,
        role,
        invitation_token: invitationToken,
        expires_at: expiresAt.toISOString(),
        invited_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to invite member: ${error.message}`);
    }

    // TODO: Send invitation email
    // await sendInvitationEmail(email, invitationToken, role);

    return data;
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Get member invitations
export const getMemberInvitations = async (
  status?: string
): Promise<MemberInvitation[]> => {
  try {
    let query = supabase
      .from('member_invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch invitations: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Cancel invitation
export const cancelInvitation = async (invitationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('member_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId);

    if (error) {
      throw new Error(`Failed to cancel invitation: ${error.message}`);
    }
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Accept invitation
export const acceptInvitation = async (
  invitationToken: string,
  userDetails: {
    full_name: string;
    password: string;
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('member_invitations')
      .select('*')
      .eq('invitation_token', invitationToken)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) {
      return { success: false, message: 'Invalid or expired invitation' };
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('member_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);
      
      return { success: false, message: 'Invitation has expired' };
    }

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password: userDetails.password,
      options: {
        data: {
          full_name: userDetails.full_name,
          role: invitation.role
        }
      }
    });

    if (authError) {
      return { success: false, message: `Failed to create account: ${authError.message}` };
    }

    // Mark invitation as accepted
    await supabase
      .from('member_invitations')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Member API error:', error);
    return { success: false, message: 'An error occurred while accepting invitation' };
  }
};

// Get member roles
export const getMemberRoles = async (userId: string): Promise<MemberRole[]> => {
  try {
    const { data, error } = await supabase
      .from('member_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('assigned_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch member roles: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Assign role to member
export const assignMemberRole = async (
  userId: string,
  roleName: string,
  department?: string,
  position?: string,
  permissions: Record<string, unknown> = {},
  expiresAt?: string
): Promise<MemberRole> => {
  try {
    const { data, error } = await supabase
      .from('member_roles')
      .insert({
        user_id: userId,
        role_name: roleName,
        department,
        position,
        permissions,
        expires_at: expiresAt,
        assigned_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign role: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Remove role from member
export const removeMemberRole = async (roleId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('member_roles')
      .update({ is_active: false })
      .eq('id', roleId);

    if (error) {
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Get member statistics
export const getMemberStatistics = async (
  userId?: string
): Promise<MemberStatistics | MemberStatistics[]> => {
  try {
    let query = supabase
      .from('member_statistics')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId).single();
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === 'PGRST116' && userId) {
        // Create default statistics for user
        const { data: newStats, error: createError } = await supabase
          .from('member_statistics')
          .insert({ user_id: userId })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create member statistics: ${createError.message}`);
        }

        return newStats;
      }
      throw new Error(`Failed to fetch member statistics: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Update member status
export const updateMemberStatus = async (
  userId: string,
  newStatus: string,
  reason?: string
): Promise<void> => {
  try {
    // Get current status
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('status')
      .eq('user_id', userId)
      .single();

    // Update profile status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(`Failed to update member status: ${updateError.message}`);
    }

    // Record status change in history
    const { error: historyError } = await supabase
      .from('member_status_history')
      .insert({
        user_id: userId,
        previous_status: currentProfile?.status,
        new_status: newStatus,
        reason,
        changed_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (historyError) {
      console.error('Failed to record status history:', historyError);
      // Don't throw error for history recording failure
    }
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Get member status history
export const getMemberStatusHistory = async (
  userId: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('member_status_history')
      .select(`
        *,
        changed_by_profile:profiles!member_status_history_changed_by_fkey(full_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch status history: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Delete member (soft delete by updating status)
export const deleteMember = async (userId: string, reason?: string): Promise<void> => {
  try {
    await updateMemberStatus(userId, 'inactive', reason);
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};

// Get member dashboard statistics
export const getMemberDashboardStats = async (): Promise<{
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  pendingInvitations: number;
  membersByRole: Record<string, number>;
  membersByCollege: Record<string, number>;
}> => {
  try {
    // Get total and active members
    const { count: totalMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get new members this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newMembersThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // Get pending invitations
    const { count: pendingInvitations } = await supabase
      .from('member_invitations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get members by role
    const { data: roleData } = await supabase
      .from('profiles')
      .select('role')
      .eq('status', 'active');

    const membersByRole: Record<string, number> = {};
    roleData?.forEach(member => {
      membersByRole[member.role] = (membersByRole[member.role] || 0) + 1;
    });

    // Get members by college
    const { data: collegeData } = await supabase
      .from('profiles')
      .select('college')
      .eq('status', 'active')
      .not('college', 'is', null);

    const membersByCollege: Record<string, number> = {};
    collegeData?.forEach(member => {
      if (member.college) {
        membersByCollege[member.college] = (membersByCollege[member.college] || 0) + 1;
      }
    });

    return {
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers || 0,
      newMembersThisMonth: newMembersThisMonth || 0,
      pendingInvitations: pendingInvitations || 0,
      membersByRole,
      membersByCollege
    };
  } catch (error) {
    console.error('Member API error:', error);
    throw error;
  }
};