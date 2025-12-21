import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  Brain,
  MessageSquare,
  BookOpen,
  Calendar,
  Users,
  Settings,
  Lightbulb,
  Zap,
  Star,
  Clock,
  Heart,
  Shield,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    icon?: any;
  }>;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
}

const aiSuggestions = [
  { text: "Help me plan my daily prayers", icon: Calendar, category: "spiritual" },
  { text: "Find volunteer opportunities", icon: Heart, category: "community" },
  { text: "Recommend Islamic learning resources", icon: BookOpen, category: "education" },
  { text: "Check my spiritual progress", icon: TrendingUp, category: "progress" },
  { text: "Schedule a meeting with leadership", icon: Users, category: "communication" },
  { text: "Find upcoming events", icon: Calendar, category: "events" }
];

const aiResponses = {
  greeting: {
    content: "Assalamu Alaikum! I'm your AI Islamic Community Assistant. I'm here to help you with prayers, learning, community activities, and spiritual growth. How can I assist you today?",
    suggestions: ["Show my prayer times", "Find learning resources", "Check upcoming events", "Help with volunteer work"]
  },
  prayers: {
    content: "I can help you with prayer-related activities. Based on your location in Addis Ababa, here are today's prayer times:\n\n🌅 Fajr: 5:30 AM\n☀️ Dhuhr: 12:15 PM\n🌤️ Asr: 3:45 PM\n🌅 Maghrib: 6:20 PM\n🌙 Isha: 7:45 PM\n\nWould you like me to set up prayer reminders or track your prayer consistency?",
    actions: [
      { label: "Set Prayer Reminders", action: "prayer-reminders", icon: Clock },
      { label: "View Prayer Tracker", action: "spiritual-progress", icon: TrendingUp }
    ]
  },
  learning: {
    content: "I found several Islamic learning resources perfect for you:\n\n📚 **Recommended Courses:**\n• Quranic Arabic Fundamentals (4.8★)\n• Islamic Ethics in Modern Life (4.9★)\n• Hadith Sciences Introduction (4.7★)\n\n🎧 **Audio Lectures:**\n• Daily Dhikr and Its Benefits\n• Understanding Tawheed\n• Prophet's Biography Series\n\nBased on your learning history, I suggest starting with Quranic Arabic to enhance your Quran understanding.",
    actions: [
      { label: "Browse Learning Center", action: "learning-center", icon: BookOpen },
      { label: "Start Recommended Course", action: "enroll-course", icon: Star }
    ]
  },
  events: {
    content: "Here are upcoming events that match your interests:\n\n🕌 **This Week:**\n• Friday Prayer & Khutbah - Tomorrow 12:30 PM\n• IT Workshop: Web Development - Dec 25, 2:00 PM\n• Quran Study Circle - Dec 26, 4:00 PM\n\n🎯 **Recommended for You:**\n• Community Iftar (based on your social activity)\n• Islamic Tech Conference (matches your IT skills)\n\nWould you like me to register you for any of these events?",
    actions: [
      { label: "View All Events", action: "my-events", icon: Calendar },
      { label: "Register for Events", action: "register-events", icon: Users }
    ]
  },
  volunteer: {
    content: "Great! I found volunteer opportunities that match your skills and interests:\n\n💻 **High Priority:**\n• IT Support Volunteer (matches your tech skills)\n• Website Development Helper\n\n🤝 **Community Service:**\n• Event Setup Assistant\n• New Member Orientation Guide\n• Quran Teaching Assistant\n\nBased on your previous contributions (24 hours), you're eligible for leadership volunteer roles. Shall I help you apply?",
    actions: [
      { label: "View Opportunities", action: "volunteer-opportunities", icon: Heart },
      { label: "Apply Now", action: "apply-volunteer", icon: Zap }
    ]
  }
};

export default function AIAssistant({ isOpen, onToggle, isMinimized, onMinimize }: AIAssistantProps) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        const greeting: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: aiResponses.greeting.content,
          timestamp: new Date(),
          suggestions: aiResponses.greeting.suggestions
        };
        setMessages([greeting]);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('prayer') || input.includes('salah') || input.includes('namaz')) {
      return {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses.prayers.content,
        timestamp: new Date(),
        actions: aiResponses.prayers.actions
      };
    }
    
    if (input.includes('learn') || input.includes('course') || input.includes('study') || input.includes('quran')) {
      return {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses.learning.content,
        timestamp: new Date(),
        actions: aiResponses.learning.actions
      };
    }
    
    if (input.includes('event') || input.includes('activity') || input.includes('program')) {
      return {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses.events.content,
        timestamp: new Date(),
        actions: aiResponses.events.actions
      };
    }
    
    if (input.includes('volunteer') || input.includes('help') || input.includes('contribute')) {
      return {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses.volunteer.content,
        timestamp: new Date(),
        actions: aiResponses.volunteer.actions
      };
    }

    // Default response with personalized suggestions
    return {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `I understand you're asking about "${userInput}". Let me help you with that! Based on your profile and activity, here are some personalized suggestions:`,
      timestamp: new Date(),
      suggestions: [
        "Check your spiritual progress",
        "Find relevant learning resources",
        "Explore community activities",
        "Get prayer time reminders"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-300",
      isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
    )}>
      <div className="bg-card rounded-2xl border border-border/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse">
                <Bot size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg tracking-wide">AI Assistant</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online & Ready</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onMinimize}
                className="w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggle}
                className="w-8 h-8 p-0"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Brain size={16} className="text-primary" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-3 text-sm",
                    message.type === 'user' 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-secondary/50"
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="text-xs border-primary/30 hover:bg-primary/10"
                          >
                            {action.icon && <action.icon size={12} className="mr-1" />}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary-foreground">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain size={16} className="text-primary" />
                  </div>
                  <div className="bg-secondary/50 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-3">Quick suggestions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {aiSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-xs transition-colors text-left"
                    >
                      <suggestion.icon size={14} className="text-primary flex-shrink-0" />
                      <span className="truncate">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Ask me anything about Islamic community..."
                    className="pr-10 bg-secondary/50 border-border/50"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleVoiceInput}
                    className={cn(
                      "absolute right-1 top-1 w-8 h-8 p-0",
                      isListening && "text-red-400"
                    )}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </Button>
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90 px-3"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}