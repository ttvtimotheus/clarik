import * as React from 'react'
import { Header } from "@/components/Header"
import { RoomDetails } from "@/components/room/RoomDetails"

export default function RoomPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <RoomDetails />
      </main>
      <footer className="border-t border-border py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} clarik.app</p>
          <div className="space-x-4">
            <a href="/impressum" className="text-sm text-muted-foreground hover:text-primary">Impressum</a>
            <a href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
