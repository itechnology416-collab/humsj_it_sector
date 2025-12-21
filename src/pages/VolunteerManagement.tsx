import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVolunteers } from "@/hooks/useVolunteers";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Heart, 
  Users, 
  Clock, 
  Plus, 
  Edit, 
  Eye,
  CheckCircle,
  Calendar,
  User,
  Search,
  Star,
  MapPin,
  Mail,
  Target,
  AlertCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categories = [
  "All Categories",
  "Media",
  "Translation", 
  "Education",
  "Community Service",
  "Technical Support",
  "Administrative"
];

const priorities = [
  { value: "all", label: "All Priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

export default function VolunteerManagement() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    tasks, 
    applications, 
    stats, 
    loading, 
    error, 
    useMockData,
    fetchTasks,
    approveApplication,
    rejectApplication,
    deleteTask
  } = useVolunteers();
  
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "applications">("tasks");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === "All Categories" || task.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
    const matchesSearch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.required_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const filteredApplications = applications.filter(application =>
    searchQuery === "" || 
    application.volunteer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.application_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApproveApplication = async (applicationId: string) => {
    const success = await approveApplication(applicationId);
    if (success) {
      fetchTasks(); // Refresh data
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const success = await rejectApplication(applicationId, "Application rejected by admin");
    if (success) {
      fetchTasks(); // Refresh data
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(taskId);
      if (success) {
        fetchTasks(); // Refresh data
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400 bg-blue-500/20';
      case 'assigned': return 'text-amber-400 bg-amber-500/20';
      case 'in_progress': return 'text-purple-400 bg-purple-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        title="Volunteer Management" 
        subtitle="Error loading volunteer data"
        currentPath={location.pathname}
        onNavigate={navigate}
      >
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchTasks()}>Try Again</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Volunteer Management" 
      subtitle="Coordinate volunteer activities and service tracking"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Mock Data Warning */}
        {useMockData && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle size={16} />
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
              <Heart size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wide">Volunteer Management</h2>
              <p className="text-sm text-muted-foreground">Manage volunteer tasks and track community service</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/volunteer-opportunities")}
              className="gap-2"
            >
              <Eye size={16} />
              View Opportunities
            </Button>
            <Button
              onClick={() => toast.info("Task creation form would open")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              Create Task
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "tasks" ? "default" : "outline"}
            onClick={() => setActiveTab("tasks")}
            className="gap-2"
          >
            <Target size={16} />
            Tasks ({stats.totalTasks})
          </Button>
          <Button
            variant={activeTab === "applications" ? "default" : "outline"}
            onClick={() => setActiveTab("applications")}
            className="gap-2"
          >
            <Users size={16} />
            Applications ({stats.totalApplications})
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={activeTab === "tasks" ? "Search tasks..." : "Search applications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          {activeTab === "tasks" && (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activeTab === "tasks" ? [
            { label: "Open Tasks", value: stats.openTasks.toString(), icon: Target, color: "text-blue-400" },
            { label: "In Progress", value: stats.inProgressTasks.toString(), icon: Clock, color: "text-purple-400" },
            { label: "Completed", value: stats.completedTasks.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Total Tasks", value: stats.totalTasks.toString(), icon: Heart, color: "text-primary" }
          ] : [
            { label: "Pending", value: stats.pendingApplications.toString(), icon: Clock, color: "text-amber-400" },
            { label: "Approved", value: stats.approvedApplications.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Total Applications", value: stats.totalApplications.toString(), icon: Users, color: "text-primary" },
            { label: "Active Tasks", value: stats.openTasks.toString(), icon: Target, color: "text-blue-400" }
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

        {/* Content */}
        {activeTab === "tasks" ? (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id}
                className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-lg">{task.title}</h3>
                      <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getPriorityColor(task.priority))}>
                        {task.priority}
                      </span>
                      <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getStatusColor(task.status))}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {task.estimated_hours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {task.assigned_to.length}/{task.max_volunteers}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {task.location}
                      </span>
                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Due {formatDate(task.deadline)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.required_skills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <span className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground">
                      {task.category}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye size={14} />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1 text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <XCircle size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application, index) => (
              <div 
                key={application.id}
                className="bg-card rounded-xl border border-border/30 p-6 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-lg">{application.volunteer_name || 'Unknown Volunteer'}</h3>
                      <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getStatusColor(application.status))}>
                        {application.status}
                      </span>
                    </div>
                    
                    {application.application_message && (
                      <p className="text-sm text-muted-foreground mb-3">{application.application_message}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Applied {formatDate(application.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {application.hours_logged}h logged
                      </span>
                    </div>
                    
                    {application.task && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Task: </span>
                        <span className="font-medium">{application.task.title}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {application.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 gap-1"
                          onClick={() => handleApproveApplication(application.id)}
                        >
                          <CheckCircle size={14} />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1 text-red-400 hover:text-red-300"
                          onClick={() => handleRejectApplication(application.id)}
                        >
                          <XCircle size={14} />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" className="gap-1">
                      <Mail size={14} />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {((activeTab === "tasks" && filteredTasks.length === 0) || 
          (activeTab === "applications" && filteredApplications.length === 0)) && (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No {activeTab} found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}