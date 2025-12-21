import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Timer,
  Target,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const tasks = [
  {
    id: 1,
    title: "Update member database system",
    description: "Implement new features for member management and improve data validation",
    category: "IT",
    priority: "high",
    status: "in_progress",
    assignedBy: "IT Committee",
    dueDate: "2024-12-25",
    createdDate: "2024-12-18",
    progress: 65,
    estimatedHours: 20,
    spentHours: 13,
    tags: ["database", "development", "members"]
  },
  {
    id: 2,
    title: "Prepare Friday prayer setup",
    description: "Arrange prayer mats, sound system, and ensure proper ventilation",
    category: "Prayer Committee",
    priority: "medium",
    status: "pending",
    assignedBy: "Prayer Committee",
    dueDate: "2024-12-22",
    createdDate: "2024-12-20",
    progress: 0,
    estimatedHours: 2,
    spentHours: 0,
    tags: ["prayer", "setup", "weekly"]
  },
  {
    id: 3,
    title: "Review event feedback forms",
    description: "Analyze feedback from last community event and prepare improvement suggestions",
    category: "Social Committee",
    priority: "low",
    status: "completed",
    assignedBy: "Social Committee",
    dueDate: "2024-12-20",
    createdDate: "2024-12-15",
    progress: 100,
    estimatedHours: 4,
    spentHours: 3.5,
    tags: ["feedback", "analysis", "events"]
  },
  {
    id: 4,
    title: "Create educational content outline",
    description: "Develop curriculum outline for upcoming Islamic studies course",
    category: "Education Committee",
    priority: "high",
    status: "in_progress",
    assignedBy: "Education Committee",
    dueDate: "2024-12-28",
    createdDate: "2024-12-19",
    progress: 30,
    estimatedHours: 15,
    spentHours: 4.5,
    tags: ["education", "curriculum", "islamic-studies"]
  },
  {
    id: 5,
    title: "Equipment maintenance check",
    description: "Perform routine maintenance on AV equipment and computers",
    category: "IT",
    priority: "medium",
    status: "overdue",
    assignedBy: "IT Committee",
    dueDate: "2024-12-19",
    createdDate: "2024-12-12",
    progress: 20,
    estimatedHours: 6,
    spentHours: 1.2,
    tags: ["maintenance", "equipment", "routine"]
  }
];

export default function MyTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showNewTask, setShowNewTask] = useState(false);

  const tabs = [
    { id: "all", label: "All Tasks", count: tasks.length },
    { id: "pending", label: "Pending", count: tasks.filter(t => t.status === "pending").length },
    { id: "in_progress", label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length },
    { id: "completed", label: "Completed", count: tasks.filter(t => t.status === "completed").length },
    { id: "overdue", label: "Overdue", count: tasks.filter(t => t.status === "overdue").length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in_progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "medium": return "text-amber-400";
      case "low": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in_progress": return Timer;
      case "pending": return Circle;
      case "overdue": return AlertCircle;
      default: return Circle;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === "all" || task.status === activeTab;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    return matchesSearch && matchesTab && matchesPriority && matchesCategory;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    overdue: tasks.filter(t => t.status === "overdue").length,
    totalHours: tasks.reduce((sum, t) => sum + t.spentHours, 0),
    completionRate: Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)
  };

  const categories = [...new Set(tasks.map(t => t.category))];

  return (
    <PageLayout 
      title="My Tasks" 
      subtitle="Manage your assigned tasks and track progress"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks", value: taskStats.total.toString(), icon: CheckSquare, color: "text-primary" },
            { label: "In Progress", value: taskStats.inProgress.toString(), icon: Timer, color: "text-blue-400" },
            { label: "Completed", value: taskStats.completed.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Completion Rate", value: `${taskStats.completionRate}%`, icon: TrendingUp, color: "text-amber-400" }
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

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowNewTask(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              New Task
            </Button>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full lg:w-80 bg-secondary/50 border-border/50"
            />
          </div>
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
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status);
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
            
            return (
              <div 
                key={task.id}
                className={cn(
                  "bg-card rounded-xl p-6 border transition-all duration-300 hover:border-primary/50",
                  isOverdue ? "border-red-500/30 bg-red-500/5" : "border-border/30"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <StatusIcon size={20} className={getPriorityColor(task.priority)} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-display tracking-wide mb-2">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", getStatusColor(task.status))}>
                          {task.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-border/50">
                          <MoreVertical size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User size={14} />
                        <span>{task.assignedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>{task.spentHours}h / {task.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Flag size={14} className={getPriorityColor(task.priority)} />
                        <span className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>

                    {task.status !== "completed" && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {task.status === "pending" && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Start Task
                        </Button>
                      )}
                      {task.status === "in_progress" && (
                        <>
                          <Button size="sm" className="bg-green-500 hover:bg-green-500/90">
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/50">
                            Update Progress
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="border-border/50 gap-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50 gap-1">
                        <Clock size={14} />
                        Log Time
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-20">
              <CheckSquare size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-display mb-2">No Tasks Found</h3>
              <p className="text-muted-foreground">No tasks match your current filters.</p>
            </div>
          )}
        </div>

        {/* New Task Modal */}
        {showNewTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border/30 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-border/30">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-display">Create New Task</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowNewTask(false)}
                    className="border-border/50"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input placeholder="Enter task title..." className="bg-secondary/50 border-border/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea 
                    placeholder="Describe the task..." 
                    rows={4}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select className="w-full px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm">
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <select className="w-full px-3 py-2 rounded-md border border-border/50 bg-secondary/50 text-sm">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Due Date</label>
                    <Input type="date" className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estimated Hours</label>
                    <Input type="number" placeholder="0" className="bg-secondary/50 border-border/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
                  <Input placeholder="Add tags separated by commas..." className="bg-secondary/50 border-border/50" />
                </div>
              </div>
              <div className="p-6 border-t border-border/30 flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowNewTask(false)}
                  className="border-border/50"
                >
                  Cancel
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}