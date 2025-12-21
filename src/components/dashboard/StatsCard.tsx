import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "primary" | "secondary" | "accent";
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon,
  variant = "default",
  delay = 0
}: StatsCardProps) {
  const variants = {
    default: "bg-card",
    primary: "gradient-primary text-primary-foreground",
    secondary: "gradient-gold text-foreground",
    accent: "bg-muted"
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    primary: "bg-primary-foreground/20 text-primary-foreground",
    secondary: "bg-foreground/10 text-foreground",
    accent: "bg-accent text-accent-foreground"
  };

  return (
    <div 
      className={cn(
        "rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0",
        variants[variant]
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className={cn(
            "text-sm font-medium",
            variant === "primary" || variant === "secondary" 
              ? "opacity-80" 
              : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-sm font-medium flex items-center gap-1",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "opacity-70"
            )}>
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconVariants[variant]
        )}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
