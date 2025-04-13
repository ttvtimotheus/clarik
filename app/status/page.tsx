"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle, XCircle, Clock, ChevronLeft, RefreshCw } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Definieren der Service-Typen
type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance" | "unknown";

interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  lastChecked: Date | null;
}

// In einer echten Implementierung würde diese Funktion einen API-Endpunkt abfragen
const checkServiceStatus = async (): Promise<ServiceStatus> => {
  // Hier würde normalerweise ein API-Aufruf stehen
  // Für diese Implementierung geben wir einfach "operational" zurück
  return "operational";
};

export default function StatusPage() {
  // Status-Tracking
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  
  // Service-Definitionen
  const [services, setServices] = React.useState<Service[]>([
    {
      id: "web",
      name: "Clarik Web App",
      description: "Hauptwebseite und Benutzeroberfläche",
      status: "unknown",
      lastChecked: null
    },
    {
      id: "api",
      name: "Clarik API",
      description: "Backend-API und Datendienste",
      status: "unknown",
      lastChecked: null
    },
    {
      id: "db",
      name: "Supabase-Dienste",
      description: "Datenbank und Authentifizierung",
      status: "unknown",
      lastChecked: null
    },
    {
      id: "audio",
      name: "LiveKit Audio",
      description: "Echtzeit-Audiokommunikation",
      status: "unknown",
      lastChecked: null
    }
  ]);

  // Status aller Services aktualisieren
  const refreshAllServices = async () => {
    setRefreshing(true);
    
    try {
      const updatedServices = [...services];
      
      // Jeden Service einzeln abfragen
      for (let i = 0; i < updatedServices.length; i++) {
        const service = updatedServices[i];
        const status = await checkServiceStatus();
        
        updatedServices[i] = {
          ...service,
          status,
          lastChecked: new Date()
        };
        
        // Status teilweise aktualisieren für besseres UX-Feedback
        setServices([...updatedServices]);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Status-Daten:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial und periodisch Status abrufen
  React.useEffect(() => {
    refreshAllServices();
    
    // Alle 5 Minuten aktualisieren
    const interval = setInterval(refreshAllServices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Status-Badges und Icons basierend auf dem Status
  const getStatusInfo = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return { 
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          badge: <Badge className="bg-green-500/20 text-green-500">Betriebsbereit</Badge>
        };
      case "degraded":
        return { 
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          badge: <Badge className="bg-yellow-500/20 text-yellow-500">Eingeschränkt</Badge>
        };
      case "outage":
        return { 
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          badge: <Badge className="bg-red-500/20 text-red-500">Ausfall</Badge>
        };
      case "maintenance":
        return { 
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          badge: <Badge className="bg-blue-500/20 text-blue-500">Wartung</Badge>
        };
      default:
        return { 
          icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
          badge: <Badge className="bg-gray-500/20 text-gray-500">Wird überprüft</Badge>
        };
    }
  };

  // Gesamtstatus berechnen
  const getOverallStatus = () => {
    if (loading) {
      return "Status wird überprüft...";
    }
    
    return services.every(service => service.status === "operational")
      ? "Alle Systeme betriebsbereit"
      : services.some(service => service.status === "outage")
      ? "Systemausfall festgestellt"
      : services.some(service => service.status === "degraded")
      ? "Teilweise Einschränkungen"
      : "Status wird überprüft...";
  };

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
        <section className="container py-12 max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück zur Startseite
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">System Status</h1>
            <Button 
              onClick={refreshAllServices}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Wird aktualisiert...' : 'Aktualisieren'}
            </Button>
          </div>

          <div className="space-y-8">
            {/* Status Card */}
            <Card className="border-border overflow-hidden">
              <div className={`h-1.5 w-full ${loading ? 'bg-gray-200' : services.every(s => s.status === 'operational') ? 'bg-green-500' : services.some(s => s.status === 'outage') ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              <CardHeader className="pb-2">
                <CardTitle>{getOverallStatus()}</CardTitle>
                <CardDescription>
                  {lastUpdated ? (
                    <>Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString()} Uhr ({lastUpdated.toLocaleDateString()})</>
                  ) : (
                    'Status wird abgerufen...'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service.id} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {loading ? (
                              <Skeleton className="h-5 w-5 rounded-full" />
                            ) : (
                              getStatusInfo(service.status).icon
                            )}
                            <h3 className="font-medium">{service.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <div>
                          {loading ? (
                            <Skeleton className="h-6 w-20" />
                          ) : (
                            getStatusInfo(service.status).badge
                          )}
                        </div>
                      </div>
                      {service.lastChecked && (
                        <div className="text-xs text-muted-foreground mt-3">
                          Zuletzt geprüft: {service.lastChecked.toLocaleTimeString()} Uhr
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Anstehende Wartungen */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle>Anstehende Wartungen</CardTitle>
                <CardDescription>
                  Informationen zu geplanten Wartungsarbeiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-muted-foreground">
                    Aktuell sind keine Wartungsarbeiten geplant.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vorfallhistorie */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle>Vorfallhistorie</CardTitle>
                <CardDescription>
                  Vergangene Vorfälle und Wartungsarbeiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!loading ? (
                    <>
                      <div className="border-l-2 border-green-500 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">LiveKit Audio: Optimierung</h4>
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Abgeschlossen</span>
                        </div>
                        <p className="text-sm text-muted-foreground">13.04.2025 • 08:30 - 09:15 UTC</p>
                        <p className="text-sm mt-1">
                          Update der Audio-Infrastruktur erfolgreich abgeschlossen.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
