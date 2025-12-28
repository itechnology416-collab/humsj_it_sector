-- Comprehensive HUMSJ Platform Database Schema
-- This migration creates all essential tables for real-world functionality

-- =============================================
-- EVENT MANAGEMENT SYSTEM
-- =============================================

-- Events table (enhanced from existing)
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) CHECK (event_type IN ('lecture', 'workshop', 'conference', 'social', 'religious', 'educational', 'community', 'fundraising')),
    category VARCHAR(100),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    venue_details JSONB, -- Address, room, capacity, facilities
    max_capacity INTEGER,
    current_registrations INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    organizer_id UUID REFERENCES auth.users(id),
    featured BOOLEAN DEFAULT false,
    tags TEXT[],
    image_url TEXT,
    requirements TEXT,
    agenda JSONB, -- Detailed schedule
    speakers JSONB, -- Speaker information
    resources JSONB, -- Links, documents, materials
    live_stream_url TEXT,
    recording_url TEXT,
    feedback_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'cancelled', 'attended', 'no_show')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'waived')),
    payment_amount DECIMAL(10,2),
    payment_reference VARCHAR(255),
    special_requirements TEXT,
    dietary_restrictions TEXT,
    emergency_contact JSONB,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event feedback and ratings
CREATE TABLE IF NOT EXISTS event_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    organization_rating INTEGER CHECK (organization_rating >= 1 AND organization_rating <= 5),
    venue_rating INTEGER CHECK (venue_rating >= 1 AND venue_rating <= 5),
    speaker_rating INTEGER CHECK (speaker_rating >= 1 AND speaker_rating <= 5),
    comments TEXT,
    suggestions TEXT,
    would_recommend BOOLEAN,
    anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- =============================================
-- USER VERIFICATION SYSTEM
-- =============================================

-- User verification requests
CREATE TABLE IF NOT EXISTS user_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) CHECK (verification_type IN ('identity', 'scholar', 'imam', 'organization', 'student', 'professional')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'expired')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    expiry_date TIMESTAMP WITH TIME ZONE,
    documents JSONB, -- Array of document URLs and metadata
    verification_data JSONB, -- Additional verification information
    reviewer_notes TEXT,
    rejection_reason TEXT,
    verification_badge VARCHAR(100),
    priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification documents
CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verification_id UUID REFERENCES user_verifications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'passport', 'id_card', 'certificate', 'diploma', etc.
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified BOOLEAN DEFAULT false,
    verification_notes TEXT
);

-- =============================================
-- COMMUNICATION SYSTEM
-- =============================================

-- Messages/Communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'direct' CHECK (message_type IN ('direct', 'broadcast', 'announcement', 'notification')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'archived', 'deleted')),
    read_at TIMESTAMP WITH TIME ZONE,
    reply_to UUID REFERENCES messages(id),
    thread_id UUID,
    attachments JSONB,
    metadata JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message recipients (for broadcast messages)
CREATE TABLE IF NOT EXISTS message_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, recipient_id)
);

-- =============================================
-- DONATION & FINANCIAL SYSTEM
-- =============================================

-- Donations
CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES auth.users(id),
    donor_name VARCHAR(255), -- For anonymous or guest donations
    donor_email VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    donation_type VARCHAR(50) CHECK (donation_type IN ('general', 'zakat', 'sadaqah', 'project', 'emergency', 'monthly', 'annual')),
    campaign_id UUID, -- Reference to campaigns table
    project_id UUID, -- Reference to projects table
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    transaction_id VARCHAR(255),
    gateway_response JSONB,
    is_anonymous BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20), -- 'monthly', 'quarterly', 'annually'
    next_payment_date TIMESTAMP WITH TIME ZONE,
    dedication_message TEXT,
    tax_deductible BOOLEAN DEFAULT true,
    receipt_sent BOOLEAN DEFAULT false,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation campaigns
CREATE TABLE IF NOT EXISTS donation_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    category VARCHAR(100),
    image_url TEXT,
    video_url TEXT,
    organizer_id UUID REFERENCES auth.users(id),
    featured BOOLEAN DEFAULT false,
    allow_anonymous BOOLEAN DEFAULT true,
    min_donation DECIMAL(10,2) DEFAULT 1,
    max_donation DECIMAL(10,2),
    donor_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ISLAMIC FEATURES SYSTEM
-- =============================================

-- Prayer times and tracking
CREATE TABLE IF NOT EXISTS prayer_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    fajr_time TIME NOT NULL,
    sunrise_time TIME NOT NULL,
    dhuhr_time TIME NOT NULL,
    asr_time TIME NOT NULL,
    maghrib_time TIME NOT NULL,
    isha_time TIME NOT NULL,
    calculation_method VARCHAR(50) DEFAULT 'ISNA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Prayer tracking
CREATE TABLE IF NOT EXISTS prayer_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
    prayer_date DATE NOT NULL,
    prayer_time TIME NOT NULL,
    status VARCHAR(20) CHECK (status IN ('prayed', 'missed', 'qada', 'makeup')),
    location VARCHAR(255),
    congregation BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, prayer_name, prayer_date)
);

-- Quran reading tracker
CREATE TABLE IF NOT EXISTS quran_reading (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_number INTEGER CHECK (surah_number >= 1 AND surah_number <= 114),
    ayah_from INTEGER,
    ayah_to INTEGER,
    pages_read INTEGER,
    reading_date DATE DEFAULT CURRENT_DATE,
    reading_time_minutes INTEGER,
    reading_type VARCHAR(50) CHECK (reading_type IN ('recitation', 'memorization', 'study', 'reflection')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fasting tracker
CREATE TABLE IF NOT EXISTS fasting_tracker (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fast_date DATE NOT NULL,
    fast_type VARCHAR(50) CHECK (fast_type IN ('ramadan', 'voluntary', 'makeup', 'arafah', 'ashura', 'monday_thursday')),
    status VARCHAR(20) CHECK (status IN ('completed', 'broken', 'intended', 'missed')),
    suhur_time TIME,
    iftar_time TIME,
    break_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, fast_date)
);

-- Dhikr and spiritual activities
CREATE TABLE IF NOT EXISTS dhikr_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dhikr_type VARCHAR(100) NOT NULL,
    dhikr_text TEXT,
    count INTEGER DEFAULT 1,
    target_count INTEGER,
    date DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LIBRARY & MEDIA SYSTEM
-- =============================================

-- Library resources
CREATE TABLE IF NOT EXISTS library_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    author VARCHAR(255),
    translator VARCHAR(255),
    publisher VARCHAR(255),
    isbn VARCHAR(20),
    resource_type VARCHAR(50) CHECK (resource_type IN ('book', 'article', 'video', 'audio', 'document', 'research')),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    description TEXT,
    content_url TEXT,
    thumbnail_url TEXT,
    file_size INTEGER,
    duration_minutes INTEGER, -- For audio/video
    page_count INTEGER, -- For books/documents
    publication_date DATE,
    access_level VARCHAR(20) DEFAULT 'public' CHECK (access_level IN ('public', 'members', 'verified', 'premium')),
    download_allowed BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    tags TEXT[],
    metadata JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived', 'removed')),
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource ratings and reviews
CREATE TABLE IF NOT EXISTS resource_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID REFERENCES library_resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_id, user_id)
);

-- User reading/viewing history
CREATE TABLE IF NOT EXISTS user_library_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES library_resources(id) ON DELETE CASCADE,
    activity_type VARCHAR(20) CHECK (activity_type IN ('view', 'download', 'bookmark', 'share')),
    progress_percentage INTEGER DEFAULT 0,
    last_position VARCHAR(50), -- Page number, timestamp, etc.
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SUPPORT & HELP SYSTEM
-- =============================================

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
    assigned_to UUID REFERENCES auth.users(id),
    resolution TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    tags TEXT[],
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Support ticket responses
CREATE TABLE IF NOT EXISTS support_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TASK MANAGEMENT SYSTEM
-- =============================================

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) CHECK (task_type IN ('personal', 'committee', 'project', 'event', 'administrative')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    assigned_to UUID REFERENCES auth.users(id),
    assigned_by UUID REFERENCES auth.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    completion_percentage INTEGER DEFAULT 0,
    project_id UUID, -- Reference to projects
    event_id UUID REFERENCES events(id),
    committee_id UUID, -- Reference to committees
    dependencies JSONB, -- Array of task IDs this task depends on
    tags TEXT[],
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Task comments and updates
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    comment_type VARCHAR(20) DEFAULT 'comment' CHECK (comment_type IN ('comment', 'status_update', 'time_log')),
    hours_logged DECIMAL(5,2),
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ANALYTICS & REPORTING SYSTEM
-- =============================================

-- System analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(255),
    page_url TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_type_category ON events(event_type, category);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(donation_type);

-- Prayer tracking indexes
CREATE INDEX IF NOT EXISTS idx_prayer_tracking_user_date ON prayer_tracking(user_id, prayer_date);
CREATE INDEX IF NOT EXISTS idx_quran_reading_user_date ON quran_reading(user_id, reading_date);
CREATE INDEX IF NOT EXISTS idx_fasting_tracker_user_date ON fasting_tracker(user_id, fast_date);

-- Library indexes
CREATE INDEX IF NOT EXISTS idx_library_resources_type ON library_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_library_resources_category ON library_resources(category);
CREATE INDEX IF NOT EXISTS idx_library_resources_status ON library_resources(status);
CREATE INDEX IF NOT EXISTS idx_library_resources_created_at ON library_resources(created_at);

-- Support indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_reading ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view published events" ON events
    FOR SELECT USING (status = 'published' OR organizer_id = auth.uid());

CREATE POLICY "Organizers can manage their events" ON events
    FOR ALL USING (organizer_id = auth.uid());

CREATE POLICY "Admins can manage all events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Event registrations policies
CREATE POLICY "Users can manage their registrations" ON event_registrations
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Event organizers can view registrations" ON event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_registrations.event_id 
            AND events.organizer_id = auth.uid()
        )
    );

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Donations policies
CREATE POLICY "Users can view their donations" ON donations
    FOR SELECT USING (donor_id = auth.uid());

CREATE POLICY "Users can create donations" ON donations
    FOR INSERT WITH CHECK (donor_id = auth.uid() OR donor_id IS NULL);

-- Islamic features policies
CREATE POLICY "Users can manage their prayer data" ON prayer_times
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their prayer tracking" ON prayer_tracking
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their Quran reading" ON quran_reading
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their fasting tracker" ON fasting_tracker
    FOR ALL USING (user_id = auth.uid());

-- Library policies
CREATE POLICY "Users can view active library resources" ON library_resources
    FOR SELECT USING (
        status = 'active' AND (
            access_level = 'public' OR
            (access_level = 'members' AND auth.uid() IS NOT NULL) OR
            (access_level = 'verified' AND EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.user_id = auth.uid() 
                AND profiles.verified = true
            ))
        )
    );

-- Support policies
CREATE POLICY "Users can manage their support tickets" ON support_tickets
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Support staff can view all tickets" ON support_tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'support', 'super_admin')
        )
    );

-- Tasks policies
CREATE POLICY "Users can view assigned tasks" ON tasks
    FOR SELECT USING (assigned_to = auth.uid() OR assigned_by = auth.uid());

CREATE POLICY "Users can update assigned tasks" ON tasks
    FOR UPDATE USING (assigned_to = auth.uid());

-- User activity policies
CREATE POLICY "Users can view their activity" ON user_activity_logs
    FOR SELECT USING (user_id = auth.uid());

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update event registration count
CREATE OR REPLACE FUNCTION update_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_registrations = current_registrations + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_registrations = current_registrations - 1 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event registration count
CREATE TRIGGER update_event_registration_count_trigger
    AFTER INSERT OR DELETE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_registration_count();

-- Function to update donation campaign amount
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.payment_status = 'completed' THEN
        UPDATE donation_campaigns 
        SET current_amount = current_amount + NEW.amount,
            donor_count = donor_count + 1
        WHERE id = NEW.campaign_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.payment_status != 'completed' AND NEW.payment_status = 'completed' THEN
        UPDATE donation_campaigns 
        SET current_amount = current_amount + NEW.amount,
            donor_count = donor_count + 1
        WHERE id = NEW.campaign_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.payment_status = 'completed' AND NEW.payment_status != 'completed' THEN
        UPDATE donation_campaigns 
        SET current_amount = current_amount - OLD.amount,
            donor_count = donor_count - 1
        WHERE id = OLD.campaign_id;
        RETURN NEW;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for donation campaign updates
CREATE TRIGGER update_campaign_amount_trigger
    AFTER INSERT OR UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_amount();

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('ticket_sequence')::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_sequence START 1;

-- Trigger for ticket number generation
CREATE TRIGGER generate_ticket_number_trigger
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

-- Function to update resource ratings
CREATE OR REPLACE FUNCTION update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE library_resources 
    SET rating_average = (
        SELECT AVG(rating)::DECIMAL(3,2) 
        FROM resource_reviews 
        WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    ),
    rating_count = (
        SELECT COUNT(*) 
        FROM resource_reviews 
        WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    )
    WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for resource rating updates
CREATE TRIGGER update_resource_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON resource_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_rating();

-- Comments for documentation
COMMENT ON TABLE events IS 'Comprehensive event management system';
COMMENT ON TABLE event_registrations IS 'Event registration and attendance tracking';
COMMENT ON TABLE user_verifications IS 'User identity and credential verification system';
COMMENT ON TABLE messages IS 'Internal messaging and communication system';
COMMENT ON TABLE donations IS 'Donation and financial contribution tracking';
COMMENT ON TABLE prayer_times IS 'Islamic prayer times calculation and storage';
COMMENT ON TABLE prayer_tracking IS 'User prayer performance tracking';
COMMENT ON TABLE library_resources IS 'Digital library and resource management';
COMMENT ON TABLE support_tickets IS 'Customer support and help desk system';
COMMENT ON TABLE tasks IS 'Task and project management system';
COMMENT ON TABLE analytics_events IS 'System usage analytics and tracking';