"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, ChevronLeft, Camera, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Schema für das Formular
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Der Name muss mindestens 2 Zeichen lang sein.",
  }),
  avatar_url: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      avatar_url: "",
    },
  });

  // Hole die Benutzerinformationen
  useEffect(() => {
    async function getUser() {
      setLoading(true);
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setAuthError("Bitte melden Sie sich an, um auf diese Seite zuzugreifen.");
          router.push("/login");
          return;
        }
        
        if (user) {
          setUser(user);
          
          // Hole Profildaten aus der users-Tabelle
          const { data: profileData, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();
            
          if (profileError) {
            console.error("Fehler beim Laden des Profils:", profileError);
            toast({
              title: "Fehler",
              description: "Profildaten konnten nicht geladen werden.",
              variant: "destructive",
            });
          } else if (profileData) {
            setProfileData(profileData);
            
            // Formular mit Daten befüllen
            form.reset({
              name: profileData.name || "",
              avatar_url: profileData.avatar_url || "",
            });
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getUser();
  }, [router, supabase, form, toast]);

  // Speichern der Profiländerungen
  async function onSubmit(data: ProfileFormValues) {
    setSaving(true);
    
    try {
      if (!user) {
        toast({
          title: "Fehler",
          description: "Sie müssen angemeldet sein, um Ihr Profil zu bearbeiten.",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("users")
        .update({
          name: data.name,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) {
        console.error("Fehler beim Speichern des Profils:", error);
        toast({
          title: "Fehler",
          description: "Änderungen konnten nicht gespeichert werden.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erfolg",
          description: "Profil wurde erfolgreich aktualisiert.",
        });
        
        // Aktualisiere die lokalen Profildaten
        setProfileData({
          ...profileData,
          name: data.name,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    } finally {
      setSaving(false);
    }
  }

  // Abmelden
  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      router.push("/");
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  }

  // Zeige eine Ladeanimation während der Benutzer geladen wird
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container flex h-16 items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">clarik</span>
          </Link>
        </div>
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Zeige einen Fehler, wenn der Benutzer nicht angemeldet ist
  if (authError) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container flex h-16 items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">clarik</span>
          </Link>
        </div>
        <main className="flex-1 container py-12 max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nicht angemeldet</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/login">Zum Login</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">clarik</span>
          </Link>
        </div>
      </div>
      <main className="flex-1">
        <div className="container py-10 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück zur Startseite
          </Link>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Konto-Einstellungen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Kontoinformationen und Einstellungen
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="account">Konto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profilinformationen</CardTitle>
                  <CardDescription>
                    Bearbeiten Sie Ihre öffentlichen Profilinformationen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profilbild</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
                          {profileData?.avatar_url ? (
                            <Image
                              src={profileData.avatar_url}
                              alt="Avatar"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-secondary">
                              <User className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <Input
                            id="avatar_url"
                            placeholder="https://example.com/avatar.jpg"
                            {...form.register("avatar_url")}
                          />
                          {form.formState.errors.avatar_url && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.avatar_url.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Geben Sie die URL eines Bildes ein. Ideal sind quadratische Bilder.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Ihr Name"
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {saving ? "Wird gespeichert..." : "Änderungen speichern"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kontoinformationen</CardTitle>
                  <CardDescription>
                    Ihre Anmeldedaten und Kontoinformationen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">E-Mail-Adresse</Label>
                    <p>{user?.email || "Keine E-Mail-Adresse"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Konto erstellt am</Label>
                    <p>
                      {profileData?.created_at
                        ? new Date(profileData.created_at).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Unbekannt"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border pt-6">
                  <Button variant="outline" onClick={handleSignOut}>
                    Abmelden
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
