import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { RotatingQuranVerses } from "@/components/islamic/RotatingQuranVerses";
import { 
  Heart, 
  Star, 
  Crown, 
  BookOpen, 
  Users,
  MapPin,
  Calendar,
  Lightbulb,
  Shield,
  Globe,
  Award,
  Moon
} from "lucide-react";

export default function ProphetLife() {
  const navigate = useNavigate();
  const location = useLocation();

  // Verses about Prophet Muhammad (PBUH)
  const prophetVerses = [
    {
      arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
      english: "And We have not sent you, [O Muhammad], except as a mercy to the worlds",
      reference: "Quran 21:107",
      theme: "Mercy to Mankind",
      icon: "❤️",
      color: "from-red-500 to-pink-500"
    },
    {
      arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ",
      english: "And indeed, you are of a great moral character",
      reference: "Quran 68:4",
      theme: "Noble Character",
      icon: "⭐",
      color: "from-yellow-500 to-orange-500"
    },
    {
      arabic: "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ",
      english: "There has certainly been for you in the Messenger of Allah an excellent pattern",
      reference: "Quran 33:21",
      theme: "Perfect Example",
      icon: "🌟",
      color: "from-blue-500 to-cyan-500"
    },
    {
      arabic: "وَمَا يَنطِقُ عَنِ الْهَوَىٰ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ",
      english: "Nor does he speak from [his own] inclination. It is not but a revelation revealed",
      reference: "Quran 53:3-4",
      theme: "Divine Revelation",
      icon: "📖",
      color: "from-emerald-500 to-green-500"
    }
  ];

  const lifePhases = [
    {
      phase: "Early Life (570-610 CE)",
      age: "Birth - 40 years",
      location: "Makkah",
      highlights: [
        "Born in the Year of the Elephant",
        "Orphaned at young age, raised by grandfather and uncle",
        "Known as Al-Amin (The Trustworthy)",
        "Marriage to Khadijah (RA)",
        "Father to four daughters and three sons"
      ],
      lessons: ["Honesty and trustworthiness", "Compassion for orphans", "Strong family values"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      phase: "Prophetic Call (610-622 CE)",
      age: "40 - 52 years",
      location: "Makkah",
      highlights: [
        "First revelation in Cave Hira",
        "Secret preaching for 3 years",
        "Public declaration of Islam",
        "Persecution of early Muslims",
        "Night Journey (Isra and Mi'raj)"
      ],
      lessons: ["Patience in adversity", "Gradual approach to change", "Divine guidance"],
      color: "from-emerald-500 to-green-500"
    },
    {
      phase: "Migration & State Building (622-632 CE)",
      age: "52 - 63 years",
      location: "Madinah",
      highlights: [
        "Hijra to Madinah",
        "Constitution of Madinah",
        "Building the first mosque",
        "Establishing Islamic society",
        "Farewell Pilgrimage"
      ],
      lessons: ["Leadership and governance", "Community building", "Justice and equality"],
      color: "from-purple-500 to-violet-500"
    }
  ];

  const nobleQualities = [
    {
      quality: "Truthfulness (Sidq)",
      description: "Known as Al-Amin (The Trustworthy) even by his enemies",
      example: "Even opponents trusted him with their valuables",
      icon: "✨",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      quality: "Compassion (Rahma)",
      description: "Showed mercy to all creation, including animals and enemies",
      example: "Forgave the people of Makkah upon conquest",
      icon: "❤️",
      color: "bg-rose-500/20 text-rose-600"
    },
    {
      quality: "Justice (Adl)",
      description: "Established fair treatment regardless of social status",
      example: "Said he would punish his own daughter if she stole",
      icon: "⚖️",
      color: "bg-green-500/20 text-green-600"
    },
    {
      quality: "Humility (Tawadu)",
      description: "Remained humble despite his elevated status",
      example: "Mended his own clothes and helped with household work",
      icon: "🤲",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      quality: "Patience (Sabr)",
      description: "Endured hardships with remarkable patience",
      example: "Persevered through years of persecution and boycott",
      icon: "🌱",
      color: "bg-amber-500/20 text-amber-600"
    },
    {
      quality: "Generosity (Karam)",
      description: "Gave freely and never turned away those in need",
      example: "Gave away all his possessions, often going hungry",
      icon: "🎁",
      color: "bg-indigo-500/20 text-indigo-600"
    }
  ];

  const relationships = [
    {
      relationship: "As a Husband",
      description: "Loving, supportive, and respectful to his wives",
      examples: ["Supported Khadijah's business", "Helped with household duties", "Showed affection and care"],
      icon: "💑"
    },
    {
      relationship: "As a Father",
      description: "Caring and affectionate with his children",
      examples: ["Played with grandchildren during prayers", "Showed equal love to daughters", "Taught through example"],
      icon: "👨‍👧‍👦"
    },
    {
      relationship: "As a Leader",
      description: "Just, consultative, and servant-leader",
      examples: ["Consulted companions in decisions", "Led by example in battles", "Served the community"],
      icon: "👑"
    },
    {
      relationship: "As a Friend",
      description: "Loyal, supportive, and trustworthy",
      examples: ["Deep friendship with Abu Bakr", "Supported companions in difficulties", "Remembered friends' kindness"],
      icon: "🤝"
    }
  ];

  const teachings = [
    {
      category: "Social Justice",
      teachings: [
        "All humans are equal regardless of race or status",
        "Protect the rights of the weak and oppressed",
        "Establish economic justice and fair trade",
        "Care for orphans, widows, and the needy"
      ]
    },
    {
      category: "Environmental Ethics",
      teachings: [
        "Do not waste water even if by a running stream",
        "Plant trees and care for the environment",
        "Show kindness to animals",
        "Preserve natural resources for future generations"
      ]
    },
    {
      category: "Personal Development",
      teachings: [
        "Seek knowledge from cradle to grave",
        "Control anger and practice forgiveness",
        "Be honest in all dealings",
        "Maintain good character and manners"
      ]
    },
    {
      category: "Community Building",
      teachings: [
        "A believer is not one who eats while his neighbor goes hungry",
        "Help others in times of need",
        "Maintain family ties and relationships",
        "Work together for the common good"
      ]
    }
  ];

  return (
    <PublicPageLayout 
      title="Life of Prophet Muhammad ﷺ" 
      subtitle="The perfect example of character, leadership, and devotion"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section with 360 Rotating Verses */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <Heart size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Life of Prophet Muhammad ﷺ</h1>
            <p className="text-muted-foreground max-w-4xl mx-auto text-lg mb-8">
              Explore the life, character, and teachings of the final Messenger of Allah, 
              whose example continues to guide humanity towards righteousness, justice, and compassion.
            </p>
            
            {/* 360 Degree Rotating Quranic Verses */}
            <RotatingQuranVerses 
              verses={prophetVerses}
              rotationSpeed={7}
              className="max-w-5xl mx-auto"
            />
          </div>
        </div>

        {/* Life Phases */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Calendar size={28} className="text-primary" />
              Phases of the Prophetic Life
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Journey through the major phases of the Prophet's life, each offering unique lessons and guidance
            </p>
          </div>

          <div className="space-y-6">
            {lifePhases.map((phase, index) => (
              <div 
                key={phase.phase}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${phase.color} mb-4`} />
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{phase.phase}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{phase.age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{phase.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Key Highlights:</h4>
                    <div className="space-y-2">
                      {phase.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Star size={12} className="text-primary flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Lessons for Us:</h4>
                    <div className="space-y-2">
                      {phase.lessons.map((lesson, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Lightbulb size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Noble Qualities */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Crown size={28} className="text-primary" />
              Noble Qualities & Character
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The exemplary character traits that made the Prophet ﷺ a perfect role model for all humanity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nobleQualities.map((quality, index) => (
              <div 
                key={quality.quality}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${quality.color} flex items-center justify-center text-2xl`}>
                    {quality.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{quality.quality}</h3>
                </div>
                <p className="text-muted-foreground mb-3">{quality.description}</p>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-1">Example:</p>
                  <p className="text-sm">{quality.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Users size={28} className="text-primary" />
              The Prophet ﷺ in Relationships
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How the Prophet ﷺ exemplified excellence in various human relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {relationships.map((rel, index) => (
              <div 
                key={rel.relationship}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{rel.icon}</div>
                  <h3 className="font-semibold text-lg">{rel.relationship}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{rel.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Examples:</h4>
                  {rel.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teachings & Wisdom */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <BookOpen size={28} className="text-primary" />
              Prophetic Teachings & Wisdom
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Timeless teachings that continue to guide humanity towards a better world
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {teachings.map((category, index) => (
              <div 
                key={category.category}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Award size={18} className="text-primary" />
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.teachings.map((teaching, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{teaching}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Moon size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">The Perfect Example</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
              The Prophet Muhammad ﷺ lived a life of complete submission to Allah, demonstrating through his actions 
              how to be a perfect human being. His life serves as a comprehensive guide for all aspects of human existence.
            </p>
            <div className="bg-card/50 rounded-lg p-4 border border-border/30">
              <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
                لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ
              </p>
              <p className="text-muted-foreground italic text-sm">
                "Indeed, in the Messenger of Allah you have an excellent example" - Quran 33:21
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}