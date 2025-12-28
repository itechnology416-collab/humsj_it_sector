import { courseApi } from './courseApi';
import { mediaApi } from './mediaApi';
import { eventApi } from './eventApi';
import { contentApi } from './contentApi';
import { notificationApi } from './notificationApi';
import { analytics } from './analytics';
import { attendanceApi } from './attendanceApi';
import { errorHandler } from './errorHandler';

/**
 * Comprehensive API Integration Service
 * 
 * This service provides a unified interface for all API operations
 * and handles cross-service integrations and workflows.
 */
class ApiIntegrationService {
  // =============================================
  // SERVICE INSTANCES
  // =============================================
  
  public readonly courses = courseApi;
  public readonly media = mediaApi;
  public readonly events = eventApi;
  public readonly content = contentApi;
  public readonly notifications = notificationApi;
  public readonly attendance = attendanceApi;

  // =============================================
  // CROSS-SERVICE WORKFLOWS
  // =============================================

  /**
   * Complete course enrollment workflow with notifications and analytics
   */
  async enrollInCourseWorkflow(courseId: string, paymentData?: {
    method: string;
    reference: string;
  }): Promise<{
    enrollment: unknown;
    notification: unknown;
  }> {
    try {
      // 1. Enroll in course
      const enrollment = await this.courses.enrollInCourse({
        course_id: courseId,
        payment_method: paymentData?.method,
        payment_reference: paymentData?.reference
      });

      // 2. Send welcome notification
      const notification = await this.notifications.sendTemplatedNotification(
        'course_enrollment',
        [enrollment.user_id],
        {
          course_title: enrollment.course?.title || 'Course',
          course_id: courseId
        },
        `/courses/${enrollment.course?.slug}`
      );

      // 3. Track analytics
      analytics.track('course_enrollment_workflow_completed', {
        course_id: courseId,
        enrollment_id: enrollment.id,
        payment_method: paymentData?.method
      });

      return { enrollment, notification };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'workflow',
        severity: 'high',
        metadata: { workflow: 'course_enrollment', course_id: courseId }
      });
      throw error;
    }
  }

  /**
   * Complete event registration workflow
   */
  async registerForEventWorkflow(eventId: string, registrationData?: {
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
  }): Promise<{
    registration: unknown;
    notification: unknown;
  }> {
    try {
      // 1. Register for event
      const registration = await this.events.registerForEvent({
        event_id: eventId,
        ...registrationData
      });

      // 2. Send confirmation notification
      const notification = await this.notifications.sendTemplatedNotification(
        'event_registration',
        [registration.user_id],
        {
          event_title: registration.event?.title || 'Event',
          event_date: new Date(registration.event?.start_date || '').toLocaleDateString(),
          event_id: eventId
        },
        `/events/${registration.event?.slug}`
      );

      // 3. Track analytics
      analytics.track('event_registration_workflow_completed', {
        event_id: eventId,
        registration_id: registration.id
      });

      return { registration, notification };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'workflow',
        severity: 'high',
        metadata: { workflow: 'event_registration', event_id: eventId }
      });
      throw error;
    }
  }

  /**
   * Content publishing workflow with media and notifications
   */
  async publishContentWorkflow(contentData: {
    title: string;
    content_type_id: string;
    content: Record<string, unknown>;
    featured_image?: File;
    notify_subscribers?: boolean;
  }): Promise<{
    content: unknown;
    media?: unknown;
    notifications?: unknown[];
  }> {
    try {
      let featured_image_url: string | undefined;

      // 1. Upload featured image if provided
      if (contentData.featured_image) {
        const mediaItem = await this.media.uploadMediaItem({
          title: `Featured image for ${contentData.title}`,
          media_type: 'image',
          file: contentData.featured_image,
          is_public: true
        });
        featured_image_url = mediaItem.file_url;
      }

      // 2. Create and publish content
      const content = await this.content.createContentItem({
        ...contentData,
        featured_image_url,
        status: 'published'
      });

      // 3. Send notifications to subscribers if requested
      const notifications: unknown[] = [];
      if (contentData.notify_subscribers) {
        // This would typically get subscriber list from a subscription service
        // For now, we'll skip the actual notification sending
        console.log('Would notify subscribers about new content:', content.title);
      }

      // 4. Track analytics
      analytics.track('content_publishing_workflow_completed', {
        content_id: content.id,
        content_type: content.content_type?.name,
        has_featured_image: !!featured_image_url
      });

      return { content, notifications };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'workflow',
        severity: 'high',
        metadata: { workflow: 'content_publishing', title: contentData.title }
      });
      throw error;
    }
  }

  /**
   * Media gallery creation workflow
   */
  async createMediaGalleryWorkflow(galleryData: {
    name: string;
    description?: string;
    files: File[];
    category_id?: string;
    is_public?: boolean;
  }): Promise<{
    collection: unknown;
    media_items: unknown[];
  }> {
    try {
      // 1. Create media collection
      const collection = await this.media.createMediaCollection({
        name: galleryData.name,
        description: galleryData.description,
        collection_type: 'gallery',
        is_public: galleryData.is_public
      });

      // 2. Upload all media files
      const media_items = [];
      for (const file of galleryData.files) {
        const mediaItem = await this.media.uploadMediaItem({
          title: file.name,
          media_type: this.getMediaTypeFromFile(file),
          file,
          category_id: galleryData.category_id,
          is_public: galleryData.is_public
        });
        
        // 3. Add to collection
        await this.media.addItemToCollection(collection.id, mediaItem.id);
        media_items.push(mediaItem);
      }

      // 4. Track analytics
      analytics.track('media_gallery_workflow_completed', {
        collection_id: collection.id,
        media_count: media_items.length
      });

      return { collection, media_items };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'workflow',
        severity: 'high',
        metadata: { workflow: 'media_gallery_creation', name: galleryData.name }
      });
      throw error;
    }
  }

  // =============================================
  // DASHBOARD DATA AGGREGATION
  // =============================================

  /**
   * Get comprehensive dashboard data for users
   */
  async getUserDashboardData(userId?: string): Promise<{
    enrollments: unknown[];
    registrations: unknown[];
    notifications: unknown[];
    stats: {
      total_courses: number;
      completed_courses: number;
      upcoming_events: number;
      unread_notifications: number;
    };
  }> {
    try {
      const [enrollments, registrations, notifications, unreadCount] = await Promise.all([
        this.courses.getUserEnrollments(userId),
        this.events.getUserRegistrations(userId),
        this.notifications.getUserNotifications({ limit: 10 }),
        this.notifications.getUnreadNotificationCount()
      ]);

      const stats = {
        total_courses: enrollments.length,
        completed_courses: enrollments.filter(e => e.status === 'completed').length,
        upcoming_events: registrations.filter(r => 
          r.event && new Date(r.event.start_date) > new Date()
        ).length,
        unread_notifications: unreadCount
      };

      return { enrollments, registrations, notifications, stats };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'dashboard',
        severity: 'medium',
        metadata: { action: 'get_user_dashboard_data', user_id: userId }
      });
      throw error;
    }
  }

  /**
   * Get comprehensive admin dashboard data
   */
  async getAdminDashboardData(): Promise<{
    recent_enrollments: unknown[];
    recent_registrations: unknown[];
    recent_content: unknown[];
    stats: {
      total_users: number;
      active_courses: number;
      upcoming_events: number;
      total_media_items: number;
    };
  }> {
    try {
      const [courses, events, content] = await Promise.all([
        this.courses.getCourses({ limit: 10, published: true }),
        this.events.getEvents({ limit: 10, status: 'published' }),
        this.content.getContentItems({ limit: 10, status: 'published' })
      ]);

      // These would typically come from actual database queries
      const stats = {
        total_users: 0, // Would query user count
        active_courses: courses.length,
        upcoming_events: events.filter(e => new Date(e.start_date) > new Date()).length,
        total_media_items: 0 // Would query media count
      };

      return {
        recent_enrollments: [], // Would get recent enrollments
        recent_registrations: [], // Would get recent registrations
        recent_content: content,
        stats
      };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'dashboard',
        severity: 'medium',
        metadata: { action: 'get_admin_dashboard_data' }
      });
      throw error;
    }
  }

  // =============================================
  // SEARCH & DISCOVERY
  // =============================================

  /**
   * Universal search across all content types
   */
  async universalSearch(query: string, filters?: {
    types?: ('courses' | 'events' | 'content' | 'media')[];
    limit?: number;
  }): Promise<{
    courses: unknown[];
    events: unknown[];
    content: unknown[];
    media: unknown[];
    total: number;
  }> {
    try {
      const searchTypes = filters?.types || ['courses', 'events', 'content', 'media'];
      const limit = Math.floor((filters?.limit || 20) / searchTypes.length);

      const results = {
        courses: [] as unknown[],
        events: [] as unknown[],
        content: [] as unknown[],
        media: [] as unknown[],
        total: 0
      };

      // Search in parallel across all enabled types
      const searchPromises = [];

      if (searchTypes.includes('courses')) {
        searchPromises.push(
          this.courses.getCourses({ search: query, limit }).then(data => {
            results.courses = data;
            results.total += data.length;
          })
        );
      }

      if (searchTypes.includes('events')) {
        searchPromises.push(
          this.events.getEvents({ search: query, limit }).then(data => {
            results.events = data;
            results.total += data.length;
          })
        );
      }

      if (searchTypes.includes('content')) {
        searchPromises.push(
          this.content.searchContent(query, { limit }).then(data => {
            results.content = data;
            results.total += data.length;
          })
        );
      }

      if (searchTypes.includes('media')) {
        searchPromises.push(
          this.media.getMediaItems({ search: query, limit }).then(data => {
            results.media = data;
            results.total += data.length;
          })
        );
      }

      await Promise.all(searchPromises);

      // Track search analytics
      analytics.track('universal_search_performed', {
        query,
        types: searchTypes,
        total_results: results.total
      });

      return results;
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'search',
        severity: 'medium',
        metadata: { action: 'universal_search', query, filters }
      });
      throw error;
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  private getMediaTypeFromFile(file: File): 'image' | 'video' | 'audio' | 'document' {
    const mimeType = file.type;
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  /**
   * Health check for all API services
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      [key: string]: 'up' | 'down' | 'slow';
    };
  }> {
    const services = {
      courses: 'down' as const,
      media: 'down' as const,
      events: 'down' as const,
      content: 'down' as const,
      notifications: 'down' as const
    };

    try {
      // Test each service with a simple query
      const healthChecks = await Promise.allSettled([
        this.courses.getCourseCategories().then(() => { services.courses = 'up'; }),
        this.media.getMediaCategories().then(() => { services.media = 'up'; }),
        this.events.getEventCategories().then(() => { services.events = 'up'; }),
        this.content.getContentTypes().then(() => { services.content = 'up'; }),
        this.notifications.getNotificationTemplates().then(() => { services.notifications = 'up'; })
      ]);

      const upServices = Object.values(services).filter(status => status === 'up').length;
      const totalServices = Object.keys(services).length;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (upServices === totalServices) {
        status = 'healthy';
      } else if (upServices > totalServices / 2) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return { status, services };
    } catch (error) {
      errorHandler.handleError(error, {
        category: 'system',
        severity: 'high',
        metadata: { action: 'health_check' }
      });
      
      return {
        status: 'unhealthy',
        services
      };
    }
  }
}

export const apiIntegration = new ApiIntegrationService();

// Export individual services for direct access
export {
  courseApi,
  mediaApi,
  eventApi,
  contentApi,
  notificationApi
};