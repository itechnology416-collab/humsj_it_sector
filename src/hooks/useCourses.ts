import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Course {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor_id: string;
  instructor_name: string;
  duration: string;
  lessons: number;
  estimated_hours?: number;
  start_date?: string;
  end_date?: string;
  schedule?: string;
  max_students?: number;
  current_students: number;
  price: string;
  prerequisites: string[];
  required_materials: string[];
  features: string[];
  learning_outcomes: string[];
  status: 'draft' | 'published' | 'archived' | 'full';
  thumbnail_url?: string;
  rating: number;
  rating_count: number;
  language: string;
}

export interface CourseEnrollment {
  id: string;
  created_at: string;
  updated_at: string;
  course_id: string;
  student_id: string;
  enrollment_date: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'suspended';
  progress_percentage: number;
  lessons_completed: number;
  last_accessed?: string;
  completed_at?: string;
  certificate_issued: boolean;
  rating?: number;
  review?: string;
  course?: Course;
  student_name?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  level: Course['level'];
  duration: string;
  lessons?: number;
  estimated_hours?: number;
  start_date?: string;
  end_date?: string;
  schedule?: string;
  max_students?: number;
  price?: string;
  prerequisites?: string[];
  required_materials?: string[];
  features?: string[];
  learning_outcomes?: string[];
  language?: string;
}

// Mock data for development
const mockCourses: Course[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    title: 'Introduction to Islamic Studies',
    description: 'A comprehensive introduction to the fundamental concepts of Islam',
    category: 'Islamic Studies',
    level: 'Beginner',
    instructor_id: 'instructor1',
    instructor_name: 'Sheikh Ahmed Hassan',
    duration: '8 weeks',
    lessons: 16,
    estimated_hours: 24,
    start_date: '2024-12-25',
    end_date: '2025-02-19',
    schedule: 'Tuesdays & Thursdays, 7:00 PM',
    max_students: 30,
    current_students: 18,
    price: 'Free',
    prerequisites: [],
    required_materials: ['Quran', 'Notebook'],
    features: ['Live Sessions', 'Q&A Support', 'Certificate'],
    learning_outcomes: ['Understand basic Islamic principles', 'Learn prayer basics', 'Develop Islamic character'],
    status: 'published',
    rating: 4.8,
    rating_count: 15,
    language: 'English'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    title: 'Arabic Language Fundamentals',
    description: 'Learn to read and understand basic Arabic for Quranic studies',
    category: 'Language',
    level: 'Beginner',
    instructor_id: 'instructor2',
    instructor_name: 'Dr. Fatima Ali',
    duration: '12 weeks',
    lessons: 24,
    estimated_hours: 36,
    start_date: '2025-01-01',
    end_date: '2025-03-26',
    schedule: 'Mondays, Wednesdays & Fridays, 6:30 PM',
    max_students: 25,
    current_students: 12,
    price: '$50',
    prerequisites: [],
    required_materials: ['Arabic textbook', 'Writing materials'],
    features: ['Interactive Lessons', 'Practice Exercises', 'Progress Tracking'],
    learning_outcomes: ['Read Arabic script', 'Understand basic vocabulary', 'Pronounce correctly'],
    status: 'published',
    rating: 4.6,
    rating_count: 8,
    language: 'English'
  },
  {
    id: '3',
    created_at: '2024-12-18T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
    title: 'Advanced Fiqh Studies',
    description: 'Deep dive into Islamic jurisprudence and legal principles',
    category: 'Islamic Studies',
    level: 'Advanced',
    instructor_id: 'instructor3',
    instructor_name: 'Imam Omar Ibrahim',
    duration: '16 weeks',
    lessons: 32,
    estimated_hours: 64,
    max_students: 15,
    current_students: 8,
    price: '$100',
    prerequisites: ['Basic Islamic Studies', 'Arabic reading ability'],
    required_materials: ['Fiqh textbooks', 'Reference materials'],
    features: ['Case Studies', 'Discussion Forums', 'Expert Guidance'],
    learning_outcomes: ['Understand Islamic law', 'Apply jurisprudential principles', 'Analyze complex cases'],
    status: 'draft',
    rating: 0,
    rating_count: 0,
    language: 'English'
  }
];

const mockEnrollments: CourseEnrollment[] = [
  {
    id: '1',
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z',
    course_id: '1',
    student_id: 'student1',
    enrollment_date: '2024-12-20',
    status: 'enrolled',
    progress_percentage: 65,
    lessons_completed: 10,
    last_accessed: '2024-12-20T10:00:00Z',
    certificate_issued: false,
    student_name: 'Ahmed Student'
  },
  {
    id: '2',
    created_at: '2024-12-19T00:00:00Z',
    updated_at: '2024-12-19T00:00:00Z',
    course_id: '2',
    student_id: 'student2',
    enrollment_date: '2024-12-19',
    status: 'enrolled',
    progress_percentage: 25,
    lessons_completed: 6,
    last_accessed: '2024-12-19T15:30:00Z',
    certificate_issued: false,
    student_name: 'Fatima Student'
  }
];

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user, isAdmin } = useAuth();

  const checkTableExists = async (): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('courses')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const fetchCourses = useCallback(async (filters?: {
    category?: string;
    level?: string;
    status?: string;
    language?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('Course tables not found, using mock data. Please run database migrations.');
        setUseMockData(true);
        
        let filteredCourses = [...mockCourses];
        
        if (filters?.category && filters.category !== 'all') {
          filteredCourses = filteredCourses.filter(course => course.category === filters.category);
        }
        if (filters?.level && filters.level !== 'all') {
          filteredCourses = filteredCourses.filter(course => course.level === filters.level);
        }
        if (filters?.status && filters.status !== 'all') {
          filteredCourses = filteredCourses.filter(course => course.status === filters.status);
        }
        if (filters?.language && filters.language !== 'all') {
          filteredCourses = filteredCourses.filter(course => course.language === filters.language);
        }
        
        setCourses(filteredCourses);
        setEnrollments(mockEnrollments);
        setLoading(false);
        return;
      }

      setUseMockData(false);

      let query = (supabase as any)
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name)
        `);

      // Apply access control
      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.level && filters.level !== 'all') {
        query = query.eq('level', filters.level);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }

      query = query.order('created_at', { ascending: false });

      const { data: coursesData, error: coursesError } = await query;

      if (coursesError) throw coursesError;

      const formattedCourses: Course[] = (coursesData || []).map((course: any) => ({
        ...course,
        instructor_name: course.profiles?.full_name || 'Unknown Instructor'
      }));

      setCourses(formattedCourses);

      // Fetch enrollments if user is logged in
      if (user) {
        let enrollQuery = (supabase as any)
          .from('course_enrollments')
          .select(`
            *,
            courses(*),
            profiles!course_enrollments_student_id_fkey(full_name)
          `);

        if (!isAdmin) {
          // Regular users only see their own enrollments
          const { data: profile } = await (supabase as any)
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (profile) {
            enrollQuery = enrollQuery.eq('student_id', profile.id);
          }
        }

        const { data: enrollmentsData, error: enrollmentsError } = await enrollQuery;

        if (!enrollmentsError && enrollmentsData) {
          const formattedEnrollments: CourseEnrollment[] = enrollmentsData.map((enrollment: any) => ({
            ...enrollment,
            course: enrollment.courses,
            student_name: enrollment.profiles?.full_name || 'Unknown Student'
          }));
          setEnrollments(formattedEnrollments);
        }
      }

    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
      
      // Fallback to mock data
      setUseMockData(true);
      setCourses(mockCourses);
      setEnrollments(mockEnrollments);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  const createCourse = useCallback(async (courseData: CreateCourseData): Promise<Course | null> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create courses');
      }

      if (!isAdmin) {
        throw new Error('Only admins can create courses');
      }

      // Get user's profile ID
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      if (useMockData) {
        const newCourse: Course = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...courseData,
          instructor_id: profile.id,
          instructor_name: profile.full_name || 'Current User',
          lessons: courseData.lessons || 1,
          current_students: 0,
          price: courseData.price || 'Free',
          prerequisites: courseData.prerequisites || [],
          required_materials: courseData.required_materials || [],
          features: courseData.features || [],
          learning_outcomes: courseData.learning_outcomes || [],
          status: 'draft',
          rating: 0,
          rating_count: 0,
          language: courseData.language || 'English'
        };
        
        setCourses(prev => [newCourse, ...prev]);
        toast.success('Course created successfully! (Mock data)');
        return newCourse;
      }

      const { data, error } = await (supabase as any)
        .from('courses')
        .insert([{
          ...courseData,
          instructor_id: profile.id,
          instructor_name: profile.full_name || 'Unknown',
          lessons: courseData.lessons || 1,
          current_students: 0,
          price: courseData.price || 'Free',
          prerequisites: courseData.prerequisites || [],
          required_materials: courseData.required_materials || [],
          features: courseData.features || [],
          learning_outcomes: courseData.learning_outcomes || [],
          status: 'draft',
          rating: 0,
          rating_count: 0,
          language: courseData.language || 'English'
        }])
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newCourse: Course = {
        ...data,
        instructor_name: data.profiles?.full_name || 'Unknown Instructor'
      };

      setCourses(prev => [newCourse, ...prev]);
      toast.success('Course created successfully!');
      return newCourse;

    } catch (err: any) {
      console.error('Error creating course:', err);
      toast.error(err.message || 'Failed to create course');
      return null;
    }
  }, [user, isAdmin, useMockData]);

  const updateCourse = useCallback(async (courseId: string, updates: Partial<CreateCourseData>): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can update courses');
      }

      if (useMockData) {
        setCourses(prev => prev.map(course => 
          course.id === courseId 
            ? { ...course, ...updates, updated_at: new Date().toISOString() } 
            : course
        ));
        toast.success('Course updated successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('courses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, ...updates, updated_at: new Date().toISOString() } 
          : course
      ));

      toast.success('Course updated successfully!');
      return true;

    } catch (err: any) {
      console.error('Error updating course:', err);
      toast.error(err.message || 'Failed to update course');
      return false;
    }
  }, [isAdmin, useMockData]);

  const deleteCourse = useCallback(async (courseId: string): Promise<boolean> => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete courses');
      }

      if (useMockData) {
        setCourses(prev => prev.filter(course => course.id !== courseId));
        setEnrollments(prev => prev.filter(enrollment => enrollment.course_id !== courseId));
        toast.success('Course deleted successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.filter(course => course.id !== courseId));
      setEnrollments(prev => prev.filter(enrollment => enrollment.course_id !== courseId));
      toast.success('Course deleted successfully!');
      return true;

    } catch (err: any) {
      console.error('Error deleting course:', err);
      toast.error(err.message || 'Failed to delete course');
      return false;
    }
  }, [isAdmin, useMockData]);

  const enrollInCourse = useCallback(async (courseId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to enroll in courses');
      }

      // Get user's profile ID
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Check if course is full
      const course = courses.find(c => c.id === courseId);
      if (course && course.max_students && course.current_students >= course.max_students) {
        throw new Error('Course is full');
      }

      if (useMockData) {
        const newEnrollment: CourseEnrollment = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          course_id: courseId,
          student_id: profile.id,
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'enrolled',
          progress_percentage: 0,
          lessons_completed: 0,
          certificate_issued: false,
          student_name: profile.full_name || 'Current User'
        };
        
        setEnrollments(prev => [newEnrollment, ...prev]);
        
        // Update course student count
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, current_students: c.current_students + 1 } : c
        ));
        
        toast.success('Enrolled successfully! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('course_enrollments')
        .insert([{
          course_id: courseId,
          student_id: profile.id,
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'enrolled',
          progress_percentage: 0,
          lessons_completed: 0,
          certificate_issued: false
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You are already enrolled in this course');
        }
        throw error;
      }

      // Update course student count
      const { error: updateError } = await (supabase as any)
        .from('courses')
        .update({
          current_students: (supabase as any).sql`current_students + 1`
        })
        .eq('id', courseId);

      if (updateError) {
        console.warn('Failed to update student count:', updateError);
      }

      toast.success('Enrolled successfully!');
      await fetchCourses(); // Refresh data
      return true;

    } catch (err: any) {
      console.error('Error enrolling in course:', err);
      toast.error(err.message || 'Failed to enroll in course');
      return false;
    }
  }, [user, courses, useMockData, fetchCourses]);

  const updateProgress = useCallback(async (enrollmentId: string, lessonsCompleted: number): Promise<boolean> => {
    try {
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (!enrollment || !enrollment.course) return false;

      const progressPercentage = Math.round((lessonsCompleted / enrollment.course.lessons) * 100);
      const isCompleted = progressPercentage >= 100;

      if (useMockData) {
        setEnrollments(prev => prev.map(e => 
          e.id === enrollmentId 
            ? { 
                ...e, 
                lessons_completed: lessonsCompleted,
                progress_percentage: progressPercentage,
                status: isCompleted ? 'completed' : 'enrolled',
                completed_at: isCompleted ? new Date().toISOString() : undefined,
                last_accessed: new Date().toISOString()
              } 
            : e
        ));
        toast.success('Progress updated! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('course_enrollments')
        .update({
          lessons_completed: lessonsCompleted,
          progress_percentage: progressPercentage,
          status: isCompleted ? 'completed' : 'enrolled',
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_accessed: new Date().toISOString()
        })
        .eq('id', enrollmentId);

      if (error) throw error;

      setEnrollments(prev => prev.map(e => 
        e.id === enrollmentId 
          ? { 
              ...e, 
              lessons_completed: lessonsCompleted,
              progress_percentage: progressPercentage,
              status: isCompleted ? 'completed' : 'enrolled',
              completed_at: isCompleted ? new Date().toISOString() : undefined,
              last_accessed: new Date().toISOString()
            } 
          : e
      ));

      if (isCompleted) {
        toast.success('Congratulations! Course completed!');
      } else {
        toast.success('Progress updated!');
      }
      return true;

    } catch (err: any) {
      console.error('Error updating progress:', err);
      toast.error(err.message || 'Failed to update progress');
      return false;
    }
  }, [enrollments, useMockData]);

  const rateCourse = useCallback(async (enrollmentId: string, rating: number, review?: string): Promise<boolean> => {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      if (useMockData) {
        setEnrollments(prev => prev.map(e => 
          e.id === enrollmentId ? { ...e, rating, review } : e
        ));
        toast.success('Rating submitted! (Mock data)');
        return true;
      }

      const { error } = await (supabase as any)
        .from('course_enrollments')
        .update({ rating, review })
        .eq('id', enrollmentId);

      if (error) throw error;

      setEnrollments(prev => prev.map(e => 
        e.id === enrollmentId ? { ...e, rating, review } : e
      ));

      toast.success('Rating submitted successfully!');
      return true;

    } catch (err: any) {
      console.error('Error rating course:', err);
      toast.error(err.message || 'Failed to submit rating');
      return false;
    }
  }, [useMockData]);

  const getCourseStats = useCallback(() => {
    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'published').length,
      draftCourses: courses.filter(c => c.status === 'draft').length,
      totalEnrollments: enrollments.length,
      activeEnrollments: enrollments.filter(e => e.status === 'enrolled').length,
      completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
      totalStudents: courses.reduce((sum, c) => sum + c.current_students, 0),
      averageRating: courses.length > 0 
        ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length 
        : 0,
      categoryCounts: courses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [courses, enrollments]);

  const getUserEnrollments = useCallback(() => {
    return enrollments;
  }, [enrollments]);

  const getCourseEnrollments = useCallback((courseId: string) => {
    return enrollments.filter(e => e.course_id === courseId);
  }, [enrollments]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    // Data
    courses,
    enrollments,
    userEnrollments: getUserEnrollments(),
    stats: getCourseStats(),
    
    // State
    loading,
    error,
    useMockData,
    
    // Actions
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    updateProgress,
    rateCourse,
    
    // Utilities
    getCourseEnrollments,
    refetch: fetchCourses,
    clearError: () => setError(null)
  };
};

export default useCourses;