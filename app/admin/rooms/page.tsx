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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  ChevronLeft, ChevronRight, Search, Trash2, 
  RefreshCw, Home, Play, Clock, CheckCircle2, XCircle, PauseCircle
} from "lucide-react";

// Raum-Typ
interface Room {
  id: string;
  title: string;
  category: string;
  description: string | null;
  created_by: string;
  creator_name: string;
  created_at: string;
  status: 'planned' | 'live' | 'ended';
  participant_count: number;
}

export default function AdminRoomsPage() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [processingAction, setProcessingAction] = useState(false);
  const perPage = 10;
  
  const { toast } = useToast();
  const supabase = createClient();
  
  useEffect(() => {
    fetchRooms();
  }, [page]);

  async function fetchRooms() {
    try {
      setLoading(true);
      
      let query = supabase
        .from('rooms')
        .select(`
          id,
          title,
          category,
          description,
          created_by,
          created_at,
          status,
          users!inner(name)
        `)
        .order('created_at', { ascending: false })
        .range(page * perPage, (page + 1) * perPage - 1);
        
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Für jeden Raum die Anzahl der Teilnehmer abrufen
      const roomsWithParticipants = await Promise.all(
        data.map(async (room) => {
          const { count, error: countError } = await supabase
            .from('room_participants')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);
            
          return {
            id: room.id,
            title: room.title,
            category: room.category,
            description: room.description,
            created_by: room.created_by,
            creator_name: room.users?.name || 'Unbekannt',
            created_at: room.created_at,
            status: room.status,
            participant_count: count || 0
          };
        })
      );
      
      setRooms(roomsWithParticipants);
    } catch (error) {
      console.error("Fehler beim Laden der Räume:", error);
      toast({
        title: "Fehler",
        description: "Räume konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    fetchRooms();
  }

  async function handleStatusChange(roomId: string, newStatus: 'planned' | 'live' | 'ended') {
    try {
      setProcessingAction(true);
      
      const { error } = await supabase
        .from('rooms')
        .update({ status: newStatus })
        .eq('id', roomId);
        
      if (error) throw error;
      
      // Aktualisiere den lokalen Zustand
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, status: newStatus } 
            : room
        )
      );
      
      toast({
        title: "Erfolg",
        description: `Status für Raum "${rooms.find(r => r.id === roomId)?.title}" aktualisiert.`,
      });
    } catch (error) {
      console.error("Fehler beim Ändern des Raumstatus:", error);
      toast({
        title: "Fehler",
        description: "Raumstatus konnte nicht geändert werden.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  }

  function toggleSelectRoom(roomId: string) {
    setSelectedRooms(prev => 
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  }

  function selectAllRooms() {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rooms.map(room => room.id));
    }
  }

  async function deleteSelectedRooms() {
    try {
      setProcessingAction(true);
      
      // In einer echten Implementierung würde man hier wahrscheinlich auch Raumteilnehmer entfernen
      // und eventuell weitere Aufräumarbeiten durchführen
      
      for (const roomId of selectedRooms) {
        const { error } = await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId);
          
        if (error) throw error;
      }
      
      toast({
        title: "Erfolg",
        description: `${selectedRooms.length} Räume wurden erfolgreich gelöscht.`,
      });
      
      // Reset selection and refresh
      setSelectedRooms([]);
      fetchRooms();
      
    } catch (error) {
      console.error("Fehler beim Löschen der Räume:", error);
      toast({
        title: "Fehler",
        description: "Räume konnten nicht gelöscht werden.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  }

  // Rendern eines passenden Status-Badges
  function renderStatusBadge(status: string) {
    switch (status) {
      case 'planned':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Geplant</Badge>;
      case 'live':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><Play className="h-3 w-3" /> Live</Badge>;
      case 'ended':
        return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Beendet</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            <h1 className="text-3xl font-bold">Raumverwaltung</h1>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Titel oder Kategorie suchen..."
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
                onClick={() => fetchRooms()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={selectedRooms.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Räume löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sind Sie sicher, dass Sie {selectedRooms.length} Räume löschen möchten? 
                      Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={deleteSelectedRooms} 
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
              <TableCaption>Liste aller Räume auf der Clarik-Plattform.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRooms.length > 0 && selectedRooms.length === rooms.length}
                      onCheckedChange={selectAllRooms}
                      aria-label="Alle auswählen"
                    />
                  </TableHead>
                  <TableHead>Titel</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Ersteller</TableHead>
                  <TableHead>Erstellt am</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Teilnehmer</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: perPage }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : rooms.length > 0 ? (
                  rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRooms.includes(room.id)}
                          onCheckedChange={() => toggleSelectRoom(room.id)}
                          aria-label={`Raum ${room.title} auswählen`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{room.title}</TableCell>
                      <TableCell>{room.category}</TableCell>
                      <TableCell>{room.creator_name}</TableCell>
                      <TableCell>
                        {new Date(room.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(room.status)}
                      </TableCell>
                      <TableCell>{room.participant_count}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <div className="flex justify-end space-x-2">
                          {room.status !== 'planned' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(room.id, 'planned')}
                              disabled={processingAction}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {room.status !== 'live' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(room.id, 'live')}
                              disabled={processingAction}
                              className="bg-green-100 dark:bg-green-900"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {room.status !== 'ended' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(room.id, 'ended')}
                              disabled={processingAction}
                              className="bg-muted"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      Keine Räume gefunden.
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
              disabled={rooms.length < perPage || loading}
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
