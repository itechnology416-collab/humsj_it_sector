import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Play, 
  Pause,
  RotateCcw,
  Volume2,
  Timer,
  Sparkles,
  Moon,
  Sun,
  Waves,
  Leaf,
  Mountain,
  Star,
  Clock,
  Target,
  Award,
  TrendingUp,
  Headphones,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  type: 'dhikr' | 'reflection' | 'breathing' | 'gratitude' | 'repentance';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  arabic_text?: string;
  transliteration?: string;
  english_meaning?: string;
  instructions: string[];
  benefits: string[];
  background_sound?: string;
  guided_audio?: string;
  icon: string;
  color: string;
}

const meditationSessions: MeditationSession[] = [
  {
    id: '1',
    title: 'Dhikr of Allah',
    description: 'Mindful remembrance of Allah through repetitive dhikr',
    type: 'dhikr',
    duration: 10,
    difficulty: 'beginner',
    arabic_text: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illa Allah',
    english_meaning: 'There is no god but Allah',
    instructions: [
      'Sit comfortably facing the Qibla',
      'Close your eyes and take deep breaths',
      'Repeat "La ilaha illa Allah" with each breath',
      'Focus on the meaning and feel Allah\'s presence',
      'Continue for the set duration'
    ],
    benefits: ['Spiritual purification', 'Inner peace', 'Increased faith', 'Stress relief'],
    background_sound: 'nature',
    guided_audio: 'dhikr-guided.mp3',
    icon: '🤲',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '2',
    title: 'Gratitude Reflection',
    description: 'Contemplating Allah\'s countless blessings',
    type: 'gratitude',
    duration: 15,
    difficulty: 'beginner',
    arabic_text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Alhamdulillahi rabbil alameen',
    english_meaning: 'All praise is due to Allah, Lord of all the worlds',
    instructions: [
      'Find a quiet, comfortable space',
      'Begin with Alhamdulillah',
      'Reflect on 5 blessings from today',
      'Thank Allah for each blessing specifically',
      'End with gratitude for guidance'
    ],
    benefits: ['Increased gratitude', 'Positive mindset', 'Spiritual awareness', 'Contentment'],
    background_sound: 'rain',
    guided_audio: 'gratitude-guided.mp3',
    icon: '🙏',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    title: 'Istighfar Meditation',
    description: 'Seeking Allah\'s forgiveness with mindful repentance',
    type: 'repentance',
    duration: 12,
    difficulty: 'intermediate',
    arabic_text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha al-azeem alladhi la ilaha illa huwa al-hayyu al-qayyum wa atubu ilayh',
    english_meaning: 'I seek forgiveness from Allah the Mighty, whom there is no god but He, the Living, the Eternal, and I repent to Him',
    instructions: [
      'Perform ablution if possible',
      'Sit in a humble position',
      'Reflect on your shortcomings',
      'Recite Istighfar with sincerity',
      'Feel Allah\'s mercy and forgiveness'
    ],
    benefits: ['Spiritual cleansing', 'Peace of mind', 'Divine mercy', 'Soul purification'],
    background_sound: 'silence',
    guided_audio: 'istighfar-guided.mp3',
    icon: '💧',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: '4',
    title: 'Breath of Tawheed',
    description: 'Breathing meditation focused on the Oneness of Allah',
    type: 'breathing',
    duration: 8,
    difficulty: 'beginner',
    arabic_text: 'اللَّهُ أَحَدٌ',
    transliteration: 'Allahu Ahad',
    english_meaning: 'Allah is One',
    instructions: [
      'Sit with straight posture',
      'Inhale slowly while thinking "Allah"',
      'Hold breath briefly contemplating His Oneness',
      'Exhale slowly while thinking "Ahad"',
      'Maintain steady rhythm throughout'
    ],
    benefits: ['Improved focus', 'Stress reduction', 'Spiritual connection', 'Mental clarity'],
    background_sound: 'ocean',
    guided_audio: 'breathing-guided.mp3',
    icon: '🌬️',
    color: 'from-teal-500 to-blue-500'
  },
  {
    id: '5',
    title: 'Night Reflection',
    description: 'Evening contemplation on the day and preparation for rest',
    type: 'reflection',
    duration: 20,
    difficulty: 'advanced',
    arabic_text: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
    transliteration: 'Rabbana la tu\'akhidhna in naseena aw akhta\'na',
    english_meaning: 'Our Lord, do not impose blame upon us if we forget or make mistakes',
    instructions: [
      'Dim the lights and create calm atmosphere',
      'Review the day\'s actions and intentions',
      'Seek forgiveness for any mistakes',
      'Express gratitude for the day\'s blessings',
      'Make dua for guidance and protection'
    ],
    benefits: ['Self-reflection', 'Spiritual growth', 'Better sleep', 'Increased mindfulness'],
    background_sound: 'night',
    guided_audio: 'night-reflection-guided.mp3',
    icon: '🌙',
    color: 'from-indigo-500 to-purple-500'
  }
];

const backgroundSounds = [
  { id: 'nature', name: 'Nature Sounds', icon: Leaf },
  { id: 'rain', name: 'Gentle Rain', icon: Waves },
  { id: 'ocean', name: 'Ocean Waves', icon: Waves },
  { id: 'night', name: 'Night Ambience', icon: Moon },
  { id: 'silence', name: 'Silence', icon: Volume2 }
];

export default function IslamicMeditation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState('nature');
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  const [totalMeditationTime, setTotalMeditationTime] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('meditation-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedSessions(progress.completed || []);
      setTotalMeditationTime(progress.totalTime || 0);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const startSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration * 60);
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    if (selectedSession) {
      setTimeRemaining(selectedSession.duration * 60);
    }
  };

  const handleSessionComplete = () => {
    if (selectedSession && !completedSessions.includes(selectedSession.id)) {
      const newCompleted = [...completedSessions, selectedSession.id];
      const newTotalTime = totalMeditationTime + selectedSession.duration;
      
      setCompletedSessions(newCompleted);
      setTotalMeditationTime(newTotalTime);
      
      localStorage.setItem('meditation-progress', JSON.stringify({
        completed: newCompleted,
        totalTime: newTotalTime
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!selectedSession) return 0;
    const totalSeconds = selectedSession.duration * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Meditation" 
      subtitle="Mindful worship and spiritual reflection through Islamic practices"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header & Progress */}
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Islamic Meditation & Mindfulness</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Deepen your spiritual connection through mindful Islamic practices
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">
                  {totalMeditationTime}
                </div>
                <p className="text-xs text-muted-foreground">Minutes Meditated</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
                  <Target size={20} className="text-teal-600" />
                </div>
                <p className="text-sm font-medium">{completedSessions.length} Sessions</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{totalMeditationTime} Min</p>
                <p className="text-xs text-muted-foreground">Total time</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Sparkles size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Mindful Practice</p>
                <p className="text-xs text-muted-foreground">Islamic approach</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Spiritual Growth</p>
                <p className="text-xs text-muted-foreground">Inner peace</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Session */}
        {selectedSession && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedSession.icon}</span>
                  <div>
                    <h3 className="text-xl">{selectedSession.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSession.description}</p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(selectedSession.difficulty)}>
                  {selectedSession.difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Text */}
              {selectedSession.arabic_text && (
                <div className="text-center space-y-2">
                  <p className="text-2xl font-arabic text-primary leading-relaxed" dir="rtl">
                    {selectedSession.arabic_text}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    {selectedSession.transliteration}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedSession.english_meaning}
                  </p>
                </div>
              )}

              {/* Timer Display */}
              <div className="text-center space-y-4">
                <div className="text-6xl font-mono font-bold text-primary">
                  {formatTime(timeRemaining)}
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                
                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={pauseSession}
                    size="lg"
                    className="gap-2"
                  >
                    {isActive ? (
                      <>
                        <Pause size={20} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        {timeRemaining === selectedSession.duration * 60 ? 'Start' : 'Resume'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={resetSession}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Background Sound Selection */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Headphones size={16} />
                  Background Sound
                </h4>
                <div className="flex flex-wrap gap-2">
                  {backgroundSounds.map((sound) => {
                    const SoundIcon = sound.icon;
                    return (
                      <Button
                        key={sound.id}
                        variant={selectedBackground === sound.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBackground(sound.id)}
                        className="gap-2"
                      >
                        <SoundIcon size={14} />
                        {sound.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Settings size={16} />
                  Instructions
                </h4>
                <div className="space-y-2">
                  {selectedSession.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <Badge variant="outline" className="text-xs min-w-[24px] h-6 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <p className="text-muted-foreground">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meditation Sessions */}
        <div className="space-y-4">
          <h3 className="text-2xl font-display">Available Sessions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationSessions.map((session, index) => (
              <Card 
                key={session.id}
                className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => startSession(session)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${session.color} flex items-center justify-center text-2xl`}>
                        {session.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {session.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {session.duration} minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                      {completedSessions.includes(session.id) && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {session.description}
                    </p>
                    
                    {/* Benefits */}
                    <div>
                      <h5 className="font-medium text-xs mb-2">Benefits:</h5>
                      <div className="flex flex-wrap gap-1">
                        {session.benefits.slice(0, 3).map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Timer size={12} />
                        {session.duration} min
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          startSession(session);
                        }}
                        className="gap-1"
                      >
                        <Play size={12} />
                        Start
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="dua" size="medium" />
          <IslamicEducationFiller type="tip" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}