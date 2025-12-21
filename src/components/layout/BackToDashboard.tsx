import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Don't show on dashboard pages or auth pages
  const hiddenPaths = ['/dashboard', '/admin', '/auth', '/'];
  const shouldShow = !hiddenPaths.includes(location.pathname) && !location.pathname.startsWith('/auth');

  if (!shouldShow) return null;

  const isOnAdminPage = location.pathname.startsWith('/admin') || 
                       location.pathname === '/user-management' || 
                       location.pathname === '/analytics';

  const dashboardPath = isOnAdminPage && isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isOnAdminPage && isAdmin ? 'Admin Panel' : 'Dashboard';
  const DashboardIcon = isOnAdminPage && isAdmin ? Shield : Home;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <Button
        onClick={() => navigate(dashboardPath)}
        className={cn(
          "shadow-2xl border-2 transition-all duration-300 hover:scale-105 group",
          isOnAdminPage && isAdmin
            ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border-primary/30 shadow-red"
            : "bg-card/95 backdrop-blur-xl text-foreground border-border/50 hover:border-primary/50 hover:bg-card shadow-glow"
        )}
        size="lg"
      >
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <DashboardIcon size={18} className="mr-2 group-hover:animate-pulse" />
        Back to {dashboardLabel}
      </Button>
    </div>
  );
}