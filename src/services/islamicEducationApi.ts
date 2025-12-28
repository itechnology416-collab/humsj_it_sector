import { supabase } from '@/integrations/supabase/client';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';
import { analyticsApi } from './analyticsApi';

export interface TajweedLesson {
  id: string;
  title: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lesson_number: number;
  audio_url?: string;
  video_url?: string;
  text_content: string;
  rules_covered: string[];
  practice_verses: Array<{
    surah: string;
    ayah: number;
    arabic_text: string;
    transliteration: string;
    translation: string;
  }>;
  duration_minutes: number;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TajweedProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  progress_percentage: number;
  time_spent_minutes: number;
  practice_attempts: number;
  best_score?: number;
  notes?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  lesson?: TajweedLesson;
}

export interface HadithStudy {
  id: string;
  title: string;
  collection: 'bukhari' | 'muslim' | 'tirmidhi' | 'abu_dawud' | 'nasai' | 'ibn_majah' | 'malik' | 'ahmad';
  book_number?: number;
  hadith_number: string;
  arabic_text: string;
  english_translation: string;
  narrator: string;
  grade: 'sahih' | 'hasan' | 'daif' | 'mawdu';
  topic_tags: string[];
  explanation?: string;
  related_verses?: Array<{
    surah: string;
    ayah: number;
    text: string;
  }>;
  study_notes?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface HadithProgress {
  id: string;
  user_id: string;
  hadith_id: string;
  status: 'bookmarked' | 'studying' | 'memorized' | 'understood';
  personal_notes?: string;
  memorization_score?: number;
  understanding_score?: number;
  review_count: number;
  last_reviewed?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  hadith?: HadithStudy;
}

export interface QuranStudySession {
  id: string;
  user_id: string;
  surah_number: number;
  surah_name: string;
  ayah_from: number;
  ayah_to: number;
  study_type: 'recitation' | 'memorization' | 'translation' | 'tafseer' | 'reflection';
  duration_minutes: number;
  verses_completed: number;
  notes?: string;
  reflection?: string;
  difficulty_rating?: number;
  session_date: string;
  created_at: string;
}

export interface QuranProgress {
  id: string;
  user_id: string;
  total_verses_read: number;
  total_verses_memorized: number;
  current_surah: number;
  current_ayah: number;
  daily_goal_verses: number;
  streak_days: number;
  last_read_date?: string;
  completion_percentage: number;
  favorite_surahs: number[];
  study_preferences: {
    preferred_reciter: string;
    translation_language: string;
    study_time_preference: string;
    reminder_enabled: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface IslamicCalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: 'religious_holiday' | 'historical_event' | 'community_event' | 'reminder';
  hijri_date: string;
  gregorian_date: string;
  is_recurring: boolean;
  significance_level: 'high' | 'medium' | 'low';
  related_content?: Array<{
    type: 'article' | 'video' | 'audio';
    title: string;
    url: string;
  }>;
  community_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PrayerTimeSettings {
  id: string;
  user_id: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  calculation_method: 'mwl' | 'isna' | 'egypt' | 'makkah' | 'karachi' | 'tehran' | 'jafari';
  madhab: 'shafi' | 'hanafi';
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  notifications_enabled: boolean;
  notification_times: {
    before_prayer_minutes: number;
    at_prayer_time: boolean;
    after_prayer_minutes: number;
  };
  created_at: string;
  updated_at: string;
}

export interface FastingTracker {
  id: string;
  user_id: string;
  date: string;
  fast_type: 'ramadan' | 'voluntary' | 'makeup' | 'arafah' | 'ashura' | 'monday_thursday';
  status: 'intended' | 'completed' | 'broken' | 'missed';
  suhoor_time?: string;
  iftar_time?: string;
  intention_made: boolean;
  notes?: string;
  spiritual_reflection?: string;
  energy_level?: number;
  mood_rating?: number;
  created_at: string;
  updated_at: string;
}

class IslamicEducationApiService {
  // Tajweed Lessons
  async getTajweedLessons(filters: {
    level?: string;
    published_only?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ lessons: TajweedLesson[]; total: number }> {
    try {
      let query = (supabase as unknown)
        .from('tajweed_lessons')
        .select('*', { count: 'exact' })
        .order('lesson_number');

      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      if (filters.published_only !== false) {
        query = query.eq('is_published', true);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        lessons: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching Tajweed lessons:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getTajweedLessons', filters }
      });
      throw error;
    }
  }

  async getTajweedProgress(userId?: string): Promise<TajweedProgress[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await (supabase as unknown)
        .from('tajweed_progress')
        .select(`
          *,
          lesson:tajweed_lessons(*)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching Tajweed progress:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getTajweedProgress', userId }
      });
      throw error;
    }
  }

  async updateTajweedProgress(lessonId: string, progressData: {
    status?: TajweedProgress['status'];
    progress_percentage?: number;
    time_spent_minutes?: number;
    practice_attempts?: number;
    best_score?: number;
    notes?: string;
  }): Promise<TajweedProgress> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await (supabase as unknown)
        .from('tajweed_progress')
        .upsert([{
          user_id: user.user?.id,
          lesson_id: lessonId,
          ...progressData,
          completed_at: progressData.status === 'completed' ? new Date().toISOString() : undefined,
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          lesson:tajweed_lessons(*)
        `)
        .single();

      if (error) throw error;

      // Track progress update
      await analyticsApi.trackEvent('tajweed_progress_updated', 'education', {
        lesson_id: lessonId,
        status: progressData.status,
        progress_percentage: progressData.progress_percentage
      });

      return data;
    } catch (error) {
      console.error('Error updating Tajweed progress:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateTajweedProgress', lessonId, progressData }
      });
      throw error;
    }
  }

  // Hadith Study
  async getHadithCollection(filters: {
    collection?: string;
    topic_tags?: string[];
    difficulty_level?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ hadiths: HadithStudy[]; total: number }> {
    try {
      let query = (supabase as unknown)
        .from('hadith_study')
        .select('*', { count: 'exact' })
        .order('collection')
        .order('hadith_number');

      if (filters.collection) {
        query = query.eq('collection', filters.collection);
      }
      if (filters.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level);
      }
      if (filters.topic_tags && filters.topic_tags.length > 0) {
        query = query.overlaps('topic_tags', filters.topic_tags);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,english_translation.ilike.%${filters.search}%,explanation.ilike.%${filters.search}%`);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        hadiths: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching Hadith collection:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getHadithCollection', filters }
      });
      throw error;
    }
  }

  async getHadithProgress(userId?: string): Promise<HadithProgress[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await (supabase as unknown)
        .from('hadith_progress')
        .select(`
          *,
          hadith:hadith_study(*)
        `)
        .eq('user_id', targetUserId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching Hadith progress:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getHadithProgress', userId }
      });
      throw error;
    }
  }

  async updateHadithProgress(hadithId: string, progressData: {
    status: HadithProgress['status'];
    personal_notes?: string;
    memorization_score?: number;
    understanding_score?: number;
  }): Promise<HadithProgress> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await (supabase as unknown)
        .from('hadith_progress')
        .upsert([{
          user_id: user.user?.id,
          hadith_id: hadithId,
          ...progressData,
          review_count: progressData.status === 'memorized' ? 1 : 0,
          last_reviewed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          hadith:hadith_study(*)
        `)
        .single();

      if (error) throw error;

      // Track progress update
      await analyticsApi.trackEvent('hadith_progress_updated', 'education', {
        hadith_id: hadithId,
        status: progressData.status
      });

      return data;
    } catch (error) {
      console.error('Error updating Hadith progress:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateHadithProgress', hadithId, progressData }
      });
      throw error;
    }
  }

  // Quran Study
  async getQuranProgress(userId?: string): Promise<QuranProgress | null> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await (supabase as unknown)
        .from('quran_progress')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      console.error('Error fetching Quran progress:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getQuranProgress', userId }
      });
      throw error;
    }
  }

  async recordQuranStudySession(sessionData: {
    surah_number: number;
    surah_name: string;
    ayah_from: number;
    ayah_to: number;
    study_type: QuranStudySession['study_type'];
    duration_minutes: number;
    notes?: string;
    reflection?: string;
    difficulty_rating?: number;
  }): Promise<QuranStudySession> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await (supabase as unknown)
        .from('quran_study_sessions')
        .insert([{
          ...sessionData,
          user_id: user.user?.id,
          verses_completed: sessionData.ayah_to - sessionData.ayah_from + 1,
          session_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      // Update overall progress
      await this.updateQuranProgress({
        verses_read: sessionData.ayah_to - sessionData.ayah_from + 1,
        current_surah: sessionData.surah_number,
        current_ayah: sessionData.ayah_to
      });

      // Track study session
      await analyticsApi.trackEvent('quran_study_session', 'education', {
        surah_number: sessionData.surah_number,
        study_type: sessionData.study_type,
        duration_minutes: sessionData.duration_minutes,
        verses_completed: sessionData.ayah_to - sessionData.ayah_from + 1
      });

      return data;
    } catch (error) {
      console.error('Error recording Quran study session:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'recordQuranStudySession', sessionData }
      });
      throw error;
    }
  }

  async updateQuranProgress(progressData: {
    verses_read?: number;
    verses_memorized?: number;
    current_surah?: number;
    current_ayah?: number;
    daily_goal_verses?: number;
    study_preferences?: QuranProgress['study_preferences'];
  }): Promise<QuranProgress> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Get current progress
      const currentProgress = await this.getQuranProgress();
      
      const updatedData = {
        user_id: user.user?.id,
        total_verses_read: (currentProgress?.total_verses_read || 0) + (progressData.verses_read || 0),
        total_verses_memorized: (currentProgress?.total_verses_memorized || 0) + (progressData.verses_memorized || 0),
        current_surah: progressData.current_surah || currentProgress?.current_surah || 1,
        current_ayah: progressData.current_ayah || currentProgress?.current_ayah || 1,
        daily_goal_verses: progressData.daily_goal_verses || currentProgress?.daily_goal_verses || 10,
        last_read_date: new Date().toISOString().split('T')[0],
        study_preferences: progressData.study_preferences || currentProgress?.study_preferences || {
          preferred_reciter: 'mishary',
          translation_language: 'english',
          study_time_preference: 'morning',
          reminder_enabled: true
        },
        updated_at: new Date().toISOString()
      };

      // Calculate completion percentage (total Quran verses ≈ 6236)
      const completionPercentage = Math.min((updatedData.total_verses_read / 6236) * 100, 100);

      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let streakDays: number;
      if (currentProgress?.last_read_date === yesterdayStr) {
        streakDays = (currentProgress.streak_days || 0) + 1;
      } else if (currentProgress?.last_read_date !== updatedData.last_read_date) {
        streakDays = 1;
      } else {
        streakDays = currentProgress?.streak_days || 1;
      }

      const finalData = {
        ...updatedData,
        completion_percentage: completionPercentage,
        streak_days: streakDays
      };

      const { data, error } = await (supabase as unknown)
        .from('quran_progress')
        .upsert([finalData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating Quran progress:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateQuranProgress', progressData }
      });
      throw error;
    }
  }

  // Islamic Calendar
  async getIslamicCalendarEvents(filters: {
    month?: number;
    year?: number;
    event_type?: string;
    community_id?: string;
  } = {}): Promise<IslamicCalendarEvent[]> {
    try {
      let query = (supabase as unknown)
        .from('islamic_calendar_events')
        .select('*')
        .order('hijri_date');

      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.community_id) {
        query = query.eq('community_id', filters.community_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching Islamic calendar events:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getIslamicCalendarEvents', filters }
      });
      throw error;
    }
  }

  // Prayer Times
  async getPrayerTimeSettings(userId?: string): Promise<PrayerTimeSettings | null> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await (supabase as unknown)
        .from('prayer_time_settings')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      console.error('Error fetching prayer time settings:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getPrayerTimeSettings', userId }
      });
      throw error;
    }
  }

  async updatePrayerTimeSettings(settingsData: Partial<PrayerTimeSettings>): Promise<PrayerTimeSettings> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await (supabase as unknown)
        .from('prayer_time_settings')
        .upsert([{
          user_id: user.user?.id,
          ...settingsData,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating prayer time settings:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updatePrayerTimeSettings', settingsData }
      });
      throw error;
    }
  }

  // Fasting Tracker
  async getFastingHistory(userId?: string, dateFrom?: string, dateTo?: string): Promise<FastingTracker[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      let query = (supabase as unknown)
        .from('fasting_tracker')
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

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching fasting history:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getFastingHistory', userId, dateFrom, dateTo }
      });
      throw error;
    }
  }

  async recordFastingDay(fastingData: {
    date: string;
    fast_type: FastingTracker['fast_type'];
    status: FastingTracker['status'];
    suhoor_time?: string;
    iftar_time?: string;
    intention_made?: boolean;
    notes?: string;
    spiritual_reflection?: string;
    energy_level?: number;
    mood_rating?: number;
  }): Promise<FastingTracker> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await (supabase as unknown)
        .from('fasting_tracker')
        .upsert([{
          user_id: user.user?.id,
          ...fastingData,
          intention_made: fastingData.intention_made || true,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Track fasting record
      await analyticsApi.trackEvent('fasting_recorded', 'spiritual', {
        fast_type: fastingData.fast_type,
        status: fastingData.status,
        date: fastingData.date
      });

      return data;
    } catch (error) {
      console.error('Error recording fasting day:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'recordFastingDay', fastingData }
      });
      throw error;
    }
  }

  // Analytics and Statistics
  async getIslamicEducationStats(userId?: string): Promise<{
    tajweed_progress: {
      lessons_completed: number;
      total_lessons: number;
      completion_rate: number;
      current_level: string;
    };
    hadith_progress: {
      hadiths_studied: number;
      hadiths_memorized: number;
      favorite_collections: string[];
    };
    quran_progress: {
      verses_read: number;
      verses_memorized: number;
      completion_percentage: number;
      current_streak: number;
    };
    spiritual_activities: {
      fasting_days_completed: number;
      prayer_consistency: number;
      study_hours_this_month: number;
    };
  }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const [
        tajweedProgress,
        hadithProgress,
        quranProgress,
        fastingHistory
      ] = await Promise.all([
        this.getTajweedProgress(targetUserId),
        this.getHadithProgress(targetUserId),
        this.getQuranProgress(targetUserId),
        this.getFastingHistory(targetUserId, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ]);

      const completedTajweedLessons = tajweedProgress.filter(p => p.status === 'completed' || p.status === 'mastered').length;
      const { lessons: totalTajweedLessons } = await this.getTajweedLessons({ published_only: true });
      
      const memorizedHadiths = hadithProgress.filter(p => p.status === 'memorized').length;
      const completedFasts = fastingHistory.filter(f => f.status === 'completed').length;

      return {
        tajweed_progress: {
          lessons_completed: completedTajweedLessons,
          total_lessons: totalTajweedLessons.length,
          completion_rate: totalTajweedLessons.length > 0 ? (completedTajweedLessons / totalTajweedLessons.length) * 100 : 0,
          current_level: this.determineTajweedLevel(completedTajweedLessons)
        },
        hadith_progress: {
          hadiths_studied: hadithProgress.length,
          hadiths_memorized: memorizedHadiths,
          favorite_collections: this.getFavoriteCollections(hadithProgress)
        },
        quran_progress: {
          verses_read: quranProgress?.total_verses_read || 0,
          verses_memorized: quranProgress?.total_verses_memorized || 0,
          completion_percentage: quranProgress?.completion_percentage || 0,
          current_streak: quranProgress?.streak_days || 0
        },
        spiritual_activities: {
          fasting_days_completed: completedFasts,
          prayer_consistency: 85, // Would need prayer tracking
          study_hours_this_month: this.calculateStudyHours(tajweedProgress, hadithProgress)
        }
      };
    } catch (error) {
      console.error('Error fetching Islamic education stats:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getIslamicEducationStats', userId }
      });
      throw error;
    }
  }

  // Utility Methods
  private determineTajweedLevel(completedLessons: number): string {
    if (completedLessons < 5) return 'beginner';
    if (completedLessons < 15) return 'intermediate';
    return 'advanced';
  }

  private getFavoriteCollections(hadithProgress: HadithProgress[]): string[] {
    const collections = hadithProgress.reduce((acc: Record<string, number>, progress) => {
      const collection = progress.hadith?.collection;
      if (collection) {
        acc[collection] = (acc[collection] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(collections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([collection]) => collection);
  }

  private calculateStudyHours(tajweedProgress: TajweedProgress[], hadithProgress: HadithProgress[]): number {
    const tajweedHours = tajweedProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) / 60;
    const hadithHours = hadithProgress.length * 0.5; // Estimate 30 minutes per hadith study
    return Math.round(tajweedHours + hadithHours);
  }
}

export const islamicEducationApi = new IslamicEducationApiService();
