import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analytics } from './analytics';

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
  created_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type_id: string;
  content: Record<string, unknown>;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  author_id?: string;
  published_at?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  content_type?: ContentType;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateContentData {
  title: string;
  content_type_id: string;
  content: Record<string, unknown>;
  excerpt?: string;
  featured_image_url?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
  seo_title?: string;
  seo_description?: string;
}

class ContentApiService {
  // =============================================
  // CONTENT TYPES
  // =============================================

  async getContentTypes(): Promise<ContentType[]> {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_content_types' }
      });
      throw error;
    }
  }

  async createContentType(name: string, description?: string, schema?: Record<string, unknown>): Promise<ContentType> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('content_types')
        .insert({
          name,
          description,
          schema
        })
        .select()
        .single();

      if (error) throw error;

      analytics.track('content_type_created', {
        content_type_id: data.id,
        name
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'create_content_type', name }
      });
      throw error;
    }
  }

  // =============================================
  // CONTENT ITEMS
  // =============================================

  async getContentItems(filters?: {
    type?: string;
    status?: string;
    author?: string;
    search?: string;
    featured?: boolean;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        // Default to published content only
        query = query.eq('status', 'published');
      }

      if (filters?.type) {
        query = query.eq('content_type_id', filters.type);
      }

      if (filters?.author) {
        query = query.eq('author_id', filters.author);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      query = query.order('published_at', { ascending: false, nullsFirst: false });

      const { data, error } = await query;

      if (error) throw error;

      analytics.track('content_items_fetched', {
        count: data?.length || 0,
        filters
      });

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_content_items', filters }
      });
      throw error;
    }
  }

  async getContentItemById(id: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      analytics.track('content_item_viewed', {
        content_id: id,
        content_title: data?.title,
        content_type: data?.content_type?.name
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_content_item', content_id: id }
      });
      throw error;
    }
  }

  async getContentItemBySlug(slug: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      analytics.track('content_item_viewed', {
        content_id: data?.id,
        content_title: data?.title,
        content_slug: slug,
        content_type: data?.content_type?.name
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_content_item_by_slug', slug }
      });
      throw error;
    }
  }

  async createContentItem(contentData: CreateContentData): Promise<ContentItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate slug from title
      const slug = contentData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const contentPayload = {
        ...contentData,
        slug,
        author_id: user.id,
        status: contentData.status || 'draft',
        is_featured: contentData.is_featured || false,
        published_at: contentData.status === 'published' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('content_items')
        .insert(contentPayload)
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('content_item_created', {
        content_id: data.id,
        content_title: data.title,
        content_type: data.content_type?.name,
        status: data.status
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'create_content_item', content_data: contentData }
      });
      throw error;
    }
  }

  async updateContentItem(id: string, updates: Partial<CreateContentData>): Promise<ContentItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update published_at if status is being changed to published
      const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.status === 'published') {
        updatePayload.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('content_items')
        .update(updatePayload)
        .eq('id', id)
        .eq('author_id', user.id)
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('content_item_updated', {
        content_id: id,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'update_content_item', content_id: id, updates }
      });
      throw error;
    }
  }

  async deleteContentItem(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id)
        .eq('author_id', user.id);

      if (error) throw error;

      analytics.track('content_item_deleted', {
        content_id: id
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'delete_content_item', content_id: id }
      });
      throw error;
    }
  }

  // =============================================
  // CONTENT SEARCH & FILTERING
  // =============================================

  async searchContent(query: string, filters?: {
    type?: string;
    tags?: string[];
    limit?: number;
  }): Promise<ContentItem[]> {
    try {
      let searchQuery = supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content->>'body'.ilike.%${query}%`);

      if (filters?.type) {
        searchQuery = searchQuery.eq('content_type_id', filters.type);
      }

      if (filters?.tags && filters.tags.length > 0) {
        searchQuery = searchQuery.overlaps('tags', filters.tags);
      }

      if (filters?.limit) {
        searchQuery = searchQuery.limit(filters.limit);
      }

      searchQuery = searchQuery.order('published_at', { ascending: false });

      const { data, error } = await searchQuery;

      if (error) throw error;

      analytics.track('content_searched', {
        query,
        results_count: data?.length || 0,
        filters
      });

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'search_content', query, filters }
      });
      throw error;
    }
  }

  async getFeaturedContent(limit = 5): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_featured_content', limit }
      });
      throw error;
    }
  }

  async getContentByTags(tags: string[], limit = 10): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          content_type:content_types(*),
          author:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .overlaps('tags', tags)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_content_by_tags', tags, limit }
      });
      throw error;
    }
  }

  // =============================================
  // CONTENT ANALYTICS
  // =============================================

  async getContentStats(contentId?: string): Promise<{
    total_views: number;
    unique_views: number;
    engagement_rate: number;
    popular_tags: string[];
  }> {
    try {
      // This would typically aggregate from user_activity_logs
      // For now, return mock data structure
      return {
        total_views: 0,
        unique_views: 0,
        engagement_rate: 0,
        popular_tags: []
      };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_content_stats', content_id: contentId }
      });
      throw error;
    }
  }
}

export const contentApi = new ContentApiService();