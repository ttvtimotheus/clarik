"use client"

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Lock } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setMessage({ text: error.message, type: 'error' })
        return
      }
      
      // Erfolgreiche Anmeldung
      if (data.session) {
        router.push('/explore')
        router.refresh()
      }
    } catch (error) {
      setMessage({ 
        text: 'Ein Fehler ist aufgetreten. Bitte versuche es später noch einmal.', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage(null)
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        setMessage({ text: error.message, type: 'error' })
        return
      }
      
      setMessage({ 
        text: 'Magischer Link wurde gesendet! Bitte überprüfe deine E-Mail.', 
        type: 'success' 
      })
    } catch (error) {
      setMessage({ 
        text: 'Ein Fehler ist aufgetreten. Bitte versuche es später noch einmal.', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="space-y-4">
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" />
            Passwort
          </TabsTrigger>
          <TabsTrigger value="magic-link">
            <Mail className="h-4 w-4 mr-2" />
            Magic Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="mt-4 space-y-4">
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-password">E-Mail</Label>
              <Input
                id="email-password"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="Dein Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="magic-link" className="mt-4 space-y-4">
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-magic">E-Mail</Label>
              <Input
                id="email-magic"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Wird gesendet...' : 'Magic Link senden'}
            </Button>
          </form>
        </TabsContent>


      </Tabs>
      
      {message && (
        <div className={`p-3 mt-4 rounded-md text-sm ${
          message.type === 'error' 
            ? 'bg-destructive/10 text-destructive' 
            : 'bg-green-500/10 text-green-500'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
