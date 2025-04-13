"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    
    checkAuthStatus()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      setIsLoggedIn(event === 'SIGNED_IN')
    })
    
    return () => subscription.unsubscribe()
  }, [supabase.auth])
  return (
    <footer className="border-t border-border py-6">
      <div className="container flex justify-between items-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} clarik.app</p>
        <div className="space-x-4">
          {isLoggedIn && (
            <Link href="/account" className="text-sm text-muted-foreground hover:text-primary">Konto</Link>
          )}
          <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary">Impressum</Link>
          <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary">Datenschutz</Link>
          <Link href="/agb" className="text-sm text-muted-foreground hover:text-primary">AGB</Link>
          <Link href="/status" className="text-sm text-muted-foreground hover:text-primary">Status</Link>
        </div>
      </div>
    </footer>
  )
}
