import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function DatenschutzPage() {
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

          <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

          <div className="prose prose-invert max-w-none">
            <h2>1. Allgemeine Hinweise</h2>
            <p>
              Der Schutz deiner personenbezogenen Daten ist mir wichtig. Diese Website dient einem
              nicht-kommerziellen Zweck und verarbeitet Daten ausschließlich im Rahmen der DSGVO.
              Personenbezogene Daten werden nur verarbeitet, wenn dies technisch erforderlich ist oder
              du ausdrücklich zustimmst.
            </p>

            <h2>2. Verantwortlicher</h2>
            <p>
              Timo Haseloff<br />
              Breite Straße 7<br />
              39288 Burg<br />
              Deutschland
            </p>

            <h2>3. Erhobene Daten beim Besuch der Website</h2>
            <p>
              Beim Besuch dieser Website werden automatisch Daten durch den Webserver bzw. deinen Browser
              übermittelt:
            </p>
            <ul>
              <li>IP-Adresse (gekürzt gespeichert, sofern möglich)</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Browsertyp und -version</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>Hostname des zugreifenden Geräts</li>
            </ul>
            <p>
              Diese Daten sind technisch notwendig, um die Website bereitzustellen, und werden nicht mit
              anderen Daten zusammengeführt.
            </p>

            <h2>4. Supabase (Auth & Datenverarbeitung)</h2>
            <p>
              Diese Website verwendet <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase</a> für die Benutzerregistrierung, Authentifizierung und Datenhaltung.
              Supabase speichert:
            </p>
            <ul>
              <li>E-Mail-Adresse (für Login und Kommunikation)</li>
              <li>Zeitpunkt der Registrierung und Logins</li>
              <li>ggf. Profildaten, wenn du diese aktiv ergänzt</li>
              <li>technische Daten wie IP-Adresse oder Gerätetyp</li>
            </ul>
            <p>
              Anbieter: Supabase Inc., 970 Toa Payoh N, Singapore<br />
              Datenschutz: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a>
            </p>

            <h2>5. LiveKit (Audio-Kommunikation)</h2>
            <p>
              Für Sprachräume und Audioübertragung wird <a href="https://livekit.io" target="_blank" rel="noopener noreferrer">LiveKit</a> verwendet.
              Dabei wird ein temporäres Sprachstreaming aufgebaut. Es werden:
            </p>
            <ul>
              <li>keine Gespräche gespeichert</li>
              <li>keine Inhalte analysiert</li>
              <li>keine Sprachdaten dauerhaft verarbeitet</li>
            </ul>
            <p>
              LiveKit generiert „Tokens“ zur temporären Authentifizierung. Diese enthalten technische Daten
              wie deine User-ID und Raum-Informationen.<br />
              Anbieter: LiveKit Inc., San Francisco, USA<br />
              Datenschutz: <a href="https://livekit.io/privacy" target="_blank" rel="noopener noreferrer">https://livekit.io/privacy</a>
            </p>

            <h2>6. Cookies</h2>
            <p>
              Diese Website verwendet keine Cookies – außer technisch notwendige Session-Cookies bei der
              Anmeldung über Supabase.
            </p>

            <h2>7. Kontaktaufnahme</h2>
            <p>
              Wenn du mir per E-Mail schreibst, werden deine Angaben ausschließlich zur Bearbeitung deiner
              Anfrage verwendet und nicht an Dritte weitergegeben.
            </p>

            <h2>8. Deine Rechte</h2>
            <p>Du hast jederzeit das Recht auf:</p>
            <ul>
              <li>Auskunft über deine gespeicherten Daten</li>
              <li>Berichtigung unrichtiger Daten</li>
              <li>Löschung deiner Daten</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Widerspruch gegen die Verarbeitung</li>
              <li>Datenübertragbarkeit</li>
            </ul>
            <p>
              Zur Wahrnehmung deiner Rechte reicht eine formlose E-Mail an mich.
            </p>

            <h2>9. Änderungen</h2>
            <p>
              Ich behalte mir vor, diese Datenschutzerklärung bei technischen Änderungen oder gesetzlicher
              Notwendigkeit zu aktualisieren.
            </p>

            <p><strong>Stand:</strong> April 2025</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
