import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analytics } from './analytics';

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  category_id?: string;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  duration_seconds?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata?: Record<string, unknown>;
  tags?: string[];
  is_public: boolean;
  uploaded_by?: string;
  cloudinary_public_id?: string;
  created_at: string;
  updated_at: string;
  category?: MediaCategory;
  uploader?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface MediaCollection {
  id: string;
  name: string;
  description?: string;
  collection_type: 'album' | 'playlist' | 'gallery';
  cover_image_url?: string;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  items?: MediaCollectionItem[];
  creator?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface MediaCollectionItem {
  id: string;
  collection_id: string;
  media_item_id: string;
  order_index: number;
  created_at: string;
  media_item?: MediaItem;
}

export interface UploadMediaData {
  title: string;
  description?: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  category_id?: string;
  file: File;
  tags?: string[];
  is_public?: boolean;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  collection_type: 'album' | 'playlist' | 'gallery';
  is_public?: boolean;
}

class MediaApiService {
  // =============================================
  // MEDIA ITEMS
  // =============================================

  async getMediaItems(filters?: {
    type?: string;
    category?: string;
    search?: string;
    public_only?: boolean;
    uploaded_by?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<MediaItem[]> {
    try {
      let query = supabase
        .from('media_items')
        .select(`
          *,
          category:media_categories(*),
          uploader:profiles(full_name, avatar_url)
        `);

      if (filters?.public_only !== false) {
        query = query.eq('is_public', true);
      }

      if (filters?.type) {
        query = query.eq('media_type', filters.type);
      }

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.uploaded_by) {
        query = query.eq('uploaded_by', filters.uploaded_by);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
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

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      analytics.track('media_items_fetched', {
        count: data?.length || 0,
        filters
      });

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch media items');
      throw error;
    }
  }

  async getMediaItemById(id: string): Promise<MediaItem | null> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select(`
          *,
          category:media_categories(*),
          uploader:profiles(full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      analytics.track('media_item_viewed', {
        media_id: id,
        media_type: data?.media_type,
        media_title: data?.title
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch media item');
      throw error;
    }
  }

  async uploadMediaItem(uploadData: UploadMediaData): Promise<MediaItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to Cloudinary
      const uploadResult = await this.uploadToCloudinary(uploadData.file, uploadData.media_type);

      // Extract metadata based on media type
      const metadata = await this.extractMediaMetadata(uploadData.file, uploadResult);

      const mediaItemData = {
        title: uploadData.title,
        description: uploadData.description,
        media_type: uploadData.media_type,
        category_id: uploadData.category_id,
        file_url: uploadResult.secure_url,
        thumbnail_url: uploadResult.thumbnail_url,
        file_size: uploadData.file.size,
        dimensions: metadata.dimensions,
        duration_seconds: metadata.duration,
        metadata: metadata.additional,
        tags: uploadData.tags || [],
        is_public: uploadData.is_public !== false,
        uploaded_by: user.id,
        cloudinary_public_id: uploadResult.public_id
      };

      const { data, error } = await supabase
        .from('media_items')
        .insert(mediaItemData)
        .select(`
          *,
          category:media_categories(*),
          uploader:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('media_uploaded', {
        media_id: data.id,
        media_type: uploadData.media_type,
        file_size: uploadData.file.size,
        category_id: uploadData.category_id
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to upload media item');
      throw error;
    }
  }

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('media_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('uploaded_by', user.id)
        .select(`
          *,
          category:media_categories(*),
          uploader:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('media_updated', {
        media_id: id,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to update media item');
      throw error;
    }
  }

  async deleteMediaItem(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get media item to delete from Cloudinary
      const mediaItem = await this.getMediaItemById(id);
      if (!mediaItem) throw new Error('Media item not found');

      // Delete from Cloudinary if public_id exists
      if (mediaItem.cloudinary_public_id) {
        await this.deleteFromCloudinary(mediaItem.cloudinary_public_id, mediaItem.media_type);
      }

      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id)
        .eq('uploaded_by', user.id);

      if (error) throw error;

      analytics.track('media_deleted', {
        media_id: id,
        media_type: mediaItem.media_type
      });
    } catch (error) {
      errorHandler.handleError(error, 'Failed to delete media item');
      throw error;
    }
  }

  // =============================================
  // MEDIA CATEGORIES
  // =============================================

  async getMediaCategories(): Promise<MediaCategory[]> {
    try {
      const { data, error } = await supabase
        .from('media_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch media categories');
      throw error;
    }
  }

  // =============================================
  // MEDIA COLLECTIONS
  // =============================================

  async getMediaCollections(filters?: {
    type?: string;
    public_only?: boolean;
    created_by?: string;
    limit?: number;
    offset?: number;
  }): Promise<MediaCollection[]> {
    try {
      let query = supabase
        .from('media_collections')
        .select(`
          *,
          creator:profiles(full_name, avatar_url),
          items:media_collection_items(
            *,
            media_item:media_items(*)
          )
        `);

      if (filters?.public_only !== false) {
        query = query.eq('is_public', true);
      }

      if (filters?.type) {
        query = query.eq('collection_type', filters.type);
      }

      if (filters?.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch media collections');
      throw error;
    }
  }

  async createMediaCollection(collectionData: CreateCollectionData): Promise<MediaCollection> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('media_collections')
        .insert({
          ...collectionData,
          created_by: user.id,
          is_public: collectionData.is_public !== false
        })
        .select(`
          *,
          creator:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('media_collection_created', {
        collection_id: data.id,
        collection_type: collectionData.collection_type
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to create media collection');
      throw error;
    }
  }

  async addItemToCollection(collectionId: string, mediaItemId: string, orderIndex?: number): Promise<MediaCollectionItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get next order index if not provided
      if (orderIndex === undefined) {
        const { data: lastItem } = await supabase
          .from('media_collection_items')
          .select('order_index')
          .eq('collection_id', collectionId)
          .order('order_index', { ascending: false })
          .limit(1)
          .single();

        orderIndex = (lastItem?.order_index || 0) + 1;
      }

      const { data, error } = await supabase
        .from('media_collection_items')
        .insert({
          collection_id: collectionId,
          media_item_id: mediaItemId,
          order_index: orderIndex
        })
        .select(`
          *,
          media_item:media_items(*)
        `)
        .single();

      if (error) throw error;

      analytics.track('media_added_to_collection', {
        collection_id: collectionId,
        media_item_id: mediaItemId
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to add item to collection');
      throw error;
    }
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private async uploadToCloudinary(file: File, mediaType: string): Promise<{
    secure_url: string;
    public_id: string;
    thumbnail_url?: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'humsj_it_sector');
    
    // Set resource type based on media type
    const resourceType = mediaType === 'video' ? 'video' : 
                        mediaType === 'audio' ? 'video' : 'image';
    
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/diufyrlyou/${resourceType}/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const result = await response.json();

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      thumbnail_url: mediaType === 'video' ? result.secure_url.replace('/upload/', '/upload/c_thumb,w_300,h_200/') : undefined
    };
  }

  private async deleteFromCloudinary(publicId: string, mediaType: string): Promise<void> {
    // This would typically be done on the server side for security
    // For now, we'll just log it
    console.log(`Would delete ${mediaType} with public_id: ${publicId} from Cloudinary`);
  }

  private async extractMediaMetadata(file: File, uploadResult: unknown): Promise<{
    dimensions?: { width: number; height: number };
    duration?: number;
    additional?: Record<string, unknown>;
  }> {
    const metadata: {
      dimensions?: { width: number; height: number };
      duration?: number;
      additional?: Record<string, unknown>;
    } = {
      additional: {
        originalName: file.name,
        mimeType: file.type,
        lastModified: file.lastModified
      }
    };

    // Extract dimensions for images
    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await this.getImageDimensions(file);
        metadata.dimensions = dimensions;
      } catch (error) {
        console.warn('Failed to extract image dimensions:', error);
      }
    }

    // Extract duration for video/audio
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      try {
        const duration = await this.getMediaDuration(file);
        metadata.duration = duration;
      } catch (error) {
        console.warn('Failed to extract media duration:', error);
      }
    }

    return metadata;
  }

  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private getMediaDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const media = file.type.startsWith('video/') ? 
        document.createElement('video') : 
        document.createElement('audio');
      
      media.onloadedmetadata = () => {
        resolve(Math.round(media.duration));
      };
      media.onerror = reject;
      media.src = URL.createObjectURL(file);
    });
  }
}

export const mediaApi = new MediaApiService();