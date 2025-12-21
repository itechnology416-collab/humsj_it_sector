import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight,
  Search,
  ExternalLink,
  FileText,
  Video,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I register a new member?",
    answer: "Navigate to the Members page and click 'Add Member'. Fill in the required information including name, email, college, and department. The member will receive an email invitation to complete their registration.",
    category: "Members"
  },
  {
    question: "How can I create a new event?",
    answer: "Go to the Events page and click 'Create Event'. Select the event type, set the date, time, location, and add a description. You can also set attendance limits and assign speakers.",
    category: "Events"
  },
  {
    question: "How do I send announcements to all members?",
    answer: "Use the Communication page to create and send announcements. You can choose to send via email, SMS, or in-app notifications. Select your target audience and compose your message.",
    category: "Communication"
  },
  {
    question: "How can I upload content to the library?",
    answer: "Navigate to the Content page and click 'Upload'. Select your files (documents, videos, audio, or images), add a title and description, and choose the appropriate category.",
    category: "Content"
  },
  {
    question: "How do I view attendance reports?",
    answer: "Go to the Analytics page where you can view attendance statistics. You can filter by event type, date range, and export reports in PDF or Excel format.",
    category: "Analytics"
  },
  {
    question: "How can I reset my password?",
    answer: "Go to Settings > Security and click 'Change Password'. You'll need to enter your current password and then set a new one. We recommend using a strong password with at least 8 characters.",
    category: "Account"
  },
];

const resources = [
  { icon: Book, title: "User Guide", description: "Complete documentation for the system", link: "#" },
  { icon: Video, title: "Video Tutorials", description: "Step-by-step video guides", link: "#" },
  { icon: FileText, title: "API Documentation", description: "Technical documentation for developers", link: "#" },
  { icon: Users, title: "Community Forum", description: "Connect with other users", link: "#" },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(faqs.map(f => f.category))];
  
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout title="Help & Support" subtitle="Get assistance and find answers to common questions" currentPath={location.pathname} onNavigate={navigate}>
      <div className="space-y-6 animate-fade-in">{/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Search our knowledge base or browse common questions below
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base transition-all outline-none shadow-soft"
          />
        </div>

        {/* Quick Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={resource.title}
                href={resource.link}
                className="bg-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 group animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon size={20} className="text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </a>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.question ? null : faq.question)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  {expandedFaq === faq.question ? (
                    <ChevronDown size={20} className="text-primary flex-shrink-0" />
                  ) : (
                    <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.question && (
                  <div className="px-4 pb-4 text-muted-foreground">
                    <p className="border-t border-border pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No FAQs found matching your search.
            </p>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-primary to-emerald-glow rounded-2xl p-8 text-primary-foreground">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Still need help?</h2>
            <p className="opacity-90 mb-6">
              Our support team is here to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <MessageCircle size={20} />
                Live Chat
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Mail size={20} />
                Email Support
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone size={20} />
                Call Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
