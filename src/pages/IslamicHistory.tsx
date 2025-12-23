import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { RotatingQuranVerses } from "@/components/islamic/RotatingQuranVerses";
import { 
  BookOpen, 
  Globe, 
  Crown, 
  Scroll, 
  Building, 
  Users,
  Star,
  Heart,
  Lightbulb,
  Award,
  Map,
  Calendar
} from "lucide-react";

export default function IslamicHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  // Historical Quranic verses about knowledge and civilization
  const historicalVerses = [
    {
      arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      english: "And say: My Lord, increase me in knowledge",
      reference: "Quran 20:114",
      theme: "Seeking Knowledge",
      icon: "📚",
      color: "from-emerald-500 to-green-600"
    },
    {
      arabic: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ",
      english: "Only those fear Allah, from among His servants, who have knowledge",
      reference: "Quran 35:28",
      theme: "Scholars & Knowledge",
      icon: "🎓",
      color: "from-blue-500 to-cyan-600"
    },
    {
      arabic: "وَجَعَلْنَا مِنْهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا لَمَّا صَبَرُوا",
      english: "And We made from among them leaders guiding by Our command when they were patient",
      reference: "Quran 32:24",
      theme: "Leadership & Patience",
      icon: "👑",
      color: "from-purple-500 to-violet-600"
    },
    {
      arabic: "وَكَذَٰلِكَ جَعَلْنَاكُمْ أُمَّةً وَسَطًا",
      english: "And thus We have made you a just community",
      reference: "Quran 2:143",
      theme: "Balanced Community",
      icon: "⚖️",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const historicalPeriods = [
    {
      title: "The Prophetic Era (610-632 CE)",
      period: "23 Years",
      description: "The revelation of Islam and establishment of the first Muslim community",
      highlights: ["First Revelation", "Hijra to Madinah", "Constitution of Madinah", "Farewell Pilgrimage"],
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Rashidun Caliphate (632-661 CE)",
      period: "29 Years",
      description: "The era of the four rightly-guided Caliphs",
      highlights: ["Abu Bakr's Leadership", "Umar's Expansion", "Uthman's Compilation", "Ali's Wisdom"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Umayyad Dynasty (661-750 CE)",
      period: "89 Years",
      description: "Expansion across three continents and architectural marvels",
      highlights: ["Damascus Capital", "Dome of the Rock", "Expansion to Spain", "Administrative Systems"],
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Abbasid Golden Age (750-1258 CE)",
      period: "508 Years",
      description: "The pinnacle of Islamic civilization and learning",
      highlights: ["House of Wisdom", "Scientific Revolution", "Translation Movement", "Cultural Synthesis"],
      color: "from-amber-500 to-orange-600"
    }
  ];

  const islamicCivilizations = [
    {
      name: "Al-Andalus (Islamic Spain)",
      period: "711-1492 CE",
      capital: "Córdoba",
      achievements: ["Córdoba Library", "Religious Tolerance", "Architectural Wonders", "Scientific Advancement"],
      icon: "🏛️"
    },
    {
      name: "Ottoman Empire",
      period: "1299-1922 CE",
      capital: "Istanbul",
      achievements: ["Architectural Mastery", "Legal Codification", "Cultural Synthesis", "Territorial Expansion"],
      icon: "🕌"
    },
    {
      name: "Mughal Empire",
      period: "1526-1857 CE",
      capital: "Delhi/Agra",
      achievements: ["Taj Mahal", "Cultural Integration", "Administrative Excellence", "Artistic Patronage"],
      icon: "👑"
    },
    {
      name: "Fatimid Caliphate",
      period: "909-1171 CE",
      capital: "Cairo",
      achievements: ["Al-Azhar University", "Trade Networks", "Scientific Patronage", "Architectural Innovation"],
      icon: "📚"
    }
  ];

  const islamicContributions = [
    {
      field: "Mathematics",
      contributions: ["Algebra (Al-Khwarizmi)", "Decimal System", "Trigonometry", "Algorithms"],
      icon: "🔢",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      field: "Medicine",
      contributions: ["Surgery (Al-Zahrawi)", "Pharmacology", "Medical Ethics", "Hospital Systems"],
      icon: "⚕️",
      color: "bg-green-500/20 text-green-600"
    },
    {
      field: "Astronomy",
      contributions: ["Star Catalogs", "Astrolabe", "Observatory Systems", "Calendar Calculations"],
      icon: "🌟",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      field: "Philosophy",
      contributions: ["Rational Theology", "Aristotelian Commentary", "Ethical Systems", "Logic Development"],
      icon: "🧠",
      color: "bg-amber-500/20 text-amber-600"
    },
    {
      field: "Architecture",
      contributions: ["Geometric Patterns", "Dome Construction", "Minaret Design", "Garden Layouts"],
      icon: "🏗️",
      color: "bg-rose-500/20 text-rose-600"
    },
    {
      field: "Literature",
      contributions: ["Poetry Traditions", "Historical Chronicles", "Philosophical Works", "Scientific Texts"],
      icon: "📖",
      color: "bg-indigo-500/20 text-indigo-600"
    }
  ];

  return (
    <PublicPageLayout 
      title="Islamic History & Civilization" 
      subtitle="Explore the rich heritage and contributions of Islamic civilization"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section with 360 Rotating Verses */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <Globe size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Islamic History & Civilization</h1>
            <p className="text-muted-foreground max-w-4xl mx-auto text-lg mb-8">
              Journey through 1400 years of Islamic history, from the revelation in Makkah to the global civilization 
              that shaped science, art, philosophy, and human progress across continents.
            </p>
            
            {/* 360 Degree Rotating Quranic Verses */}
            <RotatingQuranVerses 
              verses={historicalVerses}
              rotationSpeed={10}
              className="max-w-5xl mx-auto"
            />
          </div>
        </div>

        {/* Historical Periods Timeline */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Calendar size={28} className="text-primary" />
              Major Historical Periods
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the key eras that shaped Islamic civilization and left lasting impacts on world history
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {historicalPeriods.map((period, index) => (
              <div 
                key={period.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${period.color} mb-4`} />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{period.title}</h3>
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                    {period.period}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{period.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Highlights:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {period.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Star size={12} className="text-primary flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Islamic Civilizations */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Crown size={28} className="text-primary" />
              Great Islamic Civilizations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the major Islamic empires and dynasties that flourished across different regions and eras
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {islamicCivilizations.map((civ, index) => (
              <div 
                key={civ.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{civ.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{civ.name}</h3>
                  <p className="text-sm text-muted-foreground">{civ.period}</p>
                  <p className="text-xs text-primary font-medium">Capital: {civ.capital}</p>
                </div>
                <div className="space-y-2">
                  {civ.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Award size={12} className="text-primary flex-shrink-0" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Islamic Contributions to World Civilization */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Lightbulb size={28} className="text-primary" />
              Contributions to World Civilization
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Islamic scholars and scientists made groundbreaking contributions that advanced human knowledge and progress
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {islamicContributions.map((contribution, index) => (
              <div 
                key={contribution.field}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${contribution.color} flex items-center justify-center text-2xl`}>
                    {contribution.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{contribution.field}</h3>
                </div>
                <div className="space-y-2">
                  {contribution.contributions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Islamic Values in Civilization */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Islamic Values in Civilization Building</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The core Islamic principles that guided the development of a just and prosperous civilization
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "Justice (Adl)",
                description: "Establishing fair legal systems and social equity",
                icon: "⚖️"
              },
              {
                value: "Knowledge (Ilm)",
                description: "Promoting education and scientific inquiry",
                icon: "📚"
              },
              {
                value: "Tolerance (Tasamuh)",
                description: "Respecting diversity and protecting minorities",
                icon: "🤝"
              },
              {
                value: "Innovation (Ibda)",
                description: "Encouraging creativity and technological advancement",
                icon: "💡"
              }
            ].map((value, index) => (
              <div 
                key={value.value}
                className="text-center p-4 rounded-lg bg-card/50 border border-border/30 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-3">{value.icon}</div>
                <h3 className="font-semibold mb-2">{value.value}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
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
            وَكَذَٰلِكَ جَعَلْنَاكُمْ أُمَّةً وَسَطًا لِّتَكُونُوا شُهَدَاءَ عَلَى النَّاسِ
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And thus We have made you a just community that you will be witnesses over the people" - Quran 2:143
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}