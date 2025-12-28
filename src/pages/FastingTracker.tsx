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
  Moon, 
  Sun, 
  Calendar, 
  Clock,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  Zap,
  Heart,
  BookOpen,
  Timer,
  Sunrise,
  Sunset
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface FastingDay {
  id: string;
  date: string;
  type: 'ramadan' | 'voluntary' | 'sunnah' | 'makeup';
  status: 'planned' | 'active' | 'completed' | 'broken' | 'missed';
  suhoor_time?: string;
  iftar_time?: string;
  intention: string;
  notes?: string;
  spiritual_goals: string[];
  completed_goals: string[];
  duas_recited: number;
  quran_pages: number;
  charity_given?: number;
}

interface FastingStats {
  total_fasts: number;
  completed_fasts: number;
  current_streak: number;
  longest_streak: number;
  total_duas: number;
  total_quran_pages: number;
  total_charity: number;
}

const mockFastingData: FastingDay[] = [
  {
    id: '1',
    date: '2024-12-24',
    type: 'voluntary',
    status: 'active',
    suhoor_time: '05:30',
    iftar_time: '18:45',
    intention: 'Seeking Allah\'s pleasure and spiritual purification',
    spiritual_goals: ['Recite 5 pages of Quran', 'Make 100 istighfar', 'Give charity', 'Avoid negative speech'],
    completed_goals: ['Recite 5 pages of Quran', 'Make 100 istighfar'],
    duas_recited: 150,
    quran_pages: 5,
    charity_given: 25
  },
  {
    id: '2',
    date: '2024-12-23',
    type: 'sunnah',
    status: 'completed',
    suhoor_time: '05:25',
    iftar_time: '18:44',
    intention: 'Following the Sunnah of Prophet Muhammad (PBUH)',
    notes: 'Alhamdulillah, completed successfully with good spiritual focus',
    spiritual_goals: ['Recite Quran', 'Extra prayers', 'Dhikr', 'Help others'],
    completed_goals: ['Recite Quran', 'Extra prayers', 'Dhikr', 'Help others'],
    duas_recited: 200,
    quran_pages: 8,
    charity_given: 50
  }
];

const fastingTypes = [
  { id: 'ramadan', name: 'Ramadan', color: 'from-green-500 to-emerald-500', icon: Moon },
  { id: 'voluntary', name: 'Voluntary', color: 'from-blue-500 to-cyan-500', icon: Star },
  { id: 'sunnah', name: 'Sunnah', color: 'from-purple-500 to-violet-500', icon: Heart },
  { id: 'makeup', name: 'Make-up', color: 'from-orange-500 to-red-500', icon: Target }
];

const spiritualGoals = [
  'Recite 5 pages of Quran',
  'Make 100 istighfar',
  'Pray Tahajjud',
  'Give charity',
  'Avoid negative speech',
  'Extra dhikr',
  'Help someone in need',
  'Read Islamic book',
  'Make dua for family',
  'Seek forgiveness'
];

export default function FastingTracker() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fastingDays, setFastingDays] = useState<FastingDay[]>(mockFastingData);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentFast, setCurrentFast] = useState<FastingDay | null>(null);
  const [stats, setStats] = useState<FastingStats>({
    total_fasts: 45,
    completed_fasts: 42,
    current_streak: 3,
    longest_streak: 15,
    total_duas: 5000,
    total_quran_pages: 250,
    total_charity: 500
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysFast = fastingDays.find(fast => fast.date === today);
    setCurrentFast(todaysFast || null);
  }, [fastingDays]);

  const startFast = (type: string, intention: string, goals: string[]) => {
    const newFast: FastingDay = {
      id: Date.now().toString(),
      date: selectedDate,
      type: type as unknown,
      status: 'active',
      intention,
      spiritual_goals: goals,
      completed_goals: [],
      duas_recited: 0,
      quran_pages: 0
    };
    
    setFastingDays([...fastingDays, newFast]);
    setCurrentFast(newFast);
  };

  const completeFast = () => {
    if (currentFast) {
      const updatedFast = { ...currentFast, status: 'completed' as const };
      setFastingDays(fastingDays.map(fast => 
        fast.id === currentFast.id ? updatedFast : fast
      ));
      setCurrentFast(updatedFast);
    }
  };

  const breakFast = (reason: string) => {
    if (currentFast) {
      const updatedFast = { ...currentFast, status: 'broken' as const, notes: reason };
      setFastingDays(fastingDays.map(fast => 
        fast.id === currentFast.id ? updatedFast : fast
      ));
      setCurrentFast(updatedFast);
    }
  };

  const toggleGoal = (goal: string) => {
    if (currentFast) {
      const isCompleted = currentFast.completed_goals.includes(goal);
      const updatedGoals = isCompleted
        ? currentFast.completed_goals.filter(g => g !== goal)
        : [...currentFast.completed_goals, goal];
      
      const updatedFast = { ...currentFast, completed_goals: updatedGoals };
      setFastingDays(fastingDays.map(fast => 
        fast.id === currentFast.id ? updatedFast : fast
      ));
      setCurrentFast(updatedFast);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-600';
      case 'completed': return 'bg-green-500/20 text-green-600';
      case 'broken': return 'bg-red-500/20 text-red-600';
      case 'missed': return 'bg-gray-500/20 text-gray-600';
      case 'planned': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    const fastType = fastingTypes.find(t => t.id === type);
    return fastType?.color || 'from-gray-500 to-slate-500';
  };

  const completionRate = (stats.completed_fasts / stats.total_fasts) * 100;

  return (
    <ProtectedPageLayout 
      title="Fasting Tracker" 
      subtitle="Track your Islamic fasting journey and spiritual progress"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header & Stats */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Moon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Fasting Tracker</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor your fasting journey and spiritual development
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.current_streak}
                </div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{stats.completed_fasts}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Target size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{Math.round(completionRate)}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{stats.total_quran_pages}</p>
                <p className="text-xs text-muted-foreground">Quran Pages</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Heart size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">${stats.total_charity}</p>
                <p className="text-xs text-muted-foreground">Charity Given</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Current Fast Status */}
        {currentFast && (
          <Card className={cn(
            "border-2",
            currentFast.status === 'active' ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20" :
            currentFast.status === 'completed' ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" :
            "border-border"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTypeColor(currentFast.type)} flex items-center justify-center`}>
                    <Moon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg">Today's Fast</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {currentFast.type} Fast
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(currentFast.status)}>
                  {currentFast.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Intention */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Intention (Niyyah)</h4>
                <p className="text-sm text-muted-foreground italic">
                  "{currentFast.intention}"
                </p>
              </div>

              {/* Timing */}
              {(currentFast.suhoor_time || currentFast.iftar_time) && (
                <div className="grid grid-cols-2 gap-4">
                  {currentFast.suhoor_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sunrise size={16} className="text-orange-500" />
                      <span>Suhoor: {currentFast.suhoor_time}</span>
                    </div>
                  )}
                  {currentFast.iftar_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sunset size={16} className="text-purple-500" />
                      <span>Iftar: {currentFast.iftar_time}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Spiritual Goals */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Spiritual Goals ({currentFast.completed_goals.length}/{currentFast.spiritual_goals.length})
                </h4>
                <div className="space-y-2">
                  {currentFast.spiritual_goals.map((goal, index) => {
                    const isCompleted = currentFast.completed_goals.includes(goal);
                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors",
                          isCompleted ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : "bg-muted/30 border-border"
                        )}
                        onClick={() => toggleGoal(goal)}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          isCompleted ? "bg-green-500 border-green-500" : "border-muted-foreground"
                        )}>
                          {isCompleted && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={cn(
                          "text-sm",
                          isCompleted ? "line-through text-muted-foreground" : ""
                        )}>
                          {goal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-blue-600">{currentFast.duas_recited}</div>
                  <div className="text-xs text-muted-foreground">Duas Recited</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-green-600">{currentFast.quran_pages}</div>
                  <div className="text-xs text-muted-foreground">Quran Pages</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-purple-600">${currentFast.charity_given || 0}</div>
                  <div className="text-xs text-muted-foreground">Charity Given</div>
                </div>
              </div>

              {/* Action Buttons */}
              {currentFast.status === 'active' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={completeFast}
                    className="flex-1 gap-2"
                  >
                    <CheckCircle size={16} />
                    Complete Fast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => breakFast('Unintentional break')}
                    className="gap-2"
                  >
                    Break Fast
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Fasting Calendar & History */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="plan">Plan Fast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Fasting Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {/* Calendar header */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-semibold p-2 text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days - simplified for demo */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 5; // Start from previous month
                    const isCurrentMonth = day > 0 && day <= 31;
                    const hasfast = fastingDays.some(fast => 
                      new Date(fast.date).getDate() === day
                    );
                    
                    return (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded-lg cursor-pointer transition-colors",
                          !isCurrentMonth && "text-muted-foreground/50",
                          hasfast && "bg-primary/20 border border-primary/30",
                          day === new Date().getDate() && "bg-primary text-primary-foreground"
                        )}
                      >
                        {isCurrentMonth ? day : ''}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {fastingDays.map((fast, index) => (
                <Card key={fast.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getTypeColor(fast.type)} flex items-center justify-center`}>
                          <Moon size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium capitalize">{fast.type} Fast</h4>
                            <Badge className={getStatusColor(fast.status)}>
                              {fast.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(fast.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Goals: {fast.completed_goals.length}/{fast.spiritual_goals.length}</div>
                        <div>Duas: {fast.duas_recited}</div>
                      </div>
                    </div>
                    
                    {fast.notes && (
                      <p className="text-sm text-muted-foreground mt-3 italic">
                        {fast.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plan New Fast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fast Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {fastingTypes.map((type) => {
                      const TypeIcon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant="outline"
                          className="h-auto p-4 flex flex-col gap-2"
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                            <TypeIcon size={16} className="text-white" />
                          </div>
                          <span className="text-sm">{type.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Spiritual Goals</label>
                  <div className="space-y-2">
                    {spiritualGoals.slice(0, 6).map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full gap-2">
                  <Target size={16} />
                  Start Fast
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="hadith" size="medium" />
          <IslamicEducationFiller type="tip" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}