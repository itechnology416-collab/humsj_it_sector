-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT,
    email TEXT,
    otp_code TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sms', 'email')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone ON otp_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_type ON otp_verifications(type);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires_at ON otp_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_is_verified ON otp_verifications(is_verified);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(verification_token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_verifications_is_verified ON email_verifications(is_verified);

-- Add email_verified fields to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP WITH TIME ZONE;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_otp_verifications_updated_at 
    BEFORE UPDATE ON otp_verifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_verifications_updated_at 
    BEFORE UPDATE ON email_verifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for otp_verifications
CREATE POLICY "Users can view their own OTP verifications" ON otp_verifications
    FOR SELECT USING (
        phone_number = (SELECT phone FROM profiles WHERE id = auth.uid()) OR
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Users can insert their own OTP verifications" ON otp_verifications
    FOR INSERT WITH CHECK (
        phone_number = (SELECT phone FROM profiles WHERE id = auth.uid()) OR
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update their own OTP verifications" ON otp_verifications
    FOR UPDATE USING (
        phone_number = (SELECT phone FROM profiles WHERE id = auth.uid()) OR
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Create RLS policies for email_verifications
CREATE POLICY "Users can view their own email verifications" ON email_verifications
    FOR SELECT USING (
        user_id = auth.uid() OR
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Users can insert their own email verifications" ON email_verifications
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update their own email verifications" ON email_verifications
    FOR UPDATE USING (
        user_id = auth.uid() OR
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Allow service role to manage all verification records (for cleanup and admin functions)
CREATE POLICY "Service role can manage all OTP verifications" ON otp_verifications
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all email verifications" ON email_verifications
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to clean up expired verifications
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
    -- Clean up expired OTP verifications
    DELETE FROM otp_verifications 
    WHERE expires_at < NOW() AND is_verified = FALSE;
    
    -- Clean up expired email verifications
    DELETE FROM email_verifications 
    WHERE expires_at < NOW() AND is_verified = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get verification statistics
CREATE OR REPLACE FUNCTION get_verification_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'otp_verifications', json_build_object(
            'total', (SELECT COUNT(*) FROM otp_verifications),
            'verified', (SELECT COUNT(*) FROM otp_verifications WHERE is_verified = TRUE),
            'pending', (SELECT COUNT(*) FROM otp_verifications WHERE is_verified = FALSE AND expires_at > NOW()),
            'expired', (SELECT COUNT(*) FROM otp_verifications WHERE is_verified = FALSE AND expires_at <= NOW())
        ),
        'email_verifications', json_build_object(
            'total', (SELECT COUNT(*) FROM email_verifications),
            'verified', (SELECT COUNT(*) FROM email_verifications WHERE is_verified = TRUE),
            'pending', (SELECT COUNT(*) FROM email_verifications WHERE is_verified = FALSE AND expires_at > NOW()),
            'expired', (SELECT COUNT(*) FROM email_verifications WHERE is_verified = FALSE AND expires_at <= NOW())
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON otp_verifications TO authenticated;
GRANT ALL ON email_verifications TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_verifications() TO service_role;
GRANT EXECUTE ON FUNCTION get_verification_stats() TO authenticated;