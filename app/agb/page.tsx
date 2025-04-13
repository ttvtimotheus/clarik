import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function AGBPage() {
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

          <h1 className="text-3xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>

          <div className="prose prose-invert max-w-none">
            <h2>1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform clarik.app, 
              betrieben von Timo Haseloff (im Folgenden "Betreiber" genannt).
            </p>
            <p>
              Mit der Registrierung bzw. Nutzung der Plattform akzeptiert der Nutzer diese AGB.
            </p>

            <h2>2. Leistungsbeschreibung</h2>
            <p>
              Clarik ist eine Plattform für sprachbasierte Diskussionen mit Fokus auf Klarheit. 
              Die Plattform ermöglicht es Nutzern, an Audio-Diskussionsräumen teilzunehmen oder 
              eigene Räume zu erstellen.
            </p>
            <p>
              Der Betreiber stellt lediglich die technische Infrastruktur zur Verfügung, 
              ohne Einfluss auf die Inhalte der Gespräche zu nehmen.
            </p>

            <h2>3. Nutzungsbedingungen</h2>
            <h3>3.1 Registrierung</h3>
            <p>
              Für die vollständige Nutzung der Plattform ist eine Registrierung erforderlich. 
              Der Nutzer verpflichtet sich, wahrheitsgemäße Angaben zu machen und seine 
              Zugangsdaten geheim zu halten.
            </p>

            <h3>3.2 Verantwortung für Inhalte</h3>
            <p>
              Der Nutzer ist für alle von ihm erstellten oder geteilten Inhalte selbst verantwortlich. 
              Es ist untersagt, rechtswidrige, beleidigende, diskriminierende oder anderweitig 
              unangemessene Inhalte zu verbreiten.
            </p>

            <h3>3.3 Verfügbarkeit</h3>
            <p>
              Der Betreiber ist bemüht, einen unterbrechungsfreien Zugang zur Plattform zu ermöglichen, 
              kann jedoch keine Garantie für die ständige Verfügbarkeit übernehmen. Wartungsarbeiten 
              oder technische Störungen können zu vorübergehenden Einschränkungen führen.
            </p>

            <h2>4. Rechte und Pflichten des Betreibers</h2>
            <p>
              Der Betreiber behält sich vor, bei Verstößen gegen diese AGB Nutzerkonten zu sperren 
              oder zu löschen. Dies gilt insbesondere bei:
            </p>
            <ul>
              <li>Verbreitung rechtswidriger Inhalte</li>
              <li>Belästigung anderer Nutzer</li>
              <li>Missbrauch der Plattform für kommerzielle Zwecke ohne Zustimmung</li>
              <li>Verstoß gegen die guten Sitten oder geltendes Recht</li>
            </ul>

            <h2>5. Haftungsausschluss</h2>
            <p>
              Der Betreiber haftet nicht für Inhalte, die von Nutzern erstellt oder geteilt werden. 
              Eine Überwachung der Inhalte findet nicht statt.
            </p>
            <p>
              Für Schäden, die durch die Nutzung oder Nichtverfügbarkeit der Plattform entstehen, 
              haftet der Betreiber nur bei Vorsatz oder grober Fahrlässigkeit.
            </p>

            <h2>6. Datenschutz</h2>
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden sich in der 
              <Link href="/datenschutz" className="text-primary hover:underline"> Datenschutzerklärung</Link>.
            </p>

            <h2>7. Änderung der AGB</h2>
            <p>
              Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Änderungen werden auf 
              der Plattform bekannt gegeben. Die fortgesetzte Nutzung nach Inkrafttreten von 
              Änderungen gilt als Zustimmung zu den neuen Bedingungen.
            </p>

            <h2>8. Schlussbestimmungen</h2>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit 
              der übrigen Bestimmungen davon unberührt.
            </p>
            <p>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
            </p>

            <p><strong>Stand:</strong> April 2025</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
