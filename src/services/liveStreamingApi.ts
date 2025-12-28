import { supabase } from '@/integrations/supabase/client';

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  stream_key: string;
  stream_url: string;
  thumbnail_url?: string;
  category: 'khutbah' | 'lecture' | 'quran_recitation' | 'dua' | 'discussion' | 'event' | 'other';
  language: 'english' | 'arabic' | 'amharic' | 'oromo';
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  visibility: 'public' | 'members_only' | 'private';
  max_viewers?: number;
  current_viewers: number;
  total_views: number;
  likes_count: number;
  comments_count: number;
  scheduled_start: string;
  actual_start?: string;
  actual_end?: string;
  duration_minutes?: number;
  streamer_id: string;
  moderators: string[];
  tags: string[];
  recording_enabled: boolean;
  recording_url?: string;
  chat_enabled: boolean;
  donations_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface StreamComment {
  id: string;
  stream_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  message: string;
  is_moderator: boolean;
  is_highlighted: boolean;
  reply_to?: string;
  reactions: Record<string, number>;
  created_at: string;
}

export interface StreamDonation {
  id: string;
  stream_id: string;
  donor_id?: string;
  donor_name: string;
  amount: number;
  currency: string;
  message?: string;
  is_anonymous: boolean;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export interface StreamAnalytics {
  stream_id: string;
  peak_viewers: number;
  average_viewers: number;
  total_watch_time_minutes: number;
  engagement_rate: number;
  chat_messages: number;
  donations_total: number;
  viewer_countries: Record<string, number>;
  viewer_devices: Record<string, number>;
  retention_data: Array<{ timestamp: string; viewers: number }>;
}

class LiveStreamingApiService {
  // Stream Management
  async createStream(data: {
    title: string;
    description: string;
    category: LiveStream['category'];
    language: LiveStream['language'];
    scheduled_start: string;
    visibility?: LiveStream['visibility'];
    max_viewers?: number;
    tags?: string[];
    recording_enabled?: boolean;
    chat_enabled?: boolean;
    donations_enabled?: boolean;
  }): Promise<LiveStream> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Generate unique stream key
      const streamKey = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const streamUrl = `rtmp://live.humsj.org/live/${streamKey}`;

      const { data: stream, error } = await supabase
        .from('live_streams')
        .insert([{
          title: data.title,
          description: data.description,
          stream_key: streamKey,
          stream_url: streamUrl,
          category: data.category,
          language: data.language,
          status: 'scheduled',
          visibility: data.visibility || 'public',
          max_viewers: data.max_viewers,
          current_viewers: 0,
          total_views: 0,
          likes_count: 0,
          comments_count: 0,
          scheduled_start: data.scheduled_start,
          streamer_id: user.user.id,
          moderators: [user.user.id],
          tags: data.tags || [],
          recording_enabled: data.recording_enabled ?? true,
          chat_enabled: data.chat_enabled ?? true,
          donations_enabled: data.donations_enabled ?? false
        }])
        .select()
        .single();

      if (error) throw error;

      // Log stream creation
      await this.logStreamActivity(stream.id, 'stream_created', {
        title: data.title,
        category: data.category,
        scheduled_start: data.scheduled_start
      });

      return stream;
    } catch (error) {
      console.error('Error creating stream:', error);
      throw error;
    }
  }

  async getStreams(filters: {
    status?: LiveStream['status'];
    category?: LiveStream['category'];
    language?: LiveStream['language'];
    visibility?: LiveStream['visibility'];
    streamer_id?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ streams: LiveStream[]; total: number }> {
    try {
      let query = supabase
        .from('live_streams')
        .select(`
          *,
          streamer:profiles!live_streams_streamer_id_fkey(full_name, avatar_url)
        `, { count: 'exact' })
        .order('scheduled_start', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
      }
      if (filters.streamer_id) {
        query = query.eq('streamer_id', filters.streamer_id);
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
        streams: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching streams:', error);
      throw error;
    }
  }

  async getStreamById(streamId: string): Promise<LiveStream> {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select(`
          *,
          streamer:profiles!live_streams_streamer_id_fkey(full_name, avatar_url, bio)
        `)
        .eq('id', streamId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching stream:', error);
      throw error;
    }
  }

  async updateStream(streamId: string, updates: Partial<LiveStream>): Promise<LiveStream> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('live_streams')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', streamId)
        .eq('streamer_id', user.user.id)
        .select()
        .single();

      if (error) throw error;

      // Log stream update
      await this.logStreamActivity(streamId, 'stream_updated', updates);

      return data;
    } catch (error) {
      console.error('Error updating stream:', error);
      throw error;
    }
  }

  async startStream(streamId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('live_streams')
        .update({
          status: 'live',
          actual_start: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', streamId)
        .eq('streamer_id', user.user.id);

      if (error) throw error;

      // Log stream start
      await this.logStreamActivity(streamId, 'stream_started', {
        actual_start: new Date().toISOString()
      });

      // Send notifications to followers
      await this.notifyStreamStart(streamId);
    } catch (error) {
      console.error('Error starting stream:', error);
      throw error;
    }
  }

  async endStream(streamId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get stream data for duration calculation
      const { data: stream } = await supabase
        .from('live_streams')
        .select('actual_start')
        .eq('id', streamId)
        .single();

      const durationMinutes = stream?.actual_start 
        ? Math.round((Date.now() - new Date(stream.actual_start).getTime()) / (1000 * 60))
        : 0;

      const { error } = await supabase
        .from('live_streams')
        .update({
          status: 'ended',
          actual_end: new Date().toISOString(),
          duration_minutes: durationMinutes,
          current_viewers: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', streamId)
        .eq('streamer_id', user.user.id);

      if (error) throw error;

      // Log stream end
      await this.logStreamActivity(streamId, 'stream_ended', {
        actual_end: new Date().toISOString(),
        duration_minutes: durationMinutes
      });
    } catch (error) {
      console.error('Error ending stream:', error);
      throw error;
    }
  }

  // Chat Management
  async sendChatMessage(streamId: string, message: string, replyTo?: string): Promise<StreamComment> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.user.id)
        .single();

      // Check if user is moderator
      const { data: stream } = await supabase
        .from('live_streams')
        .select('moderators')
        .eq('id', streamId)
        .single();

      const isModerator = stream?.moderators?.includes(user.user.id) || false;

      const { data: comment, error } = await supabase
        .from('stream_comments')
        .insert([{
          stream_id: streamId,
          user_id: user.user.id,
          user_name: profile?.full_name || 'Anonymous',
          user_avatar: profile?.avatar_url,
          message,
          is_moderator: isModerator,
          is_highlighted: false,
          reply_to: replyTo,
          reactions: {}
        }])
        .select()
        .single();

      if (error) throw error;

      // Update comments count
      await supabase
        .from('live_streams')
        .update({
          comments_count: supabase.sql`comments_count + 1`
        })
        .eq('id', streamId);

      return comment;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  async getChatMessages(streamId: string, limit: number = 50, offset: number = 0): Promise<StreamComment[]> {
    try {
      const { data, error } = await supabase
        .from('stream_comments')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  async reactToMessage(commentId: string, reaction: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get current reactions
      const { data: comment } = await supabase
        .from('stream_comments')
        .select('reactions')
        .eq('id', commentId)
        .single();

      const reactions = comment?.reactions || {};
      reactions[reaction] = (reactions[reaction] || 0) + 1;

      const { error } = await supabase
        .from('stream_comments')
        .update({ reactions })
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error reacting to message:', error);
      throw error;
    }
  }

  // Donations
  async processDonation(data: {
    stream_id: string;
    amount: number;
    currency: string;
    message?: string;
    is_anonymous?: boolean;
  }): Promise<StreamDonation> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get user profile for donor name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.user.id)
        .single();

      const { data: donation, error } = await supabase
        .from('stream_donations')
        .insert([{
          stream_id: data.stream_id,
          donor_id: data.is_anonymous ? null : user.user.id,
          donor_name: data.is_anonymous ? 'Anonymous' : (profile?.full_name || 'Anonymous'),
          amount: data.amount,
          currency: data.currency,
          message: data.message,
          is_anonymous: data.is_anonymous || false,
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Log donation activity
      await this.logStreamActivity(data.stream_id, 'donation_received', {
        amount: data.amount,
        currency: data.currency,
        donor_name: donation.donor_name
      });

      return donation;
    } catch (error) {
      console.error('Error processing donation:', error);
      throw error;
    }
  }

  async getStreamDonations(streamId: string): Promise<StreamDonation[]> {
    try {
      const { data, error } = await supabase
        .from('stream_donations')
        .select('*')
        .eq('stream_id', streamId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stream donations:', error);
      throw error;
    }
  }

  // Analytics
  async getStreamAnalytics(streamId: string): Promise<StreamAnalytics> {
    try {
      const { data: stream } = await supabase
        .from('live_streams')
        .select('*')
        .eq('id', streamId)
        .single();

      if (!stream) throw new Error('Stream not found');

      // Get viewer analytics (mock data for now)
      const analytics: StreamAnalytics = {
        stream_id: streamId,
        peak_viewers: Math.max(stream.current_viewers, Math.floor(stream.total_views * 0.3)),
        average_viewers: Math.floor(stream.total_views * 0.2),
        total_watch_time_minutes: stream.duration_minutes ? stream.total_views * stream.duration_minutes * 0.6 : 0,
        engagement_rate: stream.total_views > 0 ? (stream.comments_count / stream.total_views) * 100 : 0,
        chat_messages: stream.comments_count,
        donations_total: 0, // Will be calculated from donations table
        viewer_countries: { 'Ethiopia': 70, 'USA': 15, 'Canada': 10, 'Other': 5 },
        viewer_devices: { 'Mobile': 60, 'Desktop': 30, 'Tablet': 10 },
        retention_data: [] // Would be populated with real-time data
      };

      // Get total donations
      const { data: donations } = await supabase
        .from('stream_donations')
        .select('amount')
        .eq('stream_id', streamId)
        .eq('payment_status', 'completed');

      analytics.donations_total = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;

      return analytics;
    } catch (error) {
      console.error('Error fetching stream analytics:', error);
      throw error;
    }
  }

  // Viewer Management
  async joinStream(streamId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Increment viewer count
      const { error } = await supabase
        .from('live_streams')
        .update({
          current_viewers: supabase.sql`current_viewers + 1`,
          total_views: supabase.sql`total_views + 1`
        })
        .eq('id', streamId);

      if (error) throw error;

      // Log viewer join
      await this.logStreamActivity(streamId, 'viewer_joined', {
        user_id: user.user.id
      });
    } catch (error) {
      console.error('Error joining stream:', error);
      throw error;
    }
  }

  async leaveStream(streamId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Decrement viewer count
      const { error } = await supabase
        .from('live_streams')
        .update({
          current_viewers: supabase.sql`GREATEST(current_viewers - 1, 0)`
        })
        .eq('id', streamId);

      if (error) throw error;

      // Log viewer leave
      await this.logStreamActivity(streamId, 'viewer_left', {
        user_id: user.user.id
      });
    } catch (error) {
      console.error('Error leaving stream:', error);
      throw error;
    }
  }

  async likeStream(streamId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('stream_likes')
        .select('id')
        .eq('stream_id', streamId)
        .eq('user_id', user.user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('stream_likes')
          .delete()
          .eq('id', existingLike.id);

        await supabase
          .from('live_streams')
          .update({
            likes_count: supabase.sql`GREATEST(likes_count - 1, 0)`
          })
          .eq('id', streamId);
      } else {
        // Like
        await supabase
          .from('stream_likes')
          .insert([{
            stream_id: streamId,
            user_id: user.user.id
          }]);

        await supabase
          .from('live_streams')
          .update({
            likes_count: supabase.sql`likes_count + 1`
          })
          .eq('id', streamId);
      }
    } catch (error) {
      console.error('Error liking stream:', error);
      throw error;
    }
  }

  // Utility functions
  private async logStreamActivity(streamId: string, action: string, details: Record<string, unknown>): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase
        .from('stream_activity_log')
        .insert([{
          stream_id: streamId,
          action,
          details,
          user_id: user.user?.id || null
        }]);
    } catch (error) {
      console.error('Error logging stream activity:', error);
      // Don't throw error for logging failures
    }
  }

  private async notifyStreamStart(streamId: string): Promise<void> {
    try {
      // Get stream details
      const { data: stream } = await supabase
        .from('live_streams')
        .select('title, streamer_id')
        .eq('id', streamId)
        .single();

      if (!stream) return;

      // Get streamer followers (mock implementation)
      // In real implementation, you would have a followers table
      const followers = []; // await getStreamFollowers(stream.streamer_id);

      // Send notifications to followers
      for (const followerId of followers) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: followerId,
            title: 'Live Stream Started',
            message: `${stream.title} is now live!`,
            type: 'live_stream',
            data: { stream_id: streamId }
          }]);
      }
    } catch (error) {
      console.error('Error notifying stream start:', error);
    }
  }

  // Statistics
  async getStreamingStats(): Promise<{
    total_streams: number;
    live_streams: number;
    total_viewers: number;
    total_watch_time: number;
    popular_categories: Array<{ category: string; count: number }>;
  }> {
    try {
      const { data: streams } = await supabase
        .from('live_streams')
        .select('status, category, total_views, duration_minutes');

      const totalStreams = streams?.length || 0;
      const liveStreams = streams?.filter(s => s.status === 'live').length || 0;
      const totalViewers = streams?.reduce((sum, s) => sum + s.total_views, 0) || 0;
      const totalWatchTime = streams?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;

      // Calculate popular categories
      const categoryCount: Record<string, number> = {};
      streams?.forEach(s => {
        categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
      });

      const popularCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        total_streams: totalStreams,
        live_streams: liveStreams,
        total_viewers: totalViewers,
        total_watch_time: totalWatchTime,
        popular_categories: popularCategories
      };
    } catch (error) {
      console.error('Error fetching streaming stats:', error);
      throw error;
    }
  }
}

export const liveStreamingApi = new LiveStreamingApiService();