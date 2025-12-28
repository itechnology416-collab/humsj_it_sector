import { useState, useRef, useEffect, useCallback } from 'react';
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
  Loader2,
  Download,
  Heart,
  Share2,
  Settings,
  Headphones,
  Star,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { quranApiService, type Chapter, type Reciter, type ReciterAudioSource } from '@/services/quranApi';
import { toast } from 'sonner';

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
  const [enhancedReciters, setEnhancedReciters] = useState<ReciterAudioSource[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackRate, setPlaybackRate] = useState([1]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');
  
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
        
        const enhancedRecitersData = quranApiService.getEnhancedReciters();
        
        setChapters(chaptersData);
        setReciters(recitersData);
        setEnhancedReciters(enhancedRecitersData);
        
        if (chaptersData.length > 0) {
          setCurrentChapter(chaptersData[0]); // Al-Fatihah
        }
        
        if (recitersData.length > 0) {
          setSelectedReciter(recitersData[0]);
        }

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('quran-favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
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

  // Update audio URL when chapter or reciter changes
  useEffect(() => {
    if (currentChapter && selectedReciter) {
      const newUrl = getAudioUrl(currentChapter, selectedReciter);
      setCurrentAudioUrl(newUrl);
      
      // Reset audio state
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, [currentChapter, selectedReciter]);

  // Get audio URL for current chapter and reciter
  const getAudioUrl = (chapter: Chapter, reciter: Reciter) => {
    if (!chapter || !reciter) return '';
    
    // Use enhanced API method for better URL generation
    if (reciter.audio_url_template) {
      const chapterNumber = String(chapter.id).padStart(3, '0');
      return `${reciter.audio_url_template}/${chapterNumber}.${reciter.format}`;
    }
    
    // Use the new API method
    return quranApiService.getAudioUrl(reciter.relative_path || reciter.id, chapter.id);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setError('Failed to load audio. Trying alternative source...');
      setIsBuffering(false);
      // Try to load alternative source or show error
      toast.error('Audio failed to load. Please try a different reciter.');
    };
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
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, playNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
      audioRef.current.playbackRate = playbackRate[0];
    }
  }, [volume, isMuted, playbackRate]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Failed to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const playNext = useCallback(() => {
    if (!currentChapter || chapters.length === 0) return;
    
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    let nextIndex: number;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * chapters.length);
    } else {
      nextIndex = (currentIndex + 1) % chapters.length;
    }
    
    setCurrentChapter(chapters[nextIndex]);
  }, [currentChapter, chapters, isShuffle]);

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

  const toggleFavorite = (chapterId: number) => {
    const chapterKey = `chapter-${chapterId}`;
    const newFavorites = favorites.includes(chapterKey)
      ? favorites.filter(f => f !== chapterKey)
      : [...favorites, chapterKey];
    
    setFavorites(newFavorites);
    localStorage.setItem('quran-favorites', JSON.stringify(newFavorites));
    
    toast.success(
      favorites.includes(chapterKey) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
  };

  const shareChapter = async () => {
    if (!currentChapter) return;
    
    const shareData = {
      title: `${currentChapter.name_simple} - ${currentChapter.translated_name.name}`,
      text: `Listen to ${currentChapter.name_simple} (${currentChapter.name_arabic}) recited by ${selectedReciter?.name}`,
      url: currentAudioUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share. Please try again.');
    }
  };

  const downloadAudio = () => {
    if (!currentAudioUrl || !currentChapter) return;
    
    const link = document.createElement('a');
    link.href = currentAudioUrl;
    link.download = `${currentChapter.name_simple}-${selectedReciter?.name || 'Unknown'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started!');
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
            src={currentAudioUrl}
            preload="metadata"
            crossOrigin="anonymous"
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
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-arabic text-green-700 dark:text-green-300" dir="rtl">
                  {currentChapter.name_arabic}
                </h2>
                <h3 className="text-xl font-semibold">{currentChapter.name_simple}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentChapter.translated_name.name} • {currentChapter.verses_count} verses • {currentChapter.revelation_place}
                </p>
                
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs gap-1">
                    <Headphones size={12} />
                    {selectedReciter.name}
                  </Badge>
                  {selectedReciter.country && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Globe size={12} />
                      {selectedReciter.country}
                    </Badge>
                  )}
                  {selectedReciter.style && (
                    <Badge variant="outline" className="text-xs">
                      {selectedReciter.style}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(currentChapter.id)}
                    className={cn(
                      "gap-1",
                      favorites.includes(`chapter-${currentChapter.id}`) && "text-red-500 border-red-300"
                    )}
                  >
                    <Heart 
                      size={14} 
                      className={favorites.includes(`chapter-${currentChapter.id}`) ? "fill-current" : ""} 
                    />
                    {favorites.includes(`chapter-${currentChapter.id}`) ? 'Favorited' : 'Favorite'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareChapter}
                    className="gap-1"
                  >
                    <Share2 size={14} />
                    Share
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAudio}
                    className="gap-1"
                  >
                    <Download size={14} />
                    Download
                  </Button>
                </div>
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
                  className="w-12 h-12 p-0"
                  disabled={isBuffering}
                >
                  <SkipBack size={18} />
                </Button>

                <Button
                  onClick={togglePlay}
                  disabled={isBuffering}
                  className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 relative"
                >
                  {isBuffering ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={playNext}
                  className="w-12 h-12 p-0"
                  disabled={isBuffering}
                >
                  <SkipForward size={18} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={stop}
                  className="w-12 h-12 p-0"
                  disabled={isBuffering}
                >
                  <Square size={18} />
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

              {/* Enhanced Settings with Tabs */}
              <Tabs defaultValue="reciters" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="reciters" className="gap-2">
                    <Headphones size={14} />
                    Reciters
                  </TabsTrigger>
                  <TabsTrigger value="chapters" className="gap-2">
                    <BookOpen size={14} />
                    Chapters
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings size={14} />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reciters" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reciters.slice(0, 8).map((reciter) => (
                      <button
                        key={reciter.id}
                        onClick={() => setSelectedReciter(reciter)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:shadow-md",
                          selectedReciter?.id === reciter.id
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{reciter.name}</h4>
                            <p className="text-xs text-muted-foreground font-arabic" dir="rtl">
                              {reciter.arabic_name}
                            </p>
                            {reciter.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {reciter.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {reciter.country && (
                                <Badge variant="outline" className="text-xs">
                                  {reciter.country}
                                </Badge>
                              )}
                              {reciter.style && (
                                <Badge variant="outline" className="text-xs">
                                  {reciter.style}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {selectedReciter?.id === reciter.id && (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Star size={12} className="text-white fill-current" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="chapters" className="space-y-4">
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
                    <SelectContent className="max-h-64">
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id.toString()}>
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-xs bg-muted px-2 py-1 rounded font-mono min-w-[2rem] text-center">
                              {chapter.id}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium">{chapter.name_simple}</div>
                              <div className="text-xs text-muted-foreground">{chapter.translated_name.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-arabic" dir="rtl">{chapter.name_arabic}</div>
                              <div className="text-xs text-muted-foreground">{chapter.verses_count} verses</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Playback Speed: {playbackRate[0]}x</label>
                      <Slider
                        value={playbackRate}
                        onValueChange={setPlaybackRate}
                        min={0.5}
                        max={2}
                        step={0.25}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Volume: {Math.round(volume[0] * 100)}%</label>
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
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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