import { supabase } from '@/integrations/supabase/client';

export interface Donation {
  id: string;
  donor_id?: string;
  donor_name?: string;
  donor_email?: string;
  amount: number;
  currency: string;
  donation_type: 'general' | 'zakat' | 'sadaqah' | 'project' | 'emergency' | 'monthly' | 'annual';
  campaign_id?: string;
  project_id?: string;
  payment_method?: string;
  payment_reference?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  transaction_id?: string;
  gateway_response?: unknown;
  is_anonymous: boolean;
  is_recurring: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'annually';
  next_payment_date?: string;
  dedication_message?: string;
  tax_deductible: boolean;
  receipt_sent: boolean;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  campaign?: DonationCampaign;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description?: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  category?: string;
  image_url?: string;
  video_url?: string;
  organizer_id: string;
  featured: boolean;
  allow_anonymous: boolean;
  min_donation: number;
  max_donation?: number;
  donor_count: number;
  created_at: string;
  updated_at: string;
  organizer?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateDonationData {
  amount: number;
  currency?: string;
  donation_type?: Donation['donation_type'];
  campaign_id?: string;
  project_id?: string;
  payment_method?: string;
  is_anonymous?: boolean;
  is_recurring?: boolean;
  recurring_frequency?: Donation['recurring_frequency'];
  dedication_message?: string;
  donor_name?: string;
  donor_email?: string;
}

export interface CreateCampaignData {
  title: string;
  description?: string;
  goal_amount: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  image_url?: string;
  video_url?: string;
  featured?: boolean;
  allow_anonymous?: boolean;
  min_donation?: number;
  max_donation?: number;
}

export interface DonationFilters {
  donation_type?: string;
  payment_status?: string;
  campaign_id?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  is_recurring?: boolean;
  search?: string;
}

export interface CampaignFilters {
  status?: string;
  category?: string;
  featured?: boolean;
  organizer_id?: string;
  search?: string;
}

export const donationsApi = {
  // Create a donation
  async createDonation(donationData: CreateDonationData): Promise<{ data: Donation | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          donor_id: user?.id,
          donor_name: donationData.donor_name,
          donor_email: donationData.donor_email || user?.email,
          amount: donationData.amount,
          currency: donationData.currency || 'USD',
          donation_type: donationData.donation_type || 'general',
          campaign_id: donationData.campaign_id,
          project_id: donationData.project_id,
          payment_method: donationData.payment_method,
          is_anonymous: donationData.is_anonymous || false,
          is_recurring: donationData.is_recurring || false,
          recurring_frequency: donationData.recurring_frequency,
          dedication_message: donationData.dedication_message,
          payment_status: 'pending'
        }])
        .select(`
          *,
          campaign:donation_campaigns(*)
        `)
        .single();

      if (error) {
        console.error('Error creating donation:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in createDonation:', error);
      return { data: null, error: 'Failed to create donation' };
    }
  },

  // Process donation payment
  async processDonationPayment(
    donationId: string,
    paymentData: {
      payment_reference: string;
      transaction_id: string;
      gateway_response?: unknown;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          payment_status: 'completed',
          payment_reference: paymentData.payment_reference,
          transaction_id: paymentData.transaction_id,
          gateway_response: paymentData.gateway_response,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId);

      if (error) {
        console.error('Error processing donation payment:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in processDonationPayment:', error);
      return { success: false, error: 'Failed to process payment' };
    }
  },

  // Get donations with filters
  async getDonations(
    filters: DonationFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Donation[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('donations')
        .select(`
          *,
          campaign:donation_campaigns(id, title, image_url)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.donation_type) {
        query = query.eq('donation_type', filters.donation_type);
      }
      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }
      if (filters.campaign_id) {
        query = query.eq('campaign_id', filters.campaign_id);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.min_amount) {
        query = query.gte('amount', filters.min_amount);
      }
      if (filters.max_amount) {
        query = query.lte('amount', filters.max_amount);
      }
      if (filters.is_recurring !== undefined) {
        query = query.eq('is_recurring', filters.is_recurring);
      }
      if (filters.search) {
        query = query.or(`donor_name.ilike.%${filters.search}%,dedication_message.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching donations:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getDonations:', error);
      return { data: [], count: 0, error: 'Failed to fetch donations' };
    }
  },

  // Get user's donations
  async getUserDonations(
    userId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Donation[]; count: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], count: 0, error: 'User not authenticated' };
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('donations')
        .select(`
          *,
          campaign:donation_campaigns(id, title, image_url)
        `, { count: 'exact' })
        .eq('donor_id', targetUserId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching user donations:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getUserDonations:', error);
      return { data: [], count: 0, error: 'Failed to fetch user donations' };
    }
  },

  // Get single donation
  async getDonation(id: string): Promise<{ data: Donation | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          campaign:donation_campaigns(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching donation:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getDonation:', error);
      return { data: null, error: 'Failed to fetch donation' };
    }
  },

  // Create donation campaign
  async createCampaign(campaignData: CreateCampaignData): Promise<{ data: DonationCampaign | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('donation_campaigns')
        .insert([{
          title: campaignData.title,
          description: campaignData.description,
          goal_amount: campaignData.goal_amount,
          currency: campaignData.currency || 'USD',
          start_date: campaignData.start_date || new Date().toISOString(),
          end_date: campaignData.end_date,
          category: campaignData.category,
          image_url: campaignData.image_url,
          video_url: campaignData.video_url,
          organizer_id: user.id,
          featured: campaignData.featured || false,
          allow_anonymous: campaignData.allow_anonymous !== false,
          min_donation: campaignData.min_donation || 1,
          max_donation: campaignData.max_donation,
          status: 'draft'
        }])
        .select(`
          *,
          organizer:profiles!donation_campaigns_organizer_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error creating campaign:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in createCampaign:', error);
      return { data: null, error: 'Failed to create campaign' };
    }
  },

  // Get donation campaigns
  async getCampaigns(
    filters: CampaignFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: DonationCampaign[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('donation_campaigns')
        .select(`
          *,
          organizer:profiles!donation_campaigns_organizer_id_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.in('status', ['active', 'completed']);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters.organizer_id) {
        query = query.eq('organizer_id', filters.organizer_id);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching campaigns:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getCampaigns:', error);
      return { data: [], count: 0, error: 'Failed to fetch campaigns' };
    }
  },

  // Get single campaign
  async getCampaign(id: string): Promise<{ data: DonationCampaign | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('donation_campaigns')
        .select(`
          *,
          organizer:profiles!donation_campaigns_organizer_id_fkey(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getCampaign:', error);
      return { data: null, error: 'Failed to fetch campaign' };
    }
  },

  // Update campaign
  async updateCampaign(
    id: string,
    updates: Partial<CreateCampaignData>
  ): Promise<{ data: DonationCampaign | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('donation_campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          organizer:profiles!donation_campaigns_organizer_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error updating campaign:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in updateCampaign:', error);
      return { data: null, error: 'Failed to update campaign' };
    }
  },

  // Get featured campaigns
  async getFeaturedCampaigns(limit: number = 5): Promise<{ data: DonationCampaign[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('donation_campaigns')
        .select(`
          *,
          organizer:profiles!donation_campaigns_organizer_id_fkey(id, full_name, avatar_url)
        `)
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured campaigns:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getFeaturedCampaigns:', error);
      return { data: [], error: 'Failed to fetch featured campaigns' };
    }
  },

  // Get campaign donations
  async getCampaignDonations(
    campaignId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Donation[]; count: number; error?: string }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('campaign_id', campaignId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching campaign donations:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getCampaignDonations:', error);
      return { data: [], count: 0, error: 'Failed to fetch campaign donations' };
    }
  },

  // Get donation statistics
  async getDonationStats(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{ 
    data: {
      total_amount: number;
      total_donations: number;
      average_donation: number;
      recurring_donations: number;
      top_campaigns: Array<{
        campaign_id: string;
        campaign_title: string;
        total_amount: number;
        donor_count: number;
      }>;
    } | null; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .rpc('get_donation_statistics', {
          date_from: dateFrom,
          date_to: dateTo
        });

      if (error) {
        console.error('Error fetching donation stats:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getDonationStats:', error);
      return { data: null, error: 'Failed to fetch donation statistics' };
    }
  },

  // Get user donation summary
  async getUserDonationSummary(userId?: string): Promise<{ 
    data: {
      total_donated: number;
      donation_count: number;
      recurring_donations: number;
      last_donation_date: string;
      favorite_causes: string[];
    } | null; 
    error?: string 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .rpc('get_user_donation_summary', { user_uuid: targetUserId });

      if (error) {
        console.error('Error fetching user donation summary:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getUserDonationSummary:', error);
      return { data: null, error: 'Failed to fetch user donation summary' };
    }
  },

  // Generate donation receipt
  async generateReceipt(donationId: string): Promise<{ receipt_url?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .rpc('generate_donation_receipt', { donation_uuid: donationId });

      if (error) {
        console.error('Error generating receipt:', error);
        return { error: error.message };
      }

      return { receipt_url: data };
    } catch (error) {
      console.error('Error in generateReceipt:', error);
      return { error: 'Failed to generate receipt' };
    }
  }
};

export default donationsApi;