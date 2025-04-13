"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import "@/lib/supabase/admin-types";


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Überprüfen, ob der Benutzer angemeldet ist
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("Nicht angemeldet:", sessionError);
          router.push("/login");
          return;
        }
        
        // Überprüfen, ob der Benutzer ein Admin ist durch Abfrage der users-Tabelle
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (userError) {
          console.error("Fehler beim Abrufen des Benutzers:", userError);
          router.push("/");
          return;
        }
        
        // Prüfe, ob das is_admin-Feld existiert und true ist
        // Da die Spalte möglicherweise noch nicht existiert, führen wir eine manuelle Prüfung durch
        const isAdminUser = userData && 'is_admin' in userData ? userData.is_admin : false;
        
        if (!isAdminUser) {
          console.error("Kein Administratorzugriff");
          router.push("/");
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error("Fehler bei der Admin-Überprüfung:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Der Router wird bereits zur Startseite oder Login umleiten
  }

  return <div>{children}</div>;
}
