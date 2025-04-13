import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/Footer"

export default function ExplorePage() {
  // Kategorien als Button-Kacheln
  const categories = [
    { name: "Gesellschaft", color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500" },
    { name: "Wissenschaft", color: "bg-green-500/10 hover:bg-green-500/20 text-green-500" },
    { name: "Kultur", color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-500" },
    { name: "Alltag", color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500" },
    { name: "Technologie", color: "bg-red-500/10 hover:bg-red-500/20 text-red-500" },
    { name: "Politik", color: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500" },
    { name: "Wirtschaft", color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500" },
    { name: "Bildung", color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-500" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Entdecken</h1>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Themen</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(category => (
                  <Button 
                    key={category.name}
                    variant="outline"
                    asChild
                    className={`h-24 text-lg font-medium ${category.color}`}
                  >
                    <Link href={`/category/${category.name.toLowerCase()}`}>
                      {category.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Kommende Events</h2>
              <div className="grid gap-6 p-12 text-center border border-border rounded-lg">
                <h3 className="text-xl">Aktuell keine geplanten Events</h3>
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/create">Eigenen Raum erstellen</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Beliebte Kategorien</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.slice(0, 6).map(category => (
                  <Link 
                    key={category.name}
                    href={`/category/${category.name.toLowerCase()}`}
                    className="p-4 border border-border rounded-lg hover:border-primary transition-all"
                  >
                    <h3 className={`font-medium ${category.color}`}>{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Diskussionen entdecken</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
