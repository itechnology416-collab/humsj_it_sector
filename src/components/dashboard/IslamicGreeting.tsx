import { useEffect, useState } from "react";

export function IslamicGreeting() {
  const [greeting, setGreeting] = useState("");
  const [arabicGreeting, setArabicGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
      setArabicGreeting("صباح الخير");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
      setArabicGreeting("مساء النور");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
      setArabicGreeting("مساء الخير");
    } else {
      setGreeting("Good Night");
      setArabicGreeting("ليلة سعيدة");
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 shadow-glow animate-slide-up">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-islamic opacity-30" />
      
      {/* Content */}
      <div className="relative z-10">
        <p className="font-arabic text-2xl text-primary-foreground/80 mb-2">
          {arabicGreeting}
        </p>
        <h2 className="text-3xl font-bold text-primary-foreground mb-2">
          {greeting}, <span className="text-secondary">Ahmed</span>
        </h2>
        <p className="text-primary-foreground/80 max-w-lg">
          Welcome back to HUMSJ IT Management System. You have <span className="font-semibold text-secondary">5 pending tasks</span> and <span className="font-semibold text-secondary">3 new notifications</span> today.
        </p>
        
        {/* Daily Reminder */}
        <div className="mt-6 inline-flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-4 py-3">
          <span className="font-arabic text-lg">📿</span>
          <div>
            <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Daily Reminder</p>
            <p className="text-sm text-primary-foreground font-medium">
              "And whoever puts their trust in Allah, He will be enough for them." — Quran 65:3
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -right-5 -bottom-10 w-32 h-32 rounded-full bg-primary-foreground/10 blur-2xl" />
    </div>
  );
}
