import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
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
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const savedLectures = [
  { 
    id: 1, 
    title: "Islamic Ethics in Technology", 
    instructor: "Dr. Ahmed Hassan", 
    duration: "45 min", 
    progress: 75,
    type: "video",
    category: "Ethics",
    savedAt: "2024-12-20"
  },
  { 
    id: 2, 
    title: "Quranic Arabic Fundamentals", 
    instructor: "Ustadh Omar Ali", 
    duration: "60 min", 
    progress: 100,
    type: "audio",
    category: "Language",
    savedAt: "2024-12-19"
  },
  { 
    id: 3, 
    title: "Prayer in Islam", 
    instructor: "Sheikh Abdullah", 
    duration: "30 min", 
    progress: 50,
    type: "video",
    category: "Worship",
    savedAt: "2024-12-18"
  }
];

const enrolledCourses = [
  {
    id: 1,
    title: "Complete Islamic Studies",
    instructor: "Islamic University",
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: "Hadith Sciences",
    category: "Comprehensive",
    enrolled: "2024-11-15"
  },
  {
    id: 2,
    title: "Arabic Language Mastery",
    instructor: "Language Institute",
    progress: 40,
    totalLessons: 30,
    completedLessons: 12,
    nextLesson: "Grammar Basics",
    category: "Language",
    enrolled: "2024-12-01"
  }
];

const downloadedMaterials = [
  { id: 1, title: "Quran Translation (English)", type: "PDF", size: "2.5 MB", downloadedAt: "2024-12-20" },
  { id: 2, title: "Hadith Collection", type: "PDF", size: "5.1 MB", downloadedAt: "2024-12-19" },
  { id: 3, title: "Islamic History Timeline", type: "PDF", size: "1.8 MB", downloadedAt: "2024-12-18" },
];

export default function LearningCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("lectures");
  const [searchQuery, setSearchQuery] = useState("");

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
      subtitle="Your personal Islamic education hub"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Saved Lectures", value: savedLectures.length.toString(), icon: BookOpen, color: "text-primary" },
            { label: "Enrolled Courses", value: enrolledCourses.length.toString(), icon: GraduationCap, color: "text-blue-400" },
            { label: "Hours Watched", value: "24", icon: Clock, color: "text-green-400" },
            { label: "Certificates", value: "3", icon: Award, color: "text-amber-400" }
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
          {activeTab === "lectures" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedLectures.map((lecture) => {
                const TypeIcon = getTypeIcon(lecture.type);
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
                        {lecture.category}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">
                      {lecture.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{lecture.instructor}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {lecture.duration}
                      </span>
                      <span>Saved {new Date(lecture.savedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{lecture.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${lecture.progress}%` }}
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
              })}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div 
                  key={course.id}
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
                          <p className="text-muted-foreground text-sm">{course.instructor}</p>
                          <Badge variant="secondary" className="mt-2">
                            {course.category}
                          </Badge>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-2xl font-display text-primary">{course.progress}%</p>
                          <p className="text-xs text-muted-foreground">Complete</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress ({course.completedLessons}/{course.totalLessons} lessons)</span>
                          <span className="text-primary">Next: {course.nextLesson}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "downloads" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downloadedMaterials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
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
                        {material.type}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">
                      {material.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{material.size}</span>
                      <span>Downloaded {new Date(material.downloadedAt).toLocaleDateString()}</span>
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
              })}
            </div>
          )}

          {activeTab === "history" && (
            <div className="text-center py-20">
              <Clock size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-display mb-2">Watch History</h3>
              <p className="text-muted-foreground">Your recently watched content will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}