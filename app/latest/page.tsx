import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"

export default function LatestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Angemeldet</h1>
          
          <div className="space-y-12">
            <div className="grid gap-6 p-12 text-center border border-border rounded-lg">
              <h3 className="text-xl">Melden Sie sich an, um Ihre persönliche Übersicht zu sehen</h3>
              <p className="text-muted-foreground">
                Nach der Anmeldung können Sie Ihre besuchten Räume, gespeicherten Diskussionen und mehr sehen
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg">Anmelden</Button>
                <Button size="lg" variant="outline">Registrieren</Button>
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
