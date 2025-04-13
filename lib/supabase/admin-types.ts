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
}

export {};
