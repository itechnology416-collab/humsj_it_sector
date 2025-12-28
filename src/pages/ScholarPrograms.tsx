import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Award,
  Users,
  Star,
  Scroll,
  Library,
  Lightbulb,
  UserPlus,
  Trophy,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ScholarProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'foundation' | 'intermediate' | 'advanced' | 'doctoral';
  duration: string;
  schedule: string;
  location: string;
  instructor: string;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  prerequisites: string[];
  learning_outcomes: string[];
  certification: string;
  scholarship_available: boolean;
  registration_fee: number;
  is_featured: boolean;
  research_component: boolean;
}

const mockPrograms: ScholarProgram[] = [
  {
    id: '1',
    title: 'Advanced Quranic Studies',
    description: 'Comprehensive program in Quranic exegesis, linguistics, and interpretation methodologies.',
    category: 'Quranic Studies',
    level: 'advanced',
    duration: '2 years',
    schedule: 'Weekends 9:00 AM - 5:00 PM',
    location: 'Islamic Studies Institute',
    instructor: 'Dr. Abdullah Al-Tafsir',
    max_participants: 12,
    current_participants: 8,
    start_date: '2025-02-01T00:00:00Z',
    end_date: '2027-01-31T00:00:00Z',
    status: 'upcoming',
    prerequisites: ['Bachelor\'s degree', 'Advanced Arabic proficiency', 'Basic Tafsir knowledge'],
    learning_outcomes: ['Master Quranic interpretation', 'Research methodology', 'Teaching qualification', 'Scholarly writing'],
    certification: 'Advanced Certificate in Quranic Studies',
    scholarship_available: true,
    registration_fee: 2500,
    is_featured: true,
    research_component: true
  },
  {
    id: '2',
    title: 'Islamic Jurisprudence (Fiqh) Intensive',
    description: 'In-depth study of Islamic law, legal methodology, and contemporary applications.',
    category: 'Fiqh',
    level: 'intermediate',
    duration: '18 months',
    schedule: 'Thursdays & Saturdays 6:00 PM - 9:00 PM',
    location: 'Fiqh Academy',
    instructor: 'Sheikh Muhammad Al-Faqih',
    max_participants: 15,
    current_participants: 11,
    start_date: '2025-01-16T00:00:00Z',
    end_date: '2026-07-15T00:00:00Z',
    status: 'upcoming',
    prerequisites: ['Intermediate Arabic', 'Basic Islamic knowledge', 'Commitment to study'],
    learning_outcomes: ['Fiqh mastery', 'Legal reasoning', 'Fatwa methodology', 'Contemporary issues'],
    certification: 'Certificate in Islamic Jurisprudence',
    scholarship_available: true,
    registration_fee: 1800,
    is_featured: true,
    research_component: false
  },
  {
    id: '3',
    title: 'Hadith Sciences Program',
    description: 'Comprehensive study of Hadith collection, authentication, and scholarly analysis.',
    category: 'Hadith Studies',
    level: 'advanced',
    duration: '3 years',
    schedule: 'Sundays 10:00 AM - 4:00 PM',
    location: 'Hadith Research Center',
    instructor: 'Dr. Fatima Al-Muhadditha',
    max_participants: 10,
    current_participants: 6,
    start_date: '2025-03-01T00:00:00Z',
    end_date: '2028-02-29T00:00:00Z',
    status: 'upcoming',
    prerequisites: ['Master\'s degree preferred', 'Excellent Arabic', 'Research experience'],
    learning_outcomes: ['Hadith authentication', 'Chain analysis', 'Research methodology', 'Scholarly publication'],
    certification: 'Advanced Diploma in Hadith Sciences',
    scholarship_available: false,
    registration_fee: 3200,
    is_featured: false,
    research_component: true
  },
  {
    id: '4',
    title: 'Islamic Philosophy & Theology',
    description: 'Advanced study of Islamic philosophical traditions and theological discourse.',
    category: 'Philosophy',
    level: 'doctoral',
    duration: '4 years',
    schedule: 'Flexible schedule with mentorship',
    location: 'Philosophy Department',
    instructor: 'Prof. Hassan Al-Hakeem',
    max_participants: 8,
    current_participants: 4,
    start_date: '2025-09-01T00:00:00Z',
    end_date: '2029-08-31T00:00:00Z',
    status: 'upcoming',
    prerequisites: ['Master\'s in Islamic Studies', 'Research proposal', 'Academic references'],
    learning_outcomes: ['Doctoral research', 'Original contribution', 'Teaching qualification', 'Academic publication'],
    certification: 'PhD in Islamic Philosophy',
    scholarship_available: true,
    registration_fee: 5000,
    is_featured: true,
    research_component: true
  }
];

const categories = ['All Categories', 'Quranic Studies', 'Fiqh', 'Hadith Studies', 'Philosophy', 'History', 'Arabic Language'];
const levels = ['All Levels', 'foundation', 'intermediate', 'advanced', 'doctoral'];
const statusOptions = ['All Status', 'upcoming', 'ongoing', 'completed'];

export default function ScholarPrograms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<ScholarProgram[]>(mockPrograms);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgram, setSelectedProgram] = useState<ScholarProgram | null>(null);

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || program.level === selectedLevel;
    const matchesStatus = selectedStatus === 'All Status' || program.status === selectedStatus;
    
    return matchesCategory && matchesLevel && matchesStatus;
  });

  const upcomingPrograms = programs.filter(p => p.status === 'upcoming');
  const ongoingPrograms = programs.filter(p => p.status === 'ongoing');
  const totalScholars = programs.reduce((sum, p) => sum + p.current_participants, 0);
  const scholarshipsAvailable = programs.filter(p => p.scholarship_available).length;

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
      'Quranic Studies': 'bg-green-500/20 text-green-600',
      'Fiqh': 'bg-blue-500/20 text-blue-600',
      'Hadith Studies': 'bg-purple-500/20 text-purple-600',
      'Philosophy': 'bg-indigo-500/20 text-indigo-600',
      'History': 'bg-orange-500/20 text-orange-600',
      'Arabic Language': 'bg-red-500/20 text-red-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-orange-500/20 text-orange-600';
      case 'doctoral': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Quranic Studies': return <BookOpen size={16} />;
      case 'Fiqh': return <Scroll size={16} />;
      case 'Hadith Studies': return <Library size={16} />;
      case 'Philosophy': return <Lightbulb size={16} />;
      case 'History': return <Clock size={16} />;
      case 'Arabic Language': return <Star size={16} />;
      default: return <GraduationCap size={16} />;
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
      title="Islamic Scholar Programs" 
      subtitle="Advanced Islamic education and scholarly development programs"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Scholar Programs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Advanced Islamic education for aspiring scholars and researchers
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
                  <GraduationCap size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{totalScholars}</p>
                <p className="text-xs text-muted-foreground">Scholar students</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">{scholarshipsAvailable}</p>
                <p className="text-xs text-muted-foreground">Scholarships available</p>
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
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
                <Card 
                  key={program.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <GraduationCap size={32} className="text-white relative z-10" />
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
                        <span>Instructor: {program.instructor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {program.scholarship_available && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Award size={12} />
                          <span>Scholarship Available</span>
                        </div>
                      )}
                      {program.research_component && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Target size={12} />
                          <span>Research Component</span>
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
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(program.current_participants / program.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="text-sm">
                        <span className="font-medium">${program.registration_fee.toLocaleString()}</span>
                        {program.scholarship_available && (
                          <p className="text-xs text-green-600">Scholarships available</p>
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
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholarships" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} />
                    Merit-Based Scholarships
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Full and partial scholarships for outstanding students based on academic merit.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Full tuition coverage for top performers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Partial scholarships (25%, 50%, 75%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Research stipends for doctoral students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Book and material allowances</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Award size={16} />
                    Apply for Scholarship
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Need-Based Financial Aid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Financial assistance for qualified students with demonstrated need.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Income-based tuition reduction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Payment plan options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Emergency financial assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Work-study opportunities</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Users size={16} />
                    Request Financial Aid
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy size={20} />
                    International Student Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Special support and scholarships for international students.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Visa and immigration support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Housing assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Cultural orientation programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Language support services</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Trophy size={16} />
                    International Support
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    Research Grants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Funding opportunities for research projects and scholarly publications.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Research project funding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Conference presentation support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Publication assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Library and resource access</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Target size={16} />
                    Apply for Grant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library size={20} />
                  Research Centers & Institutes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Quranic Research Institute</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced research in Quranic studies, exegesis, and linguistic analysis.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Digital Quran project</li>
                      <li>• Comparative tafsir studies</li>
                      <li>• Quranic linguistics research</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Islamic Law Research Center</h4>
                    <p className="text-sm text-muted-foreground">
                      Contemporary applications of Islamic jurisprudence and legal studies.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Modern fiqh applications</li>
                      <li>• Comparative law studies</li>
                      <li>• Legal methodology research</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Hadith Authentication Lab</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced hadith verification and chain analysis research.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Digital hadith database</li>
                      <li>• Chain verification tools</li>
                      <li>• Authentication methodology</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Research Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold">Digital Islamic Manuscript Project</h4>
                    <p className="text-sm text-muted-foreground">
                      Digitization and analysis of rare Islamic manuscripts from around the world.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span>Lead: Dr. Ahmad Al-Makhtutat</span>
                      <span>Duration: 3 years</span>
                      <span>Funding: $500,000</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Contemporary Islamic Ethics Study</h4>
                    <p className="text-sm text-muted-foreground">
                      Research on Islamic ethical frameworks for modern challenges.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span>Lead: Prof. Fatima Al-Akhlaq</span>
                      <span>Duration: 2 years</span>
                      <span>Funding: $300,000</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Islamic Finance Innovation Research</h4>
                    <p className="text-sm text-muted-foreground">
                      Development of new Islamic financial instruments and methodologies.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span>Lead: Dr. Yusuf Al-Maliyya</span>
                      <span>Duration: 4 years</span>
                      <span>Funding: $750,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Dr. Abdullah Al-Tafsir</h3>
                  <p className="text-sm text-muted-foreground mb-3">Professor of Quranic Studies</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>• PhD from Al-Azhar University</li>
                    <li>• 20+ years teaching experience</li>
                    <li>• Author of 15 scholarly books</li>
                    <li>• Expert in Quranic linguistics</li>
                  </ul>
                  <Button size="sm" variant="outline">View Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                    <Scroll size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Sheikh Muhammad Al-Faqih</h3>
                  <p className="text-sm text-muted-foreground mb-3">Professor of Islamic Jurisprudence</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>• Graduate of Islamic University of Medina</li>
                    <li>• Former judge in Islamic court</li>
                    <li>• Specialist in contemporary fiqh</li>
                    <li>• International fatwa committee member</li>
                  </ul>
                  <Button size="sm" variant="outline">View Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                    <Library size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Dr. Fatima Al-Muhadditha</h3>
                  <p className="text-sm text-muted-foreground mb-3">Professor of Hadith Sciences</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>• PhD in Hadith Studies</li>
                    <li>• Expert in hadith authentication</li>
                    <li>• Published researcher</li>
                    <li>• Women's Islamic education advocate</li>
                  </ul>
                  <Button size="sm" variant="outline">View Profile</Button>
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
                      <span className="font-medium">Instructor:</span>
                      <p>{selectedProgram.instructor}</p>
                    </div>
                    <div>
                      <span className="font-medium">Certification:</span>
                      <p>{selectedProgram.certification}</p>
                    </div>
                    <div>
                      <span className="font-medium">Research Component:</span>
                      <p>{selectedProgram.research_component ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Prerequisites</h4>
                  <ul className="space-y-1">
                    {selectedProgram.prerequisites.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                  <ul className="space-y-1">
                    {selectedProgram.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Program Fee</p>
                    <p className="text-lg font-semibold">${selectedProgram.registration_fee.toLocaleString()}</p>
                    {selectedProgram.scholarship_available && (
                      <p className="text-xs text-green-600 mt-1">✓ Scholarships available</p>
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
                        Apply Now
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