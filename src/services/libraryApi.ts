import { supabase } from '@/integrations/supabase/client';

export interface LibraryResource {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  translator?: string;
  publisher?: string;
  isbn?: string;
  resource_type: 'book' | 'article' | 'video' | 'audio' | 'document' | 'research';
  category?: string;
  subcategory?: string;
  language: string;
  description?: string;
  content_url?: string;
  thumbnail_url?: string;
  file_size?: number;
  duration_minutes?: number;
  page_count?: number;
  publication_date?: string;
  access_level: 'public' | 'members' | 'verified' | 'premium';
  download_allowed: boolean;
  view_count: number;
  download_count: number;
  rating_average: number;
  rating_count: number;
  tags?: string[];
  metadata?: unknown;
  status: 'draft' | 'active' | 'archived' | 'removed';
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  uploader?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface ResourceReview {
  id: string;
  resource_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface UserLibraryActivity {
  id: string;
  user_id: string;
  resource_id: string;
  activity_type: 'view' | 'download' | 'bookmark' | 'share';
  progress_percentage: number;
  last_position?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  resource?: LibraryResource;
}

export interface CreateResourceData {
  title: string;
  subtitle?: string;
  author?: string;
  translator?: string;
  publisher?: string;
  isbn?: string;
  resource_type: LibraryResource['resource_type'];
  category?: string;
  subcategory?: string;
  language?: string;
  description?: string;
  content_url?: string;
  thumbnail_url?: string;
  file_size?: number;
  duration_minutes?: number;
  page_count?: number;
  publication_date?: string;
  access_level?: LibraryResource['access_level'];
  download_allowed?: boolean;
  tags?: string[];
  metadata?: unknown;
}

export interface ResourceFilters {
  resource_type?: string;
  category?: string;
  subcategory?: string;
  language?: string;
  author?: string;
  access_level?: string;
  tags?: string[];
  search?: string;
  min_rating?: number;
  publication_year?: number;
}

export const libraryApi = {
  // Get library resources with filters and pagination
  async getResources(
    filters: ResourceFilters = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ data: LibraryResource[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('library_resources')
        .select(`
          *,
          uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply filters
      if (filters.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.author) {
        query = query.ilike('author', `%${filters.author}%`);
      }
      if (filters.access_level) {
        query = query.eq('access_level', filters.access_level);
      }
      if (filters.min_rating) {
        query = query.gte('rating_average', filters.min_rating);
      }
      if (filters.publication_year) {
        query = query.gte('publication_date', `${filters.publication_year}-01-01`)
                   .lt('publication_date', `${filters.publication_year + 1}-01-01`);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching library resources:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getResources:', error);
      return { data: [], count: 0, error: 'Failed to fetch library resources' };
    }
  },

  // Get single resource
  async getResource(id: string): Promise<{ data: LibraryResource | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('library_resources')
        .select(`
          *,
          uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching resource:', error);
        return { data: null, error: error.message };
      }

      // Increment view count
      await this.recordActivity(id, 'view');

      return { data };
    } catch (error) {
      console.error('Error in getResource:', error);
      return { data: null, error: 'Failed to fetch resource' };
    }
  },

  // Create new resource
  async createResource(resourceData: CreateResourceData): Promise<{ data: LibraryResource | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('library_resources')
        .insert([{
          ...resourceData,
          language: resourceData.language || 'en',
          access_level: resourceData.access_level || 'public',
          download_allowed: resourceData.download_allowed !== false,
          uploaded_by: user.id,
          status: 'draft'
        }])
        .select(`
          *,
          uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error creating resource:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in createResource:', error);
      return { data: null, error: 'Failed to create resource' };
    }
  },

  // Update resource
  async updateResource(
    id: string,
    updates: Partial<CreateResourceData>
  ): Promise<{ data: LibraryResource | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('library_resources')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error updating resource:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in updateResource:', error);
      return { data: null, error: 'Failed to update resource' };
    }
  },

  // Delete resource
  async deleteResource(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('library_resources')
        .update({ status: 'removed' })
        .eq('id', id);

      if (error) {
        console.error('Error deleting resource:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteResource:', error);
      return { success: false, error: 'Failed to delete resource' };
    }
  },

  // Record user activity
  async recordActivity(
    resourceId: string,
    activityType: UserLibraryActivity['activity_type'],
    progressPercentage: number = 0,
    lastPosition?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('user_library_activity')
        .upsert([{
          user_id: user.id,
          resource_id: resourceId,
          activity_type: activityType,
          progress_percentage: progressPercentage,
          last_position: lastPosition,
          completed: progressPercentage >= 100
        }]);

      if (error) {
        console.error('Error recording activity:', error);
        return { success: false, error: error.message };
      }

      // Update resource counters
      if (activityType === 'view') {
        await supabase
          .from('library_resources')
          .update({ view_count: supabase.sql`view_count + 1` })
          .eq('id', resourceId);
      } else if (activityType === 'download') {
        await supabase
          .from('library_resources')
          .update({ download_count: supabase.sql`download_count + 1` })
          .eq('id', resourceId);
      }

      return { success: true };
    } catch (error) {
      console.error('Error in recordActivity:', error);
      return { success: false, error: 'Failed to record activity' };
    }
  },

  // Get user's library activity
  async getUserActivity(
    userId?: string,
    activityType?: UserLibraryActivity['activity_type'],
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: UserLibraryActivity[]; count: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], count: 0, error: 'User not authenticated' };
      }

      let query = supabase
        .from('user_library_activity')
        .select(`
          *,
          resource:library_resources(id, title, resource_type, thumbnail_url)
        `, { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('updated_at', { ascending: false });

      if (activityType) {
        query = query.eq('activity_type', activityType);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching user activity:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getUserActivity:', error);
      return { data: [], count: 0, error: 'Failed to fetch user activity' };
    }
  },

  // Get user's bookmarks
  async getUserBookmarks(
    userId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: LibraryResource[]; count: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], count: 0, error: 'User not authenticated' };
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('user_library_activity')
        .select(`
          resource:library_resources(
            *,
            uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
          )
        `, { count: 'exact' })
        .eq('user_id', targetUserId)
        .eq('activity_type', 'bookmark')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching bookmarks:', error);
        return { data: [], count: 0, error: error.message };
      }

      const resources = data?.map(item => item.resource).filter(Boolean) || [];
      return { data: resources, count: count || 0 };
    } catch (error) {
      console.error('Error in getUserBookmarks:', error);
      return { data: [], count: 0, error: 'Failed to fetch bookmarks' };
    }
  },

  // Add/remove bookmark
  async toggleBookmark(resourceId: string): Promise<{ bookmarked: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { bookmarked: false, error: 'User not authenticated' };
      }

      // Check if already bookmarked
      const { data: existing } = await supabase
        .from('user_library_activity')
        .select('id')
        .eq('user_id', user.id)
        .eq('resource_id', resourceId)
        .eq('activity_type', 'bookmark')
        .single();

      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from('user_library_activity')
          .delete()
          .eq('id', existing.id);

        if (error) {
          console.error('Error removing bookmark:', error);
          return { bookmarked: false, error: error.message };
        }

        return { bookmarked: false };
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('user_library_activity')
          .insert([{
            user_id: user.id,
            resource_id: resourceId,
            activity_type: 'bookmark'
          }]);

        if (error) {
          console.error('Error adding bookmark:', error);
          return { bookmarked: false, error: error.message };
        }

        return { bookmarked: true };
      }
    } catch (error) {
      console.error('Error in toggleBookmark:', error);
      return { bookmarked: false, error: 'Failed to toggle bookmark' };
    }
  },

  // Submit resource review
  async submitReview(
    resourceId: string,
    rating: number,
    reviewText?: string
  ): Promise<{ data: ResourceReview | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('resource_reviews')
        .upsert([{
          resource_id: resourceId,
          user_id: user.id,
          rating,
          review_text: reviewText
        }])
        .select(`
          *,
          user:profiles!resource_reviews_user_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error submitting review:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in submitReview:', error);
      return { data: null, error: 'Failed to submit review' };
    }
  },

  // Get resource reviews
  async getResourceReviews(
    resourceId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ResourceReview[]; count: number; error?: string }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('resource_reviews')
        .select(`
          *,
          user:profiles!resource_reviews_user_id_fkey(id, full_name, avatar_url)
        `, { count: 'exact' })
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching reviews:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in getResourceReviews:', error);
      return { data: [], count: 0, error: 'Failed to fetch reviews' };
    }
  },

  // Get popular resources
  async getPopularResources(
    resourceType?: string,
    limit: number = 10
  ): Promise<{ data: LibraryResource[]; error?: string }> {
    try {
      let query = supabase
        .from('library_resources')
        .select(`
          *,
          uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (resourceType) {
        query = query.eq('resource_type', resourceType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching popular resources:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getPopularResources:', error);
      return { data: [], error: 'Failed to fetch popular resources' };
    }
  },

  // Get recently added resources
  async getRecentResources(
    resourceType?: string,
    limit: number = 10
  ): Promise<{ data: LibraryResource[]; error?: string }> {
    try {
      let query = supabase
        .from('library_resources')
        .select(`
          *,
          uploader:profiles!library_resources_uploaded_by_fkey(id, full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (resourceType) {
        query = query.eq('resource_type', resourceType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recent resources:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getRecentResources:', error);
      return { data: [], error: 'Failed to fetch recent resources' };
    }
  },

  // Get resource categories
  async getCategories(): Promise<{ data: Array<{ category: string; count: number }>; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('library_resources')
        .select('category')
        .eq('status', 'active')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        return { data: [], error: error.message };
      }

      // Count categories
      const categoryCount = data?.reduce((acc, item) => {
        const category = item.category;
        if (category) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const categories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      return { data: categories };
    } catch (error) {
      console.error('Error in getCategories:', error);
      return { data: [], error: 'Failed to fetch categories' };
    }
  },

  // Get library statistics
  async getLibraryStats(): Promise<{ 
    data: {
      total_resources: number;
      total_views: number;
      total_downloads: number;
      resources_by_type: Record<string, number>;
      top_authors: Array<{ author: string; resource_count: number }>;
      recent_activity_count: number;
    } | null; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .rpc('get_library_statistics');

      if (error) {
        console.error('Error fetching library stats:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getLibraryStats:', error);
      return { data: null, error: 'Failed to fetch library statistics' };
    }
  }
};

export default libraryApi;