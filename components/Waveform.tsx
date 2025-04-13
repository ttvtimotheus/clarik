"use client"

import { useEffect, useRef } from "react"

export function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const { width, height } = canvas.getBoundingClientRect()
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    
    // Statische Wellenform zeichnen
    const draw = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)
      
      // Stil für die Wellenform
      ctx.lineWidth = 2
      ctx.strokeStyle = '#17BEBB'
      ctx.fillStyle = 'rgba(23, 190, 187, 0.2)'
      
      // Anzahl der Balken
      const barCount = 30
      const barWidth = 3
      const gap = (width / barCount) - barWidth
      const centerY = height / 2
      
      // Pfad für die Füllung
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      
      // Wellenform zeichnen
      for (let i = 0; i < barCount; i++) {
        // Zufällige Höhe für jeden Balken (statisch für das Beispiel)
        const amplitude = Math.min(0.7, 0.1 + Math.random() * 0.6)
        const barHeight = height * amplitude
        
        const x = i * (barWidth + gap)
        const y1 = centerY - barHeight / 2
        const y2 = centerY + barHeight / 2
        
        // Balken zeichnen
        ctx.fillRect(x, y1, barWidth, barHeight)
        ctx.strokeRect(x, y1, barWidth, barHeight)
        
        // Pfad für die Füllung
        if (i === 0) {
          ctx.lineTo(x, y1)
        } else {
          ctx.lineTo(x + barWidth/2, y1)
        }
      }
      
      // Pfad für die Füllung abschließen
      ctx.lineTo(width, centerY)
      ctx.closePath()
      ctx.globalAlpha = 0.1
      ctx.fill()
      ctx.globalAlpha = 1
    }
    
    draw()
  }, [])

  return (
    <div className="relative w-full my-8">
      <canvas 
        ref={canvasRef}
        className="w-full h-20"
      />
    </div>
  )
}
