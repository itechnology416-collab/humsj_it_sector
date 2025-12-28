import { useState, useEffect } from 'react';
import { halalMarketplaceApi } from '@/services/halalMarketplaceApi';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  Search,
  Filter,
  Heart,
  ExternalLink,
  CheckCircle,
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Briefcase,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface HalalMarketplaceProps {
  className?: string;
}

interface Business {
  id: string;
  name: string;
  category: 'restaurant' | 'grocery' | 'services' | 'clothing' | 'education' | 'healthcare';
  description: string;
  address: string;
  phone: string;
  website?: string;
  hours: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isHalalCertified: boolean;
  image: string;
  tags: string[];
  distance?: number;
  priceRange: '$' | '$$' | '$$$';
}

const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Al-Barakah Restaurant',
    category: 'restaurant',
    description: 'Authentic Middle Eastern cuisine with fresh halal ingredients. Family-owned restaurant serving traditional dishes.',
    address: '123 Main St, Harar, Ethiopia',
    phone: '+251-25-666-1234',
    website: 'https://albarakah.et',
    hours: '11:00 AM - 10:00 PM',
    rating: 4.8,
    reviewCount: 127,
    isVerified: true,
    isHalalCertified: true,
    image: '/api/placeholder/300/200',
    tags: ['Middle Eastern', 'Family Friendly', 'Takeout'],
    distance: 0.8,
    priceRange: '$$'
  },
  {
    id: '2',
    name: 'Halal Mart & Grocery',
    category: 'grocery',
    description: 'Complete halal grocery store with fresh meat, international products, and Islamic books.',
    address: '456 Islamic Ave, Harar, Ethiopia',
    phone: '+251-25-666-5678',
    hours: '8:00 AM - 9:00 PM',
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    isHalalCertified: true,
    image: '/api/placeholder/300/200',
    tags: ['Groceries', 'Halal Meat', 'Islamic Books'],
    distance: 1.2,
    priceRange: '$'
  },
  {
    id: '3',
    name: 'Islamic Learning Center',
    category: 'education',
    description: 'Quran classes, Arabic language courses, and Islamic studies for all ages.',
    address: '789 Education Blvd, Harar, Ethiopia',
    phone: '+251-25-666-9012',
    website: 'https://islamiclearning.et',
    hours: '9:00 AM - 6:00 PM',
    rating: 4.9,
    reviewCount: 156,
    isVerified: true,
    isHalalCertified: false,
    image: '/api/placeholder/300/200',
    tags: ['Quran Classes', 'Arabic', 'Children Programs'],
    distance: 2.1,
    priceRange: '$$'
  },
  {
    id: '4',
    name: 'Modest Fashion Boutique',
    category: 'clothing',
    description: 'Beautiful modest clothing for Muslim women. Hijabs, abayas, and contemporary Islamic fashion.',
    address: '321 Fashion St, Harar, Ethiopia',
    phone: '+251-25-666-3456',
    hours: '10:00 AM - 8:00 PM',
    rating: 4.7,
    reviewCount: 73,
    isVerified: true,
    isHalalCertified: false,
    image: '/api/placeholder/300/200',
    tags: ['Modest Fashion', 'Hijabs', 'Abayas'],
    distance: 1.5,
    priceRange: '$$'
  },
  {
    id: '5',
    name: 'Halal Catering Services',
    category: 'services',
    description: 'Professional halal catering for weddings, corporate events, and special occasions.',
    address: '654 Service Rd, Harar, Ethiopia',
    phone: '+251-25-666-7890',
    website: 'https://halalcatering.et',
    hours: 'By Appointment',
    rating: 4.5,
    reviewCount: 42,
    isVerified: true,
    isHalalCertified: true,
    image: '/api/placeholder/300/200',
    tags: ['Catering', 'Events', 'Weddings'],
    distance: 3.2,
    priceRange: '$$$'
  },
  {
    id: '6',
    name: 'Dr. Ahmed Medical Clinic',
    category: 'healthcare',
    description: 'Family medicine with Islamic values. Experienced Muslim doctor providing comprehensive healthcare.',
    address: '987 Health Ave, Harar, Ethiopia',
    phone: '+251-25-666-2468',
    hours: '8:00 AM - 5:00 PM',
    rating: 4.8,
    reviewCount: 91,
    isVerified: true,
    isHalalCertified: false,
    image: '/api/placeholder/300/200',
    tags: ['Family Medicine', 'Muslim Doctor', 'Insurance Accepted'],
    distance: 1.8,
    priceRange: '$$'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Store },
  { id: 'restaurant', name: 'Restaurants', icon: Utensils },
  { id: 'grocery', name: 'Grocery Stores', icon: ShoppingBag },
  { id: 'services', name: 'Services', icon: Briefcase },
  { id: 'clothing', name: 'Clothing', icon: Home },
  { id: 'education', name: 'Education', icon: Users },
  { id: 'healthcare', name: 'Healthcare', icon: Heart }
];

export default function HalalMarketplace({ className }: HalalMarketplaceProps) {
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('halal-marketplace-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem('halal-marketplace-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let filtered = businesses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    // Sort businesses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
  }, [businesses, searchQuery, selectedCategory, sortBy]);

  const toggleFavorite = (businessId: string) => {
    setFavorites(prev => 
      prev.includes(businessId)
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find(c => c.id === category);
    return categoryData?.icon || Store;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      restaurant: 'text-orange-500 bg-orange-500/20',
      grocery: 'text-green-500 bg-green-500/20',
      services: 'text-blue-500 bg-blue-500/20',
      clothing: 'text-purple-500 bg-purple-500/20',
      education: 'text-indigo-500 bg-indigo-500/20',
      healthcare: 'text-red-500 bg-red-500/20'
    };
    return colors[category as keyof typeof colors] || 'text-gray-500 bg-gray-500/20';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Store size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display">Halal Marketplace</h3>
              <p className="text-sm text-muted-foreground">Discover halal businesses in your community</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search businesses, food, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon size={16} />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex-shrink-0 gap-2"
            >
              <IconComponent size={16} />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredBusinesses.length} businesses found
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle size={16} className="text-green-500" />
          <span>Halal Certified</span>
        </div>
      </div>

      {/* Business Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => {
          const CategoryIcon = getCategoryIcon(business.category);
          const isFavorite = favorites.includes(business.id);
          
          return (
            <Card key={business.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center">
                  <CategoryIcon size={48} className="text-primary/30" />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {business.isVerified && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                  {business.isHalalCertified && (
                    <Badge className="bg-green-500 text-white text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Halal Certified
                    </Badge>
                  )}
                </div>

                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(business.id)}
                  className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/90 hover:bg-white"
                >
                  <Heart 
                    size={16} 
                    className={cn(
                      "transition-colors",
                      isFavorite ? "text-red-500 fill-red-500" : "text-muted-foreground"
                    )} 
                  />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {business.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", getCategoryColor(business.category))}>
                          <CategoryIcon size={14} />
                        </div>
                        <span className="text-sm text-muted-foreground capitalize">
                          {business.category}
                        </span>
                        <span className="text-sm font-medium">{business.priceRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="font-medium">{business.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({business.reviewCount} reviews)
                    </span>
                    {business.distance && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {business.distance} km away
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {business.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {business.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={14} />
                      <span className="truncate">{business.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} />
                      <span>{business.hours}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => window.open(`tel:${business.phone}`, '_self')}
                    >
                      <Phone size={14} />
                      Call
                    </Button>
                    {business.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => window.open(business.website, '_blank')}
                      >
                        <ExternalLink size={14} />
                        Visit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBusinesses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Store size={64} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse different categories.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Business CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-card to-accent/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <Store size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Own a Halal Business?</h3>
          <p className="text-muted-foreground mb-4">
            Join our marketplace and connect with the Muslim community in your area.
          </p>
          <Button className="gap-2">
            <Store size={16} />
            Add Your Business
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}