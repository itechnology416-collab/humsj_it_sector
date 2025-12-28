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
  Heart, 
  Plus, 
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Download,
  CreditCard,
  Smartphone,
  Building,
  Gift,
  Star,
  CheckCircle,
  Clock,
  Award,
  PieChart,
  BarChart3,
  FileText,
  Shield,
  Zap,
  Globe,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  raised_amount: number;
  donor_count: number;
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "paused";
  image_url?: string;
  organizer: string;
  created_at: string;
}

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  campaign_id: string;
  campaign_title: string;
  donation_type: "one_time" | "monthly" | "zakat" | "sadaqah";
  payment_method: "card" | "bank" | "mobile" | "cash";
  is_anonymous: boolean;
  message?: string;
  created_at: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Masjid Renovation Project",
    description: "Renovating and expanding our campus masjid to accommodate growing community needs",
    category: "Infrastructure",
    goal_amount: 50000,
    raised_amount: 32500,
    donor_count: 145,
    start_date: "2024-01-15",
    end_date: "2024-06-30",
    status: "active",
    organizer: "Finance Committee",
    created_at: "2024-01-15"
  },
  {
    id: "2",
    title: "Student Emergency Fund",
    description: "Supporting students facing financial hardships with emergency assistance",
    category: "Student Support",
    goal_amount: 25000,
    raised_amount: 18750,
    donor_count: 89,
    start_date: "2024-02-01",
    end_date: "2024-12-31",
    status: "active",
    organizer: "Social Affairs Committee",
    created_at: "2024-02-01"
  },
  {
    id: "3",
    title: "Ramadan Iftar Program",
    description: "Providing daily Iftar meals for students during the holy month of Ramadan",
    category: "Community Service",
    goal_amount: 15000,
    raised_amount: 15000,
    donor_count: 67,
    start_date: "2024-03-01",
    end_date: "2024-04-10",
    status: "completed",
    organizer: "Da'wa Committee",
    created_at: "2024-03-01"
  },
  {
    id: "4",
    title: "IT Equipment Upgrade",
    description: "Upgrading computer lab equipment and software for better learning experience",
    category: "Technology",
    goal_amount: 30000,
    raised_amount: 12000,
    donor_count: 34,
    start_date: "2024-02-15",
    end_date: "2024-08-15",
    status: "active",
    organizer: "Academic Sector",
    created_at: "2024-02-15"
  }
];

const mockDonations: Donation[] = [
  {
    id: "1",
    donor_name: "Ahmed Hassan",
    amount: 500,
    campaign_id: "1",
    campaign_title: "Masjid Renovation Project",
    donation_type: "one_time",
    payment_method: "card",
    is_anonymous: false,
    message: "May Allah bless this project and our community",
    created_at: "2024-02-20T10:30:00Z"
  },
  {
    id: "2",
    donor_name: "Anonymous Donor",
    amount: 1000,
    campaign_id: "2",
    campaign_title: "Student Emergency Fund",
    donation_type: "monthly",
    payment_method: "bank",
    is_anonymous: true,
    created_at: "2024-02-19T15:45:00Z"
  },
  {
    id: "3",
    donor_name: "Fatima Ali",
    amount: 250,
    campaign_id: "3",
    campaign_title: "Ramadan Iftar Program",
    donation_type: "sadaqah",
    payment_method: "mobile",
    is_anonymous: false,
    message: "For the sake of Allah",
    created_at: "2024-02-18T09:15:00Z"
  }
];

const categories = ["All Categories", "Infrastructure", "Student Support", "Community Service", "Technology", "Education", "Emergency"];

const donationTypes = [
  { value: "one_time", label: "One-time Donation", icon: "💰" },
  { value: "monthly", label: "Monthly Donation", icon: "📅" },
  { value: "zakat", label: "Zakat", icon: "🕌" },
  { value: "sadaqah", label: "Sadaqah", icon: "❤️" }
];

const paymentMethods = [
  { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "bank", label: "Bank Transfer", icon: Building },
  { value: "mobile", label: "Mobile Payment", icon: Smartphone },
  { value: "cash", label: "Cash", icon: DollarSign }
];

export default function DonationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"campaigns" | "donate" | "history" | "reports">("campaigns");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationForm, setDonationForm] = useState({
    amount: "",
    donation_type: "one_time",
    payment_method: "card",
    is_anonymous: false,
    message: "",
    donor_name: "",
    email: "",
    phone: ""
  });

  const filteredCampaigns = mockCampaigns.filter(campaign => 
    selectedCategory === "All Categories" || campaign.category === selectedCategory
  );

  const handleDonate = async () => {
    if (!donationForm.amount || !selectedCampaign) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Donation processed successfully! Barakallahu feeki.");
      setIsDonateModalOpen(false);
      setDonationForm({
        amount: "",
        donation_type: "one_time",
        payment_method: "card",
        is_anonymous: false,
        message: "",
        donor_name: "",
        email: "",
        phone: ""
      });
    } catch (error) {
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateZakat = (wealth: number) => {
    const nisab = 4340; // Current gold nisab in USD (approximate)
    if (wealth >= nisab) {
      return wealth * 0.025; // 2.5%
    }
    return 0;
  };

  const stats = {
    totalRaised: mockCampaigns.reduce((acc, c) => acc + c.raised_amount, 0),
    totalDonors: mockCampaigns.reduce((acc, c) => acc + c.donor_count, 0),
    activeCampaigns: mockCampaigns.filter(c => c.status === "active").length,
    completedCampaigns: mockCampaigns.filter(c => c.status === "completed").length
  };

  return (
    <PageLayout 
      title="Donations & Fundraising" 
      subtitle="Support our community through charitable giving"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.totalRaised.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Raised</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalDonors}</p>
                <p className="text-xs text-muted-foreground">Total Donors</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                <p className="text-xs text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border/30 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Award size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedCampaigns}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: "campaigns", label: "Active Campaigns", icon: Target },
            { id: "donate", label: "Make Donation", icon: Heart },
            { id: "history", label: "Donation History", icon: Clock },
            { id: "reports", label: "Transparency Reports", icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as unknown)}
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

        {/* Active Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {isAdmin && (
                <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Plus size={18} />
                  Create Campaign
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  delay={index * 100}
                  onDonate={() => {
                    setSelectedCampaign(campaign);
                    setIsDonateModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Make Donation Tab */}
        {activeTab === "donate" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Make a <span className="text-primary">Donation</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Support our community through various forms of charitable giving according to Islamic principles.
              </p>
            </div>

            {/* Zakat Calculator */}
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-green-500/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display tracking-wide mb-4">
                  Zakat <span className="text-green-500">Calculator</span>
                </h3>
                <p className="text-muted-foreground">
                  Calculate your Zakat obligation based on your wealth
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wealth">Total Wealth (USD)</Label>
                    <Input
                      id="wealth"
                      type="number"
                      placeholder="Enter your total wealth"
                      className="text-center text-lg"
                    />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Calculate Zakat
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Current Nisab: $4,340 (based on gold price)</p>
                    <p>Zakat Rate: 2.5% of wealth above Nisab</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationTypes.map((type, index) => (
                <div 
                  key={type.value}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    setDonationForm(prev => ({ ...prev, donation_type: type.value as unknown }));
                    setIsDonateModalOpen(true);
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="font-semibold mb-2">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {type.value === "zakat" && "Obligatory charity (2.5% of wealth)"}
                      {type.value === "sadaqah" && "Voluntary charity for Allah's sake"}
                      {type.value === "one_time" && "Single donation to support causes"}
                      {type.value === "monthly" && "Recurring monthly contributions"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Donation <span className="text-primary">History</span>
              </h2>
              <p className="text-muted-foreground">
                Track your charitable contributions and their impact
              </p>
            </div>

            <div className="space-y-4">
              {mockDonations.map((donation, index) => (
                <div 
                  key={donation.id}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Heart size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{donation.campaign_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {donation.is_anonymous ? "Anonymous" : donation.donor_name} • 
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${donation.amount}</p>
                      <p className="text-sm text-muted-foreground capitalize">{donation.donation_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {donation.message && (
                    <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm italic">"{donation.message}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transparency Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Transparency <span className="text-primary">Reports</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete financial transparency in accordance with Islamic principles of Amanah (trust)
              </p>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart size={24} className="text-primary" />
                  <h3 className="font-semibold">Income Breakdown</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Donations</span>
                    <span className="text-sm font-medium">$78,250 (85%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Zakat</span>
                    <span className="text-sm font-medium">$12,500 (14%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">$1,000 (1%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 size={24} className="text-secondary" />
                  <h3 className="font-semibold">Expense Categories</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Infrastructure</span>
                    <span className="text-sm font-medium">$32,500 (40%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Student Support</span>
                    <span className="text-sm font-medium">$24,375 (30%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Programs</span>
                    <span className="text-sm font-medium">$16,250 (20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Operations</span>
                    <span className="text-sm font-medium">$8,125 (10%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={24} className="text-green-500" />
                  <h3 className="font-semibold">Compliance</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Sharia Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Audited Annually</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">100% Transparency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Zero Admin Fees</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Reports */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display tracking-wide mb-4">
                  Download <span className="text-primary">Reports</span>
                </h3>
                <p className="text-muted-foreground">
                  Access detailed financial reports and audit documents
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Annual Report 2023", type: "PDF", size: "2.4 MB" },
                  { title: "Monthly Statement Feb 2024", type: "PDF", size: "856 KB" },
                  { title: "Audit Report 2023", type: "PDF", size: "1.8 MB" }
                ].map((report, index) => (
                  <div 
                    key={report.title}
                    className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <p className="text-xs text-muted-foreground">{report.type} • {report.size}</p>
                      </div>
                      <Download size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donation Modal */}
        <Dialog open={isDonateModalOpen} onOpenChange={setIsDonateModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedCampaign && (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{selectedCampaign.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Donation Amount (USD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={donationForm.amount}
                    onChange={(e) => setDonationForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="donation_type">Donation Type</Label>
                  <Select value={donationForm.donation_type} onValueChange={(value) => setDonationForm(prev => ({ ...prev, donation_type: value as unknown }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {donationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select value={donationForm.payment_method} onValueChange={(value) => setDonationForm(prev => ({ ...prev, payment_method: value as unknown }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donor_name">Full Name</Label>
                  <Input
                    id="donor_name"
                    value={donationForm.donor_name}
                    onChange={(e) => setDonationForm(prev => ({ ...prev, donor_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={donationForm.email}
                    onChange={(e) => setDonationForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={donationForm.message}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Leave a message with your donation..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={donationForm.is_anonymous}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                  className="rounded border-border"
                />
                <Label htmlFor="anonymous" className="text-sm">Make this donation anonymous</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleDonate} 
                  disabled={isProcessing}
                  className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart size={16} className="mr-2" />
                      Donate ${donationForm.amount || "0"}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDonateModalOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}

function CampaignCard({ campaign, delay, onDonate }: { campaign: Campaign; delay: number; onDonate: () => void }) {
  const progressPercentage = (campaign.raised_amount / campaign.goal_amount) * 100;
  const daysLeft = Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{campaign.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {campaign.donor_count} donors
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
            </span>
          </div>
        </div>
        <div className={cn(
          "text-xs px-2 py-1 rounded-full font-medium",
          campaign.status === "active" ? "bg-green-500/20 text-green-400" :
          campaign.status === "completed" ? "bg-blue-500/20 text-blue-400" :
          "bg-gray-500/20 text-gray-400"
        )}>
          {campaign.status === "active" ? "Active" : campaign.status === "completed" ? "Completed" : "Paused"}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">${campaign.raised_amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">raised of ${campaign.goal_amount.toLocaleString()}</p>
          </div>
          <Button 
            onClick={onDonate}
            className="bg-primary hover:bg-primary/90 shadow-red gap-2"
            disabled={campaign.status !== "active"}
          >
            <Heart size={16} />
            Donate
          </Button>
        </div>
      </div>
    </div>
  );
}