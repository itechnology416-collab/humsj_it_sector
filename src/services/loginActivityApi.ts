import { supabase } from '@/integrations/supabase/client';

export interface LoginSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  device_info: Record<string, unknown>;
  location_info?: Record<string, unknown>;
  login_method: 'password' | 'facial_recognition' | 'otp' | 'social' | 'magic_link';
  status: 'active' | 'expired' | 'terminated' | 'suspicious';
  is_suspicious: boolean;
  risk_score: number;
  login_at: string;
  last_activity_at: string;
  logout_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'password_change' | 'suspicious_activity' | 'account_locked' | 'session_expired';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip_address: string;
  user_agent: string;
  device_fingerprint?: string;
  location_info?: Record<string, unknown>;
  additional_data: Record<string, unknown>;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface DeviceInfo {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  os_name: string;
  os_version: string;
  browser_name: string;
  browser_version: string;
  is_trusted: boolean;
  first_seen_at: string;
  last_seen_at: string;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export interface SecurityAlert {
  id: string;
  user_id: string;
  alert_type: 'multiple_failed_logins' | 'new_device' | 'unusual_location' | 'suspicious_activity' | 'account_compromise';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  data: Record<string, unknown>;
  status: 'active' | 'acknowledged' | 'resolved' | 'false_positive';
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
  updated_at: string;
}

class LoginActivityApiService {
  // Session Management
  async createLoginSession(data: {
    ip_address: string;
    user_agent: string;
    device_info: Record<string, unknown>;
    location_info?: Record<string, unknown>;
    login_method: LoginSession['login_method'];
  }): Promise<LoginSession> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Generate session token
      const sessionToken = crypto.randomUUID();

      // Calculate risk score
      const riskScore = await this.calculateRiskScore(user.user.id, data);

      const { data: session, error } = await supabase
        .from('login_sessions')
        .insert([{
          user_id: user.user.id,
          session_token: sessionToken,
          ip_address: data.ip_address,
          user_agent: data.user_agent,
          device_info: data.device_info,
          location_info: data.location_info,
          login_method: data.login_method,
          status: 'active',
          is_suspicious: riskScore > 70,
          risk_score: riskScore,
          login_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Log security event
      await this.logSecurityEvent({
        user_id: user.user.id,
        event_type: 'login_success',
        severity: riskScore > 70 ? 'high' : 'low',
        description: `User logged in via ${data.login_method}`,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        additional_data: {
          session_id: session.id,
          risk_score: riskScore,
          login_method: data.login_method
        }
      });

      // Update or create device info
      await this.updateDeviceInfo(user.user.id, data);

      return session;
    } catch (error) {
      console.error('Error creating login session:', error);
      throw error;
    }
  }

  async getLoginSessions(userId?: string, filters: {
    status?: LoginSession['status'];
    is_suspicious?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ sessions: LoginSession[]; total: number }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      let query = supabase
        .from('login_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('login_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.is_suspicious !== undefined) {
        query = query.eq('is_suspicious', filters.is_suspicious);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        sessions: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching login sessions:', error);
      throw error;
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('login_sessions')
        .update({
          status: 'terminated',
          logout_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.user.id);

      if (error) throw error;

      // Log security event
      await this.logSecurityEvent({
        user_id: user.user.id,
        event_type: 'logout',
        severity: 'low',
        description: 'User terminated session',
        ip_address: 'unknown',
        user_agent: 'unknown',
        additional_data: { session_id: sessionId }
      });
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('login_sessions')
        .update({
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session activity:', error);
      // Don't throw error for activity updates
    }
  }

  // Security Events
  async logSecurityEvent(data: {
    user_id: string;
    event_type: SecurityEvent['event_type'];
    severity: SecurityEvent['severity'];
    description: string;
    ip_address: string;
    user_agent: string;
    device_fingerprint?: string;
    location_info?: Record<string, unknown>;
    additional_data?: Record<string, unknown>;
  }): Promise<SecurityEvent> {
    try {
      const { data: event, error } = await supabase
        .from('security_events')
        .insert([{
          ...data,
          additional_data: data.additional_data || {},
          is_resolved: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Check if this should trigger an alert
      await this.checkForSecurityAlerts(data.user_id, data.event_type, data.additional_data || {});

      return event;
    } catch (error) {
      console.error('Error logging security event:', error);
      throw error;
    }
  }

  async getSecurityEvents(userId?: string, filters: {
    event_type?: SecurityEvent['event_type'];
    severity?: SecurityEvent['severity'];
    is_resolved?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ events: SecurityEvent[]; total: number }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      let query = supabase
        .from('security_events')
        .select('*', { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.is_resolved !== undefined) {
        query = query.eq('is_resolved', filters.is_resolved);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        events: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching security events:', error);
      throw error;
    }
  }

  // Device Management
  async updateDeviceInfo(userId: string, sessionData: {
    device_info: Record<string, unknown>;
    user_agent: string;
  }): Promise<void> {
    try {
      const deviceId = this.generateDeviceId(sessionData.device_info, sessionData.user_agent);
      
      const { data: existingDevice } = await supabase
        .from('device_info')
        .select('*')
        .eq('user_id', userId)
        .eq('device_id', deviceId)
        .single();

      if (existingDevice) {
        // Update existing device
        await supabase
          .from('device_info')
          .update({
            last_seen_at: new Date().toISOString(),
            login_count: existingDevice.login_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDevice.id);
      } else {
        // Create new device
        await supabase
          .from('device_info')
          .insert([{
            user_id: userId,
            device_id: deviceId,
            device_name: this.getDeviceName(sessionData.device_info),
            device_type: this.getDeviceType(sessionData.user_agent),
            os_name: sessionData.device_info.os || 'Unknown',
            os_version: sessionData.device_info.osVersion || 'Unknown',
            browser_name: sessionData.device_info.browser || 'Unknown',
            browser_version: sessionData.device_info.browserVersion || 'Unknown',
            is_trusted: false,
            first_seen_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
            login_count: 1
          }]);

        // Trigger new device alert
        await this.createSecurityAlert({
          user_id: userId,
          alert_type: 'new_device',
          priority: 'medium',
          title: 'New Device Login',
          message: 'A new device was used to access your account',
          data: { device_id: deviceId, device_info: sessionData.device_info }
        });
      }
    } catch (error) {
      console.error('Error updating device info:', error);
      // Don't throw error for device tracking
    }
  }

  async getTrustedDevices(userId?: string): Promise<DeviceInfo[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('device_info')
        .select('*')
        .eq('user_id', targetUserId)
        .order('last_seen_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trusted devices:', error);
      throw error;
    }
  }

  async updateDeviceTrustStatus(deviceId: string, isTrusted: boolean): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('device_info')
        .update({
          is_trusted: isTrusted,
          updated_at: new Date().toISOString()
        })
        .eq('device_id', deviceId)
        .eq('user_id', user.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating device trust status:', error);
      throw error;
    }
  }

  // Security Alerts
  async createSecurityAlert(data: {
    user_id: string;
    alert_type: SecurityAlert['alert_type'];
    priority: SecurityAlert['priority'];
    title: string;
    message: string;
    data: Record<string, unknown>;
  }): Promise<SecurityAlert> {
    try {
      const { data: alert, error } = await supabase
        .from('security_alerts')
        .insert([{
          ...data,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return alert;
    } catch (error) {
      console.error('Error creating security alert:', error);
      throw error;
    }
  }

  async getSecurityAlerts(userId?: string, filters: {
    status?: SecurityAlert['status'];
    priority?: SecurityAlert['priority'];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ alerts: SecurityAlert[]; total: number }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      let query = supabase
        .from('security_alerts')
        .select('*', { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        alerts: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching security alerts:', error);
      throw error;
    }
  }

  // Risk Assessment
  private async calculateRiskScore(userId: string, sessionData: {
    ip_address: string;
    user_agent: string;
    device_info: Record<string, unknown>;
    location_info?: Record<string, unknown>;
  }): Promise<number> {
    let riskScore = 0;

    try {
      // Check for new device
      const deviceId = this.generateDeviceId(sessionData.device_info, sessionData.user_agent);
      const { data: existingDevice } = await supabase
        .from('device_info')
        .select('*')
        .eq('user_id', userId)
        .eq('device_id', deviceId)
        .single();

      if (!existingDevice) {
        riskScore += 30; // New device
      } else if (!existingDevice.is_trusted) {
        riskScore += 20; // Untrusted device
      }

      // Check for unusual location (if location data available)
      if (sessionData.location_info) {
        // Implementation would check against user's typical locations
        riskScore += 10;
      }

      // Check recent failed login attempts
      const { data: recentFailures } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', 'login_failure')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (recentFailures && recentFailures.length > 3) {
        riskScore += 25; // Multiple recent failures
      }

      // Check for suspicious IP patterns
      const { data: recentSessions } = await supabase
        .from('login_sessions')
        .select('ip_address')
        .eq('user_id', userId)
        .gte('login_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const uniqueIPs = new Set(recentSessions?.map(s => s.ip_address) || []);
      if (uniqueIPs.size > 5) {
        riskScore += 15; // Many different IPs
      }

      return Math.min(riskScore, 100);
    } catch (error) {
      console.error('Error calculating risk score:', error);
      return 50; // Default medium risk
    }
  }

  private async checkForSecurityAlerts(userId: string, eventType: string, data: Record<string, unknown>): Promise<void> {
    try {
      // Check for multiple failed logins
      if (eventType === 'login_failure') {
        const { data: recentFailures } = await supabase
          .from('security_events')
          .select('*')
          .eq('user_id', userId)
          .eq('event_type', 'login_failure')
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

        if (recentFailures && recentFailures.length >= 5) {
          await this.createSecurityAlert({
            user_id: userId,
            alert_type: 'multiple_failed_logins',
            priority: 'high',
            title: 'Multiple Failed Login Attempts',
            message: 'Multiple failed login attempts detected in the last hour',
            data: { failure_count: recentFailures.length }
          });
        }
      }
    } catch (error) {
      console.error('Error checking for security alerts:', error);
    }
  }

  // Utility functions
  private generateDeviceId(deviceInfo: Record<string, unknown>, userAgent: string): string {
    const fingerprint = JSON.stringify({
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      screen: deviceInfo.screen,
      timezone: deviceInfo.timezone,
      userAgent: userAgent.substring(0, 100) // Truncate for consistency
    });
    
    // Simple hash function (in production, use a proper hash)
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  private getDeviceName(deviceInfo: Record<string, unknown>): string {
    const os = deviceInfo.os || 'Unknown OS';
    const browser = deviceInfo.browser || 'Unknown Browser';
    return `${os} - ${browser}`;
  }

  private getDeviceType(userAgent: string): DeviceInfo['device_type'] {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    } else if (ua.includes('desktop') || ua.includes('windows') || ua.includes('mac')) {
      return 'desktop';
    }
    return 'unknown';
  }

  // Statistics
  async getLoginStats(userId?: string): Promise<{
    total_sessions: number;
    active_sessions: number;
    suspicious_sessions: number;
    trusted_devices: number;
    security_events: number;
    unresolved_alerts: number;
  }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const [sessions, devices, events, alerts] = await Promise.all([
        supabase.from('login_sessions').select('*').eq('user_id', targetUserId),
        supabase.from('device_info').select('*').eq('user_id', targetUserId),
        supabase.from('security_events').select('*').eq('user_id', targetUserId),
        supabase.from('security_alerts').select('*').eq('user_id', targetUserId)
      ]);

      return {
        total_sessions: sessions.data?.length || 0,
        active_sessions: sessions.data?.filter(s => s.status === 'active').length || 0,
        suspicious_sessions: sessions.data?.filter(s => s.is_suspicious).length || 0,
        trusted_devices: devices.data?.filter(d => d.is_trusted).length || 0,
        security_events: events.data?.length || 0,
        unresolved_alerts: alerts.data?.filter(a => a.status === 'active').length || 0
      };
    } catch (error) {
      console.error('Error fetching login stats:', error);
      throw error;
    }
  }
}

export const loginActivityApi = new LoginActivityApiService();