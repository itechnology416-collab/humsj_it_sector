import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToHome() {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show on home page or auth pages
  const hiddenPaths = ['/auth', '/'];
  const shouldShow = !hiddenPaths.includes(location.pathname) && !location.pathname.startsWith('/auth');

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <Button
        onClick={() => navigate('/')}
        className={cn(
          "shadow-2xl border-2 transition-all duration-300 hover:scale-105 group",
          "bg-card/95 backdrop-blur-xl text-foreground border-border/50 hover:border-primary/50 hover:bg-card shadow-glow",
          "w-14 h-14 rounded-full p-0 flex items-center justify-center"
        )}
        size="lg"
        title="Back to Home"
      >
        <div className="flex items-center justify-center relative">
          <ArrowLeft size={18} className="absolute -left-1 group-hover:-translate-x-1 transition-transform" />
          <Home size={18} className="ml-1 group-hover:animate-pulse" />
        </div>
      </Button>
    </div>
  );
}