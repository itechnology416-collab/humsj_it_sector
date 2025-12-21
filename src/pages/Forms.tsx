import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  FileText, 
  Users, 
  Calendar, 
  MessageSquare,
  CreditCard,
  UserPlus,
  ClipboardList,
  Send,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Filter,
  Search,
  Plus,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Forms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Forms", icon: FileText },
    { id: "membership", name: "Membership", icon: Users },
    { id: "events", name: "Events", icon: Calendar },
    { id: "communication", name: "Communication", icon: MessageSquare },
    { id: "financial", name: "Financial", icon: CreditCard },
    { id: "administrative", name: "Administrative", icon: ClipboardList }
  ];

  const forms = [
    {
      id: 1,
      title: "New Member Registration",
      description: "Complete registration form for new HUMSJ members including personal details, academic information, and skills assessment",
      category: "membership",
      status: "active",
      submissions: 245,
      lastUpdated: "2024-02-15",
      featured: true,
      icon: UserPlus,
      color: "from-blue-500 to-indigo-600",
      fields: 12,
      estimatedTime: "5-7 minutes"
    },
    {
      id: 2,
      title: "Event Registration",
      description: "Standard form for registering to attend HUMSJ events, workshops, and educational programs",
      category: "events",
      status: "active",
      submissions: 1890,
      lastUpdated: "2024-02-10",
      featured: true,
      icon: Calendar,
      color: "from-green-500 to-emerald-600",
      fields: 8,
      estimatedTime: "3-4 minutes"
    },
    {
      id: 3,
      title: "Volunteer Application",
      description: "Application form for students interested in volunteering for HUMSJ activities and community service",
      category: "membership",
      status: "active",
      submissions: 156,
      lastUpdated: "2024-02-12",
      featured: true,
      icon: Users,
      color: "from-purple-500 to-violet-600",
      fields: 15,
      estimatedTime: "8-10 minutes"
    },
    {
      id: 4,
      title: "Event Proposal Submission",
      description: "Form for members to propose new events, workshops, or activities for the HUMSJ community",
      category: "events",
      status: "active",
      submissions: 67,
      lastUpdated: "2024-02-08",
      featured: false,
      icon: Send,
      color: "from-orange-500 to-red-600",
      fields: 10,
      estimatedTime: "6-8 minutes"
    },
    {
      id: 5,
      title: "Feedback & Suggestions",
      description: "Share your feedback, suggestions, and ideas for improving HUMSJ services and activities",
      category: "communication",
      status: "active",
      submissions: 423,
      lastUpdated: "2024-02-14",
      featured: true,
      icon: MessageSquare,
      color: "from-cyan-500 to-blue-600",
      fields: 6,
      estimatedTime: "3-5 minutes"
    },
    {
      id: 6,
      title: "Financial Assistance Request",
      description: "Application form for students seeking financial assistance for educational or emergency needs",
      category: "financial",
      status: "active",
      submissions: 89,
      lastUpdated: "2024-02-05",
      featured: false,
      icon: CreditCard,
      color: "from-emerald-500 to-green-600",
      fields: 18,
      estimatedTime: "10-12 minutes"
    },
    {
      id: 7,
      title: "IT Support Request",
      description: "Request technical support for IT-related issues, software problems, or system access",
      category: "administrative",
      status: "active",
      submissions: 134,
      lastUpdated: "2024-02-11",
      featured: false,
      icon: ClipboardList,
      color: "from-indigo-500 to-purple-600",
      fields: 9,
      estimatedTime: "4-6 minutes"
    },
    {
      id: 8,
      title: "Prayer Space Booking",
      description: "Reserve prayer spaces and meeting rooms for religious activities and group studies",
      category: "administrative",
      status: "active",
      submissions: 312,
      lastUpdated: "2024-02-13",
      featured: false,
      icon: Calendar,
      color: "from-teal-500 to-cyan-600",
      fields: 7,
      estimatedTime: "2-3 minutes"
    },
    {
      id: 9,
      title: "Scholarship Application",
      description: "Application for HUMSJ academic scholarships and educational grants",
      category: "financial",
      status: "seasonal",
      submissions: 78,
      lastUpdated: "2024-01-20",
      featured: true,
      icon: Star,
      color: "from-amber-500 to-yellow-600",
      fields: 20,
      estimatedTime: "15-20 minutes"
    },
    {
      id: 10,
      title: "Committee Membership",
      description: "Apply to join HUMSJ committees and take active roles in community leadership",
      category: "membership",
      status: "active",
      submissions: 45,
      lastUpdated: "2024-02-07",
      featured: false,
      icon: Users,
      color: "from-pink-500 to-rose-600",
      fields: 14,
      estimatedTime: "7-9 minutes"
    }
  ];

  const filteredForms = forms.filter(form => {
    const matchesCategory = selectedCategory === "all" || form.category === selectedCategory;
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredForms = forms.filter(form => form.featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-500/20";
      case "seasonal": return "text-yellow-600 bg-yellow-500/20";
      case "inactive": return "text-red-600 bg-red-500/20";
      default: return "text-gray-600 bg-gray-500/20";
    }
  };

  const handleFormAction = (formId: number, action: string) => {
    console.log(`${action} form ${formId}`);
    // In a real app, this would handle form actions
  };

  return (
    <PageLayout 
      title="Forms" 
      subtitle="Access and submit various forms for HUMSJ services and activities"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto shadow-red animate-glow">
            <FileText size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Forms Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete and submit various forms for membership, events, financial assistance, 
            and other HUMSJ services. All forms are secure and processed promptly.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active Forms", value: "15", icon: FileText, color: "text-primary" },
            { label: "Total Submissions", value: "3,400+", icon: Send, color: "text-green-500" },
            { label: "Avg. Response Time", value: "24h", icon: Clock, color: "text-blue-500" },
            { label: "Success Rate", value: "98%", icon: CheckCircle, color: "text-emerald-500" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-muted-foreground">Current</span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured Forms */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star size={24} className="text-yellow-500" />
            <h2 className="text-2xl font-display tracking-wide">Featured Forms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredForms.slice(0, 6).map((form, index) => (
              <div 
                key={form.id}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${form.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <form.icon size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full">Featured</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{form.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{form.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {form.submissions} submissions
                  </span>
                  <span>{form.estimatedTime}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleFormAction(form.id, 'fill')}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    size="sm"
                  >
                    <Edit size={14} className="mr-2" />
                    Fill Form
                  </Button>
                  <Button 
                    onClick={() => handleFormAction(form.id, 'preview')}
                    variant="outline"
                    size="sm"
                  >
                    <Eye size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Forms List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {selectedCategory === "all" ? "All Forms" : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-sm text-muted-foreground ml-2">({filteredForms.length} forms)</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredForms.map((form, index) => (
              <div 
                key={form.id}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${form.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <form.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{form.title}</h4>
                      <div className="flex gap-2">
                        {form.featured && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full">Featured</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{form.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={14} />
                        {form.fields} fields
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {form.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {form.submissions} submissions
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Updated {new Date(form.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleFormAction(form.id, 'fill')}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <Edit size={16} className="mr-2" />
                      Fill Form
                    </Button>
                    <Button 
                      onClick={() => handleFormAction(form.id, 'preview')}
                      variant="outline"
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-display tracking-wide mb-4">Need Help with Forms?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you complete any form or answer questions about the submission process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/contact")} variant="outline">
                <MessageSquare size={16} className="mr-2" />
                Contact Support
              </Button>
              <Button onClick={() => navigate("/help")} className="bg-gradient-to-r from-primary to-secondary">
                <AlertCircle size={16} className="mr-2" />
                Form Guidelines
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}