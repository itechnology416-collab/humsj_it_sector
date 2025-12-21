import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  User,
  Building,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Address",
      details: ["info@humsj.edu.et", "admin@humsj.edu.et"],
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+251-25-553-0011", "+251-912-345-678"],
      description: "Call us during office hours"
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: ["Student Center, Room 205", "Haramaya University", "Dire Dawa, Ethiopia"],
      description: "Visit us in person"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Sunday - Thursday: 8:00 AM - 5:00 PM", "Friday: 8:00 AM - 11:30 AM", "Saturday: Closed"],
      description: "When we're available"
    }
  ];

  const departments = [
    {
      name: "IT Support",
      email: "it@humsj.edu.et",
      phone: "+251-25-553-0012",
      head: "Yusuf Abdalla"
    },
    {
      name: "Events & Activities",
      email: "events@humsj.edu.et",
      phone: "+251-25-553-0013",
      head: "Ahmed Hassan"
    },
    {
      name: "Education & Da'wa",
      email: "education@humsj.edu.et",
      phone: "+251-25-553-0014",
      head: "Fatima Ali"
    },
    {
      name: "Finance & Administration",
      email: "finance@humsj.edu.et",
      phone: "+251-25-553-0015",
      head: "Mohammed Ibrahim"
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/humsj", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/humsj", color: "bg-blue-400 hover:bg-blue-500" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/humsj", color: "bg-pink-600 hover:bg-pink-700" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/humsj", color: "bg-red-600 hover:bg-red-700" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/humsj", color: "bg-blue-700 hover:bg-blue-800" }
  ];

  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="Get in touch with HUMSJ IT Sector team"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6">
            <MessageCircle size={16} className="text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">We're Here to Help</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-4">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions, suggestions, or need assistance? We'd love to hear from you. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div 
              key={info.title}
              className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <info.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
              <div className="space-y-1 mb-3">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-display tracking-wide mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
                    placeholder="Ahmed Hassan"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
                    placeholder="ahmed@hu.edu.et"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none cursor-pointer"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="membership">Membership</option>
                  <option value="events">Events & Activities</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none resize-none"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 shadow-red gap-2 py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Department Contacts */}
            <div className="bg-card rounded-xl p-8 border border-border/30">
              <h3 className="text-xl font-display tracking-wide mb-6">Department Contacts</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={dept.name} className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{dept.name}</h4>
                      <Building size={16} className="text-primary" />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User size={12} />
                        <span>Head: {dept.head}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={12} />
                        <span>{dept.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} />
                        <span>{dept.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-xl p-8 border border-border/30">
              <h3 className="text-xl font-display tracking-wide mb-6">Follow Us</h3>
              <p className="text-muted-foreground mb-6">
                Stay connected with us on social media for the latest updates, events, and announcements.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:scale-105 ${social.color}`}
                  >
                    <social.icon size={16} />
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-8 border border-red-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-display tracking-wide mb-2 text-red-600 dark:text-red-400">
                    Emergency Contact
                  </h3>
                  <p className="text-red-600 dark:text-red-300 text-sm mb-4">
                    For urgent matters or emergencies, please contact us immediately:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                      <Phone size={14} />
                      <span className="font-medium">Emergency Hotline: +251-25-553-0000</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                      <Mail size={14} />
                      <span className="font-medium">Emergency Email: emergency@humsj.edu.et</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-xl p-8 border border-border/30">
          <h2 className="text-2xl font-display tracking-wide mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How can I become a member of HUMSJ?",
                answer: "You can register as a member through our online registration system. Visit the 'Join Us' page and fill out the membership form with your student details."
              },
              {
                question: "What services does HUMSJ provide?",
                answer: "We provide various services including Islamic education, community events, prayer facilities, academic support, and IT services for the Muslim student community."
              },
              {
                question: "How can I get technical support?",
                answer: "For technical issues, contact our IT Support department at it@humsj.edu.et or call +251-25-553-0012 during office hours."
              },
              {
                question: "Can non-Muslim students participate in events?",
                answer: "Yes, we welcome all students to participate in our interfaith dialogue events and cultural programs. Some religious activities are specifically for Muslim students."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-secondary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-start gap-2">
                  <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}