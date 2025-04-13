"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "outage" | "maintenance"
  uptime: number
  lastChecked: Date
  history: {
    date: Date
    uptime: number
  }[]
}

export default function StatusPage() {
  // Simulierte Daten für die Dienste
  const [services, setServices] = React.useState<ServiceStatus[]>([
    {
      name: "Web App",
      status: "operational",
      uptime: 99.98,
      lastChecked: new Date(),
      history: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        uptime: 99.9 + Math.random() * 0.1
      }))
    },
    {
      name: "API",
      status: "operational",
      uptime: 99.95,
      lastChecked: new Date(),
      history: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        uptime: 99.8 + Math.random() * 0.2
      }))
    },
    {
      name: "Supabase",
      status: "operational",
      uptime: 99.99,
      lastChecked: new Date(),
      history: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        uptime: 99.95 + Math.random() * 0.05
      }))
    },
    {
      name: "LiveKit Audio",
      status: "operational", 
      uptime: 99.90,
      lastChecked: new Date(),
      history: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        uptime: 99.7 + Math.random() * 0.3
      }))
    }
  ])

  // Dummy-Funktion zum erneuten Laden der Status-Daten
  const refreshStatus = () => {
    // In einer echten Implementierung würden hier tatsächliche API-Aufrufe erfolgen
    setServices(prev => prev.map(service => ({
      ...service,
      lastChecked: new Date(),
      status: Math.random() > 0.9 ? "degraded" : "operational"
    })))
  }

  React.useEffect(() => {
    // Automatische Aktualisierung alle 60 Sekunden
    const interval = setInterval(refreshStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  // Funktion zum Anzeigen des Status-Badges
  const getStatusBadge = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Betriebsbereit</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500">Eingeschränkt</Badge>
      case "outage":
        return <Badge className="bg-red-500">Ausfall</Badge>
      case "maintenance":
        return <Badge className="bg-blue-500">Wartung</Badge>
    }
  }

  // Berechnet den Gesamtstatus
  const overallStatus = services.every(service => service.status === "operational")
    ? "Alle Systeme betriebsbereit"
    : services.some(service => service.status === "outage")
    ? "Systemausfall"
    : "Teilweise Einschränkungen"

  // Berechnet die durchschnittliche Uptime
  const averageUptime = services.reduce((acc, service) => acc + service.uptime, 0) / services.length

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

          <h1 className="text-3xl font-bold mb-8">System Status</h1>

          <div className="space-y-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Aktueller Status: {overallStatus}</span>
                  <button 
                    onClick={refreshStatus}
                    className="text-sm bg-primary hover:bg-primary/90 text-white py-1 px-3 rounded-md"
                  >
                    Aktualisieren
                  </button>
                </CardTitle>
                <CardDescription>
                  Durchschnittliche Uptime: {averageUptime.toFixed(2)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {services.map(service => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{service.name}</h3>
                        {getStatusBadge(service.status)}
                      </div>
                      <Progress value={service.uptime} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uptime: {service.uptime.toFixed(2)}%</span>
                        <span>
                          Zuletzt geprüft: {service.lastChecked.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex justify-between items-center gap-1 h-16">
                          {service.history.slice(0, 14).reverse().map((day, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-4 rounded-sm" 
                                style={{
                                  height: `${(day.uptime - 99) * 100}%`,
                                  maxHeight: "100%",
                                  backgroundColor: day.uptime >= 99.9 
                                    ? "rgb(34, 197, 94)" 
                                    : day.uptime >= 99.5 
                                    ? "rgb(234, 179, 8)" 
                                    : "rgb(239, 68, 68)"
                                }}
                              />
                              <span className="text-xs text-muted-foreground mt-1">
                                {day.date.getDate().toString().padStart(2, '0')}.
                                {(day.date.getMonth() + 1).toString().padStart(2, '0')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Geplante Wartungsarbeiten</CardTitle>
                <CardDescription>
                  Informationen zu kommenden Wartungsarbeiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  Aktuell sind keine Wartungsarbeiten geplant.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Historie</CardTitle>
                <CardDescription>
                  Vergangene Vorfälle und Wartungsarbeiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-green-500 pl-4 py-2">
                    <h4 className="font-medium">LiveKit Audio-Dienst: Leistungsverbesserungen</h4>
                    <p className="text-sm text-muted-foreground">05.04.2025 • 02:15 - 03:30 UTC</p>
                    <p className="text-sm mt-1">
                      Planmäßige Wartung zur Optimierung der Audio-Qualität erfolgreich abgeschlossen.
                    </p>
                  </div>
                  <div className="border-l-2 border-yellow-500 pl-4 py-2">
                    <h4 className="font-medium">API-Dienst: Kurzzeitige Latenzprobleme</h4>
                    <p className="text-sm text-muted-foreground">28.03.2025 • 15:42 - 16:15 UTC</p>
                    <p className="text-sm mt-1">
                      Erhöhte Latenz bei API-Aufrufen wurde festgestellt und behoben.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
