import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, BookMarked, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

type Surah = {
  id: number;
  name: string;
  verses: number;
  revealedIn: 'Mecca' | 'Medina';
  completed: boolean;
  progress: number;
};

export default function QuranTrackerSection() {
  const [surahs, setSurahs] = useState<Surah[]>([
    { id: 1, name: 'Al-Fatiha', verses: 7, revealedIn: 'Mecca', completed: true, progress: 100 },
    { id: 2, name: 'Al-Baqarah', verses: 286, revealedIn: 'Medina', completed: false, progress: 45 },
    { id: 3, name: 'Aal-E-Imran', verses: 200, revealedIn: 'Medina', completed: false, progress: 12 },
    { id: 4, name: 'An-Nisa', verses: 176, revealedIn: 'Medina', completed: false, progress: 5 },
    { id: 5, name: 'Al-Ma\'idah', verses: 120, revealedIn: 'Medina', completed: false, progress: 0 },
  ]);

  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [isReading, setIsReading] = useState(false);

  const totalVerses = surahs.reduce((sum, surah) => sum + surah.verses, 0);
  const completedVerses = surahs.reduce(
    (sum, surah) => sum + Math.floor((surah.verses * surah.progress) / 100),
    0
  );
  const progressPercentage = Math.round((completedVerses / totalVerses) * 100);

  const handleStartReading = (surah: Surah) => {
    setActiveSurah(surah);
    setIsReading(true);
  };

  const handleCompleteSurah = (surahId: number) => {
    setSurahs(surahs.map(s => 
      s.id === surahId 
        ? { ...s, completed: true, progress: 100 } 
        : s
    ));
  };

  if (isReading && activeSurah) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{activeSurah.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {activeSurah.revealedIn} • {activeSurah.verses} verses
            </p>
          </div>
          <Button variant="ghost" onClick={() => setIsReading(false)}>
            Back to List
          </Button>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="text-6xl font-arabic mb-8 leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-medium">Verse {currentVerse} of {activeSurah.verses}</div>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="pt-4">
              <Progress value={(currentVerse / activeSurah.verses) * 100} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>0%</span>
                <span>Verse {currentVerse}</span>
                <span>100%</span>
              </div>
            </div>
            <Button 
              className="mt-6"
              onClick={() => handleCompleteSurah(activeSurah.id)}
              disabled={activeSurah.completed}
            >
              {activeSurah.completed ? 'Completed' : 'Mark as Completed'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quran Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedVerses} of {totalVerses} verses completed
                </p>
              </div>
              <span className="text-lg font-bold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Continue Reading</CardTitle>
          <p className="text-sm text-muted-foreground">Pick up where you left off</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surahs.map((surah) => (
              <div 
                key={surah.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                onClick={() => handleStartReading(surah)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold">{surah.id}</span>
                    </div>
                    {surah.completed && (
                      <CheckCircle className="h-5 w-5 text-green-500 absolute -top-1 -right-1 bg-background rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{surah.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {surah.verses} verses • {surah.revealedIn}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <Progress value={surah.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{surah.progress}%</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
