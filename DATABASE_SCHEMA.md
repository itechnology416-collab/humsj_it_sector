# Comprehensive Database Schema for Jama'a Connect Hub

This document outlines the complete database schema required for all the API services and features implemented in the Jama'a Connect Hub application, including the message-related tables.

## Message & Communication Tables

### messages
```sql
CREATE TABLE messages (
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
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_messages_status (status),
  INDEX idx_messages_type (type),
  INDEX idx_messages_created_by (created_by),
  INDEX idx_messages_scheduled (scheduled_for),
  INDEX idx_messages_created_at (created_at)
);
```

### message_templates
```sql
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'newsletter', 'reminder', 'urgent', 'general')),
  subject_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_message_templates_type (type),
  INDEX idx_message_templates_created_by (created_by),
  INDEX idx_message_templates_name (name)
);
```

### message_logs
```sql
CREATE TABLE message_logs (
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
  error_message TEXT,
  
  -- Indexes
  INDEX idx_message_logs_message_id (message_id),
  INDEX idx_message_logs_recipient_email (recipient_email),
  INDEX idx_message_logs_status (status),
  INDEX idx_message_logs_created_at (created_at)
);
```

### message_attachments
```sql
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Indexes
  INDEX idx_message_attachments_message_id (message_id)
);
```

### message_recipients
```sql
CREATE TABLE message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'email', 'group')),
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_email TEXT,
  recipient_name TEXT,
  
  -- Indexes
  INDEX idx_message_recipients_message_id (message_id),
  INDEX idx_message_recipients_type (recipient_type),
  INDEX idx_message_recipients_user_id (recipient_id)
);
```

### notification_preferences
```sql
CREATE TABLE notification_preferences (
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
  
  -- Unique constraint per user
  UNIQUE(user_id),
  
  -- Index
  INDEX idx_notification_preferences_user_id (user_id)
);
```

## Core User Management Tables

### profiles (Already exists)
```sql
-- Enhanced user profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_id UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
```

### user_roles (Already exists)
```sql
-- User roles and permissions
-- This table should already exist from the existing system
```

### member_invitations
```sql
CREATE TABLE member_invitations (
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

-- Indexes for member_invitations
CREATE INDEX idx_member_invitations_email ON member_invitations(email);
CREATE INDEX idx_member_invitations_status ON member_invitations(status);
CREATE INDEX idx_member_invitations_token ON member_invitations(invitation_token);
CREATE INDEX idx_member_invitations_created_by ON member_invitations(created_by);
```

### member_requests
```sql
CREATE TABLE member_requests (
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

-- Indexes for member_requests
CREATE INDEX idx_member_requests_email ON member_requests(email);
CREATE INDEX idx_member_requests_status ON member_requests(status);
CREATE INDEX idx_member_requests_reviewed_by ON member_requests(reviewed_by);
```

## Admin & System Management Tables

### admin_users
```sql
CREATE TABLE admin_users (
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
```

### system_alerts
```sql
CREATE TABLE system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### admin_activity_log
```sql
CREATE TABLE admin_activity_log (
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
```

### system_configuration
```sql
CREATE TABLE system_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## System Monitoring Tables

### system_health
```sql
CREATE TABLE system_health (
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
```

### system_metrics
```sql
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('performance', 'usage', 'error', 'business', 'security')),
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### security_events
```sql
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('login_attempt', 'failed_login', 'suspicious_activity', 'data_access', 'permission_change')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### backup_status
```sql
CREATE TABLE backup_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'differential')),
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'scheduled')),
  file_size_mb INTEGER,
  duration_minutes INTEGER,
  backup_location TEXT NOT NULL,
  error_message TEXT,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Reports & Analytics Tables

### reports
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('user_analytics', 'financial', 'event_analytics', 'content_analytics', 'system_performance', 'custom')),
  format TEXT NOT NULL CHECK (format IN ('pdf', 'excel', 'csv', 'json')),
  parameters JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  file_url TEXT,
  file_size INTEGER,
  generated_by UUID REFERENCES profiles(id),
  scheduled_for TIMESTAMP,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### report_templates
```sql
CREATE TABLE report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  default_parameters JSONB DEFAULT '{}',
  sql_query TEXT,
  chart_config JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Islamic Education Tables

### tajweed_lessons
```sql
CREATE TABLE tajweed_lessons (
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
```

### tajweed_progress
```sql
CREATE TABLE tajweed_progress (
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
```

### hadith_study
```sql
CREATE TABLE hadith_study (
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
```

### hadith_progress
```sql
CREATE TABLE hadith_progress (
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
```

### quran_study_sessions
```sql
CREATE TABLE quran_study_sessions (
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
```

### quran_progress
```sql
CREATE TABLE quran_progress (
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
```

### islamic_calendar_events
```sql
CREATE TABLE islamic_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('religious_holiday', 'historical_event', 'community_event', 'reminder')),
  hijri_date TEXT NOT NULL,
  gregorian_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  significance_level TEXT NOT NULL CHECK (significance_level IN ('high', 'medium', 'low')),
  related_content JSONB DEFAULT '[]',
  community_id UUID,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### prayer_time_settings
```sql
CREATE TABLE prayer_time_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  location JSONB NOT NULL,
  calculation_method TEXT NOT NULL CHECK (calculation_method IN ('mwl', 'isna', 'egypt', 'makkah', 'karachi', 'tehran', 'jafari')),
  madhab TEXT NOT NULL CHECK (madhab IN ('shafi', 'hanafi')),
  adjustments JSONB DEFAULT '{}',
  notifications_enabled BOOLEAN DEFAULT true,
  notification_times JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### fasting_tracker
```sql
CREATE TABLE fasting_tracker (
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
```

## Zakat Calculator Tables

### zakat_calculations
```sql
CREATE TABLE zakat_calculations (
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
```

### zakat_payments
```sql
CREATE TABLE zakat_payments (
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
```

### zakat_reminders
```sql
CREATE TABLE zakat_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('annual_calculation', 'payment_due', 'payment_overdue', 'custom')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('yearly', 'monthly', 'custom')),
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### nisab_rates
```sql
CREATE TABLE nisab_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  gold_price_per_gram DECIMAL(10,4) NOT NULL,
  silver_price_per_gram DECIMAL(10,4) NOT NULL,
  gold_nisab_grams DECIMAL(8,2) NOT NULL DEFAULT 85.00,
  silver_nisab_grams DECIMAL(8,2) NOT NULL DEFAULT 595.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  source TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, currency)
);
```

### zakat_recipients
```sql
CREATE TABLE zakat_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mosque', 'charity', 'organization', 'individual')),
  description TEXT,
  contact_info JSONB DEFAULT '{}',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('verified', 'pending', 'rejected')),
  is_featured BOOLEAN DEFAULT false,
  total_received DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### zakat_education
```sql
CREATE TABLE zakat_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('basics', 'calculation', 'recipients', 'rulings', 'faqs')),
  language TEXT NOT NULL DEFAULT 'en',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Halal Marketplace Tables

### marketplace_categories
```sql
CREATE TABLE marketplace_categories (
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
```

### marketplace_businesses
```sql
CREATE TABLE marketplace_businesses (
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
```

### marketplace_products
```sql
CREATE TABLE marketplace_products (
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
```

### marketplace_reviews
```sql
CREATE TABLE marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES marketplace_businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK ((business_id IS NOT NULL AND product_id IS NULL) OR (business_id IS NULL AND product_id IS NOT NULL))
);
```

### marketplace_orders
```sql
CREATE TABLE marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES marketplace_businesses(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0.00,
  delivery_fee DECIMAL(15,2) DEFAULT 0.00,
  total_amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  delivery_address JSONB NOT NULL DEFAULT '{}',
  delivery_instructions TEXT,
  estimated_delivery TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Integration & API Management Tables

### system_integrations
```sql
CREATE TABLE system_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('internal', 'external', 'third_party')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'error')),
  endpoint TEXT,
  api_key TEXT,
  configuration JSONB DEFAULT '{}',
  last_sync TIMESTAMP,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### data_sync_jobs
```sql
CREATE TABLE data_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES system_integrations(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('import', 'export', 'sync', 'backup')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress_percentage INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Core indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_sign_in ON profiles(last_sign_in_at);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON system_alerts(created_at);

-- Monitoring indexes
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_timestamp ON system_metrics(metric_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);

-- Islamic education indexes
CREATE INDEX IF NOT EXISTS idx_tajweed_progress_user_id ON tajweed_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_hadith_progress_user_id ON hadith_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_sessions_user_date ON quran_study_sessions(user_id, session_date);

-- Zakat indexes
CREATE INDEX IF NOT EXISTS idx_zakat_calculations_user_year ON zakat_calculations(user_id, hijri_year);
CREATE INDEX IF NOT EXISTS idx_zakat_payments_user_id ON zakat_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_zakat_reminders_scheduled ON zakat_reminders(scheduled_date, is_sent);

-- Marketplace indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_category ON marketplace_businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_business ON marketplace_products(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user ON marketplace_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_business ON marketplace_reviews(business_id);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tajweed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tajweed_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_study ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_time_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE nisab_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sync_jobs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize based on your needs)

-- Users can only see their own data
CREATE POLICY "Users can view own tajweed progress" ON tajweed_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tajweed progress" ON tajweed_progress
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for educational content
CREATE POLICY "Public can view tajweed lessons" ON tajweed_lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view hadith study" ON hadith_study
  FOR SELECT USING (true);

-- Admin access for system tables
CREATE POLICY "Admins can manage system alerts" ON system_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND is_active = true
    )
  );
```

## Functions and Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables with updated_at columns

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

-- Function to update business rating
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_businesses 
  SET 
    rating_average = (
      SELECT AVG(rating) 
      FROM marketplace_reviews 
      WHERE business_id = NEW.business_id 
      AND is_approved = true
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM marketplace_reviews 
      WHERE business_id = NEW.business_id 
      AND is_approved = true
    )
  WHERE id = NEW.business_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update business rating when review is added/updated
CREATE TRIGGER update_business_rating_trigger
  AFTER INSERT OR UPDATE ON marketplace_reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating();
```

This comprehensive database schema provides the foundation for all the API services and features implemented in the Jama'a Connect Hub application. Each table is designed with proper relationships, constraints, and indexes for optimal performance and data integrity.

## Digital Tasbih & Dhikr Tracking Tables

### dhikr_types
```sql
-- Predefined dhikr types with their details
CREATE TABLE dhikr_types (
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

-- Insert default dhikr types
INSERT INTO dhikr_types (name, arabic_text, transliteration, translation, category, default_target, reward_description, display_order) VALUES
('SubhanAllah', 'سُبْحَانَ اللَّهِ', 'Subhan Allah', 'Glory be to Allah', 'tasbih', 33, 'Each tasbih is rewarded', 1),
('Alhamdulillah', 'الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 'All praise is due to Allah', 'tasbih', 33, 'Fills the scales of good deeds', 2),
('Allahu Akbar', 'اللَّهُ أَكْبَرُ', 'Allahu Akbar', 'Allah is the Greatest', 'tasbih', 34, 'Beloved to Ar-Rahman', 3),
('La Hawla wa la Quwwata', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', 'La hawla wa la quwwata illa billah', 'There is no power except with Allah', 'dua', 100, 'Treasure from Paradise', 4),
('Istighfar', 'أَسْتَغْفِرُ اللَّهَ', 'Astaghfirullah', 'I seek forgiveness from Allah', 'istighfar', 100, 'Opens doors of mercy', 5),
('Salawat on Prophet', 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', 'Allahumma salli ala Muhammad', 'O Allah, send blessings upon Muhammad', 'salawat', 100, 'Allah sends 10 blessings in return', 6);
```

### dhikr_sessions
```sql
-- Individual dhikr counting sessions
CREATE TABLE dhikr_sessions (
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

-- Indexes for dhikr_sessions
CREATE INDEX idx_dhikr_sessions_user_date ON dhikr_sessions(user_id, session_date);
CREATE INDEX idx_dhikr_sessions_dhikr_type ON dhikr_sessions(dhikr_type_id);
CREATE INDEX idx_dhikr_sessions_goal_reached ON dhikr_sessions(is_goal_reached);
```

### dhikr_streaks
```sql
-- Track user streaks for different dhikr types
CREATE TABLE dhikr_streaks (
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

-- Indexes for dhikr_streaks
CREATE INDEX idx_dhikr_streaks_user ON dhikr_streaks(user_id);
CREATE INDEX idx_dhikr_streaks_current_streak ON dhikr_streaks(current_streak DESC);
```

### dhikr_goals
```sql
-- User-defined goals for dhikr practice
CREATE TABLE dhikr_goals (
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

-- Indexes for dhikr_goals
CREATE INDEX idx_dhikr_goals_user_active ON dhikr_goals(user_id, is_active);
CREATE INDEX idx_dhikr_goals_type_dates ON dhikr_goals(goal_type, start_date, end_date);
```

### dhikr_achievements
```sql
-- Achievement system for dhikr practice
CREATE TABLE dhikr_achievements (
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

-- Indexes for dhikr_achievements
CREATE INDEX idx_dhikr_achievements_user ON dhikr_achievements(user_id);
CREATE INDEX idx_dhikr_achievements_type ON dhikr_achievements(achievement_type);
```

### dhikr_statistics
```sql
-- Aggregated statistics for performance optimization
CREATE TABLE dhikr_statistics (
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

-- Indexes for dhikr_statistics
CREATE INDEX idx_dhikr_statistics_user ON dhikr_statistics(user_id);
CREATE INDEX idx_dhikr_statistics_total_count ON dhikr_statistics(total_count DESC);
```

### dhikr_settings
```sql
-- User preferences for dhikr counter
CREATE TABLE dhikr_settings (
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

-- Index for dhikr_settings
CREATE INDEX idx_dhikr_settings_user ON dhikr_settings(user_id);
```
