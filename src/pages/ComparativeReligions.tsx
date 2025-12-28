import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play,
  Download,
  Star,
  Clock,
  Users,
  Globe,
  Search,
  Filter,
  Eye,
  FileText,
  Video,
  Headphones,
  Award,
  Lightbulb,
  Scale,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ComparativeResource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'video' | 'audio' | 'pdf' | 'article' | 'course';
  category: string;
  religions_compared: string[];
  author: string;
  duration?: string;
  pages?: number;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  file_size?: string;
  preview_url?: string;
  download_url: string;
  is_free: boolean;
  is_featured: boolean;
  publication_date: string;
  tags: string[];
}

interface Scholar {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  biography: string;
  education: string[];
  publications: number;
  languages: string[];
  image_url: string;
  contact_info?: string;
}

const mockResources: ComparativeResource[] = [
  {
    id: '1',
    title: 'Islam and Christianity: A Comprehensive Comparison',
    description: 'Detailed analysis of theological, historical, and practical differences and similarities between Islam and Christianity.',
    type: 'book',
    category: 'Theology',
    religions_compared: ['Islam', 'Christianity'],
    author: 'Dr. Ahmad Deedat',
    pages: 450,
    language: 'English',
    difficulty: 'intermediate',
    rating: 4.8,
    downloads: 15420,
    file_size: '12.5 MB',
    preview_url: '/preview/islam-christianity-comparison',
    download_url: '/downloads/islam-christianity-book.pdf',
    is_free: true,
    is_featured: true,
    publication_date: '2023-01-15',
    tags: ['theology', 'comparative', 'abrahamic', 'scripture']
  },
  {
    id: '2',
    title: 'The Three Monotheistic Faiths: Judaism, Christianity, and Islam',
    description: 'Scholarly examination of the three Abrahamic religions, their origins, beliefs, and practices.',
    type: 'video',
    category: 'Documentary',
    religions_compared: ['Islam', 'Christianity', 'Judaism'],
    author: 'Prof. John Esposito',
    duration: '2h 45m',
    language: 'English',
    difficulty: 'beginner',
    rating: 4.6,
    downloads: 8920,
    file_size: '1.8 GB',
    preview_url: '/preview/three-faiths-documentary',
    download_url: '/downloads/three-faiths-video.mp4',
    is_free: true,
    is_featured: true,
    publication_date: '2023-03-20',
    tags: ['documentary', 'abrahamic', 'history', 'beliefs']
  },
  {
    id: '3',
    title: 'Buddhism and Islam: Philosophical Perspectives',
    description: 'Academic exploration of Buddhist and Islamic philosophical traditions and their approaches to spirituality.',
    type: 'pdf',
    category: 'Philosophy',
    religions_compared: ['Islam', 'Buddhism'],
    author: 'Dr. Seyyed Hossein Nasr',
    pages: 280,
    language: 'English',
    difficulty: 'advanced',
    rating: 4.7,
    downloads: 5630,
    file_size: '8.2 MB',
    preview_url: '/preview/buddhism-islam-philosophy',
    download_url: '/downloads/buddhism-islam-philosophy.pdf',
    is_free: false,
    is_featured: false,
    publication_date: '2022-11-10',
    tags: ['philosophy', 'spirituality', 'meditation', 'ethics']
  },
  {
    id: '4',
    title: 'Hinduism and Islam: Historical Interactions',
    description: 'Historical analysis of Hindu-Muslim relations, cultural exchanges, and theological dialogues in the Indian subcontinent.',
    type: 'audio',
    category: 'History',
    religions_compared: ['Islam', 'Hinduism'],
    author: 'Dr. Akbar Ahmed',
    duration: '3h 20m',
    language: 'English',
    difficulty: 'intermediate',
    rating: 4.5,
    downloads: 7240,
    file_size: '180 MB',
    preview_url: '/preview/hinduism-islam-history',
    download_url: '/downloads/hinduism-islam-audio.mp3',
    is_free: true,
    is_featured: false,
    publication_date: '2023-05-08',
    tags: ['history', 'culture', 'dialogue', 'subcontinent']
  },
  {
    id: '5',
    title: 'Comparative Religion Studies: Methodology and Practice',
    description: 'Comprehensive course on how to study and compare different religious traditions academically and respectfully.',
    type: 'course',
    category: 'Methodology',
    religions_compared: ['Islam', 'Christianity', 'Judaism', 'Hinduism', 'Buddhism'],
    author: 'Dr. Mircea Eliade Institute',
    duration: '12 weeks',
    language: 'English',
    difficulty: 'advanced',
    rating: 4.9,
    downloads: 3450,
    preview_url: '/preview/comparative-methodology-course',
    download_url: '/courses/comparative-religion-methodology',
    is_free: false,
    is_featured: true,
    publication_date: '2023-08-15',
    tags: ['methodology', 'academic', 'research', 'interfaith']
  },
  {
    id: '6',
    title: 'Women in World Religions: A Comparative Study',
    description: 'Examination of women\'s roles, rights, and representations across major world religions.',
    type: 'article',
    category: 'Gender Studies',
    religions_compared: ['Islam', 'Christianity', 'Judaism', 'Hinduism', 'Buddhism'],
    author: 'Dr. Amina Wadud',
    pages: 85,
    language: 'English',
    difficulty: 'intermediate',
    rating: 4.4,
    downloads: 9870,
    file_size: '2.1 MB',
    preview_url: '/preview/women-world-religions',
    download_url: '/downloads/women-religions-study.pdf',
    is_free: true,
    is_featured: false,
    publication_date: '2023-06-12',
    tags: ['gender', 'women', 'rights', 'comparative']
  }
];

const mockScholars: Scholar[] = [
  {
    id: '1',
    name: 'Dr. Ahmad Deedat',
    title: 'Islamic Scholar & Comparative Religion Expert',
    specialization: ['Comparative Religion', 'Christian-Muslim Dialogue', 'Biblical Studies'],
    biography: 'Renowned South African Islamic scholar known for his comparative religion debates and writings.',
    education: ['Islamic Studies', 'Biblical Studies', 'Comparative Theology'],
    publications: 45,
    languages: ['English', 'Arabic', 'Urdu'],
    image_url: '/scholars/ahmad-deedat.jpg',
    contact_info: 'Available for lectures and consultations'
  },
  {
    id: '2',
    name: 'Prof. John Esposito',
    title: 'Professor of Islamic Studies',
    specialization: ['Islamic Studies', 'Middle Eastern Studies', 'Interfaith Relations'],
    biography: 'Distinguished professor and author of numerous works on Islam and Muslim-Christian relations.',
    education: ['PhD Islamic Studies', 'Georgetown University', 'Harvard Divinity School'],
    publications: 35,
    languages: ['English', 'Arabic'],
    image_url: '/scholars/john-esposito.jpg',
    contact_info: 'Georgetown University'
  },
  {
    id: '3',
    name: 'Dr. Seyyed Hossein Nasr',
    title: 'Islamic Philosophy Scholar',
    specialization: ['Islamic Philosophy', 'Sufism', 'Comparative Mysticism'],
    biography: 'Leading authority on Islamic philosophy and traditional Islamic sciences.',
    education: ['PhD Harvard University', 'Traditional Islamic Sciences'],
    publications: 50,
    languages: ['English', 'Arabic', 'Persian'],
    image_url: '/scholars/seyyed-nasr.jpg',
    contact_info: 'George Washington University'
  }
];

const categories = ['All Categories', 'Theology', 'Philosophy', 'History', 'Methodology', 'Gender Studies', 'Ethics'];
const types = ['All Types', 'book', 'video', 'audio', 'pdf', 'article', 'course'];
const difficulties = ['All Levels', 'beginner', 'intermediate', 'advanced'];
const religions = ['All Religions', 'Christianity', 'Judaism', 'Hinduism', 'Buddhism', 'Sikhism', 'Other'];

export default function ComparativeReligions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState<ComparativeResource[]>(mockResources);
  const [scholars] = useState<Scholar[]>(mockScholars);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedReligion, setSelectedReligion] = useState('All Religions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ComparativeResource | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'All Categories' || resource.category === selectedCategory;
    const matchesType = selectedType === 'All Types' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'All Levels' || resource.difficulty === selectedDifficulty;
    const matchesReligion = selectedReligion === 'All Religions' || 
      resource.religions_compared.some(religion => religion.toLowerCase().includes(selectedReligion.toLowerCase()));
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesDifficulty && matchesReligion && matchesSearch;
  });

  const featuredResources = resources.filter(r => r.is_featured);
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
  const freeResources = resources.filter(r => r.is_free).length;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'book': 'bg-blue-500/20 text-blue-600',
      'video': 'bg-red-500/20 text-red-600',
      'audio': 'bg-green-500/20 text-green-600',
      'pdf': 'bg-purple-500/20 text-purple-600',
      'article': 'bg-orange-500/20 text-orange-600',
      'course': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen size={16} />;
      case 'video': return <Video size={16} />;
      case 'audio': return <Headphones size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'article': return <FileText size={16} />;
      case 'course': return <Award size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const downloadResource = async (resourceId: string) => {
    try {
      const resource = resources.find(r => r.id === resourceId);
      if (!resource) return;

      // Simulate API call to track download
      const response = await fetch('/api/comparative-religions/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          userId: 'current-user-id' // Replace with actual user ID
        }),
      });

      if (response.ok) {
        // Update download count
        setResources(prev => prev.map(r => 
          r.id === resourceId 
            ? { ...r, downloads: r.downloads + 1 }
            : r
        ));

        // Trigger actual download
        window.open(resource.download_url, '_blank');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <ProtectedPageLayout 
      title="Comparative Religions" 
      subtitle="Scholarly resources for understanding Islam in relation to other world religions"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Scale size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Comparative Religions</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Academic resources for understanding Islam in dialogue with other world religions
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{resources.length}</p>
                <p className="text-xs text-muted-foreground">Total resources</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total downloads</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Star size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{featuredResources.length}</p>
                <p className="text-xs text-muted-foreground">Featured content</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Heart size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">{freeResources}</p>
                <p className="text-xs text-muted-foreground">Free resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search resources, authors, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                  />
                </div>
              </div>
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
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
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

                <select
                  value={selectedReligion}
                  onChange={(e) => setSelectedReligion(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {religions.map(religion => (
                    <option key={religion} value={religion}>{religion}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="scholars">Scholars</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <Card 
                  key={resource.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    {getTypeIcon(resource.type)}
                    <span className="text-white text-2xl relative z-10 ml-2">
                      {getTypeIcon(resource.type)}
                    </span>
                    <div className="absolute top-2 left-2 flex gap-1">
                      {resource.is_featured && (
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Featured
                        </Badge>
                      )}
                      <Badge className={cn("text-xs", getTypeColor(resource.type))}>
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Star size={12} />
                      {resource.rating}
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                        {resource.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.language}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>By {resource.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <span>Compares: {resource.religions_compared.join(', ')}</span>
                      </div>
                      {resource.duration && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      {resource.pages && (
                        <div className="flex items-center gap-2">
                          <FileText size={14} />
                          <span>{resource.pages} pages</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Download size={14} />
                        <span>{resource.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="text-sm">
                        {resource.is_free ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          <span className="font-medium">Premium</span>
                        )}
                        {resource.file_size && (
                          <p className="text-xs text-muted-foreground">{resource.file_size}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedResource(resource)}
                          className="gap-2"
                        >
                          <Eye size={14} />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => downloadResource(resource.id)}
                          className="gap-2"
                        >
                          <Download size={14} />
                          {resource.type === 'course' ? 'Enroll' : 'Download'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholars" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholars.map((scholar, index) => (
                <Card 
                  key={scholar.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <Users size={32} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{scholar.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{scholar.title}</p>
                    
                    <div className="space-y-3 text-left">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Specialization:</h4>
                        <div className="flex flex-wrap gap-1">
                          {scholar.specialization.map(spec => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Languages:</h4>
                        <p className="text-xs text-muted-foreground">
                          {scholar.languages.join(', ')}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Publications:</h4>
                        <p className="text-xs text-muted-foreground">
                          {scholar.publications} published works
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 line-clamp-3">
                      {scholar.biography}
                    </p>

                    <Button size="sm" className="w-full mt-4">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    Abrahamic Religions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comparative study of Judaism, Christianity, and Islam - their shared heritage and distinct characteristics.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Monotheistic foundations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Prophetic traditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Scriptural comparisons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Ethical teachings</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <BookOpen size={16} />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb size={20} />
                    Eastern Religions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Understanding Islam in dialogue with Hinduism, Buddhism, and other Eastern spiritual traditions.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Spiritual practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Meditation and prayer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Philosophical concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Cultural exchanges</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Lightbulb size={16} />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale size={20} />
                    Ethics & Morality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comparative analysis of ethical systems and moral teachings across different religious traditions.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Social justice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Human rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Environmental ethics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Medical ethics</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Scale size={16} />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={20} />
                    Interfaith Dialogue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Resources for promoting understanding and cooperation between different religious communities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Dialogue methodologies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Common ground identification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Conflict resolution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Peaceful coexistence</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Globe size={16} />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart size={20} />
                    Mysticism & Spirituality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comparative study of mystical traditions and spiritual practices across religions.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Sufism and Christian mysticism</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Meditation practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Spiritual experiences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Divine love concepts</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Heart size={16} />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} />
                    Women in Religion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comparative analysis of women's roles, rights, and contributions across different religious traditions.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Religious leadership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Scriptural interpretations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Historical contributions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Contemporary issues</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Award size={16} />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="methodology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Methodology for Comparative Religion Studies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Research Principles</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Objectivity:</strong> Maintain scholarly neutrality and avoid bias</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Respect:</strong> Approach all traditions with dignity and understanding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Accuracy:</strong> Use authentic sources and verified information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Context:</strong> Consider historical and cultural backgrounds</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Comparative Methods</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Phenomenological:</strong> Study religious experiences and expressions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Historical:</strong> Examine development and interactions over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Anthropological:</strong> Study religious practices in cultural context</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span><strong>Theological:</strong> Compare doctrines and belief systems</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Recommended Reading Order</h4>
                  <ol className="space-y-1 text-sm">
                    <li>1. Start with methodology and principles</li>
                    <li>2. Study individual religions separately first</li>
                    <li>3. Begin with Abrahamic religions comparison</li>
                    <li>4. Expand to Eastern religions dialogue</li>
                    <li>5. Focus on specific topics of interest</li>
                    <li>6. Engage with contemporary interfaith issues</li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="gap-2">
                    <BookOpen size={16} />
                    Methodology Course
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download size={16} />
                    Research Guide
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Users size={16} />
                    Study Groups
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resource Details Modal */}
        {selectedResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedResource.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedResource(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-4">{selectedResource.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="font-medium">Author:</span>
                      <p>{selectedResource.author}</p>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <p className="capitalize">{selectedResource.type}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{selectedResource.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>
                      <p className="capitalize">{selectedResource.difficulty}</p>
                    </div>
                    <div>
                      <span className="font-medium">Language:</span>
                      <p>{selectedResource.language}</p>
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span>
                      <p className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        {selectedResource.rating}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Religions Compared</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.religions_compared.map(religion => (
                      <Badge key={religion} variant="outline" className="text-xs">
                        {religion}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Access Level</p>
                    <p className="text-lg font-semibold">
                      {selectedResource.is_free ? 'Free Access' : 'Premium Content'}
                    </p>
                    {selectedResource.file_size && (
                      <p className="text-xs text-muted-foreground mt-1">Size: {selectedResource.file_size}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedResource.preview_url && (
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.open(selectedResource.preview_url, '_blank')}
                      >
                        <Play size={16} />
                        Preview
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        downloadResource(selectedResource.id);
                        setSelectedResource(null);
                      }}
                      className="gap-2"
                    >
                      <Download size={16} />
                      {selectedResource.type === 'course' ? 'Enroll' : 'Download'}
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