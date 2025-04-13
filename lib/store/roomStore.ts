import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

export type RoomParticipant = {
  user_id: string
  room_id: string
  role: 'moderator' | 'speaker' | 'listener'
  joined_at: string
  updated_at: string | null
  user?: {
    id: string
    name: string
    avatar_url: string | null
  }
}

export type Room = {
  id: string
  title: string
  category: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string | null
  status: 'planned' | 'live' | 'ended'
  participants: RoomParticipant[]
}

type RoomState = {
  currentRoom: Room | null
  participants: RoomParticipant[]
  isLoading: boolean
  error: string | null
  
  fetchRoom: (roomId: string) => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
  leaveRoom: (roomId: string) => Promise<void>
  changeRole: (roomId: string, userId: string, role: 'moderator' | 'speaker' | 'listener') => Promise<void>
  changeStatus: (roomId: string, status: 'planned' | 'live' | 'ended') => Promise<void>
  
  subscribeToRoomUpdates: (roomId: string) => () => void
}

const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  participants: [],
  isLoading: false,
  error: null,
  
  fetchRoom: async (roomId: string) => {
    const supabase = createClient()
    
    try {
      set({ isLoading: true, error: null })
      
      const { data: room, error } = await supabase
        .from('rooms')
        .select(`
          id, 
          title, 
          category, 
          description,
          created_by, 
          created_at, 
          updated_at, 
          status
        `)
        .eq('id', roomId)
        .single()
      
      if (error) throw new Error(error.message)
      
      const { data: participants, error: participantsError } = await supabase
        .from('room_participants')
        .select(`
          user_id,
          room_id,
          role,
          joined_at,
          updated_at,
          users (
            id,
            name,
            avatar_url
          )
        `)
        .eq('room_id', roomId)
        
      if (participantsError) throw new Error(participantsError.message)
      
      const formattedParticipants = participants.map(p => ({
        user_id: p.user_id,
        room_id: p.room_id,
        role: p.role,
        joined_at: p.joined_at,
        updated_at: p.updated_at,
        user: p.users
      }))
      
      set({ 
        currentRoom: { ...room, participants: formattedParticipants },
        participants: formattedParticipants,
        isLoading: false
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' 
      })
    }
  },
  
  joinRoom: async (roomId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Fehler beim Beitreten des Raums')
      }
      
      // Refresh room data
      await get().fetchRoom(roomId)
      
      set({ isLoading: false })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' 
      })
    }
  },
  
  leaveRoom: async (roomId: string) => {
    const supabase = createClient()
    
    try {
      set({ isLoading: true, error: null })
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Nicht authentifiziert')
      
      const { error } = await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id)
      
      if (error) throw new Error(error.message)
      
      set({ 
        currentRoom: null, 
        participants: [],
        isLoading: false 
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' 
      })
    }
  },
  
  changeRole: async (roomId: string, userId: string, role: 'moderator' | 'speaker' | 'listener') => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await fetch(`/api/rooms/${roomId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Fehler beim Ändern der Rolle')
      }
      
      // Update will come through realtime subscription
      set({ isLoading: false })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' 
      })
    }
  },
  
  changeStatus: async (roomId: string, status: 'planned' | 'live' | 'ended') => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await fetch(`/api/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Fehler beim Ändern des Status')
      }
      
      // Update state directly with new status
      const currentRoom = get().currentRoom
      if (currentRoom) {
        set({ 
          currentRoom: { ...currentRoom, status },
          isLoading: false 
        })
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten' 
      })
    }
  },
  
  subscribeToRoomUpdates: (roomId: string) => {
    const supabase = createClient()
    
    // Subscribe to changes in room_participants
    const participantsSubscription = supabase
      .channel(`room-${roomId}-participants`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          // Refresh room data when participants change
          get().fetchRoom(roomId)
        }
      )
      .subscribe()
    
    // Subscribe to changes in room status
    const roomSubscription = supabase
      .channel(`room-${roomId}-status`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          const currentRoom = get().currentRoom
          if (currentRoom && payload.new) {
            set({ 
              currentRoom: { 
                ...currentRoom, 
                ...payload.new as Partial<Room>
              }
            })
          }
        }
      )
      .subscribe()
    
    // Return a cleanup function
    return () => {
      supabase.removeChannel(participantsSubscription)
      supabase.removeChannel(roomSubscription)
    }
  }
}))

export default useRoomStore
