import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Baby, 
  Heart, 
  BookOpen,
  Users,
  Calendar,
  Clock,
  Star,
  Play,
  Pause,
  Volume2,
  Download,
  Share2,
  Search,
  Filter,
  Award,
  Target,
  Smile,
  Home,
  School,
  Gamepad2,
  Music
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ChildcareResource {
  id: string;
  title: string;
  description: string;
  category: 'parenting' | 'education' | 'activities' | 'stories' | 'duas' | 'games';
  age_group: 'infant' | 'toddler' | 'preschool' | 'school_age' | 'all';
  content_type: 'article' | 'video' | 'audio' | 'interactive' | 'printable';
  content: string;
  islamic_values: string[];
  learning_objectives: string[];
  materials_needed?: string[];
  duration?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  author: string;
  created_at: string;
  likes: number;
  downloads: number;
  is_featured: boolean;
}

interface ParentingTip {
  id: string;
  title: string;
  tip: string;
  islamic_basis: string;
  age_relevance: string;
  practical_steps: string[];
  benefits: string[];
  category: string;
}

const mockChildcareResources: ChildcareResource[] = [
  {
    id: '1',
    title: 'Teaching Children the 99 Names of Allah',
    description: 'Interactive activities and games to help children learn and understand Allah\'s beautiful names',
    category: 'education',
    age_group: 'preschool',
    content_type: 'interactive',
    content: 'A comprehensive guide with songs, games, and visual aids to teach children the Asma ul-Husna. Includes memory techniques, coloring pages, and simple explanations suitable for young minds.',
    islamic_values: ['Tawheed', 'Love of Allah', 'Islamic Knowledge'],
    learning_objectives: ['Memorize 10 names of Allah', 'Understand basic meanings', 'Develop love for Allah'],
    materials_needed: ['Coloring sheets', 'Audio recordings', 'Flashcards'],
    duration: '30 minutes per session',
    difficulty: 'easy',
    author: 'Sister Fatima Al-Zahra',
    created_at: '2024-12-20T10:00:00Z',
    likes: 156,
    downloads: 89,
    is_featured: true
  },
  {
    id: '2',
    title: 'Bedtime Duas for Children',
    description: 'Collection of simple duas and Islamic stories for peaceful sleep',
    category: 'duas',
    age_group: 'all',
    content_type: 'audio',
    content: 'Beautiful collection of bedtime duas with gentle recitation and soothing background sounds. Includes stories of prophets told in a child-friendly manner to instill Islamic values before sleep.',
    islamic_values: ['Dhikr', 'Trust in Allah', 'Prophetic Stories'],
    learning_objectives: ['Learn bedtime duas', 'Develop bedtime routine', 'Feel secure with Allah'],
    duration: '15-20 minutes',
    difficulty: 'easy',
    author: 'Brother Ahmad Hassan',
    created_at: '2024-12-19T15:30:00Z',
    likes: 203,
    downloads: 145,
    is_featured: true
  },
  {
    id: '3',
    title: 'Islamic Values Through Play',
    description: 'Fun games and activities that teach Islamic manners and values',
    category: 'games',
    age_group: 'school_age',
    content_type: 'interactive',
    content: 'Creative games that teach sharing, kindness, honesty, and other Islamic values. Includes role-playing activities, board games, and outdoor activities that reinforce good character.',
    islamic_values: ['Akhlaq', 'Sharing', 'Kindness', 'Honesty'],
    learning_objectives: ['Practice good manners', 'Learn through play', 'Develop social skills'],
    materials_needed: ['Simple props', 'Game boards', 'Reward stickers'],
    duration: '45 minutes',
    difficulty: 'medium',
    author: 'Sister Aisha Mohamed',
    created_at: '2024-12-18T09:15:00Z',
    likes: 178,
    downloads: 92,
    is_featured: false
  }
];

const parentingTips: ParentingTip[] = [
  {
    id: '1',
    title: 'Teaching Prayer Through Example',
    tip: 'Children learn best by watching their parents. Make your prayers visible and explain what you\'re doing.',
    islamic_basis: 'The Prophet (PBUH) said: "Pray as you have seen me praying" - this applies to teaching children too.',
    age_relevance: 'Start from infancy - let them see you pray regularly',
    practical_steps: [
      'Pray in a visible area when children are around',
      'Explain briefly what you\'re doing',
      'Let them sit nearby during prayer',
      'Start with short explanations about Allah',
      'Gradually introduce them to prayer movements'
    ],
    benefits: ['Natural learning', 'Positive association with prayer', 'Family bonding'],
    category: 'worship'
  },
  {
    id: '2',
    title: 'Islamic Manners at Mealtime',
    tip: 'Use mealtime as an opportunity to teach Islamic etiquette and gratitude.',
    islamic_basis: 'The Prophet (PBUH) taught us to say Bismillah before eating and Alhamdulillah after.',
    age_relevance: 'From when children start eating solid food',
    practical_steps: [
      'Always say Bismillah before meals together',
      'Teach eating with the right hand',
      'Share food and encourage generosity',
      'Thank Allah for the food',
      'Avoid waste and teach moderation'
    ],
    benefits: ['Daily Islamic practice', 'Gratitude development', 'Good habits'],
    category: 'manners'
  }
];

const categories = [
  { id: 'all', name: 'All Categories', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
  { id: 'parenting', name: 'Parenting Tips', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'education', name: 'Islamic Education', icon: School, color: 'from-green-500 to-emerald-500' },
  { id: 'activities', name: 'Activities', icon: Gamepad2, color: 'from-purple-500 to-violet-500' },
  { id: 'stories', name: 'Stories', icon: BookOpen, color: 'from-orange-500 to-red-500' },
  { id: 'duas', name: 'Duas & Dhikr', icon: Heart, color: 'from-teal-500 to-cyan-500' },
  { id: 'games', name: 'Games', icon: Smile, color: 'from-yellow-500 to-amber-500' }
];

const ageGroups = [
  { id: 'all', name: 'All Ages' },
  { id: 'infant', name: 'Infant (0-1 year)' },
  { id: 'toddler', name: 'Toddler (1-3 years)' },
  { id: 'preschool', name: 'Preschool (3-5 years)' },
  { id: 'school_age', name: 'School Age (6+ years)' }
];

export default function IslamicChildcare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState<ChildcareResource[]>(mockChildcareResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedResource, setSelectedResource] = useState<ChildcareResource | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('childcare-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.islamic_values.some(value => value.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesAge = selectedAgeGroup === 'all' || resource.age_group === selectedAgeGroup || resource.age_group === 'all';
    
    return matchesSearch && matchesCategory && matchesAge;
  });

  const toggleFavorite = (resourceId: string) => {
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(id => id !== resourceId)
      : [...favorites, resourceId];
    
    setFavorites(newFavorites);
    localStorage.setItem('childcare-favorites', JSON.stringify(newFavorites));
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-gray-500 to-slate-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-600';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'hard': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Childcare" 
      subtitle="Nurture your children with Islamic values and guidance"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Baby size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Islamic Childcare & Parenting</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Resources and guidance for raising righteous Muslim children
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto">
                  <BookOpen size={20} className="text-pink-600" />
                </div>
                <p className="text-sm font-medium">{resources.length}+ Resources</p>
                <p className="text-xs text-muted-foreground">Educational content</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Heart size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Islamic Values</p>
                <p className="text-xs text-muted-foreground">Character building</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">All Ages</p>
                <p className="text-xs text-muted-foreground">Infant to school age</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Expert Guidance</p>
                <p className="text-xs text-muted-foreground">Islamic parenting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Resource Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(1).map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h4>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search resources, activities, or Islamic values..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {ageGroups.map(age => (
                    <option key={age.id} value={age.id}>{age.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="tips">Parenting Tips</TabsTrigger>
            <TabsTrigger value="activities">Daily Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-6">
            {/* Featured Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Featured Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.filter(r => r.is_featured).map((resource, index) => {
                  const CategoryIcon = getCategoryIcon(resource.category);
                  return (
                    <Card 
                      key={resource.id}
                      className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedResource(resource)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(resource.category)} flex items-center justify-center`}>
                              <CategoryIcon size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground capitalize">
                                {resource.age_group.replace('_', ' ')} • {resource.content_type}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-600">
                            Featured
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {resource.islamic_values.slice(0, 3).map((value, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart size={12} />
                              {resource.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download size={12} />
                              {resource.downloads}
                            </span>
                          </div>
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* All Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource, index) => {
                  const CategoryIcon = getCategoryIcon(resource.category);
                  return (
                    <Card 
                      key={resource.id}
                      className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer group"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedResource(resource)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryColor(resource.category)} flex items-center justify-center`}>
                              <CategoryIcon size={16} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                                {resource.title}
                              </h4>
                              <p className="text-xs text-muted-foreground capitalize">
                                {resource.age_group.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(resource.id);
                            }}
                            className="w-8 h-8 p-0"
                          >
                            <Heart size={14} className={favorites.includes(resource.id) ? "fill-current text-red-500" : ""} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart size={10} />
                            {resource.likes}
                          </span>
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4">
            {parentingTips.map((tip, index) => (
              <Card key={tip.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{tip.tip}</p>
                  
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Islamic Basis</h5>
                    <p className="text-sm text-green-700 dark:text-green-300">{tip.islamic_basis}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Practical Steps:</h5>
                    <ul className="space-y-1">
                      {tip.practical_steps.map((step, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tip.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Islamic Activities for Children</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      time: 'Morning',
                      activities: ['Wake up with Alhamdulillah', 'Morning duas', 'Fajr prayer (for older children)', 'Quran recitation'],
                      icon: '🌅'
                    },
                    {
                      time: 'Afternoon',
                      activities: ['Dhikr during play', 'Islamic stories', 'Learning Arabic letters', 'Helping with chores'],
                      icon: '☀️'
                    },
                    {
                      time: 'Evening',
                      activities: ['Maghrib prayer', 'Family Quran time', 'Islamic games', 'Gratitude sharing'],
                      icon: '🌆'
                    },
                    {
                      time: 'Bedtime',
                      activities: ['Bedtime duas', 'Istighfar', 'Prophet stories', 'Peaceful sleep prayers'],
                      icon: '🌙'
                    }
                  ].map((schedule, index) => (
                    <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{schedule.icon}</span>
                          <h4 className="font-semibold">{schedule.time}</h4>
                        </div>
                        <ul className="space-y-2">
                          {schedule.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <Star size={12} className="text-primary" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resource Detail Modal */}
        {selectedResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{selectedResource.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {selectedResource.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {selectedResource.age_group.replace('_', ' ')}
                      </Badge>
                      <Badge className={getDifficultyColor(selectedResource.difficulty)}>
                        {selectedResource.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResource(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedResource.description}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Content</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedResource.content}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Islamic Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.islamic_values.map((value, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Learning Objectives</h4>
                  <ul className="space-y-1">
                    {selectedResource.learning_objectives.map((objective, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Target size={12} className="text-primary mt-1 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedResource.materials_needed && (
                  <div>
                    <h4 className="font-semibold mb-2">Materials Needed</h4>
                    <ul className="space-y-1">
                      {selectedResource.materials_needed.map((material, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {selectedResource.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={14} />
                      {selectedResource.downloads}
                    </span>
                    {selectedResource.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {selectedResource.duration}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(selectedResource.id)}
                      className="gap-1"
                    >
                      <Heart size={14} className={favorites.includes(selectedResource.id) ? "fill-current text-red-500" : ""} />
                      {favorites.includes(selectedResource.id) ? 'Favorited' : 'Favorite'}
                    </Button>
                    <Button size="sm" className="gap-1">
                      <Download size={14} />
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
          <IslamicEducationFiller type="hadith" size="medium" />
          <IslamicEducationFiller type="tip" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}