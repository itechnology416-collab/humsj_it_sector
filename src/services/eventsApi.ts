import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'friday' | 'dars' | 'workshop' | 'special' | 'meeting' | 'conference' | 'social' | 'charity';
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  venue_details?: string;
  max_attendees?: number;
  current_attendees: number;
  registration_required: boolean;
  registration_deadline?: string;
  price?: number;
  currency?: string;
  speaker?: string;
  speaker_bio?: string;
  organizer_id: string;
  organizer_name?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  image_url?: string;
  tags: string[];
  requirements?: string[];
  agenda?: EventAgendaItem[];
  resources?: EventResource[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface EventAgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
  duration_minutes: number;
}

export interface EventResource {
  id: string;
  name: string;
  type: 'document' | 'link' | 'video' | 'audio';
  url: string;
  description?: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  registration_date: string;
  status: 'registered' | 'attended' | 'cancelled' | 'no_show';
  notes?: string;
  special_requirements?: string;
  payment_status?: 'pending' | 'paid' | 'refunded';
  payment_amount?: number;
  check_in_time?: string;
  check_out_time?: string;
}

export interface EventAttendance {
  id: string;
  event_id: string;
  user_id: string;
  check_in_time: string;
  check_out_time?: string;
  attendance_status: 'present' | 'late' | 'left_early' | 'absent';
  notes?: string;
  verified_by?: string;
}

export interface EventFeedback {
  id: string;
  event_id: string;
  user_id: string;
  rating: number;
  feedback_text?: string;
  suggestions?: string;
  would_recommend: boolean;
  created_at: string;
}

export interface EventStats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  total_registrations: number;
  average_attendance_rate: number;
  popular_event_types: Array<{ type: string; count: number }>;
  monthly_stats: Array<{ month: string; events: number; attendees: number }>;
}

export interface CreateEventData {
  title: string;
  description: string;
  type: Event['type'];
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  venue_details?: string;
  max_attendees?: number;
  registration_required: boolean;
  registration_deadline?: string;
  price?: number;
  currency?: string;
  speaker?: string;
  speaker_bio?: string;
  is_featured?: boolean;
  image_url?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: Omit<EventAgendaItem, 'id'>[];
  resources?: Omit<EventResource, 'id'>[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: Event['status'];
}

export interface EventFilters {
  type?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
  location?: string;
  speaker?: string;
  status?: string;
  is_featured?: boolean;
  has_availability?: boolean;
  price_range?: { min?: number; max?: number };
  tags?: string[];
  search?: string;
}

export interface EventsListOptions {
  page?: number;
  limit?: number;
  sort_by?: 'date' | 'title' | 'created_at' | 'attendees';
  sort_order?: 'asc' | 'desc';
  filters?: EventFilters;
}

// Events API Service
export const eventsApi = {
  // Get all events with filtering and pagination
  async getEvents(options: EventsListOptions = {}): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        sort_by = 'date',
        sort_order = 'asc',
        filters = {}
      } = options;

      let query = supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name),
          registrations:event_registrations(count),
          agenda:event_agenda(*),
          resources:event_resources(*)
        `, { count: 'exact' });

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.date_from) {
        query = query.gte('date', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('date', filters.date_to);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.speaker) {
        query = query.ilike('speaker', `%${filters.speaker}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.in('status', ['published', 'completed']);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.has_availability) {
        query = query.or('max_attendees.is.null,current_attendees.lt.max_attendees');
      }
      if (filters.price_range) {
        if (filters.price_range.min !== undefined) {
          query = query.gte('price', filters.price_range.min);
        }
        if (filters.price_range.max !== undefined) {
          query = query.lte('price', filters.price_range.max);
        }
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      const ascending = sort_order === 'asc';
      query = query.order(sort_by, { ascending });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
      }

      const total = count || 0;
      const total_pages = Math.ceil(total / limit);

      return {
        events: data || [],
        total,
        page,
        limit,
        total_pages
      };
    } catch (error) {
      console.error('Error in getEvents:', error);
      throw error;
    }
  },

  // Get single event by ID
  async getEvent(eventId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name, email),
          registrations:event_registrations(*),
          agenda:event_agenda(*),
          resources:event_resources(*),
          feedback:event_feedback(*)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getEvent:', error);
      return null;
    }
  },

  // Create new event
  async createEvent(eventData: CreateEventData): Promise<Event | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { agenda, resources, ...eventFields } = eventData;

      // Create the event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert([{
          ...eventFields,
          organizer_id: user.id,
          created_by: user.id,
          current_attendees: 0,
          status: 'draft'
        }])
        .select()
        .single();

      if (eventError) {
        console.error('Error creating event:', eventError);
        throw new Error('Failed to create event');
      }

      // Add agenda items if provided
      if (agenda && agenda.length > 0) {
        const agendaItems = agenda.map(item => ({
          ...item,
          event_id: event.id
        }));

        const { error: agendaError } = await supabase
          .from('event_agenda')
          .insert(agendaItems);

        if (agendaError) {
          console.error('Error creating agenda:', agendaError);
        }
      }

      // Add resources if provided
      if (resources && resources.length > 0) {
        const resourceItems = resources.map(resource => ({
          ...resource,
          event_id: event.id
        }));

        const { error: resourceError } = await supabase
          .from('event_resources')
          .insert(resourceItems);

        if (resourceError) {
          console.error('Error creating resources:', resourceError);
        }
      }

      return await this.getEvent(event.id);
    } catch (error) {
      console.error('Error in createEvent:', error);
      throw error;
    }
  },

  // Update event
  async updateEvent(eventId: string, eventData: UpdateEventData): Promise<Event | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('created_by', user.id); // Ensure user can only update their own events

      if (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
      }

      return await this.getEvent(eventId);
    } catch (error) {
      console.error('Error in updateEvent:', error);
      throw error;
    }
  },

  // Delete event
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return false;
    }
  },

  // Register for event
  async registerForEvent(eventId: string, specialRequirements?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingRegistration) {
        throw new Error('Already registered for this event');
      }

      // Check event capacity
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      if (event.max_attendees && event.current_attendees >= event.max_attendees) {
        throw new Error('Event is full');
      }

      // Check registration deadline
      if (event.registration_deadline) {
        const deadline = new Date(event.registration_deadline);
        if (new Date() > deadline) {
          throw new Error('Registration deadline has passed');
        }
      }

      // Create registration
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: eventId,
          user_id: user.id,
          status: 'registered',
          special_requirements: specialRequirements,
          payment_status: event.price ? 'pending' : 'paid',
          payment_amount: event.price || 0
        }]);

      if (registrationError) {
        console.error('Error creating registration:', registrationError);
        throw new Error('Failed to register for event');
      }

      // Update attendee count
      const { error: updateError } = await supabase
        .from('events')
        .update({ current_attendees: event.current_attendees + 1 })
        .eq('id', eventId);

      if (updateError) {
        console.error('Error updating attendee count:', updateError);
      }

      return true;
    } catch (error) {
      console.error('Error in registerForEvent:', error);
      throw error;
    }
  },

  // Cancel registration
  async cancelRegistration(eventId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update registration status
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .update({ status: 'cancelled' })
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (registrationError) {
        console.error('Error cancelling registration:', registrationError);
        throw new Error('Failed to cancel registration');
      }

      // Update attendee count
      const event = await this.getEvent(eventId);
      if (event) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ current_attendees: Math.max(0, event.current_attendees - 1) })
          .eq('id', eventId);

        if (updateError) {
          console.error('Error updating attendee count:', updateError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in cancelRegistration:', error);
      throw error;
    }
  },

  // Get user's event registrations
  async getUserRegistrations(userId?: string): Promise<EventRegistration[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          event:events(*)
        `)
        .eq('user_id', targetUserId)
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching user registrations:', error);
        throw new Error('Failed to fetch registrations');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserRegistrations:', error);
      throw error;
    }
  },

  // Check in to event
  async checkInToEvent(eventId: string, userId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('event_attendance')
        .insert([{
          event_id: eventId,
          user_id: targetUserId,
          check_in_time: new Date().toISOString(),
          attendance_status: 'present'
        }]);

      if (error) {
        console.error('Error checking in to event:', error);
        throw new Error('Failed to check in to event');
      }

      return true;
    } catch (error) {
      console.error('Error in checkInToEvent:', error);
      throw error;
    }
  },

  // Submit event feedback
  async submitEventFeedback(
    eventId: string,
    rating: number,
    feedbackText?: string,
    suggestions?: string,
    wouldRecommend: boolean = true
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('event_feedback')
        .insert([{
          event_id: eventId,
          user_id: user.id,
          rating,
          feedback_text: feedbackText,
          suggestions,
          would_recommend: wouldRecommend
        }]);

      if (error) {
        console.error('Error submitting feedback:', error);
        throw new Error('Failed to submit feedback');
      }

      return true;
    } catch (error) {
      console.error('Error in submitEventFeedback:', error);
      throw error;
    }
  },

  // Get event statistics
  async getEventStats(): Promise<EventStats> {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('type, date, current_attendees, status');

      if (error) {
        console.error('Error fetching event stats:', error);
        throw new Error('Failed to fetch event statistics');
      }

      const now = new Date();
      const upcomingEvents = events?.filter(e => new Date(e.date) > now) || [];
      const completedEvents = events?.filter(e => e.status === 'completed') || [];

      // Calculate popular event types
      const typeCount: Record<string, number> = {};
      events?.forEach(event => {
        typeCount[event.type] = (typeCount[event.type] || 0) + 1;
      });

      const popularEventTypes = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Calculate monthly stats (last 12 months)
      const monthlyStats = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        
        const monthEvents = events?.filter(e => e.date.startsWith(monthKey)) || [];
        const totalAttendees = monthEvents.reduce((sum, e) => sum + e.current_attendees, 0);
        
        monthlyStats.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          events: monthEvents.length,
          attendees: totalAttendees
        });
      }

      // Get total registrations
      const { count: totalRegistrations } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true });

      // Calculate average attendance rate
      const eventsWithAttendance = events?.filter(e => e.current_attendees > 0) || [];
      const averageAttendanceRate = eventsWithAttendance.length > 0
        ? eventsWithAttendance.reduce((sum, e) => sum + e.current_attendees, 0) / eventsWithAttendance.length
        : 0;

      return {
        total_events: events?.length || 0,
        upcoming_events: upcomingEvents.length,
        completed_events: completedEvents.length,
        total_registrations: totalRegistrations || 0,
        average_attendance_rate: Math.round(averageAttendanceRate * 100) / 100,
        popular_event_types: popularEventTypes,
        monthly_stats: monthlyStats
      };
    } catch (error) {
      console.error('Error in getEventStats:', error);
      throw error;
    }
  },

  // Get featured events
  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name)
        `)
        .eq('is_featured', true)
        .eq('status', 'published')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured events:', error);
        throw new Error('Failed to fetch featured events');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedEvents:', error);
      throw error;
    }
  },

  // Get upcoming events
  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name)
        `)
        .eq('status', 'published')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching upcoming events:', error);
        throw new Error('Failed to fetch upcoming events');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUpcomingEvents:', error);
      throw error;
    }
  }
};

export default eventsApi;