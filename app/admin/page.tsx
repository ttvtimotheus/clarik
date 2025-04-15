"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsCard } from "@/components/ui/tabs-card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, Mic, BarChart3, Settings, ChevronRight, Clock, Search,
  UserPlus, Home, ChevronLeft
} from "lucide-react";

// Import der Admin-Typdeklarationen
import "@/lib/supabase/admin-types";

// Typen für die Statistiken
interface UserStats {
  total_users: number;
  new_users_30d: number;
  new_users_7d: number;
  new_users_24h: number;
}

interface RoomStats {
  total_rooms: number;
  active_rooms: number;
  new_rooms_30d: number;
  new_rooms_7d: number;
}

interface ParticipationStats {
  total_participations: number;
  rooms_with_participants: number;
  participating_users: number;
  new_participations_7d: number;
  new_participations_24h: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [participationStats, setParticipationStats] = useState<ParticipationStats | null>(null);
  
  const supabase = createClient();
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Verwende die sicheren RPC-Funktionen für Statistiken
        
        // --- BENUTZERSTATISTIKEN ---
        // Verwende die neue sichere RPC-Funktion statt der unsicheren View
        const { data: userStatsData, error: userStatsError } = await supabase
          .rpc('get_user_statistics');
        
        if (userStatsError) {
          console.error("Fehler beim Abrufen der Benutzerstatistiken:", userStatsError);
          // Fallback: Wenn die RPC-Funktion noch nicht existiert, manuell abrufen
          await fetchUserStatsManually();
        } else if (userStatsData) {
          setUserStats(userStatsData as UserStats);
        }
        
        // --- RAUMSTATISTIKEN ---
        // Ideally we'd use room_statistics as RPC too, but for now keep manual fetch
        const { data: rooms, error: roomsError } = await supabase
          .from('rooms')
          .select('created_at, status');
        
        if (roomsError) throw roomsError;
        
        // Berechne Raumstatistiken manuell
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const roomStatsData: RoomStats = {
          total_rooms: rooms.length,
          active_rooms: rooms.filter(r => r.status === 'live').length,
          new_rooms_30d: rooms.filter(r => new Date(r.created_at) >= thirtyDaysAgo).length,
          new_rooms_7d: rooms.filter(r => new Date(r.created_at) >= sevenDaysAgo).length
        };
        
        setRoomStats(roomStatsData);
        
        // --- TEILNAHMESTATISTIKEN ---
        const { data: participants, error: participantsError } = await supabase
          .from('room_participants')
          .select('user_id, room_id, joined_at');
        
        if (participantsError) throw participantsError;
        
        // Berechne Teilnahmestatistiken manuell
        const uniqueRoomIds = new Set(participants.map(p => p.room_id));
        const uniqueUserIds = new Set(participants.map(p => p.user_id));
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const participationStatsData: ParticipationStats = {
          total_participations: participants.length,
          rooms_with_participants: uniqueRoomIds.size,
          participating_users: uniqueUserIds.size,
          new_participations_7d: participants.filter(p => new Date(p.joined_at) >= sevenDaysAgo).length,
          new_participations_24h: participants.filter(p => new Date(p.joined_at) >= oneDayAgo).length
        };
        
        setParticipationStats(participationStatsData);
        
      } catch (error) {
        console.error("Fehler beim Laden der Dashboard-Daten:", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Fallback-Funktion für Benutzerstatistiken, falls die RPC noch nicht existiert
    async function fetchUserStatsManually() {
      try {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('created_at');
        
        if (usersError) throw usersError;
        
        // Berechne Benutzerstatistiken manuell
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const userStatsData: UserStats = {
          total_users: users.length,
          new_users_30d: users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length,
          new_users_7d: users.filter(u => new Date(u.created_at) >= sevenDaysAgo).length,
          new_users_24h: users.filter(u => new Date(u.created_at) >= oneDayAgo).length
        };
        
        setUserStats(userStatsData);
      } catch (error) {
        console.error("Fehler beim manuellen Abrufen der Benutzerstatistiken:", error);
      }
    }
    
    fetchDashboardData();
    
    // Alle 60 Sekunden aktualisieren
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [supabase]);

  // Statistik-Karten rendern
  const renderStatCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Benutzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-2xl font-bold">{userStats?.total_users || 0}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-green-500">+{userStats?.new_users_30d || 0}</span> in den letzten 30 Tagen
              </p>
              <p className="text-sm text-muted-foreground">
                +{userStats?.new_users_7d || 0} in den letzten 7 Tagen
              </p>
              <p className="text-sm text-muted-foreground">
                +{userStats?.new_users_24h || 0} in den letzten 24 Stunden
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/admin/users">
              Alle Benutzer anzeigen
              <ChevronRight className="ml-auto h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Mic className="mr-2 h-5 w-5 text-primary" />
            Räume
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-2xl font-bold">{roomStats?.total_rooms || 0}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-green-500">{roomStats?.active_rooms || 0}</span> aktive Räume
              </p>
              <p className="text-sm text-muted-foreground">
                +{roomStats?.new_rooms_30d || 0} in den letzten 30 Tagen
              </p>
              <p className="text-sm text-muted-foreground">
                +{roomStats?.new_rooms_7d || 0} in den letzten 7 Tagen
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/admin/rooms">
              Alle Räume anzeigen
              <ChevronRight className="ml-auto h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Aktivität
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-2xl font-bold">{participationStats?.total_participations || 0}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-green-500">{participationStats?.participating_users || 0}</span> aktive Benutzer
              </p>
              <p className="text-sm text-muted-foreground">
                {participationStats?.rooms_with_participants || 0} Räume mit Teilnehmern
              </p>
              <p className="text-sm text-muted-foreground">
                +{participationStats?.new_participations_24h || 0} Teilnahmen in 24h
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/admin/analytics">
              Detaillierte Statistiken
              <ChevronRight className="ml-auto h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Verwaltungs-Schnellzugriffe
  const renderQuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Verwaltung</CardTitle>
          <CardDescription>Verwalten Sie Benutzer, Räume und Einstellungen</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Benutzer verwalten
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/rooms">
              <Mic className="mr-2 h-4 w-4" />
              Räume verwalten
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/system">
              <Settings className="mr-2 h-4 w-4" />
              Systemeinstellungen
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Überwachung & Berichte</CardTitle>
          <CardDescription>Überwachen Sie die Plattformaktivität</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Statistiken & Analysen
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/logs">
              <Clock className="mr-2 h-4 w-4" />
              Aktivitätslogs
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/reports">
              <Search className="mr-2 h-4 w-4" />
              Erweiterte Berichte
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">clarik</span>
            </Link>
            <span className="text-lg font-bold text-muted-foreground">Admin</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Zurück zur Website
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Übersicht und Verwaltung der Clarik-Plattform
            </p>
          </div>
          
          {renderStatCards()}
          {renderQuickActions()}
          
          <TabsCard
            title="Erweitertes Dashboard"
            description="Detaillierte Informationen zur Clarik-Plattform"
            defaultValue="new-users"
            tabs={[
              {
                value: "new-users",
                label: "Neue Benutzer",
                content: (
                  <div className="p-4 bg-muted/40 rounded-md">
                    <h3 className="font-medium mb-2">Neuste Benutzer</h3>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Implementiere Benutzerabfragen in der admin/users.tsx Datei</p>
                    )}
                  </div>
                ),
              },
              {
                value: "active-rooms",
                label: "Aktive Räume",
                content: (
                  <div className="p-4 bg-muted/40 rounded-md">
                    <h3 className="font-medium mb-2">Aktuell aktive Räume</h3>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Implementiere Raumabfragen in der admin/rooms.tsx Datei</p>
                    )}
                  </div>
                ),
              },
              {
                value: "system-status",
                label: "Systemstatus",
                content: (
                  <div className="p-4 bg-muted/40 rounded-md">
                    <h3 className="font-medium mb-2">Aktueller Systemstatus</h3>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Implementiere Statusüberwachung in der admin/system.tsx Datei</p>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
