import { supabase } from '@/integrations/supabase/client';

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

export interface CreateMemberData {
  full_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  year: number;
  intended_role?: string;
  notes?: string;
  bio?: string;
}

export interface UpdateMemberData {
  full_name?: string;
  email?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: number;
  bio?: string;
  status?: 'active' | 'inactive' | 'alumni' | 'invited' | 'pending' | 'suspended';
  role?: string;
}

export interface MemberFilters {
  searchQuery?: string;
  college?: string;
  status?: string;
  role?: string;
  department?: string;
  year?: number;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  pendingRequests: number;
  recentJoins: number;
  alumniCount: number;
  suspendedCount: number;
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

class MemberManagementApi {
  /**
   * Get all members with optional filtering
   */
  async getMembers(filters?: MemberFilters): Promise<Member[]> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          email,
          phone,
          college,
          department,
          year,
          avatar_url,
          bio,
          status,
          created_at,
          updated_at,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.searchQuery) {
        query = query.or(`full_name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`);
      }
      
      if (filters?.college) {
        query = query.eq('college', filters.college);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters?.year) {
        query = query.eq('year', filters.year);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(member => ({
        ...member,
        role: member.user_roles?.[0]?.role || 'member'
      })) || [];
    } catch (error) {
      console.error('Error fetching members:', error);
      throw new Error('Failed to fetch members');
    }
  }

  /**
   * Get member statistics
   */
  async getMemberStats(): Promise<MemberStats> {
    try {
      const { data: members, error } = await supabase
        .from('profiles')
        .select('status, created_at');

      if (error) throw error;

      const { data: invitations, error: invError } = await supabase
        .from('member_invitations')
        .select('status');

      if (invError) throw invError;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats: MemberStats = {
        totalMembers: members?.length || 0,
        activeMembers: members?.filter(m => m.status === 'active').length || 0,
        pendingInvitations: invitations?.filter(i => i.status === 'pending' || i.status === 'invited').length || 0,
        pendingRequests: invitations?.filter(i => i.status === 'pending' && i.invitation_type === 'member_request').length || 0,
        recentJoins: members?.filter(m => new Date(m.created_at) > thirtyDaysAgo).length || 0,
        alumniCount: members?.filter(m => m.status === 'alumni').length || 0,
        suspendedCount: members?.filter(m => m.status === 'suspended').length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching member stats:', error);
      throw new Error('Failed to fetch member statistics');
    }
  }

  /**
   * Create a new member (admin function)
   */
  async createMember(memberData: CreateMemberData, createdBy: string): Promise<Member> {
    try {
      // First create the invitation
      const { data: invitation, error: invError } = await supabase
        .from('member_invitations')
        .insert({
          full_name: memberData.full_name,
          email: memberData.email,
          phone: memberData.phone,
          college: memberData.college,
          department: memberData.department,
          year: memberData.year,
          intended_role: memberData.intended_role || 'member',
          notes: memberData.notes,
          bio: memberData.bio,
          status: 'invited',
          invitation_type: 'admin_invite',
          created_by: createdBy,
          invitation_token: this.generateInvitationToken(),
          token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (invError) throw invError;

      // Create profile entry
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          full_name: memberData.full_name,
          email: memberData.email,
          phone: memberData.phone,
          college: memberData.college,
          department: memberData.department,
          year: memberData.year,
          bio: memberData.bio,
          status: 'invited',
          invitation_id: invitation.id,
          created_by: createdBy
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Send invitation email (placeholder - implement with your email service)
      await this.sendInvitationEmail(memberData.email, invitation.invitation_token);

      return {
        ...profile,
        role: memberData.intended_role || 'member'
      };
    } catch (error) {
      console.error('Error creating member:', error);
      throw new Error('Failed to create member');
    }
  }

  /**
   * Update member information
   */
  async updateMember(memberId: string, updateData: UpdateMemberData): Promise<Member> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      // Update role if provided
      if (updateData.role) {
        await supabase
          .from('user_roles')
          .upsert({
            user_id: memberId,
            role: updateData.role
          });
      }

      return data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw new Error('Failed to update member');
    }
  }

  /**
   * Delete member (soft delete by changing status)
   */
  async deleteMember(memberId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw new Error('Failed to delete member');
    }
  }

  /**
   * Suspend member
   */
  async suspendMember(memberId: string, reason?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;

      // Log the suspension
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'member_suspended',
          resource_type: 'member',
          resource_id: memberId,
          details: { reason }
        });
    } catch (error) {
      console.error('Error suspending member:', error);
      throw new Error('Failed to suspend member');
    }
  }

  /**
   * Reactivate suspended member
   */
  async reactivateMember(memberId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;

      // Log the reactivation
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'member_reactivated',
          resource_type: 'member',
          resource_id: memberId
        });
    } catch (error) {
      console.error('Error reactivating member:', error);
      throw new Error('Failed to reactivate member');
    }
  }

  /**
   * Get member invitations
   */
  async getInvitations(): Promise<MemberInvitation[]> {
    try {
      const { data, error } = await supabase
        .from('member_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw new Error('Failed to fetch invitations');
    }
  }

  /**
   * Approve member invitation/request
   */
  async approveInvitation(invitationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('member_invitations')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Update corresponding profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('invitation_id', invitationId);

      if (profileError) throw profileError;
    } catch (error) {
      console.error('Error approving invitation:', error);
      throw new Error('Failed to approve invitation');
    }
  }

  /**
   * Reject member invitation/request
   */
  async rejectInvitation(invitationId: string, reason?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('member_invitations')
        .update({
          status: 'rejected',
          notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      throw new Error('Failed to reject invitation');
    }
  }

  /**
   * Bulk import members from CSV data
   */
  async bulkImportMembers(membersData: CreateMemberData[], createdBy: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const memberData of membersData) {
      try {
        await this.createMember(memberData, createdBy);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to create ${memberData.email}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Export members data
   */
  async exportMembers(filters?: MemberFilters): Promise<any[]> {
    try {
      const members = await this.getMembers(filters);
      return members.map(member => ({
        'Full Name': member.full_name,
        'Email': member.email,
        'Phone': member.phone || '',
        'College': member.college || '',
        'Department': member.department || '',
        'Year': member.year || '',
        'Status': member.status,
        'Role': member.role || 'member',
        'Created At': new Date(member.created_at).toLocaleDateString()
      }));
    } catch (error) {
      console.error('Error exporting members:', error);
      throw new Error('Failed to export members');
    }
  }

  /**
   * Search members by various criteria
   */
  async searchMembers(query: string): Promise<Member[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          email,
          phone,
          college,
          department,
          year,
          avatar_url,
          bio,
          status,
          created_at,
          updated_at,
          user_roles(role)
        `)
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,college.ilike.%${query}%,department.ilike.%${query}%`)
        .limit(50);

      if (error) throw error;

      return data?.map(member => ({
        ...member,
        role: member.user_roles?.[0]?.role || 'member'
      })) || [];
    } catch (error) {
      console.error('Error searching members:', error);
      throw new Error('Failed to search members');
    }
  }

  /**
   * Get member by ID
   */
  async getMemberById(memberId: string): Promise<Member | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          email,
          phone,
          college,
          department,
          year,
          avatar_url,
          bio,
          status,
          created_at,
          updated_at,
          user_roles(role)
        `)
        .eq('id', memberId)
        .single();

      if (error) throw error;

      return data ? {
        ...data,
        role: data.user_roles?.[0]?.role || 'member'
      } : null;
    } catch (error) {
      console.error('Error fetching member:', error);
      throw new Error('Failed to fetch member');
    }
  }

  /**
   * Generate invitation token
   */
  private generateInvitationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Send invitation email (placeholder)
   */
  private async sendInvitationEmail(email: string, token: string): Promise<void> {
    // Implement with your email service (SendGrid, AWS SES, etc.)
    console.log(`Sending invitation email to ${email} with token ${token}`);
    // This would integrate with your email service
  }
}

export const memberManagementApi = new MemberManagementApi();