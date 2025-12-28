import { supabase } from '@/integrations/supabase/client';

export interface PrayerTimes {
  id: string;
  user_id: string;
  date: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  fajr_time: string;
  sunrise_time: string;
  dhuhr_time: string;
  asr_time: string;
  maghrib_time: string;
  isha_time: string;
  calculation_method: string;
  created_at: string;
}

export interface PrayerTracking {
  id: string;
  user_id: string;
  prayer_name: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  prayer_date: string;
  prayer_time: string;
  status: 'prayed' | 'missed' | 'qada' | 'makeup';
  location?: string;
  congregation: boolean;
  notes?: string;
  created_at: string;
}

export interface QuranReading {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_from?: number;
  ayah_to?: number;
  pages_read?: number;
  reading_date: string;
  reading_time_minutes?: number;
  reading_type: 'recitation' | 'memorization' | 'study' | 'reflection';
  notes?: string;
  created_at: string;
}

export interface FastingTracker {
  id: string;
  user_id: string;
  fast_date: string;
  fast_type: 'ramadan' | 'voluntary' | 'makeup' | 'arafah' | 'ashura' | 'monday_thursday';
  status: 'completed' | 'broken' | 'intended' | 'missed';
  suhur_time?: string;
  iftar_time?: string;
  break_reason?: string;
  notes?: string;
  created_at: string;
}

export interface DhikrTracking {
  id: string;
  user_id: string;
  dhikr_type: string;
  dhikr_text?: string;
  count: number;
  target_count?: number;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export interface PrayerTimesRequest {
  latitude: number;
  longitude: number;
  date?: string;
  calculation_method?: string;
  timezone?: string;
}

export interface CreatePrayerTrackingData {
  prayer_name: PrayerTracking['prayer_name'];
  prayer_date: string;
  prayer_time: string;
  status: PrayerTracking['status'];
  location?: string;
  congregation?: boolean;
  notes?: string;
}

export interface CreateQuranReadingData {
  surah_number: number;
  ayah_from?: number;
  ayah_to?: number;
  pages_read?: number;
  reading_date?: string;
  reading_time_minutes?: number;
  reading_type: QuranReading['reading_type'];
  notes?: string;
}

export interface CreateFastingData {
  fast_date: string;
  fast_type: FastingTracker['fast_type'];
  status: FastingTracker['status'];
  suhur_time?: string;
  iftar_time?: string;
  break_reason?: string;
  notes?: string;
}

export interface CreateDhikrData {
  dhikr_type: string;
  dhikr_text?: string;
  count: number;
  target_count?: number;
  date?: string;
  notes?: string;
}

export const islamicFeaturesApi = {
  // Prayer Times Management
  async getPrayerTimes(
    latitude: number,
    longitude: number,
    date?: string
  ): Promise<{ data: PrayerTimes | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const targetDate = date || new Date().toISOString().split('T')[0];

      // Check if prayer times already exist for this date and location
      const { data: existing } = await supabase
        .from('prayer_times')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .single();

      if (existing) {
        return { data: existing };
      }

      // Calculate prayer times (in a real app, you'd use an Islamic prayer times API)
      const prayerTimes = await this.calculatePrayerTimes(latitude, longitude, targetDate);

      const { data, error } = await supabase
        .from('prayer_times')
        .insert([{
          user_id: user.id,
          date: targetDate,
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...prayerTimes
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving prayer times:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getPrayerTimes:', error);
      return { data: null, error: 'Failed to get prayer times' };
    }
  },

  // Calculate prayer times (mock implementation)
  async calculatePrayerTimes(latitude: number, longitude: number, date: string) {
    // This is a simplified mock calculation
    // In a real app, you'd use a proper Islamic prayer times calculation library
    const baseTime = new Date(`${date}T06:00:00`);
    
    return {
      fajr_time: '05:30',
      sunrise_time: '06:45',
      dhuhr_time: '12:30',
      asr_time: '15:45',
      maghrib_time: '18:15',
      isha_time: '19:30',
      calculation_method: 'ISNA'
    };
  },

  // Prayer Tracking
  async trackPrayer(prayerData: CreatePrayerTrackingData): Promise<{ data: PrayerTracking | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('prayer_tracking')
        .upsert([{
          user_id: user.id,
          ...prayerData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error tracking prayer:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in trackPrayer:', error);
      return { data: null, error: 'Failed to track prayer' };
    }
  },

  async getPrayerTracking(
    dateFrom?: string,
    dateTo?: string,
    userId?: string
  ): Promise<{ data: PrayerTracking[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], error: 'User not authenticated' };
      }

      let query = supabase
        .from('prayer_tracking')
        .select('*')
        .eq('user_id', targetUserId)
        .order('prayer_date', { ascending: false });

      if (dateFrom) {
        query = query.gte('prayer_date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('prayer_date', dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching prayer tracking:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getPrayerTracking:', error);
      return { data: [], error: 'Failed to fetch prayer tracking' };
    }
  },

  async getPrayerStats(userId?: string): Promise<{ 
    data: {
      total_prayers: number;
      prayed_count: number;
      missed_count: number;
      congregation_count: number;
      prayer_percentage: number;
      current_streak: number;
      longest_streak: number;
    } | null; 
    error?: string 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .rpc('get_prayer_statistics', { user_uuid: targetUserId });

      if (error) {
        console.error('Error fetching prayer stats:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getPrayerStats:', error);
      return { data: null, error: 'Failed to fetch prayer statistics' };
    }
  },

  // Quran Reading Tracker
  async recordQuranReading(readingData: CreateQuranReadingData): Promise<{ data: QuranReading | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('quran_reading')
        .insert([{
          user_id: user.id,
          reading_date: readingData.reading_date || new Date().toISOString().split('T')[0],
          ...readingData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error recording Quran reading:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in recordQuranReading:', error);
      return { data: null, error: 'Failed to record Quran reading' };
    }
  },

  async getQuranReadingHistory(
    dateFrom?: string,
    dateTo?: string,
    userId?: string
  ): Promise<{ data: QuranReading[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], error: 'User not authenticated' };
      }

      let query = supabase
        .from('quran_reading')
        .select('*')
        .eq('user_id', targetUserId)
        .order('reading_date', { ascending: false });

      if (dateFrom) {
        query = query.gte('reading_date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('reading_date', dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching Quran reading history:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getQuranReadingHistory:', error);
      return { data: [], error: 'Failed to fetch Quran reading history' };
    }
  },

  async getQuranProgress(userId?: string): Promise<{ 
    data: {
      total_sessions: number;
      total_pages: number;
      total_minutes: number;
      average_session_time: number;
      completion_percentage: number;
      current_surah: number;
      favorite_reading_type: string;
    } | null; 
    error?: string 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .rpc('get_quran_progress', { user_uuid: targetUserId });

      if (error) {
        console.error('Error fetching Quran progress:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getQuranProgress:', error);
      return { data: null, error: 'Failed to fetch Quran progress' };
    }
  },

  // Fasting Tracker
  async recordFasting(fastingData: CreateFastingData): Promise<{ data: FastingTracker | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('fasting_tracker')
        .upsert([{
          user_id: user.id,
          ...fastingData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error recording fasting:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in recordFasting:', error);
      return { data: null, error: 'Failed to record fasting' };
    }
  },

  async getFastingHistory(
    dateFrom?: string,
    dateTo?: string,
    userId?: string
  ): Promise<{ data: FastingTracker[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], error: 'User not authenticated' };
      }

      let query = supabase
        .from('fasting_tracker')
        .select('*')
        .eq('user_id', targetUserId)
        .order('fast_date', { ascending: false });

      if (dateFrom) {
        query = query.gte('fast_date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('fast_date', dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching fasting history:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getFastingHistory:', error);
      return { data: [], error: 'Failed to fetch fasting history' };
    }
  },

  async getFastingStats(userId?: string): Promise<{ 
    data: {
      total_fasts: number;
      completed_fasts: number;
      broken_fasts: number;
      ramadan_fasts: number;
      voluntary_fasts: number;
      completion_rate: number;
      current_streak: number;
    } | null; 
    error?: string 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .rpc('get_fasting_statistics', { user_uuid: targetUserId });

      if (error) {
        console.error('Error fetching fasting stats:', error);
        return { data: null, error: error.message };
      }

      return { data: data[0] || null };
    } catch (error) {
      console.error('Error in getFastingStats:', error);
      return { data: null, error: 'Failed to fetch fasting statistics' };
    }
  },

  // Dhikr Tracking
  async recordDhikr(dhikrData: CreateDhikrData): Promise<{ data: DhikrTracking | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('dhikr_tracking')
        .insert([{
          user_id: user.id,
          date: dhikrData.date || new Date().toISOString().split('T')[0],
          completed: dhikrData.target_count ? dhikrData.count >= dhikrData.target_count : false,
          ...dhikrData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error recording dhikr:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in recordDhikr:', error);
      return { data: null, error: 'Failed to record dhikr' };
    }
  },

  async getDhikrHistory(
    dateFrom?: string,
    dateTo?: string,
    userId?: string
  ): Promise<{ data: DhikrTracking[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: [], error: 'User not authenticated' };
      }

      let query = supabase
        .from('dhikr_tracking')
        .select('*')
        .eq('user_id', targetUserId)
        .order('date', { ascending: false });

      if (dateFrom) {
        query = query.gte('date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('date', dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching dhikr history:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getDhikrHistory:', error);
      return { data: [], error: 'Failed to fetch dhikr history' };
    }
  },

  async updateDhikrCount(dhikrId: string, newCount: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('dhikr_tracking')
        .update({ 
          count: newCount,
          completed: false // Will be updated by trigger if target is reached
        })
        .eq('id', dhikrId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating dhikr count:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateDhikrCount:', error);
      return { success: false, error: 'Failed to update dhikr count' };
    }
  },

  // Get comprehensive Islamic activity summary
  async getIslamicActivitySummary(userId?: string): Promise<{ 
    data: {
      prayer_stats: unknown;
      quran_progress: unknown;
      fasting_stats: unknown;
      dhikr_summary: {
        total_dhikr_sessions: number;
        total_dhikr_count: number;
        completed_targets: number;
        favorite_dhikr: string;
      };
      spiritual_score: number;
    } | null; 
    error?: string 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated' };
      }

      const [prayerStats, quranProgress, fastingStats] = await Promise.all([
        this.getPrayerStats(targetUserId),
        this.getQuranProgress(targetUserId),
        this.getFastingStats(targetUserId)
      ]);

      // Get dhikr summary
      const { data: dhikrData } = await supabase
        .from('dhikr_tracking')
        .select('*')
        .eq('user_id', targetUserId);

      const dhikrSummary = {
        total_dhikr_sessions: dhikrData?.length || 0,
        total_dhikr_count: dhikrData?.reduce((sum, d) => sum + d.count, 0) || 0,
        completed_targets: dhikrData?.filter(d => d.completed).length || 0,
        favorite_dhikr: dhikrData?.reduce((acc, d) => {
          acc[d.dhikr_type] = (acc[d.dhikr_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      };

      // Calculate spiritual score (0-100)
      const prayerScore = (prayerStats.data?.prayer_percentage || 0) * 0.4;
      const quranScore = Math.min((quranProgress.data?.total_sessions || 0) * 2, 30);
      const fastingScore = (fastingStats.data?.completion_rate || 0) * 0.2;
      const dhikrScore = Math.min(dhikrSummary.total_dhikr_sessions * 0.5, 10);
      
      const spiritualScore = Math.round(prayerScore + quranScore + fastingScore + dhikrScore);

      return {
        data: {
          prayer_stats: prayerStats.data,
          quran_progress: quranProgress.data,
          fasting_stats: fastingStats.data,
          dhikr_summary,
          spiritual_score: spiritualScore
        }
      };
    } catch (error) {
      console.error('Error in getIslamicActivitySummary:', error);
      return { data: null, error: 'Failed to fetch Islamic activity summary' };
    }
  }
};

export default islamicFeaturesApi;