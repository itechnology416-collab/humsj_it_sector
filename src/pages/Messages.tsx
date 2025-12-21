import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreVertical,
  Paperclip,
  Clock,
  CheckCircle,
  Circle,
  Users,
  Shield,
  AlertCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const messages = [
  {
    id: 1,
    from: "IT Committee",
    fromRole: "admin",
    subject: "System Maintenance Scheduled",
    preview: "We will be performing system maintenance this weekend...",
    content: "Dear Members,\n\nWe will be performing system maintenance this weekend from 2 AM to 6 AM on Saturday. During this time, some services may be temporarily unavailable.\n\nThank you for your patience.\n\nIT Committee",
    timestamp: "2024-12-21T10:30:00Z",
    read: false,
    starred: false,
    priority: "high",
    category: "system"
  },
  {
    id: 2,
    from: "Sheikh Abdullah",
    fromRole: "leader",
    subject: "Friday Khutbah Topic",
    preview: "This week's khutbah will focus on patience and perseverance...",
    content: "Assalamu Alaikum,\n\nThis week's khutbah will focus on patience and perseverance in times of difficulty. Please join us for the congregational prayer.\n\nBarakallahu feekum,\nSheikh Abdullah",
    timestamp: "2024-12-20T15:45:00Z",
    read: true,
    starred: true,
    priority: "normal",
    category: "religious"
  },
  {
    id: 3,
    from: "Social Committee",
    fromRole: "committee",
    subject: "Community Iftar Registration",
    preview: "Registration is now open for the community iftar event...",
    content: "Assalamu Alaikum Brothers and Sisters,\n\nRegistration is now open for the community iftar event scheduled for next Friday. Please register by Wednesday to help us with preparations.\n\nJazakallahu khair,\nSocial Committee",
    timestamp: "2024-12-19T09:20:00Z",
    read: true,
    starred: false,
    priority: "normal",
    category: "event"
  },
  {
    id: 4,
    from: "Support Team",
    fromRole: "support",
    subject: "Your Support Ticket #1234",
    preview: "Thank you for contacting support. Your issue has been resolved...",
    content: "Dear Member,\n\nThank you for contacting support. Your issue regarding login problems has been resolved. You should now be able to access your account normally.\n\nIf you continue to experience issues, please don't hesitate to contact us.\n\nBest regards,\nSupport Team",
    timestamp: "2024-12-18T14:10:00Z",
    read: false,
    starred: false,
    priority: "normal",
    category: "support"
  }
];

const conversations = [
  {
    id: 1,
    participants: ["Ahmed Hassan", "Omar Ali"],
    lastMessage: "Thanks for the help with the project!",
    timestamp: "2024-12-21T16:30:00Z",
    unread: 2,
    type: "direct"
  },
  {
    id: 2,
    participants: ["IT Committee Group"],
    lastMessage: "Meeting scheduled for tomorrow at 3 PM",
    timestamp: "2024-12-21T14:20:00Z",
    unread: 0,
    type: "group"
  }
];

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCompose, setShowCompose] = useState(false);
  const [replyText, setReplyText] = useState("");

  const tabs = [
    { id: "inbox", label: "Inbox", icon: MessageSquare, count: messages.filter(m => !m.read).length },
    { id: "conversations", label: "Conversations", icon: Users, count: conversations.reduce((sum, c) => sum + c.unread, 0) },
    { id: "starred", label: "Starred", icon: Star, count: messages.filter(m => m.starred).length },
    { id: "archived", label: "Archived", icon: Archive, count: 0 }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-400";
      case "leader": return "text-purple-400";
      case "committee": return "text-blue-400";
      case "support": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Shield;
      case "leader": return Star;
      case "committee": return Users;
      case "support": return MessageSquare;
      default: return Circle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "normal": return "text-muted-foreground";
      case "low": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || message.category === filterCategory;
    const matchesTab = activeTab === "inbox" || 
                      (activeTab === "starred" && message.starred) ||
                      (activeTab === "archived" && false); // No archived messages in demo
    return matchesSearch && matchesCategory && matchesTab;
  });

  const selectedMessageData = selectedMessage ? messages.find(m => m.id === selectedMessage) : null;

  return (
    <PageLayout 
      title="Messages & Inbox" 
      subtitle="Communicate with leaders, committees, and support"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCompose(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus size={16} />
              Compose
            </Button>
            <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80 bg-secondary/50 border-border/50"
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
              <tab.icon size={16} />
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-2">
            {activeTab === "conversations" ? (
              // Conversations View
              conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className="bg-card rounded-lg p-4 border border-border/30 hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        {conversation.type === "group" ? (
                          <Users size={16} className="text-primary" />
                        ) : (
                          <MessageSquare size={16} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          {conversation.participants.join(", ")}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge variant="default" className="text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conversation.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              // Messages View
              filteredMessages.map((message) => {
                const RoleIcon = getRoleIcon(message.fromRole);
                return (
                  <div 
                    key={message.id}
                    onClick={() => setSelectedMessage(message.id)}
                    className={cn(
                      "bg-card rounded-lg p-4 border transition-all cursor-pointer",
                      selectedMessage === message.id 
                        ? "border-primary/50 bg-primary/5" 
                        : "border-border/30 hover:border-primary/50",
                      !message.read && "bg-primary/5 border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <RoleIcon size={16} className={getRoleColor(message.fromRole)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{message.from}</h4>
                          <p className="text-xs text-muted-foreground truncate">{message.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {message.priority === "high" && (
                          <AlertCircle size={14} className="text-red-400" />
                        )}
                        {message.starred && (
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                        )}
                        {!message.read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {message.preview}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs capitalize">
                        {message.category}
                      </Badge>
                      <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}

            {filteredMessages.length === 0 && activeTab !== "conversations" && (
              <div className="text-center py-20">
                <MessageSquare size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-display mb-2">No Messages</h3>
                <p className="text-muted-foreground">No messages found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessageData ? (
              <div className="bg-card rounded-xl border border-border/30">
                {/* Message Header */}
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-display tracking-wide mb-2">
                        {selectedMessageData.subject}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>From: {selectedMessageData.from}</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedMessageData.fromRole}
                        </Badge>
                        {selectedMessageData.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-border/50">
                        <Star size={14} className={selectedMessageData.starred ? "fill-amber-400 text-amber-400" : ""} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50">
                        <Archive size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50">
                        <Trash2 size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50">
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedMessageData.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {selectedMessageData.content}
                    </pre>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="p-6 border-t border-border/30">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      className="bg-secondary/50 border-border/50"
                    />
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border/50 gap-1">
                          <Paperclip size={14} />
                          Attach
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border/50 gap-1">
                          <Reply size={14} />
                          Reply
                        </Button>
                        <Button size="sm" variant="outline" className="border-border/50 gap-1">
                          <Forward size={14} />
                          Forward
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                          <Send size={14} />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border/30 p-20 text-center">
                <MessageSquare size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-display mb-2">Select a Message</h3>
                <p className="text-muted-foreground">Choose a message from the list to view its content.</p>
              </div>
            )}
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border/30 w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-border/30">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-display">Compose Message</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowCompose(false)}
                    className="border-border/50"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <Input placeholder="Select recipient..." className="bg-secondary/50 border-border/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="Message subject..." className="bg-secondary/50 border-border/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Type your message..." 
                    rows={8}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-border/30 flex justify-between">
                <Button size="sm" variant="outline" className="border-border/50 gap-1">
                  <Paperclip size={14} />
                  Attach File
                </Button>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowCompose(false)}
                    className="border-border/50"
                  >
                    Cancel
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                    <Send size={14} />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}