-- Create user verification system tables
-- This migration creates comprehensive user verification functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create verification documents table
CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('national_id', 'passport', 'student_id', 'driver_license')),
    document_number TEXT NOT NULL,
    document_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, document_type, document_number)
);

-- Create verification requests table
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('identity', 'student', 'address', 'phone', 'email')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    submitted_data JSONB NOT NULL DEFAULT '{}',
    verification_method TEXT NOT NULL DEFAULT 'manual' CHECK (verification_method IN ('manual', 'automated', 'third_party')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification history table
CREATE TABLE IF NOT EXISTS verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification settings table
CREATE TABLE IF NOT EXISTS verification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_status ON verification_documents(status);
CREATE INDEX IF NOT EXISTS idx_verification_documents_type ON verification_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_verification_documents_created_at ON verification_documents(created_at);

CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_type ON verification_requests(verification_type);
CREATE INDEX IF NOT EXISTS idx_verification_requests_priority ON verification_requests(priority);
CREATE INDEX IF NOT EXISTS idx_verification_requests_assigned_to ON verification_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_verification_requests_created_at ON verification_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_verification_history_user_id ON verification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_history_performed_by ON verification_history(performed_by);
CREATE INDEX IF NOT EXISTS idx_verification_history_created_at ON verification_history(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_verification_documents_updated_at 
    BEFORE UPDATE ON verification_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at 
    BEFORE UPDATE ON verification_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_settings_updated_at 
    BEFORE UPDATE ON verification_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default verification settings
INSERT INTO verification_settings (setting_key, setting_value, description) VALUES
('document_expiry_notification_days', '30', 'Days before document expiry to send notification'),
('auto_approve_student_ids', 'false', 'Automatically approve student ID documents'),
('require_manual_review_threshold', '3', 'Number of failed verifications before requiring manual review'),
('verification_timeout_hours', '72', 'Hours before verification request times out'),
('max_documents_per_type', '3', 'Maximum number of documents allowed per type'),
('allowed_document_formats', '["jpg", "jpeg", "png", "pdf"]', 'Allowed document file formats'),
('max_document_size_mb', '10', 'Maximum document file size in MB'),
('enable_third_party_verification', 'false', 'Enable third-party verification services')
ON CONFLICT (setting_key) DO NOTHING;

-- Create RLS policies
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_settings ENABLE ROW LEVEL SECURITY;

-- Policies for verification_documents
CREATE POLICY "Users can view their own verification documents" ON verification_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification documents" ON verification_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification documents" ON verification_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all verification documents" ON verification_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all verification documents" ON verification_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for verification_requests
CREATE POLICY "Users can view their own verification requests" ON verification_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification requests" ON verification_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verification requests" ON verification_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all verification requests" ON verification_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for verification_history
CREATE POLICY "Users can view their own verification history" ON verification_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert verification history" ON verification_history
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all verification history" ON verification_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policies for verification_settings
CREATE POLICY "Admins can manage verification settings" ON verification_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Users can view active verification settings" ON verification_settings
    FOR SELECT USING (is_active = true);

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their verification documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'verification-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their verification documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'verification-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Admins can view all verification documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'verification-documents' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Create functions for verification automation
CREATE OR REPLACE FUNCTION check_document_expiry()
RETURNS void AS $$
BEGIN
    -- Update expired documents
    UPDATE verification_documents 
    SET status = 'expired', updated_at = NOW()
    WHERE expiry_date < CURRENT_DATE 
    AND status = 'approved';
    
    -- Log expiry notifications
    INSERT INTO verification_history (user_id, action, details, performed_by)
    SELECT 
        user_id,
        'document_expired',
        jsonb_build_object('document_type', document_type, 'document_id', id),
        '00000000-0000-0000-0000-000000000000'::uuid
    FROM verification_documents 
    WHERE expiry_date < CURRENT_DATE 
    AND status = 'expired'
    AND updated_at::date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create function to get verification statistics
CREATE OR REPLACE FUNCTION get_verification_stats()
RETURNS TABLE (
    total_requests bigint,
    pending_requests bigint,
    approved_documents bigint,
    rejected_documents bigint,
    verification_rate numeric,
    average_processing_time_hours numeric
) AS $$
BEGIN
    RETURN QUERY
    WITH request_stats AS (
        SELECT 
            COUNT(*) as total_req,
            COUNT(*) FILTER (WHERE status = 'pending') as pending_req
        FROM verification_requests
    ),
    document_stats AS (
        SELECT 
            COUNT(*) FILTER (WHERE status = 'approved') as approved_docs,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected_docs
        FROM verification_documents
    ),
    processing_times AS (
        SELECT 
            AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours
        FROM verification_requests 
        WHERE status = 'completed' AND updated_at IS NOT NULL
    )
    SELECT 
        r.total_req,
        r.pending_req,
        d.approved_docs,
        d.rejected_docs,
        CASE 
            WHEN r.total_req > 0 THEN 
                ROUND((r.total_req - r.pending_req)::numeric / r.total_req * 100, 2)
            ELSE 0 
        END as verification_rate,
        COALESCE(ROUND(p.avg_hours::numeric, 2), 0) as average_processing_time_hours
    FROM request_stats r
    CROSS JOIN document_stats d
    CROSS JOIN processing_times p;
END;
$$ LANGUAGE plpgsql;

-- Create notification function for verification updates
CREATE OR REPLACE FUNCTION notify_verification_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notification for status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            data,
            created_at
        ) VALUES (
            NEW.user_id,
            'Verification Status Updated',
            CASE NEW.status
                WHEN 'approved' THEN 'Your verification document has been approved.'
                WHEN 'rejected' THEN 'Your verification document has been rejected. Please check the details and resubmit if necessary.'
                WHEN 'expired' THEN 'Your verification document has expired. Please upload a new document.'
                ELSE 'Your verification status has been updated.'
            END,
            'verification',
            jsonb_build_object(
                'document_id', NEW.id,
                'document_type', NEW.document_type,
                'status', NEW.status,
                'rejection_reason', NEW.rejection_reason
            ),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for verification notifications
CREATE TRIGGER verification_document_status_notification
    AFTER UPDATE ON verification_documents
    FOR EACH ROW
    EXECUTE FUNCTION notify_verification_update();

-- Create scheduled job for document expiry check (if pg_cron is available)
-- SELECT cron.schedule('check-document-expiry', '0 9 * * *', 'SELECT check_document_expiry();');

COMMENT ON TABLE verification_documents IS 'Stores user verification documents with approval workflow';
COMMENT ON TABLE verification_requests IS 'Tracks verification requests and their processing status';
COMMENT ON TABLE verification_history IS 'Audit trail for all verification-related activities';
COMMENT ON TABLE verification_settings IS 'Configuration settings for the verification system';