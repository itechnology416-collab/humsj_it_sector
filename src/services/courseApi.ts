import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analytics } from './analytics';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  instructor_id?: string;
  category_id?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  duration_weeks: number;
  total_lessons: number;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  thumbnail_url?: string;
  trailer_video_url?: string;
  is_published: boolean;
  is_featured: boolean;
  prerequisites?: string[];
  learning_outcomes?: string[];
  course_materials?: string[];
  requirements?: string[];
  start_date?: string;
  end_date?: string;
  schedule_info?: string;
  max_students?: number;
  current_students: number;
  rating: number;
  total_reviews: number;
  certificate_available: boolean;
  created_at: string;
  updated_at: string;
  instructor?: Instructor;
  category?: CourseCategory;
  curriculum?: CourseCurriculum[];
}

export interface Instructor {
  id: string;
  full_name: string;
  bio?: string;
  qualifications?: string[];
  specializations?: string[];
  profile_image_url?: string;
  rating: number;
  total_students: number;
  total_courses: number;
  is_verified: boolean;
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CourseCurriculum {
  id: string;
  course_id: string;
  week_number: number;
  title: string;
  description?: string;
  topics?: string[];
  duration_minutes?: number;
  order_index: number;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrollment_date: string;
  completion_date?: string;
  progress_percentage: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  payment_status: 'pending' | 'paid' | 'refunded' | 'free';
  payment_amount?: number;
  payment_reference?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  last_accessed: string;
  course?: Course;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  enrollment_id: string;
  rating: number;
  review_text?: string;
  is_verified: boolean;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface EnrollmentData {
  course_id: string;
  payment_method?: string;
  payment_reference?: string;
}

class CourseApiService {
  // =============================================
  // COURSE MANAGEMENT
  // =============================================

  async getCourses(filters?: {
    category?: string;
    level?: string;
    search?: string;
    featured?: boolean;
    published?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Course[]> {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(*),
          category:course_categories(*),
          curriculum:course_curriculum(*)
        `);

      if (filters?.published !== false) {
        query = query.eq('is_published', true);
      }

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.level) {
        query = query.eq('level', filters.level);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      analytics.track('courses_fetched', {
        count: data?.length || 0,
        filters
      });

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch courses');
      throw error;
    }
  }

  async getCourseById(id: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(*),
          category:course_categories(*),
          curriculum:course_curriculum(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      analytics.track('course_viewed', {
        course_id: id,
        course_title: data?.title
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch course');
      throw error;
    }
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(*),
          category:course_categories(*),
          curriculum:course_curriculum(*)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      analytics.track('course_viewed', {
        course_id: data?.id,
        course_title: data?.title,
        course_slug: slug
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch course');
      throw error;
    }
  }

  async getCourseCategories(): Promise<CourseCategory[]> {
    try {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch course categories');
      throw error;
    }
  }

  // =============================================
  // COURSE ENROLLMENT
  // =============================================

  async enrollInCourse(enrollmentData: EnrollmentData): Promise<CourseEnrollment> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', enrollmentData.course_id)
        .eq('user_id', user.id)
        .single();

      if (existingEnrollment) {
        throw new Error('Already enrolled in this course');
      }

      // Get course details for payment validation
      const course = await this.getCourseById(enrollmentData.course_id);
      if (!course) throw new Error('Course not found');

      const enrollmentPayload = {
        course_id: enrollmentData.course_id,
        user_id: user.id,
        payment_status: course.price > 0 ? 'pending' : 'free',
        payment_amount: course.price,
        payment_reference: enrollmentData.payment_reference,
        status: 'enrolled'
      };

      const { data, error } = await supabase
        .from('course_enrollments')
        .insert(enrollmentPayload)
        .select(`
          *,
          course:courses(*)
        `)
        .single();

      if (error) throw error;

      // Track enrollment
      analytics.track('course_enrolled', {
        course_id: enrollmentData.course_id,
        course_title: course.title,
        payment_amount: course.price,
        payment_method: enrollmentData.payment_method
      });

      // Send notification
      await this.sendEnrollmentNotification(user.id, course);

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to enroll in course');
      throw error;
    }
  }

  async getUserEnrollments(userId?: string): Promise<CourseEnrollment[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(
            *,
            instructor:instructors(*),
            category:course_categories(*)
          )
        `)
        .eq('user_id', targetUserId)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch user enrollments');
      throw error;
    }
  }

  async updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const status = progress >= 100 ? 'completed' : 'in_progress';
      const completion_date = progress >= 100 ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: progress,
          status,
          completion_date,
          last_accessed: new Date().toISOString()
        })
        .eq('id', enrollmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      analytics.track('course_progress_updated', {
        enrollment_id: enrollmentId,
        progress_percentage: progress,
        status
      });

      // If completed, handle certificate generation
      if (progress >= 100) {
        await this.handleCourseCompletion(enrollmentId);
      }
    } catch (error) {
      errorHandler.handleError(error, 'Failed to update course progress');
      throw error;
    }
  }

  // =============================================
  // COURSE REVIEWS
  // =============================================

  async getCourseReviews(courseId: string, limit = 10, offset = 0): Promise<CourseReview[]> {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq('course_id', courseId)
        .eq('is_verified', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return data || [];
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch course reviews');
      throw error;
    }
  }

  async submitCourseReview(courseId: string, enrollmentId: string, rating: number, reviewText?: string): Promise<CourseReview> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('course_reviews')
        .insert({
          course_id: courseId,
          user_id: user.id,
          enrollment_id: enrollmentId,
          rating,
          review_text: reviewText
        })
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Update course rating
      await this.updateCourseRating(courseId);

      analytics.track('course_reviewed', {
        course_id: courseId,
        rating,
        has_text: !!reviewText
      });

      return data;
    } catch (error) {
      errorHandler.handleError(error, 'Failed to submit course review');
      throw error;
    }
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private async sendEnrollmentNotification(userId: string, course: Course): Promise<void> {
    try {
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: 'Course Enrollment Confirmed',
          body: `You have successfully enrolled in ${course.title}. Your learning journey begins now!`,
          type: 'course_enrollment',
          data: {
            course_id: course.id,
            course_title: course.title
          },
          action_url: `/courses/${course.slug}`
        });
    } catch (error) {
      console.error('Failed to send enrollment notification:', error);
    }
  }

  private async handleCourseCompletion(enrollmentId: string): Promise<void> {
    try {
      // Get enrollment details
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('id', enrollmentId)
        .single();

      if (!enrollment) return;

      // Generate certificate if available
      if (enrollment.course.certificate_available) {
        const certificateUrl = await this.generateCertificate(enrollment);
        
        await supabase
          .from('course_enrollments')
          .update({
            certificate_issued: true,
            certificate_url: certificateUrl
          })
          .eq('id', enrollmentId);
      }

      // Send completion notification
      await supabase
        .from('user_notifications')
        .insert({
          user_id: enrollment.user_id,
          title: 'Course Completed!',
          body: `Congratulations! You have completed ${enrollment.course.title}. ${enrollment.course.certificate_available ? 'Your certificate is ready.' : ''}`,
          type: 'course_completion',
          data: {
            course_id: enrollment.course_id,
            course_title: enrollment.course.title,
            certificate_available: enrollment.course.certificate_available
          }
        });

      analytics.track('course_completed', {
        course_id: enrollment.course_id,
        course_title: enrollment.course.title,
        enrollment_id: enrollmentId
      });
    } catch (error) {
      console.error('Failed to handle course completion:', error);
    }
  }

  private async generateCertificate(enrollment: CourseEnrollment): Promise<string> {
    // This would integrate with a certificate generation service
    // For now, return a placeholder URL
    return `https://certificates.humsj.com/${enrollment.id}.pdf`;
  }

  private async updateCourseRating(courseId: string): Promise<void> {
    try {
      const { data: reviews } = await supabase
        .from('course_reviews')
        .select('rating')
        .eq('course_id', courseId)
        .eq('is_verified', true);

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await supabase
          .from('courses')
          .update({
            rating: Math.round(averageRating * 100) / 100,
            total_reviews: reviews.length
          })
          .eq('id', courseId);
      }
    } catch (error) {
      console.error('Failed to update course rating:', error);
    }
  }
}

export const courseApi = new CourseApiService();