-- Content Management System
-- Migration: 20241226000002_create_content_management_system.sql

-- Content Types Table
CREATE TABLE IF NOT EXISTS content_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    schema_definition JSONB DEFAULT '{}',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Categories Table
CREATE TABLE IF NOT EXISTS content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Content Table (Enhanced)
CREATE TABLE IF NOT EXISTS website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content_type_id UUID REFERENCES content_types(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES content_categories(id) ON DELETE SET NULL,
    content TEXT,
    excerpt TEXT,
    metadata JSONB DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    featured_image_url TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'review', 'published', 'archived'
    language VARCHAR(10) DEFAULT 'en',
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(slug, language)
);

-- Content Translations Table
CREATE TABLE IF NOT EXISTS content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    translator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(original_content_id, language)
);

-- Content Revisions Table
CREATE TABLE IF NOT EXISTS content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    metadata JSONB DEFAULT '{}',
    revision_number INTEGER NOT NULL,
    change_summary TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Comments/Reviews Table
CREATE TABLE IF NOT EXISTS content_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    review_type VARCHAR(50) NOT NULL, -- 'approval', 'feedback', 'correction'
    status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected'
    comments TEXT,
    suggested_changes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Tags Table
CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Tag Relations Table
CREATE TABLE IF NOT EXISTS content_tag_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES content_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(content_id, tag_id)
);

-- Content Media Table
CREATE TABLE IF NOT EXISTS content_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'audio', 'document'
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    alt_text TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Management Tables
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    action VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Permission Relations Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(role_id, permission_id)
);

-- User Role Assignments Table (Enhanced)
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- Halal Marketplace Tables
CREATE TABLE IF NOT EXISTS marketplace_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    parent_id UUID REFERENCES marketplace_categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    logo_url TEXT,
    cover_image_url TEXT,
    contact_info JSONB DEFAULT '{}',
    address JSONB DEFAULT '{}',
    business_hours JSONB DEFAULT '{}',
    halal_certification JSONB DEFAULT '{}',
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES marketplace_businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'ETB',
    images JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    halal_info JSONB DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, slug)
);

CREATE TABLE IF NOT EXISTS marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES marketplace_businesses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_website_content_status ON website_content(status);
CREATE INDEX IF NOT EXISTS idx_website_content_language ON website_content(language);
CREATE INDEX IF NOT EXISTS idx_website_content_author_id ON website_content(author_id);
CREATE INDEX IF NOT EXISTS idx_website_content_category_id ON website_content(category_id);
CREATE INDEX IF NOT EXISTS idx_website_content_published_at ON website_content(published_at);
CREATE INDEX IF NOT EXISTS idx_content_translations_original_id ON content_translations(original_content_id);
CREATE INDEX IF NOT EXISTS idx_content_translations_language ON content_translations(language);
CREATE INDEX IF NOT EXISTS idx_content_revisions_content_id ON content_revisions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_content_id ON content_reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tag_relations_content_id ON content_tag_relations(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tag_relations_tag_id ON content_tag_relations(tag_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_category_id ON marketplace_businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_businesses_verification_status ON marketplace_businesses(verification_status);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_business_id ON marketplace_products(business_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_business_id ON marketplace_reviews(business_id);

-- Enable RLS
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- Insert default content types
INSERT INTO content_types (name, description, is_system) VALUES
('page', 'Static website pages', true),
('article', 'Blog articles and news', true),
('section', 'Page sections and components', true),
('media', 'Media content and galleries', true),
('announcement', 'Important announcements', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, display_name, description, category, resource, action) VALUES
('content.create', 'Create Content', 'Create new content items', 'Content Management', 'content', 'create'),
('content.read', 'Read Content', 'View content items', 'Content Management', 'content', 'read'),
('content.update', 'Update Content', 'Edit existing content', 'Content Management', 'content', 'update'),
('content.delete', 'Delete Content', 'Delete content items', 'Content Management', 'content', 'delete'),
('content.publish', 'Publish Content', 'Publish content to website', 'Content Management', 'content', 'publish'),
('content.approve', 'Approve Content', 'Approve content for publication', 'Content Management', 'content', 'approve'),
('users.create', 'Create Users', 'Create new user accounts', 'User Management', 'users', 'create'),
('users.read', 'Read Users', 'View user information', 'User Management', 'users', 'read'),
('users.update', 'Update Users', 'Edit user information', 'User Management', 'users', 'update'),
('users.delete', 'Delete Users', 'Delete user accounts', 'User Management', 'users', 'delete'),
('roles.manage', 'Manage Roles', 'Create and manage user roles', 'Role Management', 'roles', 'manage'),
('system.monitor', 'System Monitoring', 'Monitor system health and performance', 'System Administration', 'system', 'monitor'),
('analytics.view', 'View Analytics', 'Access analytics and reports', 'Analytics', 'analytics', 'view'),
('marketplace.manage', 'Manage Marketplace', 'Manage marketplace businesses and products', 'Marketplace', 'marketplace', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, display_name, description, is_system) VALUES
('super_admin', 'Super Administrator', 'Full system access and control', true),
('admin', 'Administrator', 'Administrative access to most features', true),
('content_manager', 'Content Manager', 'Manage website content and publications', true),
('moderator', 'Moderator', 'Moderate user content and interactions', true),
('member', 'Member', 'Standard community member access', true)
ON CONFLICT (name) DO NOTHING;

-- RLS Policies for Content Management
CREATE POLICY "Published content is viewable by everyone" ON website_content
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their own content" ON website_content
    FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Content managers can manage all content" ON website_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN roles r ON r.id = ura.role_id
            WHERE ura.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin', 'content_manager')
            AND ura.is_active = true
        )
    );

-- RLS Policies for Roles and Permissions
CREATE POLICY "Users can view their own role assignments" ON user_role_assignments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage role assignments" ON user_role_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN roles r ON r.id = ura.role_id
            WHERE ura.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin')
            AND ura.is_active = true
        )
    );

CREATE POLICY "Everyone can view active roles" ON roles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage roles" ON roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN roles r ON r.id = ura.role_id
            WHERE ura.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin')
            AND ura.is_active = true
        )
    );

-- RLS Policies for Marketplace
CREATE POLICY "Everyone can view active marketplace content" ON marketplace_businesses
    FOR SELECT USING (is_active = true AND verification_status = 'verified');

CREATE POLICY "Business owners can manage their businesses" ON marketplace_businesses
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Marketplace managers can manage all businesses" ON marketplace_businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN roles r ON r.id = ura.role_id
            WHERE ura.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin')
            AND ura.is_active = true
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS TEXT[] AS $$
DECLARE
    user_permissions TEXT[];
BEGIN
    SELECT ARRAY_AGG(DISTINCT p.name) INTO user_permissions
    FROM user_role_assignments ura
    JOIN roles r ON r.id = ura.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ura.user_id = user_uuid 
    AND ura.is_active = true
    AND r.is_active = true;
    
    RETURN COALESCE(user_permissions, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_content_view_count(content_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE website_content 
    SET view_count = view_count + 1 
    WHERE id = content_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_content_types_updated_at
    BEFORE UPDATE ON content_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_categories_updated_at
    BEFORE UPDATE ON content_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at
    BEFORE UPDATE ON website_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_translations_updated_at
    BEFORE UPDATE ON content_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_businesses_updated_at
    BEFORE UPDATE ON marketplace_businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_products_updated_at
    BEFORE UPDATE ON marketplace_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();