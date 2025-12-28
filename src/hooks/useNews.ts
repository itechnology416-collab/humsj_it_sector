import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface NewsArticle {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  published_at?: string;
  scheduled_for?: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  featured_image_url?: string;
  views: number;
  comments: number;
  language: string;
  author_name?: string;
}

export interface CreateNewsData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  is_pinned?: boolean;
  featured_image_url?: string;
  language?: string;
  scheduled_for?: string;
}

// Mock data for development
const mockNews: NewsArticle[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    title: 'Upcoming Ramadan Preparation Workshop',
    excerpt: 'Join us for a comprehensive workshop on preparing for the holy month of Ramadan',
    content: '<p>We are excited to announce our upcoming Ramadan preparation workshop...</p>',
    author_id: 'user1',
    status: 'published',
    published_at: '2024-12-20T00:00:00Z',
    category: 'Events',
    tags: ['ramadan', 'workshop', 'preparation'],
    is_pinned: true,
    views: 234,
    comments: 12,
    language: 'English',
    author_name: 'Admin User'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    title: 'New Prayer Room Guidelines',
    excerpt: 'Updated guidelines for using the prayer room facilities',
    content: '<p>Please note the following updated guidelines for prayer room usage...</p>',
    author_id: 'user2',
    status: 'published',
    published_at: '2024-12-19T00:00:00Z',
    category: 'Announcements',
    tags: ['prayer', 'guidelines', 'facilities'],
    is_pinned: false,
    views: 156,
    comments: 8,
    language: 'English',
    author_name: 'Facility Manager'
  },
  {
    id: '3',
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
    title: 'IT Committee Meeting Results',
    excerpt: 'Summary of decisions made in the latest IT committee meeting',
    content: '<p>The IT committee met on December 15th to discuss various technical initiatives...</p>',
    author_id: 'user3',
    status: 'draft',
    category: 'Committee Updates',
    tags: ['it', 'committee', 'meeting'],
    is_pinned: false,
    views: 0,
    comments: 0,
    language: 'English',
    author_name: 'IT Head'
  }
];

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchNews = useCallback(async (filters?: {
    status?: string;
    category?: string;
    language?: string;
    pinned_only?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('News tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredNews = [...mockNews];
        
        if (filters?.status && filters.status !== 'all') {
          filteredNews = filteredNews.filter(article => article.status === filters.status);
        }
        if (filters?.category && filters.category !== 'all') {
          filteredNews = filteredNews.filter(article => article.category === filters.category);
        }
        if (filters?.language && filters.language !== 'all') {
          filteredNews = filteredNews.filter(article => article.language === filters.language);
        }
        if (filters?.pinned_only) {
          filteredNews = filteredNews.filter(article => article.is_pinned);
        }
        
        setArticles(filteredNews);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('news_articles')
        .select(`
          *,
          profiles!news_articles_author_id_fkey(full_name)
        `);

      // Apply access control
      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }
      if (filters?.pinned_only) {
        query = query.eq('is_pinned', true);
      }

      // Order by pinned first, then by published date
      query = query.order('is_pinned', { ascending: false })
                   .order('published_at', { ascending: false });

      const { data: newsData, error: newsError } = await query;

      if (newsError) throw newsError;

      const formattedNews: NewsArticle[] = (newsData || []).map(article => ({
        ...article,
        author_name: article.profiles?.full_name || 'Unknown Author'
      }));

      setArticles(formattedNews);

    } catch (err: unknown) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
      
      // Fallback to mock data
      setUseMockData(true);
      setArticles(mockNews);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createArticle = useCallback(async (articleData: CreateNewsData): Promise<NewsArticle | null> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create articles');
      }

      if (!isAdmin) {
        throw new Error('Only admins can create news articles');
      }

      // Get user's profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      if (useMockData) {
        const newArticle: NewsArticle = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...articleData,
          author_id: profile.id,
          status: articleData.scheduled_for ? 'scheduled' : 'draft',
          language: articleData.language || 'English',
          tags: articleData.tags || [],
          is_pinned: articleData.is_pinned || false,
          views: 0,
          comments: 0,
          author_name: profile.full_name || 'Current User'
        };
        
        setArticles(prev => [newArticle, ...prev]);
        toast.success('Article created successfully! (Mock data)');
        return newArticle;
      }

      const { data, error } = await supabase
        .from('news_articles')
        .insert([{
          ...articleData,
          author_id: profile.id,
          status: articleData.scheduled_for ? 'scheduled' : 'draft',
          language: articleData.language || 'English',
          tags: articleData.tags || [],
          is_pinned: articleData.is_pinned || false,
          views: 0,
          comments: 0
        }])
        .select(`
          *,
          profiles!news_articles_author_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newArticle: NewsArticle = {
        ...data,
        author_name: data.profiles?.full_name || 'Unknown Author'
      };

      setArticles(prev => [newArticle, ...prev]);
      toast.success(articleData.scheduled_for ? 'Article scheduled successfully!' : 'Article created successfully!');
      return newArticle;

    } catch (err: unknown) {
      console.error('Error creating article:', err);
      toast.error(err.message || 'Failed to create article');
      return null;
    }
  }, [user, isAdmin, useMockData]);

  const updateArticle = useCallback(async (articleId: string, updates: Partial<CreateNewsData>): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update articles');
      }

      if (useMockData) {
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, ...updates, updated_at: new Date().toISOString() } 
            : article
        ));
        toast.success('Article updated successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('news_articles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, ...updates, updated_at: new Date().toISOString() } 
          : article
      ));

      toast.success('Article updated successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error updating article:', err);
      toast.error(err.message || 'Failed to update article');
      return false;
    }
  }, [isAdmin, useMockData]);

  const deleteArticle = useCallback(async (articleId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete articles');
      }

      if (useMockData) {
        setArticles(prev => prev.filter(article => article.id !== articleId));
        toast.success('Article deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.filter(article => article.id !== articleId));
      toast.success('Article deleted successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error deleting article:', err);
      toast.error(err.message || 'Failed to delete article');
      return false;
    }
  }, [isAdmin, useMockData]);

  const publishArticle = useCallback(async (articleId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can publish articles');
      }

      if (useMockData) {
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { 
                ...article, 
                status: 'published', 
                published_at: new Date().toISOString()
              } 
            : article
        ));
        toast.success('Article published successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('news_articles')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              status: 'published', 
              published_at: new Date().toISOString()
            } 
          : article
      ));

      toast.success('Article published successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error publishing article:', err);
      toast.error(err.message || 'Failed to publish article');
      return false;
    }
  }, [isAdmin, useMockData]);

  const unpublishArticle = useCallback(async (articleId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can unpublish articles');
      }

      if (useMockData) {
        setArticles(prev => prev.map(article => 
          article.id === articleId ? { ...article, status: 'draft' } : article
        ));
        toast.success('Article unpublished successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('news_articles')
        .update({ status: 'draft' })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.map(article => 
        article.id === articleId ? { ...article, status: 'draft' } : article
      ));

      toast.success('Article unpublished successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error unpublishing article:', err);
      toast.error(err.message || 'Failed to unpublish article');
      return false;
    }
  }, [isAdmin, useMockData]);

  const togglePin = useCallback(async (articleId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can pin/unpin articles');
      }

      const article = articles.find(a => a.id === articleId);
      if (!article) return false;

      const newPinnedState = !article.is_pinned;

      if (useMockData) {
        setArticles(prev => prev.map(a => 
          a.id === articleId ? { ...a, is_pinned: newPinnedState } : a
        ));
        toast.success(`Article ${newPinnedState ? 'pinned' : 'unpinned'} successfully! (Mock data)`);
        return true;
      }

      const { error } = await supabase
        .from('news_articles')
        .update({ is_pinned: newPinnedState })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.map(a => 
        a.id === articleId ? { ...a, is_pinned: newPinnedState } : a
      ));

      toast.success(`Article ${newPinnedState ? 'pinned' : 'unpinned'} successfully!`);
      return true;

    } catch (err: unknown) {
      console.error('Error toggling pin:', err);
      toast.error(err.message || 'Failed to toggle pin');
      return false;
    }
  }, [isAdmin, articles, useMockData]);

  const trackView = useCallback(async (articleId: string): Promise<void> => {
    try {
      if (useMockData) {
        setArticles(prev => prev.map(article => 
          article.id === articleId ? { ...article, views: article.views + 1 } : article
        ));
        return;
      }

      const { error } = await supabase
        .from('news_articles')
        .update({
          views: supabase.sql`views + 1`
        })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.map(article => 
        article.id === articleId ? { ...article, views: article.views + 1 } : article
      ));

    } catch (err: unknown) {
      console.error('Error tracking view:', err);
    }
  }, [useMockData]);

  const getPublishedArticles = useCallback(() => {
    return articles.filter(article => article.status === 'published');
  }, [articles]);

  const getPinnedArticles = useCallback(() => {
    return articles.filter(article => article.is_pinned && article.status === 'published');
  }, [articles]);

  const getArticlesByCategory = useCallback((category: string) => {
    return articles.filter(article => 
      article.category === category && article.status === 'published'
    );
  }, [articles]);

  const getNewsStats = useCallback(() => {
    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      scheduledArticles: articles.filter(a => a.status === 'scheduled').length,
      pinnedArticles: articles.filter(a => a.is_pinned).length,
      totalViews: articles.reduce((sum, a) => sum + a.views, 0),
      totalComments: articles.reduce((sum, a) => sum + a.comments, 0),
      categoryCounts: articles.reduce((acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [articles]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    // Data
    articles,
    publishedArticles: getPublishedArticles(),
    pinnedArticles: getPinnedArticles(),
    stats: getNewsStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchNews,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    togglePin,
    trackView,
    
    // Utilities
    getArticlesByCategory,
    refetch: fetchNews,
    clearError: () => setError(null)
  };
};

export default useNews;