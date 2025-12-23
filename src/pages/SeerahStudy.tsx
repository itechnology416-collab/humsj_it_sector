import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  User, 
  BookOpen, 
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Star,
  MapPin,
  Calendar,
  Award,
  Globe,
  MessageCircle,
  FileText,
  Play,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeerahStudy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("mecca");

  const lifePeriods = [
    {
      id: "early",
      title: "Early Life",
      titleArabic: "الحياة المبكرة",
      titleOromo: "Jireenya Jalqabaa",
      period: "570-610 CE",
      age: "Birth - 40 years",
      location: "Mecca",
      keyEvents: ["Birth and orphanhood", "Childhood with Halima", "Marriage to Khadijah", "The Trustworthy (Al-Amin)"],
      color: "from-blue-500 to-cyan-500",
      description: "The formative years before prophethood"
    },
    {
      id: "mecca",
      title: "Meccan Period",
      titleArabic: "الفترة المكية",
      titleOromo: "Yeroo Makkaa",
      period: "610-622 CE",
      age: "40 - 52 years",
      location: "Mecca",
      keyEvents: ["First revelation", "Secret preaching", "Public preaching", "Persecution and boycott"],
      color: "from-green-500 to-emerald-500",
      description: "The beginning of the prophetic mission"
    },
    {
      id: "medina",
      title: "Medinan Period",
      titleArabic: "الفترة المدنية",
      titleOromo: "Yeroo Madiinaa",
      period: "622-632 CE",
      age: "52 - 63 years",
      location: "Medina",
      keyEvents: ["Hijra migration", "Constitution of Medina", "Major battles", "Conquest of Mecca"],
      color: "from-purple-500 to-violet-500",
      description: "Establishing the Islamic state and community"
    }
  ];

  const keyBattles = [
    {
      name: "Battle of Badr",
      nameArabic: "غزوة بدر",
      nameOromo: "Lola Badr",
      date: "624 CE",
      result: "Muslim Victory",
      significance: "First major victory, divine support demonstrated",
      participants: "313 Muslims vs 1000 Meccans"
    },
    {
      name: "Battle of Uhud",
      nameArabic: "غزوة أحد",
      nameOromo: "Lola Uhud",
      date: "625 CE",
      result: "Partial Defeat",
      significance: "Lessons in obedience and trust in Allah",
      participants: "700 Muslims vs 3000 Meccans"
    },
    {
      name: "Battle of the Trench",
      nameArabic: "غزوة الخندق",
      nameOromo: "Lola Boolla",
      date: "627 CE",
      result: "Muslim Victory",
      significance: "Strategic defense, end of major threats",
      participants: "3000 Muslims vs 10000 Confederates"
    }
  ];

  const propheticQualities = [
    {
      quality: "Truthfulness",
      arabic: "الصدق",
      oromo: "Dhugaa",
      description: "Known as 'As-Sadiq' (The Truthful) even before Islam",
      examples: ["Never told a lie", "Enemies acknowledged his honesty", "Trustworthy in business"]
    },
    {
      quality: "Trustworthiness",
      arabic: "الأمانة",
      oromo: "Amanamummaa",
      description: "Called 'Al-Amin' (The Trustworthy) by his people",
      examples: ["Kept enemies' trusts", "Reliable in all dealings", "Chosen as arbitrator"]
    },
    {
      quality: "Compassion",
      arabic: "الرحمة",
      oromo: "Gara Laafina",
      description: "Mercy to all creation, especially the weak",
      examples: ["Kind to children", "Gentle with animals", "Forgave enemies"]
    },
    {
      quality: "Justice",
      arabic: "العدل",
      oromo: "Haqummaa",
      description: "Fair treatment regardless of social status",
      examples: ["Equal justice for all", "Protected minorities", "Fair in judgments"]
    }
  ];

  const studyModules = [
    {
      title: "Prophetic Character",
      description: "Study the noble character and qualities of Prophet Muhammad (ﷺ)",
      duration: "6 weeks",
      topics: ["Moral excellence", "Leadership qualities", "Family relations", "Social interactions"],
      level: "Beginner",
      color: "bg-green-500/20 text-green-600"
    },
    {
      title: "Historical Context",
      description: "Understand the social and political environment of 7th century Arabia",
      duration: "8 weeks",
      topics: ["Pre-Islamic Arabia", "Tribal society", "Economic conditions", "Religious landscape"],
      level: "Intermediate",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      title: "Lessons and Applications",
      description: "Extract practical lessons for modern Muslim life",
      duration: "10 weeks",
      topics: ["Leadership principles", "Conflict resolution", "Community building", "Personal development"],
      level: "Advanced",
      color: "bg-purple-500/20 text-purple-600"
    }
  ];

  return (
    <PageLayout 
      title="Seerah Study Center" 
      subtitle="Prophetic Biography - Learning from the Life of Prophet Muhammad (ﷺ)"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <User size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Siiraa <span className="text-primary">Nabiyyaa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the life, character, and teachings of Prophet Muhammad (ﷺ) through comprehensive biographical study. 
              Learn from the perfect example of human conduct and leadership.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Seerah Section
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <BookOpen size={18} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Life Periods */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Periods of <span className="text-primary">Prophetic Life</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the different phases of Prophet Muhammad's (ﷺ) life and mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifePeriods.map((period, index) => (
              <div 
                key={period.id}
                className={`bg-card rounded-xl p-6 border transition-all duration-300 cursor-pointer animate-slide-up ${
                  selectedPeriod === period.id 
                    ? "border-primary/50 bg-primary/5 scale-105" 
                    : "border-border/30 hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedPeriod(period.id)}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${period.color} flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{period.title}</h3>
                  <p className="text-lg font-arabic text-primary mb-1">{period.titleArabic}</p>
                  <p className="text-sm text-muted-foreground">{period.titleOromo}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Period:</span>
                    <span className="font-medium">{period.period}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{period.age}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{period.location}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-center mb-4">{period.description}</p>
                
                <div className="space-y-2">
                  {period.keyEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle size={10} className="text-primary" />
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Battles */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Major <span className="text-primary">Battles</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn from the strategic and spiritual lessons of key military campaigns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyBattles.map((battle, index) => (
              <div 
                key={battle.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg mb-1">{battle.name}</h3>
                  <p className="text-lg font-arabic text-primary mb-1">{battle.nameArabic}</p>
                  <p className="text-sm text-muted-foreground">{battle.nameOromo}</p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{battle.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Result:</span>
                    <span className={`font-medium ${
                      battle.result.includes('Victory') ? 'text-green-600' : 
                      battle.result.includes('Defeat') ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {battle.result}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Forces:</span>
                    <p className="font-medium text-xs mt-1">{battle.participants}</p>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{battle.significance}</p>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <BookOpen size={12} className="mr-2" />
                  Study Details
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Prophetic Qualities */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Noble <span className="text-primary">Character</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The exemplary qualities that made Prophet Muhammad (ﷺ) the perfect role model
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {propheticQualities.map((quality, index) => (
              <div 
                key={quality.quality}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{quality.quality}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-arabic text-primary">{quality.arabic}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{quality.oromo}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{quality.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">Examples:</p>
                  {quality.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <ArrowRight size={12} className="text-primary" />
                      {example}
                    </div>
                  ))}
                </div>
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
              Comprehensive courses covering different aspects of prophetic biography
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyModules.map((module, index) => (
              <div 
                key={module.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${module.color}`}>
                    {module.level}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{module.duration}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                
                <div className="space-y-2 mb-6">
                  {module.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {topic}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Start Module
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              Learning <span className="text-primary">Resources</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive materials for studying the prophetic biography
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Interactive Timeline",
                description: "Visual journey through the Prophet's life",
                icon: Calendar,
                color: "text-blue-600"
              },
              {
                title: "Historical Maps",
                description: "Geographic context of key events",
                icon: MapPin,
                color: "text-green-600"
              },
              {
                title: "Audio Lectures",
                description: "Listen to scholarly presentations",
                icon: Play,
                color: "text-purple-600"
              },
              {
                title: "Study Materials",
                description: "Downloadable guides and worksheets",
                icon: Download,
                color: "text-orange-600"
              }
            ].map((resource, index) => (
              <div 
                key={resource.title}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 mx-auto">
                  <resource.icon size={24} className={resource.color} />
                </div>
                <h4 className="font-semibold mb-2">{resource.title}</h4>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
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
              Connect with authentic Islamic educational platforms for comprehensive Seerah study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-primary" />
              </div>
              <h4 className="font-semibold mb-2">TVIslaamaa Seerah Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive prophetic biography studies in Oromo language with authentic sources and scholarly analysis.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit Seerah Section
              </Button>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <FileText size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Research Library</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Access authentic biographical sources, historical documents, and scholarly research on the Prophet's life.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen size={14} className="mr-2" />
                Browse Library
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Follow the Prophetic Example</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Learn from the <span className="text-primary">Best of Creation</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Begin your journey of studying the life and character of Prophet Muhammad (ﷺ) 
            and discover timeless lessons for personal and spiritual development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <User size={18} />
              Start Seerah Course
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