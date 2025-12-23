import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Shield, 
  Star, 
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
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AqeedahStudy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const coreBeliefs = [
    {
      id: "tawheed",
      title: "Tawheed",
      titleArabic: "التوحيد",
      titleOromo: "Tokkummaa Rabbii",
      description: "The fundamental belief in the absolute oneness and uniqueness of Allah",
      details: "Understanding Allah's unity in His essence, attributes, and actions",
      verses: ["Say: He is Allah, the One! (112:1)", "There is no god but Allah (47:19)"],
      color: "from-blue-500 to-cyan-500",
      icon: Star
    },
    {
      id: "angels",
      title: "Angels",
      titleArabic: "الملائكة",
      titleOromo: "Malaayikaa",
      description: "Belief in the existence and roles of angels as Allah's messengers",
      details: "Understanding the nature, duties, and significance of angels in Islam",
      verses: ["The Messenger believes in what was revealed to him from his Lord, as do the believers. Each believes in Allah, His angels... (2:285)"],
      color: "from-green-500 to-emerald-500",
      icon: Shield
    },
    {
      id: "books",
      title: "Divine Books",
      titleArabic: "الكتب السماوية",
      titleOromo: "Kitaabota Samii",
      description: "Belief in all revealed scriptures, with the Quran as the final revelation",
      details: "Understanding the role and preservation of divine revelations",
      verses: ["This is the Book about which there is no doubt (2:2)"],
      color: "from-purple-500 to-violet-500",
      icon: BookOpen
    },
    {
      id: "prophets",
      title: "Prophets",
      titleArabic: "الرسل والأنبياء",
      titleOromo: "Rasuulotaa fi Nabiyoota",
      description: "Belief in all prophets and messengers, with Muhammad (ﷺ) as the final prophet",
      details: "Understanding the role of prophets in guiding humanity",
      verses: ["Muhammad is not the father of any of your men, but the Messenger of Allah and the last of the prophets (33:40)"],
      color: "from-orange-500 to-red-500",
      icon: Users
    },
    {
      id: "judgment",
      title: "Day of Judgment",
      titleArabic: "يوم الدين",
      titleOromo: "Guyyaa Murtii",
      description: "Belief in the resurrection, judgment, and eternal life in paradise or hell",
      details: "Understanding accountability and the afterlife",
      verses: ["That Day, people will proceed in scattered groups to be shown their deeds (99:6)"],
      color: "from-red-500 to-pink-500",
      icon: Target
    },
    {
      id: "qadar",
      title: "Divine Decree",
      titleArabic: "القدر",
      titleOromo: "Qadarii Rabbii",
      description: "Belief in Allah's complete knowledge and decree of all things",
      details: "Understanding predestination while maintaining human responsibility",
      verses: ["And Allah created you and what you do (37:96)"],
      color: "from-indigo-500 to-purple-500",
      icon: Award
    }
  ];

  const studyModules = [
    {
      title: "Foundation of Faith",
      description: "Essential beliefs every Muslim must know",
      duration: "4 weeks",
      topics: ["Six pillars of Iman", "Names and attributes of Allah", "Basic creed", "Common misconceptions"],
      level: "Beginner",
      color: "bg-green-500/20 text-green-600"
    },
    {
      title: "Advanced Theology",
      description: "Deep study of Islamic theological concepts",
      duration: "8 weeks", 
      topics: ["Comparative theology", "Philosophical arguments", "Historical development", "Contemporary issues"],
      level: "Advanced",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      title: "Practical Application",
      description: "Living according to correct Islamic beliefs",
      duration: "6 weeks",
      topics: ["Daily worship", "Character development", "Community relations", "Da'wah methods"],
      level: "Intermediate",
      color: "bg-purple-500/20 text-purple-600"
    }
  ];

  const scholarlyResources = [
    {
      title: "Classical Texts",
      description: "Study authentic works of Islamic scholars",
      resources: ["Kitab at-Tawheed", "Al-Aqeedah al-Wasitiyyah", "Sharh as-Sunnah", "Usul as-Sunnah"],
      icon: BookOpen
    },
    {
      title: "Contemporary Explanations",
      description: "Modern scholarly interpretations and explanations",
      resources: ["Video lectures", "Audio series", "Interactive courses", "Q&A sessions"],
      icon: Video
    },
    {
      title: "Discussion Forums",
      description: "Engage with fellow students and scholars",
      resources: ["Study groups", "Online discussions", "Peer learning", "Mentorship programs"],
      icon: MessageCircle
    }
  ];

  return (
    <PageLayout 
      title="Aqeedah Study Center" 
      subtitle="Islamic Creed and Theology - Building Strong Foundation of Faith"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <Shield size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Aqiidaa <span className="text-primary">Islaamaa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Strengthen your faith through comprehensive study of Islamic creed and theology. 
              Learn the fundamental beliefs that form the foundation of a Muslim's worldview.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Aqeedah Section
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <BookOpen size={18} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Six Pillars of Iman */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Six Pillars of <span className="text-primary">Iman</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The fundamental beliefs that every Muslim must hold in their heart
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreBeliefs.map((belief, index) => (
              <div 
                key={belief.id}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedTopic(belief.id)}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${belief.color} flex items-center justify-center mb-6 mx-auto`}>
                  <belief.icon size={32} className="text-white" />
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{belief.title}</h3>
                  <p className="text-2xl font-arabic text-primary mb-1">{belief.titleArabic}</p>
                  <p className="text-sm text-muted-foreground">{belief.titleOromo}</p>
                </div>
                
                <p className="text-muted-foreground text-center mb-4">{belief.description}</p>
                
                <div className="bg-secondary/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground">{belief.details}</p>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen size={14} className="mr-2" />
                  Study Details
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Study Modules */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Study <span className="text-primary">Modules</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured learning paths for different levels of Islamic theological study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studyModules.map((module, index) => (
              <div 
                key={module.title}
                className="bg-card rounded-xl p-8 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${module.color}`}>
                    {module.level}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{module.duration}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {module.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {topic}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Enroll Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarly Resources */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Scholarly <span className="text-primary">Resources</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access authentic Islamic sources and contemporary explanations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarlyResources.map((resource, index) => (
              <div 
                key={resource.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <resource.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                <div className="space-y-2">
                  {resource.resources.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight size={10} className="text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Learning Outcomes */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              Learning <span className="text-primary">Outcomes</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What you will achieve through comprehensive Aqeedah study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Strong Foundation",
                description: "Build unshakeable faith based on authentic Islamic sources",
                icon: Shield,
                color: "text-blue-600"
              },
              {
                title: "Clear Understanding",
                description: "Distinguish between authentic beliefs and innovations",
                icon: Lightbulb,
                color: "text-green-600"
              },
              {
                title: "Practical Application",
                description: "Apply correct beliefs in daily worship and life",
                icon: Target,
                color: "text-purple-600"
              },
              {
                title: "Da'wah Preparation",
                description: "Share and defend Islamic beliefs with knowledge",
                icon: Globe,
                color: "text-orange-600"
              }
            ].map((outcome, index) => (
              <div 
                key={outcome.title}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 mx-auto">
                  <outcome.icon size={24} className={outcome.color} />
                </div>
                <h4 className="font-semibold mb-2">{outcome.title}</h4>
                <p className="text-sm text-muted-foreground">{outcome.description}</p>
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
              Connect with authentic Islamic educational platforms for deeper study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-primary" />
              </div>
              <h4 className="font-semibold mb-2">TVIslaamaa Aqeedah Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive Islamic creed studies in Oromo language with authentic scholarly explanations.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit Aqeedah Section
              </Button>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <FileText size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Study Materials</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download comprehensive study guides, worksheets, and reference materials for offline study.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen size={14} className="mr-2" />
                Download Materials
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Strengthen Your Faith Today</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Deepen Your <span className="text-primary">Islamic Knowledge</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our comprehensive Aqeedah program and build a strong foundation of Islamic beliefs 
            based on authentic sources and scholarly guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <Shield size={18} />
              Start Aqeedah Course
            </Button>
            <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
              <Users size={18} />
              Join Study Circle
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}