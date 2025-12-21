import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Code, 
  Plus, 
  Users, 
  Calendar,
  GitBranch,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Save,
  Loader2,
  ExternalLink,
  Github,
  Globe,
  Star,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in_progress" | "testing" | "completed" | "on_hold";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  technologies: string[];
  team_members: string[];
  start_date: string;
  end_date?: string;
  progress: number;
  repository_url?: string;
  demo_url?: string;
  created_by: string;
  created_at: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "HUMSJ Mobile App",
    description: "Cross-platform mobile application for HUMSJ members with prayer times, events, and community features",
    status: "in_progress",
    priority: "high",
    category: "Mobile Development",
    technologies: ["React Native", "TypeScript", "Supabase", "Expo"],
    team_members: ["Ahmed Hassan", "Fatima Ali", "Omar Ibrahim"],
    start_date: "2024-01-15",
    end_date: "2024-04-30",
    progress: 65,
    repository_url: "https://github.com/humsj/mobile-app",
    created_by: "Ahmed Hassan",
    created_at: "2024-01-15"
  },
  {
    id: "2",
    title: "Islamic Learning Platform",
    description: "E-learning platform for Islamic studies with interactive courses and progress tracking",
    status: "planning",
    priority: "medium",
    category: "Web Development",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
    team_members: ["Aisha Mohamed", "Yusuf Ahmed"],
    start_date: "2024-03-01",
    end_date: "2024-08-15",
    progress: 15,
    created_by: "Aisha Mohamed",
    created_at: "2024-02-20"
  },
  {
    id: "3",
    title: "Prayer Time API",
    description: "RESTful API service for accurate prayer times calculation with multiple calculation methods",
    status: "completed",
    priority: "medium",
    category: "Backend Development",
    technologies: ["Node.js", "Express", "MongoDB", "Docker"],
    team_members: ["Ibrahim Osman", "Khadija Hassan"],
    start_date: "2023-11-01",
    end_date: "2024-01-30",
    progress: 100,
    repository_url: "https://github.com/humsj/prayer-api",
    demo_url: "https://api.humsj.edu.et/prayer",
    created_by: "Ibrahim Osman",
    created_at: "2023-11-01"
  },
  {
    id: "4",
    title: "Campus Network Monitoring",
    description: "Network monitoring system for university IT infrastructure with real-time alerts",
    status: "testing",
    priority: "urgent",
    category: "System Administration",
    technologies: ["Python", "Grafana", "InfluxDB", "Docker"],
    team_members: ["Mohamed Ali", "Sara Ahmed", "Hassan Omar"],
    start_date: "2024-02-01",
    end_date: "2024-03-15",
    progress: 85,
    repository_url: "https://github.com/humsj/network-monitor",
    created_by: "Mohamed Ali",
    created_at: "2024-02-01"
  }
];

const statusConfig = {
  planning: { label: "Planning", color: "bg-blue-500/20 text-blue-400", icon: Target },
  in_progress: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400", icon: Play },
  testing: { label: "Testing", color: "bg-purple-500/20 text-purple-400", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  on_hold: { label: "On Hold", color: "bg-gray-500/20 text-gray-400", icon: Pause },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-500/20 text-gray-400" },
  medium: { label: "Medium", color: "bg-blue-500/20 text-blue-400" },
  high: { label: "High", color: "bg-orange-500/20 text-orange-400" },
  urgent: { label: "Urgent", color: "bg-red-500/20 text-red-400" },
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    start_date: "",
    end_date: "",
    priority: "medium" as Project["priority"],
    repository_url: "",
    demo_url: ""
  });

  const categories = ["All", "Web Development", "Mobile Development", "Backend Development", "System Administration", "Data Science", "AI/ML"];
  const statuses = ["all", "planning", "in_progress", "testing", "completed", "on_hold"];

  const filteredProjects = projects.filter(project => {
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || selectedCategory === "All" || project.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      // In a real implementation, this would save to Supabase
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        status: "planning",
        priority: newProject.priority,
        category: newProject.category,
        technologies: newProject.technologies.split(",").map(t => t.trim()),
        team_members: [],
        start_date: newProject.start_date,
        end_date: newProject.end_date || undefined,
        progress: 0,
        repository_url: newProject.repository_url || undefined,
        demo_url: newProject.demo_url || undefined,
        created_by: user?.email || "Unknown",
        created_at: new Date().toISOString()
      };

      setProjects([project, ...projects]);
      toast.success("Project created successfully!");
      
      // Reset form
      setNewProject({
        title: "",
        description: "",
        category: "",
        technologies: "",
        start_date: "",
        end_date: "",
        priority: "medium",
        repository_url: "",
        demo_url: ""
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
    avgProgress: Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
  };

  return (
    <PageLayout 
      title="Projects" 
      subtitle="Manage IT sector projects and development work"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Play size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              {statuses.slice(1).map(status => (
                <option key={status} value={status}>
                  {statusConfig[status as keyof typeof statusConfig].label}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                <Plus size={18} />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="HUMSJ Mobile App"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newProject.category} onValueChange={(value) => setNewProject(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project goals and features..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="technologies">Technologies</Label>
                    <Input
                      id="technologies"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newProject.priority} onValueChange={(value: Project["priority"]) => setNewProject(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newProject.start_date}
                      onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={newProject.end_date}
                      onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="repository_url">Repository URL</Label>
                    <Input
                      id="repository_url"
                      value={newProject.repository_url}
                      onChange={(e) => setNewProject(prev => ({ ...prev, repository_url: e.target.value }))}
                      placeholder="https://github.com/humsj/project"
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo_url">Demo URL</Label>
                    <Input
                      id="demo_url"
                      value={newProject.demo_url}
                      onChange={(e) => setNewProject(prev => ({ ...prev, demo_url: e.target.value }))}
                      placeholder="https://demo.humsj.edu.et"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateProject} 
                    disabled={isCreating}
                    className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={index * 100} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-display mb-2">No Projects Found</h3>
            <p className="text-muted-foreground">No projects match your current filters.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];
  const StatusIcon = status.icon;

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", status.color)}>
            <StatusIcon size={12} className="inline mr-1" />
            {status.label}
          </span>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", priority.color)}>
            {priority.label}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map(tech => (
            <span key={tech} className="text-xs px-2 py-1 bg-secondary/50 text-secondary rounded">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {project.team_members.length}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(project.start_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {project.repository_url && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Github size={16} />
              </Button>
            )}
            {project.demo_url && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Globe size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}