# clarik.app

Eine moderne Plattform für sprachbasierte Diskussionen in Themenräumen mit Fokus auf Klarheit, Design und Erwachsenen-UX.

## Features

- **Nutzer-Authentifizierung**: Magic Link, Passkey
- **Raumverwaltung**: Erstellen, Beitreten, Verlassen
- **Rollenvergabe**: Moderator, Speaker, Listener
- **Raum-Status**: Geplant, Live, Beendet
- **Realtime Updates**: Echtzeit-Änderungen bei Teilnehmern und Raumstatus
- **Responsive Design**: Mobile-freundliches UI mit modernem Look

## Tech-Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, PostgreSQL, Realtime)
- **State Management**: Zustand
- **Deployment**: Vercel/Netlify (Frontend), Supabase (Backend)

## Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/yourusername/clarik.git
   cd clarik
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen einrichten (`.env.local` erstellen):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Supabase-Projekt einrichten:
   - Neues Projekt auf [supabase.com](https://supabase.com) erstellen
   - SQL aus `lib/supabase/schema.sql` im SQL-Editor ausführen
   - Authentication > Settings aktivieren: 
     - Email Auth mit "Confirm email" aktiviert
     - Passkey Authentication aktivieren

5. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

6. App unter `http://localhost:3000` öffnen

## Projektstruktur

```
/app - Next.js App Router Seiten
/components - UI-Komponenten
  /auth - Authentifizierungs-Komponenten
  /providers - Context Provider
  /room - Raum-spezifische Komponenten
  /ui - shadcn/ui Komponenten
/lib - Hilfsfunktionen und Module
  /supabase - Supabase Client, Types und Schema
  /store - Zustand Store für State Management
/middleware.ts - Auth-Routing-Middleware
```

## Deployment

### Frontend (Vercel/Netlify)

1. Repository auf GitHub, GitLab oder Bitbucket pushen
2. Mit Vercel/Netlify verbinden
3. Umgebungsvariablen konfigurieren

### Backend (Supabase)

Das Backend ist bereits bei Supabase gehostet. Keine zusätzlichen Deployment-Schritte erforderlich.

## Lizenz

MIT