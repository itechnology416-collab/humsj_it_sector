-- Create Islamic course enrollment system tables
-- This migration creates comprehensive course management and enrollment functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Islamic courses table
CREATE TABLE IF NOT EXISTS islamic_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('quran', 'hadith', 'fiqh', 'aqeedah', 'seerah', 'arabic', 'tajweed', 'islamic_history', 'other')),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    language TEXT NOT NULL CHECK (language IN ('english', 'arabic', 'amharic', 'oromo')),
    format TEXT NOT NULL CHECK (format IN ('online', 'in_person', 'hybrid')),
    duration_weeks INTEGER NOT NULL CHECK (duration_weeks > 0),
    hours_per_week DECIMAL(4,2) NOT NULL CHECK (hours_per_week > 0),
    max_students INTEGER CHECK (max_students > 0),
    enrolled_count INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0 CHECK (price >= 0),
    currency TEXT DEFAULT 'USD',
    is_free BOOLEAN DEFAULT false,
    prerequisites TEXT[],
    learning_outcomes TEXT[] NOT NULL,
    syllabus JSONB NOT NULL DEFAULT '[]',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    enrollment_deadline DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'enrollment_open', 'enrollment_closed', 'in_progress', 'completed', 'cancelled')),
    featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,
    certificate_offered BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    video_preview_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CHECK (start_date <= end_date),
    CHECK (enrollment_deadline <= start_date)
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'dropped', 'suspended')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'waived')),
    payment_amount DECIMAL(10,2) DEFAULT 0,
    payment_method TEXT,
    payment_reference TEXT,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completion_date TIMESTAMPTZ,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    grade TEXT,
    attendance_percentage DECIMAL(5,2) DEFAULT 0 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(course_id, student_id)
);

-- Create course progress table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_week INTEGER DEFAULT 1,
    completed_weeks INTEGER[] DEFAULT '{}',
    assignments_completed INTEGER DEFAULT 0,
    assignments_total INTEGER DEFAULT 0,
    quiz_scores JSONB DEFAULT '[]',
    attendance_sessions JSONB DEFAULT '[]',
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    study_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(enrollment_id)
);

-- Create course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    pros TEXT[],
    cons TEXT[],
    would_recommend BOOLEAN DEFAULT true,
    verified_enrollment BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(course_id, student_id)
);

-- Create course materials table
CREATE TABLE IF NOT EXISTS course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL CHECK (material_type IN ('video', 'document', 'audio', 'quiz', 'assignment', 'reading', 'link')),
    file_url TEXT,
    external_url TEXT,
    duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course assignments table
CREATE TABLE IF NOT EXISTS course_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    due_date TIMESTAMPTZ,
    max_score INTEGER DEFAULT 100,
    assignment_type TEXT NOT NULL CHECK (assignment_type IN ('essay', 'quiz', 'project', 'presentation', 'discussion', 'reflection')),
    submission_format TEXT[] DEFAULT '{"text"}',
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES course_assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_urls TEXT[],
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    score INTEGER,
    feedback TEXT,
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(assignment_id, student_id)
);

-- Create course discussions table
CREATE TABLE IF NOT EXISTS course_discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES course_discussions(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES discussion_replies(id),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_instructor BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course activity log table
CREATE TABLE IF NOT EXISTS course_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES islamic_courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course categories table
CREATE TABLE IF NOT EXISTS course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create instructor profiles table
CREATE TABLE IF NOT EXISTS instructor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    specializations TEXT[],
    qualifications TEXT[],
    experience_years INTEGER DEFAULT 0,
    bio TEXT,
    teaching_philosophy TEXT,
    languages_spoken TEXT[],
    certifications TEXT[],
    social_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_islamic_courses_instructor_id ON islamic_courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_category ON islamic_courses(category);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_level ON islamic_courses(level);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_language ON islamic_courses(language);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_status ON islamic_courses(status);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_featured ON islamic_courses(featured);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_start_date ON islamic_courses(start_date);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_enrollment_deadline ON islamic_courses(enrollment_deadline);
CREATE INDEX IF NOT EXISTS idx_islamic_courses_created_at ON islamic_courses(created_at);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_payment_status ON course_enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_enrollment_date ON course_enrollments(enrollment_date);

CREATE INDEX IF NOT EXISTS idx_course_progress_enrollment_id ON course_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_student_id ON course_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_last_activity ON course_progress(last_activity);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_student_id ON course_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_rating ON course_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_course_reviews_created_at ON course_reviews(created_at);

CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_week_number ON course_materials(week_number);
CREATE INDEX IF NOT EXISTS idx_course_materials_material_type ON course_materials(material_type);

CREATE INDEX IF NOT EXISTS idx_course_assignments_course_id ON course_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_assignments_week_number ON course_assignments(week_number);
CREATE INDEX IF NOT EXISTS idx_course_assignments_due_date ON course_assignments(due_date);

CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_enrollment_id ON assignment_submissions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);

CREATE INDEX IF NOT EXISTS idx_course_discussions_course_id ON course_discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_discussions_created_by ON course_discussions(created_by);
CREATE INDEX IF NOT EXISTS idx_course_discussions_created_at ON course_discussions(created_at);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent_reply_id ON discussion_replies(parent_reply_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_author_id ON discussion_replies(author_id);

CREATE INDEX IF NOT EXISTS idx_course_activity_log_course_id ON course_activity_log(course_id);
CREATE INDEX IF NOT EXISTS idx_course_activity_log_user_id ON course_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_course_activity_log_action ON course_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_course_activity_log_created_at ON course_activity_log(created_at);

CREATE INDEX IF NOT EXISTS idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_is_verified ON instructor_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_rating ON instructor_profiles(rating);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_islamic_courses_updated_at 
    BEFORE UPDATE ON islamic_courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at 
    BEFORE UPDATE ON course_enrollments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at 
    BEFORE UPDATE ON course_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at 
    BEFORE UPDATE ON course_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_materials_updated_at 
    BEFORE UPDATE ON course_materials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_assignments_updated_at 
    BEFORE UPDATE ON course_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_submissions_updated_at 
    BEFORE UPDATE ON assignment_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_discussions_updated_at 
    BEFORE UPDATE ON course_discussions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at 
    BEFORE UPDATE ON discussion_replies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructor_profiles_updated_at 
    BEFORE UPDATE ON instructor_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE islamic_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for islamic_courses
CREATE POLICY "Published courses are viewable by everyone" ON islamic_courses
    FOR SELECT USING (status IN ('published', 'enrollment_open', 'enrollment_closed', 'in_progress', 'completed'));

CREATE POLICY "Instructors can view their own courses" ON islamic_courses
    FOR SELECT USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create courses" ON islamic_courses
    FOR INSERT WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update their own courses" ON islamic_courses
    FOR UPDATE USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete their own courses" ON islamic_courses
    FOR DELETE USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all courses" ON islamic_courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for course_enrollments
CREATE POLICY "Students can view their own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view enrollments for their courses" ON course_enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM islamic_courses 
            WHERE islamic_courses.id = course_id 
            AND islamic_courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Students can enroll in courses" ON course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments" ON course_enrollments
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Instructors can update enrollments for their courses" ON course_enrollments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM islamic_courses 
            WHERE islamic_courses.id = course_id 
            AND islamic_courses.instructor_id = auth.uid()
        )
    );

-- Policies for course_progress
CREATE POLICY "Students can view their own progress" ON course_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view progress for their courses" ON course_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM islamic_courses 
            WHERE islamic_courses.id = course_id 
            AND islamic_courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Students can update their own progress" ON course_progress
    FOR ALL USING (auth.uid() = student_id);

-- Policies for course_reviews
CREATE POLICY "Everyone can view course reviews" ON course_reviews
    FOR SELECT USING (true);

CREATE POLICY "Enrolled students can submit reviews" ON course_reviews
    FOR INSERT WITH CHECK (
        auth.uid() = student_id AND
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_reviews.course_id 
            AND course_enrollments.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can update their own reviews" ON course_reviews
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own reviews" ON course_reviews
    FOR DELETE USING (auth.uid() = student_id);

-- Policies for course_materials
CREATE POLICY "Enrolled students can view course materials" ON course_materials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_materials.course_id 
            AND course_enrollments.student_id = auth.uid()
            AND course_enrollments.status IN ('active', 'completed')
        )
    );

CREATE POLICY "Instructors can manage materials for their courses" ON course_materials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM islamic_courses 
            WHERE islamic_courses.id = course_id 
            AND islamic_courses.instructor_id = auth.uid()
        )
    );

-- Policies for course_assignments
CREATE POLICY "Enrolled students can view course assignments" ON course_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_assignments.course_id 
            AND course_enrollments.student_id = auth.uid()
            AND course_enrollments.status IN ('active', 'completed')
        )
    );

CREATE POLICY "Instructors can manage assignments for their courses" ON course_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM islamic_courses 
            WHERE islamic_courses.id = course_id 
            AND islamic_courses.instructor_id = auth.uid()
        )
    );

-- Policies for assignment_submissions
CREATE POLICY "Students can view their own submissions" ON assignment_submissions
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view submissions for their courses" ON assignment_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_assignments ca
            JOIN islamic_courses ic ON ca.course_id = ic.id
            WHERE ca.id = assignment_id 
            AND ic.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Students can submit assignments" ON assignment_submissions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own submissions" ON assignment_submissions
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Instructors can grade submissions" ON assignment_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM course_assignments ca
            JOIN islamic_courses ic ON ca.course_id = ic.id
            WHERE ca.id = assignment_id 
            AND ic.instructor_id = auth.uid()
        )
    );

-- Policies for course_discussions
CREATE POLICY "Enrolled students can view course discussions" ON course_discussions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_discussions.course_id 
            AND course_enrollments.student_id = auth.uid()
            AND course_enrollments.status IN ('active', 'completed')
        )
    );

CREATE POLICY "Enrolled students can create discussions" ON course_discussions
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_discussions.course_id 
            AND course_enrollments.student_id = auth.uid()
            AND course_enrollments.status IN ('active', 'completed')
        )
    );

CREATE POLICY "Discussion creators can update their discussions" ON course_discussions
    FOR UPDATE USING (auth.uid() = created_by);

-- Policies for discussion_replies
CREATE POLICY "Enrolled students can view discussion replies" ON discussion_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_discussions cd
            JOIN course_enrollments ce ON cd.course_id = ce.course_id
            WHERE cd.id = discussion_id 
            AND ce.student_id = auth.uid()
            AND ce.status IN ('active', 'completed')
        )
    );

CREATE POLICY "Enrolled students can reply to discussions" ON discussion_replies
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND
        EXISTS (
            SELECT 1 FROM course_discussions cd
            JOIN course_enrollments ce ON cd.course_id = ce.course_id
            WHERE cd.id = discussion_id 
            AND ce.student_id = auth.uid()
            AND ce.status IN ('active', 'completed')
        )
    );

CREATE POLICY "Reply authors can update their replies" ON discussion_replies
    FOR UPDATE USING (auth.uid() = author_id);

-- Policies for course_activity_log
CREATE POLICY "Instructors can view activity for their courses" ON course_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM islamic_courses 
            WHERE islamic_courses.id = course_id 
            AND islamic_courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "System can log course activity" ON course_activity_log
    FOR INSERT WITH CHECK (true);

-- Policies for course_categories
CREATE POLICY "Everyone can view active categories" ON course_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON course_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for instructor_profiles
CREATE POLICY "Everyone can view instructor profiles" ON instructor_profiles
    FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their own profiles" ON instructor_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Insert default course categories
INSERT INTO course_categories (name, description, icon, color, sort_order) VALUES
('quran', 'Quran studies, recitation, and memorization', '📖', '#10B981', 1),
('hadith', 'Hadith studies and Islamic traditions', '📚', '#3B82F6', 2),
('fiqh', 'Islamic jurisprudence and law', '⚖️', '#8B5CF6', 3),
('aqeedah', 'Islamic creed and theology', '🕌', '#F59E0B', 4),
('seerah', 'Biography of Prophet Muhammad (PBUH)', '👤', '#EF4444', 5),
('arabic', 'Arabic language learning', '🔤', '#06B6D4', 6),
('tajweed', 'Quran recitation rules', '🎵', '#84CC16', 7),
('islamic_history', 'Islamic history and civilization', '🏛️', '#F97316', 8),
('other', 'Other Islamic studies', '📋', '#6B7280', 9)
ON CONFLICT (name) DO NOTHING;

-- Create functions for course management
CREATE OR REPLACE FUNCTION update_enrollment_count()
RETURNS TRIGGER AS $
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE islamic_courses 
        SET enrolled_count = enrolled_count + 1
        WHERE id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE islamic_courses 
        SET enrolled_count = GREATEST(enrolled_count - 1, 0)
        WHERE id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$ LANGUAGE plpgsql;

-- Create trigger for enrollment count
CREATE TRIGGER update_course_enrollment_count
    AFTER INSERT OR DELETE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_enrollment_count();

CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM course_reviews 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);
    
    UPDATE islamic_courses 
    SET rating = COALESCE(avg_rating, 0),
        reviews_count = review_count
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;

-- Create trigger for course rating updates
CREATE TRIGGER update_course_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_course_rating();

CREATE OR REPLACE FUNCTION get_course_stats()
RETURNS TABLE (
    total_courses bigint,
    active_courses bigint,
    total_enrollments bigint,
    completion_rate numeric,
    popular_categories json,
    revenue_total numeric
) AS $
BEGIN
    RETURN QUERY
    WITH category_stats AS (
        SELECT 
            category,
            COUNT(*) as course_count
        FROM islamic_courses
        WHERE status IN ('published', 'enrollment_open', 'in_progress')
        GROUP BY category
        ORDER BY course_count DESC
        LIMIT 5
    ),
    enrollment_stats AS (
        SELECT 
            COUNT(*) as total_enroll,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_enroll
        FROM course_enrollments
    ),
    revenue_stats AS (
        SELECT 
            COALESCE(SUM(payment_amount), 0) as total_revenue
        FROM course_enrollments
        WHERE payment_status = 'paid'
    )
    SELECT 
        (SELECT COUNT(*) FROM islamic_courses),
        (SELECT COUNT(*) FROM islamic_courses WHERE status IN ('enrollment_open', 'in_progress')),
        es.total_enroll,
        CASE 
            WHEN es.total_enroll > 0 THEN 
                ROUND((es.completed_enroll::numeric / es.total_enroll) * 100, 2)
            ELSE 0 
        END,
        (SELECT json_agg(json_build_object('category', category, 'count', course_count)) FROM category_stats),
        rs.total_revenue
    FROM enrollment_stats es
    CROSS JOIN revenue_stats rs;
END;
$ LANGUAGE plpgsql;

-- Create notification function for course events
CREATE OR REPLACE FUNCTION notify_course_event()
RETURNS TRIGGER AS $
BEGIN
    -- Notify students when enrollment status changes
    IF TG_TABLE_NAME = 'course_enrollments' AND OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            data,
            created_at
        ) VALUES (
            NEW.student_id,
            'Enrollment Status Updated',
            CASE NEW.status
                WHEN 'approved' THEN 'Your course enrollment has been approved!'
                WHEN 'rejected' THEN 'Your course enrollment has been rejected.'
                WHEN 'completed' THEN 'Congratulations! You have completed the course.'
                ELSE 'Your enrollment status has been updated to: ' || NEW.status
            END,
            'course_enrollment',
            json_build_object(
                'course_id', NEW.course_id,
                'enrollment_id', NEW.id,
                'status', NEW.status
            ),
            NOW()
        );
    END IF;
    
    -- Notify when course status changes
    IF TG_TABLE_NAME = 'islamic_courses' AND OLD.status IS DISTINCT FROM NEW.status THEN
        -- Notify enrolled students
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            data,
            created_at
        )
        SELECT 
            ce.student_id,
            'Course Status Updated',
            CASE NEW.status
                WHEN 'in_progress' THEN NEW.title || ' has started!'
                WHEN 'completed' THEN NEW.title || ' has been completed.'
                WHEN 'cancelled' THEN NEW.title || ' has been cancelled.'
                ELSE NEW.title || ' status updated to: ' || NEW.status
            END,
            'course_update',
            json_build_object(
                'course_id', NEW.id,
                'status', NEW.status,
                'title', NEW.title
            ),
            NOW()
        FROM course_enrollments ce
        WHERE ce.course_id = NEW.id
        AND ce.status IN ('active', 'approved');
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create triggers for course notifications
CREATE TRIGGER course_enrollment_notification
    AFTER UPDATE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION notify_course_event();

CREATE TRIGGER course_status_notification
    AFTER UPDATE ON islamic_courses
    FOR EACH ROW
    EXECUTE FUNCTION notify_course_event();

-- Create function to automatically create instructor profile for new users
CREATE OR REPLACE FUNCTION create_instructor_profile()
RETURNS TRIGGER AS $
BEGIN
    -- Only create instructor profile for users with instructor role
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = NEW.id 
        AND profiles.role IN ('instructor', 'admin', 'super_admin')
    ) THEN
        INSERT INTO instructor_profiles (user_id)
        VALUES (NEW.id)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger for instructor profile creation
CREATE TRIGGER create_instructor_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_instructor_profile();

-- Create storage buckets for course content
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('course-thumbnails', 'course-thumbnails', true),
    ('course-materials', 'course-materials', false),
    ('assignment-submissions', 'assignment-submissions', false),
    ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view course thumbnails" ON storage.objects
    FOR SELECT USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Instructors can upload course thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'course-thumbnails' 
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Enrolled students can view course materials" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'course-materials' 
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Instructors can manage course materials" ON storage.objects
    FOR ALL USING (
        bucket_id = 'course-materials' 
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Students can upload assignment submissions" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'assignment-submissions' 
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Students can view their own submissions" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'assignment-submissions' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own certificates" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'certificates' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

COMMENT ON TABLE islamic_courses IS 'Islamic courses offered by the community';
COMMENT ON TABLE course_enrollments IS 'Student enrollments in Islamic courses';
COMMENT ON TABLE course_progress IS 'Student progress tracking for courses';
COMMENT ON TABLE course_reviews IS 'Student reviews and ratings for courses';
COMMENT ON TABLE course_materials IS 'Learning materials for each course week';
COMMENT ON TABLE course_assignments IS 'Assignments and assessments for courses';
COMMENT ON TABLE assignment_submissions IS 'Student submissions for assignments';
COMMENT ON TABLE course_discussions IS 'Discussion forums for each course';
COMMENT ON TABLE discussion_replies IS 'Replies to course discussions';
COMMENT ON TABLE course_activity_log IS 'Audit log for all course-related activities';
COMMENT ON TABLE course_categories IS 'Categories for organizing courses';
COMMENT ON TABLE instructor_profiles IS 'Extended profiles for course instructors';