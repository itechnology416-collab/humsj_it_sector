-- Member Management Tables
-- This migration creates tables for comprehensive member management

-- Member invitations table
CREATE TABLE IF NOT EXISTS member_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Member roles table (extends user_roles)
CREATE TABLE IF NOT EXISTS member_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_name)
);

-- Member status history table
CREATE TABLE IF NOT EXISTS member_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    reason TEXT,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Member statistics table
CREATE TABLE IF NOT EXISTS member_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_events_attended INTEGER DEFAULT 0,
    total_courses_completed INTEGER DEFAULT 0,
    total_volunteer_hours INTEGER DEFAULT 0,
    total_contributions INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_member_invitations_email ON member_invitations(email);
CREATE INDEX IF NOT EXISTS idx_member_invitations_status ON member_invitations(status);
CREATE INDEX IF NOT EXISTS idx_member_invitations_expires_at ON member_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_member_roles_user_id ON member_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_role_name ON member_roles(role_name);
CREATE INDEX IF NOT EXISTS idx_member_status_history_user_id ON member_status_history(user_id);
CREATE INDEX IF NOT EXISTS idx_member_statistics_user_id ON member_statistics(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE member_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_statistics ENABLE ROW LEVEL SECURITY;

-- Policies for member_invitations
CREATE POLICY "Users can view invitations sent to their email" ON member_invitations
    FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage all invitations" ON member_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for member_roles
CREATE POLICY "Users can view their own roles" ON member_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON member_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for member_status_history
CREATE POLICY "Users can view their own status history" ON member_status_history
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all status history" ON member_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for member_statistics
CREATE POLICY "Users can view their own statistics" ON member_statistics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public statistics are viewable by all authenticated users" ON member_statistics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Functions for automatic statistics updates
CREATE OR REPLACE FUNCTION update_member_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update statistics when events, courses, or volunteer activities change
    INSERT INTO member_statistics (user_id, updated_at)
    VALUES (NEW.user_id, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
    UPDATE member_invitations 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update member statistics
CREATE TRIGGER update_member_stats_trigger
    AFTER INSERT OR UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_member_statistics();

-- Comments for documentation
COMMENT ON TABLE member_invitations IS 'Stores member invitation details with expiration and status tracking';
COMMENT ON TABLE member_roles IS 'Extended role management with departments, positions, and permissions';
COMMENT ON TABLE member_status_history IS 'Audit trail for member status changes';
COMMENT ON TABLE member_statistics IS 'Aggregated statistics for member activities and engagement';