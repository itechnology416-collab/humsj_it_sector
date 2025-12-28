import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Crown, 
  Users, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  Shield,
  Code,
  BookOpen,
  MessageSquare,
  DollarSign,
  Heart,
  Camera,
  Handshake,
  GraduationCap,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeadershipPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"executive" | "committees" | "it-sector" | "contact">("executive");

  const executiveLeadership = [
    {
      name: "Musab Abdurahman",
      title: "Amir (President)",
      department: "Computer Science",
      year: "4th Year",
      tenure: "2023-2024",
      email: "amir@humsj.edu.et",
      phone: "+251-911-123-456",
      bio: "Dedicated leader with a passion for Islamic community building and technology innovation. Leading the Jama'a towards digital transformation while maintaining strong Islamic values.",
      achievements: [
        "Increased membership by 40% in one year",
        "Launched comprehensive IT management system",
        "Established partnerships with 15+ organizations",
        "Organized 50+ successful events"
      ],
      responsibilities: [
        "Overall strategic leadership and vision",
        "External relations and partnerships",
        "Policy development and implementation",
        "Community representation"
      ],
      icon: Crown,
      color: "from-red-500 to-pink-500"
    },
    {
      name: "Yusuf Usman",
      title: "Vice Amir (Vice President)",
      department: "Information Systems",
      year: "3rd Year", 
      tenure: "2023-2024",
      email: "vice-amir@humsj.edu.et",
      phone: "+251-911-234-567",
      bio: "Experienced organizer and community builder focused on member engagement and operational excellence. Passionate about empowering Muslim students in technology.",
      achievements: [
        "Streamlined operational processes",
        "Improved member satisfaction by 35%",
        "Led successful fundraising campaigns",
        "Mentored 20+ junior members"
      ],
      responsibilities: [
        "Operations oversight and coordination",
        "Committee supervision and support",
        "Member relations and engagement",
        "Internal communications"
      ],
      icon: Shield,
      color: "from-blue-500 to-indigo-500"
    }
  ];

  const committees = [
    {
      name: "Information Technology Sector",
      head: "Yusuf Usman",
      members: 12,
      description: "Leading digital transformation and technology innovation for the Jama'a",
      color: "from-blue-500 to-cyan-500",
      icon: "💻"
    },
    {
      name: "Academic Sector",
      head: "Muaz Kedir",
      members: 10,
      description: "Leading educational programs and academic support for the Jama'a",
      color: "from-green-500 to-emerald-500",
      icon: "🎓"
    },
    {
      name: "Da'wa Committee",
      head: "Amar",
      members: 8,
      description: "Spreading Islamic knowledge and engaging in community outreach activities",
      responsibilities: [
        "System development and maintenance",
        "Digital infrastructure management", 
        "Technology training and support",
        "Innovation and automation"
      ],
      achievements: [
        "Developed comprehensive management platform",
        "Automated 80% of administrative processes",
        "Trained 100+ members in digital skills",
        "Reduced operational costs by 30%"
      ],
      icon: Code,
      color: "from-purple-500 to-violet-500",
      contact: "it@humsj.edu.et"
    },
    {
      name: "Da'wa Committee",
      head: "Muaz Kedir",
      members: 8,
      description: "Spreading Islamic knowledge and engaging in community outreach activities",
      responsibilities: [
        "Islamic education and outreach",
        "Community engagement programs",
        "Interfaith dialogue coordination",
        "Educational content development"
      ],
      achievements: [
        "Organized 25+ educational sessions",
        "Reached 500+ community members",
        "Published 50+ Islamic articles",
        "Established study circles"
      ],
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      contact: "dawa@humsj.edu.et"
    },
    {
      name: "Education Committee",
      head: "Mohammed Ali",
      members: 10,
      description: "Supporting academic excellence and providing educational resources",
      responsibilities: [
        "Academic support programs",
        "Tutoring and mentorship",
        "Study group coordination",
        "Educational resource management"
      ],
      achievements: [
        "Improved member GPA by 15%",
        "Established tutoring network",
        "Created study resource library",
        "Organized academic workshops"
      ],
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      contact: "education@humsj.edu.et"
    },
    {
      name: "Finance Committee",
      head: "Khadija Hassan",
      members: 6,
      description: "Managing financial resources with transparency and Islamic principles",
      responsibilities: [
        "Budget planning and management",
        "Financial transparency reporting",
        "Fundraising coordination",
        "Zakat and charity distribution"
      ],
      achievements: [
        "Maintained 100% financial transparency",
        "Increased funding by 50%",
        "Distributed $10,000+ in aid",
        "Implemented digital payment systems"
      ],
      icon: DollarSign,
      color: "from-amber-500 to-yellow-500",
      contact: "finance@humsj.edu.et"
    },
    {
      name: "Social Affairs Committee",
      head: "Yusuf Ahmed",
      members: 15,
      description: "Organizing events and fostering community bonds among members",
      responsibilities: [
        "Event planning and coordination",
        "Community building activities",
        "Member welfare programs",
        "Recreation and sports"
      ],
      achievements: [
        "Organized 40+ successful events",
        "Achieved 90% member participation",
        "Established sports programs",
        "Created mentorship network"
      ],
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      contact: "social@humsj.edu.et"
    },
    {
      name: "Media Committee",
      head: "Sara Ahmed",
      members: 8,
      description: "Managing communications, publications, and digital presence",
      responsibilities: [
        "Content creation and publishing",
        "Social media management",
        "Photography and videography",
        "Public relations"
      ],
      achievements: [
        "Grew social media following by 200%",
        "Published monthly newsletter",
        "Created promotional materials",
        "Documented 100+ events"
      ],
      icon: Camera,
      color: "from-orange-500 to-red-500",
      contact: "media@humsj.edu.et"
    }
  ];

  const academicSectorMembers = [
    {
      name: "Yusuf Usman",
      title: "IT Sector Head",
      specialization: "Technology Leadership",
      department: "Information Systems",
      year: "4th Year",
      skills: ["System Architecture", "Project Management", "Full-Stack Development", "Team Leadership"],
      projects: ["HUMSJ Management Platform", "Digital Infrastructure", "Technology Strategy"],
      email: "yusuf.usman@humsj.edu.et",
      achievements: ["Led platform development", "Modernized IT infrastructure", "Improved system efficiency"]
    },
    {
      name: "Feysal Hussein Kedir",
      title: "System Administrator",
      specialization: "System Administration & Infrastructure",
      department: "Computer Science",
      year: "4th Year",
      skills: ["Linux Administration", "Network Management", "Database Administration", "Security", "Server Management"],
      projects: ["Server Infrastructure", "Database Management", "System Security", "Backup Solutions"],
      email: "feysal.hussein@humsj.edu.et",
      achievements: ["Maintained 99.9% system uptime", "Implemented security protocols", "Optimized server performance"]
    },
    {
      name: "Zainab Ali",
      title: "Frontend Developer",
      specialization: "UI/UX Design & Development",
      department: "Computer Science",
      year: "3rd Year",
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "User Experience"],
      projects: ["Member Dashboard", "Event Registration UI", "Mobile App Design"],
      email: "zainab.ali@humsj.edu.et",
      github: "github.com/zainabali",
      achievements: ["Designed user interfaces", "Improved UX by 40%", "Created design system"]
    },
    {
      name: "Hassan Omar",
      title: "Backend Developer",
      specialization: "Server & Database Management",
      department: "Information Systems",
      year: "4th Year",
      skills: ["Python", "PostgreSQL", "Docker", "AWS", "API Development"],
      projects: ["Database Architecture", "Authentication System", "File Management API"],
      email: "hassan.omar@humsj.edu.et",
      github: "github.com/hassanomar",
      achievements: ["Optimized database performance", "Implemented security measures", "Reduced server costs"]
    },
    {
      name: "Amina Hassan",
      title: "Mobile Developer",
      specialization: "Cross-Platform Mobile Apps",
      department: "Software Engineering",
      year: "3rd Year",
      skills: ["React Native", "Flutter", "Firebase", "Mobile UI", "App Store Optimization"],
      projects: ["HUMSJ Mobile App", "Prayer Reminder App", "Event Check-in App"],
      email: "amina.hassan@humsj.edu.et",
      github: "github.com/aminahassan",
      achievements: ["Developed mobile apps", "Published to app stores", "Achieved 1000+ downloads"]
    },
    {
      name: "Ibrahim Osman",
      title: "DevOps Engineer",
      specialization: "Infrastructure & Deployment",
      department: "Computer Engineering",
      year: "4th Year",
      skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Monitoring"],
      projects: ["Deployment Pipeline", "Server Monitoring", "Backup Systems"],
      email: "ibrahim.osman@humsj.edu.et",
      github: "github.com/ibrahimosman",
      achievements: ["Automated deployments", "Achieved 99.9% uptime", "Reduced deployment time by 80%"]
    },
    {
      name: "Maryam Ahmed",
      title: "Data Analyst",
      specialization: "Analytics & Reporting",
      department: "Information Systems",
      year: "3rd Year",
      skills: ["Python", "SQL", "Tableau", "Statistics", "Machine Learning"],
      projects: ["Member Analytics Dashboard", "Event Success Metrics", "Predictive Models"],
      email: "maryam.ahmed@humsj.edu.et",
      github: "github.com/maryamahmed",
      achievements: ["Created analytics dashboards", "Improved decision making", "Identified growth opportunities"]
    }
  ];

  const contactInfo = {
    office: {
      address: "Student Center, Room 205, Haramaya University",
      hours: "Sunday - Thursday: 8:00 AM - 5:00 PM",
      phone: "+251-25-553-0011",
      email: "info@humsj.edu.et"
    },
    emergency: {
      phone: "+251-911-000-111",
      email: "emergency@humsj.edu.et"
    },
    social: {
      website: "https://humsj.edu.et",
      facebook: "https://www.facebook.com/share/1A5JXhpiG6/",
      telegram: "t.me/humsjofficialchannel",
      instagram: "@humsj_official"
    }
  };

  return (
    <PageLayout 
      title="Leadership & Committees" 
      subtitle="Meet our dedicated leaders and committee members"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: "executive", label: "Executive Leadership", icon: Crown },
            { id: "committees", label: "Committees", icon: Users },
            { id: "it-sector", label: "IT Sector Team", icon: Code },
            { id: "contact", label: "Contact Information", icon: Mail }
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

        {/* Executive Leadership Tab */}
        {activeTab === "executive" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Executive <span className="text-primary">Leadership</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our executive team provides strategic direction and ensures the effective operation of our Jama'a.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {executiveLeadership.map((leader, index) => (
                <div 
                  key={leader.name}
                  className="bg-card rounded-2xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${leader.color} flex items-center justify-center`}>
                      <leader.icon size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{leader.name}</h3>
                      <p className="text-primary font-medium">{leader.title}</p>
                      <p className="text-sm text-muted-foreground">{leader.department} • {leader.year}</p>
                      <p className="text-sm text-muted-foreground">Tenure: {leader.tenure}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">{leader.bio}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award size={16} className="text-primary" />
                        Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {leader.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Star size={12} className="text-primary mt-1 flex-shrink-0" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target size={16} className="text-secondary" />
                        Responsibilities
                      </h4>
                      <div className="space-y-2">
                        {leader.responsibilities.map((responsibility, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Zap size={12} className="text-secondary mt-1 flex-shrink-0" />
                            {responsibility}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                      <Mail size={14} />
                      {leader.email}
                    </Button>
                    <Button size="sm" variant="outline" className="border-border/50 hover:border-primary gap-2">
                      <Phone size={14} />
                      {leader.phone}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Committees Tab */}
        {activeTab === "committees" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Committee <span className="text-primary">Structure</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our specialized committees work together to serve the community and achieve our mission.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {committees.map((committee, index) => (
                <div 
                  key={committee.name}
                  className="bg-card rounded-xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${committee.color} flex items-center justify-center`}>
                      <committee.icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{committee.name}</h3>
                      <p className="text-primary">Head: {committee.head}</p>
                      <p className="text-sm text-muted-foreground">{committee.members} members</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">{committee.description}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Responsibilities:</h4>
                      <div className="space-y-1">
                        {committee.responsibilities.map((responsibility, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            {responsibility}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Recent Achievements:</h4>
                      <div className="space-y-1">
                        {committee.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp size={12} className="text-green-500 flex-shrink-0" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full border-border/50 hover:border-primary gap-2">
                    <Mail size={14} />
                    {committee.contact}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IT Sector Team Tab */}
        {activeTab === "it-sector" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                IT Sector <span className="text-primary">Team</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the talented developers and technologists driving our digital transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academicSectorMembers.map((member, index) => (
                <div 
                  key={member.name}
                  className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-primary">{member.title}</p>
                      <p className="text-xs text-muted-foreground">{member.department} • {member.year}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-secondary mb-2">Specialization:</p>
                    <p className="text-sm text-muted-foreground">{member.specialization}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map(skill => (
                        <span key={skill} className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Key Projects:</p>
                    <div className="space-y-1">
                      {member.projects.map((project, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Code size={12} className="text-primary flex-shrink-0" />
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Achievements:</p>
                    <div className="space-y-1">
                      {member.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Award size={12} className="text-amber-500 flex-shrink-0" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-border/50 hover:border-primary text-xs">
                      <Mail size={12} className="mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-border/50 hover:border-primary text-xs">
                      <Code size={12} className="mr-1" />
                      GitHub
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information Tab */}
        {activeTab === "contact" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display tracking-wide mb-4">
                Contact <span className="text-primary">Information</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get in touch with our leadership team and committees for any inquiries or support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Office Information */}
              <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Office Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.office.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Office Hours</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.office.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.office.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.office.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-red-400/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
                  <Shield size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Emergency Phone</p>
                      <p className="text-sm text-red-400 font-medium">{contactInfo.emergency.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Emergency Email</p>
                      <p className="text-sm text-red-400 font-medium">{contactInfo.emergency.email}</p>
                    </div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3 mt-4">
                    <p className="text-xs text-red-400">
                      For urgent matters requiring immediate attention outside office hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media & Online */}
              <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-secondary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <MessageSquare size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Online Presence</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xs">🌐</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-secondary">{contactInfo.social.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center">
                      <span className="text-xs">📘</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Facebook</p>
                      <p className="text-sm text-secondary">{contactInfo.social.facebook}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-400/20 flex items-center justify-center">
                      <span className="text-xs">✈️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Telegram</p>
                      <p className="text-sm text-secondary">{contactInfo.social.telegram}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
                      <span className="text-xs">📷</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="text-sm text-secondary">{contactInfo.social.instagram}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Committee Contact Quick Reference */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display tracking-wide mb-4">
                  Committee <span className="text-primary">Quick Contact</span>
                </h3>
                <p className="text-muted-foreground">
                  Direct contact information for each committee
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {committees.map((committee, index) => (
                  <div 
                    key={committee.name}
                    className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/30 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <committee.icon size={20} className="text-primary" />
                      <h4 className="font-semibold text-sm">{committee.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Head: {committee.head}</p>
                    <Button size="sm" variant="outline" className="w-full text-xs border-border/50 hover:border-primary">
                      <Mail size={12} className="mr-1" />
                      {committee.contact}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}