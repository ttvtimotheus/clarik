import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Footer } from "@/components/Footer"

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
              Timo Haseloff<br />
              Breite Straße 7<br />
              39288 Burg<br />
              Sachsen-Anhalt<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail: webmaster@clarik.app<br />
            </p>

            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Timo Haseloff<br />
              Breite Straße 7<br />
              39288 Burg<br />
              Sachsen-Anhalt<br />
              Deutschland
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
