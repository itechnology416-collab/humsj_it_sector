import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';

export interface AttendanceRecord {
  id: string;
  event_id: string;
  user_id: string;
  attended: boolean;
  marked_at: string;
  marked_by: string;
  notes?: string;
  check_in_time?: string;
  check_out_time?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  event?: {
    id: string;
    title: string;
    date: string;
    type: string;
    location?: string;
  };
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  marked_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface EventAttendanceStats {
  event_id: string;
  event_title: string;
  event_date: string;
  event_type: string;
  total_registered: number;
  total_attended: number;
  total_absent: number;
  attendance_rate: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface AttendanceFilters {
  event_id?: string;
  user_id?: string;
  attended?: boolean;
  date_from?: string;
  date_to?: string;
  event_type?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface BulkAttendanceUpdate {
  event_id: string;
  attendance_records: {
    user_id: string;
    attended: boolean;
    notes?: string;
  }[];
}

class AttendanceApiService {
  // Get attendance records with filters
  async getAttendanceRecords(filters: AttendanceFilters = {}): Promise<AttendanceRecord[]> {
    try {
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          event:events!attendance_records_event_id_fkey (
            id,
            title,
            date,
            type,
            location
          ),
          user:profiles!attendance_records_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url
          ),
          marked_by_user:profiles!attendance_records_marked_by_fkey (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.event_id) {
        query = query.eq('event_id', filters.event_id);
      }
      
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      
      if (filters.attended !== undefined) {
        query = query.eq('attended', filters.attended);
      }
      
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Apply search filter on client side for complex searches
      let filteredData = data || [];
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(record => 
          record.user?.full_name?.toLowerCase().includes(searchLower) ||
          record.user?.email?.toLowerCase().includes(searchLower) ||
          record.event?.title?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.event_type) {
        filteredData = filteredData.filter(record => 
          record.event?.type === filters.event_type
        );
      }

      return filteredData;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch attendance records');
      throw error;
    }
  }

  // Get attendance statistics for events
  async getEventAttendanceStats(eventIds?: string[]): Promise<EventAttendanceStats[]> {
    try {
      let query = supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          type,
          status,
          event_registrations!inner (
            user_id
          ),
          attendance_records (
            attended
          )
        `)
        .order('date', { ascending: false });

      if (eventIds && eventIds.length > 0) {
        query = query.in('id', eventIds);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      const stats: EventAttendanceStats[] = (events || []).map(event => {
        const totalRegistered = event.event_registrations?.length || 0;
        const attendanceRecords = event.attendance_records || [];
        const totalAttended = attendanceRecords.filter(record => record.attended).length;
        const totalAbsent = attendanceRecords.filter(record => !record.attended).length;
        const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

        // Determine status based on date
        const eventDate = new Date(event.date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        
        let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
        if (eventDay < today) {
          status = 'completed';
        } else if (eventDay.getTime() === today.getTime()) {
          status = 'ongoing';
        }

        return {
          event_id: event.id,
          event_title: event.title,
          event_date: event.date,
          event_type: event.type,
          total_registered: totalRegistered,
          total_attended: totalAttended,
          total_absent: totalAbsent,
          attendance_rate: attendanceRate,
          status
        };
      });

      return stats;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch attendance statistics');
      throw error;
    }
  }

  // Mark individual attendance
  async markAttendance(
    eventId: string, 
    userId: string, 
    attended: boolean, 
    markedBy: string,
    options: {
      notes?: string;
      checkInTime?: string;
      checkOutTime?: string;
      location?: string;
    } = {}
  ): Promise<AttendanceRecord> {
    try {
      const attendanceData = {
        event_id: eventId,
        user_id: userId,
        attended,
        marked_by: markedBy,
        marked_at: new Date().toISOString(),
        notes: options.notes,
        check_in_time: options.checkInTime,
        check_out_time: options.checkOutTime,
        location: options.location
      };

      // Check if record already exists
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      let result;
      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('attendance_records')
          .update({
            attended,
            marked_by: markedBy,
            marked_at: new Date().toISOString(),
            notes: options.notes,
            check_in_time: options.checkInTime,
            check_out_time: options.checkOutTime,
            location: options.location,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select(`
            *,
            event:events!attendance_records_event_id_fkey (
              id, title, date, type, location
            ),
            user:profiles!attendance_records_user_id_fkey (
              id, full_name, email, avatar_url
            ),
            marked_by_user:profiles!attendance_records_marked_by_fkey (
              id, full_name, email
            )
          `)
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('attendance_records')
          .insert(attendanceData)
          .select(`
            *,
            event:events!attendance_records_event_id_fkey (
              id, title, date, type, location
            ),
            user:profiles!attendance_records_user_id_fkey (
              id, full_name, email, avatar_url
            ),
            marked_by_user:profiles!attendance_records_marked_by_fkey (
              id, full_name, email
            )
          `)
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to mark attendance');
      throw error;
    }
  }

  // Bulk update attendance for an event
  async bulkUpdateAttendance(bulkUpdate: BulkAttendanceUpdate, markedBy: string): Promise<AttendanceRecord[]> {
    try {
      const results: AttendanceRecord[] = [];
      
      for (const record of bulkUpdate.attendance_records) {
        const result = await this.markAttendance(
          bulkUpdate.event_id,
          record.user_id,
          record.attended,
          markedBy,
          { notes: record.notes }
        );
        results.push(result);
      }

      return results;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to bulk update attendance');
      throw error;
    }
  }

  // Get user's attendance history
  async getUserAttendanceHistory(userId: string, limit = 50): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          *,
          event:events!attendance_records_event_id_fkey (
            id, title, date, type, location
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch user attendance history');
      throw error;
    }
  }

  // Get attendance summary for a user
  async getUserAttendanceSummary(userId: string, dateFrom?: string, dateTo?: string) {
    try {
      let query = supabase
        .from('attendance_records')
        .select('attended, created_at')
        .eq('user_id', userId);

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      const records = data || [];
      const totalEvents = records.length;
      const attendedEvents = records.filter(r => r.attended).length;
      const absentEvents = totalEvents - attendedEvents;
      const attendanceRate = totalEvents > 0 ? Math.round((attendedEvents / totalEvents) * 100) : 0;

      return {
        total_events: totalEvents,
        attended_events: attendedEvents,
        absent_events: absentEvents,
        attendance_rate: attendanceRate
      };
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch user attendance summary');
      throw error;
    }
  }

  // Delete attendance record
  async deleteAttendanceRecord(recordId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to delete attendance record');
      throw error;
    }
  }

  // Export attendance data
  async exportAttendanceData(filters: AttendanceFilters = {}): Promise<any[]> {
    try {
      const records = await this.getAttendanceRecords({ ...filters, limit: 10000 });
      
      return records.map(record => ({
        'Event Title': record.event?.title || 'N/A',
        'Event Date': record.event?.date ? new Date(record.event.date).toLocaleDateString() : 'N/A',
        'Event Type': record.event?.type || 'N/A',
        'Member Name': record.user?.full_name || 'N/A',
        'Member Email': record.user?.email || 'N/A',
        'Attendance Status': record.attended ? 'Present' : 'Absent',
        'Marked At': new Date(record.marked_at).toLocaleString(),
        'Marked By': record.marked_by_user?.full_name || 'System',
        'Check In Time': record.check_in_time ? new Date(record.check_in_time).toLocaleString() : 'N/A',
        'Check Out Time': record.check_out_time ? new Date(record.check_out_time).toLocaleString() : 'N/A',
        'Location': record.location || 'N/A',
        'Notes': record.notes || 'N/A'
      }));
    } catch (error) {
      errorHandler.handleError(error, 'Failed to export attendance data');
      throw error;
    }
  }
}

export const attendanceApi = new AttendanceApiService();