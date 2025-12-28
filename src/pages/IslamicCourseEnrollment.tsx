import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  User,
  Play,
  Search,
  GraduationCap,
  Heart,
  CheckCircle,
  AlertCircle,
  Download,
  Trophy,
  Zap,
  Target,
  BookMarked,
  UserCheck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";
import { apiIntegration } from "@/services/apiIntegration";
import type { Course, CourseCategory, CourseEnrollment } from "@/services/courseApi";

interface IslamicCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
  students: number;
  lessons: number;
  price: "Free" | string;
  originalPrice?: string;
  startDate: string;
  endDate: string;
  schedule: string;
  prerequisites?: string[];
  features: string[];
  curriculum: {
    week: number;
    title: string;
    topics: string[];
    duration: string;
  }[];
  imageUrl?: string;
  language: string;
  certificate: boolean;
  materials: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  isPopular?: boolean;
  isNew?: boolean;
  discount?: number;
}

const islamicCoursesData: IslamicCourse[] = [
  {
    id: "ic-001",
    title: "Complete Quran Memorization Program (Hifz)",
    description: "Comprehensive Quran memorization program with proper Tajweed, understanding, and spiritual development. Guided by certified Huffaz with proven teaching methods.",
    instructor: "Sheikh Abdullah Al-Hafiz",
    instructorBio: "Certified Hafiz with 15+ years of teaching experience. Graduate of Al-Azhar University with specialization in Quranic Sciences.",
    duration: "24 months",
    level: "Beginner",
    category: "Quran Memorization",
    rating: 4.9,
    students: 156,
    lessons: 96,
    price: "$299",
    originalPrice: "$399",
    startDate: "2024-04-01",
    endDate: "2026-04-01",
    schedule: "Daily sessions: 6:00 AM - 7:30 AM",
    prerequisites: ["Basic Arabic reading", "Commitment to daily practice"],
    features: ["One-on-one sessions", "Progress tracking", "Ijazah certification", "Spiritual guidance"],
    curriculum: [
      {
        week: 1,
        title: "Foundation & Preparation",
        topics: ["Tajweed basics", "Memorization techniques", "Daily routine setup"],
        duration: "1.5 hours daily"
      },
      {
        week: 2,
        title: "Surah Al-Fatiha & Short Surahs",
        topics: ["Perfect recitation", "Meaning understanding", "Memorization drills"],
        duration: "1.5 hours daily"
      }
    ],
    language: "Arabic/English",
    certificate: true,
    materials: ["Digital Mushaf", "Audio recordings", "Progress tracker", "Study guides"],
    requirements: ["Stable internet connection", "Quiet study space", "Daily commitment"],
    whatYouWillLearn: [
      "Complete Quran memorization with proper Tajweed",
      "Understanding of Quranic meanings and context",
      "Spiritual connection and personal development",
      "Teaching methodology for others"
    ],
    isPopular: true,
    discount: 25
  },
  {
    id: "ic-002",
    title: "Islamic Jurisprudence (Fiqh) Mastery",
    description: "Comprehensive study of Islamic law covering worship, transactions, family law, and contemporary issues according to authentic sources.",
    instructor: "Dr. Fatima Al-Faqiha",
    instructorBio: "PhD in Islamic Jurisprudence from Islamic University of Medina. Author of several books on contemporary Fiqh issues.",
    duration: "16 weeks",
    level: "Intermediate",
    category: "Islamic Law",
    rating: 4.8,
    students: 89,
    lessons: 32,
    price: "$199",
    originalPrice: "$249",
    startDate: "2024-04-15",
    endDate: "2024-08-15",
    schedule: "Tuesdays & Thursdays, 8:00 PM - 9:30 PM",
    prerequisites: ["Basic Islamic knowledge", "Arabic reading ability"],
    features: ["Interactive case studies", "Q&A sessions", "Practical applications", "Certificate"],
    curriculum: [
      {
        week: 1,
        title: "Foundations of Fiqh",
        topics: ["Sources of Islamic law", "Methodology", "Schools of thought"],
        duration: "3 hours weekly"
      },
      {
        week: 2,
        title: "Worship (Ibadah)",
        topics: ["Prayer rulings", "Fasting laws", "Zakat calculations"],
        duration: "3 hours weekly"
      }
    ],
    language: "Arabic/English",
    certificate: true,
    materials: ["Fiqh textbooks", "Case study materials", "Reference guides"],
    requirements: ["Basic Arabic comprehension", "Note-taking materials"],
    whatYouWillLearn: [
      "Comprehensive understanding of Islamic law",
      "Ability to derive rulings from sources",
      "Contemporary Fiqh applications",
      "Comparative jurisprudence analysis"
    ],
    discount: 20
  },
  {
    id: "ic-003",
    title: "Prophetic Biography (Seerah) Complete Course",
    description: "Detailed study of Prophet Muhammad's (ﷺ) life, teachings, and legacy. Learn from his example and apply prophetic guidance in modern life.",
    instructor: "Sheikh Omar Al-Seerah",
    instructorBio: "Specialist in Prophetic Biography with 20+ years of research. Regular speaker at international Islamic conferences.",
    duration: "12 weeks",
    level: "Beginner",
    category: "Prophetic Studies",
    rating: 4.9,
    students: 234,
    lessons: 24,
    price: "Free",
    startDate: "2024-03-25",
    endDate: "2024-06-25",
    schedule: "Saturdays, 2:00 PM - 4:00 PM",
    features: ["Historical analysis", "Character development", "Practical lessons", "Community discussions"],
    curriculum: [
      {
        week: 1,
        title: "Pre-Islamic Arabia & Birth",
        topics: ["Historical context", "Family background", "Early signs"],
        duration: "2 hours weekly"
      },
      {
        week: 2,
        title: "Youth & Character Development",
        topics: ["Trustworthiness", "Marriage to Khadijah", "Cave of Hira"],
        duration: "2 hours weekly"
      }
    ],
    language: "English/Arabic",
    certificate: true,
    materials: ["Seerah books", "Historical maps", "Timeline charts", "Audio lectures"],
    requirements: ["Interest in Islamic history", "Note-taking materials"],
    whatYouWillLearn: [
      "Complete life story of Prophet Muhammad (ﷺ)",
      "Practical lessons for modern Muslims",
      "Historical context and significance",
      "Character development principles"
    ],
    isNew: true
  },
  {
    id: "ic-004",
    title: "Advanced Arabic Grammar & Quranic Language",
    description: "Master Arabic grammar to understand the Quran directly. Focus on Quranic vocabulary, syntax, and linguistic miracles.",
    instructor: "Dr. Ahmad Al-Nahwi",
    instructorBio: "PhD in Arabic Linguistics from Cairo University. Expert in Quranic Arabic with 25+ years of teaching experience.",
    duration: "20 weeks",
    level: "Advanced",
    category: "Arabic Language",
    rating: 4.7,
    students: 67,
    lessons: 40,
    price: "$249",
    originalPrice: "$299",
    startDate: "2024-04-08",
    endDate: "2024-08-30",
    schedule: "Mondays & Wednesdays, 7:00 PM - 8:30 PM",
    prerequisites: ["Intermediate Arabic", "Basic grammar knowledge"],
    features: ["Quranic analysis", "Grammar exercises", "Vocabulary building", "Translation practice"],
    curriculum: [
      {
        week: 1,
        title: "Advanced Grammar Foundations",
        topics: ["Complex sentence structures", "Verb forms", "Grammatical analysis"],
        duration: "3 hours weekly"
      }
    ],
    language: "Arabic/English",
    certificate: true,
    materials: ["Grammar textbooks", "Quranic analysis tools", "Practice exercises"],
    requirements: ["Intermediate Arabic level", "Arabic keyboard"],
    whatYouWillLearn: [
      "Advanced Arabic grammar mastery",
      "Direct Quranic comprehension",
      "Linguistic miracle appreciation",
      "Translation skills development"
    ],
    discount: 17
  },
  {
    id: "ic-005",
    title: "Islamic Finance & Halal Investment Principles",
    description: "Learn Shariah-compliant finance, halal investment strategies, and Islamic banking principles for modern financial decisions.",
    instructor: "Dr. Yusuf Al-Maliyah",
    instructorBio: "Islamic Finance expert with MBA and PhD in Islamic Economics. Consultant for major Islamic banks worldwide.",
    duration: "10 weeks",
    level: "Intermediate",
    category: "Islamic Finance",
    rating: 4.6,
    students: 123,
    lessons: 20,
    price: "$179",
    originalPrice: "$219",
    startDate: "2024-04-22",
    endDate: "2024-07-01",
    schedule: "Sundays, 3:00 PM - 5:00 PM",
    prerequisites: ["Basic finance knowledge", "Interest in Islamic economics"],
    features: ["Real case studies", "Investment analysis", "Practical tools", "Expert guidance"],
    curriculum: [
      {
        week: 1,
        title: "Islamic Finance Foundations",
        topics: ["Riba prohibition", "Risk sharing", "Asset backing"],
        duration: "2 hours weekly"
      }
    ],
    language: "English",
    certificate: true,
    materials: ["Finance guides", "Investment calculators", "Case studies"],
    requirements: ["Calculator", "Spreadsheet software"],
    whatYouWillLearn: [
      "Shariah-compliant investment strategies",
      "Islamic banking principles",
      "Halal business practices",
      "Financial planning according to Islam"
    ],
    isPopular: true,
    discount: 18
  },
  {
    id: "ic-006",
    title: "Islamic Parenting & Child Development",
    description: "Raise righteous children according to Islamic principles. Learn prophetic methods of education, discipline, and spiritual development.",
    instructor: "Sister Aisha Al-Umm",
    instructorBio: "Child psychologist and Islamic educator. Mother of 5 and author of 'Raising Muslim Children in Modern Times'.",
    duration: "8 weeks",
    level: "Beginner",
    category: "Family & Parenting",
    rating: 4.8,
    students: 189,
    lessons: 16,
    price: "Free",
    startDate: "2024-03-30",
    endDate: "2024-05-25",
    schedule: "Saturdays, 10:00 AM - 12:00 PM",
    features: ["Practical strategies", "Age-specific guidance", "Q&A sessions", "Parent support group"],
    curriculum: [
      {
        week: 1,
        title: "Islamic Parenting Foundations",
        topics: ["Prophetic guidance", "Child psychology", "Islamic values"],
        duration: "2 hours weekly"
      }
    ],
    language: "English",
    certificate: true,
    materials: ["Parenting guides", "Activity sheets", "Resource library"],
    requirements: ["Parenting experience or interest"],
    whatYouWillLearn: [
      "Islamic parenting principles",
      "Character development strategies",
      "Discipline with wisdom",
      "Spiritual nurturing techniques"
    ],
    isNew: true
  }
];

const categories = [
  "All Courses",
  "Quran Memorization",
  "Islamic Law",
  "Prophetic Studies",
  "Arabic Language",
  "Islamic Finance",
  "Family & Parenting"
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

function IslamicCourseEnrollment() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<IslamicCourse | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access Islamic courses");
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  // Load enrolled courses from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`enrolled-courses-${user.id}`);
      if (saved) {
        setEnrolledCourses(JSON.parse(saved));
      }
    }
  }, [user]);

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const filteredCourses = islamicCoursesData.filter(course => {
    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    const matchesSearch = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleEnrollment = async (course: IslamicCourse) => {
    setIsEnrolling(true);
    
    try {
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newEnrolledCourses = [...enrolledCourses, course.id];
      setEnrolledCourses(newEnrolledCourses);
      localStorage.setItem(`enrolled-courses-${user.id}`, JSON.stringify(newEnrolledCourses));
      
      toast.success(`Successfully enrolled in ${course.title}!`);
      setSelectedCourse(null);
    } catch (error) {
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const isEnrolled = (courseId: string) => enrolledCourses.includes(courseId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const calculateDiscountedPrice = (price: string, originalPrice?: string, discount?: number) => {
    if (price === "Free") return "Free";
    if (discount && originalPrice) {
      const original = parseInt(originalPrice.replace('$', ''));
      const discounted = original - (original * discount / 100);
      return `$${discounted}`;
    }
    return price;
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Course Enrollment" 
      subtitle="Deepen your Islamic knowledge with authentic courses"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse">
                  <GraduationCap size={32} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-display tracking-wide">
                    Assalamu Alaikum, {profile?.full_name || "Student"}!
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Continue your Islamic education journey with our comprehensive courses
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <Badge variant="outline" className="gap-1">
                      <BookOpen size={12} />
                      {islamicCoursesData.length} Courses Available
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users size={12} />
                      {islamicCoursesData.reduce((sum, course) => sum + course.students, 0)} Students Enrolled
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Trophy size={12} />
                      {enrolledCourses.length} Your Enrollments
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/learning-center")}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Heart size={16} />
                My Learning
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Islamic courses, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-background border border-border/50 focus:border-primary outline-none min-w-[160px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-background border border-border/50 focus:border-primary outline-none min-w-[140px]"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <Card 
              key={course.id}
              className={cn(
                "hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up relative overflow-hidden",
                isEnrolled(course.id) && "ring-2 ring-green-500/50 bg-green-50/50 dark:bg-green-950/20"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Course Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {course.isPopular && (
                  <Badge className="bg-red-500 hover:bg-red-600 gap-1">
                    <Zap size={12} />
                    Popular
                  </Badge>
                )}
                {course.isNew && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 gap-1">
                    <Star size={12} />
                    New
                  </Badge>
                )}
                {course.discount && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 gap-1">
                    <Target size={12} />
                    {course.discount}% OFF
                  </Badge>
                )}
                {isEnrolled(course.id) && (
                  <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                    <CheckCircle size={12} />
                    Enrolled
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", getLevelColor(course.level))}>
                      {course.level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-display text-lg mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <User size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{course.instructor}</span>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={14} className="text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.duration}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Play size={14} className="text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.lessons} lessons</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={14} className="text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.students} students</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-secondary/30">
                  <Calendar size={14} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">Starts {formatDate(course.startDate)}</p>
                    <p className="text-xs text-muted-foreground">{course.schedule}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {course.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs gap-1">
                        <CheckCircle size={10} />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-display text-primary">
                        {calculateDiscountedPrice(course.price, course.originalPrice, course.discount)}
                      </span>
                      {course.discount && course.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {course.originalPrice}
                        </span>
                      )}
                    </div>
                    {course.price !== "Free" && (
                      <span className="text-xs text-muted-foreground">one-time payment</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCourse(course)}
                      className="gap-1"
                    >
                      <BookOpen size={14} />
                      Details
                    </Button>
                    {!isEnrolled(course.id) ? (
                      <Button 
                        size="sm"
                        className="bg-primary hover:bg-primary/90 gap-1"
                        onClick={() => handleEnrollment(course)}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserCheck size={14} />
                        )}
                        Enroll
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 gap-1"
                        onClick={() => navigate("/learning-center")}
                      >
                        <Play size={14} />
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-display mb-2">
                      {selectedCourse.title}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      by {selectedCourse.instructor}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCourse(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="enroll">Enroll</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Course Description</h4>
                      <p className="text-muted-foreground">{selectedCourse.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">What You'll Learn</h4>
                      <ul className="space-y-1">
                        {selectedCourse.whatYouWillLearn.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Course Materials</h4>
                        <ul className="space-y-1">
                          {selectedCourse.materials.map((material, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Download size={14} className="text-primary" />
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {selectedCourse.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertCircle size={14} className="text-amber-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="curriculum" className="space-y-4">
                    <h4 className="font-semibold">Course Curriculum</h4>
                    <div className="space-y-3">
                      {selectedCourse.curriculum.map((week, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">Week {week.week}: {week.title}</h5>
                              <Badge variant="outline">{week.duration}</Badge>
                            </div>
                            <ul className="space-y-1">
                              {week.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <BookMarked size={14} />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructor" className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                        <User size={32} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{selectedCourse.instructor}</h4>
                        <p className="text-muted-foreground mt-2">{selectedCourse.instructorBio}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="enroll" className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-display text-primary mb-2">
                        {calculateDiscountedPrice(selectedCourse.price, selectedCourse.originalPrice, selectedCourse.discount)}
                      </div>
                      {selectedCourse.discount && selectedCourse.originalPrice && (
                        <div className="text-muted-foreground line-through mb-4">
                          {selectedCourse.originalPrice}
                        </div>
                      )}
                      
                      {!isEnrolled(selectedCourse.id) ? (
                        <Button 
                          size="lg"
                          className="bg-primary hover:bg-primary/90 gap-2"
                          onClick={() => handleEnrollment(selectedCourse)}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <UserCheck size={20} />
                          )}
                          {isEnrolling ? "Enrolling..." : "Enroll Now"}
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <Badge className="bg-green-500 hover:bg-green-600 gap-2 text-lg px-4 py-2">
                            <CheckCircle size={16} />
                            Already Enrolled
                          </Badge>
                          <div>
                            <Button 
                              size="lg"
                              className="bg-green-600 hover:bg-green-700 gap-2"
                              onClick={() => navigate("/learning-center")}
                            >
                              <Play size={20} />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedPageLayout>
  );
}

export default IslamicCourseEnrollment;