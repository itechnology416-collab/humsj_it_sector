import { Search, Bell, Menu, Sparkles, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Dashboard', path: isAdmin && location.pathname.startsWith('/admin') ? '/admin' : '/dashboard' }];
    
    const pathMap: { [key: string]: string } = {
      'admin': 'Admin Panel',
      'members': 'Members',
      'events': 'Events',
      'content': 'Content Library',
      'communication': 'Communication',
      'analytics': 'Analytics',
      'notifications': 'Notifications',
      'settings': 'Settings',
      'help': 'Help & Support',
      'user-management': 'User Management'
    };

    pathSegments.forEach((segment, index) => {
      if (segment !== 'admin' || index === 0) {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const name = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ name, path });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Title and Breadcrumbs */}
        <div className="flex-1">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index === 0 && <Home size={14} className="text-primary" />}
                <button
                  onClick={() => navigate(crumb.path)}
                  className={`text-sm transition-colors hover:text-primary ${
                    index === breadcrumbs.length - 1 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {crumb.name}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight size={14} className="text-muted-foreground/50" />
                )}
              </div>
            ))}
          </nav>
          
          {/* Title */}
          <div>
            <h1 className="text-3xl font-display tracking-wide text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Center: Search */}
        <div className={`relative transition-all duration-300 mx-6 ${searchFocused ? 'w-96' : 'w-72'}`}>
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground transition-all duration-300 outline-none backdrop-blur-sm"
          />
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-lg">
              <p className="text-xs text-muted-foreground">Quick search across all modules</p>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-secondary/50 transition-all duration-300 group"
            onClick={() => navigate('/notifications')}
          >
            <Bell size={20} className="group-hover:animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-pulse">
              5
            </span>
          </Button>

          {/* Quick Add */}
          <Button 
            variant="default" 
            size="sm" 
            className="hidden md:flex bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-red gap-2 group"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            Quick Action
          </Button>
        </div>
      </div>
    </header>
  );
}