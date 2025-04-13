import * as React from 'react'
import { Header } from "@/components/Header"
import { RoomDetails } from "@/components/room/RoomDetails"
import { Footer } from "@/components/Footer"

export default function RoomPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <RoomDetails />
      </main>
      <Footer />
    </div>
  )
}
