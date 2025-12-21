import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Image, 
  Video, 
  Calendar, 
  Users,
  Eye,
  Heart,
  Share2,
  Download,
  Filter,
  Search,
  Play,
  Camera,
  MapPin,
  Clock,
  Tag,
  Grid3X3,
  List,
  Star,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Media", icon: Image },
    { id: "events", name: "Events", icon: Calendar },
    { id: "prayers", name: "Prayer Services", icon: Users },
    { id: "education", name: "Educational", icon: Video },
    { id: "community", name: "Community", icon: Heart },
    { id: "campus", name: "Campus Life", icon: Camera }
  ];

  const mediaItems = [
    {
      id: 1,
      title: "Eid Celebration 2024",
      description: "Beautiful moments from our Eid ul-Fitr celebration with the entire HUMSJ community",
      category: "events",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-04-10",
      location: "Main Campus Auditorium",
      views: 1250,
      likes: 89,
      tags: ["eid", "celebration", "community", "festival"],
      featured: true,
      photographer: "Ahmed Hassan"
    },
    {
      id: 2,
      title: "Friday Prayer Gathering",
      description: "Weekly Jumu'ah prayer bringing together students from all departments",
      category: "prayers",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-02-16",
      location: "University Mosque",
      views: 890,
      likes: 156,
      tags: ["jummah", "prayer", "mosque", "worship"],
      featured: true,
      photographer: "Fatima Ali"
    },
    {
      id: 3,
      title: "Islamic Knowledge Workshop",
      description: "Educational workshop on Islamic finance and business ethics",
      category: "education",
      type: "video",
      thumbnail: "/placeholder.svg",
      date: "2024-02-12",
      location: "Conference Hall A",
      views: 567,
      likes: 78,
      tags: ["workshop", "education", "islamic-finance", "business"],
      featured: false,
      photographer: "Mohammed Ibrahim",
      duration: "45:30"
    },
    {
      id: 4,
      title: "Ramadan Iftar Program",
      description: "Community iftar program during the holy month of Ramadan",
      category: "events",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-03-25",
      location: "Student Center",
      views: 2100,
      likes: 234,
      tags: ["ramadan", "iftar", "community", "breaking-fast"],
      featured: true,
      photographer: "Aisha Mohammed"
    },
    {
      id: 5,
      title: "New Member Orientation",
      description: "Welcome ceremony for new HUMSJ members and introduction to community values",
      category: "community",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-01-15",
      location: "Main Hall",
      views: 445,
      likes: 67,
      tags: ["orientation", "new-members", "welcome", "community"],
      featured: false,
      photographer: "Omar Abdullah"
    },
    {
      id: 6,
      title: "Quran Recitation Competition",
      description: "Annual Quran recitation competition showcasing beautiful voices from our community",
      category: "events",
      type: "video",
      thumbnail: "/placeholder.svg",
      date: "2024-02-20",
      location: "University Auditorium",
      views: 1890,
      likes: 298,
      tags: ["quran", "recitation", "competition", "tilawah"],
      featured: true,
      photographer: "Yusuf Hassan",
      duration: "1:23:45"
    },
    {
      id: 7,
      title: "Campus Dawah Activities",
      description: "Students engaging in dawah activities and sharing Islamic knowledge with peers",
      category: "community",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-02-08",
      location: "Various Campus Locations",
      views: 678,
      likes: 123,
      tags: ["dawah", "outreach", "campus", "islamic-knowledge"],
      featured: false,
      photographer: "Khadija Omar"
    },
    {
      id: 8,
      title: "IT Skills Workshop",
      description: "Technical workshop on web development and digital skills for community members",
      category: "education",
      type: "video",
      thumbnail: "/placeholder.svg",
      date: "2024-02-14",
      location: "Computer Lab",
      views: 334,
      likes: 45,
      tags: ["technology", "workshop", "web-development", "skills"],
      featured: false,
      photographer: "Ibrahim Yusuf",
      duration: "2:15:20"
    },
    {
      id: 9,
      title: "Community Service Day",
      description: "HUMSJ members participating in community service and helping local families",
      category: "community",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-01-28",
      location: "Local Community",
      views: 756,
      likes: 189,
      tags: ["community-service", "volunteering", "helping", "charity"],
      featured: true,
      photographer: "Maryam Ahmed"
    },
    {
      id: 10,
      title: "Islamic Art Exhibition",
      description: "Beautiful display of Islamic calligraphy and art created by talented community members",
      category: "campus",
      type: "image",
      thumbnail: "/placeholder.svg",
      date: "2024-02-05",
      location: "Art Gallery",
      views: 523,
      likes: 98,
      tags: ["art", "calligraphy", "exhibition", "creativity"],
      featured: false,
      photographer: "Zainab Hassan"
    }
  ];

  const filteredItems = mediaItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredItems = mediaItems.filter(item => item.featured);

  const handleLike = (itemId: number) => {
    console.log(`Liked item ${itemId}`);
    // In a real app, this would update the like count
  };

  const handleShare = (itemId: number) => {
    console.log(`Shared item ${itemId}`);
    // In a real app, this would open share options
  };

  const handleDownload = (itemId: number) => {
    console.log(`Downloaded item ${itemId}`);
    // In a real app, this would trigger download
  };

  return (
    <PageLayout 
      title="Gallery" 
      subtitle="Explore photos and videos from HUMSJ events, activities, and community moments"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto shadow-red animate-glow">
            <Image size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Media Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the vibrant life of our Islamic community through photos and videos 
            from events, prayers, educational programs, and daily campus activities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Media", value: "500+", icon: Image, color: "text-primary" },
            { label: "Event Photos", value: "350", icon: Camera, color: "text-blue-500" },
            { label: "Videos", value: "45", icon: Video, color: "text-green-500" },
            { label: "Total Views", value: "25K+", icon: Eye, color: "text-purple-500" }
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

        {/* Featured Media */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star size={24} className="text-yellow-500" />
            <h2 className="text-2xl font-display tracking-wide">Featured Media</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.slice(0, 6).map((item, index) => (
              <div 
                key={item.id}
                className="bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full backdrop-blur-sm">Featured</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                      {item.type === "video" ? <Video size={10} /> : <Image size={10} />}
                      {item.type}
                    </span>
                  </div>
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary/80 transition-colors"
                    >
                      <Heart size={14} className="text-white" />
                    </button>
                    <button 
                      onClick={() => handleShare(item.id)}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary/80 transition-colors"
                    >
                      <Share2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {item.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {item.likes} likes
                    </span>
                  </div>
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
              placeholder="Search photos and videos..."
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
            <div className="flex border border-border/50 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card/50 hover:bg-primary/10"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card/50 hover:bg-primary/10"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {selectedCategory === "all" ? "All Media" : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-sm text-muted-foreground ml-2">({filteredItems.length} items)</span>
            </h3>
            <Button variant="outline" size="sm">
              <Upload size={16} className="mr-2" />
              Upload Media
            </Button>
          </div>
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                        {item.type === "video" ? <Video size={10} /> : <Image size={10} />}
                        {item.type}
                      </span>
                    </div>
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
                          <Play size={16} className="text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium mb-1 text-sm group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={10} />
                        {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-4">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
                            <Play size={12} className="text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h4>
                        <div className="flex gap-2">
                          {item.featured && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full">Featured</span>
                          )}
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                            {item.type === "video" ? <Video size={10} /> : <Image size={10} />}
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {item.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {item.likes} likes
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleLike(item.id)}>
                            <Heart size={14} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleShare(item.id)}>
                            <Share2 size={14} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(item.id)}>
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-display tracking-wide mb-4">Share Your Moments</h3>
            <p className="text-muted-foreground mb-6">
              Have photos or videos from HUMSJ events? Share them with the community to preserve our memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <Camera size={16} className="mr-2" />
                Upload Photos
              </Button>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Video size={16} className="mr-2" />
                Upload Videos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}