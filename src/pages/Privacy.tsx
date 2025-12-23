import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Shield, Lock, Eye, Database, Users, Mail, Phone, Globe, FileText, AlertTriangle, CheckCircle, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageLayout 
      title="Privacy Policy" 
      subtitle="Your privacy and data protection are our top priorities"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto shadow-red animate-glow">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            At HUMSJ Information Technology Sector, we are committed to protecting your privacy 
            and ensuring the security of your personal information in accordance with Islamic principles.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock size={16} />
            <span>Last updated: December 20, 2024</span>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/30">
          <h2 className="text-2xl font-display tracking-wide mb-6 flex items-center gap-3">
            <Eye size={24} className="text-primary" />
            Privacy at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Lock,
                title: "Data Security",
                description: "Your data is encrypted and stored securely using industry-standard protocols."
              },
              {
                icon: Users,
                title: "Limited Access",
                description: "Only authorized personnel have access to your information on a need-to-know basis."
              },
              {
                icon: Database,
                title: "Data Minimization",
                description: "We collect only the information necessary for providing our services."
              },
              {
                icon: CheckCircle,
                title: "Your Rights",
                description: "You have full control over your data with rights to access, modify, and delete."
              }
            ].map((item, index) => (
              <div key={item.title} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl font-display tracking-wide mb-6 flex items-center gap-3">
            <Mail size={24} className="text-primary" />
            Contact Us
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">privacy@humsj.edu.et</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+251-25-553-0000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/terms")} variant="outline">
              <FileText size={16} className="mr-2" />
              Terms & Conditions
            </Button>
            <Button onClick={() => navigate("/contact")} className="bg-gradient-to-r from-primary to-secondary">
              <Mail size={16} className="mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}