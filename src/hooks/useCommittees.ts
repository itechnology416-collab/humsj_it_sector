import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Committee {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'advisory';
  status: 'active' | 'inactive' | 'forming';
  chairperson_id?: string;
  meeting_schedule?: string;
  established_date: string;
  term_start_date?: string;
  term_end_date?: string;
  responsibilities: string[];
  notes?: string;
  chairperson_name?: string;
  member_count?: number;
}

export interface CommitteeMember {
  id: string;
  created_at: string;
  updated_at: string;
  committee_id: string;
  member_id: string;
  role: string;
  status: 'active' | 'inactive';
  join_date: string;
  end_date?: string;
  email?: string;
  phone?: string;
  member_name?: string;
  committee_name?: string;
}

export interface CreateCommitteeData {
  name: string;
  description: string;
  type: Committee['type'];
  chairperson_id?: string;
  meeting_schedule?: string;
  established_date?: string;
  term_start_date?: string;
  term_end_date?: string;
  responsibilities?: string[];
  notes?: string;
}

export interface CreateMemberData {
  committee_id: string;
  member_id: string;
  role: string;
  email?: string;
  phone?: string;
}

// Mock data for development
const mockCommittees: Committee[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    name: 'Executive Committee',
    description: 'Main governing body of the organization',
    type: 'executive',
    status: 'active',
    meeting_schedule: 'First Sunday of every month',
    established_date: '2024-01-01',
    term_start_date: '2024-01-01',
    term_end_date: '2024-12-31',
    responsibilities: ['Strategic planning', 'Policy making', 'Budget approval'],
    chairperson_name: 'Ahmed Hassan',
    member_count: 7
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    name: 'IT Committee',
    description: 'Manages technology infrastructure and digital initiatives',
    type: 'operational',
    status: 'active',
    meeting_schedule: 'Every two weeks',
    established_date: '2024-02-01',
    responsibilities: ['Website maintenance', 'System administration', 'Digital projects'],
    chairperson_name: 'Fatima Ali',
    member_count: 5
  },
  {
    id: '3',
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
    name: 'Da\'wa Committee',
    description: 'Coordinates Islamic outreach and educational activities',
    type: 'operational',
    status: 'active',
    meeting_schedule: 'Monthly',
    established_date: '2024-01-15',
    responsibilities: ['Educational programs', 'Community outreach', 'Content creation'],
    chairperson_name: 'Omar Ibrahim',
    member_count: 8
  }
];

const mockMembers: CommitteeMember[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    committee_id: '1',
    member_id: 'user1',
    role: 'Chairperson',
    status: 'active',
    join_date: '2024-01-01',
    email: 'ahmed@example.com',
    phone: '+1234567890',
    member_name: 'Ahmed Hassan',
    committee_name: 'Executive Committee'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    committee_id: '2',
    member_id: 'user2',
    role: 'Head',
    status: 'active',
    join_date: '2024-02-01',
    email: 'fatima@example.com',
    member_name: 'Fatima Ali',
    committee_name: 'IT Committee'
  }
];

export const useCommittees = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await (supabase as any)
        .from('committees')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchCommittees = useCallback(async (filters?: {
    type?: string;
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('Committee tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredCommittees = [...mockCommittees];
        
        if (filters?.type && filters.type !== 'all') {
          filteredCommittees = filteredCommittees.filter(committee => committee.type === filters.type);
        }
        if (filters?.status && filters.status !== 'all') {
          filteredCommittees = filteredCommittees.filter(committee => committee.status === filters.status);
        }
        
        setCommittees(filteredCommittees);
        setMembers(mockMembers);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = (supabase as any)
        .from('committees')
        .select(`
          *,
          profiles!committees_chairperson_id_fkey(full_name),
          committee_members(count)
        `);

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      const { data: committeesData, error: committeesError } = await query;

      if (committeesError) throw committeesError;

      const formattedCommittees: Committee[] = (committeesData || []).map(committee => ({
        ...committee,
        chairperson_name: committee.profiles?.full_name || 'Not assigned',
        member_count: committee.committee_members?.[0]?.count || 0
      }));

      setCommittees(formattedCommittees);

      // Fetch committee members
      const { data: membersData, error: membersError } = await (supabase as any)
        .from('committee_members')
        .select(`
          *,
          committees(name),
          profiles!committee_members_member_id_fkey(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (!membersError && membersData) {
        const formattedMembers: CommitteeMember[] = membersData.map(member => ({
          ...member,
          committee_name: member.committees?.name || 'Unknown',
          member_name: member.profiles?.full_name || 'Unknown',
          email: member.email || member.profiles?.email,
          phone: member.phone || member.profiles?.phone
        }));
        setMembers(formattedMembers);
      }

    } catch (err: any) {
      console.error('Error fetching committee data:', err);
      setError(err.message || 'Failed to fetch committee data');
      
      // Fallback to mock data
      setUseMockData(true);
      setCommittees(mockCommittees);
      setMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCommittee = useCallback(async (committeeData: CreateCommitteeData): Promise<Committee | null> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can create committees');
      }

      if (useMockData) {
        const newCommittee: Committee = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...committeeData,
          status: 'forming',
          established_date: committeeData.established_date || new Date().toISOString().split('T')[0],
          responsibilities: committeeData.responsibilities || [],
          member_count: 0
        };
        
        setCommittees(prev => [newCommittee, ...prev]);
        toast.success('Committee created successfully! (Mock data)');
        return newCommittee;
      }

      const { data, error } = await (supabase as any)
        .from('committees')
        .insert([{
          ...committeeData,
          status: 'forming',
          established_date: committeeData.established_date || new Date().toISOString().split('T')[0],
          responsibilities: committeeData.responsibilities || []
        }])
        .select(`
          *,
          profiles!committees_chairperson_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newCommittee: Committee = {
        ...data,
        chairperson_name: data.profiles?.full_name || 'Not assigned',
        member_count: 0
      };

      setCommittees(prev => [newCommittee, ...prev]);
      toast.success('Committee created successfully!');
      return newCommittee;

    } catch (err: any) {
      console.error('Error creating committee:', err);
      toast.error(err.message || 'Failed to create committee');
      return null;
    }
  }, [isAdmin, useMockData]);

  const updateCommittee = useCallback(async (committeeId: string, updates: Partial<CreateCommitteeData>): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update committees');
      }

      if (useMockData) {
        setCommittees(prev => prev.map(committee => 
          committee.id === committeeId ? { ...committee, ...updates, updated_at: new Date().toISOString() } : committee
        ));
        toast.success('Committee updated successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('committees')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', committeeId);

      if (error) throw error;

      setCommittees(prev => prev.map(committee => 
        committee.id === committeeId ? { ...committee, ...updates, updated_at: new Date().toISOString() } : committee
      ));

      toast.success('Committee updated successfully!');
      return true;

    } catch (err: any) {
      console.error('Error updating committee:', err);
      toast.error(err.message || 'Failed to update committee');
      return false;
    }
  }, [isAdmin, useMockData]);

  const deleteCommittee = useCallback(async (committeeId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete committees');
      }

      if (useMockData) {
        setCommittees(prev => prev.filter(committee => committee.id !== committeeId));
        setMembers(prev => prev.filter(member => member.committee_id !== committeeId));
        toast.success('Committee deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('committees')
        .delete()
        .eq('id', committeeId);

      if (error) throw error;

      setCommittees(prev => prev.filter(committee => committee.id !== committeeId));
      setMembers(prev => prev.filter(member => member.committee_id !== committeeId));
      toast.success('Committee deleted successfully!');
      return true;

    } catch (err: any) {
      console.error('Error deleting committee:', err);
      toast.error(err.message || 'Failed to delete committee');
      return false;
    }
  }, [isAdmin, useMockData]);

  const addMember = useCallback(async (memberData: CreateMemberData): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can add committee members');
      }

      if (useMockData) {
        const newMember: CommitteeMember = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...memberData,
          status: 'active',
          join_date: new Date().toISOString().split('T')[0],
          member_name: 'New Member',
          committee_name: committees.find(c => c.id === memberData.committee_id)?.name || 'Unknown'
        };
        
        setMembers(prev => [newMember, ...prev]);
        
        // Update committee member count
        setCommittees(prev => prev.map(committee => 
          committee.id === memberData.committee_id 
            ? { ...committee, member_count: (committee.member_count || 0) + 1 }
            : committee
        ));
        
        toast.success('Member added successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('committee_members')
        .insert([{
          ...memberData,
          status: 'active',
          join_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This member is already part of this committee');
        }
        throw error;
      }

      toast.success('Member added successfully!');
      await fetchCommittees(); // Refresh data
      return true;

    } catch (err: any) {
      console.error('Error adding member:', err);
      toast.error(err.message || 'Failed to add member');
      return false;
    }
  }, [isAdmin, useMockData, committees, fetchCommittees]);

  const removeMember = useCallback(async (memberId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can remove committee members');
      }

      if (useMockData) {
        const member = members.find(m => m.id === memberId);
        setMembers(prev => prev.filter(m => m.id !== memberId));
        
        // Update committee member count
        if (member) {
          setCommittees(prev => prev.map(committee => 
            committee.id === member.committee_id 
              ? { ...committee, member_count: Math.max(0, (committee.member_count || 0) - 1) }
              : committee
          ));
        }
        
        toast.success('Member removed successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('committee_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Member removed successfully!');
      await fetchCommittees(); // Refresh data
      return true;

    } catch (err: any) {
      console.error('Error removing member:', err);
      toast.error(err.message || 'Failed to remove member');
      return false;
    }
  }, [isAdmin, useMockData, members, fetchCommittees]);

  const updateMemberRole = useCallback(async (memberId: string, newRole: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update member roles');
      }

      if (useMockData) {
        setMembers(prev => prev.map(member => 
          member.id === memberId ? { ...member, role: newRole, updated_at: new Date().toISOString() } : member
        ));
        toast.success('Member role updated successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('committee_members')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole, updated_at: new Date().toISOString() } : member
      ));

      toast.success('Member role updated successfully!');
      return true;

    } catch (err: any) {
      console.error('Error updating member role:', err);
      toast.error(err.message || 'Failed to update member role');
      return false;
    }
  }, [isAdmin, useMockData]);

  const getCommitteeStats = useCallback(() => {
    return {
      totalCommittees: committees.length,
      activeCommittees: committees.filter(c => c.status === 'active').length,
      executiveCommittees: committees.filter(c => c.type === 'executive').length,
      operationalCommittees: committees.filter(c => c.type === 'operational').length,
      advisoryCommittees: committees.filter(c => c.type === 'advisory').length,
      totalMembers: members.filter(m => m.status === 'active').length,
      averageMembersPerCommittee: committees.length > 0 
        ? Math.round(members.filter(m => m.status === 'active').length / committees.filter(c => c.status === 'active').length)
        : 0
    };
  }, [committees, members]);

  const getCommitteeMembers = useCallback((committeeId: string) => {
    return members.filter(member => member.committee_id === committeeId && member.status === 'active');
  }, [members]);

  useEffect(() => {
    fetchCommittees();
  }, [fetchCommittees]);

  return {
    // Data
    committees,
    members,
    stats: getCommitteeStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchCommittees,
    createCommittee,
    updateCommittee,
    deleteCommittee,
    addMember,
    removeMember,
    updateMemberRole,
    
    // Utilities
    getCommitteeMembers,
    refetch: fetchCommittees,
    clearError: () => setError(null)
  };
};

export default useCommittees;