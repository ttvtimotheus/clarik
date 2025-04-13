import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ImpressumPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">clarik</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück zur Startseite
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Impressum</h1>
          
          <div className="prose prose-invert max-w-none">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              clarik GmbH<br />
              Beispielstraße 123<br />
              12345 Berlin
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: +49 123 456789<br />
              E-Mail: info@clarik.app
            </p>

            <h2>Registereintrag</h2>
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht Berlin<br />
              Registernummer: HRB 123456
            </p>

            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Max Mustermann<br />
              Beispielstraße 123<br />
              12345 Berlin
            </p>
          </div>
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
