"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'

export function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const supabase = createClient()

  // Form validation
  useEffect(() => {
    const newErrors: Record<string, string> = {}
    
    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Name muss mindestens 2 Zeichen lang sein'
    }
    
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Benutzername muss mindestens 3 Zeichen lang sein'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein'
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein'
    }
    
    setErrors(newErrors)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return
    }
    
    // Check required fields
    if (!formData.email || !formData.name || !formData.username || !formData.password) {
      setMessage({ text: 'Bitte fülle alle Pflichtfelder aus', type: 'error' })
      return
    }
    
    // Check terms acceptance
    if (!formData.acceptTerms) {
      setMessage({ text: 'Bitte akzeptiere die Nutzungsbedingungen', type: 'error' })
      return
    }
    
    try {
      setLoading(true)
      setMessage(null)
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            username: formData.username,
          },
        },
      })
      
      if (error) {
        setMessage({ text: error.message, type: 'error' })
        return
      }
      
      // Check if auto-confirmed email or needs verification
      if (data.user && data.session) {
        router.push('/explore')
      } else {
        setMessage({ 
          text: 'Bestätigungslink wurde gesendet! Bitte überprüfe deine E-Mail.', 
          type: 'success' 
        })
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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-1">
            Name
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Dein vollständiger Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-1">
            Benutzername
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            placeholder="Dein Benutzername"
            value={formData.username}
            onChange={handleChange}
            required
            className={errors.username ? 'border-destructive' : ''}
          />
          {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-1">
            E-Mail
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="deine@email.de"
            value={formData.email}
            onChange={handleChange}
            required
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-1">
            Passwort
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mindestens 8 Zeichen"
            value={formData.password}
            onChange={handleChange}
            required
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="acceptTerms" 
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked: boolean | "indeterminate") => {
              setFormData(prev => ({
                ...prev,
                acceptTerms: checked === true
              }))
            }}
          />
          <Label 
            htmlFor="acceptTerms" 
            className="text-sm font-normal"
          >
            Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline" target="_blank">Nutzungsbedingungen</a> und <a href="/datenschutz" className="text-primary hover:underline" target="_blank">Datenschutzrichtlinien</a>.
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={loading || !formData.acceptTerms || Object.keys(errors).length > 0}
        >
          {loading ? 'Wird gesendet...' : 'Registrieren'}
        </Button>
      </form>
      
      {message && (
        <div className={`p-3 rounded-md text-sm ${
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
