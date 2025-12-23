import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  MessageCircle, 
  BookOpen, 
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Star,
  Globe,
  FileText,
  Play,
  Award,
  Target,
  Lightbulb,
  Volume2,
  Edit,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArabicStudy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLevel, setSelectedLevel] = useState("beginner");

  const learningLevels = [
    {
      id: "beginner",
      title: "Beginner Level",
      titleArabic: "المستوى المبتدئ",
      titleOromo: "Sadarkaa Jalqabaa",
      description: "Start your Arabic journey with basic alphabet and simple words",
      duration: "3-6 months",
      topics: ["Arabic Alphabet", "Basic Pronunciation", "Simple Words", "Numbers & Colors"],
      color: "from-green-500 to-emerald-500",
      skills: ["Reading", "Writing", "Basic Vocabulary"]
    },
    {
      id: "intermediate",
      title: "Intermediate Level", 
      titleArabic: "المستوى المتوسط",
      titleOromo: "Sadarkaa Giddugaleessaa",
      description: "Build grammar foundation and expand vocabulary",
      duration: "6-12 months",
      topics: ["Grammar Rules", "Sentence Structure", "Verb Conjugation", "Common Phrases"],
      color: "from-blue-500 to-cyan-500",
      skills: ["Grammar", "Conversation", "Reading Comprehension"]
    },
    {
      id: "advanced",
      title: "Advanced Level",
      titleArabic: "المستوى المتقدم", 
      titleOromo: "Sadarkaa Olaanaa",
      description: "Master complex grammar and classical Arabic texts",
      duration: "12-24 months",
      topics: ["Classical Arabic", "Poetry", "Advanced Grammar", "Literature"],
      color: "from-purple-500 to-violet-500",
      skills: ["Classical Texts", "Poetry Analysis", "Advanced Writing"]
    },
    {
      id: "quranic",
      title: "Quranic Arabic",
      titleArabic: "العربية القرآنية",
      titleOromo: "Arabii Qur'aanaa",
      description: "Specialized focus on understanding Quranic language",
      duration: "8-16 months",
      topics: ["Quranic Vocabulary", "Classical Grammar", "Tafsir Language", "Morphology"],
      color: "from-orange-500 to-red-500",
      skills: ["Quranic Understanding", "Root Analysis", "Contextual Meaning"]
    }
  ];

  const grammarTopics = [
    {
      title: "Nahw (Grammar)",
      titleArabic: "النحو",
      description: "Study Arabic sentence structure and grammatical rules",
      topics: ["I'rab (Parsing)", "Sentence Types", "Verb Forms", "Noun Cases"],
      icon: Edit
    },
    {
      title: "Sarf (Morphology)",
      titleArabic: "الصرف", 
      description: "Learn word formation and root patterns",
      topics: ["Root System", "Word Patterns", "Verb Conjugation", "Noun Formation"],
      icon: Target
    },
    {
      title: "Balagha (Rhetoric)",
      titleArabic: "البلاغة",
      description: "Master the art of eloquent Arabic expression",
      topics: ["Metaphors", "Rhetorical Devices", "Style Analysis", "Literary Beauty"],
      icon: Lightbulb
    }
  ];

  const practicalSkills = [
    {
      skill: "Reading",
      arabic: "القراءة",
      oromo: "Dubbisuu",
      description: "Develop fluent Arabic reading skills",
      activities: ["Text reading", "Comprehension exercises", "Speed reading", "Classical texts"],
      icon: Eye
    },
    {
      skill: "Writing", 
      arabic: "الكتابة",
      oromo: "Barreessuu",
      description: "Learn to write Arabic beautifully and correctly",
      activities: ["Calligraphy", "Composition", "Grammar exercises", "Creative writing"],
      icon: Edit
    },
    {
      skill: "Speaking",
      arabic: "المحادثة", 
      oromo: "Dubbachuu",
      description: "Practice conversational Arabic skills",
      activities: ["Pronunciation", "Dialogue practice", "Presentations", "Debates"],
      icon: MessageCircle
    },
    {
      skill: "Listening",
      arabic: "الاستماع",
      oromo: "Dhaggeeffachuu", 
      description: "Improve Arabic listening comprehension",
      activities: ["Audio lessons", "Lectures", "Conversations", "Media content"],
      icon: Volume2
    }
  ];

  return (
    <PageLayout 
      title="Arabic Language Study" 
      subtitle="Master Arabic Language - Gateway to Islamic Knowledge"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <MessageCircle size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Afaan <span className="text-primary">Arabaa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Master the Arabic language to unlock deeper understanding of Islamic texts. 
              Learn from basic alphabet to advanced classical Arabic with comprehensive courses.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Arabic Section
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <BookOpen size={18} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Learning Levels */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Learning <span className="text-primary">Levels</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured progression from basic Arabic alphabet to advanced classical texts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningLevels.map((level, index) => (
              <div 
                key={level.id}
                className={`bg-card rounded-xl p-6 border transition-all duration-300 cursor-pointer animate-slide-up ${
                  selectedLevel === level.id 
                    ? "border-primary/50 bg-primary/5 scale-105" 
                    : "border-border/30 hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${level.color} flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{level.title}</h3>
                  <p className="text-lg font-arabic text-primary mb-1">{level.titleArabic}</p>
                  <p className="text-sm text-muted-foreground">{level.titleOromo}</p>
                </div>
                
                <p className="text-muted-foreground text-center mb-4">{level.description}</p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock size={14} />
                  <span>{level.duration}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-center">Topics Covered:</p>
                  {level.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {topic}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-medium text-center">Skills Developed:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {level.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Start {level.title}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar Topics */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Grammar <span className="text-primary">Studies</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master the three pillars of Arabic language sciences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grammarTopics.map((topic, index) => (
              <div 
                key={topic.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <topic.icon size={24} className="text-primary" />
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">{topic.title}</h3>
                  <p className="text-lg font-arabic text-primary">{topic.titleArabic}</p>
                </div>
                
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                
                <div className="space-y-2">
                  {topic.topics.map((subtopic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <ArrowRight size={12} className="text-primary" />
                      {subtopic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Skills */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Language <span className="text-primary">Skills</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Develop comprehensive Arabic language proficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practicalSkills.map((skill, index) => (
              <div 
                key={skill.skill}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <skill.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{skill.skill}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-arabic text-primary">{skill.arabic}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{skill.oromo}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{skill.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">Practice Activities:</p>
                  {skill.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {activity}
                    </div>
                  ))}
                </div>
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
              Comprehensive tools and materials for effective Arabic language learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Interactive Lessons",
                description: "Engaging multimedia Arabic lessons",
                icon: Play,
                color: "text-blue-600"
              },
              {
                title: "Practice Exercises",
                description: "Grammar and vocabulary drills",
                icon: Target,
                color: "text-green-600"
              },
              {
                title: "Audio Content",
                description: "Native speaker pronunciation guides",
                icon: Volume2,
                color: "text-purple-600"
              },
              {
                title: "Progress Tracking",
                description: "Monitor your learning journey",
                icon: Award,
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
              Connect with authentic Arabic learning platforms and resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-primary" />
              </div>
              <h4 className="font-semibold mb-2">TVIslaamaa Arabic Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive Arabic language learning resources with focus on Islamic texts and Quranic Arabic.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit Arabic Section
              </Button>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <FileText size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Study Materials</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download comprehensive Arabic learning materials, grammar guides, and practice exercises.
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
            <span className="text-sm text-primary font-medium">Master the Language of the Quran</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Learn <span className="text-primary">Arabic Language</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Begin your Arabic learning journey and unlock direct access to Islamic texts, 
            Quranic understanding, and classical Islamic literature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <MessageCircle size={18} />
              Start Arabic Course
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