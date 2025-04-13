"use client"

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

export function CreateRoomForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !category) {
      setError('Titel und Kategorie sind erforderlich')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, category, description })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Fehler beim Erstellen des Raums')
      }
      
      const room = await response.json()
      
      // Redirect to the new room
      router.push(`/room/${room.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titel</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel der Diskussion" 
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Kategorie</Label>
          <Select 
            value={category} 
            onValueChange={setCategory}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Kategorie auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gesellschaft">Gesellschaft</SelectItem>
              <SelectItem value="wissenschaft">Wissenschaft</SelectItem>
              <SelectItem value="kultur">Kultur</SelectItem>
              <SelectItem value="alltag">Alltag</SelectItem>
              <SelectItem value="technologie">Technologie</SelectItem>
              <SelectItem value="politik">Politik</SelectItem>
              <SelectItem value="wirtschaft">Wirtschaft</SelectItem>
              <SelectItem value="bildung">Bildung</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Worum soll es in diesem Raum gehen?" 
            rows={4} 
          />
        </div>
      </div>
      
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird erstellt...' : 'Raum erstellen'}
        </Button>
      </div>
    </form>
  )
}
