import * as React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Footer } from "@/components/Footer"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">clarik</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Willkommen zurück</h1>
            <p className="text-muted-foreground">Melde dich an, um an Diskussionen teilzunehmen</p>
          </div>
          
          <LoginForm />
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Noch kein Konto? <Link href="/signup" className="text-primary hover:underline">Registrieren</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
