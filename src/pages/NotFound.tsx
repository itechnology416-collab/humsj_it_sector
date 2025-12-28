import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState , useCallback} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, Search, BookOpen, Users, Clock, Compass, Star } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Popular pages suggestions
  const popularPages = [
    { path: "/", title: "Home", description: "Main dashboard and overview" },
    { path: "/prayer-times", title: "Prayer Times", description: "Daily prayer schedules" },
    { path: "/islamic-education", title: "Islamic Education", description: "Learning resources and courses" },
    { path: "/virtual-mosque", title: "Virtual Mosque", description: "3D mosque experience" },
    { path: "/quran-study", title: "Quran Study", description: "Quran reading and study tools" },
    { path: "/events", title: "Events", description: "Community events and programs" },
    { path: "/members", title: "Members", description: "Community member directory" },
    { path: "/donations", title: "Donations", description: "Support the community" }
  ];

  // Generate search suggestions based on the attempted path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const suggestions = popularPages
      .filter(page => 
        page.path.includes(path.slice(1)) || 
        page.title.toLowerCase().includes(path.slice(1)) ||
        path.slice(1).includes(page.path.slice(1))
      )
      .slice(0, 4);
    
    setSearchSuggestions(suggestions.length > 0 ? suggestions.map(s => s.path) : popularPages.slice(0, 4).map(s => s.path));
  }, [location.pathname]);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Track 404 errors for analytics
    if (typeof window !== 'undefined' && (window as unknown).gtag) {
      (window as unknown).gtag('event', 'page_not_found', {
        page_path: location.pathname,
        page_referrer: document.referrer
      });
    }
  }, [location.pathname]);

  const handleSuggestionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Main 404 Section */}
        <div className="text-center animate-fade-in">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-8xl font-display font-bold text-primary/20 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                <Search size={32} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-display font-bold mb-4 text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground/70 mb-8">
            Path: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-border/50 hover:border-primary gap-2"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 shadow-red gap-2"
            >
              <Home size={16} />
              Return Home
            </Button>
          </div>
        </div>

        {/* Suggested Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass size={20} />
              Suggested Pages
            </CardTitle>
            <CardDescription>
              Popular destinations you might be looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularPages.slice(0, 6).map((page) => (
                <div
                  key={page.path}
                  onClick={() => handleSuggestionClick(page.path)}
                  className="p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {page.description}
                      </p>
                    </div>
                    <ArrowLeft size={14} className="text-muted-foreground group-hover:text-primary transition-colors rotate-180" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-xs text-muted-foreground">Active Members</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">89</div>
              <div className="text-xs text-muted-foreground">Study Resources</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-muted-foreground">Daily Prayers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-xs text-muted-foreground">Support</div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>
              If you believe this is an error, here are some ways to get assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigate("/help")}
              >
                <BookOpen size={16} />
                Visit Help Center
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => navigate("/contact")}
              >
                <Users size={16} />
                Contact Support
              </Button>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Error Code: 404 | Time: {new Date().toLocaleString()} | 
                  Session: {Math.random().toString(36).substr(2, 9)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
