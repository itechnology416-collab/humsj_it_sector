import React from 'react';
import { X, Minimize2, Maximize2, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SmartRecommendations from './SmartRecommendations';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
  className?: string;
}

export default function AIAssistant({
  isOpen,
  onToggle,
  isMinimized,
  onMinimize,
  className
}: AIAssistantProps) {
  if (!isOpen) return null;

  return (
    <Card className={cn(
      "fixed top-4 right-4 w-96 shadow-2xl z-40 border-primary/20",
      "bg-background/95 backdrop-blur-md",
      isMinimized ? "h-16" : "h-[600px]",
      "transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain size={16} className="text-primary" />
            </div>
            {!isMinimized && "AI Assistant"}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="w-8 h-8 p-0"
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 h-full overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            <SmartRecommendations 
              showHeader={false} 
              maxRecommendations={3}
              className="border-0 bg-transparent p-0"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}