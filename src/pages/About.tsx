import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";
import IslamicSpaceFiller from "@/components/islamic/IslamicSpaceFiller";
import { 
  BookOpen, 
  Users, 
  Award,
  Calendar,
  Download,
  ExternalLink,
  Heart,
  Shield,
  Globe,
  CheckCircle,
  Clock,
  Building,
  Target,
  Eye,
  Star,
  Compass,
  Lightbulb,
  Handshake,
  Zap,
  Gem,
  Crown,
  Flame,
  Mountain,
  Sunrise
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"mission" | "history" | "structure" | "values" | "constitution">("mission");

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
      title: "Academic Sector Launch",
      description: "Creation of dedicated academic sector to enhance educational support",
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
        { title: "Amir (President)", name: "Musab Abdurahman", responsibilities: ["Overall leadership", "Strategic planning", "External relations"] },
        { title: "Vice Amir", name: "Yusuf Usman", responsibilities: ["Operations oversight", "Committee coordination", "Member relations"] }
      ],
      color: "from-red-500 to-pink-500"
    },
    {
      level: "Core Committees",
      positions: [
        { title: "IT Sector Head", name: "Yusuf Usman", responsibilities: ["Technology leadership", "System development", "Digital innovation"] },
        { title: "System Administrator", name: "Feysal Hussein Kedir", responsibilities: ["System administration", "Infrastructure management", "Security oversight"] },
        { title: "Academic Coordinator", name: "Muaz Kedir", responsibilities: ["Educational programs", "Academic support", "Learning resources"] },
        { title: "Da'wa Coordinator", name: "Amar", responsibilities: ["Islamic outreach", "Educational programs", "Community engagement"] },
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
      color: "from-blue-500 to-cyan-500",
      detailedExplanation: "Tawhid is the fundamental principle of Islam, encompassing both the unity of Allah and the unity of the Muslim Ummah. In our Jama'a, this translates to bringing together students from diverse ethnic, linguistic, and cultural backgrounds under the banner of Islam.",
      practicalImplementation: [
        "Weekly unity circles where students from different faculties share experiences",
        "Multilingual Islamic programs in Amharic, Oromo, and Arabic",
        "Interfaith dialogue sessions promoting understanding",
        "Joint prayers and community activities regardless of madhab differences"
      ]
    },
    {
      value: "Ilm (Knowledge)",
      description: "Pursuit of both religious and worldly knowledge",
      application: "Promoting academic excellence and Islamic education",
      verse: "And say: My Lord, increase me in knowledge",
      reference: "Quran 20:114",
      icon: "📚",
      color: "from-green-500 to-emerald-500",
      detailedExplanation: "Islam places immense emphasis on seeking knowledge. The Prophet (ﷺ) said: 'Seek knowledge from the cradle to the grave.' Our commitment to Ilm encompasses both Dunya (worldly) and Akhirah (hereafter) knowledge.",
      practicalImplementation: [
        "Daily Quran study circles with Tafsir sessions",
        "Academic tutoring programs for struggling students",
        "Islamic finance and ethics workshops",
        "Science and Islam seminars exploring compatibility",
        "Arabic language classes for non-Arabic speakers"
      ]
    },
    {
      value: "Amanah (Trust)",
      description: "Trustworthiness and responsibility in all affairs",
      application: "Maintaining integrity in leadership and community service",
      verse: "Indeed, Allah commands you to render trusts to whom they are due",
      reference: "Quran 4:58",
      icon: "🔒",
      color: "from-purple-500 to-violet-500",
      detailedExplanation: "Amanah represents the sacred trust that Allah has placed upon humanity. Every position of leadership, every responsibility, and every interaction is viewed as a trust that must be fulfilled with utmost integrity.",
      practicalImplementation: [
        "Transparent financial reporting and budget allocation",
        "Regular accountability sessions with community members",
        "Ethical guidelines for all committee members",
        "Confidentiality protocols for personal counseling services"
      ]
    },
    {
      value: "Adl (Justice)",
      description: "Fairness and equity in all dealings",
      application: "Ensuring equal opportunities and fair treatment for all members",
      verse: "O you who believe! Stand out firmly for justice",
      reference: "Quran 4:135",
      icon: "⚖️",
      color: "from-orange-500 to-red-500",
      detailedExplanation: "Justice in Islam is not merely legal fairness but encompasses social, economic, and spiritual equity. Our Jama'a strives to create an environment where every member feels valued and heard.",
      practicalImplementation: [
        "Equal representation in leadership positions",
        "Fair distribution of resources and opportunities",
        "Conflict resolution mechanisms based on Islamic principles",
        "Support systems for marginalized community members"
      ]
    },
    {
      value: "Ihsan (Excellence)",
      description: "Striving for excellence in worship and worldly affairs",
      application: "Pursuing the highest standards in all activities and services",
      verse: "And Allah loves those who do good with excellence",
      reference: "Quran 2:195",
      icon: "⭐",
      color: "from-amber-500 to-yellow-500",
      detailedExplanation: "Ihsan represents the highest level of faith and practice - worshipping Allah as if you see Him. This principle drives us to excellence in both spiritual and academic pursuits.",
      practicalImplementation: [
        "Quality assurance in all programs and services",
        "Continuous improvement of Islamic education curricula",
        "Excellence awards for outstanding academic and spiritual achievements",
        "Mentorship programs pairing senior students with newcomers"
      ]
    },
    {
      value: "Khidmah (Service)",
      description: "Serving the community and humanity",
      application: "Providing services and support to students and the broader community",
      verse: "And whoever volunteers good - then indeed, Allah is appreciative and Knowing",
      reference: "Quran 2:158",
      icon: "❤️",
      color: "from-pink-500 to-rose-500",
      detailedExplanation: "Service to humanity is a fundamental aspect of Islamic character. The Prophet (ﷺ) said: 'The best of people are those who benefit others.' Our service extends beyond the Muslim community to all of humanity.",
      practicalImplementation: [
        "Community service projects in local villages",
        "Free tutoring services for underprivileged students",
        "Healthcare awareness campaigns",
        "Environmental conservation initiatives",
        "Interfaith community service partnerships"
      ]
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
    <PublicPageLayout 
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

        {/* Islamic Educational Content - Between Stats and Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: "mission", label: "Vision & Mission", icon: Target },
            { id: "history", label: "History & Milestones", icon: Clock },
            { id: "structure", label: "Organizational Structure", icon: Building },
            { id: "values", label: "Core Values", icon: Heart },
            { id: "constitution", label: "Constitution & Bylaws", icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "mission" | "history" | "structure" | "values" | "constitution")}
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

        {/* Vision & Mission Tab */}
        {activeTab === "mission" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">HUMSJ Vision, Mission & Values</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Discover the foundational principles, aspirations, and values that guide 
                Haramaya University Muslim Students Jama'a in building a strong Islamic community.
              </p>
            </div>

            {/* Vision Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Eye size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-blue-800 dark:text-blue-200 mb-2">🌟 VISION</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Our Aspiration for the Future</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-blue-900 dark:text-blue-100">
                To build a strong, knowledgeable, and morally upright Muslim student community at Haramaya University 
                that upholds Islamic values, contributes positively to society, and serves as a model of unity, 
                excellence, and peaceful coexistence.
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Target size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-green-800 dark:text-green-200 mb-2">🎯 MISSION</h3>
                  <p className="text-sm text-green-600 dark:text-green-300">Our Purpose and Commitment</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-green-900 dark:text-green-100 mb-6">
                To nurture the spiritual, intellectual, and social development of Muslim students at Haramaya University by:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Promoting authentic Islamic teachings based on the Qur'an and Sunnah",
                  "Providing platforms for learning, worship, and community service",
                  "Strengthening brotherhood and sisterhood",
                  "Engaging students in constructive, ethical, and peaceful activities",
                  "Utilizing technology and innovation to support Islamic da'wah and student welfare"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-sm text-green-800 dark:text-green-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectives Section */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <Compass size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-purple-800 dark:text-purple-200 mb-2">🧭 OBJECTIVES</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Our Strategic Goals</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "To strengthen Islamic identity and faith (Iman) among Muslim students",
                  "To provide Islamic education through lectures, halaqahs, and study circles",
                  "To promote unity and cooperation among Muslim students",
                  "To facilitate proper worship practices, including prayer and Islamic events",
                  "To preserve and promote Islamic history and culture, including Islam in Ethiopia",
                  "To support academic excellence alongside Islamic morals",
                  "To engage students in community service and volunteerism",
                  "To protect the rights, dignity, and welfare of Muslim students",
                  "To encourage youth leadership and responsibility",
                  "To support peaceful coexistence and mutual respect within the university community",
                  "To use information technology for effective communication and da'wah",
                  "To collaborate with university bodies and external Islamic organizations"
                ].map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/50 dark:bg-purple-900/20 rounded-lg hover:bg-white/70 dark:hover:bg-purple-900/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200">{objective}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Gem size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-amber-800 dark:text-amber-200 mb-2">💎 CORE VALUES</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-300">Our Fundamental Principles</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { arabic: "Tawḥīd", english: "Belief in the Oneness of Allah", icon: Crown },
                  { arabic: "Ikhlāṣ", english: "Sincerity in intention and action", icon: Heart },
                  { arabic: "Ukhuwwah & Ukhtiyyah", english: "Brotherhood and sisterhood", icon: Users },
                  { arabic: "Akhlaq", english: "Good manners and character", icon: Star },
                  { arabic: "'Ilm", english: "Seeking and spreading beneficial knowledge", icon: BookOpen },
                  { arabic: "'Adl", english: "Justice and fairness", icon: Shield },
                  { arabic: "Amanah", english: "Trust and responsibility", icon: Handshake },
                  { arabic: "Shura", english: "Consultation and collective decision-making", icon: Users },
                  { arabic: "Ihsan", english: "Excellence and quality in all actions", icon: Zap }
                ].map((value, index) => (
                  <div key={index} className="p-4 bg-white/50 dark:bg-amber-900/20 rounded-lg hover:bg-white/70 dark:hover:bg-amber-900/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <value.icon size={20} className="text-amber-600" />
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">{value.arabic}</h4>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{value.english}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guiding Principles Section */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-2xl p-8 border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Compass size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-teal-800 dark:text-teal-200 mb-2">🕌 GUIDING PRINCIPLES</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-300">Our Operational Framework</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Adherence to Qur'an and Sunnah",
                  "Moderation and wisdom in da'wah",
                  "Respect for university rules and national laws",
                  "Inclusiveness without compromising Islamic values",
                  "Transparency and accountability",
                  "Gender dignity and modesty",
                  "Peaceful engagement and dialogue"
                ].map((principle, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-teal-900/20 rounded-lg">
                    <CheckCircle size={16} className="text-teal-600 flex-shrink-0" />
                    <p className="text-sm text-teal-800 dark:text-teal-200">{principle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Activities Section */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <Calendar size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-rose-800 dark:text-rose-200 mb-2">🌍 CORE ACTIVITIES</h3>
                  <p className="text-sm text-rose-600 dark:text-rose-300">Our Key Programs and Initiatives</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { activity: "Islamic lectures, seminars, and halaqahs", icon: BookOpen },
                  { activity: "Daily and Jumu'ah prayer coordination", icon: Clock },
                  { activity: "Da'wah and awareness programs", icon: Lightbulb },
                  { activity: "Community service and charity work", icon: Heart },
                  { activity: "Student counseling and mentorship", icon: Users },
                  { activity: "Cultural and Islamic events", icon: Calendar },
                  { activity: "Digital da'wah and IT initiatives", icon: Globe }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-white/50 dark:bg-rose-900/20 rounded-lg hover:bg-white/70 dark:hover:bg-rose-900/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon size={20} className="text-rose-600" />
                    </div>
                    <p className="text-sm text-rose-800 dark:text-rose-200">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Motto Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                  <Flame size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-indigo-800 dark:text-indigo-200 mb-2">📌 MOTTO</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-300">Our Inspiring Slogans</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "Faith, Knowledge, and Unity",
                  "Building Faith, Serving Humanity",
                  "Guided by Islam, United in Purpose"
                ].map((motto, index) => (
                  <div key={index} className="p-4 bg-white/50 dark:bg-indigo-900/20 rounded-lg">
                    <p className="text-lg font-display text-indigo-800 dark:text-indigo-200">"{motto}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Islamic Quote */}
            <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sunrise size={24} className="text-green-600" />
                <Mountain size={24} className="text-blue-600" />
                <Sunrise size={24} className="text-green-600" />
              </div>
              <p className="text-xl font-arabic text-green-800 dark:text-green-200 mb-4" dir="rtl">
                وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect."
              </p>
              <p className="text-xs text-muted-foreground">Quran 65:2-3</p>
            </div>
          </div>
        )}

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

              {/* HUMSJ Information Channels Section */}
              <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-display tracking-wide mb-2">Information Channels</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto"></div>
                  <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Connect with our specialized sectors through official Telegram channels for updates, resources, and community engagement.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Academic Sector",
                      description: "Academic programs, scholarships, and educational resources",
                      url: "https://t.me/HUMSJ_accdamic",
                      icon: "🎓",
                      color: "from-blue-500 to-cyan-500",
                      features: ["Scholarship opportunities", "Academic support", "Study resources"]
                    },
                    {
                      name: "Information & Technology",
                      description: "IT services, technical support, and digital solutions",
                      url: "https://t.me/Information_sector_of_Humsj",
                      icon: "💻",
                      color: "from-green-500 to-emerald-500",
                      features: ["Technical support", "Digital services", "IT updates"]
                    },
                    {
                      name: "Da'ewa & Irshad (Amharic)",
                      description: "Islamic guidance and education in Amharic language",
                      url: "https://t.me/HRUMUSLIMSTUDENTSJEMEA",
                      icon: "📚",
                      color: "from-purple-500 to-violet-500",
                      features: ["Islamic education", "Spiritual guidance", "Community programs"]
                    },
                    {
                      name: "Da'ewa & Irshad (Afaan Oromoo)",
                      description: "Islamic guidance and education in Afaan Oromoo language",
                      url: "https://t.me/HUMSJsectoroffajrulislam",
                      icon: "📖",
                      color: "from-orange-500 to-red-500",
                      features: ["Religious education", "Cultural programs", "Language support"]
                    },
                    {
                      name: "External Affairs",
                      description: "External partnerships, collaborations, and outreach programs",
                      url: "https://t.me/+VMJzgG5c24djM2Rk",
                      icon: "🤝",
                      color: "from-teal-500 to-blue-500",
                      features: ["Partnership updates", "Collaboration opportunities", "External relations"]
                    },
                    {
                      name: "Comparative Religion",
                      description: "Interfaith dialogue and comparative religious studies",
                      url: "https://t.me/HUMSJComparative",
                      icon: "🕊️",
                      color: "from-indigo-500 to-purple-500",
                      features: ["Religious studies", "Interfaith dialogue", "Academic discussions"]
                    },
                    {
                      name: "Beytal Maal & Social Affairs",
                      description: "Financial services and social welfare programs",
                      url: "#",
                      icon: "💰",
                      color: "from-amber-500 to-yellow-500",
                      features: ["Financial support", "Social programs", "Community welfare"],
                      disabled: true
                    }
                  ].map((channel, index) => (
                    <div 
                      key={channel.name}
                      className={`bg-card rounded-xl p-6 border border-border/30 transition-all duration-300 ${
                        channel.disabled 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:border-primary/30 hover:scale-105 cursor-pointer'
                      }`}
                      onClick={() => !channel.disabled && window.open(channel.url, '_blank')}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${channel.color} flex items-center justify-center text-2xl`}>
                          {channel.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{channel.name}</h4>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                        </div>
                        {!channel.disabled && (
                          <ExternalLink size={16} className="text-primary opacity-70" />
                        )}
                      </div>
                      <div className="space-y-2">
                        {channel.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle size={10} className="text-primary flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      {channel.disabled && (
                        <div className="mt-3 text-xs text-muted-foreground italic">
                          Contact us for more information
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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

        {/* Islamic Knowledge & Wisdom Section */}
        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-green-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <BookOpen size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Islamic Knowledge & Wisdom</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enriching our community with authentic Islamic knowledge and timeless wisdom from the Quran and Sunnah
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Daily Islamic Reminders */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🌅</span>
                Daily Islamic Reminders
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Morning Dhikr",
                    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
                    transliteration: "Asbahna wa asbahal-mulku lillah",
                    translation: "We have reached the morning and with it Allah's sovereignty",
                    benefit: "Protection and blessings for the day"
                  },
                  {
                    title: "Evening Dhikr",
                    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
                    transliteration: "Amsayna wa amsal-mulku lillah",
                    translation: "We have reached the evening and with it Allah's sovereignty",
                    benefit: "Peace and protection through the night"
                  },
                  {
                    title: "Before Sleep",
                    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
                    transliteration: "Bismika Allahumma amutu wa ahya",
                    translation: "In Your name, O Allah, I die and I live",
                    benefit: "Peaceful sleep and spiritual protection"
                  }
                ].map((dhikr, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{dhikr.title}</h4>
                    <p className="text-lg font-arabic text-right mb-2 text-green-600">{dhikr.arabic}</p>
                    <p className="text-sm italic text-muted-foreground mb-1">{dhikr.transliteration}</p>
                    <p className="text-sm mb-2">{dhikr.translation}</p>
                    <p className="text-xs text-accent font-medium">{dhikr.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Islamic Etiquettes */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Islamic Etiquettes (Adab)
              </h3>
              <div className="space-y-4">
                {[
                  {
                    category: "Greeting",
                    etiquette: "Always initiate Salam when meeting fellow Muslims",
                    hadith: "The Prophet (ﷺ) said: 'You will not enter Paradise until you believe, and you will not believe until you love one another. Shall I tell you something that will make you love one another? Spread the greeting of peace among you.'",
                    reference: "Sahih Muslim"
                  },
                  {
                    category: "Eating",
                    etiquette: "Say Bismillah before eating and Alhamdulillah after",
                    hadith: "When any of you eats, let him mention Allah's name (say Bismillah), and if he forgets to mention Allah's name at the beginning, let him say: 'Bismillahi awwalahu wa akhirahu'",
                    reference: "Abu Dawud, Tirmidhi"
                  },
                  {
                    category: "Learning",
                    etiquette: "Seek knowledge with humility and respect for teachers",
                    hadith: "The Prophet (ﷺ) said: 'Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him.'",
                    reference: "Sahih Muslim"
                  }
                ].map((adab, idx) => (
                  <div key={idx} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                    <h4 className="font-semibold text-primary mb-2">{adab.category} Etiquette</h4>
                    <p className="text-sm mb-3 font-medium">{adab.etiquette}</p>
                    <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3 mb-2">
                      "{adab.hadith}"
                    </blockquote>
                    <p className="text-xs text-accent font-medium">- {adab.reference}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Calendar & Important Dates */}
        <div className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 rounded-3xl p-8 border border-purple-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Calendar size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">Islamic Calendar & Sacred Times</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the Islamic calendar and the significance of sacred times in our faith
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                month: "Muharram",
                significance: "Sacred month, Day of Ashura",
                events: ["Islamic New Year", "Day of Ashura (10th)", "Recommended fasting"],
                color: "from-red-500 to-pink-500",
                icon: "🌙"
              },
              {
                month: "Rabi' al-Awwal",
                significance: "Birth month of Prophet Muhammad (ﷺ)",
                events: ["Mawlid an-Nabi", "Increased Salawat", "Study of Seerah"],
                color: "from-green-500 to-emerald-500",
                icon: "🕌"
              },
              {
                month: "Rajab",
                significance: "Sacred month of preparation",
                events: ["Isra and Mi'raj (27th)", "Increased worship", "Preparation for Ramadan"],
                color: "from-blue-500 to-cyan-500",
                icon: "⭐"
              },
              {
                month: "Sha'ban",
                significance: "Month of preparation for Ramadan",
                events: ["Laylat al-Bara'ah (15th)", "Increased fasting", "Spiritual preparation"],
                color: "from-amber-500 to-yellow-500",
                icon: "🌟"
              },
              {
                month: "Ramadan",
                significance: "Holy month of fasting",
                events: ["Daily fasting", "Laylat al-Qadr", "Increased worship and charity"],
                color: "from-teal-500 to-green-500",
                icon: "🌙"
              },
              {
                month: "Dhul Hijjah",
                significance: "Month of Hajj pilgrimage",
                events: ["Hajj pilgrimage", "Eid al-Adha", "Day of Arafah fasting"],
                color: "from-orange-500 to-red-500",
                icon: "🕋"
              }
            ].map((month, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${month.color} p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-transform duration-300`}>
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{month.icon}</span>
                  <h3 className="text-xl font-semibold">{month.month}</h3>
                  <p className="text-sm opacity-90">{month.significance}</p>
                </div>
                <div className="space-y-2">
                  {month.events.map((event, eventIdx) => (
                    <div key={eventIdx} className="bg-white/20 rounded-lg p-2 text-sm">
                      • {event}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Five Pillars of Islam */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display tracking-wide mb-4">The Five Pillars of Islam</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The fundamental acts of worship that form the foundation of Muslim life and practice
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                pillar: "Shahada",
                arabic: "الشهادة",
                description: "Declaration of Faith",
                details: "Testifying that there is no god but Allah and Muhammad is His messenger",
                practice: "Recited with conviction and understanding",
                icon: "☪️",
                color: "from-green-500 to-emerald-500"
              },
              {
                pillar: "Salah",
                arabic: "الصلاة",
                description: "Prayer",
                details: "Five daily prayers connecting the believer with Allah",
                practice: "Fajr, Dhuhr, Asr, Maghrib, Isha - performed with focus and devotion",
                icon: "🤲",
                color: "from-blue-500 to-cyan-500"
              },
              {
                pillar: "Zakat",
                arabic: "الزكاة",
                description: "Obligatory Charity",
                details: "Purification of wealth through giving to those in need",
                practice: "2.5% of savings annually to eligible recipients",
                icon: "💰",
                color: "from-amber-500 to-yellow-500"
              },
              {
                pillar: "Sawm",
                arabic: "الصوم",
                description: "Fasting",
                details: "Abstaining from food, drink, and marital relations during Ramadan",
                practice: "From dawn to sunset, developing self-control and empathy",
                icon: "🌙",
                color: "from-purple-500 to-violet-500"
              },
              {
                pillar: "Hajj",
                arabic: "الحج",
                description: "Pilgrimage",
                details: "Journey to Mecca for those who are able",
                practice: "Once in a lifetime obligation, unity of Muslim Ummah",
                icon: "🕋",
                color: "from-red-500 to-pink-500"
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-4">
                  <span className="text-3xl mb-2 block">{pillar.icon}</span>
                  <h3 className="text-lg font-semibold text-primary">{pillar.pillar}</h3>
                  <p className="text-xl font-arabic text-accent mb-2">{pillar.arabic}</p>
                  <p className="text-sm font-medium text-secondary">{pillar.description}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{pillar.details}</p>
                  <div className={`bg-gradient-to-r ${pillar.color} p-3 rounded-lg text-white text-xs`}>
                    <strong>Practice:</strong> {pillar.practice}
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