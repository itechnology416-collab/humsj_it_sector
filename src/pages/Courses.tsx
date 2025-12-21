import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  User,
  Play,
  Award,
  Search,
  GraduationCap,
  Heart,
  Globe,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
  students: number;
  lessons: number;
  price: "Free" | string;
  startDate: string;
  schedule: string;
  prerequisites?: string[];
  features: string[];
  imageUrl?: string;
}

const coursesData: Course[] = [
  {
    id: "1",
    title: "Quran Recitation for Beginners",
    description: "Learn proper Quran recitation with Tajweed rules. Perfect for those starting their journey with the Holy Quran.",
    instructor: "Sheikh Ahmed Al-Mahmoud",
    duration: "8 weeks",
    level: "Beginner",
    category: "Quran Studies",
    rating: 4.9,
    students: 245,
    lessons: 16,
    price: "Free",
    startDate: "2024-04-01",
    schedule: "Tuesdays & Thursdays, 7:00 PM",
    features: ["Live Sessions", "Recording Available", "Certificate", "Practice Materials"],
  },
  {
    id: "2",
    title: "Islamic History and Civilization",
    description: "Comprehensive study of Islamic history from the time of Prophet Muhammad (PBUH) to modern times.",
    instructor: "Dr. Fatima Hassan",
    duration: "12 weeks",
    level: "Intermediate",
    category: "Islamic History",
    rating: 4.8,
    students: 189,
    lessons: 24,
    price: "$99",
    startDate: "2024-04-15",
    schedule: "Saturdays, 2:00 PM",
    prerequisites: ["Basic Islamic Knowledge"],
    features: ["Interactive Discussions", "Historical Documents", "Certificate", "Study Groups"],
  },
  {
    id: "3",
    title: "Arabic Language Fundamentals",
    description: "Master the basics of Arabic language to better understand the Quran and Islamic texts.",
    instructor: "Ustadh Omar Khalil",
    duration: "16 weeks",
    level: "Beginner",
    category: "Arabic Language",
    rating: 4.7,
    students: 156,
    lessons: 32,
    price: "$149",
    startDate: "2024-03-25",
    schedule: "Mondays & Wednesdays, 6:30 PM",
    features: ["Interactive Exercises", "Speaking Practice", "Writing Assignments", "Certificate"],
  },
  {
    id: "4",
    title: "Islamic Finance and Economics",
    description: "Understanding Islamic principles in finance, banking, and economic systems according to Shariah law.",
    instructor: "Dr. Abdullah Rahman",
    duration: "10 weeks",
    level: "Advanced",
    category: "Islamic Finance",
    rating: 4.6,
    students: 98,
    lessons: 20,
    price: "$199",
    startDate: "2024-04-08",
    schedule: "Sundays, 3:00 PM",
    prerequisites: ["Basic Economics Knowledge", "Islamic Jurisprudence Basics"],
    features: ["Case Studies", "Real-world Applications", "Expert Guest Speakers", "Certificate"],
  },
  {
    id: "5",
    title: "Hadith Studies and Authentication",
    description: "Learn the science of Hadith, authentication methods, and the major collections of prophetic traditions.",
    instructor: "Sheikh Muhammad Al-Bukhari",
    duration: "14 weeks",
    level: "Intermediate",
    category: "Hadith Studies",
    rating: 4.9,
    students: 134,
    lessons: 28,
    price: "$129",
    startDate: "2024-04-22",
    schedule: "Fridays, 8:00 PM",
    prerequisites: ["Basic Arabic Reading", "Islamic History Basics"],
    features: ["Manuscript Analysis", "Authentication Techniques", "Research Methods", "Certificate"],
  },
  {
    id: "6",
    title: "Islamic Parenting and Family Life",
    description: "Guidance on raising children according to Islamic values and building strong Muslim families.",
    instructor: "Sister Aisha Mohamed",
    duration: "6 weeks",
    level: "Beginner",
    category: "Family & Parenting",
    rating: 4.8,
    students: 203,
    lessons: 12,
    price: "Free",
    startDate: "2024-03-30",
    schedule: "Saturdays, 10:00 AM",
    features: ["Practical Tips", "Q&A Sessions", "Parent Support Group", "Resource Library"],
  }
];

const categories = [
  "All",
  "Quran Studies",
  "Islamic History",
  "Arabic Language",
  "Islamic Finance",
  "Hadith Studies",
  "Family & Parenting",
  "Islamic Law"
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

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

  return (
    <PageLayout 
      title="Islamic Courses" 
      subtitle="Expand your Islamic knowledge"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
                <GraduationCap size={32} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display tracking-wide mb-2">Islamic Education</h2>
                <p className="text-muted-foreground">
                  Deepen your understanding of Islam through our comprehensive course offerings
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-primary">
                    <BookOpen size={14} />
                    {coursesData.length} Courses
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <Users size={14} />
                    {coursesData.reduce((sum, course) => sum + course.students, 0)} Students
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate("/learning-center")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Heart size={16} />
              Learning Center
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary outline-none"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level} Level</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div 
              key={course.id}
              className="bg-card rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Course Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">
                      {course.category}
                    </span>
                    <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getLevelColor(course.level))}>
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-display text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
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
                      <span key={feature} className="text-xs px-2 py-1 rounded-md bg-green-500/20 text-green-400 flex items-center gap-1">
                        <CheckCircle size={10} />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-display text-primary">
                      {course.price}
                    </span>
                    {course.price !== "Free" && (
                      <span className="text-sm text-muted-foreground ml-1">total</span>
                    )}
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 gap-2"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <BookOpen size={16} />
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/10 via-card to-accent/10 rounded-xl p-6 border border-primary/20">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-display tracking-wide mb-2">Become an Instructor</h3>
            <p className="text-muted-foreground mb-6">
              Share your Islamic knowledge with our community. Apply to become a course instructor.
            </p>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <User size={16} />
              Apply to Teach
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}