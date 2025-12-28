import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analyticsApi } from './analyticsApi';

export interface DawaCampaign {
  id: string;
  title: string;
  description?: string;
  campaign_type: 'online' | 'offline' | 'hybrid' | 'social_media' | 'educational';
  target_audience?: 'general' | 'youth' | 'women' | 'converts' | 'non_muslims';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency: string;
  goals: Record<string, unknown>;
  metrics: Record<string, unknown>;
  created_by?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  creator?: { full_name: string; email: string };
  assignee?: { full_name: string; email: string };
  content_count?: number;
  total_reach?: number;
  total_engagement?: number;
}

export interface DawaContent {
  id: string;
  campaign_id?: string;
  title: string;
  content_type: 'article' | 'video' | 'audio' | 'infographic' | 'social_post' | 'pamphlet';
  content?: string;
  media_urls: string[];
  language: string;
  target_platforms: string[];
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  scheduled_at?: string;
  published_at?: string;
  engagement_stats: Record<string, unknown>;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  campaign?: DawaCampaign;
  creator?: { full_name: string; email: string };
  approver?: { full_name: string; email: string };
}

export interface DawaDistributionChannel {
  id: string;
  name: string;
  channel_type: 'social_media' | 'website' | 'email' | 'sms' | 'print' | 'radio' | 'tv';
  platform?: string;
  configuration: Record<string, unknown>;
  is_active: boolean;
  reach_estimate: number;
  cost_per_reach: number;
  created_at: string;
  updated_at: string;
}

export interface DawaContentDistribution {
  id: string;
  content_id: string;
  channel_id: string;
  status: 'pending' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string;
  published_at?: string;
  reach_count: number;
  engagement_count: number;
  click_count: number;
  conversion_count: number;
  cost: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  content?: DawaContent;
  channel?: DawaDistributionChannel;
}

export interface DawaInquiry {
  id: string;
  campaign_id?: string;
  content_id?: string;
  inquirer_name?: string;
  inquirer_email?: string;
  inquirer_phone?: string;
  inquiry_type: 'general' | 'conversion' | 'learning' | 'support' | 'complaint';
  subject?: string;
  message?: string;
  status: 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  response?: string;
  responded_at?: string;
  source_platform?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  
  // Joined data
  campaign?: DawaCampaign;
  content?: DawaContent;
  assignee?: { full_name: string; email: string };
}

export interface DawaResource {
  id: string;
  title: string;
  description?: string;
  resource_type: 'book' | 'pamphlet' | 'video' | 'audio' | 'course' | 'template';
  category?: 'basics' | 'comparative' | 'history' | 'jurisprudence' | 'spirituality';
  language: string;
  file_url?: string;
  download_count: number;
  is_featured: boolean;
  is_public: boolean;
  tags: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  creator?: { full_name: string; email: string };
}

export interface DawaVolunteer {
  id: string;
  user_id: string;
  specializations: string[];
  languages: string[];
  availability: Record<string, unknown>;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certifications: Array<Record<string, unknown>>;
  performance_rating: number;
  total_contributions: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: { full_name: string; email: string; phone?: string };
}

class DawaManagementApiService {
  // Campaigns
  async getCampaigns(filters: {
    status?: string;
    campaign_type?: string;
    created_by?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ campaigns: DawaCampaign[]; total: number }> {
    try {
      let query = supabase
        .from('dawa_campaigns')
        .select(`
          *,
          creator:profiles!dawa_campaigns_created_by_fkey(full_name, email),
          assignee:profiles!dawa_campaigns_assigned_to_fkey(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.campaign_type) {
        query = query.eq('campaign_type', filters.campaign_type);
      }
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Get additional stats for each campaign
      const campaignsWithStats = await Promise.all(
        (data || []).map(async (campaign) => {
          const [contentCount, analytics] = await Promise.all([
            this.getCampaignContentCount(campaign.id),
            this.getCampaignAnalytics(campaign.id)
          ]);

          return {
            ...campaign,
            content_count: contentCount,
            total_reach: analytics.total_reach,
            total_engagement: analytics.total_engagement
          };
        })
      );

      return {
        campaigns: campaignsWithStats,
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching da\'wa campaigns:', error);
      throw errorHandler.handleError(error, 'Failed to fetch da\'wa campaigns');
    }
  }

  async getCampaignById(campaignId: string): Promise<DawaCampaign> {
    try {
      const { data, error } = await supabase
        .from('dawa_campaigns')
        .select(`
          *,
          creator:profiles!dawa_campaigns_created_by_fkey(full_name, email),
          assignee:profiles!dawa_campaigns_assigned_to_fkey(full_name, email)
        `)
        .eq('id', campaignId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching da\'wa campaign by ID:', error);
      throw errorHandler.handleError(error, 'Failed to fetch da\'wa campaign');
    }
  }

  async createCampaign(campaignData: {
    title: string;
    description?: string;
    campaign_type: DawaCampaign['campaign_type'];
    target_audience?: DawaCampaign['target_audience'];
    start_date?: string;
    end_date?: string;
    budget?: number;
    currency?: string;
    goals?: Record<string, unknown>;
    assigned_to?: string;
  }): Promise<DawaCampaign> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('dawa_campaigns')
        .insert([{
          ...campaignData,
          created_by: user.user?.id,
          currency: campaignData.currency || 'ETB',
          goals: campaignData.goals || {},
          metrics: {}
        }])
        .select(`
          *,
          creator:profiles!dawa_campaigns_created_by_fkey(full_name, email),
          assignee:profiles!dawa_campaigns_assigned_to_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_campaign_created', 'dawa_management', {
        campaign_id: data.id,
        campaign_type: data.campaign_type,
        target_audience: data.target_audience
      });

      return data;
    } catch (error) {
      console.error('Error creating da\'wa campaign:', error);
      throw errorHandler.handleError(error, 'Failed to create da\'wa campaign');
    }
  }

  async updateCampaign(campaignId: string, updates: Partial<DawaCampaign>): Promise<DawaCampaign> {
    try {
      const { data, error } = await supabase
        .from('dawa_campaigns')
        .update(updates)
        .eq('id', campaignId)
        .select(`
          *,
          creator:profiles!dawa_campaigns_created_by_fkey(full_name, email),
          assignee:profiles!dawa_campaigns_assigned_to_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_campaign_updated', 'dawa_management', {
        campaign_id: campaignId,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      console.error('Error updating da\'wa campaign:', error);
      throw errorHandler.handleError(error, 'Failed to update da\'wa campaign');
    }
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dawa_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_campaign_deleted', 'dawa_management', {
        campaign_id: campaignId
      });
    } catch (error) {
      console.error('Error deleting da\'wa campaign:', error);
      throw errorHandler.handleError(error, 'Failed to delete da\'wa campaign');
    }
  }

  // Content
  async getDawaContent(filters: {
    campaign_id?: string;
    content_type?: string;
    status?: string;
    language?: string;
    created_by?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ content: DawaContent[]; total: number }> {
    try {
      let query = supabase
        .from('dawa_content')
        .select(`
          *,
          campaign:dawa_campaigns(*),
          creator:profiles!dawa_content_created_by_fkey(full_name, email),
          approver:profiles!dawa_content_approved_by_fkey(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.campaign_id) {
        query = query.eq('campaign_id', filters.campaign_id);
      }
      if (filters.content_type) {
        query = query.eq('content_type', filters.content_type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        content: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching da\'wa content:', error);
      throw errorHandler.handleError(error, 'Failed to fetch da\'wa content');
    }
  }

  async createDawaContent(contentData: {
    campaign_id?: string;
    title: string;
    content_type: DawaContent['content_type'];
    content?: string;
    media_urls?: string[];
    language?: string;
    target_platforms?: string[];
    scheduled_at?: string;
  }): Promise<DawaContent> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('dawa_content')
        .insert([{
          ...contentData,
          created_by: user.user?.id,
          language: contentData.language || 'en',
          media_urls: contentData.media_urls || [],
          target_platforms: contentData.target_platforms || [],
          engagement_stats: {}
        }])
        .select(`
          *,
          campaign:dawa_campaigns(*),
          creator:profiles!dawa_content_created_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_content_created', 'dawa_management', {
        content_id: data.id,
        content_type: data.content_type,
        campaign_id: data.campaign_id,
        language: data.language
      });

      return data;
    } catch (error) {
      console.error('Error creating da\'wa content:', error);
      throw errorHandler.handleError(error, 'Failed to create da\'wa content');
    }
  }

  async updateDawaContent(contentId: string, updates: Partial<DawaContent>): Promise<DawaContent> {
    try {
      const { data, error } = await supabase
        .from('dawa_content')
        .update(updates)
        .eq('id', contentId)
        .select(`
          *,
          campaign:dawa_campaigns(*),
          creator:profiles!dawa_content_created_by_fkey(full_name, email),
          approver:profiles!dawa_content_approved_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_content_updated', 'dawa_management', {
        content_id: contentId,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      console.error('Error updating da\'wa content:', error);
      throw errorHandler.handleError(error, 'Failed to update da\'wa content');
    }
  }

  async approveDawaContent(contentId: string): Promise<DawaContent> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('dawa_content')
        .update({
          status: 'approved',
          approved_by: user.user?.id
        })
        .eq('id', contentId)
        .select(`
          *,
          campaign:dawa_campaigns(*),
          approver:profiles!dawa_content_approved_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_content_approved', 'dawa_management', {
        content_id: contentId
      });

      return data;
    } catch (error) {
      console.error('Error approving da\'wa content:', error);
      throw errorHandler.handleError(error, 'Failed to approve da\'wa content');
    }
  }

  async publishDawaContent(contentId: string, distributionChannels: string[]): Promise<DawaContent> {
    try {
      // Update content status
      const { data: content, error: contentError } = await supabase
        .from('dawa_content')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select()
        .single();

      if (contentError) throw contentError;

      // Create distribution records
      const distributions = distributionChannels.map(channelId => ({
        content_id: contentId,
        channel_id: channelId,
        status: 'pending' as const
      }));

      const { error: distError } = await supabase
        .from('dawa_content_distribution')
        .insert(distributions);

      if (distError) throw distError;

      await analyticsApi.trackEvent('dawa_content_published', 'dawa_management', {
        content_id: contentId,
        distribution_channels: distributionChannels.length
      });

      return content;
    } catch (error) {
      console.error('Error publishing da\'wa content:', error);
      throw errorHandler.handleError(error, 'Failed to publish da\'wa content');
    }
  }

  // Distribution Channels
  async getDistributionChannels(): Promise<DawaDistributionChannel[]> {
    try {
      const { data, error } = await supabase
        .from('dawa_distribution_channels')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching distribution channels:', error);
      throw errorHandler.handleError(error, 'Failed to fetch distribution channels');
    }
  }

  async createDistributionChannel(channelData: {
    name: string;
    channel_type: DawaDistributionChannel['channel_type'];
    platform?: string;
    configuration?: Record<string, unknown>;
    reach_estimate?: number;
    cost_per_reach?: number;
  }): Promise<DawaDistributionChannel> {
    try {
      const { data, error } = await supabase
        .from('dawa_distribution_channels')
        .insert([{
          ...channelData,
          configuration: channelData.configuration || {},
          reach_estimate: channelData.reach_estimate || 0,
          cost_per_reach: channelData.cost_per_reach || 0
        }])
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('distribution_channel_created', 'dawa_management', {
        channel_name: channelData.name,
        channel_type: channelData.channel_type
      });

      return data;
    } catch (error) {
      console.error('Error creating distribution channel:', error);
      throw errorHandler.handleError(error, 'Failed to create distribution channel');
    }
  }

  // Inquiries
  async getDawaInquiries(filters: {
    status?: string;
    priority?: string;
    inquiry_type?: string;
    assigned_to?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ inquiries: DawaInquiry[]; total: number }> {
    try {
      let query = supabase
        .from('dawa_inquiries')
        .select(`
          *,
          campaign:dawa_campaigns(*),
          content:dawa_content(*),
          assignee:profiles!dawa_inquiries_assigned_to_fkey(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.inquiry_type) {
        query = query.eq('inquiry_type', filters.inquiry_type);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        inquiries: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching da\'wa inquiries:', error);
      throw errorHandler.handleError(error, 'Failed to fetch da\'wa inquiries');
    }
  }

  async createDawaInquiry(inquiryData: {
    campaign_id?: string;
    content_id?: string;
    inquirer_name?: string;
    inquirer_email?: string;
    inquirer_phone?: string;
    inquiry_type: DawaInquiry['inquiry_type'];
    subject?: string;
    message?: string;
    source_platform?: string;
    metadata?: Record<string, unknown>;
  }): Promise<DawaInquiry> {
    try {
      const { data, error } = await supabase
        .from('dawa_inquiries')
        .insert([{
          ...inquiryData,
          metadata: inquiryData.metadata || {}
        }])
        .select(`
          *,
          campaign:dawa_campaigns(*),
          content:dawa_content(*)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_inquiry_created', 'dawa_management', {
        inquiry_id: data.id,
        inquiry_type: data.inquiry_type,
        source_platform: data.source_platform
      });

      return data;
    } catch (error) {
      console.error('Error creating da\'wa inquiry:', error);
      throw errorHandler.handleError(error, 'Failed to create da\'wa inquiry');
    }
  }

  async assignInquiry(inquiryId: string, assignedTo: string): Promise<DawaInquiry> {
    try {
      const { data, error } = await supabase
        .from('dawa_inquiries')
        .update({
          assigned_to: assignedTo,
          status: 'assigned'
        })
        .eq('id', inquiryId)
        .select(`
          *,
          assignee:profiles!dawa_inquiries_assigned_to_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_inquiry_assigned', 'dawa_management', {
        inquiry_id: inquiryId,
        assigned_to: assignedTo
      });

      return data;
    } catch (error) {
      console.error('Error assigning da\'wa inquiry:', error);
      throw errorHandler.handleError(error, 'Failed to assign da\'wa inquiry');
    }
  }

  async respondToInquiry(inquiryId: string, response: string): Promise<DawaInquiry> {
    try {
      const { data, error } = await supabase
        .from('dawa_inquiries')
        .update({
          response,
          responded_at: new Date().toISOString(),
          status: 'resolved'
        })
        .eq('id', inquiryId)
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_inquiry_responded', 'dawa_management', {
        inquiry_id: inquiryId
      });

      return data;
    } catch (error) {
      console.error('Error responding to da\'wa inquiry:', error);
      throw errorHandler.handleError(error, 'Failed to respond to da\'wa inquiry');
    }
  }

  // Resources
  async getDawaResources(filters: {
    resource_type?: string;
    category?: string;
    language?: string;
    is_featured?: boolean;
    is_public?: boolean;
    limit?: number;
  } = {}): Promise<DawaResource[]> {
    try {
      let query = supabase
        .from('dawa_resources')
        .select(`
          *,
          creator:profiles!dawa_resources_created_by_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (filters.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching da\'wa resources:', error);
      throw errorHandler.handleError(error, 'Failed to fetch da\'wa resources');
    }
  }

  async createDawaResource(resourceData: {
    title: string;
    description?: string;
    resource_type: DawaResource['resource_type'];
    category?: DawaResource['category'];
    language?: string;
    file_url?: string;
    is_featured?: boolean;
    is_public?: boolean;
    tags?: string[];
  }): Promise<DawaResource> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('dawa_resources')
        .insert([{
          ...resourceData,
          created_by: user.user?.id,
          language: resourceData.language || 'en',
          tags: resourceData.tags || [],
          is_featured: resourceData.is_featured || false,
          is_public: resourceData.is_public !== false // Default to true
        }])
        .select(`
          *,
          creator:profiles!dawa_resources_created_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dawa_resource_created', 'dawa_management', {
        resource_id: data.id,
        resource_type: data.resource_type,
        category: data.category
      });

      return data;
    } catch (error) {
      console.error('Error creating da\'wa resource:', error);
      throw errorHandler.handleError(error, 'Failed to create da\'wa resource');
    }
  }

  async downloadResource(resourceId: string): Promise<void> {
    try {
      await supabase.rpc('update_resource_download_count', {
        p_resource_id: resourceId
      });

      await analyticsApi.trackEvent('dawa_resource_downloaded', 'dawa_management', {
        resource_id: resourceId
      });
    } catch (error) {
      console.error('Error updating resource download count:', error);
      // Don't throw error as this is not critical
    }
  }

  // Analytics
  async getCampaignAnalytics(campaignId: string): Promise<{
    total_content: number;
    total_reach: number;
    total_engagement: number;
    total_inquiries: number;
    conversion_rate: number;
    generated_at: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('get_campaign_analytics', {
        p_campaign_id: campaignId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw errorHandler.handleError(error, 'Failed to fetch campaign analytics');
    }
  }

  private async getCampaignContentCount(campaignId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('dawa_content')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', campaignId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error fetching campaign content count:', error);
      return 0;
    }
  }

  async trackEngagement(
    contentId: string,
    engagementType: 'view' | 'like' | 'share' | 'comment' | 'download' | 'inquiry',
    platform?: string,
    sessionId?: string,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      await supabase.rpc('track_dawa_engagement', {
        p_content_id: contentId,
        p_engagement_type: engagementType,
        p_platform: platform,
        p_session_id: sessionId,
        p_metadata: metadata
      });
    } catch (error) {
      console.error('Error tracking da\'wa engagement:', error);
      // Don't throw error as this is not critical
    }
  }
}

export const dawaManagementApi = new DawaManagementApiService();