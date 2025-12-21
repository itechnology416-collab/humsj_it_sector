import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
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

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
