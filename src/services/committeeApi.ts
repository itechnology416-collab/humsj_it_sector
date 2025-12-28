import { supabase } from '@/integrations/supabase/client';

export interface Committee {
  id: string;
  name: string;
  description?: string;
  purpose?: string;
  type: 'standing' | 'ad_hoc' | 'subcommittee' | 'task_force';
  status: 'active' | 'inactive' | 'dissolved';
  parent_committee_id?: string;
  chair_id?: string;
  vice_chair_id?: string;
  secretary_id?: string;
  max_members?: number;
  current_members: number;
  meeting_frequency?: string;
  meeting_day?: string;
  meeting_time?: string;
  meeting_location?: string;
  budget_allocated?: number;
  budget_spent: number;
  established_date?: string;
  dissolution_date?: string;
  contact_email?: string;
  contact_phone?: string;
  is_public: boolean;
  requires_approval: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  chair_profile?: unknown;
  vice_chair_profile?: unknown;
  secretary_profile?: unknown;
  parent_committee?: Committee;
  subcommittees?: Committee[];
}

export interface CommitteeMember {
  id: string;
  committee_id: string;
  user_id: string;
  role: 'chair' | 'vice_chair' | 'secretary' | 'treasurer' | 'member' | 'advisor';
  status: 'active' | 'inactive' | 'resigned' | 'removed';
  join_date: string;
  end_date?: string;
  term_start?: string;
  term_end?: string;
  responsibilities?: string;
  expertise_areas: string[];
  commitment_level: 'minimal' | 'regular' | 'high' | 'full_time';
  voting_rights: boolean;
  appointed_by?: string;
  appointment_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user_profile?: unknown;
  committee?: Committee;
}

export interface CommitteeFilters {
  type?: string;
  status?: string;
  search?: string;
  chair_id?: string;
  is_public?: boolean;
}

// Mock data - will be replaced with real database queries when committee tables are set up
const mockCommittees: Committee[] = [
  {
    id: '1',
    name: 'Executive Committee',
    description: 'Main governing body of the organization',
    purpose: 'Strategic leadership and decision making',
    type: 'standing',
    status: 'active',
    current_members: 7,
    max_members: 10,
    budget_allocated: 5000,
    budget_spent: 1200,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Monthly',
    meeting_day: 'First Monday',
    meeting_time: '18:00',
    meeting_location: 'Conference Room A',
    established_date: '2024-01-01',
    contact_email: 'executive@humsj.org',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    chair_profile: { full_name: 'Ahmed Hassan', email: 'ahmed@humsj.org' }
  },
  {
    id: '2',
    name: 'Academic Committee',
    description: 'Oversees educational programs and activities',
    purpose: 'Academic excellence and curriculum development',
    type: 'standing',
    status: 'active',
    current_members: 5,
    max_members: 8,
    budget_allocated: 3000,
    budget_spent: 800,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Bi-weekly',
    meeting_day: 'Wednesday',
    meeting_time: '17:30',
    meeting_location: 'Study Room 1',
    established_date: '2024-01-15',
    contact_email: 'academic@humsj.org',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    chair_profile: { full_name: 'Fatima Ali', email: 'fatima@humsj.org' }
  },
  {
    id: '3',
    name: 'Events Committee',
    description: 'Plans and organizes community events',
    purpose: 'Community engagement and event management',
    type: 'standing',
    status: 'active',
    current_members: 8,
    max_members: 12,
    budget_allocated: 8000,
    budget_spent: 2500,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Weekly',
    meeting_day: 'Friday',
    meeting_time: '19:00',
    meeting_location: 'Event Hall',
    established_date: '2024-02-01',
    contact_email: 'events@humsj.org',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    chair_profile: { full_name: 'Omar Ibrahim', email: 'omar@humsj.org' }
  },
  {
    id: '4',
    name: 'Technology Committee',
    description: 'Manages IT infrastructure and digital services',
    purpose: 'Technology advancement and digital transformation',
    type: 'standing',
    status: 'active',
    current_members: 4,
    max_members: 6,
    budget_allocated: 4000,
    budget_spent: 1800,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Weekly',
    meeting_day: 'Tuesday',
    meeting_time: '18:30',
    meeting_location: 'Computer Lab',
    established_date: '2024-02-15',
    contact_email: 'tech@humsj.org',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
    chair_profile: { full_name: 'Yusuf Mohamed', email: 'yusuf@humsj.org' }
  },
  {
    id: '5',
    name: 'Finance Committee',
    description: 'Manages budget and financial planning',
    purpose: 'Financial oversight and budget management',
    type: 'standing',
    status: 'active',
    current_members: 3,
    max_members: 5,
    budget_allocated: 2000,
    budget_spent: 500,
    is_public: false,
    requires_approval: true,
    meeting_frequency: 'Monthly',
    meeting_day: 'Last Friday',
    meeting_time: '17:00',
    meeting_location: 'Admin Office',
    established_date: '2024-01-10',
    contact_email: 'finance@humsj.org',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    chair_profile: { full_name: 'Aisha Osman', email: 'aisha@humsj.org' }
  },
  {
    id: '6',
    name: 'Outreach Committee',
    description: 'Handles community outreach and dawa activities',
    purpose: 'Community outreach and Islamic propagation',
    type: 'standing',
    status: 'active',
    current_members: 6,
    max_members: 10,
    budget_allocated: 3500,
    budget_spent: 900,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Bi-weekly',
    meeting_day: 'Thursday',
    meeting_time: '18:00',
    meeting_location: 'Community Center',
    established_date: '2024-02-20',
    contact_email: 'outreach@humsj.org',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z',
    chair_profile: { full_name: 'Khalid Rahman', email: 'khalid@humsj.org' }
  },
  {
    id: '7',
    name: 'Youth Committee',
    description: 'Focuses on youth programs and activities',
    purpose: 'Youth development and engagement',
    type: 'standing',
    status: 'active',
    current_members: 9,
    max_members: 15,
    budget_allocated: 4500,
    budget_spent: 1300,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Weekly',
    meeting_day: 'Saturday',
    meeting_time: '16:00',
    meeting_location: 'Youth Center',
    established_date: '2024-03-01',
    contact_email: 'youth@humsj.org',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    chair_profile: { full_name: 'Mariam Ahmed', email: 'mariam@humsj.org' }
  },
  {
    id: '8',
    name: "Women's Committee",
    description: 'Addresses women-specific programs and needs',
    purpose: 'Women empowerment and support',
    type: 'standing',
    status: 'active',
    current_members: 7,
    max_members: 12,
    budget_allocated: 3000,
    budget_spent: 750,
    is_public: true,
    requires_approval: false,
    meeting_frequency: 'Bi-weekly',
    meeting_day: 'Sunday',
    meeting_time: '15:00',
    meeting_location: 'Women\'s Hall',
    established_date: '2024-03-10',
    contact_email: 'women@humsj.org',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
    chair_profile: { full_name: 'Zainab Hassan', email: 'zainab@humsj.org' }
  }
];

const mockMembers: CommitteeMember[] = [
  {
    id: '1',
    committee_id: '1',
    user_id: '1',
    role: 'chair',
    status: 'active',
    join_date: '2024-01-01',
    expertise_areas: ['Leadership', 'Strategic Planning', 'Management'],
    commitment_level: 'high',
    voting_rights: true,
    responsibilities: 'Lead committee meetings, strategic decision making',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_profile: { full_name: 'Ahmed Hassan', email: 'ahmed@humsj.org' }
  },
  {
    id: '2',
    committee_id: '1',
    user_id: '2',
    role: 'vice_chair',
    status: 'active',
    join_date: '2024-01-05',
    expertise_areas: ['Administration', 'Communication'],
    commitment_level: 'high',
    voting_rights: true,
    responsibilities: 'Assist chair, coordinate activities',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    user_profile: { full_name: 'Fatima Ali', email: 'fatima@humsj.org' }
  },
  {
    id: '3',
    committee_id: '2',
    user_id: '3',
    role: 'chair',
    status: 'active',
    join_date: '2024-01-15',
    expertise_areas: ['Education', 'Curriculum Development'],
    commitment_level: 'high',
    voting_rights: true,
    responsibilities: 'Academic program oversight',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    user_profile: { full_name: 'Omar Ibrahim', email: 'omar@humsj.org' }
  }
];

// Get committees with filtering
export const getCommittees = async (
  filters: CommitteeFilters = {},
  page = 1,
  limit = 20
): Promise<{
  committees: Committee[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Apply filters
    let filteredCommittees = [...mockCommittees];

    if (filters.type) {
      filteredCommittees = filteredCommittees.filter(c => c.type === filters.type);
    }

    if (filters.status) {
      filteredCommittees = filteredCommittees.filter(c => c.status === filters.status);
    } else {
      // Default to active committees
      filteredCommittees = filteredCommittees.filter(c => c.status === 'active');
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCommittees = filteredCommittees.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        (c.description && c.description.toLowerCase().includes(searchLower)) ||
        (c.purpose && c.purpose.toLowerCase().includes(searchLower))
      );
    }

    if (filters.is_public !== undefined) {
      filteredCommittees = filteredCommittees.filter(c => c.is_public === filters.is_public);
    }

    if (filters.chair_id) {
      filteredCommittees = filteredCommittees.filter(c => c.chair_id === filters.chair_id);
    }

    const total = filteredCommittees.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCommittees = filteredCommittees.slice(startIndex, endIndex);

    return {
      committees: paginatedCommittees,
      total,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Get committee by ID
export const getCommitteeById = async (committeeId: string): Promise<Committee | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const committee = mockCommittees.find(c => c.id === committeeId);
    return committee || null;
  } catch (error) {
    console.error('Committee API error:', error);
    return null;
  }
};

// Get committee members
export const getCommitteeMembers = async (
  committeeId: string,
  status?: string
): Promise<CommitteeMember[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    let members = mockMembers.filter(m => m.committee_id === committeeId);
    
    if (status) {
      members = members.filter(m => m.status === status);
    }
    
    return members;
  } catch (error) {
    console.error('Committee API error:', error);
    return [];
  }
};

// Get committee statistics
export const getCommitteeStatistics = async (committeeId?: string): Promise<{
  totalCommittees: number;
  activeCommittees: number;
  totalMembers: number;
  upcomingMeetings: number;
  pendingTasks: number;
  committeesByType: Record<string, number>;
  membersByRole: Record<string, number>;
}> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const committees = committeeId 
      ? mockCommittees.filter(c => c.id === committeeId)
      : mockCommittees;
    
    const totalCommittees = committees.length;
    const activeCommittees = committees.filter(c => c.status === 'active').length;
    const totalMembers = committees.reduce((sum, c) => sum + c.current_members, 0);
    
    const committeesByType: Record<string, number> = {};
    committees.forEach(c => {
      committeesByType[c.type] = (committeesByType[c.type] || 0) + 1;
    });

    const membersByRole: Record<string, number> = {};
    mockMembers.filter(m => m.status === 'active').forEach(m => {
      membersByRole[m.role] = (membersByRole[m.role] || 0) + 1;
    });

    return {
      totalCommittees,
      activeCommittees,
      totalMembers,
      upcomingMeetings: 8, // Mock data
      pendingTasks: 15, // Mock data
      committeesByType,
      membersByRole
    };
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Create committee
export const createCommittee = async (
  committee: Omit<Committee, 'id' | 'current_members' | 'budget_spent' | 'created_at' | 'updated_at'>
): Promise<Committee> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newCommittee: Committee = {
      ...committee,
      id: Date.now().toString(),
      current_members: 0,
      budget_spent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real implementation, this would be saved to the database
    mockCommittees.push(newCommittee);
    
    return newCommittee;
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Update committee
export const updateCommittee = async (
  committeeId: string,
  updates: Partial<Committee>
): Promise<Committee> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const committeeIndex = mockCommittees.findIndex(c => c.id === committeeId);
    if (committeeIndex === -1) {
      throw new Error('Committee not found');
    }

    const updatedCommittee: Committee = {
      ...mockCommittees[committeeIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // In a real implementation, this would be saved to the database
    mockCommittees[committeeIndex] = updatedCommittee;
    
    return updatedCommittee;
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Delete committee
export const deleteCommittee = async (committeeId: string): Promise<void> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const committeeIndex = mockCommittees.findIndex(c => c.id === committeeId);
    if (committeeIndex === -1) {
      throw new Error('Committee not found');
    }

    // In a real implementation, this would be deleted from the database
    mockCommittees.splice(committeeIndex, 1);
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Add member to committee
export const addCommitteeMember = async (
  member: Omit<CommitteeMember, 'id' | 'created_at' | 'updated_at'>
): Promise<CommitteeMember> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const newMember: CommitteeMember = {
      ...member,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real implementation, this would be saved to the database
    mockMembers.push(newMember);
    
    // Update committee member count
    const committee = mockCommittees.find(c => c.id === member.committee_id);
    if (committee) {
      committee.current_members += 1;
    }
    
    return newMember;
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Update committee member
export const updateCommitteeMember = async (
  memberId: string,
  updates: Partial<CommitteeMember>
): Promise<CommitteeMember> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const memberIndex = mockMembers.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error('Committee member not found');
    }

    const updatedMember: CommitteeMember = {
      ...mockMembers[memberIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // In a real implementation, this would be saved to the database
    mockMembers[memberIndex] = updatedMember;
    
    return updatedMember;
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};

// Remove committee member
export const removeCommitteeMember = async (memberId: string): Promise<void> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const memberIndex = mockMembers.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error('Committee member not found');
    }

    const member = mockMembers[memberIndex];
    
    // In a real implementation, this would be deleted from the database
    mockMembers.splice(memberIndex, 1);
    
    // Update committee member count
    const committee = mockCommittees.find(c => c.id === member.committee_id);
    if (committee && committee.current_members > 0) {
      committee.current_members -= 1;
    }
  } catch (error) {
    console.error('Committee API error:', error);
    throw error;
  }
};