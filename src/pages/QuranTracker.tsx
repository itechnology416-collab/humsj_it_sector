import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  BookOpen, 
  Calendar, 
  Target, 
  TrendingUp, 
  Star,
  Plus,
  Edit,
  CheckCircle,
  Clock,
  Award,
  Bookmark,
  Heart,
  Lightbulb,
  RotateCcw,
  Play,
  Pause,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const dailyReadings = [
  { date: "2024-12-21", surah: "Al-Fatiha", verses: "1-7", completed: true, notes: "Beautiful opening chapter" },
  { date: "2024-12-20", surah: "Al-Baqarah", verses: "1-20", completed: true, notes: "Foundation of faith" },
  { date: "2024-12-19", surah: "Al-Baqarah", verses: "21-40", completed: false, notes: "" },
];

const memorizedSurahs = [
  { name: "Al-Fatiha", verses: 7, memorized: 7, accuracy: 100, lastReviewed: "2024-12-21" },
  { name: "Al-Ikhlas", verses: 4, memorized: 4, accuracy: 100, lastReviewed: "2024-12-20" },
  { name: "Al-Falaq", verses: 5, memorized: 5, accuracy: 95, lastReviewed: "2024-12-19" },
  { name: "An-Nas", verses: 6, memorized: 6, accuracy: 98, lastReviewed: "2024-12-18" },
  { name: "Al-Kawthar", verses: 3, memorized: 2, accuracy: 80, lastReviewed: "2024-12-17" },
];

const hadithOfTheDay = {
  arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
  translation: "Actions are but by intention",
  narrator: "Umar ibn al-Khattab",
  source: "Sahih Bukhari",
  explanation: "This hadith emphasizes that the value of our deeds depends on our intentions. Every action should be done with sincere intention for Allah's sake."
};

export default function QuranTracker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("reading");
  const [newNote, setNewNote] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  const tabs = [
    { id: "reading", label: "Daily Reading", icon: BookOpen },
    { id: "memorization", label: "Memorization", icon: Star },
    { id: "hadith", label: "Hadith of the Day", icon: Lightbulb },
    { id: "notes", label: "Personal Notes", icon: Bookmark }
  ];

  const totalVerses = memorizedSurahs.reduce((sum, surah) => sum + surah.verses, 0);
  const memorizedVerses = memorizedSurahs.reduce((sum, surah) => sum + surah.memorized, 0);
  const memorizedPercentage = Math.round((memorizedVerses / totalVerses) * 100);

  return (
    <PageLayout 
      title="Qur'an & Hadith Tracker" 
      subtitle="Track your Islamic studies and spiritual growth"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Days Streak", value: "15", icon: Calendar, color: "text-primary" },
            { label: "Verses Memorized", value: memorizedVerses.toString(), icon: Star, color: "text-amber-400" },
            { label: "Surahs Completed", value: memorizedSurahs.filter(s => s.memorized === s.verses).length.toString(), icon: CheckCircle, color: "text-green-400" },
            { label: "Study Hours", value: "42", icon: Clock, color: "text-blue-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center shadow-red animate-glow">
              <BookOpen size={32} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-display tracking-wide mb-2">Memorization Progress</h3>
              <p className="text-muted-foreground mb-4">
                You've memorized {memorizedVerses} out of {totalVerses} verses ({memorizedPercentage}%)
              </p>
              <Progress value={memorizedPercentage} className="h-3" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-display text-primary">{memorizedPercentage}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "reading" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Daily Reading Log</h3>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus size={16} />
                  Add Reading
                </Button>
              </div>

              <div className="grid gap-4">
                {dailyReadings.map((reading, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "bg-card rounded-xl p-5 border transition-all duration-300",
                      reading.completed 
                        ? "border-green-500/30 bg-green-500/5" 
                        : "border-border/30 hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          reading.completed ? "bg-green-500/20" : "bg-primary/20"
                        )}>
                          {reading.completed ? (
                            <CheckCircle size={20} className="text-green-400" />
                          ) : (
                            <BookOpen size={20} className="text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{reading.surah}</h4>
                          <p className="text-sm text-muted-foreground">Verses {reading.verses}</p>
                          <p className="text-xs text-muted-foreground">{reading.date}</p>
                          {reading.notes && (
                            <p className="text-sm text-primary mt-2 italic">"{reading.notes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!reading.completed && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Mark Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-border/50">
                          <Edit size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "memorization" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Memorization Progress</h3>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus size={16} />
                  Add Surah
                </Button>
              </div>

              <div className="grid gap-4">
                {memorizedSurahs.map((surah, index) => (
                  <div 
                    key={index}
                    className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-lg">{surah.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {surah.memorized}/{surah.verses} verses memorized
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={surah.accuracy >= 95 ? "default" : "secondary"}
                          className={surah.accuracy >= 95 ? "bg-green-500" : ""}
                        >
                          {surah.accuracy}% accuracy
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last reviewed: {new Date(surah.lastReviewed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((surah.memorized / surah.verses) * 100)}%</span>
                      </div>
                      <Progress value={(surah.memorized / surah.verses) * 100} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-border/50 gap-1">
                        <Play size={14} />
                        Practice
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50 gap-1">
                        <RotateCcw size={14} />
                        Review
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50 gap-1">
                        <Volume2 size={14} />
                        Listen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hadith" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 via-card to-accent/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 animate-float">
                    <Lightbulb className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl tracking-wide mb-2">Hadith of the Day</h3>
                    <Badge variant="secondary">Today • {new Date().toLocaleDateString()}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-lg font-arabic text-primary mb-2">{hadithOfTheDay.arabic}</p>
                    <p className="text-muted-foreground italic">"{hadithOfTheDay.translation}"</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Narrator:</span>
                      <span className="font-medium">{hadithOfTheDay.narrator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="font-medium">{hadithOfTheDay.source}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb size={16} className="text-primary" />
                      Explanation
                    </h4>
                    <p className="text-sm text-muted-foreground">{hadithOfTheDay.explanation}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-border/50 gap-1">
                      <Heart size={14} />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="border-border/50 gap-1">
                      <Bookmark size={14} />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-display">Personal Notes</h3>
                <Button 
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  <Plus size={16} />
                  Add Note
                </Button>
              </div>

              {showAddNote && (
                <div className="bg-card rounded-xl p-5 border border-border/30">
                  <div className="space-y-4">
                    <Input 
                      placeholder="Note title..."
                      className="bg-secondary/50 border-border/50"
                    />
                    <Textarea 
                      placeholder="Write your reflection, insight, or question..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={4}
                      className="bg-secondary/50 border-border/50"
                    />
                    <div className="flex gap-2">
                      <Button className="bg-primary hover:bg-primary/90">
                        Save Note
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddNote(false)}
                        className="border-border/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center py-20">
                <Bookmark size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-display mb-2">No Notes Yet</h3>
                <p className="text-muted-foreground">Start adding your personal reflections and insights.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}