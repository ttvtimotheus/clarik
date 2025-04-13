import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/Footer"

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
      <Footer />
    </div>
  )
}
