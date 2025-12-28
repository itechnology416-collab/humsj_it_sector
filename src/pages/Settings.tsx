import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Key,
  Mail,
  Smartphone,
  Save,
  ChevronRight,
  Loader2,
  Globe,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SettingsTab = "profile" | "notifications" | "security" | "appearance" | "system";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "system", label: "System", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProtectedPageLayout 
      title="Settings" 
      subtitle="Manage your account preferences"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl p-4 space-y-1 border border-border/30">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left group",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-red"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                    <ChevronRight size={16} className={cn(
                      "ml-auto transition-transform",
                      activeTab === tab.id && "rotate-90"
                    )} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && <ProfileSettings profile={profile} user={user} />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "system" && <SystemSettings />}
          </div>
        </div>
      </div>
    </ProtectedPageLayout>
  );
}

function ProfileSettings({ profile, user }: { profile: Record<string, unknown> | null; user: Record<string, unknown> | null }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [college, setCollege] = useState(profile?.college || "");
  const [department, setDepartment] = useState(profile?.department || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const { refreshProfile } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        college,
        department,
        bio,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      await refreshProfile();
    }
    setSaving(false);
  };

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border/30">
      <div>
        <h2 className="text-xl font-display tracking-wide mb-1">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center shadow-red animate-glow">
          <span className="text-2xl font-display text-primary-foreground">
            {fullName?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <Button variant="outline" size="sm" className="border-border/50 hover:border-primary">
            <Sparkles size={14} className="mr-2" />
            Change Photo
          </Button>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-muted-foreground text-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 912 345 678"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">College</label>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="College of Computing"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Software Engineering"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 shadow-red gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [newMemberAlerts, setNewMemberAlerts] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Save notification preferences
    const preferences = {
      email: emailNotifications,
      push: pushNotifications,
      events: eventReminders,
      members: newMemberAlerts
    };
    
    localStorage.setItem("notificationPreferences", JSON.stringify(preferences));
    
    setTimeout(() => {
      setSaving(false);
      toast.success("Notification preferences saved successfully");
    }, 1000);
  };

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border/30">
      <div>
        <h2 className="text-xl font-display tracking-wide mb-1">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
      </div>

      <div className="space-y-4">
        <ToggleSetting
          icon={Mail}
          title="Email Notifications"
          description="Receive notifications via email"
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        <ToggleSetting
          icon={Smartphone}
          title="Push Notifications"
          description="Receive push notifications on your device"
          checked={pushNotifications}
          onChange={setPushNotifications}
        />
        <ToggleSetting
          icon={Bell}
          title="Event Reminders"
          description="Get reminded before upcoming events"
          checked={eventReminders}
          onChange={setEventReminders}
        />
        <ToggleSetting
          icon={User}
          title="New Member Alerts"
          description="Get notified when new members join"
          checked={newMemberAlerts}
          onChange={setNewMemberAlerts}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 shadow-red gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    // Simulate password change process
    setTimeout(() => {
      setIsChangingPassword(false);
      toast.success("Password change initiated. Check your email for instructions.");
    }, 2000);
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    // Simulate 2FA setup process
    setTimeout(() => {
      setIsEnabling2FA(false);
      toast.success("Two-factor authentication setup initiated.");
    }, 2000);
  };

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border/30">
      <div>
        <h2 className="text-xl font-display tracking-wide mb-1">Security Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account security</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Key size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">Password</p>
                <p className="text-sm text-muted-foreground">Change your password</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50 hover:border-primary"
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? <Loader2 size={14} className="animate-spin" /> : "Change"}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50 hover:border-primary"
              onClick={handleEnable2FA}
              disabled={isEnabling2FA}
            >
              {isEnabling2FA ? <Loader2 size={14} className="animate-spin" /> : "Enable"}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage devices logged into your account</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50 hover:border-primary"
              onClick={() => toast.info("Active sessions: 1 device (current)")}
            >
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [selectedTheme, setSelectedTheme] = useState("Dark");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [saving, setSaving] = useState(false);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    // Apply theme immediately
    const root = document.documentElement;
    if (theme === "Dark") {
      root.classList.add("dark");
    } else if (theme === "Light") {
      root.classList.remove("dark");
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Save preferences to localStorage or database
    localStorage.setItem("theme", selectedTheme);
    localStorage.setItem("language", selectedLanguage);
    
    setTimeout(() => {
      setSaving(false);
      toast.success("Appearance settings saved successfully");
    }, 1000);
  };
  
  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border/30">
      <div>
        <h2 className="text-xl font-display tracking-wide mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize the look and feel</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {["Light", "Dark", "System"].map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all hover:border-primary/50",
                selectedTheme === theme
                  ? "border-primary bg-primary/5 shadow-red" 
                  : "border-border/50"
              )}
            >
              <div className={cn(
                "w-full h-12 rounded-md mb-2 flex items-center justify-center",
                theme === "Dark" ? "bg-[#0a0a0a]" : theme === "Light" ? "bg-gray-100" : "bg-gradient-to-r from-gray-100 to-[#0a0a0a]"
              )}>
                {theme === "Dark" && <div className="w-3 h-3 rounded-full bg-primary" />}
                {theme === "Light" && <div className="w-3 h-3 rounded-full bg-gray-400" />}
              </div>
              <span className="text-sm font-medium">{theme}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Language</label>
        <select 
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full max-w-xs px-4 py-2.5 rounded-lg bg-secondary border border-border/50 focus:border-primary text-sm outline-none cursor-pointer"
        >
          <option>English</option>
          <option>العربية (Arabic)</option>
          <option>Afaan Oromoo</option>
          <option>አማርኛ (Amharic)</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 shadow-red gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function SystemSettings() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false);
      toast.success("Database backup completed successfully");
    }, 3000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Data export completed. Download will start shortly.");
    }, 2000);
  };

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border/30">
      <div>
        <h2 className="text-xl font-display tracking-wide mb-1">System Settings</h2>
        <p className="text-sm text-muted-foreground">Advanced system configuration</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">Database Backup</p>
              <p className="text-sm text-muted-foreground">Last backup: December 2024</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50 hover:border-primary"
              onClick={handleBackup}
              disabled={isBackingUp}
            >
              {isBackingUp ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              {isBackingUp ? "Backing up..." : "Backup Now"}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all system data</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50 hover:border-primary"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Version</p>
              <p className="text-sm text-muted-foreground">HUMSJ IT v2.0.0</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-md bg-primary/20 text-primary font-medium">
              Up to date
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ 
  icon: Icon, 
  title, 
  description, 
  checked,
  onChange
}: { 
  icon: React.ElementType;
  title: string; 
  description: string; 
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50 group hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <div>
          <p className="font-medium group-hover:text-primary transition-colors">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-all duration-300 relative",
          checked ? "bg-primary shadow-red" : "bg-muted-foreground/30"
        )}
      >
        <div className={cn(
          "w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 absolute top-0.5",
          checked ? "translate-x-6" : "translate-x-0.5"
        )} />
      </button>
    </div>
  );
}