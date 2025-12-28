import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle,
  QrCode,
  Link,
  Database,
  Verified,
  Search,
  FileText,
  Globe,
  TrendingUp,
  Users,
  Clock,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface HalalCertification {
  id: string;
  product_name: string;
  company: string;
  certification_body: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
  blockchain_hash: string;
  verification_count: number;
  category: string;
  ingredients: string[];
  manufacturing_location: string;
  qr_code: string;
  is_verified: boolean;
}

const mockCertifications: HalalCertification[] = [
  {
    id: '1',
    product_name: 'Organic Chicken Breast',
    company: 'Halal Foods International',
    certification_body: 'Islamic Society of North America (ISNA)',
    certificate_number: 'ISNA-2024-001234',
    issue_date: '2024-01-15T00:00:00Z',
    expiry_date: '2025-01-15T00:00:00Z',
    status: 'active',
    blockchain_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    verification_count: 1247,
    category: 'Meat & Poultry',
    ingredients: ['Organic Chicken', 'Natural Seasonings'],
    manufacturing_location: 'Ontario, Canada',
    qr_code: 'QR123456789',
    is_verified: true
  },
  {
    id: '2',
    product_name: 'Premium Dates',
    company: 'Desert Gold Trading',
    certification_body: 'Halal Certification Authority Australia (HCAA)',
    certificate_number: 'HCAA-2024-005678',
    issue_date: '2024-03-10T00:00:00Z',
    expiry_date: '2025-03-10T00:00:00Z',
    status: 'active',
    blockchain_hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    verification_count: 892,
    category: 'Fruits & Nuts',
    ingredients: ['Medjool Dates', 'Natural Preservatives'],
    manufacturing_location: 'Medina, Saudi Arabia',
    qr_code: 'QR987654321',
    is_verified: true
  }
];

const categories = ['All Categories', 'Meat & Poultry', 'Fruits & Nuts', 'Snacks', 'Beverages', 'Dairy', 'Cosmetics'];
const statusOptions = ['All Status', 'active', 'expired', 'suspended', 'pending'];

export default function BlockchainHalal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [certifications, setCertifications] = useState<HalalCertification[]>(mockCertifications);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertification, setSelectedCertification] = useState<HalalCertification | null>(null);

  const filteredCertifications = certifications.filter(cert => {
    const matchesCategory = selectedCategory === 'All Categories' || cert.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || cert.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      cert.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const activeCertifications = certifications.filter(cert => cert.status === 'active');
  const totalVerifications = certifications.reduce((sum, cert) => sum + cert.verification_count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'expired': return 'bg-red-500/20 text-red-600';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-600';
      case 'pending': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Meat & Poultry': 'bg-red-500/20 text-red-600',
      'Fruits & Nuts': 'bg-green-500/20 text-green-600',
      'Snacks': 'bg-orange-500/20 text-orange-600',
      'Beverages': 'bg-blue-500/20 text-blue-600',
      'Dairy': 'bg-yellow-500/20 text-yellow-600',
      'Cosmetics': 'bg-purple-500/20 text-purple-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const verifyCertificate = (certId: string) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === certId 
        ? { ...cert, verification_count: cert.verification_count + 1 }
        : cert
    ));
  };

  return (
    <ProtectedPageLayout 
      title="Blockchain Halal Certification" 
      subtitle="Transparent and immutable halal certification verification system"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Blockchain Halal Certification</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Immutable, transparent, and trustworthy halal verification system
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{activeCertifications.length}</p>
                <p className="text-xs text-muted-foreground">Active certificates</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Database size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{totalVerifications.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total verifications</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Link size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">100%</p>
                <p className="text-xs text-muted-foreground">Blockchain secured</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Award size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Trusted</p>
                <p className="text-xs text-muted-foreground">Global standard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by product name, company, or certificate number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[140px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="certificates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="verify">Verify Product</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertifications.map((certification, index) => (
                <Card 
                  key={certification.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Shield size={32} className="text-white relative z-10" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {certification.is_verified && (
                        <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                          <Verified size={12} />
                          Verified
                        </Badge>
                      )}
                      <Badge className={cn("text-xs", getStatusColor(certification.status))}>
                        {certification.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {certification.verification_count} verifications
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <Badge className={cn("text-xs", getCategoryColor(certification.category))}>
                        {certification.category}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg line-clamp-2">{certification.product_name}</h3>
                    <p className="text-sm text-muted-foreground">{certification.company}</p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText size={14} />
                        <span>{certification.certificate_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <span>{certification.manufacturing_location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>Expires: {new Date(certification.expiry_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Blockchain Hash</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          <Link size={12} className="mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="text-xs font-mono bg-muted p-2 rounded truncate">
                        {certification.blockchain_hash}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Authority:</span>
                        <p className="font-medium text-xs">{certification.certification_body}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCertification(certification)}
                          className="gap-2"
                        >
                          <FileText size={14} />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => verifyCertificate(certification.id)}
                          className="gap-2"
                        >
                          <CheckCircle size={14} />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode size={20} />
                  Verify Halal Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Scan QR Code</h3>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <QrCode size={48} className="mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Point camera at QR code</p>
                        <Button size="sm">
                          Open Camera
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Manual Verification</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Certificate Number</label>
                        <input
                          type="text"
                          placeholder="Enter certificate number..."
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Blockchain Hash</label>
                        <input
                          type="text"
                          placeholder="Enter blockchain hash..."
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none"
                        />
                      </div>
                      <Button className="w-full gap-2">
                        <Search size={16} />
                        Verify Certificate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">{activeCertifications.length}</p>
                  <p className="text-sm text-muted-foreground">Active Certificates</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">{totalVerifications.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Verifications</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <Database size={20} className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Blockchain Secured</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                    <Award size={20} className="text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Certificate Details Modal */}
        {selectedCertification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedCertification.product_name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCertification(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Company:</span>
                    <p>{selectedCertification.company}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p>{selectedCertification.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Certificate Number:</span>
                    <p>{selectedCertification.certificate_number}</p>
                  </div>
                  <div>
                    <span className="font-medium">Certification Body:</span>
                    <p>{selectedCertification.certification_body}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertification.ingredients.map(ingredient => (
                      <Badge key={ingredient} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="capitalize font-medium">{selectedCertification.status}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                    >
                      <QrCode size={16} />
                      Show QR
                    </Button>
                    <Button
                      onClick={() => {
                        verifyCertificate(selectedCertification.id);
                        setSelectedCertification(null);
                      }}
                      className="gap-2"
                    >
                      <CheckCircle size={16} />
                      Verify Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}