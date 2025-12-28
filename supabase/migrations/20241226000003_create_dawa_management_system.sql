-- Da'wa Management System
-- Migration: 20241226000003_create_dawa_management_system.sql

-- Da'wa Campaigns Table
CREATE TABLE IF NOT EXISTS dawa_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(100) NOT NULL, -- 'online', 'offline', 'hybrid', 'social_media', 'educational'
    target_audience VARCHAR(100), -- 'general', 'youth', 'women', 'converts', 'non_muslims'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'cancelled'
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'ETB',
    goals JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Content Table
CREATE TABLE IF NOT EXISTS dawa_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES dawa_campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL, -- 'article', 'video', 'audio', 'infographic', 'social_post', 'pamphlet'
    content TEXT,
    media_urls JSONB DEFAULT '[]',
    language VARCHAR(10) DEFAULT 'en',
    target_platforms TEXT[], -- ['facebook', 'telegram', 'website', 'print']
    status VARCHAR(50) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    engagement_stats JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Distribution Channels Table
CREATE TABLE IF NOT EXISTS dawa_distribution_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    channel_type VARCHAR(50) NOT NULL, -- 'social_media', 'website', 'email', 'sms', 'print', 'radio', 'tv'
    platform VARCHAR(100), -- 'facebook', 'telegram', 'instagram', 'youtube', etc.
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    reach_estimate INTEGER DEFAULT 0,
    cost_per_reach NUMERIC(10,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Content Distribution Table
CREATE TABLE IF NOT EXISTS dawa_content_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES dawa_content(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES dawa_distribution_channels(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'scheduled', 'published', 'failed'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    reach_count INTEGER DEFAULT 0,
    engagement_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    cost NUMERIC(10,2) DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Engagement Tracking Table
CREATE TABLE IF NOT EXISTS dawa_engagement_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES dawa_content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    engagement_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'share', 'comment', 'download', 'inquiry'
    platform VARCHAR(100),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Inquiries Table
CREATE TABLE IF NOT EXISTS dawa_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES dawa_campaigns(id) ON DELETE SET NULL,
    content_id UUID REFERENCES dawa_content(id) ON DELETE SET NULL,
    inquirer_name VARCHAR(255),
    inquirer_email VARCHAR(255),
    inquirer_phone VARCHAR(50),
    inquiry_type VARCHAR(100), -- 'general', 'conversion', 'learning', 'support', 'complaint'
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'assigned', 'in_progress', 'resolved', 'closed'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    source_platform VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Resources Table
CREATE TABLE IF NOT EXISTS dawa_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(100) NOT NULL, -- 'book', 'pamphlet', 'video', 'audio', 'course', 'template'
    category VARCHAR(100), -- 'basics', 'comparative', 'history', 'jurisprudence', 'spirituality'
    language VARCHAR(10) DEFAULT 'en',
    file_url TEXT,
    download_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    tags TEXT[],
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Da'wa Volunteers Table
CREATE TABLE IF NOT EXISTS dawa_volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    specializations TEXT[], -- ['translation', 'content_creation', 'social_media', 'counseling']
    languages TEXT[],
    availability JSONB DEFAULT '{}',
    experience_level VARCHAR(50) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'expert'
    certifications JSONB DEFAULT '[]',
    performance_rating NUMERIC(3,2) DEFAULT 0,
    total_contributions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Da'wa Campaign Assignments Table
CREATE TABLE IF NOT EXISTS dawa_campaign_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES dawa_campaigns(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES dawa_volunteers(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- 'coordinator', 'content_creator', 'translator', 'distributor', 'analyst'
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    contribution_hours NUMERIC(5,2) DEFAULT 0,
    performance_notes TEXT,
    UNIQUE(campaign_id, volunteer_id, role)
);

-- Da'wa Analytics Table
CREATE TABLE IF NOT EXISTS dawa_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES dawa_campaigns(id) ON DELETE CASCADE,
    content_id UUID REFERENCES dawa_content(id) ON DELETE SET NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit VARCHAR(50),
    dimension_1 VARCHAR(100), -- e.g., 'platform', 'age_group', 'location'
    dimension_2 VARCHAR(100),
    recorded_date DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dawa_campaigns_status ON dawa_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_dawa_campaigns_created_by ON dawa_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_dawa_campaigns_start_date ON dawa_campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_dawa_content_campaign_id ON dawa_content(campaign_id);
CREATE INDEX IF NOT EXISTS idx_dawa_content_status ON dawa_content(status);
CREATE INDEX IF NOT EXISTS idx_dawa_content_language ON dawa_content(language);
CREATE INDEX IF NOT EXISTS idx_dawa_content_distribution_content_id ON dawa_content_distribution(content_id);
CREATE INDEX IF NOT EXISTS idx_dawa_content_distribution_channel_id ON dawa_content_distribution(channel_id);
CREATE INDEX IF NOT EXISTS idx_dawa_engagement_tracking_content_id ON dawa_engagement_tracking(content_id);
CREATE INDEX IF NOT EXISTS idx_dawa_engagement_tracking_user_id ON dawa_engagement_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_dawa_inquiries_status ON dawa_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_dawa_inquiries_assigned_to ON dawa_inquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_dawa_volunteers_user_id ON dawa_volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_dawa_campaign_assignments_campaign_id ON dawa_campaign_assignments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_dawa_analytics_campaign_id ON dawa_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_dawa_analytics_recorded_date ON dawa_analytics(recorded_date);

-- Enable RLS
ALTER TABLE dawa_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_distribution_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_content_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_engagement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_campaign_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dawa_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Da'wa coordinators can manage campaigns" ON dawa_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin', 'coordinator')
        )
    );

CREATE POLICY "Public can view published da'wa content" ON dawa_content
    FOR SELECT USING (status = 'published');

CREATE POLICY "Da'wa team can manage content" ON dawa_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin', 'coordinator')
        ) OR
        auth.uid() = created_by
    );

CREATE POLICY "Public can view active distribution channels" ON dawa_distribution_channels
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage distribution channels" ON dawa_distribution_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "System can track engagement" ON dawa_engagement_tracking
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Da'wa team can view engagement data" ON dawa_engagement_tracking
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin', 'coordinator')
        )
    );

CREATE POLICY "Anyone can submit inquiries" ON dawa_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Da'wa team can manage inquiries" ON dawa_inquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin', 'coordinator')
        ) OR
        auth.uid() = assigned_to
    );

CREATE POLICY "Public can view public resources" ON dawa_resources
    FOR SELECT USING (is_public = true);

CREATE POLICY "Da'wa team can manage resources" ON dawa_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin', 'coordinator')
        ) OR
        auth.uid() = created_by
    );

CREATE POLICY "Users can manage their volunteer profile" ON dawa_volunteers
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Da'wa coordinators can view all volunteers" ON dawa_volunteers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'it_head', 'sys_admin', 'coordinator')
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION track_dawa_engagement(
    p_content_id UUID,
    p_engagement_type VARCHAR(50),
    p_platform VARCHAR(100) DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    engagement_id UUID;
BEGIN
    INSERT INTO dawa_engagement_tracking (
        content_id, user_id, engagement_type, platform, 
        session_id, metadata
    ) VALUES (
        p_content_id, auth.uid(), p_engagement_type, p_platform,
        p_session_id, p_metadata
    ) RETURNING id INTO engagement_id;
    
    -- Update content engagement stats
    UPDATE dawa_content 
    SET engagement_stats = COALESCE(engagement_stats, '{}'::jsonb) || 
        jsonb_build_object(
            p_engagement_type, 
            COALESCE((engagement_stats->>p_engagement_type)::integer, 0) + 1
        )
    WHERE id = p_content_id;
    
    RETURN engagement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_campaign_analytics(p_campaign_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    total_content INTEGER;
    total_reach INTEGER;
    total_engagement INTEGER;
    total_inquiries INTEGER;
    conversion_rate NUMERIC;
BEGIN
    -- Get basic campaign stats
    SELECT COUNT(*) INTO total_content 
    FROM dawa_content WHERE campaign_id = p_campaign_id;
    
    SELECT COALESCE(SUM(reach_count), 0) INTO total_reach
    FROM dawa_content_distribution dcd
    JOIN dawa_content dc ON dc.id = dcd.content_id
    WHERE dc.campaign_id = p_campaign_id;
    
    SELECT COUNT(*) INTO total_engagement
    FROM dawa_engagement_tracking det
    JOIN dawa_content dc ON dc.id = det.content_id
    WHERE dc.campaign_id = p_campaign_id;
    
    SELECT COUNT(*) INTO total_inquiries
    FROM dawa_inquiries WHERE campaign_id = p_campaign_id;
    
    -- Calculate conversion rate
    conversion_rate := CASE 
        WHEN total_reach > 0 THEN (total_inquiries::NUMERIC / total_reach) * 100
        ELSE 0
    END;
    
    result := jsonb_build_object(
        'campaign_id', p_campaign_id,
        'total_content', total_content,
        'total_reach', total_reach,
        'total_engagement', total_engagement,
        'total_inquiries', total_inquiries,
        'conversion_rate', conversion_rate,
        'generated_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_resource_download_count(p_resource_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE dawa_resources 
    SET download_count = download_count + 1 
    WHERE id = p_resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_dawa_campaigns_updated_at
    BEFORE UPDATE ON dawa_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dawa_content_updated_at
    BEFORE UPDATE ON dawa_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dawa_distribution_channels_updated_at
    BEFORE UPDATE ON dawa_distribution_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dawa_content_distribution_updated_at
    BEFORE UPDATE ON dawa_content_distribution
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dawa_inquiries_updated_at
    BEFORE UPDATE ON dawa_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dawa_resources_updated_at
    BEFORE UPDATE ON dawa_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dawa_volunteers_updated_at
    BEFORE UPDATE ON dawa_volunteers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default distribution channels
INSERT INTO dawa_distribution_channels (name, channel_type, platform, configuration) VALUES
('HUMSJ Website', 'website', 'website', '{"base_url": "https://humsj.org"}'),
('Facebook Page', 'social_media', 'facebook', '{"page_id": "", "access_token": ""}'),
('Telegram Channel', 'social_media', 'telegram', '{"channel_id": "", "bot_token": ""}'),
('Email Newsletter', 'email', 'email', '{"smtp_config": {}}'),
('WhatsApp Groups', 'social_media', 'whatsapp', '{"groups": []}'),
('Print Materials', 'print', 'print', '{"print_shop": "", "formats": ["flyer", "pamphlet", "poster"]}')