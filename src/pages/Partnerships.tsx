import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Handshake, 
  Plus, 
  Building,
  Globe,
  Users,
  Calendar,
  Award,
  Star,
  CheckCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Download,
  FileText,
  TrendingUp,
  Target,
  Heart,
  Zap,
  Shield,
  Briefcase,
  DollarSign,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  type: "corporate" | "ngo" | "government" | "educational" | "religious";
  category: string;
  description: string;
  logo_url?: string;
  website: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  partnership_type: "sponsor" | "collaborator" | "donor" | "service_provider";
  partnership_level: "platinum" | "gold" | "silver" | "bronze" | "partner";
  start_date: string;
  status: "active" | "pending" | "expired" | "terminated";
  contributions: string[];
  projects: string[];
  mou_signed: boolean;
  mou_expiry?: string;
  created_at: string;
}

interface SponsorshipPackage {
  id: string;
  name: string;
  level: "platinum" | "gold" | "silver" | "bronze";
  price: number;
  duration: string;
  benefits: string[];
  description: string;
  max_sponsors: number;
  current_sponsors: number;
  color: string;
}

const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Islamic Development Bank",
    type: "government",
    category: "Financial Institution",
    description: "Leading Islamic financial institution supporting education and development projects",
    website: "https://isdb.org",
    contact_person: "Dr. Ahmed Al-Rashid",
    contact_email: "partnerships@isdb.org",
    contact_phone: "+966-12-636-1400",
    partnership_type: "sponsor",
    partnership_level: "platinum",
    start_date: "2023-01-15",
    status: "active",
    contributions: ["$50,000 annual funding", "Scholarship programs", "Infrastructure support"],
    projects: ["Masjid Renovation", "Student Emergency Fund", "IT Equipment Upgrade"],
    mou_signed: true,
    mou_expiry: "2025-01-15",
    created_at: "2023-01-15"
  },
  {
    id: "2",
    name: "Muslim World League",
    type: "religious",
    category: "Islamic Organization",
    description: "Global Islamic organization promoting Islamic values and education",
    website: "https://themwl.org",
    contact_person: "Sheikh Mohammed Al-Issa",
    contact_email: "info@themwl.org",
    partnership_type: "collaborator",
    partnership_level: "gold",
    start_date: "2023-03-20",
    status: "active",
    contributions: ["Educational resources", "Speaker programs", "Islamic literature"],
    projects: ["Da'wa Programs", "Islamic Education", "Community Outreach"],
    mou_signed: true,
    mou_expiry: "2024-12-31",
    created_at: "2023-03-20"
  },
  {
    id: "3",
    name: "Ethiopian Islamic Affairs Supreme Council",
    type: "government",
    category: "Religious Authority",
    description: "National Islamic authority supporting Muslim communities in Ethiopia",
    website: "https://eiasc.gov.et",
    contact_person: "Sheikh Haji Omar Idris",
    contact_email: "info@eiasc.gov.et",
    partnership_type: "collaborator",
    partnership_level: "gold",
    start_date: "2022-09-10",
    status: "active",
    contributions: ["Religious guidance", "Event support", "Community programs"],
    projects: ["Ramadan Programs", "Islamic Calendar Events", "Community Service"],
    mou_signed: true,
    mou_expiry: "2024-09-10",
    created_at: "2022-09-10"
  },
  {
    id: "4",
    name: "Haramaya University",
    type: "educational",
    category: "Higher Education",
    description: "Host university providing facilities and academic support",
    website: "https://haramaya.edu.et",
    contact_person: "Dr. Jemal Abafita",
    contact_email: "president@haramaya.edu.et",
    partnership_type: "service_provider",
    partnership_level: "platinum",
    start_date: "2018-01-01",
    status: "active",
    contributions: ["Facilities", "Academic support", "Administrative backing"],
    projects: ["All HUMSJ Activities", "Student Services", "Academic Programs"],
    mou_signed: true,
    created_at: "2018-01-01"
  },
  {
    id: "5",
    name: "Islamic Society of North America",
    type: "ngo",
    category: "Islamic Organization",
    description: "Leading Islamic organization in North America supporting global Muslim communities",
    website: "https://isna.net",
    contact_person: "Dr. Mohamed Magid",
    contact_email: "partnerships@isna.net",
    partnership_type: "donor",
    partnership_level: "silver",
    start_date: "2023-06-15",
    status: "active",
    contributions: ["Financial support", "Educational materials", "Training programs"],
    projects: ["Leadership Training", "Educational Resources", "Community Development"],
    mou_signed: false,
    created_at: "2023-06-15"
  },
  {
    id: "6",
    name: "Al-Azhar University",
    type: "educational",
    category: "Islamic Education",
    description: "Prestigious Islamic university providing educational resources and expertise",
    website: "https://azhar.edu.eg",
    contact_person: "Dr. Ahmed Al-Tayeb",
    contact_email: "international@azhar.edu.eg",
    partnership_type: "collaborator",
    partnership_level: "gold",
    start_date: "2023-08-01",
    status: "pending",
    contributions: ["Educational exchange", "Scholarly resources", "Academic collaboration"],
    projects: ["Islamic Studies Program", "Research Collaboration", "Student Exchange"],
    mou_signed: false,
    created_at: "2023-08-01"
  }
];

const sponsorshipPackages: SponsorshipPackage[] = [
  {
    id: "1",
    name: "Platinum Sponsor",
    level: "platinum",
    price: 50000,
    duration: "Annual",
    benefits: [
      "Logo on all major events and materials",
      "Dedicated partnership announcement",
      "Priority access to student talent",
      "Quarterly partnership meetings",
      "Custom collaboration opportunities",
      "Recognition in annual report",
      "Social media promotion",
      "Naming rights opportunities"
    ],
    description: "Premier partnership level with maximum visibility and collaboration opportunities",
    max_sponsors: 3,
    current_sponsors: 1,
    color: "from-gray-400 to-gray-600"
  },
  {
    id: "2",
    name: "Gold Sponsor",
    level: "gold",
    price: 25000,
    duration: "Annual",
    benefits: [
      "Logo on major events",
      "Partnership announcement",
      "Access to student network",
      "Bi-annual meetings",
      "Collaboration opportunities",
      "Annual report recognition",
      "Social media mentions"
    ],
    description: "Premium partnership with significant visibility and engagement",
    max_sponsors: 5,
    current_sponsors: 2,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: "3",
    name: "Silver Sponsor",
    level: "silver",
    price: 15000,
    duration: "Annual",
    benefits: [
      "Logo on select events",
      "Partnership listing",
      "Student networking access",
      "Annual meeting",
      "Project collaboration",
      "Website recognition"
    ],
    description: "Solid partnership with good visibility and networking opportunities",
    max_sponsors: 8,
    current_sponsors: 3,
    color: "from-gray-300 to-gray-500"
  },
  {
    id: "4",
    name: "Bronze Sponsor",
    level: "bronze",
    price: 8000,
    duration: "Annual",
    benefits: [
      "Logo on materials",
      "Partnership listing",
      "Networking opportunities",
      "Project updates",
      "Website mention"
    ],
    description: "Entry-level partnership with basic recognition and networking",
    max_sponsors: 12,
    current_sponsors: 5,
    color: "from-orange-400 to-orange-600"
  }
];

const partnerTypes = ["All Types", "Corporate", "NGO", "Government", "Educational", "Religious"];
const partnershipLevels = ["all", "platinum", "gold", "silver", "bronze", "partner"];

export default function PartnershipsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"partners" | "sponsorship" | "apply" | "mou">("partners");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    organization_name: "",
    organization_type: "corporate",
    contact_person: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    partnership_type: "sponsor",
    proposed_contribution: "",
    areas_of_interest: "",
    message: ""
  });

  const filteredPartners = mockPartners.filter(partner => {
    const matchesType = selectedType === "All Types" || partner.type === selectedType.toLowerCase();
    const matchesLevel = selectedLevel === "all" || partner.partnership_level === selectedLevel;
    return matchesType && matchesLevel;
  });

  const handleSubmitApplication = async () => {
    if (!applicationForm.organization_name || !applicationForm.contact_person || !applicationForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Partnership application submitted successfully!");
      setIsApplicationModalOpen(false);
      setApplicationForm({
        organization_name: "",
        organization_type: "corporate",
        contact_person: "",
        email: "",
        phone: "",
        website: "",
        description: "",
        partnership_type: "sponsor",
        proposed_contribution: "",
        areas_of_interest: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    totalPartners: mockPartners.length,
    activePartners: mockPartners.filter(p => p.status === "active").length,
    totalSponsors: mockPartners.filter(p => p.partnership_type === "sponsor").length,
    mouSigned: mockPartners.filter(p => p.mou_signed).length
  };

  return (
    <PageLayout 
      title="Partnerships & Sponsorship" 
      subtitle="Building strategic partnerships for community growth"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Handshake size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPartners}</p>
                <p className="text-xs text-muted-foreground">Total Partners</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activePartners}</p>
                <p className="text-xs text-muted-foreground">Active Partners</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSponsors}</p>
                <p className="text-xs text-muted-foreground">Sponsors</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <FileText size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.mouSigned}</p>
                <p className="text-xs text-muted-foreground">MoUs Signed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: "partners", label: "Our Partners", icon: Building },
            { id: "sponsorship", label: "Sponsorship Packages", icon: Award },
            { id: "apply", label: "Partnership Application", icon: Plus },
            { id: "mou", label: "MoU Documents", icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-red"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Our Partners Tab */}
        {activeTab === "partners" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
                >
                  {partnerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  {partnershipLevels.slice(1).map(level => (
                    <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                  ))}
                </select>
              </div>
              {isAdmin && (
                <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Plus size={18} />
                  Add Partner
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPartners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} delay={index * 100} />
              ))}
            </div>
          </div>
        )}

        {/* Sponsorship Packages Tab */}
        {activeTab === "sponsorship" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Sponsorship <span className="text-primary">Packages</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Partner with us to support Islamic education and community development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sponsorshipPackages.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-4`}>
                    <Award size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-primary mb-2">${pkg.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.duration}</p>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{pkg.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {pkg.benefits.slice(0, 4).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                    {pkg.benefits.length > 4 && (
                      <p className="text-xs text-muted-foreground">+{pkg.benefits.length - 4} more benefits</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Availability</span>
                      <span>{pkg.current_sponsors}/{pkg.max_sponsors}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(pkg.current_sponsors / pkg.max_sponsors) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 shadow-red"
                    disabled={pkg.current_sponsors >= pkg.max_sponsors}
                  >
                    {pkg.current_sponsors >= pkg.max_sponsors ? "Fully Booked" : "Apply Now"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partnership Application Tab */}
        {activeTab === "apply" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Partnership <span className="text-primary">Application</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join us in building a stronger Islamic community through strategic partnerships
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-xl p-8 border border-border/30">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organization_name">Organization Name *</Label>
                      <Input
                        id="organization_name"
                        value={applicationForm.organization_name}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, organization_name: e.target.value }))}
                        placeholder="Your organization name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization_type">Organization Type *</Label>
                      <Select value={applicationForm.organization_type} onValueChange={(value) => setApplicationForm(prev => ({ ...prev, organization_type: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="ngo">NGO</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="religious">Religious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_person">Contact Person *</Label>
                      <Input
                        id="contact_person"
                        value={applicationForm.contact_person}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, contact_person: e.target.value }))}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="contact@organization.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1-234-567-8900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={applicationForm.website}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://organization.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Organization Description *</Label>
                    <Textarea
                      id="description"
                      value={applicationForm.description}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your organization and its mission..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="partnership_type">Partnership Type</Label>
                      <Select value={applicationForm.partnership_type} onValueChange={(value) => setApplicationForm(prev => ({ ...prev, partnership_type: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sponsor">Sponsor</SelectItem>
                          <SelectItem value="collaborator">Collaborator</SelectItem>
                          <SelectItem value="donor">Donor</SelectItem>
                          <SelectItem value="service_provider">Service Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="proposed_contribution">Proposed Contribution</Label>
                      <Input
                        id="proposed_contribution"
                        value={applicationForm.proposed_contribution}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, proposed_contribution: e.target.value }))}
                        placeholder="Financial, services, resources, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="areas_of_interest">Areas of Interest</Label>
                    <Input
                      id="areas_of_interest"
                      value={applicationForm.areas_of_interest}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, areas_of_interest: e.target.value }))}
                      placeholder="Education, Technology, Community Service, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={applicationForm.message}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Any additional information or specific partnership ideas..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleSubmitApplication} 
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MoU Documents Tab */}
        {activeTab === "mou" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                MoU <span className="text-primary">Documents</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Memorandums of Understanding and partnership agreements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPartners.filter(p => p.mou_signed).map((partner, index) => (
                <div 
                  key={partner.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText size={24} className="text-primary" />
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">{partner.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Signed:</span>
                      <span>{new Date(partner.start_date).toLocaleDateString()}</span>
                    </div>
                    {partner.mou_expiry && (
                      <div className="flex justify-between text-sm">
                        <span>Expires:</span>
                        <span>{new Date(partner.mou_expiry).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        partner.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                      )}>
                        {partner.status}
                      </span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full border-border/50 hover:border-primary gap-2">
                    <Download size={14} />
                    Download MoU
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function PartnerCard({ partner, delay }: { partner: Partner; delay: number }) {
  const levelColors = {
    platinum: "from-gray-400 to-gray-600",
    gold: "from-yellow-400 to-yellow-600", 
    silver: "from-gray-300 to-gray-500",
    bronze: "from-orange-400 to-orange-600",
    partner: "from-blue-400 to-blue-600"
  };

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${levelColors[partner.partnership_level]} flex items-center justify-center`}>
            <Building size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{partner.name}</h3>
            <p className="text-sm text-primary">{partner.category}</p>
            <p className="text-xs text-muted-foreground capitalize">{partner.type} • {partner.partnership_type}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium capitalize",
            levelColors[partner.partnership_level] ? `bg-gradient-to-r ${levelColors[partner.partnership_level]} text-white` : "bg-primary/20 text-primary"
          )}>
            {partner.partnership_level}
          </span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            partner.status === "active" ? "bg-green-500/20 text-green-400" :
            partner.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
            "bg-gray-500/20 text-gray-400"
          )}>
            {partner.status}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{partner.description}</p>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm font-medium mb-2">Key Contributions:</p>
          <div className="space-y-1">
            {partner.contributions.slice(0, 3).map((contribution, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle size={12} className="text-primary flex-shrink-0" />
                {contribution}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Active Projects:</p>
          <div className="flex flex-wrap gap-1">
            {partner.projects.slice(0, 3).map(project => (
              <span key={project} className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded">
                {project}
              </span>
            ))}
            {partner.projects.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                +{partner.projects.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            Since {new Date(partner.start_date).getFullYear()}
          </span>
          {partner.mou_signed && (
            <span className="flex items-center gap-1">
              <FileText size={14} />
              MoU Signed
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <ExternalLink size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Mail size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}