-- Sicherheits-Fix: Verschiebe top_users_by_participation View in ein geschütztes Schema
-- und implementiere angemessene Zugriffsbeschränkungen

-- 1. Erstelle ein neues Schema für Admin-spezifische Ansichten, wenn es nicht existiert
CREATE SCHEMA IF NOT EXISTS admin;

-- 2. Lösche die bestehende View im public-Schema
DROP VIEW IF EXISTS public.top_users_by_participation;

-- 3. Erstelle die View im admin-Schema mit eingeschränkten Daten
CREATE OR REPLACE VIEW admin.top_users_by_participation AS
SELECT
  u.id,
  u.name,
  COUNT(rp.room_id) AS room_count
FROM
  public.users u
LEFT JOIN
  public.room_participants rp ON u.id = rp.user_id
GROUP BY
  u.id, u.name
ORDER BY
  room_count DESC
LIMIT 50;

-- 4. Setze die Zugriffsberechtigungen
-- Standardmäßig keinen Zugriff erteilen
REVOKE ALL ON SCHEMA admin FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA admin FROM anon, authenticated;

-- 5. Erstelle eine Funktion, um zu prüfen, ob ein Benutzer die View abfragen kann
CREATE OR REPLACE FUNCTION admin.can_view_admin_data()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Erstelle eine reguläre View im public-Schema, die gefiltert ist
CREATE OR REPLACE VIEW public.top_users_by_participation AS
SELECT
  id,
  name,
  room_count
FROM
  admin.top_users_by_participation
WHERE
  admin.can_view_admin_data();

-- 7. Create proxy function for front-end to use
CREATE OR REPLACE FUNCTION public.get_top_users_by_participation()
RETURNS TABLE (
  id UUID,
  name TEXT,
  room_count BIGINT
) AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN QUERY SELECT tp.id, tp.name, tp.room_count FROM admin.top_users_by_participation tp;
  ELSE
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::BIGINT WHERE FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
