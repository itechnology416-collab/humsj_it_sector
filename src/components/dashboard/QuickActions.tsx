import { UserPlus, CalendarPlus, Send, Upload, FileCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
}

const actions: QuickAction[] = [
  { 
    icon: UserPlus, 
    label: "Add Member", 
    description: "Register new student",
    color: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
  },
  { 
    icon: CalendarPlus, 
    label: "Create Event", 
    description: "Schedule activity",
    color: "bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground"
  },
  { 
    icon: Send, 
    label: "Send Notice", 
    description: "Broadcast message",
    color: "bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
  },
  { 
    icon: Upload, 
    label: "Upload Content", 
    description: "Add resources",
    color: "bg-emerald-glow/10 text-emerald-glow hover:bg-primary hover:text-primary-foreground"
  },
  { 
    icon: FileCheck, 
    label: "View Reports", 
    description: "Analytics & stats",
    color: "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
  },
  { 
    icon: Settings, 
    label: "IT Services", 
    description: "Manage requests",
    color: "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
  },
];

export function QuickActions() {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 group",
                action.color
              )}
            >
              <Icon size={24} className="transition-transform group-hover:scale-110" />
              <span className="font-semibold text-sm">{action.label}</span>
              <span className="text-xs opacity-70">{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
