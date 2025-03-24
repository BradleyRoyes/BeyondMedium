"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface OpArtProps {
  variant?: 'circles' | 'moiré' | 'waves' | 'grid'
  intensity?: number
  speed?: number
  colorScheme?: 'lavender' | 'mint' | 'peach' | 'dusk' | 'custom'
  customColors?: string[]
  className?: string
  interactive?: boolean
}

export function OpArt({
  variant = 'moiré',
  intensity = 1,
  speed = 1,
  colorScheme = 'lavender',
  customColors,
  className = '',
  interactive = true
}: OpArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const time = useRef(0)

  // Color schemes - updated with subtle pastel hues
  const colorSchemes = {
    lavender: ['#2d2157', '#4c3a78', '#8667a8'], // Mysterious lavender gradient
    mint: ['#101d21', '#193732', '#2a4d4a'], // Subtle mint/teal
    peach: ['#241a20', '#3c292f', '#554046'], // Muted dusty peach
    dusk: ['#1b1a2e', '#2a294d', '#38366b'], // Twilight purple-blue
    custom: customColors || ['#232526', '#414345', '#232526']
  }

  // Initialize canvas and handle cleanup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const container = canvas.parentElement
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      setDimensions({ width, height })
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsHovering(true)
    }
    
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    window.addEventListener('resize', handleResize)
    
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    handleResize()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(animationRef.current)
    }
  }, [interactive])
  
  // Drawing functions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = colorSchemes[colorScheme]
    
    const drawMoiré = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.5, colors[1])
      gradient.addColorStop(1, colors[2])
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw moiré pattern
      const centerX = isHovering ? mousePosition.x : canvas.width / 2
      const centerY = isHovering ? mousePosition.y : canvas.height / 2
      
      ctx.lineWidth = 0.8 // Thinner lines for subtlety
      
      // First set of concentric circles
      for (let r = 0; r < Math.max(canvas.width, canvas.height); r += 12) { // Increased spacing for subtlety
        ctx.beginPath()
        ctx.arc(centerX, centerY, r + Math.sin(t * 0.15) * 5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * intensity})` // More subtle transparency
        ctx.stroke()
      }
      
      // Second set of concentric circles (offset to create moiré)
      const offset = 20 + Math.sin(t * 0.08) * 8
      for (let r = 0; r < Math.max(canvas.width, canvas.height); r += 12) {
        ctx.beginPath()
        ctx.arc(centerX + offset, centerY + offset, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * intensity})`
        ctx.stroke()
      }
    }
    
    const drawCircles = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.5, colors[1])
      gradient.addColorStop(1, colors[2])
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const circleCount = 20 * intensity
      ctx.globalCompositeOperation = 'lighter'
      
      for (let i = 0; i < circleCount; i++) {
        const theta = (i / circleCount) * Math.PI * 2
        const oscillation = Math.sin(t * 0.4 + i * 0.2) * 50
        
        const x = canvas.width / 2 + Math.cos(theta) * (100 + oscillation)
        const y = canvas.height / 2 + Math.sin(theta) * (100 + oscillation)
        
        const radius = 40 + Math.sin(t * 0.15 + i) * 15 // Smaller radius for subtlety
        
        const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)') // More subtle inner glow
        circleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.beginPath()
        ctx.arc(
          isHovering ? x + (mousePosition.x - canvas.width/2) * 0.08 : x, // Reduced mouse influence
          isHovering ? y + (mousePosition.y - canvas.height/2) * 0.08 : y,
          radius, 0, Math.PI * 2
        )
        ctx.fillStyle = circleGradient
        ctx.fill()
      }
      
      ctx.globalCompositeOperation = 'source-over'
    }
    
    const drawWaves = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.5, colors[1])
      gradient.addColorStop(1, colors[2])
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const waveCount = 8 * intensity
      const yDistortion = isHovering ? 
        (mousePosition.y - canvas.height/2) * 0.15 : // Reduced mouse influence
        Math.sin(t * 0.15) * 15
        
      ctx.lineWidth = 1.2
      
      for (let i = 0; i < waveCount; i++) {
        const yBase = (canvas.height / (waveCount + 1)) * (i + 1)
        const amplitude = 15 + (i % 3) * 8 // Smaller amplitude
        const frequency = (i % 4 + 1) * 0.015 // Lower frequency
        const speed = (i % 5 + 1) * 0.1 * t * 0.04 * speed
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * intensity})` // More subtle
        
        for (let x = 0; x < canvas.width; x += 1) {
          const y = Math.sin(x * frequency + speed) * amplitude + yBase + yDistortion
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        ctx.stroke()
      }
    }
    
    const drawGrid = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.5, colors[1])
      gradient.addColorStop(1, colors[2])
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Grid settings
      const cellSize = 50 // Larger cells for subtlety
      const distortionAmount = 8 * intensity // Reduced distortion
      
      // Calculate distortion at each point
      for (let x = 0; x <= canvas.width; x += cellSize) {
        for (let y = 0; y <= canvas.height; y += cellSize) {
          const distortX = Math.sin(t * 0.2 + y * 0.01) * distortionAmount
          const distortY = Math.cos(t * 0.2 + x * 0.01) * distortionAmount
          
          const moveX = isHovering ? 
            distortX + (x - mousePosition.x) * 0.008 * distortionAmount : // Reduced mouse influence
            distortX
          const moveY = isHovering ? 
            distortY + (y - mousePosition.y) * 0.008 * distortionAmount : 
            distortY
          
          // Draw horizontal lines
          ctx.beginPath()
          ctx.moveTo(Math.max(0, x - cellSize), y + moveY)
          ctx.lineTo(Math.min(canvas.width, x + cellSize), y + moveY)
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * intensity})` // More subtle
          ctx.stroke()
          
          // Draw vertical lines
          ctx.beginPath()
          ctx.moveTo(x + moveX, Math.max(0, y - cellSize))
          ctx.lineTo(x + moveX, Math.min(canvas.height, y + cellSize))
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * intensity})`
          ctx.stroke()
        }
      }
    }
    
    const animate = () => {
      time.current += 0.025 * speed // Slower animation for subtlety
      
      switch (variant) {
        case 'moiré':
          drawMoiré(time.current)
          break
        case 'circles':
          drawCircles(time.current)
          break
        case 'waves':
          drawWaves(time.current)
          break
        case 'grid':
          drawGrid(time.current)
          break
        default:
          drawMoiré(time.current)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [variant, intensity, speed, colorScheme, dimensions, isHovering, mousePosition])
  
  return (
    <motion.canvas 
      ref={canvasRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8 }} // Slower fade-in
    />
  )
} 