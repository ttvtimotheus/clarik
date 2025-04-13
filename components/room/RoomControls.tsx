"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import useRoomStore from '@/lib/store/roomStore'

interface RoomControlsProps {
  roomId: string
  userRole: 'moderator' | 'speaker' | 'listener'
  isCreator: boolean
  roomStatus: 'planned' | 'live' | 'ended'
}

export function RoomControls({ roomId, userRole, isCreator, roomStatus }: RoomControlsProps) {
  const router = useRouter()
  const { leaveRoom, changeStatus } = useRoomStore()
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false)
  const [endDialogOpen, setEndDialogOpen] = React.useState(false)
  
  const handleLeaveRoom = async () => {
    await leaveRoom(roomId)
    setLeaveDialogOpen(false)
    router.push('/')
  }
  
  const handleChangeStatus = async (status: 'planned' | 'live' | 'ended') => {
    await changeStatus(roomId, status)
    
    if (status === 'ended') {
      setEndDialogOpen(false)
    }
  }
  
  const canControlRoom = userRole === 'moderator' || isCreator
  
  return (
    <div className="flex gap-2">
      {canControlRoom && roomStatus !== 'ended' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Raum verwalten</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {roomStatus === 'planned' && (
              <DropdownMenuItem onClick={() => handleChangeStatus('live')}>
                Diskussion starten
              </DropdownMenuItem>
            )}
            
            {roomStatus === 'live' && (
              <DropdownMenuItem onClick={() => setEndDialogOpen(true)}>
                Diskussion beenden
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {roomStatus !== 'ended' && (
        <Button 
          variant="outline" 
          className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
          onClick={() => setLeaveDialogOpen(true)}
        >
          Verlassen
        </Button>
      )}
      
      {/* Alert Dialog for leaving room */}
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Raum verlassen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du diesen Diskussionsraum wirklich verlassen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveRoom}>Verlassen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Alert Dialog for ending room */}
      <AlertDialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Diskussion beenden?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du diese Diskussion wirklich beenden? Dies kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleChangeStatus('ended')}
              className="bg-destructive hover:bg-destructive/90"
            >
              Beenden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
