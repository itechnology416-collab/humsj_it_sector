import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { IslamicProgramsSchedule } from "@/components/islamic/IslamicProgramsSchedule";
import { BookOpen, Calendar, Clock, Users, Star, Sparkles } from "lucide-react";

export default function IslamicProgramsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageLayout 
      title="Islamic Programs Schedule" 
      subtitle="Comprehensive Islamic education programs and schedules"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <BookOpen size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Islamic Programs Schedule</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Join our comprehensive Islamic education programs designed to deepen your understanding of the Quran, 
              Hadith, and Islamic sciences. All programs are conducted by qualified scholars and instructors.
            </p>
          </div>
        </div>

        {/* Program Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Comprehensive Curriculum",
              description: "Structured learning covering Quran, Hadith, Fiqh, and Arabic",
              color: "text-emerald-600",
              bg: "bg-emerald-500/20"
            },
            {
              icon: Users,
              title: "Expert Instructors",
              description: "Learn from qualified scholars and experienced teachers",
              color: "text-blue-600",
              bg: "bg-blue-500/20"
            },
            {
              icon: Clock,
              title: "Flexible Timing",
              description: "Programs scheduled after prayer times for convenience",
              color: "text-purple-600",
              bg: "bg-purple-500/20"
            },
            {
              icon: Star,
              title: "Quality Education",
              description: "High-quality Islamic education with authentic sources",
              color: "text-amber-600",
              bg: "bg-amber-500/20"
            }
          ].map((benefit, index) => (
            <div 
              key={benefit.title}
              className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg ${benefit.bg} flex items-center justify-center mb-4`}>
                <benefit.icon size={24} className={benefit.color} />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Program Categories */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Calendar size={24} className="text-primary" />
            Program Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: "Quran Studies",
                programs: ["Tafsir Sessions", "Qirat Training", "Tilawa Practice"],
                color: "from-green-500 to-emerald-500",
                icon: "📖"
              },
              {
                category: "Arabic Language",
                programs: ["Grammar (Nahw)", "Morphology (Sarf)", "Classical Texts"],
                color: "from-blue-500 to-cyan-500",
                icon: "🔤"
              },
              {
                category: "Islamic Sciences",
                programs: ["Hadith Studies", "Fiqh Principles", "Aqeedah Basics"],
                color: "from-purple-500 to-violet-500",
                icon: "📚"
              },
              {
                category: "Specialized Programs",
                programs: ["Usul al-Qirat", "Classical Texts", "Advanced Studies"],
                color: "from-amber-500 to-yellow-500",
                icon: "⭐"
              },
              {
                category: "Community Programs",
                programs: ["Family Education", "Youth Programs", "Women's Classes"],
                color: "from-rose-500 to-pink-500",
                icon: "👥"
              },
              {
                category: "Seasonal Programs",
                programs: ["Ramadan Specials", "Hajj Preparation", "Islamic Events"],
                color: "from-teal-500 to-green-500",
                icon: "🌙"
              }
            ].map((category, index) => (
              <div 
                key={category.category}
                className={`bg-gradient-to-br ${category.color} p-6 rounded-xl text-white animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">{category.icon}</span>
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.programs.map((program, idx) => (
                    <li key={idx} className="text-sm opacity-90 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      {program}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Main Schedule Component */}
        <IslamicProgramsSchedule />

        {/* Registration Information */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Join Our Programs</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              All programs are open to community members. Registration is free, and materials are provided. 
              Join us in this blessed journey of Islamic learning and spiritual growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-card rounded-lg p-4 border border-border/30">
                <p className="text-sm font-medium mb-1">Registration</p>
                <p className="text-xs text-muted-foreground">Free for all members</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border/30">
                <p className="text-sm font-medium mb-1">Materials</p>
                <p className="text-xs text-muted-foreground">Provided by HUMSJ</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border/30">
                <p className="text-sm font-medium mb-1">Certificates</p>
                <p className="text-xs text-muted-foreground">Upon completion</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border/30">
                <p className="text-sm font-medium mb-1">Language</p>
                <p className="text-xs text-muted-foreground">Arabic, Amharic, Oromo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={20} className="text-primary" />
          </div>
          <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And say: My Lord, increase me in knowledge" - Quran 20:114
          </p>
        </div>
      </div>
    </PageLayout>
  );
}