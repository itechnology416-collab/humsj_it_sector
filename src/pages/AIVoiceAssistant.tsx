import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Volume2, 
  Languages, 
  Brain, 
  Sparkles,
  ArrowLeft,
  Settings,
  HelpCircle,
  Zap,
  Globe,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceAssistant from '@/components/ai/VoiceAssistant';
import { useAI } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';

export default function AIVoiceAssistant() {
  const navigate = useNavigate();
  const { aiInsights } = useAI();
  const [showHelp, setShowHelp] = useState(false);

  const features = [
    {
      icon: Mic,
      title: 'Voice to Text',
      description: 'Convert speech to text in multiple languages with high accuracy',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Volume2,
      title: 'Text to Speech',
      description: 'Natural voice synthesis with customizable speed, pitch, and voice selection',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Languages,
      title: 'Smart Translation',
      description: 'Real-time translation between 19+ languages including Arabic, Amharic, and more',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Brain,
      title: 'AI Integration',
      description: 'Intelligent context understanding for Islamic content and terminology',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  const supportedLanguages = [
    'English', 'Arabic', 'Amharic', 'Oromo', 'Tigrinya', 'Somali',
    'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese', 'Japanese', 'Korean', 'Hindi', 'Urdu', 'Persian', 'Turkish'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">AI Voice Assistant</h1>
                  <p className="text-sm text-muted-foreground">
                    Advanced multilingual voice and translation tools
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Globe size={12} />
                {supportedLanguages.length} Languages
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="gap-2"
              >
                <HelpCircle size={16} />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Help Section */}
        {showHelp && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle size={20} className="text-primary" />
                How to Use AI Voice Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Mic size={16} className="text-blue-500" />
                    Voice to Text
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Select your language</li>
                    <li>• Click "Start Listening"</li>
                    <li>• Speak clearly into microphone</li>
                    <li>• Text appears in real-time</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Volume2 size={16} className="text-green-500" />
                    Text to Speech
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Type or paste text</li>
                    <li>• Adjust voice settings</li>
                    <li>• Select preferred voice</li>
                    <li>• Click "Speak" to hear</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Languages size={16} className="text-purple-500" />
                    Translation
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Choose source language</li>
                    <li>• Select target language</li>
                    <li>• Enter text to translate</li>
                    <li>• Get instant translation</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  <strong>Pro Tip:</strong> Use the voice-to-text feature to capture Islamic lectures, 
                  then translate them to different languages for broader accessibility.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border/30 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", feature.bgColor)}>
                      <Icon size={24} className={feature.color} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Insights Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain size={18} className="text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Spiritual Score</span>
                  <Badge variant="outline">{aiInsights.spiritualScore}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Learning Progress</span>
                  <Badge variant="outline">{aiInsights.learningProgress}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Community Engagement</span>
                  <Badge variant="outline">{aiInsights.communityEngagement}</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/ai-insights')}
                  className="w-full gap-2"
                >
                  <Zap size={14} />
                  View Full Insights
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Supported Languages */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                Supported Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {supportedLanguages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="justify-center py-2">
                    {language}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <MessageSquare size={16} className="inline mr-2" />
                  Special support for Islamic terminology and Arabic transliteration across all languages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Voice Assistant Component */}
        <VoiceAssistant className="mb-8" />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/ai-insights')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Brain size={24} className="text-primary" />
                <span>AI Insights</span>
                <span className="text-xs text-muted-foreground">View detailed analytics</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Settings size={24} className="text-primary" />
                <span>Settings</span>
                <span className="text-xs text-muted-foreground">Customize preferences</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/learning-center')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Sparkles size={24} className="text-primary" />
                <span>Learning Center</span>
                <span className="text-xs text-muted-foreground">Explore more features</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}