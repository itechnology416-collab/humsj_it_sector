-- Comprehensive Database Migration for Jama'a Connect Hub
-- This migration creates all necessary tables for the complete application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- MESSAGE & COMMUNICATION TABLES
-- =============================================

-- Messages table for all communication
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('announcement', 'newsletter', 'reminder', 'urgent', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  recipients TEXT NOT NULL CHECK (recipients IN ('all', 'members', 'admins', 'specific', 'college')),
  recipient_filter JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  delivery_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Message templates for reusable content
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'newsletter', 'reminder', 'urgent', 'general')),
  subject_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Message delivery logs
CREATE TABLE IF NOT EXISTS message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  error_message TEXT
);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL
);

-- Message recipients for specific targeting
CREATE TABLE IF NOT EXISTS message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'email', 'group')),
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_email TEXT,
  recipient_name TEXT
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  announcement_notifications BOOLEAN DEFAULT true,
  reminder_notifications BOOLEAN DEFAULT true,
  newsletter_notifications BOOLEAN DEFAULT true,
  urgent_notifications BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'never')),
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  UNIQUE(user_id)
);

-- =============================================
-- MEMBER MANAGEMENT TABLES
-- =============================================

-- Member invitations
CREATE TABLE IF NOT EXISTS member_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'accepted', 'rejected', 'expired')),
  invitation_type TEXT NOT NULL DEFAULT 'admin_invite' CHECK (invitation_type IN ('admin_invite', 'member_request')),
  intended_role TEXT DEFAULT 'member',
  created_by UUID REFERENCES profiles(id),
  created_by_email TEXT,
  invitation_token TEXT UNIQUE,
  token_expires_at TIMESTAMP,
  notes TEXT,
  bio TEXT
);

-- Member requests
CREATE TABLE IF NOT EXISTS member_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  bio TEXT,
  motivation TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,
  notes TEXT
);

-- =============================================
-- EVENTS MANAGEMENT TABLES
-- =============================================

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('friday', 'dars', 'workshop', 'special', 'meeting', 'conference')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME,
  location TEXT NOT NULL,
  description TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  speaker TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed', 'draft')),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  attendance_marked_at TIMESTAMP,
  notes TEXT,
  UNIQUE(event_id, user_id)
);

-- =============================================
-- DIGITAL TASBIH & DHIKR TRACKING TABLES
-- =============================================

-- Predefined dhikr types
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

-- Individual dhikr counting sessions
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
  UNIQUE(user_id, dhikr_type_id, session_date)
);

-- Track user streaks for different dhikr types
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
  UNIQUE(user_id, dhikr_type_id)
);

-- User-defined goals for dhikr practice
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

-- Achievement system for dhikr practice
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

-- Aggregated statistics for performance optimization
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
  UNIQUE(user_id, dhikr_type_id)
);

-- User preferences for dhikr counter
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
  UNIQUE(user_id)
);

-- =============================================
-- ISLAMIC EDUCATION TABLES
-- =============================================

-- Tajweed lessons
CREATE TABLE IF NOT EXISTS tajweed_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  lesson_number INTEGER NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  text_content TEXT NOT NULL,
  rules_covered TEXT[] DEFAULT '{}',
  practice_verses JSONB DEFAULT '[]',
  duration_minutes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tajweed progress tracking
CREATE TABLE IF NOT EXISTS tajweed_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES tajweed_lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'mastered')),
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  practice_attempts INTEGER DEFAULT 0,
  best_score INTEGER,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Hadith study content
CREATE TABLE IF NOT EXISTS hadith_study (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  collection TEXT NOT NULL CHECK (collection IN ('bukhari', 'muslim', 'tirmidhi', 'abu_dawud', 'nasai', 'ibn_majah', 'malik', 'ahmad')),
  book_number INTEGER,
  hadith_number TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  narrator TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('sahih', 'hasan', 'daif', 'mawdu')),
  topic_tags TEXT[] DEFAULT '{}',
  explanation TEXT,
  related_verses JSONB DEFAULT '[]',
  study_notes TEXT,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hadith study progress
CREATE TABLE IF NOT EXISTS hadith_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hadith_id UUID REFERENCES hadith_study(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('bookmarked', 'studying', 'memorized', 'understood')),
  personal_notes TEXT,
  memorization_score INTEGER,
  understanding_score INTEGER,
  review_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, hadith_id)
);

-- Quran study sessions
CREATE TABLE IF NOT EXISTS quran_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL,
  surah_name TEXT NOT NULL,
  ayah_from INTEGER NOT NULL,
  ayah_to INTEGER NOT NULL,
  study_type TEXT NOT NULL CHECK (study_type IN ('recitation', 'memorization', 'translation', 'tafseer', 'reflection')),
  duration_minutes INTEGER NOT NULL,
  verses_completed INTEGER NOT NULL,
  notes TEXT,
  reflection TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  session_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quran progress tracking
CREATE TABLE IF NOT EXISTS quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_verses_read INTEGER DEFAULT 0,
  total_verses_memorized INTEGER DEFAULT 0,
  current_surah INTEGER DEFAULT 1,
  current_ayah INTEGER DEFAULT 1,
  daily_goal_verses INTEGER DEFAULT 10,
  streak_days INTEGER DEFAULT 0,
  last_read_date DATE,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  favorite_surahs INTEGER[] DEFAULT '{}',
  study_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fasting tracker
CREATE TABLE IF NOT EXISTS fasting_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fast_type TEXT NOT NULL CHECK (fast_type IN ('ramadan', 'voluntary', 'makeup', 'arafah', 'ashura', 'monday_thursday')),
  status TEXT NOT NULL CHECK (status IN ('intended', 'completed', 'broken', 'missed')),
  suhoor_time TIME,
  iftar_time TIME,
  intention_made BOOLEAN DEFAULT true,
  notes TEXT,
  spiritual_reflection TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- =============================================
-- ZAKAT CALCULATOR TABLES
-- =============================================

-- Zakat calculations
CREATE TABLE IF NOT EXISTS zakat_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  calculation_date DATE NOT NULL,
  hijri_year TEXT NOT NULL,
  total_wealth DECIMAL(15,2) NOT NULL,
  nisab_threshold DECIMAL(15,2) NOT NULL,
  zakat_due DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  wealth_breakdown JSONB NOT NULL,
  deductions JSONB NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('calculated', 'paid', 'partially_paid', 'overdue')),
  payment_date DATE,
  payment_amount DECIMAL(15,2),
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Zakat payments
CREATE TABLE IF NOT EXISTS zakat_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID REFERENCES zakat_calculations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'online', 'check', 'other')),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('mosque', 'charity', 'individual', 'organization')),
  recipient_name TEXT,
  recipient_details JSONB DEFAULT '{}',
  payment_date DATE NOT NULL,
  reference_number TEXT,
  receipt_url TEXT,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- HALAL MARKETPLACE TABLES
-- =============================================

-- Marketplace categories
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace businesses
CREATE TABLE IF NOT EXISTS marketplace_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  logo_url TEXT,
  cover_image_url TEXT,
  contact_info JSONB NOT NULL DEFAULT '{}',
  address JSONB NOT NULL DEFAULT '{}',
  business_hours JSONB NOT NULL DEFAULT '{}',
  halal_certification JSONB NOT NULL DEFAULT '{}',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace products
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES marketplace_businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  category TEXT,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  halal_certification JSONB DEFAULT '{}',
  stock_quantity INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, slug)
);

-- =============================================
-- SYSTEM MONITORING TABLES
-- =============================================

-- System health monitoring
CREATE TABLE IF NOT EXISTS system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'outage', 'maintenance')),
  response_time_ms INTEGER DEFAULT 0,
  uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
  last_checked TIMESTAMP DEFAULT NOW(),
  error_count_24h INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System metrics
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('performance', 'usage', 'error', 'business', 'security')),
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_created_by ON messages(created_by);
CREATE INDEX IF NOT EXISTS idx_messages_scheduled ON messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Message template indexes
CREATE INDEX IF NOT EXISTS idx_message_templates_type ON message_templates(type);
CREATE INDEX IF NOT EXISTS idx_message_templates_created_by ON message_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_message_templates_name ON message_templates(name);

-- Message log indexes
CREATE INDEX IF NOT EXISTS idx_message_logs_message_id ON message_logs(message_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_recipient_email ON message_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_message_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_message_logs_created_at ON message_logs(created_at);

-- Member management indexes
CREATE INDEX IF NOT EXISTS idx_member_invitations_email ON member_invitations(email);
CREATE INDEX IF NOT EXISTS idx_member_invitations_status ON member_invitations(status);
CREATE INDEX IF NOT EXISTS idx_member_invitations_token ON member_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_member_requests_email ON member_requests(email);
CREATE INDEX IF NOT EXISTS idx_member_requests_status ON member_requests(status);

-- Event indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);

-- Dhikr indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_sessions_user_date ON dhikr_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_dhikr_sessions_dhikr_type ON dhikr_sessions(dhikr_type_id);
CREATE INDEX IF NOT EXISTS idx_dhikr_streaks_user ON dhikr_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_dhikr_statistics_user ON dhikr_statistics(user_id);

-- Islamic education indexes
CREATE INDEX IF NOT EXISTS idx_tajweed_progress_user_id ON tajweed_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_hadith_progress_user_id ON hadith_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_sessions_user_date ON quran_study_sessions(user_id, session_date);

-- Zakat indexes
CREATE INDEX IF NOT EXISTS idx_zakat_calculations_user_year ON zakat_calculations(user_id, hijri_year);
CREATE INDEX IF NOT EXISTS idx_zakat_payments_user_id ON zakat_payments(user_id);

-- Marketplace indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_category ON marketplace_businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_business ON marketplace_products(business_id);

-- System monitoring indexes
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_timestamp ON system_metrics(metric_name, timestamp);

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert default dhikr types
INSERT INTO dhikr_types (name, arabic_text, transliteration, translation, category, default_target, reward_description, display_order) VALUES
('SubhanAllah', 'سُبْحَانَ اللَّهِ', 'Subhan Allah', 'Glory be to Allah', 'tasbih', 33, 'Each tasbih is rewarded', 1),
('Alhamdulillah', 'الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 'All praise is due to Allah', 'tasbih', 33, 'Fills the scales of good deeds', 2),
('Allahu Akbar', 'اللَّهُ أَكْبَرُ', 'Allahu Akbar', 'Allah is the Greatest', 'tasbih', 34, 'Beloved to Ar-Rahman', 3),
('La Hawla wa la Quwwata', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', 'La hawla wa la quwwata illa billah', 'There is no power except with Allah', 'dua', 100, 'Treasure from Paradise', 4),
('Istighfar', 'أَسْتَغْفِرُ اللَّهَ', 'Astaghfirullah', 'I seek forgiveness from Allah', 'istighfar', 100, 'Opens doors of mercy', 5),
('Salawat on Prophet', 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', 'Allahumma salli ala Muhammad', 'O Allah, send blessings upon Muhammad', 'salawat', 100, 'Allah sends 10 blessings in return', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert default marketplace categories
INSERT INTO marketplace_categories (name, slug, description, sort_order) VALUES
('Food & Beverages', 'food-beverages', 'Halal food, restaurants, and beverages', 1),
('Clothing & Fashion', 'clothing-fashion', 'Islamic clothing and modest fashion', 2),
('Books & Education', 'books-education', 'Islamic books, educational materials', 3),
('Health & Beauty', 'health-beauty', 'Halal cosmetics and health products', 4),
('Services', 'services', 'Islamic services and consultations', 5),
('Electronics', 'electronics', 'Electronics and gadgets', 6)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tajweed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tajweed_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_study ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BASIC RLS POLICIES
-- =============================================

-- Users can view their own data
CREATE POLICY "Users can view own dhikr sessions" ON dhikr_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own dhikr sessions" ON dhikr_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notification preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for educational content
CREATE POLICY "Public can view dhikr types" ON dhikr_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view tajweed lessons" ON tajweed_lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view hadith study" ON hadith_study
  FOR SELECT USING (true);

CREATE POLICY "Public can view marketplace categories" ON marketplace_categories
  FOR SELECT USING (is_active = true);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dhikr_sessions_updated_at BEFORE UPDATE ON dhikr_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dhikr_streaks_updated_at BEFORE UPDATE ON dhikr_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dhikr_statistics_updated_at BEFORE UPDATE ON dhikr_statistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate Zakat
CREATE OR REPLACE FUNCTION calculate_zakat(
  total_wealth DECIMAL,
  nisab_threshold DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  IF total_wealth >= nisab_threshold THEN
    RETURN total_wealth * 0.025; -- 2.5%
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;