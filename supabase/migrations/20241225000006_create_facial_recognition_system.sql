-- Facial Recognition System Tables
-- This migration creates tables for advanced facial recognition authentication

-- Face templates table for storing biometric data
CREATE TABLE IF NOT EXISTS face_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_data TEXT NOT NULL, -- Encrypted face template/embedding
    template_version VARCHAR(10) DEFAULT '1.0',
    confidence_score DECIMAL(5,4), -- Confidence score when template was created
    face_landmarks JSONB, -- Facial landmark points for additional verification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    device_info JSONB, -- Device used for enrollment
    UNIQUE(user_id, template_version)
);

-- Face authentication attempts table for security and analytics
CREATE TABLE IF NOT EXISTS face_auth_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_type VARCHAR(20) CHECK (attempt_type IN ('enrollment', 'verification', 'login')),
    success BOOLEAN NOT NULL,
    confidence_score DECIMAL(5,4),
    failure_reason VARCHAR(100), -- 'no_face_detected', 'low_confidence', 'multiple_faces', etc.
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    location_data JSONB, -- Optional geolocation data
    processing_time_ms INTEGER, -- Time taken for face processing
    template_version VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Face authentication settings per user
CREATE TABLE IF NOT EXISTS face_auth_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    require_face_for_login BOOLEAN DEFAULT false,
    confidence_threshold DECIMAL(5,4) DEFAULT 0.8500, -- Minimum confidence for successful auth
    max_failed_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 30,
    allow_fallback_password BOOLEAN DEFAULT true,
    anti_spoofing_enabled BOOLEAN DEFAULT true,
    multi_face_detection BOOLEAN DEFAULT false, -- Allow multiple enrolled faces
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Face authentication sessions for tracking active sessions
CREATE TABLE IF NOT EXISTS face_auth_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    authenticated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    device_fingerprint VARCHAR(255),
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason VARCHAR(100)
);

-- Biometric security events for audit trail
CREATE TABLE IF NOT EXISTS biometric_security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'enrollment', 'successful_auth', 'failed_auth', 'spoofing_detected', etc.
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    description TEXT,
    metadata JSONB, -- Additional event data
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_face_templates_user_id ON face_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_face_templates_active ON face_templates(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_face_auth_attempts_user_id ON face_auth_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_face_auth_attempts_created_at ON face_auth_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_face_auth_attempts_success ON face_auth_attempts(user_id, success);
CREATE INDEX IF NOT EXISTS idx_face_auth_sessions_user_id ON face_auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_face_auth_sessions_token ON face_auth_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_face_auth_sessions_active ON face_auth_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_biometric_events_user_id ON biometric_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_events_created_at ON biometric_security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_biometric_events_severity ON biometric_security_events(severity);

-- Row Level Security (RLS) Policies
ALTER TABLE face_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_auth_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_auth_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_security_events ENABLE ROW LEVEL SECURITY;

-- Policies for face_templates
CREATE POLICY "Users can view their own face templates" ON face_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own face templates" ON face_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own face templates" ON face_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own face templates" ON face_templates
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all face templates" ON face_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for face_auth_attempts
CREATE POLICY "Users can view their own auth attempts" ON face_auth_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert auth attempts" ON face_auth_attempts
    FOR INSERT WITH CHECK (true); -- Allow system to log attempts

CREATE POLICY "Admins can view all auth attempts" ON face_auth_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for face_auth_settings
CREATE POLICY "Users can manage their own face auth settings" ON face_auth_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all face auth settings" ON face_auth_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for face_auth_sessions
CREATE POLICY "Users can view their own auth sessions" ON face_auth_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own auth sessions" ON face_auth_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage auth sessions" ON face_auth_sessions
    FOR ALL WITH CHECK (true);

-- Policies for biometric_security_events
CREATE POLICY "Users can view their own security events" ON biometric_security_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events" ON biometric_security_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all security events" ON biometric_security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Functions for face authentication
CREATE OR REPLACE FUNCTION cleanup_expired_face_sessions()
RETURNS void AS $$
BEGIN
    UPDATE face_auth_sessions 
    SET is_active = false, revoked_at = NOW(), revoked_reason = 'expired'
    WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to get user face auth statistics
CREATE OR REPLACE FUNCTION get_user_face_auth_stats(user_uuid UUID)
RETURNS TABLE(
    total_attempts INTEGER,
    successful_attempts INTEGER,
    failed_attempts INTEGER,
    success_rate DECIMAL,
    last_successful_auth TIMESTAMP WITH TIME ZONE,
    last_failed_auth TIMESTAMP WITH TIME ZONE,
    avg_confidence DECIMAL,
    is_locked_out BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_attempts,
        COUNT(CASE WHEN success THEN 1 END)::INTEGER as successful_attempts,
        COUNT(CASE WHEN NOT success THEN 1 END)::INTEGER as failed_attempts,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND(COUNT(CASE WHEN success THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2)
            ELSE 0
        END as success_rate,
        MAX(CASE WHEN success THEN created_at END) as last_successful_auth,
        MAX(CASE WHEN NOT success THEN created_at END) as last_failed_auth,
        ROUND(AVG(confidence_score), 4) as avg_confidence,
        (
            SELECT COUNT(*) >= COALESCE(fas.max_failed_attempts, 5)
            FROM face_auth_attempts faa2
            JOIN face_auth_settings fas ON fas.user_id = user_uuid
            WHERE faa2.user_id = user_uuid 
            AND faa2.success = false 
            AND faa2.created_at > NOW() - INTERVAL '1 hour' * COALESCE(fas.lockout_duration_minutes, 30) / 60
        ) as is_locked_out
    FROM face_auth_attempts faa
    WHERE faa.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to log biometric security events
CREATE OR REPLACE FUNCTION log_biometric_event(
    p_user_id UUID,
    p_event_type VARCHAR(50),
    p_severity VARCHAR(20) DEFAULT 'info',
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO biometric_security_events (
        user_id, event_type, severity, description, metadata, ip_address, user_agent
    ) VALUES (
        p_user_id, p_event_type, p_severity, p_description, p_metadata, p_ip_address, p_user_agent
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update face_templates updated_at
CREATE OR REPLACE FUNCTION update_face_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_face_templates_updated_at_trigger
    BEFORE UPDATE ON face_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_face_templates_updated_at();

-- Trigger to update face_auth_settings updated_at
CREATE OR REPLACE FUNCTION update_face_auth_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_face_auth_settings_updated_at_trigger
    BEFORE UPDATE ON face_auth_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_face_auth_settings_updated_at();

-- Create default face auth settings for existing users
INSERT INTO face_auth_settings (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM face_auth_settings)
ON CONFLICT (user_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE face_templates IS 'Stores encrypted facial recognition templates for user authentication';
COMMENT ON TABLE face_auth_attempts IS 'Logs all facial recognition authentication attempts for security and analytics';
COMMENT ON TABLE face_auth_settings IS 'User-specific settings for facial recognition authentication';
COMMENT ON TABLE face_auth_sessions IS 'Tracks active facial recognition authentication sessions';
COMMENT ON TABLE biometric_security_events IS 'Audit trail for biometric security events and potential threats';

COMMENT ON COLUMN face_templates.template_data IS 'Encrypted facial recognition template/embedding data';
COMMENT ON COLUMN face_templates.face_landmarks IS 'Facial landmark points for additional verification and anti-spoofing';
COMMENT ON COLUMN face_auth_attempts.confidence_score IS 'Confidence score of the facial recognition match (0.0 to 1.0)';
COMMENT ON COLUMN face_auth_settings.confidence_threshold IS 'Minimum confidence score required for successful authentication';
COMMENT ON COLUMN face_auth_settings.anti_spoofing_enabled IS 'Enable liveness detection to prevent photo/video spoofing';