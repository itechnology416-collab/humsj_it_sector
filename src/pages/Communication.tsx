import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Bell, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Calendar,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "announcement" | "email" | "sms" | "notification";
  title: string;
  content: string;
  recipients: string;
  recipientCount: number;
  sentAt: string;
  status: "sent" | "scheduled" | "draft" | "failed";
  sender: string;
  scheduledFor?: string;
}

export default function CommunicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({
    type: "announcement" as Message["type"],
    title: "",
    content: "",
    recipients: "all",
    scheduledFor: ""
  });
  const [isSending, setIsSending] = useState(false);

  const recipientOptions = [
    { value: "all", label: "All Members", count: 234 },
    { value: "active", label: "Active Members", count: 198 },
    { value: "coordinators", label: "Coordinators", count: 25 },
    { value: "academic_sector", label: "Academic Sector", count: 45 },
    { value: "education_sector", label: "Education Sector", count: 38 },
    { value: "new_members", label: "New Members", count: 12 }
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Mock data - in production, this would fetch from Supabase
      const mockMessages: Message[] = [
        {
          id: "1",
          type: "announcement",
          title: "Ramadan Preparation Notice",
          content: "Assalamu Alaikum, dear members. As we approach the blessed month of Ramadan, we invite all members to join our preparation meeting this Thursday...",
          recipients: "All Members",
          recipientCount: 234,
          sentAt: "2024-02-15T10:30:00",
          status: "sent",
          sender: "Media Team"
        },
        {
          id: "2",
          type: "email",
          title: "Weekly Halaqa Schedule Update",
          content: "Dear brothers and sisters, please note that this week's Tafsir halaqa has been moved to Saturday at 4 PM...",
          recipients: "Active Members",
          recipientCount: 198,
          sentAt: "2024-02-14T14:00:00",
          status: "sent",
          sender: "Education Sector"
        },
        {
          id: "3",
          type: "notification",
          title: "IT Workshop Registration Open",
          content: "Registration is now open for the Web Development workshop. Limited seats available!",
          recipients: "IT Interest Group",
          recipientCount: 45,
          sentAt: "2024-02-16T09:00:00",
          status: "scheduled",
          sender: "Academic Sector",
          scheduledFor: "2024-02-16T09:00:00"
        },
        {
          id: "4",
          type: "sms",
          title: "Friday Prayer Reminder",
          content: "Reminder: Jumu'ah prayer at 12:30 PM. Topic: Patience in Trials",
          recipients: "All Members",
          recipientCount: 234,
          sentAt: "2024-02-16T08:00:00",
          status: "scheduled",
          sender: "System",
          scheduledFor: "2024-02-16T08:00:00"
        },
        {
          id: "5",
          type: "announcement",
          title: "New Member Welcome",
          content: "Welcome message draft for new members joining this semester...",
          recipients: "New Members (Feb 2024)",
          recipientCount: 12,
          sentAt: "",
          status: "draft",
          sender: "Admin"
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!composeForm.title || !composeForm.content) {
      toast.error("Please fill in title and content");
      return;
    }

    setIsSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedRecipient = recipientOptions.find(r => r.value === composeForm.recipients);
      const isScheduled = composeForm.scheduledFor && new Date(composeForm.scheduledFor) > new Date();
      
      const newMessage: Message = {
        id: Date.now().toString(),
        type: composeForm.type,
        title: composeForm.title,
        content: composeForm.content,
        recipients: selectedRecipient?.label || "Unknown",
        recipientCount: selectedRecipient?.count || 0,
        sentAt: isScheduled ? "" : new Date().toISOString(),
        status: isScheduled ? "scheduled" : "sent",
        sender: profile?.full_name || "Unknown",
        scheduledFor: composeForm.scheduledFor || undefined
      };

      setMessages(prev => [newMessage, ...prev]);
      
      // Simulate actual sending process
      if (!isScheduled) {
        toast.success(`Message sent successfully to ${selectedRecipient?.count} recipients!`);
      } else {
        toast.success(`Message scheduled successfully for ${new Date(composeForm.scheduledFor).toLocaleString()}!`);
      }
      
      // Reset form
      setComposeForm({
        type: "announcement",
        title: "",
        content: "",
        recipients: "all",
        scheduledFor: ""
      });
      setIsComposeOpen(false);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesType = selectedType === "all" || msg.type === selectedType;
    const matchesSearch = msg.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = {
    sent: messages.filter(m => m.status === "sent").length,
    scheduled: messages.filter(m => m.status === "scheduled").length,
    drafts: messages.filter(m => m.status === "draft").length,
    totalRecipients: messages.filter(m => m.status === "sent").reduce((acc, m) => acc + m.recipientCount, 0),
  };

  const typeConfig = {
    announcement: { icon: Bell, color: "bg-primary/10 text-primary" },
    email: { icon: Mail, color: "bg-secondary/10 text-secondary" },
    sms: { icon: MessageSquare, color: "bg-accent/10 text-accent" },
    notification: { icon: Bell, color: "bg-emerald-glow/10 text-emerald-glow" },
  };

  const statusConfig = {
    sent: { label: "Sent", color: "text-primary", icon: CheckCircle },
    scheduled: { label: "Scheduled", color: "text-secondary", icon: Clock },
    draft: { label: "Draft", color: "text-muted-foreground", icon: AlertCircle },
    failed: { label: "Failed", color: "text-destructive", icon: AlertCircle },
  };

  return (
    <PageLayout 
      title="Communication" 
      subtitle="Send messages and announcements"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* HUMSJ Information Channels */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h2 className="text-xl font-display tracking-wide mb-4">HUMSJ Information Channels</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Connect with different HUMSJ sectors through our official Telegram channels for specialized information and updates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Academic Sector",
                description: "Academic programs & scholarships",
                url: "https://t.me/HUMSJ_accdamic",
                icon: "🎓",
                color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
              },
              {
                name: "Academic Sector",
                description: "Educational support & academic programs",
                url: "https://t.me/Information_sector_of_Humsj",
                icon: "💻",
                color: "bg-green-500/10 text-green-600 border-green-500/20"
              },
              {
                name: "Da'ewa (Amharic)",
                description: "Islamic guidance in Amharic",
                url: "https://t.me/HRUMUSLIMSTUDENTSJEMEA",
                icon: "📚",
                color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
              },
              {
                name: "Da'ewa (Afaan Oromoo)",
                description: "Islamic guidance in Afaan Oromoo",
                url: "https://t.me/HUMSJsectoroffajrulislam",
                icon: "📖",
                color: "bg-orange-500/10 text-orange-600 border-orange-500/20"
              },
              {
                name: "External Affairs",
                description: "Partnerships & outreach programs",
                url: "https://t.me/+VMJzgG5c24djM2Rk",
                icon: "🤝",
                color: "bg-teal-500/10 text-teal-600 border-teal-500/20"
              },
              {
                name: "Comparative Religion",
                description: "Interfaith dialogue & religious studies",
                url: "https://t.me/HUMSJComparative",
                icon: "🕊️",
                color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
              },
              {
                name: "Financial Sector",
                description: "Beytal Maal financial services",
                url: "#",
                icon: "💰",
                color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                disabled: true
              }
            ].map((channel) => (
              <div
                key={channel.name}
                className={cn(
                  "relative p-4 rounded-lg border transition-all",
                  channel.disabled 
                    ? "opacity-50 cursor-not-allowed bg-muted/30" 
                    : "hover:scale-105 cursor-pointer",
                  channel.color
                )}
                onClick={() => !channel.disabled && window.open(channel.url, '_blank')}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl flex-shrink-0">
                    {channel.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {channel.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </div>
                  {!channel.disabled && (
                    <MessageSquare size={14} className="flex-shrink-0 opacity-70" />
                  )}
                </div>
                {channel.disabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <span className="text-xs text-muted-foreground">Contact for info</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Messages Sent" value={stats.sent} icon={CheckCircle} color="primary" />
          <StatCard label="Scheduled" value={stats.scheduled} icon={Clock} color="secondary" />
          <StatCard label="Drafts" value={stats.drafts} icon={AlertCircle} color="muted" />
          <StatCard label="Total Reached" value={stats.totalRecipients} icon={Users} color="accent" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
              />
            </div>
          </div>
          
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                <Plus size={18} />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Message Type</Label>
                    <Select value={composeForm.type} onValueChange={(value: Message["type"]) => setComposeForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="recipients">Recipients</Label>
                    <Select value={composeForm.recipients} onValueChange={(value) => setComposeForm(prev => ({ ...prev, recipients: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} ({option.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={composeForm.title}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter message title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={composeForm.content}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter message content"
                    rows={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={composeForm.scheduledFor}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to send immediately
                  </p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isSending}
                    className="flex-1"
                  >
                    {isSending ? "Sending..." : composeForm.scheduledFor ? "Schedule" : "Send Now"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsComposeOpen(false)}
                    disabled={isSending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {["all", "announcement", "email", "sms", "notification"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted shadow-soft"
              )}
            >
              {type === "all" ? "All Messages" : type}
            </button>
          ))}
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <MessageCard 
                key={message.id} 
                message={message} 
                delay={index * 50} 
                onDelete={handleDeleteMessage}
                typeConfig={typeConfig}
                statusConfig={statusConfig}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClasses[color as keyof typeof colorClasses])}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function MessageCard({ message, delay, onDelete, typeConfig, statusConfig }: { 
  message: Message; 
  delay: number; 
  onDelete: (id: string) => void;
  typeConfig: any;
  statusConfig: any;
}) {
  const type = typeConfig[message.type];
  const status = statusConfig[message.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  return (
    <div 
      className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-glow transition-all duration-300 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", type.color)}>
          <TypeIcon size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{message.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{message.content}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0", status.color)}>
                <StatusIcon size={12} />
                {status.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(message.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              {message.recipients} ({message.recipientCount})
            </span>
            <span className="flex items-center gap-1.5">
              <Send size={14} />
              {message.sender}
            </span>
            {message.sentAt && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {new Date(message.sentAt).toLocaleString()}
              </span>
            )}
            {message.scheduledFor && message.status === "scheduled" && (
              <span className="flex items-center gap-1.5 text-secondary">
                <Calendar size={14} />
                Scheduled: {new Date(message.scheduledFor).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
