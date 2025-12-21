import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ContentItem {
  id: string;
  title: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'presentation' | 'book' | 'article';
  category: 'islamic_studies' | 'technology' | 'academic' | 'events' | 'announcements' | 'resources' | 'tutorials';
  description?: string;
  content?: string;
  file_url?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  thumbnail_url?: string;
  duration?: number;
  views: number;
  downloads: number;
  likes: number;
  tags?: string[];
  language: string;
  is_featured: boolean;
  is_public: boolean;
  access_level: 'public' | 'members' | 'admins' | 'restricted';
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  uploader_name?: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  parent_id?: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  replies?: ContentComment[];
}

export interface CreateContentData {
  title: string;
  type: ContentItem['type'];
  category: ContentItem['category'];
  description?: string;
  content?: string;
  tags?: string[];
  language?: string;
  is_featured?: boolean;
  is_public?: boolean;
  access_level?: ContentItem['access_level'];
}

// Mock data for when database tables don't exist yet
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Introduction to Islamic Programming Ethics',
    type: 'document',
    category: 'islamic_studies',
    description: 'A comprehensive guide on ethical programming practices from an Islamic perspective',
    views: 245,
    downloads: 67,
    likes: 23,
    tags: ['ethics', 'programming', 'islam'],
    language: 'en',
    is_featured: true,
    is_public: true,
    access_level: 'public',
    uploaded_by: 'admin',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    uploader_name: 'Admin User'
  },
  {
    id: '2',
    title: 'React.js Tutorial Series',
    type: 'video',
    category: 'technology',
    description: 'Complete React.js tutorial for beginners',
    views: 189,
    downloads: 45,
    likes: 34,
    tags: ['react', 'javascript', 'tutorial'],
    language: 'en',
    is_featured: false,
    is_public: true,
    access_level: 'members',
    uploaded_by: 'admin',
    created_at: '2024-12-05T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
    uploader_name: 'Tech Team'
  },
  {
    id: '3',
    title: 'Prayer Time Calculation Algorithm',
    type: 'article',
    category: 'islamic_studies',
    description: 'Technical explanation of prayer time calculations',
    views: 156,
    downloads: 23,
    likes: 18,
    tags: ['prayer', 'algorithm', 'calculation'],
    language: 'en',
    is_featured: false,
    is_public: true,
    access_level: 'public',
    uploaded_by: 'admin',
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
    uploader_name: 'Islamic Tech Team'
  }
];

const mockCategories: ContentCategory[] = [
  {
    id: '1',
    name: 'Islamic Studies',
    slug: 'islamic-studies',
    description: 'Religious education and Islamic knowledge',
    icon: 'book-open',
    color: '#10b981',
    sort_order: 1,
    is_active: true,
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Technology',
    slug: 'technology',
    description: 'IT tutorials, programming, and tech resources',
    icon: 'cpu',
    color: '#3b82f6',
    sort_order: 2,
    is_active: true,
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Academic',
    slug: 'academic',
    description: 'Academic resources and study materials',
    icon: 'graduation-cap',
    color: '#8b5cf6',
    sort_order: 3,
    is_active: true,
    created_at: '2024-12-01T00:00:00Z'
  }
];

export const useContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      // Try to query the content_items table to see if it exists
      const { error } = await supabase
        .from('content_items')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchContent = async (filters?: {
    category?: string;
    type?: string;
    featured?: boolean;
    search?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        // Use mock data if table doesn't exist
        console.log('Content tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredContent = [...mockContent];
        
        // Apply filters to mock data
        if (filters?.category) {
          filteredContent = filteredContent.filter(item => item.category === filters.category);
        }
        if (filters?.type) {
          filteredContent = filteredContent.filter(item => item.type === filters.type);
        }
        if (filters?.featured) {
          filteredContent = filteredContent.filter(item => item.is_featured);
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredContent = filteredContent.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
          );
        }
        
        setContent(filteredContent);
        setCategories(mockCategories);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = supabase
        .from('content_items')
        .select(`
          *,
          profiles!content_items_uploaded_by_fkey(full_name)
        `);

      // Apply access level filtering
      if (!isAdmin) {
        if (user) {
          query = query.in('access_level', ['public', 'members']);
        } else {
          query = query.eq('access_level', 'public');
        }
        query = query.eq('is_public', true);
      }

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data: contentData, error: contentError } = await query;

      if (contentError) throw contentError;

      // Get user's likes if logged in
      let userLikes: string[] = [];
      if (user) {
        const { data: likes, error: likesError } = await supabase
          .from('content_likes')
          .select('content_id')
          .eq('user_id', user.id);

        if (!likesError && likes) {
          userLikes = likes.map(l => l.content_id);
        }
      }

      // Format content with like info and uploader name
      const formattedContent: ContentItem[] = (contentData || []).map(item => ({
        ...item,
        is_liked: userLikes.includes(item.id),
        uploader_name: item.profiles?.full_name || 'Unknown'
      }));

      setContent(formattedContent);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err as Error);
      
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      setUseMockData(true);
      setContent(mockContent);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      if (useMockData) {
        setCategories(mockCategories);
        return;
      }

      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(mockCategories);
    }
  };

  const createContent = async (
    contentData: CreateContentData,
    file?: File
  ): Promise<ContentItem | null> => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to create content');
      }

      if (useMockData) {
        // Mock implementation
        const newContent: ContentItem = {
          id: Date.now().toString(),
          ...contentData,
          views: 0,
          downloads: 0,
          likes: 0,
          language: contentData.language || 'en',
          is_featured: contentData.is_featured || false,
          is_public: contentData.is_public !== false,
          access_level: contentData.access_level || 'public',
          uploaded_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_liked: false,
          uploader_name: 'Current User'
        };
        
        setContent(prev => [newContent, ...prev]);
        toast.success('Content created successfully! (Mock data - please set up database)');
        return newContent;
      }

      let fileUrl = '';
      let filePath = '';
      let fileName = '';
      let fileSize = 0;
      let mimeType = '';

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        filePath = `${contentData.category}/${fileName}`;

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
        fileName = file.name;
        fileSize = file.size;
        mimeType = file.type;
      }

      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          ...contentData,
          file_url: fileUrl || undefined,
          file_path: filePath || undefined,
          file_name: fileName || undefined,
          file_size: fileSize || undefined,
          mime_type: mimeType || undefined,
          uploaded_by: user.id,
          language: contentData.language || 'en',
          is_featured: contentData.is_featured || false,
          is_public: contentData.is_public !== false,
          access_level: contentData.access_level || 'public',
          views: 0,
          downloads: 0,
          likes: 0
        }])
        .select(`
          *,
          profiles!content_items_uploaded_by_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newContent: ContentItem = {
        ...data,
        is_liked: false,
        uploader_name: data.profiles?.full_name || 'Unknown'
      };

      setContent(prev => [newContent, ...prev]);
      toast.success('Content created successfully!');
      return newContent;
    } catch (err) {
      console.error('Error creating content:', err);
      toast.error('Failed to create content');
      return null;
    }
  };

  const updateContent = async (
    contentId: string, 
    updates: Partial<CreateContentData>
  ): Promise<boolean> => {
    try {
      if (useMockData) {
        // Mock implementation
        setContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, ...updates } : item
        ));
        toast.success('Content updated successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('content_items')
        .update(updates)
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, ...updates } : item
      ));

      toast.success('Content updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      toast.error('Failed to update content');
      return false;
    }
  };

  const deleteContent = async (contentId: string): Promise<boolean> => {
    try {
      if (useMockData) {
        // Mock implementation
        setContent(prev => prev.filter(item => item.id !== contentId));
        toast.success('Content deleted successfully! (Mock data)');
        return true;
      }

      // Get content item to delete associated file
      const contentItem = content.find(c => c.id === contentId);
      
      // Delete file from storage if exists
      if (contentItem?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('content')
          .remove([contentItem.file_path]);
        
        if (storageError) {
          console.warn('Error deleting file from storage:', storageError);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting content:', err);
      toast.error('Failed to delete content');
      return false;
    }
  };

  const likeContent = async (contentId: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('Please log in to like content');
        return false;
      }

      if (useMockData) {
        // Mock implementation
        setContent(prev => prev.map(item => 
          item.id === contentId 
            ? { ...item, is_liked: !item.is_liked, likes: item.is_liked ? item.likes - 1 : item.likes + 1 } 
            : item
        ));
        return true;
      }

      const { error } = await supabase
        .from('content_likes')
        .insert([{
          content_id: contentId,
          user_id: user.id
        }]);

      if (error) {
        if (error.code === '23505') { // Already liked
          return await unlikeContent(contentId);
        }
        throw error;
      }

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, is_liked: true, likes: item.likes + 1 } 
          : item
      ));

      return true;
    } catch (err) {
      console.error('Error liking content:', err);
      toast.error('Failed to like content');
      return false;
    }
  };

  const unlikeContent = async (contentId: string): Promise<boolean> => {
    try {
      if (!user) return false;

      if (useMockData) {
        // Mock implementation handled in likeContent
        return true;
      }

      const { error } = await supabase
        .from('content_likes')
        .delete()
        .eq('content_id', contentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, is_liked: false, likes: Math.max(0, item.likes - 1) } 
          : item
      ));

      return true;
    } catch (err) {
      console.error('Error unliking content:', err);
      return false;
    }
  };

  const trackView = async (contentId: string): Promise<void> => {
    try {
      if (useMockData) {
        // Mock implementation
        setContent(prev => prev.map(item => 
          item.id === contentId 
            ? { ...item, views: item.views + 1 } 
            : item
        ));
        return;
      }

      // Insert view record
      await supabase
        .from('content_views')
        .insert([{
          content_id: contentId,
          user_id: user?.id || null,
          viewed_at: new Date().toISOString()
        }]);

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, views: item.views + 1 } 
          : item
      ));
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const getContentComments = async (contentId: string): Promise<ContentComment[]> => {
    try {
      if (useMockData) {
        // Return mock comments
        return [
          {
            id: '1',
            content_id: contentId,
            user_id: 'user1',
            comment: 'Great content! Very helpful.',
            is_approved: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_name: 'Sample User'
          }
        ];
      }

      const { data, error } = await supabase
        .from('content_comments')
        .select(`
          *,
          profiles!content_comments_user_id_fkey(full_name)
        `)
        .eq('content_id', contentId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(comment => ({
        ...comment,
        user_name: comment.profiles?.full_name || 'Anonymous'
      }));
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  const addComment = async (contentId: string, comment: string, parentId?: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('Please log in to comment');
        return false;
      }

      if (useMockData) {
        toast.success('Comment added successfully! (Mock data)');
        return true;
      }

      const { error } = await supabase
        .from('content_comments')
        .insert([{
          content_id: contentId,
          user_id: user.id,
          parent_id: parentId || null,
          comment: comment.trim(),
          is_approved: true // Auto-approve for now
        }]);

      if (error) throw error;

      toast.success('Comment added successfully!');
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
      return false;
    }
  };

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, [user, isAdmin]);

  return {
    content,
    categories,
    loading,
    error,
    useMockData,
    fetchContent,
    fetchCategories,
    createContent,
    updateContent,
    deleteContent,
    likeContent,
    unlikeContent,
    trackView,
    getContentComments,
    addComment,
    refetch: fetchContent
  };
};