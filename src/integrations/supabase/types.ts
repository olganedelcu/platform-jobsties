export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      backup_configurations: {
        Row: {
          backup_type: string
          config_data: Json | null
          created_at: string
          id: string
          is_enabled: boolean
          retention_days: number
          schedule_cron: string
          updated_at: string
        }
        Insert: {
          backup_type: string
          config_data?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          retention_days?: number
          schedule_cron: string
          updated_at?: string
        }
        Update: {
          backup_type?: string
          config_data?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          retention_days?: number
          schedule_cron?: string
          updated_at?: string
        }
        Relationships: []
      }
      backup_logs: {
        Row: {
          backup_location: string | null
          backup_type: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          started_at: string
          status: string
        }
        Insert: {
          backup_location?: string | null
          backup_type: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Update: {
          backup_location?: string | null
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      cal_com_webhooks: {
        Row: {
          booking_id: string
          created_at: string
          event_data: Json
          event_type: string
          id: string
          processed: boolean
        }
        Insert: {
          booking_id: string
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean
        }
        Update: {
          booking_id?: string
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean
        }
        Relationships: []
      }
      coach_availability: {
        Row: {
          coach_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      coach_blocked_dates: {
        Row: {
          blocked_date: string
          coach_id: string
          created_at: string
          end_time: string | null
          id: string
          reason: string | null
          start_time: string | null
          updated_at: string
        }
        Insert: {
          blocked_date: string
          coach_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          reason?: string | null
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          blocked_date?: string
          coach_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          reason?: string | null
          start_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      coach_calendar_events: {
        Row: {
          calendar_id: string
          coach_id: string
          created_at: string | null
          description: string | null
          end_time: string
          google_event_id: string
          id: string
          is_available_for_booking: boolean | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          calendar_id?: string
          coach_id: string
          created_at?: string | null
          description?: string | null
          end_time: string
          google_event_id: string
          id?: string
          is_available_for_booking?: boolean | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          calendar_id?: string
          coach_id?: string
          created_at?: string | null
          description?: string | null
          end_time?: string
          google_event_id?: string
          id?: string
          is_available_for_booking?: boolean | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_calendar_events_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_calendar_settings: {
        Row: {
          coach_id: string
          created_at: string | null
          google_calendar_connected: boolean | null
          id: string
          last_sync_at: string | null
          primary_calendar_id: string | null
          sync_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          google_calendar_connected?: boolean | null
          id?: string
          last_sync_at?: string | null
          primary_calendar_id?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          google_calendar_connected?: boolean | null
          id?: string
          last_sync_at?: string | null
          primary_calendar_id?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_calendar_settings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_google_tokens: {
        Row: {
          access_token: string
          coach_email: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          coach_email: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          coach_email?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      coach_hidden_applications: {
        Row: {
          application_id: string
          coach_id: string
          hidden_at: string
          id: string
        }
        Insert: {
          application_id: string
          coach_id: string
          hidden_at?: string
          id?: string
        }
        Update: {
          application_id?: string
          coach_id?: string
          hidden_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_hidden_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_mentee_assignments: {
        Row: {
          assigned_at: string
          coach_id: string
          id: string
          is_active: boolean
          mentee_id: string
        }
        Insert: {
          assigned_at?: string
          coach_id: string
          id?: string
          is_active?: boolean
          mentee_id: string
        }
        Update: {
          assigned_at?: string
          coach_id?: string
          id?: string
          is_active?: boolean
          mentee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_mentee_assignments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_mentee_assignments_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_todos: {
        Row: {
          coach_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          mentee_id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          mentee_id: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          mentee_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_todos_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_sessions: {
        Row: {
          cal_com_booking_id: string | null
          calendar_event_id: string | null
          coach_id: string | null
          created_at: string
          duration: number | null
          google_calendar_id: string | null
          google_event_id: string | null
          id: string
          is_blocking_event: boolean | null
          meeting_link: string | null
          mentee_id: string
          notes: string | null
          preferred_coach: string | null
          session_date: string
          session_type: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          cal_com_booking_id?: string | null
          calendar_event_id?: string | null
          coach_id?: string | null
          created_at?: string
          duration?: number | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          id?: string
          is_blocking_event?: boolean | null
          meeting_link?: string | null
          mentee_id: string
          notes?: string | null
          preferred_coach?: string | null
          session_date: string
          session_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          cal_com_booking_id?: string | null
          calendar_event_id?: string | null
          coach_id?: string | null
          created_at?: string
          duration?: number | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          id?: string
          is_blocking_event?: boolean | null
          meeting_link?: string | null
          mentee_id?: string
          notes?: string | null
          preferred_coach?: string | null
          session_date?: string
          session_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_sessions_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: false
            referencedRelation: "coach_calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          coach_email: string
          created_at: string | null
          id: string
          mentee_id: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          coach_email?: string
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          coach_email?: string
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          module_title: string
          progress_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          module_title: string
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          module_title?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cv_files: {
        Row: {
          coach_id: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mentee_id: string
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          coach_id: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mentee_id: string
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          coach_id?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mentee_id?: string
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      in_app_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          application_status: string
          coach_notes: string | null
          company_name: string
          created_at: string
          date_applied: string
          id: string
          interview_stage: string | null
          job_title: string
          mentee_id: string
          mentee_notes: string | null
          recruiter_name: string | null
          updated_at: string
        }
        Insert: {
          application_status?: string
          coach_notes?: string | null
          company_name: string
          created_at?: string
          date_applied: string
          id?: string
          interview_stage?: string | null
          job_title: string
          mentee_id: string
          mentee_notes?: string | null
          recruiter_name?: string | null
          updated_at?: string
        }
        Update: {
          application_status?: string
          coach_notes?: string | null
          company_name?: string
          created_at?: string
          date_applied?: string
          id?: string
          interview_stage?: string | null
          job_title?: string
          mentee_id?: string
          mentee_notes?: string | null
          recruiter_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mentee_notes: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          mentee_id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          mentee_id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          mentee_id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mentee_todo_assignments: {
        Row: {
          assigned_at: string
          coach_id: string
          completed_at: string | null
          created_at: string
          id: string
          mentee_description: string | null
          mentee_due_date: string | null
          mentee_id: string
          mentee_priority: string | null
          mentee_title: string | null
          started_at: string | null
          status: string
          todo_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          coach_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          mentee_description?: string | null
          mentee_due_date?: string | null
          mentee_id: string
          mentee_priority?: string | null
          mentee_title?: string | null
          started_at?: string | null
          status?: string
          todo_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          coach_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          mentee_description?: string | null
          mentee_due_date?: string | null
          mentee_id?: string
          mentee_priority?: string | null
          mentee_title?: string | null
          started_at?: string | null
          status?: string
          todo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mentee_todo_assignments_coach_id"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mentee_todo_assignments_mentee_id"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentee_todo_assignments_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "coach_todos"
            referencedColumns: ["id"]
          },
        ]
      }
      mentee_todos: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          mentee_id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          mentee_id: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          mentee_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          message_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          message_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          message_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          message_type: string | null
          read_at: string | null
          read_status: boolean | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          read_status?: boolean | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          read_status?: boolean | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_files: {
        Row: {
          coach_id: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mentee_id: string
          module_type: string
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          coach_id: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mentee_id: string
          module_type: string
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          coach_id?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mentee_id?: string
          module_type?: string
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message_id: string | null
          notification_type: string
          read_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message_id?: string | null
          notification_type?: string
          read_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message_id?: string | null
          notification_type?: string
          read_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_google_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          about: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          profile_picture_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      weekly_job_recommendations: {
        Row: {
          application_stage: string | null
          applied_date: string | null
          archived: boolean | null
          coach_id: string
          company_name: string
          created_at: string
          description: string | null
          id: string
          job_link: string
          job_title: string
          mentee_id: string
          status: string | null
          updated_at: string
          week_start_date: string
        }
        Insert: {
          application_stage?: string | null
          applied_date?: string | null
          archived?: boolean | null
          coach_id: string
          company_name: string
          created_at?: string
          description?: string | null
          id?: string
          job_link: string
          job_title: string
          mentee_id: string
          status?: string | null
          updated_at?: string
          week_start_date: string
        }
        Update: {
          application_stage?: string | null
          applied_date?: string | null
          archived?: boolean | null
          coach_id?: string
          company_name?: string
          created_at?: string
          description?: string | null
          id?: string
          job_link?: string
          job_title?: string
          mentee_id?: string
          status?: string | null
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_weekly_job_recommendations_coach"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_weekly_job_recommendations_mentee"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      backup_all_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_backup_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          backup_type: string
          last_backup: string
          success_rate: number
          total_size: number
          backup_count: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_hidden_applications: {
        Args: { coach_user_id: string }
        Returns: {
          application_id: string
        }[]
      }
      hide_application: {
        Args: { coach_user_id: string; app_id: string }
        Returns: undefined
      }
      log_backup_operation: {
        Args: {
          p_backup_type: string
          p_status: string
          p_backup_location?: string
          p_file_size?: number
          p_error_message?: string
          p_metadata?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
