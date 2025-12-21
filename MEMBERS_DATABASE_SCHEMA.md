# Members.tsx Database Schema Documentation

## Overview
This document provides a comprehensive overview of the database schema supporting the Members.tsx functionality, including member management, invitations, and role-based access control.

## Core Tables

### 1. `public.profiles` - Main Member Profiles
The primary table storing member information and profiles.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE, -- Nullable for invitations
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT,
  department TEXT,
  year INTEGER,
  avatar_url TEXT,
  bio TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'alumni', 'invited', 'pending', 'suspended')),
  
  -- Invitation-related fields
  invitation_id UUID REFERENCES public.member_invitations(id) ON DELETE SET NULL,
  invitation_accepted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

**Key Features:**
- ✅ Stores complete member information
- ✅ Links to authentication system via `user_id`
- ✅ Supports invitation workflow via `invitation_id`
- ✅ Tracks who created the profile via `created_by`
- ✅ Multiple status types for member lifecycle management
- ✅ Automatic timestamp management

**Indexes:**
```sql
CREATE INDEX idx_profiles_invitation_id ON public.profiles(invitation_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
```

### 2. `public.member_invitations` - Invitation Management
Handles member invitations and registration requests.

```sql
CREATE TABLE public.member_invitations (
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
```

**Key Features:**
- ✅ Separate workflow for admin invitations vs member requests
- ✅ Secure token-based invitation system
- ✅ Automatic expiration handling (7 days)
- ✅ Role assignment capability
- ✅ Audit trail with creator tracking
- ✅ Comprehensive status management

**Indexes:**
```sql
CREATE INDEX idx_member_invitations_email ON public.member_invitations(email);
CREATE INDEX idx_member_invitations_status ON public.member_invitations(status);
CREATE INDEX idx_member_invitations_created_by ON public.member_invitations(created_by);
CREATE INDEX idx_member_invitations_token ON public.member_invitations(invitation_token);
```

### 3. `public.user_roles` - Role Management
Manages user roles and permissions.

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);
```

**Role Hierarchy:**
```sql
CREATE TYPE public.app_role AS ENUM (
  'super_admin',    -- Highest level access
  'it_head',        -- IT department head
  'sys_admin',      -- System administrator
  'developer',      -- Developer role
  'coordinator',    -- Project coordinator
  'leader',         -- Team leader
  'member'          -- Regular member (default)
);
```

## Database Functions

### 1. Member Invitation Functions

#### `create_member_invitation()` - Admin Creates Invitation
```sql
CREATE OR REPLACE FUNCTION public.create_member_invitation(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_college TEXT,
    p_department TEXT,
    p_year INTEGER,
    p_intended_role TEXT DEFAULT 'member',
    p_notes TEXT DEFAULT NULL
) RETURNS JSON
```

**Purpose:** Allows admins to create member invitations
**Security:** Requires admin role (super_admin, it_head, sys_admin)
**Returns:** JSON with success status and invitation details

#### `create_member_request()` - User Submits Request
```sql
CREATE OR REPLACE FUNCTION public.create_member_request(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_college TEXT,
    p_department TEXT,
    p_year INTEGER,
    p_notes TEXT DEFAULT NULL
) RETURNS JSON
```

**Purpose:** Allows regular users to submit member requests
**Security:** Requires authenticated user
**Returns:** JSON with success status and request details

#### `get_member_invitations()` - Retrieve Invitations
```sql
CREATE OR REPLACE FUNCTION public.get_member_invitations(
    p_status TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (...)
```

**Purpose:** Retrieves member invitations for admin review
**Security:** Requires admin role
**Returns:** Table of invitation records with creator details

#### `approve_member_request()` - Approve Request
```sql
CREATE OR REPLACE FUNCTION public.approve_member_request(
    p_invitation_id UUID,
    p_approved_role TEXT DEFAULT 'member'
) RETURNS JSON
```

**Purpose:** Allows admins to approve pending member requests
**Security:** Requires admin role
**Returns:** JSON with success status

#### `reject_member_request()` - Reject Request
```sql
CREATE OR REPLACE FUNCTION public.reject_member_request(
    p_invitation_id UUID,
    p_reason TEXT DEFAULT NULL
) RETURNS JSON
```

**Purpose:** Allows admins to reject member requests
**Security:** Requires admin role
**Returns:** JSON with success status

### 2. Utility Functions

#### `accept_member_invitation()` - Accept Invitation
```sql
CREATE OR REPLACE FUNCTION public.accept_member_invitation(
    invitation_token TEXT
) RETURNS JSON
```

**Purpose:** Handles invitation acceptance by new members
**Security:** Requires authenticated user
**Process:**
1. Validates invitation token and expiration
2. Creates or updates user profile
3. Assigns intended role
4. Updates invitation status to 'accepted'

#### `cleanup_expired_invitations()` - Cleanup Function
```sql
CREATE OR REPLACE FUNCTION public.cleanup_expired_invitations()
RETURNS void
```

**Purpose:** Automatically marks expired invitations
**Usage:** Can be called via cron job or scheduled task

#### `has_role()` & `is_admin()` - Permission Checks
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role) RETURNS BOOLEAN
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID) RETURNS BOOLEAN
```

**Purpose:** Security functions for role-based access control
**Usage:** Used in RLS policies and application logic

## Row Level Security (RLS) Policies

### Profiles Table Policies
```sql
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can create invitation profiles
CREATE POLICY "Admins can create invitation profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'it_head', 'sys_admin'))
    OR user_id = auth.uid()
  );
```

### Member Invitations Policies
```sql
-- Admins can view all invitations
CREATE POLICY "Admins can view all member invitations" ON public.member_invitations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'it_head', 'sys_admin'))
  );

-- Users can view their own invitations
CREATE POLICY "Users can view their own invitations" ON public.member_invitations
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admins can create invitations
CREATE POLICY "Admins can create member invitations" ON public.member_invitations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'it_head', 'sys_admin'))
  );

-- Regular users can create member requests
CREATE POLICY "Users can create member requests" ON public.member_invitations
  FOR INSERT WITH CHECK (invitation_type = 'member_request' AND auth.uid() IS NOT NULL);
```

## Data Flow & Workflows

### 1. Admin Invitation Workflow
```
1. Admin creates invitation → create_member_invitation()
2. Invitation stored with status 'invited'
3. Email sent to invitee (external process)
4. User registers and accepts → accept_member_invitation()
5. Profile created with status 'active'
6. Role assigned if specified
```

### 2. Member Request Workflow
```
1. User submits request → create_member_request()
2. Request stored with status 'pending'
3. Admin reviews request
4. Admin approves → approve_member_request()
5. Status changed to 'invited'
6. User can now register and activate account
```

### 3. Member Lifecycle States
```
pending → invited → accepted → active
    ↓         ↓
rejected   expired
```

## Security Features

### 1. Authentication & Authorization
- ✅ JWT-based authentication via Supabase Auth
- ✅ Role-based access control (RBAC)
- ✅ Row Level Security (RLS) policies
- ✅ Function-level security with SECURITY DEFINER

### 2. Data Validation
- ✅ Email uniqueness constraints
- ✅ Year validation (1-7 range)
- ✅ Status enum constraints
- ✅ Role enum constraints
- ✅ Required field validation

### 3. Audit Trail
- ✅ Creator tracking for all invitations
- ✅ Timestamp tracking (created_at, updated_at)
- ✅ Status change history
- ✅ Notes field for additional context

### 4. Token Security
- ✅ UUID-based invitation tokens
- ✅ Automatic token expiration (7 days)
- ✅ Unique token constraints
- ✅ Secure token generation

## Performance Optimizations

### 1. Database Indexes
- ✅ Email indexes for fast lookups
- ✅ Status indexes for filtering
- ✅ Foreign key indexes for joins
- ✅ Token indexes for invitation validation

### 2. Query Optimization
- ✅ Efficient RLS policies
- ✅ Proper use of SECURITY DEFINER functions
- ✅ Pagination support in get_member_invitations()
- ✅ Optimized joins between tables

### 3. Automatic Maintenance
- ✅ Automatic timestamp updates via triggers
- ✅ Expired invitation cleanup function
- ✅ Cascade deletes for data consistency

## Integration with Members.tsx

### 1. Data Fetching
```typescript
// Fetch existing profiles
const { data: profiles } = await supabase
  .from('profiles')
  .select('*, user_roles(role)')
  .order('created_at', { ascending: false });

// Fetch member invitations (admin only)
const { data: invitations } = await (supabase as any).rpc('get_member_invitations', {
  p_status: null,
  p_limit: 100,
  p_offset: 0
});
```

### 2. Member Addition
```typescript
// Admin creates invitation
const { data, error } = await (supabase as any).rpc('create_member_invitation', {
  p_full_name: name,
  p_email: email,
  p_college: college,
  p_department: department,
  p_year: year,
  p_intended_role: role,
  p_notes: notes
});

// Regular user creates request
const { data, error } = await (supabase as any).rpc('create_member_request', {
  p_full_name: name,
  p_email: email,
  p_college: college,
  p_department: department,
  p_year: year,
  p_notes: notes
});
```

### 3. Status Management
```typescript
// Approve member request
const { error } = await supabase
  .from('profiles')
  .update({ status: 'active' })
  .eq('id', memberId)
  .eq('status', 'pending');

// Reject member request
const { error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', memberId)
  .eq('status', 'pending');
```

## Maintenance & Monitoring

### 1. Regular Tasks
- Monitor invitation expiration rates
- Clean up expired invitations periodically
- Review member request approval times
- Monitor role assignment patterns

### 2. Performance Monitoring
- Track query performance on large datasets
- Monitor RLS policy efficiency
- Review index usage and optimization
- Monitor function execution times

### 3. Security Auditing
- Regular review of RLS policies
- Monitor failed authentication attempts
- Review role assignment changes
- Audit invitation token usage

## Conclusion

This database schema provides a robust, secure, and scalable foundation for the Members.tsx functionality, supporting:

- ✅ Complete member lifecycle management
- ✅ Secure invitation and request workflows
- ✅ Role-based access control
- ✅ Comprehensive audit trails
- ✅ Performance optimization
- ✅ Data integrity and validation
- ✅ Automatic maintenance and cleanup

The schema is designed to handle both admin-initiated invitations and user-submitted requests while maintaining security, performance, and data consistency throughout the member management process.