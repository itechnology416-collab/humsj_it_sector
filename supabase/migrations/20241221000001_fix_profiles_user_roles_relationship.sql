-- Fix the relationship between profiles and user_roles tables
-- This migration ensures proper foreign key relationships and adds indexes for better performance

-- Add index on user_roles.user_id for better join performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Add index on profiles.user_id for better join performance  
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Create a view that combines profiles with their roles for easier querying
CREATE OR REPLACE VIEW public.profiles_with_roles AS
SELECT 
    p.*,
    ur.role as user_role,
    ur.created_at as role_assigned_at
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id;

-- Grant access to the view
GRANT SELECT ON public.profiles_with_roles TO authenticated;
GRANT SELECT ON public.profiles_with_roles TO service_role;

-- Create RLS policy for the view
ALTER VIEW public.profiles_with_roles SET (security_invoker = true);

-- Create a function to get member with role information
CREATE OR REPLACE FUNCTION public.get_members_with_roles(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0,
    p_status TEXT DEFAULT NULL,
    p_college TEXT DEFAULT NULL
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
    invitation_id UUID,
    invitation_accepted_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    user_role TEXT
) AS $
BEGIN
    RETURN QUERY
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
        p.invitation_id,
        p.invitation_accepted_at,
        p.created_by,
        p.created_at,
        p.updated_at,
        ur.role::TEXT as user_role
    FROM public.profiles p
    LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
    WHERE 
        (p_status IS NULL OR p.status = p_status) AND
        (p_college IS NULL OR p.college = p_college)
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_members_with_roles(INTEGER, INTEGER, TEXT, TEXT) TO authenticated;

-- Create a function to get member statistics
CREATE OR REPLACE FUNCTION public.get_member_statistics()
RETURNS JSON AS $
DECLARE
    total_members INTEGER;
    active_members INTEGER;
    pending_invitations INTEGER;
    pending_requests INTEGER;
    recent_joins INTEGER;
    one_week_ago TIMESTAMPTZ;
BEGIN
    one_week_ago := now() - interval '7 days';
    
    -- Count total members
    SELECT COUNT(*) INTO total_members FROM public.profiles;
    
    -- Count active members
    SELECT COUNT(*) INTO active_members FROM public.profiles WHERE status = 'active';
    
    -- Count pending invitations
    SELECT COUNT(*) INTO pending_invitations 
    FROM public.member_invitations 
    WHERE status = 'invited';
    
    -- Count pending requests
    SELECT COUNT(*) INTO pending_requests 
    FROM public.member_invitations 
    WHERE status = 'pending';
    
    -- Count recent joins (last 7 days)
    SELECT COUNT(*) INTO recent_joins 
    FROM public.profiles 
    WHERE created_at > one_week_ago;
    
    RETURN json_build_object(
        'totalMembers', total_members,
        'activeMembers', active_members,
        'pendingInvitations', pending_invitations,
        'pendingRequests', pending_requests,
        'recentJoins', recent_joins
    );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the statistics function
GRANT EXECUTE ON FUNCTION public.get_member_statistics() TO authenticated;

-- Update the profiles table to ensure it has all the fields we need
-- (These might already exist from previous migrations, but we'll add them if they don't)
DO $$ 
BEGIN
    -- Add invitation_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'invitation_id') THEN
        ALTER TABLE public.profiles ADD COLUMN invitation_id UUID REFERENCES public.member_invitations(id) ON DELETE SET NULL;
    END IF;
    
    -- Add invitation_accepted_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'invitation_accepted_at') THEN
        ALTER TABLE public.profiles ADD COLUMN invitation_accepted_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_by') THEN
        ALTER TABLE public.profiles ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Update status check constraint to include new statuses
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
        CHECK (status IN ('active', 'inactive', 'alumni', 'invited', 'pending', 'suspended'));
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_profiles_invitation_id ON public.profiles(invitation_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_by ON public.profiles(created_by);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON public.profiles(college);

-- Update RLS policies to work with the new structure
-- Allow admins to view all profiles with roles
CREATE POLICY "Admins can view profiles with roles" ON public.profiles
    FOR SELECT USING (
        public.is_admin(auth.uid()) OR auth.uid() = user_id
    );

-- Create a trigger to automatically assign default role when profile is created
CREATE OR REPLACE FUNCTION public.ensure_user_role()
RETURNS TRIGGER AS $
BEGIN
    -- Check if user already has a role
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id) THEN
        -- Insert default member role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.user_id, 'member');
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to ensure every profile has a corresponding user role
CREATE TRIGGER ensure_profile_has_role
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_user_role();