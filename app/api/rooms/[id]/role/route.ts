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
    const { userId, role } = await request.json()
    
    if (!userId || !role || !['moderator', 'speaker', 'listener'].includes(role)) {
      return NextResponse.json(
        { error: 'Benutzer-ID und gültige Rolle (moderator, speaker, listener) sind erforderlich' },
        { status: 400 }
      )
    }
    
    // Check if current user is a moderator in this room
    const { data: moderator, error: moderatorError } = await supabase
      .from('room_participants')
      .select('role')
      .eq('room_id', roomId)
      .eq('user_id', user.id)
      .eq('role', 'moderator')
      .maybeSingle()
    
    if (moderatorError || !moderator) {
      return NextResponse.json(
        { error: 'Nur Moderatoren können Rollen ändern' },
        { status: 403 }
      )
    }
    
    // Check if target user is in the room
    const { data: participant, error: participantError } = await supabase
      .from('room_participants')
      .select('user_id, role')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .maybeSingle()
    
    if (participantError || !participant) {
      return NextResponse.json(
        { error: 'Benutzer ist nicht in diesem Raum' },
        { status: 404 }
      )
    }
    
    // Update user's role
    const { data: updatedParticipant, error: updateError } = await supabase
      .from('room_participants')
      .update({
        role,
        updated_at: new Date().toISOString()
      })
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedParticipant)
  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
