import { supabase } from '@/integrations/supabase/client';

export interface FaceTemplate {
  id: string;
  user_id: string;
  template_data: string;
  template_version: string;
  confidence_score: number;
  face_landmarks?: unknown;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  device_info?: unknown;
}

export interface FaceAuthAttempt {
  id: string;
  user_id: string;
  attempt_type: 'enrollment' | 'verification' | 'login';
  success: boolean;
  confidence_score?: number;
  failure_reason?: string;
  device_info?: unknown;
  ip_address?: string;
  user_agent?: string;
  location_data?: unknown;
  processing_time_ms?: number;
  template_version?: string;
  created_at: string;
}

export interface FaceAuthSettings {
  id: string;
  user_id: string;
  is_enabled: boolean;
  require_face_for_login: boolean;
  confidence_threshold: number;
  max_failed_attempts: number;
  lockout_duration_minutes: number;
  allow_fallback_password: boolean;
  anti_spoofing_enabled: boolean;
  multi_face_detection: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaceAuthSession {
  id: string;
  user_id: string;
  session_token: string;
  authenticated_at: string;
  expires_at: string;
  device_fingerprint?: string;
  ip_address?: string;
  is_active: boolean;
  revoked_at?: string;
  revoked_reason?: string;
}

export interface BiometricSecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description?: string;
  metadata?: unknown;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface FaceAuthStats {
  total_attempts: number;
  successful_attempts: number;
  failed_attempts: number;
  success_rate: number;
  last_successful_auth?: string;
  last_failed_auth?: string;
  avg_confidence: number;
  is_locked_out: boolean;
}

export interface FaceDetectionResult {
  faces: Array<{
    box: { x: number; y: number; width: number; height: number };
    landmarks: Array<{ x: number; y: number }>;
    confidence: number;
    embedding: number[];
  }>;
  isLive: boolean;
  quality: number;
  processingTime: number;
}

export interface EnrollmentResult {
  success: boolean;
  template_id?: string;
  confidence_score?: number;
  error?: string;
  quality_score?: number;
}

export interface VerificationResult {
  success: boolean;
  confidence_score: number;
  match_template_id?: string;
  error?: string;
  is_locked_out?: boolean;
  remaining_attempts?: number;
}

// Face detection and processing using WebRTC and Canvas API
export class FaceDetectionService {
  private static instance: FaceDetectionService;
  private isInitialized = false;
  private detectionModel: unknown = null;

  static getInstance(): FaceDetectionService {
    if (!FaceDetectionService.instance) {
      FaceDetectionService.instance = new FaceDetectionService();
    }
    return FaceDetectionService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // In a real implementation, you would load a face detection model
      // For now, we'll simulate the initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isInitialized = true;
      console.log('Face detection service initialized');
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      throw new Error('Face detection initialization failed');
    }
  }

  async detectFaces(imageData: ImageData | HTMLCanvasElement): Promise<FaceDetectionResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = performance.now();

    try {
      // Simulate face detection processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock face detection result
      const mockResult: FaceDetectionResult = {
        faces: [
          {
            box: { x: 100, y: 80, width: 200, height: 240 },
            landmarks: [
              { x: 150, y: 120 }, // Left eye
              { x: 250, y: 120 }, // Right eye
              { x: 200, y: 160 }, // Nose
              { x: 180, y: 200 }, // Left mouth corner
              { x: 220, y: 200 }  // Right mouth corner
            ],
            confidence: 0.95,
            embedding: Array.from({ length: 128 }, () => Math.random())
          }
        ],
        isLive: true,
        quality: 0.88,
        processingTime: performance.now() - startTime
      };

      return mockResult;
    } catch (error) {
      console.error('Face detection failed:', error);
      throw new Error('Face detection processing failed');
    }
  }

  async performLivenessCheck(videoElement: HTMLVideoElement): Promise<boolean> {
    try {
      // Simulate liveness detection
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock liveness check - in real implementation, this would analyze video frames
      // for eye blinking, head movement, etc.
      return Math.random() > 0.1; // 90% success rate for demo
    } catch (error) {
      console.error('Liveness check failed:', error);
      return false;
    }
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0, Math.min(1, similarity)); // Clamp between 0 and 1
  }
}

// API functions for facial recognition
export const facialRecognitionApi = {
  // Enroll a new face template
  async enrollFace(
    userId: string,
    faceData: FaceDetectionResult,
    deviceInfo?: unknown
  ): Promise<EnrollmentResult> {
    try {
      if (faceData.faces.length === 0) {
        return { success: false, error: 'No face detected' };
      }

      if (faceData.faces.length > 1) {
        return { success: false, error: 'Multiple faces detected. Please ensure only one face is visible.' };
      }

      const face = faceData.faces[0];
      
      if (face.confidence < 0.8) {
        return { success: false, error: 'Face detection confidence too low' };
      }

      if (!faceData.isLive) {
        return { success: false, error: 'Liveness check failed. Please ensure you are looking at the camera.' };
      }

      // Encrypt the face embedding (in production, use proper encryption)
      const encryptedTemplate = btoa(JSON.stringify(face.embedding));

      const { data, error } = await supabase
        .from('face_templates')
        .insert([{
          user_id: userId,
          template_data: encryptedTemplate,
          template_version: '1.0',
          confidence_score: face.confidence,
          face_landmarks: face.landmarks,
          device_info: deviceInfo,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Face enrollment error:', error);
        return { success: false, error: 'Failed to save face template' };
      }

      // Log the enrollment attempt
      await this.logAuthAttempt(userId, 'enrollment', true, face.confidence, null, deviceInfo);

      // Log security event
      await this.logSecurityEvent(
        userId,
        'face_enrollment_success',
        'info',
        'Face template enrolled successfully',
        { confidence: face.confidence, quality: faceData.quality }
      );

      return {
        success: true,
        template_id: data.id,
        confidence_score: face.confidence,
        quality_score: faceData.quality
      };
    } catch (error) {
      console.error('Face enrollment error:', error);
      await this.logAuthAttempt(userId, 'enrollment', false, 0, 'system_error');
      return { success: false, error: 'System error during enrollment' };
    }
  },

  // Verify face against enrolled templates
  async verifyFace(
    userId: string,
    faceData: FaceDetectionResult,
    deviceInfo?: unknown
  ): Promise<VerificationResult> {
    try {
      // Check if user is locked out
      const stats = await this.getUserFaceAuthStats(userId);
      if (stats.is_locked_out) {
        return {
          success: false,
          confidence_score: 0,
          error: 'Account temporarily locked due to too many failed attempts',
          is_locked_out: true
        };
      }

      if (faceData.faces.length === 0) {
        await this.logAuthAttempt(userId, 'verification', false, 0, 'no_face_detected', deviceInfo);
        return { success: false, confidence_score: 0, error: 'No face detected' };
      }

      if (faceData.faces.length > 1) {
        await this.logAuthAttempt(userId, 'verification', false, 0, 'multiple_faces', deviceInfo);
        return { success: false, confidence_score: 0, error: 'Multiple faces detected' };
      }

      const face = faceData.faces[0];

      if (!faceData.isLive) {
        await this.logAuthAttempt(userId, 'verification', false, face.confidence, 'liveness_failed', deviceInfo);
        await this.logSecurityEvent(
          userId,
          'spoofing_attempt_detected',
          'warning',
          'Liveness check failed during face verification',
          { confidence: face.confidence }
        );
        return { success: false, confidence_score: face.confidence, error: 'Liveness check failed' };
      }

      // Get user's face templates
      const { data: templates, error } = await supabase
        .from('face_templates')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !templates || templates.length === 0) {
        await this.logAuthAttempt(userId, 'verification', false, 0, 'no_template', deviceInfo);
        return { success: false, confidence_score: 0, error: 'No face template found. Please enroll first.' };
      }

      // Get user's auth settings
      const settings = await this.getFaceAuthSettings(userId);
      const threshold = settings?.confidence_threshold || 0.85;

      // Compare against all templates
      let bestMatch: { template: FaceTemplate; similarity: number } | null = null;
      const faceService = FaceDetectionService.getInstance();

      for (const template of templates) {
        try {
          const storedEmbedding = JSON.parse(atob(template.template_data));
          const similarity = faceService.calculateSimilarity(face.embedding, storedEmbedding);
          
          if (!bestMatch || similarity > bestMatch.similarity) {
            bestMatch = { template, similarity };
          }
        } catch (error) {
          console.error('Error processing template:', error);
        }
      }

      if (!bestMatch || bestMatch.similarity < threshold) {
        await this.logAuthAttempt(userId, 'verification', false, bestMatch?.similarity || 0, 'low_confidence', deviceInfo);
        
        const remainingAttempts = Math.max(0, (settings?.max_failed_attempts || 5) - (stats.failed_attempts + 1));
        
        return {
          success: false,
          confidence_score: bestMatch?.similarity || 0,
          error: 'Face verification failed',
          remaining_attempts: remainingAttempts
        };
      }

      // Successful verification
      await this.logAuthAttempt(userId, 'verification', true, bestMatch.similarity, null, deviceInfo);
      
      await this.logSecurityEvent(
        userId,
        'face_verification_success',
        'info',
        'Face verification successful',
        { confidence: bestMatch.similarity, template_id: bestMatch.template.id }
      );

      return {
        success: true,
        confidence_score: bestMatch.similarity,
        match_template_id: bestMatch.template.id
      };
    } catch (error) {
      console.error('Face verification error:', error);
      await this.logAuthAttempt(userId, 'verification', false, 0, 'system_error', deviceInfo);
      return { success: false, confidence_score: 0, error: 'System error during verification' };
    }
  },

  // Get user's face authentication settings
  async getFaceAuthSettings(userId: string): Promise<FaceAuthSettings | null> {
    try {
      const { data, error } = await supabase
        .from('face_auth_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching face auth settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching face auth settings:', error);
      return null;
    }
  },

  // Update user's face authentication settings
  async updateFaceAuthSettings(
    userId: string,
    settings: Partial<FaceAuthSettings>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('face_auth_settings')
        .upsert([{ user_id: userId, ...settings }]);

      if (error) {
        console.error('Error updating face auth settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating face auth settings:', error);
      return false;
    }
  },

  // Get user's face templates
  async getUserFaceTemplates(userId: string): Promise<FaceTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('face_templates')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching face templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching face templates:', error);
      return [];
    }
  },

  // Delete a face template
  async deleteFaceTemplate(userId: string, templateId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('face_templates')
        .update({ is_active: false })
        .eq('id', templateId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting face template:', error);
        return false;
      }

      await this.logSecurityEvent(
        userId,
        'face_template_deleted',
        'info',
        'Face template deleted by user',
        { template_id: templateId }
      );

      return true;
    } catch (error) {
      console.error('Error deleting face template:', error);
      return false;
    }
  },

  // Get user's face authentication statistics
  async getUserFaceAuthStats(userId: string): Promise<FaceAuthStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_face_auth_stats', { user_uuid: userId });

      if (error) {
        console.error('Error fetching face auth stats:', error);
        return {
          total_attempts: 0,
          successful_attempts: 0,
          failed_attempts: 0,
          success_rate: 0,
          avg_confidence: 0,
          is_locked_out: false
        };
      }

      return data[0] || {
        total_attempts: 0,
        successful_attempts: 0,
        failed_attempts: 0,
        success_rate: 0,
        avg_confidence: 0,
        is_locked_out: false
      };
    } catch (error) {
      console.error('Error fetching face auth stats:', error);
      return {
        total_attempts: 0,
        successful_attempts: 0,
        failed_attempts: 0,
        success_rate: 0,
        avg_confidence: 0,
        is_locked_out: false
      };
    }
  },

  // Log authentication attempt
  async logAuthAttempt(
    userId: string,
    attemptType: 'enrollment' | 'verification' | 'login',
    success: boolean,
    confidenceScore?: number,
    failureReason?: string,
    deviceInfo?: unknown
  ): Promise<void> {
    try {
      await supabase
        .from('face_auth_attempts')
        .insert([{
          user_id: userId,
          attempt_type: attemptType,
          success,
          confidence_score: confidenceScore,
          failure_reason: failureReason,
          device_info: deviceInfo,
          ip_address: null, // Would be populated by server
          user_agent: navigator.userAgent,
          processing_time_ms: null,
          template_version: '1.0'
        }]);
    } catch (error) {
      console.error('Error logging auth attempt:', error);
    }
  },

  // Log security event
  async logSecurityEvent(
    userId: string,
    eventType: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info',
    description?: string,
    metadata?: unknown
  ): Promise<void> {
    try {
      await supabase
        .from('biometric_security_events')
        .insert([{
          user_id: userId,
          event_type: eventType,
          severity,
          description,
          metadata,
          ip_address: null, // Would be populated by server
          user_agent: navigator.userAgent
        }]);
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  },

  // Get user's authentication attempts
  async getUserAuthAttempts(
    userId: string,
    limit: number = 50
  ): Promise<FaceAuthAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('face_auth_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching auth attempts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching auth attempts:', error);
      return [];
    }
  },

  // Get user's security events
  async getUserSecurityEvents(
    userId: string,
    limit: number = 50
  ): Promise<BiometricSecurityEvent[]> {
    try {
      const { data, error } = await supabase
        .from('biometric_security_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching security events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      return [];
    }
  }
};

export default facialRecognitionApi;