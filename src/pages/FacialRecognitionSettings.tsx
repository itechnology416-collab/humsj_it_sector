import { useState, useEffect , useCallback} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Eye,
  Shield,
  Fingerprint,
  Settings,
  Trash2,
  Plus,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Lock,
  Unlock,
  History,
  BarChart3
} from "lucide-react";
import FacialRecognition from "@/components/auth/FacialRecognition";
import {
  facialRecognitionApi,
  type FaceAuthSettings,
  type FaceTemplate,
  type FaceAuthAttempt,
  type BiometricSecurityEvent,
  type FaceAuthStats,
  type EnrollmentResult,
  type VerificationResult
} from "@/services/facialRecognitionApi";
import { BackToDashboard } from "@/components/layout/BackToDashboard";

export default function FacialRecognitionSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<FaceAuthSettings | null>(null);
  const [templates, setTemplates] = useState<FaceTemplate[]>([]);
  const [attempts, setAttempts] = useState<FaceAuthAttempt[]>([]);
  const [securityEvents, setSecurityEvents] = useState<BiometricSecurityEvent[]>([]);
  const [stats, setStats] = useState<FaceAuthStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'history' | 'security'>('settings');

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [userSettings, userTemplates, userAttempts, userEvents, userStats] = await Promise.all([
        facialRecognitionApi.getFaceAuthSettings(user.id),
        facialRecognitionApi.getUserFaceTemplates(user.id),
        facialRecognitionApi.getUserAuthAttempts(user.id, 20),
        facialRecognitionApi.getUserSecurityEvents(user.id, 20),
        facialRecognitionApi.getUserFaceAuthStats(user.id)
      ]);

      setSettings(userSettings);
      setTemplates(userTemplates);
      setAttempts(userAttempts);
      setSecurityEvents(userEvents);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load facial recognition data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<FaceAuthSettings>) => {
    if (!user?.id) return;

    try {
      const success = await facialRecognitionApi.updateFaceAuthSettings(user.id, newSettings);
      if (success) {
        setSettings(prev => prev ? { ...prev, ...newSettings } : null);
        toast.success('Settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleEnrollmentSuccess = (result: EnrollmentResult) => {
    toast.success('Face template enrolled successfully!');
    setShowEnrollment(false);
    loadUserData(); // Refresh data
  };

  const handleEnrollmentError = (error: string) => {
    toast.error(error);
    setShowEnrollment(false);
  };

  const handleVerificationSuccess = (result: VerificationResult) => {
    toast.success(`Face verified with ${Math.round((result.confidence_score || 0) * 100)}% confidence`);
    setShowVerification(false);
  };

  const handleVerificationError = (error: string) => {
    toast.error(error);
    setShowVerification(false);
  };

  const deleteTemplate = async (templateId: string) => {
    if (!user?.id) return;

    try {
      const success = await facialRecognitionApi.deleteFaceTemplate(user.id, templateId);
      if (success) {
        toast.success('Face template deleted');
        loadUserData(); // Refresh data
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getAttemptIcon = (attempt: FaceAuthAttempt) => {
    if (attempt.success) {
      return <CheckCircle size={16} className="text-green-500" />;
    } else {
      return <AlertTriangle size={16} className="text-red-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain size={48} className="animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading facial recognition settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackToDashboard />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Fingerprint size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Facial Recognition</h1>
              <p className="text-muted-foreground">Manage your biometric authentication settings</p>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    <span className="text-sm text-muted-foreground">Total Attempts</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.total_attempts}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-green-500" />
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.success_rate}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-purple-500" />
                    <span className="text-sm text-muted-foreground">Avg Confidence</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round((stats.avg_confidence || 0) * 100)}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {stats.is_locked_out ? (
                      <Lock size={16} className="text-red-500" />
                    ) : (
                      <Unlock size={16} className="text-green-500" />
                    )}
                    <span className="text-sm text-muted-foreground">Status</span>
                  </div>
                  <p className="text-sm font-medium">
                    {stats.is_locked_out ? 'Locked Out' : 'Active'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-secondary/30 rounded-lg p-1">
          {[
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'templates', label: 'Face Templates', icon: Eye },
            { id: 'history', label: 'History', icon: History },
            { id: 'security', label: 'Security Events', icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as unknown)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Enrollment Section */}
            {showEnrollment ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus size={20} />
                    Enroll New Face Template
                  </CardTitle>
                  <CardDescription>
                    Add a new face template for authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FacialRecognition
                    mode="enrollment"
                    onSuccess={handleEnrollmentSuccess}
                    onError={handleEnrollmentError}
                    userId={user?.id}
                  />
                </CardContent>
              </Card>
            ) : showVerification ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye size={20} />
                    Test Face Verification
                  </CardTitle>
                  <CardDescription>
                    Test your current face templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FacialRecognition
                    mode="verification"
                    onSuccess={handleVerificationSuccess}
                    onError={handleVerificationError}
                    userId={user?.id}
                  />
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Main Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings size={20} />
                      Authentication Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your facial recognition preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Enable/Disable */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Facial Recognition</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow facial recognition for authentication
                        </p>
                      </div>
                      <Switch
                        checked={settings?.is_enabled || false}
                        onCheckedChange={(checked) => updateSettings({ is_enabled: checked })}
                      />
                    </div>

                    {/* Require Face for Login */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Require Face for Login</Label>
                        <p className="text-sm text-muted-foreground">
                          Always require facial recognition to sign in
                        </p>
                      </div>
                      <Switch
                        checked={settings?.require_face_for_login || false}
                        onCheckedChange={(checked) => updateSettings({ require_face_for_login: checked })}
                        disabled={!settings?.is_enabled}
                      />
                    </div>

                    {/* Anti-Spoofing */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Anti-Spoofing Protection</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable liveness detection to prevent photo/video attacks
                        </p>
                      </div>
                      <Switch
                        checked={settings?.anti_spoofing_enabled || false}
                        onCheckedChange={(checked) => updateSettings({ anti_spoofing_enabled: checked })}
                        disabled={!settings?.is_enabled}
                      />
                    </div>

                    {/* Confidence Threshold */}
                    <div className="space-y-3">
                      <Label>Confidence Threshold: {Math.round((settings?.confidence_threshold || 0.85) * 100)}%</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimum confidence required for successful authentication
                      </p>
                      <Slider
                        value={[(settings?.confidence_threshold || 0.85) * 100]}
                        onValueChange={([value]) => updateSettings({ confidence_threshold: value / 100 })}
                        min={60}
                        max={95}
                        step={5}
                        disabled={!settings?.is_enabled}
                        className="w-full"
                      />
                    </div>

                    {/* Max Failed Attempts */}
                    <div className="space-y-3">
                      <Label>Max Failed Attempts: {settings?.max_failed_attempts || 5}</Label>
                      <p className="text-sm text-muted-foreground">
                        Number of failed attempts before temporary lockout
                      </p>
                      <Slider
                        value={[settings?.max_failed_attempts || 5]}
                        onValueChange={([value]) => updateSettings({ max_failed_attempts: value })}
                        min={3}
                        max={10}
                        step={1}
                        disabled={!settings?.is_enabled}
                        className="w-full"
                      />
                    </div>

                    {/* Lockout Duration */}
                    <div className="space-y-3">
                      <Label>Lockout Duration: {settings?.lockout_duration_minutes || 30} minutes</Label>
                      <p className="text-sm text-muted-foreground">
                        How long to lock account after max failed attempts
                      </p>
                      <Slider
                        value={[settings?.lockout_duration_minutes || 30]}
                        onValueChange={([value]) => updateSettings({ lockout_duration_minutes: value })}
                        min={5}
                        max={120}
                        step={5}
                        disabled={!settings?.is_enabled}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowEnrollment(true)}
                    className="flex items-center gap-2"
                    disabled={!settings?.is_enabled}
                  >
                    <Plus size={16} />
                    Add Face Template
                  </Button>
                  
                  <Button
                    onClick={() => setShowVerification(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!settings?.is_enabled || templates.length === 0}
                  >
                    <Eye size={16} />
                    Test Recognition
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                Face Templates ({templates.length})
              </CardTitle>
              <CardDescription>
                Manage your enrolled face templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <Eye size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No face templates enrolled</p>
                  <Button onClick={() => setShowEnrollment(true)}>
                    <Plus size={16} className="mr-2" />
                    Enroll Your First Template
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Fingerprint size={16} className="text-primary" />
                          <span className="font-medium">Template {template.id.slice(-8)}</span>
                          {template.is_active && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(template.created_at)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round((template.confidence_score || 0) * 100)}%
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => deleteTemplate(template.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History size={20} />
                Authentication History
              </CardTitle>
              <CardDescription>
                Recent facial recognition attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attempts.length === 0 ? (
                <div className="text-center py-8">
                  <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No authentication history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getAttemptIcon(attempt)}
                        <div>
                          <p className="font-medium capitalize">{attempt.attempt_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(attempt.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {attempt.success ? (
                          <p className="text-sm text-green-600">
                            Success ({Math.round((attempt.confidence_score || 0) * 100)}%)
                          </p>
                        ) : (
                          <p className="text-sm text-red-600">
                            Failed: {attempt.failure_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Security Events
              </CardTitle>
              <CardDescription>
                Biometric security events and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {securityEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No security events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg"
                    >
                      <AlertTriangle size={16} className={`mt-1 ${getSeverityColor(event.severity)}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.event_type.replace(/_/g, ' ')}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            event.severity === 'error' ? 'bg-red-100 text-red-700' :
                            event.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {event.severity}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(event.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}