import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Play, 
  Download, 
  ExternalLink,
  Volume2,
  Search,
  Bookmark,
  Star,
  Clock,
  Users,
  Globe,
  Heart,
  CheckCircle,
  ArrowRight,
  Headphones,
  FileText,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function QuranStudy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  const featuredSurahs = [
    {
      number: 1,
      name: "Al-Fatiha",
      nameArabic: "الفاتحة",
      nameOromo: "Jalqaba",
      verses: 7,
      type: "Meccan",
      description: "The Opening - The foundation of all prayers and the essence of the Quran",
      themes: ["Prayer", "Guidance", "Worship", "Divine Mercy"]
    },
    {
      number: 2,
      name: "Al-Baqarah",
      nameArabic: "البقرة",
      nameOromo: "Sa'a",
      verses: 286,
      type: "Medinan",
      description: "The Cow - Comprehensive guidance for Muslim community life",
      themes: ["Law", "Community", "Faith", "History"]
    },
    {
      number: 18,
      name: "Al-Kahf",
      nameArabic: "الكهف",
      nameOromo: "Holqa",
      verses: 110,
      type: "Meccan",
      description: "The Cave - Stories of faith, patience, and divine protection",
      themes: ["Stories", "Faith", "Patience", "Protection"]
    },
    {
      number: 36,
      name: "Ya-Sin",
      nameArabic: "يس",
      nameOromo: "Yaa Siin",
      verses: 83,
      type: "Meccan",
      description: "Ya-Sin - The heart of the Quran, focusing on resurrection and divine signs",
      themes: ["Resurrection", "Signs", "Prophethood", "Afterlife"]
    }
  ];

  const studyResources = [
    {
      title: "Quranic Recitation",
      description: "Learn proper Tajweed and recitation techniques",
      icon: Volume2,
      color: "bg-blue-500/20 text-blue-600",
      features: ["Audio lessons", "Pronunciation guide", "Tajweed rules", "Practice exercises"]
    },
    {
      title: "Tafsir & Commentary",
      description: "Deep understanding through scholarly interpretations",
      icon: BookOpen,
      color: "bg-green-500/20 text-green-600",
      features: ["Classical tafsir", "Modern commentary", "Historical context", "Linguistic analysis"]
    },
    {
      title: "Memorization Program",
      description: "Structured Hifz program for all levels",
      icon: Star,
      color: "bg-purple-500/20 text-purple-600",
      features: ["Daily schedules", "Review system", "Progress tracking", "Certification"]
    },
    {
      title: "Translation Studies",
      description: "Multilingual translations and meanings",
      icon: Globe,
      color: "bg-orange-500/20 text-orange-600",
      features: ["Oromo translation", "English translation", "Arabic text", "Word-by-word meaning"]
    }
  ];

  const learningLevels = [
    {
      level: "Beginner",
      title: "Foundation Level",
      description: "Start your Quranic journey with basic Arabic and simple surahs",
      duration: "3-6 months",
      topics: ["Arabic alphabet", "Basic pronunciation", "Short surahs", "Daily prayers"],
      color: "from-green-500 to-emerald-500"
    },
    {
      level: "Intermediate",
      title: "Development Level", 
      description: "Build understanding through tafsir and longer surahs",
      duration: "6-12 months",
      topics: ["Tajweed rules", "Medium surahs", "Basic tafsir", "Islamic history"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      level: "Advanced",
      title: "Mastery Level",
      description: "Deep study of complex themes and scholarly interpretations",
      duration: "1-2 years",
      topics: ["Advanced tafsir", "Quranic sciences", "Comparative studies", "Teaching methods"],
      color: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <PageLayout 
      title="Quran Study Center" 
      subtitle="Comprehensive Quranic education in Oromo, Arabic, and English"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <BookOpen size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Qur'aan <span className="text-primary">Barumsaa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Comprehensive Quranic education platform offering structured learning in Oromo, Arabic, and English. 
              Connect with authentic Islamic knowledge through our partnership with TVIslaamaa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Quran Section
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <Play size={18} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Surahs */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Featured <span className="text-primary">Surahs</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Begin your study with these essential chapters of the Holy Quran
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredSurahs.map((surah, index) => (
              <div 
                key={surah.number}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedSurah(surah.number)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{surah.number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{surah.name}</h3>
                      <p className="text-sm text-muted-foreground">{surah.nameOromo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-arabic text-primary mb-1">{surah.nameArabic}</p>
                    <p className="text-xs text-muted-foreground">{surah.verses} verses • {surah.type}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{surah.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {surah.themes.map((theme) => (
                    <span key={theme} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                      {theme}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play size={14} className="mr-1" />
                    Listen
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen size={14} className="mr-1" />
                    Read
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileText size={14} className="mr-1" />
                    Study
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Resources */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Study <span className="text-primary">Resources</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and materials for effective Quranic learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyResources.map((resource, index) => (
              <div 
                key={resource.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center mb-4`}>
                  <resource.icon size={24} />
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                <div className="space-y-2">
                  {resource.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle size={12} className="text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Levels */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Learning <span className="text-primary">Levels</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured progression from basic recitation to advanced Quranic sciences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningLevels.map((level, index) => (
              <div 
                key={level.level}
                className="bg-card rounded-xl p-8 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${level.color} flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{level.title}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{level.level}</p>
                  <p className="text-muted-foreground mb-4">{level.description}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{level.duration}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {level.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <ArrowRight size={12} className="text-primary" />
                      {topic}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary">
                  Start {level.level} Level
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              External <span className="text-primary">Resources</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access additional Quranic learning materials from trusted Islamic educational platforms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">TVIslaamaa Quran Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive Quranic studies in Oromo language with authentic translations and commentary.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit Portal
              </Button>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Headphones size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Audio Recitations</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Listen to beautiful Quranic recitations by renowned Qaris with Oromo translations.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Volume2 size={14} className="mr-2" />
                Listen Now
              </Button>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <Video size={24} className="text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Video Lessons</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Interactive video lessons covering Tajweed, Tafsir, and Quranic Arabic.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Play size={14} className="mr-2" />
                Watch Videos
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Start Your Quranic Journey Today</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Begin Your <span className="text-primary">Quranic Studies</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students learning the Holy Quran through our comprehensive program. 
            Start with basic recitation or advance your existing knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <BookOpen size={18} />
              Start Free Trial
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