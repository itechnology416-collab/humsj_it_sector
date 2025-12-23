import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { 
  MessageCircle, 
  Users, 
  ExternalLink,
  BookOpen,
  Laptop,
  Globe,
  Heart,
  DollarSign,
  Info,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InformationChannelsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const channels = [
    {
      id: "academic",
      name: "Academic Sector of HUMSJ",
      description: "Academic programs, scholarships, educational resources, and student support services",
      url: "https://t.me/HUMSJ_accdamic",
      icon: "🎓",
      color: "from-blue-500 to-cyan-500",
      category: "education",
      subscribers: "1.2K+",
      lastUpdate: "2 hours ago",
      features: [
        "Scholarship opportunities and announcements",
        "Academic calendar and important dates",
        "Study resources and materials",
        "Academic support services",
        "Educational workshops and seminars"
      ],
      languages: ["English", "Amharic"],
      active: true
    },
    {
      id: "it",
      name: "Information & Technology Sector of HUMSJ",
      description: "IT services, technical support, digital solutions, and technology updates",
      url: "https://t.me/Information_sector_of_Humsj",
      icon: "💻",
      color: "from-green-500 to-emerald-500",
      category: "technology",
      subscribers: "850+",
      lastUpdate: "1 hour ago",
      features: [
        "Technical support and troubleshooting",
        "Digital service announcements",
        "IT training and workshops",
        "System updates and maintenance",
        "Technology news and innovations"
      ],
      languages: ["English", "Amharic"],
      active: true
    },
    {
      id: "dawa-amharic",
      name: "Da'ewa & Irshad Sector (Amharic)",
      description: "Islamic guidance, education, and spiritual development in Amharic language",
      url: "https://t.me/HRUMUSLIMSTUDENTSJEMEA",
      icon: "📚",
      color: "from-purple-500 to-violet-500",
      category: "religious",
      subscribers: "2.1K+",
      lastUpdate: "30 minutes ago",
      features: [
        "Daily Islamic reminders and quotes",
        "Religious education and guidance",
        "Spiritual development programs",
        "Community religious events",
        "Islamic Q&A sessions"
      ],
      languages: ["Amharic"],
      active: true
    },
    {
      id: "dawa-oromoo",
      name: "Da'ewa & Irshad Sector (Afaan Oromoo)",
      description: "Islamic guidance and education in Afaan Oromoo language for Oromo-speaking community",
      url: "https://t.me/HUMSJsectoroffajrulislam",
      icon: "📖",
      color: "from-orange-500 to-red-500",
      category: "religious",
      subscribers: "1.8K+",
      lastUpdate: "1 hour ago",
      features: [
        "Islamic teachings in Afaan Oromoo",
        "Cultural and religious programs",
        "Community engagement activities",
        "Language-specific religious content",
        "Local Islamic events and gatherings"
      ],
      languages: ["Afaan Oromoo"],
      active: true
    },
    {
      id: "external-affairs",
      name: "External Affairs Sector of HUMSJ",
      description: "External partnerships, collaborations, outreach programs, and inter-organizational relations",
      url: "https://t.me/+VMJzgG5c24djM2Rk",
      icon: "🤝",
      color: "from-teal-500 to-blue-500",
      category: "partnerships",
      subscribers: "650+",
      lastUpdate: "3 hours ago",
      features: [
        "Partnership announcements and updates",
        "Collaboration opportunities",
        "External event invitations",
        "Inter-organizational communications",
        "Networking and outreach programs"
      ],
      languages: ["English", "Amharic"],
      active: true
    },
    {
      id: "comparative-religion",
      name: "HUMSJ Comparative Religion Sector",
      description: "Interfaith dialogue, comparative religious studies, and academic discussions on world religions",
      url: "https://t.me/HUMSJComparative",
      icon: "🕊️",
      color: "from-indigo-500 to-purple-500",
      category: "religious",
      subscribers: "420+",
      lastUpdate: "1 hour ago",
      features: [
        "Comparative religious studies and analysis",
        "Interfaith dialogue and discussions",
        "Academic research on world religions",
        "Religious philosophy and theology",
        "Cross-cultural religious understanding"
      ],
      languages: ["English", "Amharic"],
      active: true
    },
    {
      id: "financial",
      name: "Beytal Maal (Financial Sector)",
      description: "Financial services, support programs, and economic assistance for community members",
      url: "#",
      icon: "💰",
      color: "from-amber-500 to-yellow-500",
      category: "financial",
      subscribers: "Coming Soon",
      lastUpdate: "N/A",
      features: [
        "Financial assistance programs",
        "Zakat and charity distributions",
        "Economic support services",
        "Financial literacy programs",
        "Community fund management"
      ],
      languages: ["English", "Amharic"],
      active: false
    },
    {
      id: "social-affairs",
      name: "Social Affairs Sector",
      description: "Community welfare, social programs, and member support services",
      url: "#",
      icon: "🤲",
      color: "from-pink-500 to-rose-500",
      category: "social",
      subscribers: "Coming Soon",
      lastUpdate: "N/A",
      features: [
        "Community welfare programs",
        "Social support services",
        "Member assistance programs",
        "Community events and gatherings",
        "Social impact initiatives"
      ],
      languages: ["English", "Amharic"],
      active: false
    }
  ];

  const categories = [
    { id: "all", label: "All Channels", icon: Globe },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "technology", label: "Technology", icon: Laptop },
    { id: "religious", label: "Religious", icon: Heart },
    { id: "partnerships", label: "Partnerships", icon: Users },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "social", label: "Social", icon: Heart }
  ];

  const filteredChannels = selectedCategory === "all" 
    ? channels 
    : channels.filter(channel => channel.category === selectedCategory);

  const stats = {
    totalChannels: channels.length,
    activeChannels: channels.filter(c => c.active).length,
    totalSubscribers: "7.0K+",
    languages: ["English", "Amharic", "Afaan Oromoo"]
  };

  return (
    <PublicPageLayout 
      title="HUMSJ Information Channels" 
      subtitle="Connect with specialized sectors through official Telegram channels"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-red animate-glow">
            <MessageCircle size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display tracking-wide mb-4">
            Stay <span className="text-primary">Connected</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Access specialized information, updates, and resources from different HUMSJ sectors 
            through our official Telegram channels.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-3 py-2">
              <CheckCircle size={16} className="text-primary" />
              <span>{stats.activeChannels} Active Channels</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-3 py-2">
              <Users size={16} className="text-primary" />
              <span>{stats.totalSubscribers} Total Subscribers</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 rounded-lg px-3 py-2">
              <Globe size={16} className="text-primary" />
              <span>{stats.languages.length} Languages</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-red"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <category.icon size={16} />
              {category.label}
            </button>
          ))}
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChannels.map((channel, index) => (
            <div 
              key={channel.id}
              className={`bg-card rounded-2xl p-6 border border-border/30 transition-all duration-300 animate-slide-up ${
                channel.active 
                  ? 'hover:border-primary/30 hover:scale-105 cursor-pointer' 
                  : 'opacity-70'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => channel.active && window.open(channel.url, '_blank')}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${channel.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {channel.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg leading-tight">{channel.name}</h3>
                    {channel.active ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {channel.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>{channel.subscribers}</span>
                    </div>
                    {channel.active && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{channel.lastUpdate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Key Features:</h4>
                <div className="space-y-1">
                  {channel.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={12} className="text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {channel.features.length > 3 && (
                    <div className="text-xs text-muted-foreground italic">
                      +{channel.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Languages & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex flex-wrap gap-1">
                  {channel.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
                {channel.active ? (
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 shadow-red gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(channel.url, '_blank');
                    }}
                  >
                    <MessageCircle size={14} />
                    Join Channel
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <Bell size={14} className="mr-2" />
                    Notify Me
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="bg-card rounded-2xl p-8 border border-border/30">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display tracking-wide mb-4">
              How to <span className="text-primary">Connect</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to join our information channels and stay updated with the latest news and resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Choose Your Channels",
                description: "Select the sectors and topics that interest you most",
                icon: "🎯"
              },
              {
                step: "2", 
                title: "Join on Telegram",
                description: "Click the 'Join Channel' button to access the Telegram channel",
                icon: "📱"
              },
              {
                step: "3",
                title: "Stay Updated",
                description: "Receive regular updates, resources, and announcements",
                icon: "🔔"
              }
            ].map((step, index) => (
              <div key={step.step} className="text-center animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-4 mx-auto">
                  {step.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-6 border border-secondary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Info size={24} className="text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help or Have Questions?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                If you need assistance accessing any of our information channels or have questions about specific sectors, 
                feel free to contact our IT support team.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/help')}>
                  View Help Guide
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Knowledge Sharing Principles */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/20 mt-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <BookOpen size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Islamic Knowledge Sharing & Da'wah Principles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the Islamic foundations for sharing knowledge and spreading beneficial information
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Knowledge Sharing Ethics */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Knowledge Sharing Ethics
              </h3>
              <div className="space-y-4">
                <div className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                  <h4 className="font-semibold text-primary mb-2">Prophetic Guidance</h4>
                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                    "Convey from me, even if it is one verse"
                  </blockquote>
                  <p className="text-xs text-accent font-medium">- Sahih Bukhari</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    {
                      principle: "Accuracy and Authenticity",
                      description: "Ensure all shared information is accurate and from reliable sources",
                      application: "Verify hadith authenticity, check Quranic references, cite scholarly sources"
                    },
                    {
                      principle: "Beneficial Knowledge",
                      description: "Share knowledge that brings benefit to individuals and community",
                      application: "Focus on practical Islamic guidance, spiritual development, and community building"
                    },
                    {
                      principle: "Appropriate Timing",
                      description: "Share knowledge at the right time and context",
                      application: "Consider audience readiness, cultural sensitivity, and situational appropriateness"
                    },
                    {
                      principle: "Humble Approach",
                      description: "Share knowledge with humility and sincerity",
                      application: "Avoid showing off, acknowledge limitations, encourage questions and discussion"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <h5 className="font-semibold text-sm text-primary mb-1">{item.principle}</h5>
                      <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                      <p className="text-xs text-accent"><strong>Application:</strong> {item.application}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Digital Da'wah Guidelines */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Digital Da'wah Guidelines
              </h3>
              <div className="space-y-4">
                <div className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                  <h4 className="font-semibold text-primary mb-2">Quranic Foundation</h4>
                  <p className="text-lg font-arabic text-right mb-2 text-green-600">
                    ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ
                  </p>
                  <p className="text-sm italic text-muted-foreground mb-2">
                    "Invite to the way of your Lord with wisdom and good instruction"
                  </p>
                  <p className="text-xs text-accent font-medium">- Quran 16:125</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    {
                      platform: "Telegram Channels",
                      guidelines: ["Regular beneficial content", "Interactive Q&A sessions", "Multilingual support", "Community announcements"],
                      islamicBasis: "Consistent reminder and community building"
                    },
                    {
                      platform: "Social Media",
                      guidelines: ["Authentic Islamic content", "Respectful engagement", "Educational posts", "Positive representation"],
                      islamicBasis: "Being good ambassadors of Islam"
                    },
                    {
                      platform: "Educational Platforms",
                      guidelines: ["Structured learning paths", "Expert verification", "Progressive difficulty", "Practical application"],
                      islamicBasis: "Gradual and systematic knowledge transfer"
                    },
                    {
                      platform: "Community Forums",
                      guidelines: ["Respectful discussions", "Evidence-based responses", "Encouraging participation", "Moderated content"],
                      islamicBasis: "Creating safe spaces for learning and growth"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <h5 className="font-semibold text-sm text-primary mb-2">{item.platform}</h5>
                      <ul className="text-xs space-y-1 mb-2">
                        {item.guidelines.map((guideline, gIdx) => (
                          <li key={gIdx} className="flex items-center gap-2">
                            <CheckCircle size={10} className="text-accent" />
                            {guideline}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs italic text-muted-foreground">
                        <strong>Islamic Basis:</strong> {item.islamicBasis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Information Network */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Globe size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Building an Effective Information Network</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Creating a comprehensive and reliable information system that serves our community's diverse needs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                component: "Content Creation",
                description: "Developing high-quality, authentic Islamic content",
                responsibilities: [
                  "Research and verification",
                  "Multilingual translation",
                  "Visual design and formatting",
                  "Regular content updates"
                ],
                skills: ["Islamic knowledge", "Language skills", "Design abilities", "Research methods"],
                icon: "✍️",
                color: "from-green-500 to-emerald-500"
              },
              {
                component: "Distribution Channels",
                description: "Managing various platforms and communication methods",
                responsibilities: [
                  "Platform management",
                  "Scheduling and timing",
                  "Audience engagement",
                  "Cross-platform coordination"
                ],
                skills: ["Digital literacy", "Communication", "Time management", "Analytics"],
                icon: "📡",
                color: "from-blue-500 to-cyan-500"
              },
              {
                component: "Community Feedback",
                description: "Gathering and responding to community input",
                responsibilities: [
                  "Feedback collection",
                  "Response management",
                  "Improvement implementation",
                  "Satisfaction monitoring"
                ],
                skills: ["Active listening", "Problem-solving", "Empathy", "Analytical thinking"],
                icon: "💬",
                color: "from-purple-500 to-violet-500"
              },
              {
                component: "Quality Assurance",
                description: "Ensuring accuracy and appropriateness of all content",
                responsibilities: [
                  "Content review",
                  "Fact-checking",
                  "Islamic compliance",
                  "Error correction"
                ],
                skills: ["Islamic scholarship", "Attention to detail", "Critical thinking", "Patience"],
                icon: "🔍",
                color: "from-amber-500 to-yellow-500"
              }
            ].map((component, idx) => (
              <div key={idx} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{component.icon}</span>
                  <h3 className="text-lg font-semibold text-primary">{component.component}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2">Key Responsibilities:</p>
                  <ul className="text-xs space-y-1">
                    {component.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <CheckCircle size={10} className="text-accent" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {component.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs bg-secondary/30 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}