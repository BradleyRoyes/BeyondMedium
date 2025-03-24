"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface OpArtProps {
  variant?: 'circles' | 'moiré' | 'waves' | 'grid'
  intensity?: number
  speed?: number
  colorScheme?: 'purple' | 'blue' | 'cyan' | 'custom'
  customColors?: string[]
  className?: string
  interactive?: boolean
}

export function OpArt({
  variant = 'moiré',
  intensity = 1,
  speed = 1,
  colorScheme = 'purple',
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

  // Color schemes with more subtle, mysterious pastel hues
  const colorSchemes = {
    purple: ['#352b51', '#5d517a', '#9185ac'],
    blue: ['#2a364f', '#3b5173', '#536c9c'],
    cyan: ['#2b4c5d', '#3d6976', '#6ba6b6'],
    custom: customColors || ['#2a2642', '#403a5f', '#625984']
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
      
      ctx.lineWidth = 1
      
      // First set of concentric circles
      for (let r = 0; r < Math.max(canvas.width, canvas.height); r += 10) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, r + Math.sin(t * 0.2) * 5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * intensity})`
        ctx.stroke()
      }
      
      // Second set of concentric circles (offset to create moiré)
      const offset = 20 + Math.sin(t * 0.1) * 10
      for (let r = 0; r < Math.max(canvas.width, canvas.height); r += 10) {
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
      
      // Use a deterministic approach instead of random positions
      for (let i = 0; i < circleCount; i++) {
        const theta = (i / circleCount) * Math.PI * 2
        const oscillation = Math.sin(t * 0.5 + i * 0.3) * 50
        
        const x = canvas.width / 2 + Math.cos(theta) * (100 + oscillation)
        const y = canvas.height / 2 + Math.sin(theta) * (100 + oscillation)
        
        const radius = 50 + Math.sin(t * 0.2 + i) * 20
        
        const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
        circleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.beginPath()
        ctx.arc(
          isHovering ? x + (mousePosition.x - canvas.width/2) * 0.1 : x,
          isHovering ? y + (mousePosition.y - canvas.height/2) * 0.1 : y,
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
        (mousePosition.y - canvas.height/2) * 0.2 : 
        Math.sin(t * 0.2) * 20
        
      ctx.lineWidth = 1.5
      
      for (let i = 0; i < waveCount; i++) {
        const yBase = (canvas.height / (waveCount + 1)) * (i + 1)
        const amplitude = 20 + (i % 3) * 10
        const frequency = (i % 4 + 1) * 0.02
        const waveSpeed = (i % 5 + 1) * 0.1 * t * 0.05 * speed
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 * intensity})`
        
        for (let x = 0; x < canvas.width; x += 1) {
          const y = Math.sin(x * frequency + waveSpeed) * amplitude + yBase + yDistortion
          
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
      const cellSize = 40
      const distortionAmount = 10 * intensity
      
      // Calculate distortion at each point
      for (let x = 0; x <= canvas.width; x += cellSize) {
        for (let y = 0; y <= canvas.height; y += cellSize) {
          const distortX = Math.sin(t * 0.3 + y * 0.01) * distortionAmount
          const distortY = Math.cos(t * 0.3 + x * 0.01) * distortionAmount
          
          const moveX = isHovering ? 
            distortX + (x - mousePosition.x) * 0.01 * distortionAmount : 
            distortX
          const moveY = isHovering ? 
            distortY + (y - mousePosition.y) * 0.01 * distortionAmount : 
            distortY
          
          // Draw horizontal lines
          ctx.beginPath()
          ctx.moveTo(Math.max(0, x - cellSize), y + moveY)
          ctx.lineTo(Math.min(canvas.width, x + cellSize), y + moveY)
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * intensity})`
          ctx.stroke()
          
          // Draw vertical lines
          ctx.beginPath()
          ctx.moveTo(x + moveX, Math.max(0, y - cellSize))
          ctx.lineTo(x + moveX, Math.min(canvas.height, y + cellSize))
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * intensity})`
          ctx.stroke()
        }
      }
    }
    
    const animate = () => {
      time.current += 0.03 * speed
      
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
      transition={{ duration: 1.5 }}
    />
  )
} 