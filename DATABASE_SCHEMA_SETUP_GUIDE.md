# Database Schema Setup Guide for Admin Member Addition

## 📋 Overview

This guide explains how to set up the proper database schema for the admin member addition functionality in the HUMSJ IT Management System.

## 🗄️ Database Structure

### **1. member_invitations Table**

This is the main table for managing member invitations and requests.

**Fields:**
- `id` (UUID) - Primary key
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp
- `full_name` (TEXT) - Member's full name
- `email` (TEXT) - Member's email (unique)
- `phone` (TEXT) - Member's phone number (optional)
- `college` (TEXT) - College name
- `department` (TEXT) - Department name
- `year` (INTEGER) - Academic year (1-7)
- `status` (TEXT) - Invitation status: pending, invited, accepted, rejected, expired
- `invitation_type` (TEXT) - Type: admin_invite or member_request
- `intended_role` (TEXT) - Role to assign: super_admin, it_head, sys_admin, developer, coordinator, leader, member
- `created_by` (UUID) - Admin who created the invitation
- `invitation_token` (TEXT) - Unique token for email verification
- `token_expires_at` (TIMESTAMPTZ) - Token expiration date (7 days)
- `notes` (TEXT) - Additional notes
- `bio` (TEXT) - Bio information

### **2. profiles Table Updates**

The profiles table is updated to support invitations:

**New Fields:**
- `invitation_id` (UUID) - Reference to member_invitations
- `invitation_accepted_at` (TIMESTAMPTZ) - When invitation was accepted
- `created_by` (UUID) - Who created the profile

**Updated Fields:**
- `user_id` - Now nullable to support invitations before registration
- `status` - Now includes: active, inactive, alumni, invited, pending, suspended

## 🚀 Installation Steps

### **Step 1: Run Migrations in Supabase**

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the migrations in order:

#### Migration 1: Create member_invitations table
```sql
-- Copy and paste content from:
supabase/migrations/20241220000001_create_member_invitations_table.sql
```

#### Migration 2: Update profiles table
```sql
-- Copy and paste content from:
supabase/migrations/20241220000002_update_profiles_table.sql
```

#### Migration 3: Create management functions
```sql
-- Copy and paste content from:
supabase/migrations/20241220000003_create_member_management_functions.sql
```

### **Step 2: Verify Installation**

Run this query to verify the tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('member_invitations', 'profiles');
```

### **Step 3: Test Functions**

Test the invitation creation function:

```sql
SELECT public.create_member_invitation(
    'Test User',
    'test@example.com',
    '+251912345678',
    'College of Computing',
    'Software Engineering',
    3,
    'member',
    'Test invitation'
);
```

## 🔧 Available Functions

### **1. create_member_invitation()**
Creates a new member invitation (admin only)

**Parameters:**
- `p_full_name` (TEXT) - Required
- `p_email` (TEXT) - Required
- `p_phone` (TEXT) - Optional
- `p_college` (TEXT) - Required
- `p_department` (TEXT) - Required
- `p_year` (INTEGER) - Required
- `p_intended_role` (TEXT) - Optional, default: 'member'
- `p_notes` (TEXT) - Optional

**Returns:** JSON with success status and invitation details

### **2. create_member_request()**
Creates a member request (regular users)

**Parameters:**
- Same as create_member_invitation except no intended_role

**Returns:** JSON with success status and request details

### **3. approve_member_request()**
Approves a pending member request (admin only)

**Parameters:**
- `p_invitation_id` (UUID) - Required
- `p_approved_role` (TEXT) - Optional, default: 'member'

**Returns:** JSON with success status

### **4. reject_member_request()**
Rejects a pending member request (admin only)

**Parameters:**
- `p_invitation_id` (UUID) - Required
- `p_reason` (TEXT) - Optional

**Returns:** JSON with success status

### **5. accept_member_invitation()**
Accepts an invitation (user with token)

**Parameters:**
- `invitation_token` (TEXT) - Required

**Returns:** JSON with success status and profile details

### **6. get_member_invitations()**
Gets list of invitations (admin only)

**Parameters:**
- `p_status` (TEXT) - Optional filter
- `p_limit` (INTEGER) - Optional, default: 50
- `p_offset` (INTEGER) - Optional, default: 0

**Returns:** Table of invitations

## 🔒 Security (RLS Policies)

### **member_invitations Table:**

1. **Admins can view all invitations**
   - Allows super_admin, it_head, sys_admin to SELECT

2. **Admins can create invitations**
   - Allows super_admin, it_head, sys_admin to INSERT

3. **Admins can update invitations**
   - Allows super_admin, it_head, sys_admin to UPDATE

4. **Users can view their own invitations**
   - Users can SELECT invitations matching their email

5. **Users can create member requests**
   - Authenticated users can INSERT with invitation_type = 'member_request'

### **profiles Table:**

1. **Admins can create invitation profiles**
   - Allows admins to INSERT profiles for invitations

2. **Admins can view all profiles**
   - Allows admins to SELECT all profiles

3. **Admins can update profiles**
   - Allows admins to UPDATE profiles

4. **Users can manage their own profiles**
   - Users can SELECT and UPDATE their own profiles

## 📊 Workflow

### **Admin Creates Invitation:**

1. Admin fills out member form
2. System calls `create_member_invitation()` function
3. Invitation record created with status 'invited'
4. Invitation token generated
5. Email sent to member with invitation link
6. Member clicks link and registers
7. System calls `accept_member_invitation()` function
8. Profile created/updated with user_id
9. Role assigned if specified
10. Invitation status updated to 'accepted'

### **User Creates Request:**

1. User fills out member form
2. System calls `create_member_request()` function
3. Request record created with status 'pending'
4. Admin reviews request
5. Admin approves: calls `approve_member_request()`
6. Status changes to 'invited'
7. Invitation email sent
8. User accepts invitation
9. Profile activated

## 🧪 Testing

### **Test Admin Invitation:**

```sql
-- Create invitation
SELECT public.create_member_invitation(
    'Ahmed Hassan',
    'ahmed@hu.edu.et',
    '+251912345678',
    'College of Computing',
    'Software Engineering',
    3,
    'developer',
    'IT Team Member'
);

-- View invitations
SELECT * FROM public.get_member_invitations('invited', 10, 0);
```

### **Test Member Request:**

```sql
-- Create request
SELECT public.create_member_request(
    'Fatima Ali',
    'fatima@hu.edu.et',
    '+251923456789',
    'College of Business',
    'Accounting',
    2,
    'New member request'
);

-- Approve request
SELECT public.approve_member_request(
    '<invitation_id>',
    'member'
);
```

## 🔄 Maintenance

### **Clean Up Expired Invitations:**

Run periodically (e.g., daily cron job):

```sql
SELECT public.cleanup_expired_invitations();
```

### **View Statistics:**

```sql
-- Count by status
SELECT status, COUNT(*) 
FROM public.member_invitations 
GROUP BY status;

-- Recent invitations
SELECT * FROM public.member_invitations 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🐛 Troubleshooting

### **Issue: Permission Denied**

**Solution:** Ensure user has proper role in user_roles table:

```sql
SELECT * FROM public.user_roles WHERE user_id = auth.uid();
```

### **Issue: Email Already Exists**

**Solution:** Check both tables:

```sql
SELECT 'profiles' as source, email FROM public.profiles WHERE email = 'test@example.com'
UNION
SELECT 'invitations' as source, email FROM public.member_invitations WHERE email = 'test@example.com';
```

### **Issue: Token Expired**

**Solution:** Create new invitation or extend expiration:

```sql
UPDATE public.member_invitations 
SET token_expires_at = timezone('utc'::text, now()) + interval '7 days'
WHERE invitation_token = '<token>';
```

## 📝 Notes

- Invitation tokens expire after 7 days
- Expired invitations are automatically marked as 'expired'
- Admins can create invitations directly
- Regular users create requests that need approval
- All operations are logged with timestamps
- RLS policies ensure data security

## ✅ Checklist

- [ ] Run migration 1 (create member_invitations table)
- [ ] Run migration 2 (update profiles table)
- [ ] Run migration 3 (create management functions)
- [ ] Verify tables exist
- [ ] Test create_member_invitation function
- [ ] Test create_member_request function
- [ ] Test approve/reject functions
- [ ] Verify RLS policies are active
- [ ] Update frontend code to use new functions
- [ ] Test complete workflow end-to-end

---

**Status**: Ready for Implementation
**Date**: December 20, 2024
**Version**: 1.0.0