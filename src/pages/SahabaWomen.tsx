import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { 
  Users, 
  Crown, 
  Heart, 
  Star, 
  Shield,
  BookOpen,
  Sword,
  Lightbulb,
  Award,
  Globe,
  Flower,
  GraduationCap
} from "lucide-react";

export default function SahabaWomen() {
  const navigate = useNavigate();
  const location = useLocation();

  const khulafaRashidun = [
    {
      name: "Abu Bakr As-Siddiq (RA)",
      title: "The Truthful",
      period: "632-634 CE",
      achievements: [
        "First to believe among men",
        "Compiled the Quran",
        "Ridda Wars victory",
        "Expansion to Iraq & Syria"
      ],
      qualities: ["Unwavering faith", "Loyalty", "Wisdom", "Humility"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Umar ibn Al-Khattab (RA)",
      title: "Al-Faruq (The Criterion)",
      period: "634-644 CE",
      achievements: [
        "Vast territorial expansion",
        "Administrative reforms",
        "Justice system establishment",
        "Hijri calendar introduction"
      ],
      qualities: ["Justice", "Strength", "Humility", "Accountability"],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Uthman ibn Affan (RA)",
      title: "Dhun-Nurayn (Possessor of Two Lights)",
      period: "644-656 CE",
      achievements: [
        "Standardized Quran compilation",
        "Naval expansion",
        "Generous charity",
        "Infrastructure development"
      ],
      qualities: ["Generosity", "Modesty", "Patience", "Piety"],
      color: "from-purple-500 to-violet-500"
    },
    {
      name: "Ali ibn Abi Talib (RA)",
      title: "Asadullah (Lion of Allah)",
      period: "656-661 CE",
      achievements: [
        "Bravery in battles",
        "Knowledge and wisdom",
        "Justice and fairness",
        "Eloquent speeches"
      ],
      qualities: ["Courage", "Knowledge", "Justice", "Eloquence"],
      color: "from-amber-500 to-orange-500"
    }
  ];

  const notableSahaba = [
    {
      name: "Khalid ibn Al-Walid (RA)",
      title: "Saif Allah Al-Maslul",
      specialty: "Military Genius",
      achievement: "Never lost a battle",
      icon: "⚔️",
      color: "bg-red-500/20 text-red-600"
    },
    {
      name: "Abu Ubaidah (RA)",
      title: "Amin Al-Ummah",
      specialty: "Trustworthy Leader",
      achievement: "Conquest of Syria",
      icon: "🛡️",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      name: "Salman Al-Farisi (RA)",
      title: "The Persian Companion",
      specialty: "Strategic Advisor",
      achievement: "Trench Battle strategy",
      icon: "🏗️",
      color: "bg-green-500/20 text-green-600"
    },
    {
      name: "Bilal ibn Rabah (RA)",
      title: "The First Muezzin",
      specialty: "Devotion & Perseverance",
      achievement: "Endured torture for faith",
      icon: "🕌",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      name: "Abdullah ibn Masud (RA)",
      title: "Scholar of Quran",
      specialty: "Quranic Knowledge",
      achievement: "Memorized 70 Surahs",
      icon: "📖",
      color: "bg-indigo-500/20 text-indigo-600"
    },
    {
      name: "Abu Hurairah (RA)",
      title: "Narrator of Hadith",
      specialty: "Hadith Preservation",
      achievement: "5374 narrated Hadith",
      icon: "📚",
      color: "bg-amber-500/20 text-amber-600"
    }
  ];

  const womenOfIslam = [
    {
      name: "Khadijah bint Khuwaylid (RA)",
      title: "Mother of the Believers",
      role: "First Muslim Woman",
      contributions: [
        "Supported the Prophet's mission",
        "Successful businesswoman",
        "Mother of Fatimah (RA)",
        "Provided emotional support during revelation"
      ],
      qualities: ["Business acumen", "Loyalty", "Wisdom", "Generosity"],
      period: "Pre-Islam & Early Islam"
    },
    {
      name: "Aisha bint Abu Bakr (RA)",
      title: "The Beloved of the Beloved",
      role: "Scholar & Teacher",
      contributions: [
        "Narrated 2210 Hadith",
        "Taught Islamic jurisprudence",
        "Led in Battle of Camel",
        "Preserved Prophetic traditions"
      ],
      qualities: ["Intelligence", "Memory", "Teaching", "Leadership"],
      period: "Prophetic & Post-Prophetic Era"
    },
    {
      name: "Fatimah bint Muhammad (RA)",
      title: "Sayyidat Nisa Al-Alameen",
      role: "Daughter of the Prophet",
      contributions: [
        "Perfect example of daughter",
        "Mother of Hassan & Hussein",
        "Supported Ali (RA)",
        "Embodied patience and piety"
      ],
      qualities: ["Piety", "Patience", "Devotion", "Strength"],
      period: "Prophetic Era"
    },
    {
      name: "Hafsa bint Umar (RA)",
      title: "Guardian of the Quran",
      role: "Preserver of Revelation",
      contributions: [
        "Kept the compiled Quran",
        "Memorized the Quran",
        "Transmitted Hadith",
        "Advised on Islamic matters"
      ],
      qualities: ["Memory", "Trustworthiness", "Piety", "Wisdom"],
      period: "Prophetic & Caliphate Era"
    }
  ];

  const womenScholars = [
    {
      name: "Umm Salamah (RA)",
      specialty: "Jurisprudence & Wisdom",
      contribution: "Advised on Treaty of Hudaybiyyah",
      icon: "⚖️"
    },
    {
      name: "Asma bint Abu Bakr (RA)",
      specialty: "Courage & Support",
      contribution: "Helped during Hijra migration",
      icon: "🦅"
    },
    {
      name: "Nusaybah bint Ka'b (RA)",
      specialty: "Battlefield Medicine",
      contribution: "Protected the Prophet in Uhud",
      icon: "🏥"
    },
    {
      name: "Rufaidah Al-Aslamiyyah (RA)",
      specialty: "Medical Pioneer",
      contribution: "First Muslim nurse and surgeon",
      icon: "⚕️"
    }
  ];

  const lessons = [
    {
      category: "Leadership Lessons",
      examples: [
        "Abu Bakr's decisive leadership during crisis",
        "Umar's accountability and justice system",
        "Uthman's patience during trials",
        "Ali's wisdom in complex situations"
      ]
    },
    {
      category: "Women's Contributions",
      examples: [
        "Khadijah's economic empowerment",
        "Aisha's educational leadership",
        "Fatimah's family devotion",
        "Hafsa's preservation of Quran"
      ]
    },
    {
      category: "Character Development",
      examples: [
        "Bilal's perseverance through hardship",
        "Salman's strategic thinking",
        "Abu Hurairah's dedication to learning",
        "Khalid's military excellence"
      ]
    },
    {
      category: "Social Impact",
      examples: [
        "Breaking racial barriers",
        "Empowering women in society",
        "Establishing justice systems",
        "Promoting education and knowledge"
      ]
    }
  ];

  return (
    <PublicPageLayout 
      title="Sahaba & Women of Islam" 
      subtitle="The noble companions and remarkable women who shaped Islamic history"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <Users size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Sahaba & Women of Islam</h1>
            <p className="text-muted-foreground max-w-4xl mx-auto text-lg">
              Discover the extraordinary lives of the Prophet's companions and the remarkable women who 
              contributed to the foundation and growth of Islamic civilization through their faith, wisdom, and dedication.
            </p>
          </div>
        </div>

        {/* Khulafa Rashidun */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Crown size={28} className="text-primary" />
              The Rightly-Guided Caliphs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The four successors of Prophet Muhammad ﷺ who led the Muslim community with justice and wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {khulafaRashidun.map((caliph, index) => (
              <div 
                key={caliph.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${caliph.color} mb-4`} />
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">{caliph.name}</h3>
                  <p className="text-primary font-medium">{caliph.title}</p>
                  <p className="text-sm text-muted-foreground">{caliph.period}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Major Achievements:</h4>
                    <div className="space-y-1">
                      {caliph.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Star size={12} className="text-primary flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Noble Qualities:</h4>
                    <div className="space-y-1">
                      {caliph.qualities.map((quality, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{quality}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notable Sahaba */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Shield size={28} className="text-primary" />
              Notable Companions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Distinguished companions who excelled in various fields and left lasting legacies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notableSahaba.map((sahabi, index) => (
              <div 
                key={sahabi.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 rounded-lg ${sahabi.color} flex items-center justify-center mx-auto mb-3 text-3xl`}>
                    {sahabi.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{sahabi.name}</h3>
                  <p className="text-primary font-medium text-sm">{sahabi.title}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-center">
                    <p className="text-sm font-medium">{sahabi.specialty}</p>
                    <p className="text-xs text-muted-foreground">{sahabi.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Women of Islam */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Flower size={28} className="text-primary" />
              Remarkable Women of Islam
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pioneering women who contributed significantly to Islamic society and scholarship
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {womenOfIslam.map((woman, index) => (
              <div 
                key={woman.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">{woman.name}</h3>
                  <p className="text-primary font-medium">{woman.title}</p>
                  <p className="text-sm text-muted-foreground">{woman.role} • {woman.period}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Key Contributions:</h4>
                    <div className="space-y-1">
                      {woman.contributions.map((contribution, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Heart size={12} className="text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{contribution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Notable Qualities:</h4>
                    <div className="space-y-1">
                      {woman.qualities.map((quality, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{quality}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Women Scholars & Pioneers */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <GraduationCap size={28} className="text-primary" />
              Women Scholars & Pioneers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Women who broke barriers and excelled in various fields of knowledge and service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {womenScholars.map((scholar, index) => (
              <div 
                key={scholar.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-3">{scholar.icon}</div>
                <h3 className="font-semibold mb-2">{scholar.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{scholar.specialty}</p>
                <p className="text-xs text-muted-foreground">{scholar.contribution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons from the Sahaba */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Lightbulb size={28} className="text-primary" />
              Lessons from the Sahaba
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Timeless lessons we can learn from the lives and examples of the noble companions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {lessons.map((category, index) => (
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
                  {category.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{example}</p>
                    </div>
                  ))}
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
            وَالسَّابِقُونَ الْأَوَّلُونَ مِنَ الْمُهَاجِرِينَ وَالْأَنصَارِ وَالَّذِينَ اتَّبَعُوهُم بِإِحْسَانٍ رَّضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And the first forerunners among the Muhajireen and Ansar and those who followed them with good conduct - 
            Allah is pleased with them and they are pleased with Him" - Quran 9:100
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}