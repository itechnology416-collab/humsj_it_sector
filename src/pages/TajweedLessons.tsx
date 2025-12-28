import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { islamicEducationApi } from "@/services/islamicEducationApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Pause,
  Volume2,
  Star,
  CheckCircle,
  Lock,
  Award,
  Headphones,
  Mic,
  Target,
  TrendingUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface TajweedLesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rule_name: string;
  arabic_example: string;
  transliteration: string;
  explanation: string;
  audio_url: string;
  practice_exercises: Exercise[];
  completed: boolean;
  locked: boolean;
  order: number;
}

interface Exercise {
  id: string;
  type: 'listening' | 'pronunciation' | 'identification';
  question: string;
  arabic_text: string;
  options?: string[];
  correct_answer: string;
  audio_url?: string;
}

const mockTajweedLessons: TajweedLesson[] = [
  {
    id: '1',
    title: 'Noon Sakinah and Tanween - Izhar',
    description: 'Learn the clear pronunciation rule when Noon Sakinah or Tanween is followed by throat letters',
    level: 'beginner',
    duration: '15 min',
    rule_name: 'Izhar (الإظهار)',
    arabic_example: 'مِنْ هَادٍ - مِنْ خَيْرٍ',
    transliteration: 'min haadin - min khayrin',
    explanation: 'Izhar means "to make clear" or "to pronounce clearly". When Noon Sakinah (ن with sukoon) or Tanween (double vowel marks) is followed by any of the six throat letters (ء، ه، ع، ح، غ، خ), it must be pronounced clearly without any change.',
    audio_url: 'https://example.com/tajweed/izhar.mp3',
    practice_exercises: [
      {
        id: 'ex1',
        type: 'identification',
        question: 'Identify the Izhar in this verse',
        arabic_text: 'مِنْ هَادٍ',
        options: ['مِنْ هَا', 'هَادٍ', 'No Izhar present'],
        correct_answer: 'مِنْ هَا'
      }
    ],
    completed: true,
    locked: false,
    order: 1
  },
  {
    id: '2',
    title: 'Noon Sakinah and Tanween - Idgham',
    description: 'Master the merging rule with specific letters',
    level: 'beginner',
    duration: '20 min',
    rule_name: 'Idgham (الإدغام)',
    arabic_example: 'مِنْ رَبِّهِمْ - مِنْ لَدُنْهُ',
    transliteration: 'mir rabbihim - mil ladunhu',
    explanation: 'Idgham means "to merge" or "to assimilate". When Noon Sakinah or Tanween is followed by the letters ي، ر، م، ل، و، ن (remembered by the word يرملون), the Noon sound merges into the following letter.',
    audio_url: 'https://example.com/tajweed/idgham.mp3',
    practice_exercises: [
      {
        id: 'ex2',
        type: 'pronunciation',
        question: 'Pronounce this correctly with Idgham',
        arabic_text: 'مِنْ رَبِّهِمْ',
        correct_answer: 'mir rabbihim'
      }
    ],
    completed: false,
    locked: false,
    order: 2
  },
  {
    id: '3',
    title: 'Meem Sakinah Rules',
    description: 'Learn the three rules governing Meem with sukoon',
    level: 'intermediate',
    duration: '25 min',
    rule_name: 'Meem Sakinah (الميم الساكنة)',
    arabic_example: 'هُمْ بِهِ - أَمْ مَنْ',
    transliteration: 'hum bihi - am man',
    explanation: 'Meem Sakinah has three rules: Idgham Shafawi (merging with another Meem), Ikhfa Shafawi (hiding before Ba), and Izhar Shafawi (clear pronunciation before all other letters).',
    audio_url: 'https://example.com/tajweed/meem.mp3',
    practice_exercises: [],
    completed: false,
    locked: true,
    order: 3
  }
];

export default function TajweedLessons() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lessons, setLessons] = useState<TajweedLesson[]>(mockTajweedLessons);
  const [selectedLesson, setSelectedLesson] = useState<TajweedLesson | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  useEffect(() => {
    const savedProgress = localStorage.getItem('tajweed-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const filteredLessons = lessons.filter(lesson => 
    selectedLevel === 'all' || lesson.level === selectedLevel
  );

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalLessons = lessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const markLessonComplete = (lessonId: string) => {
    const updatedLessons = lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, completed: true } : lesson
    );
    setLessons(updatedLessons);
    
    const newProgress = { ...userProgress, [lessonId]: true };
    setUserProgress(newProgress);
    localStorage.setItem('tajweed-progress', JSON.stringify(newProgress));
  };

  return (
    <ProtectedPageLayout 
      title="Tajweed Lessons" 
      subtitle="Master the art of Quranic recitation with proper pronunciation rules"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header & Progress */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Tajweed Mastery</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn proper Quranic pronunciation step by step
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {completedLessons}/{totalLessons}
                </div>
                <p className="text-xs text-muted-foreground">Lessons Complete</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                    <Target size={20} className="text-green-600" />
                  </div>
                  <p className="text-sm font-medium">Interactive</p>
                  <p className="text-xs text-muted-foreground">Practice exercises</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                    <Headphones size={20} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Audio Guided</p>
                  <p className="text-xs text-muted-foreground">Listen & learn</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                    <Mic size={20} className="text-purple-600" />
                  </div>
                  <p className="text-sm font-medium">Pronunciation</p>
                  <p className="text-xs text-muted-foreground">Voice practice</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                    <Award size={20} className="text-orange-600" />
                  </div>
                  <p className="text-sm font-medium">Certified</p>
                  <p className="text-xs text-muted-foreground">Track progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Filter by Level:</span>
              <div className="flex gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={selectedLevel === level ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level as unknown)}
                    className="capitalize"
                  >
                    {level === 'all' ? 'All Levels' : level}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <Card 
              key={lesson.id}
              className={cn(
                "hover:shadow-lg transition-all duration-300 animate-slide-up relative",
                lesson.completed && "ring-2 ring-green-500/50 bg-green-50/50 dark:bg-green-950/20",
                lesson.locked && "opacity-60"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {lesson.locked && (
                <div className="absolute top-4 right-4 z-10">
                  <Lock size={16} className="text-muted-foreground" />
                </div>
              )}
              
              {lesson.completed && (
                <div className="absolute top-4 right-4 z-10">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
              )}

              <CardHeader>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge className={cn("text-xs", getLevelColor(lesson.level))}>
                      {lesson.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {lesson.duration}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lesson.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-1">
                        {lesson.rule_name}
                      </p>
                      <p className="text-2xl font-arabic leading-relaxed" dir="rtl">
                        {lesson.arabic_example}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lesson.transliteration}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lesson.explanation.substring(0, 120)}...
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      disabled={lesson.locked}
                      onClick={() => setSelectedLesson(lesson)}
                      className="flex-1"
                    >
                      {lesson.completed ? (
                        <>
                          <CheckCircle size={14} className="mr-2" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play size={14} className="mr-2" />
                          Start Lesson
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={lesson.locked}
                      className="w-10 h-8 p-0"
                    >
                      <Volume2 size={14} />
                    </Button>
                  </div>
                  
                  {lesson.practice_exercises.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Target size={12} />
                      {lesson.practice_exercises.length} Practice Exercise{lesson.practice_exercises.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lesson Detail Modal */}
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-display mb-2">
                      {selectedLesson.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getLevelColor(selectedLesson.level))}>
                        {selectedLesson.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {selectedLesson.duration}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLesson(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="lesson" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="lesson">Lesson</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="lesson" className="space-y-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold text-primary">
                        {selectedLesson.rule_name}
                      </h3>
                      
                      <div className="p-6 bg-muted/30 rounded-lg">
                        <p className="text-3xl font-arabic leading-relaxed mb-2" dir="rtl">
                          {selectedLesson.arabic_example}
                        </p>
                        <p className="text-lg text-muted-foreground">
                          {selectedLesson.transliteration}
                        </p>
                      </div>
                      
                      <div className="text-left">
                        <h4 className="font-semibold mb-2">Explanation:</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedLesson.explanation}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={() => markLessonComplete(selectedLesson.id)}
                        disabled={selectedLesson.completed}
                        className="gap-2"
                      >
                        {selectedLesson.completed ? (
                          <>
                            <CheckCircle size={16} />
                            Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="practice" className="space-y-4">
                    {selectedLesson.practice_exercises.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLesson.practice_exercises.map((exercise, index) => (
                          <Card key={exercise.id}>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <h4 className="font-medium">Exercise {index + 1}</h4>
                                <p className="text-sm">{exercise.question}</p>
                                <div className="text-center p-4 bg-muted/30 rounded">
                                  <p className="text-xl font-arabic" dir="rtl">
                                    {exercise.arabic_text}
                                  </p>
                                </div>
                                {exercise.options && (
                                  <div className="space-y-2">
                                    {exercise.options.map((option, optIndex) => (
                                      <Button
                                        key={optIndex}
                                        variant="outline"
                                        className="w-full justify-start"
                                      >
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Practice exercises coming soon for this lesson.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="audio" className="space-y-4">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Volume2 size={32} className="text-primary" />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Audio Pronunciation</h4>
                        <p className="text-sm text-muted-foreground">
                          Listen to the correct pronunciation of this Tajweed rule
                        </p>
                      </div>
                      
                      <Button
                        size="lg"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="gap-2"
                      >
                        {isPlaying ? (
                          <>
                            <Pause size={20} />
                            Pause Audio
                          </>
                        ) : (
                          <>
                            <Play size={20} />
                            Play Audio
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}