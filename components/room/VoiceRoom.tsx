"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LiveKitRoom,
  useParticipants, 
  useLocalParticipant, 
  useConnectionState,
  useTracks,
  RoomAudioRenderer
} from '@livekit/components-react';
import { Track, ConnectionState } from 'livekit-client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mic, MicOff, Hand, LogOut, Users } from 'lucide-react';
import { 
  Card, 
  CardContent,
  Avatar, 
  AvatarFallback, 
  AvatarImage,
  Button,
  Badge,
  useToast,
  ScrollArea,
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger,
  Separator 
} from '@/components/ui';

interface VoiceRoomProps {
  roomId: string;
  roomName: string;
}

// Anzeige der Audio-Aktivität
function AudioIndicator({ active }: { active: boolean }) {
  const bars = 4;
  
  return (
    <div className="flex items-center justify-center gap-[2px] h-3">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-300 ${
            active 
              ? `bg-primary animate-pulse h-${1 + Math.floor(Math.random() * 3)}` 
              : 'bg-muted h-1'
          }`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: active ? `${Math.max(4, Math.floor(Math.random() * 12))}px` : '4px'
          }}
        />
      ))}
    </div>
  );
}

// Teilnehmer-Liste
function ParticipantsList() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks(
    [...participants, localParticipant]
  ).filter(track => track.source === Track.Source.Microphone);

  // Teilnehmer nach Rolle sortieren
  const moderators = participants.filter(p => p.metadata && JSON.parse(p.metadata).role === 'moderator');
  const speakers = participants.filter(p => {
    const meta = p.metadata ? JSON.parse(p.metadata) : null;
    return meta && meta.role === 'speaker';
  });
  const listeners = participants.filter(p => {
    const meta = p.metadata ? JSON.parse(p.metadata) : null;
    return !meta || meta.role === 'listener';
  });
  
  // Lokaler Teilnehmer
  const localMeta = localParticipant.metadata ? JSON.parse(localParticipant.metadata) : { role: 'listener' };
  
  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Teilnehmer</h3>
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {participants.length + 1}
          </Badge>
        </div>
        
        <ScrollArea className="h-[300px] pr-3">
          {moderators.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground mb-2">Moderatoren</div>
              {moderators.map(participant => {
                const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
                const isSpeaking = tracks.some(track => 
                  track.participant.identity === participant.identity && track.source === Track.Source.Microphone && track.audioLevel > 0.1
                );
                
                return (
                  <div key={participant.identity} className="flex items-center gap-2 mb-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={meta.avatarUrl} />
                        <AvatarFallback>{meta.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        <Badge variant="default" className="h-4 w-4 p-0 flex items-center justify-center">M</Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{meta.name || participant.identity}</div>
                      <AudioIndicator active={isSpeaking} />
                    </div>
                    <div className="flex gap-1">
                      {participant.isMicrophoneEnabled ? 
                        <Mic className="h-4 w-4 text-primary" /> : 
                        <MicOff className="h-4 w-4 text-muted-foreground" />
                      }
                      {meta.handRaised && <Hand className="h-4 w-4 text-amber-500" />}
                    </div>
                  </div>
                );
              })}
              <Separator className="my-2" />
            </>
          )}
          
          {speakers.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground mb-2">Speaker</div>
              {speakers.map(participant => {
                const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
                const isSpeaking = tracks.some(track => 
                  track.participant.identity === participant.identity && track.source === Track.Source.Microphone && track.audioLevel > 0.1
                );
                
                return (
                  <div key={participant.identity} className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={meta.avatarUrl} />
                      <AvatarFallback>{meta.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{meta.name || participant.identity}</div>
                      <AudioIndicator active={isSpeaking} />
                    </div>
                    <div className="flex gap-1">
                      {participant.isMicrophoneEnabled ? 
                        <Mic className="h-4 w-4 text-primary" /> : 
                        <MicOff className="h-4 w-4 text-muted-foreground" />
                      }
                      {meta.handRaised && <Hand className="h-4 w-4 text-amber-500" />}
                    </div>
                  </div>
                );
              })}
              <Separator className="my-2" />
            </>
          )}
          
          {/* Lokaler Teilnehmer */}
          <div className="text-xs text-muted-foreground mb-2">Du</div>
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarImage src={localMeta.avatarUrl} />
              <AvatarFallback>{localMeta.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{localMeta.name || localParticipant.identity}</div>
              <div className="text-xs text-muted-foreground capitalize">{localMeta.role || 'Zuhörer'}</div>
            </div>
            <div className="flex gap-1">
              {localParticipant.isMicrophoneEnabled ? 
                <Mic className="h-4 w-4 text-primary" /> : 
                <MicOff className="h-4 w-4 text-muted-foreground" />
              }
              {localMeta.handRaised && <Hand className="h-4 w-4 text-amber-500" />}
            </div>
          </div>
          
          {listeners.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="text-xs text-muted-foreground mb-2">Zuhörer</div>
              {listeners.map(participant => {
                const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
                
                return (
                  <div key={participant.identity} className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={meta.avatarUrl} />
                      <AvatarFallback>{meta.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{meta.name || participant.identity}</div>
                    </div>
                    {meta.handRaised && <Hand className="h-4 w-4 text-amber-500" />}
                  </div>
                );
              })}
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Steuerelemente für den Raum
function RoomControls() {
  const { localParticipant } = useLocalParticipant();
  const supabase = createClient();
  const [handRaised, setHandRaised] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);
  const [userMeta, setUserMeta] = useState<any>({});
  const router = useRouter();
  const { toast } = useToast();
  
  // Hole die Metadaten des Teilnehmers
  useEffect(() => {
    try {
      if (localParticipant.metadata) {
        const meta = JSON.parse(localParticipant.metadata);
        setUserMeta(meta);
        setHandRaised(!!meta.handRaised);
      }
    } catch (e) {
      console.error('Failed to parse participant metadata:', e);
    }
  }, [localParticipant.metadata]);
  
  // Funktion zum Hand heben/senken
  const toggleHandRaise = async () => {
    try {
      const newState = !handRaised;
      setHandRaised(newState);
      
      // Update participant metadata
      const newMeta = { ...userMeta, handRaised: newState };
      localParticipant.setMetadata(JSON.stringify(newMeta));
      
      // Optional: Aktualisiere auch in Supabase für Persistenz
      // Diese Tabelle muss zuerst erstellt werden
      if (roomData) {
        // Du müsstest zuerst die raised_hands-Tabelle erstellen
        // Verwende stattdessen einen API-Endpunkt oder speichere den Status im RoomStore
        console.log('Handraising status changed:', newState);
      }
      
      toast({
        title: newState ? "Hand gehoben" : "Hand gesenkt",
        description: newState 
          ? "Der Moderator wird benachrichtigt, dass du sprechen möchtest." 
          : "Du hast deine Hand gesenkt.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error toggling hand raise:', error);
      toast({
        title: "Fehler",
        description: "Deine Aktion konnte nicht verarbeitet werden.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Funktion zum Verlassen des Raums
  const leaveRoom = () => {
    router.push('/explore');
  };
  
  const canPublishAudio = userMeta.role === 'moderator' || userMeta.role === 'speaker';
  
  return (
    <Card className="mt-4">
      <CardContent className="p-4 flex items-center justify-between">
        <TooltipProvider>
          <div className="flex gap-2">
            {canPublishAudio && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={localParticipant.isMicrophoneEnabled ? "default" : "outline"}
                    size="icon"
                    onClick={() => localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled)}
                  >
                    {localParticipant.isMicrophoneEnabled ? 
                      <Mic className="h-4 w-4" /> : 
                      <MicOff className="h-4 w-4" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {localParticipant.isMicrophoneEnabled ? "Mikrofon ausschalten" : "Mikrofon einschalten"}
                </TooltipContent>
              </Tooltip>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={handRaised ? "default" : "outline"}
                  size="icon"
                  onClick={toggleHandRaise}
                >
                  <Hand className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {handRaised ? "Hand senken" : "Hand heben"}
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive"
                size="sm"
                onClick={leaveRoom}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Raum verlassen
              </Button>
            </TooltipTrigger>
            <TooltipContent>Verlasse diesen Raum</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

export default function VoiceRoom({ roomId, roomName }: VoiceRoomProps) {
  const [token, setToken] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('listener');
  const [connecting, setConnecting] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const connectionState = useConnectionState();
  
  const supabase = createClient();
  
  // Hole den Raum und überprüfe die Berechtigungen
  useEffect(() => {
    const fetchRoomAndParticipant = async () => {
      try {
        // Hole den Raum
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();
        
        if (roomError || !roomData) {
          setError('Raum nicht gefunden');
          setConnecting(false);
          return;
        }
        
        setRoom(roomData);
        
        // Überprüfe, ob der Benutzer angemeldet ist
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        
        // Überprüfe, ob der Benutzer ein Teilnehmer des Raums ist
        const { data: participant, error: participantError } = await supabase
          .from('room_participants')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('room_id', roomId)
          .single();
        
        if (participantError || !participant) {
          // Füge den Benutzer automatisch als Zuhörer hinzu, wenn er nicht bereits teilnimmt
          const { error: joinError } = await supabase
            .from('room_participants')
            .insert({
              user_id: session.user.id,
              room_id: roomId,
              role: 'listener'
            });
          
          if (joinError) {
            setError('Fehler beim Beitreten des Raums');
            setConnecting(false);
            return;
          }
          
          setUserRole('listener');
        } else {
          setUserRole(participant.role);
        }
        
        // Token generieren
        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId,
            role: participant?.role || 'listener',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to get token');
        }
        
        const { token: livekitToken } = await response.json();
        setToken(livekitToken);
        setConnecting(false);
      } catch (err) {
        console.error('Error fetching room and participant:', err);
        setError('Fehler beim Verbinden mit dem Raum');
        setConnecting(false);
        
        toast({
          title: "Fehler",
          description: "Es gab ein Problem beim Verbinden mit dem Raum.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };
    
    fetchRoomAndParticipant();
  }, [roomId, supabase, router, toast]);
  
  // Konfiguriere LiveKit-Optionen basierend auf der Benutzerrolle
  const canPublish = userRole === 'moderator' || userRole === 'speaker';
  
  // Benutzerinfo für LiveKit-Metadaten
  const getUserInfo = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data: userData } = await supabase
        .from('users')
        .select('name, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      return {
        name: userData?.name || session.user.email?.split('@')[0],
        avatarUrl: userData?.avatar_url,
        role: userRole,
        userId: session.user.id,
      };
    } catch (err) {
      console.error('Error getting user info:', err);
      return null;
    }
  }, [supabase, userRole]);
  
  // Callback für erfolgreiche Verbindung
  const handleConnected = useCallback(() => {
    // Ausgeführt bei Verbindungsaufbau
    getUserInfo().then(userInfo => {
      if (userInfo) {
        console.log('User info retrieved:', userInfo);
        // Metadaten werden automatisch beim Verbindungsaufbau gesetzt
      }
    }).catch(err => {
      console.error('Error getting user info:', err);
    });
  }, [getUserInfo]);
  
  if (connecting) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verbindung zum Raum wird hergestellt...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/explore')}
        >
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }
  
  if (!token) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{roomName || room?.title || 'Audio-Raum'}</h2>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="capitalize">
              {room?.status || 'live'}
            </Badge>
            <Badge variant="outline">{room?.category}</Badge>
            
            <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
              <ConnectionStatusIndicator state={connectionState} />
            </div>
          </div>
          
          {room?.description && (
            <p className="text-sm text-muted-foreground">{room.description}</p>
          )}
        </CardContent>
      </Card>
      
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={canPublish}
        video={false}
        onConnected={handleConnected}
        className="hidden"
      >
        <RoomAudioRenderer />
        <ParticipantsList />
        <RoomControls />
      </LiveKitRoom>
    </div>
  );
}

// Komponente zur Anzeige des Verbindungsstatus
function ConnectionStatusIndicator({ state }: { state: ConnectionState }) {
  const getStateText = () => {
    switch(state) {
      case ConnectionState.Disconnected:
        return 'Getrennt';
      case ConnectionState.Connecting:
        return 'Verbinden...';
      case ConnectionState.Connected:
        return 'Verbunden';
      case ConnectionState.Reconnecting:
        return 'Wiederverbinden...';
      default:
        return 'Unbekannt';
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      <div 
        className={`h-2 w-2 rounded-full ${
          state === ConnectionState.Connected 
            ? 'bg-green-500' 
            : state === ConnectionState.Connecting || state === ConnectionState.Reconnecting
              ? 'bg-amber-500' 
              : 'bg-red-500'
        }`}
      />
      <span>{getStateText()}</span>
    </div>
  );
}
