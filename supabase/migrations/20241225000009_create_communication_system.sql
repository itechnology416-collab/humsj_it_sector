-- Communication System Database Schema
-- This migration creates comprehensive tables for messaging and communication

-- Main messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('announcement', 'email', 'sms', 'notification', 'push')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('all', 'group', 'individual', 'role', 'sector')),
    recipient_criteria JSONB NOT NULL DEFAULT '{}',
    recipient_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_stats JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    template_id UUID,
    campaign_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message recipients tracking
CREATE TABLE IF NOT EXISTS message_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    user_phone VARCHAR(20),
    user_name VARCHAR(255),
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    delivery_method VARCHAR(10) NOT NULL CHECK (delivery_method IN ('email', 'sms', 'push', 'in_app')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Message templates for reusable content
CREATE TABLE IF NOT EXISTS message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('announcement', 'email', 'sms', 'notification', 'push')),
    subject_template VARCHAR(500) NOT NULL,
    content_template TEXT NOT NULL,
    html_template TEXT,
    variables TEXT[] DEFAULT '{}', -- Array of variable names like ['name', 'event_title']
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns for organized messaging
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'one_time' CHECK (type IN ('one_time', 'recurring', 'drip')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    recurrence_pattern JSONB, -- For recurring campaigns
    target_audience JSONB NOT NULL DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign messages relationship
CREATE TABLE IF NOT EXISTS campaign_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    sequence_order INTEGER DEFAULT 0,
    delay_hours INTEGER DEFAULT 0, -- For drip campaigns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, message_id)
);

-- Recipient groups for organized targeting
CREATE TABLE IF NOT EXISTS recipient_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL DEFAULT '{}',
    member_count INTEGER DEFAULT 0,
    is_dynamic BOOLEAN DEFAULT false, -- Whether membership is automatically updated
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members (for static groups)
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES recipient_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    added_by UUID REFERENCES auth.users(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    push_enabled BOOLEAN DEFAULT true,
    in_app_enabled BOOLEAN DEFAULT true,
    frequency VARCHAR(20) DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'never')),
    categories TEXT[] DEFAULT '{}', -- Which types of notifications to receive
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message delivery logs for detailed tracking
CREATE TABLE IF NOT EXISTS message_delivery_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES message_recipients(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed')),
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET
);

-- Unsubscribe tracking
CREATE TABLE IF NOT EXISTS unsubscribes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    message_type VARCHAR(20),
    reason VARCHAR(255),
    unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resubscribed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Scheduled message queue
CREATE TABLE IF NOT EXISTS message_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_scheduled ON messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_messages_sent ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_messages_tags ON messages USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_messages_campaign ON messages(campaign_id);

CREATE INDEX IF NOT EXISTS idx_message_recipients_message ON message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_user ON message_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_status ON message_recipients(delivery_status);
CREATE INDEX IF NOT EXISTS idx_message_recipients_method ON message_recipients(delivery_method);

CREATE INDEX IF NOT EXISTS idx_message_templates_type ON message_templates(type);
CREATE INDEX IF NOT EXISTS idx_message_templates_active ON message_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);

CREATE INDEX IF NOT EXISTS idx_delivery_logs_message ON message_delivery_logs(message_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_recipient ON message_delivery_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_event ON message_delivery_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_timestamp ON message_delivery_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_message_queue_scheduled ON message_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_message_queue_status ON message_queue(status);

-- Row Level Security (RLS) Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipient_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE unsubscribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_queue ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view messages they sent" ON messages
    FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (auth.uid() = sender_id);

CREATE POLICY "Admins can manage all messages" ON messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Message attachments policies
CREATE POLICY "Message attachments follow message permissions" ON message_attachments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM messages 
            WHERE messages.id = message_attachments.message_id 
            AND messages.sender_id = auth.uid()
        )
    );

-- Message recipients policies
CREATE POLICY "Users can view recipients of their messages" ON message_recipients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages 
            WHERE messages.id = message_recipients.message_id 
            AND messages.sender_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own recipient records" ON message_recipients
    FOR SELECT USING (auth.uid() = user_id);

-- Message templates policies
CREATE POLICY "Users can view active templates" ON message_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create templates" ON message_templates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON message_templates
    FOR UPDATE USING (auth.uid() = created_by);

-- Campaigns policies
CREATE POLICY "Users can view their own campaigns" ON campaigns
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create campaigns" ON campaigns
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own campaigns" ON campaigns
    FOR UPDATE USING (auth.uid() = created_by);

-- Recipient groups policies
CREATE POLICY "Users can view their own groups" ON recipient_groups
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create groups" ON recipient_groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own groups" ON recipient_groups
    FOR UPDATE USING (auth.uid() = created_by);

-- Group members policies
CREATE POLICY "Group members follow group permissions" ON group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM recipient_groups 
            WHERE recipient_groups.id = group_members.group_id 
            AND recipient_groups.created_by = auth.uid()
        )
    );

-- Notification preferences policies
CREATE POLICY "Users can manage their own preferences" ON notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Delivery logs policies
CREATE POLICY "Users can view logs for their messages" ON message_delivery_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages 
            WHERE messages.id = message_delivery_logs.message_id 
            AND messages.sender_id = auth.uid()
        )
    );

-- Unsubscribes policies
CREATE POLICY "Users can view their own unsubscribes" ON unsubscribes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own unsubscribes" ON unsubscribes
    FOR ALL USING (auth.uid() = user_id);

-- Functions for message management
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_messages_updated_at_trigger
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- Function to update template usage count
CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.template_id IS NOT NULL THEN
        UPDATE message_templates 
        SET usage_count = usage_count + 1 
        WHERE id = NEW.template_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_template_usage_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_template_usage();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE recipient_groups 
        SET member_count = member_count + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE recipient_groups 
        SET member_count = GREATEST(member_count - 1, 0) 
        WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_group_member_count_trigger
    AFTER INSERT OR DELETE ON group_members
    FOR EACH ROW
    EXECUTE FUNCTION update_group_member_count();

-- Function to process scheduled messages
CREATE OR REPLACE FUNCTION process_scheduled_messages()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    message_record RECORD;
BEGIN
    -- Get messages scheduled for now or earlier
    FOR message_record IN
        SELECT id FROM messages 
        WHERE status = 'scheduled' 
        AND scheduled_for <= NOW()
        LIMIT 100
    LOOP
        -- Update status to sending
        UPDATE messages 
        SET status = 'sending', sent_at = NOW() 
        WHERE id = message_record.id;
        
        processed_count := processed_count + 1;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get message delivery statistics
CREATE OR REPLACE FUNCTION get_message_delivery_stats(message_uuid UUID)
RETURNS TABLE(
    total_recipients INTEGER,
    sent INTEGER,
    delivered INTEGER,
    opened INTEGER,
    clicked INTEGER,
    failed INTEGER,
    bounced INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_recipients,
        COUNT(CASE WHEN delivery_status IN ('sent', 'delivered') THEN 1 END)::INTEGER as sent,
        COUNT(CASE WHEN delivery_status = 'delivered' THEN 1 END)::INTEGER as delivered,
        COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)::INTEGER as opened,
        COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::INTEGER as clicked,
        COUNT(CASE WHEN delivery_status = 'failed' THEN 1 END)::INTEGER as failed,
        COUNT(CASE WHEN delivery_status = 'bounced' THEN 1 END)::INTEGER as bounced
    FROM message_recipients
    WHERE message_id = message_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get communication statistics
CREATE OR REPLACE FUNCTION get_communication_stats(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    sender_uuid UUID DEFAULT NULL
)
RETURNS TABLE(
    total_messages INTEGER,
    total_recipients INTEGER,
    delivery_rate DECIMAL,
    open_rate DECIMAL,
    click_rate DECIMAL,
    popular_types TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT m.id)::INTEGER as total_messages,
        COUNT(DISTINCT mr.id)::INTEGER as total_recipients,
        CASE 
            WHEN COUNT(mr.id) > 0 THEN 
                ROUND(COUNT(CASE WHEN mr.delivery_status = 'delivered' THEN 1 END)::DECIMAL / COUNT(mr.id)::DECIMAL * 100, 2)
            ELSE 0
        END as delivery_rate,
        CASE 
            WHEN COUNT(mr.id) > 0 THEN 
                ROUND(COUNT(CASE WHEN mr.opened_at IS NOT NULL THEN 1 END)::DECIMAL / COUNT(mr.id)::DECIMAL * 100, 2)
            ELSE 0
        END as open_rate,
        CASE 
            WHEN COUNT(mr.id) > 0 THEN 
                ROUND(COUNT(CASE WHEN mr.clicked_at IS NOT NULL THEN 1 END)::DECIMAL / COUNT(mr.id)::DECIMAL * 100, 2)
            ELSE 0
        END as click_rate,
        ARRAY_AGG(DISTINCT m.type ORDER BY COUNT(*) DESC) as popular_types
    FROM messages m
    LEFT JOIN message_recipients mr ON m.id = mr.message_id
    WHERE 
        (start_date IS NULL OR m.created_at::DATE >= start_date) AND
        (end_date IS NULL OR m.created_at::DATE <= end_date) AND
        (sender_uuid IS NULL OR m.sender_id = sender_uuid) AND
        m.status IN ('sent', 'sending');
END;
$$ LANGUAGE plpgsql;

-- Insert default message templates
INSERT INTO message_templates (name, description, type, subject_template, content_template, variables, created_by) VALUES
('Welcome New Member', 'Welcome message for new members', 'email', 'Welcome to HUMSJ, {{name}}!', 'Assalamu Alaikum {{name}},\n\nWelcome to the Haramaya University Muslim Students Jemea (HUMSJ)! We are excited to have you join our community.\n\nBest regards,\nHUMSJ Team', ARRAY['name'], (SELECT id FROM auth.users LIMIT 1)),
('Event Reminder', 'Reminder for upcoming events', 'notification', 'Reminder: {{event_title}}', 'Don''t forget about {{event_title}} happening on {{event_date}} at {{event_time}}.\n\nLocation: {{location}}\n\nSee you there!', ARRAY['event_title', 'event_date', 'event_time', 'location'], (SELECT id FROM auth.users LIMIT 1)),
('Prayer Time Reminder', 'Daily prayer time reminders', 'sms', 'Prayer Time: {{prayer_name}}', 'Time for {{prayer_name}} prayer. May Allah accept your prayers.', ARRAY['prayer_name'], (SELECT id FROM auth.users LIMIT 1)),
('General Announcement', 'Template for general announcements', 'announcement', '{{title}}', '{{content}}', ARRAY['title', 'content'], (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert default recipient groups
INSERT INTO recipient_groups (name, description, criteria, is_dynamic, created_by) VALUES
('All Active Members', 'All active HUMSJ members', '{"active_only": true}', true, (SELECT id FROM auth.users LIMIT 1)),
('Academic Sector', 'Members of the academic sector', '{"sector": "academic"}', true, (SELECT id FROM auth.users LIMIT 1)),
('Education Sector', 'Members of the education sector', '{"sector": "education"}', true, (SELECT id FROM auth.users LIMIT 1)),
('New Members', 'Recently joined members', '{"joined_within_days": 30}', true, (SELECT id FROM auth.users LIMIT 1)),
('Coordinators', 'All sector coordinators', '{"role": "coordinator"}', true, (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE messages IS 'Main messages table for all communication types';
COMMENT ON TABLE message_recipients IS 'Tracks delivery status for each message recipient';
COMMENT ON TABLE message_templates IS 'Reusable message templates with variable substitution';
COMMENT ON TABLE campaigns IS 'Organized messaging campaigns';
COMMENT ON TABLE recipient_groups IS 'Predefined groups for message targeting';
COMMENT ON TABLE notification_preferences IS 'User preferences for different notification types';
COMMENT ON TABLE message_delivery_logs IS 'Detailed logs of message delivery events';

COMMENT ON COLUMN messages.type IS 'Type of message: announcement, email, sms, notification, push';
COMMENT ON COLUMN messages.recipient_type IS 'How recipients are selected: all, group, individual, role, sector';
COMMENT ON COLUMN messages.status IS 'Message status: draft, scheduled, sending, sent, failed, cancelled';
COMMENT ON COLUMN message_recipients.delivery_status IS 'Delivery status: pending, sent, delivered, failed, bounced';