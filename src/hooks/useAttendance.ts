import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi, AttendanceRecord, EventAttendanceStats, AttendanceFilters } from '@/services/attendanceApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useAttendance(filters: AttendanceFilters = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get attendance records
  const {
    data: attendanceRecords = [],
    isLoading: isLoadingRecords,
    error: recordsError,
    refetch: refetchRecords
  } = useQuery({
    queryKey: ['attendance-records', filters],
    queryFn: () => attendanceApi.getAttendanceRecords(filters),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get event attendance statistics
  const {
    data: eventStats = [],
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['attendance-stats', filters.event_id],
    queryFn: () => attendanceApi.getEventAttendanceStats(filters.event_id ? [filters.event_id] : undefined),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async ({
      eventId,
      userId,
      attended,
      options = {}
    }: {
      eventId: string;
      userId: string;
      attended: boolean;
      options?: {
        notes?: string;
        checkInTime?: string;
        checkOutTime?: string;
        location?: string;
      };
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return attendanceApi.markAttendance(eventId, userId, attended, user.id, options);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['user-attendance-summary'] });
      
      toast.success(`Attendance ${data.attended ? 'marked as present' : 'marked as absent'}`);
    },
    onError: (error) => {
      console.error('Failed to mark attendance:', error);
      toast.error('Failed to mark attendance. Please try again.');
    },
  });

  // Bulk update attendance mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({
      eventId,
      attendanceRecords
    }: {
      eventId: string;
      attendanceRecords: Array<{
        user_id: string;
        attended: boolean;
        notes?: string;
      }>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return attendanceApi.bulkUpdateAttendance({ event_id: eventId, attendance_records: attendanceRecords }, user.id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      
      toast.success(`Bulk attendance updated for ${data.length} records`);
    },
    onError: (error) => {
      console.error('Failed to bulk update attendance:', error);
      toast.error('Failed to bulk update attendance. Please try again.');
    },
  });

  // Delete attendance record mutation
  const deleteRecordMutation = useMutation({
    mutationFn: (recordId: string) => attendanceApi.deleteAttendanceRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      
      toast.success('Attendance record deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete attendance record:', error);
      toast.error('Failed to delete attendance record. Please try again.');
    },
  });

  // Helper functions
  const markAttendance = (
    eventId: string,
    userId: string,
    attended: boolean,
    options?: {
      notes?: string;
      checkInTime?: string;
      checkOutTime?: string;
      location?: string;
    }
  ) => {
    markAttendanceMutation.mutate({ eventId, userId, attended, options });
  };

  const bulkUpdateAttendance = (
    eventId: string,
    attendanceRecords: Array<{
      user_id: string;
      attended: boolean;
      notes?: string;
    }>
  ) => {
    bulkUpdateMutation.mutate({ eventId, attendanceRecords });
  };

  const deleteRecord = (recordId: string) => {
    deleteRecordMutation.mutate(recordId);
  };

  const exportAttendanceData = async (exportFilters: AttendanceFilters = {}) => {
    try {
      const data = await attendanceApi.exportAttendanceData(exportFilters);
      
      // Convert to CSV
      if (data.length === 0) {
        toast.error('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Attendance data exported successfully');
    } catch (error) {
      console.error('Failed to export attendance data:', error);
      toast.error('Failed to export attendance data');
    }
  };

  // Calculate statistics
  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const attended = attendanceRecords.filter(r => r.attended).length;
    const absent = total - attended;
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
    
    return { total, attended, absent, rate };
  };

  return {
    // Data
    attendanceRecords,
    eventStats,
    
    // Loading states
    isLoadingRecords,
    isLoadingStats,
    isMarkingAttendance: markAttendanceMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,
    isDeleting: deleteRecordMutation.isPending,
    
    // Error states
    recordsError,
    statsError,
    
    // Actions
    markAttendance,
    bulkUpdateAttendance,
    deleteRecord,
    exportAttendanceData,
    refetchRecords,
    refetchStats,
    
    // Helpers
    getAttendanceStats,
  };
}

export function useUserAttendance(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  // Get user attendance history
  const {
    data: attendanceHistory = [],
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['user-attendance-history', targetUserId],
    queryFn: () => attendanceApi.getUserAttendanceHistory(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000,
  });

  // Get user attendance summary
  const {
    data: attendanceSummary,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['user-attendance-summary', targetUserId],
    queryFn: () => attendanceApi.getUserAttendanceSummary(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    attendanceHistory,
    attendanceSummary,
    isLoadingHistory,
    isLoadingSummary,
    historyError,
    summaryError,
    refetchHistory,
    refetchSummary,
  };
}