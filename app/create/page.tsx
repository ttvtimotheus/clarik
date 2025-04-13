import * as React from 'react'
import { Header } from "@/components/Header"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CreateRoomForm } from "@/components/room/CreateRoomForm"

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
      <footer className="border-t border-border py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} clarik.app</p>
          <div className="space-x-4">
            <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary">Impressum</Link>
            <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
