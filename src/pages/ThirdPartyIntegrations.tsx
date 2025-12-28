import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plug, 
  CheckCircle,
  XCircle,
  Settings,
  Key,
  Globe,
  Zap,
  Shield,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  last_sync: string;
  api_version: string;
  endpoints: number;
  monthly_calls: number;
  call_limit: number;
  features: string[];
  requires_auth: boolean;
  webhook_url?: string;
  is_premium: boolean;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Prayer Times API',
    description: 'Accurate prayer times for locations worldwide with multiple calculation methods.',
    category: 'Islamic Services',
    provider: 'IslamicFinder',
    status: 'connected',
    last_sync: '2024-12-25T10:30:00Z',
    api_version: 'v2.1',
    endpoints: 5,
    monthly_calls: 15420,
    call_limit: 50000,
    features: ['Prayer Times', 'Qibla Direction', 'Islamic Calendar'],
    requires_auth: true,
    webhook_url: 'https://api.example.com/webhook/prayer-times',
    is_premium: false
  },
  {
    id: '2',
    name: 'Quran API',
    description: 'Complete Quran text, translations, and audio recitations in multiple languages.',
    category: 'Islamic Content',
    provider: 'QuranAPI.org',
    status: 'connected',
    last_sync: '2024-12-25T09:15:00Z',
    api_version: 'v4.0',
    endpoints: 12,
    monthly_calls: 28750,
    call_limit: 100000,
    features: ['Quran Text', 'Translations', 'Audio', 'Search'],
    requires_auth: true,
    is_premium: true
  },
  {
    id: '3',
    name: 'Hadith Database',
    description: 'Comprehensive collection of authentic Hadith from major collections.',
    category: 'Islamic Content',
    provider: 'HadithAPI',
    status: 'error',
    last_sync: '2024-12-24T16:45:00Z',
    api_version: 'v1.5',
    endpoints: 8,
    monthly_calls: 8920,
    call_limit: 25000,
    features: ['Hadith Search', 'Collections', 'Authentication'],
    requires_auth: true,
    is_premium: false
  },
  {
    id: '4',
    name: 'Islamic Calendar',
    description: 'Hijri calendar conversion and Islamic events tracking.',
    category: 'Calendar Services',
    provider: 'HijriCalendar.com',
    status: 'disconnected',
    last_sync: '2024-12-20T12:00:00Z',
    api_version: 'v3.2',
    endpoints: 6,
    monthly_calls: 0,
    call_limit: 30000,
    features: ['Date Conversion', 'Islamic Events', 'Ramadan Times'],
    requires_auth: false,
    is_premium: false
  }
];

const categories = ['All Categories', 'Islamic Services', 'Islamic Content', 'Calendar Services', 'Payment', 'Communication', 'Analytics'];
const statusOptions = ['All Status', 'connected', 'disconnected', 'error', 'pending'];

export default function ThirdPartyIntegrations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'All Categories' || integration.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || integration.status === selectedStatus;
    
    return matchesCategory && matchesStatus;
  });

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const errorIntegrations = integrations.filter(i => i.status === 'error');
  const disconnectedIntegrations = integrations.filter(i => i.status === 'disconnected');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-600';
      case 'disconnected': return 'bg-gray-500/20 text-gray-600';
      case 'error': return 'bg-red-500/20 text-red-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Islamic Services': 'bg-green-500/20 text-green-600',
      'Islamic Content': 'bg-blue-500/20 text-blue-600',
      'Calendar Services': 'bg-purple-500/20 text-purple-600',
      'Payment': 'bg-orange-500/20 text-orange-600',
      'Communication': 'bg-pink-500/20 text-pink-600',
      'Analytics': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} className="text-green-600" />;
      case 'disconnected': return <XCircle size={16} className="text-gray-600" />;
      case 'error': return <AlertTriangle size={16} className="text-red-600" />;
      case 'pending': return <RefreshCw size={16} className="text-yellow-600 animate-spin" />;
      default: return <AlertTriangle size={16} className="text-muted-foreground" />;
    }
  };

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' as const, last_sync: new Date().toISOString() }
        : integration
    ));
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const }
        : integration
    ));
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, last_sync: new Date().toISOString() }
        : integration
    ));
  };

  return (
    <ProtectedPageLayout 
      title="Third-Party Integrations" 
      subtitle="Manage external API connections and service integrations"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Plug size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Third-Party Integrations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect with external services to enhance functionality
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
                <p className="text-sm font-medium">{connectedIntegrations.length} Connected</p>
                <p className="text-xs text-muted-foreground">Active integrations</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium">{errorIntegrations.length} Errors</p>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Zap size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">
                  {connectedIntegrations.reduce((sum, i) => sum + i.monthly_calls, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">API calls this month</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Shield size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Secure</p>
                <p className="text-xs text-muted-foreground">Encrypted connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[160px]"
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
              
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" className="gap-2">
                  <Plus size={16} />
                  Add Integration
                </Button>
                <Button className="gap-2">
                  <RefreshCw size={16} />
                  Sync All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Integrations</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIntegrations.map((integration, index) => (
                <Card 
                  key={integration.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Plug size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(integration.category))}>
                            {integration.category}
                          </Badge>
                          <Badge className={cn("text-xs", getStatusColor(integration.status))}>
                            {getStatusIcon(integration.status)}
                            <span className="ml-1">{integration.status}</span>
                          </Badge>
                          {integration.is_premium && (
                            <Badge className="bg-yellow-500 text-black text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Provider: {integration.provider}</span>
                            <span>API v{integration.api_version}</span>
                          </div>
                          
                          {integration.status === 'connected' && (
                            <>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Monthly Calls: {integration.monthly_calls.toLocaleString()}</span>
                                <span>Limit: {integration.call_limit.toLocaleString()}</span>
                              </div>
                              
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${(integration.monthly_calls / integration.call_limit) * 100}%` }}
                                ></div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground">
                                Last sync: {new Date(integration.last_sync).toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {integration.features.slice(0, 3).map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {integration.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{integration.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                      {integration.status === 'connected' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSync(integration.id)}
                            className="gap-2"
                          >
                            <RefreshCw size={14} />
                            Sync
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedIntegration(integration)}
                            className="gap-2"
                          >
                            <Settings size={14} />
                            Configure
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(integration.id)}
                            className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle size={14} />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                            className="gap-2"
                          >
                            <CheckCircle size={14} />
                            Connect
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <ExternalLink size={14} />
                            Learn More
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connected" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connectedIntegrations.map((integration, index) => (
                <Card 
                  key={integration.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up border-green-200 dark:border-green-800"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white text-xs">
                            Connected
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(integration.category))}>
                            {integration.category}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{integration.name}</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>API Calls</span>
                            <span>{integration.monthly_calls.toLocaleString()} / {integration.call_limit.toLocaleString()}</span>
                          </div>
                          
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(integration.monthly_calls / integration.call_limit) * 100}%` }}
                            ></div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Last sync: {new Date(integration.last_sync).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                      <Button
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        className="gap-2"
                      >
                        <RefreshCw size={14} />
                        Sync Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedIntegration(integration)}
                        className="gap-2"
                      >
                        <Settings size={14} />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            {errorIntegrations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No integration errors</h3>
                  <p className="text-muted-foreground">
                    All your integrations are working properly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {errorIntegrations.map((integration, index) => (
                  <Card 
                    key={integration.id}
                    className="hover:shadow-lg transition-all duration-300 animate-slide-up border-red-200 dark:border-red-800"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={20} className="text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-500 text-white text-xs">
                              Error
                            </Badge>
                            <Badge className={cn("text-xs", getCategoryColor(integration.category))}>
                              {integration.category}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Connection failed. Please check your API credentials.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last attempt: {new Date(integration.last_sync).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                            className="gap-2"
                          >
                            <RefreshCw size={14} />
                            Retry
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedIntegration(integration)}
                            className="gap-2"
                          >
                            <Settings size={14} />
                            Fix
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disconnectedIntegrations.map((integration, index) => (
                <Card 
                  key={integration.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                        <Plug size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-500 text-white text-xs">
                            Available
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(integration.category))}>
                            {integration.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {integration.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {integration.provider}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {integration.description}
                    </p>
                    
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration.id)}
                      className="w-full gap-2"
                    >
                      <Plus size={14} />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Configuration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configure {selectedIntegration.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIntegration(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Integration Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Provider:</strong> {selectedIntegration.provider}</p>
                      <p><strong>API Version:</strong> {selectedIntegration.api_version}</p>
                      <p><strong>Endpoints:</strong> {selectedIntegration.endpoints}</p>
                      <p><strong>Status:</strong> {selectedIntegration.status}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Usage Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Monthly Calls:</strong> {selectedIntegration.monthly_calls.toLocaleString()}</p>
                      <p><strong>Call Limit:</strong> {selectedIntegration.call_limit.toLocaleString()}</p>
                      <p><strong>Last Sync:</strong> {new Date(selectedIntegration.last_sync).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">API Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">API Key</label>
                      <Input 
                        type="password" 
                        placeholder="Enter your API key"
                        className="mt-1"
                      />
                    </div>
                    
                    {selectedIntegration.webhook_url && (
                      <div>
                        <label className="text-sm font-medium">Webhook URL</label>
                        <Input 
                          value={selectedIntegration.webhook_url}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntegration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button className="gap-2">
                    <Settings size={16} />
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSync(selectedIntegration.id)}
                    className="gap-2"
                  >
                    <RefreshCw size={16} />
                    Test Connection
                  </Button>
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