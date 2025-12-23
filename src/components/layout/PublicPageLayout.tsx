import { ReactNode } from "react";
import { BackToHome } from "@/components/layout/BackToHome";
import { useAI } from "@/contexts/AIContext";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParallaxBackground, IslamicParallaxDecorations } from "@/components/effects/ParallaxContainer";

interface PublicPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function PublicPageLayout({ children, title, subtitle, currentPath, onNavigate }: PublicPageLayoutProps) {
  const { toggleAIAssistant, isAIAssistantOpen } = useAI();

  return (
    <ParallaxBackground 
      className="min-h-screen bg-background pattern-netflix pattern-grid"
      intensity="medium"
      backgroundElements={<IslamicParallaxDecorations />}
    >
      {/* Main content without sidebar - full width */}
      <main className="min-h-screen relative z-10">
        {/* Minimal header with just title and subtitle */}
        <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display tracking-wide text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-6">
          {children}
        </div>
      </main>

      {/* Floating Back to Home Button */}
      <BackToHome />

      {/* Floating AI Assistant Button */}
      {!isAIAssistantOpen && (
        <Button
          onClick={toggleAIAssistant}
          className={cn(
            "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl",
            "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600",
            "border-2 border-purple-400/50 animate-pulse hover:animate-none",
            "transition-all duration-300 hover:scale-110"
          )}
        >
          <div className="relative">
            <Bot size={24} className="text-white" />
            <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300 animate-ping" />
          </div>
        </Button>
      )}
    </ParallaxBackground>
  );
}