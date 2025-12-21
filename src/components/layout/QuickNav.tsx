import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  BarChart3,
  Settings,
  Shield,
  UserCog,
  Bell,
  HelpCircle,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickNavProps {
  isVisible: boolean;
  onClose: () => void;
}

export function QuickNav({ isVisible, onClose }: QuickNavProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const quickActions = [
    { icon: Users, label: "View Members", path: "/members", color: "text-blue-400" },
    { icon: Calendar, label: "Browse Events", path: "/events", color: "text-green-400" },
    { icon: MessageSquare, label: "Send Message", path: "/communication", color: "text-purple-400" },
    { icon: FileText, label: "Upload Content", path: "/content", color: "text-amber-400" },
    { icon: BarChart3, label: "View Analytics", path: "/analytics", color: "text-primary" },
  ];

  const adminActions = [
    { icon: Shield, label: "Admin Panel", path: "/admin", color: "text-primary" },
    { icon: UserCog, label: "User Management", path: "/user-management", color: "text-red-400" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-xl bg-primary/20 flex items-center justify-center mb-4 animate-glow">
            <Zap size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-display tracking-wide mb-2">Quick Navigation</h3>
          <p className="text-sm text-muted-foreground">Jump to any section instantly</p>
        </div>

        <div className="space-y-3">
          {isAdmin && (
            <>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 px-2">
                Admin Actions
              </div>
              {adminActions.map((action, index) => (
                <button
                  key={action.path}
                  onClick={() => handleNavigate(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <action.icon size={20} className={action.color} />
                  </div>
                  <span className="flex-1 text-left font-medium group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
              <div className="h-px bg-border/50 my-4" />
            </>
          )}

          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 px-2">
            Quick Actions
          </div>
          {quickActions.map((action, index) => (
            <button
              key={action.path}
              onClick={() => handleNavigate(action.path)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all group animate-slide-up"
              style={{ animationDelay: `${(isAdmin ? adminActions.length : 0) * 50 + index * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <action.icon size={20} className={action.color} />
              </div>
              <span className="flex-1 text-left font-medium group-hover:text-primary transition-colors">
                {action.label}
              </span>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleNavigate("/settings")}
              className="flex-1 border-border/50 hover:border-primary"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate("/help")}
              className="flex-1 border-border/50 hover:border-primary"
            >
              <HelpCircle size={16} className="mr-2" />
              Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}