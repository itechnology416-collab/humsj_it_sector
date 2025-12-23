import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Heart, 
  Users,
  Shield,
  BookOpen,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Star,
  Handshake,
  Eye,
  Lock,
  Scale,
  Award,
  Flag,
  Mail,
  Phone,
  Clock,
  Download,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Conduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const lastUpdated = "February 20, 2024";
  const version = "2.1";

  return (
    <PageLayout 
      title="Code of Conduct" 
      subtitle="Community guidelines and Islamic principles for HUMSJ platform"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-green-500/20 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display tracking-wide mb-4">
            Code of <span className="text-green-600">Conduct</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Building a respectful, inclusive, and Islamic community for all members of HUMSJ.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1">
              <Award size={14} />
              Version: {version}
            </span>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Handshake size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">Our Commitment</h3>
              <p className="text-blue-600 dark:text-blue-300 text-sm leading-relaxed">
                We are committed to creating a welcoming, respectful, and inclusive environment for all members 
                of the HUMSJ community, guided by Islamic principles of brotherhood, respect, and mutual support. 
                This Code of Conduct outlines our shared values and expectations for behavior.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Islamic Foundation */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <BookOpen size={24} className="text-green-600" />
              Islamic Foundation
            </h2>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-lg font-medium mb-4 text-green-600 dark:text-green-400">Core Islamic Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Akhlaq (Good Character)</h4>
                        <p className="text-xs text-muted-foreground">
                          Demonstrate excellent character in all interactions, following the example of Prophet Muhammad (PBUH).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Ukhuwah (Brotherhood/Sisterhood)</h4>
                        <p className="text-xs text-muted-foreground">
                          Treat all community members as brothers and sisters in faith with love and respect.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Adl (Justice)</h4>
                        <p className="text-xs text-muted-foreground">
                          Be fair and just in all dealings, avoiding bias and discrimination.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Hikmah (Wisdom)</h4>
                        <p className="text-xs text-muted-foreground">
                          Speak and act with wisdom, considering the impact of words and actions on others.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Sabr (Patience)</h4>
                        <p className="text-xs text-muted-foreground">
                          Exercise patience and understanding, especially during disagreements or conflicts.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Amanah (Trustworthiness)</h4>
                        <p className="text-xs text-muted-foreground">
                          Be trustworthy and reliable in all commitments and responsibilities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <BookOpen size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Quranic Guidance</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 italic mb-2">
                      "O you who believe! Let not some men among you laugh at others, it may be that the (latter) 
                      are better than the (former)..." - Quran 49:11
                    </p>
                    <p className="text-xs text-blue-500">
                      This verse reminds us to treat all community members with respect and avoid mockery or ridicule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expected Behavior */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <CheckCircle size={24} className="text-primary" />
              Expected Behavior
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Communication Standards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Respectful Language</h4>
                        <p className="text-xs text-muted-foreground">
                          Use polite, respectful language in all communications, avoiding profanity or offensive terms.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Constructive Feedback</h4>
                        <p className="text-xs text-muted-foreground">
                          Provide feedback in a constructive manner, focusing on ideas rather than personal attacks.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Active Listening</h4>
                        <p className="text-xs text-muted-foreground">
                          Listen carefully to others' perspectives and respond thoughtfully.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Inclusive Language</h4>
                        <p className="text-xs text-muted-foreground">
                          Use inclusive language that welcomes all community members regardless of background.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Cultural Sensitivity</h4>
                        <p className="text-xs text-muted-foreground">
                          Be mindful of cultural differences and show respect for diverse backgrounds.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Truthfulness</h4>
                        <p className="text-xs text-muted-foreground">
                          Always be truthful and honest in your communications and interactions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Community Participation</h3>
                <div className="bg-secondary/10 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Users size={24} className="text-secondary mx-auto mb-2" />
                      <h4 className="font-medium text-sm mb-1">Collaboration</h4>
                      <p className="text-xs text-muted-foreground">
                        Work together on projects and support fellow community members.
                      </p>
                    </div>
                    <div className="text-center">
                      <MessageCircle size={24} className="text-secondary mx-auto mb-2" />
                      <h4 className="font-medium text-sm mb-1">Engagement</h4>
                      <p className="text-xs text-muted-foreground">
                        Actively participate in discussions and community activities.
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield size={24} className="text-secondary mx-auto mb-2" />
                      <h4 className="font-medium text-sm mb-1">Support</h4>
                      <p className="text-xs text-muted-foreground">
                        Help and support other community members when needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Unacceptable Behavior */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <AlertTriangle size={24} className="text-red-500" />
              Unacceptable Behavior
            </h2>
            
            <div className="space-y-6">
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <h3 className="text-lg font-medium mb-4 text-red-600 dark:text-red-400">Prohibited Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Harassment & Bullying</h4>
                        <p className="text-xs text-red-500">
                          Any form of harassment, bullying, or intimidation of community members.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Discrimination</h4>
                        <p className="text-xs text-red-500">
                          Discrimination based on race, gender, nationality, or any other characteristic.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Hate Speech</h4>
                        <p className="text-xs text-red-500">
                          Language that promotes hatred or violence against individuals or groups.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Inappropriate Content</h4>
                        <p className="text-xs text-red-500">
                          Sharing content that violates Islamic principles or community standards.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Spam & Abuse</h4>
                        <p className="text-xs text-red-500">
                          Spamming, flooding, or abusing platform features and communication channels.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Privacy Violations</h4>
                        <p className="text-xs text-red-500">
                          Sharing personal information of others without their explicit consent.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Impersonation</h4>
                        <p className="text-xs text-red-500">
                          Impersonating other community members, staff, or external individuals.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Disruptive Behavior</h4>
                        <p className="text-xs text-red-500">
                          Deliberately disrupting events, discussions, or community activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <BookOpen size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Islamic Perspective on Behavior</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-300 italic mb-2">
                      "The believers in their mutual kindness, compassion, and sympathy are just one body; 
                      if a limb suffers, the whole body responds to it with wakefulness and fever." - Prophet Muhammad (PBUH)
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-300">
                      This hadith reminds us that harming any community member affects the entire community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reporting and Enforcement */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Flag size={24} className="text-secondary" />
              Reporting and Enforcement
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">How to Report Violations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Direct Reporting</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                          <Mail size={14} />
                          <span>conduct@humsj.edu.et</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                          <Phone size={14} />
                          <span>+251-25-553-0011 (Ext. 205)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Anonymous Reporting</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Use our anonymous reporting form available on the platform for sensitive issues.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-purple-500/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">In-Person Reporting</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        Visit our office at Student Center, Room 205, during office hours (Sun-Thu, 8AM-5PM).
                      </p>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Emergency Situations</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        For urgent safety concerns, contact university security immediately at +251-25-553-0000.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Enforcement Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Investigation</h4>
                      <p className="text-xs text-muted-foreground">
                        All reports are investigated promptly and fairly by the conduct committee.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-secondary">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Due Process</h4>
                      <p className="text-xs text-muted-foreground">
                        All parties involved are given the opportunity to present their perspective.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-accent">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Resolution</h4>
                      <p className="text-xs text-muted-foreground">
                        Appropriate action is taken based on the severity and nature of the violation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Possible Consequences</h3>
                <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                        <Scale size={14} />
                        <span>Verbal or written warning</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                        <Scale size={14} />
                        <span>Temporary suspension from platform</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                        <Scale size={14} />
                        <span>Removal from specific activities or roles</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                        <Scale size={14} />
                        <span>Mandatory counseling or education</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                        <Scale size={14} />
                        <span>Permanent ban from platform</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                        <Scale size={14} />
                        <span>Referral to university authorities</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Appeals Process */}
          <section className="bg-card rounded-xl p-8 border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Scale size={24} className="text-accent" />
              Appeals Process
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                If you believe a decision was made in error, you have the right to appeal within 14 days of the decision.
              </p>
              
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <h4 className="font-medium mb-3 text-blue-600 dark:text-blue-400">Appeal Requirements</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    <span>Submit appeal in writing with supporting evidence</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    <span>Clearly state the grounds for appeal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    <span>Appeal will be reviewed by an independent committee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                    <CheckCircle size={14} />
                    <span>Decision will be communicated within 10 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-green-500/20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Mail size={24} className="text-primary" />
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">
                For questions about this Code of Conduct or to report violations, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Conduct Committee</h4>
                      <p className="text-sm text-muted-foreground">conduct@humsj.edu.et</p>
                      <p className="text-sm text-muted-foreground">ethics@humsj.edu.et</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-secondary mt-1" />
                    <div>
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-muted-foreground">+251-25-553-0011 (Ext. 205)</p>
                      <p className="text-sm text-muted-foreground">Available: Sun-Thu, 8AM-5PM</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Eye size={20} className="text-accent mt-1" />
                    <div>
                      <h4 className="font-medium">Office Location</h4>
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
                        We respond to conduct inquiries within 2 business days
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
                  Report Violation
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}