"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, User } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">clarik</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/explore" className="text-sm font-medium hover:text-primary hidden md:inline-block">
            Entdecken
          </Link>
          
          {!isLoading && !user && (
            <div className="flex gap-2">
              <Button variant="outline" asChild size="sm">
                <Link href="/login">Anmelden</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Registrieren</Link>
              </Button>
            </div>
          )}

          {!isLoading && user && (
            <div className="flex items-center gap-4">
              <Link href="/latest" className="text-sm font-medium hover:text-primary hidden md:inline-block">
                Meine Räume
              </Link>
              
              <Button asChild className="gap-1 hidden md:inline-flex" size="sm">
                <Link href="/create">
                  <Plus className="h-4 w-4" />
                  Raum erstellen
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2" disabled>
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create" className="md:hidden flex">
                      <Plus className="h-4 w-4 mr-2" />
                      Raum erstellen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
