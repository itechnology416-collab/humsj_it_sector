import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DawaContent {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  content_type: 'article' | 'video' | 'audio' | 'infographic';
  status: 'pending' | 'approved' | 'rejected' | 'scheduled';
  author_id: string;
  approved_by?: string;
  approved_at?: string;
  category: string;
  language: string;
  tags: string[];
  file_url?: string;
  thumbnail_url?: string;
  file_size?: number;
  duration?: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  scheduled_for?: string;
  published_at?: string;
  author_name?: string;
  approver_name?: string;
}

export interface CreateDawaContentData {
  title: string;
  description: string;
  content_type: DawaContent['content_type'];
  category: string;
  language?: string;
  tags?: string[];
  scheduled_for?: string;
}

// Mock data for development
const mockContent: DawaContent[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    title: 'The Importance of Daily Prayers',
    description: 'A comprehensive guide on the significance and benefits of performing the five daily prayers',
    content_type: 'article',
    status: 'approved',
    author_id: 'user1',
    approved_by: 'admin1',
    approved_at: '2024-12-20T10:00:00Z',
    category: 'Worship',
    language: 'English',
    tags: ['prayer', 'salah', 'worship', 'daily'],
    views: 245,
    likes: 34,
    comments: 12,
    shares: 8,
    published_at: '2024-12-20T10:00:00Z',
    author_name: 'Sheikh Ahmed',
    approver_name: 'Admin User'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    title: 'Ramadan Preparation Guide',
    description: 'How to spiritually and physically prepare for the holy month of Ramadan',
    content_type: 'video',
    status: 'pending',
    author_id: 'user2',
    category: 'Fasting',
    language: 'English',
    tags: ['ramadan', 'fasting', 'preparation', 'spirituality'],
    duration: 1800, // 30 minutes
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    author_name: 'Dr. Fatima Ali'
  },
  {
    id: '3',
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
    title: 'Islamic Ethics in Business',
    description: 'Understanding Islamic principles in modern business practices',
    content_type: 'infographic',
    status: 'scheduled',
    author_id: 'user3',
    category: 'Ethics',
    language: 'English',
    tags: ['business', 'ethics', 'halal', 'commerce'],
    scheduled_for: '2024-12-25T00:00:00Z',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    author_name: 'Omar Ibrahim'
  }
];

export const useDawaContent = () => {
  const [content, setContent] = useState<DawaContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('dawa_content')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchContent = useCallback(async (filters?: {
    status?: string;
    category?: string;
    content_type?: string;
    author_id?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('Dawa content tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredContent = [...mockContent];
        
        if (filters?.status && filters.status !== 'all') {
          filteredContent = filteredContent.filter(item => item.status === filters.status);
        }
        if (filters?.category && filters.category !== 'all') {
          filteredContent = filteredContent.filter(item => item.category === filters.category);
        }
        if (filters?.content_type && filters.content_type !== 'all') {
          filteredContent = filteredContent.filter(item => item.content_type === filters.content_type);
        }
        if (filters?.author_id) {
          filteredContent = filteredContent.filter(item => item.author_id === filters.author_id);
        }
        
        setContent(filteredContent);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('dawa_content')
        .select(`
          *,
          author:profiles!dawa_content_author_id_fkey(full_name),
          approver:profiles!dawa_content_approved_by_fkey(full_name)
        `);

      // Apply access control
      if (!isAdmin) {
        if (user) {
          // Regular users can see approved content and their own content
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (profile) {
            query = query.or(`status.eq.approved,author_id.eq.${profile.id}`);
          } else {
            query = query.eq('status', 'approved');
          }
        } else {
          query = query.eq('status', 'approved');
        }
      }

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.content_type && filters.content_type !== 'all') {
        query = query.eq('content_type', filters.content_type);
      }
      if (filters?.author_id) {
        query = query.eq('author_id', filters.author_id);
      }

      query = query.order('created_at', { ascending: false });

      const { data: contentData, error: contentError } = await query;

      if (contentError) throw contentError;

      const formattedContent: DawaContent[] = (contentData || []).map(item => ({
        ...item,
        author_name: item.author?.full_name || 'Unknown Author',
        approver_name: item.approver?.full_name || undefined
      }));

      setContent(formattedContent);

    } catch (err: any) {
      console.error('Error fetching dawa content:', err);
      setError(err.message || 'Failed to fetch dawa content');
      
      // Fallback to mock data
      setUseMockData(true);
      setContent(mockContent);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  const createContent = useCallback(async (
    contentData: CreateDawaContentData,
    file?: File
  ): Promise<DawaContent | null> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create content');
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
        const newContent: DawaContent = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...contentData,
          author_id: profile.id,
          status: 'pending',
          language: contentData.language || 'English',
          tags: contentData.tags || [],
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          author_name: profile.full_name || 'Current User'
        };
        
        setContent(prev => [newContent, ...prev]);
        toast.success('Content submitted for review! (Mock data)');
        return newContent;
      }

      let fileUrl = '';
      let fileSize = 0;
      const duration = undefined;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `dawa-content/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('content')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        fileSize = file.size;

        // For video/audio files, you might want to extract duration
        // This would require additional processing
      }

      const { data, error } = await supabase
        .from('dawa_content')
        .insert([{
          ...contentData,
          author_id: profile.id,
          status: contentData.scheduled_for ? 'scheduled' : 'pending',
          language: contentData.language || 'English',
          tags: contentData.tags || [],
          file_url: fileUrl || undefined,
          file_size: fileSize || undefined,
          duration: duration,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }])
        .select(`
          *,
          author:profiles!dawa_content_author_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newContent: DawaContent = {
        ...data,
        author_name: data.author?.full_name || 'Unknown Author'
      };

      setContent(prev => [newContent, ...prev]);
      toast.success(contentData.scheduled_for ? 'Content scheduled successfully!' : 'Content submitted for review!');
      return newContent;

    } catch (err: any) {
      console.error('Error creating dawa content:', err);
      toast.error(err.message || 'Failed to create content');
      return null;
    }
  }, [user, useMockData]);

  const updateContent = useCallback(async (contentId: string, updates: Partial<CreateDawaContentData>): Promise<boolean> => {
    try {
      if (useMockData) {
        setContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        ));
        toast.success('Content updated successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('dawa_content')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ));

      toast.success('Content updated successfully!');
      return true;

    } catch (err: any) {
      console.error('Error updating content:', err);
      toast.error(err.message || 'Failed to update content');
      return false;
    }
  }, [useMockData]);

  const deleteContent = useCallback(async (contentId: string): Promise<boolean> => {
    try {
      if (useMockData) {
        setContent(prev => prev.filter(item => item.id !== contentId));
        toast.success('Content deleted successfully! (Mock data)');
        return true;
      }

      // Get content item to delete associated file
      const contentItem = content.find(c => c.id === contentId);
      
      // Delete file from storage if exists
      if (contentItem?.file_url) {
        const filePath = contentItem.file_url.split('/').pop();
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('content')
            .remove([`dawa-content/${filePath}`]);
          
          if (storageError) {
            console.warn('Error deleting file from storage:', storageError);
          }
        }
      }

      const { error } = await supabase
        .from('dawa_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully!');
      return true;

    } catch (err: any) {
      console.error('Error deleting content:', err);
      toast.error(err.message || 'Failed to delete content');
      return false;
    }
  }, [useMockData, content]);

  const approveContent = useCallback(async (contentId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can approve content');
      }

      if (useMockData) {
        setContent(prev => prev.map(item => 
          item.id === contentId 
            ? { 
                ...item, 
                status: 'approved', 
                approved_by: user?.id,
                approved_at: new Date().toISOString(),
                published_at: new Date().toISOString()
              } 
            : item
        ));
        toast.success('Content approved! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('dawa_content')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              status: 'approved', 
              approved_by: user?.id,
              approved_at: new Date().toISOString(),
              published_at: new Date().toISOString()
            } 
          : item
      ));

      toast.success('Content approved and published!');
      return true;

    } catch (err: any) {
      console.error('Error approving content:', err);
      toast.error(err.message || 'Failed to approve content');
      return false;
    }
  }, [isAdmin, user, useMockData]);

  const rejectContent = useCallback(async (contentId: string, reason?: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can reject content');
      }

      if (useMockData) {
        setContent(prev => prev.map(item => 
          item.id === contentId 
            ? { ...item, status: 'rejected' } 
            : item
        ));
        toast.success('Content rejected (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('dawa_content')
        .update({
          status: 'rejected',
          // You might want to add a rejection_reason field to the schema
        })
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, status: 'rejected' } : item
      ));

      toast.success('Content rejected');
      return true;

    } catch (err: any) {
      console.error('Error rejecting content:', err);
      toast.error(err.message || 'Failed to reject content');
      return false;
    }
  }, [isAdmin, useMockData]);

  const trackView = useCallback(async (contentId: string): Promise<void> => {
    try {
      if (useMockData) {
        setContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, views: item.views + 1 } : item
        ));
        return;
      }

      // Update view count
      const { error } = await supabase
        .from('dawa_content')
        .update({
          views: supabase.sql`views + 1`
        })
        .eq('id', contentId);

      if (error) throw error;

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, views: item.views + 1 } : item
      ));

    } catch (err: any) {
      console.error('Error tracking view:', err);
    }
  }, [useMockData]);

  const getContentStats = useCallback(() => {
    return {
      totalContent: content.length,
      pendingContent: content.filter(c => c.status === 'pending').length,
      approvedContent: content.filter(c => c.status === 'approved').length,
      rejectedContent: content.filter(c => c.status === 'rejected').length,
      scheduledContent: content.filter(c => c.status === 'scheduled').length,
      totalViews: content.reduce((sum, c) => sum + c.views, 0),
      totalLikes: content.reduce((sum, c) => sum + c.likes, 0),
      articleCount: content.filter(c => c.content_type === 'article').length,
      videoCount: content.filter(c => c.content_type === 'video').length,
      audioCount: content.filter(c => c.content_type === 'audio').length,
      infographicCount: content.filter(c => c.content_type === 'infographic').length
    };
  }, [content]);

  const getContentByAuthor = useCallback((authorId: string) => {
    return content.filter(item => item.author_id === authorId);
  }, [content]);

  const getPendingContent = useCallback(() => {
    return content.filter(item => item.status === 'pending');
  }, [content]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    // Data
    content,
    stats: getContentStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
    approveContent,
    rejectContent,
    trackView,
    
    // Utilities
    getContentByAuthor,
    getPendingContent,
    refetch: fetchContent,
    clearError: () => setError(null)
  };
};

export default useDawaContent;