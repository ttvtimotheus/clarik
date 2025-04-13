"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import VoiceRoom from "@/components/room/VoiceRoom";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function VoiceRoomPage() {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const roomId = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // Prüfe, ob der Benutzer angemeldet ist
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push(`/login?redirect=/room/${roomId}/voice`);
          return;
        }

        // Hole den Raum
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (roomError || !roomData) {
          setError('Raum nicht gefunden');
          setLoading(false);
          return;
        }

        setRoom(roomData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Ein Fehler ist aufgetreten');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, supabase, router]);

  const handleBack = () => {
    router.push(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Lade Audioraum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-destructive">{error}</h2>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => router.push('/explore')}
        >
          Zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zurück zum Raum
      </Button>

      <VoiceRoom 
        roomId={roomId} 
        roomName={room?.title || 'Audioraum'} 
      />
    </div>
  );
}
