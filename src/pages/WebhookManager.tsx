import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Webhook, 
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Settings,
  Activity,
  Send,
  RefreshCw,
  Copy,
  Trash2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  created_date: string;
  last_triggered: string;
  success_count: number;
  failure_count: number;
  secret: string;
  timeout: number;
  retry_count: number;
  headers: Record<string, string>;
}

interface WebhookEvent {
  id: string;
  webhook_id: string;
  event_type: string;
  status: 'success' | 'failed' | 'pending' | 'retrying';
  timestamp: string;
  response_code?: number;
  response_time?: number;
  payload: unknown;
  error_message?: string;
  retry_count: number;
}

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: '1',
    name: 'User Registration Notifications',
    url: 'https://api.example.com/webhooks/user-registration',
    description: 'Triggered when a new user registers on the platform',
    events: ['user.created', 'user.verified'],
    status: 'active',
    created_date: '2024-01-15T10:00:00Z',
    last_triggered: '2024-12-25T09:30:00Z',
    success_count: 1245,
    failure_count: 12,
    secret: 'whsec_1234567890abcdef',
    timeout: 30,
    retry_count: 3,
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'islamic-platform'
    }
  },
  {
    id: '2',
    name: 'Prayer Time Updates',
    url: 'https://notifications.mosque.org/prayer-times',
    description: 'Sends prayer time updates to mosque notification system',
    events: ['prayer.time_updated', 'prayer.reminder'],
    status: 'active',
    created_date: '2024-02-20T14:30:00Z',
    last_triggered: '2024-12-25T05:00:00Z',
    success_count: 8920,
    failure_count: 5,
    secret: 'whsec_abcdef1234567890',
    timeout: 15,
    retry_count: 2,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    id: '3',
    name: 'Community Events Sync',
    url: 'https://calendar.community.org/events/webhook',
    description: 'Synchronizes community events with external calendar system',
    events: ['event.created', 'event.updated', 'event.cancelled'],
    status: 'failed',
    created_date: '2024-03-10T08:00:00Z',
    last_triggered: '2024-12-24T16:45:00Z',
    success_count: 456,
    failure_count: 23,
    secret: 'whsec_9876543210fedcba',
    timeout: 45,
    retry_count: 5,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    }
  }
];

const mockEvents: WebhookEvent[] = [
  {
    id: '1',
    webhook_id: '1',
    event_type: 'user.created',
    status: 'success',
    timestamp: '2024-12-25T09:30:00Z',
    response_code: 200,
    response_time: 120,
    payload: { user_id: 'user_123', email: 'user@example.com' },
    retry_count: 0
  },
  {
    id: '2',
    webhook_id: '2',
    event_type: 'prayer.time_updated',
    status: 'success',
    timestamp: '2024-12-25T05:00:00Z',
    response_code: 200,
    response_time: 85,
    payload: { location: 'Addis Ababa', prayer: 'Fajr', time: '05:30' },
    retry_count: 0
  },
  {
    id: '3',
    webhook_id: '3',
    event_type: 'event.created',
    status: 'failed',
    timestamp: '2024-12-24T16:45:00Z',
    response_code: 500,
    response_time: 5000,
    payload: { event_id: 'evt_456', title: 'Friday Khutbah' },
    error_message: 'Internal server error',
    retry_count: 3
  }
];

const availableEvents = [
  'user.created', 'user.updated', 'user.deleted', 'user.verified',
  'prayer.time_updated', 'prayer.reminder',
  'event.created', 'event.updated', 'event.cancelled',
  'donation.received', 'donation.completed',
  'content.published', 'content.updated'
];

export default function WebhookManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
  const [events, setEvents] = useState<WebhookEvent[]>(mockEvents);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);

  const activeWebhooks = webhooks.filter(w => w.status === 'active');
  const failedWebhooks = webhooks.filter(w => w.status === 'failed');
  const totalEvents = events.length;
  const successRate = events.filter(e => e.status === 'success').length / totalEvents * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'inactive': return 'bg-gray-500/20 text-gray-600';
      case 'failed': return 'bg-red-500/20 text-red-600';
      case 'success': return 'bg-green-500/20 text-green-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'retrying': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} className="text-green-600" />;
      case 'inactive': return <XCircle size={16} className="text-gray-600" />;
      case 'failed': return <AlertTriangle size={16} className="text-red-600" />;
      case 'success': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'retrying': return <RefreshCw size={16} className="text-blue-600 animate-spin" />;
      default: return <AlertTriangle size={16} className="text-muted-foreground" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testWebhook = (webhookId: string) => {
    // Simulate webhook test
    console.log(`Testing webhook ${webhookId}`);
  };

  const retryEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'retrying' as const }
        : event
    ));
  };

  return (
    <ProtectedPageLayout 
      title="Webhook Manager" 
      subtitle="Manage real-time integrations and webhook endpoints"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Webhook size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Webhook Manager</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure real-time integrations and monitor webhook deliveries
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
                <p className="text-sm font-medium">{activeWebhooks.length} Active</p>
                <p className="text-xs text-muted-foreground">Webhook endpoints</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium">{failedWebhooks.length} Failed</p>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{totalEvents}</p>
                <p className="text-xs text-muted-foreground">Events delivered</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Zap size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{Math.round(successRate)}%</p>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="webhooks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="events">Event Log</TabsTrigger>
            <TabsTrigger value="create">Create Webhook</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Webhook Endpoints</h3>
              <Button className="gap-2">
                <Plus size={16} />
                Add Webhook
              </Button>
            </div>

            <div className="space-y-4">
              {webhooks.map((webhook, index) => (
                <Card 
                  key={webhook.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <Webhook size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getStatusColor(webhook.status))}>
                            {getStatusIcon(webhook.status)}
                            <span className="ml-1">{webhook.status}</span>
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{webhook.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{webhook.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">URL:</span>
                            <code className="bg-muted px-2 py-1 rounded text-sm">{webhook.url}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(webhook.url)}
                              className="w-6 h-6 p-0"
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Success:</span>
                              <p className="text-green-600">{webhook.success_count.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Failures:</span>
                              <p className="text-red-600">{webhook.failure_count}</p>
                            </div>
                            <div>
                              <span className="font-medium">Timeout:</span>
                              <p>{webhook.timeout}s</p>
                            </div>
                            <div>
                              <span className="font-medium">Last Triggered:</span>
                              <p>{new Date(webhook.last_triggered).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium">Events:</span>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event, eventIndex) => (
                              <Badge key={eventIndex} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => testWebhook(webhook.id)}
                          className="gap-2"
                        >
                          <Send size={14} />
                          Test
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedWebhook(webhook)}
                          className="gap-2"
                        >
                          <Settings size={14} />
                          Configure
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Activity size={14} />
                          Logs
                        </Button>
                        
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

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Event Delivery Log</h3>
              <Button variant="outline" className="gap-2">
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <Card 
                  key={event.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                        event.status === 'success' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        event.status === 'failed' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                        'bg-gradient-to-br from-yellow-500 to-orange-600'
                      )}>
                        {getStatusIcon(event.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getStatusColor(event.status))}>
                            {event.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium text-muted-foreground">Timestamp:</span>
                            <p>{new Date(event.timestamp).toLocaleString()}</p>
                          </div>
                          {event.response_code && (
                            <div>
                              <span className="font-medium text-muted-foreground">Response:</span>
                              <p className={event.response_code < 400 ? 'text-green-600' : 'text-red-600'}>
                                {event.response_code}
                              </p>
                            </div>
                          )}
                          {event.response_time && (
                            <div>
                              <span className="font-medium text-muted-foreground">Response Time:</span>
                              <p>{event.response_time}ms</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-muted-foreground">Retries:</span>
                            <p>{event.retry_count}</p>
                          </div>
                        </div>

                        {event.error_message && (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-600">
                              <strong>Error:</strong> {event.error_message}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                          className="gap-2"
                        >
                          <Eye size={14} />
                          View
                        </Button>
                        
                        {event.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retryEvent(event.id)}
                            className="gap-2"
                          >
                            <RefreshCw size={14} />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Webhook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Webhook Name</label>
                      <Input 
                        placeholder="Enter webhook name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Endpoint URL</label>
                      <Input 
                        placeholder="https://your-app.com/webhook"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input 
                        placeholder="Describe what this webhook does"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Timeout (seconds)</label>
                      <Input 
                        type="number"
                        placeholder="30"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Retry Count</label>
                      <Input 
                        type="number"
                        placeholder="3"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Secret Key</label>
                      <Input 
                        placeholder="Auto-generated if empty"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Select Events</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableEvents.map((event, index) => (
                      <label key={index} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{event}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Custom Headers</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Header name" />
                      <Input placeholder="Header value" />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus size={14} />
                      Add Header
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="gap-2">
                    <Plus size={16} />
                    Create Webhook
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Send size={16} />
                    Test Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Timeout</label>
                    <Input 
                      type="number"
                      defaultValue="30"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Default timeout for new webhooks (seconds)
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Default Retry Count</label>
                    <Input 
                      type="number"
                      defaultValue="3"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Default number of retries for failed webhooks
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Rate Limit</label>
                    <Input 
                      type="number"
                      defaultValue="1000"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum webhook calls per hour
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Require HTTPS</p>
                      <p className="text-xs text-muted-foreground">
                        Only allow HTTPS webhook URLs
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Verify SSL Certificates</p>
                      <p className="text-xs text-muted-foreground">
                        Verify SSL certificates for webhook endpoints
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enable Signature Verification</p>
                      <p className="text-xs text-muted-foreground">
                        Include HMAC signature in webhook headers
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Webhook Configuration Modal */}
        {selectedWebhook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configure Webhook - {selectedWebhook.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedWebhook(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Webhook Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>URL:</strong> {selectedWebhook.url}</p>
                      <p><strong>Status:</strong> {selectedWebhook.status}</p>
                      <p><strong>Timeout:</strong> {selectedWebhook.timeout}s</p>
                      <p><strong>Retry Count:</strong> {selectedWebhook.retry_count}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Success:</strong> {selectedWebhook.success_count.toLocaleString()}</p>
                      <p><strong>Failures:</strong> {selectedWebhook.failure_count}</p>
                      <p><strong>Success Rate:</strong> {Math.round((selectedWebhook.success_count / (selectedWebhook.success_count + selectedWebhook.failure_count)) * 100)}%</p>
                      <p><strong>Last Triggered:</strong> {new Date(selectedWebhook.last_triggered).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWebhook.events.map((event, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Headers</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedWebhook.headers).map(([key, value], index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <code className="bg-muted px-2 py-1 rounded">{key}</code>
                        <span>:</span>
                        <code className="bg-muted px-2 py-1 rounded">{value}</code>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button className="gap-2">
                    <Settings size={16} />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testWebhook(selectedWebhook.id)}
                    className="gap-2"
                  >
                    <Send size={16} />
                    Test Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Event Details - {selectedEvent.event_type}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Event Type:</strong> {selectedEvent.event_type}</p>
                      <p><strong>Status:</strong> {selectedEvent.status}</p>
                      <p><strong>Timestamp:</strong> {new Date(selectedEvent.timestamp).toLocaleString()}</p>
                      <p><strong>Retry Count:</strong> {selectedEvent.retry_count}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Response Details</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.response_code && (
                        <p><strong>Response Code:</strong> {selectedEvent.response_code}</p>
                      )}
                      {selectedEvent.response_time && (
                        <p><strong>Response Time:</strong> {selectedEvent.response_time}ms</p>
                      )}
                      {selectedEvent.error_message && (
                        <p><strong>Error:</strong> {selectedEvent.error_message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Payload</h4>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                    <pre>{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  {selectedEvent.status === 'failed' && (
                    <Button
                      onClick={() => retryEvent(selectedEvent.id)}
                      className="gap-2"
                    >
                      <RefreshCw size={16} />
                      Retry Event
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(selectedEvent.payload, null, 2))}
                    className="gap-2"
                  >
                    <Copy size={16} />
                    Copy Payload
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