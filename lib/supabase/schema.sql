-- SCHEMA ZUR ERSTELLUNG DER CLARIK DATENBANK
-- Führen Sie dieses Schema einmal aus, um alle Tabellen zu erstellen

-- 1. Löschen aller vorhandenen Objekte

-- Trigger löschen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_room_created ON public.rooms;

-- Tabellen löschen (in der richtigen Reihenfolge wegen Fremdschlüssel)
DROP TABLE IF EXISTS public.room_participants;
DROP TABLE IF EXISTS public.rooms;
DROP TABLE IF EXISTS public.users;

-- Funktionen löschen
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_room() CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_id() CASCADE;

-- Publikationen löschen
DROP PUBLICATION IF EXISTS supabase_realtime;

-- 2. Tabellen erstellen

-- Benutzer-Tabelle
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  name TEXT DEFAULT 'Benutzer' NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Füge Fremdschlüssel-Constraint nach der Tabellenerstellung hinzu
ALTER TABLE public.users ADD CONSTRAINT user_auth_fk 
  FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- Aktiviere Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies für users
CREATE POLICY "Users can read any profile"
  ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- UUID-Extension aktivieren
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Räume-Tabelle
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('planned', 'live', 'ended')) DEFAULT 'planned' NOT NULL
);

-- Füge Fremdschlüssel nach der Tabellenerstellung hinzu
ALTER TABLE public.rooms ADD CONSTRAINT room_creator_fk
  FOREIGN KEY (created_by) REFERENCES auth.users (id);

-- Aktiviere Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Policies für rooms
CREATE POLICY "Anyone can read rooms"
  ON public.rooms
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create rooms"
  ON public.rooms
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own rooms"
  ON public.rooms
  FOR UPDATE
  USING (created_by = auth.uid());

-- Policy: Only creator can update room
CREATE POLICY "Only creator can update room"
  ON public.rooms
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Raumteilnehmer-Tabelle
CREATE TABLE public.room_participants (
  user_id UUID NOT NULL,
  room_id UUID NOT NULL,
  role TEXT CHECK (role IN ('moderator', 'speaker', 'listener')) DEFAULT 'listener' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (user_id, room_id)
);

-- Füge Fremdschlüssel nach Tabellenerstellung hinzu
ALTER TABLE public.room_participants ADD CONSTRAINT room_participant_user_fk
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.room_participants ADD CONSTRAINT room_participant_room_fk
  FOREIGN KEY (room_id) REFERENCES public.rooms (id) ON DELETE CASCADE;

-- Aktiviere Row Level Security
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read participants" ON public.room_participants;
DROP POLICY IF EXISTS "Users can join rooms" ON public.room_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_participants;
DROP POLICY IF EXISTS "Users can update own participation" ON public.room_participants;

-- Policy: Anyone can read participants
CREATE POLICY "Anyone can read participants"
  ON public.room_participants
  FOR SELECT
  USING (true);

-- Policy: Users can join rooms
CREATE POLICY "Users can join rooms"
  ON public.room_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can leave rooms
CREATE POLICY "Users can leave rooms"
  ON public.room_participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can update own participation
CREATE POLICY "Users can update own participation"
  ON public.room_participants
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Automatisierung: Benutzer und Räume

-- Funktion zum automatischen Einfügen neuer Benutzer in public.users
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', COALESCE(NEW.email, 'Benutzer'))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für neue Benutzer
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Funktion zum Abrufen der aktuellen Benutzer-ID
CREATE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE sql STABLE
AS $$
  SELECT auth.uid();
$$;

-- Row Level Security bereits für jede Tabelle direkt aktiviert

-- Users table policies
-- Allow users to see all profiles (public info)
CREATE POLICY "Users are viewable by everyone"
  ON public.users
  FOR SELECT
  USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (id = get_current_user_id());

-- Rooms table policies
-- Allow anyone to view active rooms
CREATE POLICY "Anyone can view rooms"
  ON public.rooms
  FOR SELECT
  USING (true);

-- Allow authenticated users to create rooms
CREATE POLICY "Authenticated users can create rooms"
  ON public.rooms
  FOR INSERT
  WITH CHECK (get_current_user_id() IS NOT NULL);

-- Allow room creators to update their rooms
CREATE POLICY "Users can update their own rooms"
  ON public.rooms
  FOR UPDATE
  USING (created_by = get_current_user_id());

-- Room participants policies
-- Allow users to see participants in any room
CREATE POLICY "Anyone can view room participants"
  ON public.room_participants
  FOR SELECT
  USING (true);

-- Allow users to join rooms (insert themselves as participant)
CREATE POLICY "Users can join rooms"
  ON public.room_participants
  FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- Allow moderators to update roles in their rooms
CREATE POLICY "Moderators can update participant roles"
  ON public.room_participants
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.room_participants 
      WHERE user_id = get_current_user_id() 
      AND room_id = room_participants.room_id 
      AND role = 'moderator'
    )
  );

-- Allow users to leave rooms (delete their own participation)
CREATE POLICY "Users can leave rooms"
  ON public.room_participants
  FOR DELETE
  USING (user_id = get_current_user_id());

-- Funktion zum automatischen Hinzufügen des Erstellers als Moderator
CREATE FUNCTION public.handle_new_room()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.room_participants (user_id, room_id, role)
  VALUES (NEW.created_by, NEW.id, 'moderator');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für neue Räume
CREATE TRIGGER on_room_created
  AFTER INSERT ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_room();

-- 4. Realtime-Funktionalität aktivieren
CREATE PUBLICATION supabase_realtime FOR TABLE rooms, room_participants, users;
