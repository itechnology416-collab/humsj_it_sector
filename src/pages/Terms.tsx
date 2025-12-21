import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  FileText, 
  Scale,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Globe,
  Download,
  ExternalLink,
  Gavel,
  Book,
  Lock,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const lastUpdated = "February 20, 2024";
  const effectiveDate = "January 1, 2024";

  return (
    <PageLayout 
      title="Terms & Conditions" 
      subtitle="Terms of service for using the HUMSJ platform"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary/10 via-primary/10 to-accent/10 rounded-3xl p-8 border border-secondary/20 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-6 shadow-red animate-glow">
            <Scale size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display tracking-wide mb-4">
            Terms & <span className="text-secondary">Conditions</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Please read these terms carefully before using the HUMSJ Information Technology Sector platform.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={14} />
              Effective: {effectiveDate}
            </span>
          </div>
        </div>

        {/* Agreement Notice */}
        <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Gavel size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">Agreement to Terms</h3>
              <p className="text-blue-600 dark:text-blue-300 text-sm leading-relaxed">
                By accessing and using the HUMSJ platform, you agree to be bound by these Terms & Conditions. 
                If you do not agree to these terms, please do not use our services. These terms constitute a 
                legally binding agreement between you and HUMSJ.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Definitions */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Book size={24} className="text-primary" />
              Definitions
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">"Platform" or "Service"</h4>
                    <p className="text-sm text-muted-foreground">
                      The HUMSJ Information Technology Sector website, mobile applications, and all related services.
                    </p>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">"User" or "You"</h4>
                    <p className="text-sm text-muted-foreground">
                      Any individual who accesses or uses our platform, including students, faculty, and visitors.
                    </p>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">"Member"</h4>
                    <p className="text-sm text-muted-foreground">
                      A registered user who is part of the HUMSJ community with an active account.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">"Content"</h4>
                    <p className="text-sm text-muted-foreground">
                      All text, images, videos, documents, and other materials available on the platform.
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">"HUMSJ" or "We"</h4>
                    <p className="text-sm text-muted-foreground">
                      Haramaya University Muslim Student Jama'a Information Technology Sector.
                    </p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <h4 className="font-medium mb-2">"Islamic Principles"</h4>
                    <p className="text-sm text-muted-foreground">
                      The religious and ethical guidelines derived from the Quran and Sunnah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Users size={24} className="text-secondary" />
              User Accounts and Registration
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Account Creation</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      You must be a current student, faculty member, or authorized personnel of Haramaya University to create an account.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      You must provide accurate, current, and complete information during registration.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      You must notify us immediately of any unauthorized use of your account.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Account Responsibilities</h3>
                <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Important Notice</h4>
                      <p className="text-sm text-amber-600 dark:text-amber-300">
                        You are fully responsible for all activities that occur under your account. This includes 
                        any content posted, messages sent, or actions taken using your credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Shield size={24} className="text-accent" />
              Acceptable Use Policy
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-600">Permitted Uses</h3>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Educational and academic purposes
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Islamic community building
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Sharing knowledge and resources
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Participating in events and activities
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Professional networking
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Collaborative projects
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Seeking academic support
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={14} />
                        Contributing to community welfare
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-red-600">Prohibited Activities</h3>
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Posting inappropriate or offensive content
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Harassment or bullying of other users
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Sharing false or misleading information
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Violating Islamic principles and values
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Attempting to hack or compromise security
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Spamming or sending unsolicited messages
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Using the platform for commercial purposes
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle size={14} />
                          Impersonating others or creating fake accounts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Book size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Islamic Guidelines</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      All platform usage must align with Islamic principles. This includes respectful communication, 
                      truthfulness, maintaining good character (Akhlaq), and avoiding any content or behavior that 
                      contradicts Islamic teachings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <FileText size={24} className="text-primary" />
              Content and Intellectual Property
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">User-Generated Content</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Content Ownership</h4>
                      <p className="text-xs text-muted-foreground">
                        You retain ownership of content you create and post on the platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">License to HUMSJ</h4>
                      <p className="text-xs text-muted-foreground">
                        By posting content, you grant HUMSJ a non-exclusive license to use, display, and distribute your content on the platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Content Responsibility</h4>
                      <p className="text-xs text-muted-foreground">
                        You are solely responsible for the content you post and must ensure it doesn't violate any laws or rights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Platform Content</h3>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    All platform features, design, code, and original content created by HUMSJ are protected by intellectual property laws.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock size={14} className="text-secondary" />
                      <span>Platform source code and design are proprietary</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock size={14} className="text-secondary" />
                      <span>HUMSJ logos and branding are protected trademarks</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock size={14} className="text-secondary" />
                      <span>Educational content may be used for non-commercial purposes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Eye size={24} className="text-secondary" />
              Privacy and Data Protection
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your privacy is important to us. Our data collection and usage practices are detailed in our Privacy Policy.
              </p>
              
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Key Privacy Points</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    We collect only necessary information for platform functionality
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    Your data is encrypted and securely stored
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    We never sell your personal information to third parties
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    You have control over your data and privacy settings
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="border-blue-500/50 hover:border-blue-500 text-blue-600 dark:text-blue-400"
                  onClick={() => navigate("/privacy")}
                >
                  Read Full Privacy Policy
                </Button>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Globe size={24} className="text-accent" />
              Service Availability and Modifications
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Service Availability</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    We strive to maintain high availability of our platform, but we cannot guarantee uninterrupted service.
                  </p>
                  <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-700 dark:text-amber-400 text-sm mb-1">Service Interruptions</h4>
                        <p className="text-xs text-amber-600 dark:text-amber-300">
                          The platform may be temporarily unavailable due to maintenance, updates, or technical issues. 
                          We will provide advance notice when possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Platform Modifications</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    We reserve the right to modify, update, or discontinue features of the platform at any time.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-primary" />
                      <span>We will notify users of significant changes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-primary" />
                      <span>Critical updates may be implemented immediately for security</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-primary" />
                      <span>User feedback is considered for platform improvements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Scale size={24} className="text-primary" />
              Limitation of Liability
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Important Legal Notice</h4>
                    <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                      HUMSJ provides this platform "as is" without warranties of any kind. We are not liable for any 
                      direct, indirect, incidental, or consequential damages arising from your use of the platform.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Specific Limitations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Loss of data or content</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Service interruptions or downtime</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Security breaches or unauthorized access</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Third-party content or links</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>User-generated content accuracy</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Technical errors or bugs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <AlertTriangle size={24} className="text-red-500" />
              Account Termination
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Termination by User</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You may terminate your account at any time by contacting us or using the account deletion feature.
                </p>
                <div className="bg-blue-500/10 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                      <CheckCircle size={14} />
                      Account data will be deleted within 30 days
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                      <CheckCircle size={14} />
                      You can request data export before deletion
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                      <CheckCircle size={14} />
                      Some information may be retained for legal compliance
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Termination by HUMSJ</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We may suspend or terminate your account if you violate these terms or engage in prohibited activities.
                </p>
                <div className="bg-red-500/10 rounded-lg p-4">
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Grounds for Termination</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                      <AlertTriangle size={14} />
                      Violation of terms and conditions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                      <AlertTriangle size={14} />
                      Inappropriate or harmful behavior
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                      <AlertTriangle size={14} />
                      Security threats or illegal activities
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                      <AlertTriangle size={14} />
                      Prolonged inactivity (after notice)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Gavel size={24} className="text-secondary" />
              Governing Law and Disputes
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Applicable Law</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These terms are governed by the laws of Ethiopia and Islamic principles (Sharia) where applicable.
                </p>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <Book size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Islamic Arbitration</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        In accordance with Islamic principles, we encourage resolving disputes through peaceful dialogue 
                        and mediation. Islamic arbitration may be used for disputes involving religious matters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Dispute Resolution</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Direct Communication</h4>
                      <p className="text-xs text-muted-foreground">
                        First, contact us directly to resolve any issues or concerns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-secondary">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Mediation</h4>
                      <p className="text-xs text-muted-foreground">
                        If direct communication fails, we'll attempt mediation through university authorities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Legal Action</h4>
                      <p className="text-xs text-muted-foreground">
                        As a last resort, disputes will be resolved in Ethiopian courts with jurisdiction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8 border border-primary/20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Mail size={24} className="text-primary" />
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">
                If you have questions about these Terms & Conditions, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">legal@humsj.edu.et</p>
                      <p className="text-sm text-muted-foreground">info@humsj.edu.et</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-secondary mt-1" />
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-sm text-muted-foreground">+251-25-553-0011</p>
                      <p className="text-sm text-muted-foreground">Office Hours: Sun-Thu, 8AM-5PM</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-accent mt-1" />
                    <div>
                      <h4 className="font-medium">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        Student Center, Room 205<br />
                        Haramaya University<br />
                        Dire Dawa, Ethiopia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Response Time</h4>
                      <p className="text-sm text-muted-foreground">
                        We respond to legal inquiries within 5 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Download size={16} />
                  Download PDF Version
                </Button>
                <Button variant="outline" className="border-border/50 hover:border-primary gap-2">
                  <ExternalLink size={16} />
                  View Privacy Policy
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}