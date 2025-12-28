-- Committee Management Tables
-- This migration creates tables for comprehensive committee management

-- Committees table
CREATE TABLE IF NOT EXISTS committees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    purpose TEXT,
    type VARCHAR(50) DEFAULT 'standing' CHECK (type IN ('standing', 'ad_hoc', 'subcommittee', 'task_force')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'dissolved')),
    parent_committee_id UUID REFERENCES committees(id) ON DELETE SET NULL,
    chair_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    vice_chair_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    secretary_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    max_members INTEGER,
    current_members INTEGER DEFAULT 0,
    meeting_frequency VARCHAR(100), -- e.g., "Weekly", "Monthly", "As needed"
    meeting_day VARCHAR(20), -- e.g., "Monday", "First Tuesday"
    meeting_time TIME,
    meeting_location VARCHAR(255),
    budget_allocated DECIMAL(10,2),
    budget_spent DECIMAL(10,2) DEFAULT 0,
    established_date DATE,
    dissolution_date DATE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_public BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Committee members table
CREATE TABLE IF NOT EXISTS committee_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('chair', 'vice_chair', 'secretary', 'treasurer', 'member', 'advisor')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resigned', 'removed')),
    join_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    term_start DATE,
    term_end DATE,
    responsibilities TEXT,
    expertise_areas TEXT[],
    commitment_level VARCHAR(20) DEFAULT 'regular' CHECK (commitment_level IN ('minimal', 'regular', 'high', 'full_time')),
    voting_rights BOOLEAN DEFAULT true,
    appointed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    appointment_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(committee_id, user_id, role)
);

-- Committee meetings table
CREATE TABLE IF NOT EXISTS committee_meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50) DEFAULT 'regular' CHECK (meeting_type IN ('regular', 'special', 'emergency', 'annual')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255),
    is_virtual BOOLEAN DEFAULT false,
    meeting_link VARCHAR(500),
    agenda JSONB DEFAULT '[]', -- Array of agenda items
    minutes TEXT,
    decisions JSONB DEFAULT '[]', -- Array of decisions made
    action_items JSONB DEFAULT '[]', -- Array of action items
    attendance_required BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Committee meeting attendance table
CREATE TABLE IF NOT EXISTS committee_meeting_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES committee_meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'invited' CHECK (status IN ('invited', 'attending', 'absent', 'excused', 'late')),
    rsvp_status VARCHAR(20) DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'yes', 'no', 'maybe')),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meeting_id, user_id)
);

-- Committee documents table
CREATE TABLE IF NOT EXISTS committee_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
    meeting_id UUID REFERENCES committee_meetings(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    document_type VARCHAR(50) DEFAULT 'general' CHECK (document_type IN ('agenda', 'minutes', 'report', 'policy', 'budget', 'proposal', 'general')),
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    is_confidential BOOLEAN DEFAULT false,
    access_level VARCHAR(20) DEFAULT 'committee' CHECK (access_level IN ('public', 'members', 'committee', 'leadership')),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Committee tasks/action items table
CREATE TABLE IF NOT EXISTS committee_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
    meeting_id UUID REFERENCES committee_meetings(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    due_date DATE,
    completion_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    dependencies TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_committees_status ON committees(status);
CREATE INDEX IF NOT EXISTS idx_committees_type ON committees(type);
CREATE INDEX IF NOT EXISTS idx_committees_chair_id ON committees(chair_id);
CREATE INDEX IF NOT EXISTS idx_committee_members_committee_id ON committee_members(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_members_user_id ON committee_members(user_id);
CREATE INDEX IF NOT EXISTS idx_committee_members_role ON committee_members(role);
CREATE INDEX IF NOT EXISTS idx_committee_members_status ON committee_members(status);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_committee_id ON committee_meetings(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_scheduled_date ON committee_meetings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_status ON committee_meetings(status);
CREATE INDEX IF NOT EXISTS idx_committee_meeting_attendance_meeting_id ON committee_meeting_attendance(meeting_id);
CREATE INDEX IF NOT EXISTS idx_committee_meeting_attendance_user_id ON committee_meeting_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_committee_documents_committee_id ON committee_documents(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_documents_type ON committee_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_committee_tasks_committee_id ON committee_tasks(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_tasks_assigned_to ON committee_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_committee_tasks_status ON committee_tasks(status);
CREATE INDEX IF NOT EXISTS idx_committee_tasks_due_date ON committee_tasks(due_date);

-- Row Level Security (RLS) Policies
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_tasks ENABLE ROW LEVEL SECURITY;

-- Policies for committees
CREATE POLICY "Anyone can view public committees" ON committees
    FOR SELECT USING (is_public = true AND status = 'active');

CREATE POLICY "Committee members can view their committees" ON committees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM committee_members 
            WHERE committee_members.committee_id = id 
            AND committee_members.user_id = auth.uid()
            AND committee_members.status = 'active'
        )
    );

CREATE POLICY "Admins can manage all committees" ON committees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Committee chairs can manage their committees" ON committees
    FOR ALL USING (chair_id = auth.uid() OR vice_chair_id = auth.uid());

-- Policies for committee_members
CREATE POLICY "Committee members can view committee membership" ON committee_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM committee_members cm 
            WHERE cm.committee_id = committee_id 
            AND cm.user_id = auth.uid()
            AND cm.status = 'active'
        )
    );

CREATE POLICY "Users can view their own memberships" ON committee_members
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Committee leadership can manage membership" ON committee_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM committees c
            WHERE c.id = committee_id 
            AND (c.chair_id = auth.uid() OR c.vice_chair_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for committee_meetings
CREATE POLICY "Committee members can view meetings" ON committee_meetings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM committee_members 
            WHERE committee_members.committee_id = committee_id 
            AND committee_members.user_id = auth.uid()
            AND committee_members.status = 'active'
        )
    );

CREATE POLICY "Committee leadership can manage meetings" ON committee_meetings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM committees c
            WHERE c.id = committee_id 
            AND (c.chair_id = auth.uid() OR c.vice_chair_id = auth.uid() OR c.secretary_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for committee_meeting_attendance
CREATE POLICY "Users can view their own attendance" ON committee_meeting_attendance
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Committee members can view meeting attendance" ON committee_meeting_attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM committee_meetings cm
            JOIN committee_members cmem ON cm.committee_id = cmem.committee_id
            WHERE cm.id = meeting_id 
            AND cmem.user_id = auth.uid()
            AND cmem.status = 'active'
        )
    );

CREATE POLICY "Users can update their own attendance" ON committee_meeting_attendance
    FOR UPDATE USING (user_id = auth.uid());

-- Policies for committee_documents
CREATE POLICY "Committee members can view documents" ON committee_documents
    FOR SELECT USING (
        access_level = 'public' OR
        (access_level = 'members' AND auth.role() = 'authenticated') OR
        (access_level IN ('committee', 'leadership') AND EXISTS (
            SELECT 1 FROM committee_members 
            WHERE committee_members.committee_id = committee_id 
            AND committee_members.user_id = auth.uid()
            AND committee_members.status = 'active'
        ))
    );

CREATE POLICY "Committee leadership can manage documents" ON committee_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM committees c
            WHERE c.id = committee_id 
            AND (c.chair_id = auth.uid() OR c.vice_chair_id = auth.uid() OR c.secretary_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for committee_tasks
CREATE POLICY "Committee members can view tasks" ON committee_tasks
    FOR SELECT USING (
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM committee_members 
            WHERE committee_members.committee_id = committee_id 
            AND committee_members.user_id = auth.uid()
            AND committee_members.status = 'active'
        )
    );

CREATE POLICY "Assigned users can update their tasks" ON committee_tasks
    FOR UPDATE USING (assigned_to = auth.uid());

CREATE POLICY "Committee leadership can manage tasks" ON committee_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM committees c
            WHERE c.id = committee_id 
            AND (c.chair_id = auth.uid() OR c.vice_chair_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_committee_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE committees 
        SET current_members = current_members + 1
        WHERE id = NEW.committee_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'active' AND NEW.status = 'active' THEN
            UPDATE committees 
            SET current_members = current_members + 1
            WHERE id = NEW.committee_id;
        ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
            UPDATE committees 
            SET current_members = current_members - 1
            WHERE id = NEW.committee_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
        UPDATE committees 
        SET current_members = current_members - 1
        WHERE id = OLD.committee_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to get committee hierarchy
CREATE OR REPLACE FUNCTION get_committee_hierarchy(committee_uuid UUID)
RETURNS TABLE(
    id UUID,
    name VARCHAR(255),
    level INTEGER,
    path TEXT
) AS $$
WITH RECURSIVE committee_tree AS (
    -- Base case: start with the given committee
    SELECT c.id, c.name, c.parent_committee_id, 0 as level, c.name::TEXT as path
    FROM committees c
    WHERE c.id = committee_uuid
    
    UNION ALL
    
    -- Recursive case: find children
    SELECT c.id, c.name, c.parent_committee_id, ct.level + 1, ct.path || ' > ' || c.name
    FROM committees c
    JOIN committee_tree ct ON c.parent_committee_id = ct.id
)
SELECT ct.id, ct.name, ct.level, ct.path
FROM committee_tree ct
ORDER BY ct.level, ct.name;
$$ LANGUAGE sql;

-- Trigger to update committee member count
CREATE TRIGGER update_committee_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON committee_members
    FOR EACH ROW
    EXECUTE FUNCTION update_committee_member_count();

-- Insert default committees
INSERT INTO committees (name, description, type, chair_id, meeting_frequency, is_public) VALUES
('Executive Committee', 'Main governing body of the organization', 'standing', NULL, 'Monthly', true),
('Academic Committee', 'Oversees educational programs and activities', 'standing', NULL, 'Bi-weekly', true),
('Events Committee', 'Plans and organizes community events', 'standing', NULL, 'Weekly', true),
('Finance Committee', 'Manages budget and financial planning', 'standing', NULL, 'Monthly', false),
('Outreach Committee', 'Handles community outreach and dawa activities', 'standing', NULL, 'Bi-weekly', true),
('Technology Committee', 'Manages IT infrastructure and digital services', 'standing', NULL, 'Weekly', true),
('Youth Committee', 'Focuses on youth programs and activities', 'standing', NULL, 'Weekly', true),
('Women''s Committee', 'Addresses women-specific programs and needs', 'standing', NULL, 'Bi-weekly', true)
ON CONFLICT (name) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE committees IS 'Stores committee information with hierarchy support and leadership roles';
COMMENT ON TABLE committee_members IS 'Tracks committee membership with roles and status';
COMMENT ON TABLE committee_meetings IS 'Manages committee meetings with agenda and minutes';
COMMENT ON TABLE committee_meeting_attendance IS 'Records attendance for committee meetings';
COMMENT ON TABLE committee_documents IS 'Stores committee documents with access control';
COMMENT ON TABLE committee_tasks IS 'Manages committee tasks and action items';