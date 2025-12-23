import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import useMembers, { type Member, type CreateMemberData } from "@/hooks/useMembers";
import { 
  Search, 
  UserPlus, 
  Download, 
  MoreVertical,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Save,
  Loader2,
  RefreshCw,
  Users,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig = {
  active: { label: "Active", color: "bg-primary/20 text-primary", icon: CheckCircle },
  inactive: { label: "Inactive", color: "bg-muted text-muted-foreground", icon: Clock },
  alumni: { label: "Alumni", color: "bg-accent/20 text-accent", icon: GraduationCap },
  invited: { label: "Invited", color: "bg-blue-500/20 text-blue-600", icon: Mail },
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-600", icon: Clock },
  suspended: { label: "Suspended", color: "bg-red-500/20 text-red-600", icon: AlertCircle },
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

const roles = [
  "All Roles",
  "member",
  "coordinator", 
  "leader",
  "developer",
  "it_head",
  "sys_admin",
  "super_admin"
];

export default function MembersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  // Use the custom hook for member management
  const {
    combinedMembers,
    stats,
    isLoading,
    error,
    createMemberInvitation,
    createMemberRequest,
    approveMemberRequest,
    rejectMemberRequest,
    updateMemberProfile,
    deleteMember,
    filterMembers,
    refreshData,
    clearError
  } = useMembers();

  // Local state for UI
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("All Colleges");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "alumni" | "invited" | "pending" | "suspended">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleAddMember = async () => {
    if (!newMember.full_name || !newMember.email || !newMember.college || !newMember.department || !newMember.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast.error("You must be logged in to add members");
      return;
    }

    setIsAdding(true);
    
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newMember.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Validate year is a number
      if (newMember.year < 1 || newMember.year > 7) {
        toast.error("Please select a valid academic year");
        return;
      }

      if (isAdmin) {
        // Admin creates member invitation
        await createMemberInvitation(newMember);
      } else {
        // Regular user creates member request
        await createMemberRequest(newMember);
      }

      // Reset form
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
      console.error('Error adding member:', error);
      toast.error(error.message || "Failed to add member. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleApproveMember = async (memberId: string) => {
    if (!isAdmin) {
      toast.error("Only admins can approve members");
      return;
    }

    try {
      await approveMemberRequest(memberId);
    } catch (error: any) {
      console.error('Error approving member:', error);
      toast.error(error.message || "Failed to approve member");
    }
  };

  const handleRejectMember = async (memberId: string) => {
    if (!isAdmin) {
      toast.error("Only admins can reject members");
      return;
    }

    try {
      await rejectMemberRequest(memberId, "Rejected by admin");
    } catch (error: any) {
      console.error('Error rejecting member:', error);
      toast.error(error.message || "Failed to reject member");
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      await updateMemberProfile(editingMember.id, editingMember);
      setIsEditModalOpen(false);
      setEditingMember(null);
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error(error.message || "Failed to update member");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!isAdmin) {
      toast.error("Only admins can delete members");
      return;
    }

    if (!confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteMember(memberId);
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error(error.message || "Failed to delete member");
    }
  };

  // Filter members based on current filters
  const filteredMembers = filterMembers({
    searchQuery,
    college: selectedCollege,
    status: statusFilter === "all" ? undefined : statusFilter,
    role: selectedRole === "All Roles" ? undefined : selectedRole
  });

  return (
    <PageLayout title="Members" subtitle="Manage HUMSJ Academic Sector members" currentPath={location.pathname} onNavigate={navigate}>
      <div className="space-y-6 animate-fade-in">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearError}>
              ×
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Members", value: stats.totalMembers, icon: Users, color: "bg-primary/20 text-primary" },
            { label: "Active", value: stats.activeMembers, icon: UserCheck, color: "bg-green-500/20 text-green-600" },
            { label: "Pending Invites", value: stats.pendingInvitations, icon: Mail, color: "bg-blue-500/20 text-blue-600" },
            { label: "Pending Requests", value: stats.pendingRequests, icon: Clock, color: "bg-yellow-500/20 text-yellow-600" },
            { label: "Recent Joins", value: stats.recentJoins, icon: TrendingUp, color: "bg-purple-500/20 text-purple-600" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2", stat.color)}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
              />
            </div>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="default"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button variant="outline" size="default">
              <Download size={18} />
              Export
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="default" className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <UserPlus size={18} />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                  {isAdmin ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      As an admin, you can create member invitations that will be sent to the new member's email for registration.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Submit a member registration request that will be reviewed and approved by an admin.
                    </p>
                  )}
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
                        placeholder="ahmed@hu.edu.et"
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
                        <SelectItem value="College of Computing">College of Computing</SelectItem>
                        <SelectItem value="College of Business">College of Business</SelectItem>
                        <SelectItem value="College of Health Sciences">College of Health Sciences</SelectItem>
                        <SelectItem value="College of Agriculture">College of Agriculture</SelectItem>
                        <SelectItem value="College of Law">College of Law</SelectItem>
                        <SelectItem value="College of Engineering">College of Engineering</SelectItem>
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
                    <Label htmlFor="role">Role (Optional)</Label>
                    <Select value={newMember.intended_role} onValueChange={(value) => setNewMember(prev => ({ ...prev, intended_role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="leader">Leader</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="it_head">IT Head</SelectItem>
                        <SelectItem value="sys_admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
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
                      className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
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
              {status === "all" && ` (${combinedMembers.length})`}
              {status !== "all" && ` (${combinedMembers.filter(m => m.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading members...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, index) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                delay={index * 50} 
                isAdmin={isAdmin}
                onApprove={handleApproveMember}
                onReject={handleRejectMember}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No members found matching your criteria.</p>
          </div>
        )}

        {/* Edit Member Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMember.full_name}
                    onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, full_name: e.target.value }) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingMember.status} 
                    onValueChange={(value) => setEditingMember(prev => prev ? ({ ...prev, status: value as Member['status'] }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateMember} className="flex-1">
                    <Save size={16} className="mr-2" />
                    Update
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}

function MemberCard({ 
  member, 
  delay, 
  isAdmin, 
  onApprove, 
  onReject,
  onEdit,
  onDelete
}: { 
  member: Member; 
  delay: number; 
  isAdmin: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}) {
  const status = statusConfig[member.status];
  const StatusIcon = status.icon;

  return (
    <div 
      className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">
              {member.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{member.full_name}</h3>
            {member.role && (
              <span className="text-xs text-secondary font-medium">{member.role}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <>
              <button 
                onClick={() => onEdit(member)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                title="Edit member"
              >
                <Edit size={16} className="text-muted-foreground" />
              </button>
              <button 
                onClick={() => onDelete(member.id)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                title="Delete member"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </>
          )}
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <MoreVertical size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
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

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
        </div>
        <span className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium", status.color)}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>

      {/* Admin approval buttons for pending members */}
      {isAdmin && member.status === 'pending' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button
            size="sm"
            onClick={() => onApprove(member.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle size={14} className="mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(member.id)}
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <Clock size={14} className="mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}