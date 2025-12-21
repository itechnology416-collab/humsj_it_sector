import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WebsitePage {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  page_type: 'page' | 'article' | 'section' | 'media';
  status: 'published' | 'draft' | 'review' | 'archived';
  language: string;
  parent_page_id?: string;
  author_id: string;
  last_modified_by?: string;
  meta_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  published_at?: string;
  views: number;
  category?: string;
  tags: string[];
  author_name?: string;
  modifier_name?: string;
  parent_page_title?: string;
}

export interface CreatePageData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  page_type?: WebsitePage['page_type'];
  language?: string;
  parent_page_id?: string;
  meta_title?: string;
  meta_description?: string;
  category?: string;
  tags?: string[];
}

// Mock data for development
const mockPages: WebsitePage[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    title: 'About Our Organization',
    slug: 'about-us',
    content: '<h1>About Us</h1><p>We are a vibrant Islamic student organization...</p>',
    excerpt: 'Learn about our mission, vision, and values',
    page_type: 'page',
    status: 'published',
    language: 'English',
    author_id: 'user1',
    meta_title: 'About Us - Islamic Student Organization',
    meta_description: 'Learn about our Islamic student organization, our mission, and our community',
    published_at: '2024-12-20T00:00:00Z',
    views: 156,
    category: 'General',
    tags: ['about', 'organization', 'mission'],
    author_name: 'Admin User'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    title: 'Prayer Guidelines',
    slug: 'prayer-guidelines',
    content: '<h1>Prayer Guidelines</h1><p>Guidelines for congregational prayers...</p>',
    excerpt: 'Important guidelines for participating in congregational prayers',
    page_type: 'article',
    status: 'published',
    language: 'English',
    author_id: 'user2',
    published_at: '2024-12-19T00:00:00Z',
    views: 89,
    category: 'Religious',
    tags: ['prayer', 'guidelines', 'worship'],
    author_name: 'Sheikh Ahmed'
  },
  {
    id: '3',
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
    title: 'የእኛ ድርጅት ስለ',
    slug: 'about-us-amharic',
    content: '<h1>የእኛ ድርጅት ስለ</h1><p>እኛ ተለዋዋጭ የሙስሊም ተማሪዎች ድርጅት ነን...</p>',
    excerpt: 'የእኛን ተልእኮ፣ ራዕይ እና እሴቶች ይወቁ',
    page_type: 'page',
    status: 'draft',
    language: 'Amharic',
    parent_page_id: '1',
    author_id: 'user3',
    views: 0,
    category: 'General',
    tags: ['about', 'organization', 'amharic'],
    author_name: 'Translator User',
    parent_page_title: 'About Our Organization'
  }
];

export const useWebsiteContent = () => {
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('website_pages')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const fetchPages = useCallback(async (filters?: {
    status?: string;
    language?: string;
    page_type?: string;
    category?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('Website pages tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredPages = [...mockPages];
        
        if (filters?.status && filters.status !== 'all') {
          filteredPages = filteredPages.filter(page => page.status === filters.status);
        }
        if (filters?.language && filters.language !== 'all') {
          filteredPages = filteredPages.filter(page => page.language === filters.language);
        }
        if (filters?.page_type && filters.page_type !== 'all') {
          filteredPages = filteredPages.filter(page => page.page_type === filters.page_type);
        }
        if (filters?.category && filters.category !== 'all') {
          filteredPages = filteredPages.filter(page => page.category === filters.category);
        }
        
        setPages(filteredPages);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('website_pages')
        .select(`
          *,
          author:profiles!website_pages_author_id_fkey(full_name),
          modifier:profiles!website_pages_last_modified_by_fkey(full_name),
          parent_page:website_pages!website_pages_parent_page_id_fkey(title)
        `);

      // Apply access control
      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }
      if (filters?.page_type && filters.page_type !== 'all') {
        query = query.eq('page_type', filters.page_type);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      query = query.order('updated_at', { ascending: false });

      const { data: pagesData, error: pagesError } = await query;

      if (pagesError) throw pagesError;

      const formattedPages: WebsitePage[] = (pagesData || []).map(page => ({
        ...page,
        author_name: page.author?.full_name || 'Unknown Author',
        modifier_name: page.modifier?.full_name || undefined,
        parent_page_title: page.parent_page?.title || undefined
      }));

      setPages(formattedPages);

    } catch (err: any) {
      console.error('Error fetching website pages:', err);
      setError(err.message || 'Failed to fetch website pages');
      
      // Fallback to mock data
      setUseMockData(true);
      setPages(mockPages);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createPage = useCallback(async (pageData: CreatePageData): Promise<WebsitePage | null> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create pages');
      }

      if (!isAdmin) {
        throw new Error('Only admins can create website pages');
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

      // Generate slug if not provided
      const slug = pageData.slug || generateSlug(pageData.title);

      if (useMockData) {
        const newPage: WebsitePage = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...pageData,
          slug,
          page_type: pageData.page_type || 'page',
          status: 'draft',
          language: pageData.language || 'English',
          author_id: profile.id,
          tags: pageData.tags || [],
          views: 0,
          author_name: profile.full_name || 'Current User'
        };
        
        setPages(prev => [newPage, ...prev]);
        toast.success('Page created successfully! (Mock data)');
        return newPage;
      }

      // Check if slug already exists
      const { data: existingPage } = await supabase
        .from('website_pages')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingPage) {
        throw new Error('A page with this slug already exists');
      }

      const { data, error } = await supabase
        .from('website_pages')
        .insert([{
          ...pageData,
          slug,
          page_type: pageData.page_type || 'page',
          status: 'draft',
          language: pageData.language || 'English',
          author_id: profile.id,
          tags: pageData.tags || [],
          views: 0
        }])
        .select(`
          *,
          author:profiles!website_pages_author_id_fkey(full_name),
          parent_page:website_pages!website_pages_parent_page_id_fkey(title)
        `)
        .single();

      if (error) throw error;

      const newPage: WebsitePage = {
        ...data,
        author_name: data.author?.full_name || 'Unknown Author',
        parent_page_title: data.parent_page?.title || undefined
      };

      setPages(prev => [newPage, ...prev]);
      toast.success('Page created successfully!');
      return newPage;

    } catch (err: any) {
      console.error('Error creating page:', err);
      toast.error(err.message || 'Failed to create page');
      return null;
    }
  }, [user, isAdmin, useMockData]);

  const updatePage = useCallback(async (pageId: string, updates: Partial<CreatePageData>): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update pages');
      }

      // Generate new slug if title is being updated
      if (updates.title && !updates.slug) {
        updates.slug = generateSlug(updates.title);
      }

      if (useMockData) {
        setPages(prev => prev.map(page => 
          page.id === pageId 
            ? { 
                ...page, 
                ...updates, 
                updated_at: new Date().toISOString(),
                last_modified_by: user?.id
              } 
            : page
        ));
        toast.success('Page updated successfully! (Mock data)');
        return true;
      }

      // Check if new slug already exists (if slug is being updated)
      if (updates.slug) {
        const { data: existingPage } = await supabase
          .from('website_pages')
          .select('id')
          .eq('slug', updates.slug)
          .neq('id', pageId)
          .single();

        if (existingPage) {
          throw new Error('A page with this slug already exists');
        }
      }

      const { error } = await supabase
        .from('website_pages')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString(),
          last_modified_by: user?.id
        })
        .eq('id', pageId);

      if (error) throw error;

      setPages(prev => prev.map(page => 
        page.id === pageId 
          ? { 
              ...page, 
              ...updates, 
              updated_at: new Date().toISOString(),
              last_modified_by: user?.id
            } 
          : page
      ));

      toast.success('Page updated successfully!');
      return true;

    } catch (err: any) {
      console.error('Error updating page:', err);
      toast.error(err.message || 'Failed to update page');
      return false;
    }
  }, [isAdmin, user, useMockData]);

  const deletePage = useCallback(async (pageId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete pages');
      }

      if (useMockData) {
        setPages(prev => prev.filter(page => page.id !== pageId));
        toast.success('Page deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('website_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      setPages(prev => prev.filter(page => page.id !== pageId));
      toast.success('Page deleted successfully!');
      return true;

    } catch (err: any) {
      console.error('Error deleting page:', err);
      toast.error(err.message || 'Failed to delete page');
      return false;
    }
  }, [isAdmin, useMockData]);

  const publishPage = useCallback(async (pageId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can publish pages');
      }

      if (useMockData) {
        setPages(prev => prev.map(page => 
          page.id === pageId 
            ? { 
                ...page, 
                status: 'published', 
                published_at: new Date().toISOString()
              } 
            : page
        ));
        toast.success('Page published successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('website_pages')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', pageId);

      if (error) throw error;

      setPages(prev => prev.map(page => 
        page.id === pageId 
          ? { 
              ...page, 
              status: 'published', 
              published_at: new Date().toISOString()
            } 
          : page
      ));

      toast.success('Page published successfully!');
      return true;

    } catch (err: any) {
      console.error('Error publishing page:', err);
      toast.error(err.message || 'Failed to publish page');
      return false;
    }
  }, [isAdmin, useMockData]);

  const unpublishPage = useCallback(async (pageId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can unpublish pages');
      }

      if (useMockData) {
        setPages(prev => prev.map(page => 
          page.id === pageId ? { ...page, status: 'draft' } : page
        ));
        toast.success('Page unpublished successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('website_pages')
        .update({ status: 'draft' })
        .eq('id', pageId);

      if (error) throw error;

      setPages(prev => prev.map(page => 
        page.id === pageId ? { ...page, status: 'draft' } : page
      ));

      toast.success('Page unpublished successfully!');
      return true;

    } catch (err: any) {
      console.error('Error unpublishing page:', err);
      toast.error(err.message || 'Failed to unpublish page');
      return false;
    }
  }, [isAdmin, useMockData]);

  const trackView = useCallback(async (pageId: string): Promise<void> => {
    try {
      if (useMockData) {
        setPages(prev => prev.map(page => 
          page.id === pageId ? { ...page, views: page.views + 1 } : page
        ));
        return;
      }

      const { error } = await supabase
        .from('website_pages')
        .update({
          views: supabase.sql`views + 1`
        })
        .eq('id', pageId);

      if (error) throw error;

      setPages(prev => prev.map(page => 
        page.id === pageId ? { ...page, views: page.views + 1 } : page
      ));

    } catch (err: any) {
      console.error('Error tracking view:', err);
    }
  }, [useMockData]);

  const getPageBySlug = useCallback((slug: string) => {
    return pages.find(page => page.slug === slug && page.status === 'published');
  }, [pages]);

  const getPagesByLanguage = useCallback((language: string) => {
    return pages.filter(page => page.language === language && page.status === 'published');
  }, [pages]);

  const getTranslations = useCallback((pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return [];
    
    // If this page has a parent, get all translations of the parent
    const parentId = page.parent_page_id || pageId;
    return pages.filter(p => p.id === parentId || p.parent_page_id === parentId);
  }, [pages]);

  const getPageStats = useCallback(() => {
    return {
      totalPages: pages.length,
      publishedPages: pages.filter(p => p.status === 'published').length,
      draftPages: pages.filter(p => p.status === 'draft').length,
      reviewPages: pages.filter(p => p.status === 'review').length,
      archivedPages: pages.filter(p => p.status === 'archived').length,
      totalViews: pages.reduce((sum, p) => sum + p.views, 0),
      englishPages: pages.filter(p => p.language === 'English').length,
      amharicPages: pages.filter(p => p.language === 'Amharic').length,
      oromoPages: pages.filter(p => p.language === 'Afaan Oromo').length,
      arabicPages: pages.filter(p => p.language === 'Arabic').length
    };
  }, [pages]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    // Data
    pages,
    stats: getPageStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchPages,
    createPage,
    updatePage,
    deletePage,
    publishPage,
    unpublishPage,
    trackView,
    
    // Utilities
    getPageBySlug,
    getPagesByLanguage,
    getTranslations,
    generateSlug,
    refetch: fetchPages,
    clearError: () => setError(null)
  };
};

export default useWebsiteContent;