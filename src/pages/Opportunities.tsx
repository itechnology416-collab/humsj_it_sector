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
  Briefcase, 
  Plus, 
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  ExternalLink,
  Building,
  GraduationCap,
  Code,
  Database,
  Smartphone,
  Globe,
  Shield,
  TrendingUp,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: "internship" | "job" | "freelance" | "volunteer";
  category: string;
  location: string;
  remote: boolean;
  duration: string;
  salary?: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  application_deadline: string;
  start_date: string;
  contact_email: string;
  contact_person?: string;
  company_website?: string;
  status: "active" | "closed" | "filled";
  posted_by: string;
  posted_at: string;
  applications_count: number;
  max_applications?: number;
}

const mockOpportunities: Opportunity[] = [
  {
    id: "OP-001",
    title: "Frontend Developer Intern",
    company: "TechCorp Ethiopia",
    type: "internship",
    category: "Web Development",
    location: "Addis Ababa",
    remote: false,
    duration: "3 months",
    salary: "$500/month",
    description: "Join our frontend team to work on modern web applications using React, TypeScript, and Tailwind CSS. You'll collaborate with senior developers and gain hands-on experience in agile development.",
    requirements: [
      "Currently enrolled in Computer Science or related field",
      "Basic knowledge of HTML, CSS, JavaScript",
      "Familiarity with React framework",
      "Good communication skills in English"
    ],
    skills_required: ["React", "JavaScript", "HTML", "CSS", "Git"],
    application_deadline: "2024-03-15",
    start_date: "2024-04-01",
    contact_email: "hr@techcorp.et",
    contact_person: "Sarah Ahmed",
    company_website: "https://techcorp.et",
    status: "active",
    posted_by: "HR Department",
    posted_at: "2024-02-15T10:00:00Z",
    applications_count: 12,
    max_applications: 20
  },
  {
    id: "OP-002",
    title: "Mobile App Developer",
    company: "Islamic Apps Studio",
    type: "job",
    category: "Mobile Development",
    location: "Remote",
    remote: true,
    duration: "Full-time",
    salary: "$1200-1800/month",
    description: "Develop Islamic mobile applications including Quran apps, prayer time calculators, and Islamic learning platforms. Work with a passionate team dedicated to serving the Muslim community.",
    requirements: [
      "Bachelor's degree in Computer Science",
      "2+ years experience in mobile development",
      "Experience with Flutter or React Native",
      "Understanding of Islamic principles and practices"
    ],
    skills_required: ["Flutter", "Dart", "Firebase", "REST APIs", "UI/UX"],
    application_deadline: "2024-03-20",
    start_date: "2024-04-15",
    contact_email: "careers@islamicapps.com",
    contact_person: "Ahmed Hassan",
    company_website: "https://islamicapps.com",
    status: "active",
    posted_by: "Tech Lead",
    posted_at: "2024-02-18T14:30:00Z",
    applications_count: 8,
    max_applications: 15
  },
  {
    id: "OP-003",
    title: "Data Science Research Assistant",
    company: "HUMSJ Research Center",
    type: "internship",
    category: "Data Science",
    location: "HUMSJ Campus",
    remote: false,
    duration: "6 months",
    description: "Assist in data analysis projects related to Islamic studies and social research. Work with large datasets and machine learning algorithms to extract meaningful insights.",
    requirements: [
      "Strong background in mathematics and statistics",
      "Experience with Python and data analysis libraries",
      "Interest in Islamic studies and social research",
      "Excellent analytical and problem-solving skills"
    ],
    skills_required: ["Python", "Pandas", "NumPy", "Scikit-learn", "Statistics"],
    application_deadline: "2024-03-10",
    start_date: "2024-03-25",
    contact_email: "research@humsj.edu.et",
    contact_person: "Dr. Fatima Ali",
    status: "active",
    posted_by: "Research Department",
    posted_at: "2024-02-20T09:15:00Z",
    applications_count: 5,
    max_applications: 10
  },
  {
    id: "OP-004",
    title: "Cybersecurity Volunteer Program",
    company: "Ethiopian Cyber Security Agency",
    type: "volunteer",
    category: "Cybersecurity",
    location: "Addis Ababa",
    remote: false,
    duration: "3 months",
    description: "Volunteer opportunity to contribute to national cybersecurity initiatives. Gain experience in threat analysis, security auditing, and incident response while serving your country.",
    requirements: [
      "Basic knowledge of cybersecurity principles",
      "Ethiopian citizenship required",
      "Commitment to volunteer for full duration",
      "Security clearance background check"
    ],
    skills_required: ["Network Security", "Ethical Hacking", "Risk Assessment", "Linux"],
    application_deadline: "2024-03-05",
    start_date: "2024-03-20",
    contact_email: "volunteer@ecsa.gov.et",
    contact_person: "Major Ibrahim Osman",
    company_website: "https://ecsa.gov.et",
    status: "active",
    posted_by: "Government Agency",
    posted_at: "2024-02-12T11:45:00Z",
    applications_count: 15,
    max_applications: 25
  }
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Cybersecurity",
  "AI/ML",
  "DevOps",
  "UI/UX Design",
  "Database",
  "Network Administration",
  "Project Management"
];

const types = ["all", "internship", "job", "freelance", "volunteer"];

const typeConfig = {
  internship: { label: "Internship", color: "bg-blue-500/20 text-blue-400", icon: GraduationCap },
  job: { label: "Full-time Job", color: "bg-green-500/20 text-green-400", icon: Briefcase },
  freelance: { label: "Freelance", color: "bg-purple-500/20 text-purple-400", icon: Code },
  volunteer: { label: "Volunteer", color: "bg-orange-500/20 text-orange-400", icon: Users }
};

const statusConfig = {
  active: { label: "Active", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-gray-500/20 text-gray-400", icon: Clock },
  filled: { label: "Filled", color: "bg-blue-500/20 text-blue-400", icon: Users }
};

const categoryIcons: Record<string, React.ElementType> = {
  "Web Development": Globe,
  "Mobile Development": Smartphone,
  "Data Science": Database,
  "Cybersecurity": Shield,
  "AI/ML": TrendingUp,
  "DevOps": Code,
  "UI/UX Design": Star,
  "Database": Database,
  "Network Administration": Globe,
  "Project Management": Briefcase
};

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    company: "",
    type: "internship" as Opportunity["type"],
    category: "",
    location: "",
    remote: false,
    duration: "",
    salary: "",
    description: "",
    requirements: "",
    skills_required: "",
    application_deadline: "",
    start_date: "",
    contact_email: "",
    contact_person: "",
    company_website: ""
  });

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesCategory = selectedCategory === "All Categories" || opp.category === selectedCategory;
    const matchesType = selectedType === "all" || opp.type === selectedType;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const handleCreateOpportunity = async () => {
    if (!newOpportunity.title || !newOpportunity.company || !newOpportunity.category || !newOpportunity.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const opportunity: Opportunity = {
        id: `OP-${String(opportunities.length + 1).padStart(3, '0')}`,
        title: newOpportunity.title,
        company: newOpportunity.company,
        type: newOpportunity.type,
        category: newOpportunity.category,
        location: newOpportunity.location,
        remote: newOpportunity.remote,
        duration: newOpportunity.duration,
        salary: newOpportunity.salary || undefined,
        description: newOpportunity.description,
        requirements: newOpportunity.requirements.split('\n').filter(r => r.trim()),
        skills_required: newOpportunity.skills_required.split(',').map(s => s.trim()).filter(s => s),
        application_deadline: newOpportunity.application_deadline,
        start_date: newOpportunity.start_date,
        contact_email: newOpportunity.contact_email,
        contact_person: newOpportunity.contact_person || undefined,
        company_website: newOpportunity.company_website || undefined,
        status: "active",
        posted_by: user?.email || "Unknown",
        posted_at: new Date().toISOString(),
        applications_count: 0
      };

      setOpportunities([opportunity, ...opportunities]);
      toast.success("Opportunity posted successfully!");
      
      setNewOpportunity({
        title: "",
        company: "",
        type: "internship",
        category: "",
        location: "",
        remote: false,
        duration: "",
        salary: "",
        description: "",
        requirements: "",
        skills_required: "",
        application_deadline: "",
        start_date: "",
        contact_email: "",
        contact_person: "",
        company_website: ""
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to post opportunity");
    } finally {
      setIsCreating(false);
    }
  };

  const stats = {
    total: opportunities.length,
    internships: opportunities.filter(o => o.type === "internship").length,
    jobs: opportunities.filter(o => o.type === "job").length,
    active: opportunities.filter(o => o.status === "active").length,
    totalApplications: opportunities.reduce((acc, o) => acc + o.applications_count, 0)
  };

  return (
    <PageLayout 
      title="Internships & Opportunities" 
      subtitle="Discover career opportunities and internships"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Opportunities</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.internships}</p>
                <p className="text-xs text-muted-foreground">Internships</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Briefcase size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.jobs}</p>
                <p className="text-xs text-muted-foreground">Full-time Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <CheckCircle size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              {types.slice(1).map(type => (
                <option key={type} value={type}>
                  {typeConfig[type as keyof typeof typeConfig].label}
                </option>
              ))}
            </select>
          </div>

          {(isAdmin || user) && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Plus size={18} />
                  Post Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post New Opportunity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Frontend Developer Intern"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={newOpportunity.company}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="TechCorp Ethiopia"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select value={newOpportunity.type} onValueChange={(value: Opportunity["type"]) => setNewOpportunity(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="job">Full-time Job</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                          <SelectItem value="volunteer">Volunteer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newOpportunity.category} onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newOpportunity.duration}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="3 months"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newOpportunity.location}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Addis Ababa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        value={newOpportunity.salary}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, salary: e.target.value }))}
                        placeholder="$500/month"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="remote"
                        checked={newOpportunity.remote}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, remote: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <Label htmlFor="remote">Remote Work</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed job description..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={newOpportunity.requirements}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Bachelor's degree in Computer Science&#10;2+ years experience&#10;Strong communication skills"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="skills_required">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills_required"
                      value={newOpportunity.skills_required}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, skills_required: e.target.value }))}
                      placeholder="React, JavaScript, HTML, CSS, Git"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="application_deadline">Application Deadline</Label>
                      <Input
                        id="application_deadline"
                        type="date"
                        value={newOpportunity.application_deadline}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, application_deadline: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newOpportunity.start_date}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={newOpportunity.contact_email}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, contact_email: e.target.value }))}
                        placeholder="hr@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_person">Contact Person</Label>
                      <Input
                        id="contact_person"
                        value={newOpportunity.contact_person}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, contact_person: e.target.value }))}
                        placeholder="Sarah Ahmed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_website">Company Website</Label>
                      <Input
                        id="company_website"
                        value={newOpportunity.company_website}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, company_website: e.target.value }))}
                        placeholder="https://company.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleCreateOpportunity} 
                      disabled={isCreating}
                      className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Post Opportunity
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Opportunities List */}
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity, index) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} delay={index * 100} />
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Briefcase size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-display mb-2">No Opportunities Found</h3>
            <p className="text-muted-foreground">No opportunities match your current filters.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function OpportunityCard({ opportunity, delay }: { opportunity: Opportunity; delay: number }) {
  const type = typeConfig[opportunity.type];
  const status = statusConfig[opportunity.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;
  const CategoryIcon = categoryIcons[opportunity.category] || Briefcase;

  const daysUntilDeadline = opportunity.application_deadline ? 
    Math.ceil((new Date(opportunity.application_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CategoryIcon size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{opportunity.title}</h3>
              <span className="text-sm text-muted-foreground">at</span>
              <span className="text-lg font-medium text-primary">{opportunity.company}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{opportunity.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {opportunity.location}
                {opportunity.remote && <span className="text-green-400">(Remote)</span>}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {opportunity.duration}
              </span>
              {opportunity.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign size={14} />
                  {opportunity.salary}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {opportunity.skills_required.slice(0, 5).map(skill => (
                <span key={skill} className="text-xs px-2 py-1 bg-secondary/50 text-secondary rounded">
                  {skill}
                </span>
              ))}
              {opportunity.skills_required.length > 5 && (
                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                  +{opportunity.skills_required.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", type.color)}>
            <TypeIcon size={12} />
            {type.label}
          </span>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", status.color)}>
            <StatusIcon size={12} />
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {opportunity.applications_count} applications
          </span>
          {daysUntilDeadline !== null && (
            <span className={cn(
              "flex items-center gap-1",
              daysUntilDeadline <= 3 ? "text-red-400" : daysUntilDeadline <= 7 ? "text-yellow-400" : ""
            )}>
              <Calendar size={14} />
              {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Deadline passed"}
            </span>
          )}
          {opportunity.contact_person && (
            <span className="flex items-center gap-1">
              <User size={14} />
              {opportunity.contact_person}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {opportunity.company_website && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ExternalLink size={16} />
            </Button>
          )}
          <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-red">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}