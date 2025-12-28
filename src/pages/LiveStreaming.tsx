import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Radio, 
  Users,
  Calendar,
  Clock,
  MapPin,
  Bell,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Search,
  Filter,
  Play,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface LiveStream {
  id: string;
  title: string;
  description: string;
  speaker: string;
  category: string;
  language: string;
  stream_url: string;
  thumbnail: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'live' | 'upcoming' | 'ended';
  viewers: number;
  likes: number;
  comments: number;
  tags: string[];
  location?: string;
  is_featured: boolean;
}

const mockStreams: LiveStream[] = [
  {
    id: '1',
    title: 'Friday Khutbah - The Importance of Gratitude',
    description: 'Join us for this week\'s Friday sermon focusing on the Islamic concept of gratitude and its role in our daily lives.',
    speaker: 'Imam Abdullah Rahman',
    category: 'Khutbah',
    language: 'English',
    stream_url: 'https://example.com/stream1',
    thumbnail: 'https://example.com/thumb1.jpg',
    scheduled_time: '2024-12-27T13:00:00Z',
    duration_minutes: 45,
    status: 'live',
    viewers: 1250,
    likes: 89,
    comments: 34,
    tags: ['Friday', 'Khutbah', 'Gratitude'],
    location: 'Main Mosque',
    is_featured: true
  },
  {
    id: '2',
    title: 'Quran Recitation & Tafsir - Surah Al-Mulk',
    description: 'Beautiful recitation of Surah Al-Mulk followed by detailed explanation and commentary.',
    speaker: 'Qari Muhammad Hassan',
    category: 'Quran Study',
    language: 'Arabic/English',
    stream_url: 'https://example.com/stream2',
    thumbnail: 'https://example.com/thumb2.jpg',
    scheduled_time: '2024-12-27T20:00:00Z',
    duration_minutes: 60,
    status: 'upcoming',
    viewers: 0,
    likes: 0,
    comments: 0,
    tags: ['Quran', 'Recitation', 'Tafsir'],
    is_featured: false
  },
  {
    id: '3',
    title: 'Islamic History Series - The Golden Age of Baghdad',
    description: 'Explore the intellectual and cultural achievements during the Abbasid Caliphate in Baghdad.',
    speaker: 'Dr. Sarah Al-Baghdadi',
    category: 'Education',
    language: 'English',
    stream_url: 'https://example.com/stream3',
    thumbnail: 'https://example.com/thumb3.jpg',
    scheduled_time: '2024-12-26T19:00:00Z',
    duration_minutes: 90,
    status: 'ended',
    viewers: 2340,
    likes: 156,
    comments: 78,
    tags: ['History', 'Baghdad', 'Golden Age'],
    is_featured: true
  }
];

const categories = ['All', 'Khutbah', 'Quran Study', 'Education', 'Prayer', 'Youth Programs', 'Community Events'];
const languages = ['All', 'English', 'Arabic', 'Amharic', 'Oromo'];

export default function LiveStreaming() {
  const navigate = useNavigate();
  const location = useLocation();
  const [streams, setStreams] = useState<LiveStream[]>(mockStreams);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('stream-notifications');
    const savedFavorites = localStorage.getItem('stream-favorites');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = !searchQuery || 
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || stream.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || stream.language.includes(selectedLanguage);
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const liveStreams = streams.filter(s => s.status === 'live');
  const upcomingStreams = streams.filter(s => s.status === 'upcoming');
  const pastStreams = streams.filter(s => s.status === 'ended');

  const toggleNotification = (streamId: string) => {
    const newNotifications = notifications.includes(streamId)
      ? notifications.filter(id => id !== streamId)
      : [...notifications, streamId];
    
    setNotifications(newNotifications);
    localStorage.setItem('stream-notifications', JSON.stringify(newNotifications));
  };

  const toggleFavorite = (streamId: string) => {
    const newFavorites = favorites.includes(streamId)
      ? favorites.filter(id => id !== streamId)
      : [...favorites, streamId];
    
    setFavorites(newFavorites);
    localStorage.setItem('stream-favorites', JSON.stringify(newFavorites));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'ended': return 'bg-gray-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Khutbah': 'bg-green-500/20 text-green-600',
      'Quran Study': 'bg-blue-500/20 text-blue-600',
      'Education': 'bg-purple-500/20 text-purple-600',
      'Prayer': 'bg-orange-500/20 text-orange-600',
      'Youth Programs': 'bg-pink-500/20 text-pink-600',
      'Community Events': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <ProtectedPageLayout 
      title="Live Streaming" 
      subtitle="Join live Islamic events, lectures, and community gatherings"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Radio size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Live Islamic Events</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect with your community through live streaming
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <Radio size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium">{liveStreams.length} Live Now</p>
                <p className="text-xs text-muted-foreground">Active streams</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{upcomingStreams.length} Upcoming</p>
                <p className="text-xs text-muted-foreground">Scheduled events</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{liveStreams.reduce((sum, s) => sum + s.viewers, 0)}</p>
                <p className="text-xs text-muted-foreground">Total viewers</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Bell size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">Get alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Now Banner */}
        {liveStreams.length > 0 && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-red-600">LIVE NOW</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveStreams.slice(0, 2).map((stream) => (
                  <div key={stream.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                      <Radio size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{stream.title}</h4>
                      <p className="text-xs text-muted-foreground">{stream.speaker}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {stream.viewers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={10} />
                          {stream.likes}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Play size={14} />
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search streams, speakers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[100px]"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Streams</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreams.map((stream, index) => (
                <Card 
                  key={stream.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Button className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                      {stream.status === 'live' ? (
                        <Radio size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white ml-1" />
                      )}
                    </Button>
                    <div className="absolute top-2 left-2">
                      <Badge className={cn("text-xs", getStatusColor(stream.status))}>
                        {stream.status === 'live' && <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>}
                        {stream.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {stream.is_featured && (
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    {stream.status === 'live' && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Eye size={10} />
                        {stream.viewers}
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge className={cn("text-xs", getCategoryColor(stream.category))}>
                        {stream.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {stream.language}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                      {stream.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground">
                      by {stream.speaker}
                    </p>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {stream.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{formatTime(stream.scheduled_time)}</span>
                      </div>
                      
                      {stream.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span>{stream.location}</span>
                        </div>
                      )}

                      {stream.status !== 'upcoming' && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {stream.viewers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {stream.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={12} />
                            {stream.comments}
                          </span>
                        </div>
                      )}
                    </div>

                    {stream.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {stream.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                      <Button
                        size="sm"
                        className="flex-1 gap-2"
                        variant={stream.status === 'live' ? 'default' : 'outline'}
                      >
                        {stream.status === 'live' ? (
                          <>
                            <Radio size={14} />
                            Join Live
                          </>
                        ) : stream.status === 'upcoming' ? (
                          <>
                            <Calendar size={14} />
                            Remind Me
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Watch
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(stream.id)}
                        className={cn(
                          "w-9 h-8 p-0",
                          favorites.includes(stream.id) && "text-red-500 border-red-300"
                        )}
                      >
                        <Heart size={14} className={favorites.includes(stream.id) ? "fill-current" : ""} />
                      </Button>

                      {stream.status === 'upcoming' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleNotification(stream.id)}
                          className={cn(
                            "w-9 h-8 p-0",
                            notifications.includes(stream.id) && "text-blue-500 border-blue-300"
                          )}
                        >
                          <Bell size={14} className={notifications.includes(stream.id) ? "fill-current" : ""} />
                        </Button>
                      )}

                      <Button variant="outline" size="sm" className="w-9 h-8 p-0">
                        <Share2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            {liveStreams.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Radio size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No live streams</h3>
                  <p className="text-muted-foreground">
                    Check back later for live events and programs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveStreams.map((stream, index) => (
                  <Card 
                    key={stream.id}
                    className="hover:shadow-lg transition-all duration-300 animate-slide-up border-red-200 dark:border-red-800"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 relative">
                          <Radio size={24} className="text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-500 text-white text-xs">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                              LIVE
                            </Badge>
                            <Badge className={cn("text-xs", getCategoryColor(stream.category))}>
                              {stream.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            by {stream.speaker}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {stream.viewers} watching
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart size={12} />
                                {stream.likes}
                              </span>
                            </div>
                            <Button size="sm" className="gap-2">
                              <Radio size={14} />
                              Join Live
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingStreams.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming streams</h3>
                  <p className="text-muted-foreground">
                    New events will be scheduled soon. Enable notifications to stay updated.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingStreams.map((stream, index) => (
                  <Card 
                    key={stream.id}
                    className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Calendar size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-500 text-white text-xs">
                              Upcoming
                            </Badge>
                            <Badge className={cn("text-xs", getCategoryColor(stream.category))}>
                              {stream.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(stream.scheduled_time)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {stream.speaker}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {stream.duration_minutes} minutes
                            </span>
                            {stream.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {stream.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleNotification(stream.id)}
                            className={cn(
                              "gap-2",
                              notifications.includes(stream.id) && "text-blue-500 border-blue-300"
                            )}
                          >
                            <Bell size={14} className={notifications.includes(stream.id) ? "fill-current" : ""} />
                            {notifications.includes(stream.id) ? 'Notifying' : 'Remind Me'}
                          </Button>
                          <Button className="gap-2">
                            <Calendar size={16} />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastStreams.map((stream, index) => (
                <Card 
                  key={stream.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                        <Play size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-500 text-white text-xs">
                            Recorded
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(stream.category))}>
                            {stream.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {stream.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          by {stream.speaker}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{formatTime(stream.scheduled_time)}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {stream.viewers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={10} />
                          {stream.likes}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full gap-2">
                      <Play size={14} />
                      Watch Recording
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}