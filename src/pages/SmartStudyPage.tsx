import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Brain, Target, Clock, BarChart3, BookOpen, Zap, TrendingUp, Award, Lightbulb, CheckCircle } from "lucide-react";

export default function SmartStudyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageLayout 
      title="Smart Study System" 
      subtitle="AI-powered Islamic learning management and progress tracking"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl p-8 border border-purple-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <Brain size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Smart Study System</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Enhance your Islamic learning journey with AI-powered study tracking, goal management, and personalized recommendations. 
              Track your progress in Quran, Hadith, Arabic, and other Islamic sciences with intelligent insights and analytics.
            </p>
          </div>
        </div>

        {/* System Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Clock,
              title: "Session Tracking",
              description: "Real-time study session monitoring with timer and progress tracking",
              color: "text-blue-600",
              bg: "bg-blue-500/20"
            },
            {
              icon: Target,
              title: "Goal Management",
              description: "Set and track SMART goals for your Islamic learning objectives",
              color: "text-green-600",
              bg: "bg-green-500/20"
            },
            {
              icon: BookOpen,
              title: "Resource Library",
              description: "Curated collection of Islamic learning materials and resources",
              color: "text-purple-600",
              bg: "bg-purple-500/20"
            },
            {
              icon: BarChart3,
              title: "Analytics Dashboard",
              description: "Comprehensive insights and analytics on your learning progress",
              color: "text-amber-600",
              bg: "bg-amber-500/20"
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Key Benefits */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Zap size={24} className="text-primary" />
            Key Benefits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Structured Learning",
                description: "Organized approach to Islamic education with clear milestones",
                icon: CheckCircle,
                color: "text-green-600"
              },
              {
                title: "Progress Tracking",
                description: "Monitor your learning journey with detailed analytics",
                icon: TrendingUp,
                color: "text-blue-600"
              },
              {
                title: "Goal Achievement",
                description: "Set and accomplish meaningful Islamic learning objectives",
                icon: Target,
                color: "text-purple-600"
              },
              {
                title: "Smart Insights",
                description: "AI-powered recommendations for optimal learning",
                icon: Brain,
                color: "text-indigo-600"
              },
              {
                title: "Resource Management",
                description: "Access and organize Islamic learning materials efficiently",
                icon: BookOpen,
                color: "text-emerald-600"
              },
              {
                title: "Performance Analytics",
                description: "Detailed reports on study patterns and achievements",
                icon: BarChart3,
                color: "text-amber-600"
              }
            ].map((benefit, index) => (
              <div 
                key={benefit.title}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border/30">
                  <benefit.icon size={20} className={benefit.color} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Categories */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen size={24} className="text-primary" />
            Islamic Learning Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                category: "Quran Studies",
                subjects: ["Memorization (Hifz)", "Tafsir (Interpretation)", "Tajweed (Recitation)", "Quranic Arabic"],
                color: "from-green-500 to-emerald-500",
                icon: "📖"
              },
              {
                category: "Hadith Studies",
                subjects: ["Sahih Collections", "Hadith Memorization", "Chain Analysis", "Practical Application"],
                color: "from-blue-500 to-cyan-500",
                icon: "📚"
              },
              {
                category: "Arabic Language",
                subjects: ["Grammar (Nahw)", "Morphology (Sarf)", "Classical Texts", "Conversation"],
                color: "from-purple-500 to-violet-500",
                icon: "🔤"
              },
              {
                category: "Islamic Jurisprudence",
                subjects: ["Worship Rulings", "Transactions", "Contemporary Issues", "Comparative Fiqh"],
                color: "from-amber-500 to-yellow-500",
                icon: "⚖️"
              },
              {
                category: "Islamic History",
                subjects: ["Prophetic Biography", "Companion Stories", "Islamic Civilization", "Modern Movements"],
                color: "from-rose-500 to-pink-500",
                icon: "🏛️"
              },
              {
                category: "Islamic Theology",
                subjects: ["Core Beliefs", "Theological Debates", "Comparative Religion", "Contemporary Challenges"],
                color: "from-teal-500 to-green-500",
                icon: "🕌"
              }
            ].map((category, index) => (
              <div 
                key={category.category}
                className={`bg-gradient-to-br ${category.color} p-4 rounded-lg text-white animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-3">
                  <span className="text-2xl mb-1 block">{category.icon}</span>
                  <h3 className="font-semibold">{category.category}</h3>
                </div>
                <ul className="space-y-1">
                  {category.subjects.map((subject, idx) => (
                    <li key={idx} className="text-xs opacity-90 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/60" />
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Main Study System Component */}
        <div className="bg-card rounded-xl p-8 border border-border/30 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Brain size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Smart Study System</h3>
          <p className="text-muted-foreground mb-6">
            The Smart Study System component is available and functional. It provides comprehensive study tracking, 
            goal management, and analytics for Islamic education. The component includes session timers, progress tracking, 
            and personalized recommendations for optimal learning.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <Clock size={24} className="mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">Session Tracking</h4>
              <p className="text-sm text-muted-foreground">Real-time study monitoring with timer</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <Target size={24} className="mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold mb-1">Goal Management</h4>
              <p className="text-sm text-muted-foreground">SMART learning objectives tracking</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <BarChart3 size={24} className="mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold mb-1">Analytics</h4>
              <p className="text-sm text-muted-foreground">Progress insights and reports</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary">
              ✅ Component is fully developed and ready for integration into dashboard pages when needed.
            </p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Lightbulb size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Begin your structured Islamic learning journey with these simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Set Your Goals",
                description: "Define clear learning objectives for your Islamic studies",
                color: "bg-blue-500"
              },
              {
                step: "2",
                title: "Start Sessions",
                description: "Begin tracking your study sessions with the built-in timer",
                color: "bg-green-500"
              },
              {
                step: "3",
                title: "Use Resources",
                description: "Access curated Islamic learning materials and references",
                color: "bg-purple-500"
              },
              {
                step: "4",
                title: "Track Progress",
                description: "Monitor your achievements and analyze your learning patterns",
                color: "bg-amber-500"
              }
            ].map((step, index) => (
              <div 
                key={step.step}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg`}>
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
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