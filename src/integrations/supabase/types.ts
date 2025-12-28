export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dhikr_achievements: {
        Row: {
          achievement_description: string | null
          achievement_name: string
          achievement_type: Database["public"]["Enums"]["dhikr_achievement_type"]
          badge_color: string | null
          badge_icon: string | null
          created_at: string
          dhikr_type_id: string | null
          id: string
          milestone_value: number | null
          points_earned: number | null
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_name: string
          achievement_type: Database["public"]["Enums"]["dhikr_achievement_type"]
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string
          dhikr_type_id?: string | null
          id?: string
          milestone_value?: number | null
          points_earned?: number | null
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: Database["public"]["Enums"]["dhikr_achievement_type"]
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string
          dhikr_type_id?: string | null
          id?: string
          milestone_value?: number | null
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_achievements_dhikr_type_id_fkey"
            columns: ["dhikr_type_id"]
            isOneToOne: false
            referencedRelation: "dhikr_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dhikr_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dhikr_goals: {
        Row: {
          created_at: string
          description: string | null
          dhikr_type_id: string
          end_date: string | null
          goal_type: Database["public"]["Enums"]["dhikr_goal_type"]
          id: string
          is_active: boolean | null
          is_completed: boolean | null
          completed_at: string | null
          reward_message: string | null
          start_date: string
          target_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dhikr_type_id: string
          end_date?: string | null
          goal_type: Database["public"]["Enums"]["dhikr_goal_type"]
          id?: string
          is_active?: boolean | null
          is_completed?: boolean | null
          completed_at?: string | null
          reward_message?: string | null
          start_date: string
          target_count: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dhikr_type_id?: string
          end_date?: string | null
          goal_type?: Database["public"]["Enums"]["dhikr_goal_type"]
          id?: string
          is_active?: boolean | null
          is_completed?: boolean | null
          completed_at?: string | null
          reward_message?: string | null
          start_date?: string
          target_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_goals_dhikr_type_id_fkey"
            columns: ["dhikr_type_id"]
            isOneToOne: false
            referencedRelation: "dhikr_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dhikr_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dhikr_sessions: {
        Row: {
          count: number | null
          created_at: string
          dhikr_type_id: string
          id: string
          is_goal_reached: boolean | null
          location: string | null
          mood_after: Database["public"]["Enums"]["mood_type"] | null
          mood_before: Database["public"]["Enums"]["mood_type"] | null
          notes: string | null
          session_date: string | null
          session_duration_minutes: number | null
          target: number
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          dhikr_type_id: string
          id?: string
          is_goal_reached?: boolean | null
          location?: string | null
          mood_after?: Database["public"]["Enums"]["mood_type"] | null
          mood_before?: Database["public"]["Enums"]["mood_type"] | null
          notes?: string | null
          session_date?: string | null
          session_duration_minutes?: number | null
          target: number
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number | null
          created_at?: string
          dhikr_type_id?: string
          id?: string
          is_goal_reached?: boolean | null
          location?: string | null
          mood_after?: Database["public"]["Enums"]["mood_type"] | null
          mood_before?: Database["public"]["Enums"]["mood_type"] | null
          notes?: string | null
          session_date?: string | null
          session_duration_minutes?: number | null
          target?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_sessions_dhikr_type_id_fkey"
            columns: ["dhikr_type_id"]
            isOneToOne: false
            referencedRelation: "dhikr_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dhikr_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dhikr_settings: {
        Row: {
          auto_reset_daily: boolean | null
          created_at: string
          id: string
          notification_reminders: boolean | null
          preferred_dhikr_type_id: string | null
          reminder_times: Json | null
          sound_enabled: boolean | null
          theme_preference: Database["public"]["Enums"]["theme_type"] | null
          updated_at: string
          user_id: string
          vibration_enabled: boolean | null
        }
        Insert: {
          auto_reset_daily?: boolean | null
          created_at?: string
          id?: string
          notification_reminders?: boolean | null
          preferred_dhikr_type_id?: string | null
          reminder_times?: Json | null
          sound_enabled?: boolean | null
          theme_preference?: Database["public"]["Enums"]["theme_type"] | null
          updated_at?: string
          user_id: string
          vibration_enabled?: boolean | null
        }
        Update: {
          auto_reset_daily?: boolean | null
          created_at?: string
          id?: string
          notification_reminders?: boolean | null
          preferred_dhikr_type_id?: string | null
          reminder_times?: Json | null
          sound_enabled?: boolean | null
          theme_preference?: Database["public"]["Enums"]["theme_type"] | null
          updated_at?: string
          user_id?: string
          vibration_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_settings_preferred_dhikr_type_id_fkey"
            columns: ["preferred_dhikr_type_id"]
            isOneToOne: false
            referencedRelation: "dhikr_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dhikr_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dhikr_statistics: {
        Row: {
          average_daily_count: number | null
          best_streak: number | null
          created_at: string
          dhikr_type_id: string
          goals_completed: number | null
          id: string
          last_session_date: string | null
          total_count: number | null
          total_minutes: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_daily_count?: number | null
          best_streak?: number | null
          created_at?: string
          dhikr_type_id: string
          goals_completed?: number | null
          id?: string
          last_session_date?: string | null
          total_count?: number | null
          total_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_daily_count?: number | null
          best_streak?: number | null
          created_at?: string
          dhikr_type_id?: string
          goals_completed?: number | null
          id?: string
          last_session_date?: string | null
          total_count?: number | null
          total_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_statistics_dhikr_type_id_fkey"
            columns: ["dhikr_type_id"]
            isOneToOne: false
            referencedRelation: "dhikr_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dhikr_statistics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dhikr_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          dhikr_type_id: string
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          dhikr_type_id: string
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          dhikr_type_id?: string
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_streaks_dhikr_type_id_fkey"
            columns: ["dhikr_type_id"]
            isOneToOne: false
            referencedRelation: "dhikr_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dhikr_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dhikr_types: {
        Row: {
          arabic_text: string
          category: Database["public"]["Enums"]["dhikr_category"]
          created_at: string
          default_target: number | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          reward_description: string | null
          source_reference: string | null
          translation: string
          transliteration: string
          updated_at: string
        }
        Insert: {
          arabic_text: string
          category: Database["public"]["Enums"]["dhikr_category"]
          created_at?: string
          default_target?: number | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          reward_description?: string | null
          source_reference?: string | null
          translation: string
          transliteration: string
          updated_at?: string
        }
        Update: {
          arabic_text?: string
          category?: Database["public"]["Enums"]["dhikr_category"]
          created_at?: string
          default_target?: number | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          reward_description?: string | null
          source_reference?: string | null
          translation?: string
          transliteration?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          current_attendees: number | null
          date: string
          description: string | null
          end_time: string | null
          id: string
          image_url: string | null
          location: string
          max_attendees: number | null
          speaker: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          time: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_attendees?: number | null
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_attendees?: number | null
          speaker?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          time: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_attendees?: number | null
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_attendees?: number | null
          speaker?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          time?: string
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          attendance_marked_at: string | null
          created_at: string
          event_id: string
          id: string
          notes: string | null
          registered_at: string | null
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          attendance_marked_at?: string | null
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          registered_at?: string | null
          user_id: string
        }
        Update: {
          attended?: boolean | null
          attendance_marked_at?: string | null
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          registered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      fasting_tracker: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          fast_type: Database["public"]["Enums"]["fast_type"]
          id: string
          iftar_time: string | null
          intention_made: boolean | null
          mood_rating: number | null
          notes: string | null
          spiritual_reflection: string | null
          status: Database["public"]["Enums"]["fast_status"]
          suhoor_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          energy_level?: number | null
          fast_type: Database["public"]["Enums"]["fast_type"]
          id?: string
          iftar_time?: string | null
          intention_made?: boolean | null
          mood_rating?: number | null
          notes?: string | null
          spiritual_reflection?: string | null
          status: Database["public"]["Enums"]["fast_status"]
          suhoor_time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          fast_type?: Database["public"]["Enums"]["fast_type"]
          id?: string
          iftar_time?: string | null
          intention_made?: boolean | null
          mood_rating?: number | null
          notes?: string | null
          spiritual_reflection?: string | null
          status?: Database["public"]["Enums"]["fast_status"]
          suhoor_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fasting_tracker_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      hadith_progress: {
        Row: {
          created_at: string
          hadith_id: string
          id: string
          last_reviewed: string | null
          memorization_score: number | null
          personal_notes: string | null
          review_count: number | null
          status: Database["public"]["Enums"]["hadith_status"]
          understanding_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hadith_id: string
          id?: string
          last_reviewed?: string | null
          memorization_score?: number | null
          personal_notes?: string | null
          review_count?: number | null
          status: Database["public"]["Enums"]["hadith_status"]
          understanding_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hadith_id?: string
          id?: string
          last_reviewed?: string | null
          memorization_score?: number | null
          personal_notes?: string | null
          review_count?: number | null
          status?: Database["public"]["Enums"]["hadith_status"]
          understanding_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hadith_progress_hadith_id_fkey"
            columns: ["hadith_id"]
            isOneToOne: false
            referencedRelation: "hadith_study"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hadith_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      hadith_study: {
        Row: {
          arabic_text: string
          book_number: number | null
          collection: Database["public"]["Enums"]["hadith_collection"]
          created_at: string
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          english_translation: string
          explanation: string | null
          grade: Database["public"]["Enums"]["hadith_grade"]
          hadith_number: string
          id: string
          is_featured: boolean | null
          narrator: string
          related_verses: Json | null
          study_notes: string | null
          title: string
          topic_tags: string[] | null
          updated_at: string
        }
        Insert: {
          arabic_text: string
          book_number?: number | null
          collection: Database["public"]["Enums"]["hadith_collection"]
          created_at?: string
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          english_translation: string
          explanation?: string | null
          grade: Database["public"]["Enums"]["hadith_grade"]
          hadith_number: string
          id?: string
          is_featured?: boolean | null
          narrator: string
          related_verses?: Json | null
          study_notes?: string | null
          title: string
          topic_tags?: string[] | null
          updated_at?: string
        }
        Update: {
          arabic_text?: string
          book_number?: number | null
          collection?: Database["public"]["Enums"]["hadith_collection"]
          created_at?: string
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          english_translation?: string
          explanation?: string | null
          grade?: Database["public"]["Enums"]["hadith_grade"]
          hadith_number?: string
          id?: string
          is_featured?: boolean | null
          narrator?: string
          related_verses?: Json | null
          study_notes?: string | null
          title?: string
          topic_tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_businesses: {
        Row: {
          address: Json | null
          business_hours: Json | null
          category_id: string | null
          contact_info: Json | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          halal_certification: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          name: string
          owner_id: string
          rating_average: number | null
          rating_count: number | null
          slug: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          address?: Json | null
          business_hours?: Json | null
          category_id?: string | null
          contact_info?: Json | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          halal_certification?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          name: string
          owner_id: string
          rating_average?: number | null
          rating_count?: number | null
          slug: string
          updated_at?: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          address?: Json | null
          business_hours?: Json | null
          category_id?: string | null
          contact_info?: Json | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          halal_certification?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          rating_average?: number | null
          rating_count?: number | null
          slug?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      marketplace_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      marketplace_products: {
        Row: {
          business_id: string
          category: string | null
          created_at: string
          currency: string | null
          description: string | null
          halal_certification: Json | null
          id: string
          images: string[] | null
          is_available: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          slug: string
          specifications: Json | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          halal_certification?: Json | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          slug: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          halal_certification?: Json | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          slug?: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "marketplace_businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      member_invitations: {
        Row: {
          bio: string | null
          college: string
          created_at: string
          created_by: string | null
          created_by_email: string | null
          department: string
          email: string
          full_name: string
          id: string
          intended_role: string | null
          invitation_token: string | null
          invitation_type: Database["public"]["Enums"]["invitation_type"] | null
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["invitation_status"] | null
          token_expires_at: string | null
          updated_at: string
          year: number
        }
        Insert: {
          bio?: string | null
          college: string
          created_at?: string
          created_by?: string | null
          created_by_email?: string | null
          department: string
          email: string
          full_name: string
          id?: string
          intended_role?: string | null
          invitation_token?: string | null
          invitation_type?: Database["public"]["Enums"]["invitation_type"] | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          token_expires_at?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          bio?: string | null
          college?: string
          created_at?: string
          created_by?: string | null
          created_by_email?: string | null
          department?: string
          email?: string
          full_name?: string
          id?: string
          intended_role?: string | null
          invitation_token?: string | null
          invitation_type?: Database["public"]["Enums"]["invitation_type"] | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          token_expires_at?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      member_requests: {
        Row: {
          bio: string | null
          college: string
          created_at: string
          department: string
          email: string
          full_name: string
          id: string
          motivation: string | null
          notes: string | null
          phone: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string
          year: number
        }
        Insert: {
          bio?: string | null
          college: string
          created_at?: string
          department: string
          email: string
          full_name: string
          id?: string
          motivation?: string | null
          notes?: string | null
          phone?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string
          year: number
        }
        Update: {
          bio?: string | null
          college?: string
          created_at?: string
          department?: string
          email?: string
          full_name?: string
          id?: string
          motivation?: string | null
          notes?: string | null
          phone?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          click_count: number | null
          content: string
          created_at: string
          created_by: string
          delivery_count: number | null
          id: string
          open_count: number | null
          priority: Database["public"]["Enums"]["message_priority"] | null
          recipient_filter: Json | null
          recipients: Database["public"]["Enums"]["message_recipients"]
          scheduled_for: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          title: string
          type: Database["public"]["Enums"]["message_type"]
          updated_at: string
        }
        Insert: {
          click_count?: number | null
          content: string
          created_at?: string
          created_by: string
          delivery_count?: number | null
          id?: string
          open_count?: number | null
          priority?: Database["public"]["Enums"]["message_priority"] | null
          recipient_filter?: Json | null
          recipients: Database["public"]["Enums"]["message_recipients"]
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          title: string
          type: Database["public"]["Enums"]["message_type"]
          updated_at?: string
        }
        Update: {
          click_count?: number | null
          content?: string
          created_at?: string
          created_by?: string
          delivery_count?: number | null
          id?: string
          open_count?: number | null
          priority?: Database["public"]["Enums"]["message_priority"] | null
          recipient_filter?: Json | null
          recipients?: Database["public"]["Enums"]["message_recipients"]
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["message_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      message_attachments: {
        Row: {
          created_at: string
          file_size: number
          file_url: string
          filename: string
          id: string
          message_id: string
          mime_type: string
        }
        Insert: {
          created_at?: string
          file_size: number
          file_url: string
          filename: string
          id?: string
          message_id: string
          mime_type: string
        }
        Update: {
          created_at?: string
          file_size?: number
          file_url?: string
          filename?: string
          id?: string
          message_id?: string
          mime_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      message_logs: {
        Row: {
          clicked_at: string | null
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          message_id: string
          opened_at: string | null
          recipient_email: string
          recipient_user_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_log_status"] | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message_id: string
          opened_at?: string | null
          recipient_email: string
          recipient_user_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_log_status"] | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message_id?: string
          opened_at?: string | null
          recipient_email?: string
          recipient_user_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_log_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      message_recipients: {
        Row: {
          created_at: string
          id: string
          message_id: string
          recipient_email: string | null
          recipient_id: string | null
          recipient_name: string | null
          recipient_type: Database["public"]["Enums"]["recipient_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_name?: string | null
          recipient_type: Database["public"]["Enums"]["recipient_type"]
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_name?: string | null
          recipient_type?: Database["public"]["Enums"]["recipient_type"]
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      message_templates: {
        Row: {
          content_template: string
          created_at: string
          created_by: string
          id: string
          name: string
          subject_template: string
          type: Database["public"]["Enums"]["message_type"]
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content_template: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          subject_template: string
          type: Database["public"]["Enums"]["message_type"]
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content_template?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          subject_template?: string
          type?: Database["public"]["Enums"]["message_type"]
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notification_preferences: {
        Row: {
          announcement_notifications: boolean | null
          created_at: string
          email_notifications: boolean | null
          frequency: Database["public"]["Enums"]["notification_frequency"] | null
          id: string
          newsletter_notifications: boolean | null
          push_notifications: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          reminder_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string
          urgent_notifications: boolean | null
          user_id: string
        }
        Insert: {
          announcement_notifications?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          frequency?: Database["public"]["Enums"]["notification_frequency"] | null
          id?: string
          newsletter_notifications?: boolean | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string
          urgent_notifications?: boolean | null
          user_id: string
        }
        Update: {
          announcement_notifications?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          frequency?: Database["public"]["Enums"]["notification_frequency"] | null
          id?: string
          newsletter_notifications?: boolean | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string
          urgent_notifications?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          college: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      quran_progress: {
        Row: {
          completion_percentage: number | null
          created_at: string
          current_ayah: number | null
          current_surah: number | null
          daily_goal_verses: number | null
          favorite_surahs: number[] | null
          id: string
          last_read_date: string | null
          streak_days: number | null
          study_preferences: Json | null
          total_verses_memorized: number | null
          total_verses_read: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          current_ayah?: number | null
          current_surah?: number | null
          daily_goal_verses?: number | null
          favorite_surahs?: number[] | null
          id?: string
          last_read_date?: string | null
          streak_days?: number | null
          study_preferences?: Json | null
          total_verses_memorized?: number | null
          total_verses_read?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          current_ayah?: number | null
          current_surah?: number | null
          daily_goal_verses?: number | null
          favorite_surahs?: number[] | null
          id?: string
          last_read_date?: string | null
          streak_days?: number | null
          study_preferences?: Json | null
          total_verses_memorized?: number | null
          total_verses_read?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quran_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quran_study_sessions: {
        Row: {
          ayah_from: number
          ayah_to: number
          created_at: string
          difficulty_rating: number | null
          duration_minutes: number
          id: string
          notes: string | null
          reflection: string | null
          session_date: string
          study_type: Database["public"]["Enums"]["study_type"]
          surah_name: string
          surah_number: number
          user_id: string
          verses_completed: number
        }
        Insert: {
          ayah_from: number
          ayah_to: number
          created_at?: string
          difficulty_rating?: number | null
          duration_minutes: number
          id?: string
          notes?: string | null
          reflection?: string | null
          session_date: string
          study_type: Database["public"]["Enums"]["study_type"]
          surah_name: string
          surah_number: number
          user_id: string
          verses_completed: number
        }
        Update: {
          ayah_from?: number
          ayah_to?: number
          created_at?: string
          difficulty_rating?: number | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          reflection?: string | null
          session_date?: string
          study_type?: Database["public"]["Enums"]["study_type"]
          surah_name?: string
          surah_number?: number
          user_id?: string
          verses_completed?: number
        }
        Relationships: [
          {
            foreignKeyName: "quran_study_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      system_health: {
        Row: {
          created_at: string
          error_count_24h: number | null
          error_message: string | null
          id: string
          last_checked: string | null
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: Database["public"]["Enums"]["service_status"]
          updated_at: string
          uptime_percentage: number | null
        }
        Insert: {
          created_at?: string
          error_count_24h?: number | null
          error_message?: string | null
          id?: string
          last_checked?: string | null
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status: Database["public"]["Enums"]["service_status"]
          updated_at?: string
          uptime_percentage?: number | null
        }
        Update: {
          created_at?: string
          error_count_24h?: number | null
          error_message?: string | null
          id?: string
          last_checked?: string | null
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          category: Database["public"]["Enums"]["metric_category"]
          created_at: string
          id: string
          metric_name: string
          metric_unit: string
          metric_value: number
          tags: Json | null
          timestamp: string
        }
        Insert: {
          category: Database["public"]["Enums"]["metric_category"]
          created_at?: string
          id?: string
          metric_name: string
          metric_unit: string
          metric_value: number
          tags?: Json | null
          timestamp: string
        }
        Update: {
          category?: Database["public"]["Enums"]["metric_category"]
          created_at?: string
          id?: string
          metric_name?: string
          metric_unit?: string
          metric_value?: number
          tags?: Json | null
          timestamp?: string
        }
        Relationships: []
      }
      tajweed_lessons: {
        Row: {
          audio_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          lesson_number: number
          level: Database["public"]["Enums"]["difficulty_level"]
          practice_verses: Json | null
          rules_covered: string[] | null
          text_content: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number: number
          level: Database["public"]["Enums"]["difficulty_level"]
          practice_verses?: Json | null
          rules_covered?: string[] | null
          text_content: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number?: number
          level?: Database["public"]["Enums"]["difficulty_level"]
          practice_verses?: Json | null
          rules_covered?: string[] | null
          text_content?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tajweed_lessons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tajweed_progress: {
        Row: {
          best_score: number | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          notes: string | null
          practice_attempts: number | null
          progress_percentage: number | null
          status: Database["public"]["Enums"]["progress_status"]
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          best_score?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          notes?: string | null
          practice_attempts?: number | null
          progress_percentage?: number | null
          status: Database["public"]["Enums"]["progress_status"]
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          best_score?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          notes?: string | null
          practice_attempts?: number | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["progress_status"]
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tajweed_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "tajweed_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tajweed_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zakat_calculations: {
        Row: {
          calculation_date: string
          created_at: string
          currency: string | null
          deductions: Json
          hijri_year: string
          id: string
          nisab_threshold: number
          notes: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          total_wealth: number
          updated_at: string
          user_id: string
          wealth_breakdown: Json
          zakat_due: number
        }
        Insert: {
          calculation_date: string
          created_at?: string
          currency?: string | null
          deductions: Json
          hijri_year: string
          id?: string
          nisab_threshold: number
          notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          total_wealth: number
          updated_at?: string
          user_id: string
          wealth_breakdown: Json
          zakat_due: number
        }
        Update: {
          calculation_date?: string
          created_at?: string
          currency?: string | null
          deductions?: Json
          hijri_year?: string
          id?: string
          nisab_threshold?: number
          notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          total_wealth?: number
          updated_at?: string
          user_id?: string
          wealth_breakdown?: Json
          zakat_due?: number
        }
        Relationships: [
          {
            foreignKeyName: "zakat_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      zakat_payments: {
        Row: {
          amount: number
          calculation_id: string
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["zakat_payment_method"]
          receipt_url: string | null
          recipient_details: Json | null
          recipient_name: string | null
          recipient_type: Database["public"]["Enums"]["zakat_recipient_type"]
          reference_number: string | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          amount: number
          calculation_id: string
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["zakat_payment_method"]
          receipt_url?: string | null
          recipient_details?: Json | null
          recipient_name?: string | null
          recipient_type: Database["public"]["Enums"]["zakat_recipient_type"]
          reference_number?: string | null
          updated_at?: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          amount?: number
          calculation_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["zakat_payment_method"]
          receipt_url?: string | null
          recipient_details?: Json | null
          recipient_name?: string | null
          recipient_type?: Database["public"]["Enums"]["zakat_recipient_type"]
          reference_number?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "zakat_payments_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "zakat_calculations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zakat_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "it_head"
        | "sys_admin"
        | "developer"
        | "coordinator"
        | "leader"
        | "member"
      dhikr_achievement_type:
        | "first_dhikr"
        | "daily_goal"
        | "weekly_goal"
        | "monthly_goal"
        | "streak_milestone"
        | "total_count_milestone"
      dhikr_category:
        | "tasbih"
        | "istighfar"
        | "salawat"
        | "dua"
        | "quran"
      dhikr_goal_type:
        | "daily"
        | "weekly"
        | "monthly"
        | "custom"
      difficulty_level:
        | "beginner"
        | "intermediate"
        | "advanced"
      event_status:
        | "active"
        | "cancelled"
        | "completed"
        | "draft"
      event_type:
        | "friday"
        | "dars"
        | "workshop"
        | "special"
        | "meeting"
        | "conference"
      fast_status:
        | "intended"
        | "completed"
        | "broken"
        | "missed"
      fast_type:
        | "ramadan"
        | "voluntary"
        | "makeup"
        | "arafah"
        | "ashura"
        | "monday_thursday"
      hadith_collection:
        | "bukhari"
        | "muslim"
        | "tirmidhi"
        | "abu_dawud"
        | "nasai"
        | "ibn_majah"
        | "malik"
        | "ahmad"
      hadith_grade:
        | "sahih"
        | "hasan"
        | "daif"
        | "mawdu"
      hadith_status:
        | "bookmarked"
        | "studying"
        | "memorized"
        | "understood"
      invitation_status:
        | "pending"
        | "invited"
        | "accepted"
        | "rejected"
        | "expired"
      invitation_type:
        | "admin_invite"
        | "member_request"
      message_log_status:
        | "pending"
        | "sent"
        | "delivered"
        | "opened"
        | "clicked"
        | "failed"
        | "bounced"
      message_priority:
        | "low"
        | "normal"
        | "high"
        | "urgent"
      message_recipients:
        | "all"
        | "members"
        | "admins"
        | "specific"
        | "college"
      message_status:
        | "draft"
        | "scheduled"
        | "sent"
        | "failed"
      message_type:
        | "announcement"
        | "newsletter"
        | "reminder"
        | "urgent"
        | "general"
      metric_category:
        | "performance"
        | "usage"
        | "error"
        | "business"
        | "security"
      mood_type:
        | "excellent"
        | "good"
        | "neutral"
        | "stressed"
        | "sad"
      notification_frequency:
        | "immediate"
        | "daily"
        | "weekly"
        | "never"
      payment_status:
        | "calculated"
        | "paid"
        | "partially_paid"
        | "overdue"
      progress_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "mastered"
      recipient_type:
        | "user"
        | "email"
        | "group"
      request_status:
        | "pending"
        | "approved"
        | "rejected"
        | "withdrawn"
      service_status:
        | "operational"
        | "degraded"
        | "outage"
        | "maintenance"
      study_type:
        | "recitation"
        | "memorization"
        | "translation"
        | "tafseer"
        | "reflection"
      theme_type:
        | "default"
        | "green"
        | "blue"
        | "purple"
        | "gold"
      verification_status:
        | "pending"
        | "verified"
        | "rejected"
      zakat_payment_method:
        | "cash"
        | "bank_transfer"
        | "online"
        | "check"
        | "other"
      zakat_recipient_type:
        | "mosque"
        | "charity"
        | "individual"
        | "organization"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "it_head",
        "sys_admin",
        "developer",
        "coordinator",
        "leader",
        "member",
      ],
      dhikr_achievement_type: [
        "first_dhikr",
        "daily_goal",
        "weekly_goal",
        "monthly_goal",
        "streak_milestone",
        "total_count_milestone",
      ],
      dhikr_category: [
        "tasbih",
        "istighfar",
        "salawat",
        "dua",
        "quran",
      ],
      dhikr_goal_type: [
        "daily",
        "weekly",
        "monthly",
        "custom",
      ],
      difficulty_level: [
        "beginner",
        "intermediate",
        "advanced",
      ],
      event_status: [
        "active",
        "cancelled",
        "completed",
        "draft",
      ],
      event_type: [
        "friday",
        "dars",
        "workshop",
        "special",
        "meeting",
        "conference",
      ],
      fast_status: [
        "intended",
        "completed",
        "broken",
        "missed",
      ],
      fast_type: [
        "ramadan",
        "voluntary",
        "makeup",
        "arafah",
        "ashura",
        "monday_thursday",
      ],
      hadith_collection: [
        "bukhari",
        "muslim",
        "tirmidhi",
        "abu_dawud",
        "nasai",
        "ibn_majah",
        "malik",
        "ahmad",
      ],
      hadith_grade: [
        "sahih",
        "hasan",
        "daif",
        "mawdu",
      ],
      hadith_status: [
        "bookmarked",
        "studying",
        "memorized",
        "understood",
      ],
      invitation_status: [
        "pending",
        "invited",
        "accepted",
        "rejected",
        "expired",
      ],
      invitation_type: [
        "admin_invite",
        "member_request",
      ],
      message_log_status: [
        "pending",
        "sent",
        "delivered",
        "opened",
        "clicked",
        "failed",
        "bounced",
      ],
      message_priority: [
        "low",
        "normal",
        "high",
        "urgent",
      ],
      message_recipients: [
        "all",
        "members",
        "admins",
        "specific",
        "college",
      ],
      message_status: [
        "draft",
        "scheduled",
        "sent",
        "failed",
      ],
      message_type: [
        "announcement",
        "newsletter",
        "reminder",
        "urgent",
        "general",
      ],
      metric_category: [
        "performance",
        "usage",
        "error",
        "business",
        "security",
      ],
      mood_type: [
        "excellent",
        "good",
        "neutral",
        "stressed",
        "sad",
      ],
      notification_frequency: [
        "immediate",
        "daily",
        "weekly",
        "never",
      ],
      payment_status: [
        "calculated",
        "paid",
        "partially_paid",
        "overdue",
      ],
      progress_status: [
        "not_started",
        "in_progress",
        "completed",
        "mastered",
      ],
      recipient_type: [
        "user",
        "email",
        "group",
      ],
      request_status: [
        "pending",
        "approved",
        "rejected",
        "withdrawn",
      ],
      service_status: [
        "operational",
        "degraded",
        "outage",
        "maintenance",
      ],
      study_type: [
        "recitation",
        "memorization",
        "translation",
        "tafseer",
        "reflection",
      ],
      theme_type: [
        "default",
        "green",
        "blue",
        "purple",
        "gold",
      ],
      verification_status: [
        "pending",
        "verified",
        "rejected",
      ],
      zakat_payment_method: [
        "cash",
        "bank_transfer",
        "online",
        "check",
        "other",
      ],
      zakat_recipient_type: [
        "mosque",
        "charity",
        "individual",
        "organization",
      ],
    },
  },
} as const
