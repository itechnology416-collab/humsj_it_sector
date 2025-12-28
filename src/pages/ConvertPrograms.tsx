import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Heart,
  BookOpen,
  Home,
  Phone,
  Compass,
  Gift,
  HandHeart,
  Award,
  UserPlus,
  Star,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ConvertProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  schedule: string;
  location: string;
  facilitator: string;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  requirements: string[];
  benefits: string[];
  materials_provided: string[];
  registration_fee: number;
  is_featured: boolean;
  mentor_assigned: boolean;
  language_support: string[];
}

const mockPrograms: ConvertProgram[] = [
  {
    id: '1',
    title: 'New Muslim Foundation Course',
    description: 'Comprehensive 12-week program covering Islamic basics, prayer, Quran reading, and community integration.',
    category: 'Foundation',
    level: 'beginner',
    duration: '12 weeks',
    schedule: 'Saturdays 10:00 AM - 12:00 PM',
    location: 'New Muslim Center',
    facilitator: 'Brother Omar Abdullah & Sister Amina',
    max_participants: 15,
    current_participants: 8,
    start_date: '2025-01-11T00:00:00Z',
    end_date: '2025-03-29T00:00:00Z',
    status: 'upcoming',
    requirements: ['Recent conversion to Islam', 'Commitment to attend sessions', 'Open mind and heart'],
    benefits: ['Islamic foundation knowledge', 'Prayer mastery', 'Community connections', 'Personal mentor'],
    materials_provided: ['Quran translation', 'Prayer guide', 'Islamic books', 'Prayer mat'],
    registration_fee: 0,
    is_featured: true,
    mentor_assigned: true,
    language_support: ['English', 'Spanish', 'French']
  },
  {
    id: '2',
    title: 'Arabic for New Muslims',
    description: 'Learn essential Arabic for prayers, Quran reading, and daily Islamic expressions.',
    category: 'Language',
    level: 'beginner',
    duration: '8 weeks',
    schedule: 'Wednesdays 7:00 PM - 8:30 PM',
    location: 'Language Learning Center',
    facilitator: 'Ustadh Yusuf Al-Masri',
    max_participants: 20,
    current_participants: 12,
    start_date: '2025-01-15T00:00:00Z',
    end_date: '2025-03-05T00:00:00Z',
    status: 'upcoming',
    requirements: ['Basic literacy', 'Interest in Arabic language', 'Regular practice commitment'],
    benefits: ['Prayer understanding', 'Quran reading skills', 'Islamic vocabulary', 'Cultural connection'],
    materials_provided: ['Arabic workbook', 'Audio materials', 'Practice sheets', 'Digital resources'],
    registration_fee: 25,
    is_featured: true,
    mentor_assigned: false,
    language_support: ['English', 'Spanish']
  },
  {
    id: '3',
    title: 'Family Integration Support',
    description: 'Support program for new Muslims navigating family relationships and cultural adjustments.',
    category: 'Family Support',
    level: 'intermediate',
    duration: '6 weeks',
    schedule: 'Sundays 2:00 PM - 4:00 PM',
    location: 'Counseling Center',
    facilitator: 'Dr. Sarah Ahmed (Licensed Counselor)',
    max_participants: 12,
    current_participants: 7,
    start_date: '2025-02-02T00:00:00Z',
    end_date: '2025-03-16T00:00:00Z',
    status: 'upcoming',
    requirements: ['New Muslim status', 'Family relationship challenges', 'Counseling readiness'],
    benefits: ['Family communication skills', 'Conflict resolution', 'Emotional support', 'Practical strategies'],
    materials_provided: ['Counseling resources', 'Family guides', 'Support materials', 'Referral network'],
    registration_fee: 0,
    is_featured: false,
    mentor_assigned: true,
    language_support: ['English', 'Arabic']
  },
  {
    id: '4',
    title: 'Islamic History & Culture',
    description: 'Explore the rich history and diverse cultures of the Islamic world.',
    category: 'Education',
    level: 'intermediate',
    duration: '10 weeks',
    schedule: 'Thursdays 6:30 PM - 8:00 PM',
    location: 'Community Library',
    facilitator: 'Professor Khalid Hassan',
    max_participants: 25,
    current_participants: 18,
    start_date: '2025-01-16T00:00:00Z',
    end_date: '2025-03-27T00:00:00Z',
    status: 'upcoming',
    requirements: ['Basic Islamic knowledge', 'Interest in history', 'Note-taking ability'],
    benefits: ['Historical understanding', 'Cultural appreciation', 'Identity formation', 'Community pride'],
    materials_provided: ['History books', 'Timeline charts', 'Cultural materials', 'Documentary access'],
    registration_fee: 15,
    is_featured: false,
    mentor_assigned: false,
    language_support: ['English']
  }
];

const categories = ['All Categories', 'Foundation', 'Language', 'Family Support', 'Education', 'Spiritual', 'Social'];
const levels = ['All Levels', 'beginner', 'intermediate', 'advanced'];
const statusOptions = ['All Status', 'upcoming', 'ongoing', 'completed'];

export default function ConvertPrograms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<ConvertProgram[]>(mockPrograms);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState<ConvertProgram | null>(null);

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || program.level === selectedLevel;
    const matchesStatus = selectedStatus === 'All Status' || program.status === selectedStatus;
    
    return matchesCategory && matchesLevel && matchesStatus;
  });

  const upcomingPrograms = programs.filter(p => p.status === 'upcoming');
  const ongoingPrograms = programs.filter(p => p.status === 'ongoing');
  const totalParticipants = programs.reduce((sum, p) => sum + p.current_participants, 0);
  const programsWithMentors = programs.filter(p => p.mentor_assigned).length;

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
      'Foundation': 'bg-blue-500/20 text-blue-600',
      'Language': 'bg-green-500/20 text-green-600',
      'Family Support': 'bg-purple-500/20 text-purple-600',
      'Education': 'bg-orange-500/20 text-orange-600',
      'Spiritual': 'bg-indigo-500/20 text-indigo-600',
      'Social': 'bg-pink-500/20 text-pink-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Foundation': return <BookOpen size={16} />;
      case 'Language': return <MessageCircle size={16} />;
      case 'Family Support': return <Heart size={16} />;
      case 'Education': return <Star size={16} />;
      case 'Spiritual': return <Compass size={16} />;
      case 'Social': return <Users size={16} />;
      default: return <Gift size={16} />;
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
      title="New Muslim Programs" 
      subtitle="Comprehensive support and education for new Muslims joining our community"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <HandHeart size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">New Muslim Programs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome to Islam - comprehensive support for your spiritual journey
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
                <p className="text-xs text-muted-foreground">New Muslims supported</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <HandHeart size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">{programsWithMentors}</p>
                <p className="text-xs text-muted-foreground">With mentorship</p>
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
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
                <Card 
                  key={program.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <HandHeart size={32} className="text-white relative z-10" />
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
                      <Badge className={cn("text-xs flex items-center gap-1", getCategoryColor(program.category))}>
                        {getCategoryIcon(program.category)}
                        {program.category}
                      </Badge>
                      <Badge className={cn("text-xs", getLevelColor(program.level))}>
                        {program.level}
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
                        <span>Facilitator: {program.facilitator}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {program.mentor_assigned && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <HandHeart size={12} />
                          <span>Mentor Included</span>
                        </div>
                      )}
                      {program.language_support.length > 1 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <MessageCircle size={12} />
                          <span>Multi-language</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enrollment</span>
                        <span>{program.current_participants}/{program.max_participants}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
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
                          variant="outline"
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

          <TabsContent value="mentorship" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HandHeart size={20} />
                  Personal Mentorship Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Every new Muslim is paired with an experienced mentor to provide personalized guidance and support throughout their Islamic journey.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">What Mentors Provide:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>One-on-one Islamic guidance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Prayer and worship assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Cultural integration support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Emotional and spiritual support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Community introduction</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Mentor Matching Process:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Initial consultation and assessment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Careful mentor selection based on compatibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Introduction meeting and goal setting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Regular check-ins and progress reviews</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>Ongoing support and adjustment as needed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Ready to Get a Mentor?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our mentorship program is completely free and available to all new Muslims. Get matched with a caring, experienced mentor today.
                  </p>
                  <Button className="gap-2">
                    <HandHeart size={16} />
                    Request a Mentor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    Islamic Learning Materials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Essential books, guides, and resources for new Muslims.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Quran with translation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Prayer guide and instruction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic basics handbook</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Prophet's biography</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Gift size={16} />
                    Get Free Materials
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    Language Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Multi-language resources and translation services.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Materials in multiple languages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Translation services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Bilingual mentors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Audio resources</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <MessageCircle size={16} />
                    Language Help
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home size={20} />
                    Practical Life Guides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Practical guidance for living as a Muslim in daily life.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Halal food guide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic etiquette</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Community integration tips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic calendar and holidays</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Home size={16} />
                    Life Guides
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone size={20} />
                    24/7 Support Hotline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock support for new Muslims with questions or concerns.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic guidance and questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Emotional support and counseling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Crisis intervention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Resource connections</span>
                    </li>
                  </ul>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">1-800-NEW-MUSLIM</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Peer Support Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect with other new Muslims for mutual support and friendship.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Weekly support group meetings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Online community forums</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Social events and gatherings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Buddy system pairing</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Users size={16} />
                    Join Support Group
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart size={20} />
                    Family Support Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Specialized support for family relationship challenges.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Family counseling services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Mediation and conflict resolution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Educational resources for families</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Support group for family members</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Heart size={16} />
                    Family Support
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift size={20} />
                    Welcome Package
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Free welcome package for all new Muslims joining our community.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Prayer mat and compass</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Quran with translation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic books and guides</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Community welcome letter</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Gift size={16} />
                    Claim Welcome Package
                  </Button>
                </CardContent>
              </Card>
            </div>
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
                      <span className="font-medium">Level:</span>
                      <p className="capitalize">{selectedProgram.level}</p>
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
                      <span className="font-medium">Facilitator:</span>
                      <p>{selectedProgram.facilitator}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Materials Provided</h4>
                  <ul className="space-y-1">
                    {selectedProgram.materials_provided.map((material, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Language Support</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.language_support.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Benefits</h4>
                  <ul className="space-y-1">
                    {selectedProgram.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
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
                    {selectedProgram.mentor_assigned && (
                      <p className="text-xs text-emerald-600 mt-1">✓ Mentor included</p>
                    )}
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