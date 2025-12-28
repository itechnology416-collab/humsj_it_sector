import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { courseApi, type Course, type CourseEnrollment } from "@/services/courseApi";
import { contentApi, type ContentItem } from "@/services/contentApi";
import { 
  BookOpen, 
  Play, 
  Download, 
  Clock, 
  Star, 
  Filter,
  Search,
  GraduationCap,
  Award,
  TrendingUp,
  Eye,
  Calendar,
  CheckCircle,
  PlayCircle,
  FileText,
  Video,
  Headphones,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LearningCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
  const [savedLectures, setSavedLectures] = useState<ContentItem[]>([]);
  const [downloadedMaterials, setDownloadedMaterials] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState("lectures");
  const [searchQuery, setSearchQuery] = useState("");

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user) {
        const [userEnrollments, lectureContent, materialContent] = await Promise.all([
          courseApi.getUserEnrollments(),
          contentApi.getContentItems({ 
            type: 'lecture',
            status: 'published',
            limit: 20 
          }),
          contentApi.getContentItems({ 
            type: 'material',
            status: 'published',
            limit: 20 
          })
        ]);
        
        setEnrolledCourses(userEnrollments);
        setSavedLectures(lectureContent);
        setDownloadedMaterials(materialContent);
      }
    } catch (err: unknown) {
      console.error('Error loading learning center data:', err);
      setError(err.message || 'Failed to load learning center data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [user, loadData]);

  const tabs = [
    { id: "lectures", label: "Saved Lectures", icon: BookOpen },
    { id: "courses", label: "Enrolled Courses", icon: GraduationCap },
    { id: "history", label: "Watch History", icon: Clock },
    { id: "downloads", label: "Downloads", icon: Download }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "audio": return Headphones;
      case "PDF": return FileText;
      default: return FileText;
    }
  };

  return (
    <PageLayout 
      title="My Learning Center" 
      subtitle="Track your Islamic learning journey"
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

        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Saved Lectures", value: savedLectures.length.toString(), icon: BookOpen, color: "text-primary" },
            { label: "Enrolled Courses", value: enrolledCourses.length.toString(), icon: GraduationCap, color: "text-blue-400" },
            { label: "Hours Watched", value: "24", icon: Clock, color: "text-green-400" },
            { label: "Certificates", value: enrolledCourses.filter(c => c.certificate_issued).length.toString(), icon: Award, color: "text-amber-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search lectures, courses, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your learning content...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "lectures" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedLectures.length > 0 ? (
                    savedLectures.map((lecture) => {
                      const TypeIcon = getTypeIcon(lecture.content_type?.name || 'video');
                      return (
                        <div 
                          key={lecture.id}
                          className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                              <TypeIcon size={20} className="text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {lecture.content_type?.name || 'Lecture'}
                            </Badge>
                          </div>
                          
                          <h3 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">
                            {lecture.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">{lecture.author?.full_name || 'Unknown'}</p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {typeof lecture.content === 'object' && lecture.content && 'duration' in lecture.content 
                                ? String(lecture.content.duration)
                                : '30 min'}
                            </span>
                            <span>Saved {new Date(lecture.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>75%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: '75%' }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 gap-1">
                              <Play size={14} />
                              Continue
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50">
                              <Download size={14} />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Saved Lectures</h3>
                      <p className="text-muted-foreground">Start saving lectures to access them here.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "courses" && (
                <div className="space-y-4">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((enrollment) => {
                      const course = enrollment.course;
                      if (!course) return null;
                      
                      return (
                        <div 
                          key={enrollment.id}
                          className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <GraduationCap size={32} className="text-primary" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-display tracking-wide mb-2">{course.title}</h3>
                                  <p className="text-muted-foreground text-sm">{course.instructor?.full_name || 'TBA'}</p>
                                  <Badge variant="secondary" className="mt-2">
                                    {course.category?.name || 'General'}
                                  </Badge>
                                </div>
                                <div className="text-right mt-4 md:mt-0">
                                  <p className="text-2xl font-display text-primary">{enrollment.progress_percentage}%</p>
                                  <p className="text-xs text-muted-foreground">Complete</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span>Progress ({Math.floor((enrollment.progress_percentage / 100) * course.total_lessons)}/{course.total_lessons} lessons)</span>
                                  <span className="text-primary">Next: Lesson {Math.floor((enrollment.progress_percentage / 100) * course.total_lessons) + 1}</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-3">
                                  <div 
                                    className="bg-primary h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${enrollment.progress_percentage}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex gap-3 mt-4">
                                <Button className="bg-primary hover:bg-primary/90 gap-2">
                                  <PlayCircle size={16} />
                                  Continue Learning
                                </Button>
                                <Button variant="outline" className="border-border/50 hover:border-primary">
                                  <Eye size={16} className="mr-2" />
                                  View Details
                                </Button>
                                {enrollment.certificate_issued && (
                                  <Button variant="outline" className="border-border/50 hover:border-primary">
                                    <Download size={16} className="mr-2" />
                                    Certificate
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20">
                      <GraduationCap size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Enrolled Courses</h3>
                      <p className="text-muted-foreground">Browse our course catalog to start learning.</p>
                      <Button 
                        className="mt-4 bg-primary hover:bg-primary/90"
                        onClick={() => navigate("/courses")}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "downloads" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {downloadedMaterials.length > 0 ? (
                    downloadedMaterials.map((material) => {
                      const TypeIcon = getTypeIcon(material.content_type?.name || 'PDF');
                      return (
                        <div 
                          key={material.id}
                          className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                              <TypeIcon size={20} className="text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {material.content_type?.name || 'PDF'}
                            </Badge>
                          </div>
                          
                          <h3 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">
                            {material.title}
                          </h3>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <span>
                              {typeof material.content === 'object' && material.content && 'size' in material.content 
                                ? String(material.content.size)
                                : '1.5 MB'}
                            </span>
                            <span>Downloaded {new Date(material.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 gap-1">
                              <Eye size={14} />
                              Open
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50">
                              <Download size={14} />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <Download size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-display mb-2">No Downloaded Materials</h3>
                      <p className="text-muted-foreground">Download course materials to access them offline.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="text-center py-20">
                  <Clock size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display mb-2">Watch History</h3>
                  <p className="text-muted-foreground">Your recently watched content will appear here.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}