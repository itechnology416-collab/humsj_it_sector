import { useEffect, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  Shield, 
  Loader2,
  BookOpen,
  MessageSquare,
  Zap,
  Play,
  Star,
  CheckCircle,
  Award,
  Globe,
  Smartphone,
  Database,
  Monitor,
  Lock,
  TrendingUp,
  Clock,
  Heart,
  Target,
  Lightbulb,
  Rocket,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Quote,
  Sparkles,
  Code,
  Server,
  Cloud,
  Wifi,
  Tablet,
  HelpCircle
} from "lucide-react";
import NetflixScene from "@/components/3d/NetflixScene";
import Enhanced3DScene from "@/components/3d/Enhanced3DScene";
import { EnhancedHeader } from "@/components/layout/EnhancedHeader";
import { 
  TimelineOfIslamicCivilization, 
  LifeOfProphetMuhammad, 
  SahabaHeroesOfFaith, 
  IslamInEthiopia 
} from "@/components/islamic/IslamicSections";

export default function Index() {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, isAdmin, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionBottom = sectionTop + (section as HTMLElement).offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading HUMSJ INFORMATION TECHNOLOGY SECTOR WEB...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Users,
      title: "Advanced Member Management",
      description: "Complete member lifecycle management with role-based permissions, automated onboarding, and detailed member profiles including academic information, contact details, and participation history.",
      details: ["Student registration & verification", "Role assignment & permissions", "Attendance tracking", "Member analytics & insights"]
    },
    {
      icon: Calendar,
      title: "Comprehensive Event System",
      description: "Full-featured event management supporting Friday prayers, educational sessions, workshops, and special programs with registration, capacity management, and automated reminders.",
      details: ["Event creation & scheduling", "Registration management", "Capacity & waitlist handling", "Automated notifications"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control, data encryption, audit trails, and compliance with university data protection policies.",
      details: ["Multi-factor authentication", "Role-based permissions", "Data encryption", "Audit logging"]
    },
    {
      icon: BookOpen,
      title: "Islamic Knowledge Hub",
      description: "Comprehensive digital library featuring Khutba recordings, Quran recitations, Islamic literature, educational materials, and scholarly resources.",
      details: ["Digital Quran library", "Khutba archive", "Educational resources", "Scholarly articles"]
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Communication",
      description: "Integrated communication platform supporting announcements, direct messaging, email campaigns, SMS notifications, and social media integration.",
      details: ["Announcement system", "Direct messaging", "Email campaigns", "SMS notifications"]
    },
    {
      icon: Zap,
      title: "Real-time Analytics & Insights",
      description: "Advanced analytics dashboard providing insights into member engagement, event attendance, content consumption, and organizational growth metrics.",
      details: ["Member analytics", "Event insights", "Engagement metrics", "Growth tracking"]
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "IT Sector Head",
      image: "/placeholder.svg",
      quote: "This system has revolutionized how we manage our Jama'a. The efficiency gains are remarkable, and member engagement has increased by 300%."
    },
    {
      name: "Fatima Ali",
      role: "Education Coordinator",
      image: "/placeholder.svg",
      quote: "The content management system makes it so easy to share Islamic resources. Our members now have access to a wealth of knowledge at their fingertips."
    },
    {
      name: "Mohammed Ibrahim",
      role: "Da'wa Coordinator",
      image: "/placeholder.svg",
      quote: "The communication features have transformed how we reach our members. We can now send targeted messages and track engagement effectively."
    }
  ];

  const techStack = [
    { name: "React 18", icon: Code, description: "Modern frontend framework" },
    { name: "TypeScript", icon: Code, description: "Type-safe development" },
    { name: "Supabase", icon: Database, description: "Backend as a service" },
    { name: "Tailwind CSS", icon: Monitor, description: "Utility-first styling" },
    { name: "Three.js", icon: Globe, description: "3D graphics & animations" },
    { name: "Vite", icon: Zap, description: "Lightning-fast build tool" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <NetflixScene />
        <Enhanced3DScene />
      </Suspense>

      {/* Enhanced Header */}
      <EnhancedHeader isLandingPage={true} />

      {/* Section Progress Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === index ? 'bg-primary shadow-red' : 'bg-border/50'
            }`}
          />
        ))}
      </div>

      {/* Hero Section - Light of Islam */}
      <section className="section min-h-screen flex items-center justify-center relative pt-20">
        {/* Mosque Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mosque-background mosque-silhouette"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='mosque-gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23059669;stop-opacity:0.4'/%3E%3Cstop offset='50%25' style='stop-color:%230891b2;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%230284c7;stop-opacity:0.2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='url(%23mosque-gradient)'%3E%3C!-- Main Mosque Structure --%3E%3Crect x='200' y='300' width='400' height='200' rx='10'/%3E%3C!-- Central Dome --%3E%3Cellipse cx='400' cy='280' rx='80' ry='60'/%3E%3C!-- Side Domes --%3E%3Cellipse cx='280' cy='300' rx='40' ry='30'/%3E%3Cellipse cx='520' cy='300' rx='40' ry='30'/%3E%3C!-- Minarets --%3E%3Crect x='150' y='150' width='30' height='200' rx='15'/%3E%3Crect x='620' y='150' width='30' height='200' rx='15'/%3E%3C!-- Minaret Tops --%3E%3Cellipse cx='165' cy='140' rx='20' ry='15'/%3E%3Cellipse cx='635' cy='140' rx='20' ry='15'/%3E%3C!-- Crescent Moons --%3E%3Cpath d='M 160 125 Q 170 115 165 135 Q 155 125 160 125' /%3E%3Cpath d='M 630 125 Q 640 115 635 135 Q 625 125 630 125' /%3E%3Cpath d='M 395 220 Q 405 210 400 230 Q 390 220 395 220' /%3E%3C!-- Arched Windows --%3E%3Cpath d='M 320 350 Q 320 330 340 330 Q 360 330 360 350 L 360 400 L 320 400 Z' fill='%23000000' fill-opacity='0.2'/%3E%3Cpath d='M 440 350 Q 440 330 460 330 Q 480 330 480 350 L 480 400 L 440 400 Z' fill='%23000000' fill-opacity='0.2'/%3E%3C!-- Main Entrance --%3E%3Cpath d='M 370 400 Q 370 370 400 370 Q 430 370 430 400 L 430 500 L 370 500 Z' fill='%23000000' fill-opacity='0.3'/%3E%3C!-- Islamic Geometric Patterns --%3E%3Cg opacity='0.3'%3E%3Cpath d='M 250 450 L 270 430 L 290 450 L 270 470 Z' fill='%23059669'/%3E%3Cpath d='M 510 450 L 530 430 L 550 450 L 530 470 Z' fill='%230891b2'/%3E%3Cpath d='M 380 320 L 400 300 L 420 320 L 400 340 Z' fill='%230284c7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none" />
        
        {/* Islamic Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-secondary rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-accent rounded-full animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-in">
            {/* Quranic Verse */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-2 mb-6">
                <Sparkles size={16} className="text-green-500 animate-pulse" />
                <span className="text-sm text-green-600 font-medium">Light of Islam</span>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/30 mb-8 max-w-4xl mx-auto">
                <p className="text-2xl md:text-3xl font-arabic text-primary mb-4 leading-relaxed" dir="rtl">
                  وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
                </p>
                <p className="text-lg text-muted-foreground italic mb-2">
                  "And We have not sent you, [O Muhammad], except as a mercy to the worlds"
                </p>
                <p className="text-sm text-muted-foreground">- Quran 21:107</p>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-8">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Revolutionizing Islamic Student Management</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display tracking-wide mb-8 leading-tight">
              <span className="block text-foreground">HARAMAYA UNIVERSITY</span>
              <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent animate-gradient-x">
                MUSLIM STUDENT JAMA'A
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              A comprehensive, modern IT Management System designed to digitize operations, 
              enhance member engagement, streamline communication, and strengthen our Islamic community 
              through technology and innovation - guided by the principles of Islam.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-red text-lg px-12 py-4 h-auto group hover-lift hover-glow hover-gradient perspective-1000 preserve-3d"
              >
                <Play size={24} className="fill-current group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                Join Our Community
                <ArrowRight size={20} className="group-hover:translate-x-2 group-hover:scale-110 transition-transform duration-300" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-border/50 hover:bg-secondary text-lg px-12 py-4 h-auto group hover-3d hover-magnetic hover-slide"
              >
                Explore Features
                <ChevronDown size={20} className="ml-2 group-hover:translate-y-1 group-hover:animate-bounce transition-transform duration-300" />
              </Button>
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: "500+", label: "Active Members", icon: Users },
                { value: "50+", label: "Events Yearly", icon: Calendar },
                { value: "100+", label: "Resources", icon: BookOpen },
                { value: "99.9%", label: "Uptime", icon: Shield },
              ].map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up group card-3d hover-lift hover-glow interactive-hover"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors group-hover:animate-3d-bounce">
                    <stat.icon size={24} className="text-primary group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <p className="text-3xl font-display text-primary mb-2 group-hover:animate-pulse-slow">{stat.value}</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Islamic Heritage Sections */}
      <TimelineOfIslamicCivilization />
      <LifeOfProphetMuhammad />
      <SahabaHeroesOfFaith />
      <IslamInEthiopia />

      {/* Core Public Pages Navigation */}
      <section className="section py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-6 py-2 mb-6">
              <Globe size={16} className="text-accent animate-pulse" />
              <span className="text-sm text-accent font-medium">Explore Our Platform</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              Comprehensive
              <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Islamic Community Platform
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover all the features and services available to strengthen our Muslim student community at Haramaya University.
            </p>
          </div>

          {/* Core Public Pages */}
          <div className="mb-16">
            <h3 className="text-3xl font-display tracking-wide text-center mb-12">
              Core <span className="text-primary">Public Pages</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Home & Vision",
                  description: "Jama'a vision, mission, daily Ayah & Hadith, latest announcements",
                  features: ["Daily Islamic content", "Latest news", "Quick access links", "Prayer times"],
                  icon: "🏠",
                  color: "from-blue-500 to-cyan-500",
                  href: "/"
                },
                {
                  title: "About MSJ",
                  description: "History, organizational structure, core values & constitution",
                  features: ["Jama'a history", "Leadership structure", "Core values", "Constitution PDF"],
                  icon: "📖",
                  color: "from-green-500 to-emerald-500",
                  href: "/about"
                },
                {
                  title: "Leadership",
                  description: "Amir, committees, IT sector members, and contact profiles",
                  features: ["Amir & Vice Amir", "Committee members", "Contact information", "Organizational chart"],
                  icon: "👥",
                  color: "from-purple-500 to-violet-500",
                  href: "/leadership"
                },
                {
                  title: "Masjid Services",
                  description: "Prayer times, Jumu'ah schedule, Khutbah announcements",
                  features: ["Auto-calculated prayer times", "Jumu'ah schedule", "Khutbah announcements", "Masjid rules"],
                  icon: "🕌",
                  color: "from-emerald-500 to-green-500",
                  href: "/prayer-times"
                }
              ].map((page, index) => (
                <div 
                  key={page.title}
                  className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-accent/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(page.href)}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${page.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {page.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">{page.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{page.description}</p>
                  <div className="space-y-1">
                    {page.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle size={12} className="text-accent flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student & Member Pages */}
          <div className="mb-16">
            <h3 className="text-3xl font-display tracking-wide text-center mb-12">
              Student & <span className="text-primary">Member Services</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Member Registration",
                  description: "Student ID verification, faculty selection, skills assessment",
                  features: ["ID verification", "Department selection", "Skills registration", "Profile setup"],
                  icon: "📝",
                  color: "from-blue-500 to-indigo-500",
                  href: "/auth"
                },
                {
                  title: "Member Dashboard",
                  description: "Personal profile, attendance history, participation tracking",
                  features: ["Personal profile", "Attendance history", "Event participation", "Achievement badges"],
                  icon: "📊",
                  color: "from-green-500 to-teal-500",
                  href: "/dashboard"
                },
                {
                  title: "Learning Hub",
                  description: "Recorded lectures, Quran materials, educational resources",
                  features: ["Recorded lectures", "Quran & Tafsir", "Fiqh resources", "Downloadable content"],
                  icon: "🎓",
                  color: "from-purple-500 to-pink-500",
                  href: "/islamic-tech"
                },
                {
                  title: "Event Management",
                  description: "Event calendar, registration, QR attendance, photo gallery",
                  features: ["Event calendar", "Online registration", "QR attendance", "Event gallery"],
                  icon: "📅",
                  color: "from-orange-500 to-red-500",
                  href: "/events"
                },
                {
                  title: "Communication",
                  description: "Announcements, messaging, community discussions",
                  features: ["Announcements", "Direct messaging", "Group discussions", "Notifications"],
                  icon: "💬",
                  color: "from-cyan-500 to-blue-500",
                  href: "/communication"
                },
                {
                  title: "Digital Library",
                  description: "Islamic books, search system, borrowing records",
                  features: ["Book database", "Advanced search", "Borrowing system", "Digital downloads"],
                  icon: "📚",
                  color: "from-amber-500 to-yellow-500",
                  href: "/content"
                }
              ].map((service, index) => (
                <div 
                  key={service.title}
                  className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(service.href)}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{service.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <div className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star size={12} className="text-primary flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IT Sector Specific Pages */}
          <div className="mb-16">
            <h3 className="text-3xl font-display tracking-wide text-center mb-12">
              IT Sector <span className="text-secondary">Management</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "IT Dashboard",
                  description: "System analytics, user activity, server status, reports",
                  features: ["System analytics", "User monitoring", "Server status", "Performance reports"],
                  icon: "🖥️",
                  color: "from-red-500 to-pink-500",
                  href: "/admin",
                  adminOnly: true
                },
                {
                  title: "Project Management",
                  description: "Active projects, task assignment, deadlines, contributors",
                  features: ["Project tracking", "Task management", "Team collaboration", "Progress monitoring"],
                  icon: "🚀",
                  color: "from-blue-500 to-cyan-500",
                  href: "/projects"
                },
                {
                  title: "Skills & Training",
                  description: "Skills assessment, training programs, certifications",
                  features: ["Skills library", "Training programs", "Certification tracking", "Member assessment"],
                  icon: "🧠",
                  color: "from-green-500 to-emerald-500",
                  href: "/skills"
                },
                {
                  title: "Equipment Management",
                  description: "IT inventory, maintenance tracking, asset management",
                  features: ["Equipment tracking", "Maintenance schedules", "Asset valuation", "Usage monitoring"],
                  icon: "📦",
                  color: "from-purple-500 to-violet-500",
                  href: "/equipment"
                },
                {
                  title: "Support System",
                  description: "Ticket management, issue tracking, help desk",
                  features: ["Ticket system", "Issue tracking", "Priority management", "Resolution monitoring"],
                  icon: "🎫",
                  color: "from-orange-500 to-red-500",
                  href: "/support"
                },
                {
                  title: "Career Hub",
                  description: "Internships, job opportunities, career development",
                  features: ["Job postings", "Internship programs", "Career guidance", "Application tracking"],
                  icon: "💼",
                  color: "from-indigo-500 to-purple-500",
                  href: "/opportunities"
                }
              ].map((tool, index) => (
                <div 
                  key={tool.title}
                  className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-secondary/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(tool.href)}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold group-hover:text-secondary transition-colors">{tool.title}</h4>
                    {tool.adminOnly && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>
                  <div className="space-y-1">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap size={12} className="text-secondary flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Finance & Support Pages */}
          <div className="mb-16">
            <h3 className="text-3xl font-display tracking-wide text-center mb-12">
              Finance & <span className="text-accent">Community Support</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Donations",
                  description: "Online donations, campaign tracking, transparency reports",
                  features: ["Secure payments", "Campaign tracking", "Transparency reports", "Receipt generation"],
                  icon: "💰",
                  color: "from-green-500 to-emerald-500",
                  href: "/donations"
                },
                {
                  title: "Partnerships",
                  description: "Partner organizations, sponsorship, MoU documents",
                  features: ["Partner directory", "Sponsorship programs", "MoU management", "Collaboration tracking"],
                  icon: "🤝",
                  color: "from-blue-500 to-cyan-500",
                  href: "/partnerships"
                },
                {
                  title: "Help & Support",
                  description: "FAQs, user guides, IT support, bug reporting",
                  features: ["Comprehensive FAQs", "User guides", "IT support", "Bug reporting"],
                  icon: "❓",
                  color: "from-purple-500 to-pink-500",
                  href: "/help"
                },
                {
                  title: "System Settings",
                  description: "Site configuration, language options, backup & restore",
                  features: ["Site configuration", "Multi-language", "Backup system", "System maintenance"],
                  icon: "⚙️",
                  color: "from-orange-500 to-red-500",
                  href: "/settings",
                  adminOnly: true
                }
              ].map((support, index) => (
                <div 
                  key={support.title}
                  className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-accent/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(support.href)}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${support.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {support.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold group-hover:text-accent transition-colors">{support.title}</h4>
                    {support.adminOnly && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{support.description}</p>
                  <div className="space-y-1">
                    {support.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Heart size={12} className="text-accent flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Administration & Security */}
          <div className="mb-16">
            <h3 className="text-3xl font-display tracking-wide text-center mb-12">
              Administration & <span className="text-red-400">Security</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Role Management",
                  description: "Admin roles, committee permissions, access control",
                  features: ["Role assignment", "Permission management", "Access control", "Security levels"],
                  icon: "🔐",
                  color: "from-red-500 to-pink-500",
                  href: "/user-management",
                  adminOnly: true
                },
                {
                  title: "Audit & Logs",
                  description: "User activity logs, security events, data changes",
                  features: ["Activity monitoring", "Security logs", "Change tracking", "Audit reports"],
                  icon: "📋",
                  color: "from-blue-500 to-indigo-500",
                  href: "/reports",
                  adminOnly: true
                },
                {
                  title: "Analytics",
                  description: "Platform analytics, user engagement, performance metrics",
                  features: ["User analytics", "Engagement metrics", "Performance data", "Growth tracking"],
                  icon: "📈",
                  color: "from-green-500 to-teal-500",
                  href: "/analytics"
                }
              ].map((admin, index) => (
                <div 
                  key={admin.title}
                  className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-red-400/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(admin.href)}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${admin.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {admin.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold group-hover:text-red-400 transition-colors">{admin.title}</h4>
                    {admin.adminOnly && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{admin.description}</p>
                  <div className="space-y-1">
                    {admin.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield size={12} className="text-red-400 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl rounded-3xl p-8 border border-border/30">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Legal & <span className="text-primary">Compliance</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ensuring transparency, privacy, and adherence to Islamic principles in all our operations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Privacy Policy",
                  description: "Data protection, user privacy, information handling",
                  icon: "🔒",
                  href: "/privacy"
                },
                {
                  title: "Terms & Conditions",
                  description: "Platform usage terms, user responsibilities, service agreements",
                  icon: "📄",
                  href: "/terms"
                },
                {
                  title: "Code of Conduct",
                  description: "Islamic principles, community guidelines, behavioral standards",
                  icon: "⚖️",
                  href: "/conduct"
                }
              ].map((legal, index) => (
                <div 
                  key={legal.title}
                  className="group bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(legal.href)}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                    {legal.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{legal.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{legal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section min-h-screen py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
              <Zap size={16} className="text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Powerful Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Manage Your Community
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools necessary to efficiently manage, 
              engage, and grow your Islamic student community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/30 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    <feature.icon className="text-primary" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl tracking-wide mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-3">
                          <CheckCircle size={16} className="text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="section min-h-screen py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-6 py-2 mb-6">
              <Code size={16} className="text-secondary animate-pulse" />
              <span className="text-sm text-secondary font-medium">Built with Modern Technology</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              Cutting-Edge
              <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Technology Stack
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built using the latest web technologies to ensure performance, scalability, 
              and an exceptional user experience across all devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <div 
                key={tech.name}
                className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <tech.icon className="text-secondary" size={28} />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-2 group-hover:text-secondary transition-colors">
                  {tech.name}
                </h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="mt-20 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl rounded-3xl p-12 border border-border/30">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display tracking-wide mb-4">Performance Metrics</h3>
              <p className="text-muted-foreground">Optimized for speed, reliability, and user experience</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { metric: "< 2s", label: "Page Load Time", icon: Zap },
                { metric: "99.9%", label: "Uptime", icon: Shield },
                { metric: "A+", label: "Security Grade", icon: Lock },
                { metric: "100%", label: "Mobile Responsive", icon: Smartphone },
              ].map((item, index) => (
                <div key={item.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <p className="text-3xl font-display text-primary mb-2">{item.metric}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section min-h-screen py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
              <Heart size={16} className="text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Community Voices</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              What Our
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Community Says
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from our community leaders and members about how HUMSJ has transformed 
              their experience and strengthened our Islamic student community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="group bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mb-6">
                  <Quote size={32} className="text-primary/30" />
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quranic Miracles & Scientific Truths Section */}
      <section className="section py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-6 py-2 mb-6">
              <BookOpen size={16} className="text-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-600 font-medium">Divine Revelations</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              Quranic Miracles &
              <span className="block bg-gradient-to-r from-emerald-500 to-primary bg-clip-text text-transparent">
                Scientific Truths
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the scientific miracles revealed in the Quran 1400 years ago, now confirmed by modern science
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Embryology",
                verse: "We created man from an extract of clay. Then We made him as a drop in a place of settlement, firmly fixed. Then We made the drop into an alaqah (leech-like structure), then We made the alaqah into a mudghah (chewed substance)...",
                reference: "Quran 23:12-14",
                science: "Modern embryology confirms the exact stages of human development described in the Quran",
                discovery: "Confirmed by Dr. Keith Moore, leading embryologist",
                icon: "🧬",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Big Bang Theory",
                verse: "Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them...",
                reference: "Quran 21:30",
                science: "The Quran describes the Big Bang theory 1400 years before modern cosmology",
                discovery: "Confirmed by Edwin Hubble in 1929",
                icon: "🌌",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Expanding Universe",
                verse: "And the heaven We constructed with strength, and indeed, We are [its] expander.",
                reference: "Quran 51:47",
                science: "The continuous expansion of the universe, discovered only in the 20th century",
                discovery: "Confirmed by Hubble Space Telescope",
                icon: "🔭",
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "Water Cycle",
                verse: "And We send down from the sky water in due measure, and We settle it in the earth...",
                reference: "Quran 23:18",
                science: "Complete description of the water cycle including evaporation, condensation, and precipitation",
                discovery: "Scientifically understood in the 17th century",
                icon: "💧",
                color: "from-cyan-500 to-blue-500"
              },
              {
                title: "Ocean Barriers",
                verse: "He released the two seas, meeting [side by side]; Between them is a barrier [so] neither of them transgresses.",
                reference: "Quran 55:19-20",
                science: "Different seas maintain distinct properties due to density barriers",
                discovery: "Confirmed by oceanographic research",
                icon: "🌊",
                color: "from-teal-500 to-green-500"
              },
              {
                title: "Iron from Space",
                verse: "And We sent down iron, wherein is great military might and benefits for the people...",
                reference: "Quran 57:25",
                science: "Iron on Earth came from meteorites and supernovae, not formed on Earth",
                discovery: "Confirmed by modern astrophysics",
                icon: "🛡️",
                color: "from-gray-500 to-slate-600"
              }
            ].map((miracle, index) => (
              <div 
                key={miracle.title}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${miracle.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {miracle.icon}
                </div>
                <h3 className="text-xl font-display tracking-wide mb-3 group-hover:text-emerald-600 transition-colors">{miracle.title}</h3>
                
                <div className="bg-emerald-500/10 rounded-lg p-4 mb-4">
                  <Quote size={14} className="text-emerald-500 mb-2" />
                  <p className="text-sm italic text-emerald-700 mb-2 leading-relaxed">"{miracle.verse}"</p>
                  <p className="text-xs text-emerald-600 font-medium">- {miracle.reference}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{miracle.science}</p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span>{miracle.discovery}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hadith Collection & Wisdom Section */}
      <section className="section py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-2 mb-6">
              <Quote size={16} className="text-amber-500 animate-pulse" />
              <span className="text-sm text-amber-600 font-medium">Prophetic Wisdom</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              Hadith &
              <span className="block bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                Prophetic Guidance
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Timeless wisdom from Prophet Muhammad ﷺ that guides humanity in all aspects of life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                category: "Knowledge & Education",
                hadith: "Seek knowledge from the cradle to the grave",
                source: "Sahih Bukhari",
                wisdom: "Islam emphasizes lifelong learning and the pursuit of knowledge as a religious duty",
                applications: ["Scientific research", "Educational development", "Intellectual growth", "Skill acquisition"],
                icon: "📚",
                color: "from-blue-500 to-indigo-600"
              },
              {
                category: "Technology & Innovation",
                hadith: "Allah loves, when one of you does a job, that he does it with excellence (Ihsan)",
                source: "Sahih Muslim",
                wisdom: "Excellence in work and innovation is a form of worship and service to humanity",
                applications: ["Quality software development", "Ethical technology", "User-centered design", "Continuous improvement"],
                icon: "⚙️",
                color: "from-green-500 to-emerald-600"
              },
              {
                category: "Social Justice",
                hadith: "None of you truly believes until he loves for his brother what he loves for himself",
                source: "Sahih Bukhari & Muslim",
                wisdom: "Technology should serve all humanity equally and bridge social divides",
                applications: ["Accessible technology", "Digital inclusion", "Fair algorithms", "Equal opportunities"],
                icon: "⚖️",
                color: "from-purple-500 to-violet-600"
              },
              {
                category: "Environmental Stewardship",
                hadith: "The world is green and beautiful, and Allah has appointed you as His stewards over it",
                source: "Sahih Muslim",
                wisdom: "Responsible use of resources and environmental protection is an Islamic obligation",
                applications: ["Green technology", "Sustainable computing", "Energy efficiency", "Waste reduction"],
                icon: "🌱",
                color: "from-emerald-500 to-green-600"
              }
            ].map((teaching, index) => (
              <div 
                key={teaching.category}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border/30 hover:border-amber-500/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${teaching.color} flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {teaching.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display tracking-wide mb-3 group-hover:text-amber-600 transition-colors">{teaching.category}</h3>
                    
                    <div className="bg-amber-500/10 rounded-lg p-4 mb-4">
                      <Quote size={16} className="text-amber-500 mb-2" />
                      <p className="text-sm italic text-amber-700 mb-2 leading-relaxed">"{teaching.hadith}"</p>
                      <p className="text-xs text-amber-600 font-medium">- {teaching.source}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{teaching.wisdom}</p>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modern Applications:</p>
                      {teaching.applications.map((app, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star size={12} className="text-amber-500" />
                          <span>{app}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Muslim Scientists & Scholars Section */}
      <section className="section py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
              <Award size={16} className="text-blue-500 animate-pulse" />
              <span className="text-sm text-blue-600 font-medium">Islamic Golden Age</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
              Muslim Scientists &
              <span className="block bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
                Scholars' Legacy
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the remarkable contributions of Muslim scholars who laid the foundations of modern science and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Al-Khwarizmi",
                period: "780-850 CE",
                field: "Mathematics & Astronomy",
                contributions: ["Father of Algebra", "Introduced Hindu-Arabic numerals to Europe", "Developed algorithms", "Advanced trigonometry"],
                legacy: "The word 'algorithm' comes from his name. His work on algebra revolutionized mathematics.",
                modernImpact: "Foundation of computer science and programming",
                icon: "🔢",
                color: "from-blue-500 to-cyan-500"
              },
              {
                name: "Ibn Sina (Avicenna)",
                period: "980-1037 CE",
                field: "Medicine & Philosophy",
                contributions: ["Canon of Medicine", "Systematic medical encyclopedia", "Experimental medicine", "Philosophical works"],
                legacy: "His medical texts were used in European universities for 600 years.",
                modernImpact: "Evidence-based medicine and clinical trials",
                icon: "⚕️",
                color: "from-green-500 to-emerald-500"
              },
              {
                name: "Al-Jazari",
                period: "1136-1206 CE",
                field: "Engineering & Mechanics",
                contributions: ["Programmable automata", "Water clocks", "Mechanical devices", "Robotics principles"],
                legacy: "Father of robotics and cybernetics. Created the first programmable machines.",
                modernImpact: "Robotics, automation, and artificial intelligence",
                icon: "🤖",
                color: "from-purple-500 to-pink-500"
              },
              {
                name: "Ibn al-Haytham (Alhazen)",
                period: "965-1040 CE",
                field: "Optics & Scientific Method",
                contributions: ["Scientific method", "Camera obscura", "Laws of optics", "Experimental physics"],
                legacy: "Father of the scientific method and modern optics.",
                modernImpact: "Photography, telescopes, and scientific research methodology",
                icon: "🔬",
                color: "from-indigo-500 to-purple-500"
              },
              {
                name: "Al-Biruni",
                period: "973-1048 CE",
                field: "Geography & Anthropology",
                contributions: ["Earth's circumference calculation", "Cultural studies", "Comparative religion", "Astronomical observations"],
                legacy: "Pioneer of comparative anthropology and scientific geography.",
                modernImpact: "GPS technology, satellite mapping, and cultural studies",
                icon: "🌍",
                color: "from-teal-500 to-green-500"
              },
              {
                name: "Ibn Rushd (Averroes)",
                period: "1126-1198 CE",
                field: "Philosophy & Logic",
                contributions: ["Aristotelian philosophy", "Logic and reasoning", "Medical treatises", "Legal scholarship"],
                legacy: "Bridge between Islamic and Western philosophy. Influenced European Renaissance.",
                modernImpact: "Logical reasoning in AI and philosophical foundations of science",
                icon: "🧠",
                color: "from-amber-500 to-orange-500"
              }
            ].map((scholar, index) => (
              <div 
                key={scholar.name}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-blue-500/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${scholar.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {scholar.icon}
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-display tracking-wide mb-1 group-hover:text-blue-600 transition-colors">{scholar.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-1">{scholar.period}</p>
                  <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                    {scholar.field}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Key Contributions:</p>
                    <div className="space-y-1">
                      {scholar.contributions.map((contribution, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle size={12} className="text-blue-500 flex-shrink-0" />
                          <span>{contribution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-600 mb-1">Historical Legacy:</p>
                    <p className="text-xs text-blue-700 leading-relaxed">{scholar.legacy}</p>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs font-medium text-secondary mb-1">Modern Impact:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{scholar.modernImpact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Muslim IT Professionals & Innovation Section */}
      <section className="py-24 bg-gradient-to-br from-background via-card/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e50914' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Monitor size={20} className="text-primary" />
              <span className="text-primary font-medium">Muslim IT Innovation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Muslims in <span className="text-primary">Information Technology</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover how Muslim professionals and scholars are shaping the digital world through innovation, 
              ethical technology, and Islamic principles in computing.
            </p>
          </div>

          {/* Modern Muslim IT Leaders */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Leading <span className="text-primary">Muslim IT Professionals</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Contemporary Muslim leaders who are revolutionizing technology and digital innovation worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Rana el Kaliouby",
                  role: "AI Pioneer & CEO",
                  company: "Affectiva (acquired by Smart Eye)",
                  contribution: "Emotion AI and computer vision technology",
                  achievement: "Named one of Fortune's 40 Under 40",
                  country: "Egypt/USA",
                  field: "Artificial Intelligence",
                  icon: "🤖",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  name: "Fei-Fei Li",
                  role: "AI Researcher & Professor",
                  company: "Stanford University",
                  contribution: "ImageNet dataset and computer vision advancement",
                  achievement: "Former Chief Scientist at Google Cloud",
                  country: "China/USA",
                  field: "Computer Vision",
                  icon: "👁️",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  name: "Reshma Saujani",
                  role: "Tech Entrepreneur",
                  company: "Girls Who Code",
                  contribution: "Closing the gender gap in technology",
                  achievement: "Reached 450,000+ girls worldwide",
                  country: "USA",
                  field: "Tech Education",
                  icon: "👩‍💻",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  name: "Mustafa Suleyman",
                  role: "AI Co-founder",
                  company: "DeepMind (Google)",
                  contribution: "Applied AI for social good",
                  achievement: "Co-created AlphaGo and healthcare AI",
                  country: "UK",
                  field: "Applied AI",
                  icon: "🧠",
                  color: "from-red-500 to-orange-500"
                },
                {
                  name: "Ayah Bdeir",
                  role: "Hardware Entrepreneur",
                  company: "littleBits",
                  contribution: "Electronic building blocks for education",
                  achievement: "TED Senior Fellow and MIT graduate",
                  country: "Lebanon/USA",
                  field: "Hardware/IoT",
                  icon: "🔧",
                  color: "from-amber-500 to-yellow-500"
                },
                {
                  name: "Zoubin Ghahramani",
                  role: "Machine Learning Expert",
                  company: "Google Research",
                  contribution: "Bayesian machine learning and probabilistic AI",
                  achievement: "Former Cambridge Professor, 100+ patents",
                  country: "Iran/UK",
                  field: "Machine Learning",
                  icon: "📊",
                  color: "from-indigo-500 to-purple-500"
                }
              ].map((leader, index) => (
                <div 
                  key={leader.name}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 group"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${leader.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {leader.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-1">{leader.name}</h4>
                  <p className="text-sm text-primary mb-1">{leader.role}</p>
                  <p className="text-xs text-secondary mb-2">{leader.company}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{leader.contribution}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-accent">🏆 {leader.achievement}</p>
                    <p className="text-xs text-muted-foreground">📍 {leader.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Islamic Principles in Technology */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Islamic <span className="text-primary">Principles</span> in Technology
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                How Islamic values guide ethical technology development and responsible innovation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  principle: "Amanah (Trust)",
                  description: "Responsible handling of user data and privacy protection",
                  application: "Secure coding practices, data encryption, privacy by design",
                  verse: "Indeed, Allah commands you to render trusts to whom they are due",
                  reference: "Quran 4:58",
                  icon: "🔒",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  principle: "Adl (Justice)",
                  description: "Fair algorithms and unbiased AI systems",
                  application: "Ethical AI, algorithmic fairness, inclusive design",
                  verse: "O you who believe! Stand out firmly for justice",
                  reference: "Quran 4:135",
                  icon: "⚖️",
                  color: "from-green-500 to-teal-600"
                },
                {
                  principle: "Ihsan (Excellence)",
                  description: "Pursuing perfection and quality in all work",
                  application: "Clean code, thorough testing, continuous improvement",
                  verse: "And Allah loves those who do good with excellence",
                  reference: "Quran 2:195",
                  icon: "⭐",
                  color: "from-yellow-500 to-orange-600"
                },
                {
                  principle: "Hikmah (Wisdom)",
                  description: "Thoughtful technology decisions and ethical considerations",
                  application: "User-centered design, accessibility, social impact assessment",
                  verse: "He gives wisdom to whom He wills",
                  reference: "Quran 2:269",
                  icon: "🧠",
                  color: "from-purple-500 to-violet-600"
                },
                {
                  principle: "Tawhid (Unity)",
                  description: "Interconnected systems and collaborative development",
                  application: "Open source contribution, knowledge sharing, team collaboration",
                  verse: "And hold firmly to the rope of Allah all together",
                  reference: "Quran 3:103",
                  icon: "🤝",
                  color: "from-cyan-500 to-blue-600"
                },
                {
                  principle: "Khilafah (Stewardship)",
                  description: "Responsible technology for humanity's benefit",
                  application: "Sustainable computing, green technology, social good projects",
                  verse: "It is He who has made you successors upon the earth",
                  reference: "Quran 35:39",
                  icon: "🌍",
                  color: "from-emerald-500 to-green-600"
                }
              ].map((principle, index) => (
                <div 
                  key={principle.principle}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${principle.color} flex items-center justify-center text-2xl mb-4`}>
                    {principle.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{principle.principle}</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{principle.description}</p>
                  <div className="bg-secondary/30 rounded-lg p-3 mb-3">
                    <p className="text-xs text-primary font-medium mb-1">Application:</p>
                    <p className="text-xs text-muted-foreground">{principle.application}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs italic text-foreground mb-1">"{principle.verse}"</p>
                    <p className="text-xs text-primary font-medium">{principle.reference}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Muslim Tech Communities & Organizations */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Muslim <span className="text-primary">Tech Communities</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Global organizations and communities connecting Muslim professionals in technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Muslim Tech Network",
                  description: "Global community of Muslim technology professionals",
                  focus: "Networking, mentorship, career development",
                  members: "10,000+",
                  website: "muslimtechnetwork.com",
                  icon: "🌐"
                },
                {
                  name: "Halal Tech",
                  description: "Promoting ethical technology aligned with Islamic values",
                  focus: "Halal fintech, ethical AI, Islamic apps",
                  members: "5,000+",
                  website: "halaltech.org",
                  icon: "✅"
                },
                {
                  name: "Muslim Women in Tech",
                  description: "Empowering Muslim women in technology careers",
                  focus: "Women empowerment, diversity, inclusion",
                  members: "3,000+",
                  website: "muslimwomenintech.com",
                  icon: "👩‍💻"
                },
                {
                  name: "Islamic Software Guild",
                  description: "Developers creating Islamic applications and tools",
                  focus: "Islamic apps, Quran tech, prayer tools",
                  members: "2,500+",
                  website: "islamicsoftware.org",
                  icon: "📱"
                },
                {
                  name: "Tech for Ummah",
                  description: "Technology solutions for Muslim communities",
                  focus: "Community tools, mosque management, education",
                  members: "4,000+",
                  website: "techforummah.org",
                  icon: "🕌"
                },
                {
                  name: "Barakah Blockchain",
                  description: "Islamic finance and blockchain technology",
                  focus: "Sharia-compliant crypto, Islamic DeFi",
                  members: "1,500+",
                  website: "barakahblockchain.com",
                  icon: "⛓️"
                }
              ].map((community, index) => (
                <div 
                  key={community.name}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 animate-slide-up opacity-0 hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{community.icon}</span>
                    <div>
                      <h4 className="text-lg font-semibold">{community.name}</h4>
                      <p className="text-xs text-primary">{community.members} members</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{community.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-secondary">
                      <span className="font-medium">Focus:</span> {community.focus}
                    </p>
                    <p className="text-xs text-accent">
                      <span className="font-medium">Website:</span> {community.website}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Islamic Knowledge & Science Section */}
      <section className="py-24 bg-gradient-to-br from-card via-background to-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e50914' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <BookOpen size={20} className="text-primary" />
              <span className="text-primary font-medium">Islamic Knowledge & Science</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Discover the <span className="text-primary">Golden Age</span> of Islam
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the rich heritage of Islamic scholarship, scientific discoveries, and the profound wisdom 
              that shaped our understanding of the world.
            </p>
          </div>

          {/* Quran & Hadith Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-emerald-glow flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={28} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-display tracking-wide">Holy Quran</h3>
                  <p className="text-muted-foreground">The Final Revelation</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg p-4 border-l-4 border-l-primary">
                  <p className="text-sm text-muted-foreground mb-2">Surah Al-Baqarah (2:255) - Ayat al-Kursi</p>
                  <p className="font-arabic text-lg leading-relaxed mb-3 text-right">
                    اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ
                  </p>
                  <p className="text-sm italic">
                    "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. 
                    Neither drowsiness overtakes Him nor sleep."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">114</p>
                    <p className="text-xs text-muted-foreground">Surahs</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">6,236</p>
                    <p className="text-xs text-muted-foreground">Verses</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={28} className="text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-display tracking-wide">Hadith</h3>
                  <p className="text-muted-foreground">Prophetic Traditions</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg p-4 border-l-4 border-l-secondary">
                  <p className="text-sm text-muted-foreground mb-2">Sahih Bukhari</p>
                  <p className="font-arabic text-lg leading-relaxed mb-3 text-right">
                    إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ
                  </p>
                  <p className="text-sm italic">
                    "Actions are but by intention, and every man shall have only that which he intended."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-secondary">6</p>
                    <p className="text-xs text-muted-foreground">Major Collections</p>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-secondary">40+</p>
                    <p className="text-xs text-muted-foreground">Hadith Qudsi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Miracles Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Scientific <span className="text-primary">Miracles</span> in the Quran
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how the Quran, revealed 1400+ years ago, contains scientific facts that were only recently discovered by modern science.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Embryology",
                  verse: "Surah Al-Mu'minun (23:12-14)",
                  description: "Detailed stages of human embryonic development described with remarkable accuracy.",
                  icon: "🧬",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Expanding Universe",
                  verse: "Surah Adh-Dhariyat (51:47)",
                  description: "The continuous expansion of the universe, confirmed by modern cosmology.",
                  icon: "🌌",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "Water Cycle",
                  verse: "Surah Az-Zumar (39:21)",
                  description: "Complete description of the water cycle including evaporation and precipitation.",
                  icon: "💧",
                  color: "from-blue-400 to-teal-500"
                },
                {
                  title: "Ocean Barriers",
                  verse: "Surah Ar-Rahman (55:19-20)",
                  description: "Two seas meeting but not mixing, describing ocean water density barriers.",
                  icon: "🌊",
                  color: "from-teal-500 to-blue-600"
                },
                {
                  title: "Iron from Space",
                  verse: "Surah Al-Hadid (57:25)",
                  description: "Iron being sent down from heaven, confirmed by meteorite studies.",
                  icon: "⚡",
                  color: "from-orange-500 to-red-500"
                },
                {
                  title: "Fingerprints",
                  verse: "Surah Al-Qiyamah (75:3-4)",
                  description: "Uniqueness of fingerprints mentioned centuries before forensic science.",
                  icon: "👆",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((miracle, index) => (
                <div 
                  key={miracle.title}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${miracle.color} flex items-center justify-center text-2xl mb-4`}>
                    {miracle.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{miracle.title}</h4>
                  <p className="text-sm text-primary mb-2">{miracle.verse}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{miracle.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Muslim Scientists Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Great <span className="text-primary">Muslim Scientists</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Celebrating the brilliant minds who advanced human knowledge and laid the foundations for modern science.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Al-Khwarizmi",
                  field: "Mathematics & Astronomy",
                  period: "780-850 CE",
                  contribution: "Father of Algebra, introduced Hindu-Arabic numerals to the West",
                  icon: "📐",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  name: "Ibn Sina (Avicenna)",
                  field: "Medicine & Philosophy",
                  period: "980-1037 CE",
                  contribution: "Canon of Medicine, used in European universities for 600+ years",
                  icon: "⚕️",
                  color: "from-green-500 to-teal-600"
                },
                {
                  name: "Al-Razi (Rhazes)",
                  field: "Medicine & Chemistry",
                  period: "854-925 CE",
                  contribution: "Distinguished smallpox from measles, pioneered medical ethics",
                  icon: "🧪",
                  color: "from-red-500 to-pink-600"
                },
                {
                  name: "Ibn al-Haytham",
                  field: "Optics & Physics",
                  period: "965-1040 CE",
                  contribution: "Father of Modern Optics, developed scientific method",
                  icon: "🔬",
                  color: "from-purple-500 to-violet-600"
                },
                {
                  name: "Al-Biruni",
                  field: "Geography & Astronomy",
                  period: "973-1048 CE",
                  contribution: "Calculated Earth's circumference, studied Indian mathematics",
                  icon: "🌍",
                  color: "from-cyan-500 to-blue-600"
                },
                {
                  name: "Ibn Rushd (Averroes)",
                  field: "Philosophy & Law",
                  period: "1126-1198 CE",
                  contribution: "Commentaries on Aristotle, influenced European thought",
                  icon: "📚",
                  color: "from-amber-500 to-orange-600"
                },
                {
                  name: "Al-Jazari",
                  field: "Engineering & Mechanics",
                  period: "1136-1206 CE",
                  contribution: "Father of Robotics, invented programmable machines",
                  icon: "⚙️",
                  color: "from-gray-500 to-slate-600"
                },
                {
                  name: "Ibn Khaldun",
                  field: "Sociology & History",
                  period: "1332-1406 CE",
                  contribution: "Father of Sociology, developed theories of social cohesion",
                  icon: "👥",
                  color: "from-emerald-500 to-green-600"
                }
              ].map((scientist, index) => (
                <div 
                  key={scientist.name}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 group"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${scientist.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {scientist.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-1">{scientist.name}</h4>
                  <p className="text-sm text-primary mb-1">{scientist.field}</p>
                  <p className="text-xs text-muted-foreground mb-3">{scientist.period}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{scientist.contribution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Islamic Contributions to Science */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display tracking-wide mb-4">
                Islamic <span className="text-primary">Contributions</span> to Modern Science
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Islamic Golden Age (8th-13th centuries) saw unprecedented scientific advancement that shaped our modern world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  field: "Mathematics",
                  contributions: [
                    "Algebra (Al-Jabr)",
                    "Trigonometry",
                    "Decimal system",
                    "Algorithms",
                    "Zero concept"
                  ],
                  icon: "🔢"
                },
                {
                  field: "Medicine",
                  contributions: [
                    "Surgical instruments",
                    "Anesthesia",
                    "Medical ethics",
                    "Pharmacology",
                    "Clinical trials"
                  ],
                  icon: "🏥"
                },
                {
                  field: "Chemistry",
                  contributions: [
                    "Distillation",
                    "Laboratory equipment",
                    "Chemical processes",
                    "Perfume making",
                    "Metallurgy"
                  ],
                  icon: "⚗️"
                },
                {
                  field: "Astronomy",
                  contributions: [
                    "Star catalogs",
                    "Astrolabe",
                    "Observatory design",
                    "Planetary motion",
                    "Calendar systems"
                  ],
                  icon: "🔭"
                },
                {
                  field: "Geography",
                  contributions: [
                    "World maps",
                    "Navigation tools",
                    "Trade routes",
                    "Cartography",
                    "Climate studies"
                  ],
                  icon: "🗺️"
                },
                {
                  field: "Engineering",
                  contributions: [
                    "Water clocks",
                    "Mechanical devices",
                    "Architecture",
                    "Irrigation systems",
                    "Automation"
                  ],
                  icon: "🏗️"
                }
              ].map((field, index) => (
                <div 
                  key={field.field}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{field.icon}</span>
                    <h4 className="text-xl font-semibold">{field.field}</h4>
                  </div>
                  <ul className="space-y-2">
                    {field.contributions.map((contribution, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {contribution}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section min-h-screen flex items-center justify-center py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 mx-auto shadow-2xl animate-glow">
              <Rocket size={48} className="text-white" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-display tracking-wide mb-8">
              Ready to
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Transform
              </span>
              Your Community?
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of students who are already using HUMSJ to build stronger, 
              more connected Islamic communities. Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="gap-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl text-xl px-16 py-6 h-auto group"
              >
                <Play size={28} className="fill-current group-hover:scale-110 transition-transform" />
                Get Started Now
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/help")}
                className="border-border/50 hover:bg-secondary text-xl px-16 py-6 h-auto group"
              >
                <HelpCircle size={24} className="mr-3" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-card/30 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-red">
                  <span className="text-2xl font-bold text-white font-display">H</span>
                </div>
                <div>
                  <span className="font-display text-2xl tracking-wider">HUMSJ</span>
                  <p className="text-sm text-muted-foreground">Information Technology Sector</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Empowering Islamic student communities through innovative technology solutions 
                and comprehensive management systems.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Github].map((Icon, index) => (
                  <button 
                    key={index}
                    className="w-10 h-10 rounded-lg bg-secondary/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg tracking-wide mb-6">Quick Links</h3>
              <div className="space-y-3">
                {['Features', 'Technology', 'Community', 'Support'].map((link) => (
                  <button key={link} className="block text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display text-lg tracking-wide mb-6">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm">Haramaya University, Ethiopia</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={16} className="text-primary" />
                  <span className="text-sm">info@humsj.edu.et</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={16} className="text-primary" />
                  <span className="text-sm">+251 25 553 0011</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 HUMSJ Information Technology Sector. All rights reserved. Built with ❤️ for the Islamic community.
            </p>
            <p className="text-sm text-muted-foreground font-arabic">
              "وتعاونوا على البر والتقوى ولا تعاونوا على الإثم والعدوان"
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}