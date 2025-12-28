-- Migration: Create Digital Tasbih & Dhikr Tracking Tables
-- Created: 2024-12-27
-- Description: Complete database schema for dhikr tracking, sessions, streaks, goals, achievements, and settings

-- =============================================
-- DIGITAL TASBIH & DHIKR TRACKING TABLES
-- =============================================

-- Dhikr Types Table
CREATE TABLE IF NOT EXISTS dhikr_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  translation TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tasbih', 'istighfar', 'salawat', 'dua', 'quran')),
  default_target INTEGER NOT NULL DEFAULT 33,
  reward_description TEXT,
  source_reference TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Dhikr Sessions Table
CREATE TABLE IF NOT EXISTS dhikr_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dhikr_type_id UUID NOT NULL REFERENCES dhikr_types(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL,
  is_goal_reached BOOLEAN DEFAULT false,
  session_duration_minutes INTEGER,
  notes TEXT,
  location TEXT,
  mood_before TEXT CHECK (mood_before IN ('excellent', 'good', 'neutral', 'stressed', 'sad')),
  mood_after TEXT CHECK (mood_after IN ('excellent', 'good', 'neutral', 'stressed', 'sad')),
  
  -- Unique constraint to prevent duplicate sessions per day per dhikr type
  UNIQUE(user_id, dhikr_type_id, session_date)
);

-- Dhikr Streaks Table
CREATE TABLE IF NOT EXISTS dhikr_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dhikr_type_id UUID NOT NULL REFERENCES dhikr_types(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  
  -- Unique constraint per user per dhikr type
  UNIQUE(user_id, dhikr_type_id)
);

-- Dhikr Goals Table
CREATE TABLE IF NOT EXISTS dhikr_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dhikr_type_id UUID NOT NULL REFERENCES dhikr_types(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly', 'custom')),
  target_count INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  description TEXT,
  reward_message TEXT
);

-- Dhikr Achievements Table
CREATE TABLE IF NOT EXISTS dhikr_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('first_dhikr', 'daily_goal', 'weekly_goal', 'monthly_goal', 'streak_milestone', 'total_count_milestone')),
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  dhikr_type_id UUID REFERENCES dhikr_types(id),
  milestone_value INTEGER,
  badge_icon TEXT,
  badge_color TEXT,
  points_earned INTEGER DEFAULT 0
);

-- Dhikr Statistics Table
CREATE TABLE IF NOT EXISTS dhikr_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dhikr_type_id UUID NOT NULL REFERENCES dhikr_types(id) ON DELETE CASCADE,
  total_count INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  goals_completed INTEGER NOT NULL DEFAULT 0,
  average_daily_count DECIMAL(10,2) DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  last_session_date DATE,
  
  -- Unique constraint per user per dhikr type
  UNIQUE(user_id, dhikr_type_id)
);

-- Dhikr Settings Table
CREATE TABLE IF NOT EXISTS dhikr_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  auto_reset_daily BOOLEAN DEFAULT false,
  preferred_dhikr_type_id UUID REFERENCES dhikr_types(id),
  notification_reminders BOOLEAN DEFAULT true,
  reminder_times JSONB DEFAULT '[]',
  theme_preference TEXT DEFAULT 'default' CHECK (theme_preference IN ('default', 'green', 'blue', 'purple', 'gold')),
  
  -- Unique constraint per user
  UNIQUE(user_id)
);

-- =============================================
-- DHIKR TRACKING INDEXES
-- =============================================

-- Dhikr Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_sessions_user_date ON dhikr_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_dhikr_sessions_dhikr_type ON dhikr_sessions(dhikr_type_id);
CREATE INDEX IF NOT EXISTS idx_dhikr_sessions_goal_reached ON dhikr_sessions(is_goal_reached);

-- Dhikr Streaks Indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_streaks_user ON dhikr_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_dhikr_streaks_current_streak ON dhikr_streaks(current_streak DESC);

-- Dhikr Goals Indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_goals_user_active ON dhikr_goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_dhikr_goals_type_dates ON dhikr_goals(goal_type, start_date, end_date);

-- Dhikr Achievements Indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_achievements_user ON dhikr_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_dhikr_achievements_type ON dhikr_achievements(achievement_type);

-- Dhikr Statistics Indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_statistics_user ON dhikr_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_dhikr_statistics_total_count ON dhikr_statistics(total_count DESC);

-- Dhikr Settings Index
CREATE INDEX IF NOT EXISTS idx_dhikr_settings_user ON dhikr_settings(user_id);

-- =============================================
-- DHIKR TRACKING RLS POLICIES
-- =============================================

-- Enable RLS on all dhikr tables
ALTER TABLE dhikr_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_settings ENABLE ROW LEVEL SECURITY;

-- Dhikr Types Policies (public read, admin write)
CREATE POLICY "Dhikr types are viewable by everyone" ON dhikr_types FOR SELECT USING (true);
CREATE POLICY "Dhikr types are editable by admins" ON dhikr_types FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Dhikr Sessions Policies (users can manage their own)
CREATE POLICY "Users can view own dhikr sessions" ON dhikr_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dhikr sessions" ON dhikr_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dhikr sessions" ON dhikr_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dhikr sessions" ON dhikr_sessions FOR DELETE USING (auth.uid() = user_id);

-- Dhikr Streaks Policies (users can manage their own)
CREATE POLICY "Users can view own dhikr streaks" ON dhikr_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dhikr streaks" ON dhikr_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dhikr streaks" ON dhikr_streaks FOR UPDATE USING (auth.uid() = user_id);

-- Dhikr Goals Policies (users can manage their own)
CREATE POLICY "Users can view own dhikr goals" ON dhikr_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dhikr goals" ON dhikr_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dhikr goals" ON dhikr_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dhikr goals" ON dhikr_goals FOR DELETE USING (auth.uid() = user_id);

-- Dhikr Achievements Policies (users can view their own)
CREATE POLICY "Users can view own dhikr achievements" ON dhikr_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert dhikr achievements" ON dhikr_achievements FOR INSERT WITH CHECK (true);

-- Dhikr Statistics Policies (users can view their own)
CREATE POLICY "Users can view own dhikr statistics" ON dhikr_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage dhikr statistics" ON dhikr_statistics FOR ALL WITH CHECK (true);

-- Dhikr Settings Policies (users can manage their own)
CREATE POLICY "Users can view own dhikr settings" ON dhikr_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dhikr settings" ON dhikr_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dhikr settings" ON dhikr_settings FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- DHIKR TRACKING TRIGGERS
-- =============================================

-- Update timestamps trigger for dhikr tables
CREATE OR REPLACE FUNCTION update_dhikr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_dhikr_types_updated_at BEFORE UPDATE ON dhikr_types FOR EACH ROW EXECUTE FUNCTION update_dhikr_updated_at();
CREATE TRIGGER update_dhikr_sessions_updated_at BEFORE UPDATE ON dhikr_sessions FOR EACH ROW EXECUTE FUNCTION update_dhikr_updated_at();
CREATE TRIGGER update_dhikr_streaks_updated_at BEFORE UPDATE ON dhikr_streaks FOR EACH ROW EXECUTE FUNCTION update_dhikr_updated_at();
CREATE TRIGGER update_dhikr_goals_updated_at BEFORE UPDATE ON dhikr_goals FOR EACH ROW EXECUTE FUNCTION update_dhikr_updated_at();
CREATE TRIGGER update_dhikr_statistics_updated_at BEFORE UPDATE ON dhikr_statistics FOR EACH ROW EXECUTE FUNCTION update_dhikr_updated_at();
CREATE TRIGGER update_dhikr_settings_updated_at BEFORE UPDATE ON dhikr_settings FOR EACH ROW EXECUTE FUNCTION update_dhikr_updated_at();

-- =============================================
-- DHIKR TRACKING SEED DATA
-- =============================================

-- Insert default dhikr types
INSERT INTO dhikr_types (name, arabic_text, transliteration, translation, category, default_target, reward_description, display_order) VALUES
('SubhanAllah', 'سُبْحَانَ اللَّهِ', 'Subhan Allah', 'Glory be to Allah', 'tasbih', 33, 'Each tasbih is rewarded', 1),
('Alhamdulillah', 'الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 'All praise is due to Allah', 'tasbih', 33, 'Fills the scales of good deeds', 2),
('Allahu Akbar', 'اللَّهُ أَكْبَرُ', 'Allahu Akbar', 'Allah is the Greatest', 'tasbih', 34, 'Beloved to Ar-Rahman', 3),
('La Hawla wa la Quwwata', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', 'La hawla wa la quwwata illa billah', 'There is no power except with Allah', 'dua', 100, 'Treasure from Paradise', 4),
('Istighfar', 'أَسْتَغْفِرُ اللَّهَ', 'Astaghfirullah', 'I seek forgiveness from Allah', 'istighfar', 100, 'Opens doors of mercy', 5),
('Salawat on Prophet', 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', 'Allahumma salli ala Muhammad', 'O Allah, send blessings upon Muhammad', 'salawat', 100, 'Allah sends 10 blessings in return', 6)
ON CONFLICT DO NOTHING;