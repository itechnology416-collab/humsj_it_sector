import { useNavigate, useLocation } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { 
  MapPin, 
  Crown, 
  Heart, 
  Star, 
  Shield,
  BookOpen,
  Users,
  Globe,
  Award,
  Calendar,
  Mountain,
  Compass
} from "lucide-react";

export default function IslamInEthiopia() {
  const navigate = useNavigate();
  const location = useLocation();

  const keyFigures = [
    {
      name: "An-Najashi (Ashama ibn Abjar)",
      title: "The Righteous King",
      role: "King of Abyssinia",
      significance: "Protected Muslim refugees and embraced Islam",
      qualities: ["Justice", "Tolerance", "Wisdom", "Compassion"],
      legacy: "First foreign ruler to accept Islam",
      icon: "👑",
      color: "bg-amber-500/20 text-amber-600"
    },
    {
      name: "Ja'far ibn Abi Talib (RA)",
      title: "Leader of the Migrants",
      role: "Spokesman for Muslims",
      significance: "Eloquently defended Islam before the king",
      qualities: ["Eloquence", "Courage", "Leadership", "Faith"],
      legacy: "His speech convinced the king to protect Muslims",
      icon: "🗣️",
      color: "bg-blue-500/20 text-blue-600"
    }
  ];

  const islamicValues = [
    {
      value: "Religious Freedom",
      description: "The right to practice one's faith without persecution",
      example: "Najashi allowed Muslims to worship freely in his kingdom"
    },
    {
      value: "Seeking Justice", 
      description: "Moving to places where justice and fairness prevail",
      example: "Muslims migrated to Abyssinia seeking just treatment"
    },
    {
      value: "Interfaith Dialogue",
      description: "Respectful communication between different faiths", 
      example: "Ja'far's respectful presentation of Islam to Christian king"
    },
    {
      value: "Protection of Vulnerable",
      description: "Duty to protect those seeking refuge and safety",
      example: "Najashi's protection of Muslim refugees"
    }
  ];

  return (
    <PublicPageLayout 
      title="Islam in Ethiopia - The First Hijrah" 
      subtitle="The historic migration to Abyssinia and the legacy of religious tolerance"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-emerald-500/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
              <Mountain size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-display tracking-wide mb-4">Islam in Ethiopia</h1>
            <h2 className="text-2xl font-display tracking-wide mb-4 text-primary">The First Hijrah to Abyssinia</h2>
            <p className="text-muted-foreground max-w-4xl mx-auto text-lg">
              Discover the remarkable story of the first Muslim migration to Abyssinia (Ethiopia), where early Muslims 
              found refuge under the protection of the righteous Christian king, An-Najashi, establishing a model of 
              religious tolerance and interfaith harmony.
            </p>
          </div>
        </div>

        {/* Key Figures */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Users size={28} className="text-primary" />
              Key Historical Figures
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {keyFigures.map((figure, index) => (
              <div 
                key={figure.name}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-lg ${figure.color} flex items-center justify-center text-3xl`}>
                    {figure.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{figure.name}</h3>
                    <p className="text-primary font-medium">{figure.title}</p>
                    <p className="text-sm text-muted-foreground">{figure.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{figure.significance}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Qualities:</h4>
                    <div className="space-y-1">
                      {figure.qualities.map((quality, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Star size={12} className="text-primary" />
                          <span>{quality}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Legacy:</h4>
                    <p className="text-sm text-muted-foreground">{figure.legacy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Islamic Values Demonstrated */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-4 flex items-center justify-center gap-2">
              <Heart size={28} className="text-primary" />
              Islamic Values Demonstrated
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {islamicValues.map((value, index) => (
              <div 
                key={value.value}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-semibold text-lg mb-3">{value.value}</h3>
                <p className="text-muted-foreground mb-4">{value.description}</p>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-1">Historical Example:</p>
                  <p className="text-sm">{value.example}</p>
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
            وَمَن يُهَاجِرْ فِي سَبِيلِ اللَّهِ يَجِدْ فِي الْأَرْضِ مُرَاغَمًا كَثِيرًا وَسَعَةً
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And whoever emigrates for the cause of Allah will find on the earth many locations and abundance" - Quran 4:100
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}