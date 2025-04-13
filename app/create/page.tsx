import * as React from 'react'
import { Header } from "@/components/Header"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CreateRoomForm } from "@/components/room/CreateRoomForm"
import { Footer } from "@/components/Footer"

export default function CreateRoomPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container max-w-2xl py-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück zur Startseite
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Raum erstellen</h1>
          <CreateRoomForm />
        </section>
      </main>
      <Footer />
    </div>
  )
}
