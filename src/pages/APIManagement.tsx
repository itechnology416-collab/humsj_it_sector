import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  Code,
  Activity,
  Shield,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface APIKey {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'expired';
  created_date: string;
  last_used: string;
  usage_count: number;
  rate_limit: number;
  expires_at?: string;
  environment: 'development' | 'staging' | 'production';
}

interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  category: string;
  auth_required: boolean;
  rate_limit: number;
  response_time: number;
  success_rate: number;
  total_calls: number;
  status: 'active' | 'deprecated' | 'maintenance';
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Mobile App Production',
    key: 'sk_prod_1234567890abcdef',
    description: 'Production API key for the main mobile application',
    permissions: ['prayer_times', 'quran_api', 'user_management'],
    status: 'active',
    created_date: '2024-01-15T10:00:00Z',
    last_used: '2024-12-25T09:30:00Z',
    usage_count: 125430,
    rate_limit: 10000,
    environment: 'production'
  },
  {
    id: '2',
    name: 'Web Dashboard',
    key: 'sk_dev_abcdef1234567890',
    description: 'Development key for web dashboard testing',
    permissions: ['admin_access', 'analytics', 'content_management'],
    status: 'active',
    created_date: '2024-02-20T14:30:00Z',
    last_used: '2024-12-24T16:45:00Z',
    usage_count: 8920,
    rate_limit: 5000,
    environment: 'development'
  },
  {
    id: '3',
    name: 'Legacy Integration',
    key: 'sk_old_9876543210fedcba',
    description: 'Deprecated key for old system integration',
    permissions: ['basic_access'],
    status: 'expired',
    created_date: '2023-06-10T08:00:00Z',
    last_used: '2024-11-15T12:00:00Z',
    usage_count: 45670,
    rate_limit: 1000,
    expires_at: '2024-12-01T00:00:00Z',
    environment: 'production'
  }
];

const mockEndpoints: APIEndpoint[] = [
  {
    id: '1',
    path: '/api/v1/prayer-times',
    method: 'GET',
    description: 'Get prayer times for a specific location',
    category: 'Islamic Services',
    auth_required: true,
    rate_limit: 1000,
    response_time: 120,
    success_rate: 99.8,
    total_calls: 45230,
    status: 'active'
  },
  {
    id: '2',
    path: '/api/v1/quran/verses',
    method: 'GET',
    description: 'Retrieve Quran verses with translations',
    category: 'Content',
    auth_required: true,
    rate_limit: 500,
    response_time: 85,
    success_rate: 99.9,
    total_calls: 78920,
    status: 'active'
  },
  {
    id: '3',
    path: '/api/v1/users',
    method: 'POST',
    description: 'Create new user account',
    category: 'User Management',
    auth_required: true,
    rate_limit: 100,
    response_time: 200,
    success_rate: 98.5,
    total_calls: 12450,
    status: 'active'
  }
];

export default function APIManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>(mockEndpoints);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);

  const activeKeys = apiKeys.filter(key => key.status === 'active');
  const totalCalls = apiKeys.reduce((sum, key) => sum + key.usage_count, 0);
  const avgResponseTime = endpoints.reduce((sum, endpoint) => sum + endpoint.response_time, 0) / endpoints.length;

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'inactive': return 'bg-gray-500/20 text-gray-600';
      case 'expired': return 'bg-red-500/20 text-red-600';
      case 'deprecated': return 'bg-orange-500/20 text-orange-600';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-red-500/20 text-red-600';
      case 'staging': return 'bg-yellow-500/20 text-yellow-600';
      case 'development': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-600';
      case 'POST': return 'bg-blue-500/20 text-blue-600';
      case 'PUT': return 'bg-orange-500/20 text-orange-600';
      case 'DELETE': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedPageLayout 
      title="API Management" 
      subtitle="Manage API keys, endpoints, and developer tools"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Code size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">API Management Center</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage API keys, monitor usage, and access developer tools
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Key size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{activeKeys.length} Active Keys</p>
                <p className="text-xs text-muted-foreground">API keys in use</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{totalCalls.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total API calls</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <BarChart3 size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{Math.round(avgResponseTime)}ms</p>
                <p className="text-xs text-muted-foreground">Avg response time</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">99.8%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="keys" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">API Keys Management</h3>
              <Button className="gap-2">
                <Plus size={16} />
                Generate New Key
              </Button>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey, index) => (
                <Card 
                  key={apiKey.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Key size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getStatusColor(apiKey.status))}>
                            {apiKey.status}
                          </Badge>
                          <Badge className={cn("text-xs", getEnvironmentColor(apiKey.environment))}>
                            {apiKey.environment}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{apiKey.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{apiKey.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">API Key:</span>
                            <div className="flex items-center gap-2 bg-muted rounded px-3 py-1">
                              <code className="text-sm">
                                {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                className="w-6 h-6 p-0"
                              >
                                {showKeys[apiKey.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(apiKey.key)}
                                className="w-6 h-6 p-0"
                              >
                                <Copy size={12} />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Created:</span>
                              <p>{new Date(apiKey.created_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Last Used:</span>
                              <p>{new Date(apiKey.last_used).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Usage:</span>
                              <p>{apiKey.usage_count.toLocaleString()} calls</p>
                            </div>
                            <div>
                              <span className="font-medium">Rate Limit:</span>
                              <p>{apiKey.rate_limit.toLocaleString()}/hour</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium">Permissions:</span>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.permissions.map((permission, permIndex) => (
                              <Badge key={permIndex} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedKey(apiKey)}
                          className="gap-2"
                        >
                          <Activity size={14} />
                          View Usage
                        </Button>
                        
                        {apiKey.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <RefreshCw size={14} />
                            Regenerate
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">API Endpoints</h3>
              <Button variant="outline" className="gap-2">
                <RefreshCw size={16} />
                Refresh Status
              </Button>
            </div>

            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card 
                  key={endpoint.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Code size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getMethodColor(endpoint.method))}>
                            {endpoint.method}
                          </Badge>
                          <Badge className={cn("text-xs", getStatusColor(endpoint.status))}>
                            {endpoint.status}
                          </Badge>
                          {endpoint.auth_required && (
                            <Badge variant="outline" className="text-xs">
                              <Shield size={10} className="mr-1" />
                              Auth Required
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {endpoint.path}
                          </code>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Response Time:</span>
                            <p className="text-green-600">{endpoint.response_time}ms</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Success Rate:</span>
                            <p className="text-green-600">{endpoint.success_rate}%</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Total Calls:</span>
                            <p>{endpoint.total_calls.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Rate Limit:</span>
                            <p>{endpoint.rate_limit}/min</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Activity size={14} />
                          Test
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Code size={14} />
                          Docs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today</span>
                      <span className="font-medium">12,450 calls</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Week</span>
                      <span className="font-medium">89,320 calls</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-medium">345,670 calls</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {endpoints.slice(0, 3).map((endpoint, index) => (
                      <div key={endpoint.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", getMethodColor(endpoint.method))}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-xs">{endpoint.path.split('/').pop()}</code>
                        </div>
                        <span className="text-sm font-medium">{endpoint.total_calls.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="font-medium text-green-600">99.8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Response</span>
                      <span className="font-medium">{Math.round(avgResponseTime)}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-medium text-green-600">0.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Getting Started</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm mb-3">
                      Welcome to the Islamic Community Platform API. This RESTful API provides access to prayer times, 
                      Quran content, user management, and community features.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Base URL:</strong> <code>https://api.islamicplatform.com/v1</code></p>
                      <p className="text-sm"><strong>Authentication:</strong> Bearer token required</p>
                      <p className="text-sm"><strong>Rate Limits:</strong> Varies by endpoint and plan</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Quick Examples</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Get Prayer Times</h5>
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono">
                        <div className="text-green-400">GET</div>
                        <div className="mt-1">/api/v1/prayer-times?city=Addis+Ababa&country=Ethiopia</div>
                        <div className="mt-2 text-gray-400">Headers:</div>
                        <div className="text-blue-400">Authorization: Bearer your_api_key</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Get Quran Verses</h5>
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono">
                        <div className="text-green-400">GET</div>
                        <div className="mt-1">/api/v1/quran/verses?surah=1&ayah=1-7</div>
                        <div className="mt-2 text-gray-400">Headers:</div>
                        <div className="text-blue-400">Authorization: Bearer your_api_key</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="gap-2">
                    <Code size={16} />
                    View Full Documentation
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Activity size={16} />
                    API Playground
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Key Details Modal */}
        {selectedKey && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>API Key Usage - {selectedKey.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedKey(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Usage Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Calls:</span>
                        <span className="font-medium">{selectedKey.usage_count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate Limit:</span>
                        <span className="font-medium">{selectedKey.rate_limit.toLocaleString()}/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Environment:</span>
                        <Badge className={cn("text-xs", getEnvironmentColor(selectedKey.environment))}>
                          {selectedKey.environment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{new Date(selectedKey.created_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Used:</span>
                        <span>{new Date(selectedKey.last_used).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={cn("text-xs", getStatusColor(selectedKey.status))}>
                          {selectedKey.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedKey.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button className="gap-2">
                    <RefreshCw size={16} />
                    Regenerate Key
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Activity size={16} />
                    View Logs
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