-- Complete Database Setup Script for Jama'a Connect Hub
-- This script creates all necessary tables, indexes, policies, and functions

-- ============================================================================
-- MEMBER MANAGEMENT TABLES
-- ============================================================================

-- Enhance existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_id UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- Member invitations table
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

-- Member requests table
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

-- ============================================================================
-- ADMIN & SYSTEM MANAGEMENT TABLES
-- ============================================================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator', 'manager')),
  permissions TEXT[] DEFAULT '{}',
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System health monitoring table
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

-- ============================================================================
-- ISLAMIC EDUCATION TABLES
-- ============================================================================

-- Tajweed lessons table
CREATE TABLE IF NOT EXISTS tajweed_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER DEFAULT 30,
  rule_name TEXT NOT NULL,
  arabic_example TEXT NOT NULL,
  transliteration TEXT,
  explanation TEXT NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tajweed lesson progress table
CREATE TABLE IF NOT EXISTS tajweed_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES tajweed_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Hadith collections table
CREATE TABLE IF NOT EXISTS hadith_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  arabic_name TEXT,
  description TEXT,
  compiler TEXT NOT NULL,
  total_hadiths INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hadith table
CREATE TABLE IF NOT EXISTS hadiths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES hadith_collections(id) ON DELETE CASCADE,
  hadith_number INTEGER NOT NULL,
  arabic_text TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  narrator TEXT,
  grade TEXT,
  topic TEXT,
  chapter TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hadith study progress table
CREATE TABLE IF NOT EXISTS hadith_study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hadith_id UUID REFERENCES hadiths(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  is_memorized BOOLEAN DEFAULT false,
  notes TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, hadith_id)
);

-- Quran reading progress table
CREATE TABLE IF NOT EXISTS quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL CHECK (surah_number >= 1 AND surah_number <= 114),
  ayah_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  reading_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, surah_number, ayah_number, reading_date)
);

-- Fasting tracker table
CREATE TABLE IF NOT EXISTS fasting_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fasting_date DATE NOT NULL,
  fasting_type TEXT NOT NULL CHECK (fasting_type IN ('ramadan', 'voluntary', 'makeup', 'arafah', 'ashura')),
  is_completed BOOLEAN DEFAULT false,
  broke_fast_time TIME,
  suhoor_time TIME,
  iftar_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, fasting_date)
);

-- ============================================================================
-- ZAKAT & FINANCIAL TABLES
-- ============================================================================

-- Zakat calculations table
CREATE TABLE IF NOT EXISTS zakat_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  calculation_date DATE DEFAULT CURRENT_DATE,
  wealth_type TEXT NOT NULL CHECK (wealth_type IN ('cash_savings', 'gold_silver', 'business_assets', 'livestock', 'agricultural_produce')),
  wealth_amount DECIMAL(15,2) NOT NULL,
  nisab_amount DECIMAL(15,2) NOT NULL,
  zakat_rate DECIMAL(5,4) NOT NULL,
  zakat_due DECIMAL(15,2) NOT NULL,
  is_eligible BOOLEAN NOT NULL,
  currency TEXT DEFAULT 'ETB',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Zakat payments table
CREATE TABLE IF NOT EXISTS zakat_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES zakat_calculations(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'cryptocurrency')),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('poor', 'needy', 'collectors', 'new_muslims', 'slaves', 'debtors', 'fisabilillah', 'travelers')),
  recipient_name TEXT,
  recipient_contact TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  transaction_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- HALAL MARKETPLACE TABLES
-- ============================================================================

-- Halal businesses table
CREATE TABLE IF NOT EXISTS halal_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'grocery', 'services', 'clothing', 'education', 'healthcare')),
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  hours TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_halal_certified BOOLEAN DEFAULT false,
  certification_body TEXT,
  certification_expiry DATE,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  owner_id UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Halal products table
CREATE TABLE IF NOT EXISTS halal_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES halal_businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  is_available BOOLEAN DEFAULT true,
  is_halal_certified BOOLEAN DEFAULT false,
  certification_details TEXT,
  image_url TEXT,
  ingredients TEXT,
  nutritional_info JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace orders table
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES halal_businesses(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'bank_transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  delivery_address TEXT,
  delivery_phone TEXT,
  special_instructions TEXT,
  order_date TIMESTAMP DEFAULT NOW(),
  delivery_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Member management indexes
CREATE INDEX IF NOT EXISTS idx_member_invitations_email ON member_invitations(email);
CREATE INDEX IF NOT EXISTS idx_member_invitations_status ON member_invitations(status);
CREATE INDEX IF NOT EXISTS idx_member_invitations_token ON member_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_member_requests_email ON member_requests(email);
CREATE INDEX IF NOT EXISTS idx_member_requests_status ON member_requests(status);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user_id ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

-- Islamic education indexes
CREATE INDEX IF NOT EXISTS idx_tajweed_progress_user_id ON tajweed_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_hadith_study_progress_user_id ON hadith_study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_progress_user_id ON quran_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_fasting_tracker_user_id ON fasting_tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_fasting_tracker_date ON fasting_tracker(fasting_date);

-- Financial indexes
CREATE INDEX IF NOT EXISTS idx_zakat_calculations_user_id ON zakat_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_zakat_payments_user_id ON zakat_payments(user_id);

-- Marketplace indexes
CREATE INDEX IF NOT EXISTS idx_halal_businesses_category ON halal_businesses(category);
CREATE INDEX IF NOT EXISTS idx_halal_businesses_location ON halal_businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_halal_products_business_id ON halal_products(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user_id ON marketplace_orders(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE member_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE tajweed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tajweed_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE halal_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE halal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admin can manage member invitations" ON member_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

-- User-specific policies
CREATE POLICY "Users can view their own progress" ON tajweed_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own hadith progress" ON hadith_study_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own quran progress" ON quran_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own fasting tracker" ON fasting_tracker
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own zakat calculations" ON zakat_calculations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own zakat payments" ON zakat_payments
  FOR ALL USING (user_id = auth.uid());

-- Public read policies for educational content
CREATE POLICY "Anyone can read tajweed lessons" ON tajweed_lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read hadith collections" ON hadith_collections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read hadiths" ON hadiths
  FOR SELECT USING (true);

-- Marketplace policies
CREATE POLICY "Anyone can view active businesses" ON halal_businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Business owners can manage their businesses" ON halal_businesses
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Anyone can view available products" ON halal_products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view their own orders" ON marketplace_orders
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get member statistics
CREATE OR REPLACE FUNCTION get_member_statistics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalMembers', (SELECT COUNT(*) FROM profiles),
    'activeMembers', (SELECT COUNT(*) FROM profiles WHERE status = 'active'),
    'pendingInvitations', (SELECT COUNT(*) FROM member_invitations WHERE status IN ('pending', 'invited')),
    'pendingRequests', (SELECT COUNT(*) FROM member_requests WHERE status = 'pending'),
    'recentJoins', (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days'),
    'alumniCount', (SELECT COUNT(*) FROM profiles WHERE status = 'alumni'),
    'suspendedCount', (SELECT COUNT(*) FROM profiles WHERE status = 'suspended')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_member_invitations_updated_at 
  BEFORE UPDATE ON member_invitations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_requests_updated_at 
  BEFORE UPDATE ON member_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_configuration_updated_at 
  BEFORE UPDATE ON system_configuration 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_health_updated_at 
  BEFORE UPDATE ON system_health 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_halal_businesses_updated_at 
  BEFORE UPDATE ON halal_businesses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_halal_products_updated_at 
  BEFORE UPDATE ON halal_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_orders_updated_at 
  BEFORE UPDATE ON marketplace_orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial system health records
INSERT INTO system_health (service_name, status, response_time_ms, uptime_percentage) VALUES
  ('database', 'operational', 50, 99.99),
  ('authentication', 'operational', 100, 99.95),
  ('api_gateway', 'operational', 75, 99.98),
  ('file_storage', 'operational', 120, 99.90),
  ('email_service', 'operational', 200, 99.85),
  ('notification_service', 'operational', 150, 99.92)
ON CONFLICT (service_name) DO NOTHING;

-- Insert initial system configuration
INSERT INTO system_configuration (key, value, category, description, is_public) VALUES
  ('app_name', '"Jama''a Connect Hub"', 'general', 'Application name', true),
  ('app_version', '"1.0.0"', 'general', 'Application version', true),
  ('maintenance_mode', 'false', 'system', 'Maintenance mode flag', false),
  ('max_file_upload_size', '10485760', 'files', 'Maximum file upload size in bytes (10MB)', false),
  ('email_notifications_enabled', 'true', 'notifications', 'Enable email notifications', false),
  ('member_auto_approval', 'false', 'members', 'Auto-approve new member requests', false)
ON CONFLICT (key) DO NOTHING;

-- Insert sample hadith collections
INSERT INTO hadith_collections (name, arabic_name, description, compiler, total_hadiths) VALUES
  ('Sahih al-Bukhari', 'صحيح البخاري', 'The most authentic collection of hadith', 'Imam al-Bukhari', 7563),
  ('Sahih Muslim', 'صحيح مسلم', 'Second most authentic collection of hadith', 'Imam Muslim', 7190),
  ('Sunan Abu Dawood', 'سنن أبي داود', 'Collection focusing on legal matters', 'Abu Dawood', 5274),
  ('Jami at-Tirmidhi', 'جامع الترمذي', 'Collection with commentary on hadith grades', 'At-Tirmidhi', 3956),
  ('Sunan an-Nasa''i', 'سنن النسائي', 'Collection known for strict criteria', 'An-Nasa''i', 5761),
  ('Sunan Ibn Majah', 'سنن ابن ماجه', 'Collection completing the six major books', 'Ibn Majah', 4341)
ON CONFLICT DO NOTHING;

-- Insert sample tajweed lessons
INSERT INTO tajweed_lessons (title, description, level, rule_name, arabic_example, transliteration, explanation, order_index) VALUES
  ('Introduction to Tajweed', 'Basic introduction to the science of Tajweed', 'beginner', 'Muqaddimah', 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'Bismillahi ar-Rahmani ar-Raheem', 'Tajweed is the science of reciting the Quran correctly', 1),
  ('Noon Sakinah and Tanween', 'Rules for noon with sukoon and tanween', 'beginner', 'Noon Sakinah', 'مِنْ بَعْدِ', 'min ba''d', 'When noon sakinah or tanween is followed by certain letters', 2),
  ('Meem Sakinah', 'Rules for meem with sukoon', 'intermediate', 'Meem Sakinah', 'هُمْ بِهِ', 'hum bih', 'Rules governing the pronunciation of meem sakinah', 3),
  ('Qalqalah', 'The bouncing sound rule', 'intermediate', 'Qalqalah', 'قَدْ أَفْلَحَ', 'qad aflaha', 'Certain letters require a bouncing sound when they have sukoon', 4),
  ('Madd Rules', 'Rules for elongation', 'advanced', 'Madd', 'قَالُوا آمَنَّا', 'qaloo aamanna', 'Various types of elongation in Quranic recitation', 5)
ON CONFLICT DO NOTHING;

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