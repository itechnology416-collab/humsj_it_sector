import { User, Calendar, MessageSquare, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "member" | "event" | "message" | "content";
  title: string;
  description: string;
  time: string;
  user?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "member",
    title: "New Member Registration",
    description: "Fatima Ahmed joined from College of Computing",
    time: "5 min ago",
    user: "System"
  },
  {
    id: "2",
    type: "event",
    title: "Friday Program Updated",
    description: "Topic changed to 'Patience in Trials'",
    time: "1 hour ago",
    user: "Imam Yusuf"
  },
  {
    id: "3",
    type: "message",
    title: "Announcement Sent",
    description: "Ramadan preparation notice sent to 234 members",
    time: "2 hours ago",
    user: "Media Team"
  },
  {
    id: "4",
    type: "content",
    title: "Khutba Uploaded",
    description: "Last Friday's khutba now available in library",
    time: "3 hours ago",
    user: "IT Admin"
  },
  {
    id: "5",
    type: "member",
    title: "Profile Updated",
    description: "15 members updated their academic information",
    time: "5 hours ago",
    user: "System"
  },
];

const typeConfig = {
  member: { icon: User, color: "text-primary bg-primary/10" },
  event: { icon: Calendar, color: "text-secondary bg-secondary/10" },
  message: { icon: MessageSquare, color: "text-emerald-glow bg-emerald-glow/10" },
  content: { icon: FileText, color: "text-accent bg-accent/10" },
};

export function RecentActivity() {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 animate-slide-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Recent Activity</h3>
        <button className="text-sm text-primary font-medium hover:underline">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, color } = typeConfig[activity.type];
          return (
            <div 
              key={activity.id}
              className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  {activity.user && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
