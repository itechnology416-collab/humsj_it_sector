import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Award,
  BookOpen,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  Play,
  Target,
  Brain,
  Trophy,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  icon: string;
  color: string;
}

interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  instructor: string;
  skills_covered: string[];
  start_date: string;
  end_date: string;
  max_participants: number;
  current_participants: number;
  status: "upcoming" | "ongoing" | "completed";
}

interface MemberSkill {
  member_id: string;
  member_name: string;
  skills: { skill: string; level: string; verified: boolean }[];
  certifications: string[];
  training_completed: number;
}

const skillCategories = [
  "Programming Languages",
  "Web Development",
  "Mobile Development", 
  "Database",
  "DevOps",
  "AI/ML",
  "Cybersecurity",
  "UI/UX Design",
  "Project Management",
  "Islamic Tech"
];

const skills: Skill[] = [
  { id: "1", name: "JavaScript", category: "Programming Languages", level: "intermediate", description: "Modern JavaScript ES6+", icon: "🟨", color: "from-yellow-500 to-orange-500" },
  { id: "2", name: "Python", category: "Programming Languages", level: "advanced", description: "Python for web and data science", icon: "🐍", color: "from-blue-500 to-green-500" },
  { id: "3", name: "React", category: "Web Development", level: "intermediate", description: "React.js frontend framework", icon: "⚛️", color: "from-cyan-500 to-blue-500" },
  { id: "4", name: "Node.js", category: "Web Development", level: "intermediate", description: "Server-side JavaScript", icon: "🟢", color: "from-green-500 to-emerald-500" },
  { id: "5", name: "Flutter", category: "Mobile Development", level: "beginner", description: "Cross-platform mobile development", icon: "📱", color: "from-blue-400 to-cyan-400" },
  { id: "6", name: "PostgreSQL", category: "Database", level: "intermediate", description: "Relational database management", icon: "🐘", color: "from-blue-600 to-indigo-600" },
  { id: "7", name: "Docker", category: "DevOps", level: "beginner", description: "Containerization platform", icon: "🐳", color: "from-blue-500 to-cyan-500" },
  { id: "8", name: "Machine Learning", category: "AI/ML", level: "beginner", description: "ML algorithms and models", icon: "🤖", color: "from-purple-500 to-pink-500" },
  { id: "9", name: "Islamic App Development", category: "Islamic Tech", level: "intermediate", description: "Developing Islamic applications", icon: "🕌", color: "from-green-600 to-emerald-600" },
  { id: "10", name: "Figma", category: "UI/UX Design", level: "intermediate", description: "UI/UX design tool", icon: "🎨", color: "from-pink-500 to-purple-500" }
];

const trainings: Training[] = [
  {
    id: "1",
    title: "React.js Fundamentals",
    description: "Learn the basics of React.js including components, state, and props",
    category: "Web Development",
    level: "beginner",
    duration: "4 weeks",
    instructor: "Ahmed Hassan",
    skills_covered: ["React", "JavaScript", "HTML", "CSS"],
    start_date: "2024-03-01",
    end_date: "2024-03-29",
    max_participants: 20,
    current_participants: 15,
    status: "upcoming"
  },
  {
    id: "2",
    title: "Islamic App Development Workshop",
    description: "Build Islamic applications with prayer times, Quran, and community features",
    category: "Islamic Tech",
    level: "intermediate",
    duration: "6 weeks",
    instructor: "Fatima Ali",
    skills_covered: ["React Native", "Islamic APIs", "UI/UX", "Firebase"],
    start_date: "2024-02-15",
    end_date: "2024-03-28",
    max_participants: 15,
    current_participants: 12,
    status: "ongoing"
  },
  {
    id: "3",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis and machine learning",
    category: "AI/ML",
    level: "intermediate",
    duration: "8 weeks",
    instructor: "Omar Ibrahim",
    skills_covered: ["Python", "Pandas", "NumPy", "Scikit-learn"],
    start_date: "2024-01-15",
    end_date: "2024-03-10",
    max_participants: 25,
    current_participants: 25,
    status: "completed"
  }
];

const memberSkills: MemberSkill[] = [
  {
    member_id: "1",
    member_name: "Ahmed Hassan",
    skills: [
      { skill: "JavaScript", level: "advanced", verified: true },
      { skill: "React", level: "expert", verified: true },
      { skill: "Node.js", level: "advanced", verified: false }
    ],
    certifications: ["AWS Certified Developer", "React Professional"],
    training_completed: 5
  },
  {
    member_id: "2", 
    member_name: "Fatima Ali",
    skills: [
      { skill: "Python", level: "expert", verified: true },
      { skill: "Machine Learning", level: "advanced", verified: true },
      { skill: "Flutter", level: "intermediate", verified: false }
    ],
    certifications: ["Google ML Engineer", "Python Institute PCAP"],
    training_completed: 8
  }
];

const levelConfig = {
  beginner: { label: "Beginner", color: "bg-blue-500/20 text-blue-400", progress: 25 },
  intermediate: { label: "Intermediate", color: "bg-yellow-500/20 text-yellow-400", progress: 50 },
  advanced: { label: "Advanced", color: "bg-orange-500/20 text-orange-400", progress: 75 },
  expert: { label: "Expert", color: "bg-green-500/20 text-green-400", progress: 100 }
};

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-blue-500/20 text-blue-400", icon: Calendar },
  ongoing: { label: "Ongoing", color: "bg-yellow-500/20 text-yellow-400", icon: Play },
  completed: { label: "Completed", color: "bg-green-500/20 text-green-400", icon: CheckCircle }
};

export default function SkillsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"skills" | "training" | "members">("skills");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSkills = skills.filter(skill => 
    selectedCategory === "All" || skill.category === selectedCategory
  );

  const stats = {
    totalSkills: skills.length,
    activeTraining: trainings.filter(t => t.status === "ongoing").length,
    completedTraining: trainings.filter(t => t.status === "completed").length,
    totalMembers: memberSkills.length
  };

  return (
    <PageLayout 
      title="Skills & Training" 
      subtitle="Manage skills development and training programs"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSkills}</p>
                <p className="text-xs text-muted-foreground">Skills Tracked</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Play size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeTraining}</p>
                <p className="text-xs text-muted-foreground">Active Training</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Trophy size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedTraining}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
                <p className="text-xs text-muted-foreground">Learning Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: "skills", label: "Skills Library", icon: Brain },
            { id: "training", label: "Training Programs", icon: BookOpen },
            { id: "members", label: "Member Skills", icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as unknown)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {skillCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill, index) => (
                <div 
                  key={skill.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center text-2xl`}>
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-1">{skill.name}</h4>
                      <p className="text-sm text-primary mb-2">{skill.category}</p>
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", levelConfig[skill.level].color)}>
                        {levelConfig[skill.level].label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === "training" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Training Programs</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainings.map((training, index) => (
                <div 
                  key={training.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">{training.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{training.description}</p>
                    </div>
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium ml-4", statusConfig[training.status].color)}>
                      {statusConfig[training.status].label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor:</span>
                      <span className="font-medium">{training.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{training.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-medium">{training.current_participants}/{training.max_participants}</span>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Skills Covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {training.skills_covered.map(skill => (
                          <span key={skill} className="text-xs px-2 py-1 bg-secondary/50 text-secondary rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(training.start_date).toLocaleDateString()} - {new Date(training.end_date).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="outline" className="border-border/50 hover:border-primary">
                        {training.status === "upcoming" ? "Enroll" : training.status === "ongoing" ? "Join" : "View"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Member Skills Overview</h3>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <TrendingUp size={18} />
                Skills Report
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {memberSkills.map((member, index) => (
                <div 
                  key={member.member_id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{member.member_name}</h4>
                      <p className="text-sm text-muted-foreground">{member.training_completed} trainings completed</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="space-y-2">
                        {member.skills.map((skill, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{skill.skill}</span>
                              {skill.verified && <CheckCircle size={14} className="text-green-500" />}
                            </div>
                            <span className={cn("text-xs px-2 py-1 rounded-full", levelConfig[skill.level as keyof typeof levelConfig].color)}>
                              {levelConfig[skill.level as keyof typeof levelConfig].label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {member.certifications.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.certifications.map(cert => (
                            <span key={cert} className="text-xs px-2 py-1 bg-accent/20 text-accent rounded flex items-center gap-1">
                              <Award size={10} />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}