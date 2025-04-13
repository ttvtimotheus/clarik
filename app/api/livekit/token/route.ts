import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // Erstelle den Supabase-Client
    const supabase = createClient();

    // Überprüfe, ob der Benutzer angemeldet ist
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Parse den Request-Body
    const body = await req.json();
    const { roomId, role } = body;
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    // Überprüfe, ob der angeforderte Raum existiert
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    // Überprüfe, ob der Benutzer ein Teilnehmer des Raums ist
    const { data: participant, error: participantError } = await supabase
      .from('room_participants')
      .select('*')
      .eq('user_id', userId)
      .eq('room_id', roomId)
      .single();
    
    if (participantError || !participant) {
      return NextResponse.json({ error: 'User is not a participant in this room' }, { status: 403 });
    }
    
    // Bestimme die Rolle des Teilnehmers (falls nicht explizit angegeben)
    const participantRole = role || participant.role;
    
    // Generiere den LiveKit Token
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      console.error('LiveKit API key or secret is missing');
      return NextResponse.json({ error: 'LiveKit configuration is missing' }, { status: 500 });
    }
    
    console.log('Generating token for room:', roomId, 'with role:', participantRole);
    console.log('LiveKit URL:', process.env.NEXT_PUBLIC_LIVEKIT_URL);
    
    try {
      const at = new AccessToken(apiKey, apiSecret, {
        identity: userId,
        name: session.user.email, // Benutze die E-Mail als Anzeigename oder hole den Namen aus dem Profil
        ttl: 60 * 60, // Token ist 1 Stunde gültig
      });

      // Raumberechtigung hinzufügen
      at.addGrant({
        roomJoin: true,
        room: roomId,
        canPublish: participantRole === 'speaker' || participantRole === 'moderator',
        canSubscribe: true,
      });

      const token = at.toJwt();
      
      // Stelle sicher, dass token ein String ist
      if (typeof token === 'string') {
        console.log('Generated token successfully:', typeof token);
        return NextResponse.json({ token: token });
      } else if (token instanceof Promise) {
        // Falls toJwt() ein Promise zurückgibt (je nach Implementierung)
        const resolvedToken = await token;
        if (typeof resolvedToken === 'string') {
          console.log('Generated token (from Promise) successfully:', typeof resolvedToken);
          return NextResponse.json({ token: resolvedToken });
        }
      }
      
      // Fallback für andere Fälle
      console.error('Unexpected token type:', typeof token);
      throw new Error('Unexpected token type: ' + typeof token);
    } catch (error) {
      console.error('Error generating LiveKit token:', error);
      return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
