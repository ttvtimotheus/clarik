"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, ChevronLeft, FileText, Clock, Search,
  Download, ArrowUpDown, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLogsPage() {
  const [filter, setFilter] = useState("all");
  
  // Log-Typ-Definition
  type LogEntry = {
    id: number;
    type: "info" | "warning" | "error";
    timestamp: string;
    message: string;
  };

  // Demo-Logs
  const demoLogs: LogEntry[] = [
    { id: 1, type: "info", timestamp: "2025-04-13T22:45:12", message: "Benutzer 'admin' hat sich angemeldet" },
    { id: 2, type: "info", timestamp: "2025-04-13T22:30:05", message: "Neuer Raum 'Diskussion über Tech-Trends' wurde erstellt" },
    { id: 3, type: "warning", timestamp: "2025-04-13T21:15:45", message: "Erhöhte API-Latenz festgestellt (250ms)" },
    { id: 4, type: "error", timestamp: "2025-04-13T20:03:22", message: "Datenbankverbindung vorübergehend unterbrochen" },
    { id: 5, type: "info", timestamp: "2025-04-13T19:45:11", message: "Systemwartung abgeschlossen" },
    { id: 6, type: "info", timestamp: "2025-04-13T18:30:45", message: "Benutzer 'johndoe' hat einen neuen Account erstellt" },
    { id: 7, type: "warning", timestamp: "2025-04-13T17:22:38", message: "Ungewöhnlich hohe CPU-Auslastung (78%)" },
    { id: 8, type: "info", timestamp: "2025-04-13T16:15:09", message: "LiveKit Service wurde neu gestartet" },
    { id: 9, type: "error", timestamp: "2025-04-13T14:05:55", message: "Fehler bei der Integration einer externen API" },
    { id: 10, type: "info", timestamp: "2025-04-13T12:30:22", message: "Config-Update für die Datenbank durchgeführt" },
  ];
  
  // Gefilterte Logs
  const filteredLogs = filter === "all" 
    ? demoLogs 
    : demoLogs.filter(log => log.type === filter);
  
  // Funktion zum Rendern der Log-Zeilen mit farblicher Markierung
  const renderLogLine = (log: LogEntry) => {
    let bgClass = "";
    let textClass = "";
    
    switch(log.type) {
      case "error":
        bgClass = "bg-red-50 dark:bg-red-900/20";
        textClass = "text-red-700 dark:text-red-400";
        break;
      case "warning":
        bgClass = "bg-yellow-50 dark:bg-yellow-900/20";
        textClass = "text-yellow-700 dark:text-yellow-400";
        break;
      default:
        bgClass = "";
        textClass = "";
    }
    
    const formattedTime = new Date(log.timestamp).toLocaleTimeString('de-DE');
    
    return (
      <div key={log.id} className={`p-2 rounded-md ${bgClass} mb-2`}>
        <div className="flex justify-between">
          <span className={`text-sm font-medium ${textClass}`}>{log.type.toUpperCase()}</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        <p className="text-sm mt-1">{log.message}</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">clarik</span>
            </Link>
            <span className="text-lg font-bold text-muted-foreground">Admin</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Zurück zur Website
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container py-10">
          <div className="flex items-center mb-6">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mr-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Zurück zum Dashboard
            </Link>
            <h1 className="text-3xl font-bold">System-Logs</h1>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Aktivitätslogs
              </CardTitle>
              <CardDescription>
                Aufzeichnungen von System- und Benutzeraktivitäten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center w-full md:w-1/2">
                  <Input 
                    type="search"
                    placeholder="Suche in Logs..."
                    className="mr-2"
                  />
                  <Button size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-1/2 justify-end">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Logs</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warnungen</SelectItem>
                      <SelectItem value="error">Fehler</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportieren
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-2 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Heutige Logs</h3>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Aktualisiert: {new Date().toLocaleTimeString('de-DE')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredLogs.map(renderLogLine)}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md mt-4">
                <p className="text-sm font-medium">Hinweis zur Implementierung</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dies sind Demo-Logs. In einer produktiven Umgebung werden hier echte System- und Anwendungslogs angezeigt.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
