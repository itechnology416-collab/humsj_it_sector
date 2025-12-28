import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor_name: string;
  instructor_bio?: string;
  instructor_avatar?: string;
  category: 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'arabic' | 'tajweed' | 'islamic_history' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  language: 'english' | 'arabic' | 'amharic' | 'oromo';
  format: 'online' | 'in_person' | 'hybrid';
  duration_weeks: number;
  hours_per_week: number;
  max_students: number;
  enrolled_count: number;
  price: number;
  currency: string;
  is_free: boolean;
  prerequisites?: string[];
  learning_outcomes: string[];
  syllabus: CourseSyllabus[];
  start_date: string;
  end_date: string;
  enrollment_deadline: string;
  status: 'draft' | 'published' | 'enrollment_open' | 'enrollment_closed' | 'in_progress' | 'completed' | 'cancelled';
  featured: boolean;
  rating: number;
  reviews_count: number;
  certificate_offered: boolean;
  tags: string[];
  thumbnail_url?: string;
  video_preview_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseSyllabus {
  week: number;
  title: string;
  description: string;
  topics: string[];
  assignments?: string[];
  resources?: string[];
}

export interface Enrollment {
  id: string;
  course_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  enrollment_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'dropped' | 'suspended';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'waived';
  payment_amount: number;
  payment_method?: string;
  payment_reference?: string;
  progress_percentage: number;
  completion_date?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  grade?: string;
  attendance_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  enrollment_id: string;
  course_id: string;
  student_id: string;
  current_week: number;
  completed_weeks: number[];
  assignments_completed: number;
  assignments_total: number;
  quiz_scores: Array<{ week: number; score: number; max_score: number }>;
  attendance_sessions: Array<{ date: string; attended: boolean; duration_minutes?: number }>;
  last_activity: string;
  study_time_minutes: number;
}

export interface CourseReview {
  id: string;
  course_id: string;
  student_id: string;
  student_name: string;
  rating: number;
  review_text: string;
  pros?: string[];
  cons?: string[];
  would_recommend: boolean;
  verified_enrollment: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

class IslamicCourseEnrollmentApiService {
  // Course Management
  async getCourses(filters: {
    category?: Course['category'];
    level?: Course['level'];
    language?: Course['language'];
    format?: Course['format'];
    status?: Course['status'];
    instructor_id?: string;
    is_free?: boolean;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ courses: Course[]; total: number }> {
    try {
      let query = supabase
        .from('islamic_courses')
        .select(`
          *,
          instructor:profiles!islamic_courses_instructor_id_fkey(full_name, bio, avatar_url)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.format) {
        query = query.eq('format', filters.format);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.instructor_id) {
        query = query.eq('instructor_id', filters.instructor_id);
      }
      if (filters.is_free !== undefined) {
        query = query.eq('is_free', filters.is_free);
      }
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform data to include instructor info
      const transformedCourses: Course[] = (data || []).map(course => ({
        ...course,
        instructor_name: (course as unknown).instructor?.full_name || 'Unknown Instructor',
        instructor_bio: (course as unknown).instructor?.bio,
        instructor_avatar: (course as unknown).instructor?.avatar_url
      }));

      return {
        courses: transformedCourses,
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  async getCourseById(courseId: string): Promise<Course> {
    try {
      const { data, error } = await supabase
        .from('islamic_courses')
        .select(`
          *,
          instructor:profiles!islamic_courses_instructor_id_fkey(full_name, bio, avatar_url)
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      return {
        ...data,
        instructor_name: (data as unknown).instructor?.full_name || 'Unknown Instructor',
        instructor_bio: (data as unknown).instructor?.bio,
        instructor_avatar: (data as unknown).instructor?.avatar_url
      };
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  async createCourse(courseData: Omit<Course, 'id' | 'instructor_name' | 'instructor_bio' | 'instructor_avatar' | 'enrolled_count' | 'rating' | 'reviews_count' | 'created_at' | 'updated_at'>): Promise<Course> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('islamic_courses')
        .insert([{
          ...courseData,
          instructor_id: user.user.id,
          enrolled_count: 0,
          rating: 0,
          reviews_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Log course creation
      await this.logCourseActivity(data.id, 'course_created', {
        title: courseData.title,
        category: courseData.category,
        level: courseData.level
      });

      return await this.getCourseById(data.id);
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('islamic_courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId)
        .eq('instructor_id', user.user.id)
        .select()
        .single();

      if (error) throw error;

      // Log course update
      await this.logCourseActivity(courseId, 'course_updated', updates);

      return await this.getCourseById(courseId);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // Enrollment Management
  async enrollInCourse(courseId: string, paymentData?: {
    payment_method: string;
    payment_reference: string;
  }): Promise<Enrollment> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', user.user.id)
        .single();

      if (existingEnrollment) {
        throw new Error('Already enrolled in this course');
      }

      // Get course details
      const course = await this.getCourseById(courseId);
      
      // Check enrollment capacity
      if (course.max_students && course.enrolled_count >= course.max_students) {
        throw new Error('Course is full');
      }

      // Check enrollment deadline
      if (new Date() > new Date(course.enrollment_deadline)) {
        throw new Error('Enrollment deadline has passed');
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.user.id)
        .single();

      const { data: enrollment, error } = await supabase
        .from('course_enrollments')
        .insert([{
          course_id: courseId,
          student_id: user.user.id,
          student_name: profile?.full_name || 'Unknown Student',
          student_email: profile?.email || 'unknown@email.com',
          status: course.is_free ? 'active' : 'pending',
          payment_status: course.is_free ? 'waived' : 'pending',
          payment_amount: course.price,
          payment_method: paymentData?.payment_method,
          payment_reference: paymentData?.payment_reference,
          progress_percentage: 0,
          attendance_percentage: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Update course enrollment count
      await supabase
        .from('islamic_courses')
        .update({
          enrolled_count: supabase.sql`enrolled_count + 1`
        })
        .eq('id', courseId);

      // Create initial progress record
      await supabase
        .from('course_progress')
        .insert([{
          enrollment_id: enrollment.id,
          course_id: courseId,
          student_id: user.user.id,
          current_week: 1,
          completed_weeks: [],
          assignments_completed: 0,
          assignments_total: course.syllabus.reduce((total, week) => total + (week.assignments?.length || 0), 0),
          quiz_scores: [],
          attendance_sessions: [],
          study_time_minutes: 0
        }]);

      // Log enrollment
      await this.logCourseActivity(courseId, 'student_enrolled', {
        student_id: user.user.id,
        enrollment_id: enrollment.id
      });

      return enrollment;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  async getEnrollments(filters: {
    course_id?: string;
    student_id?: string;
    status?: Enrollment['status'];
    payment_status?: Enrollment['payment_status'];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ enrollments: Enrollment[]; total: number }> {
    try {
      let query = supabase
        .from('course_enrollments')
        .select('*', { count: 'exact' })
        .order('enrollment_date', { ascending: false });

      if (filters.course_id) {
        query = query.eq('course_id', filters.course_id);
      }
      if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
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
        enrollments: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  }

  async updateEnrollmentStatus(enrollmentId: string, status: Enrollment['status'], notes?: string): Promise<Enrollment> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const updateData: unknown = {
        status,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'completed') {
        updateData.completion_date = new Date().toISOString();
        updateData.progress_percentage = 100;
      }

      const { data, error } = await supabase
        .from('course_enrollments')
        .update(updateData)
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;

      // Log status change
      await this.logCourseActivity(data.course_id, 'enrollment_status_changed', {
        enrollment_id: enrollmentId,
        new_status: status,
        notes
      });

      return data;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      throw error;
    }
  }

  // Progress Tracking
  async updateProgress(enrollmentId: string, progressData: Partial<CourseProgress>): Promise<CourseProgress> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('course_progress')
        .update({
          ...progressData,
          last_activity: new Date().toISOString()
        })
        .eq('enrollment_id', enrollmentId)
        .eq('student_id', user.user.id)
        .select()
        .single();

      if (error) throw error;

      // Update enrollment progress percentage
      const progressPercentage = Math.round(
        ((progressData.completed_weeks?.length || 0) / (progressData.assignments_total || 1)) * 100
      );

      await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollmentId);

      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  async getProgress(enrollmentId: string): Promise<CourseProgress> {
    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  // Reviews and Ratings
  async submitReview(courseId: string, reviewData: {
    rating: number;
    review_text: string;
    pros?: string[];
    cons?: string[];
    would_recommend: boolean;
  }): Promise<CourseReview> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Check if user is enrolled and completed the course
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select('status')
        .eq('course_id', courseId)
        .eq('student_id', user.user.id)
        .single();

      if (!enrollment) {
        throw new Error('Must be enrolled to leave a review');
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.user.id)
        .single();

      const { data: review, error } = await supabase
        .from('course_reviews')
        .insert([{
          course_id: courseId,
          student_id: user.user.id,
          student_name: profile?.full_name || 'Anonymous',
          rating: reviewData.rating,
          review_text: reviewData.review_text,
          pros: reviewData.pros,
          cons: reviewData.cons,
          would_recommend: reviewData.would_recommend,
          verified_enrollment: enrollment.status === 'completed',
          helpful_votes: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Update course rating
      await this.updateCourseRating(courseId);

      // Log review submission
      await this.logCourseActivity(courseId, 'review_submitted', {
        student_id: user.user.id,
        rating: reviewData.rating
      });

      return review;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  async getCourseReviews(courseId: string, limit: number = 20, offset: number = 0): Promise<{ reviews: CourseReview[]; total: number }> {
    try {
      const { data, error, count } = await supabase
        .from('course_reviews')
        .select('*', { count: 'exact' })
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        reviews: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching course reviews:', error);
      throw error;
    }
  }

  // Certificate Management
  async generateCertificate(enrollmentId: string): Promise<string> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get enrollment details
      const { data: enrollment } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:islamic_courses(title, instructor_id, certificate_offered)
        `)
        .eq('id', enrollmentId)
        .eq('student_id', user.user.id)
        .single();

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      if (enrollment.status !== 'completed') {
        throw new Error('Course must be completed to generate certificate');
      }

      if (!(enrollment as unknown).course.certificate_offered) {
        throw new Error('Certificate not offered for this course');
      }

      // Generate certificate URL (mock implementation)
      const certificateUrl = `https://certificates.humsj.org/${enrollmentId}.pdf`;

      // Update enrollment with certificate info
      await supabase
        .from('course_enrollments')
        .update({
          certificate_issued: true,
          certificate_url: certificateUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollmentId);

      // Log certificate generation
      await this.logCourseActivity((enrollment as unknown).course_id, 'certificate_generated', {
        enrollment_id: enrollmentId,
        student_id: user.user.id
      });

      return certificateUrl;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  }

  // Utility functions
  private async updateCourseRating(courseId: string): Promise<void> {
    try {
      const { data: reviews } = await supabase
        .from('course_reviews')
        .select('rating')
        .eq('course_id', courseId);

      if (reviews && reviews.length > 0) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        await supabase
          .from('islamic_courses')
          .update({
            rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
            reviews_count: reviews.length
          })
          .eq('id', courseId);
      }
    } catch (error) {
      console.error('Error updating course rating:', error);
    }
  }

  private async logCourseActivity(courseId: string, action: string, details: Record<string, unknown>): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase
        .from('course_activity_log')
        .insert([{
          course_id: courseId,
          action,
          details,
          user_id: user.user?.id || null
        }]);
    } catch (error) {
      console.error('Error logging course activity:', error);
      // Don't throw error for logging failures
    }
  }

  // Statistics
  async getCourseStats(): Promise<{
    total_courses: number;
    active_courses: number;
    total_enrollments: number;
    completion_rate: number;
    popular_categories: Array<{ category: string; count: number }>;
    revenue_total: number;
  }> {
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        supabase.from('islamic_courses').select('category, status, price, is_free'),
        supabase.from('course_enrollments').select('status, payment_amount, payment_status')
      ]);

      const courses = coursesData.data || [];
      const enrollments = enrollmentsData.data || [];

      const totalCourses = courses.length;
      const activeCourses = courses.filter(c => c.status === 'enrollment_open' || c.status === 'in_progress').length;
      const totalEnrollments = enrollments.length;
      const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
      const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

      // Calculate popular categories
      const categoryCount: Record<string, number> = {};
      courses.forEach(course => {
        categoryCount[course.category] = (categoryCount[course.category] || 0) + 1;
      });

      const popularCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate revenue
      const revenueTotal = enrollments
        .filter(e => e.payment_status === 'paid')
        .reduce((sum, e) => sum + (e.payment_amount || 0), 0);

      return {
        total_courses: totalCourses,
        active_courses: activeCourses,
        total_enrollments: totalEnrollments,
        completion_rate: Math.round(completionRate * 100) / 100,
        popular_categories: popularCategories,
        revenue_total: revenueTotal
      };
    } catch (error) {
      console.error('Error fetching course stats:', error);
      throw error;
    }
  }
}

export const islamicCourseEnrollmentApi = new IslamicCourseEnrollmentApiService();