"use client"

import Link from "next/link"
import { Home, Users, BookOpen, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  rooms?: {
    id: string
    title: string
    participants: number
    isLive: boolean
  }[]
}

export function Sidebar({ className, rooms = [], ...props }: SidebarProps) {
  // Dummy-Kategorien
  const categories = [
    { name: "Gesellschaft", icon: <Users className="h-4 w-4" /> },
    { name: "Wissenschaft", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Kultur", icon: <Hash className="h-4 w-4" /> },
    { name: "Alltag", icon: <Home className="h-4 w-4" /> },
  ]

  // Dummy-Räume
  const defaultRooms = [
    { id: "1", title: "Die Zukunft der Arbeit", participants: 12, isLive: true },
    { id: "2", title: "Klimawandel: Lokale Lösungen", participants: 8, isLive: true },
    { id: "3", title: "Philosophie im Alltag", participants: 5, isLive: false }
  ]

  const displayRooms = rooms.length ? rooms : defaultRooms

  return (
    <div className={cn("pb-12 w-64 border-r border-border", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Themen
          </h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Aktive Räume
          </h2>
          <div className="space-y-1">
            {displayRooms.map((room) => (
              <Link
                key={room.id}
                href={`/room/${room.id}`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <span className="truncate">{room.title}</span>
                <div className="flex items-center">
                  {room.isLive && (
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/10">
                      Live
                    </Badge>
                  )}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {room.participants}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
