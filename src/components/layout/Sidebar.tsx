import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  MessageCircle,
  FileText, 
  Settings,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog,
  Zap,
  User,
  PieChart,
  Clock,
  Smartphone,
  Code,
  Brain,
  Package,
  Ticket,
  Briefcase,
  UserCheck,
  Archive,
  Star,
  Trophy,
  BookOpen,
  Heart,
  Moon,
  Baby,
  Quote,
  Navigation,
  Globe,
  Crown,
  Mountain,
  Palette,
  Image,
  Store,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QuickNav } from "@/components/layout/QuickNav";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Shield, label: "Admin Panel", href: "/admin", adminOnly: true },
  { icon: UserCog, label: "User Management", href: "/user-management", adminOnly: true },
  { icon: Users, label: "Members", href: "/members", badge: 234 },
  { icon: Calendar, label: "Events", href: "/events", badge: 5 },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
];

const islamicNavItems: NavItem[] = [
  { icon: Sparkles, label: "Islamic Features", href: "/islamic-features" },
  { icon: GraduationCap, label: "Course Enrollment", href: "/islamic-course-enrollment" },
  { icon: Clock, label: "Prayer Times", href: "/prayer-times" },
  { icon: Bell, label: "Prayer Reminders", href: "/prayer-reminders" },
  { icon: BookOpen, label: "Quran Audio Player", href: "/quran-audio" },
  { icon: Heart, label: "Prayer Tracker", href: "/prayer-tracker" },
  { icon: Star, label: "Digital Tasbih", href: "/dhikr-counter" },
  { icon: Calendar, label: "Hijri Calendar", href: "/hijri-calendar" },
  { icon: Bell, label: "Islamic Notifications", href: "/islamic-notifications" },
  { icon: Store, label: "Halal Marketplace", href: "/halal-marketplace" },
  { icon: BookOpen, label: "Islamic Programs", href: "/islamic-programs" },
  { icon: Brain, label: "Smart Study System", href: "/smart-study" },
  { icon: Globe, label: "Islamic History", href: "/islamic-history" },
  { icon: Crown, label: "Prophet's Life ﷺ", href: "/prophet-life" },
  { icon: Users, label: "Sahaba & Women", href: "/sahaba-women" },
  { icon: Mountain, label: "Islam in Ethiopia", href: "/islam-ethiopia" },
  { icon: Palette, label: "Islamic Art", href: "/islamic-art" },
  { icon: MessageCircle, label: "Da'wah Resources", href: "/dawa-content" },
  { icon: Navigation, label: "Qibla Finder", href: "/qibla-finder" },
  { icon: Moon, label: "Islamic Calendar", href: "/islamic-calendar" },
  { icon: BookOpen, label: "Khutbah Collection", href: "/khutbah" },
  { icon: Heart, label: "Dua Collection", href: "/dua-collection" },
  { icon: Quote, label: "Hadith Collection", href: "/hadith-collection" },
  { icon: Baby, label: "Islamic Names", href: "/islamic-names" },
  { icon: FileText, label: "Islamic Resources", href: "/islamic-resources" },
];

const managementNavItems: NavItem[] = [
  { icon: UserCheck, label: "Attendance", href: "/attendance", adminOnly: true },
  { icon: Users, label: "User Approval", href: "/admin-user-approval", adminOnly: true },
  { icon: Archive, label: "Inventory", href: "/inventory", adminOnly: true },
  { icon: Star, label: "Feedback", href: "/feedback" },
  { icon: Trophy, label: "Achievements", href: "/achievements" },
  { icon: Image, label: "Media Gallery", href: "/media-gallery" },
  { icon: Code, label: "Projects", href: "/projects" },
  { icon: Brain, label: "Skills & Training", href: "/skills" },
  { icon: Package, label: "Equipment", href: "/equipment" },
  { icon: Ticket, label: "Support Tickets", href: "/support" },
  { icon: Briefcase, label: "Opportunities", href: "/opportunities" },
  { icon: MessageSquare, label: "Communication", href: "/communication" },
  { icon: MessageSquare, label: "Information Channels", href: "/information-channels" },
  { icon: FileText, label: "Content", href: "/content" },
  { icon: Smartphone, label: "Islamic Tech", href: "/islamic-tech" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: PieChart, label: "Reports", href: "/reports", adminOnly: true },
];

const secondaryNavItems: NavItem[] = [
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: 12 },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ currentPath, onNavigate, onCollapseChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showQuickNav, setShowQuickNav] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
    navigate(path);
  };

  const filteredMainNavItems = mainNavItems.filter(item => !item.adminOnly || isAdmin);
  const filteredIslamicNavItems = islamicNavItems.filter(item => !item.adminOnly || isAdmin);
  const filteredManagementNavItems = managementNavItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      <aside 
        className={cn(
          "sidebar-fixed bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border overflow-hidden",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigate("/")}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-red group-hover:animate-glow transition-all overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="HUMSJ Logo" 
                className="w-8 h-8 rounded object-cover"
              />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-display text-xl tracking-wider">HUMSJ</h1>
                <p className="text-xs text-sidebar-foreground/70">IT Sector</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => {
            const newCollapsed = !collapsed;
            setCollapsed(newCollapsed);
            onCollapseChange?.(newCollapsed);
          }}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-red hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Quick Navigation Button */}
        <div className="p-4 border-b border-sidebar-border">
          <button
            onClick={() => setShowQuickNav(true)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 transition-all duration-200 group",
              collapsed && "justify-center"
            )}
          >
            <Zap size={20} className="group-hover:animate-pulse" />
            {!collapsed && (
              <span className="text-sm font-medium">Quick Navigation</span>
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Section */}
          <p className={cn("text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-4 px-3", collapsed && "text-center")}>
            {collapsed ? "•••" : "Main Menu"}
          </p>
          {filteredMainNavItems.map((item) => (
            <NavButton 
              key={item.href}
              item={item}
              isActive={currentPath === item.href}
              collapsed={collapsed}
              onClick={() => handleNavigate(item.href)}
            />
          ))}

          {/* Islamic Tools Section */}
          <p className={cn("text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-4 mt-6 px-3", collapsed && "text-center")}>
            {collapsed ? "🕌" : "Islamic Tools"}
          </p>
          {filteredIslamicNavItems.map((item) => (
            <NavButton 
              key={item.href}
              item={item}
              isActive={currentPath === item.href}
              collapsed={collapsed}
              onClick={() => handleNavigate(item.href)}
            />
          ))}

          {/* Management Section */}
          <p className={cn("text-xs uppercase tracking-wider text-sidebar-foreground/40 mb-4 mt-6 px-3", collapsed && "text-center")}>
            {collapsed ? "⚙️" : "Management"}
          </p>
          {filteredManagementNavItems.map((item) => (
            <NavButton 
              key={item.href}
              item={item}
              isActive={currentPath === item.href}
              collapsed={collapsed}
              onClick={() => handleNavigate(item.href)}
            />
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-sidebar-border space-y-1">
          {secondaryNavItems.map((item) => (
            <NavButton 
              key={item.href}
              item={item}
              isActive={currentPath === item.href}
              collapsed={collapsed}
              onClick={() => handleNavigate(item.href)}
            />
          ))}
          
          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                collapsed && "justify-center"
              )}
            >
              <LogOut size={20} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          )}
        </div>

        {/* User Profile */}
        {!collapsed && user && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile?.full_name || "Member"}</p>
                <p className="text-xs text-sidebar-foreground/60">
                  {isAdmin ? "Administrator" : "Member"}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Quick Navigation Modal */}
      <QuickNav 
        isVisible={showQuickNav} 
        onClose={() => setShowQuickNav(false)} 
      />
    </>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavButton({ item, isActive, collapsed, onClick }: NavButtonProps) {
  const Icon = item.icon;
  const isIslamicPrograms = item.href === "/islamic-programs";
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        isActive 
          ? "bg-primary text-primary-foreground shadow-red" 
          : isIslamicPrograms
          ? "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-primary/10 border border-primary/20"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
        collapsed && "justify-center"
      )}
    >
      <Icon size={20} />
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-semibold",
              isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
            )}>
              {item.badge}
            </span>
          )}
        </>
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full" />
      )}
    </button>
  );
}