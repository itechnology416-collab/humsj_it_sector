import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Users, 
  Calendar,
  Phone,
  MapPin,
  Clock,
  Star,
  Shield,
  Stethoscope,
  Home,
  BookOpen,
  MessageCircle,
  Bell,
  Activity,
  Pill,
  Utensils,
  Car,
  Accessibility,
  HandHeart,
  Search,
  Filter,
  Plus,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ElderProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  family_contact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  health_status: 'good' | 'fair' | 'needs_attention';
  mobility: 'independent' | 'assisted' | 'wheelchair';
  care_needs: string[];
  interests: string[];
  islamic_practices: {
    prayer_assistance: boolean;
    quran_recitation: boolean;
    dhikr_sessions: boolean;
    islamic_lectures: boolean;
  };
  emergency_contact: string;
  medical_conditions: string[];
  medications: string[];
  preferred_language: string;
  last_visit: string;
  assigned_volunteer?: string;
}

interface CareService {
  id: string;
  name: string;
  description: string;
  category: 'medical' | 'spiritual' | 'social' | 'practical' | 'emergency';
  provider: string;
  availability: string;
  cost: string;
  requirements: string[];
  contact_info: {
    phone: string;
    email: string;
    address: string;
  };
  islamic_friendly: boolean;
  rating: number;
  reviews_count: number;
}

interface VolunteerActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'visit' | 'assistance' | 'spiritual' | 'medical' | 'social';
  volunteers_needed: number;
  volunteers_registered: number;
  elder_participants: string[];
  requirements: string[];
  coordinator: string;
}

const mockElderProfiles: ElderProfile[] = [
  {
    id: '1',
    name: 'Hajja Fatima Al-Zahra',
    age: 78,
    gender: 'female',
    location: 'Harar, Ethiopia',
    family_contact: {
      name: 'Ahmed Hassan',
      relationship: 'Son',
      phone: '+251-911-123456',
      email: 'ahmed.hassan@email.com'
    },
    health_status: 'fair',
    mobility: 'assisted',
    care_needs: ['Daily medication reminders', 'Grocery shopping', 'Transportation to mosque', 'Social companionship'],
    interests: ['Quran recitation', 'Islamic history', 'Cooking traditional food', 'Gardening'],
    islamic_practices: {
      prayer_assistance: true,
      quran_recitation: true,
      dhikr_sessions: true,
      islamic_lectures: true
    },
    emergency_contact: '+251-911-654321',
    medical_conditions: ['Diabetes', 'High blood pressure'],
    medications: ['Metformin', 'Lisinopril'],
    preferred_language: 'Arabic',
    last_visit: '2024-12-20T10:00:00Z',
    assigned_volunteer: 'Sister Aisha Mohamed'
  },
  {
    id: '2',
    name: 'Hajj Omar Ibrahim',
    age: 82,
    gender: 'male',
    location: 'Addis Ababa, Ethiopia',
    family_contact: {
      name: 'Yusuf Omar',
      relationship: 'Son',
      phone: '+251-911-789012',
      email: 'yusuf.omar@email.com'
    },
    health_status: 'good',
    mobility: 'independent',
    care_needs: ['Weekly check-ins', 'Technology assistance', 'Islamic lecture attendance'],
    interests: ['Islamic studies', 'Reading', 'Community discussions', 'Teaching young Muslims'],
    islamic_practices: {
      prayer_assistance: false,
      quran_recitation: true,
      dhikr_sessions: true,
      islamic_lectures: true
    },
    emergency_contact: '+251-911-345678',
    medical_conditions: ['Mild arthritis'],
    medications: ['Ibuprofen as needed'],
    preferred_language: 'Amharic',
    last_visit: '2024-12-22T14:30:00Z',
    assigned_volunteer: 'Brother Mahmoud Ali'
  }
];

const careServices: CareService[] = [
  {
    id: '1',
    name: 'Islamic Home Healthcare',
    description: 'Professional healthcare services with Islamic values and cultural sensitivity',
    category: 'medical',
    provider: 'Mercy Healthcare Center',
    availability: '24/7',
    cost: 'Insurance accepted',
    requirements: ['Medical assessment', 'Family consent'],
    contact_info: {
      phone: '+251-911-555001',
      email: 'info@mercyhealthcare.et',
      address: 'Bole Road, Addis Ababa'
    },
    islamic_friendly: true,
    rating: 4.8,
    reviews_count: 156
  },
  {
    id: '2',
    name: 'Spiritual Companionship Program',
    description: 'Regular visits for Quran recitation, dhikr sessions, and Islamic discussions',
    category: 'spiritual',
    provider: 'HUMSJ Volunteer Network',
    availability: 'Daily',
    cost: 'Free',
    requirements: ['Registration', 'Background check for volunteers'],
    contact_info: {
      phone: '+251-911-555002',
      email: 'spiritual@humsj.et',
      address: 'Haramaya University Campus'
    },
    islamic_friendly: true,
    rating: 4.9,
    reviews_count: 89
  }
];

const volunteerActivities: VolunteerActivity[] = [
  {
    id: '1',
    title: 'Weekly Elder Visit Program',
    description: 'Regular home visits to provide companionship and check on elder welfare',
    date: '2024-12-28',
    time: '14:00',
    location: 'Various homes in Harar',
    type: 'visit',
    volunteers_needed: 5,
    volunteers_registered: 3,
    elder_participants: ['1', '2'],
    requirements: ['Background check', 'Training completion', 'Reliable transportation'],
    coordinator: 'Sister Khadija Hassan'
  },
  {
    id: '2',
    title: 'Quran Recitation Circle',
    description: 'Group Quran recitation and discussion session for elders',
    date: '2024-12-29',
    time: '16:00',
    location: 'Community Center',
    type: 'spiritual',
    volunteers_needed: 2,
    volunteers_registered: 2,
    elder_participants: ['1'],
    requirements: ['Good Quran recitation skills', 'Patience with elderly'],
    coordinator: 'Brother Ahmad Yusuf'
  }
];

export default function ElderCare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [elders, setElders] = useState<ElderProfile[]>(mockElderProfiles);
  const [services, setServices] = useState<CareService[]>(careServices);
  const [activities, setActivities] = useState<VolunteerActivity[]>(volunteerActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedElder, setSelectedElder] = useState<ElderProfile | null>(null);
  const [showNewVisitForm, setShowNewVisitForm] = useState(false);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-600';
      case 'fair': return 'bg-yellow-500/20 text-yellow-600';
      case 'needs_attention': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMobilityIcon = (mobility: string) => {
    switch (mobility) {
      case 'independent': return Activity;
      case 'assisted': return HandHeart;
      case 'wheelchair': return Accessibility;
      default: return Activity;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical': return Stethoscope;
      case 'spiritual': return Heart;
      case 'social': return Users;
      case 'practical': return Home;
      case 'emergency': return Bell;
      default: return Heart;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <ProtectedPageLayout 
      title="Elder Care" 
      subtitle="Caring for our elders with Islamic values and community support"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Elder Care Program</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Honoring and caring for our elderly community members with dignity and Islamic values
                </p>
              </div>
              <Button onClick={() => setShowNewVisitForm(true)} className="gap-2">
                <Plus size={16} />
                Schedule Visit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-emerald-600" />
                </div>
                <p className="text-sm font-medium">{elders.length} Elders</p>
                <p className="text-xs text-muted-foreground">Under care</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <HandHeart size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">15 Volunteers</p>
                <p className="text-xs text-muted-foreground">Active helpers</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{activities.length} Activities</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Emergency care</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Islamic Values Notice */}
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Heart size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Islamic Approach to Elder Care
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  "Your Lord has decreed that you worship none but Him, and be kind to parents. If one or both of them reach old age with you, 
                  do not say 'uff' to them or scold them, but speak to them respectfully." - Quran 17:23
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Respect & Dignity</Badge>
                  <Badge variant="outline" className="text-xs">Family Values</Badge>
                  <Badge variant="outline" className="text-xs">Community Support</Badge>
                  <Badge variant="outline" className="text-xs">Spiritual Care</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="elders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="elders">Elder Profiles</TabsTrigger>
            <TabsTrigger value="services">Care Services</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="elders" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search elders by name, location, or needs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                  
                  <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Elder Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {elders.map((elder, index) => {
                const MobilityIcon = getMobilityIcon(elder.mobility);
                return (
                  <Card 
                    key={elder.id}
                    className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedElder(elder)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-semibold">
                            {elder.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold">{elder.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {elder.age} years old • {elder.gender}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getHealthStatusColor(elder.health_status)}>
                                {elder.health_status.replace('_', ' ')}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <MobilityIcon size={14} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground capitalize">
                                  {elder.mobility}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {elder.assigned_volunteer && (
                          <Badge variant="outline" className="text-xs">
                            Assigned
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          {elder.location}
                        </div>
                        
                        {/* Care Needs */}
                        <div>
                          <h5 className="font-medium text-sm mb-2">Care Needs:</h5>
                          <div className="flex flex-wrap gap-1">
                            {elder.care_needs.slice(0, 3).map((need, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {need}
                              </Badge>
                            ))}
                            {elder.care_needs.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{elder.care_needs.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Islamic Practices */}
                        <div>
                          <h5 className="font-medium text-sm mb-2">Islamic Practices:</h5>
                          <div className="flex flex-wrap gap-2">
                            {elder.islamic_practices.prayer_assistance && (
                              <Badge variant="secondary" className="text-xs">Prayer Support</Badge>
                            )}
                            {elder.islamic_practices.quran_recitation && (
                              <Badge variant="secondary" className="text-xs">Quran</Badge>
                            )}
                            {elder.islamic_practices.dhikr_sessions && (
                              <Badge variant="secondary" className="text-xs">Dhikr</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            Last visit: {formatTimeAgo(elder.last_visit)}
                          </div>
                          
                          {elder.assigned_volunteer && (
                            <div className="text-xs text-muted-foreground">
                              Volunteer: {elder.assigned_volunteer}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => {
                const CategoryIcon = getCategoryIcon(service.category);
                return (
                  <Card key={service.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <CategoryIcon size={20} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.provider}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {service.islamic_friendly && (
                            <Badge className="bg-green-500/20 text-green-600 text-xs">
                              Islamic Friendly
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span className="text-sm">{service.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Availability:</span>
                            <p className="text-muted-foreground">{service.availability}</p>
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span>
                            <p className="text-muted-foreground">{service.cost}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone size={12} />
                            {service.contact_info.phone}
                          </div>
                          <Button size="sm" variant="outline">
                            Contact Service
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            {activities.map((activity, index) => (
              <Card key={activity.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-muted-foreground" />
                        <span>{activity.volunteers_registered}/{activity.volunteers_needed} volunteers</span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Requirements:</h5>
                      <div className="flex flex-wrap gap-2">
                        {activity.requirements.map((req, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Coordinator: {activity.coordinator}
                      </div>
                      <Button size="sm" className="gap-2">
                        <CheckCircle size={14} />
                        Register as Volunteer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="volunteers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Become a Volunteer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Join our elder care volunteer program and make a meaningful difference in the lives of our elderly community members. 
                  Volunteers receive training and ongoing support to provide the best care possible.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Volunteer Opportunities:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        Regular home visits and companionship
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        Transportation assistance
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        Grocery shopping and errands
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        Spiritual support and Quran recitation
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        Technology assistance
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Star size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        Background check completion
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        Elder care training program
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        Commitment to regular schedule
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        Patience and compassion
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        Islamic values and respect
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Button className="w-full gap-2">
                  <HandHeart size={16} />
                  Apply to Become a Volunteer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Elder Profile Detail Modal */}
        {selectedElder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-semibold">
                      {selectedElder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedElder.name}</h3>
                      <p className="text-muted-foreground">
                        {selectedElder.age} years old • {selectedElder.location}
                      </p>
                      <Badge className={getHealthStatusColor(selectedElder.health_status)}>
                        {selectedElder.health_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedElder(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="spiritual">Spiritual</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Care Needs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedElder.care_needs.map((need, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedElder.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedElder.assigned_volunteer && (
                      <div>
                        <h4 className="font-semibold mb-2">Assigned Volunteer</h4>
                        <p className="text-sm text-muted-foreground">{selectedElder.assigned_volunteer}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="health" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Medical Conditions</h4>
                      <div className="space-y-2">
                        {selectedElder.medical_conditions.map((condition, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Stethoscope size={14} className="text-muted-foreground" />
                            {condition}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Current Medications</h4>
                      <div className="space-y-2">
                        {selectedElder.medications.map((medication, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Pill size={14} className="text-muted-foreground" />
                            {medication}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Mobility Status</h4>
                      <Badge variant="outline" className="capitalize">
                        {selectedElder.mobility}
                      </Badge>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="spiritual" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Islamic Practices</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Prayer Assistance</span>
                          <Badge variant={selectedElder.islamic_practices.prayer_assistance ? "default" : "outline"}>
                            {selectedElder.islamic_practices.prayer_assistance ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Quran Recitation</span>
                          <Badge variant={selectedElder.islamic_practices.quran_recitation ? "default" : "outline"}>
                            {selectedElder.islamic_practices.quran_recitation ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dhikr Sessions</span>
                          <Badge variant={selectedElder.islamic_practices.dhikr_sessions ? "default" : "outline"}>
                            {selectedElder.islamic_practices.dhikr_sessions ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Islamic Lectures</span>
                          <Badge variant={selectedElder.islamic_practices.islamic_lectures ? "default" : "outline"}>
                            {selectedElder.islamic_practices.islamic_lectures ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Preferred Language</h4>
                      <p className="text-sm text-muted-foreground">{selectedElder.preferred_language}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Family Contact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-muted-foreground" />
                          {selectedElder.family_contact.name} ({selectedElder.family_contact.relationship})
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-muted-foreground" />
                          {selectedElder.family_contact.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle size={14} className="text-muted-foreground" />
                          {selectedElder.family_contact.email}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Emergency Contact</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Bell size={14} className="text-red-500" />
                        {selectedElder.emergency_contact}
                      </div>
                    </div>
                    
                    <Button className="w-full gap-2">
                      <Phone size={16} />
                      Contact Family
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="hadith" size="medium" />
          <IslamicEducationFiller type="quote" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}