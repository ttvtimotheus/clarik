import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id
    const supabase = createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }
    
    // Check if room exists
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, status')
      .eq('id', roomId)
      .single()
    
    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Raum nicht gefunden' },
        { status: 404 }
      )
    }
    
    // Check if room is not ended
    if (room.status === 'ended') {
      return NextResponse.json(
        { error: 'Dieser Raum ist bereits beendet' },
        { status: 400 }
      )
    }
    
    // Check if user is already in room
    const { data: existingParticipant, error: participantError } = await supabase
      .from('room_participants')
      .select('user_id, role')
      .eq('room_id', roomId)
      .eq('user_id', user.id)
      .maybeSingle()
    
    if (existingParticipant) {
      return NextResponse.json(
        { message: 'Du bist bereits in diesem Raum', role: existingParticipant.role },
        { status: 200 }
      )
    }
    
    // Add user to room as listener
    const { data: participant, error: joinError } = await supabase
      .from('room_participants')
      .insert({
        user_id: user.id,
        room_id: roomId,
        role: 'listener'
      })
      .select()
      .single()
    
    if (joinError) {
      return NextResponse.json(
        { error: joinError.message },
        { status: 500 }
      )
    }
    
    // If room was in planned state, set it to live when first user joins
    if (room.status === 'planned') {
      await supabase
        .from('rooms')
        .update({ status: 'live', updated_at: new Date().toISOString() })
        .eq('id', roomId)
    }
    
    return NextResponse.json(participant)
  } catch (error) {
    console.error('Error joining room:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
