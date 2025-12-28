import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FAQItem {
  id: string;
  created_at: string;
  updated_at: string;
  question: string;
  answer: string;
  category: string;
  created_by?: string;
  status: 'published' | 'draft' | 'archived';
  sort_order: number;
  view_count: number;
  helpful_count: number;
  language: string;
  tags: string[];
  author_name?: string;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category: string;
  language?: string;
  tags?: string[];
  sort_order?: number;
}

// Mock data for development
const mockFAQs: FAQItem[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    question: 'What are the prayer times for our mosque?',
    answer: 'Prayer times vary by season and are updated regularly. Please check our prayer times page or contact the mosque directly for the most current schedule.',
    category: 'Prayer & Worship',
    status: 'published',
    sort_order: 1,
    view_count: 156,
    helpful_count: 23,
    language: 'English',
    tags: ['prayer', 'times', 'schedule'],
    author_name: 'Admin User'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    question: 'How can I become a member of the organization?',
    answer: 'To become a member, you can submit a membership request through our website or contact an admin directly. You will need to provide your basic information and university details.',
    category: 'Membership',
    status: 'published',
    sort_order: 2,
    view_count: 89,
    helpful_count: 15,
    language: 'English',
    tags: ['membership', 'registration', 'join'],
    author_name: 'Admin User'
  },
  {
    id: '3',
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
    question: 'Are there any fees for attending events?',
    answer: 'Most of our regular events are free for members. Some special workshops or courses may have a small fee to cover materials and refreshments.',
    category: 'Events',
    status: 'published',
    sort_order: 3,
    view_count: 67,
    helpful_count: 12,
    language: 'English',
    tags: ['events', 'fees', 'cost'],
    author_name: 'Event Coordinator'
  },
  {
    id: '4',
    created_at: '2024-12-17T00:00:00Z',
    updated_at: '2024-12-17T00:00:00Z',
    question: 'Can I volunteer for organization activities?',
    answer: 'Yes! We welcome volunteers for various activities including event organization, IT support, content creation, and community outreach. Check our volunteer opportunities page.',
    category: 'Volunteering',
    status: 'published',
    sort_order: 4,
    view_count: 45,
    helpful_count: 8,
    language: 'English',
    tags: ['volunteer', 'help', 'contribute'],
    author_name: 'Volunteer Coordinator'
  },
  {
    id: '5',
    created_at: '2024-12-16T00:00:00Z',
    updated_at: '2024-12-16T00:00:00Z',
    question: 'What languages are supported on the website?',
    answer: 'Our website supports English, Amharic, Afaan Oromo, and Arabic. You can switch languages using the language selector in the header.',
    category: 'Website',
    status: 'published',
    sort_order: 5,
    view_count: 34,
    helpful_count: 6,
    language: 'English',
    tags: ['language', 'website', 'translation'],
    author_name: 'IT Team'
  }
];

export const useFAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('faq_items')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchFAQs = useCallback(async (filters?: {
    category?: string;
    language?: string;
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('FAQ tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredFAQs = [...mockFAQs];
        
        if (filters?.category && filters.category !== 'all') {
          filteredFAQs = filteredFAQs.filter(faq => faq.category === filters.category);
        }
        if (filters?.language && filters.language !== 'all') {
          filteredFAQs = filteredFAQs.filter(faq => faq.language === filters.language);
        }
        if (filters?.status && filters.status !== 'all') {
          filteredFAQs = filteredFAQs.filter(faq => faq.status === filters.status);
        }
        
        // Sort by sort_order and then by helpful_count
        filteredFAQs.sort((a, b) => {
          if (a.sort_order !== b.sort_order) {
            return a.sort_order - b.sort_order;
          }
          return b.helpful_count - a.helpful_count;
        });
        
        setFaqs(filteredFAQs);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('faq_items')
        .select(`
          *,
          profiles!faq_items_created_by_fkey(full_name)
        `);

      // Apply access control
      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Order by sort_order, then by helpful_count
      query = query.order('sort_order', { ascending: true })
                   .order('helpful_count', { ascending: false });

      const { data: faqData, error: faqError } = await query;

      if (faqError) throw faqError;

      const formattedFAQs: FAQItem[] = (faqData || []).map(faq => ({
        ...faq,
        author_name: faq.profiles?.full_name || 'Unknown Author'
      }));

      setFaqs(formattedFAQs);

    } catch (err: unknown) {
      console.error('Error fetching FAQs:', err);
      setError(err.message || 'Failed to fetch FAQs');
      
      // Fallback to mock data
      setUseMockData(true);
      setFaqs(mockFAQs);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createFAQ = useCallback(async (faqData: CreateFAQData): Promise<FAQItem | null> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create FAQs');
      }

      if (!isAdmin) {
        throw new Error('Only admins can create FAQs');
      }

      if (useMockData) {
        const newFAQ: FAQItem = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...faqData,
          created_by: user.id,
          status: 'published',
          sort_order: faqData.sort_order || faqs.length + 1,
          view_count: 0,
          helpful_count: 0,
          language: faqData.language || 'English',
          tags: faqData.tags || [],
          author_name: 'Current User'
        };
        
        setFaqs(prev => [...prev, newFAQ].sort((a, b) => a.sort_order - b.sort_order));
        toast.success('FAQ created successfully! (Mock data)');
        return newFAQ;
      }

      const { data, error } = await supabase
        .from('faq_items')
        .insert([{
          ...faqData,
          created_by: user.id,
          status: 'published',
          sort_order: faqData.sort_order || faqs.length + 1,
          view_count: 0,
          helpful_count: 0,
          language: faqData.language || 'English',
          tags: faqData.tags || []
        }])
        .select(`
          *,
          profiles!faq_items_created_by_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newFAQ: FAQItem = {
        ...data,
        author_name: data.profiles?.full_name || 'Unknown Author'
      };

      setFaqs(prev => [...prev, newFAQ].sort((a, b) => a.sort_order - b.sort_order));
      toast.success('FAQ created successfully!');
      return newFAQ;

    } catch (err: unknown) {
      console.error('Error creating FAQ:', err);
      toast.error(err.message || 'Failed to create FAQ');
      return null;
    }
  }, [user, isAdmin, useMockData, faqs.length]);

  const updateFAQ = useCallback(async (faqId: string, updates: Partial<CreateFAQData>): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update FAQs');
      }

      if (useMockData) {
        setFaqs(prev => prev.map(faq => 
          faq.id === faqId 
            ? { ...faq, ...updates, updated_at: new Date().toISOString() } 
            : faq
        ).sort((a, b) => a.sort_order - b.sort_order));
        toast.success('FAQ updated successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('faq_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', faqId);

      if (error) throw error;

      setFaqs(prev => prev.map(faq => 
        faq.id === faqId 
          ? { ...faq, ...updates, updated_at: new Date().toISOString() } 
          : faq
      ).sort((a, b) => a.sort_order - b.sort_order));

      toast.success('FAQ updated successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error updating FAQ:', err);
      toast.error(err.message || 'Failed to update FAQ');
      return false;
    }
  }, [isAdmin, useMockData]);

  const deleteFAQ = useCallback(async (faqId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete FAQs');
      }

      if (useMockData) {
        setFaqs(prev => prev.filter(faq => faq.id !== faqId));
        toast.success('FAQ deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', faqId);

      if (error) throw error;

      setFaqs(prev => prev.filter(faq => faq.id !== faqId));
      toast.success('FAQ deleted successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error deleting FAQ:', err);
      toast.error(err.message || 'Failed to delete FAQ');
      return false;
    }
  }, [isAdmin, useMockData]);

  const trackView = useCallback(async (faqId: string): Promise<void> => {
    try {
      if (useMockData) {
        setFaqs(prev => prev.map(faq => 
          faq.id === faqId ? { ...faq, view_count: faq.view_count + 1 } : faq
        ));
        return;
      }

      const { error } = await supabase
        .from('faq_items')
        .update({
          view_count: supabase.sql`view_count + 1`
        })
        .eq('id', faqId);

      if (error) throw error;

      setFaqs(prev => prev.map(faq => 
        faq.id === faqId ? { ...faq, view_count: faq.view_count + 1 } : faq
      ));

    } catch (err: unknown) {
      console.error('Error tracking view:', err);
    }
  }, [useMockData]);

  const markHelpful = useCallback(async (faqId: string): Promise<boolean> => {
    try {
      if (useMockData) {
        setFaqs(prev => prev.map(faq => 
          faq.id === faqId ? { ...faq, helpful_count: faq.helpful_count + 1 } : faq
        ));
        toast.success('Thank you for your feedback! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('faq_items')
        .update({
          helpful_count: supabase.sql`helpful_count + 1`
        })
        .eq('id', faqId);

      if (error) throw error;

      setFaqs(prev => prev.map(faq => 
        faq.id === faqId ? { ...faq, helpful_count: faq.helpful_count + 1 } : faq
      ));

      toast.success('Thank you for your feedback!');
      return true;

    } catch (err: unknown) {
      console.error('Error marking helpful:', err);
      toast.error('Failed to submit feedback');
      return false;
    }
  }, [useMockData]);

  const reorderFAQs = useCallback(async (faqIds: string[]): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can reorder FAQs');
      }

      if (useMockData) {
        setFaqs(prev => {
          const reordered = [...prev];
          faqIds.forEach((id, index) => {
            const faqIndex = reordered.findIndex(f => f.id === id);
            if (faqIndex !== -1) {
              reordered[faqIndex].sort_order = index + 1;
            }
          });
          return reordered.sort((a, b) => a.sort_order - b.sort_order);
        });
        toast.success('FAQ order updated! (Mock data)');
        return true;
      }

      // Update sort orders in batch
      const updates = faqIds.map((id, index) => ({
        id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('faq_items')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      setFaqs(prev => {
        const reordered = [...prev];
        faqIds.forEach((id, index) => {
          const faqIndex = reordered.findIndex(f => f.id === id);
          if (faqIndex !== -1) {
            reordered[faqIndex].sort_order = index + 1;
          }
        });
        return reordered.sort((a, b) => a.sort_order - b.sort_order);
      });

      toast.success('FAQ order updated successfully!');
      return true;

    } catch (err: unknown) {
      console.error('Error reordering FAQs:', err);
      toast.error(err.message || 'Failed to update FAQ order');
      return false;
    }
  }, [isAdmin, useMockData]);

  const searchFAQs = useCallback((query: string) => {
    if (!query.trim()) return faqs;
    
    const searchTerm = query.toLowerCase();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }, [faqs]);

  const getFAQsByCategory = useCallback((category: string) => {
    return faqs.filter(faq => faq.category === category && faq.status === 'published');
  }, [faqs]);

  const getPopularFAQs = useCallback((limit: number = 5) => {
    return faqs
      .filter(faq => faq.status === 'published')
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, limit);
  }, [faqs]);

  const getFAQStats = useCallback(() => {
    const categories = [...new Set(faqs.map(faq => faq.category))];
    
    return {
      totalFAQs: faqs.length,
      publishedFAQs: faqs.filter(f => f.status === 'published').length,
      draftFAQs: faqs.filter(f => f.status === 'draft').length,
      totalViews: faqs.reduce((sum, f) => sum + f.view_count, 0),
      totalHelpful: faqs.reduce((sum, f) => sum + f.helpful_count, 0),
      categories: categories.length,
      categoryCounts: categories.reduce((acc, category) => {
        acc[category] = faqs.filter(f => f.category === category).length;
        return acc;
      }, {} as Record<string, number>),
      languageCounts: faqs.reduce((acc, faq) => {
        acc[faq.language] = (acc[faq.language] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [faqs]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return {
    // Data
    faqs,
    stats: getFAQStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    trackView,
    markHelpful,
    reorderFAQs,
    
    // Utilities
    searchFAQs,
    getFAQsByCategory,
    getPopularFAQs,
    refetch: fetchFAQs,
    clearError: () => setError(null)
  };
};

export default useFAQ;