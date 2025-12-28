import { useLocation, useNavigate } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Headphones, 
  Star, 
  Globe, 
  BookOpen, 
  Heart,
  Download,
  Share2,
  Volume2
} from "lucide-react";
import QuranAudioPlayer from "@/components/islamic/QuranAudioPlayer";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function QuranAudioPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const featuredReciters = [
    {
      name: "Ali Jabir",
      arabic: "علي جابر",
      country: "Saudi Arabia",
      style: "Melodious",
      description: "Beautiful and melodious recitation with perfect Tajweed"
    },
    {
      name: "Abdullah Basfar", 
      arabic: "عبد الله بصفر",
      country: "Saudi Arabia",
      style: "Emotional",
      description: "Emotional and heart-touching recitation"
    },
    {
      name: "Abdulwadud Haneef",
      arabic: "عبد الودود حنيف", 
      country: "India",
      style: "Clear",
      description: "Clear and precise recitation with excellent pronunciation"
    },
    {
      name: "Dr. Eyman Rushed",
      arabic: "د. إيمان رشيد",
      country: "Egypt", 
      style: "Classical",
      description: "Female reciter with beautiful voice and perfect Tajweed"
    },
    {
      name: "Mahmud Kalil Al-Husary",
      arabic: "محمود خليل الحصري",
      country: "Egypt",
      style: "Educational", 
      description: "Legendary reciter known for teaching Tajweed"
    },
    {
      name: "Abdullah Ali Huthaif",
      arabic: "عبد الله علي هذيف",
      country: "Saudi Arabia",
      style: "Modern",
      description: "Young reciter with modern style and clear voice"
    }
  ];

  return (
    <ProtectedPageLayout 
      title="Quran Audio Player" 
      subtitle="Listen to the Holy Quran with beautiful recitations from renowned reciters"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Headphones size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Enhanced Quran Audio Experience</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Listen to the Holy Quran with high-quality audio from world-renowned reciters
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Headphones size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">8+ Reciters</p>
                <p className="text-xs text-muted-foreground">World-renowned voices</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Volume2 size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">High Quality</p>
                <p className="text-xs text-muted-foreground">128kbps audio</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Download</p>
                <p className="text-xs text-muted-foreground">Offline listening</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Share2 size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Share</p>
                <p className="text-xs text-muted-foreground">Spread the blessing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Audio Player */}
        <QuranAudioPlayer />

        {/* Featured Reciters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Featured Reciters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredReciters.map((reciter, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Headphones size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{reciter.name}</h4>
                      <p className="text-xs text-muted-foreground font-arabic" dir="rtl">
                        {reciter.arabic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {reciter.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs gap-1">
                          <Globe size={10} />
                          {reciter.country}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {reciter.style}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Islamic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>

        {/* Audio Features */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Audio Player Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Playback Controls</h4>
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Play, pause, stop, and skip controls
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Variable playback speed (0.5x to 2x)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Repeat and shuffle modes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Volume control and mute
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Favorite chapters and reciters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Download audio for offline listening
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Share chapters with others
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Multiple reciter styles and countries
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedPageLayout>
  );
}