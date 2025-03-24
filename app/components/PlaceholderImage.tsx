"use client"

import { useEffect, useRef } from "react"

interface PlaceholderImageProps {
  width: number
  height: number
  title: string
  category?: string
  className?: string
}

export function PlaceholderImage({ 
  width = 400, 
  height = 600, 
  title, 
  category = "", 
  className = "" 
}: PlaceholderImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uniquePattern = useRef(Math.floor(Math.random() * 6)) // 0-5 pattern types
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    canvas.width = width
    canvas.height = height
    
    // Create gradient background based on category
    let gradientColors: string[] = []
    
    switch(category?.toLowerCase()) {
      case 'workshops':
        gradientColors = ['#271557', '#433399', '#8d54b0'] // Deep purple to lavender
        break
      case 'listening':
        gradientColors = ['#0d1433', '#1a2e63', '#324f94'] // Deep blue to royal blue
        break
      case 'events':
        gradientColors = ['#1a1542', '#2c2b68', '#40387b'] // Midnight to indigo
        break
      default:
        gradientColors = ['#121212', '#25222f', '#3c3354'] // Dark slate with purple undertones
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, gradientColors[0])
    gradient.addColorStop(0.5, gradientColors[1])
    gradient.addColorStop(1, gradientColors[2] || gradientColors[0])
    
    // Fill background
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Choose and draw pattern based on uniquePattern value
    switch(uniquePattern.current) {
      case 0: // Circles pattern
        drawCirclesPattern(ctx, width, height, category)
        break
      case 1: // Wave pattern
        drawWavePattern(ctx, width, height, category)
        break
      case 2: // Grid pattern
        drawGridPattern(ctx, width, height, category)
        break
      case 3: // Dots pattern
        drawDotsPattern(ctx, width, height, category)
        break
      case 4: // Lines pattern
        drawLinesPattern(ctx, width, height, category)
        break
      case 5: // Neural pattern
        drawNeuralPattern(ctx, width, height, category)
        break
    }
    
    // Add subtle overlay with title first letter
    const firstLetter = title.charAt(0).toUpperCase()
    ctx.font = 'bold 300px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fillText(firstLetter, width / 2, height / 2)
    
    // Add subtle vignette effect
    const outerRadius = Math.max(width, height) * 0.95
    const innerRadius = Math.max(width, height) * 0.5
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, innerRadius,
      width / 2, height / 2, outerRadius
    )
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.4)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, width, height)
    
  }, [width, height, title, category])
  
  return (
    <canvas ref={canvasRef} className={className} />
  )
}

// Helper function to get accent color based on category
function getAccentColor(category?: string): string {
  switch(category?.toLowerCase()) {
    case 'workshops':
      return 'rgba(196, 132, 255, 0.2)' // Lavender accent
    case 'listening':
      return 'rgba(99, 152, 255, 0.2)' // Blue accent
    case 'events':
      return 'rgba(147, 130, 255, 0.2)' // Purple-blue accent
    default:
      return 'rgba(180, 160, 230, 0.15)' // Subtle purple accent
  }
}

// Pattern drawing functions
function drawCirclesPattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  category?: string
) {
  const circleCount = 15
  const accentColor = getAccentColor(category)
  ctx.globalCompositeOperation = 'screen'
  
  for (let i = 0; i < circleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 100 + 50
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, accentColor)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

function drawWavePattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  category?: string
) {
  const waveCount = 5
  const amplitude = height / 15
  
  ctx.globalCompositeOperation = 'screen'
  ctx.strokeStyle = getAccentColor(category)
  ctx.lineWidth = 2
  
  for (let i = 0; i < waveCount; i++) {
    const yOffset = (height / (waveCount + 1)) * (i + 1)
    const frequency = (i + 1) * 0.01
    
    ctx.beginPath()
    
    for (let x = 0; x < width; x += 1) {
      const y = Math.sin(x * frequency) * amplitude + yOffset
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    ctx.stroke()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

function drawGridPattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  category?: string
) {
  const cellSize = 40
  
  ctx.strokeStyle = getAccentColor(category)
  ctx.lineWidth = 1
  
  // Vertical lines
  for (let x = 0; x < width; x += cellSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  
  // Horizontal lines
  for (let y = 0; y < height; y += cellSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function drawDotsPattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  category?: string
) {
  const spacing = 30
  
  ctx.fillStyle = getAccentColor(category)
  
  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      const jitter = Math.random() * 10 - 5
      const size = Math.random() * 3 + 1
      
      ctx.beginPath()
      ctx.arc(x + jitter, y + jitter, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawLinesPattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  category?: string
) {
  const lineCount = 20
  
  ctx.strokeStyle = getAccentColor(category)
  ctx.lineWidth = 1
  
  for (let i = 0; i < lineCount; i++) {
    const y = (height / lineCount) * i
    
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y + Math.random() * 50 - 25)
    ctx.stroke()
  }
}

function drawNeuralPattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  category?: string
) {
  const nodeCount = 15
  const nodes = []
  const accentColor = getAccentColor(category)
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2
    })
  }
  
  // Draw connections between nearby nodes
  ctx.strokeStyle = accentColor.replace(/[\d.]+\)$/g, '0.05)')
  ctx.lineWidth = 1
  
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 150) {
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
  }
  
  // Draw nodes
  ctx.fillStyle = accentColor
  
  for (const node of nodes) {
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    ctx.fill()
  }
} 