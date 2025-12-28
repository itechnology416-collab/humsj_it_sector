import { useState, useEffect , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText,
  Database,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Filter,
  Settings,
  Archive,
  Share2,
  Eye,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface ExportJob {
  id: string;
  name: string;
  description: string;
  data_type: string;
  format: 'CSV' | 'JSON' | 'XML' | 'PDF';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_date: string;
  completed_date?: string;
  file_size?: string;
  download_url?: string;
  expires_at: string;
  filters: Record<string, unknown>;
  progress: number;
  error_message?: string;
}

interface DataSource {
  id: string;
  name: string;
  description: string;
  category: string;
  record_count: number;
  last_updated: string;
  available_formats: string[];
  fields: string[];
  requires_permission: boolean;
}

const mockExportJobs: ExportJob[] = [
  {
    id: '1',
    name: 'User Data Export',
    description: 'Complete user profiles and activity data',
    data_type: 'users',
    format: 'CSV',
    status: 'completed',
    created_date: '2024-12-24T10:00:00Z',
    completed_date: '2024-12-24T10:15:00Z',
    file_size: '2.5 MB',
    download_url: 'https://exports.example.com/users_20241224.csv',
    expires_at: '2024-12-31T23:59:59Z',
    filters: { date_range: '2024-01-01 to 2024-12-24', status: 'active' },
    progress: 100
  },
  {
    id: '2',
    name: 'Prayer Times Data',
    description: 'Prayer times and location data for all users',
    data_type: 'prayer_times',
    format: 'JSON',
    status: 'processing',
    created_date: '2024-12-25T09:30:00Z',
    expires_at: '2025-01-01T23:59:59Z',
    filters: { location: 'Addis Ababa', year: '2024' },
    progress: 65
  },
  {
    id: '3',
    name: 'Community Events Export',
    description: 'All community events and attendance records',
    data_type: 'events',
    format: 'PDF',
    status: 'failed',
    created_date: '2024-12-23T14:20:00Z',
    expires_at: '2024-12-30T23:59:59Z',
    filters: { event_type: 'all', include_attendance: true },
    progress: 0,
    error_message: 'Insufficient permissions to access attendance data'
  }
];

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'User Profiles',
    description: 'User account information, preferences, and profile data',
    category: 'User Management',
    record_count: 15420,
    last_updated: '2024-12-25T09:00:00Z',
    available_formats: ['CSV', 'JSON', 'XML'],
    fields: ['id', 'name', 'email', 'created_date', 'last_login', 'preferences'],
    requires_permission: true
  },
  {
    id: '2',
    name: 'Prayer Times',
    description: 'Prayer time calculations and user prayer tracking data',
    category: 'Islamic Services',
    record_count: 89750,
    last_updated: '2024-12-25T05:30:00Z',
    available_formats: ['CSV', 'JSON'],
    fields: ['date', 'location', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
    requires_permission: false
  },
  {
    id: '3',
    name: 'Community Events',
    description: 'Event information, schedules, and attendance records',
    category: 'Community',
    record_count: 2340,
    last_updated: '2024-12-24T18:00:00Z',
    available_formats: ['CSV', 'JSON', 'PDF'],
    fields: ['id', 'title', 'date', 'location', 'attendees', 'description'],
    requires_permission: true
  },
  {
    id: '4',
    name: 'Quran Study Progress',
    description: 'User progress in Quran study and memorization',
    category: 'Education',
    record_count: 45670,
    last_updated: '2024-12-25T08:15:00Z',
    available_formats: ['CSV', 'JSON'],
    fields: ['user_id', 'surah', 'ayah', 'progress', 'last_studied', 'notes'],
    requires_permission: true
  },
  {
    id: '5',
    name: 'Donation Records',
    description: 'Donation transactions and financial records',
    category: 'Financial',
    record_count: 8920,
    last_updated: '2024-12-24T16:30:00Z',
    available_formats: ['CSV', 'PDF'],
    fields: ['id', 'amount', 'date', 'donor_id', 'purpose', 'payment_method'],
    requires_permission: true
  }
];

const categories = ['All Categories', 'User Management', 'Islamic Services', 'Community', 'Education', 'Financial'];
const formats = ['All Formats', 'CSV', 'JSON', 'XML', 'PDF'];
const statusOptions = ['All Status', 'pending', 'processing', 'completed', 'failed'];

export default function DataExport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(mockExportJobs);
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  const filteredSources = dataSources.filter(source => {
    const matchesCategory = selectedCategory === 'All Categories' || source.category === selectedCategory;
    return matchesCategory;
  });

  const filteredJobs = exportJobs.filter(job => {
    const matchesFormat = selectedFormat === 'All Formats' || job.format === selectedFormat;
    const matchesStatus = selectedStatus === 'All Status' || job.status === selectedStatus;
    return matchesFormat && matchesStatus;
  });

  const completedJobs = exportJobs.filter(job => job.status === 'completed');
  const processingJobs = exportJobs.filter(job => job.status === 'processing');
  const failedJobs = exportJobs.filter(job => job.status === 'failed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-600';
      case 'processing': return 'bg-blue-500/20 text-blue-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'failed': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'processing': return <RefreshCw size={16} className="text-blue-600 animate-spin" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'failed': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <AlertTriangle size={16} className="text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'User Management': 'bg-blue-500/20 text-blue-600',
      'Islamic Services': 'bg-green-500/20 text-green-600',
      'Community': 'bg-purple-500/20 text-purple-600',
      'Education': 'bg-orange-500/20 text-orange-600',
      'Financial': 'bg-red-500/20 text-red-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getFormatColor = (format: string) => {
    const colors: Record<string, string> = {
      'CSV': 'bg-green-500/20 text-green-600',
      'JSON': 'bg-blue-500/20 text-blue-600',
      'XML': 'bg-orange-500/20 text-orange-600',
      'PDF': 'bg-red-500/20 text-red-600'
    };
    return colors[format] || 'bg-muted text-muted-foreground';
  };

  const startExport = (sourceId: string, format: string) => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: `${dataSources.find(s => s.id === sourceId)?.name} Export`,
      description: `Export of ${dataSources.find(s => s.id === sourceId)?.name} data`,
      data_type: sourceId,
      format: format as unknown,
      status: 'pending',
      created_date: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      filters: {},
      progress: 0
    };
    
    setExportJobs(prev => [newJob, ...prev]);
  };

  const retryExport = (jobId: string) => {
    setExportJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'pending' as const, progress: 0, error_message: undefined }
        : job
    ));
  };

  const deleteExport = (jobId: string) => {
    setExportJobs(prev => prev.filter(job => job.id !== jobId));
  };

  return (
    <ProtectedPageLayout 
      title="Data Export" 
      subtitle="Export and download your data for portability and backup"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Download size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Data Export Center</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Export your data for backup, analysis, or migration purposes
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
                <p className="text-sm font-medium">{completedJobs.length} Completed</p>
                <p className="text-xs text-muted-foreground">Ready for download</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <RefreshCw size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{processingJobs.length} Processing</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Database size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">{dataSources.length} Sources</p>
                <p className="text-xs text-muted-foreground">Available datasets</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Archive size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">7 Days</p>
                <p className="text-xs text-muted-foreground">Download retention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="exports">Export Jobs</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available Data Sources</h3>
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSources.map((source, index) => (
                <Card 
                  key={source.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                        <Database size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(source.category))}>
                            {source.category}
                          </Badge>
                          {source.requires_permission && (
                            <Badge variant="outline" className="text-xs">
                              Restricted
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{source.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Records:</span>
                              <p>{source.record_count.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Last Updated:</span>
                              <p>{new Date(source.last_updated).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium">Available Formats:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {source.available_formats.map((format, formatIndex) => (
                                <Badge key={formatIndex} className={cn("text-xs", getFormatColor(format))}>
                                  {format}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium">Fields:</span>
                          <div className="flex flex-wrap gap-1">
                            {source.fields.slice(0, 4).map((field, fieldIndex) => (
                              <Badge key={fieldIndex} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {source.fields.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{source.fields.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                      <Button
                        size="sm"
                        onClick={() => setSelectedSource(source)}
                        className="gap-2"
                      >
                        <Download size={14} />
                        Export
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Eye size={14} />
                        Preview
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Settings size={14} />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Export Jobs</h3>
              <div className="flex gap-4">
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
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

            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <Card 
                  key={job.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getStatusColor(job.status))}>
                            {getStatusIcon(job.status)}
                            <span className="ml-1">{job.status}</span>
                          </Badge>
                          <Badge className={cn("text-xs", getFormatColor(job.format))}>
                            {job.format}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{job.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                        
                        {job.status === 'processing' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{job.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">Created:</span>
                            <p>{new Date(job.created_date).toLocaleDateString()}</p>
                          </div>
                          {job.completed_date && (
                            <div>
                              <span className="font-medium">Completed:</span>
                              <p>{new Date(job.completed_date).toLocaleDateString()}</p>
                            </div>
                          )}
                          {job.file_size && (
                            <div>
                              <span className="font-medium">File Size:</span>
                              <p>{job.file_size}</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Expires:</span>
                            <p>{new Date(job.expires_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {job.error_message && (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-600">
                              <strong>Error:</strong> {job.error_message}
                            </p>
                          </div>
                        )}

                        {Object.keys(job.filters).length > 0 && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Filters Applied:</span>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(job.filters).map(([key, value], filterIndex) => (
                                <Badge key={filterIndex} variant="outline" className="text-xs">
                                  {key}: {String(value)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {job.status === 'completed' && job.download_url && (
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(job.download_url, '_blank')}
                          >
                            <Download size={14} />
                            Download
                          </Button>
                        )}
                        
                        {job.status === 'failed' && (
                          <Button
                            size="sm"
                            onClick={() => retryExport(job.id)}
                            className="gap-2"
                          >
                            <RefreshCw size={14} />
                            Retry
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Share2 size={14} />
                          Share
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteExport(job.id)}
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

          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No scheduled exports</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up automatic data exports to run on a schedule.
                  </p>
                  <Button className="gap-2">
                    <Calendar size={16} />
                    Create Scheduled Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Format</label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer">
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                      <option value="XML">XML</option>
                      <option value="PDF">PDF</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Retention Period</label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer">
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Get notified when exports complete
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Encrypt Exports</p>
                      <p className="text-xs text-muted-foreground">
                        Password protect exported files
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Anonymize Personal Data</p>
                      <p className="text-xs text-muted-foreground">
                        Remove or hash personal identifiers
                      </p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Audit Log</p>
                      <p className="text-xs text-muted-foreground">
                        Log all export activities
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Configuration Modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Export {selectedSource.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSource(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Export Configuration</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Format</label>
                        <select className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer">
                          {selectedSource.available_formats.map(format => (
                            <option key={format} value={format}>{format}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Date Range</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Input type="date" placeholder="Start date" />
                          <Input type="date" placeholder="End date" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Field Selection</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedSource.fields.map((field, index) => (
                        <label key={index} className="flex items-center space-x-2 text-sm">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Additional Options</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Include deleted records</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Compress export file</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Send email when complete</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    onClick={() => {
                      startExport(selectedSource.id, selectedSource.available_formats[0]);
                      setSelectedSource(null);
                    }}
                    className="gap-2"
                  >
                    <Download size={16} />
                    Start Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSource(null)}
                  >
                    Cancel
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