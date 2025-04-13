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
      users: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          id: string
          title: string
          category: string
          created_by: string
          created_at: string
          updated_at: string | null
          status: 'planned' | 'live' | 'ended'
          description: string | null
        }
        Insert: {
          id?: string
          title: string
          category: string
          created_by: string
          created_at?: string
          updated_at?: string | null
          status?: 'planned' | 'live' | 'ended'
          description?: string | null
        }
        Update: {
          id?: string
          title?: string
          category?: string
          created_by?: string
          created_at?: string
          updated_at?: string | null
          status?: 'planned' | 'live' | 'ended'
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      room_participants: {
        Row: {
          user_id: string
          room_id: string
          role: 'moderator' | 'speaker' | 'listener'
          joined_at: string
          updated_at: string | null
        }
        Insert: {
          user_id: string
          room_id: string
          role?: 'moderator' | 'speaker' | 'listener'
          joined_at?: string
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          room_id?: string
          role?: 'moderator' | 'speaker' | 'listener'
          joined_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
