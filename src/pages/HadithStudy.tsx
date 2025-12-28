import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { islamicEducationApi } from "@/services/islamicEducationApi";
import { 
  Scroll, 
  BookOpen, 
  Search, 
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  Star,
  Filter,
  Heart,
  Award,
  Globe,
  MessageCircle,
  FileText,
  Volume2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HadithStudy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");

  const hadithCollections = [
    {
      id: "bukhari",
      name: "Sahih al-Bukhari",
      nameArabic: "صحيح البخاري",
      nameOromo: "Sahiih al-Bukhaarii",
      compiler: "Imam al-Bukhari",
      totalHadith: 7563,
      description: "The most authentic collection of hadith, compiled by Imam Muhammad al-Bukhari",
      color: "from-green-500 to-emerald-500",
      rank: 1
    },
    {
      id: "muslim",
      name: "Sahih Muslim",
      nameArabic: "صحيح مسلم",
      nameOromo: "Sahiih Muslim",
      compiler: "Imam Muslim",
      totalHadith: 7470,
      description: "Second most authentic hadith collection, compiled by Imam Muslim ibn al-Hajjaj",
      color: "from-blue-500 to-cyan-500",
      rank: 2
    },
    {
      id: "abudawud",
      name: "Sunan Abu Dawud",
      nameArabic: "سنن أبي داود",
      nameOromo: "Sunan Abuu Daawuud",
      compiler: "Imam Abu Dawud",
      totalHadith: 5274,
      description: "Comprehensive collection focusing on legal and practical matters",
      color: "from-purple-500 to-violet-500",
      rank: 3
    },
    {
      id: "tirmidhi",
      name: "Jami' at-Tirmidhi",
      nameArabic: "جامع الترمذي",
      nameOromo: "Jaami'i at-Tirmidhii",
      compiler: "Imam at-Tirmidhi",
      totalHadith: 3956,
      description: "Known for its detailed commentary on hadith authenticity",
      color: "from-orange-500 to-red-500",
      rank: 4
    },
    {
      id: "nasai",
      name: "Sunan an-Nasa'i",
      nameArabic: "سنن النسائي",
      nameOromo: "Sunan an-Nasaa'ii",
      compiler: "Imam an-Nasa'i",
      totalHadith: 5761,
      description: "Focused collection with strict criteria for hadith acceptance",
      color: "from-indigo-500 to-purple-500",
      rank: 5
    },
    {
      id: "ibnmajah",
      name: "Sunan Ibn Majah",
      nameArabic: "سنن ابن ماجه",
      nameOromo: "Sunan Ibn Maajah",
      compiler: "Imam Ibn Majah",
      totalHadith: 4341,
      description: "Completes the six major hadith collections (Kutub as-Sittah)",
      color: "from-pink-500 to-rose-500",
      rank: 6
    }
  ];

  const featuredHadith = [
    {
      id: 1,
      text: "The believer is not one who eats his fill while his neighbor goes hungry.",
      textArabic: "ليس المؤمن الذي يشبع وجاره جائع إلى جنبه",
      textOromo: "Namni amanu kan garaa guutee nyaatee ollaan isaa beela'u miti.",
      source: "Sahih al-Bukhari",
      narrator: "Ibn Abbas",
      theme: "Social Responsibility",
      category: "Ethics"
    },
    {
      id: 2,
      text: "Actions are but by intention, and every man shall have only that which he intended.",
      textArabic: "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى",
      textOromo: "Hojiin kaayyoo qofaan, tokkoon tokkoon namaa waan kaayyeffate qofa argata.",
      source: "Sahih al-Bukhari",
      narrator: "Umar ibn al-Khattab",
      theme: "Intention",
      category: "Worship"
    },
    {
      id: 3,
      text: "The best of people are those who benefit others.",
      textArabic: "خير الناس أنفعهم للناس",
      textOromo: "Namoonni hundumaa keessaa kan hundarra gaarii namoota biroof faayidaa qabu dha.",
      source: "Sunan ad-Daraqutni",
      narrator: "Jabir ibn Abdullah",
      theme: "Service",
      category: "Character"
    }
  ];

  const studyTopics = [
    {
      title: "Hadith Sciences",
      description: "Learn the methodology of hadith authentication and classification",
      topics: ["Isnad analysis", "Matn criticism", "Narrator evaluation", "Hadith grading"],
      duration: "8 weeks",
      level: "Advanced",
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      title: "Prophetic Biography",
      description: "Study the life of Prophet Muhammad (ﷺ) through authentic hadith",
      topics: ["Early life", "Prophethood", "Hijra", "Final years"],
      duration: "12 weeks",
      level: "Intermediate",
      color: "bg-green-500/20 text-green-600"
    },
    {
      title: "Practical Guidance",
      description: "Apply prophetic teachings in daily life and worship",
      topics: ["Prayer guidance", "Social conduct", "Business ethics", "Family relations"],
      duration: "6 weeks",
      level: "Beginner",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      title: "Comparative Study",
      description: "Compare different narrations and understand variations",
      topics: ["Variant narrations", "Contextual understanding", "Scholarly opinions", "Reconciliation methods"],
      duration: "10 weeks",
      level: "Advanced",
      color: "bg-orange-500/20 text-orange-600"
    }
  ];

  const filteredCollections = hadithCollections.filter(collection =>
    selectedCollection === "all" || collection.id === selectedCollection
  );

  return (
    <PageLayout 
      title="Hadith Study Center" 
      subtitle="Prophetic Traditions - Learning from the Sunnah of Prophet Muhammad (ﷺ)"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <Scroll size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
              Hadiisa <span className="text-primary">Nabiyyaa</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the authentic sayings, actions, and approvals of Prophet Muhammad (ﷺ). 
              Study the Sunnah through comprehensive hadith collections and scholarly commentary.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
                className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
              >
                <ExternalLink size={18} />
                Visit TVIslaamaa Hadith Section
              </Button>
              <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                <BookOpen size={18} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hadith by text, narrator, or theme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="px-4 py-2 rounded-lg bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
            >
              <option value="all">All Collections</option>
              {hadithCollections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        {/* Featured Hadith */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Featured <span className="text-primary">Hadith</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Essential prophetic teachings for daily guidance and spiritual growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredHadith.map((hadith, index) => (
              <div 
                key={hadith.id}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">
                    {hadith.category}
                  </span>
                  <Star size={16} className="text-yellow-500" />
                </div>
                
                <div className="space-y-4 mb-6">
                  <p className="text-sm leading-relaxed">{hadith.text}</p>
                  <p className="text-lg font-arabic text-primary leading-relaxed" dir="rtl">
                    {hadith.textArabic}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    {hadith.textOromo}
                  </p>
                </div>
                
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Source: {hadith.source}</span>
                    <span>Theme: {hadith.theme}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Narrator: {hadith.narrator}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Volume2 size={12} className="mr-1" />
                    Listen
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen size={12} className="mr-1" />
                    Study
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Heart size={12} className="mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Hadith Collections */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Major <span className="text-primary">Collections</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The six most authentic hadith collections (Kutub as-Sittah) recognized by Islamic scholars
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection, index) => (
              <div 
                key={collection.id}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${collection.color} flex items-center justify-center`}>
                    <span className="text-white font-bold">{collection.rank}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < 5 ? "text-yellow-500 fill-current" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">{collection.name}</h3>
                  <p className="text-lg font-arabic text-primary mb-1">{collection.nameArabic}</p>
                  <p className="text-sm text-muted-foreground">{collection.nameOromo}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
                
                <div className="bg-secondary/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Compiler:</span>
                    <span className="font-medium">{collection.compiler}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Hadith:</span>
                    <span className="font-medium">{collection.totalHadith.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen size={12} className="mr-1" />
                    Browse
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download size={12} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Topics */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4">
              Study <span className="text-primary">Topics</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive courses covering different aspects of hadith studies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyTopics.map((topic, index) => (
              <div 
                key={topic.title}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${topic.color}`}>
                    {topic.level}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{topic.duration}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                
                <div className="space-y-2 mb-6">
                  {topic.topics.map((subtopic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={12} className="text-primary" />
                      {subtopic}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Start Course
                </Button>
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
              Comprehensive tools and materials for effective hadith study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Audio Narrations",
                description: "Listen to authentic hadith recitations",
                icon: Volume2,
                color: "text-blue-600"
              },
              {
                title: "Study Guides",
                description: "Structured learning materials and worksheets",
                icon: FileText,
                color: "text-green-600"
              },
              {
                title: "Discussion Forums",
                description: "Engage with scholars and fellow students",
                icon: MessageCircle,
                color: "text-purple-600"
              },
              {
                title: "Mobile Access",
                description: "Study hadith anywhere with mobile apps",
                icon: Globe,
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
              Connect with authentic Islamic educational platforms for comprehensive hadith study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-primary" />
              </div>
              <h4 className="font-semibold mb-2">TVIslaamaa Hadith Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive hadith studies in Oromo language with authentic translations and scholarly commentary.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://tvislaamaa.org/', '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit Hadith Section
              </Button>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Award size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Certification Program</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Complete structured courses and earn certificates in hadith studies from qualified scholars.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Award size={14} className="mr-2" />
                View Certificates
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Follow the Prophetic Way</span>
          </div>
          <h3 className="text-2xl font-display tracking-wide mb-4">
            Ready to Learn from the <span className="text-primary">Prophet's Sunnah</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Begin your journey of studying authentic hadith and implementing the prophetic guidance 
            in your daily life through our comprehensive program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2">
              <Scroll size={18} />
              Start Hadith Course
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