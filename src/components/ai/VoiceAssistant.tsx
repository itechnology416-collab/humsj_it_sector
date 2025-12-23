import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  Play, 
  Pause, 
  Square,
  Download,
  Upload,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useVoiceAssistant, useTranslation } from '@/hooks/useVoiceAssistant';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  className?: string;
}

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'or', name: 'Oromo', flag: '🇪🇹' },
  { code: 'ti', name: 'Tigrinya', flag: '🇪🇷' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' }
];

export default function VoiceAssistant({ className }: VoiceAssistantProps) {
  // Voice Assistant Hooks
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const {
    isListening,
    transcript,
    error: voiceError,
    isSupported,
    isSpeaking,
    availableVoices,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
    clearError
  } = useVoiceAssistant({ language: selectedLanguage });

  const { translate, isTranslating, error: translationError } = useTranslation();
  
  // Text-to-Speech States
  const [speechText, setSpeechText] = useState('');
  const [speechRate, setSpeechRate] = useState([1]);
  const [speechPitch, setSpeechPitch] = useState([1]);
  const [speechVolume, setSpeechVolume] = useState([1]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  
  // Translation States
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('ar');
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  
  // General States
  const [activeTab, setActiveTab] = useState('voice-to-text');

  // Set default voice when voices are loaded
  useEffect(() => {
    if (availableVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(availableVoices[0].name);
    }
  }, [availableVoices, selectedVoice]);

  // Text-to-Speech Functions
  const speakText = (text: string = speechText) => {
    if (text.trim()) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      speak(text, {
        rate: speechRate[0],
        pitch: speechPitch[0],
        volume: speechVolume[0],
        voice
      });
    }
  };

  // Translation Functions
  const translateText = async (text: string = textToTranslate) => {
    if (!text.trim()) return;
    
    try {
      const result = await translate(text, sourceLanguage, targetLanguage);
      if (result) {
        const translationResult: TranslationResult = {
          originalText: text,
          translatedText: result.translatedText,
          sourceLanguage,
          targetLanguage,
          confidence: result.confidence
        };
        setTranslationResult(translationResult);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    if (translationResult) {
      setTextToTranslate(translationResult.translatedText);
      setTranslationResult(null);
    }
  };

  const currentError = voiceError || translationError;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Languages size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl">AI Voice Assistant</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Advanced voice recognition, text-to-speech, and translation
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice-to-text" className="gap-2">
              <Mic size={16} />
              Voice to Text
            </TabsTrigger>
            <TabsTrigger value="text-to-voice" className="gap-2">
              <Volume2 size={16} />
              Text to Voice
            </TabsTrigger>
            <TabsTrigger value="translator" className="gap-2">
              <Languages size={16} />
              Translator
            </TabsTrigger>
          </TabsList>

          {/* Voice to Text Tab */}
          <TabsContent value="voice-to-text" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {isSupported ? (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle size={12} className="mr-1" />
                    Supported
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600">
                    <AlertCircle size={12} className="mr-1" />
                    Not Supported
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={!isSupported}
                  variant={isListening ? "destructive" : "default"}
                  className="gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff size={16} />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic size={16} />
                      Start Listening
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Textarea
                value={transcript}
                readOnly
                placeholder="Speak into your microphone..."
                className="min-h-32 resize-none bg-muted/50"
              />
              {isListening && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            {transcript && (
              <div className="flex gap-2">
                <Button
                  onClick={() => speakText(transcript)}
                  variant="outline"
                  className="gap-2"
                >
                  <Volume2 size={16} />
                  Speak Text
                </Button>
                <Button
                  onClick={() => {
                    setTextToTranslate(transcript);
                    setActiveTab('translator');
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Languages size={16} />
                  Translate
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Text to Voice Tab */}
          <TabsContent value="text-to-voice" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Voice Settings</label>
                
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Speed: {speechRate[0].toFixed(1)}x
                  </label>
                  <Slider
                    value={speechRate}
                    onValueChange={setSpeechRate}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Pitch: {speechPitch[0].toFixed(1)}
                  </label>
                  <Slider
                    value={speechPitch}
                    onValueChange={setSpeechPitch}
                    min={0}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Volume: {Math.round(speechVolume[0] * 100)}%
                  </label>
                  <Slider
                    value={speechVolume}
                    onValueChange={setSpeechVolume}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Text to Speak</label>
                <Textarea
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  placeholder="Enter text to convert to speech..."
                  className="min-h-32 resize-none"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => speakText()}
                    disabled={!speechText.trim() || isSpeaking}
                    className="flex-1 gap-2"
                  >
                    {isSpeaking ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Speak
                      </>
                    )}
                  </Button>
                  
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      variant="destructive"
                      className="gap-2"
                    >
                      <Square size={16} />
                      Stop
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Translator Tab */}
          <TabsContent value="translator" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={swapLanguages}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  ⇄
                </Button>
                
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={() => translateText()}
                disabled={!textToTranslate.trim() || isTranslating}
                className="gap-2"
              >
                {isTranslating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages size={16} />
                    Translate
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name} Text
                </label>
                <Textarea
                  value={textToTranslate}
                  onChange={(e) => setTextToTranslate(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="min-h-32 resize-none"
                />
                <Button
                  onClick={() => speakText(textToTranslate)}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Volume2 size={14} />
                  Speak Original
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name} Translation
                </label>
                <div className="relative">
                  <Textarea
                    value={translationResult?.translatedText || ''}
                    readOnly
                    placeholder="Translation will appear here..."
                    className="min-h-32 resize-none bg-muted/50"
                  />
                  {translationResult && (
                    <Badge className="absolute top-2 right-2 text-xs">
                      {Math.round(translationResult.confidence)}% confidence
                    </Badge>
                  )}
                </div>
                {translationResult && (
                  <Button
                    onClick={() => speakText(translationResult.translatedText)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Volume2 size={14} />
                    Speak Translation
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {currentError && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle size={16} />
              <span className="text-sm">{currentError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearError();
                }}
                className="ml-auto"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}