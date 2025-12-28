import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  User,
  FileText,
  Camera,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";
import { userVerificationApi, type VerificationRequest as ApiVerificationRequest, type VerificationDocument as ApiVerificationDocument } from "@/services/userVerificationApi";
import { useToast } from "@/hooks/use-toast";

interface VerificationRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  verification_type: 'identity' | 'student' | 'address' | 'phone' | 'email';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  submitted_date: string;
  reviewed_date?: string;
  reviewer_id?: string;
  documents: VerificationDocument[];
  notes?: string;
  rejection_reason?: string;
}

interface VerificationDocument {
  id: string;
  type: 'national_id' | 'passport' | 'student_id' | 'driver_license';
  name: string;
  url: string;
  uploaded_date: string;
  verified: boolean;
}

const verificationTypes = ['All Types', 'identity', 'student', 'address', 'phone', 'email'];
const statusOptions = ['All Status', 'pending', 'in_progress', 'completed', 'failed'];

export default function UserVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    approved_documents: 0,
    rejected_documents: 0,
    verification_rate: 0,
    average_processing_time: 0
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [requestsData, statsData] = await Promise.all([
        userVerificationApi.getVerificationRequests(),
        userVerificationApi.getVerificationStats()
      ]);
      
      // Transform API data to component format
      const transformedRequests: VerificationRequest[] = requestsData.requests.map(req => ({
        id: req.id,
        user_id: req.user_id,
        user_name: (req as any).user?.full_name || 'Unknown User',
        user_email: (req as any).user?.email || 'unknown@email.com',
        verification_type: req.verification_type,
        status: req.status,
        submitted_date: req.created_at,
        reviewed_date: req.updated_at,
        documents: [], // Will be loaded separately if needed
        notes: req.notes
      }));
      
      setRequests(transformedRequests);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading verification data:', error);
      toast({
        title: "Error",
        description: "Failed to load verification data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || request.verification_type === selectedType;
    const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const completedRequests = requests.filter(r => r.status === 'completed');
  const failedRequests = requests.filter(r => r.status === 'failed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'completed': return 'bg-green-500/20 text-green-600';
      case 'failed': return 'bg-red-500/20 text-red-600';
      case 'in_progress': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'identity': 'bg-blue-500/20 text-blue-600',
      'student': 'bg-purple-500/20 text-purple-600',
      'address': 'bg-green-500/20 text-green-600',
      'phone': 'bg-orange-500/20 text-orange-600',
      'email': 'bg-indigo-500/20 text-indigo-600'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'failed': return <XCircle size={16} className="text-red-600" />;
      case 'in_progress': return <Eye size={16} className="text-blue-600" />;
      default: return <AlertTriangle size={16} className="text-muted-foreground" />;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'national_id':
      case 'passport': return <User size={16} className="text-blue-600" />;
      case 'student_id': return <FileText size={16} className="text-purple-600" />;
      case 'driver_license': return <FileText size={16} className="text-green-600" />;
      default: return <FileText size={16} className="text-muted-foreground" />;
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await userVerificationApi.updateVerificationRequest(requestId, {
        status: 'completed'
      });
      
      toast({
        title: "Success",
        description: "Verification request approved successfully."
      });
      
      await loadData();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve verification request.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await userVerificationApi.updateVerificationRequest(requestId, {
        status: 'failed',
        notes: reason
      });
      
      toast({
        title: "Success",
        description: "Verification request rejected."
      });
      
      await loadData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject verification request.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <ProtectedPageLayout 
        title="User Verification" 
        subtitle="Manage identity and credential verification for community members"
        currentPath={location.pathname}
        onNavigate={navigate}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ProtectedPageLayout>
    );
  }

  return (
    <ProtectedPageLayout 
      title="User Verification" 
      subtitle="Manage identity and credential verification for community members"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">User Verification System</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Verify identities and credentials to build trust in the community
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <p className="text-sm font-medium">{stats.pending_requests} Pending</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium">{stats.approved_documents} Approved</p>
                <p className="text-xs text-muted-foreground">Verified docs</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium">{stats.rejected_documents} Rejected</p>
                <p className="text-xs text-muted-foreground">Need revision</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">{stats.verification_rate}%</p>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {verificationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="space-y-4">
              {filteredRequests.map((request, index) => (
                <Card 
                  key={request.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Shield size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getTypeColor(request.verification_type))}>
                            {request.verification_type}
                          </Badge>
                          <Badge className={cn("text-xs", getStatusColor(request.status))}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status}</span>
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{request.user_name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{request.user_email}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span>Submitted: {new Date(request.submitted_date).toLocaleDateString()}</span>
                          {request.reviewed_date && (
                            <span>Reviewed: {new Date(request.reviewed_date).toLocaleDateString()}</span>
                          )}
                          <span>{request.documents.length} documents</span>
                        </div>

                        {request.notes && (
                          <p className="text-sm text-muted-foreground mb-3 italic">
                            "{request.notes}"
                          </p>
                        )}

                        {request.rejection_reason && (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-600">
                              <strong>Rejection Reason:</strong> {request.rejection_reason}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {request.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                              {getDocumentIcon(doc.type)}
                              <span className="text-xs">{doc.name}</span>
                              {doc.verified && (
                                <CheckCircle size={12} className="text-green-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="gap-2"
                        >
                          <Eye size={14} />
                          Review
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={14} />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(request.id, 'Documents need revision')}
                              className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <XCircle size={14} />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="space-y-4">
              {pendingRequests.map((request, index) => (
                <Card 
                  key={request.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up border-yellow-200 dark:border-yellow-800"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Clock size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-yellow-500 text-white text-xs">
                            Pending Review
                          </Badge>
                          <Badge className={cn("text-xs", getTypeColor(request.verification_type))}>
                            {request.verification_type}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{request.user_name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{request.user_email}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {new Date(request.submitted_date).toLocaleDateString()} • {request.documents.length} documents
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="gap-2"
                        >
                          <Eye size={14} />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedRequests.map((request, index) => (
                <Card 
                  key={request.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up border-green-200 dark:border-green-800"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white text-xs">
                            Verified
                          </Badge>
                          <Badge className={cn("text-xs", getTypeColor(request.verification_type))}>
                            {request.verification_type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                          {request.user_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {request.user_email}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Approved: {request.reviewed_date && new Date(request.reviewed_date).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div className="space-y-4">
              {failedRequests.map((request, index) => (
                <Card 
                  key={request.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up border-red-200 dark:border-red-800"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                        <XCircle size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-red-500 text-white text-xs">
                            Rejected
                          </Badge>
                          <Badge className={cn("text-xs", getTypeColor(request.verification_type))}>
                            {request.verification_type}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{request.user_name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{request.user_email}</p>
                        
                        {request.rejection_reason && (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-600">
                              <strong>Reason:</strong> {request.rejection_reason}
                            </p>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Rejected: {request.reviewed_date && new Date(request.reviewed_date).toLocaleDateString()}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                        className="gap-2"
                      >
                        <Eye size={14} />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Document Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Review Verification Request</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRequest(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedRequest.user_name}</p>
                      <p><strong>Email:</strong> {selectedRequest.user_email}</p>
                      <p><strong>Type:</strong> {selectedRequest.verification_type}</p>
                      <p><strong>Status:</strong> {selectedRequest.status}</p>
                      <p><strong>Submitted:</strong> {new Date(selectedRequest.submitted_date).toLocaleString()}</p>
                      {selectedRequest.notes && (
                        <p><strong>Notes:</strong> {selectedRequest.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Documents ({selectedRequest.documents.length})</h4>
                    <div className="space-y-3">
                      {selectedRequest.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          {getDocumentIcon(doc.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} • {new Date(doc.uploaded_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified && (
                              <CheckCircle size={16} className="text-green-600" />
                            )}
                            <Button size="sm" variant="outline" className="gap-2">
                              <Download size={12} />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} />
                      Approve Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleReject(selectedRequest.id, 'Documents need revision');
                        setSelectedRequest(null);
                      }}
                      className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle size={16} />
                      Reject Request
                    </Button>
                  </div>
                )}
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