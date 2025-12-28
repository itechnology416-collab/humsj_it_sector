-- Volunteer System Tables
-- This migration creates tables for comprehensive volunteer management

-- Volunteer opportunities table
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT false,
    time_commitment VARCHAR(100), -- e.g., "2 hours/week", "One-time", "Flexible"
    skills_required TEXT[],
    max_volunteers INTEGER,
    current_volunteers INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    application_deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    contact_person UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    motivation TEXT,
    experience TEXT,
    availability TEXT,
    skills TEXT[],
    references JSONB DEFAULT '[]', -- Array of reference objects
    emergency_contact JSONB,
    background_check_status VARCHAR(20) DEFAULT 'not_required' CHECK (background_check_status IN ('not_required', 'pending', 'approved', 'rejected')),
    orientation_completed BOOLEAN DEFAULT false,
    orientation_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

-- Volunteer hours tracking table
CREATE TABLE IF NOT EXISTS volunteer_hours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES volunteer_applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours_worked DECIMAL(4,2) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer categories table
CREATE TABLE IF NOT EXISTS volunteer_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer skills table
CREATE TABLE IF NOT EXISTS volunteer_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer feedback table
CREATE TABLE IF NOT EXISTS volunteer_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES volunteer_applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    would_recommend BOOLEAN,
    suggestions TEXT,
    feedback_type VARCHAR(20) DEFAULT 'volunteer' CHECK (feedback_type IN ('volunteer', 'supervisor', 'organization')),
    given_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_category ON volunteer_opportunities(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_status ON volunteer_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_start_date ON volunteer_opportunities(start_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_location ON volunteer_opportunities(location);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_user_id ON volunteer_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_opportunity_id ON volunteer_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_user_id ON volunteer_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_date ON volunteer_hours(date);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_verified ON volunteer_hours(verified);

-- Row Level Security (RLS) Policies
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for volunteer_opportunities
CREATE POLICY "Anyone can view active opportunities" ON volunteer_opportunities
    FOR SELECT USING (status = 'active' AND (application_deadline IS NULL OR application_deadline > NOW()));

CREATE POLICY "Admins and coordinators can manage opportunities" ON volunteer_opportunities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'volunteer_coordinator')
        )
    );

CREATE POLICY "Creators can manage their opportunities" ON volunteer_opportunities
    FOR ALL USING (created_by = auth.uid());

-- Policies for volunteer_applications
CREATE POLICY "Users can view their own applications" ON volunteer_applications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create applications" ON volunteer_applications
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending applications" ON volunteer_applications
    FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins and coordinators can manage all applications" ON volunteer_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'volunteer_coordinator')
        )
    );

CREATE POLICY "Opportunity creators can manage applications" ON volunteer_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM volunteer_opportunities 
            WHERE volunteer_opportunities.id = opportunity_id 
            AND volunteer_opportunities.created_by = auth.uid()
        )
    );

-- Policies for volunteer_hours
CREATE POLICY "Users can view their own hours" ON volunteer_hours
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can log their own hours" ON volunteer_hours
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their unverified hours" ON volunteer_hours
    FOR UPDATE USING (user_id = auth.uid() AND verified = false);

CREATE POLICY "Supervisors can verify hours" ON volunteer_hours
    FOR UPDATE USING (
        supervisor_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'volunteer_coordinator')
        )
    );

-- Policies for volunteer_categories and skills (public read)
CREATE POLICY "Anyone can view categories" ON volunteer_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view skills" ON volunteer_skills
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories and skills" ON volunteer_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage skills" ON volunteer_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for volunteer_feedback
CREATE POLICY "Users can view feedback for their applications" ON volunteer_feedback
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can give feedback for their applications" ON volunteer_feedback
    FOR INSERT WITH CHECK (given_by = auth.uid());

CREATE POLICY "Supervisors can give feedback" ON volunteer_feedback
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM volunteer_applications va
            JOIN volunteer_opportunities vo ON va.opportunity_id = vo.id
            WHERE va.id = application_id 
            AND (vo.contact_person = auth.uid() OR vo.created_by = auth.uid())
        )
    );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_volunteer_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE volunteer_opportunities 
        SET current_volunteers = current_volunteers + 1
        WHERE id = NEW.opportunity_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
            UPDATE volunteer_opportunities 
            SET current_volunteers = current_volunteers + 1
            WHERE id = NEW.opportunity_id;
        ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE volunteer_opportunities 
            SET current_volunteers = current_volunteers - 1
            WHERE id = NEW.opportunity_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
        UPDATE volunteer_opportunities 
        SET current_volunteers = current_volunteers - 1
        WHERE id = OLD.opportunity_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total volunteer hours for a user
CREATE OR REPLACE FUNCTION get_user_volunteer_hours(user_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(hours_worked) 
         FROM volunteer_hours 
         WHERE user_id = user_uuid AND verified = true), 
        0
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update volunteer count
CREATE TRIGGER update_volunteer_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON volunteer_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_volunteer_count();

-- Insert default categories
INSERT INTO volunteer_categories (name, description, icon, color) VALUES
('Education', 'Teaching, tutoring, and educational support', 'book', '#3B82F6'),
('Community Service', 'General community support and outreach', 'users', '#10B981'),
('Event Support', 'Help with organizing and running events', 'calendar', '#F59E0B'),
('Technology', 'IT support, web development, and digital services', 'monitor', '#8B5CF6'),
('Fundraising', 'Fundraising activities and donor relations', 'dollar-sign', '#EF4444'),
('Youth Programs', 'Working with children and young adults', 'heart', '#EC4899'),
('Administrative', 'Office work, data entry, and administrative tasks', 'file-text', '#6B7280'),
('Maintenance', 'Facility maintenance and cleaning', 'tool', '#F97316')
ON CONFLICT (name) DO NOTHING;

-- Insert default skills
INSERT INTO volunteer_skills (name, category) VALUES
('Teaching', 'Education'),
('Public Speaking', 'Communication'),
('Event Planning', 'Organization'),
('Web Development', 'Technology'),
('Graphic Design', 'Creative'),
('Social Media', 'Marketing'),
('Fundraising', 'Finance'),
('Leadership', 'Management'),
('Arabic Language', 'Language'),
('Islamic Studies', 'Religious'),
('First Aid', 'Health'),
('Photography', 'Creative')
ON CONFLICT (name) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE volunteer_opportunities IS 'Stores volunteer opportunity details with requirements and contact information';
COMMENT ON TABLE volunteer_applications IS 'Tracks volunteer applications with status and review process';
COMMENT ON TABLE volunteer_hours IS 'Records volunteer hours worked with verification system';
COMMENT ON TABLE volunteer_categories IS 'Categorizes volunteer opportunities for better organization';
COMMENT ON TABLE volunteer_skills IS 'Defines skills that can be associated with opportunities and volunteers';
COMMENT ON TABLE volunteer_feedback IS 'Collects feedback from volunteers and supervisors';