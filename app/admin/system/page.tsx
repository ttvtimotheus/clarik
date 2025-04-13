"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, Home, ChevronLeft, Server, Database, 
  ShieldAlert, RefreshCw, AlertTriangle
} from "lucide-react";

export default function AdminSystemPage() {
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
            <h1 className="text-3xl font-bold">Systemeinstellungen</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-primary" />
                  API-Services
                </CardTitle>
                <CardDescription>
                  Status und Konfiguration der API-Dienste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LiveKit API</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Supabase Auth</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Realtime API</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Datenbank
                </CardTitle>
                <CardDescription>
                  Datenbankstatistiken und -wartung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Gesund</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auslastung</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Letzte Wartung</span>
                    <span className="text-sm">Noch nie</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                  Sicherheit
                </CardTitle>
                <CardDescription>
                  Sicherheitseinstellungen und Logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Letzte Anmeldung</span>
                    <span className="text-sm">Heute, 22:50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fehlgeschlagene Versuche</span>
                    <span className="text-sm">0 in 24h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA für Admins</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Inaktiv</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Systemwartung</CardTitle>
              <CardDescription>
                Optionen zur Systemwartung und -konfiguration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Wartungsintervalle</h3>
                <div className="bg-muted/30 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Die automatische Systemwartung ist noch nicht konfiguriert. In einer zukünftigen Version können Sie hier Wartungsintervalle und -aufgaben definieren.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Aktionen</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <RefreshCw className="h-4 w-4" />
                    Cache leeren
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-4 w-4" />
                    Wartungsmodus
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md mt-4">
                <p className="text-sm font-medium">Hinweis zur Implementierung</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Diese Funktionen sind für ein zukünftiges Update geplant. Die angezeigten Daten sind Platzhalter.
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
