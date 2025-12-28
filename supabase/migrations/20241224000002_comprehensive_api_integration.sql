-- Comprehensive API Integration Schema for Real-World Functionality
-- Created: 2024-12-24

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- COURSE MANAGEMENT SYSTEM
-- =============================================

-- Course Categories
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructors
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  qualifications TEXT[],
  specializations TEXT[],
  profile_image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_students INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
  level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  language VARCHAR(50) DEFAULT 'English',
  duration_weeks INTEGER NOT NULL,
  total_lessons INTEGER NOT NULL,
  price DECIMAL(10,2) DEFAULT 0.00,
  original_price DECIMAL(10,2),
  discount_percentage INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  trailer_video_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  prerequisites TEXT[],
  learning_outcomes TEXT[],
  course_materials TEXT[],
  requirements TEXT[],
  start_date DATE,
  end_date DATE,
  schedule_info TEXT,
  max_students INTEGER,
  current_students INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  certificate_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Curriculum
CREATE TABLE IF NOT EXISTS course_curriculum (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  topics TEXT[],
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(20) CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')) DEFAULT 'enrolled',
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'free')) DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_reference VARCHAR(255),
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Course Reviews
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- =============================================
-- MEDIA MANAGEMENT SYSTEM
-- =============================================

-- Media Categories
CREATE TABLE IF NOT EXISTS media_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Items
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'audio', 'document')) NOT NULL,
  category_id UUID REFERENCES media_categories(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  duration_seconds INTEGER, -- For video/audio
  dimensions JSONB, -- For images/videos: {"width": 1920, "height": 1080}
  metadata JSONB, -- Additional metadata
  tags TEXT[],
  is_public BOOLEAN DEFAULT TRUE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cloudinary_public_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Collections (Albums/Playlists)
CREATE TABLE IF NOT EXISTS media_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  collection_type VARCHAR(20) CHECK (collection_type IN ('album', 'playlist', 'gallery')) NOT NULL,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Collection Items
CREATE TABLE IF NOT EXISTS media_collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES media_collections(id) ON DELETE CASCADE,
  media_item_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, media_item_id)
);

-- =============================================
-- EVENT MANAGEMENT SYSTEM
-- =============================================

-- Event Categories
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20),
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events (Enhanced)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
  event_type VARCHAR(20) CHECK (event_type IN ('workshop', 'lecture', 'conference', 'social', 'religious', 'educational')) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  venue_details JSONB, -- {"address": "", "coordinates": {"lat": 0, "lng": 0}}
  is_online BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT TRUE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  is_free BOOLEAN DEFAULT TRUE,
  ticket_price DECIMAL(10,2) DEFAULT 0.00,
  banner_image_url TEXT,
  gallery_images TEXT[],
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_status VARCHAR(20) CHECK (attendance_status IN ('registered', 'attended', 'no_show', 'cancelled')) DEFAULT 'registered',
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'free')) DEFAULT 'free',
  payment_reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- =============================================
-- CONTENT MANAGEMENT SYSTEM
-- =============================================

-- Content Types
CREATE TABLE IF NOT EXISTS content_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  schema JSONB, -- Field definitions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Items
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- Flexible content based on type
  excerpt TEXT,
  featured_image_url TEXT,
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  metadata JSONB,
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATION SYSTEM
-- =============================================

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  title_template VARCHAR(255) NOT NULL,
  body_template TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  channels TEXT[] DEFAULT ARRAY['in_app'], -- in_app, email, push, sms
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  data JSONB, -- Additional data
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ANALYTICS & TRACKING
-- =============================================

-- User Activity Logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Metrics
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- counter, gauge, histogram
  tags JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_category ON media_items(category_id);
CREATE INDEX IF NOT EXISTS idx_media_items_public ON media_items(is_public);
CREATE INDEX IF NOT EXISTS idx_media_items_uploaded_by ON media_items(uploaded_by);

-- Event indexes
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(content_type_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_author ON content_items(author_id);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_at);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created ON user_notifications(created_at);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action ON user_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created ON user_activity_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on requirements)

-- Courses: Public read, authenticated users can enroll
CREATE POLICY "Public can view published courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Users can view their enrollments" ON course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their enrollments" ON course_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Media: Public can view public media
CREATE POLICY "Public can view public media" ON media_items FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their uploaded media" ON media_items FOR SELECT USING (auth.uid() = uploaded_by);

-- Events: Public can view published events
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view their registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their notifications" ON user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON user_notifications FOR UPDATE USING (auth.uid() = user_id);

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

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON media_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update course statistics
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE courses 
        SET current_students = current_students + 1 
        WHERE id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses 
        SET current_students = current_students - 1 
        WHERE id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update course statistics
CREATE TRIGGER update_course_enrollment_stats 
    AFTER INSERT OR DELETE ON course_enrollments 
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default course categories
INSERT INTO course_categories (name, description, icon, color) VALUES
('Quran Studies', 'Courses related to Quran recitation, memorization, and understanding', 'BookOpen', '#10B981'),
('Islamic Law', 'Fiqh and Islamic jurisprudence courses', 'Scale', '#3B82F6'),
('Prophetic Studies', 'Seerah and Hadith studies', 'User', '#8B5CF6'),
('Arabic Language', 'Arabic grammar, vocabulary, and literature', 'MessageCircle', '#F59E0B'),
('Islamic Finance', 'Shariah-compliant finance and economics', 'DollarSign', '#EF4444'),
('Family & Parenting', 'Islamic guidance for family life', 'Heart', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Insert default media categories
INSERT INTO media_categories (name, description, icon) VALUES
('Events', 'Photos and videos from HUMSJ events', 'Calendar'),
('Educational', 'Educational content and materials', 'BookOpen'),
('Community', 'Community activities and gatherings', 'Users'),
('Religious', 'Islamic programs and religious activities', 'Moon'),
('Documentaries', 'Documentary videos and films', 'Video'),
('Audio Lectures', 'Audio recordings of lectures and talks', 'Headphones')
ON CONFLICT (name) DO NOTHING;

-- Insert default event categories
INSERT INTO event_categories (name, description, color, icon) VALUES
('Workshop', 'Educational workshops and training sessions', '#10B981', 'Wrench'),
('Lecture', 'Academic and religious lectures', '#3B82F6', 'BookOpen'),
('Conference', 'Large-scale conferences and symposiums', '#8B5CF6', 'Users'),
('Social', 'Social gatherings and community events', '#F59E0B', 'Coffee'),
('Religious', 'Religious ceremonies and observances', '#EF4444', 'Moon'),
('Educational', 'Educational programs and seminars', '#EC4899', 'GraduationCap')
ON CONFLICT (name) DO NOTHING;

-- Insert default notification templates
INSERT INTO notification_templates (name, title_template, body_template, type, channels) VALUES
('course_enrollment', 'Course Enrollment Confirmed', 'You have successfully enrolled in {{course_title}}. Your learning journey begins now!', 'course', ARRAY['in_app', 'email']),
('event_registration', 'Event Registration Confirmed', 'You are registered for {{event_title}} on {{event_date}}.', 'event', ARRAY['in_app', 'email']),
('course_completion', 'Course Completed', 'Congratulations! You have completed {{course_title}}. Your certificate is ready.', 'course', ARRAY['in_app', 'email']),
('payment_received', 'Payment Received', 'Your payment of {{amount}} for {{item_title}} has been received.', 'payment', ARRAY['in_app', 'email'])
ON CONFLICT (name) DO NOTHING;

COMMIT;