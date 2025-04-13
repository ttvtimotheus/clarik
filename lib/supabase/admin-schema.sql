-- Admin-Erweiterungen für die CLARIK-Datenbank
-- Führe diese SQL-Befehle aus, um Admin-Funktionalität hinzuzufügen

-- 1. Benutzer-Tabelle um Admin-Flag erweitern
ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- 2. Funktion zum Setzen des ersten Benutzers als Admin
-- (nur zur initialen Setup-Zeit ausführen)
CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS void AS $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Hole den ersten Benutzer aus der Tabelle
  SELECT id INTO first_user_id FROM public.users ORDER BY created_at ASC LIMIT 1;
  
  -- Setze diesen Benutzer als Admin
  IF first_user_id IS NOT NULL THEN
    UPDATE public.users SET is_admin = true WHERE id = first_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Funktion zur Überprüfung, ob der aktuelle Benutzer ein Admin ist
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT is_admin INTO is_admin_user FROM public.users WHERE id = auth.uid();
  RETURN COALESCE(is_admin_user, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS-Policies für Admin-Zugriff

-- Admins können alle Benutzer aktualisieren
CREATE POLICY "Admins can update any user"
  ON public.users
  FOR UPDATE
  USING (public.is_admin());

-- Admins können alle Räume verwalten
CREATE POLICY "Admins can manage all rooms"
  ON public.rooms
  FOR ALL
  USING (public.is_admin());

-- Admins können alle Raumteilnehmer verwalten
CREATE POLICY "Admins can manage all participants"
  ON public.room_participants
  FOR ALL
  USING (public.is_admin());

-- 5. Statistik-Views für das Admin-Dashboard

-- Aktive Benutzer-Statistiken
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT
  COUNT(*) AS total_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) AS new_users_30d,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS new_users_7d,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) AS new_users_24h
FROM
  public.users;

-- Raum-Statistiken
CREATE OR REPLACE VIEW public.room_statistics AS
SELECT
  COUNT(*) AS total_rooms,
  COUNT(CASE WHEN status = 'live' THEN 1 END) AS active_rooms,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) AS new_rooms_30d,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS new_rooms_7d
FROM
  public.rooms;

-- Teilnahme-Statistiken
CREATE OR REPLACE VIEW public.participation_statistics AS
SELECT
  COUNT(*) AS total_participations,
  COUNT(DISTINCT room_id) AS rooms_with_participants,
  COUNT(DISTINCT user_id) AS participating_users,
  COUNT(CASE WHEN joined_at > NOW() - INTERVAL '7 days' THEN 1 END) AS new_participations_7d,
  COUNT(CASE WHEN joined_at > NOW() - INTERVAL '1 day' THEN 1 END) AS new_participations_24h
FROM
  public.room_participants;

-- Top-Benutzer nach Raumteilnahmen
CREATE OR REPLACE VIEW public.top_users_by_participation AS
SELECT
  u.id,
  u.name,
  au.email,
  COUNT(rp.room_id) AS room_count
FROM
  public.users u
JOIN
  auth.users au ON u.id = au.id
LEFT JOIN
  public.room_participants rp ON u.id = rp.user_id
GROUP BY
  u.id, u.name, au.email
ORDER BY
  room_count DESC
LIMIT 50;

-- Führe diese Funktion nach dem Schema-Update aus, um den ersten Benutzer als Admin zu setzen
-- SELECT public.set_first_user_as_admin();
