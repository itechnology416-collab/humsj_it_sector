-- Comprehensive Database Integration for All Admin and User Dashboard Pages
-- This migration creates all necessary tables and functions for complete system integration

-- =====================================================
-- VOLUNTEER MANAGEMENT SYSTEM
-- =====================================================

-- Create volunteer tasks table
CREATE TABLE IF NOT EXISTS public.volunteer_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Task details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
    
    -- Requirements
    required_skills TEXT[],
    estimated_hours INTEGER NOT NULL DEFAULT 1,
    max_volunteers INTEGER NOT NULL DEFAULT 1,
    location TEXT NOT NULL,
    
    -- Scheduling
    deadline TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Management
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to UUID[] DEFAULT '{}', -- Array of user IDs
    
    -- Metadata
    tags TEXT[],
    notes TEXT
);

-- Create volunteer applications table
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    task_id UUID REFERENCES public.volunteer_tasks(id) ON DELETE CASCADE NOT NULL,
    volunteer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    application_message TEXT,
    admin_notes TEXT,
    
    -- Tracking
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    hours_logged INTEGER DEFAULT 0,
    
    UNIQUE(task_id, volunteer_id)
);

-- =====================================================
-- COMMITTEE MANAGEMENT SYSTEM
-- =====================================================

-- Create committees table
CREATE TABLE IF NOT EXISTS public.committees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Committee details
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('executive', 'operational', 'advisory')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'forming')),
    
    -- Leadership
    chairperson_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Scheduling
    meeting_schedule TEXT,
    established_date DATE NOT NULL DEFAULT CURRENT_DATE,
    term_start_date DATE,
    term_end_date DATE,
    
    -- Responsibilities
    responsibilities TEXT[],
    
    -- Metadata
    notes TEXT
);

-- Create committee members table
CREATE TABLE IF NOT EXISTS public.committee_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE NOT NULL,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    
    -- Contact info
    email TEXT,
    phone TEXT,
    
    UNIQUE(committee_id, member_id)
);

-- =====================================================
-- DIGITAL DAWA CONTENT SYSTEM
-- =====================================================

-- Create dawa content table (extends content_items)
CREATE TABLE IF NOT EXISTS public.dawa_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Content details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'infographic')),
    
    -- Status and workflow
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'scheduled')),
    
    -- Author and approval
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Content metadata
    category TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'English',
    tags TEXT[],
    
    -- File information
    file_url TEXT,
    thumbnail_url TEXT,
    file_size INTEGER,
    duration INTEGER, -- For video/audio content
    
    -- Engagement
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- WEBSITE CONTENT MANAGEMENT
-- =====================================================

-- Create website pages table
CREATE TABLE IF NOT EXISTS public.website_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Page details
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    
    -- Page type and status
    page_type TEXT NOT NULL CHECK (page_type IN ('page', 'article', 'section', 'media')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'review', 'archived')),
    
    -- Multilingual support
    language TEXT NOT NULL DEFAULT 'English',
    parent_page_id UUID REFERENCES public.website_pages(id) ON DELETE SET NULL, -- For translations
    
    -- Author and management
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- SEO and metadata
    meta_title TEXT,
    meta_description TEXT,
    featured_image_url TEXT,
    
    -- Publishing
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Analytics
    views INTEGER DEFAULT 0,
    
    -- Categories and tags
    category TEXT,
    tags TEXT[]
);

-- =====================================================
-- ROLE MANAGEMENT SYSTEM
-- =====================================================

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    resource TEXT NOT NULL, -- What resource this permission applies to
    action TEXT NOT NULL -- What action is allowed (create, read, update, delete, etc.)
);

-- Create role permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    role user_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
    
    UNIQUE(role, permission_id)
);

-- =====================================================
-- SYSTEM MONITORING AND LOGS
-- =====================================================

-- Create system logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Log details
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
    message TEXT NOT NULL,
    category TEXT NOT NULL,
    
    -- Context
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    
    -- Additional data
    metadata JSONB,
    
    -- System info
    service_name TEXT DEFAULT 'webapp',
    environment TEXT DEFAULT 'production'
);

-- Create system health metrics table
CREATE TABLE IF NOT EXISTS public.system_health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Service information
    service_name TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL,
    metric_unit TEXT,
    
    -- Status
    status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'outage')),
    
    -- Additional data
    metadata JSONB
);

-- =====================================================
-- NEWS AND ANNOUNCEMENTS
-- =====================================================

-- Create news articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Article details
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Author and management
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    
    -- Publishing
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    
    -- Categorization
    category TEXT NOT NULL,
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    
    -- Media
    featured_image_url TEXT,
    
    -- Engagement
    views INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    
    -- Language support
    language TEXT NOT NULL DEFAULT 'English'
);

-- =====================================================
-- COURSES AND EDUCATION
-- =====================================================

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Course details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    
    -- Instructor
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    instructor_name TEXT NOT NULL, -- Denormalized for display
    
    -- Course structure
    duration TEXT NOT NULL, -- e.g., "8 weeks"
    lessons INTEGER NOT NULL DEFAULT 1,
    estimated_hours INTEGER,
    
    -- Scheduling
    start_date DATE,
    end_date DATE,
    schedule TEXT, -- e.g., "Tuesdays & Thursdays, 7:00 PM"
    
    -- Enrollment
    max_students INTEGER,
    current_students INTEGER DEFAULT 0,
    price TEXT NOT NULL DEFAULT 'Free', -- Can be "Free" or "$99"
    
    -- Requirements
    prerequisites TEXT[],
    required_materials TEXT[],
    
    -- Features and benefits
    features TEXT[],
    learning_outcomes TEXT[],
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'full')),
    
    -- Media
    thumbnail_url TEXT,
    
    -- Ratings
    rating DECIMAL(2,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    
    -- Language
    language TEXT NOT NULL DEFAULT 'English'
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Enrollment details
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'suspended')),
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    lessons_completed INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    
    -- Completion
    completed_at TIMESTAMP WITH TIME ZONE,
    certificate_issued BOOLEAN DEFAULT FALSE,
    
    -- Rating
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    UNIQUE(course_id, student_id)
);

-- =====================================================
-- FAQ SYSTEM
-- =====================================================

-- Create FAQ items table
CREATE TABLE IF NOT EXISTS public.faq_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- FAQ content
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    
    -- Management
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    
    -- Ordering and popularity
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    
    -- Language support
    language TEXT NOT NULL DEFAULT 'English',
    
    -- Tags for better organization
    tags TEXT[]
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Volunteer system indexes
CREATE INDEX IF NOT EXISTS idx_volunteer_tasks_status ON public.volunteer_tasks(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_tasks_category ON public.volunteer_tasks(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_tasks_created_by ON public.volunteer_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_task_id ON public.volunteer_applications(task_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_volunteer_id ON public.volunteer_applications(volunteer_id);

-- Committee system indexes
CREATE INDEX IF NOT EXISTS idx_committees_type ON public.committees(type);
CREATE INDEX IF NOT EXISTS idx_committees_status ON public.committees(status);
CREATE INDEX IF NOT EXISTS idx_committee_members_committee_id ON public.committee_members(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_members_member_id ON public.committee_members(member_id);

-- Content system indexes
CREATE INDEX IF NOT EXISTS idx_dawa_content_status ON public.dawa_content(status);
CREATE INDEX IF NOT EXISTS idx_dawa_content_category ON public.dawa_content(category);
CREATE INDEX IF NOT EXISTS idx_dawa_content_author_id ON public.dawa_content(author_id);
CREATE INDEX IF NOT EXISTS idx_website_pages_status ON public.website_pages(status);
CREATE INDEX IF NOT EXISTS idx_website_pages_language ON public.website_pages(language);
CREATE INDEX IF NOT EXISTS idx_website_pages_slug ON public.website_pages(slug);

-- News system indexes
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_pinned ON public.news_articles(is_pinned);

-- Course system indexes
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON public.course_enrollments(student_id);

-- System indexes
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON public.system_logs(category);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_health_metrics_service_name ON public.system_health_metrics(service_name);

-- FAQ indexes
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON public.faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_items_status ON public.faq_items(status);
CREATE INDEX IF NOT EXISTS idx_faq_items_sort_order ON public.faq_items(sort_order);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dawa_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Volunteer system policies
CREATE POLICY "Admins can manage volunteer tasks" ON public.volunteer_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can view published volunteer tasks" ON public.volunteer_tasks
    FOR SELECT USING (status IN ('open', 'assigned'));

CREATE POLICY "Users can manage their own applications" ON public.volunteer_applications
    FOR ALL USING (volunteer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Committee system policies
CREATE POLICY "Admins can manage committees" ON public.committees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can view active committees" ON public.committees
    FOR SELECT USING (status = 'active');

-- Content system policies
CREATE POLICY "Admins can manage all content" ON public.dawa_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Authors can manage their own content" ON public.dawa_content
    FOR ALL USING (author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view approved content" ON public.dawa_content
    FOR SELECT USING (status = 'approved');

-- Website pages policies
CREATE POLICY "Admins can manage website pages" ON public.website_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can view published pages" ON public.website_pages
    FOR SELECT USING (status = 'published');

-- News policies
CREATE POLICY "Admins can manage news" ON public.news_articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can view published news" ON public.news_articles
    FOR SELECT USING (status = 'published');

-- Course policies
CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Instructors can manage their courses" ON public.courses
    FOR ALL USING (instructor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view published courses" ON public.courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their enrollments" ON public.course_enrollments
    FOR ALL USING (student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- FAQ policies
CREATE POLICY "Admins can manage FAQ" ON public.faq_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can view published FAQ" ON public.faq_items
    FOR SELECT USING (status = 'published');

-- System monitoring policies (admin only)
CREATE POLICY "Admins can view system logs" ON public.system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Admins can view system metrics" ON public.system_health_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE TRIGGER handle_volunteer_tasks_updated_at
    BEFORE UPDATE ON public.volunteer_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_volunteer_applications_updated_at
    BEFORE UPDATE ON public.volunteer_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_committees_updated_at
    BEFORE UPDATE ON public.committees
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_committee_members_updated_at
    BEFORE UPDATE ON public.committee_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_dawa_content_updated_at
    BEFORE UPDATE ON public.dawa_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_website_pages_updated_at
    BEFORE UPDATE ON public.website_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_news_articles_updated_at
    BEFORE UPDATE ON public.news_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_course_enrollments_updated_at
    BEFORE UPDATE ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_faq_items_updated_at
    BEFORE UPDATE ON public.faq_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON public.volunteer_tasks TO authenticated;
GRANT ALL ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.committees TO authenticated;
GRANT ALL ON public.committee_members TO authenticated;
GRANT ALL ON public.dawa_content TO authenticated;
GRANT ALL ON public.website_pages TO authenticated;
GRANT ALL ON public.permissions TO authenticated;
GRANT ALL ON public.role_permissions TO authenticated;
GRANT ALL ON public.system_logs TO authenticated;
GRANT ALL ON public.system_health_metrics TO authenticated;
GRANT ALL ON public.news_articles TO authenticated;
GRANT ALL ON public.courses TO authenticated;
GRANT ALL ON public.course_enrollments TO authenticated;
GRANT ALL ON public.faq_items TO authenticated;

-- Grant permissions to service role
GRANT ALL ON public.volunteer_tasks TO service_role;
GRANT ALL ON public.volunteer_applications TO service_role;
GRANT ALL ON public.committees TO service_role;
GRANT ALL ON public.committee_members TO service_role;
GRANT ALL ON public.dawa_content TO service_role;
GRANT ALL ON public.website_pages TO service_role;
GRANT ALL ON public.permissions TO service_role;
GRANT ALL ON public.role_permissions TO service_role;
GRANT ALL ON public.system_logs TO service_role;
GRANT ALL ON public.system_health_metrics TO service_role;
GRANT ALL ON public.news_articles TO service_role;
GRANT ALL ON public.courses TO service_role;
GRANT ALL ON public.course_enrollments TO service_role;
GRANT ALL ON public.faq_items TO service_role;