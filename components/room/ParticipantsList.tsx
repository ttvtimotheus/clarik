"use client"

import * as React from 'react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MoreVertical } from 'lucide-react'
import { RoomParticipant } from '@/lib/store/roomStore'
import useRoomStore from '@/lib/store/roomStore'

interface ParticipantsListProps {
  participants: RoomParticipant[]
  currentUserRole: 'moderator' | 'speaker' | 'listener' | null
  roomId: string
  roomStatus: 'planned' | 'live' | 'ended'
}

export function ParticipantsList({ 
  participants, 
  currentUserRole, 
  roomId,
  roomStatus 
}: ParticipantsListProps) {
  const { changeRole } = useRoomStore()
  
  const handleRoleChange = async (userId: string, newRole: 'moderator' | 'speaker' | 'listener') => {
    await changeRole(roomId, userId, newRole)
  }
  
  // Check if current user is a moderator (with permission to change roles)
  const canChangeRoles = currentUserRole === 'moderator' && roomStatus !== 'ended'
  
  if (participants.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Keine Teilnehmer in dieser Kategorie
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {participants.map((participant) => (
        <div key={participant.user_id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              {participant.user?.avatar_url ? (
                <AvatarImage src={participant.user.avatar_url} alt={participant.user?.name || ''} />
              ) : (
                <AvatarFallback>
                  {participant.user?.name?.charAt(0) || '?'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium">{participant.user?.name}</div>
            </div>
          </div>
          
          {canChangeRoles && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-md hover:bg-accent">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRoleChange(participant.user_id, 'moderator')}>
                  Zum Moderator machen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange(participant.user_id, 'speaker')}>
                  Zum Sprecher machen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange(participant.user_id, 'listener')}>
                  Zum Zuhörer machen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  )
}
