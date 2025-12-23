import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  BookOpen,
  List,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { quranApiService, type Chapter, type Reciter } from '@/services/quranApi';

interface QuranAudioPlayerProps {
  className?: string;
  showPlaylist?: boolean;
}

export default function QuranAudioPlayer({ className, showPlaylist = true }: QuranAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackRate, setPlaybackRate] = useState([1]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [chaptersData, recitersData] = await Promise.all([
          quranApiService.getChapters(),
          quranApiService.getReciters()
        ]);
        
        setChapters(chaptersData);
        setReciters(recitersData);
        
        if (chaptersData.length > 0) {
          setCurrentChapter(chaptersData[0]); // Al-Fatihah
        }
        
        if (recitersData.length > 0) {
          setSelectedReciter(recitersData[0]);
        }
      } catch (err) {
        console.error('Error loading Quran data:', err);
        setError('Failed to load Quran data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Get audio URL for current chapter and reciter
  const getAudioUrl = (chapter: Chapter, reciter: Reciter) => {
    if (!chapter || !reciter) return '';
    
    // Use the real Quran audio API URL structure
    const chapterNumber = String(chapter.id).padStart(3, '0');
    return `https://server8.mp3quran.net/afs/${chapterNumber}.mp3`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
      audioRef.current.playbackRate = playbackRate[0];
    }
  }, [volume, isMuted, playbackRate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const playNext = () => {
    if (!currentChapter || chapters.length === 0) return;
    
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    let nextIndex: number;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * chapters.length);
    } else {
      nextIndex = (currentIndex + 1) % chapters.length;
    }
    
    setCurrentChapter(chapters[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentChapter || chapters.length === 0) return;
    
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    const prevIndex = currentIndex === 0 ? chapters.length - 1 : currentIndex - 1;
    setCurrentChapter(chapters[prevIndex]);
  };

  const seekTo = (time: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time[0];
    setCurrentTime(time[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Loading State */}
      {isLoading && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-8 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-lg font-medium">Loading Quran Audio Player...</p>
            <p className="text-sm text-muted-foreground">Fetching chapters and reciters</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <p className="text-red-700 dark:text-red-300 font-medium mb-2">Error Loading Quran Data</p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Player - Only show when data is loaded */}
      {!isLoading && !error && currentChapter && selectedReciter && (
        <>
          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={getAudioUrl(currentChapter, selectedReciter)}
            preload="metadata"
          />

          {/* Main Player */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display">Quran Audio Player</h3>
                  <p className="text-sm text-muted-foreground">Listen to the Holy Quran</p>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Current Surah Info */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-arabic text-green-700 dark:text-green-300" dir="rtl">
                  {currentChapter.name_arabic}
                </h2>
                <h3 className="text-lg font-semibold">{currentChapter.name_simple}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentChapter.translated_name.name} • {currentChapter.verses_count} verses • {currentChapter.revelation_place}
                </p>
                <Badge variant="outline" className="text-xs">
                  Reciter: {selectedReciter.name}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  onValueChange={seekTo}
                  max={duration || 100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playPrevious}
                  className="w-10 h-10 p-0"
                >
                  <SkipBack size={16} />
                </Button>

                <Button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={playNext}
                  className="w-10 h-10 p-0"
                >
                  <SkipForward size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={stop}
                  className="w-10 h-10 p-0"
                >
                  <Square size={16} />
                </Button>
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={cn("w-8 h-8 p-0", isRepeat && "text-green-600")}
                  >
                    <Repeat size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={cn("w-8 h-8 p-0", isShuffle && "text-green-600")}
                  >
                    <Shuffle size={16} />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 p-0"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={1}
                    step={0.1}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reciter</label>
                  <Select 
                    value={selectedReciter.id.toString()} 
                    onValueChange={(value) => {
                      const reciter = reciters.find(r => r.id.toString() === value);
                      if (reciter) setSelectedReciter(reciter);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reciters.map((reciter) => (
                        <SelectItem key={reciter.id} value={reciter.id.toString()}>
                          <div className="flex flex-col">
                            <span>{reciter.name}</span>
                            <span className="text-xs text-muted-foreground">{reciter.arabic_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Surah</label>
                  <Select 
                    value={currentChapter.id.toString()} 
                    onValueChange={(value) => {
                      const chapter = chapters.find(c => c.id === parseInt(value));
                      if (chapter) setCurrentChapter(chapter);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-1 rounded">{chapter.id}</span>
                            <span>{chapter.name_simple}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed: {playbackRate[0]}x</label>
                  <Slider
                    value={playbackRate}
                    onValueChange={setPlaybackRate}
                    min={0.5}
                    max={2}
                    step={0.25}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Playlist */}
          {showPlaylist && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List size={18} />
                  Surah Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentChapter(chapter)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                        currentChapter.id === chapter.id
                          ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {chapter.id}
                        </span>
                        <div>
                          <p className="font-medium">{chapter.name_simple}</p>
                          <p className="text-sm text-muted-foreground">{chapter.translated_name.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-arabic" dir="rtl">{chapter.name_arabic}</p>
                        <p className="text-xs text-muted-foreground">{chapter.verses_count} verses</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}