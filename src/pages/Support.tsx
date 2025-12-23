import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Ticket, 
  Plus, 
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  Bug,
  HelpCircle,
  Zap,
  Monitor,
  Wifi,
  Database,
  Shield,
  Save,
  Loader2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  requester: string;
  requester_email: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  tags: string[];
  attachments?: string[];
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
  is_internal: boolean;
}

const mockTickets: SupportTicket[] = [
  {
    id: "TK-001",
    title: "Cannot access university WiFi",
    description: "I'm unable to connect to the HUMSJ-WiFi network. Getting authentication error when trying to login with my credentials.",
    category: "Network",
    priority: "high",
    status: "in_progress",
    requester: "Ahmed Hassan",
    requester_email: "ahmed.hassan@humsj.edu.et",
    assigned_to: "IT Support Team",
    created_at: "2024-02-20T09:30:00Z",
    updated_at: "2024-02-20T14:15:00Z",
    tags: ["wifi", "authentication", "network"],
    comments: [
      {
        id: "1",
        author: "IT Support",
        content: "We're investigating the WiFi authentication issue. Please try clearing your network settings and reconnecting.",
        created_at: "2024-02-20T10:00:00Z",
        is_internal: false
      }
    ]
  },
  {
    id: "TK-002",
    title: "Computer lab printer not working",
    description: "The HP LaserJet printer in Computer Lab A is showing paper jam error but there's no paper stuck. Students can't print their assignments.",
    category: "Hardware",
    priority: "medium",
    status: "open",
    requester: "Fatima Ali",
    requester_email: "fatima.ali@humsj.edu.et",
    created_at: "2024-02-20T11:45:00Z",
    updated_at: "2024-02-20T11:45:00Z",
    tags: ["printer", "hardware", "computer-lab"],
    comments: []
  },
  {
    id: "TK-003",
    title: "Email account locked",
    description: "My university email account has been locked after multiple failed login attempts. I need access for important communications.",
    category: "Account",
    priority: "urgent",
    status: "resolved",
    requester: "Omar Ibrahim",
    requester_email: "omar.ibrahim@humsj.edu.et",
    assigned_to: "Feysal Hussein Kedir (System Admin)",
    created_at: "2024-02-19T16:20:00Z",
    updated_at: "2024-02-20T08:30:00Z",
    resolved_at: "2024-02-20T08:30:00Z",
    tags: ["email", "account", "locked"],
    comments: [
      {
        id: "2",
        author: "Feysal Hussein Kedir (System Admin)",
        content: "Account has been unlocked. Please reset your password using the forgot password link.",
        created_at: "2024-02-20T08:30:00Z",
        is_internal: false
      }
    ]
  },
  {
    id: "TK-004",
    title: "Software installation request",
    description: "Need Visual Studio Code and Node.js installed on computers in Lab B for web development course.",
    category: "Software",
    priority: "low",
    status: "waiting",
    requester: "Dr. Aisha Mohamed",
    requester_email: "aisha.mohamed@humsj.edu.et",
    created_at: "2024-02-18T14:00:00Z",
    updated_at: "2024-02-19T09:15:00Z",
    tags: ["software", "installation", "development"],
    comments: [
      {
        id: "3",
        author: "IT Support",
        content: "Waiting for approval from IT manager for software installation.",
        created_at: "2024-02-19T09:15:00Z",
        is_internal: true
      }
    ]
  }
];

const categories = [
  "All Categories",
  "Hardware",
  "Software", 
  "Network",
  "Account",
  "Email",
  "Security",
  "Database",
  "Website",
  "Other"
];

const priorities = ["all", "low", "medium", "high", "urgent"];
const statuses = ["all", "open", "in_progress", "waiting", "resolved", "closed"];

const statusConfig = {
  open: { label: "Open", color: "bg-blue-500/20 text-blue-400", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400", icon: Play },
  waiting: { label: "Waiting", color: "bg-purple-500/20 text-purple-400", icon: Pause },
  resolved: { label: "Resolved", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-gray-500/20 text-gray-400", icon: CheckCircle }
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-500/20 text-gray-400", icon: ArrowDown },
  medium: { label: "Medium", color: "bg-blue-500/20 text-blue-400", icon: Minus },
  high: { label: "High", color: "bg-orange-500/20 text-orange-400", icon: ArrowUp },
  urgent: { label: "Urgent", color: "bg-red-500/20 text-red-400", icon: AlertTriangle }
};

const categoryIcons: Record<string, React.ElementType> = {
  "Hardware": Monitor,
  "Software": Zap,
  "Network": Wifi,
  "Account": User,
  "Email": MessageSquare,
  "Security": Shield,
  "Database": Database,
  "Website": Monitor,
  "Other": HelpCircle
};

export default function SupportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as SupportTicket["priority"]
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = selectedCategory === "All Categories" || ticket.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || ticket.priority === selectedPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const ticket: SupportTicket = {
        id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: "open",
        requester: user?.email?.split('@')[0] || "Unknown User",
        requester_email: user?.email || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: [],
        comments: []
      };

      setTickets([ticket, ...tickets]);
      toast.success("Support ticket created successfully!");
      
      setNewTicket({
        title: "",
        description: "",
        category: "",
        priority: "medium"
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setIsCreating(false);
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    avgResolutionTime: "2.5 hours"
  };

  return (
    <PageLayout 
      title="Support & Tickets" 
      subtitle="IT support ticket management system"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ticket size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tickets</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <AlertCircle size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Open</p>
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
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgResolutionTime}</p>
                <p className="text-xs text-muted-foreground">Avg Resolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              <option value="all">All Priority</option>
              {priorities.slice(1).map(priority => (
                <option key={priority} value={priority}>
                  {priorityConfig[priority as keyof typeof priorityConfig].label}
                </option>
              ))}
            </select>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                <Plus size={18} />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the issue, steps to reproduce, error messages, etc."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
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
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTicket.priority} onValueChange={(value: SupportTicket["priority"]) => setNewTicket(prev => ({ ...prev, priority: value }))}>
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
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateTicket} 
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
                        Create Ticket
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

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket, index) => (
            <TicketCard key={ticket.id} ticket={ticket} delay={index * 100} />
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-display mb-2">No Tickets Found</h3>
            <p className="text-muted-foreground">No support tickets match your current filters.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function TicketCard({ ticket, delay }: { ticket: SupportTicket; delay: number }) {
  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;
  const CategoryIcon = categoryIcons[ticket.category] || HelpCircle;

  const timeAgo = new Date(Date.now() - new Date(ticket.created_at).getTime()).getHours();

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CategoryIcon size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              <span className="text-sm text-muted-foreground font-mono">#{ticket.id}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{ticket.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User size={14} />
                {ticket.requester}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {timeAgo}h ago
              </span>
              {ticket.assigned_to && (
                <span className="flex items-center gap-1">
                  <User size={14} />
                  Assigned to {ticket.assigned_to}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", status.color)}>
            <StatusIcon size={12} />
            {status.label}
          </span>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", priority.color)}>
            <PriorityIcon size={12} />
            {priority.label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-secondary/50 text-secondary rounded">
            {ticket.category}
          </span>
          {ticket.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {ticket.comments.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageSquare size={12} />
              {ticket.comments.length}
            </span>
          )}
          <Button size="sm" variant="outline" className="border-border/50 hover:border-primary">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}