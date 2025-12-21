import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Users, 
  Target,
  Award,
  Calendar,
  MapPin,
  Download,
  ExternalLink,
  Heart,
  Star,
  Lightbulb,
  Shield,
  Globe,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"history" | "structure" | "values" | "constitution">("history");

  const milestones = [
    {
      year: "2018",
      title: "Jama'a Foundation",
      description: "Establishment of Muslim Student Jama'a at Haramaya University",
      icon: "🏛️",
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2019",
      title: "IT Sector Launch",
      description: "Creation of dedicated IT sector to modernize operations",
      icon: "💻",
      color: "from-green-500 to-emerald-500"
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Implementation of digital systems during COVID-19 pandemic",
      icon: "🚀",
      color: "from-purple-500 to-violet-500"
    },
    {
      year: "2021",
      title: "Community Growth",
      description: "Reached 500+ active members across all faculties",
      icon: "📈",
      color: "from-orange-500 to-red-500"
    },
    {
      year: "2022",
      title: "Partnership Expansion",
      description: "Established partnerships with Islamic organizations nationwide",
      icon: "🤝",
      color: "from-teal-500 to-blue-500"
    },
    {
      year: "2023",
      title: "Technology Excellence",
      description: "Launched comprehensive IT management platform",
      icon: "⭐",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const organizationalStructure = [
    {
      level: "Executive Leadership",
      positions: [
        { title: "Amir (President)", name: "Ahmed Hassan", responsibilities: ["Overall leadership", "Strategic planning", "External relations"] },
        { title: "Vice Amir", name: "Fatima Ali", responsibilities: ["Operations oversight", "Committee coordination", "Member relations"] }
      ],
      color: "from-red-500 to-pink-500"
    },
    {
      level: "Core Committees",
      positions: [
        { title: "IT Sector Head", name: "Omar Ibrahim", responsibilities: ["Technology leadership", "System development", "Digital innovation"] },
        { title: "Da'wa Coordinator", name: "Aisha Mohamed", responsibilities: ["Islamic outreach", "Educational programs", "Community engagement"] },
        { title: "Education Director", name: "Mohammed Ali", responsibilities: ["Academic support", "Learning resources", "Study programs"] },
        { title: "Finance Manager", name: "Khadija Hassan", responsibilities: ["Financial management", "Budget planning", "Transparency reports"] },
        { title: "Social Affairs Head", name: "Yusuf Ahmed", responsibilities: ["Event coordination", "Member welfare", "Community activities"] }
      ],
      color: "from-blue-500 to-indigo-500"
    },
    {
      level: "Specialized Teams",
      positions: [
        { title: "Media Team Lead", name: "Sara Ahmed", responsibilities: ["Content creation", "Social media", "Publications"] },
        { title: "Volunteer Coordinator", name: "Ibrahim Osman", responsibilities: ["Volunteer programs", "Community service", "Outreach activities"] },
        { title: "Academic Support Lead", name: "Zainab Ali", responsibilities: ["Tutoring services", "Study groups", "Academic guidance"] }
      ],
      color: "from-green-500 to-teal-500"
    }
  ];

  const coreValues = [
    {
      value: "Tawhid (Unity)",
      description: "Belief in the oneness of Allah and unity of the Muslim community",
      application: "Fostering unity among diverse students from different backgrounds",
      verse: "And hold firmly to the rope of Allah all together and do not become divided",
      reference: "Quran 3:103",
      icon: "🤲",
      color: "from-blue-500 to-cyan-500"
    },
    {
      value: "Ilm (Knowledge)",
      description: "Pursuit of both religious and worldly knowledge",
      application: "Promoting academic excellence and Islamic education",
      verse: "And say: My Lord, increase me in knowledge",
      reference: "Quran 20:114",
      icon: "📚",
      color: "from-green-500 to-emerald-500"
    },
    {
      value: "Amanah (Trust)",
      description: "Trustworthiness and responsibility in all affairs",
      application: "Maintaining integrity in leadership and community service",
      verse: "Indeed, Allah commands you to render trusts to whom they are due",
      reference: "Quran 4:58",
      icon: "🔒",
      color: "from-purple-500 to-violet-500"
    },
    {
      value: "Adl (Justice)",
      description: "Fairness and equity in all dealings",
      application: "Ensuring equal opportunities and fair treatment for all members",
      verse: "O you who believe! Stand out firmly for justice",
      reference: "Quran 4:135",
      icon: "⚖️",
      color: "from-orange-500 to-red-500"
    },
    {
      value: "Ihsan (Excellence)",
      description: "Striving for excellence in worship and worldly affairs",
      application: "Pursuing the highest standards in all activities and services",
      verse: "And Allah loves those who do good with excellence",
      reference: "Quran 2:195",
      icon: "⭐",
      color: "from-amber-500 to-yellow-500"
    },
    {
      value: "Khidmah (Service)",
      description: "Serving the community and humanity",
      application: "Providing services and support to students and the broader community",
      verse: "And whoever volunteers good - then indeed, Allah is appreciative and Knowing",
      reference: "Quran 2:158",
      icon: "❤️",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const achievements = [
    { metric: "500+", label: "Active Members", icon: Users },
    { metric: "50+", label: "Events Annually", icon: Calendar },
    { metric: "15", label: "Committees", icon: Building },
    { metric: "100+", label: "Volunteers", icon: Heart },
    { metric: "25+", label: "Partners", icon: Globe },
    { metric: "5", label: "Years of Service", icon: Award }
  ];

  return (
    <PageLayout 
      title="About MSJ - Haramaya University" 
      subtitle="Learn about our history, structure, values, and mission"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 border border-primary/20 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-red animate-glow">
            <BookOpen size={48} className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
            Muslim Student <span className="text-primary">Jama'a</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Haramaya University Muslim Student Jama'a (HUMSJ) is a vibrant Islamic community dedicated to 
            fostering spiritual growth, academic excellence, and social responsibility among Muslim students.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
              <Download size={18} />
              Download Constitution
            </Button>
            <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
              <ExternalLink size={18} />
              Contact Leadership
            </Button>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.label}
              className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-slide-up text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <achievement.icon size={24} className="text-primary" />
              </div>
              <p className="text-3xl font-display text-primary mb-2">{achievement.metric}</p>
              <p className="text-sm text-muted-foreground">{achievement.label}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: "history", label: "History & Milestones", icon: Clock },
            { id: "structure", label: "Organizational Structure", icon: Building },
            { id: "values", label: "Core Values", icon: Heart },
            { id: "constitution", label: "Constitution & Bylaws", icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-red"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* History & Milestones Tab */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Our <span className="text-primary">Journey</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From humble beginnings to a thriving community of 500+ members, discover the milestones 
                that shaped our Jama'a into what it is today.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent rounded-full"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.year}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-slide-up`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${milestone.color} flex items-center justify-center text-2xl`}>
                            {milestone.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{milestone.title}</h3>
                            <p className="text-primary font-medium">{milestone.year}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-background shadow-red relative z-10"></div>
                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Organizational Structure Tab */}
        {activeTab === "structure" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Organizational <span className="text-primary">Structure</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our Jama'a operates through a well-structured hierarchy that ensures effective leadership, 
                clear responsibilities, and efficient service delivery.
              </p>
            </div>

            <div className="space-y-12">
              {organizationalStructure.map((level, levelIndex) => (
                <div key={level.level} className="animate-slide-up" style={{ animationDelay: `${levelIndex * 200}ms` }}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-display tracking-wide mb-2">{level.level}</h3>
                    <div className={`w-24 h-1 bg-gradient-to-r ${level.color} rounded-full mx-auto`}></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {level.positions.map((position, index) => (
                      <div 
                        key={position.title}
                        className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-white font-bold`}>
                            {position.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold">{position.title}</h4>
                            <p className="text-sm text-primary">{position.name}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {position.responsibilities.map((responsibility, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle size={12} className="text-primary flex-shrink-0" />
                              {responsibility}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Values Tab */}
        {activeTab === "values" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Our Core <span className="text-primary">Values</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These Islamic principles guide every aspect of our operations and shape our community culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreValues.map((value, index) => (
                <div 
                  key={value.value}
                  className="bg-card rounded-xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center text-3xl`}>
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{value.value}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-sm font-medium text-primary mb-2">Application:</p>
                      <p className="text-sm text-muted-foreground">{value.application}</p>
                    </div>
                    
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm italic text-foreground mb-2">"{value.verse}"</p>
                      <p className="text-xs text-primary font-medium">{value.reference}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constitution & Bylaws Tab */}
        {activeTab === "constitution" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Constitution & <span className="text-primary">Bylaws</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our governing documents that outline the structure, procedures, and principles of our Jama'a.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shield size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Constitution</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  The fundamental document that establishes our Jama'a's purpose, structure, and governing principles 
                  based on Islamic teachings and university regulations.
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    "Organizational structure and leadership",
                    "Membership rights and responsibilities", 
                    "Decision-making processes",
                    "Islamic principles and guidelines"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Download size={18} />
                  Download Constitution (PDF)
                </Button>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-secondary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <BookOpen size={32} className="text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Bylaws</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Detailed operational procedures and regulations that govern the day-to-day activities 
                  and specific processes of our Jama'a.
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    "Meeting procedures and protocols",
                    "Committee operations and responsibilities",
                    "Financial management and transparency",
                    "Event planning and execution guidelines"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-secondary" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-secondary/50 hover:border-secondary gap-2">
                  <Download size={18} />
                  Download Bylaws (PDF)
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 rounded-2xl p-8 border border-accent/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display tracking-wide mb-4">
                  Amendment <span className="text-primary">Process</span>
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our constitution and bylaws can be amended through a democratic process that ensures 
                  community input and Islamic compliance.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Proposal", description: "Amendment proposed by leadership or members" },
                  { step: "2", title: "Review", description: "Islamic compliance and legal review" },
                  { step: "3", title: "Discussion", description: "Community consultation and feedback" },
                  { step: "4", title: "Ratification", description: "Voting and formal adoption" }
                ].map((process, index) => (
                  <div key={process.step} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                      {process.step}
                    </div>
                    <h4 className="font-semibold mb-2">{process.title}</h4>
                    <p className="text-sm text-muted-foreground">{process.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}