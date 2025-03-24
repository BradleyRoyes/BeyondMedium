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
        gradientColors = ['#3a1c71', '#d76d77', '#ffaf7b'] // Purple to orange
        break
      case 'listening':
        gradientColors = ['#000428', '#004e92', '#2c3e50'] // Deep blue
        break
      case 'events':
        gradientColors = ['#16222A', '#3A6073', '#4286f4'] // Dark blue to light blue
        break
      default:
        gradientColors = ['#232526', '#414345', '#232526'] // Dark gray
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
        drawCirclesPattern(ctx, width, height)
        break
      case 1: // Wave pattern
        drawWavePattern(ctx, width, height)
        break
      case 2: // Grid pattern
        drawGridPattern(ctx, width, height)
        break
      case 3: // Dots pattern
        drawDotsPattern(ctx, width, height)
        break
      case 4: // Lines pattern
        drawLinesPattern(ctx, width, height)
        break
      case 5: // Neural pattern
        drawNeuralPattern(ctx, width, height)
        break
    }
    
    // Add subtle overlay with title first letter
    const firstLetter = title.charAt(0).toUpperCase()
    ctx.font = 'bold 300px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fillText(firstLetter, width / 2, height / 2)
    
  }, [width, height, title, category])
  
  return (
    <canvas ref={canvasRef} className={className} />
  )
}

// Pattern drawing functions
function drawCirclesPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const circleCount = 15
  ctx.globalCompositeOperation = 'screen'
  
  for (let i = 0; i < circleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 100 + 50
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

function drawWavePattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const waveCount = 5
  const amplitude = height / 15
  
  ctx.globalCompositeOperation = 'screen'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
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

function drawGridPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const cellSize = 40
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
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

function drawDotsPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const spacing = 30
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  
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

function drawLinesPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const lineCount = 20
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  
  for (let i = 0; i < lineCount; i++) {
    const y = (height / lineCount) * i
    
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y + Math.random() * 50 - 25)
    ctx.stroke()
  }
}

function drawNeuralPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const nodeCount = 15
  const nodes = []
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2
    })
  }
  
  // Draw connections between nearby nodes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
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
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  
  for (const node of nodes) {
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    ctx.fill()
  }
} 