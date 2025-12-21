-- Enhanced Member Management Database Schema
-- This migration adds additional features for comprehensive member management

-- Add additional fields to profiles table for enhanced member management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages_spoken TEXT[]; -- Array of languages
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[]; -- Array of skills
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[]; -- Array of interests
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_alumni BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alumni_graduation_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_job_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_employer TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS membership_start_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS membership_end_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notes TEXT; -- Admin notes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tags TEXT[]; -- Admin tags for categorization

-- Create member activity log table
CREATE TABLE IF NOT EXISTS public.member_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'login', 'logout', 'profile_update', 'event_registration', 'event_attendance',
        'volunteer_signup', 'volunteer_completion', 'content_creation', 'content_interaction',
        'role_change', 'status_change', 'invitation_sent', 'invitation_accepted'
    )),
    activity_description TEXT,
    metadata JSONB, -- Additional activity data
    ip_address INET,
    user_agent TEXT,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Who performed the action (for admin actions)
);

-- Create indexes for member activity log
CREATE INDEX IF NOT EXISTS idx_member_activity_log_member_id ON public.member_activity_log(member_id);
CREATE INDEX IF NOT EXISTS idx_member_activity_log_activity_type ON public.member_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_member_activity_log_created_at ON public.member_activity_log(created_at);

-- Create member documents table for storing certificates, IDs, etc.
CREATE TABLE IF NOT EXISTS public.member_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN (
        'id_card', 'student_id', 'certificate', 'transcript', 'cv', 'photo', 'other'
    )),
    document_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create indexes for member documents
CREATE INDEX IF NOT EXISTS idx_member_documents_member_id ON public.member_documents(member_id);
CREATE INDEX IF NOT EXISTS idx_member_documents_document_type ON public.member_documents(document_type);

-- Create member achievements table
CREATE TABLE IF NOT EXISTS public.member_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN (
        'volunteer_hours', 'event_attendance', 'project_completion', 'leadership',
        'academic', 'skill_certification', 'community_service', 'other'
    )),
    title TEXT NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0,
    badge_icon TEXT,
    badge_color TEXT,
    awarded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE
);

-- Create indexes for member achievements
CREATE INDEX IF NOT EXISTS idx_member_achievements_member_id ON public.member_achievements(member_id);
CREATE INDEX IF NOT EXISTS idx_member_achievements_achievement_type ON public.member_achievements(achievement_type);

-- Create member statistics view
CREATE OR REPLACE VIEW public.member_statistics AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.status,
    p.created_at as join_date,
    p.last_activity_date,
    -- Activity counts
    COALESCE(activity_stats.total_activities, 0) as total_activities,
    COALESCE(activity_stats.login_count, 0) as login_count,
    COALESCE(activity_stats.last_login, NULL) as last_login,
    -- Achievement counts
    COALESCE(achievement_stats.total_achievements, 0) as total_achievements,
    COALESCE(achievement_stats.total_points, 0) as total_points,
    -- Document counts
    COALESCE(document_stats.total_documents, 0) as total_documents,
    COALESCE(document_stats.verified_documents, 0) as verified_documents,
    -- Engagement score (calculated based on various factors)
    CASE 
        WHEN p.last_activity_date > (NOW() - INTERVAL '7 days') THEN 100
        WHEN p.last_activity_date > (NOW() - INTERVAL '30 days') THEN 75
        WHEN p.last_activity_date > (NOW() - INTERVAL '90 days') THEN 50
        WHEN p.last_activity_date > (NOW() - INTERVAL '180 days') THEN 25
        ELSE 0
    END + 
    COALESCE(activity_stats.total_activities, 0) * 2 + 
    COALESCE(achievement_stats.total_points, 0) as engagement_score
FROM public.profiles p
LEFT JOIN (
    SELECT 
        member_id,
        COUNT(*) as total_activities,
        COUNT(CASE WHEN activity_type = 'login' THEN 1 END) as login_count,
        MAX(CASE WHEN activity_type = 'login' THEN created_at END) as last_login
    FROM public.member_activity_log
    GROUP BY member_id
) activity_stats ON p.id = activity_stats.member_id
LEFT JOIN (
    SELECT 
        member_id,
        COUNT(*) as total_achievements,
        SUM(points) as total_points
    FROM public.member_achievements
    GROUP BY member_id
) achievement_stats ON p.id = achievement_stats.member_id
LEFT JOIN (
    SELECT 
        member_id,
        COUNT(*) as total_documents,
        COUNT(CASE WHEN is_verified THEN 1 END) as verified_documents
    FROM public.member_documents
    GROUP BY member_id
) document_stats ON p.id = document_stats.member_id;

-- Enhanced function to get members with comprehensive data
CREATE OR REPLACE FUNCTION public.get_members_comprehensive(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_status TEXT DEFAULT NULL,
    p_college TEXT DEFAULT NULL,
    p_role TEXT DEFAULT NULL,
    p_search TEXT DEFAULT NULL,
    p_sort_by TEXT DEFAULT 'created_at',
    p_sort_order TEXT DEFAULT 'DESC'
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
    user_role TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_activity_date TIMESTAMPTZ,
    total_activities BIGINT,
    total_achievements BIGINT,
    total_points BIGINT,
    engagement_score BIGINT,
    tags TEXT[],
    is_alumni BOOLEAN,
    membership_start_date DATE,
    skills TEXT[],
    languages_spoken TEXT[]
) AS $
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'it_head', 'sys_admin')
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    RETURN QUERY
    EXECUTE format('
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
            ur.role as user_role,
            p.created_at,
            p.updated_at,
            p.last_activity_date,
            ms.total_activities,
            ms.total_achievements,
            ms.total_points,
            ms.engagement_score,
            p.tags,
            p.is_alumni,
            p.membership_start_date,
            p.skills,
            p.languages_spoken
        FROM public.profiles p
        LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
        LEFT JOIN public.member_statistics ms ON p.id = ms.id
        WHERE 1=1
        %s %s %s %s
        ORDER BY %I %s
        LIMIT %s OFFSET %s
    ',
    CASE WHEN p_status IS NOT NULL THEN format('AND p.status = %L', p_status) ELSE '' END,
    CASE WHEN p_college IS NOT NULL THEN format('AND p.college = %L', p_college) ELSE '' END,
    CASE WHEN p_role IS NOT NULL THEN format('AND ur.role = %L', p_role) ELSE '' END,
    CASE WHEN p_search IS NOT NULL THEN format('AND (p.full_name ILIKE %L OR p.email ILIKE %L OR p.department ILIKE %L)', 
        '%' || p_search || '%', '%' || p_search || '%', '%' || p_search || '%') ELSE '' END,
    p_sort_by,
    p_sort_order,
    p_limit,
    p_offset
    );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log member activity
CREATE OR REPLACE FUNCTION public.log_member_activity(
    p_member_id UUID,
    p_activity_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.member_activity_log (
        member_id, activity_type, activity_description, metadata, ip_address, user_agent
    ) VALUES (
        p_member_id, p_activity_type, p_description, p_metadata, 
        inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent'
    ) RETURNING id INTO activity_id;
    
    -- Update last activity date
    UPDATE public.profiles 
    SET last_activity_date = NOW() 
    WHERE id = p_member_id;
    
    RETURN activity_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievement to member
CREATE OR REPLACE FUNCTION public.award_member_achievement(
    p_member_id UUID,
    p_achievement_type TEXT,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_points INTEGER DEFAULT 0,
    p_badge_icon TEXT DEFAULT NULL,
    p_badge_color TEXT DEFAULT NULL
)
RETURNS UUID AS $
DECLARE
    achievement_id UUID;
BEGIN
    -- Check if user is admin or the member themselves
    IF NOT (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = p_member_id AND user_id = auth.uid()
        )
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    INSERT INTO public.member_achievements (
        member_id, achievement_type, title, description, points, 
        badge_icon, badge_color, awarded_by
    ) VALUES (
        p_member_id, p_achievement_type, p_title, p_description, p_points,
        p_badge_icon, p_badge_color, auth.uid()
    ) RETURNING id INTO achievement_id;
    
    -- Log the achievement
    PERFORM public.log_member_activity(
        p_member_id, 
        'achievement_awarded', 
        format('Achievement awarded: %s', p_title),
        jsonb_build_object('achievement_id', achievement_id, 'points', p_points)
    );
    
    RETURN achievement_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced member statistics function
CREATE OR REPLACE FUNCTION public.get_enhanced_member_statistics()
RETURNS JSON AS $
DECLARE
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'it_head', 'sys_admin')
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    SELECT json_build_object(
        'totalMembers', (SELECT COUNT(*) FROM public.profiles),
        'activeMembers', (SELECT COUNT(*) FROM public.profiles WHERE status = 'active'),
        'inactiveMembers', (SELECT COUNT(*) FROM public.profiles WHERE status = 'inactive'),
        'alumniMembers', (SELECT COUNT(*) FROM public.profiles WHERE is_alumni = true),
        'pendingInvitations', (SELECT COUNT(*) FROM public.member_invitations WHERE status = 'invited'),
        'pendingRequests', (SELECT COUNT(*) FROM public.member_invitations WHERE status = 'pending'),
        'recentJoins', (SELECT COUNT(*) FROM public.profiles WHERE created_at > NOW() - INTERVAL '7 days'),
        'activeThisWeek', (SELECT COUNT(*) FROM public.profiles WHERE last_activity_date > NOW() - INTERVAL '7 days'),
        'activeThisMonth', (SELECT COUNT(*) FROM public.profiles WHERE last_activity_date > NOW() - INTERVAL '30 days'),
        'totalActivities', (SELECT COUNT(*) FROM public.member_activity_log),
        'totalAchievements', (SELECT COUNT(*) FROM public.member_achievements),
        'totalDocuments', (SELECT COUNT(*) FROM public.member_documents),
        'verifiedDocuments', (SELECT COUNT(*) FROM public.member_documents WHERE is_verified = true),
        'collegeDistribution', (
            SELECT json_object_agg(college, count)
            FROM (
                SELECT college, COUNT(*) as count
                FROM public.profiles
                WHERE college IS NOT NULL
                GROUP BY college
            ) college_stats
        ),
        'roleDistribution', (
            SELECT json_object_agg(role, count)
            FROM (
                SELECT COALESCE(ur.role, 'member') as role, COUNT(*) as count
                FROM public.profiles p
                LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
                GROUP BY ur.role
            ) role_stats
        ),
        'statusDistribution', (
            SELECT json_object_agg(status, count)
            FROM (
                SELECT status, COUNT(*) as count
                FROM public.profiles
                GROUP BY status
            ) status_stats
        ),
        'engagementLevels', (
            SELECT json_build_object(
                'high', COUNT(CASE WHEN engagement_score >= 75 THEN 1 END),
                'medium', COUNT(CASE WHEN engagement_score >= 25 AND engagement_score < 75 THEN 1 END),
                'low', COUNT(CASE WHEN engagement_score < 25 THEN 1 END)
            )
            FROM public.member_statistics
        )
    ) INTO result;
    
    RETURN result;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE public.member_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_activity_log
CREATE POLICY "Admins can view all activity logs" ON public.member_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Members can view their own activity logs" ON public.member_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = member_activity_log.member_id AND user_id = auth.uid()
        )
    );

-- RLS Policies for member_documents
CREATE POLICY "Admins can manage all documents" ON public.member_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Members can manage their own documents" ON public.member_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = member_documents.member_id AND user_id = auth.uid()
        )
    );

-- RLS Policies for member_achievements
CREATE POLICY "Everyone can view public achievements" ON public.member_achievements
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all achievements" ON public.member_achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Members can view their own achievements" ON public.member_achievements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = member_achievements.member_id AND user_id = auth.uid()
        )
    );

-- Grant permissions
GRANT ALL ON public.member_activity_log TO authenticated;
GRANT ALL ON public.member_documents TO authenticated;
GRANT ALL ON public.member_achievements TO authenticated;
GRANT SELECT ON public.member_statistics TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_members_comprehensive(INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_member_activity(UUID, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_member_achievement(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_enhanced_member_statistics() TO authenticated;

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_member_documents_updated_at
    BEFORE UPDATE ON public.member_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically log profile updates
CREATE OR REPLACE FUNCTION public.log_profile_update()
RETURNS TRIGGER AS $
BEGIN
    -- Only log if this is an actual update (not insert)
    IF TG_OP = 'UPDATE' THEN
        PERFORM public.log_member_activity(
            NEW.id,
            'profile_update',
            'Profile information updated',
            jsonb_build_object(
                'updated_fields', (
                    SELECT array_agg(key)
                    FROM jsonb_each_text(to_jsonb(NEW)) new_data
                    JOIN jsonb_each_text(to_jsonb(OLD)) old_data ON new_data.key = old_data.key
                    WHERE new_data.value IS DISTINCT FROM old_data.value
                )
            )
        );
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger for profile updates
CREATE TRIGGER log_profile_updates
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.log_profile_update();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity_date ON public.profiles(last_activity_date);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_start_date ON public.profiles(membership_start_date);
CREATE INDEX IF NOT EXISTS idx_profiles_is_alumni ON public.profiles(is_alumni);
CREATE INDEX IF NOT EXISTS idx_profiles_tags ON public.profiles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_languages_spoken ON public.profiles USING GIN(languages_spoken);