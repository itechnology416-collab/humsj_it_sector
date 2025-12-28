import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  VrHeadset, 
  Play,
  Download,
  Star,
  Clock,
  Users,
  MapPin,
  Headphones,
  Eye,
  Globe,
  Compass,
  BookOpen,
  Heart,
  Mountain,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface VRExperience {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  size: string;
  requirements: string[];
  features: string[];
  preview_url: string;
  download_url: string;
  is_premium: boolean;
  is_featured: boolean;
  language: string[];
  age_rating: string;
}

const mockExperiences: VRExperience[] = [
  {
    id: '1',
    title: 'Virtual Hajj Experience',
    description: 'Experience the complete Hajj pilgrimage in immersive virtual reality, from Tawaf to Arafat.',
    category: 'Pilgrimage',
    duration: '45 minutes',
    difficulty: 'beginner',
    rating: 4.9,
    downloads: 15420,
    size: '2.1 GB',
    requirements: ['VR Headset', 'High-speed internet', '4GB RAM'],
    features: ['360° Kaaba view', 'Guided narration', 'Interactive rituals', 'Multilingual support'],
    preview_url: 'https://example.com/hajj-preview',
    download_url: 'https://example.com/hajj-download',
    is_premium: false,
    is_featured: true,
    language: ['Arabic', 'English', 'Urdu', 'Turkish'],
    age_rating: 'All Ages'
  },
  {
    id: '2',
    title: 'Prophet\'s Mosque Tour',
    description: 'Walk through the Prophet\'s Mosque in Medina with historical context and spiritual guidance.',
    category: 'Historical',
    duration: '30 minutes',
    difficulty: 'beginner',
    rating: 4.8,
    downloads: 12350,
    size: '1.8 GB',
    requirements: ['VR Headset', 'Stable internet', '3GB RAM'],
    features: ['Historical timeline', 'Audio commentary', 'Interactive hotspots', 'Prayer guidance'],
    preview_url: 'https://example.com/mosque-preview',
    download_url: 'https://example.com/mosque-download',
    is_premium: false,
    is_featured: true,
    language: ['Arabic', 'English', 'French'],
    age_rating: 'All Ages'
  },
  {
    id: '3',
    title: 'Islamic Architecture Journey',
    description: 'Explore magnificent Islamic architecture from Alhambra to Blue Mosque in stunning detail.',
    category: 'Architecture',
    duration: '60 minutes',
    difficulty: 'intermediate',
    rating: 4.7,
    downloads: 8920,
    size: '3.2 GB',
    requirements: ['VR Headset', 'High-end GPU', '6GB RAM'],
    features: ['Architectural details', 'Historical context', 'Art appreciation', 'Cultural insights'],
    preview_url: 'https://example.com/architecture-preview',
    download_url: 'https://example.com/architecture-download',
    is_premium: true,
    is_featured: false,
    language: ['English', 'Spanish', 'Arabic'],
    age_rating: '12+'
  },
  {
    id: '4',
    title: 'Quran Recitation Sanctuary',
    description: 'Immersive Quran recitation experience in beautiful virtual Islamic environments.',
    category: 'Spiritual',
    duration: 'Variable',
    difficulty: 'beginner',
    rating: 4.9,
    downloads: 18750,
    size: '1.5 GB',
    requirements: ['VR Headset', 'Audio system', '2GB RAM'],
    features: ['Multiple reciters', 'Translation overlay', 'Peaceful environments', 'Meditation mode'],
    preview_url: 'https://example.com/quran-preview',
    download_url: 'https://example.com/quran-download',
    is_premium: false,
    is_featured: true,
    language: ['Arabic', 'English', 'Urdu', 'Malay'],
    age_rating: 'All Ages'
  }
];

const categories = ['All Categories', 'Pilgrimage', 'Historical', 'Architecture', 'Spiritual', 'Educational'];
const difficulties = ['All Levels', 'beginner', 'intermediate', 'advanced'];

export default function IslamicVR() {
  const navigate = useNavigate();
  const location = useLocation();
  const [experiences, setExperiences] = useState<VRExperience[]>(mockExperiences);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null);

  const filteredExperiences = experiences.filter(exp => {
    const matchesCategory = selectedCategory === 'All Categories' || exp.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All Levels' || exp.difficulty === selectedDifficulty;
    
    return matchesCategory && matchesDifficulty;
  });

  const featuredExperiences = experiences.filter(exp => exp.is_featured);
  const totalDownloads = experiences.reduce((sum, exp) => sum + exp.downloads, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Pilgrimage': 'bg-purple-500/20 text-purple-600',
      'Historical': 'bg-blue-500/20 text-blue-600',
      'Architecture': 'bg-orange-500/20 text-orange-600',
      'Spiritual': 'bg-green-500/20 text-green-600',
      'Educational': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pilgrimage': return <Compass size={16} />;
      case 'Historical': return <BookOpen size={16} />;
      case 'Architecture': return <Building size={16} />;
      case 'Spiritual': return <Heart size={16} />;
      case 'Educational': return <BookOpen size={16} />;
      default: return <VrHeadset size={16} />;
    }
  };

  return (
    <ProtectedPageLayout 
      title="Islamic VR Experiences" 
      subtitle="Immersive virtual reality Islamic experiences and spiritual journeys"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <VrHeadset size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic VR Experiences</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Immerse yourself in Islamic history, spirituality, and sacred places
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <VrHeadset size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{experiences.length}</p>
                <p className="text-xs text-muted-foreground">VR Experiences</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total downloads</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Star size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{featuredExperiences.length}</p>
                <p className="text-xs text-muted-foreground">Featured content</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Globe size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Multi-language</p>
                <p className="text-xs text-muted-foreground">Global access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experiences">VR Experiences</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="requirements">System Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="experiences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience, index) => (
                <Card 
                  key={experience.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <VrHeadset size={32} className="text-white relative z-10" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {experience.is_featured && (
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Featured
                        </Badge>
                      )}
                      {experience.is_premium && (
                        <Badge className="bg-purple-500 text-white text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Star size={12} />
                      {experience.rating}
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <Badge className={cn("text-xs flex items-center gap-1", getCategoryColor(experience.category))}>
                        {getCategoryIcon(experience.category)}
                        {experience.category}
                      </Badge>
                      <Badge className={cn("text-xs", getDifficultyColor(experience.difficulty))}>
                        {experience.difficulty}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg line-clamp-2">{experience.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{experience.description}</p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download size={14} />
                        <span>{experience.downloads.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={14} />
                        <span>Size: {experience.size}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {experience.language.slice(0, 3).map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                      {experience.language.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{experience.language.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="text-sm">
                        {experience.is_premium ? (
                          <span className="text-purple-600 font-medium">Premium</span>
                        ) : (
                          <span className="text-green-600 font-medium">Free</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedExperience(experience)}
                          className="gap-2"
                        >
                          <Eye size={14} />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2"
                        >
                          <Download size={14} />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredExperiences.map((experience, index) => (
                <Card 
                  key={experience.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <VrHeadset size={24} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-yellow-500 text-black text-xs">
                            Featured
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(experience.category))}>
                            {experience.category}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{experience.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{experience.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Star size={14} />
                            <span>{experience.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download size={14} />
                            <span>{experience.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{experience.duration}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="gap-2">
                            <Play size={14} />
                            Launch VR
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Eye size={14} />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <VrHeadset size={20} />
                    Minimum Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">VR Headset</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Oculus Rift/Quest series</li>
                      <li>• HTC Vive series</li>
                      <li>• PlayStation VR</li>
                      <li>• Windows Mixed Reality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">System Specs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 4GB RAM minimum</li>
                      <li>• DirectX 11 compatible GPU</li>
                      <li>• 2GB available storage</li>
                      <li>• Stable internet connection</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star size={20} />
                    Recommended Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Enhanced Experience</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• High-end VR headset (Quest 3, Vive Pro)</li>
                      <li>• Room-scale tracking setup</li>
                      <li>• Wireless connectivity</li>
                      <li>• Haptic feedback controllers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Optimal Performance</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 8GB+ RAM</li>
                      <li>• RTX 3060 or equivalent GPU</li>
                      <li>• 10GB+ available storage</li>
                      <li>• High-speed broadband</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Experience Details Modal */}
        {selectedExperience && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedExperience.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExperience(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-4">{selectedExperience.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{selectedExperience.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{selectedExperience.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>
                      <p className="capitalize">{selectedExperience.difficulty}</p>
                    </div>
                    <div>
                      <span className="font-medium">File Size:</span>
                      <p>{selectedExperience.size}</p>
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span>
                      <p className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        {selectedExperience.rating}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span>
                      <p>{selectedExperience.downloads.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">System Requirements</h4>
                  <ul className="space-y-1">
                    {selectedExperience.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <ul className="space-y-1">
                    {selectedExperience.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Available Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExperience.language.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Access Level</p>
                    <p className="text-lg font-semibold">
                      {selectedExperience.is_premium ? 'Premium Content' : 'Free Access'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                    >
                      <Play size={16} />
                      Preview
                    </Button>
                    <Button
                      onClick={() => setSelectedExperience(null)}
                      className="gap-2"
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}