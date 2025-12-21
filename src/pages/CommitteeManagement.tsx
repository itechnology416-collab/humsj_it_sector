import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCommittees } from "@/hooks/useCommittees";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Users, 
  Crown, 
  Calendar, 
  User, 
  Plus, 
  Edit,
  CheckCircle,
  AlertTriangle,
  Search,
  Mail,
  Phone,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const committeeTypes = [
  { value: "all", label: "All Committees" },
  { value: "executive", label: "Executive" },
  { value: "operational", label: "Operational" },
  { value: "advisory", label: "Advisory" }
];

export default function CommitteeManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    committees,
    stats,
    loading,
    error,
    useMockData,
    fetchCommittees,
    getCommitteeMembers
  } = useCommittees();
  
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const filteredCommittees = committees.filter(committee => {
    const matchesType = selectedType === "all" || committee.type === selectedType;
    const matchesSearch = searchQuery === "" || 
      committee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (committee.chairperson_name && committee.chairperson_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      committee.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'executive': return 'text-purple-400 bg-purple-500/20';
      case 'operational': return 'text-blue-400 bg-blue-500/20';
      case 'advisory': return 'text-green-400 bg-green-500/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'inactive': return 'text-red-400 bg-red-500/20';
      case 'forming': return 'text-amber-400 bg-amber-500/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'executive': return Crown;
      case 'operational': return Users;
      case 'advisory': return Award;
      default: return Users;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  if (error) {
    return (
      <PageLayout 
        title="Committee Management" 
        subtitle="Error loading committee data"
        currentPath={location.pathname}
        onNavigate={navigate}
      >
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchCommittees()}>Try Again</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Committee & Leadership Management" 
      subtitle="Manage organizational committees and leadership structure"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Mock Data Warning */}
        {useMockData && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Using Mock Data</span>
            </div>
            <p className="text-sm text-amber-600/80 mt-1">
              Database tables not found. Please run the database migrations to enable full functionality.
            </p>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Users size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Committee Management</h2>
              <p className="text-sm text-muted-foreground">Organize leadership structure and committee operations</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/leadership")}
              className="gap-2"
            >
              <Crown size={16} />
              Leadership
            </Button>
            <Button
              onClick={() => toast.info("Committee creation form would open")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              Create Committee
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search committees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
          >
            {committeeTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Committee Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Committees", value: stats.totalCommittees.toString(), icon: Users, color: "text-primary" },
            { label: "Active", value: stats.activeCommittees.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Total Members", value: stats.totalMembers.toString(), icon: User, color: "text-blue-400" },
            { label: "Executive", value: stats.executiveCommittees.toString(), icon: Crown, color: "text-purple-400" }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Committees List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredCommittees.map((committee, index) => {
                const TypeIcon = getTypeIcon(committee.type);
                return (
                  <div 
                    key={committee.id}
                    className={cn(
                      "bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer animate-slide-up",
                      selectedCommittee?.id === committee.id && "border-primary/50 bg-primary/5"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedCommittee(committee)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <TypeIcon size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-display text-lg">{committee.name}</h3>
                            <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getTypeColor(committee.type))}>
                              {committee.type}
                            </span>
                            <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getStatusColor(committee.status))}>
                              {committee.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{committee.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Crown size={14} />
                              {committee.chairperson_name || 'Not assigned'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {committee.member_count || 0} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {committee.meeting_schedule || 'Not scheduled'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Edit size={14} />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Committee Details */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border/30 sticky top-6">
              {selectedCommittee ? (
                <div>
                  <div className="p-6 border-b border-border/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        {React.createElement(getTypeIcon(selectedCommittee.type), { size: 20, className: "text-primary" })}
                      </div>
                      <div>
                        <h3 className="font-display text-lg">{selectedCommittee.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedCommittee.member_count || 0} members</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chairperson:</span>
                        <span className="font-medium">{selectedCommittee.chairperson_name || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Established:</span>
                        <span>{new Date(selectedCommittee.established_date).toLocaleDateString()}</span>
                      </div>
                      {selectedCommittee.term_end_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Term Ends:</span>
                          <span>{new Date(selectedCommittee.term_end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meetings:</span>
                        <span>{selectedCommittee.meeting_schedule || 'Not scheduled'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-b border-border/30">
                    <h4 className="font-medium mb-3">Responsibilities</h4>
                    <div className="space-y-2">
                      {selectedCommittee.responsibilities && selectedCommittee.responsibilities.map((responsibility: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-400" />
                          <span className="text-sm">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-medium mb-3">Members</h4>
                    <div className="space-y-3">
                      {getCommitteeMembers(selectedCommittee.id).map((member: any) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <User size={16} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{member.member_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Mail size={12} />
                            </Button>
                            {member.phone && (
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Phone size={12} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {getCommitteeMembers(selectedCommittee.id).length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <Users size={24} className="mx-auto mb-2" />
                          <p className="text-sm">No members assigned yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Select a Committee</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a committee from the list to view its details and members.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}