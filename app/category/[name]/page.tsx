"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"

export default function CategoryPage() {
  const { name } = useParams()
  
  // Kategoriename für die Anzeige formatieren
  const categoryName = typeof name === 'string' 
    ? name.charAt(0).toUpperCase() + name.slice(1) 
    : 'Kategorie'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12">
          <Link 
            href="/explore" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück zur Übersicht
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Kategorie: {categoryName}</h1>
          
          <div className="space-y-12">
            <div className="grid gap-6 p-12 text-center border border-border rounded-lg">
              <h3 className="text-xl">In dieser Kategorie sind aktuell keine Diskussionen verfügbar</h3>
              <p className="text-muted-foreground">
                Erstellen Sie eine neue Diskussion oder schauen Sie später wieder vorbei
              </p>
              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/create">Neue Diskussion starten</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} clarik.app</p>
          <div className="space-x-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Impressum</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
