import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Types matching the database schema
export interface Member {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: number;
  avatar_url?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'alumni' | 'invited' | 'pending' | 'suspended';
  invitation_id?: string;
  invitation_accepted_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  role?: string;
}

export interface MemberInvitation {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  year: number;
  status: 'pending' | 'invited' | 'accepted' | 'rejected' | 'expired';
  invitation_type: 'admin_invite' | 'member_request';
  intended_role?: string;
  created_by?: string;
  created_by_email?: string;
  invitation_token?: string;
  token_expires_at?: string;
  notes?: string;
  bio?: string;
}

export interface CreateMemberData {
  full_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  year: number;
  intended_role?: string;
  notes?: string;
}

export interface MemberFilters {
  searchQuery?: string;
  college?: string;
  status?: string;
  role?: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  pendingRequests: number;
  recentJoins: number;
}

export const useMembers = () => {
  const { user, isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<MemberInvitation[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingInvitations: 0,
    pendingRequests: 0,
    recentJoins: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all members from profiles table
  const fetchMembers = useCallback(async () => {
    try {
      setError(null);
      
      // Try to use the optimized database function first
      try {
        const { data: membersData, error: membersError } = await (supabase as unknown).rpc('get_members_with_roles', {
          p_limit: 1000,
          p_offset: 0,
          p_status: null,
          p_college: null
        });

        if (!membersError && membersData && Array.isArray(membersData)) {
          const transformedMembers: Member[] = membersData.map((profile: unknown) => ({
            id: profile.id,
            user_id: profile.user_id,
            full_name: profile.full_name || 'Unknown',
            email: profile.email || '',
            phone: profile.phone,
            college: profile.college,
            department: profile.department,
            year: profile.year,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            status: profile.status as Member['status'],
            invitation_id: profile.invitation_id,
            invitation_accepted_at: profile.invitation_accepted_at,
            created_by: profile.created_by,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            role: profile.user_role || extractRoleFromBio(profile.bio)
          }));

          setMembers(transformedMembers);
          return transformedMembers;
        }
      } catch (rpcError) {
        console.warn('RPC function not available, falling back to manual query:', rpcError);
      }

      // Fallback: Fetch profiles and roles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.warn('Error fetching user roles:', rolesError);
        // Continue without roles if there's an error
      }

      // Create a map of user_id to role for efficient lookup
      const roleMap = new Map<string, string>();
      if (userRoles) {
        userRoles.forEach((ur: unknown) => {
          if (ur.user_id) {
            roleMap.set(ur.user_id, ur.role);
          }
        });
      }

      // Transform profiles to Member format
      const transformedMembers: Member[] = (profiles || []).map((profile: unknown) => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name || 'Unknown',
        email: profile.email || '',
        phone: profile.phone,
        college: profile.college,
        department: profile.department,
        year: profile.year,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        status: profile.status as Member['status'],
        invitation_id: profile.invitation_id,
        invitation_accepted_at: profile.invitation_accepted_at,
        created_by: profile.created_by,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        role: profile.user_id ? roleMap.get(profile.user_id) : extractRoleFromBio(profile.bio)
      }));

      setMembers(transformedMembers);
      return transformedMembers;

    } catch (error: unknown) {
      console.error('Error fetching members:', error);
      setError(error.message || 'Failed to fetch members');
      toast.error('Failed to load members');
      return [];
    }
  }, []);

  // Fetch member invitations (admin only)
  const fetchInvitations = useCallback(async () => {
    if (!isAdmin) return [];

    try {
      const { data: invitationData, error: invitationError } = await (supabase as unknown).rpc('get_member_invitations', {
        p_status: null, // Get all statuses
        p_limit: 100,
        p_offset: 0
      });

      if (invitationError) {
        console.warn('Could not fetch member invitations:', invitationError);
        return [];
      }

      if (invitationData && Array.isArray(invitationData)) {
        const transformedInvitations: MemberInvitation[] = invitationData.map((invitation: unknown) => ({
          id: invitation.id,
          created_at: invitation.created_at,
          updated_at: invitation.updated_at,
          full_name: invitation.full_name,
          email: invitation.email,
          phone: invitation.phone,
          college: invitation.college,
          department: invitation.department,
          year: invitation.year,
          status: invitation.status,
          invitation_type: invitation.invitation_type,
          intended_role: invitation.intended_role,
          created_by: invitation.created_by,
          created_by_email: invitation.created_by_email,
          invitation_token: invitation.invitation_token,
          token_expires_at: invitation.token_expires_at,
          notes: invitation.notes,
          bio: invitation.bio
        }));

        setInvitations(transformedInvitations);
        return transformedInvitations;
      }

      return [];
    } catch (error: unknown) {
      console.warn('Error fetching invitations:', error);
      return [];
    }
  }, [isAdmin]);

  // Load all data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [membersData, invitationsData] = await Promise.all([
        fetchMembers(),
        fetchInvitations()
      ]);

      // Try to get statistics from database function first
      let newStats: MemberStats;
      try {
        const { data: dbStats, error: statsError } = await (supabase as unknown).rpc('get_member_statistics');
        
        if (!statsError && dbStats) {
          newStats = {
            totalMembers: dbStats.totalMembers || 0,
            activeMembers: dbStats.activeMembers || 0,
            pendingInvitations: dbStats.pendingInvitations || 0,
            pendingRequests: dbStats.pendingRequests || 0,
            recentJoins: dbStats.recentJoins || 0
          };
        } else {
          throw new Error('Database stats function failed');
        }
      } catch (statsError) {
        console.warn('Database stats function not available, calculating manually:', statsError);
        
        // Fallback: Calculate stats manually
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        newStats = {
          totalMembers: membersData.length,
          activeMembers: membersData.filter(m => m.status === 'active').length,
          pendingInvitations: invitationsData.filter(i => i.status === 'invited').length,
          pendingRequests: invitationsData.filter(i => i.status === 'pending').length,
          recentJoins: membersData.filter(m => new Date(m.created_at) > oneWeekAgo).length
        };
      }

      setStats(newStats);
    } catch (error: unknown) {
      console.error('Error loading data:', error);
      setError(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchMembers, fetchInvitations]);

  // Create member invitation (admin only)
  const createMemberInvitation = useCallback(async (memberData: CreateMemberData) => {
    if (!isAdmin) {
      throw new Error('Only admins can create member invitations');
    }

    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await (supabase as unknown).rpc('create_member_invitation', {
        p_full_name: memberData.full_name.trim(),
        p_email: memberData.email.toLowerCase().trim(),
        p_phone: memberData.phone?.trim() || null,
        p_college: memberData.college.trim(),
        p_department: memberData.department.trim(),
        p_year: memberData.year,
        p_intended_role: memberData.intended_role || 'member',
        p_notes: memberData.notes || `Added by admin: ${user.email} on ${new Date().toISOString()}`
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      if (data && !data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      toast.success('Member invitation created successfully!');
      await loadData(); // Refresh data
      return data;

    } catch (error: unknown) {
      console.error('Error creating member invitation:', error);
      
      // Provide specific error messages
      if (error.message?.includes('Email already exists') || error.message?.includes('duplicate')) {
        throw new Error('A member with this email already exists.');
      } else if (error.message?.includes('Insufficient permissions')) {
        throw new Error('Permission denied. Please ensure you have admin privileges.');
      } else {
        throw new Error(error.message || 'Failed to create member invitation');
      }
    }
  }, [isAdmin, user, loadData]);

  // Create member request (regular users)
  const createMemberRequest = useCallback(async (memberData: CreateMemberData) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await (supabase as unknown).rpc('create_member_request', {
        p_full_name: memberData.full_name.trim(),
        p_email: memberData.email.toLowerCase().trim(),
        p_phone: memberData.phone?.trim() || null,
        p_college: memberData.college.trim(),
        p_department: memberData.department.trim(),
        p_year: memberData.year,
        p_notes: memberData.notes || `Requested by: ${user.email} on ${new Date().toISOString()}`
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      if (data && !data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      toast.success('Member registration request submitted successfully!');
      await loadData(); // Refresh data
      return data;

    } catch (error: unknown) {
      console.error('Error creating member request:', error);
      
      if (error.message?.includes('Email already exists') || error.message?.includes('duplicate')) {
        throw new Error('A member with this email already exists.');
      } else {
        throw new Error(error.message || 'Failed to submit member request');
      }
    }
  }, [user, loadData]);

  // Approve member request (admin only)
  const approveMemberRequest = useCallback(async (invitationId: string, approvedRole: string = 'member') => {
    if (!isAdmin) {
      throw new Error('Only admins can approve member requests');
    }

    try {
      const { data, error } = await (supabase as unknown).rpc('approve_member_request', {
        p_invitation_id: invitationId,
        p_approved_role: approvedRole
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      if (data && !data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      toast.success('Member request approved successfully!');
      await loadData(); // Refresh data
      return data;

    } catch (error: unknown) {
      console.error('Error approving member request:', error);
      throw new Error(error.message || 'Failed to approve member request');
    }
  }, [isAdmin, loadData]);

  // Reject member request (admin only)
  const rejectMemberRequest = useCallback(async (invitationId: string, reason?: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can reject member requests');
    }

    try {
      const { data, error } = await (supabase as unknown).rpc('reject_member_request', {
        p_invitation_id: invitationId,
        p_reason: reason || 'No reason provided'
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      if (data && !data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      toast.success('Member request rejected');
      await loadData(); // Refresh data
      return data;

    } catch (error: unknown) {
      console.error('Error rejecting member request:', error);
      throw new Error(error.message || 'Failed to reject member request');
    }
  }, [isAdmin, loadData]);

  // Update member profile
  const updateMemberProfile = useCallback(async (memberId: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          phone: updates.phone,
          college: updates.college,
          department: updates.department,
          year: updates.year,
          bio: updates.bio,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId)
        .select()
        .single();

      if (error) {
        console.error('Error updating member profile:', error);
        throw error;
      }

      toast.success('Member profile updated successfully');
      await loadData(); // Refresh data
      return data;

    } catch (error: unknown) {
      console.error('Error updating member profile:', error);
      throw new Error(error.message || 'Failed to update member profile');
    }
  }, [loadData]);

  // Delete member (admin only)
  const deleteMember = useCallback(async (memberId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can delete members');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error deleting member:', error);
        throw error;
      }

      toast.success('Member deleted successfully');
      await loadData(); // Refresh data

    } catch (error: unknown) {
      console.error('Error deleting member:', error);
      throw new Error(error.message || 'Failed to delete member');
    }
  }, [isAdmin, loadData]);

  // Filter members based on criteria
  const filterMembers = useCallback((filters: MemberFilters) => {
    let filtered = [...members];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.full_name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.department?.toLowerCase().includes(query) ||
        member.college?.toLowerCase().includes(query)
      );
    }

    if (filters.college && filters.college !== 'All Colleges') {
      filtered = filtered.filter(member => member.college === filters.college);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(member => member.status === filters.status);
    }

    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(member => member.role === filters.role);
    }

    return filtered;
  }, [members]);

  // Get combined members and invitations list
  const getCombinedMembersList = useCallback(() => {
    const membersList: Member[] = [...members];
    
    // Add invitations as members for display
    invitations.forEach(invitation => {
      // Check if this invitation is not already represented as a member
      const existingMember = membersList.find(m => m.email === invitation.email);
      if (!existingMember) {
        membersList.push({
          id: invitation.id,
          full_name: invitation.full_name,
          email: invitation.email,
          phone: invitation.phone,
          college: invitation.college || '',
          department: invitation.department || '',
          year: invitation.year,
          bio: invitation.bio,
          status: invitation.status as Member['status'],
          created_at: invitation.created_at,
          updated_at: invitation.updated_at,
          role: invitation.intended_role
        });
      }
    });

    return membersList;
  }, [members, invitations]);

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper function to extract role from bio
  function extractRoleFromBio(bio?: string): string | undefined {
    if (!bio) return undefined;
    
    if (bio.includes('Role:')) {
      const roleMatch = bio.match(/Role:\s*([^|]+)/);
      if (roleMatch) {
        return roleMatch[1].trim();
      }
    }
    
    return undefined;
  }

  return {
    // Data
    members,
    invitations,
    stats,
    combinedMembers: getCombinedMembersList(),
    
    // State
    isLoading,
    error,
    
    // Actions
    loadData,
    createMemberInvitation,
    createMemberRequest,
    approveMemberRequest,
    rejectMemberRequest,
    updateMemberProfile,
    deleteMember,
    filterMembers,
    
    // Utilities
    refreshData: loadData,
    clearError: () => setError(null)
  };
};

export default useMembers;