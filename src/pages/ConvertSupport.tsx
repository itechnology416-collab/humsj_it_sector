import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Phone,
  MessageCircle,
  Users,
  BookOpen,
  Home,
  HandHeart,
  Shield,
  Clock,
  Calendar,
  Gift,
  Star,
  Compass,
  Award,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface SupportService {
  id: string;
  title: string;
  description: string;
  category: string;
  availability: string;
  contact_method: string;
  response_time: string;
  languages: string[];
  is_free: boolean;
  is_emergency: boolean;
  is_featured: boolean;
}

interface SupportResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'audio' | 'book' | 'app';
  category: string;
  language: string;
  download_url: string;
  is_free: boolean;
}

const mockServices: SupportService[] = [
  {
    id: '1',
    title: '24/7 New Muslim Helpline',
    description: 'Round-the-clock support for urgent questions, spiritual guidance, and emotional support.',
    category: 'Emergency Support',
    availability: '24/7',
    contact_method: 'Phone, Text, Chat',
    response_time: 'Immediate',
    languages: ['English', 'Arabic', 'Spanish', 'French'],
    is_free: true,
    is_emergency: true,
    is_featured: true
  },
  {
    id: '2',
    title: 'Personal Mentor Assignment',
    description: 'One-on-one mentorship with experienced Muslim to guide your Islamic journey.',
    category: 'Mentorship',
    availability: 'By appointment',
    contact_method: 'In-person, Video call',
    response_time: '24-48 hours',
    languages: ['English', 'Arabic', 'Urdu'],
    is_free: true,
    is_emergency: false,
    is_featured: true
  },
  {
    id: '3',
    title: 'Family Relationship Counseling',
    description: 'Professional counseling for family conflicts and relationship challenges after conversion.',
    category: 'Counseling',
    availability: 'Weekdays 9 AM - 6 PM',
    contact_method: 'In-person, Video call',
    response_time: '2-3 days',
    languages: ['English', 'Arabic'],
    is_free: true,
    is_emergency: false,
    is_featured: true
  },
  {
    id: '4',
    title: 'Islamic Learning Support',
    description: 'Educational support for learning prayers, Quran reading, and Islamic practices.',
    category: 'Education',
    availability: 'Flexible schedule',
    contact_method: 'In-person, Online',
    response_time: 'Same day',
    languages: ['English', 'Arabic', 'Spanish'],
    is_free: true,
    is_emergency: false,
    is_featured: false
  }
];

const mockResources: SupportResource[] = [
  {
    id: '1',
    title: 'New Muslim Handbook',
    description: 'Comprehensive guide covering Islamic basics, prayers, and daily practices.',
    type: 'book',
    category: 'Foundation',
    language: 'English',
    download_url: '/resources/new-muslim-handbook.pdf',
    is_free: true
  },
  {
    id: '2',
    title: 'Prayer Learning Videos',
    description: 'Step-by-step video tutorials for learning Islamic prayers.',
    type: 'video',
    category: 'Prayer',
    language: 'English',
    download_url: '/resources/prayer-videos',
    is_free: true
  },
  {
    id: '3',
    title: 'Quran Recitation Audio',
    description: 'Beautiful Quran recitations with translation for learning and reflection.',
    type: 'audio',
    category: 'Quran',
    language: 'Arabic/English',
    download_url: '/resources/quran-audio',
    is_free: true
  },
  {
    id: '4',
    title: 'Islamic Daily Companion App',
    description: 'Mobile app with prayer times, Qibla direction, and daily Islamic reminders.',
    type: 'app',
    category: 'Daily Life',
    language: 'Multiple',
    download_url: '/resources/companion-app',
    is_free: true
  }
];

const serviceCategories = ['All Categories', 'Emergency Support', 'Mentorship', 'Counseling', 'Education', 'Community'];
const resourceTypes = ['All Types', 'guide', 'video', 'audio', 'book', 'app'];

export default function ConvertSupport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [services] = useState<SupportService[]>(mockServices);
  const [resources] = useState<SupportResource[]>(mockResources);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All Categories');
  const [selectedResourceType, setSelectedResourceType] = useState('All Types');

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedServiceCategory === 'All Categories' || service.category === selectedServiceCategory;
    return matchesCategory;
  });

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedResourceType === 'All Types' || resource.type === selectedResourceType;
    return matchesType;
  });

  const emergencyServices = services.filter(s => s.is_emergency);
  const featuredServices = services.filter(s => s.is_featured);
  const totalLanguages = [...new Set(services.flatMap(s => s.languages))].length;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Emergency Support': 'bg-red-500/20 text-red-600',
      'Mentorship': 'bg-blue-500/20 text-blue-600',
      'Counseling': 'bg-purple-500/20 text-purple-600',
      'Education': 'bg-green-500/20 text-green-600',
      'Community': 'bg-orange-500/20 text-orange-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'guide': 'bg-blue-500/20 text-blue-600',
      'video': 'bg-red-500/20 text-red-600',
      'audio': 'bg-green-500/20 text-green-600',
      'book': 'bg-purple-500/20 text-purple-600',
      'app': 'bg-orange-500/20 text-orange-600'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emergency Support': return <Phone size={16} />;
      case 'Mentorship': return <HandHeart size={16} />;
      case 'Counseling': return <Heart size={16} />;
      case 'Education': return <BookOpen size={16} />;
      case 'Community': return <Users size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen size={16} />;
      case 'video': return <Star size={16} />;
      case 'audio': return <MessageCircle size={16} />;
      case 'book': return <BookOpen size={16} />;
      case 'app': return <Phone size={16} />;
      default: return <Gift size={16} />;
    }
  };

  return (
    <ProtectedPageLayout 
      title="New Muslim Support" 
      subtitle="Comprehensive guidance and support for new Muslims"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <HandHeart size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">New Muslim Support</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive guidance, resources, and community support for your Islamic journey
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <Phone size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium">{emergencyServices.length}</p>
                <p className="text-xs text-muted-foreground">Emergency services</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <HandHeart size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{featuredServices.length}</p>
                <p className="text-xs text-muted-foreground">Featured services</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{totalLanguages}</p>
                <p className="text-xs text-muted-foreground">Languages supported</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Gift size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Free</p>
                <p className="text-xs text-muted-foreground">All services</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">24/7 Emergency Support</h3>
                <p className="text-sm text-muted-foreground">
                  Immediate help available anytime for urgent questions or support needs
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">1-800-NEW-HELP</p>
                <p className="text-xs text-muted-foreground">Available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Support Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <select
                    value={selectedServiceCategory}
                    onChange={(e) => setSelectedServiceCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                  >
                    {serviceCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service, index) => (
                <Card 
                  key={service.id}
                  className={cn(
                    "hover:shadow-lg transition-all duration-300 animate-slide-up",
                    service.is_emergency && "border-red-200 dark:border-red-800"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          service.is_emergency ? "bg-red-500" : "bg-teal-500"
                        )}>
                          {getCategoryIcon(service.category)}
                          <span className="text-white text-xs ml-1"></span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn("text-xs", getCategoryColor(service.category))}>
                              {service.category}
                            </Badge>
                            {service.is_emergency && (
                              <Badge className="bg-red-500 text-white text-xs">
                                Emergency
                              </Badge>
                            )}
                            {service.is_featured && (
                              <Badge className="bg-yellow-500 text-black text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Availability:</span>
                        <p className="text-muted-foreground">{service.availability}</p>
                      </div>
                      <div>
                        <span className="font-medium">Response Time:</span>
                        <p className="text-muted-foreground">{service.response_time}</p>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>
                        <p className="text-muted-foreground">{service.contact_method}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span>
                        <p className="text-green-600 font-medium">
                          {service.is_free ? 'Free' : 'Paid'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.languages.map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 gap-2">
                        <Phone size={16} />
                        Contact Now
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <BookOpen size={16} />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <select
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                  >
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <Card 
                  key={resource.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    {getTypeIcon(resource.type)}
                    <span className="text-white text-2xl relative z-10 ml-2">
                      {getTypeIcon(resource.type)}
                    </span>
                    <div className="absolute top-2 left-2">
                      <Badge className={cn("text-xs", getTypeColor(resource.type))}>
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {resource.language}
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                      {resource.is_free && (
                        <span className="text-green-600 font-medium">Free</span>
                      )}
                    </div>

                    <Button className="w-full gap-2">
                      <Gift size={16} />
                      Download/Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    New Muslim Support Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Join weekly support groups with other new Muslims for shared experiences and mutual support.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Weekly group meetings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Peer support and friendship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Shared learning experiences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Social activities and events</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Users size={16} />
                    Join Support Group
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    Online Community Forum
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect with new Muslims worldwide through our private online community platform.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>24/7 community discussions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Ask questions anonymously</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Share experiences and advice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Moderated by Islamic scholars</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <MessageCircle size={16} />
                    Join Forum
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart size={20} />
                    Buddy System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Get paired with an experienced Muslim buddy for personalized friendship and guidance.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>One-on-one friendship pairing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Regular check-ins and meetups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Practical life guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Cultural integration support</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <HandHeart size={16} />
                    Get a Buddy
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} />
                    Community Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Participate in special events and activities designed for new Muslims.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Monthly new Muslim gatherings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Islamic holiday celebrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Educational workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                      <span>Family-friendly activities</span>
                    </li>
                  </ul>
                  <Button className="w-full gap-2">
                    <Calendar size={16} />
                    View Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-teal-500 pl-4">
                      <h4 className="font-semibold">How do I learn to pray?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        We provide step-by-step prayer guides, video tutorials, and personal instruction. 
                        Contact our prayer learning support service for personalized help.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">What if my family doesn't support my conversion?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Family relationship challenges are common. Our counseling services and support groups 
                        can help you navigate these difficulties with patience and wisdom.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold">How do I find halal food?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        We provide comprehensive halal food guides, local restaurant recommendations, 
                        and cooking resources to help you maintain a halal diet.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">Can I get help learning Arabic?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Yes! We offer Arabic language classes specifically for new Muslims, focusing on 
                        prayer Arabic and Quran reading. Both in-person and online options available.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold">What should I do during Ramadan?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        We provide special Ramadan guidance for new Muslims, including fasting rules, 
                        exemptions, spiritual practices, and community iftar invitations.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-semibold">Is all support really free?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Yes, all our support services are completely free. This includes counseling, 
                        mentorship, educational resources, and community programs. No hidden costs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Still have questions?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Can't find the answer you're looking for? Our support team is here to help 24/7.
                    </p>
                    <div className="flex gap-2">
                      <Button className="gap-2">
                        <Phone size={16} />
                        Call Support
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <MessageCircle size={16} />
                        Live Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}