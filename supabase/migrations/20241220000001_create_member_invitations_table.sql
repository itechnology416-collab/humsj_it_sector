-- Create member_invitations table for admin member addition
CREATE TABLE IF NOT EXISTS public.member_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Invitation details
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 7),
    
    -- Status and metadata
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'accepted', 'rejected', 'expired')),
    invitation_type TEXT NOT NULL DEFAULT 'admin_invite' CHECK (invitation_type IN ('admin_invite', 'member_request')),
    intended_role TEXT DEFAULT 'member' CHECK (intended_role IN ('super_admin', 'it_head', 'sys_admin', 'developer', 'coordinator', 'leader', 'member')),
    
    -- Admin who created the invitation
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Invitation token for email verification
    invitation_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '7 days'),
    
    -- Notes and additional info
    notes TEXT,
    bio TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_member_invitations_email ON public.member_invitations(email);
CREATE INDEX IF NOT EXISTS idx_member_invitations_status ON public.member_invitations(status);
CREATE INDEX IF NOT EXISTS idx_member_invitations_created_by ON public.member_invitations(created_by);
CREATE INDEX IF NOT EXISTS idx_member_invitations_token ON public.member_invitations(invitation_token);

-- Enable RLS (Row Level Security)
ALTER TABLE public.member_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admins can see all invitations
CREATE POLICY "Admins can view all member invitations" ON public.member_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- Admins can create invitations
CREATE POLICY "Admins can create member invitations" ON public.member_invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- Admins can update invitations
CREATE POLICY "Admins can update member invitations" ON public.member_invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- Users can view their own invitations (by email)
CREATE POLICY "Users can view their own invitations" ON public.member_invitations
    FOR SELECT USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Regular users can create member requests
CREATE POLICY "Users can create member requests" ON public.member_invitations
    FOR INSERT WITH CHECK (
        invitation_type = 'member_request' AND
        auth.uid() IS NOT NULL
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_member_invitations_updated_at
    BEFORE UPDATE ON public.member_invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to clean up expired invitations
CREATE OR REPLACE FUNCTION public.cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
    UPDATE public.member_invitations 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND token_expires_at < timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON public.member_invitations TO authenticated;
GRANT ALL ON public.member_invitations TO service_role;