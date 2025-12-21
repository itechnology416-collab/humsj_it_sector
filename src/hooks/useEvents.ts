import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  type: 'friday' | 'dars' | 'workshop' | 'special' | 'meeting' | 'conference';
  date: string;
  time: string;
  end_time?: string;
  location: string;
  description?: string;
  max_attendees?: number;
  current_attendees: number;
  speaker?: string;
  image_url?: string;
  status: 'active' | 'cancelled' | 'completed' | 'draft';
  created_by: string;
  created_at: string;
  updated_at: string;
  is_registered?: boolean;
  registration_count?: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  attended: boolean;
  attendance_marked_at?: string;
  notes?: string;
}

export interface CreateEventData {
  title: string;
  type: Event['type'];
  date: string;
  time: string;
  end_time?: string;
  location: string;
  description?: string;
  max_attendees?: number;
  speaker?: string;
  image_url?: string;
}

// Mock data for when database tables don't exist yet
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Friday Jumu\'ah Prayer',
    type: 'friday',
    date: '2024-12-22',
    time: '12:30',
    end_time: '13:00',
    location: 'Main Campus Mosque',
    description: 'Weekly Friday congregational prayer',
    max_attendees: 200,
    current_attendees: 145,
    speaker: 'Imam Abdullah',
    status: 'active',
    created_by: 'admin',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    is_registered: false,
    registration_count: 145
  },
  {
    id: '2',
    title: 'Islamic Tech Workshop',
    type: 'workshop',
    date: '2024-12-25',
    time: '14:00',
    end_time: '16:00',
    location: 'IT Lab 1',
    description: 'Learn about Islamic applications and technology',
    max_attendees: 30,
    current_attendees: 18,
    speaker: 'Dr. Ahmed Hassan',
    status: 'active',
    created_by: 'admin',
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
    is_registered: true,
    registration_count: 18
  },
  {
    id: '3',
    title: 'Dars - Quran Study Circle',
    type: 'dars',
    date: '2024-12-24',
    time: '19:00',
    end_time: '20:30',
    location: 'Library Hall',
    description: 'Weekly Quran study and discussion',
    max_attendees: 50,
    current_attendees: 32,
    speaker: 'Sheikh Omar',
    status: 'active',
    created_by: 'admin',
    created_at: '2024-12-05T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
    is_registered: false,
    registration_count: 32
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async () => {
    try {
      // Try to query the events table to see if it exists
      const { error } = await (supabase as any)
        .from('events')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchEvents = async (includeAll = false) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        // Use mock data if table doesn't exist
        console.log('Events table not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        setEvents(mockEvents);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = (supabase as any)
        .from('events')
        .select(`
          *,
          event_registrations(count)
        `);

      // Non-admins can only see active events
      if (!includeAll && !isAdmin) {
        query = query.eq('status', 'active');
      }

      query = query.order('date', { ascending: true });

      const { data: eventsData, error: eventsError } = await query;

      if (eventsError) throw eventsError;

      // Get user's registrations if logged in
      let userRegistrations: string[] = [];
      if (user) {
        const { data: registrations, error: regError } = await (supabase as any)
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);

        if (!regError && registrations) {
          userRegistrations = registrations.map((r: any) => r.event_id);
        }
      }

      // Format events with registration info
      const formattedEvents: Event[] = (eventsData || []).map((event: any) => ({
        ...event,
        is_registered: userRegistrations.includes(event.id),
        registration_count: Array.isArray(event.event_registrations) ? event.event_registrations.length : 0
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
      
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      setUseMockData(true);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData): Promise<Event | null> => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to create events');
      }

      if (useMockData) {
        // Mock implementation
        const newEvent: Event = {
          id: Date.now().toString(),
          ...eventData,
          current_attendees: 0,
          status: 'active',
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_registered: false,
          registration_count: 0
        };
        
        setEvents(prev => [newEvent, ...prev]);
        toast.success('Event created successfully! (Mock data - please set up database)');
        return newEvent;
      }

      const { data, error } = await (supabase as any)
        .from('events')
        .insert([{
          ...eventData,
          created_by: user.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      const newEvent: Event = {
        ...data,
        current_attendees: 0,
        is_registered: false,
        registration_count: 0
      };

      setEvents(prev => [newEvent, ...prev]);
      toast.success('Event created successfully!');
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
      return null;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<CreateEventData>): Promise<boolean> => {
    try {
      if (useMockData) {
        // Mock implementation
        setEvents(prev => prev.map(event => 
          event.id === eventId ? { ...event, ...updates } : event
        ));
        toast.success('Event updated successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('events')
        .update(updates)
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      ));

      toast.success('Event updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
      return false;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      if (useMockData) {
        // Mock implementation
        setEvents(prev => prev.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event');
      return false;
    }
  };

  const registerForEvent = async (eventId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to register for events');
      }

      if (useMockData) {
        // Mock implementation
        const event = events.find(e => e.id === eventId);
        if (event?.max_attendees && event.current_attendees >= event.max_attendees) {
          toast.error('Event is full');
          return false;
        }

        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                is_registered: true, 
                current_attendees: event.current_attendees + 1 
              } 
            : event
        ));

        toast.success('Successfully registered for event! (Mock data)');
        return true;
      }

      // Check if event has capacity
      const event = events.find(e => e.id === eventId);
      if (event?.max_attendees && event.current_attendees >= event.max_attendees) {
        toast.error('Event is full');
        return false;
      }

      const { error } = await (supabase as any)
        .from('event_registrations')
        .insert([{
          event_id: eventId,
          user_id: user.id
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('You are already registered for this event');
          return false;
        }
        throw error;
      }

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              is_registered: true, 
              current_attendees: event.current_attendees + 1 
            } 
          : event
      ));

      toast.success('Successfully registered for event!');
      return true;
    } catch (err) {
      console.error('Error registering for event:', err);
      toast.error('Failed to register for event');
      return false;
    }
  };

  const unregisterFromEvent = async (eventId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      if (useMockData) {
        // Mock implementation
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                is_registered: false, 
                current_attendees: Math.max(0, event.current_attendees - 1) 
              } 
            : event
        ));

        toast.success('Successfully unregistered from event (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              is_registered: false, 
              current_attendees: Math.max(0, event.current_attendees - 1) 
            } 
          : event
      ));

      toast.success('Successfully unregistered from event');
      return true;
    } catch (err) {
      console.error('Error unregistering from event:', err);
      toast.error('Failed to unregister from event');
      return false;
    }
  };

  const markAttendance = async (eventId: string, userId: string, attended: boolean): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can mark attendance');
      }

      if (useMockData) {
        toast.success(`Attendance ${attended ? 'marked' : 'unmarked'} successfully (Mock data)`);
        return true;
      }

      const { error } = await (supabase as any)
        .from('event_registrations')
        .update({ 
          attended,
          attendance_marked_at: attended ? new Date().toISOString() : null
        })
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Attendance ${attended ? 'marked' : 'unmarked'} successfully`);
      return true;
    } catch (err) {
      console.error('Error marking attendance:', err);
      toast.error('Failed to mark attendance');
      return false;
    }
  };

  const getEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
    try {
      if (useMockData) {
        // Return mock registrations
        return [
          {
            id: '1',
            event_id: eventId,
            user_id: 'user1',
            registered_at: new Date().toISOString(),
            attended: false
          }
        ];
      }

      const { data, error } = await (supabase as any)
        .from('event_registrations')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .eq('event_id', eventId)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching event registrations:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user, isAdmin]);

  return {
    events,
    loading,
    error,
    useMockData,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    markAttendance,
    getEventRegistrations,
    refetch: fetchEvents
  };
};