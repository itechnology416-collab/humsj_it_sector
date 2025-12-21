import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2,
  Calendar,
  Users,
  MessageSquare,
  AlertCircle,
  Settings,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/layout/PageLayout";

interface Notification {
  id: string;
  type: "event" | "member" | "message" | "system" | "alert";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "member",
    title: "New Member Registration",
    description: "Fatima Ahmed from College of Computing has joined HUMSJ",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "event",
    title: "Event Reminder",
    description: "Friday Jumu'ah Prayer starts in 2 hours",
    time: "30 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "New Feedback Received",
    description: "A member submitted feedback about the recent workshop",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    description: "New features have been added to the dashboard",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "alert",
    title: "Action Required",
    description: "5 pending member registrations need approval",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "event",
    title: "Event Created",
    description: "Ramadan Preparation Meeting has been scheduled for next Thursday",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "7",
    type: "member",
    title: "Profile Update",
    description: "12 members have updated their profile information",
    time: "Yesterday",
    read: true,
  },
  {
    id: "8",
    type: "message",
    title: "Announcement Published",
    description: "Weekly newsletter has been sent to 234 members",
    time: "Yesterday",
    read: true,
  },
];

const typeConfig = {
  event: { icon: Calendar, color: "bg-primary/20 text-primary" },
  member: { icon: Users, color: "bg-blue-500/20 text-blue-400" },
  message: { icon: MessageSquare, color: "bg-purple-500/20 text-purple-400" },
  system: { icon: Settings, color: "bg-muted text-muted-foreground" },
  alert: { icon: AlertCircle, color: "bg-amber-500/20 text-amber-400" },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notificationList.filter(n => !n.read).length;
  
  const filteredNotifications = notificationList.filter(n => 
    filter === "all" || !n.read
  );

  const markAllAsRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotificationList(notificationList.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotificationList(notificationList.filter(n => n.id !== id));
  };

  return (
    <PageLayout 
      title="Notifications" 
      subtitle="Stay updated with the latest activities"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-glow">
              <Bell size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display tracking-wide flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-md animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">{notificationList.length} total notifications</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="border-border/50 hover:border-primary gap-2"
          >
            <CheckCheck size={16} />
            Mark all read
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              filter === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-red"
                : "bg-card text-muted-foreground border-border/30 hover:border-primary/50"
            )}
          >
            All ({notificationList.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              filter === "unread"
                ? "bg-primary text-primary-foreground border-primary shadow-red"
                : "bg-card text-muted-foreground border-border/30 hover:border-primary/50"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <div 
                key={notification.id}
                className={cn(
                  "group bg-card rounded-xl p-4 border transition-all duration-300 animate-slide-up opacity-0 hover:-translate-y-0.5 cursor-pointer",
                  !notification.read 
                    ? "border-l-4 border-l-primary border-primary/30 bg-primary/5 hover:bg-primary/10" 
                    : "border-border/30 hover:border-primary/30"
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={cn(
                          "font-medium group-hover:text-primary transition-colors",
                          !notification.read && "text-primary"
                        )}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-muted-foreground hover:text-primary" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border/30">
            <div className="w-16 h-16 mx-auto rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Sparkles size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No notifications to show</p>
            <p className="text-sm text-muted-foreground/70 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}