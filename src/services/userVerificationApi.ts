import { supabase } from '@/integrations/supabase/client';

export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: 'national_id' | 'passport' | 'student_id' | 'driver_license';
  document_number: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  verification_type: 'identity' | 'student' | 'address' | 'phone' | 'email';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  submitted_data: Record<string, unknown>;
  verification_method: 'manual' | 'automated' | 'third_party';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationHistory {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  performed_by: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

class UserVerificationApiService {
  // Document Management
  async uploadVerificationDocument(data: {
    document_type: VerificationDocument['document_type'];
    document_number: string;
    document_file: File;
    expiry_date?: string;
  }): Promise<VerificationDocument> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Upload document file
      const fileExt = data.document_file.name.split('.').pop();
      const fileName = `${user.user.id}/${data.document_type}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, data.document_file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: document, error } = await supabase
        .from('verification_documents')
        .insert([{
          user_id: user.user.id,
          document_type: data.document_type,
          document_number: data.document_number,
          document_url: uploadData.path,
          expiry_date: data.expiry_date,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Log verification activity
      await this.logVerificationActivity(user.user.id, 'document_uploaded', {
        document_type: data.document_type,
        document_id: document.id
      });

      return document;
    } catch (error) {
      console.error('Error uploading verification document:', error);
      throw error;
    }
  }

  async getVerificationDocuments(userId?: string): Promise<VerificationDocument[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching verification documents:', error);
      throw error;
    }
  }

  async updateDocumentStatus(
    documentId: string, 
    status: VerificationDocument['status'],
    rejectionReason?: string
  ): Promise<VerificationDocument> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const updateData: {
        status: VerificationDocument['status'];
        updated_at: string;
        verified_by?: string;
        verified_at?: string;
        rejection_reason?: string;
      } = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved') {
        updateData.verified_by = user.user.id;
        updateData.verified_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejection_reason = rejectionReason;
      }

      const { data, error } = await supabase
        .from('verification_documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      // Log verification activity
      await this.logVerificationActivity(data.user_id, 'document_status_updated', {
        document_id: documentId,
        new_status: status,
        rejection_reason: rejectionReason
      });

      return data;
    } catch (error) {
      console.error('Error updating document status:', error);
      throw error;
    }
  }

  // Verification Requests
  async createVerificationRequest(data: {
    verification_type: VerificationRequest['verification_type'];
    submitted_data: Record<string, unknown>;
    verification_method?: VerificationRequest['verification_method'];
    priority?: VerificationRequest['priority'];
  }): Promise<VerificationRequest> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: request, error } = await supabase
        .from('verification_requests')
        .insert([{
          user_id: user.user.id,
          verification_type: data.verification_type,
          submitted_data: data.submitted_data,
          verification_method: data.verification_method || 'manual',
          priority: data.priority || 'normal',
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Log verification activity
      await this.logVerificationActivity(user.user.id, 'verification_request_created', {
        request_id: request.id,
        verification_type: data.verification_type
      });

      return request;
    } catch (error) {
      console.error('Error creating verification request:', error);
      throw error;
    }
  }

  async getVerificationRequests(filters: {
    status?: VerificationRequest['status'];
    verification_type?: VerificationRequest['verification_type'];
    priority?: VerificationRequest['priority'];
    assigned_to?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ requests: VerificationRequest[]; total: number }> {
    try {
      let query = supabase
        .from('verification_requests')
        .select('*, user:profiles!verification_requests_user_id_fkey(full_name, email)', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.verification_type) {
        query = query.eq('verification_type', filters.verification_type);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
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
        requests: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      throw error;
    }
  }

  async updateVerificationRequest(
    requestId: string,
    updates: {
      status?: VerificationRequest['status'];
      assigned_to?: string;
      notes?: string;
    }
  ): Promise<VerificationRequest> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      // Log verification activity
      await this.logVerificationActivity(data.user_id, 'verification_request_updated', {
        request_id: requestId,
        updates
      });

      return data;
    } catch (error) {
      console.error('Error updating verification request:', error);
      throw error;
    }
  }

  // Verification History
  async logVerificationActivity(
    userId: string,
    action: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase
        .from('verification_history')
        .insert([{
          user_id: userId,
          action,
          details,
          performed_by: user.user?.id || 'system'
        }]);
    } catch (error) {
      console.error('Error logging verification activity:', error);
      // Don't throw error for logging failures
    }
  }

  async getVerificationHistory(userId: string): Promise<VerificationHistory[]> {
    try {
      const { data, error } = await supabase
        .from('verification_history')
        .select(`
          *,
          performed_by_profile:profiles!verification_history_performed_by_fkey(full_name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching verification history:', error);
      throw error;
    }
  }

  // Verification Statistics
  async getVerificationStats(): Promise<{
    total_requests: number;
    pending_requests: number;
    approved_documents: number;
    rejected_documents: number;
    verification_rate: number;
    average_processing_time: number;
  }> {
    try {
      const { data: requests } = await supabase
        .from('verification_requests')
        .select('status, created_at, updated_at');

      const { data: documents } = await supabase
        .from('verification_documents')
        .select('status, created_at, verified_at');

      const totalRequests = requests?.length || 0;
      const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;
      const approvedDocuments = documents?.filter(d => d.status === 'approved').length || 0;
      const rejectedDocuments = documents?.filter(d => d.status === 'rejected').length || 0;
      
      const completedRequests = requests?.filter(r => r.status === 'completed') || [];
      const verificationRate = totalRequests > 0 ? (completedRequests.length / totalRequests) * 100 : 0;
      
      // Calculate average processing time
      const processingTimes = completedRequests
        .filter(r => r.updated_at)
        .map(r => new Date(r.updated_at!).getTime() - new Date(r.created_at).getTime());
      
      const averageProcessingTime = processingTimes.length > 0
        ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      return {
        total_requests: totalRequests,
        pending_requests: pendingRequests,
        approved_documents: approvedDocuments,
        rejected_documents: rejectedDocuments,
        verification_rate: Math.round(verificationRate * 100) / 100,
        average_processing_time: Math.round(averageProcessingTime * 100) / 100
      };
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdateDocuments(
    documentIds: string[],
    status: VerificationDocument['status'],
    rejectionReason?: string
  ): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const updateData: {
        status: VerificationDocument['status'];
        updated_at: string;
        verified_by?: string;
        verified_at?: string;
        rejection_reason?: string;
      } = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved') {
        updateData.verified_by = user.user.id;
        updateData.verified_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('verification_documents')
        .update(updateData)
        .in('id', documentIds);

      if (error) throw error;

      // Log bulk activity
      for (const documentId of documentIds) {
        await this.logVerificationActivity('system', 'bulk_document_update', {
          document_id: documentId,
          new_status: status,
          rejection_reason: rejectionReason
        });
      }
    } catch (error) {
      console.error('Error bulk updating documents:', error);
      throw error;
    }
  }
}

export const userVerificationApi = new UserVerificationApiService();