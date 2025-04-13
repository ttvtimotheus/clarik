"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RoomCardProps {
  id: string
  title: string
  category: string
  participants: number
  duration: number
}

export function RoomCard({ id, title, category, participants, duration }: RoomCardProps) {
  return (
    <Link href={`/room/${id}`}>
      <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <Badge variant="secondary" className="mt-2">
                {category}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Users className="mr-1 h-3.5 w-3.5" />
              <span>{participants}</span>
            </div>
            <div>Live seit {duration} Min</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
