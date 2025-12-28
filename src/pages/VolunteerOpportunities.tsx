import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  getVolunteerOpportunities,
  getVolunteerDashboardStats,
  getUserApplications,
  getUserVolunteerHours,
  applyForOpportunity,
  type VolunteerOpportunity,
  type VolunteerApplication,
  type VolunteerHours,
  type VolunteerFilters
} from "@/services/volunteerApi";
import { 
  Heart, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Star,
  Award,
  Target,
  TrendingUp,
  Eye,
  UserPlus,
  UserMinus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VolunteerOpportunities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [volunteerHistory, setVolunteerHistory] = useState<VolunteerHours[]>([]);
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    totalHours: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [opportunitiesResponse, dashboardStats] = await Promise.all([
        getVolunteerOpportunities({}, 1, 50),
        getVolunteerDashboardStats()
      ]);

      setOpportunities(opportunitiesResponse.opportunities);
      
      if (user) {
        const [userApplications, userHours] = await Promise.all([
          getUserApplications(),
          getUserVolunteerHours()
        ]);
        
        setApplications(userApplications);
        setVolunteerHistory(userHours);
        
        // Calculate user stats
        const totalHours = userHours.reduce((sum, record) => sum + record.hours_worked, 0);
        const verifiedHours = userHours.filter(record => record.verified);
        const averageRating = verifiedHours.length > 0 ? 4.5 : 0; // Mock rating for now
        
        setStats({
          totalOpportunities: opportunitiesResponse.total,
          totalApplications: userApplications.length,
          totalHours,
          averageRating
        });
      } else {
        setStats({
          totalOpportunities: opportunitiesResponse.total,
          totalApplications: 0,
          totalHours: 0,
          averageRating: 0
        });
      }
    } catch (err: unknown) {
      console.error('Error loading volunteer data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load volunteer data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [user, loadData]);

  const handleApplyForOpportunity = async (opportunityId: string) => {
    if (!user) {
      toast.error("Please log in to apply for opportunities");
      return;
    }

    try {
      await applyForOpportunity(opportunityId, {
        motivation: "I am interested in contributing to this opportunity.",
        skills: [],
        availability: "Flexible"
      });
      
      toast.success("Application submitted successfully!");
      
      // Reload applications
      const userApplications = await getUserApplications();
      setApplications(userApplications);
    } catch (error: unknown) {
      console.error('Error applying for opportunity:', error);
      toast.error(error.message || "Failed to submit application");
    }
  };

  const tabs = [
    { id: "available", label: "Available Tasks", icon: Heart },
    { id: "applications", label: "My Applications", icon: UserPlus },
    { id: "history", label: "Task History", icon: Clock }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return CheckCircle;
      case "pending": return AlertCircle;
      case "rejected": return XCircle;
      default: return Clock;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || opp.category === filterCategory;
    const matchesUrgency = filterUrgency === "all" || opp.priority === filterUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  return (
    <PageLayout 
      title="Volunteer Opportunities" 
      subtitle="Contribute to your community through meaningful service"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              ×
            </Button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: "Available Tasks", 
              value: stats.totalOpportunities.toString(), 
              icon: Heart, 
              color: "text-primary" 
            },
            { 
              label: "My Applications", 
              value: stats.totalApplications.toString(), 
              icon: UserPlus, 
              color: "text-blue-400" 
            },
            { 
              label: "Hours Contributed", 
              value: stats.totalHours.toString(), 
              icon: Clock, 
              color: "text-green-400" 
            },
            { 
              label: "Average Rating", 
              value: stats.averageRating ? stats.averageRating.toFixed(1) : "0", 
              icon: Star, 
              color: "text-amber-400" 
            }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
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

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search volunteer opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Media">Media</option>
              <option value="Community Service">Community Service</option>
            </select>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="all">All Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading volunteer opportunities...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "available" && (
                <div className="space-y-4">
                  {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opportunity) => (
                      <div 
                        key={opportunity.id}
                        className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Heart size={24} className="text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-display tracking-wide mb-2">{opportunity.title}</h3>
                                <p className="text-muted-foreground text-sm mb-3">{opportunity.description}</p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {opportunity.time_commitment || 'Flexible'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {opportunity.location || 'Various Locations'}
                                  </span>
                                  {opportunity.application_deadline && (
                                    <span className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {opportunity.skills_required?.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                <Badge className={cn("text-xs", getUrgencyColor(opportunity.priority))}>
                                  {opportunity.priority.toUpperCase()} PRIORITY
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {opportunity.category}
                                </Badge>
                                {opportunity.max_volunteers && (
                                  <div className="text-xs text-muted-foreground text-right">
                                    {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button 
                                className="bg-primary hover:bg-primary/90 gap-1"
                                onClick={() => handleApplyForOpportunity(opportunity.id)}
                                disabled={!user}
                              >
                                <UserPlus size={14} />
                                Apply Now
                              </Button>
                              <Button variant="outline" className="border-border/50 hover:border-primary gap-1">
                                <Eye size={14} />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <Heart size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Opportunities Found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "applications" && (
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      return (
                        <div 
                          key={application.id}
                          className="bg-card rounded-xl p-6 border border-border/30"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                <StatusIcon size={20} className={getStatusColor(application.status).split(' ')[1]} />
                              </div>
                              <div>
                                <h3 className="font-display text-lg mb-1">{application.opportunity?.title || 'Unknown Opportunity'}</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Applied on {new Date(application.applied_at).toLocaleDateString()}
                                </p>
                                {application.motivation && (
                                  <p className="text-sm italic">"{application.motivation}"</p>
                                )}
                              </div>
                            </div>
                            <Badge className={cn("text-xs", getStatusColor(application.status))}>
                              {application.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-border/50 gap-1">
                              <Eye size={14} />
                              View Details
                            </Button>
                            {application.status === "pending" && (
                              <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-1">
                                <UserMinus size={14} />
                                Withdraw
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20">
                      <UserPlus size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Applications Yet</h3>
                      <p className="text-muted-foreground">Start applying for volunteer opportunities to make a difference.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  {volunteerHistory.length > 0 ? (
                    <>
                      {/* Summary Stats */}
                      <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30 mb-6">
                        <h3 className="text-lg font-display mb-4">Volunteer Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-display text-primary">{volunteerHistory.length}</p>
                            <p className="text-sm text-muted-foreground">Hours Logged</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-display text-primary">{stats.totalHours}</p>
                            <p className="text-sm text-muted-foreground">Total Hours</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <p className="text-3xl font-display text-primary">{stats.averageRating.toFixed(1)}</p>
                              <Star size={20} className="text-amber-400 fill-amber-400" />
                            </div>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                          </div>
                        </div>
                      </div>

                      {/* History List */}
                      {volunteerHistory.map((record) => (
                        <div 
                          key={record.id}
                          className="bg-card rounded-xl p-6 border border-border/30"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <CheckCircle size={20} className="text-green-400" />
                              </div>
                              <div>
                                <h3 className="font-display text-lg mb-1">Volunteer Work</h3>
                                <p className="text-sm text-muted-foreground mb-2">{record.description || 'Volunteer activity'}</p>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                                  <span>Hours: {record.hours_worked}</span>
                                  <span>Status: {record.verified ? 'Verified' : 'Pending'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {record.verified && (
                                <Badge className="bg-green-500/20 text-green-600">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {record.notes && (
                            <div className="p-3 bg-secondary/30 rounded-lg">
                              <p className="text-sm italic">"{record.notes}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <Clock size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Volunteer History</h3>
                      <p className="text-muted-foreground">Complete volunteer tasks to build your service history.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}