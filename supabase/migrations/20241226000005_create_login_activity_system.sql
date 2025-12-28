-- Create login activity and security monitoring system
-- This migration creates comprehensive login tracking and security monitoring

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create login sessions table
CREATE TABLE IF NOT EXISTS login_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    device_info JSONB NOT NULL DEFAULT '{}',
    location_info JSONB DEFAULT '{}',
    login_method TEXT NOT NULL CHECK (login_method IN ('password', 'facial_recognition', 'otp', 'social', 'magic_link')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated', 'suspicious')),
    is_suspicious BOOLEAN DEFAULT false,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('login_attempt', 'login_success', 'login_failure', 'logout', 'password_change', 'suspicious_activity', 'account_locked', 'session_expired')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    device_fingerprint TEXT,
    location_info JSONB DEFAULT '{}',
    additional_data JSONB NOT NULL DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create device info table
CREATE TABLE IF NOT EXISTS device_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
    os_name TEXT NOT NULL,
    os_version TEXT NOT NULL,
    browser_name TEXT NOT NULL,
    browser_version TEXT NOT NULL,
    is_trusted BOOLEAN DEFAULT false,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    login_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, device_id)
);

-- Create security alerts table
CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('multiple_failed_logins', 'new_device', 'unusual_location', 'suspicious_activity', 'account_compromise')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'false_positive')),
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create login attempt tracking table
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    device_fingerprint TEXT,
    location_info JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security settings table
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    max_failed_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 30,
    session_timeout_minutes INTEGER DEFAULT 480, -- 8 hours
    require_device_verification BOOLEAN DEFAULT false,
    enable_location_tracking BOOLEAN DEFAULT true,
    enable_security_notifications BOOLEAN DEFAULT true,
    trusted_ip_addresses TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_login_sessions_user_id ON login_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_sessions_status ON login_sessions(status);
CREATE INDEX IF NOT EXISTS idx_login_sessions_login_at ON login_sessions(login_at);
CREATE INDEX IF NOT EXISTS idx_login_sessions_ip_address ON login_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_sessions_suspicious ON login_sessions(is_suspicious);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(is_resolved);

CREATE INDEX IF NOT EXISTS idx_device_info_user_id ON device_info(user_id);
CREATE INDEX IF NOT EXISTS idx_device_info_device_id ON device_info(device_id);
CREATE INDEX IF NOT EXISTS idx_device_info_trusted ON device_info(is_trusted);
CREATE INDEX IF NOT EXISTS idx_device_info_last_seen ON device_info(last_seen_at);

CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_priority ON security_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_login_sessions_updated_at 
    BEFORE UPDATE ON login_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_info_updated_at 
    BEFORE UPDATE ON device_info 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_alerts_updated_at 
    BEFORE UPDATE ON security_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at 
    BEFORE UPDATE ON security_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Policies for login_sessions
CREATE POLICY "Users can view their own login sessions" ON login_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert login sessions" ON login_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own login sessions" ON login_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all login sessions" ON login_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for security_events
CREATE POLICY "Users can view their own security events" ON security_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events" ON security_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update security events" ON security_events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for device_info
CREATE POLICY "Users can view their own device info" ON device_info
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage device info" ON device_info
    FOR ALL WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all device info" ON device_info
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for security_alerts
CREATE POLICY "Users can view their own security alerts" ON security_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert security alerts" ON security_alerts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can acknowledge their own alerts" ON security_alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all security alerts" ON security_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for login_attempts
CREATE POLICY "Admins can view all login attempts" ON login_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "System can insert login attempts" ON login_attempts
    FOR INSERT WITH CHECK (true);

-- Policies for security_settings
CREATE POLICY "Users can manage their own security settings" ON security_settings
    FOR ALL USING (auth.uid() = user_id);

-- Create functions for security automation
CREATE OR REPLACE FUNCTION check_failed_login_attempts(user_email TEXT, ip_addr INET)
RETURNS INTEGER AS $$
DECLARE
    failed_count INTEGER;
BEGIN
    -- Count failed attempts in the last hour
    SELECT COUNT(*) INTO failed_count
    FROM login_attempts
    WHERE email = user_email
    AND ip_address = ip_addr
    AND success = false
    AND created_at > NOW() - INTERVAL '1 hour';
    
    RETURN failed_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    -- Mark sessions as expired based on inactivity
    UPDATE login_sessions 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active'
    AND last_activity_at < NOW() - INTERVAL '8 hours';
    
    -- Log session expiry events
    INSERT INTO security_events (user_id, event_type, severity, description, ip_address, user_agent, additional_data)
    SELECT 
        user_id,
        'session_expired',
        'low',
        'Session expired due to inactivity',
        ip_address,
        user_agent,
        jsonb_build_object('session_id', id)
    FROM login_sessions 
    WHERE status = 'expired'
    AND updated_at::date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_security_stats(target_user_id UUID)
RETURNS TABLE (
    total_sessions bigint,
    active_sessions bigint,
    suspicious_sessions bigint,
    trusted_devices bigint,
    security_events bigint,
    unresolved_alerts bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM login_sessions WHERE user_id = target_user_id),
        (SELECT COUNT(*) FROM login_sessions WHERE user_id = target_user_id AND status = 'active'),
        (SELECT COUNT(*) FROM login_sessions WHERE user_id = target_user_id AND is_suspicious = true),
        (SELECT COUNT(*) FROM device_info WHERE user_id = target_user_id AND is_trusted = true),
        (SELECT COUNT(*) FROM security_events WHERE user_id = target_user_id),
        (SELECT COUNT(*) FROM security_alerts WHERE user_id = target_user_id AND status = 'active');
END;
$$ LANGUAGE plpgsql;

-- Create function to detect suspicious activity
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS void AS $$
DECLARE
    session_record RECORD;
BEGIN
    -- Check for multiple simultaneous sessions from different locations
    FOR session_record IN 
        SELECT user_id, COUNT(*) as session_count
        FROM login_sessions 
        WHERE status = 'active'
        AND login_at > NOW() - INTERVAL '1 hour'
        GROUP BY user_id
        HAVING COUNT(*) > 3
    LOOP
        -- Create suspicious activity alert
        INSERT INTO security_alerts (user_id, alert_type, priority, title, message, data)
        VALUES (
            session_record.user_id,
            'suspicious_activity',
            'high',
            'Multiple Simultaneous Sessions',
            'Multiple active sessions detected from different locations',
            jsonb_build_object('session_count', session_record.session_count)
        );
        
        -- Log security event
        INSERT INTO security_events (user_id, event_type, severity, description, ip_address, user_agent, additional_data)
        VALUES (
            session_record.user_id,
            'suspicious_activity',
            'high',
            'Multiple simultaneous sessions detected',
            '0.0.0.0',
            'System',
            jsonb_build_object('session_count', session_record.session_count)
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create notification function for security events
CREATE OR REPLACE FUNCTION notify_security_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notification for high severity events
    IF NEW.severity IN ('high', 'critical') THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            data,
            created_at
        ) VALUES (
            NEW.user_id,
            'Security Alert',
            NEW.description,
            'security',
            jsonb_build_object(
                'event_id', NEW.id,
                'event_type', NEW.event_type,
                'severity', NEW.severity,
                'ip_address', NEW.ip_address
            ),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for security event notifications
CREATE TRIGGER security_event_notification
    AFTER INSERT ON security_events
    FOR EACH ROW
    EXECUTE FUNCTION notify_security_event();

-- Create function to automatically create security settings for new users
CREATE OR REPLACE FUNCTION create_default_security_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO security_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default security settings
CREATE TRIGGER create_user_security_settings
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_security_settings();

-- Create scheduled jobs for maintenance (if pg_cron is available)
-- SELECT cron.schedule('cleanup-expired-sessions', '0 */6 * * *', 'SELECT cleanup_expired_sessions();');
-- SELECT cron.schedule('detect-suspicious-activity', '*/15 * * * *', 'SELECT detect_suspicious_activity();');

-- Insert sample security settings
INSERT INTO security_settings (user_id, max_failed_attempts, lockout_duration_minutes, session_timeout_minutes)
SELECT id, 5, 30, 480
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE login_sessions IS 'Tracks user login sessions with security monitoring';
COMMENT ON TABLE security_events IS 'Logs all security-related events for audit and monitoring';
COMMENT ON TABLE device_info IS 'Stores information about user devices for trust management';
COMMENT ON TABLE security_alerts IS 'Active security alerts requiring attention';
COMMENT ON TABLE login_attempts IS 'Tracks all login attempts for security analysis';
COMMENT ON TABLE security_settings IS 'User-specific security configuration settings';