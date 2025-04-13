"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/Footer";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  ChevronLeft, ChevronRight, Search, UserPlus, Trash2, 
  RefreshCw, Shield, Home, CheckSquare
} from "lucide-react";

// Typ-Definitionen
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
  room_count: number;
}

interface AdminMapType {
  [key: string]: boolean;
}

interface RoomCountMapType {
  [key: string]: number;
}

interface AdminUser {
  id: string;
  is_admin: boolean;
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [processingAction, setProcessingAction] = useState(false);
  const perPage = 10;
  
  const { toast } = useToast();
  const supabase = createClient();
  
  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function fetchUsers() {
    try {
      setLoading(true);

      // 1. Erst die Standardfelder aus der users-Tabelle holen
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url, created_at')
        .order('created_at', { ascending: false })
        .range(page * perPage, (page + 1) * perPage - 1);
      
      if (usersError) throw usersError;
      if (!usersData || usersData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Benutzer-IDs für weitere Abfragen vorbereiten
      const userIds = usersData.map(user => user.id);
      
      // 2. Überprüfe, ob die is_admin-Spalte existiert und hole die Werte wenn möglich
      let isAdminMap: AdminMapType = {};
      try {
        // Dieser Aufruf könnte fehlschlagen, wenn die Spalte noch nicht existiert
        const { data: adminData, error: adminError } = await supabase
          .from('users')
          .select('id, is_admin')
          .in('id', userIds)
          .eq('is_admin', true);
        
        if (!adminError && adminData) {
          // Erstelle eine Map der admin-User
          adminData.forEach((user: any) => {
            if (user && user.id) {
              isAdminMap[user.id] = true;
            }
          });
        }
      } catch (err) {
        console.warn("is_admin spalte scheint nicht zu existieren:", err);
      }

      // 3. Zähle die Raumteilnahmen
      const { data: participantData, error: participantError } = await supabase
        .from('room_participants')
        .select('user_id, room_id')
        .in('user_id', userIds);

      // Zähle Räume pro Benutzer
      const roomCountMap: RoomCountMapType = {};
      if (!participantError && participantData) {
        participantData.forEach(participant => {
          roomCountMap[participant.user_id] = (roomCountMap[participant.user_id] || 0) + 1;
        });
      }

      // 4. Hole E-Mail-Adressen aus auth.users
      // In diesem Beispiel fügen wir Dummy-E-Mails ein, da direkter Zugriff auf auth.users
      // über die client API eingeschränkt sein kann
      
      // Transformiere die Daten in ein passendes Format
      const formattedUsers = usersData.map(user => ({
        id: user.id,
        name: user.name,
        email: `${user.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Dummy Email
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        is_admin: isAdminMap[user.id] || false,
        room_count: roomCountMap[user.id] || 0
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
      toast({
        title: "Fehler",
        description: "Benutzer konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  }

  async function handleToggleAdmin(userId: string, currentValue: boolean) {
    try {
      setProcessingAction(true);
      
      // Füge explizit ein Typ-Assertion hinzu
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentValue } as any)
        .eq('id', userId);
        
      if (error) throw error;
      
      // Aktualisiere den lokalen Zustand
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, is_admin: !currentValue } 
            : user
        )
      );
      
      toast({
        title: "Erfolg",
        description: `Admin-Status für ${users.find(u => u.id === userId)?.name} aktualisiert.`,
      });
    } catch (error) {
      console.error("Fehler beim Ändern des Admin-Status:", error);
      toast({
        title: "Fehler",
        description: "Admin-Status konnte nicht geändert werden.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  }

  function toggleSelectUser(userId: string) {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }

  function selectAllUsers() {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  }

  async function deleteSelectedUsers() {
    try {
      setProcessingAction(true);
      
      // In einer echten Implementierung würde man wahrscheinlich einen Admin-API-Endpunkt nutzen
      // um Benutzer zu löschen, da das direkte Löschen aus auth.users besondere Berechtigungen erfordert
      
      for (const userId of selectedUsers) {
        // Hier könntest du einen API-Endpunkt aufrufen, der einen Supabase Admin Client verwendet
        // In diesem Beispiel zeigen wir nur ein Toast für jeden Benutzer
        console.log(`Benutzer ${userId} würde gelöscht werden`);
      }
      
      toast({
        title: "Hinweis",
        description: `In einer Produktionsumgebung würden ${selectedUsers.length} Benutzer gelöscht werden.`,
      });
      
      // Reset selection
      setSelectedUsers([]);
      
    } catch (error) {
      console.error("Fehler beim Löschen der Benutzer:", error);
      toast({
        title: "Fehler",
        description: "Benutzer konnten nicht gelöscht werden.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center space-x-2">
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
          <div className="flex items-center mb-6">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mr-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Zurück zum Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Name oder E-Mail suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={() => fetchUsers()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={selectedUsers.length === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Admin-Status ändern
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={selectedUsers.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Benutzer löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sind Sie sicher, dass Sie {selectedUsers.length} Benutzer löschen möchten? 
                      Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={deleteSelectedUsers} 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableCaption>Liste aller registrierten Benutzer auf der Clarik-Plattform.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedUsers.length > 0 && selectedUsers.length === users.length}
                      onCheckedChange={selectAllUsers}
                      aria-label="Alle auswählen"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Registriert am</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Räume</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: perPage }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                          aria-label={`Benutzer ${user.name} auswählen`}
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        {user.is_admin && <CheckSquare className="h-4 w-4 text-primary" />}
                      </TableCell>
                      <TableCell>{user.room_count}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={user.is_admin ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                          disabled={processingAction}
                        >
                          {user.is_admin ? 'Admin entfernen' : 'Zum Admin machen'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Keine Benutzer gefunden.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={users.length < perPage || loading}
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
