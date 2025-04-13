import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
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
    
    // Get request body
    const { status } = await request.json()
    
    if (!status || !['planned', 'live', 'ended'].includes(status)) {
      return NextResponse.json(
        { error: 'Gültiger Status (planned, live, ended) ist erforderlich' },
        { status: 400 }
      )
    }
    
    // Check if current user is the room creator or a moderator
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('created_by')
      .eq('id', roomId)
      .single()
    
    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Raum nicht gefunden' },
        { status: 404 }
      )
    }
    
    const isCreator = room.created_by === user.id
    
    if (!isCreator) {
      const { data: moderator, error: moderatorError } = await supabase
        .from('room_participants')
        .select('role')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .eq('role', 'moderator')
        .maybeSingle()
      
      if (moderatorError || !moderator) {
        return NextResponse.json(
          { error: 'Nur Moderatoren oder der Ersteller können den Status ändern' },
          { status: 403 }
        )
      }
    }
    
    // Update room status
    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId)
      .select()
      .single()
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error updating room status:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
