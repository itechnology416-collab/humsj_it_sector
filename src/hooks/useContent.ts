import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'document' | 'image' | 'link';
  category: string;
  content?: string;
  excerpt?: string;
  file_url?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  thumbnail_url?: string;
  duration?: number;
  views: number;
  likes: number;
  comments: number;
  is_featured: boolean;
  is_public: boolean;
  access_level: 'public' | 'members' | 'restricted';
  language: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  uploaded_by: string;
  uploader_name?: string;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContentData {
  title: string;
  type: ContentItem['type'];
  category: string;
  content?: string;
  excerpt?: string;
  file?: File;
  is_featured?: boolean;
  is_public?: boolean;
  access_level?: ContentItem['access_level'];
  language?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
}

export interface CreateCommentData {
  content_id: string;
  comment: string;
}

// Mock data for development
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Introduction to Islamic Studies',
    type: 'article',
    category: 'Education',
    content: 'A comprehensive introduction to Islamic studies covering the basics of faith, practice, and history.',
    excerpt: 'Learn the fundamentals of Islamic studies in this comprehensive guide.',
    views: 150,
    likes: 25,
    comments: 8,
    is_featured: true,
    is_public: true,
    access_level: 'public',
    language: 'en',
    tags: ['education', 'islam', 'basics'],
    uploaded_by: 'admin',
    uploader_name: 'Admin User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_liked: false
  },
  {
    id: '2',
    title: 'Quran Recitation Guide',
    type: 'video',
    category: 'Religious',
    content: 'Learn proper Quran recitation techniques with this comprehensive video guide.',
    excerpt: 'Master the art of Quran recitation with expert guidance.',
    file_url: '/videos/quran-recitation.mp4',
    duration: 1800,
    views: 300,
    likes: 45,
    comments: 12,
    is_featured: true,
    is_public: true,
    access_level: 'public',
    language: 'ar',
    tags: ['quran', 'recitation', 'tajweed'],
    uploaded_by: 'admin',
    uploader_name: 'Admin User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_liked: false
  }
];

const mockCategories: ContentCategory[] = [
  {
    id: '1',
    name: 'Education',
    slug: 'education',
    description: 'Educational content and resources',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Religious',
    slug: 'religious',
    description: 'Religious content and guidance',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockComments: ContentComment[] = [
  {
    id: '1',
    content_id: '1',
    user_id: 'user1',
    user_name: 'John Doe',
    comment: 'Very informative article, thank you for sharing!',
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [comments, setComments] = useState<ContentComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch content with mock data
  const fetchContent = useCallback(async (filters?: {
    category?: string;
    type?: string;
    is_featured?: boolean;
    is_public?: boolean;
    search?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredContent = [...mockContent];

      if (filters) {
        if (filters.category) {
          filteredContent = filteredContent.filter(item => item.category === filters.category);
        }
        if (filters.type) {
          filteredContent = filteredContent.filter(item => item.type === filters.type);
        }
        if (filters.is_featured !== undefined) {
          filteredContent = filteredContent.filter(item => item.is_featured === filters.is_featured);
        }
        if (filters.is_public !== undefined) {
          filteredContent = filteredContent.filter(item => item.is_public === filters.is_public);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredContent = filteredContent.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            item.content?.toLowerCase().includes(searchLower) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
      }

      setContent(filteredContent);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to fetch content');
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories with mock data
  const fetchCategories = useCallback(async () => {
    try {
      setCategories(mockCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    }
  }, []);

  // Create content with mock implementation
  const createContent = async (data: CreateContentData, file?: File): Promise<ContentItem> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('User must be authenticated to create content');
      }

      // Simulate file upload if file is provided
      let fileUrl = '';
      let filePath = '';
      let fileName = '';
      let fileSize = 0;
      let mimeType = '';

      if (file) {
        // Mock file upload
        fileName = file.name;
        fileSize = file.size;
        mimeType = file.type;
        fileUrl = `/uploads/${fileName}`;
        filePath = `content/${fileName}`;
      }

      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: data.title,
        type: data.type,
        category: data.category,
        content: data.content,
        excerpt: data.excerpt,
        file_url: fileUrl,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        views: 0,
        likes: 0,
        comments: 0,
        is_featured: data.is_featured || false,
        is_public: data.is_public !== false,
        access_level: data.access_level || 'public',
        language: data.language || 'en',
        tags: data.tags || [],
        metadata: data.metadata || {},
        uploaded_by: user.id,
        uploader_name: user.user_metadata?.full_name || user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_liked: false
      };

      setContent(prev => [newContent, ...prev]);
      toast.success('Content created successfully! (Mock data - please set up database)');
      return newContent;
    } catch (err) {
      console.error('Error creating content:', err);
      setError('Failed to create content');
      toast.error('Failed to create content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update content with mock implementation
  const updateContent = async (id: string, updates: Partial<CreateContentData>): Promise<ContentItem> => {
    setLoading(true);
    setError(null);

    try {
      const updatedContent = content.map(item => 
        item.id === id 
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      );
      
      setContent(updatedContent);
      
      const updated = updatedContent.find(item => item.id === id);
      if (!updated) throw new Error('Content not found');
      
      toast.success('Content updated successfully! (Mock data)');
      return updated;
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content');
      toast.error('Failed to update content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete content with mock implementation
  const deleteContent = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      setContent(prev => prev.filter(item => item.id !== id));
      toast.success('Content deleted successfully! (Mock data)');
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content');
      toast.error('Failed to delete content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle like with mock implementation
  const toggleLike = async (contentId: string): Promise<void> => {
    if (!user) {
      toast.error('Please log in to like content');
      return;
    }

    try {
      setContent(prev => prev.map(item => {
        if (item.id === contentId) {
          const isLiked = !item.is_liked;
          return {
            ...item,
            is_liked: isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1
          };
        }
        return item;
      }));
      
      toast.success('Like updated! (Mock data)');
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error('Failed to update like');
    }
  };

  // Track view with mock implementation
  const trackView = async (contentId: string): Promise<void> => {
    try {
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, views: item.views + 1 }
          : item
      ));
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  // Fetch comments with mock implementation
  const fetchComments = async (contentId: string): Promise<ContentComment[]> => {
    try {
      const contentComments = mockComments.filter(comment => comment.content_id === contentId);
      setComments(contentComments);
      return contentComments;
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  // Add comment with mock implementation
  const addComment = async (data: CreateCommentData): Promise<ContentComment> => {
    if (!user) {
      throw new Error('User must be authenticated to add comments');
    }

    try {
      const newComment: ContentComment = {
        id: Date.now().toString(),
        content_id: data.content_id,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        comment: data.comment,
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setComments(prev => [...prev, newComment]);
      
      // Update comment count
      setContent(prev => prev.map(item => 
        item.id === data.content_id 
          ? { ...item, comments: item.comments + 1 }
          : item
      ));

      toast.success('Comment added successfully! (Mock data)');
      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
      throw err;
    }
  };

  // Create category with mock implementation
  const createCategory = async (data: CreateCategoryData): Promise<ContentCategory> => {
    try {
      const newCategory: ContentCategory = {
        id: Date.now().toString(),
        name: data.name,
        slug: data.slug,
        description: data.description,
        sort_order: data.sort_order || categories.length + 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setCategories(prev => [...prev, newCategory]);
      toast.success('Category created successfully! (Mock data)');
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Failed to create category');
      throw err;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, [fetchContent, fetchCategories]);

  return {
    content,
    categories,
    comments,
    loading,
    error,
    fetchContent,
    fetchCategories,
    createContent,
    updateContent,
    deleteContent,
    toggleLike,
    trackView,
    fetchComments,
    addComment,
    createCategory
  };
};