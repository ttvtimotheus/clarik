// Erweiterung der Supabase-Datenbank-Typen für das Admin-Dashboard

declare global {
  type StatisticViews = {
    user_statistics: {
      total_users: number;
      new_users_30d: number;
      new_users_7d: number;
      new_users_24h: number;
    };
    room_statistics: {
      total_rooms: number;
      active_rooms: number;
      new_rooms_30d: number;
      new_rooms_7d: number;
    };
    participation_statistics: {
      total_participations: number;
      rooms_with_participants: number;
      participating_users: number;
      new_participations_7d: number;
      new_participations_24h: number;
    };
    top_users_by_participation: {
      id: string;
      name: string;
      email: string;
      room_count: number;
    };
  };
  
  // Erweitertes Benutzerprofil mit Admin-Flag
  type AdminUserProfile = {
    id: string;
    name: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string | null;
    is_admin: boolean;
  };
  
  // RPC-Rückgabetypen für Admin-Funktionen
  type GetUserStatisticsResponse = {
    total_users: number;
    new_users_30d: number;
    new_users_7d: number;
    new_users_24h: number;
  };
  
  type GetTopUsersByParticipationResponse = {
    id: string;
    name: string;
    room_count: number;
  }[];
  
  // Erweiterung für Supabase Client
  interface SupabaseClientExtensions {
    rpc<T>(fn: 'get_user_statistics', params?: {}): Promise<{ data: GetUserStatisticsResponse | null, error: any }>;
    rpc<T>(fn: 'get_top_users_by_participation', params?: {}): Promise<{ data: GetTopUsersByParticipationResponse | null, error: any }>;
  }
}

export {};
