import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Users,
  Shield,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Lock,
  Sparkles,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GenderSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  const handleGenderSelection = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    // Store gender preference
    localStorage.setItem('userGender', gender);
    
    // Navigate to appropriate dashboard
    setTimeout(() => {
      navigate(gender === 'male' ? '/male-dashboard' : '/female-dashboard', { replace: true });
    }, 500);
  };

  const dashboardFeatures = {
    male: [
      { icon: Target, text: "Leadership & Responsibility Tracking" },
      { icon: Users, text: "Brotherhood & Community Engagement" },
      { icon: BookOpen, text: "Islamic Learning & Development" },
      { icon: Shield, text: "Committee & Volunteer Management" }
    ],
    female: [
      { icon: Heart, text: "Sisterhood & Mentorship Programs" },
      { icon: Lock, text: "Privacy-First Safe Environment" },
      { icon: Sparkles, text: "Well-being & Counseling Support" },
      { icon: BookOpen, text: "Sisters-Only Learning Hub" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
            <Users size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">
            Welcome to <span className="text-primary">HUMSJ</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your personalized dashboard experience designed according to Islamic principles and your specific needs
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Gender Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Male Dashboard Option */}
          <div 
            className={cn(
              "bg-card rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer hover:scale-105",
              selectedGender === 'male' 
                ? "border-green-500 bg-green-500/5 shadow-lg shadow-green-500/20" 
                : "border-border/30 hover:border-green-500/50"
            )}
            onClick={() => handleGenderSelection('male')}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display tracking-wide mb-2">Brother's Dashboard</h2>
              <p className="text-muted-foreground">
                Designed for male Muslim students with leadership, community engagement, and spiritual growth features
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {dashboardFeatures.male.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <feature.icon size={16} className="text-green-600" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-500/10 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Color Palette</h3>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-green-600"></div>
                <div className="w-6 h-6 rounded-full bg-blue-800"></div>
                <div className="w-6 h-6 rounded-full bg-yellow-600"></div>
              </div>
              <p className="text-xs text-green-600 mt-2">Dark green, navy, gold accents</p>
            </div>

            {selectedGender === 'male' && (
              <div className="flex items-center justify-center gap-2 text-green-600 animate-fade-in">
                <CheckCircle size={20} />
                <span className="font-medium">Selected</span>
              </div>
            )}
          </div>

          {/* Female Dashboard Option */}
          <div 
            className={cn(
              "bg-card rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer hover:scale-105",
              selectedGender === 'female' 
                ? "border-rose-500 bg-rose-500/5 shadow-lg shadow-rose-500/20" 
                : "border-border/30 hover:border-rose-500/50"
            )}
            onClick={() => handleGenderSelection('female')}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display tracking-wide mb-2">Sister's Dashboard</h2>
              <p className="text-muted-foreground">
                Privacy-focused dashboard for female Muslim students with sisterhood, mentorship, and empowerment features
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {dashboardFeatures.female.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <feature.icon size={16} className="text-rose-600" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-rose-500/10 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-rose-700 dark:text-rose-400 mb-2">Color Palette</h3>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                <div className="w-6 h-6 rounded-full bg-rose-400"></div>
                <div className="w-6 h-6 rounded-full bg-purple-400"></div>
              </div>
              <p className="text-xs text-rose-600 mt-2">Soft green, beige, pastel gold</p>
            </div>

            {selectedGender === 'female' && (
              <div className="flex items-center justify-center gap-2 text-rose-600 animate-fade-in">
                <CheckCircle size={20} />
                <span className="font-medium">Selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {selectedGender && (
          <div className="text-center animate-fade-in">
            <Button 
              size="lg"
              className={cn(
                "px-8 py-3 text-lg shadow-lg",
                selectedGender === 'male' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-rose-600 hover:bg-rose-700"
              )}
              onClick={() => handleGenderSelection(selectedGender)}
            >
              Continue to {selectedGender === 'male' ? "Brother's" : "Sister's"} Dashboard
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              You can change this preference anytime in your settings
            </p>
          </div>
        )}

        {/* Islamic Quote */}
        <div className="text-center mt-12 p-6 bg-card/50 rounded-xl border border-border/30">
          <p className="text-lg font-arabic text-primary mb-2" dir="rtl">
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-muted-foreground italic text-sm">
            "And whoever fears Allah - He will make for him a way out" - Quran 65:2
          </p>
        </div>
      </div>
    </div>
  );
}