import * as React from 'react'
import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'

export default function SignUpPage() {
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
            <h1 className="text-3xl font-bold">Erstelle ein Konto</h1>
            <p className="text-muted-foreground">Registriere dich, um an Diskussionen teilzunehmen</p>
          </div>
          
          <SignUpForm />
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Bereits registriert? <Link href="/login" className="text-primary hover:underline">Anmelden</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
