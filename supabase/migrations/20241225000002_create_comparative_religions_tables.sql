-- Create comparative resources table
CREATE TABLE IF NOT EXISTS comparative_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('book', 'video', 'audio', 'pdf', 'article', 'course')),
    category TEXT NOT NULL,
    religions_compared TEXT[] NOT NULL DEFAULT '{}',
    author TEXT NOT NULL,
    duration TEXT,
    pages INTEGER,
    language TEXT NOT NULL DEFAULT 'English',
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    downloads INTEGER DEFAULT 0,
    file_size TEXT,
    preview_url TEXT,
    download_url TEXT NOT NULL,
    is_free BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    publication_date DATE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comparative scholars table
CREATE TABLE IF NOT EXISTS comparative_scholars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialization TEXT[] NOT NULL DEFAULT '{}',
    biography TEXT NOT NULL,
    education TEXT[] DEFAULT '{}',
    publications INTEGER DEFAULT 0,
    languages TEXT[] DEFAULT '{}',
    image_url TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resource downloads table
CREATE TABLE IF NOT EXISTS resource_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID REFERENCES comparative_resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create resource ratings table
CREATE TABLE IF NOT EXISTS resource_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID REFERENCES comparative_resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comparative_resources_type ON comparative_resources(type);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_category ON comparative_resources(category);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_difficulty ON comparative_resources(difficulty);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_language ON comparative_resources(language);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_is_free ON comparative_resources(is_free);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_is_featured ON comparative_resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_rating ON comparative_resources(rating);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_downloads ON comparative_resources(downloads);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_religions_compared ON comparative_resources USING GIN(religions_compared);
CREATE INDEX IF NOT EXISTS idx_comparative_resources_tags ON comparative_resources USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_comparative_scholars_specialization ON comparative_scholars USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_comparative_scholars_languages ON comparative_scholars USING GIN(languages);

CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource_id ON resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_user_id ON resource_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_downloaded_at ON resource_downloads(downloaded_at);

CREATE INDEX IF NOT EXISTS idx_resource_ratings_resource_id ON resource_ratings(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_ratings_user_id ON resource_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_ratings_rating ON resource_ratings(rating);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_comparative_resources_search ON comparative_resources 
USING GIN(to_tsvector('english', title || ' ' || description || ' ' || author));

-- Create triggers for updated_at
CREATE TRIGGER update_comparative_resources_updated_at 
    BEFORE UPDATE ON comparative_resources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comparative_scholars_updated_at 
    BEFORE UPDATE ON comparative_scholars 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_ratings_updated_at 
    BEFORE UPDATE ON resource_ratings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE comparative_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparative_scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comparative_resources (public read access)
CREATE POLICY "Anyone can view comparative resources" ON comparative_resources
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can download resources" ON comparative_resources
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for comparative_scholars (public read access)
CREATE POLICY "Anyone can view comparative scholars" ON comparative_scholars
    FOR SELECT USING (true);

-- Create RLS policies for resource_downloads
CREATE POLICY "Users can view their own downloads" ON resource_downloads
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own downloads" ON resource_downloads
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for resource_ratings
CREATE POLICY "Users can view all ratings" ON resource_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON resource_ratings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ratings" ON resource_ratings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own ratings" ON resource_ratings
    FOR DELETE USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can manage comparative resources" ON comparative_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage comparative scholars" ON comparative_scholars
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Service role policies
CREATE POLICY "Service role can manage all comparative resources" ON comparative_resources
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all comparative scholars" ON comparative_scholars
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all downloads" ON resource_downloads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all ratings" ON resource_ratings
    FOR ALL USING (auth.role() = 'service_role');

-- Insert sample data
INSERT INTO comparative_resources (
    title, description, type, category, religions_compared, author, 
    duration, pages, language, difficulty, rating, downloads, 
    file_size, preview_url, download_url, is_free, is_featured, 
    publication_date, tags
) VALUES 
(
    'Islam and Christianity: A Comprehensive Comparison',
    'Detailed analysis of theological, historical, and practical differences and similarities between Islam and Christianity.',
    'book',
    'Theology',
    ARRAY['Islam', 'Christianity'],
    'Dr. Ahmad Deedat',
    NULL,
    450,
    'English',
    'intermediate',
    4.8,
    15420,
    '12.5 MB',
    '/preview/islam-christianity-comparison',
    '/downloads/islam-christianity-book.pdf',
    true,
    true,
    '2023-01-15',
    ARRAY['theology', 'comparative', 'abrahamic', 'scripture']
),
(
    'The Three Monotheistic Faiths: Judaism, Christianity, and Islam',
    'Scholarly examination of the three Abrahamic religions, their origins, beliefs, and practices.',
    'video',
    'Documentary',
    ARRAY['Islam', 'Christianity', 'Judaism'],
    'Prof. John Esposito',
    '2h 45m',
    NULL,
    'English',
    'beginner',
    4.6,
    8920,
    '1.8 GB',
    '/preview/three-faiths-documentary',
    '/downloads/three-faiths-video.mp4',
    true,
    true,
    '2023-03-20',
    ARRAY['documentary', 'abrahamic', 'history', 'beliefs']
),
(
    'Buddhism and Islam: Philosophical Perspectives',
    'Academic exploration of Buddhist and Islamic philosophical traditions and their approaches to spirituality.',
    'pdf',
    'Philosophy',
    ARRAY['Islam', 'Buddhism'],
    'Dr. Seyyed Hossein Nasr',
    NULL,
    280,
    'English',
    'advanced',
    4.7,
    5630,
    '8.2 MB',
    '/preview/buddhism-islam-philosophy',
    '/downloads/buddhism-islam-philosophy.pdf',
    false,
    false,
    '2022-11-10',
    ARRAY['philosophy', 'spirituality', 'meditation', 'ethics']
),
(
    'Hinduism and Islam: Historical Interactions',
    'Historical analysis of Hindu-Muslim relations, cultural exchanges, and theological dialogues in the Indian subcontinent.',
    'audio',
    'History',
    ARRAY['Islam', 'Hinduism'],
    'Dr. Akbar Ahmed',
    '3h 20m',
    NULL,
    'English',
    'intermediate',
    4.5,
    7240,
    '180 MB',
    '/preview/hinduism-islam-history',
    '/downloads/hinduism-islam-audio.mp3',
    true,
    false,
    '2023-05-08',
    ARRAY['history', 'culture', 'dialogue', 'subcontinent']
),
(
    'Women in World Religions: A Comparative Study',
    'Examination of women''s roles, rights, and representations across major world religions.',
    'article',
    'Gender Studies',
    ARRAY['Islam', 'Christianity', 'Judaism', 'Hinduism', 'Buddhism'],
    'Dr. Amina Wadud',
    NULL,
    85,
    'English',
    'intermediate',
    4.4,
    9870,
    '2.1 MB',
    '/preview/women-world-religions',
    '/downloads/women-religions-study.pdf',
    true,
    false,
    '2023-06-12',
    ARRAY['gender', 'women', 'rights', 'comparative']
);

-- Insert sample scholars
INSERT INTO comparative_scholars (
    name, title, specialization, biography, education, publications, 
    languages, image_url, contact_info
) VALUES 
(
    'Dr. Ahmad Deedat',
    'Islamic Scholar & Comparative Religion Expert',
    ARRAY['Comparative Religion', 'Christian-Muslim Dialogue', 'Biblical Studies'],
    'Renowned South African Islamic scholar known for his comparative religion debates and writings.',
    ARRAY['Islamic Studies', 'Biblical Studies', 'Comparative Theology'],
    45,
    ARRAY['English', 'Arabic', 'Urdu'],
    '/scholars/ahmad-deedat.jpg',
    'Available for lectures and consultations'
),
(
    'Prof. John Esposito',
    'Professor of Islamic Studies',
    ARRAY['Islamic Studies', 'Middle Eastern Studies', 'Interfaith Relations'],
    'Distinguished professor and author of numerous works on Islam and Muslim-Christian relations.',
    ARRAY['PhD Islamic Studies', 'Georgetown University', 'Harvard Divinity School'],
    35,
    ARRAY['English', 'Arabic'],
    '/scholars/john-esposito.jpg',
    'Georgetown University'
),
(
    'Dr. Seyyed Hossein Nasr',
    'Islamic Philosophy Scholar',
    ARRAY['Islamic Philosophy', 'Sufism', 'Comparative Mysticism'],
    'Leading authority on Islamic philosophy and traditional Islamic sciences.',
    ARRAY['PhD Harvard University', 'Traditional Islamic Sciences'],
    50,
    ARRAY['English', 'Arabic', 'Persian'],
    '/scholars/seyyed-nasr.jpg',
    'George Washington University'
);

-- Create function to get comparative religion statistics
CREATE OR REPLACE FUNCTION get_comparative_religion_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'resources', json_build_object(
            'total', (SELECT COUNT(*) FROM comparative_resources),
            'free', (SELECT COUNT(*) FROM comparative_resources WHERE is_free = TRUE),
            'premium', (SELECT COUNT(*) FROM comparative_resources WHERE is_free = FALSE),
            'featured', (SELECT COUNT(*) FROM comparative_resources WHERE is_featured = TRUE),
            'by_type', (
                SELECT json_object_agg(type, count)
                FROM (
                    SELECT type, COUNT(*) as count
                    FROM comparative_resources
                    GROUP BY type
                ) t
            ),
            'by_category', (
                SELECT json_object_agg(category, count)
                FROM (
                    SELECT category, COUNT(*) as count
                    FROM comparative_resources
                    GROUP BY category
                ) t
            )
        ),
        'scholars', json_build_object(
            'total', (SELECT COUNT(*) FROM comparative_scholars),
            'avg_publications', (SELECT ROUND(AVG(publications), 1) FROM comparative_scholars)
        ),
        'downloads', json_build_object(
            'total', (SELECT COUNT(*) FROM resource_downloads),
            'unique_users', (SELECT COUNT(DISTINCT user_id) FROM resource_downloads WHERE user_id IS NOT NULL)
        ),
        'ratings', json_build_object(
            'total', (SELECT COUNT(*) FROM resource_ratings),
            'average', (SELECT ROUND(AVG(rating), 2) FROM resource_ratings)
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON comparative_resources TO authenticated, anon;
GRANT SELECT ON comparative_scholars TO authenticated, anon;
GRANT ALL ON resource_downloads TO authenticated;
GRANT ALL ON resource_ratings TO authenticated;
GRANT EXECUTE ON FUNCTION get_comparative_religion_stats() TO authenticated, anon;