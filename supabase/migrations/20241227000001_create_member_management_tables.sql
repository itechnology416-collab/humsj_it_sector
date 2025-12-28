-- Create member management tables for real-world functionality

-- First, ensure the profiles table has all required columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_id UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- Create member_invitations table
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

-- Create member_requests table
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

-- Create admin_users table
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

-- Create system_alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_activity_log table
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

-- Create system_configuration table
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

-- Create system_health table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_member_invitations_email ON member_invitations(email);
CREATE INDEX IF NOT EXISTS idx_member_invitations_status ON member_invitations(status);
CREATE INDEX IF NOT EXISTS idx_member_invitations_token ON member_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_member_invitations_created_by ON member_invitations(created_by);

CREATE INDEX IF NOT EXISTS idx_member_requests_email ON member_requests(email);
CREATE INDEX IF NOT EXISTS idx_member_requests_status ON member_requests(status);
CREATE INDEX IF NOT EXISTS idx_member_requests_reviewed_by ON member_requests(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

CREATE INDEX IF NOT EXISTS idx_system_alerts_type ON system_alerts(type);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON system_alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user_id ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

CREATE INDEX IF NOT EXISTS idx_system_health_service_name ON system_health(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON system_health(status);

-- Create RLS policies for security
ALTER TABLE member_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_invitations
CREATE POLICY "Admin can manage invitations" ON member_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

-- RLS Policies for member_requests
CREATE POLICY "Users can view their own requests" ON member_requests
  FOR SELECT USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

CREATE POLICY "Admin can manage requests" ON member_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

-- RLS Policies for admin_users
CREATE POLICY "Admin can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'it_head')
    )
  );

-- RLS Policies for system_alerts
CREATE POLICY "Admin can manage alerts" ON system_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

-- RLS Policies for admin_activity_log
CREATE POLICY "Admin can view activity logs" ON admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

-- RLS Policies for system_configuration
CREATE POLICY "Admin can manage system config" ON system_configuration
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'it_head', 'sys_admin')
    )
  );

-- RLS Policies for system_health
CREATE POLICY "Admin can view system health" ON system_health
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'it_head', 'sys_admin')
    )
  );

-- Create functions for member management
CREATE OR REPLACE FUNCTION get_members_with_roles(
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0,
  p_status TEXT DEFAULT NULL,
  p_college TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  college TEXT,
  department TEXT,
  year INTEGER,
  avatar_url TEXT,
  bio TEXT,
  status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  role TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.email,
    p.phone,
    p.college,
    p.department,
    p.year,
    p.avatar_url,
    p.bio,
    p.status,
    p.created_at,
    p.updated_at,
    COALESCE(ur.role, 'member') as role
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE 
    (p_status IS NULL OR p.status = p_status) AND
    (p_college IS NULL OR p.college = p_college)
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create function to get member statistics
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

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

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