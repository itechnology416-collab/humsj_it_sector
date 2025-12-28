import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analyticsApi } from './analyticsApi';

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  permissions: string[];
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  resource?: string;
  action?: string;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  
  // Joined data
  role?: Role;
  user?: { full_name: string; email: string };
  assigned_by_user?: { full_name: string; email: string };
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  granted_at: string;
  granted_by?: string;
  
  // Joined data
  permission?: Permission;
}

class RoleManagementApiService {
  // Roles
  async getRoles(includeUserCount: boolean = false): Promise<Role[]> {
    try {
      const query = supabase
        .from('roles')
        .select('*')
        .eq('is_active', true)
        .order('name');

      const { data, error } = await query;

      if (error) throw error;

      let roles = data || [];

      // Get user counts if requested
      if (includeUserCount) {
        const { data: userCounts } = await supabase
          .from('user_role_assignments')
          .select('role_id')
          .eq('is_active', true);

        const countMap = (userCounts || []).reduce((acc: Record<string, number>, assignment) => {
          acc[assignment.role_id] = (acc[assignment.role_id] || 0) + 1;
          return acc;
        }, {});

        roles = roles.map(role => ({
          ...role,
          user_count: countMap[role.id] || 0
        }));
      }

      return roles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw errorHandler.handleError(error, 'Failed to fetch roles');
    }
  }

  async getRoleById(roleId: string): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching role by ID:', error);
      throw errorHandler.handleError(error, 'Failed to fetch role');
    }
  }

  async createRole(roleData: {
    name: string;
    display_name: string;
    description?: string;
    permissions?: string[];
  }): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert([{
          ...roleData,
          permissions: roleData.permissions || []
        }])
        .select()
        .single();

      if (error) throw error;

      // If permissions are provided, create role-permission relationships
      if (roleData.permissions && roleData.permissions.length > 0) {
        await this.assignPermissionsToRole(data.id, roleData.permissions);
      }

      await analyticsApi.trackEvent('role_created', 'role_management', {
        role_name: roleData.name,
        permission_count: roleData.permissions?.length || 0
      });

      return data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw errorHandler.handleError(error, 'Failed to create role');
    }
  }

  async updateRole(roleId: string, updates: Partial<Role>): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', roleId)
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('role_updated', 'role_management', {
        role_id: roleId,
        updated_fields: Object.keys(updates)
      });

      return data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw errorHandler.handleError(error, 'Failed to update role');
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      // Check if role is system role
      const role = await this.getRoleById(roleId);
      if (role.is_system) {
        throw new Error('Cannot delete system roles');
      }

      // Check if role has users assigned
      const { data: assignments } = await supabase
        .from('user_role_assignments')
        .select('id')
        .eq('role_id', roleId)
        .eq('is_active', true);

      if (assignments && assignments.length > 0) {
        throw new Error('Cannot delete role with active user assignments');
      }

      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      await analyticsApi.trackEvent('role_deleted', 'role_management', {
        role_id: roleId
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      throw errorHandler.handleError(error, 'Failed to delete role');
    }
  }

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('display_name', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw errorHandler.handleError(error, 'Failed to fetch permissions');
    }
  }

  async getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
    try {
      const permissions = await this.getPermissions();
      
      return permissions.reduce((acc: Record<string, Permission[]>, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching permissions by category:', error);
      throw errorHandler.handleError(error, 'Failed to fetch permissions by category');
    }
  }

  async createPermission(permissionData: {
    name: string;
    display_name: string;
    description?: string;
    category: string;
    resource?: string;
    action?: string;
  }): Promise<Permission> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .insert([permissionData])
        .select()
        .single();

      if (error) throw error;

      await analyticsApi.trackEvent('permission_created', 'role_management', {
        permission_name: permissionData.name,
        category: permissionData.category
      });

      return data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw errorHandler.handleError(error, 'Failed to create permission');
    }
  }

  // Role Permissions
  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          *,
          permission:permissions(*)
        `)
        .eq('role_id', roleId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      throw errorHandler.handleError(error, 'Failed to fetch role permissions');
    }
  }

  async assignPermissionsToRole(roleId: string, permissionNames: string[]): Promise<void> {
    try {
      // Get permission IDs from names
      const { data: permissions, error: permError } = await supabase
        .from('permissions')
        .select('id, name')
        .in('name', permissionNames);

      if (permError) throw permError;

      if (!permissions || permissions.length === 0) {
        throw new Error('No valid permissions found');
      }

      const { data: user } = await supabase.auth.getUser();

      // Create role-permission relationships
      const rolePermissions = permissions.map(permission => ({
        role_id: roleId,
        permission_id: permission.id,
        granted_by: user.user?.id
      }));

      const { error } = await supabase
        .from('role_permissions')
        .upsert(rolePermissions);

      if (error) throw error;

      await analyticsApi.trackEvent('permissions_assigned_to_role', 'role_management', {
        role_id: roleId,
        permission_count: permissions.length,
        permissions: permissionNames
      });
    } catch (error) {
      console.error('Error assigning permissions to role:', error);
      throw errorHandler.handleError(error, 'Failed to assign permissions to role');
    }
  }

  async removePermissionsFromRole(roleId: string, permissionNames: string[]): Promise<void> {
    try {
      // Get permission IDs from names
      const { data: permissions, error: permError } = await supabase
        .from('permissions')
        .select('id, name')
        .in('name', permissionNames);

      if (permError) throw permError;

      if (!permissions || permissions.length === 0) {
        return; // No permissions to remove
      }

      const permissionIds = permissions.map(p => p.id);

      const { error } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId)
        .in('permission_id', permissionIds);

      if (error) throw error;

      await analyticsApi.trackEvent('permissions_removed_from_role', 'role_management', {
        role_id: roleId,
        permission_count: permissions.length,
        permissions: permissionNames
      });
    } catch (error) {
      console.error('Error removing permissions from role:', error);
      throw errorHandler.handleError(error, 'Failed to remove permissions from role');
    }
  }

  // User Role Assignments
  async getUserRoleAssignments(userId?: string): Promise<UserRoleAssignment[]> {
    try {
      let query = supabase
        .from('user_role_assignments')
        .select(`
          *,
          role:roles(*),
          user:profiles!user_role_assignments_user_id_fkey(full_name, email),
          assigned_by_user:profiles!user_role_assignments_assigned_by_fkey(full_name, email)
        `)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user role assignments:', error);
      throw errorHandler.handleError(error, 'Failed to fetch user role assignments');
    }
  }

  async assignRoleToUser(userId: string, roleId: string, expiresAt?: string): Promise<UserRoleAssignment> {
    try {
      const { data: user } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('user_role_assignments')
        .upsert([{
          user_id: userId,
          role_id: roleId,
          assigned_by: user.user?.id,
          expires_at: expiresAt,
          is_active: true
        }])
        .select(`
          *,
          role:roles(*),
          user:profiles!user_role_assignments_user_id_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      // Update user's role in profiles table for quick access
      await supabase
        .from('profiles')
        .update({ role: (await this.getRoleById(roleId)).name })
        .eq('id', userId);

      await analyticsApi.trackEvent('role_assigned_to_user', 'role_management', {
        user_id: userId,
        role_id: roleId,
        expires_at: expiresAt
      });

      return data;
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw errorHandler.handleError(error, 'Failed to assign role to user');
    }
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_role_assignments')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) throw error;

      // Update user's role in profiles table to default
      await supabase
        .from('profiles')
        .update({ role: 'member' })
        .eq('id', userId);

      await analyticsApi.trackEvent('role_removed_from_user', 'role_management', {
        user_id: userId,
        role_id: roleId
      });
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw errorHandler.handleError(error, 'Failed to remove role from user');
    }
  }

  async bulkAssignRole(userIds: string[], roleId: string, expiresAt?: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();

      const assignments = userIds.map(userId => ({
        user_id: userId,
        role_id: roleId,
        assigned_by: user.user?.id,
        expires_at: expiresAt,
        is_active: true
      }));

      const { error } = await supabase
        .from('user_role_assignments')
        .upsert(assignments);

      if (error) throw error;

      // Update profiles table
      const role = await this.getRoleById(roleId);
      await supabase
        .from('profiles')
        .update({ role: role.name })
        .in('id', userIds);

      await analyticsApi.trackEvent('bulk_role_assignment', 'role_management', {
        user_count: userIds.length,
        role_id: roleId
      });
    } catch (error) {
      console.error('Error bulk assigning roles:', error);
      throw errorHandler.handleError(error, 'Failed to bulk assign roles');
    }
  }

  // User Permissions
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        user_uuid: userId
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw errorHandler.handleError(error, 'Failed to fetch user permissions');
    }
  }

  async checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      return permissions.includes(permissionName);
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  }

  // Role Analytics
  async getRoleAnalytics(): Promise<{
    total_roles: number;
    system_roles: number;
    custom_roles: number;
    total_permissions: number;
    role_distribution: Array<{ role_name: string; user_count: number }>;
    permission_usage: Array<{ permission_name: string; role_count: number }>;
  }> {
    try {
      const [roles, permissions, assignments, rolePermissions] = await Promise.all([
        this.getRoles(true),
        this.getPermissions(),
        this.getUserRoleAssignments(),
        supabase.from('role_permissions').select('role_id, permission_id')
      ]);

      // Role distribution
      const roleDistribution = roles.map(role => ({
        role_name: role.display_name,
        user_count: role.user_count || 0
      }));

      // Permission usage
      const permissionUsage = permissions.map(permission => {
        const roleCount = (rolePermissions.data || []).filter(rp => 
          rp.permission_id === permission.id
        ).length;
        
        return {
          permission_name: permission.display_name,
          role_count: roleCount
        };
      });

      return {
        total_roles: roles.length,
        system_roles: roles.filter(r => r.is_system).length,
        custom_roles: roles.filter(r => !r.is_system).length,
        total_permissions: permissions.length,
        role_distribution: roleDistribution,
        permission_usage: permissionUsage.sort((a, b) => b.role_count - a.role_count)
      };
    } catch (error) {
      console.error('Error fetching role analytics:', error);
      throw errorHandler.handleError(error, 'Failed to fetch role analytics');
    }
  }

  // Role Templates
  async createRoleFromTemplate(templateName: string, customizations?: {
    name?: string;
    display_name?: string;
    description?: string;
    additional_permissions?: string[];
    excluded_permissions?: string[];
  }): Promise<Role> {
    try {
      const templates = {
        content_manager: {
          name: 'content_manager',
          display_name: 'Content Manager',
          description: 'Manage website content and publications',
          permissions: ['content.create', 'content.read', 'content.update', 'content.publish']
        },
        moderator: {
          name: 'moderator',
          display_name: 'Moderator',
          description: 'Moderate user content and interactions',
          permissions: ['content.read', 'content.approve', 'users.read']
        },
        analyst: {
          name: 'analyst',
          display_name: 'Analyst',
          description: 'View analytics and generate reports',
          permissions: ['analytics.view', 'content.read', 'users.read']
        }
      };

      const template = templates[templateName as keyof typeof templates];
      if (!template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      let permissions = [...template.permissions];
      
      // Add additional permissions
      if (customizations?.additional_permissions) {
        permissions = [...permissions, ...customizations.additional_permissions];
      }
      
      // Remove excluded permissions
      if (customizations?.excluded_permissions) {
        permissions = permissions.filter(p => !customizations.excluded_permissions!.includes(p));
      }

      const roleData = {
        name: customizations?.name || template.name,
        display_name: customizations?.display_name || template.display_name,
        description: customizations?.description || template.description,
        permissions: [...new Set(permissions)] // Remove duplicates
      };

      return await this.createRole(roleData);
    } catch (error) {
      console.error('Error creating role from template:', error);
      throw errorHandler.handleError(error, 'Failed to create role from template');
    }
  }
}

export const roleManagementApi = new RoleManagementApiService();