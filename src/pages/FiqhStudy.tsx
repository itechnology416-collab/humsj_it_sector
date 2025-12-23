import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Scale, 
  BookOpen, 
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Lightbulb,
  Target,
  Award,
  Globe,
  MessageCircle,
  FileText,
  Calculator,
  Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FiqhStudy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMadhab, setSelectedMadhab] = useState("hanafi");

  const fiqhCategories = [
    {
      id: "worship",
      title: "Acts of Worship",
      titleArabic: "العبادات",
      titleOromo: "Waaqeffannaa",
      description: "Religious obligations and recommended acts",
      topics: ["Prayer (Salah)", "Fasting (Sawm)", "Charity (Zakat)", "Pilgrimage (Hajj)", "Purification (Taharah)"],
      color: "from-blue-500 to-cyan-500",
      icon: Target
    },
    {
      id: "transactions",
      title: "Transactions",
      titleArabic: "المعاملات",
      titleOromo: "Daldala",
      description: "Commercial and financial dealings",
      topics: ["Trade", "Banking", "Contracts", "Partnership", "Inheritance"],
      color: "from-green-500 to-emerald-500",
      icon: Calculator
    },
    {
      id: "marriage",
      title: "Marriage & Family",
      titleArabic: "النكاح والأسرة",
      titleOromo: "Fuudhaa fi Maatii",
      description: "Family law and relationships",
      topics: ["Marriage contracts", "Divorce", "Child custody", "Family obligations", "Inheritance"],
      color: "from-purple-500 to-violet-500",
      icon: Heart
    },
    {
      id: "criminal",
      title: "Criminal Law",
      titleArabic: "الجنايات",
      titleOromo: "Seera Yakka",
      description: "Islamic criminal justice system",
      topics: ["Hudud crimes", "Qisas (retaliation)", "Diyya (blood money)", "Ta'zir punishments"],
      color: "from-red-500 to-pink-500",
      icon: Gavel
    },
    {
      id: "judicial",
      title: "Judicial Procedures",
      titleArabic: "القضاء",
      titleOromo: "Murtii",
      description: "Court procedures and evidence",
      topics: ["Testimony", "Evidence", "Arbitration", "Mediation", "Court procedures"],
      color: "from-orange-500 to-yellow-500",
      icon: Scale
    }
  ];

  const madhabs = [
    {
      id: "hanafi",
      name: "Hanafi",
      founder: "Imam Abu Hanifa",
      region: "Turkey, Central Asia, Indian Subcontinent",
      characteristics: "Emphasis on reason and analogy",
      followers: "45% of Muslims worldwide"
    },
    {
      id: "maliki",
      name: "Maliki",
      founder: "Imam Malik",
      region: "North and West Africa",
      characteristics: "Emphasis on Medinan practice",
      followers: "25% of Muslims worldwide"
    },
    {
      id: "shafii",
      name: "Shafi'i",
      founder: "Imam ash-Shafi'i",
      region: "Southeast Asia, East Africa",
      characteristics: "Systematic methodology",
      followers: "15% of Muslims worldwide"
    },
    {
      id: "hanbali",
      name: "Hanbali",
      founder: "Imam Ahmad ibn Hanbal",
      region: "Saudi Arabia, Qatar",
      characteristics: "Strict adherence to texts",
      followers: "5% of Muslims worldwide"
    }
  ];

  const practicalTopics = [
    {
      title: "Daily Worship",
      description: "Practical guidance for daily Islamic practices",
      duration: "4 weeks",
      topics: ["Prayer times and procedures", "Ablution and purification", "Friday prayers", "Eid celebrations"],
      level: "Beginner",
      color: "bg-green-500/20 text-green-600"
    },
    {
      title: "Business Ethics",
      description: "Islamic principles in modern commerce",
      duration: "6 weeks",
      topics: ["Halal business practices", "Islamic banking", "Contract law", "Dispute resolution"],
      level: "Intermediate",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      title: "Family Law",
      description: "Marriage, divorce, and family obligations",
      duration: "8 weeks",
      topics: ["Marriage contracts", "Marital rights", "Divorce procedures", "Child custody"],
      level: "Advanced",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      title: "Contemporary Issues",
      description: "Modern challenges through Islamic lens",
      duration: "10 weeks",
      topics: ["Medical ethics", "Technology and privacy", "Environmental law", "Social justice"],
      level: "Advanced",
      color: "bg-orange-500/20 text-orange-600"
    }
  ];

  return (
    <PageLayout 
      title="Fiqh Study Center" 
      subtitle="Islamic Jurisprudence - Practical Application of Islamic Law"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <Scale size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Fiqhii <span className="text-primary">Islaamaa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Master Islamic jurisprudence through comprehensive study of Islamic law and its practical applications. 
              Learn how to navigate modern life according to authentic Islamic principles.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Fiqh Section
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <BookOpen size={18} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Fiqh Categories */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Categories of <span className="text-primary">Islamic Law</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage of all major areas of Islamic jurisprudence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiqhCategories.map((category, index) => (
              <div 
                key={category.id}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 mx-auto`}>
                  <category.icon size={32} className="text-white" />
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-lg font-arabic text-primary mb-1">{category.titleArabic}</p>
                  <p className="text-sm text-muted-foreground">{category.titleOromo}</p>
                </div>
                
                <p className="text-muted-foreground text-center mb-4">{category.description}</p>
                
                <div className="space-y-2">
                  {category.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {topic}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <BookOpen size={14} className="mr-2" />
                  Study {category.title}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Schools of Thought */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Schools of <span className="text-primary">Thought</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about the four major Sunni schools of Islamic jurisprudence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {madhabs.map((madhab, index) => (
              <div 
                key={madhab.id}
                className={`bg-card rounded-xl p-6 border transition-all duration-300 cursor-pointer animate-slide-up ${
                  selectedMadhab === madhab.id 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/30 hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedMadhab(madhab.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{madhab.name} School</h3>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMadhab === madhab.id 
                      ? "border-primary bg-primary" 
                      : "border-border"
                  }`} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Founder:</span>
                    <span className="text-sm font-medium">{madhab.founder}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Main Region:</span>
                    <span className="text-sm font-medium">{madhab.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Followers:</span>
                    <span className="text-sm font-medium">{madhab.followers}</span>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3 mt-4">
                  <p className="text-sm text-muted-foreground">{madhab.characteristics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Topics */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Practical <span className="text-primary">Applications</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn how to apply Islamic law in contemporary situations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practicalTopics.map((topic, index) => (
              <div 
                key={topic.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${topic.color}`}>
                    {topic.level}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{topic.duration}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                
                <div className="space-y-2 mb-6">
                  {topic.topics.map((subtopic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <ArrowRight size={12} className="text-primary" />
                      {subtopic}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Start Course
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Methodology */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              Learning <span className="text-primary">Methodology</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our structured approach to mastering Islamic jurisprudence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Foundation",
                description: "Learn basic principles and sources of Islamic law",
                icon: BookOpen,
                color: "text-blue-600"
              },
              {
                step: "2",
                title: "Application",
                description: "Study how principles apply to real-life situations",
                icon: Target,
                color: "text-green-600"
              },
              {
                step: "3",
                title: "Comparison",
                description: "Compare different scholarly opinions and schools",
                icon: Scale,
                color: "text-purple-600"
              },
              {
                step: "4",
                title: "Practice",
                description: "Apply knowledge through case studies and scenarios",
                icon: Award,
                color: "text-orange-600"
              }
            ].map((step, index) => (
              <div 
                key={step.step}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 mx-auto">
                  <step.icon size={24} className={step.color} />
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div className="bg-card rounded-xl p-8 border border-border/30">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              External <span className="text-primary">Resources</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with authentic Islamic educational platforms for comprehensive fiqh study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-primary" />
              </div>
              <h4 className="font-semibold mb-2">TVIslaamaa Fiqh Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive Islamic jurisprudence studies in Oromo language with practical applications and scholarly guidance.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit Fiqh Section
              </Button>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Scholar Consultation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get answers to your fiqh questions from qualified Islamic scholars and jurists.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <MessageCircle size={14} className="mr-2" />
                Ask a Scholar
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Live According to Islamic Law</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Master <span className="text-primary">Islamic Jurisprudence</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Begin your journey of understanding Islamic law and its practical applications 
            in modern life through our comprehensive fiqh program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <Scale size={18} />
              Start Fiqh Course
            </Button>
            <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
              <Users size={18} />
              Join Study Group
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}