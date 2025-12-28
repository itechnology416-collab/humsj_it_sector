import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HandHeart, 
  Users, 
  DollarSign,
  Home,
  Utensils,
  GraduationCap,
  Briefcase,
  Heart,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface SupportRequest {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'housing' | 'food' | 'education' | 'employment' | 'medical' | 'emotional' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requester: {
    id: string;
    name: string;
    contact: string;
    location: string;
    family_size: number;
  };
  amount_needed?: number;
  amount_raised?: number;
  deadline?: string;
  status: 'open' | 'in_progress' | 'fulfilled' | 'closed';
  supporters: number;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_anonymous: boolean;
}

interface CommunityResource {
  id: string;
  name: string;
  description: string;
  category: 'food_bank' | 'shelter' | 'counseling' | 'education' | 'employment' | 'healthcare' | 'legal' | 'financial';
  provider: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  };
  availability: string;
  eligibility: string[];
  cost: string;
  languages: string[];
  islamic_friendly: boolean;
  rating: number;
  reviews_count: number;
}

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: 'direct_service' | 'fundraising' | 'administrative' | 'skills_based' | 'event_support';
  time_commitment: string;
  location: string;
  requirements: string[];
  skills_needed: string[];
  contact_person: string;
  application_deadline?: string;
  volunteers_needed: number;
  volunteers_registered: number;
  is_ongoing: boolean;
}

const mockSupportRequests: SupportRequest[] = [
  {
    id: '1',
    title: 'Emergency Medical Treatment Fund',
    description: 'Sister Fatima needs urgent medical treatment for her daughter. The family cannot afford the medical expenses and is seeking community support.',
    category: 'medical',
    urgency: 'critical',
    requester: {
      id: 'user1',
      name: 'Sister Fatima A.',
      contact: '+251-911-123456',
      location: 'Harar, Ethiopia',
      family_size: 4
    },
    amount_needed: 15000,
    amount_raised: 8500,
    deadline: '2024-12-30T23:59:59Z',
    status: 'in_progress',
    supporters: 23,
    created_at: '2024-12-20T10:00:00Z',
    updated_at: '2024-12-24T09:30:00Z',
    is_verified: true,
    is_anonymous: false
  },
  {
    id: '2',
    title: 'University Tuition Assistance',
    description: 'Seeking support for university tuition fees. Excellent student from low-income family needs help to continue Islamic studies program.',
    category: 'education',
    urgency: 'medium',
    requester: {
      id: 'user2',
      name: 'Brother Omar Y.',
      contact: '+251-911-789012',
      location: 'Addis Ababa, Ethiopia',
      family_size: 6
    },
    amount_needed: 25000,
    amount_raised: 12000,
    deadline: '2025-01-15T23:59:59Z',
    status: 'open',
    supporters: 18,
    created_at: '2024-12-18T14:30:00Z',
    updated_at: '2024-12-23T16:20:00Z',
    is_verified: true,
    is_anonymous: false
  }
];

const communityResources: CommunityResource[] = [
  {
    id: '1',
    name: 'Islamic Community Food Bank',
    description: 'Provides halal food packages for families in need. Weekly distribution of groceries and fresh produce.',
    category: 'food_bank',
    provider: 'Haramaya Islamic Center',
    contact_info: {
      phone: '+251-911-555001',
      email: 'foodbank@haramayaislamic.org',
      address: 'Main Campus, Haramaya University',
      website: 'www.haramayaislamic.org/foodbank'
    },
    availability: 'Saturdays 9:00 AM - 12:00 PM',
    eligibility: ['Low income families', 'Students in financial need', 'Unemployed individuals'],
    cost: 'Free',
    languages: ['Arabic', 'Amharic', 'Oromo', 'English'],
    islamic_friendly: true,
    rating: 4.8,
    reviews_count: 156
  },
  {
    id: '2',
    name: 'Muslim Family Counseling Services',
    description: 'Professional counseling services following Islamic principles for individuals, couples, and families.',
    category: 'counseling',
    provider: 'Islamic Guidance Center',
    contact_info: {
      phone: '+251-911-555002',
      email: 'counseling@islamicguidance.et',
      address: 'Bole Road, Addis Ababa'
    },
    availability: 'Monday-Friday 8:00 AM - 6:00 PM',
    eligibility: ['All community members', 'Sliding scale fees available'],
    cost: 'Sliding scale based on income',
    languages: ['Arabic', 'Amharic', 'English'],
    islamic_friendly: true,
    rating: 4.9,
    reviews_count: 89
  }
];

const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: '1',
    title: 'Food Distribution Volunteer',
    description: 'Help distribute food packages to families in need every Saturday morning. Assist with sorting, packing, and distribution.',
    organization: 'Islamic Community Food Bank',
    category: 'direct_service',
    time_commitment: '4 hours per week',
    location: 'Haramaya University Campus',
    requirements: ['Background check', 'Commitment to regular schedule'],
    skills_needed: ['Physical ability to lift boxes', 'Good communication skills'],
    contact_person: 'Brother Ahmad Hassan',
    volunteers_needed: 10,
    volunteers_registered: 7,
    is_ongoing: true
  },
  {
    id: '2',
    title: 'Fundraising Event Coordinator',
    description: 'Organize and coordinate fundraising events for community support initiatives. Plan logistics, manage volunteers, and ensure successful execution.',
    organization: 'HUMSJ Community Support',
    category: 'fundraising',
    time_commitment: '10-15 hours per month',
    location: 'Various locations',
    requirements: ['Event planning experience', 'Strong organizational skills'],
    skills_needed: ['Project management', 'Communication', 'Leadership'],
    contact_person: 'Sister Khadija Mohamed',
    application_deadline: '2025-01-10T23:59:59Z',
    volunteers_needed: 3,
    volunteers_registered: 1,
    is_ongoing: false
  }
];

export default function CommunitySupport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(mockSupportRequests);
  const [resources, setResources] = useState<CommunityResource[]>(communityResources);
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(volunteerOpportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-500/20 text-green-600';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'high': return 'bg-orange-500/20 text-orange-600';
      case 'critical': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-600';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-600';
      case 'fulfilled': return 'bg-green-500/20 text-green-600';
      case 'closed': return 'bg-gray-500/20 text-gray-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'housing': return Home;
      case 'food': return Utensils;
      case 'education': return GraduationCap;
      case 'employment': return Briefcase;
      case 'medical': return Heart;
      case 'emotional': return Users;
      default: return HandHeart;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const calculateProgress = (raised: number, needed: number) => {
    return Math.min((raised / needed) * 100, 100);
  };

  return (
    <ProtectedPageLayout 
      title="Community Support" 
      subtitle="Supporting our Muslim community through mutual aid and resources"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <HandHeart size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Community Support Network</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Strengthening our ummah through mutual support and care
                </p>
              </div>
              <Button onClick={() => setShowNewRequestForm(true)} className="gap-2">
                <Plus size={16} />
                Request Support
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <HandHeart size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{supportRequests.length} Requests</p>
                <p className="text-xs text-muted-foreground">Active support needs</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">150+ Supporters</p>
                <p className="text-xs text-muted-foreground">Community helpers</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">$50K+ Raised</p>
                <p className="text-xs text-muted-foreground">Total community aid</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">25 Fulfilled</p>
                <p className="text-xs text-muted-foreground">Successful cases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Islamic Values Notice */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Heart size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  Islamic Principles of Community Support
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  "The believers in their mutual kindness, compassion, and sympathy are just one body; 
                  if a limb suffers, the whole body responds to it with wakefulness and fever." - Prophet Muhammad (PBUH)
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Mutual Aid</Badge>
                  <Badge variant="outline" className="text-xs">Brotherhood/Sisterhood</Badge>
                  <Badge variant="outline" className="text-xs">Charity (Sadaqah)</Badge>
                  <Badge variant="outline" className="text-xs">Community Care</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Support Requests</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search support requests..."
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
                      <option value="all">All Categories</option>
                      <option value="financial">Financial</option>
                      <option value="medical">Medical</option>
                      <option value="education">Education</option>
                      <option value="housing">Housing</option>
                      <option value="food">Food</option>
                      <option value="employment">Employment</option>
                    </select>
                    
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Requests */}
            <div className="space-y-4">
              {supportRequests.map((request, index) => {
                const CategoryIcon = getCategoryIcon(request.category);
                const progress = request.amount_needed && request.amount_raised 
                  ? calculateProgress(request.amount_raised, request.amount_needed)
                  : 0;
                
                return (
                  <Card 
                    key={request.id}
                    className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <CategoryIcon size={20} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{request.title}</h4>
                              {request.is_verified && (
                                <CheckCircle size={16} className="text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {request.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className={getUrgencyColor(request.urgency)}>
                                {request.urgency}
                              </Badge>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {request.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(request.created_at)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress Bar for Financial Requests */}
                        {request.amount_needed && request.amount_raised !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Raised: ${request.amount_raised?.toLocaleString()}</span>
                              <span>Goal: ${request.amount_needed.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Request Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span>{request.requester.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-muted-foreground" />
                            <span>Family of {request.requester.family_size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart size={14} className="text-muted-foreground" />
                            <span>{request.supporters} supporters</span>
                          </div>
                          {request.deadline && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-muted-foreground" />
                              <span>Due: {new Date(request.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="gap-2">
                              <DollarSign size={14} />
                              Support
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Share2 size={14} />
                              Share
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={resource.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">{resource.provider}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.islamic_friendly && (
                          <Badge className="bg-green-500/20 text-green-600 text-xs">
                            Islamic Friendly
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Availability:</span>
                          <p className="text-muted-foreground">{resource.availability}</p>
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span>
                          <p className="text-muted-foreground">{resource.cost}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-sm">Languages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.languages.map((lang, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone size={12} />
                          {resource.contact_info.phone}
                        </div>
                        <Button size="sm" variant="outline">
                          Contact Resource
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="volunteer" className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <Card key={opportunity.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity.organization}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {opportunity.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>{opportunity.time_commitment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-muted-foreground" />
                        <span>{opportunity.volunteers_registered}/{opportunity.volunteers_needed} volunteers</span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Skills Needed:</h5>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.skills_needed.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Contact: {opportunity.contact_person}
                      </div>
                      <Button size="sm" className="gap-2">
                        <CheckCircle size={14} />
                        Apply to Volunteer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="donate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your donations help support community members in need. All donations are processed securely and 
                  distributed according to Islamic principles of charity.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <DollarSign size={32} className="mx-auto text-green-600 mb-2" />
                    <h4 className="font-semibold">General Fund</h4>
                    <p className="text-sm text-muted-foreground">Support various community needs</p>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <Heart size={32} className="mx-auto text-red-600 mb-2" />
                    <h4 className="font-semibold">Emergency Fund</h4>
                    <p className="text-sm text-muted-foreground">Critical and urgent cases</p>
                  </Card>
                  
                  <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <GraduationCap size={32} className="mx-auto text-blue-600 mb-2" />
                    <h4 className="font-semibold">Education Fund</h4>
                    <p className="text-sm text-muted-foreground">Support student tuition and books</p>
                  </Card>
                </div>
                
                <Button className="w-full gap-2" size="lg">
                  <DollarSign size={16} />
                  Make a Donation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{selectedRequest.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getUrgencyColor(selectedRequest.urgency)}>
                        {selectedRequest.urgency}
                      </Badge>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.replace('_', ' ')}
                      </Badge>
                      {selectedRequest.is_verified && (
                        <Badge className="bg-green-500/20 text-green-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedRequest.description}
                </p>
                
                {selectedRequest.amount_needed && selectedRequest.amount_raised !== undefined && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Funding Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Raised: ${selectedRequest.amount_raised.toLocaleString()}</span>
                        <span>Goal: ${selectedRequest.amount_needed.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(selectedRequest.amount_raised, selectedRequest.amount_needed)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Requester Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-muted-foreground" />
                      <span>{selectedRequest.requester.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span>{selectedRequest.requester.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home size={14} className="text-muted-foreground" />
                      <span>Family of {selectedRequest.requester.family_size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 gap-2">
                    <DollarSign size={16} />
                    Support This Request
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle size={16} />
                    Contact
                  </Button>
                </div>
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