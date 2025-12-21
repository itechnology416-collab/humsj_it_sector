import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AIContextType {
  isAIAssistantOpen: boolean;
  isAIAssistantMinimized: boolean;
  toggleAIAssistant: () => void;
  minimizeAIAssistant: () => void;
  aiRecommendations: AIRecommendation[];
  refreshRecommendations: () => void;
  aiInsights: AIInsights;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'spiritual' | 'learning' | 'community' | 'productivity';
  priority: 'high' | 'medium' | 'low';
  action: string;
  confidence: number;
}

interface AIInsights {
  spiritualScore: number;
  learningProgress: number;
  communityEngagement: number;
  overallWellness: number;
  lastUpdated: Date;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAIAssistantMinimized, setIsAIAssistantMinimized] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsights>({
    spiritualScore: 0,
    learningProgress: 0,
    communityEngagement: 0,
    overallWellness: 0,
    lastUpdated: new Date()
  });

  // Generate AI recommendations based on user data
  const generateRecommendations = () => {
    if (!user) return [];

    const recommendations: AIRecommendation[] = [
      {
        id: '1',
        title: 'Enhance Your Prayer Routine',
        description: 'AI suggests adding morning dhikr to improve spiritual consistency',
        category: 'spiritual',
        priority: 'high',
        action: 'spiritual-progress',
        confidence: 92
      },
      {
        id: '2',
        title: 'Complete Quranic Arabic Course',
        description: 'Based on your learning pattern, this course matches your style',
        category: 'learning',
        priority: 'medium',
        action: 'learning-center',
        confidence: 87
      },
      {
        id: '3',
        title: 'Join IT Committee',
        description: 'Your technical skills would be valuable for community projects',
        category: 'community',
        priority: 'high',
        action: 'volunteer-opportunities',
        confidence: 94
      },
      {
        id: '4',
        title: 'Optimize Study Schedule',
        description: 'AI detected optimal learning times based on your activity patterns',
        category: 'productivity',
        priority: 'medium',
        action: 'my-tasks',
        confidence: 78
      }
    ];

    return recommendations;
  };

  // Generate AI insights
  const generateInsights = (): AIInsights => {
    // Simulate AI analysis based on user activity
    return {
      spiritualScore: Math.floor(Math.random() * 20) + 80, // 80-100
      learningProgress: Math.floor(Math.random() * 30) + 70, // 70-100
      communityEngagement: Math.floor(Math.random() * 25) + 75, // 75-100
      overallWellness: Math.floor(Math.random() * 15) + 85, // 85-100
      lastUpdated: new Date()
    };
  };

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
    if (isAIAssistantMinimized) {
      setIsAIAssistantMinimized(false);
    }
  };

  const minimizeAIAssistant = () => {
    setIsAIAssistantMinimized(!isAIAssistantMinimized);
  };

  const refreshRecommendations = () => {
    setAIRecommendations(generateRecommendations());
    setAIInsights(generateInsights());
  };

  // Initialize AI data when user logs in
  useEffect(() => {
    if (user) {
      setAIRecommendations(generateRecommendations());
      setAIInsights(generateInsights());
    }
  }, [user]);

  // Auto-refresh recommendations every hour
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        refreshRecommendations();
      }, 3600000); // 1 hour

      return () => clearInterval(interval);
    }
  }, [user]);

  const value = {
    isAIAssistantOpen,
    isAIAssistantMinimized,
    toggleAIAssistant,
    minimizeAIAssistant,
    aiRecommendations,
    refreshRecommendations,
    aiInsights
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}