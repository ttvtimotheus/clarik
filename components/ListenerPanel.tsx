"use client"

import { AvatarList } from "@/components/AvatarList"
import { Button } from "@/components/ui/button"
import { Hand } from "lucide-react"

interface User {
  id: string
  name: string
  image?: string
  isSpeaking?: boolean
  role: "moderator" | "speaker" | "listener"
}

interface ListenerPanelProps {
  users: User[]
}

export function ListenerPanel({ users }: ListenerPanelProps) {
  return (
    <div className="w-64 border-l border-border p-4">
      <div className="mb-6">
        <Button variant="outline" className="w-full gap-2">
          <Hand className="h-4 w-4" />
          Hand heben
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-sm font-medium">Zuhörer:innen ({users.filter(u => u.role === 'listener').length})</h3>
          <AvatarList 
            users={users} 
            type="listener"
            maxDisplay={12}
          />
        </div>
      </div>
    </div>
  )
}
