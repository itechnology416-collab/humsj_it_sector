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
  Coffee,
  Stethoscope,
  Home,
  Phone,
  Activity,
  Award,
  UserPlus,
  Smile
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface SeniorProgram {
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
  accessibility_features: string[];
  registration_fee: number;
  is_featured: boolean;
  health_considerations: string[];
}

const mockPrograms: SeniorProgram[] = [
  {
    id: '1',
    title: 'Islamic Wisdom Circle',
    description: 'Weekly gatherings for sharing Islamic knowledge, life experiences, and spiritual guidance among senior community members.',
    category: 'Spiritual',
    age_group: '60+',
    duration: 'Ongoing',
    schedule: 'Wednesdays 2:00 PM - 4:00 PM',
    location: 'Community Center - Senior Lounge',
    facilitator: 'Imam Abdullah Rahman',
    max_participants: 20,
    current_participants: 16,
    start_date: '2024-01-10T00:00:00Z',
    end_date: '2024-12-31T00:00:00Z',
    status: 'ongoing',
    requirements: ['Age 60+', 'Basic mobility', 'Interest in Islamic discussions'],
    benefits: ['Spiritual growth', 'Social connection', 'Knowledge sharing', 'Mental stimulation'],
    accessibility_features: ['Wheelchair accessible', 'Large print materials', 'Hearing loop system'],
    registration_fee: 0,
    is_featured: true,
    health_considerations: ['Comfortable seating', 'Regular breaks', 'Light refreshments']
  },
  {
    id: '2',
    title: 'Senior Health & Wellness',
    description: 'Comprehensive health program combining Islamic wellness principles with modern healthcare guidance.',
    category: 'Health',
    age_group: '55+',
    duration: '8 weeks',
    schedule: 'Mondays & Thursdays 10:00 AM - 11:30 AM',
    location: 'Wellness Center',
    facilitator: 'Dr. Fatima Al-Zahra & Sister Khadija',
    max_participants: 15,
    current_participants: 12,
    start_date: '2025-01-15T00:00:00Z',
    end_date: '2025-03-10T00:00:00Z',
    status: 'upcoming',
    requirements: ['Age 55+', 'Medical clearance', 'Comfortable clothing'],
    benefits: ['Improved health', 'Islamic wellness knowledge', 'Peer support', 'Professional guidance'],
    accessibility_features: ['Ground floor location', 'Accessible restrooms', 'Medical support on-site'],
    registration_fee: 25,
    is_featured: true,
    health_considerations: ['Low-impact activities', 'Blood pressure monitoring', 'Hydration breaks']
  },
  {
    id: '3',
    title: 'Grandparents\' Islamic Stories',
    description: 'Interactive storytelling sessions where seniors share Islamic stories and life lessons with younger generations.',
    category: 'Intergenerational',
    age_group: '65+',
    duration: '6 weeks',
    schedule: 'Saturdays 3:00 PM - 4:30 PM',
    location: 'Children\'s Library',
    facilitator: 'Sister Amina Hassan',
    max_participants: 12,
    current_participants: 8,
    start_date: '2025-02-01T00:00:00Z',
    end_date: '2025-03-15T00:00:00Z',
    status: 'upcoming',
    requirements: ['Age 65+', 'Storytelling interest', 'Comfort with children'],
    benefits: ['Intergenerational bonding', 'Cultural preservation', 'Purpose and meaning', 'Legacy building'],
    accessibility_features: ['Comfortable seating', 'Good lighting', 'Microphone system'],
    registration_fee: 0,
    is_featured: false,
    health_considerations: ['Voice rest periods', 'Comfortable temperature', 'Easy access seating']
  }
];

const categories = ['All Categories', 'Spiritual', 'Health', 'Social', 'Educational', 'Intergenerational', 'Recreation'];
const ageGroups = ['All Ages', '55+', '60+', '65+', '70+'];
const statusOptions = ['All Status', 'upcoming', 'ongoing', 'completed'];

export default function SeniorPrograms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<SeniorProgram[]>(mockPrograms);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All Ages');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState<SeniorProgram | null>(null);

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
      'Spiritual': 'bg-purple-500/20 text-purple-600',
      'Health': 'bg-red-500/20 text-red-600',
      'Social': 'bg-orange-500/20 text-orange-600',
      'Educational': 'bg-blue-500/20 text-blue-600',
      'Intergenerational': 'bg-green-500/20 text-green-600',
      'Recreation': 'bg-pink-500/20 text-pink-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Spiritual': return <Heart size={16} />;
      case 'Health': return <Stethoscope size={16} />;
      case 'Social': return <Coffee size={16} />;
      case 'Educational': return <BookOpen size={16} />;
      case 'Intergenerational': return <Users size={16} />;
      case 'Recreation': return <Smile size={16} />;
      default: return <Activity size={16} />;
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
      title="Senior Programs" 
      subtitle="Islamic programs and activities designed for our respected elders"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Senior Programs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Honoring our elders with meaningful Islamic programs and community engagement
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
                  <Activity size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{ongoingPrograms.length} Active</p>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{totalParticipants}</p>
                <p className="text-xs text-muted-foreground">Active participants</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Accessible</p>
                <p className="text-xs text-muted-foreground">All programs</p>
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
            <TabsTrigger value="services">Support Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
                <Card 
                  key={program.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Heart size={32} className="text-white relative z-10" />
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

                    {program.accessibility_features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-green-600">Accessibility Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {program.accessibility_features.slice(0, 2).map(feature => (
                            <Badge key={feature} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {feature}
                            </Badge>
                          ))}
                          {program.accessibility_features.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              +{program.accessibility_features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enrollment</span>
                        <span>{program.current_participants}/{program.max_participants}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
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

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home size={20} />
                    Home Visit Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Compassionate home visits for seniors who cannot attend mosque programs.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Spiritual counseling and prayer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Quran recitation and Islamic discussions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Companionship and social interaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Assistance with daily prayers</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Phone size={16} />
                    Request Visit
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope size={20} />
                    Health & Wellness Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Holistic health support combining Islamic wellness with modern healthcare.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Health screenings and monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic nutrition guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Gentle exercise programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Mental health and spiritual wellness</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Calendar size={16} />
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone size={20} />
                    24/7 Support Hotline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock support for our senior community members.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Emergency spiritual support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Health emergency coordination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Loneliness and isolation support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Connection to community resources</span>
                    </li>
                  </ul>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">1-800-SENIOR-HELP</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Volunteer Companion Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Trained volunteers providing companionship and assistance to seniors.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Regular friendly visits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Transportation assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Shopping and errands support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>Technology assistance</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <UserPlus size={16} />
                    Request Companion
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Islamic Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li>• Large print Quran and Islamic books</li>
                    <li>• Audio Quran recitations</li>
                    <li>• Islamic history documentaries</li>
                    <li>• Prayer time reminders</li>
                    <li>• Spiritual guidance materials</li>
                  </ul>
                  <Button size="sm" className="w-full">Access Resources</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li>• Islamic nutrition guidelines</li>
                    <li>• Exercise programs for seniors</li>
                    <li>• Mental health support</li>
                    <li>• Medication management</li>
                    <li>• Healthcare provider directory</li>
                  </ul>
                  <Button size="sm" className="w-full">View Health Info</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li>• Transportation services</li>
                    <li>• Meal delivery programs</li>
                    <li>• Social activities calendar</li>
                    <li>• Emergency contact system</li>
                    <li>• Financial assistance programs</li>
                  </ul>
                  <Button size="sm" className="w-full">Explore Services</Button>
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
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Accessibility Features</h4>
                  <ul className="space-y-1">
                    {selectedProgram.accessibility_features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Health Considerations</h4>
                  <ul className="space-y-1">
                    {selectedProgram.health_considerations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                        <span>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Benefits</h4>
                  <ul className="space-y-1">
                    {selectedProgram.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
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