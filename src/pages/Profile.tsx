import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Award,
  Activity,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  BookOpen,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  college: string | null;
  department: string | null;
  year: number | null;
  avatar_url: string | null;
  bio: string | null;
  status: string | null;
  created_at: string;
  roles: string[];
}

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile: currentUserProfile, isAdmin } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    bio: ""
  });

  const isOwnProfile = !id || id === user?.id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const targetUserId = id || user?.id;
      if (!targetUserId) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", targetUserId)
        .single();

      if (profileError) throw profileError;

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", targetUserId);

      const profileWithRoles: ProfileData = {
        ...profileData,
        roles: rolesData?.map(r => r.role) || []
      };

      setProfile(profileWithRoles);
      setEditForm({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        college: profileData.college || "",
        department: profileData.department || "",
        year: profileData.year?.toString() || "",
        bio: profileData.bio || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone || null,
          college: editForm.college || null,
          department: editForm.department || null,
          year: editForm.year ? parseInt(editForm.year) : null,
          bio: editForm.bio || null,
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout 
        title="Profile" 
        subtitle="Member profile"
        currentPath={location.pathname}
        onNavigate={navigate}
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout 
        title="Profile" 
        subtitle="Member profile"
        currentPath={location.pathname}
        onNavigate={navigate}
      >
        <div className="text-center py-20">
          <User size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-display mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground">The requested profile could not be found.</p>
        </div>
      </PageLayout>
    );
  }

  const stats = [
    { label: "Events Attended", value: "24", icon: Calendar, color: "text-primary" },
    { label: "Content Shared", value: "8", icon: BookOpen, color: "text-blue-400" },
    { label: "Messages Sent", value: "156", icon: MessageSquare, color: "text-green-400" },
    { label: "Member Since", value: new Date(profile.created_at).getFullYear().toString(), icon: Clock, color: "text-amber-400" },
  ];

  return (
    <PageLayout 
      title={isOwnProfile ? "My Profile" : profile.full_name} 
      subtitle={isOwnProfile ? "Manage your profile information" : "Member profile"}
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Profile Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-2xl p-8 border border-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-red animate-glow">
                <span className="text-4xl font-display text-primary-foreground">
                  {profile.full_name?.charAt(0) || "?"}
                </span>
              </div>
              {isOwnProfile && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Camera size={14} />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-display tracking-wide mb-2">{profile.full_name}</h2>
                  <p className="text-muted-foreground mb-3">{profile.email}</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role) => (
                      <span 
                        key={role} 
                        className="px-3 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                      >
                        {role.replace("_", " ").toUpperCase()}
                      </span>
                    ))}
                    <span className={cn(
                      "px-3 py-1 rounded-md text-xs font-medium",
                      profile.status === "active" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    )}>
                      {profile.status || "active"}
                    </span>
                  </div>
                </div>

                {(isOwnProfile || isAdmin) && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90 shadow-red gap-2"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                        >
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-border/50 hover:border-primary gap-2"
                      >
                        <Edit size={16} />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="text-muted-foreground italic">"{profile.bio}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h3 className="font-display text-xl tracking-wide mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h3>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+251 912 345 678"
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Mail size={16} className="text-primary" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Phone size={16} className="text-primary" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-sm">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-card rounded-xl p-6 border border-border/30">
            <h3 className="font-display text-xl tracking-wide mb-6 flex items-center gap-2">
              <GraduationCap size={20} className="text-primary" />
              Academic Information
            </h3>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="college">College</Label>
                    <Input
                      id="college"
                      value={editForm.college}
                      onChange={(e) => setEditForm(prev => ({ ...prev, college: e.target.value }))}
                      placeholder="College of Computing"
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={editForm.department}
                      onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Software Engineering"
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={editForm.year}
                      onChange={(e) => setEditForm(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="3"
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                </>
              ) : (
                <>
                  {profile.college && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <GraduationCap size={16} className="text-primary" />
                      <span className="text-sm">{profile.college}</span>
                    </div>
                  )}
                  {profile.department && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <BookOpen size={16} className="text-primary" />
                      <span className="text-sm">{profile.department}</span>
                    </div>
                  )}
                  {profile.year && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Star size={16} className="text-primary" />
                      <span className="text-sm">Year {profile.year}</span>
                    </div>
                  )}
                  {!profile.college && !profile.department && !profile.year && (
                    <p className="text-muted-foreground text-sm italic">No academic information provided</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h3 className="font-display text-xl tracking-wide mb-6 flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Recent Activity
          </h3>

          <div className="space-y-3">
            {[
              { action: "Attended Friday Prayer", time: "2 hours ago", icon: Calendar },
              { action: "Shared Islamic Ethics Guide", time: "1 day ago", icon: BookOpen },
              { action: "Joined IT Workshop", time: "3 days ago", icon: Users },
              { action: "Updated profile information", time: "1 week ago", icon: Edit },
            ].map((activity, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <activity.icon size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}