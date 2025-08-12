'use client'

import { useEffect, useRef } from 'react'

interface ColorWave {
  centerX: number
  centerY: number
  radius: number
  speed: number
  color: string
  phase: number
}

export default function JazzModeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const colorWavesRef = useRef<ColorWave[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Jazz color palette for the waves
    const jazzColors = [
      { r: 255, g: 215, b: 0 },    // Gold
      { r: 255, g: 107, b: 53 },    // Warm orange
      { r: 74, g: 20, b: 140 },     // Deep purple
      { r: 25, g: 25, b: 112 },     // Midnight blue
      { r: 139, g: 69, b: 19 },     // Saddle brown
      { r: 220, g: 20, b: 60 },     // Crimson
    ]

    // Initialize color waves
    const initColorWaves = () => {
      colorWavesRef.current = []
      // Create multiple radial gradient centers
      for (let i = 0; i < 4; i++) {
        colorWavesRef.current.push({
          centerX: Math.random() * canvas.width,
          centerY: Math.random() * canvas.height,
          radius: 0,
          speed: Math.random() * 0.5 + 0.3,
          color: `${jazzColors[i % jazzColors.length].r}, ${jazzColors[i % jazzColors.length].g}, ${jazzColors[i % jazzColors.length].b}`,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    initColorWaves()

    let frameCount = 0
    
    // Animation loop - optimized for better performance
    const animate = (time: number) => {
      frameCount++
      
      // Reduce updates for expensive operations - only update every 2nd frame
      if (frameCount % 2 === 0) {
        // Clear canvas with simpler fill
        ctx.fillStyle = 'rgba(26, 26, 26, 0.08)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw fewer overlapping radial gradients (reduced from 4 to 2)
        for (let i = 0; i < Math.min(2, colorWavesRef.current.length); i++) {
          const wave = colorWavesRef.current[i]
          
          // Update wave position with smooth movement
          wave.centerX += Math.sin(time * 0.0002 + wave.phase) * 0.3
          wave.centerY += Math.cos(time * 0.0003 + wave.phase) * 0.3
          
          // Keep waves within bounds with smooth wrapping
          if (wave.centerX < -200) wave.centerX = canvas.width + 200
          if (wave.centerX > canvas.width + 200) wave.centerX = -200
          if (wave.centerY < -200) wave.centerY = canvas.height + 200
          if (wave.centerY > canvas.height + 200) wave.centerY = -200
          
          // Create radial gradient (smaller radius for better performance)
          const maxRadius = Math.max(canvas.width, canvas.height) * 0.6
          const radialGradient = ctx.createRadialGradient(
            wave.centerX, 
            wave.centerY, 
            0,
            wave.centerX, 
            wave.centerY, 
            maxRadius
          )
          
          // Animate the gradient colors
          const pulseIntensity = Math.sin(time * 0.0008 * wave.speed + wave.phase) * 0.2 + 0.6
          
          // Parse the color
          const [r, g, b] = wave.color.split(',').map(Number)
          
          // Create color stops with animated opacity (reduced opacity for better performance)
          radialGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.15 * pulseIntensity})`)
          radialGradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.1 * pulseIntensity})`)
          radialGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          
          // Apply gradient with lighter blending
          ctx.globalCompositeOperation = 'screen'
          ctx.fillStyle = radialGradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
      
      // Add flowing color bands only every 3rd frame
      if (frameCount % 3 === 0) {
        ctx.globalCompositeOperation = 'overlay'
        // Reduced from 3 to 2 bands
        for (let i = 0; i < 2; i++) {
          const bandGradient = ctx.createLinearGradient(
            0, 
            0, 
            canvas.width * Math.cos(time * 0.0001 + i), 
            canvas.height * Math.sin(time * 0.0001 + i)
          )
          
          const opacity = Math.sin(time * 0.0008 + i * Math.PI / 2) * 0.06 + 0.06
          bandGradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`)
          bandGradient.addColorStop(0.5, `rgba(74, 20, 140, ${opacity})`)
          bandGradient.addColorStop(1, `rgba(255, 107, 53, ${opacity})`)
          
          ctx.fillStyle = bandGradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over'
      
      // Add subtle noise texture only every 4th frame and reduce count
      if (frameCount % 4 === 0) {
        ctx.globalAlpha = 0.02
        for (let i = 0; i < 3; i++) { // Reduced from 5 to 3
          const noiseX = Math.random() * canvas.width
          const noiseY = Math.random() * canvas.height
          const noiseRadius = Math.random() * 80 + 40
          const noiseGradient = ctx.createRadialGradient(
            noiseX, noiseY, 0,
            noiseX, noiseY, noiseRadius
          )
          noiseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
          noiseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = noiseGradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.globalAlpha = 1
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate(0)
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}