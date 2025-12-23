import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { 
  Palette, 
  PenTool, 
  Star, 
  Crown,
  BookOpen,
  Building,
  Flower,
  Globe,
  Award,
  Lightbulb,
  Heart,
  Sparkles
} from "lucide-react";

export default function IslamicArt() {
  const navigate = useNavigate();
  const location = useLocation();

  const calligraphyStyles = [
    {
      name: "Kufic",
      origin: "Kufa, Iraq (7th century)",
      characteristics: ["Angular", "Geometric", "Monumental"],
      usage: "Early Qurans, architectural inscriptions",
      significance: "Oldest Arabic script style",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Naskh",
      origin: "10th century",
      characteristics: ["Rounded", "Legible", "Flowing"],
      usage: "Modern Quran printing, books",
      significance: "Most widely used script today",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Thuluth",
      origin: "11th century",
      characteristics: ["Elegant", "Curved", "Decorative"],
      usage: "Mosque decorations, titles",
      significance: "Considered the most beautiful script",
      color: "from-purple-500 to-violet-500"
    },
    {
      name: "Nastaliq",
      origin: "Persia (14th century)",
      characteristics: ["Flowing", "Slanted", "Poetic"],
      usage: "Persian and Urdu literature",
      significance: "Perfect for poetry and literature",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const artForms = [
    {
      form: "Geometric Patterns",
      description: "Complex mathematical designs representing divine order",
      examples: ["Star and polygon patterns", "Tessellations", "Infinite patterns"],
      symbolism: "Unity and infinity of Allah",
      icon: "⭐",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      form: "Arabesque",
      description: "Flowing plant-based decorative designs",
      examples: ["Vine scrolls", "Palmette motifs", "Floral patterns"],
      symbolism: "Paradise and divine creation",
      icon: "🌿",
      color: "bg-green-500/20 text-green-600"
    },
    {
      form: "Calligraphy",
      description: "Sacred art of beautiful writing",
      examples: ["Quranic verses", "Prophetic sayings", "Divine names"],
      symbolism: "Divine revelation and knowledge",
      icon: "✍️",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      form: "Miniature Painting",
      description: "Detailed illustrations in manuscripts",
      examples: ["Scientific texts", "Literary works", "Historical chronicles"],
      symbolism: "Knowledge and storytelling",
      icon: "🎨",
      color: "bg-rose-500/20 text-rose-600"
    },
    {
      form: "Architectural Decoration",
      description: "Ornamental elements in Islamic buildings",
      examples: ["Muqarnas", "Mihrab designs", "Dome decorations"],
      symbolism: "Sacred space and divine presence",
      icon: "🏛️",
      color: "bg-amber-500/20 text-amber-600"
    },
    {
      form: "Textile Arts",
      description: "Decorative fabrics and carpets",
      examples: ["Prayer rugs", "Ceremonial textiles", "Calligraphic fabrics"],
      symbolism: "Beauty in daily life and worship",
      icon: "🧵",
      color: "bg-indigo-500/20 text-indigo-600"
    }
  ];

  const famousWorks = [
    {
      name: "Dome of the Rock Inscriptions",
      location: "Jerusalem",
      period: "691 CE",
      description: "Earliest monumental Arabic calligraphy",
      significance: "Quranic verses in gold on blue background"
    },
    {
      name: "Blue Quran",
      location: "North Africa",
      period: "9th-10th century",
      description: "Luxury Quran with gold Kufic script on blue parchment",
      significance: "Masterpiece of early Islamic calligraphy"
    },
    {
      name: "Ardabil Carpet",
      location: "Iran",
      period: "1539-1540 CE",
      description: "One of the oldest dated carpets in the world",
      significance: "Perfect example of Islamic geometric design"
    },
    {
      name: "Mamluk Quran Boxes",
      location: "Egypt/Syria",
      period: "13th-15th century",
      description: "Inlaid metalwork with calligraphic decoration",
      significance: "Fusion of calligraphy and decorative arts"
    }
  ];

  const spiritualAspects = [
    {
      aspect: "Divine Inspiration",
      description: "Islamic art reflects the beauty of divine creation",
      principle: "Art as a form of worship and remembrance of Allah"
    },
    {
      aspect: "Sacred Geometry",
      description: "Mathematical patterns reflecting divine order",
      principle: "Unity in diversity, infinite patterns from simple rules"
    },
    {
      aspect: "Calligraphy as Meditation",
      description: "Writing sacred texts as spiritual practice",
      principle: "Physical act of writing connects heart to divine words"
    },
    {
      aspect: "Beauty in Function",
      description: "Everyday objects elevated through artistic decoration",
      principle: "Bringing divine beauty into daily life"
    }
  ];

  const modernRelevance = [
    {
      area: "Contemporary Art",
      description: "Modern artists drawing inspiration from Islamic traditions",
      examples: ["Calligraffiti", "Digital Islamic art", "Modern geometric designs"]
    },
    {
      area: "Architecture",
      description: "Islamic design principles in modern buildings",
      examples: ["Museum of Islamic Art, Doha", "Islamic Cultural Center, NYC", "Modern mosque designs"]
    },
    {
      area: "Graphic Design",
      description: "Islamic patterns in modern visual communication",
      examples: ["Logo designs", "Book covers", "Digital interfaces"]
    },
    {
      area: "Education",
      description: "Teaching Islamic art in schools and universities",
      examples: ["Art history courses", "Calligraphy workshops", "Cultural programs"]
    }
  ];

  return (
    <PublicPageLayout 
      title="Islamic Art & Calligraphy" 
      subtitle="The sacred art forms that express divine beauty and spiritual devotion"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <Palette size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Islamic Art & Calligraphy</h1>
            <p className="text-muted-foreground max-w-4xl mx-auto text-lg">
              Explore the rich tradition of Islamic art and calligraphy, where spiritual devotion meets artistic excellence, 
              creating timeless masterpieces that reflect divine beauty and the infinite nature of Allah's creation.
            </p>
          </div>
        </div>

        {/* Calligraphy Styles */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <PenTool size={28} className="text-primary" />
              Classical Calligraphy Styles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The major scripts that have preserved and beautified the Arabic language throughout history
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {calligraphyStyles.map((style, index) => (
              <div 
                key={style.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.color} mb-4`} />
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">{style.name}</h3>
                  <p className="text-sm text-muted-foreground">{style.origin}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Characteristics:</h4>
                    <div className="space-y-1">
                      {style.characteristics.map((char, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Star size={12} className="text-primary" />
                          <span>{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Usage:</h4>
                    <p className="text-sm text-muted-foreground mb-2">{style.usage}</p>
                    <p className="text-xs text-primary font-medium">{style.significance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Art Forms */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Sparkles size={28} className="text-primary" />
              Islamic Art Forms
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Diverse artistic expressions that embody Islamic aesthetic principles and spiritual values
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artForms.map((form, index) => (
              <div 
                key={form.form}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${form.color} flex items-center justify-center text-2xl`}>
                    {form.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{form.form}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{form.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Examples:</h4>
                    <div className="space-y-1">
                      {form.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">Symbolism:</p>
                    <p className="text-sm">{form.symbolism}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Famous Works */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Crown size={28} className="text-primary" />
              Masterpieces of Islamic Art
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Iconic works that represent the pinnacle of Islamic artistic achievement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {famousWorks.map((work, index) => (
              <div 
                key={work.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{work.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe size={12} />
                      {work.location}
                    </span>
                    <span>{work.period}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{work.description}</p>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-1">Significance:</p>
                  <p className="text-sm">{work.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spiritual Aspects */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Heart size={28} className="text-primary" />
              Spiritual Dimensions of Islamic Art
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The deeper spiritual meanings and principles that guide Islamic artistic expression
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {spiritualAspects.map((aspect, index) => (
              <div 
                key={aspect.aspect}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-primary" />
                  {aspect.aspect}
                </h3>
                <p className="text-muted-foreground mb-4">{aspect.description}</p>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-1">Principle:</p>
                  <p className="text-sm">{aspect.principle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Relevance */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Award size={28} className="text-primary" />
              Islamic Art in the Modern World
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How Islamic artistic traditions continue to inspire and influence contemporary art and design
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {modernRelevance.map((area, index) => (
              <div 
                key={area.area}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-semibold text-lg mb-3">{area.area}</h3>
                <p className="text-muted-foreground mb-4">{area.description}</p>
                <div>
                  <h4 className="font-medium text-sm mb-2">Examples:</h4>
                  <div className="space-y-1">
                    {area.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quranic Inspiration */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={20} className="text-primary" />
          </div>
          <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
            وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And We have certainly beautified the nearest heaven with lamps" - Quran 67:5
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}