-- Ergänzungen zum Admin-Schema: Erstelle die für das Dashboard benötigten RPC-Funktionen

-- Funktion zum Abrufen der Benutzerstatistiken
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_users', COUNT(*),
        'new_users_30d', COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END),
        'new_users_7d', COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END),
        'new_users_24h', COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END)
    ) INTO result
    FROM public.users;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion zum Abrufen der Raumstatistiken
CREATE OR REPLACE FUNCTION public.get_room_statistics()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_rooms', COUNT(*),
        'active_rooms', COUNT(CASE WHEN status = 'live' THEN 1 END),
        'new_rooms_30d', COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END),
        'new_rooms_7d', COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END)
    ) INTO result
    FROM public.rooms;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion zum Abrufen der Teilnahmestatistiken
CREATE OR REPLACE FUNCTION public.get_participation_statistics()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_participations', COUNT(*),
        'rooms_with_participants', COUNT(DISTINCT room_id),
        'participating_users', COUNT(DISTINCT user_id),
        'new_participations_7d', COUNT(CASE WHEN joined_at > NOW() - INTERVAL '7 days' THEN 1 END),
        'new_participations_24h', COUNT(CASE WHEN joined_at > NOW() - INTERVAL '1 day' THEN 1 END)
    ) INTO result
    FROM public.room_participants;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion zum Abrufen bestimmter Benutzerfelder mit auth.users
CREATE OR REPLACE FUNCTION public.get_enriched_users(page_number int, items_per_page int)
RETURNS SETOF json AS $$
BEGIN
    RETURN QUERY
    SELECT json_build_object(
        'id', u.id,
        'name', u.name,
        'email', au.email,
        'avatar_url', u.avatar_url,
        'created_at', u.created_at,
        'is_admin', COALESCE(u.is_admin, false)
    )
    FROM public.users u
    JOIN auth.users au ON u.id = au.id
    ORDER BY u.created_at DESC
    LIMIT items_per_page
    OFFSET (page_number * items_per_page);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
