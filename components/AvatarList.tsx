"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface User {
  id: string
  name: string
  image?: string
  isSpeaking?: boolean
  role: "moderator" | "speaker" | "listener"
}

interface AvatarListProps {
  users: User[]
  type: "moderator" | "speaker" | "listener"
  maxDisplay?: number
}

export function AvatarList({ users, type, maxDisplay = 8 }: AvatarListProps) {
  const filteredUsers = users.filter(user => user.role === type)
  const displayUsers = filteredUsers.slice(0, maxDisplay)
  const remainingCount = filteredUsers.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-3">
      <TooltipProvider>
        {displayUsers.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                <Avatar className={`h-14 w-14 border-2 ${user.isSpeaking ? 'border-primary' : 'border-transparent'}`}>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{user.name.split(' ')[0]}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-14 w-14 border-2 border-transparent">
                <AvatarFallback>+{remainingCount}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} weitere {type === "moderator" ? "Moderatoren" : type === "speaker" ? "Sprecher" : "Zuhörer"}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}
