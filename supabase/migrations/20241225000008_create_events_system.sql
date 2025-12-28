-- Events System Database Schema
-- This migration creates comprehensive tables for event management

-- Main events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('friday', 'dars', 'workshop', 'special', 'meeting', 'conference', 'social', 'charity')),
    category VARCHAR(100),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    venue_details TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    speaker VARCHAR(255),
    speaker_bio TEXT,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Event agenda items
CREATE TABLE IF NOT EXISTS event_agenda (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    time TIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    speaker VARCHAR(255),
    duration_minutes INTEGER DEFAULT 60,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event resources (documents, links, etc.)
CREATE TABLE IF NOT EXISTS event_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('document', 'link', 'video', 'audio')),
    url TEXT NOT NULL,
    description TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
    notes TEXT,
    special_requirements TEXT,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_amount DECIMAL(10,2) DEFAULT 0,
    payment_reference VARCHAR(255),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event attendance tracking
CREATE TABLE IF NOT EXISTS event_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    attendance_status VARCHAR(20) DEFAULT 'present' CHECK (attendance_status IN ('present', 'late', 'left_early', 'absent')),
    notes TEXT,
    verified_by UUID REFERENCES auth.users(id),
    location_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event feedback and ratings
CREATE TABLE IF NOT EXISTS event_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    suggestions TEXT,
    would_recommend BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event categories for better organization
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event tags for flexible categorization
CREATE TABLE IF NOT EXISTS event_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event notifications and reminders
CREATE TABLE IF NOT EXISTS event_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('registration_confirmation', 'reminder_24h', 'reminder_1h', 'event_update', 'cancellation')),
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_method VARCHAR(20) DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'push', 'in_app')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event waitlist for full events
CREATE TABLE IF NOT EXISTS event_waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    position INTEGER,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notified_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'registered', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(event_id, user_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user ON event_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_checkin ON event_attendance(check_in_time);

CREATE INDEX IF NOT EXISTS idx_event_feedback_event ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_rating ON event_feedback(rating);

CREATE INDEX IF NOT EXISTS idx_event_agenda_event ON event_agenda(event_id);
CREATE INDEX IF NOT EXISTS idx_event_agenda_order ON event_agenda(order_index);

CREATE INDEX IF NOT EXISTS idx_event_resources_event ON event_resources(event_id);
CREATE INDEX IF NOT EXISTS idx_event_resources_type ON event_resources(type);

-- Row Level Security (RLS) Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_waitlist ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Public events are viewable by everyone" ON events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own events" ON events
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create events" ON events
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" ON events
    FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Event agenda policies
CREATE POLICY "Event agenda is viewable with event" ON event_agenda
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_agenda.event_id 
            AND (events.status = 'published' OR events.created_by = auth.uid())
        )
    );

CREATE POLICY "Event organizers can manage agenda" ON event_agenda
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_agenda.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Event resources policies
CREATE POLICY "Public event resources are viewable" ON event_resources
    FOR SELECT USING (
        is_public = true AND EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_resources.event_id 
            AND events.status = 'published'
        )
    );

CREATE POLICY "Event organizers can manage resources" ON event_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_resources.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Event registrations policies
CREATE POLICY "Users can view their own registrations" ON event_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" ON event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON event_registrations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Event organizers can view registrations" ON event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_registrations.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Event attendance policies
CREATE POLICY "Users can view their own attendance" ON event_attendance
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Event organizers can manage attendance" ON event_attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_attendance.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Event feedback policies
CREATE POLICY "Users can view feedback for published events" ON event_feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_feedback.event_id 
            AND events.status = 'published'
        )
    );

CREATE POLICY "Users can submit feedback for events they attended" ON event_feedback
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM event_registrations 
            WHERE event_registrations.event_id = event_feedback.event_id 
            AND event_registrations.user_id = auth.uid()
            AND event_registrations.status IN ('attended', 'registered')
        )
    );

-- Event categories and tags policies (public read)
CREATE POLICY "Event categories are publicly viewable" ON event_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Event tags are publicly viewable" ON event_tags
    FOR SELECT USING (true);

-- Event notifications policies
CREATE POLICY "Users can view their own notifications" ON event_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Event waitlist policies
CREATE POLICY "Users can view their own waitlist entries" ON event_waitlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join waitlists" ON event_waitlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for event management
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_attendees = current_attendees + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status = 'registered' AND NEW.status = 'cancelled' THEN
            UPDATE events 
            SET current_attendees = GREATEST(current_attendees - 1, 0) 
            WHERE id = NEW.event_id;
        ELSIF OLD.status = 'cancelled' AND NEW.status = 'registered' THEN
            UPDATE events 
            SET current_attendees = current_attendees + 1 
            WHERE id = NEW.event_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_attendees = GREATEST(current_attendees - 1, 0) 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update attendee count
CREATE TRIGGER update_event_attendee_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendee_count();

-- Function to update event updated_at timestamp
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at_trigger
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_events_updated_at();

-- Function to update registration updated_at timestamp
CREATE OR REPLACE FUNCTION update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registrations_updated_at_trigger
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_registrations_updated_at();

-- Function to automatically manage waitlist when spots become available
CREATE OR REPLACE FUNCTION process_event_waitlist()
RETURNS TRIGGER AS $$
DECLARE
    waitlist_entry RECORD;
    available_spots INTEGER;
BEGIN
    -- Only process when attendee count decreases
    IF TG_OP = 'UPDATE' AND NEW.current_attendees < OLD.current_attendees THEN
        -- Check if there are available spots
        available_spots := COALESCE(NEW.max_attendees, 999999) - NEW.current_attendees;
        
        IF available_spots > 0 THEN
            -- Get the next person on the waitlist
            SELECT * INTO waitlist_entry
            FROM event_waitlist
            WHERE event_id = NEW.id AND status = 'waiting'
            ORDER BY position ASC, joined_at ASC
            LIMIT 1;
            
            IF FOUND THEN
                -- Update waitlist status to offered
                UPDATE event_waitlist
                SET status = 'offered',
                    notified_at = NOW(),
                    expires_at = NOW() + INTERVAL '24 hours'
                WHERE id = waitlist_entry.id;
                
                -- Create notification
                INSERT INTO event_notifications (event_id, user_id, notification_type, message)
                VALUES (NEW.id, waitlist_entry.user_id, 'waitlist_offer', 
                       'A spot has become available for the event you''re waitlisted for!');
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_event_waitlist_trigger
    AFTER UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION process_event_waitlist();

-- Function to get event statistics
CREATE OR REPLACE FUNCTION get_event_statistics(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    event_type VARCHAR DEFAULT NULL
)
RETURNS TABLE(
    total_events INTEGER,
    total_registrations INTEGER,
    total_attendees INTEGER,
    average_rating DECIMAL,
    popular_locations TEXT[],
    popular_speakers TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT e.id)::INTEGER as total_events,
        COUNT(DISTINCT er.id)::INTEGER as total_registrations,
        SUM(e.current_attendees)::INTEGER as total_attendees,
        ROUND(AVG(ef.rating), 2) as average_rating,
        ARRAY_AGG(DISTINCT e.location ORDER BY COUNT(*) DESC) FILTER (WHERE e.location IS NOT NULL) as popular_locations,
        ARRAY_AGG(DISTINCT e.speaker ORDER BY COUNT(*) DESC) FILTER (WHERE e.speaker IS NOT NULL) as popular_speakers
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id
    LEFT JOIN event_feedback ef ON e.id = ef.event_id
    WHERE 
        (start_date IS NULL OR e.date >= start_date) AND
        (end_date IS NULL OR e.date <= end_date) AND
        (event_type IS NULL OR e.type = event_type) AND
        e.status IN ('published', 'completed');
END;
$$ LANGUAGE plpgsql;

-- Insert default event categories
INSERT INTO event_categories (name, description, color, icon) VALUES
('Religious', 'Islamic religious events and prayers', '#10B981', 'mosque'),
('Educational', 'Learning and knowledge sharing events', '#3B82F6', 'book'),
('Community', 'Community building and social events', '#8B5CF6', 'users'),
('Charity', 'Charitable activities and fundraising', '#F59E0B', 'heart'),
('Youth', 'Events specifically for young people', '#EF4444', 'star'),
('Family', 'Family-oriented events and activities', '#06B6D4', 'home'),
('Professional', 'Career and professional development', '#6366F1', 'briefcase'),
('Health', 'Health and wellness activities', '#84CC16', 'activity')
ON CONFLICT (name) DO NOTHING;

-- Insert common event tags
INSERT INTO event_tags (name, description, color) VALUES
('beginner-friendly', 'Suitable for beginners', '#10B981'),
('advanced', 'For advanced participants', '#EF4444'),
('free', 'Free event', '#06B6D4'),
('paid', 'Paid event', '#F59E0B'),
('online', 'Online event', '#8B5CF6'),
('in-person', 'In-person event', '#3B82F6'),
('registration-required', 'Registration required', '#6366F1'),
('drop-in', 'Drop-in welcome', '#84CC16'),
('family-friendly', 'Suitable for families', '#EC4899'),
('men-only', 'For men only', '#374151'),
('women-only', 'For women only', '#F97316'),
('multilingual', 'Multiple languages supported', '#14B8A6')
ON CONFLICT (name) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE events IS 'Main events table storing all event information';
COMMENT ON TABLE event_registrations IS 'User registrations for events';
COMMENT ON TABLE event_attendance IS 'Actual attendance tracking for events';
COMMENT ON TABLE event_feedback IS 'User feedback and ratings for events';
COMMENT ON TABLE event_agenda IS 'Detailed agenda items for events';
COMMENT ON TABLE event_resources IS 'Resources and materials associated with events';
COMMENT ON TABLE event_categories IS 'Predefined categories for organizing events';
COMMENT ON TABLE event_tags IS 'Flexible tagging system for events';
COMMENT ON TABLE event_notifications IS 'Notification system for event updates';
COMMENT ON TABLE event_waitlist IS 'Waitlist management for full events';

COMMENT ON COLUMN events.type IS 'Type of event: friday, dars, workshop, special, meeting, conference, social, charity';
COMMENT ON COLUMN events.status IS 'Event status: draft, published, cancelled, completed';
COMMENT ON COLUMN event_registrations.status IS 'Registration status: registered, attended, cancelled, no_show';
COMMENT ON COLUMN event_attendance.attendance_status IS 'Attendance status: present, late, left_early, absent';
COMMENT ON COLUMN event_feedback.rating IS 'Rating from 1 to 5 stars';