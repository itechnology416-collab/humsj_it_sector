import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Download, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Calendar,
  BookOpen,
  Shield,
  Users,
  Settings,
  Smartphone,
  Monitor,
  Printer,
  ExternalLink,
  Clock,
  Star,
  Eye,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Downloads() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Downloads", icon: Download },
    { id: "documents", name: "Documents", icon: FileText },
    { id: "media", name: "Media", icon: Image },
    { id: "software", name: "Software", icon: Monitor },
    { id: "forms", name: "Forms", icon: Archive },
    { id: "islamic", name: "Islamic Resources", icon: BookOpen }
  ];

  const downloads = [
    {
      id: 1,
      title: "HUMSJ Constitution",
      description: "Official constitution and bylaws of Haramaya University Muslim Student Jama'a",
      category: "documents",
      type: "PDF",
      size: "2.4 MB",
      downloads: 1250,
      date: "2024-01-15",
      featured: true,
      icon: Shield,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Membership Application Form",
      description: "Complete membership registration form for new students",
      category: "forms",
      type: "PDF",
      size: "856 KB",
      downloads: 890,
      date: "2024-02-01",
      featured: true,
      icon: Users,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 3,
      title: "Event Registration Template",
      description: "Standard template for event registration and planning",
      category: "forms",
      type: "DOCX",
      size: "1.2 MB",
      downloads: 567,
      date: "2024-01-20",
      featured: false,
      icon: Calendar,
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 4,
      title: "Islamic Calendar 2024",
      description: "Complete Islamic calendar with important dates and events",
      category: "islamic",
      type: "PDF",
      size: "3.1 MB",
      downloads: 2100,
      date: "2024-01-01",
      featured: true,
      icon: Calendar,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 5,
      title: "Prayer Time Calculator",
      description: "Offline prayer time calculator for Haramaya and surrounding areas",
      category: "software",
      type: "APK",
      size: "12.5 MB",
      downloads: 1800,
      date: "2024-02-10",
      featured: true,
      icon: Smartphone,
      color: "from-orange-500 to-red-600"
    },
    {
      id: 6,
      title: "Quran Recitation Collection",
      description: "High-quality Quran recitations by renowned Qaris",
      category: "media",
      type: "ZIP",
      size: "450 MB",
      downloads: 3200,
      date: "2024-01-10",
      featured: true,
      icon: Music,
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 7,
      title: "HUMSJ Logo Package",
      description: "Official logos and branding materials in various formats",
      category: "media",
      type: "ZIP",
      size: "25.8 MB",
      downloads: 445,
      date: "2024-01-25",
      featured: false,
      icon: Image,
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 8,
      title: "Academic Sector Guidelines",
      description: "Complete guidelines and procedures for academic sector operations",
      category: "documents",
      type: "PDF",
      size: "1.8 MB",
      downloads: 678,
      date: "2024-02-05",
      featured: false,
      icon: Settings,
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 9,
      title: "Islamic Wallpapers Collection",
      description: "Beautiful Islamic wallpapers for desktop and mobile",
      category: "media",
      type: "ZIP",
      size: "89.2 MB",
      downloads: 1560,
      date: "2024-01-30",
      featured: false,
      icon: Image,
      color: "from-amber-500 to-yellow-600"
    },
    {
      id: 10,
      title: "Meeting Minutes Template",
      description: "Standard template for recording meeting minutes and decisions",
      category: "forms",
      type: "DOCX",
      size: "645 KB",
      downloads: 234,
      date: "2024-02-12",
      featured: false,
      icon: FileText,
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const filteredDownloads = selectedCategory === "all" 
    ? downloads 
    : downloads.filter(item => item.category === selectedCategory);

  const featuredDownloads = downloads.filter(item => item.featured);

  const handleDownload = (item: typeof downloads[0]) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${item.title}`);
    // You could also track download analytics here
  };

  return (
    <PageLayout 
      title="Downloads" 
      subtitle="Access important documents, forms, and resources for HUMSJ community"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto shadow-red animate-glow">
            <Download size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Downloads Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access essential documents, forms, Islamic resources, and software tools 
            for the HUMSJ community. All downloads are free and regularly updated.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Downloads", value: "12,000+", icon: Download, color: "text-primary" },
            { label: "Documents", value: "45", icon: FileText, color: "text-blue-500" },
            { label: "Media Files", value: "28", icon: Image, color: "text-green-500" },
            { label: "Software Tools", value: "12", icon: Monitor, color: "text-purple-500" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured Downloads */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star size={24} className="text-yellow-500" />
            <h2 className="text-2xl font-display tracking-wide">Featured Downloads</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDownloads.slice(0, 6).map((item, index) => (
              <div 
                key={item.id}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full">Featured</span>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {item.downloads} downloads
                  </span>
                  <span>{item.size}</span>
                </div>
                <Button 
                  onClick={() => handleDownload(item)}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Download size={16} className="mr-2" />
                  Download {item.type}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-display tracking-wide mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-red'
                    : 'bg-card/50 border-border/50 hover:border-primary/50 hover:bg-primary/10'
                }`}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Downloads List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {selectedCategory === "all" ? "All Downloads" : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-sm text-muted-foreground ml-2">({filteredDownloads.length} items)</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredDownloads.map((item, index) => (
              <div 
                key={item.id}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h4>
                      {item.featured && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full">Featured</span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{item.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={14} />
                        {item.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Archive size={14} />
                        {item.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {item.downloads} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleDownload(item)}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-display tracking-wide mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Contact our IT support team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/contact")} variant="outline">
                <ExternalLink size={16} className="mr-2" />
                Contact Support
              </Button>
              <Button onClick={() => navigate("/help")} className="bg-gradient-to-r from-primary to-secondary">
                <Heart size={16} className="mr-2" />
                Help Center
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}