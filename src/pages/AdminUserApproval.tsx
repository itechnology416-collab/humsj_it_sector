import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Mail,
  Bell,
  AlertCircle,
  User,
  Calendar,
  Shield,
  Send,
  Eye,
  UserCheck,
  UserX,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  student_id?: string;
  department?: string;
  year_of_study?: string;
  gender?: 'male' | 'female';
  phone?: string;
  registration_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  profile_picture?: string;
}

// Mock data for demonstration
const mockPendingUsers: PendingUser[] = [
  {
    id: '1',
    email: 'ahmed.hassan@student.haramaya.edu.et',
    full_name: 'Ahmed Hassan Mohammed',
    student_id: 'HU/CS/2024/001',
    department: 'Computer Science',
    year_of_study: '2nd Year',
    gender: 'male',
    phone: '+251912345678',
    registration_date: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: '2',
    email: 'fatima.ali@student.haramaya.edu.et',
    full_name: 'Fatima Ali Ibrahim',
    student_id: 'HU/ENG/2024/045',
    department: 'Engineering',
    year_of_study: '3rd Year',
    gender: 'female',
    phone: '+251923456789',
    registration_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: '3',
    email: 'omar.yusuf@student.haramaya.edu.et',
    full_name: 'Omar Yusuf Ahmed',
    student_id: 'HU/MED/2024/023',
    department: 'Medicine',
    year_of_study: '1st Year',
    gender: 'male',
    phone: '+251934567890',
    registration_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

export default function AdminUserApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(mockPendingUsers);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [isAdmin, navigate]);

  // Send email notification to admin
  const sendEmailNotification = async (userInfo: PendingUser) => {
    try {
      // Mock email sending - in real implementation, this would call your email service
      const emailData = {
        to: 'itechnology416@gmail.com',
        subject: `New User Registration - ${userInfo.full_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">HUMSJ - New User Registration</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">New Registration Pending Approval</h2>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p><strong>Name:</strong> ${userInfo.full_name}</p>
                <p><strong>Email:</strong> ${userInfo.email}</p>
                <p><strong>Student ID:</strong> ${userInfo.student_id || 'N/A'}</p>
                <p><strong>Department:</strong> ${userInfo.department || 'N/A'}</p>
                <p><strong>Year:</strong> ${userInfo.year_of_study || 'N/A'}</p>
                <p><strong>Gender:</strong> ${userInfo.gender || 'N/A'}</p>
                <p><strong>Phone:</strong> ${userInfo.phone || 'N/A'}</p>
                <p><strong>Registration Date:</strong> ${new Date(userInfo.registration_date).toLocaleString()}</p>
              </div>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${window.location.origin}/admin-user-approval" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Review Application
                </a>
              </div>
              <p style="color: #666; font-size: 12px; text-align: center;">
                This is an automated notification from HUMSJ User Management System.
              </p>
            </div>
          </div>
        `
      };

      console.log('Email notification would be sent:', emailData);
      toast.success('Email notification sent to admin');
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      toast.error('Failed to send email notification');
      return false;
    }
  };

  // Send push notification
  const sendPushNotification = async (userInfo: PendingUser) => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('HUMSJ - New User Registration', {
          body: `${userInfo.full_name} has registered and needs approval`,
          icon: '/logo.jpg',
          badge: '/logo.jpg',
          tag: `user-registration-${userInfo.id}`,
          requireInteraction: true,
          actions: [
            { action: 'review', title: 'Review' },
            { action: 'dismiss', title: 'Dismiss' }
          ]
        });
        toast.success('Push notification sent');
        return true;
      } else {
        toast.warning('Push notifications not available');
        return false;
      }
    } catch (error) {
      console.error('Failed to send push notification:', error);
      toast.error('Failed to send push notification');
      return false;
    }
  };

  // Simulate new user registration
  const simulateNewRegistration = () => {
    const newUser: PendingUser = {
      id: Date.now().toString(),
      email: `user${Date.now()}@student.haramaya.edu.et`,
      full_name: `Test User ${Date.now()}`,
      student_id: `HU/TEST/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
      department: 'Computer Science',
      year_of_study: '2nd Year',
      gender: Math.random() > 0.5 ? 'male' : 'female',
      phone: `+251${Math.floor(Math.random() * 1000000000)}`,
      registration_date: new Date().toISOString(),
      status: 'pending'
    };

    setPendingUsers(prev => [newUser, ...prev]);
    
    // Send notifications
    if (emailNotifications) {
      sendEmailNotification(newUser);
    }
    if (pushNotifications) {
      sendPushNotification(newUser);
    }
    
    toast.success('New user registration simulated');
  };

  // Approve user
  const approveUser = async (userId: string) => {
    setLoading(true);
    try {
      setPendingUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'approved' as const }
            : user
        )
      );
      toast.success('User approved successfully');
    } catch (error) {
      toast.error('Failed to approve user');
    } finally {
      setLoading(false);
    }
  };

  // Reject user
  const rejectUser = async (userId: string, reason?: string) => {
    setLoading(true);
    try {
      setPendingUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'rejected' as const, reason }
            : user
        )
      );
      toast.success('User rejected');
    } catch (error) {
      toast.error('Failed to reject user');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = pendingUsers.filter(user => {
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: pendingUsers.filter(u => u.status === 'pending').length,
    approved: pendingUsers.filter(u => u.status === 'approved').length,
    rejected: pendingUsers.filter(u => u.status === 'rejected').length,
    total: pendingUsers.length
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <PageLayout 
      title="User Registration Approval" 
      subtitle="Review and approve new user registrations"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Shield size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">User Registration Approval</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Review and manage new user registrations. Approve or reject applications 
            and receive notifications for new registrations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you want to be notified about new registrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send emails to itechnology416@gmail.com</p>
                </div>
              </div>
              <Button
                variant={emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setEmailNotifications(!emailNotifications)}
              >
                {emailNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser notifications for new registrations</p>
                </div>
              </div>
              <Button
                variant={pushNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setPushNotifications(!pushNotifications)}
              >
                {pushNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button
                onClick={simulateNewRegistration}
                className="gap-2"
                variant="outline"
              >
                <Send size={16} />
                Simulate New Registration
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw size={16} />
          </Button>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your filters or search terms'
                    : 'No user registrations at the moment'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{user.full_name}</h3>
                          <Badge 
                            variant={
                              user.status === 'approved' ? 'default' :
                              user.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            {user.email}
                          </p>
                          {user.student_id && (
                            <p className="flex items-center gap-2">
                              <User size={14} />
                              {user.student_id}
                            </p>
                          )}
                          {user.department && (
                            <p className="flex items-center gap-2">
                              <Shield size={14} />
                              {user.department}
                            </p>
                          )}
                          <p className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(user.registration_date).toLocaleString()}
                          </p>
                        </div>
                        {user.reason && (
                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-sm text-red-700 dark:text-red-300">
                            <strong>Rejection Reason:</strong> {user.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="gap-2"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      {user.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                            disabled={loading}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck size={14} />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => rejectUser(user.id, 'Application rejected by admin')}
                            disabled={loading}
                            className="gap-2"
                          >
                            <UserX size={14} />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* User Details Modal would go here */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Student ID</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.student_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.department || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year of Study</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.year_of_study || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Registration Date</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedUser.registration_date).toLocaleString()}
                    </p>
                  </div>
                </div>
                {selectedUser.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => {
                        approveUser(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      disabled={loading}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck size={16} />
                      Approve User
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        rejectUser(selectedUser.id, 'Application rejected after review');
                        setSelectedUser(null);
                      }}
                      disabled={loading}
                      className="gap-2"
                    >
                      <UserX size={16} />
                      Reject User
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}