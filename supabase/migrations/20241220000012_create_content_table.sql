-- Create content items table for content management
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'audio', 'image', 'presentation', 'book', 'article')),
    category TEXT NOT NULL CHECK (category IN ('islamic_studies', 'technology', 'academic', 'events', 'announcements', 'resources', 'tutorials')),
    description TEXT,
    content TEXT, -- For text-based content
    file_url TEXT,
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- For video/audio content in seconds
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    tags TEXT[], -- Array of tags for better categorization
    language TEXT DEFAULT 'en',
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    access_level TEXT DEFAULT 'public' CHECK (access_level IN ('public', 'members', 'admins', 'restricted')),
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create content views table for tracking
CREATE TABLE IF NOT EXISTS public.content_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    view_duration INTEGER, -- Time spent viewing in seconds
    completed BOOLEAN DEFAULT false -- Whether the content was fully consumed
);

-- Create content likes table
CREATE TABLE IF NOT EXISTS public.content_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(content_id, user_id)
);

-- Create content comments table
CREATE TABLE IF NOT EXISTS public.content_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.content_comments(id) ON DELETE CASCADE, -- For nested comments
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create content categories table for better organization
CREATE TABLE IF NOT EXISTS public.content_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    parent_id UUID REFERENCES public.content_categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON public.content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_items_uploaded_by ON public.content_items(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_content_items_is_featured ON public.content_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_content_items_is_public ON public.content_items(is_public);
CREATE INDEX IF NOT EXISTS idx_content_items_access_level ON public.content_items(access_level);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON public.content_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON public.content_items(created_at);
CREATE INDEX IF NOT EXISTS idx_content_views_content_id ON public.content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user_id ON public.content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_content_id ON public.content_likes(content_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_user_id ON public.content_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_content_id ON public.content_comments(content_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_user_id ON public.content_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_parent_id ON public.content_comments(parent_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content items
CREATE POLICY "Anyone can view public content" ON public.content_items
    FOR SELECT USING (is_public = true AND access_level = 'public');

CREATE POLICY "Members can view member content" ON public.content_items
    FOR SELECT USING (
        access_level IN ('public', 'members') AND (
            is_public = true OR 
            auth.uid() IS NOT NULL
        )
    );

CREATE POLICY "Admins can view all content" ON public.content_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Admins can manage all content" ON public.content_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Content creators can manage their content" ON public.content_items
    FOR ALL USING (uploaded_by = auth.uid());

-- RLS Policies for content views
CREATE POLICY "Users can create their own views" ON public.content_views
    FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all content views" ON public.content_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- RLS Policies for content likes
CREATE POLICY "Users can manage their own likes" ON public.content_likes
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Anyone can view likes count" ON public.content_likes
    FOR SELECT USING (true);

-- RLS Policies for content comments
CREATE POLICY "Anyone can view approved comments" ON public.content_comments
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create comments" ON public.content_comments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own comments" ON public.content_comments
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all comments" ON public.content_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- RLS Policies for content categories
CREATE POLICY "Anyone can view active categories" ON public.content_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.content_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER handle_content_items_updated_at
    BEFORE UPDATE ON public.content_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_content_comments_updated_at
    BEFORE UPDATE ON public.content_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update content statistics
CREATE OR REPLACE FUNCTION public.update_content_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'content_views' THEN
            UPDATE public.content_items 
            SET views = views + 1 
            WHERE id = NEW.content_id;
        ELSIF TG_TABLE_NAME = 'content_likes' THEN
            UPDATE public.content_items 
            SET likes = likes + 1 
            WHERE id = NEW.content_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'content_likes' THEN
            UPDATE public.content_items 
            SET likes = likes - 1 
            WHERE id = OLD.content_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update content statistics
CREATE TRIGGER update_content_views_trigger
    AFTER INSERT ON public.content_views
    FOR EACH ROW
    EXECUTE FUNCTION public.update_content_stats();

CREATE TRIGGER update_content_likes_trigger
    AFTER INSERT OR DELETE ON public.content_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_content_stats();

-- Insert default content categories
INSERT INTO public.content_categories (name, slug, description, icon, color, sort_order) VALUES
('Islamic Studies', 'islamic-studies', 'Religious education and Islamic knowledge', 'book-open', '#10b981', 1),
('Technology', 'technology', 'IT tutorials, programming, and tech resources', 'cpu', '#3b82f6', 2),
('Academic', 'academic', 'Academic resources and study materials', 'graduation-cap', '#8b5cf6', 3),
('Events', 'events', 'Event recordings and related materials', 'calendar', '#f59e0b', 4),
('Announcements', 'announcements', 'Official announcements and notices', 'megaphone', '#ef4444', 5),
('Resources', 'resources', 'General resources and references', 'folder', '#6b7280', 6),
('Tutorials', 'tutorials', 'Step-by-step guides and tutorials', 'play-circle', '#06b6d4', 7);

-- Grant necessary permissions
GRANT ALL ON public.content_items TO authenticated;
GRANT ALL ON public.content_views TO authenticated;
GRANT ALL ON public.content_likes TO authenticated;
GRANT ALL ON public.content_comments TO authenticated;
GRANT ALL ON public.content_categories TO authenticated;
GRANT ALL ON public.content_items TO service_role;
GRANT ALL ON public.content_views TO service_role;
GRANT ALL ON public.content_likes TO service_role;
GRANT ALL ON public.content_comments TO service_role;
GRANT ALL ON public.content_categories TO service_role;