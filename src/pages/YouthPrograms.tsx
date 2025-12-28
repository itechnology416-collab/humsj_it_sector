import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Star,
  Trophy,
  BookOpen,
  Heart,
  Gamepad2,
  Music,
  Camera,
  Mic,
  Target,
  Award,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface YouthProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  age_group: string;
  duration: string;
  schedule: string;
  location: string;
  instructor: string;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  requirements: string[];
  benefits: string[];
  image_url: string;
  registration_fee: number;
  is_featured: boolean;
}

interface YouthActivity {
  id: string;
  title: string;
  type: 'workshop' | 'competition' | 'social' | 'educational' | 'sports';
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
  organizer: string;
}

const mockPrograms: YouthProgram[] = [
  {
    id: '1',
    title: 'Islamic Leadership Academy',
    description: 'Develop leadership skills through Islamic principles and practical training for young Muslims aged 16-25.',
    category: 'Leadership',
    age_group: '16-25',
    duration: '12 weeks',
    schedule: 'Saturdays 2:00 PM - 5:00 PM',
    location: 'Community Center - Room A',
    instructor: 'Brother Ahmed Hassan',
    max_participants: 25,
    current_participants: 18,
    start_date: '2025-01-15T00:00:00Z',
    end_date: '2025-04-05T00:00:00Z',
    status: 'upcoming',
    requirements: ['Age 16-25', 'Basic Islamic knowledge', 'Commitment to attend all sessions'],
    benefits: ['Leadership certification', 'Networking opportunities', 'Mentorship program'],
    image_url: 'https://example.com/leadership.jpg',
    registration_fee: 50,
    is_featured: true
  },
  {
    id: '2',
    title: 'Quran Memorization Circle',
    description: 'Structured Quran memorization program with peer support and expert guidance.',
    category: 'Education',
    age_group: '13-18',
    duration: '6 months',
    schedule: 'Daily 6:00 AM - 7:30 AM',
    location: 'Mosque Main Hall',
    instructor: 'Qari Muhammad Ali',
    max_participants: 20,
    current_participants: 15,
    start_date: '2024-12-01T00:00:00Z',
    end_date: '2025-06-01T00:00:00Z',
    status: 'ongoing',
    requirements: ['Basic Arabic reading', 'Daily commitment', 'Parent permission'],
    benefits: ['Quran memorization certificate', 'Tajweed improvement', 'Spiritual growth'],
    image_url: 'https://example.com/quran.jpg',
    registration_fee: 0,
    is_featured: false
  },
  {
    id: '3',
    title: 'Islamic Arts & Crafts Workshop',
    description: 'Creative workshop exploring Islamic art, calligraphy, and traditional crafts.',
    category: 'Arts',
    age_group: '10-16',
    duration: '8 weeks',
    schedule: 'Sundays 10:00 AM - 12:00 PM',
    location: 'Art Studio',
    instructor: 'Sister Fatima Al-Zahra',
    max_participants: 15,
    current_participants: 12,
    start_date: '2025-01-20T00:00:00Z',
    end_date: '2025-03-15T00:00:00Z',
    status: 'upcoming',
    requirements: ['Age 10-16', 'Interest in arts', 'Basic art supplies'],
    benefits: ['Art portfolio', 'Cultural appreciation', 'Creative skills'],
    image_url: 'https://example.com/arts.jpg',
    registration_fee: 30,
    is_featured: true
  }
];

const mockActivities: YouthActivity[] = [
  {
    id: '1',
    title: 'Islamic Quiz Competition',
    type: 'competition',
    date: '2025-01-10',
    time: '7:00 PM',
    location: 'Main Auditorium',
    participants: 45,
    description: 'Test your Islamic knowledge in this exciting quiz competition with prizes!',
    organizer: 'Youth Committee'
  },
  {
    id: '2',
    title: 'Community Service Day',
    type: 'social',
    date: '2025-01-15',
    time: '9:00 AM',
    location: 'Local Food Bank',
    participants: 30,
    description: 'Join us in serving the community through volunteer work at the local food bank.',
    organizer: 'Social Action Team'
  },
  {
    id: '3',
    title: 'Islamic History Workshop',
    type: 'educational',
    date: '2025-01-20',
    time: '2:00 PM',
    location: 'Library',
    participants: 25,
    description: 'Interactive workshop exploring the golden age of Islamic civilization.',
    organizer: 'Education Committee'
  }
];

const categories = ['All Categories', 'Leadership', 'Education', 'Arts', 'Sports', 'Social', 'Spiritual'];
const ageGroups = ['All Ages', '10-13', '13-16', '16-18', '18-25'];
const statusOptions = ['All Status', 'upcoming', 'ongoing', 'completed'];

export default function YouthPrograms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<YouthProgram[]>(mockPrograms);
  const [activities, setActivities] = useState<YouthActivity[]>(mockActivities);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All Ages');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState<YouthProgram | null>(null);

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;
    const matchesAgeGroup = selectedAgeGroup === 'All Ages' || program.age_group === selectedAgeGroup;
    const matchesStatus = selectedStatus === 'All Status' || program.status === selectedStatus;
    
    return matchesCategory && matchesAgeGroup && matchesStatus;
  });

  const upcomingPrograms = programs.filter(p => p.status === 'upcoming');
  const ongoingPrograms = programs.filter(p => p.status === 'ongoing');
  const totalParticipants = programs.reduce((sum, p) => sum + p.current_participants, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-600';
      case 'ongoing': return 'bg-green-500/20 text-green-600';
      case 'completed': return 'bg-gray-500/20 text-gray-600';
      case 'cancelled': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Leadership': 'bg-purple-500/20 text-purple-600',
      'Education': 'bg-blue-500/20 text-blue-600',
      'Arts': 'bg-pink-500/20 text-pink-600',
      'Sports': 'bg-green-500/20 text-green-600',
      'Social': 'bg-orange-500/20 text-orange-600',
      'Spiritual': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getActivityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'workshop': 'bg-blue-500/20 text-blue-600',
      'competition': 'bg-red-500/20 text-red-600',
      'social': 'bg-green-500/20 text-green-600',
      'educational': 'bg-purple-500/20 text-purple-600',
      'sports': 'bg-orange-500/20 text-orange-600'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <BookOpen size={16} />;
      case 'competition': return <Trophy size={16} />;
      case 'social': return <Heart size={16} />;
      case 'educational': return <BookOpen size={16} />;
      case 'sports': return <Target size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const registerForProgram = (programId: string) => {
    setPrograms(prev => prev.map(program => 
      program.id === programId 
        ? { ...program, current_participants: program.current_participants + 1 }
        : program
    ));
  };

  return (
    <ProtectedPageLayout 
      title="Youth Programs" 
      subtitle="Islamic youth activities, leadership development, and community engagement"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Youth Programs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Empowering young Muslims through education, leadership, and community service
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{upcomingPrograms.length} Upcoming</p>
                <p className="text-xs text-muted-foreground">Programs starting soon</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{ongoingPrograms.length} Active</p>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <UserPlus size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{totalParticipants}</p>
                <p className="text-xs text-muted-foreground">Total participants</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Excellence</p>
                <p className="text-xs text-muted-foreground">Quality programs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
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
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[100px]"
                >
                  {ageGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
                <Card 
                  key={program.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Users size={32} className="text-white relative z-10" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {program.is_featured && (
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Featured
                        </Badge>
                      )}
                      <Badge className={cn("text-xs", getStatusColor(program.status))}>
                        {program.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {program.current_participants}/{program.max_participants} enrolled
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <Badge className={cn("text-xs", getCategoryColor(program.category))}>
                        {program.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Ages {program.age_group}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg line-clamp-2">{program.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{program.description}</p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{program.duration} • {program.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{program.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>Instructor: {program.instructor}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enrollment</span>
                        <span>{program.current_participants}/{program.max_participants}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(program.current_participants / program.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="text-sm">
                        {program.registration_fee > 0 ? (
                          <span className="font-medium">${program.registration_fee}</span>
                        ) : (
                          <span className="text-green-600 font-medium">Free</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedProgram(program)}
                          className="gap-2"
                        >
                          <BookOpen size={14} />
                          Details
                        </Button>
                        {program.current_participants < program.max_participants && program.status === 'upcoming' && (
                          <Button
                            size="sm"
                            onClick={() => registerForProgram(program.id)}
                            className="gap-2"
                          >
                            <UserPlus size={14} />
                            Register
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <Card 
                  key={activity.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getActivityTypeColor(activity.type))}>
                            {activity.type}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{activity.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{activity.participants} participants</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="gap-2">
                          <UserPlus size={14} />
                          Join
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <BookOpen size={14} />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...programs, ...activities.map(a => ({
                    ...a,
                    title: a.title,
                    start_date: a.date,
                    category: a.type,
                    location: a.location
                  }))].slice(0, 6).map((event, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Calendar size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.start_date || event.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.location}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Program Details Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedProgram.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProgram(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-4">{selectedProgram.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{selectedProgram.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Age Group:</span>
                      <p>{selectedProgram.age_group}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{selectedProgram.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium">Schedule:</span>
                      <p>{selectedProgram.schedule}</p>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>
                      <p>{selectedProgram.location}</p>
                    </div>
                    <div>
                      <span className="font-medium">Instructor:</span>
                      <p>{selectedProgram.instructor}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedProgram.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Benefits</h4>
                  <ul className="space-y-1">
                    {selectedProgram.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Fee</p>
                    <p className="text-lg font-semibold">
                      {selectedProgram.registration_fee > 0 ? `$${selectedProgram.registration_fee}` : 'Free'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Enrollment</p>
                      <p className="text-sm font-medium">
                        {selectedProgram.current_participants}/{selectedProgram.max_participants}
                      </p>
                    </div>
                    
                    {selectedProgram.current_participants < selectedProgram.max_participants && selectedProgram.status === 'upcoming' && (
                      <Button
                        onClick={() => {
                          registerForProgram(selectedProgram.id);
                          setSelectedProgram(null);
                        }}
                        className="gap-2"
                      >
                        <UserPlus size={16} />
                        Register Now
                      </Button>
                    )}
                  </div>
                </div>
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