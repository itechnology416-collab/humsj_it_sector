-- Create functions for member management

-- Function to create member invitation (for admins)
CREATE OR REPLACE FUNCTION public.create_member_invitation(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_college TEXT,
    p_department TEXT,
    p_year INTEGER,
    p_intended_role TEXT DEFAULT 'member',
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    invitation_id UUID;
    invitation_token TEXT;
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'it_head', 'sys_admin')
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Insufficient permissions');
    END IF;
    
    -- Check if email already exists
    IF EXISTS (
        SELECT 1 FROM public.profiles WHERE email = p_email
        UNION
        SELECT 1 FROM public.member_invitations WHERE email = p_email AND status IN ('pending', 'invited')
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Email already exists');
    END IF;
    
    -- Create invitation
    INSERT INTO public.member_invitations (
        full_name, email, phone, college, department, year,
        status, invitation_type, intended_role, created_by, notes
    ) VALUES (
        p_full_name, p_email, p_phone, p_college, p_department, p_year,
        'invited', 'admin_invite', p_intended_role, auth.uid(), p_notes
    ) RETURNING id, invitation_token INTO invitation_id, invitation_token;
    
    RETURN json_build_object(
        'success', true,
        'invitation_id', invitation_id,
        'invitation_token', invitation_token,
        'message', 'Member invitation created successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create member request (for regular users)
CREATE OR REPLACE FUNCTION public.create_member_request(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_college TEXT,
    p_department TEXT,
    p_year INTEGER,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    request_id UUID;
    result JSON;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User must be authenticated');
    END IF;
    
    -- Check if email already exists
    IF EXISTS (
        SELECT 1 FROM public.profiles WHERE email = p_email
        UNION
        SELECT 1 FROM public.member_invitations WHERE email = p_email AND status IN ('pending', 'invited')
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Email already exists');
    END IF;
    
    -- Create member request
    INSERT INTO public.member_invitations (
        full_name, email, phone, college, department, year,
        status, invitation_type, created_by, notes
    ) VALUES (
        p_full_name, p_email, p_phone, p_college, p_department, p_year,
        'pending', 'member_request', auth.uid(), p_notes
    ) RETURNING id INTO request_id;
    
    RETURN json_build_object(
        'success', true,
        'request_id', request_id,
        'message', 'Member request submitted successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve member request (for admins)
CREATE OR REPLACE FUNCTION public.approve_member_request(
    p_invitation_id UUID,
    p_approved_role TEXT DEFAULT 'member'
)
RETURNS JSON AS $$
DECLARE
    invitation_record public.member_invitations%ROWTYPE;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'it_head', 'sys_admin')
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Insufficient permissions');
    END IF;
    
    -- Get the invitation
    SELECT * INTO invitation_record 
    FROM public.member_invitations 
    WHERE id = p_invitation_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invitation not found or already processed');
    END IF;
    
    -- Update invitation status and role
    UPDATE public.member_invitations 
    SET 
        status = 'invited',
        intended_role = p_approved_role,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_invitation_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Member request approved successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject member request (for admins)
CREATE OR REPLACE FUNCTION public.reject_member_request(
    p_invitation_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSON AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'it_head', 'sys_admin')
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Insufficient permissions');
    END IF;
    
    -- Update invitation status
    UPDATE public.member_invitations 
    SET 
        status = 'rejected',
        notes = COALESCE(notes || ' | Rejection reason: ' || p_reason, 'Rejected: ' || COALESCE(p_reason, 'No reason provided')),
        updated_at = timezone('utc'::text, now())
    WHERE id = p_invitation_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invitation not found or already processed');
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Member request rejected'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get member invitations (for admins)
CREATE OR REPLACE FUNCTION public.get_member_invitations(
    p_status TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMPTZ,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    college TEXT,
    department TEXT,
    year INTEGER,
    status TEXT,
    invitation_type TEXT,
    intended_role TEXT,
    created_by_email TEXT,
    notes TEXT,
    token_expires_at TIMESTAMPTZ
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'it_head', 'sys_admin')
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    RETURN QUERY
    SELECT 
        mi.id,
        mi.created_at,
        mi.full_name,
        mi.email,
        mi.phone,
        mi.college,
        mi.department,
        mi.year,
        mi.status,
        mi.invitation_type,
        mi.intended_role,
        au.email as created_by_email,
        mi.notes,
        mi.token_expires_at
    FROM public.member_invitations mi
    LEFT JOIN auth.users au ON mi.created_by = au.id
    WHERE (p_status IS NULL OR mi.status = p_status)
    ORDER BY mi.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_member_invitation(TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_member_request(TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_member_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_member_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_invitations(TEXT, INTEGER, INTEGER) TO authenticated;