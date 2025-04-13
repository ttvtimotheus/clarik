"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'

interface VoiceRoomButtonProps {
  roomId: string
  disabled?: boolean
}

export function VoiceRoomButton({ roomId, disabled = false }: VoiceRoomButtonProps) {
  const router = useRouter()

  const handleJoinVoiceRoom = () => {
    router.push(`/room/${roomId}/voice`)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleJoinVoiceRoom}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      <Volume2 className="h-4 w-4" />
      Audio-Raum beitreten
    </Button>
  )
}
