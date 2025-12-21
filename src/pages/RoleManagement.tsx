import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Shield, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Crown,
  Key,
  UserCheck,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access and control",
    permissions: ["all"],
    userCount: 3,
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: "2", 
    name: "Amir",
    description: "Leadership and organizational oversight",
    permissions: ["user_management", "event_management", "content_approval", "financial_oversight"],
    userCount: 2,
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "IT Coordinator",
    description: "Technical system management",
    permissions: ["system_monitoring", "backup_management", "user_support", "content_management"],
    userCount: 4,
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: "4",
    name: "Da'wa Coordinator",
    description: "Islamic outreach and education management",
    permissions: ["content_management", "event_management", "library_management", "volunteer_coordination"],
    userCount: 6,
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: "5",
    name: "Member",
    description: "Standard community member access",
    permissions: ["basic_access", "event_participation", "resource_access"],
    userCount: 385,
    isSystem: true,
    createdAt: "2024-01-01"
  }
];

const mockPermissions: Permission[] = [
  { id: "1", name: "User Management", category: "Administration", description: "Create, edit, and manage user accounts" },
  { id: "2", name: "Role Assignment", category: "Administration", description: "Assign and modify user roles" },
  { id: "3", name: "System Settings", category: "Administration", description: "Configure system-wide settings" },
  { id: "4", name: "Event Management", category: "Events", description: "Create and manage community events" },
  { id: "5", name: "Event Approval", category: "Events", description: "Approve user-submitted events" },
  { id: "6", name: "Content Management", category: "Content", description: "Manage website content and pages" },
  { id: "7", name: "Content Approval", category: "Content", description: "Review and approve user content" },
  { id: "8", name: "Library Management", category: "Content", description: "Manage Islamic knowledge library" },
  { id: "9", name: "Financial Oversight", category: "Finance", description: "View and manage financial records" },
  { id: "10", name: "Donation Management", category: "Finance", description: "Handle donation processing" },
  { id: "11", name: "Volunteer Coordination", category: "Community", description: "Manage volunteer activities" },
  { id: "12", name: "System Monitoring", category: "Technical", description: "Monitor system health and performance" },
  { id: "13", name: "Backup Management", category: "Technical", description: "Manage system backups and recovery" },
  { id: "14", name: "User Support", category: "Technical", description: "Provide technical support to users" }
];

export default function RoleManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return Crown;
      case 'amir': return Shield;
      case 'it coordinator': return Settings;
      case "da'wa coordinator": return UserCheck;
      default: return Users;
    }
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <PageLayout 
      title="Role & Permission Management" 
      subtitle="Manage user roles and access permissions"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Role Management</h2>
              <p className="text-sm text-muted-foreground">Configure access control and permissions</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/user-management")}
              className="gap-2"
            >
              <Users size={16} />
              User Management
            </Button>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              Create Role
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border/30">
              <div className="p-6 border-b border-border/30">
                <h3 className="font-display text-lg flex items-center gap-2">
                  <Key size={18} className="text-primary" />
                  System Roles ({filteredRoles.length})
                </h3>
              </div>
              <div className="divide-y divide-border/30">
                {filteredRoles.map((role, index) => {
                  const RoleIcon = getRoleIcon(role.name);
                  return (
                    <div 
                      key={role.id}
                      className={cn(
                        "p-6 hover:bg-secondary/50 transition-colors cursor-pointer animate-slide-up",
                        selectedRole?.id === role.id && "bg-primary/5 border-l-4 border-l-primary"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center",
                            role.isSystem ? "bg-primary/20" : "bg-secondary"
                          )}>
                            <RoleIcon size={20} className={role.isSystem ? "text-primary" : "text-muted-foreground"} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{role.name}</h4>
                              {role.isSystem && (
                                <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary">
                                  System
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {role.userCount} users
                              </span>
                              <span className="flex items-center gap-1">
                                <Key size={12} />
                                {role.permissions.length} permissions
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit size={14} />
                            Edit
                          </Button>
                          {!role.isSystem && (
                            <Button size="sm" variant="outline" className="gap-1 text-red-400 hover:text-red-300">
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Role Details / Permissions */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border/30 sticky top-6">
              {selectedRole ? (
                <div>
                  <div className="p-6 border-b border-border/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        {React.createElement(getRoleIcon(selectedRole.name), { size: 20, className: "text-primary" })}
                      </div>
                      <div>
                        <h3 className="font-display text-lg">{selectedRole.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedRole.userCount} users assigned</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Key size={16} className="text-primary" />
                      Permissions
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                        <div key={category}>
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">{category}</h5>
                          <div className="space-y-2">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center gap-2">
                                {selectedRole.permissions.includes('all') || selectedRole.permissions.includes(permission.name.toLowerCase().replace(' ', '_')) ? (
                                  <Check size={14} className="text-green-400" />
                                ) : (
                                  <X size={14} className="text-muted-foreground" />
                                )}
                                <span className="text-sm">{permission.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Select a Role</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a role from the list to view its permissions and details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Roles", value: roles.length.toString(), icon: Shield, color: "text-primary" },
            { label: "System Roles", value: roles.filter(r => r.isSystem).length.toString(), icon: Crown, color: "text-amber-400" },
            { label: "Custom Roles", value: roles.filter(r => !r.isSystem).length.toString(), icon: Users, color: "text-blue-400" },
            { label: "Total Permissions", value: permissions.length.toString(), icon: Key, color: "text-green-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-5 border border-border/30 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}