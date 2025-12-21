import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Smartphone, 
  Globe, 
  Code, 
  Database,
  Shield,
  Zap,
  Users,
  Star,
  Download,
  ExternalLink,
  Play,
  Heart,
  Award,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IslamicApp {
  name: string;
  description: string;
  category: string;
  platform: string[];
  features: string[];
  downloads: string;
  rating: number;
  developer: string;
  icon: string;
  color: string;
}

interface TechResource {
  title: string;
  description: string;
  type: string;
  url: string;
  author: string;
  language: string[];
  icon: string;
  color: string;
}

const islamicApps: IslamicApp[] = [
  {
    name: "Muslim Pro",
    description: "Complete Islamic companion with prayer times, Quran, and Qibla",
    category: "Prayer & Worship",
    platform: ["iOS", "Android", "Web"],
    features: ["Prayer Times", "Quran Audio", "Qibla Compass", "Islamic Calendar", "Duas"],
    downloads: "100M+",
    rating: 4.6,
    developer: "Bitsmedia Pte Ltd",
    icon: "🕌",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Quran Majeed",
    description: "Beautiful Quran app with translations and audio recitations",
    category: "Quran Study",
    platform: ["iOS", "Android"],
    features: ["15+ Translations", "Audio Recitations", "Tafsir", "Bookmarks", "Night Mode"],
    downloads: "50M+",
    rating: 4.8,
    developer: "PakData",
    icon: "📖",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Athan Pro",
    description: "Accurate prayer times and Adhan notifications",
    category: "Prayer Times",
    platform: ["iOS", "Android"],
    features: ["Precise Prayer Times", "Multiple Adhan Sounds", "Qibla Direction", "Hijri Calendar"],
    downloads: "10M+",
    rating: 4.5,
    developer: "IslamicFinder",
    icon: "🔔",
    color: "from-purple-500 to-violet-600"
  },
  {
    name: "Zakat Calculator",
    description: "Calculate Zakat obligations according to Islamic law",
    category: "Islamic Finance",
    platform: ["iOS", "Android", "Web"],
    features: ["Gold/Silver Calculation", "Business Assets", "Multiple Currencies", "Nisab Rates"],
    downloads: "1M+",
    rating: 4.3,
    developer: "Islamic Relief",
    icon: "💰",
    color: "from-yellow-500 to-orange-600"
  },
  {
    name: "Hadith Collection",
    description: "Authentic Hadith from major collections",
    category: "Islamic Knowledge",
    platform: ["iOS", "Android"],
    features: ["Sahih Bukhari", "Sahih Muslim", "Search Function", "Bookmarks", "Sharing"],
    downloads: "5M+",
    rating: 4.7,
    developer: "Greentech Apps Foundation",
    icon: "📚",
    color: "from-red-500 to-pink-600"
  },
  {
    name: "Islamic Calendar",
    description: "Hijri calendar with Islamic events and occasions",
    category: "Calendar",
    platform: ["iOS", "Android", "Web"],
    features: ["Hijri Dates", "Islamic Events", "Moon Phases", "Ramadan Tracker"],
    downloads: "2M+",
    rating: 4.4,
    developer: "Al-Habib",
    icon: "📅",
    color: "from-cyan-500 to-blue-600"
  }
];

const techResources: TechResource[] = [
  {
    title: "Islamic Programming Guidelines",
    description: "Comprehensive guide for developing software according to Islamic principles",
    type: "Documentation",
    url: "https://islamicprogramming.org/guidelines",
    author: "Muslim Developers Collective",
    language: ["English", "Arabic"],
    icon: "📋",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Halal Tech Framework",
    description: "Open-source framework for building Sharia-compliant applications",
    type: "Framework",
    url: "https://github.com/halaltech/framework",
    author: "Halal Tech Community",
    language: ["JavaScript", "Python", "Java"],
    icon: "⚙️",
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Islamic Finance APIs",
    description: "RESTful APIs for Islamic banking and finance calculations",
    type: "API",
    url: "https://islamicfinanceapi.com",
    author: "Islamic FinTech Solutions",
    language: ["REST", "GraphQL"],
    icon: "🔌",
    color: "from-yellow-500 to-orange-600"
  },
  {
    title: "Quran Text Processing Library",
    description: "Natural language processing tools for Quranic text analysis",
    type: "Library",
    url: "https://github.com/qurantech/nlp",
    author: "Quran Tech Initiative",
    language: ["Python", "R"],
    icon: "🔤",
    color: "from-purple-500 to-violet-600"
  },
  {
    title: "Prayer Time Calculation SDK",
    description: "Accurate prayer time calculations for any location worldwide",
    type: "SDK",
    url: "https://prayertimes.dev",
    author: "Islamic Astronomy Project",
    language: ["JavaScript", "Swift", "Kotlin"],
    icon: "🕐",
    color: "from-red-500 to-pink-600"
  },
  {
    title: "Islamic UI Component Library",
    description: "Beautiful UI components with Islamic design patterns",
    type: "UI Library",
    url: "https://islamicui.com",
    author: "Muslim UX Designers",
    language: ["React", "Vue", "Angular"],
    icon: "🎨",
    color: "from-cyan-500 to-blue-600"
  }
];

export default function IslamicTechPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const categories = ["All", "Prayer & Worship", "Quran Study", "Islamic Knowledge", "Islamic Finance", "Calendar"];
  const types = ["All", "Documentation", "Framework", "API", "Library", "SDK", "UI Library"];

  const filteredApps = islamicApps.filter(app => 
    selectedCategory === "All" || app.category === selectedCategory
  );

  const filteredResources = techResources.filter(resource => 
    selectedType === "All" || resource.type === selectedType
  );

  return (
    <PageLayout 
      title="Islamic Technology" 
      subtitle="Islamic apps, tools, and development resources"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Smartphone size={20} className="text-primary" />
            <span className="text-primary font-medium">Islamic Technology Resources</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
            Technology for the <span className="text-primary">Ummah</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Islamic applications, development tools, and resources that serve the Muslim community 
            while adhering to Islamic principles and values.
          </p>
        </div>

        {/* Islamic Apps Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-display tracking-wide">
              Popular <span className="text-primary">Islamic Apps</span>
            </h3>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <div 
                key={app.name}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 group"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${app.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">{app.name}</h4>
                    <p className="text-sm text-primary mb-1">{app.category}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < Math.floor(app.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{app.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{app.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-secondary font-medium mb-1">Platforms:</p>
                    <div className="flex gap-1">
                      {app.platform.map(platform => (
                        <span key={platform} className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-accent font-medium mb-1">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {app.features.slice(0, 3).map(feature => (
                        <span key={feature} className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                          {feature}
                        </span>
                      ))}
                      {app.features.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                          +{app.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Download size={12} />
                      <span>{app.downloads}</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-border/50 hover:border-primary">
                      <ExternalLink size={14} className="mr-1" />
                      View App
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Resources Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-display tracking-wide">
              Development <span className="text-primary">Resources</span>
            </h3>
            <div className="flex gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource, index) => (
              <div 
                key={resource.title}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 group"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${resource.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">{resource.title}</h4>
                    <p className="text-sm text-primary mb-1">{resource.type}</p>
                    <p className="text-xs text-muted-foreground">by {resource.author}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{resource.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-secondary font-medium mb-1">Languages/Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.language.map(lang => (
                        <span key={lang} className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe size={12} />
                      <span>Open Source</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-border/50 hover:border-primary">
                      <ExternalLink size={14} className="mr-1" />
                      Access Resource
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Islamic Tech Principles */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-display tracking-wide mb-4">
              Building <span className="text-primary">Ethical Technology</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guidelines and principles for developing technology that serves humanity while adhering to Islamic values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Privacy First",
                description: "Protect user data as an Amanah (trust) from Allah",
                icon: "🔒",
                color: "from-blue-500 to-indigo-600"
              },
              {
                title: "Inclusive Design",
                description: "Create accessible technology for all members of the Ummah",
                icon: "♿",
                color: "from-green-500 to-emerald-600"
              },
              {
                title: "Knowledge Sharing",
                description: "Share beneficial knowledge as Sadaqah Jariyah",
                icon: "📚",
                color: "from-purple-500 to-violet-600"
              },
              {
                title: "Ethical AI",
                description: "Develop AI systems free from bias and discrimination",
                icon: "🤖",
                color: "from-red-500 to-pink-600"
              },
              {
                title: "Sustainable Tech",
                description: "Build environmentally responsible solutions",
                icon: "🌱",
                color: "from-green-400 to-teal-600"
              },
              {
                title: "Community Benefit",
                description: "Prioritize social good over profit maximization",
                icon: "❤️",
                color: "from-red-400 to-orange-600"
              }
            ].map((principle, index) => (
              <div 
                key={principle.title}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 animate-slide-up opacity-0 text-center"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${principle.color} flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {principle.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{principle.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/30">
            <h3 className="text-2xl font-display tracking-wide mb-4">
              Join the <span className="text-primary">Islamic Tech Movement</span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Be part of a growing community of Muslim developers, designers, and technologists 
              working to create beneficial technology for the Ummah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                <Users size={18} />
                Join Community
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <Code size={18} />
                Contribute Code
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}