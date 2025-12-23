import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackToDashboard } from "@/components/layout/BackToDashboard";
import { useAI } from "@/contexts/AIContext";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function PageLayout({ children, title, subtitle, currentPath, onNavigate }: PageLayoutProps) {
  const { toggleAIAssistant, isAIAssistantOpen } = useAI();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background pattern-netflix pattern-grid">
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={onNavigate}
        onCollapseChange={setSidebarCollapsed}
      />
      
      <main 
        className={cn(
          "min-h-screen relative z-10 transition-all duration-300",
          "main-content-offset",
          sidebarCollapsed && "main-content-offset-collapsed"
        )}
      >
        <Header title={title} subtitle={subtitle} />
        
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Floating Back to Dashboard Button */}
      <BackToDashboard />

      {/* Floating AI Assistant Button */}
      {!isAIAssistantOpen && (
        <Button
          onClick={toggleAIAssistant}
          className={cn(
            "fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-2xl",
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
    </div>
  );
}