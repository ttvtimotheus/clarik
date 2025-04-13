"use client"

import * as React from 'react'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import useRoomStore from '@/lib/store/roomStore'
import { ParticipantsList } from '@/components/room/ParticipantsList'
import { RoomControls } from '@/components/room/RoomControls'
import { VoiceRoomButton } from '@/components/room/VoiceRoomButton'
import { createClient } from '@/lib/supabase/client'

export function RoomDetails() {
  const { 
    currentRoom, 
    participants, 
    isLoading, 
    error, 
    fetchRoom, 
    joinRoom,
    subscribeToRoomUpdates
  } = useRoomStore()
  
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const roomId = params.id
  
  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId)
      
      // Set up realtime subscription
      const unsubscribe = subscribeToRoomUpdates(roomId)
      
      // Cleanup subscription on unmount
      return () => {
        unsubscribe()
      }
    }
  }, [roomId, fetchRoom, subscribeToRoomUpdates])
  
  // Check if current user is in room
  const [isUserInRoom, setIsUserInRoom] = React.useState(false)
  const [userRole, setUserRole] = React.useState<'moderator' | 'speaker' | 'listener' | null>(null)
  const [userId, setUserId] = React.useState<string | null>(null)
  
  // Get current user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserId(user.id)
        
        // Check if user is in participants list
        if (participants.length > 0) {
          const participant = participants.find(p => p.user_id === user.id)
          
          if (participant) {
            setIsUserInRoom(true)
            setUserRole(participant.role)
          } else {
            setIsUserInRoom(false)
            setUserRole(null)
          }
        }
      }
    }
    
    fetchUserInfo()
  }, [participants])
  
  const handleJoinRoom = async () => {
    if (roomId) {
      await joinRoom(roomId)
    }
  }
  
  // Filter participants by role
  const moderators = participants.filter(p => p.role === 'moderator')
  const speakers = participants.filter(p => p.role === 'speaker')
  const listeners = participants.filter(p => p.role === 'listener')
  
  if (isLoading && !currentRoom) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Raum wird geladen...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
        <h3 className="font-semibold mb-2">Ein Fehler ist aufgetreten</h3>
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/')}
        >
          Zurück zur Startseite
        </Button>
      </div>
    )
  }
  
  if (!currentRoom) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="font-semibold mb-2">Raum nicht gefunden</h3>
        <p className="text-muted-foreground mb-4">
          Der gesuchte Raum existiert nicht oder wurde gelöscht.
        </p>
        <Button asChild>
          <Link href="/">Zurück zur Startseite</Link>
        </Button>
      </div>
    )
  }
  
  // Status label colors
  const statusColors = {
    planned: "bg-blue-500/10 text-blue-500",
    live: "bg-green-500/10 text-green-500",
    ended: "bg-amber-500/10 text-amber-500"
  }
  
  const statusLabels = {
    planned: "Geplant",
    live: "Live",
    ended: "Beendet"
  }

  return (
    <div className="space-y-8">
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Zurück zur Startseite
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentRoom.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline">{currentRoom.category}</Badge>
              <Badge 
                variant="outline" 
                className={statusColors[currentRoom.status]}
              >
                {statusLabels[currentRoom.status]}
              </Badge>
            </div>
          </div>
          
          {!isUserInRoom && (
            <Button onClick={handleJoinRoom}>
              Raum beitreten
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            {isUserInRoom && (
              <VoiceRoomButton 
                roomId={roomId}
                disabled={currentRoom.status === 'ended'} 
              />
            )}
            
            {isUserInRoom && userRole && (
              <RoomControls 
                roomId={roomId} 
                userRole={userRole} 
                isCreator={userId === currentRoom.created_by}
                roomStatus={currentRoom.status}
              />
            )}
          </div>
        </div>
        
        {currentRoom.description && (
          <div className="mt-4 text-muted-foreground">
            {currentRoom.description}
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Moderators */}
        <div>
          <h2 className="text-lg font-medium mb-4">Moderatoren ({moderators.length})</h2>
          <ParticipantsList 
            participants={moderators} 
            currentUserRole={userRole} 
            roomId={roomId}
            roomStatus={currentRoom.status}
          />
        </div>
        
        {/* Speakers */}
        <div>
          <h2 className="text-lg font-medium mb-4">Sprecher ({speakers.length})</h2>
          <ParticipantsList 
            participants={speakers} 
            currentUserRole={userRole} 
            roomId={roomId}
            roomStatus={currentRoom.status}
          />
        </div>
        
        {/* Listeners */}
        <div>
          <h2 className="text-lg font-medium mb-4">Zuhörer ({listeners.length})</h2>
          <ParticipantsList 
            participants={listeners} 
            currentUserRole={userRole} 
            roomId={roomId}
            roomStatus={currentRoom.status}
          />
        </div>
      </div>
    </div>
  )
}
