import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Definiere zulässige Raumstatus-Typen
type RoomStatus = 'planned' | 'live' | 'ended'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }
    
    console.log('Authenticated user:', user.id)
    
    // Einfache Methode: Überprüfen und nur im Fehlerfall einfügen
    try {
      // Suche zuerst nach dem Benutzer
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()
      
      // Falls Benutzer nicht existiert, erstelle ihn
      if (!existingUser) {
        console.log('User not found in database, creating profile for ID:', user.id)
        
        // Insert mit allen Pflichtfeldern
        const { error: insertError } = await supabase
          .from('users')
          .insert({ 
            id: user.id, 
            name: user.email || 'Benutzer' // Name ist ein Pflichtfeld
          })
        
        if (insertError) {
          console.error('Failed to create user:', insertError)
          // Falls wir keinen Benutzer erstellen können, brechen wir ab
          return NextResponse.json(
            { error: 'Konnte Benutzerprofil nicht erstellen. Bitte neu anmelden.' },
            { status: 500 }
          )
        }
      }
    } catch (err) {
      console.error('Error checking/creating user:', err)
      // Fehler beim Überprüfen/Erstellen des Benutzers - trotzdem fortfahren
    }
    
    // Get room data from request
    const { title, category, description = null } = await request.json()
    
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Titel und Kategorie sind erforderlich' },
        { status: 400 }
      )
    }
    
    console.log('Creating room with data:', {
      title,
      category,
      description,
      created_by: user.id
    })
    
    // Create new room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        title,
        category,
        description,
        created_by: user.id,
        status: 'planned' as RoomStatus // Explizite Typzuweisung
      })
      .select()
      .single()
    
    if (roomError) {
      console.error('Room creation error:', roomError)
      return NextResponse.json(
        { error: roomError.message },
        { status: 500 }
      )
    }
    
    console.log('Room created successfully:', room)
    return NextResponse.json(room)
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    
    // Build query
    let query = supabase.from('rooms').select(`
      id, 
      title, 
      category, 
      created_at, 
      status, 
      description,
      created_by,
      users (id, name, avatar_url),
      room_participants (user_id, role)
    `)
    
    // Add filters if provided
    if (category) {
      query = query.eq('category', category)
    }
    
    if (status) {
      query = query.eq('status', status as RoomStatus)
    }
    
    // Execute query
    const { data: rooms, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
