import { useState, useRef, useEffect, useCallback } from 'react';

interface UseVoiceAssistantProps {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface VoiceAssistantState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

export function useVoiceAssistant({
  language = 'en-US',
  continuous = true,
  interimResults = true
}: UseVoiceAssistantProps = {}) {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    transcript: '',
    error: null,
    isSupported: false
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = language;
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setState(prev => ({
            ...prev,
            transcript: finalTranscript + interimTranscript,
            error: null
          }));
        };
        
        recognitionRef.current.onerror = (event) => {
          setState(prev => ({
            ...prev,
            error: `Speech recognition error: ${event.error}`,
            isListening: false
          }));
        };
        
        recognitionRef.current.onend = () => {
          setState(prev => ({
            ...prev,
            isListening: false
          }));
        };
        
        setState(prev => ({ ...prev, isSupported: true }));
      }
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);
      };
      
      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, [language, continuous, interimResults]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState(prev => ({
        ...prev,
        error: null,
        transcript: '',
        isListening: true
      }));
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const speak = useCallback((text: string, settings: SpeechSettings = { rate: 1, pitch: 1, volume: 1 }) => {
    if (synthRef.current && text.trim()) {
      // Stop any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (settings.voice) {
        utterance.voice = settings.voice;
      }
      
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.lang = language;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setState(prev => ({
          ...prev,
          error: `Speech synthesis error: ${event.error}`
        }));
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      error: null
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    // State
    isListening: state.isListening,
    transcript: state.transcript,
    error: state.error,
    isSupported: state.isSupported,
    isSpeaking,
    availableVoices,
    
    // Actions
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
    clearError
  };
}

// Translation hook (mock implementation - replace with actual translation service)
export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<{ translatedText: string; confidence: number } | null> => {
    if (!text.trim()) return null;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Mock translation - replace with actual translation service
      const mockTranslation = {
        translatedText: `[${targetLanguage.toUpperCase()}] ${text}`,
        confidence: Math.random() * 20 + 80 // 80-100%
      };
      
      return mockTranslation;
    } catch (err) {
      setError('Translation failed. Please try again.');
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translate,
    isTranslating,
    error,
    clearError: () => setError(null)
  };
}

// Language detection hook (mock implementation)
export function useLanguageDetection() {
  const detectLanguage = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;
    
    // Simple mock language detection
    const arabicPattern = /[\u0600-\u06FF]/;
    const amharicPattern = /[\u1200-\u137F]/;
    
    if (arabicPattern.test(text)) return 'ar';
    if (amharicPattern.test(text)) return 'am';
    
    return 'en'; // Default to English
  }, []);

  return { detectLanguage };
}