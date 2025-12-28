-- Analytics and Reporting System
-- Migration: 20241226000001_create_analytics_reporting_system.sql

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit VARCHAR(50),
    metric_category VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL, -- 'overview', 'membership', 'events', 'communication', 'engagement'
    parameters JSONB DEFAULT '{}',
    generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'generating', 'completed', 'failed'
    generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard Widgets Table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    widget_type VARCHAR(100) NOT NULL,
    widget_config JSONB DEFAULT '{}',
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 1,
    height INTEGER DEFAULT 1,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Health Checks Table
CREATE TABLE IF NOT EXISTS system_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'operational', 'degraded', 'outage'
    response_time_ms INTEGER,
    uptime_percentage NUMERIC(5,2),
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Incidents Table
CREATE TABLE IF NOT EXISTS system_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
    affected_services TEXT[],
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_system_metrics_metric_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user_id ON dashboard_widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_service_name ON system_health_checks(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_last_checked ON system_health_checks(last_checked);
CREATE INDEX IF NOT EXISTS idx_system_incidents_status ON system_incidents(status);
CREATE INDEX IF NOT EXISTS idx_system_incidents_severity ON system_incidents(severity);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analytics events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics events" ON analytics_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "System can insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view system metrics" ON system_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "System can insert metrics" ON system_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own reports" ON reports
    FOR SELECT USING (auth.uid() = generated_by);

CREATE POLICY "Admins can manage all reports" ON reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can manage their own dashboard widgets" ON dashboard_widgets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view system health checks" ON system_health_checks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "System can manage health checks" ON system_health_checks
    FOR ALL WITH CHECK (true);

CREATE POLICY "Admins can manage system incidents" ON system_incidents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- Functions for analytics
CREATE OR REPLACE FUNCTION track_analytics_event(
    p_event_type VARCHAR(100),
    p_event_category VARCHAR(100),
    p_event_data JSONB DEFAULT '{}',
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO analytics_events (
        user_id, event_type, event_category, event_data, 
        session_id, page_url, referrer
    ) VALUES (
        auth.uid(), p_event_type, p_event_category, p_event_data,
        p_session_id, p_page_url, p_referrer
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION record_system_metric(
    p_metric_name VARCHAR(100),
    p_metric_value NUMERIC,
    p_metric_unit VARCHAR(50) DEFAULT NULL,
    p_metric_category VARCHAR(100) DEFAULT 'general',
    p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    metric_id UUID;
BEGIN
    INSERT INTO system_metrics (
        metric_name, metric_value, metric_unit, metric_category, metadata
    ) VALUES (
        p_metric_name, p_metric_value, p_metric_unit, p_metric_category, p_metadata
    ) RETURNING id INTO metric_id;
    
    RETURN metric_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_dashboard_overview()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    total_users INTEGER;
    active_users INTEGER;
    total_events INTEGER;
    upcoming_events INTEGER;
    engagement_rate NUMERIC;
BEGIN
    -- Get user statistics
    SELECT COUNT(*) INTO total_users FROM profiles;
    SELECT COUNT(*) INTO active_users FROM profiles WHERE status = 'active';
    
    -- Get event statistics
    SELECT COUNT(*) INTO total_events FROM events;
    SELECT COUNT(*) INTO upcoming_events FROM events WHERE start_date > NOW();
    
    -- Calculate engagement rate (simplified)
    SELECT COALESCE(AVG(
        CASE WHEN last_sign_in_at > NOW() - INTERVAL '30 days' THEN 100 ELSE 0 END
    ), 0) INTO engagement_rate FROM auth.users;
    
    result := jsonb_build_object(
        'total_users', total_users,
        'active_users', active_users,
        'total_events', total_events,
        'upcoming_events', upcoming_events,
        'engagement_rate', engagement_rate,
        'generated_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_widgets_updated_at
    BEFORE UPDATE ON dashboard_widgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_incidents_updated_at
    BEFORE UPDATE ON system_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();