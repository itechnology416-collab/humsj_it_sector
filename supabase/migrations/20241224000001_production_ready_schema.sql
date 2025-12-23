-- Production-Ready Database Schema for HUMSJ IT Sector
-- This migration creates comprehensive tables for real-world usage

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE prayer_status AS ENUM ('pending', 'completed', 'missed');
CREATE TYPE notification_type AS ENUM ('prayer', 'dhikr', 'event', 'reminder', 'system');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE user_role AS ENUM ('student', 'coordinator', 'leader', 'admin', 'super_admin');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');

-- Enhanced profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_of_study INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

-- Prayer tracking table
CREATE TABLE IF NOT EXISTS prayer_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) NOT NULL,
    prayer_date DATE NOT NULL,
    status prayer_status DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    on_time BOOLEAN DEFAULT FALSE,
    location POINT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, prayer_name, prayer_date)
);

CREATE INDEX idx_prayer_tracking_user_date ON prayer_tracking(user_id, prayer_date);
CREATE INDEX idx_prayer_tracking_status ON prayer_tracking(status);
CREATE INDEX idx_prayer_tracking_prayer_name ON prayer_tracking(prayer_name);

-- Dhikr tracking table
CREATE TABLE IF NOT EXISTS dhikr_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dhikr_type VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    goal INTEGER,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    session_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, dhikr_type, date)
);

CREATE INDEX idx_dhikr_tracking_user_date ON dhikr_tracking(user_id, date);
CREATE INDEX idx_dhikr_tracking_type ON dhikr_tracking(dhikr_type);

-- Quran progress tracking
CREATE TABLE IF NOT EXISTS quran_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL,
    verse_number INTEGER,
    activity_type VARCHAR(20) NOT NULL, -- 'read', 'listen', 'memorize'
    progress_data JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quran_progress_user ON quran_progress(user_id);
CREATE INDEX idx_quran_progress_surah ON quran_progress(surah_number);
CREATE INDEX idx_quran_progress_activity ON quran_progress(activity_type);

-- Enhanced events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) DEFAULT 'general';
ALTER TABLE events ADD COLUMN IF NOT EXISTS status event_status DEFAULT 'draft';
ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_details JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE events ADD COLUMN IF NOT EXISTS attachments JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurrence_rule JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS gender_restriction gender_type;

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_data JSONB,
    status VARCHAR(20) DEFAULT 'registered',
    attended BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type notification_type NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    sent BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);

-- Content management table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'article', 'khutbah', 'dua', 'hadith'
    status content_status DEFAULT 'draft',
    author_id UUID REFERENCES auth.users(id),
    category VARCHAR(100),
    tags TEXT[],
    metadata JSONB,
    featured_image VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_content_items_slug ON content_items(slug);
CREATE INDEX idx_content_items_type ON content_items(content_type);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_author ON content_items(author_id);
CREATE INDEX idx_content_items_category ON content_items(category);
CREATE INDEX idx_content_items_published ON content_items(published_at);

-- Halal businesses table
CREATE TABLE IF NOT EXISTS halal_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    location POINT,
    hours JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_halal_certified BOOLEAN DEFAULT FALSE,
    images TEXT[],
    tags TEXT[],
    contact_person VARCHAR(255),
    added_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_halal_businesses_category ON halal_businesses(category);
CREATE INDEX idx_halal_businesses_location ON halal_businesses USING GIST(location);
CREATE INDEX idx_halal_businesses_verified ON halal_businesses(is_verified);
CREATE INDEX idx_halal_businesses_rating ON halal_businesses(rating);

-- Business reviews table
CREATE TABLE IF NOT EXISTS business_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES halal_businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    images TEXT[],
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(business_id, user_id)
);

CREATE INDEX idx_business_reviews_business ON business_reviews(business_id);
CREATE INDEX idx_business_reviews_user ON business_reviews(user_id);
CREATE INDEX idx_business_reviews_rating ON business_reviews(rating);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name VARCHAR(255) NOT NULL,
    event_category VARCHAR(100) NOT NULL,
    properties JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    referrer TEXT
);

CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    page_views INTEGER DEFAULT 0,
    events INTEGER DEFAULT 0,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    location_data JSONB
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_start_time ON user_sessions(start_time);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_public ON system_settings(is_public);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    record_id UUID,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    cloudinary_public_id VARCHAR(255),
    cloudinary_url VARCHAR(500),
    uploaded_by UUID REFERENCES auth.users(id),
    entity_type VARCHAR(100), -- 'profile', 'event', 'content', etc.
    entity_id UUID,
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_file_uploads_uploader ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX idx_file_uploads_public ON file_uploads(is_public);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_tracking_updated_at BEFORE UPDATE ON prayer_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dhikr_tracking_updated_at BEFORE UPDATE ON dhikr_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_halal_businesses_updated_at BEFORE UPDATE ON halal_businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_reviews_updated_at BEFORE UPDATE ON business_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE prayer_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prayer_tracking
CREATE POLICY "Users can view own prayer tracking" ON prayer_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prayer tracking" ON prayer_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prayer tracking" ON prayer_tracking FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for dhikr_tracking
CREATE POLICY "Users can view own dhikr tracking" ON dhikr_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dhikr tracking" ON dhikr_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dhikr tracking" ON dhikr_tracking FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for quran_progress
CREATE POLICY "Users can view own quran progress" ON quran_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quran progress" ON quran_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for business_reviews
CREATE POLICY "Users can view all business reviews" ON business_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own business reviews" ON business_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own business reviews" ON business_reviews FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for file_uploads
CREATE POLICY "Users can view public files" ON file_uploads FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own files" ON file_uploads FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can insert own files" ON file_uploads FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('app_name', '"HUMSJ IT Sector"', 'Application name', 'general', true),
('app_version', '"1.0.0"', 'Application version', 'general', true),
('prayer_calculation_method', '2', 'Default prayer calculation method (Muslim World League)', 'islamic', true),
('madhab', '0', 'Default madhab (Shafi)', 'islamic', true),
('default_location', '{"latitude": 9.4103, "longitude": 42.0461, "name": "Haramaya University"}', 'Default location coordinates', 'islamic', true),
('notification_settings', '{"prayer_reminders": true, "dhikr_reminders": true, "event_notifications": true}', 'Default notification settings', 'notifications', true),
('maintenance_mode', 'false', 'Enable maintenance mode', 'system', false),
('registration_enabled', 'true', 'Enable user registration', 'system', true),
('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'uploads', false)
ON CONFLICT (key) DO NOTHING;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_prayer_stats(user_uuid UUID, start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days', end_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_prayers BIGINT,
    completed_prayers BIGINT,
    on_time_prayers BIGINT,
    completion_rate DECIMAL,
    on_time_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_prayers,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_prayers,
        COUNT(*) FILTER (WHERE status = 'completed' AND on_time = true) as on_time_prayers,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 2
        ) as completion_rate,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed' AND on_time = true)::DECIMAL / NULLIF(COUNT(*) FILTER (WHERE status = 'completed'), 0)) * 100, 2
        ) as on_time_rate
    FROM prayer_tracking 
    WHERE user_id = user_uuid 
    AND prayer_date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update business ratings
CREATE OR REPLACE FUNCTION update_business_rating(business_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE halal_businesses 
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::NUMERIC, 2) 
            FROM business_reviews 
            WHERE business_id = business_uuid
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM business_reviews 
            WHERE business_id = business_uuid
        )
    WHERE id = business_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update business ratings
CREATE OR REPLACE FUNCTION trigger_update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_business_rating(NEW.business_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_business_rating(OLD.business_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER business_review_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON business_reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_business_rating();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_date_range ON events(start_date, end_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_halal_businesses_tags ON halal_businesses USING GIN(tags);

COMMENT ON TABLE prayer_tracking IS 'Tracks individual prayer completion and timing';
COMMENT ON TABLE dhikr_tracking IS 'Tracks daily dhikr counts and goals';
COMMENT ON TABLE quran_progress IS 'Tracks Quran reading, listening, and memorization progress';
COMMENT ON TABLE halal_businesses IS 'Directory of halal businesses and services';
COMMENT ON TABLE business_reviews IS 'User reviews and ratings for halal businesses';
COMMENT ON TABLE analytics_events IS 'Application usage analytics and events';
COMMENT ON TABLE audit_logs IS 'System audit trail for security and compliance';
COMMENT ON TABLE system_settings IS 'Configurable system settings and preferences';