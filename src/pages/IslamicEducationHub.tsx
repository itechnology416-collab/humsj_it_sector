import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { 
  BookOpen, 
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Star,
  Globe,
  MessageCircle,
  FileText,
  Play,
  Download,
  Award,
  Target,
  Lightbulb,
  Shield,
  Scale,
  User,
  Scroll,
  GraduationCap,
  Calendar,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IslamicEducationHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const educationCategories = [
    {
      id: "quran",
      title: "Qur'aan Study",
      titleArabic: "دراسة القرآن",
      titleOromo: "Barnoota Qur'aanaa",
      description: "Comprehensive Quranic education with recitation, memorization, and understanding",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      route: "/quran-study",
      topics: ["Tajweed", "Memorization", "Tafsir", "Translation"],
      level: "All Levels",
      duration: "Ongoing"
    },
    {
      id: "aqeedah",
      title: "Aqiidaa Study",
      titleArabic: "دراسة العقيدة",
      titleOromo: "Barnoota Aqiidaa",
      description: "Islamic creed and theology - building strong foundation of faith",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      route: "/aqeedah-study",
      topics: ["Six Pillars of Iman", "Tawheed", "Comparative Theology", "Contemporary Issues"],
      level: "Beginner to Advanced",
      duration: "6-12 months"
    },
    {
      id: "hadith",
      title: "Hadiisa Study",
      titleArabic: "دراسة الحديث",
      titleOromo: "Barnoota Hadiisaa",
      description: "Prophetic traditions - learning from the Sunnah of Prophet Muhammad (ﷺ)",
      icon: Scroll,
      color: "from-purple-500 to-violet-500",
      route: "/hadith-study",
      topics: ["Sahih Collections", "Hadith Sciences", "Authentication", "Application"],
      level: "Intermediate to Advanced",
      duration: "8-16 months"
    },
    {
      id: "fiqh",
      title: "Fiqhii Study",
      titleArabic: "دراسة الفقه",
      titleOromo: "Barnoota Fiqhii",
      description: "Islamic jurisprudence - practical application of Islamic law",
      icon: Scale,
      color: "from-orange-500 to-red-500",
      route: "/fiqh-study",
      topics: ["Worship", "Transactions", "Family Law", "Contemporary Issues"],
      level: "Beginner to Advanced",
      duration: "10-20 months"
    },
    {
      id: "seerah",
      title: "Siiraa Study",
      titleArabic: "دراسة السيرة",
      titleOromo: "Barnoota Siiraa",
      description: "Prophetic biography - learning from the life of Prophet Muhammad (ﷺ)",
      icon: User,
      color: "from-indigo-500 to-purple-500",
      route: "/seerah-study",
      topics: ["Early Life", "Meccan Period", "Medinan Period", "Character Study"],
      level: "All Levels",
      duration: "6-12 months"
    },
    {
      id: "arabic",
      title: "Arabic Language",
      titleArabic: "اللغة العربية",
      titleOromo: "Afaan Arabaa",
      description: "Learn Arabic language for better understanding of Islamic texts",
      icon: MessageCircle,
      color: "from-pink-500 to-rose-500",
      route: "/arabic-study",
      topics: ["Grammar", "Vocabulary", "Reading", "Quranic Arabic"],
      level: "Beginner to Advanced",
      duration: "12-24 months"
    }
  ];

  const learningPaths = [
    {
      title: "Foundation Path",
      description: "Essential Islamic knowledge for every Muslim",
      duration: "6-12 months",
      courses: ["Basic Aqeedah", "Quran Basics", "Prayer & Worship", "Prophetic Character"],
      level: "Beginner",
      color: "bg-green-500/20 text-green-600"
    },
    {
      title: "Scholar Path",
      description: "Comprehensive Islamic studies for advanced learners",
      duration: "2-3 years",
      courses: ["Advanced Aqeedah", "Hadith Sciences", "Fiqh Principles", "Comparative Studies"],
      level: "Advanced",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      title: "Da'wah Path",
      description: "Prepare for Islamic outreach and teaching",
      duration: "1-2 years",
      courses: ["Comparative Religion", "Communication Skills", "Contemporary Issues", "Teaching Methods"],
      level: "Intermediate",
      color: "bg-purple-500/20 text-purple-600"
    }
  ];

  const features = [
    {
      title: "Multilingual Learning",
      description: "Study in Oromo, Arabic, and English",
      icon: Globe,
      color: "text-blue-600"
    },
    {
      title: "Expert Instructors",
      description: "Learn from qualified Islamic scholars",
      icon: GraduationCap,
      color: "text-green-600"
    },
    {
      title: "Flexible Schedule",
      description: "Self-paced learning with live sessions",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Interactive Content",
      description: "Engaging multimedia learning materials",
      icon: Play,
      color: "text-orange-600"
    },
    {
      title: "Community Support",
      description: "Join study groups and discussion forums",
      icon: Users,
      color: "text-pink-600"
    },
    {
      title: "Certification",
      description: "Earn certificates upon course completion",
      icon: Award,
      color: "text-indigo-600"
    }
  ];

  const filteredCategories = selectedCategory === "all" 
    ? educationCategories 
    : educationCategories.filter(cat => cat.id === selectedCategory);

  return (
    <PublicPageLayout 
      title="Islamic Education Hub" 
      subtitle="Comprehensive Islamic Learning Platform - Barnoota Islaamaa"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <GraduationCap size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Islamic <span className="text-primary">Education Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Your comprehensive platform for authentic Islamic education. Study Quran, Hadith, Fiqh, Aqeedah, and Seerah 
              with expert guidance in Oromo, Arabic, and English languages.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Portal
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <BookOpen size={18} />
                Explore Courses
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Study Areas", value: "6+", icon: BookOpen, color: "text-blue-600" },
            { label: "Learning Paths", value: "3", icon: Target, color: "text-green-600" },
            { label: "Languages", value: "3", icon: Globe, color: "text-purple-600" },
            { label: "Certificates", value: "Available", icon: Award, color: "text-orange-600" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 mx-auto">
                <stat.icon size={24} className={stat.color} />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Study Categories */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Study <span className="text-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive Islamic education covering all essential areas of knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationCategories.map((category, index) => (
              <div 
                key={category.id}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(category.route)}
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
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{category.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{category.duration}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {category.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                      {topic}
                    </span>
                  ))}
                  {category.topics.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground">
                      +{category.topics.length - 3} more
                    </span>
                  )}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  <ArrowRight size={14} className="mr-2" />
                  Start Learning
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Learning <span className="text-primary">Paths</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured learning journeys designed for different goals and experience levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <div 
                key={path.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${path.color}`}>
                    {path.level}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{path.duration}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                <p className="text-muted-foreground mb-4">{path.description}</p>
                
                <div className="space-y-2 mb-6">
                  {path.courses.map((course, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {course}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full">
                  <Target size={14} className="mr-2" />
                  Choose This Path
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Platform <span className="text-primary">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for effective Islamic education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TVIslaamaa Partnership */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              Partnership with <span className="text-primary">TVIslaamaa</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access authentic Islamic education content in Oromo language through our partnership with TVIslaamaa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <Globe size={32} className="text-primary" />
              </div>
              <h4 className="font-semibold text-lg mb-3">TVIslaamaa Portal</h4>
              <p className="text-muted-foreground mb-4">
                Comprehensive Islamic education platform offering courses in Quran, Aqeedah, Hadith, Fiqh, 
                Arabic Grammar, Seerah, Islamic Education, and Guidance - all in Oromo language.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  "Qur'aan - Quranic Studies",
                  "Aqiidaa - Islamic Creed", 
                  "Hadiisa - Prophetic Traditions",
                  "Fiqhii - Islamic Jurisprudence",
                  "Nahwii - Arabic Grammar",
                  "Siiraa - Prophetic Biography",
                  "Tarbiyaa - Islamic Education",
                  "Gorsa - Islamic Guidance"
                ].map((subject, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={12} className="text-primary" />
                    {subject}
                  </div>
                ))}
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Visit TVIslaamaa Portal
              </Button>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30">
              <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                <Zap size={32} className="text-secondary" />
              </div>
              <h4 className="font-semibold text-lg mb-3">Enhanced Learning</h4>
              <p className="text-muted-foreground mb-4">
                Our platform enhances the TVIslaamaa content with interactive features, 
                progress tracking, community discussions, and multilingual support.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  "Interactive study materials",
                  "Progress tracking system",
                  "Community discussion forums",
                  "Multilingual translations",
                  "Mobile-friendly interface",
                  "Offline content access",
                  "Personalized learning paths",
                  "Expert instructor support"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Star size={12} className="text-secondary" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                <Lightbulb size={16} className="mr-2" />
                Explore Features
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Begin Your Islamic Learning Journey</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Deepen Your <span className="text-primary">Islamic Knowledge</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students learning authentic Islamic knowledge through our comprehensive 
            education platform. Start with any subject that interests you most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <GraduationCap size={18} />
              Start Learning Today
            </Button>
            <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
              <Users size={18} />
              Join Study Community
            </Button>
          </div>
        </div>

        {/* Comprehensive Islamic Learning Framework */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/20 mt-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Comprehensive Islamic Learning Framework</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A structured approach to Islamic education covering all essential aspects of faith, practice, and character development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Core Islamic Sciences */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span>
                Core Islamic Sciences (Ulum al-Din)
              </h3>
              <div className="space-y-4">
                {[
                  {
                    science: "Quran Studies (Ulum al-Quran)",
                    description: "Understanding the Holy Quran through various disciplines",
                    branches: ["Tafsir (Exegesis)", "Tajweed (Recitation)", "Qira'at (Readings)", "Asbab al-Nuzul (Occasions of Revelation)"],
                    importance: "The Quran is the primary source of Islamic guidance"
                  },
                  {
                    science: "Hadith Studies (Ulum al-Hadith)",
                    description: "Study of Prophetic traditions and their authentication",
                    branches: ["Mustalah al-Hadith (Hadith Terminology)", "Rijal (Narrator Criticism)", "Takhrij (Authentication)", "Sharh (Commentary)"],
                    importance: "Hadith explains and elaborates Quranic teachings"
                  },
                  {
                    science: "Islamic Jurisprudence (Fiqh)",
                    description: "Practical application of Islamic law in daily life",
                    branches: ["Worship (Ibadat)", "Transactions (Muamalat)", "Family Law (Ahwal Shakhsiyyah)", "Criminal Law (Jinayat)"],
                    importance: "Provides practical guidance for Muslim conduct"
                  },
                  {
                    science: "Islamic Theology (Aqeedah)",
                    description: "Study of Islamic beliefs and creed",
                    branches: ["Tawhid (Unity of God)", "Prophethood (Risalah)", "Afterlife (Akhirah)", "Divine Attributes (Sifat)"],
                    importance: "Forms the foundation of Islamic faith"
                  }
                ].map((science, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{science.science}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{science.description}</p>
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2">Key Branches:</p>
                      <ul className="text-xs space-y-1">
                        {science.branches.map((branch, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2">
                            <CheckCircle size={10} className="text-accent" />
                            {branch}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-accent italic">{science.importance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Methodologies */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Islamic Learning Methodologies
              </h3>
              <div className="space-y-4">
                {[
                  {
                    method: "Halaqah (Study Circles)",
                    description: "Traditional Islamic learning in small groups",
                    benefits: ["Interactive discussion", "Peer learning", "Teacher-student bond", "Community building"],
                    hadith: "No people gather in one of the houses of Allah, reciting the Book of Allah and studying it among themselves, except that tranquility descends upon them",
                    reference: "Muslim"
                  },
                  {
                    method: "Ijazah System",
                    description: "Traditional certification system for Islamic knowledge",
                    benefits: ["Authenticated knowledge chain", "Quality assurance", "Scholarly recognition", "Preservation of tradition"],
                    hadith: "This knowledge will be carried by the trustworthy ones of every generation",
                    reference: "Bayhaqi"
                  },
                  {
                    method: "Memorization (Hifz)",
                    description: "Memorizing Quran and key Islamic texts",
                    benefits: ["Heart purification", "Mental discipline", "Spiritual connection", "Knowledge preservation"],
                    hadith: "The one who recites the Quran and is skilled in it will be with the noble and obedient scribes",
                    reference: "Bukhari, Muslim"
                  },
                  {
                    method: "Practical Application (Tatbiq)",
                    description: "Implementing learned knowledge in daily life",
                    benefits: ["Character development", "Spiritual growth", "Community impact", "Knowledge retention"],
                    hadith: "The example of guidance and knowledge with which Allah has sent me is like abundant rain",
                    reference: "Bukhari, Muslim"
                  }
                ].map((method, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{method.method}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2">Benefits:</p>
                      <ul className="text-xs space-y-1">
                        {method.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2">
                            <Star size={10} className="text-accent" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                      "{method.hadith}"
                    </blockquote>
                    <p className="text-xs text-accent font-medium">- {method.reference}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Character Development */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Character Development (Tazkiyah)
              </h3>
              <div className="space-y-4">
                {[
                  {
                    aspect: "Spiritual Purification (Tazkiyah al-Nafs)",
                    description: "Purifying the soul from negative traits",
                    practices: ["Regular dhikr", "Night prayers", "Fasting", "Charity", "Self-reflection"],
                    goal: "Achieving spiritual excellence and closeness to Allah"
                  },
                  {
                    aspect: "Moral Excellence (Ihsan)",
                    description: "Striving for the highest level of worship and character",
                    practices: ["Mindful worship", "Excellent treatment of others", "Continuous improvement", "Seeking Allah's pleasure"],
                    goal: "Worshipping Allah as if you see Him"
                  },
                  {
                    aspect: "Social Responsibility (Mas'uliyyah)",
                    description: "Understanding one's duties toward society",
                    practices: ["Community service", "Justice advocacy", "Knowledge sharing", "Environmental care"],
                    goal: "Being beneficial members of society"
                  },
                  {
                    aspect: "Leadership Development (Qiyadah)",
                    description: "Developing Islamic leadership qualities",
                    practices: ["Leading by example", "Consultation (Shura)", "Justice and fairness", "Servant leadership"],
                    goal: "Becoming effective leaders who serve Allah and humanity"
                  }
                ].map((aspect, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{aspect.aspect}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{aspect.description}</p>
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2">Key Practices:</p>
                      <ul className="text-xs space-y-1">
                        {aspect.practices.map((practice, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-2">
                            <Heart size={10} className="text-accent" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-accent font-medium">
                      <strong>Ultimate Goal:</strong> {aspect.goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Education Resources & Tools */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Lightbulb size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Educational Resources & Learning Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive collection of authentic Islamic educational resources and modern learning tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: "Primary Sources",
                description: "Authentic Islamic texts and references",
                resources: [
                  "Quran with multiple translations",
                  "Sahih Bukhari & Muslim",
                  "Sunan collections",
                  "Classical Tafsir works",
                  "Fiqh manuals"
                ],
                icon: "📚",
                color: "from-green-500 to-emerald-500"
              },
              {
                category: "Digital Tools",
                description: "Modern technology for Islamic learning",
                resources: [
                  "Quran apps with audio",
                  "Hadith search engines",
                  "Prayer time calculators",
                  "Qibla direction finders",
                  "Islamic calendar apps"
                ],
                icon: "📱",
                color: "from-blue-500 to-cyan-500"
              },
              {
                category: "Learning Materials",
                description: "Educational content and study aids",
                resources: [
                  "Video lectures",
                  "Audio recordings",
                  "Interactive quizzes",
                  "Study guides",
                  "Infographics"
                ],
                icon: "🎥",
                color: "from-purple-500 to-violet-500"
              },
              {
                category: "Community Resources",
                description: "Collaborative learning and support",
                resources: [
                  "Study groups",
                  "Mentorship programs",
                  "Discussion forums",
                  "Peer tutoring",
                  "Expert consultations"
                ],
                icon: "👥",
                color: "from-amber-500 to-yellow-500"
              }
            ].map((category, idx) => (
              <div key={idx} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{category.icon}</span>
                  <h3 className="text-lg font-semibold text-primary">{category.category}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div>
                  <p className="text-xs font-semibold mb-2">Available Resources:</p>
                  <ul className="text-xs space-y-1">
                    {category.resources.map((resource, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <CheckCircle size={10} className="text-accent" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Educational Resources */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Globe size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-display tracking-wide mb-4">External Educational Resources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access valuable Islamic educational content from renowned scholars and institutions worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Dr. Zakir Naik YouTube Channel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <Play size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  Dr. Zakir Naik Channel
                </h3>
                <p className="text-sm text-muted-foreground">YouTube Educational Content</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Comprehensive Islamic lectures, Q&A sessions, and comparative religion discussions 
              by renowned Islamic scholar Dr. Zakir Naik with logical and scientific approach.
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle size={12} className="text-green-500" />
                <span>Islamic lectures and Q&A</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle size={12} className="text-green-500" />
                <span>Comparative religion studies</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle size={12} className="text-green-500" />
                <span>Scientific approach to Islam</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle size={12} className="text-green-500" />
                <span>Multiple languages available</span>
              </div>
            </div>

            <Button
              onClick={() => window.open('https://www.youtube.com/@Drzakirchannel', '_blank')}
              className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              <Play size={16} />
              Watch Videos
            </Button>
          </div>

          {/* Placeholder for future resources */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 border-dashed opacity-60">
            <div className="text-center py-8">
              <BookOpen size={32} className="mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-2">More Resources Coming</h3>
              <p className="text-sm text-muted-foreground">
                Additional educational resources will be added soon.
              </p>
            </div>
          </div>

          {/* Placeholder for suggestions */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 border-dashed opacity-60">
            <div className="text-center py-8">
              <Lightbulb size={32} className="mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-2">Suggest Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Know valuable Islamic educational content? Share with us.
              </p>
              <Button size="sm" variant="outline">
                Suggest Resource
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}