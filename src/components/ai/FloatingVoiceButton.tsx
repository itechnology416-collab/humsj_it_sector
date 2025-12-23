import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  X, 
  Minimize2,
  Maximize2,
  Settings,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAI } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';

interface FloatingVoiceButtonProps {
  className?: string;
}

const QUICK_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'or', name: 'Oromo', flag: '🇪🇹' },
  { code: 'ti', name: 'Tigrinya', flag: '🇪🇷' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' }
];

export default function FloatingVoiceButton({ className }: FloatingVoiceButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isVoiceAssistantOpen, toggleVoiceAssistant, voiceSettings } = useAI();
  
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isVisible, setIsVisible] = useState(true);

  // Hide on certain pages
  useEffect(() => {
    const hiddenPaths = ['/ai-voice-assistant', '/auth'];
    setIsVisible(!hiddenPaths.some(path => location.pathname.includes(path)));
  }, [location.pathname]);

  // Quick voice recognition
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Stop recognition logic here
    } else {
      setIsListening(true);
      // Start recognition logic here
    }
  };

  // Quick text-to-speech
  const speakQuickText = () => {
    if (quickText.trim() && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(quickText);
      utterance.lang = selectedLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      {!isVoiceAssistantOpen && (
        <Button
          onClick={toggleVoiceAssistant}
          className={cn(
            "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50",
            "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
            "border-2 border-primary/20 backdrop-blur-sm",
            "transition-all duration-300 hover:scale-110",
            className
          )}
        >
          <Sparkles size={24} className="text-white" />
        </Button>
      )}

      {/* Floating Voice Assistant Panel */}
      {isVoiceAssistantOpen && (
        <Card className={cn(
          "fixed bottom-6 right-6 w-80 shadow-2xl z-50 border-primary/20",
          "bg-background/95 backdrop-blur-md",
          isMinimized ? "h-16" : "h-96",
          "transition-all duration-300"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <Sparkles size={12} className="text-primary" />
                </div>
                {!isMinimized && "Quick Voice Assistant"}
              </CardTitle>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6 p-0"
                >
                  {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceAssistant}
                  className="w-6 h-6 p-0"
                >
                  <X size={12} />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="space-y-3">
              {/* Language Selection */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUICK_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2 text-xs">
                        <span>{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleListening}
                  className="h-8 text-xs gap-1"
                >
                  {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                  {isListening ? "Stop" : "Listen"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakQuickText}
                  disabled={!quickText.trim()}
                  className="h-8 text-xs gap-1"
                >
                  <Volume2 size={12} />
                  Speak
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/ai-voice-assistant')}
                  className="h-8 text-xs gap-1"
                >
                  <Languages size={12} />
                  Full
                </Button>
              </div>

              {/* Quick Text Input */}
              <Textarea
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Type text to speak or start listening..."
                className="min-h-20 text-xs resize-none"
              />

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {isListening && (
                    <Badge variant="destructive" className="text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                      Listening
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/ai-voice-assistant')}
                  className="h-6 px-2 text-xs gap-1"
                >
                  <Settings size={10} />
                  Advanced
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                💡 <strong>Tip:</strong> Click "Full" for advanced translation and voice settings
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}