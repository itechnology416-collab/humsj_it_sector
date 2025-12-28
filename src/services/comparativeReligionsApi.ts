import { supabase } from '@/integrations/supabase/client';

export interface ComparativeResource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'video' | 'audio' | 'pdf' | 'article' | 'course';
  category: string;
  religions_compared: string[];
  author: string;
  duration?: string;
  pages?: number;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  file_size?: string;
  preview_url?: string;
  download_url: string;
  is_free: boolean;
  is_featured: boolean;
  publication_date: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Scholar {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  biography: string;
  education: string[];
  publications: number;
  languages: string[];
  image_url: string;
  contact_info?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResourceFilters {
  category?: string;
  type?: string;
  difficulty?: string;
  religion?: string;
  language?: string;
  is_free?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface DownloadRecord {
  id: string;
  resource_id: string;
  user_id: string;
  downloaded_at: string;
  ip_address?: string;
  user_agent?: string;
}

// Fetch comparative religion resources
export const fetchComparativeResources = async (filters: ResourceFilters = {}): Promise<{
  data: ComparativeResource[];
  total: number;
  error?: string;
}> => {
  try {
    let query = supabase
      .from('comparative_resources')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.category && filters.category !== 'All Categories') {
      query = query.eq('category', filters.category);
    }

    if (filters.type && filters.type !== 'All Types') {
      query = query.eq('type', filters.type);
    }

    if (filters.difficulty && filters.difficulty !== 'All Levels') {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters.language) {
      query = query.eq('language', filters.language);
    }

    if (filters.is_free !== undefined) {
      query = query.eq('is_free', filters.is_free);
    }

    if (filters.religion && filters.religion !== 'All Religions') {
      query = query.contains('religions_compared', [filters.religion]);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    // Order by featured first, then by downloads
    query = query.order('is_featured', { ascending: false })
                 .order('downloads', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Fetch resources error:', error);
      return {
        data: [],
        total: 0,
        error: 'Failed to fetch resources'
      };
    }

    return {
      data: data || [],
      total: count || 0
    };

  } catch (error) {
    console.error('Fetch resources error:', error);
    return {
      data: [],
      total: 0,
      error: 'An error occurred while fetching resources'
    };
  }
};

// Fetch featured resources
export const fetchFeaturedResources = async (limit: number = 6): Promise<{
  data: ComparativeResource[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('comparative_resources')
      .select('*')
      .eq('is_featured', true)
      .order('downloads', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Fetch featured resources error:', error);
      return {
        data: [],
        error: 'Failed to fetch featured resources'
      };
    }

    return {
      data: data || []
    };

  } catch (error) {
    console.error('Fetch featured resources error:', error);
    return {
      data: [],
      error: 'An error occurred while fetching featured resources'
    };
  }
};

// Fetch scholars
export const fetchScholars = async (limit?: number): Promise<{
  data: Scholar[];
  error?: string;
}> => {
  try {
    let query = supabase
      .from('comparative_scholars')
      .select('*')
      .order('publications', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch scholars error:', error);
      return {
        data: [],
        error: 'Failed to fetch scholars'
      };
    }

    return {
      data: data || []
    };

  } catch (error) {
    console.error('Fetch scholars error:', error);
    return {
      data: [],
      error: 'An error occurred while fetching scholars'
    };
  }
};

// Record resource download
export const recordResourceDownload = async (
  resourceId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Record download in downloads table
    const downloadRecord = {
      resource_id: resourceId,
      user_id: userId,
      downloaded_at: new Date().toISOString(),
      ip_address: await getUserIP(),
      user_agent: navigator.userAgent
    };

    const { error: downloadError } = await supabase
      .from('resource_downloads')
      .insert(downloadRecord);

    if (downloadError) {
      console.error('Record download error:', downloadError);
    }

    // Increment download count
    const { error: updateError } = await supabase
      .from('comparative_resources')
      .update({ 
        downloads: supabase.sql`downloads + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', resourceId);

    if (updateError) {
      console.error('Update download count error:', updateError);
      return {
        success: false,
        error: 'Failed to update download count'
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Record download error:', error);
    return {
      success: false,
      error: 'An error occurred while recording download'
    };
  }
};

// Get user's download history
export const getUserDownloadHistory = async (
  userId: string,
  limit: number = 50
): Promise<{
  data: (DownloadRecord & { resource: ComparativeResource })[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('resource_downloads')
      .select(`
        *,
        resource:comparative_resources(*)
      `)
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Fetch download history error:', error);
      return {
        data: [],
        error: 'Failed to fetch download history'
      };
    }

    return {
      data: data || []
    };

  } catch (error) {
    console.error('Fetch download history error:', error);
    return {
      data: [],
      error: 'An error occurred while fetching download history'
    };
  }
};

// Rate a resource
export const rateResource = async (
  resourceId: string,
  userId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: 'Rating must be between 1 and 5'
      };
    }

    // Insert or update rating
    const { error } = await supabase
      .from('resource_ratings')
      .upsert({
        resource_id: resourceId,
        user_id: userId,
        rating,
        review,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Rate resource error:', error);
      return {
        success: false,
        error: 'Failed to submit rating'
      };
    }

    // Update average rating
    await updateResourceAverageRating(resourceId);

    return { success: true };

  } catch (error) {
    console.error('Rate resource error:', error);
    return {
      success: false,
      error: 'An error occurred while submitting rating'
    };
  }
};

// Update resource average rating
const updateResourceAverageRating = async (resourceId: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('resource_ratings')
      .select('rating')
      .eq('resource_id', resourceId);

    if (error || !data || data.length === 0) {
      return;
    }

    const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / data.length;

    await supabase
      .from('comparative_resources')
      .update({ 
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        updated_at: new Date().toISOString()
      })
      .eq('id', resourceId);

  } catch (error) {
    console.error('Update average rating error:', error);
  }
};

// Get resource statistics
export const getResourceStatistics = async (): Promise<{
  data: {
    totalResources: number;
    totalDownloads: number;
    totalScholars: number;
    categoryCounts: Record<string, number>;
    typeCounts: Record<string, number>;
    languageCounts: Record<string, number>;
  };
  error?: string;
}> => {
  try {
    // Get total counts
    const [resourcesResult, downloadsResult, scholarsResult] = await Promise.all([
      supabase.from('comparative_resources').select('*', { count: 'exact', head: true }),
      supabase.from('resource_downloads').select('*', { count: 'exact', head: true }),
      supabase.from('comparative_scholars').select('*', { count: 'exact', head: true })
    ]);

    // Get category counts
    const { data: categoryData } = await supabase
      .from('comparative_resources')
      .select('category');

    // Get type counts
    const { data: typeData } = await supabase
      .from('comparative_resources')
      .select('type');

    // Get language counts
    const { data: languageData } = await supabase
      .from('comparative_resources')
      .select('language');

    const categoryCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const languageCounts: Record<string, number> = {};

    categoryData?.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    typeData?.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    languageData?.forEach(item => {
      languageCounts[item.language] = (languageCounts[item.language] || 0) + 1;
    });

    return {
      data: {
        totalResources: resourcesResult.count || 0,
        totalDownloads: downloadsResult.count || 0,
        totalScholars: scholarsResult.count || 0,
        categoryCounts,
        typeCounts,
        languageCounts
      }
    };

  } catch (error) {
    console.error('Get statistics error:', error);
    return {
      data: {
        totalResources: 0,
        totalDownloads: 0,
        totalScholars: 0,
        categoryCounts: {},
        typeCounts: {},
        languageCounts: {}
      },
      error: 'An error occurred while fetching statistics'
    };
  }
};

// Search resources with advanced filters
export const searchResources = async (
  searchQuery: string,
  filters: ResourceFilters = {}
): Promise<{
  data: ComparativeResource[];
  total: number;
  error?: string;
}> => {
  try {
    let query = supabase
      .from('comparative_resources')
      .select('*', { count: 'exact' });

    // Full-text search
    if (searchQuery) {
      query = query.or(`
        title.ilike.%${searchQuery}%,
        description.ilike.%${searchQuery}%,
        author.ilike.%${searchQuery}%,
        tags.cs.{${searchQuery}}
      `);
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All Categories' && value !== 'All Types' && value !== 'All Levels') {
        if (key === 'religion' && value !== 'All Religions') {
          query = query.contains('religions_compared', [value]);
        } else if (key !== 'search' && key !== 'limit' && key !== 'offset') {
          query = query.eq(key, value);
        }
      }
    });

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    // Order by relevance (featured first, then by downloads)
    query = query.order('is_featured', { ascending: false })
                 .order('downloads', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Search resources error:', error);
      return {
        data: [],
        total: 0,
        error: 'Failed to search resources'
      };
    }

    return {
      data: data || [],
      total: count || 0
    };

  } catch (error) {
    console.error('Search resources error:', error);
    return {
      data: [],
      total: 0,
      error: 'An error occurred while searching resources'
    };
  }
};

// Helper function to get user IP
const getUserIP = async (): Promise<string | undefined> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Get IP error:', error);
    return undefined;
  }
};

// Export all functions
export default {
  fetchComparativeResources,
  fetchFeaturedResources,
  fetchScholars,
  recordResourceDownload,
  getUserDownloadHistory,
  rateResource,
  getResourceStatistics,
  searchResources
};