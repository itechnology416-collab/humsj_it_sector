import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analytics } from './analytics';

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id?: string;
  event_type: 'workshop' | 'lecture' | 'conference' | 'social' | 'religious' | 'educational';
  start_date: string;
  end_date: string;
  location?: string;
  venue_details?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  is_online: boolean;
  meeting_link?: string;
  max_attendees?: number;
  current_attendees: number;
  registration_required: boolean;
  registration_deadline?: string;
  is_free: boolean;
  ticket_price: number;
  banner_image_url?: string;
  gallery_images?: string[];
  organizer_id?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: EventCategory;
  organizer?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  attendance_status: 'registered' | 'attended' | 'no_show' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded' | 'free';
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  event?: Event;
}

export interface CreateEventData {
  title: string;
  description: string;
  short_description?: string;
  category_id?: string;
  event_type: 'workshop' | 'lecture' | 'conference' | 'social' | 'religious' | 'educational';
  start_date: string;
  end_date: string;
  location?: string;
  venue_details?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  is_online?: boolean;
  meeting_link?: string;
  max_attendees?: number;
  registration_required?: boolean;
  registration_deadline?: string;
  is_free?: boolean;
  ticket_price?: number;
  banner_image_url?: string;
  gallery_images?: string[];
  tags?: string[];
}

export interface RegisterEventData {
  event_id: string;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
}

class EventApiService {
  // =============================================
  // EVENT MANAGEMENT
  // =============================================

  async getEvents(filters?: {
    category?: string;
    type?: string;
    status?: string;
    search?: string;
    upcoming?: boolean;
    organizer?: string;
    limit?: number;
    offset?: number;
  }): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(full_name, avatar_url)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        // Default to published events only
        query = query.eq('status', 'published');
      }

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.type) {
        query = query.eq('event_type', filters.type);
      }

      if (filters?.organizer) {
        query = query.eq('organizer_id', filters.organizer);
      }

      if (filters?.upcoming) {
        query = query.gte('start_date', new Date().toISOString());
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      query = query.order('start_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      analytics.track('events_fetched', {
        count: data?.length || 0,
        filters
      });

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, { 
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_events', filters }
      });
      throw error;
    }
  }

  async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      analytics.track('event_viewed', {
        event_id: id,
        event_title: data?.title
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_event', event_id: id }
      });
      throw error;
    }
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(full_name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      analytics.track('event_viewed', {
        event_id: data?.id,
        event_title: data?.title,
        event_slug: slug
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_event_by_slug', slug }
      });
      throw error;
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate slug from title
      const slug = eventData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const eventPayload = {
        ...eventData,
        slug,
        organizer_id: user.id,
        status: 'draft' as const,
        current_attendees: 0,
        registration_required: eventData.registration_required !== false,
        is_free: eventData.is_free !== false,
        ticket_price: eventData.ticket_price || 0,
        is_online: eventData.is_online || false
      };

      const { data, error } = await supabase
        .from('events')
        .insert(eventPayload)
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('event_created', {
        event_id: data.id,
        event_title: data.title,
        event_type: data.event_type,
        is_online: data.is_online
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'create_event', event_data: eventData }
      });
      throw error;
    }
  }

  async updateEvent(id: string, updates: Partial<CreateEventData>): Promise<Event> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('organizer_id', user.id)
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      analytics.track('event_updated', {
        event_id: id,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'update_event', event_id: id, updates }
      });
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('organizer_id', user.id);

      if (error) throw error;

      analytics.track('event_deleted', {
        event_id: id
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'delete_event', event_id: id }
      });
      throw error;
    }
  }

  async getEventCategories(): Promise<EventCategory[]> {
    try {
      const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'low',
        metadata: { action: 'fetch_event_categories' }
      });
      throw error;
    }
  }

  // =============================================
  // EVENT REGISTRATION
  // =============================================

  async registerForEvent(registrationData: RegisterEventData): Promise<EventRegistration> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', registrationData.event_id)
        .eq('user_id', user.id)
        .single();

      if (existingRegistration) {
        throw new Error('Already registered for this event');
      }

      // Get event details for validation
      const event = await this.getEventById(registrationData.event_id);
      if (!event) throw new Error('Event not found');

      // Check registration deadline
      if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
        throw new Error('Registration deadline has passed');
      }

      // Check capacity
      if (event.max_attendees && event.current_attendees >= event.max_attendees) {
        throw new Error('Event is full');
      }

      const registrationPayload = {
        event_id: registrationData.event_id,
        user_id: user.id,
        payment_status: event.is_free ? 'free' : 'pending',
        payment_reference: registrationData.payment_reference,
        notes: registrationData.notes,
        attendance_status: 'registered' as const
      };

      const { data, error } = await supabase
        .from('event_registrations')
        .insert(registrationPayload)
        .select(`
          *,
          event:events(*)
        `)
        .single();

      if (error) throw error;

      // Track registration
      analytics.track('event_registered', {
        event_id: registrationData.event_id,
        event_title: event.title,
        payment_method: registrationData.payment_method,
        is_free: event.is_free
      });

      // Send notification
      await this.sendRegistrationNotification(user.id, event);

      return data;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'high',
        metadata: { action: 'register_event', registration_data: registrationData }
      });
      throw error;
    }
  }

  async getUserRegistrations(userId?: string): Promise<EventRegistration[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          event:events(
            *,
            category:event_categories(*),
            organizer:profiles(full_name, avatar_url)
          )
        `)
        .eq('user_id', targetUserId)
        .order('registration_date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_user_registrations', user_id: userId }
      });
      throw error;
    }
  }

  async updateRegistrationStatus(
    registrationId: string, 
    status: 'registered' | 'attended' | 'no_show' | 'cancelled'
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('event_registrations')
        .update({
          attendance_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId)
        .eq('user_id', user.id);

      if (error) throw error;

      analytics.track('event_registration_updated', {
        registration_id: registrationId,
        new_status: status
      });
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'update_registration_status', registration_id: registrationId, status }
      });
      throw error;
    }
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user is the organizer
      const event = await this.getEventById(eventId);
      if (!event || event.organizer_id !== user.id) {
        throw new Error('Not authorized to view registrations');
      }

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          user:profiles(full_name, avatar_url, email)
        `)
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'api',
        severity: 'medium',
        metadata: { action: 'fetch_event_registrations', event_id: eventId }
      });
      throw error;
    }
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private async sendRegistrationNotification(userId: string, event: Event): Promise<void> {
    try {
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: 'Event Registration Confirmed',
          body: `You are registered for ${event.title} on ${new Date(event.start_date).toLocaleDateString()}.`,
          type: 'event_registration',
          data: {
            event_id: event.id,
            event_title: event.title,
            event_date: event.start_date
          },
          action_url: `/events/${event.slug}`
        });
    } catch (error) {
      console.error('Failed to send registration notification:', error);
    }
  }
}

export const eventApi = new EventApiService();