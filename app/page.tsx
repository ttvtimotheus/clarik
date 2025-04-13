import { Header } from "@/components/Header"
import { RoomCard } from "@/components/RoomCard"
import { Button } from "@/components/ui/button"

export default function Home() {
  // Dummy-Daten für aktive Räume
  const activeRooms = [
    { id: "1", title: "Die Zukunft der Arbeit", category: "Gesellschaft", participants: 12, duration: 45 },
    { id: "2", title: "Klimawandel: Lokale Lösungen", category: "Wissenschaft", participants: 8, duration: 30 },
    { id: "3", title: "Kunstfreiheit im 21. Jahrhundert", category: "Kultur", participants: 5, duration: 15 },
    { id: "4", title: "Mentale Gesundheit im Alltag", category: "Alltag", participants: 10, duration: 20 }
  ]

  // Kategorien als Button-Kacheln
  const categories = [
    { name: "Gesellschaft", color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500" },
    { name: "Wissenschaft", color: "bg-green-500/10 hover:bg-green-500/20 text-green-500" },
    { name: "Kultur", color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-500" },
    { name: "Alltag", color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-24 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Sprich klar. Denk weiter.
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px]">
              Eine moderne Plattform für sprachbasierte Diskussionen mit Fokus auf Klarheit.
            </p>
            <Button size="lg" className="mt-6">
              Jetzt beitreten
            </Button>
          </div>
        </section>

        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Populäre Themen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <Button 
                key={category.name}
                variant="outline"
                className={`h-24 text-lg font-medium ${category.color}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </section>

        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Aktive Räume</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeRooms.map(room => (
              <RoomCard 
                key={room.id}
                id={room.id}
                title={room.title}
                category={room.category}
                participants={room.participants}
                duration={room.duration}
              />
            ))}
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
