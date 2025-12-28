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
  Baby,
  Briefcase,
  GraduationCap,
  Flower,
  Shield,
  Award,
  UserPlus,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface WomenProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  age_group: string;
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
  childcare_available: boolean;
  registration_fee: number;
  is_featured: boolean;
  privacy_level: 'women_only' | 'family_friendly' | 'mixed';
}

const mockPrograms: WomenProgram[] = [
  {
    id: '1',
    title: 'Sisters\' Islamic Study Circle',
    description: 'Weekly Quran study and Islamic knowledge sessions in a supportive sisterhood environment.',
    category: 'Education',
    age_group: '18+',
    duration: 'Ongoing',
    schedule: 'Thursdays 7:00 PM - 9:00 PM',
    location: 'Women\'s Prayer Hall',
    facilitator: 'Sister Aisha Rahman',
    max_participants: 25,
    current_participants: 20,
    start_date: '2024-01-11T00:00:00Z',
    end_date: '2024-12-31T00:00:00Z',
    status: 'ongoing',
    requirements: ['Basic Arabic reading', 'Commitment to regular attendance', 'Respectful participation'],
    benefits: ['Deeper Quran understanding', 'Sisterhood bonds', 'Islamic knowledge growth', 'Spiritual development'],
    childcare_available: true,
    registration_fee: 0,
    is_featured: true,
    privacy_level: 'women_only'
  },
  {
    id: '2',
    title: 'Motherhood in Islam Workshop',
    description: 'Comprehensive program covering Islamic parenting, child development, and balancing motherhood with spiritual growth.',
    category: 'Parenting',
    age_group: '20-45',
    duration: '6 weeks',
    schedule: 'Saturdays 10:00 AM - 12:00 PM',
    location: 'Family Education Center',
    facilitator: 'Dr. Fatima Al-Zahra & Sister Khadija',
    max_participants: 20,
    current_participants: 15,
    start_date: '2025-01-18T00:00:00Z',
    end_date: '2025-03-01T00:00:00Z',
    status: 'upcoming',
    requirements: ['Mothers or expecting mothers', 'Interest in Islamic parenting', 'Notebook for activities'],
    benefits: ['Islamic parenting skills', 'Child psychology insights', 'Peer support network', 'Practical strategies'],
    childcare_available: true,
    registration_fee: 30,
    is_featured: true,
    privacy_level: 'women_only'
  },
  {
    id: '3',
    title: 'Women in Islamic History',
    description: 'Inspiring stories and lessons from prominent women in Islamic history and their contributions to society.',
    category: 'History',
    age_group: '16+',
    duration: '8 weeks',
    schedule: 'Sundays 2:00 PM - 3:30 PM',
    location: 'Library Conference Room',
    facilitator: 'Sister Maryam Hassan',
    max_participants: 30,
    current_participants: 22,
    start_date: '2025-02-02T00:00:00Z',
    end_date: '2025-03-30T00:00:00Z',
    status: 'upcoming',
    requirements: ['Interest in Islamic history', 'Basic Islamic knowledge', 'Regular attendance'],
    benefits: ['Historical knowledge', 'Role model inspiration', 'Cultural understanding', 'Leadership insights'],
    childcare_available: false,
    registration_fee: 15,
    is_featured: false,
    privacy_level: 'women_only'
  },
  {
    id: '4',
    title: 'Professional Muslim Women Network',
    description: 'Networking and professional development for Muslim women in various career fields.',
    category: 'Professional',
    age_group: '22-55',
    duration: 'Monthly meetings',
    schedule: 'First Saturday 6:00 PM - 8:00 PM',
    location: 'Community Center - Conference Room',
    facilitator: 'Sister Amina Abdullah (MBA)',
    max_participants: 40,
    current_participants: 28,
    start_date: '2024-01-06T00:00:00Z',
    end_date: '2024-12-31T00:00:00Z',
    status: 'ongoing',
    requirements: ['Working professionals or students', 'Career development interest', 'Networking mindset'],
    benefits: ['Professional networking', 'Career guidance', 'Mentorship opportunities', 'Skill development'],
    childcare_available: true,
    registration_fee: 25,
    is_featured: true,
    privacy_level: 'women_only'
  }
];

const categories = ['All Categories', 'Education', 'Parenting', 'History', 'Professional', 'Health', 'Arts', 'Social'];
const ageGroups = ['All Ages', '16+', '18+', '20-35', '35-50', '50+'];
const statusOptions = ['All Status', 'upcoming', 'ongoing', 'completed'];

export default function WomenPrograms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<WomenProgram[]>(mockPrograms);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All Ages');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState<WomenProgram | null>(null);

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;
    const matchesAgeGroup = selectedAgeGroup === 'All Ages' || program.age_group === selectedAgeGroup;
    const matchesStatus = selectedStatus === 'All Status' || program.status === selectedStatus;
    
    return matchesCategory && matchesAgeGroup && matchesStatus;
  });

  const upcomingPrograms = programs.filter(p => p.status === 'upcoming');
  const ongoingPrograms = programs.filter(p => p.status === 'ongoing');
  const totalParticipants = programs.reduce((sum, p) => sum + p.current_participants, 0);
  const programsWithChildcare = programs.filter(p => p.childcare_available).length;

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
      'Education': 'bg-blue-500/20 text-blue-600',
      'Parenting': 'bg-pink-500/20 text-pink-600',
      'History': 'bg-purple-500/20 text-purple-600',
      'Professional': 'bg-green-500/20 text-green-600',
      'Health': 'bg-red-500/20 text-red-600',
      'Arts': 'bg-orange-500/20 text-orange-600',
      'Social': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education': return <BookOpen size={16} />;
      case 'Parenting': return <Baby size={16} />;
      case 'History': return <GraduationCap size={16} />;
      case 'Professional': return <Briefcase size={16} />;
      case 'Health': return <Heart size={16} />;
      case 'Arts': return <Flower size={16} />;
      case 'Social': return <Users size={16} />;
      default: return <Star size={16} />;
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'women_only': return <Shield size={14} className="text-pink-600" />;
      case 'family_friendly': return <Users size={14} className="text-green-600" />;
      case 'mixed': return <Users size={14} className="text-blue-600" />;
      default: return <Shield size={14} />;
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
      title="Women's Programs" 
      subtitle="Empowering Muslim women through education, sisterhood, and spiritual growth"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Flower size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Women's Programs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Nurturing the spiritual, intellectual, and social growth of Muslim women
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
                <p className="text-xs text-muted-foreground">Active participants</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Baby size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">{programsWithChildcare}</p>
                <p className="text-xs text-muted-foreground">With childcare</p>
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
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="support">Support Services</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
                <Card 
                  key={program.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Flower size={32} className="text-white relative z-10" />
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
                        <span>Facilitator: {program.facilitator}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getPrivacyIcon(program.privacy_level)}
                        <span className="capitalize">{program.privacy_level.replace('_', ' ')}</span>
                      </div>
                      {program.childcare_available && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Baby size={12} />
                          <span>Childcare</span>
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
                          className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
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

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    Islamic Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comprehensive Islamic education resources for women.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Women in Islam study materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Quran and Hadith resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic history and biography</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Contemporary Islamic issues</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <BookOpen size={16} />
                    Access Library
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby size={20} />
                    Parenting Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Islamic parenting guidance and child development resources.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic child-rearing principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Age-appropriate Islamic education</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Balancing work and motherhood</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Teen guidance and support</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Baby size={16} />
                    Parenting Hub
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase size={20} />
                    Professional Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Career development and professional growth resources.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Career guidance and mentorship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Networking opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Skill development workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Work-life balance strategies</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Briefcase size={16} />
                    Career Center
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
                    <Heart size={20} />
                    Counseling & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Professional counseling and peer support services for women.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Individual counseling sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Support groups and circles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Crisis intervention and support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Referral to specialized services</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Heart size={16} />
                    Get Support
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby size={20} />
                    Childcare Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Childcare support to enable women's participation in programs.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>On-site childcare during programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Qualified childcare providers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Age-appropriate activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Safe and nurturing environment</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Baby size={16} />
                    Book Childcare
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Sisterhood Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Building strong bonds and support networks among Muslim women.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Mentorship programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Peer support circles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Social events and gatherings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Community service projects</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Users size={16} />
                    Join Network
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Safe Spaces
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Dedicated safe and comfortable spaces for women's activities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Women-only prayer and study areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Private consultation rooms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Comfortable social spaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <span>Accessible facilities</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Shield size={16} />
                    Reserve Space
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
                      <span className="font-medium">Facilitator:</span>
                      <p>{selectedProgram.facilitator}</p>
                    </div>
                    <div>
                      <span className="font-medium">Privacy Level:</span>
                      <p className="capitalize">{selectedProgram.privacy_level.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Childcare:</span>
                      <p>{selectedProgram.childcare_available ? 'Available' : 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedProgram.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
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
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
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