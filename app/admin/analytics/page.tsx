"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Home, ChevronLeft, LineChart, Users, Mic } from "lucide-react";

export default function AdminAnalyticsPage() {
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
            <h1 className="text-3xl font-bold">Plattform-Analysen</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Benutzeraktivität
                </CardTitle>
                <CardDescription>
                  Übersicht der Benutzeraktivität über die letzten 30 Tage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center border rounded-md bg-muted/20">
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Diagramm zur Benutzeraktivität wird hier angezeigt</p>
                    <p className="text-xs text-muted-foreground mt-1">Wird in einer späteren Version implementiert</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-primary" />
                  Raumstatistiken
                </CardTitle>
                <CardDescription>
                  Übersicht der Raumnutzung über die letzten 30 Tage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center border rounded-md bg-muted/20">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Diagramm zur Raumnutzung wird hier angezeigt</p>
                    <p className="text-xs text-muted-foreground mt-1">Wird in einer späteren Version implementiert</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analytische Übersicht</CardTitle>
              <CardDescription>
                Ausführliche Analysen werden in einer zukünftigen Version implementiert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Dieses Modul wird erweiterte Analysefunktionen für die Clarik-Plattform bereitstellen, einschließlich:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Detaillierte Benutzerinteraktionsanalysen</li>
                <li>Raumnutzungsstatistiken und Trending-Kategorien</li>
                <li>Nutzerengagement und Aufenthaltsdauer</li>
                <li>Wachstumsprognosen und Nutzungstrends</li>
                <li>Exportfunktionen für Berichte</li>
              </ul>
              <div className="bg-muted/30 p-4 rounded-md mt-4">
                <p className="text-sm font-medium">Hinweis zur Implementierung</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Diese Funktion ist für ein zukünftiges Update geplant. Bei technischen Fragen wenden Sie sich bitte an den Administrator.
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
