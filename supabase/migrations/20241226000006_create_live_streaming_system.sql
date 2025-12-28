-- Create live streaming system tables
-- This migration creates comprehensive live streaming functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create live streams table
CREATE TABLE IF NOT EXISTS live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    stream_key TEXT NOT NULL UNIQUE,
    stream_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('khutbah', 'lecture', 'quran_recitation', 'dua', 'discussion', 'event', 'other')),
    language TEXT NOT NULL CHECK (language IN ('english', 'arabic', 'amharic', 'oromo')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'private')),
    max_viewers INTEGER,
    current_viewers INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    scheduled_start TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    duration_minutes INTEGER,
    streamer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    moderators UUID[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    recording_enabled BOOLEAN DEFAULT true,
    recording_url TEXT,
    chat_enabled BOOLEAN DEFAULT true,
    donations_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream comments table
CREATE TABLE IF NOT EXISTS stream_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    message TEXT NOT NULL,
    is_moderator BOOLEAN DEFAULT false,
    is_highlighted BOOLEAN DEFAULT false,
    reply_to UUID REFERENCES stream_comments(id),
    reactions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream donations table
CREATE TABLE IF NOT EXISTS stream_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream likes table
CREATE TABLE IF NOT EXISTS stream_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(stream_id, user_id)
);

-- Create stream followers table
CREATE TABLE IF NOT EXISTS stream_followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    streamer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(streamer_id, follower_id)
);

-- Create stream activity log table
CREATE TABLE IF NOT EXISTS stream_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream analytics table
CREATE TABLE IF NOT EXISTS stream_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    viewers_count INTEGER DEFAULT 0,
    chat_messages_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0,
    viewer_countries JSONB DEFAULT '{}',
    viewer_devices JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream recordings table
CREATE TABLE IF NOT EXISTS stream_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
    recording_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    duration_seconds INTEGER,
    quality TEXT CHECK (quality IN ('720p', '1080p', '480p', '360p')),
    format TEXT DEFAULT 'mp4',
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed', 'deleted')),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream categories table
CREATE TABLE IF NOT EXISTS stream_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stream settings table
CREATE TABLE IF NOT EXISTS stream_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    default_category TEXT DEFAULT 'other',
    default_language TEXT DEFAULT 'english',
    default_visibility TEXT DEFAULT 'public',
    auto_record BOOLEAN DEFAULT true,
    enable_chat BOOLEAN DEFAULT true,
    enable_donations BOOLEAN DEFAULT false,
    max_stream_duration_hours INTEGER DEFAULT 8,
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);
CREATE INDEX IF NOT EXISTS idx_live_streams_category ON live_streams(category);
CREATE INDEX IF NOT EXISTS idx_live_streams_language ON live_streams(language);
CREATE INDEX IF NOT EXISTS idx_live_streams_streamer_id ON live_streams(streamer_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_scheduled_start ON live_streams(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_live_streams_visibility ON live_streams(visibility);
CREATE INDEX IF NOT EXISTS idx_live_streams_created_at ON live_streams(created_at);

CREATE INDEX IF NOT EXISTS idx_stream_comments_stream_id ON stream_comments(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_comments_user_id ON stream_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_stream_comments_created_at ON stream_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_comments_reply_to ON stream_comments(reply_to);

CREATE INDEX IF NOT EXISTS idx_stream_donations_stream_id ON stream_donations(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_donations_donor_id ON stream_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_stream_donations_payment_status ON stream_donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_stream_donations_created_at ON stream_donations(created_at);

CREATE INDEX IF NOT EXISTS idx_stream_likes_stream_id ON stream_likes(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_likes_user_id ON stream_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_stream_followers_streamer_id ON stream_followers(streamer_id);
CREATE INDEX IF NOT EXISTS idx_stream_followers_follower_id ON stream_followers(follower_id);

CREATE INDEX IF NOT EXISTS idx_stream_activity_log_stream_id ON stream_activity_log(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_activity_log_user_id ON stream_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_stream_activity_log_action ON stream_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_stream_activity_log_created_at ON stream_activity_log(created_at);

CREATE INDEX IF NOT EXISTS idx_stream_analytics_stream_id ON stream_analytics(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_analytics_timestamp ON stream_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_stream_recordings_stream_id ON stream_recordings(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_recordings_status ON stream_recordings(status);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_live_streams_updated_at 
    BEFORE UPDATE ON live_streams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stream_recordings_updated_at 
    BEFORE UPDATE ON stream_recordings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stream_settings_updated_at 
    BEFORE UPDATE ON stream_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_settings ENABLE ROW LEVEL SECURITY;

-- Policies for live_streams
CREATE POLICY "Public streams are viewable by everyone" ON live_streams
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Members can view member-only streams" ON live_streams
    FOR SELECT USING (
        visibility = 'members_only' AND 
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid())
    );

CREATE POLICY "Users can view their own streams" ON live_streams
    FOR SELECT USING (auth.uid() = streamer_id);

CREATE POLICY "Users can create their own streams" ON live_streams
    FOR INSERT WITH CHECK (auth.uid() = streamer_id);

CREATE POLICY "Users can update their own streams" ON live_streams
    FOR UPDATE USING (auth.uid() = streamer_id);

CREATE POLICY "Users can delete their own streams" ON live_streams
    FOR DELETE USING (auth.uid() = streamer_id);

CREATE POLICY "Admins can manage all streams" ON live_streams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for stream_comments
CREATE POLICY "Users can view comments on accessible streams" ON stream_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND (
                live_streams.visibility = 'public' OR
                (live_streams.visibility = 'members_only' AND auth.uid() IS NOT NULL) OR
                live_streams.streamer_id = auth.uid()
            )
        )
    );

CREATE POLICY "Authenticated users can post comments" ON stream_comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND live_streams.chat_enabled = true
            AND live_streams.status = 'live'
        )
    );

CREATE POLICY "Users can update their own comments" ON stream_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON stream_comments
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Streamers and moderators can manage comments" ON stream_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND (
                live_streams.streamer_id = auth.uid() OR
                auth.uid() = ANY(live_streams.moderators)
            )
        )
    );

-- Policies for stream_donations
CREATE POLICY "Users can view donations on accessible streams" ON stream_donations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND (
                live_streams.visibility = 'public' OR
                (live_streams.visibility = 'members_only' AND auth.uid() IS NOT NULL) OR
                live_streams.streamer_id = auth.uid()
            )
        )
    );

CREATE POLICY "Authenticated users can make donations" ON stream_donations
    FOR INSERT WITH CHECK (
        (auth.uid() = donor_id OR donor_id IS NULL) AND
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND live_streams.donations_enabled = true
        )
    );

CREATE POLICY "Users can view their own donations" ON stream_donations
    FOR SELECT USING (auth.uid() = donor_id);

-- Policies for stream_likes
CREATE POLICY "Users can view likes on accessible streams" ON stream_likes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND (
                live_streams.visibility = 'public' OR
                (live_streams.visibility = 'members_only' AND auth.uid() IS NOT NULL) OR
                live_streams.streamer_id = auth.uid()
            )
        )
    );

CREATE POLICY "Authenticated users can like streams" ON stream_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own likes" ON stream_likes
    FOR ALL USING (auth.uid() = user_id);

-- Policies for stream_followers
CREATE POLICY "Users can view their own follows" ON stream_followers
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = streamer_id);

CREATE POLICY "Users can follow streamers" ON stream_followers
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can manage their own follows" ON stream_followers
    FOR ALL USING (auth.uid() = follower_id);

-- Policies for stream_activity_log
CREATE POLICY "Streamers can view their stream activity" ON stream_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND live_streams.streamer_id = auth.uid()
        )
    );

CREATE POLICY "System can log stream activity" ON stream_activity_log
    FOR INSERT WITH CHECK (true);

-- Policies for stream_analytics
CREATE POLICY "Streamers can view their stream analytics" ON stream_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND live_streams.streamer_id = auth.uid()
        )
    );

CREATE POLICY "System can insert analytics data" ON stream_analytics
    FOR INSERT WITH CHECK (true);

-- Policies for stream_recordings
CREATE POLICY "Users can view recordings of accessible streams" ON stream_recordings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND (
                live_streams.visibility = 'public' OR
                (live_streams.visibility = 'members_only' AND auth.uid() IS NOT NULL) OR
                live_streams.streamer_id = auth.uid()
            )
        )
    );

CREATE POLICY "Streamers can manage their recordings" ON stream_recordings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM live_streams 
            WHERE live_streams.id = stream_id 
            AND live_streams.streamer_id = auth.uid()
        )
    );

-- Policies for stream_categories
CREATE POLICY "Everyone can view active categories" ON stream_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON stream_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for stream_settings
CREATE POLICY "Users can manage their own stream settings" ON stream_settings
    FOR ALL USING (auth.uid() = user_id);

-- Insert default stream categories
INSERT INTO stream_categories (name, description, icon, color, sort_order) VALUES
('khutbah', 'Friday sermons and religious speeches', '🕌', '#10B981', 1),
('lecture', 'Educational Islamic lectures', '📚', '#3B82F6', 2),
('quran_recitation', 'Quran recitation and Tajweed', '📖', '#8B5CF6', 3),
('dua', 'Supplications and prayers', '🤲', '#F59E0B', 4),
('discussion', 'Islamic discussions and Q&A', '💬', '#EF4444', 5),
('event', 'Community events and gatherings', '🎉', '#06B6D4', 6),
('other', 'Other Islamic content', '📺', '#6B7280', 7)
ON CONFLICT (name) DO NOTHING;

-- Create functions for stream management
CREATE OR REPLACE FUNCTION cleanup_ended_streams()
RETURNS void AS $
BEGIN
    -- Reset viewer count for ended streams
    UPDATE live_streams 
    SET current_viewers = 0
    WHERE status = 'ended' AND current_viewers > 0;
    
    -- Auto-end streams that have been live for too long (24 hours)
    UPDATE live_streams 
    SET status = 'ended', 
        actual_end = NOW(),
        duration_minutes = EXTRACT(EPOCH FROM (NOW() - actual_start))/60
    WHERE status = 'live' 
    AND actual_start < NOW() - INTERVAL '24 hours';
END;
$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_stream_stats()
RETURNS TABLE (
    total_streams bigint,
    live_streams bigint,
    total_viewers bigint,
    total_watch_time_hours numeric,
    popular_categories json
) AS $
BEGIN
    RETURN QUERY
    WITH category_stats AS (
        SELECT 
            category,
            COUNT(*) as stream_count,
            SUM(total_views) as total_views
        FROM live_streams
        GROUP BY category
        ORDER BY stream_count DESC
        LIMIT 5
    )
    SELECT 
        (SELECT COUNT(*) FROM live_streams),
        (SELECT COUNT(*) FROM live_streams WHERE status = 'live'),
        (SELECT COALESCE(SUM(total_views), 0) FROM live_streams),
        (SELECT COALESCE(SUM(duration_minutes), 0) / 60.0 FROM live_streams WHERE duration_minutes IS NOT NULL),
        (SELECT json_agg(json_build_object('category', category, 'count', stream_count, 'views', total_views)) FROM category_stats)
    ;
END;
$ LANGUAGE plpgsql;

-- Create notification function for stream events
CREATE OR REPLACE FUNCTION notify_stream_event()
RETURNS TRIGGER AS $
BEGIN
    -- Notify followers when stream goes live
    IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'live' THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            data,
            created_at
        )
        SELECT 
            sf.follower_id,
            'Live Stream Started',
            NEW.title || ' is now live!',
            'live_stream',
            json_build_object(
                'stream_id', NEW.id,
                'streamer_id', NEW.streamer_id,
                'title', NEW.title,
                'category', NEW.category
            ),
            NOW()
        FROM stream_followers sf
        WHERE sf.streamer_id = NEW.streamer_id
        AND sf.notifications_enabled = true;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger for stream notifications
CREATE TRIGGER stream_status_notification
    AFTER UPDATE ON live_streams
    FOR EACH ROW
    EXECUTE FUNCTION notify_stream_event();

-- Create function to automatically create stream settings for new users
CREATE OR REPLACE FUNCTION create_default_stream_settings()
RETURNS TRIGGER AS $
BEGIN
    INSERT INTO stream_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger for default stream settings
CREATE TRIGGER create_user_stream_settings
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_stream_settings();

-- Create storage bucket for stream thumbnails and recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('stream-thumbnails', 'stream-thumbnails', true),
    ('stream-recordings', 'stream-recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for thumbnails
CREATE POLICY "Anyone can view stream thumbnails" ON storage.objects
    FOR SELECT USING (bucket_id = 'stream-thumbnails');

CREATE POLICY "Streamers can upload thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'stream-thumbnails' 
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Streamers can update their thumbnails" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'stream-thumbnails' 
        AND auth.uid() IS NOT NULL
    );

-- Create storage policies for recordings
CREATE POLICY "Users can view recordings they have access to" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'stream-recordings' 
        AND (
            -- Public recordings
            EXISTS (
                SELECT 1 FROM stream_recordings sr
                JOIN live_streams ls ON sr.stream_id = ls.id
                WHERE sr.recording_url LIKE '%' || name || '%'
                AND ls.visibility = 'public'
            ) OR
            -- Member recordings
            EXISTS (
                SELECT 1 FROM stream_recordings sr
                JOIN live_streams ls ON sr.stream_id = ls.id
                WHERE sr.recording_url LIKE '%' || name || '%'
                AND ls.visibility = 'members_only'
                AND auth.uid() IS NOT NULL
            ) OR
            -- Own recordings
            EXISTS (
                SELECT 1 FROM stream_recordings sr
                JOIN live_streams ls ON sr.stream_id = ls.id
                WHERE sr.recording_url LIKE '%' || name || '%'
                AND ls.streamer_id = auth.uid()
            )
        )
    );

CREATE POLICY "System can manage recordings" ON storage.objects
    FOR ALL USING (bucket_id = 'stream-recordings');

-- Create scheduled jobs for maintenance (if pg_cron is available)
-- SELECT cron.schedule('cleanup-ended-streams', '*/30 * * * *', 'SELECT cleanup_ended_streams();');

COMMENT ON TABLE live_streams IS 'Main table for live streaming sessions';
COMMENT ON TABLE stream_comments IS 'Real-time chat messages during streams';
COMMENT ON TABLE stream_donations IS 'Donations made during live streams';
COMMENT ON TABLE stream_likes IS 'User likes for streams';
COMMENT ON TABLE stream_followers IS 'Follower relationships for streamers';
COMMENT ON TABLE stream_activity_log IS 'Audit log for all stream-related activities';
COMMENT ON TABLE stream_analytics IS 'Analytics data for streams';
COMMENT ON TABLE stream_recordings IS 'Recorded versions of live streams';
COMMENT ON TABLE stream_categories IS 'Categories for organizing streams';
COMMENT ON TABLE stream_settings IS 'User preferences for streaming';