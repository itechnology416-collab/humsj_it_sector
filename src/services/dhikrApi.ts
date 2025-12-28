import { supabase } from '@/integrations/supabase/client';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';
import { analyticsApi } from './analyticsApi';

export interface DhikrType {
  id: string;
  name: string;
  arabic_text: string;
  transliteration: string;
  translation: string;
  category: 'tasbih' | 'istighfar' | 'salawat' | 'dua' | 'quran';
  default_target: number;
  reward_description?: string;
  source_reference?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DhikrSession {
  id: string;
  user_id: string;
  dhikr_type_id: string;
  session_date: string;
  count: number;
  target: number;
  is_goal_reached: boolean;
  session_duration_minutes?: number;
  notes?: string;
  location?: string;
  mood_before?: 'excellent' | 'good' | 'neutral' | 'stressed' | 'sad';
  mood_after?: 'excellent' | 'good' | 'neutral' | 'stressed' | 'sad';
  created_at: string;
  updated_at: string;
  
  // Joined data
  dhikr_type?: DhikrType;
}

export interface DhikrStreak {
  id: string;
  user_id: string;
  dhikr_type_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  streak_start_date?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  dhikr_type?: DhikrType;
}

export interface DhikrGoal {
  id: string;
  user_id: string;
  dhikr_type_id: string;
  goal_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target_count: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  is_completed: boolean;
  completed_at?: string;
  description?: string;
  reward_message?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  dhikr_type?: DhikrType;
}

export interface DhikrAchievement {
  id: string;
  user_id: string;
  achievement_type: 'first_dhikr' | 'daily_goal' | 'weekly_goal' | 'monthly_goal' | 'streak_milestone' | 'total_count_milestone';
  achievement_name: string;
  achievement_description?: string;
  dhikr_type_id?: string;
  milestone_value?: number;
  badge_icon?: string;
  badge_color?: string;
  points_earned: number;
  created_at: string;
  
  // Joined data
  dhikr_type?: DhikrType;
}

export interface DhikrStatistics {
  id: string;
  user_id: string;
  dhikr_type_id: string;
  total_count: number;
  total_sessions: number;
  goals_completed: number;
  average_daily_count: number;
  best_streak: number;
  total_minutes: number;
  last_session_date?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  dhikr_type?: DhikrType;
}

export interface DhikrSettings {
  id: string;
  user_id: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  auto_reset_daily: boolean;
  preferred_dhikr_type_id?: string;
  notification_reminders: boolean;
  reminder_times: string[];
  theme_preference: 'default' | 'green' | 'blue' | 'purple' | 'gold';
  created_at: string;
  updated_at: string;
  
  // Joined data
  preferred_dhikr_type?: DhikrType;
}

class DhikrApiService {
  // Dhikr Types Management
  async getDhikrTypes(activeOnly = true): Promise<DhikrType[]> {
    try {
      let query = supabase
        .from('dhikr_types')
        .select('*')
        .order('display_order');

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching dhikr types:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getDhikrTypes' }
      });
      throw error;
    }
  }

  async getDhikrTypeById(dhikrTypeId: string): Promise<DhikrType> {
    try {
      const { data, error } = await supabase
        .from('dhikr_types')
        .select('*')
        .eq('id', dhikrTypeId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching dhikr type by ID:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getDhikrTypeById', dhikrTypeId }
      });
      throw error;
    }
  }

  // Dhikr Sessions Management
  async getTodaySession(dhikrTypeId: string, userId?: string): Promise<DhikrSession | null> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('dhikr_sessions')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId)
        .eq('dhikr_type_id', dhikrTypeId)
        .eq('session_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching today session:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getTodaySession', dhikrTypeId, userId }
      });
      throw error;
    }
  }

  async createOrUpdateSession(sessionData: {
    dhikr_type_id: string;
    count: number;
    target: number;
    session_duration_minutes?: number;
    notes?: string;
    location?: string;
    mood_before?: DhikrSession['mood_before'];
    mood_after?: DhikrSession['mood_after'];
  }, userId?: string): Promise<DhikrSession> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('dhikr_sessions')
        .upsert([{
          user_id: targetUserId,
          session_date: today,
          ...sessionData,
          is_goal_reached: sessionData.count >= sessionData.target,
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .single();

      if (error) throw error;

      // Update statistics
      await this.updateStatistics(targetUserId!, sessionData.dhikr_type_id);

      // Update streak
      await this.updateStreak(targetUserId!, sessionData.dhikr_type_id, sessionData.count >= sessionData.target);

      // Check for achievements
      await this.checkAchievements(targetUserId!, sessionData.dhikr_type_id, sessionData.count);

      // Track analytics
      await analyticsApi.trackEvent('dhikr_session_updated', 'spiritual', {
        dhikr_type_id: sessionData.dhikr_type_id,
        count: sessionData.count,
        goal_reached: sessionData.count >= sessionData.target
      });

      return data;
    } catch (error) {
      console.error('Error creating/updating session:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'createOrUpdateSession', sessionData, userId }
      });
      throw error;
    }
  }

  async getUserSessions(userId?: string, filters: {
    dhikr_type_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ sessions: DhikrSession[]; total: number }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      let query = supabase
        .from('dhikr_sessions')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `, { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('session_date', { ascending: false });

      if (filters.dhikr_type_id) query = query.eq('dhikr_type_id', filters.dhikr_type_id);
      if (filters.date_from) query = query.gte('session_date', filters.date_from);
      if (filters.date_to) query = query.lte('session_date', filters.date_to);
      if (filters.limit) query = query.limit(filters.limit);
      if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return { sessions: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getUserSessions', userId, filters }
      });
      throw error;
    }
  }

  // Dhikr Streaks Management
  async getUserStreaks(userId?: string): Promise<DhikrStreak[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('dhikr_streaks')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId)
        .order('current_streak', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user streaks:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getUserStreaks', userId }
      });
      throw error;
    }
  }

  private async updateStreak(userId: string, dhikrTypeId: string, goalReached: boolean): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get current streak
      const { data: currentStreak } = await supabase
        .from('dhikr_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('dhikr_type_id', dhikrTypeId)
        .single();

      let newStreak = 0;
      let streakStartDate = today;

      if (goalReached) {
        if (currentStreak) {
          // Check if last activity was yesterday (continuous streak)
          if (currentStreak.last_activity_date === yesterday) {
            newStreak = currentStreak.current_streak + 1;
            streakStartDate = currentStreak.streak_start_date;
          } else if (currentStreak.last_activity_date === today) {
            // Same day update, keep current streak
            newStreak = currentStreak.current_streak;
            streakStartDate = currentStreak.streak_start_date;
          } else {
            // Streak broken, start new
            newStreak = 1;
          }
        } else {
          // First streak
          newStreak = 1;
        }
      } else if (currentStreak && currentStreak.last_activity_date !== today) {
        // Goal not reached and not same day - streak might be broken
        newStreak = 0;
      } else if (currentStreak) {
        // Same day, goal not reached yet - keep current streak
        newStreak = currentStreak.current_streak;
        streakStartDate = currentStreak.streak_start_date;
      }

      const longestStreak = currentStreak ? Math.max(currentStreak.longest_streak, newStreak) : newStreak;

      await supabase
        .from('dhikr_streaks')
        .upsert([{
          user_id: userId,
          dhikr_type_id: dhikrTypeId,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
          streak_start_date: streakStartDate,
          updated_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  // Dhikr Statistics Management
  async getUserStatistics(userId?: string): Promise<DhikrStatistics[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('dhikr_statistics')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId)
        .order('total_count', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getUserStatistics', userId }
      });
      throw error;
    }
  }

  private async updateStatistics(userId: string, dhikrTypeId: string): Promise<void> {
    try {
      // Get all sessions for this dhikr type
      const { data: sessions } = await supabase
        .from('dhikr_sessions')
        .select('count, session_duration_minutes, is_goal_reached, session_date')
        .eq('user_id', userId)
        .eq('dhikr_type_id', dhikrTypeId);

      if (!sessions || sessions.length === 0) return;

      const totalCount = sessions.reduce((sum, session) => sum + session.count, 0);
      const totalSessions = sessions.length;
      const goalsCompleted = sessions.filter(s => s.is_goal_reached).length;
      const totalMinutes = sessions.reduce((sum, session) => sum + (session.session_duration_minutes || 0), 0);
      const averageDailyCount = totalCount / totalSessions;
      const lastSessionDate = sessions.sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())[0].session_date;

      // Get best streak
      const { data: streakData } = await supabase
        .from('dhikr_streaks')
        .select('longest_streak')
        .eq('user_id', userId)
        .eq('dhikr_type_id', dhikrTypeId)
        .single();

      const bestStreak = streakData?.longest_streak || 0;

      await supabase
        .from('dhikr_statistics')
        .upsert([{
          user_id: userId,
          dhikr_type_id: dhikrTypeId,
          total_count: totalCount,
          total_sessions: totalSessions,
          goals_completed: goalsCompleted,
          average_daily_count: averageDailyCount,
          best_streak: bestStreak,
          total_minutes: totalMinutes,
          last_session_date: lastSessionDate,
          updated_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  }

  // Dhikr Goals Management
  async getUserGoals(userId?: string, activeOnly = true): Promise<DhikrGoal[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      let query = supabase
        .from('dhikr_goals')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user goals:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getUserGoals', userId }
      });
      throw error;
    }
  }

  async createGoal(goalData: {
    dhikr_type_id: string;
    goal_type: DhikrGoal['goal_type'];
    target_count: number;
    start_date: string;
    end_date?: string;
    description?: string;
    reward_message?: string;
  }, userId?: string): Promise<DhikrGoal> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('dhikr_goals')
        .insert([{
          user_id: targetUserId,
          ...goalData,
          is_active: true,
          is_completed: false
        }])
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dhikr_goal_created', 'spiritual', {
        dhikr_type_id: goalData.dhikr_type_id,
        goal_type: goalData.goal_type,
        target_count: goalData.target_count
      });

      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'createGoal', goalData, userId }
      });
      throw error;
    }
  }

  // Dhikr Achievements Management
  async getUserAchievements(userId?: string): Promise<DhikrAchievement[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('dhikr_achievements')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getUserAchievements', userId }
      });
      throw error;
    }
  }

  private async checkAchievements(userId: string, dhikrTypeId: string, count: number): Promise<void> {
    try {
      // Check for first dhikr achievement
      const { data: existingFirstDhikr } = await supabase
        .from('dhikr_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_type', 'first_dhikr')
        .eq('dhikr_type_id', dhikrTypeId)
        .single();

      if (!existingFirstDhikr && count > 0) {
        await supabase
          .from('dhikr_achievements')
          .insert([{
            user_id: userId,
            achievement_type: 'first_dhikr',
            achievement_name: 'First Steps',
            achievement_description: 'Completed your first dhikr session',
            dhikr_type_id: dhikrTypeId,
            badge_icon: 'star',
            badge_color: 'gold',
            points_earned: 10
          }]);
      }

      // Check for count milestones
      const milestones = [100, 500, 1000, 5000, 10000];
      const { data: stats } = await supabase
        .from('dhikr_statistics')
        .select('total_count')
        .eq('user_id', userId)
        .eq('dhikr_type_id', dhikrTypeId)
        .single();

      if (stats) {
        for (const milestone of milestones) {
          if (stats.total_count >= milestone) {
            const { data: existingMilestone } = await supabase
              .from('dhikr_achievements')
              .select('id')
              .eq('user_id', userId)
              .eq('achievement_type', 'total_count_milestone')
              .eq('dhikr_type_id', dhikrTypeId)
              .eq('milestone_value', milestone)
              .single();

            if (!existingMilestone) {
              await supabase
                .from('dhikr_achievements')
                .insert([{
                  user_id: userId,
                  achievement_type: 'total_count_milestone',
                  achievement_name: `${milestone} Dhikr Milestone`,
                  achievement_description: `Reached ${milestone} total dhikr count`,
                  dhikr_type_id: dhikrTypeId,
                  milestone_value: milestone,
                  badge_icon: 'trophy',
                  badge_color: 'gold',
                  points_earned: milestone / 10
                }]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Dhikr Settings Management
  async getUserSettings(userId?: string): Promise<DhikrSettings> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('dhikr_settings')
        .select(`
          *,
          preferred_dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No settings found, create default
        return await this.createDefaultSettings(targetUserId!);
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getUserSettings', userId }
      });
      throw error;
    }
  }

  async updateUserSettings(settings: Partial<DhikrSettings>, userId?: string): Promise<DhikrSettings> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('dhikr_settings')
        .upsert([{
          user_id: targetUserId,
          ...settings,
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          preferred_dhikr_type:dhikr_types(*)
        `)
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('dhikr_settings_updated', 'spiritual', {
        settings_changed: Object.keys(settings)
      });

      return data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateUserSettings', settings, userId }
      });
      throw error;
    }
  }

  private async createDefaultSettings(userId: string): Promise<DhikrSettings> {
    try {
      const { data, error } = await supabase
        .from('dhikr_settings')
        .insert([{
          user_id: userId,
          sound_enabled: true,
          vibration_enabled: true,
          auto_reset_daily: false,
          notification_reminders: true,
          reminder_times: ['09:00', '15:00', '21:00'],
          theme_preference: 'default'
        }])
        .select(`
          *,
          preferred_dhikr_type:dhikr_types(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating default settings:', error);
      throw error;
    }
  }

  // Analytics and Reports
  async getDhikrAnalytics(userId?: string, dateRange?: {
    from: string;
    to: string;
  }): Promise<{
    total_dhikr_count: number;
    total_sessions: number;
    goals_completed: number;
    current_streaks: number;
    favorite_dhikr: DhikrType | null;
    daily_averages: Array<{ date: string; count: number }>;
    category_breakdown: Record<string, number>;
    achievement_count: number;
  }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

      // Get overall statistics
      const { data: stats } = await supabase
        .from('dhikr_statistics')
        .select(`
          *,
          dhikr_type:dhikr_types(*)
        `)
        .eq('user_id', targetUserId);

      const totalDhikrCount = (stats || []).reduce((sum, stat) => sum + stat.total_count, 0);
      const totalSessions = (stats || []).reduce((sum, stat) => sum + stat.total_sessions, 0);
      const goalsCompleted = (stats || []).reduce((sum, stat) => sum + stat.goals_completed, 0);

      // Get current streaks
      const { data: streaks } = await supabase
        .from('dhikr_streaks')
        .select('current_streak')
        .eq('user_id', targetUserId)
        .gt('current_streak', 0);

      const currentStreaks = (streaks || []).length;

      // Find favorite dhikr (most practiced)
      const favoriteDhikr = stats && stats.length > 0 
        ? stats.sort((a, b) => b.total_count - a.total_count)[0].dhikr_type
        : null;

      // Get daily averages (last 30 days or date range)
      const fromDate = dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = dateRange?.to || new Date().toISOString().split('T')[0];

      const { data: sessions } = await supabase
        .from('dhikr_sessions')
        .select('session_date, count')
        .eq('user_id', targetUserId)
        .gte('session_date', fromDate)
        .lte('session_date', toDate);

      const dailyAverages = this.calculateDailyAverages(sessions || [], fromDate, toDate);

      // Category breakdown
      const categoryBreakdown: Record<string, number> = {};
      (stats || []).forEach(stat => {
        const category = stat.dhikr_type?.category || 'unknown';
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + stat.total_count;
      });

      // Achievement count
      const { count: achievementCount } = await supabase
        .from('dhikr_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      return {
        total_dhikr_count: totalDhikrCount,
        total_sessions: totalSessions,
        goals_completed: goalsCompleted,
        current_streaks: currentStreaks,
        favorite_dhikr: favoriteDhikr,
        daily_averages: dailyAverages,
        category_breakdown: categoryBreakdown,
        achievement_count: achievementCount || 0
      };
    } catch (error) {
      console.error('Error fetching dhikr analytics:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getDhikrAnalytics', userId, dateRange }
      });
      throw error;
    }
  }

  private calculateDailyAverages(sessions: Array<{ session_date: string; count: number }>, fromDate: string, toDate: string): Array<{ date: string; count: number }> {
    const dailyMap = new Map<string, number>();
    
    // Initialize all dates with 0
    const start = new Date(fromDate);
    const end = new Date(toDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dailyMap.set(d.toISOString().split('T')[0], 0);
    }

    // Fill in actual counts
    sessions.forEach(session => {
      const existing = dailyMap.get(session.session_date) || 0;
      dailyMap.set(session.session_date, existing + session.count);
    });

    return Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count }));
  }
}

export const dhikrApi = new DhikrApiService();
