import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFAQ } from "@/hooks/useFAQ";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings,
  MessageSquare,
  Shield,
  Heart,
  AlertCircle,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is the purpose of this Islamic organization?",
    answer: "Our organization serves as a comprehensive platform for the Muslim community to connect, learn, and grow together. We provide resources for Islamic education, organize community events, facilitate volunteer opportunities, and support spiritual development through various programs and services.",
    category: "General"
  },
  {
    id: "2",
    question: "How can I become a member of the organization?",
    answer: "You can join our community by creating an account through the registration process. Simply click on 'Sign Up' and fill in your details. Once registered, you'll have access to all community features, events, and resources.",
    category: "General"
  },
  {
    id: "3",
    question: "How accurate are the prayer times displayed?",
    answer: "Our prayer times are calculated using precise astronomical algorithms and are adjusted for your specific location. We use the Islamic Society of North America (ISNA) calculation method by default, but you can adjust the calculation method in your settings.",
    category: "Prayer & Worship"
  },
  {
    id: "4",
    question: "How do I register for events?",
    answer: "Browse our Events page to see upcoming activities. Click on any event to view details and click 'Register' to sign up. You'll receive confirmation and reminder emails about your registered events.",
    category: "Events & Activities"
  },
  {
    id: "5",
    question: "What educational resources are available?",
    answer: "Our Learning Center offers Quran recitation guides, Islamic lectures, hadith collections, Islamic history resources, Arabic language lessons, and various educational materials for all age groups.",
    category: "Learning & Education"
  },
  {
    id: "6",
    question: "How can I volunteer with the organization?",
    answer: "Visit our Volunteer Opportunities page to see current volunteer needs. You can sign up for various roles including event organization, teaching assistance, community outreach, and administrative support.",
    category: "Community & Volunteering"
  },
  {
    id: "7",
    question: "I forgot my password. How can I reset it?",
    answer: "Click on 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link in your email. Follow the instructions to create a new password.",
    category: "Technical Support"
  }
];

const categories = [
  { name: "All", icon: HelpCircle, count: faqData.length },
  { name: "General", icon: BookOpen, count: faqData.filter(f => f.category === "General").length },
  { name: "Prayer & Worship", icon: Heart, count: faqData.filter(f => f.category === "Prayer & Worship").length },
  { name: "Events & Activities", icon: Calendar, count: faqData.filter(f => f.category === "Events & Activities").length },
  { name: "Learning & Education", icon: Users, count: faqData.filter(f => f.category === "Learning & Education").length },
  { name: "Community & Volunteering", icon: Shield, count: faqData.filter(f => f.category === "Community & Volunteering").length },
  { name: "Technical Support", icon: Settings, count: faqData.filter(f => f.category === "Technical Support").length }
];

export default function FAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <PageLayout 
      title="Frequently Asked Questions" 
      subtitle="Find answers to common questions"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-card to-primary/10 rounded-xl p-6 border border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
              <HelpCircle size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-display tracking-wide mb-2">How can we help you?</h2>
              <p className="text-muted-foreground">
                Browse through our FAQ section to find answers to common questions.
              </p>
            </div>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <MessageSquare size={16} />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-5 border border-border/30">
              <h3 className="font-display text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                      selectedCategory === category.name
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <category.icon size={18} />
                    <span className="flex-1 text-sm">{category.name}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:col-span-3 space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-card rounded-xl border border-border/30">
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary">
                      {faq.category}
                    </span>
                    <h3 className="font-medium mt-2">{faq.question}</h3>
                  </div>
                  {expandedItems.includes(faq.id) ? (
                    <ChevronUp size={20} className="text-primary" />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                
                {expandedItems.includes(faq.id) && (
                  <div className="px-6 pb-6 border-t border-border/30">
                    <p className="text-muted-foreground pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}