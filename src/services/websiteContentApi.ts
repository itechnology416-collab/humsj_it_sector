import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analyticsApi } from './analyticsApi';

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  schema_definition: Record<string, unknown>;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteContent {
  id: string;
  title: string;
  slug: string;
  content_type_id: string;
  category_id?: string;
  content?: string;
  excerpt?: string;
  metadata: Record<string, unknown>;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  featured_image_url?: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  language: string;
  author_id?: string;
  reviewer_id?: string;
  published_at?: string;
  scheduled_at?: string;
  view_count: number;
  like_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  content_type?: ContentType;
  category?: ContentCategory;
  author?: { full_name: string; email: string };
  reviewer?: { full_name: string; email: string };
}

export interface ContentTranslation {
  id: string;
  original_content_id: string;
  language: string;
  title: string;
  content?: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  translator_id?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentRevision {
  id: string;
  content_id: string;
  title: string;
  content?: string;
  excerpt?: string;
  metadata: Record<string, unknown>;
  revision_number: number;
  change_summary?: string;
  created_by?: string;
  created_at: string;
}

export interface ContentReview {
  id: string;
  content_id: string;
  reviewer_id: string;
  review_type: 'approval' | 'feedback' | 'correction';
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  suggested_changes: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  usage_count: number;
  created_at: string;
}

class WebsiteContentApiService {
  // Content Types
  async getContentTypes(): Promise<ContentType[]> {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching content types:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content types');
    }
  }

  async createContentType(typeData: {
    name: string;
    description?: string;
    schema_definition?: Record<string, unknown>;
  }): Promise<ContentType> {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .insert([typeData])
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_type_created', 'content_management', {
        type_name: typeData.name
      });

      return data;
    } catch (error) {
      console.error('Error creating content type:', error);
      throw errorHandler.handleError(error, 'Failed to create content type');
    }
  }

  // Content Categories
  async getContentCategories(): Promise<ContentCategory[]> {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching content categories:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content categories');
    }
  }

  async createContentCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    parent_id?: string;
    sort_order?: number;
  }): Promise<ContentCategory> {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_category_created', 'content_management', {
        category_name: categoryData.name,
        category_slug: categoryData.slug
      });

      return data;
    } catch (error) {
      console.error('Error creating content category:', error);
      throw errorHandler.handleError(error, 'Failed to create content category');
    }
  }

  // Website Content
  async getWebsiteContent(filters: {
    status?: string;
    language?: string;
    category_id?: string;
    content_type_id?: string;
    author_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ content: WebsiteContent[]; total: number }> {
    try {
      let query = supabase
        .from('website_content')
        .select(`
          *,
          content_type:content_types(*),
          category:content_categories(*),
          author:profiles!website_content_author_id_fkey(full_name, email),
          reviewer:profiles!website_content_reviewer_id_fkey(full_name, email)
        `, { count: 'exact' })
        .order('updated_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.content_type_id) {
        query = query.eq('content_type_id', filters.content_type_id);
      }
      if (filters.author_id) {
        query = query.eq('author_id', filters.author_id);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
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
      console.error('Error fetching website content:', error);
      throw errorHandler.handleError(error, 'Failed to fetch website content');
    }
  }

  async getContentById(contentId: string): Promise<WebsiteContent> {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select(`
          *,
          content_type:content_types(*),
          category:content_categories(*),
          author:profiles!website_content_author_id_fkey(full_name, email),
          reviewer:profiles!website_content_reviewer_id_fkey(full_name, email)
        `)
        .eq('id', contentId)
        .single();

      if (error) throw error;

      // Update view count
      await supabase.rpc('update_content_view_count', { content_uuid: contentId });

      return data;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content');
    }
  }

  async createContent(contentData: {
    title: string;
    slug: string;
    content_type_id: string;
    category_id?: string;
    content?: string;
    excerpt?: string;
    metadata?: Record<string, unknown>;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string[];
    featured_image_url?: string;
    language?: string;
    status?: 'draft' | 'review' | 'published';
    scheduled_at?: string;
  }): Promise<WebsiteContent> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('website_content')
        .insert([{
          ...contentData,
          author_id: user.user?.id,
          language: contentData.language || 'en',
          status: contentData.status || 'draft'
        }])
        .select(`
          *,
          content_type:content_types(*),
          category:content_categories(*),
          author:profiles!website_content_author_id_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_created', 'content_management', {
        content_id: data.id,
        content_type: data.content_type?.name,
        language: data.language,
        status: data.status
      });

      return data;
    } catch (error) {
      console.error('Error creating content:', error);
      throw errorHandler.handleError(error, 'Failed to create content');
    }
  }

  async updateContent(contentId: string, updates: Partial<WebsiteContent>): Promise<WebsiteContent> {
    try {
      // Create revision before updating
      const currentContent = await this.getContentById(contentId);
      await this.createContentRevision(contentId, currentContent, 'Content updated');

      const { data, error } = await supabase
        .from('website_content')
        .update(updates)
        .eq('id', contentId)
        .select(`
          *,
          content_type:content_types(*),
          category:content_categories(*),
          author:profiles!website_content_author_id_fkey(full_name, email),
          reviewer:profiles!website_content_reviewer_id_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_updated', 'content_management', {
        content_id: contentId,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw errorHandler.handleError(error, 'Failed to update content');
    }
  }

  async deleteContent(contentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      await analyticsApi.trackEvent('content_deleted', 'content_management', {
        content_id: contentId
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      throw errorHandler.handleError(error, 'Failed to delete content');
    }
  }

  async publishContent(contentId: string): Promise<WebsiteContent> {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select(`
          *,
          content_type:content_types(*),
          category:content_categories(*)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_published', 'content_management', {
        content_id: contentId,
        content_title: data.title
      });

      return data;
    } catch (error) {
      console.error('Error publishing content:', error);
      throw errorHandler.handleError(error, 'Failed to publish content');
    }
  }

  // Content Translations
  async getContentTranslations(originalContentId: string): Promise<ContentTranslation[]> {
    try {
      const { data, error } = await supabase
        .from('content_translations')
        .select('*')
        .eq('original_content_id', originalContentId)
        .order('language');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching content translations:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content translations');
    }
  }

  async createContentTranslation(translationData: {
    original_content_id: string;
    language: string;
    title: string;
    content?: string;
    excerpt?: string;
    seo_title?: string;
    seo_description?: string;
  }): Promise<ContentTranslation> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('content_translations')
        .insert([{
          ...translationData,
          translator_id: user.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_translation_created', 'content_management', {
        original_content_id: translationData.original_content_id,
        language: translationData.language
      });

      return data;
    } catch (error) {
      console.error('Error creating content translation:', error);
      throw errorHandler.handleError(error, 'Failed to create content translation');
    }
  }

  // Content Revisions
  async getContentRevisions(contentId: string): Promise<ContentRevision[]> {
    try {
      const { data, error } = await supabase
        .from('content_revisions')
        .select(`
          *,
          created_by_profile:profiles!content_revisions_created_by_fkey(full_name, email)
        `)
        .eq('content_id', contentId)
        .order('revision_number', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching content revisions:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content revisions');
    }
  }

  private async createContentRevision(
    contentId: string,
    currentContent: WebsiteContent,
    changeSummary?: string
  ): Promise<ContentRevision> {
    try {
      // Get the next revision number
      const { data: revisions } = await supabase
        .from('content_revisions')
        .select('revision_number')
        .eq('content_id', contentId)
        .order('revision_number', { ascending: false })
        .limit(1);

      const nextRevisionNumber = (revisions?.[0]?.revision_number || 0) + 1;

      const { data: user } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('content_revisions')
        .insert([{
          content_id: contentId,
          title: currentContent.title,
          content: currentContent.content,
          excerpt: currentContent.excerpt,
          metadata: currentContent.metadata,
          revision_number: nextRevisionNumber,
          change_summary: changeSummary,
          created_by: user.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating content revision:', error);
      throw errorHandler.handleError(error, 'Failed to create content revision');
    }
  }

  // Content Reviews
  async createContentReview(reviewData: {
    content_id: string;
    review_type: 'approval' | 'feedback' | 'correction';
    comments?: string;
    suggested_changes?: Record<string, unknown>;
  }): Promise<ContentReview> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('content_reviews')
        .insert([{
          ...reviewData,
          reviewer_id: user.user?.id,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('content_review_created', 'content_management', {
        content_id: reviewData.content_id,
        review_type: reviewData.review_type
      });

      return data;
    } catch (error) {
      console.error('Error creating content review:', error);
      throw errorHandler.handleError(error, 'Failed to create content review');
    }
  }

  async updateContentReviewStatus(
    reviewId: string,
    status: 'approved' | 'rejected'
  ): Promise<ContentReview> {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .update({ status })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      // If approved, update the content status
      if (status === 'approved' && data.review_type === 'approval') {
        await this.updateContent(data.content_id, { status: 'published' });
      }

      return data;
    } catch (error) {
      console.error('Error updating content review status:', error);
      throw errorHandler.handleError(error, 'Failed to update content review status');
    }
  }

  // Content Tags
  async getContentTags(): Promise<ContentTag[]> {
    try {
      const { data, error } = await supabase
        .from('content_tags')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching content tags:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content tags');
    }
  }

  async createContentTag(tagData: {
    name: string;
    slug: string;
    description?: string;
    color?: string;
  }): Promise<ContentTag> {
    try {
      const { data, error } = await supabase
        .from('content_tags')
        .insert([tagData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating content tag:', error);
      throw errorHandler.handleError(error, 'Failed to create content tag');
    }
  }

  async addTagToContent(contentId: string, tagId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_tag_relations')
        .insert([{ content_id: contentId, tag_id: tagId }]);

      if (error) throw error;

      // Update tag usage count
      await supabase
        .from('content_tags')
        .update({ usage_count: supabase.sql`usage_count + 1` })
        .eq('id', tagId);
    } catch (error) {
      console.error('Error adding tag to content:', error);
      throw errorHandler.handleError(error, 'Failed to add tag to content');
    }
  }

  // Content Analytics
  async getContentAnalytics(filters: {
    content_id?: string;
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month';
  } = {}): Promise<Array<{
    date: string;
    views: number;
    likes: number;
    shares: number;
    content_id?: string;
  }>> {
    try {
      // This would typically come from analytics events
      const { events } = await analyticsApi.getAnalyticsEvents({
        event_category: 'content_interaction',
        start_date: filters.start_date,
        end_date: filters.end_date
      });

      // Group and aggregate the data
      const grouped = events.reduce((acc: Record<string, unknown>, event) => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        const key = filters.content_id ? date : `${date}-${event.event_data.content_id}`;
        
        if (!acc[key]) {
          acc[key] = {
            date,
            views: 0,
            likes: 0,
            shares: 0,
            ...(filters.content_id ? {} : { content_id: event.event_data.content_id })
          };
        }
        
        if (event.event_type === 'content_view') acc[key].views++;
        if (event.event_type === 'content_like') acc[key].likes++;
        if (event.event_type === 'content_share') acc[key].shares++;
        
        return acc;
      }, {});

      return Object.values(grouped);
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      throw errorHandler.handleError(error, 'Failed to fetch content analytics');
    }
  }

  // Bulk Operations
  async bulkUpdateContentStatus(
    contentIds: string[],
    status: 'draft' | 'review' | 'published' | 'archived'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ status })
        .in('id', contentIds);

      if (error) throw error;

      await analyticsApi.trackEvent('content_bulk_update', 'content_management', {
        content_count: contentIds.length,
        new_status: status
      });
    } catch (error) {
      console.error('Error bulk updating content status:', error);
      throw errorHandler.handleError(error, 'Failed to bulk update content status');
    }
  }

  async bulkDeleteContent(contentIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .in('id', contentIds);

      if (error) throw error;

      await analyticsApi.trackEvent('content_bulk_delete', 'content_management', {
        content_count: contentIds.length
      });
    } catch (error) {
      console.error('Error bulk deleting content:', error);
      throw errorHandler.handleError(error, 'Failed to bulk delete content');
    }
  }
}

export const websiteContentApi = new WebsiteContentApiService();