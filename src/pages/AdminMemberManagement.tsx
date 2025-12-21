import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import useMembers, { type Member, type CreateMemberData } from "@/hooks/useMembers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Crown,
  Shield,
  Settings,
  TrendingUp,
  UserCheck,
  Save,
  Loader2,
  RefreshCw,
  MoreVertical,
  Ban,
  UserX,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig = {
  active: { label: "Active", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  inactive: { label: "Inactive", color: "bg-gray-500/20 text-gray-400", icon: Clock },
  alumni: { label: "Alumni", color: "bg-blue-500/20 text-blue-400", icon: GraduationCap },
  invited: { label: "Invited", color: "bg-amber-500/20 text-amber-400", icon: Mail },
  pending: { label: "Pending", color: "bg-purple-500/20 text-purple-400", icon: Clock },
  suspended: { label: "Suspended", color: "bg-red-500/20 text-red-400", icon: Ban },
};

const roleConfig = {
  super_admin: { label: "Super Admin", color: "bg-red-500/20 text-red-400", icon: Crown },
  it_head: { label: "IT Head", color: "bg-purple-500/20 text-purple-400", icon: Crown },
  sys_admin: { label: "System Admin", color: "bg-blue-500/20 text-blue-400", icon: Shield },
  developer: { label: "Developer", color: "bg-green-500/20 text-green-400", icon: Settings },
  coordinator: { label: "Coordinator", color: "bg-amber-500/20 text-amber-400", icon: UserCheck },
  leader: { label: "Leader", color: "bg-indigo-500/20 text-indigo-400", icon: Award },
  member: { label: "Member", color: "bg-gray-500/20 text-gray-400", icon: Users },
};

const colleges = [
  "All Colleges",
  "College of Computing and Informatics",
  "College of Business",
  "College of Health Sciences",
  "College of Agriculture",
  "College of Law",
  "College of Engineering",
];

export default function AdminMemberManagement() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    combinedMembers,
    stats,
    isLoading,
    error,
    createMemberInvitation,
    approveMemberRequest,
    rejectMemberRequest,
    updateMemberProfile,
    deleteMember,
    filterMembers,
    refreshData,
    clearError
  } = useMembers();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("All Colleges");
  const [selectedRole, setSelectedRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "alumni" | "invited" | "pending" | "suspended">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<CreateMemberData>({
    full_name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: 1,
    intended_role: "member",
    notes: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleAddMember = async () => {
    if (!newMember.full_name || !newMember.email || !newMember.college || !newMember.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAdding(true);
    try {
      await createMemberInvitation(newMember);
      setNewMember({
        full_name: "",
        email: "",
        phone: "",
        college: "",
        department: "",
        year: 1,
        intended_role: "member",
        notes: ""
      });
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedMembers.length === 0) {
      toast.error("Please select members first");
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedMembers.length} member(s)?`;
    if (!confirm(confirmMessage)) return;

    try {
      for (const memberId of selectedMembers) {
        if (action === "delete") {
          await deleteMember(memberId);
        } else {
          const member = combinedMembers.find(m => m.id === memberId);
          if (member) {
            await updateMemberProfile(memberId, {
              ...member,
              status: action === "activate" ? "active" : "inactive"
            });
          }
        }
      }
      setSelectedMembers([]);
      toast.success(`Successfully ${action}d ${selectedMembers.length} member(s)`);
    } catch (error: any) {
      toast.error(`Failed to ${action} members: ${error.message}`);
    }
  };

  const filteredMembers = filterMembers({
    searchQuery,
    college: selectedCollege,
    status: statusFilter === "all" ? undefined : statusFilter,
    role: selectedRole === "all" ? undefined : selectedRole
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <PageLayout 
      title="Member Management" 
      subtitle="Comprehensive member administration and oversight"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Users size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Member Administration</h2>
              <p className="text-sm text-muted-foreground">Manage community members and access control</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/role-management")}
              className="gap-2"
            >
              <Shield size={16} />
              Roles
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <UserPlus size={16} />
              Add Member
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearError}>×</Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: "Total Members", value: stats.totalMembers, icon: Users, color: "text-primary" },
            { label: "Active", value: stats.activeMembers, icon: UserCheck, color: "text-green-400" },
            { label: "Pending Invites", value: stats.pendingInvitations, icon: Mail, color: "text-blue-400" },
            { label: "Pending Requests", value: stats.pendingRequests, icon: Clock, color: "text-amber-400" },
            { label: "Recent Joins", value: stats.recentJoins, icon: TrendingUp, color: "text-purple-400" },
            { label: "Selected", value: selectedMembers.length, icon: CheckCircle, color: "text-indigo-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
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

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none"
            >
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none"
            >
              <option value="all">All Roles</option>
              {Object.entries(roleConfig).map(([role, config]) => (
                <option key={role} value={role}>{config.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={refreshData} disabled={isLoading} className="gap-2">
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload size={16} />
              Import
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "inactive", "alumni", "invited", "pending", "suspended"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 text-xs opacity-70">
                ({status === "all" ? combinedMembers.length : combinedMembers.filter(m => m.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedMembers.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedMembers.length} member(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkAction("activate")} className="bg-green-500 hover:bg-green-600">
                Activate
              </Button>
              <Button size="sm" onClick={() => handleBulkAction("deactivate")} variant="outline">
                Deactivate
              </Button>
              <Button size="sm" onClick={() => handleBulkAction("delete")} variant="outline" className="text-red-400 hover:text-red-300">
                Delete
              </Button>
              <Button size="sm" onClick={() => setSelectedMembers([])} variant="ghost">
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member, index) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              delay={index * 50}
              isSelected={selectedMembers.includes(member.id)}
              onSelect={(selected) => {
                if (selected) {
                  setSelectedMembers(prev => [...prev, member.id]);
                } else {
                  setSelectedMembers(prev => prev.filter(id => id !== member.id));
                }
              }}
              onEdit={() => {
                setEditingMember(member);
                setIsEditModalOpen(true);
              }}
              onDelete={() => deleteMember(member.id)}
              onApprove={() => approveMemberRequest(member.id)}
              onReject={() => rejectMemberRequest(member.id)}
            />
          ))}
        </div>

        {/* No Results */}
        {!isLoading && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No members found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Add Member Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Create a member invitation that will be sent to the new member's email.
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newMember.full_name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Ahmed Hassan"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ahmed@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+251 912 345 678"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Select value={newMember.year.toString()} onValueChange={(value) => setNewMember(prev => ({ ...prev, year: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="college">College *</Label>
                <Select value={newMember.college} onValueChange={(value) => setNewMember(prev => ({ ...prev, college: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.slice(1).map(college => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={newMember.department}
                  onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Software Engineering"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newMember.intended_role} onValueChange={(value) => setNewMember(prev => ({ ...prev, intended_role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([role, config]) => (
                      <SelectItem key={role} value={role}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newMember.notes}
                  onChange={(e) => setNewMember(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional information..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAddMember} 
                  disabled={isAdding}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Add Member
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isAdding}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}

interface MemberCardProps {
  member: Member;
  delay: number;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function MemberCard({ member, delay, isSelected, onSelect, onEdit, onDelete, onApprove, onReject }: MemberCardProps) {
  const status = statusConfig[member.status];
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const StatusIcon = status.icon;
  const RoleIcon = role.icon;

  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up",
        isSelected ? "border-primary bg-primary/5" : "border-border/30 hover:border-primary/50"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-border"
          />
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {member.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{member.full_name}</h3>
            <div className="flex items-center gap-1">
              <RoleIcon size={12} className={role.color.split(' ')[1]} />
              <span className="text-xs text-muted-foreground">{role.label}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Edit size={14} className="text-muted-foreground" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2.5 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail size={14} />
          <span className="truncate">{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone size={14} />
            <span>{member.phone}</span>
          </div>
        )}
        {member.department && member.year && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap size={14} />
            <span className="truncate">{member.department} • Year {member.year}</span>
          </div>
        )}
        {member.college && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={14} />
            <span className="truncate">{member.college}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
        </div>
        <span className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium", status.color)}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>

      {/* Admin Actions for Pending */}
      {member.status === 'pending' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button size="sm" onClick={onApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle size={14} className="mr-1" />
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={onReject} className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
            <UserX size={14} className="mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}