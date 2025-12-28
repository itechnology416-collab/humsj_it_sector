import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { courseApi, type Course } from "@/services/courseApi";
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
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [coursesResponse, categoriesResponse] = await Promise.all([
        courseApi.getCourses({ published: true }),
        courseApi.getCourseCategories()
      ]);

      setCourses(coursesResponse);
      
      // Extract category names
      const categoryNames = ["All", ...categoriesResponse.map(cat => cat.name)];
      setCategories(categoryNames);
      
    } catch (err: unknown) {
      console.error('Error loading courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnrollment = async (courseId: string) => {
    try {
      await courseApi.enrollInCourse({
        course_id: courseId,
        payment_method: 'free', // Assuming free courses for now
        payment_reference: undefined
      });
      
      toast.success("Successfully enrolled in course!");
      
      // Refresh courses to update enrollment status
      await loadData();
    } catch (error: unknown) {
      console.error('Error enrolling in course:', error);
      toast.error(error instanceof Error ? error.message : "Failed to enroll in course");
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category?.name === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor?.full_name && course.instructor.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Courses" 
      subtitle="Expand your Islamic knowledge"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              ×
            </Button>
          </div>
        )}

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
                    {courses.length} Courses
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <Users size={14} />
                    {courses.reduce((sum, course) => sum + (course.current_students || 0), 0)} Students
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
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
                          {course.category?.name || 'General'}
                        </span>
                        <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getLevelColor(course.level))}>
                          {course.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="font-display text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.short_description || course.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <User size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course.instructor?.full_name || 'TBA'}</span>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock size={14} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">{course.duration_weeks} weeks</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen size={14} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">{course.total_lessons} lessons</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users size={14} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">{course.current_students} students</span>
                      </div>
                    </div>

                    {/* Course Features */}
                    {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">What you'll learn:</h4>
                        <ul className="space-y-1">
                          {course.learning_outcomes.slice(0, 2).map((outcome: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle size={12} className="text-green-400" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Course Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        {course.start_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            <span>{new Date(course.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleEnrollment(course.id)}
                        >
                          <Play size={14} className="mr-1" />
                          Enroll
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-display mb-2">No Courses Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
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
    </ProtectedPageLayout>
  );
}