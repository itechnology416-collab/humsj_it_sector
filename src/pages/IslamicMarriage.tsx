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
  BookOpen,
  MessageCircle,
  Calendar,
  Shield,
  Star,
  Lock,
  Eye,
  Search,
  Filter,
  UserCheck,
  Clock,
  MapPin,
  GraduationCap,
  Briefcase,
  Home,
  Phone,
  Mail,
  CheckCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface MarriageProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  education: string;
  profession: string;
  about: string;
  looking_for: string;
  religious_level: 'practicing' | 'moderate' | 'learning';
  marital_status: 'never_married' | 'divorced' | 'widowed';
  has_children: boolean;
  wants_children: boolean;
  family_background: string;
  interests: string[];
  languages: string[];
  created_at: string;
  last_active: string;
  is_verified: boolean;
  privacy_level: 'public' | 'members_only' | 'private';
  contact_preferences: string[];
}

interface MarriageGuidance {
  id: string;
  title: string;
  category: 'preparation' | 'selection' | 'process' | 'rights' | 'counseling';
  content: string;
  source: string;
  tags: string[];
  helpful_count: number;
}

const mockProfiles: MarriageProfile[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Aisha M.',
    age: 24,
    gender: 'female',
    location: 'Harar, Ethiopia',
    education: 'Bachelor\'s in Computer Science',
    profession: 'Software Developer',
    about: 'Practicing Muslim seeking a righteous partner for marriage. I value Islamic principles and am looking for someone who shares similar values and goals in life.',
    looking_for: 'A practicing Muslim brother who is kind, responsible, and committed to Islamic values. Someone who wants to build a family based on Islamic principles.',
    religious_level: 'practicing',
    marital_status: 'never_married',
    has_children: false,
    wants_children: true,
    family_background: 'Religious family, father is an Imam, mother is a teacher',
    interests: ['Reading Quran', 'Islamic studies', 'Technology', 'Cooking', 'Community service'],
    languages: ['Arabic', 'Amharic', 'English'],
    created_at: '2024-12-20T10:00:00Z',
    last_active: '2024-12-24T09:30:00Z',
    is_verified: true,
    privacy_level: 'members_only',
    contact_preferences: ['Through family', 'Supervised meetings']
  },
  {
    id: '2',
    user_id: 'user2',
    name: 'Omar A.',
    age: 28,
    gender: 'male',
    location: 'Addis Ababa, Ethiopia',
    education: 'Master\'s in Islamic Studies',
    profession: 'Islamic Teacher',
    about: 'Alhamdulillah, I am a practicing Muslim seeking a righteous wife. I teach Islamic studies and am committed to living according to the Quran and Sunnah.',
    looking_for: 'A practicing Muslim sister who is committed to her deen, kind-hearted, and interested in building a family centered around Islamic values.',
    religious_level: 'practicing',
    marital_status: 'never_married',
    has_children: false,
    wants_children: true,
    family_background: 'Religious family, both parents are involved in Islamic education',
    interests: ['Quran memorization', 'Hadith studies', 'Community dawah', 'Sports', 'Reading'],
    languages: ['Arabic', 'Amharic', 'English', 'Oromo'],
    created_at: '2024-12-18T14:30:00Z',
    last_active: '2024-12-24T08:15:00Z',
    is_verified: true,
    privacy_level: 'members_only',
    contact_preferences: ['Through wali', 'Family introduction']
  }
];

const marriageGuidance: MarriageGuidance[] = [
  {
    id: '1',
    title: 'Qualities to Look for in a Spouse',
    category: 'selection',
    content: 'The Prophet (PBUH) said: "A woman is married for four things: her wealth, her family status, her beauty, and her religion. So you should marry the religious woman (otherwise) you will be a loser." This applies to both men and women - prioritize religious commitment, good character, and compatibility.',
    source: 'Sahih Bukhari',
    tags: ['spouse-selection', 'hadith', 'qualities', 'religion'],
    helpful_count: 45
  },
  {
    id: '2',
    title: 'The Role of Wali in Marriage',
    category: 'process',
    content: 'In Islam, the wali (guardian) plays a crucial role in marriage, especially for women. The wali helps ensure the marriage is conducted properly, protects the interests of both parties, and provides guidance throughout the process.',
    source: 'Islamic Jurisprudence',
    tags: ['wali', 'guardian', 'marriage-process', 'protection'],
    helpful_count: 38
  },
  {
    id: '3',
    title: 'Preparing for Marriage',
    category: 'preparation',
    content: 'Marriage preparation in Islam includes spiritual, emotional, and practical readiness. This involves strengthening your relationship with Allah, developing good character, learning about marital rights and responsibilities, and preparing financially.',
    source: 'Islamic Marriage Guidelines',
    tags: ['preparation', 'spiritual-growth', 'responsibility', 'character'],
    helpful_count: 52
  }
];

export default function IslamicMarriage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profiles, setProfiles] = useState<MarriageProfile[]>(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedEducation, setSelectedEducation] = useState('all');
  const [selectedReligiousLevel, setSelectedReligiousLevel] = useState('all');
  const [showGuidance, setShowGuidance] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MarriageProfile | null>(null);

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchQuery || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAge = profile.age >= ageRange.min && profile.age <= ageRange.max;
    const matchesLocation = selectedLocation === 'all' || profile.location.includes(selectedLocation);
    const matchesEducation = selectedEducation === 'all' || profile.education.toLowerCase().includes(selectedEducation.toLowerCase());
    const matchesReligious = selectedReligiousLevel === 'all' || profile.religious_level === selectedReligiousLevel;
    
    return matchesSearch && matchesAge && matchesLocation && matchesEducation && matchesReligious;
  });

  const getReligiousLevelColor = (level: string) => {
    switch (level) {
      case 'practicing': return 'bg-green-500/20 text-green-600';
      case 'moderate': return 'bg-blue-500/20 text-blue-600';
      case 'learning': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `Active ${diffInHours}h ago`;
    return `Active ${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Marriage" 
      subtitle="Find your righteous partner through Islamic principles and guidance"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200 dark:border-rose-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display">Islamic Marriage Platform</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Find your life partner through Islamic principles and community support
                </p>
              </div>
              <Button onClick={() => setShowGuidance(true)} variant="outline" className="gap-2">
                <BookOpen size={16} />
                Marriage Guidance
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto">
                  <Users size={20} className="text-rose-600" />
                </div>
                <p className="text-sm font-medium">{profiles.length} Profiles</p>
                <p className="text-xs text-muted-foreground">Verified members</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Shield size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">Islamic Values</p>
                <p className="text-xs text-muted-foreground">Principled approach</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <UserCheck size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-xs text-muted-foreground">Authentic profiles</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <MessageCircle size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Guided Process</p>
                <p className="text-xs text-muted-foreground">Family involvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                  Islamic Marriage Guidelines
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This platform follows Islamic principles for marriage. All interactions should be conducted with proper Islamic etiquette, 
                  involving families and guardians (wali) as required. We encourage meetings in appropriate settings with family supervision.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Family Involvement Required</Badge>
                  <Badge variant="outline" className="text-xs">Wali Supervision</Badge>
                  <Badge variant="outline" className="text-xs">Islamic Etiquette</Badge>
                  <Badge variant="outline" className="text-xs">Verified Profiles Only</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, profession, or interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11"
                  />
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Advanced Filters
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={ageRange.min}
                      onChange={(e) => setAgeRange({...ageRange, min: parseInt(e.target.value) || 18})}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={ageRange.max}
                      onChange={(e) => setAgeRange({...ageRange, max: parseInt(e.target.value) || 50})}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Harar">Harar</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Jimma">Jimma</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Education</label>
                  <select
                    value={selectedEducation}
                    onChange={(e) => setSelectedEducation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                  >
                    <option value="all">All Education</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Religious Level</label>
                  <select
                    value={selectedReligiousLevel}
                    onChange={(e) => setSelectedReligiousLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                  >
                    <option value="all">All Levels</option>
                    <option value="practicing">Practicing</option>
                    <option value="moderate">Moderate</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <Card 
              key={profile.id}
              className="hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProfile(profile)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-semibold">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {profile.name}
                        </h4>
                        {profile.is_verified && (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {profile.age} years old
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getReligiousLevelColor(profile.religious_level)}>
                      {profile.religious_level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {profile.gender}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap size={14} />
                      {profile.education}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase size={14} />
                      {profile.profession}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profile.about}
                  </p>
                  
                  {/* Interests */}
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.slice(0, 3).map((interest, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {profile.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {formatTimeAgo(profile.last_active)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Detail Modal */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-semibold">
                      {selectedProfile.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{selectedProfile.name}</h3>
                        {selectedProfile.is_verified && (
                          <CheckCircle size={20} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {selectedProfile.age} years old • {selectedProfile.location}
                      </p>
                      <Badge className={getReligiousLevelColor(selectedProfile.religious_level)}>
                        {selectedProfile.religious_level}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProfile(null)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="looking">Looking For</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">About Me</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedProfile.about}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Education</h5>
                        <p className="text-sm text-muted-foreground">{selectedProfile.education}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Profession</h5>
                        <p className="text-sm text-muted-foreground">{selectedProfile.profession}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Family Background</h5>
                      <p className="text-sm text-muted-foreground">{selectedProfile.family_background}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Interests</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Languages</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.languages.map((language, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="looking" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">What I'm Looking For</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedProfile.looking_for}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Marital Status</h5>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedProfile.marital_status.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Children</h5>
                        <p className="text-sm text-muted-foreground">
                          {selectedProfile.has_children ? 'Has children' : 'No children'} • 
                          {selectedProfile.wants_children ? ' Wants children' : ' Doesn\'t want children'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-3">
                        <Shield size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                            Islamic Contact Guidelines
                          </h5>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            All communication should follow Islamic etiquette. Family involvement and wali supervision are required.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Preferred Contact Methods</h5>
                      <div className="space-y-2">
                        {selectedProfile.contact_preferences.map((method, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle size={14} className="text-green-500" />
                            {method}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 gap-2">
                        <MessageCircle size={16} />
                        Contact Through Family
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Heart size={16} />
                        Express Interest
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Marriage Guidance Modal */}
        {showGuidance && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} />
                    Islamic Marriage Guidance
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGuidance(false)}
                  >
                    <X size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {marriageGuidance.map((guide, index) => (
                    <Card key={guide.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{guide.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {guide.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {guide.source}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart size={14} />
                            {guide.helpful_count}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {guide.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guide.tags.map((tag, tagIdx) => (
                            <Badge key={tagIdx} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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