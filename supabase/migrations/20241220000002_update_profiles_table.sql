-- Update profiles table to support member invitations
-- Make user_id nullable to support invitations before user registration
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Add invitation-related fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS invitation_id UUID REFERENCES public.member_invitations(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add check constraint for status to include new statuses
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
    CHECK (status IN ('active', 'inactive', 'alumni', 'invited', 'pending', 'suspended'));

-- Create index for invitation_id
CREATE INDEX IF NOT EXISTS idx_profiles_invitation_id ON public.profiles(invitation_id);

-- Update RLS policies for profiles table
-- Allow admins to create profiles for invitations
CREATE POLICY "Admins can create invitation profiles" ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        ) OR
        -- Allow users to create their own profiles during registration
        user_id = auth.uid()
    );

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        ) OR
        -- Users can view their own profile
        user_id = auth.uid()
    );

-- Allow admins to update profiles
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        ) OR
        -- Users can update their own profile
        user_id = auth.uid()
    );

-- Create function to handle invitation acceptance
CREATE OR REPLACE FUNCTION public.accept_member_invitation(invitation_token TEXT)
RETURNS JSON AS $$
DECLARE
    invitation_record public.member_invitations%ROWTYPE;
    profile_record public.profiles%ROWTYPE;
    result JSON;
BEGIN
    -- Get the invitation
    SELECT * INTO invitation_record 
    FROM public.member_invitations 
    WHERE invitation_token = accept_member_invitation.invitation_token
    AND status = 'pending'
    AND token_expires_at > timezone('utc'::text, now());
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation token');
    END IF;
    
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User must be authenticated');
    END IF;
    
    -- Update or create profile
    INSERT INTO public.profiles (
        user_id, full_name, email, phone, college, department, year, 
        status, invitation_id, invitation_accepted_at, bio
    ) VALUES (
        auth.uid(), 
        invitation_record.full_name,
        invitation_record.email,
        invitation_record.phone,
        invitation_record.college,
        invitation_record.department,
        invitation_record.year,
        'active',
        invitation_record.id,
        timezone('utc'::text, now()),
        COALESCE(invitation_record.bio, 'Member')
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        college = EXCLUDED.college,
        department = EXCLUDED.department,
        year = EXCLUDED.year,
        status = 'active',
        invitation_id = EXCLUDED.invitation_id,
        invitation_accepted_at = EXCLUDED.invitation_accepted_at,
        updated_at = timezone('utc'::text, now())
    RETURNING * INTO profile_record;
    
    -- Update invitation status
    UPDATE public.member_invitations 
    SET status = 'accepted', updated_at = timezone('utc'::text, now())
    WHERE id = invitation_record.id;
    
    -- Assign role if specified
    IF invitation_record.intended_role IS NOT NULL AND invitation_record.intended_role != 'member' THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (auth.uid(), invitation_record.intended_role::user_role)
        ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
    END IF;
    
    RETURN json_build_object(
        'success', true, 
        'profile_id', profile_record.id,
        'message', 'Invitation accepted successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.accept_member_invitation(TEXT) TO authenticated;