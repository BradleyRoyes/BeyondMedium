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
  const uniquePattern = useRef<number | null>(null)
  const seedValue = useRef<number | null>(null)
  
  useEffect(() => {
    if (uniquePattern.current === null) {
      uniquePattern.current = Math.floor(Math.random() * 6) // 0-5 pattern types
      seedValue.current = Math.random() * 10000 | 0 // Integer seed for deterministic randomness
    }
    
    const canvas = canvasRef.current
    if (!canvas || uniquePattern.current === null || seedValue.current === null) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    canvas.width = width
    canvas.height = height
    
    // Create gradient background based on category
    let gradientColors: string[] = []
    
    switch(category?.toLowerCase()) {
      case 'workshops':
        gradientColors = ['#a18daa', '#c9b6de', '#e8d7f7'] // Soft purple lavender gradient (pastel)
        break
      case 'experiences':
        gradientColors = ['#7e9a9a', '#a4c2c2', '#d6e6e6'] // Soft teal gradient (earthy)
        break
      case 'toys':
        gradientColors = ['#aa9b84', '#d4c9bb', '#efe6dd'] // Soft tan/beige gradient (earthy)
        break
      default:
        gradientColors = ['#94a897', '#b5c5b8', '#d2ddd4'] // Soft sage green gradient (earthy)
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, gradientColors[0])
    gradient.addColorStop(0.5, gradientColors[1])
    gradient.addColorStop(1, gradientColors[2] || gradientColors[0])
    
    // Fill background
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Choose and draw pattern based on uniquePattern value and seed
    switch(uniquePattern.current) {
      case 0: // Organic Circles
        drawOrganicCircles(ctx, width, height, seedValue.current)
        break
      case 1: // Textured Grid
        drawTexturedGrid(ctx, width, height, seedValue.current)
        break
      case 2: // Subtle Fractals
        drawSubtleFractals(ctx, width, height, seedValue.current)
        break
      case 3: // Abstract Flow Fields
        drawAbstractFlowFields(ctx, width, height, seedValue.current)
        break
      case 4: // Fluid Ripples
        drawFluidRipples(ctx, width, height, seedValue.current)
        break
      case 5: // Ethereal Waves
        drawEtherealWaves(ctx, width, height, seedValue.current)
        break
    }
    
    // Add subtle overlay with title first letter - slightly reduce opacity
    const firstLetter = title.charAt(0).toUpperCase()
    ctx.font = 'bold 300px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillText(firstLetter, width / 2, height / 2)
    
  }, [width, height, title, category])
  
  return (
    <canvas ref={canvasRef} className={className} />
  )
}

// Simple seeded random function
function seededRandom(seed: number) {
  // Simple deterministic random function
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Updated pattern drawing functions with seed parameter
// 1. Organic Circles - overlapping translucent circles with organic feel
function drawOrganicCircles(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  let rndSeed = seed;
  const circleCount = 15 + Math.floor(seededRandom(rndSeed++) * 10)
  
  for (let i = 0; i < circleCount; i++) {
    // Random position and size
    const x = seededRandom(rndSeed++) * width
    const y = seededRandom(rndSeed++) * height
    const radius = seededRandom(rndSeed++) * Math.min(width, height) * 0.3
    
    // Create gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.01)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.04)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    // Draw circle
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Add very subtle stroke to some circles
    if (seededRandom(rndSeed++) > 0.7) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 2. Textured Grid - subtle grid with varied opacity
function drawTexturedGrid(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const cellSize = 25 + seededRandom(seed) * 20
  const noiseAmplitude = 5
  
  // Draw vertical lines with slight noise
  for (let x = 0; x <= width; x += cellSize) {
    const opacity = 0.05 + seededRandom(seed) * 0.05
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.lineWidth = 0.5
    
    ctx.beginPath()
    ctx.moveTo(x, 0)
    
    // Add slight noise to line
    for (let y = 0; y < height; y += 10) {
      const noise = (seededRandom(seed) - 0.5) * noiseAmplitude
      ctx.lineTo(x + noise, y)
    }
    
    ctx.stroke()
  }
  
  // Draw horizontal lines with slight noise
  for (let y = 0; y <= height; y += cellSize) {
    const opacity = 0.05 + seededRandom(seed) * 0.05
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
    
    ctx.beginPath()
    ctx.moveTo(0, y)
    
    // Add slight noise to line
    for (let x = 0; x < width; x += 10) {
      const noise = (seededRandom(seed) - 0.5) * noiseAmplitude
      ctx.lineTo(x, y + noise)
    }
    
    ctx.stroke()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 3. Subtle Fractals - recursive pattern with diminishing opacity
function drawSubtleFractals(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const drawBranch = (x: number, y: number, length: number, angle: number, depth: number, seed: number) => {
    if (depth <= 0) return
    
    const endX = x + Math.cos(angle) * length
    const endY = y + Math.sin(angle) * length
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - depth * 0.005})`
    ctx.lineWidth = 0.5
    ctx.stroke()
    
    const branchAngle = Math.PI / 4 + seededRandom(seed) * (Math.PI / 8)
    drawBranch(endX, endY, length * 0.7, angle + branchAngle, depth - 1, seed)
    drawBranch(endX, endY, length * 0.7, angle - branchAngle, depth - 1, seed)
  }
  
  // Start drawing fractal pattern from different points
  const startPoints = 3 + Math.floor(seededRandom(seed) * 3)
  
  for (let i = 0; i < startPoints; i++) {
    const x = width * (0.2 + seededRandom(seed) * 0.6)
    const y = height * (0.2 + seededRandom(seed) * 0.6)
    const length = Math.min(width, height) * 0.15
    const angle = seededRandom(seed) * Math.PI * 2
    
    drawBranch(x, y, length, angle, 4, seed)
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 4. Abstract Flow Fields - particle-based flow field
function drawAbstractFlowFields(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const particleCount = 100
  const stepSize = 10
  const steps = 50
  
  // Create a noise field (simplified version)
  const noiseField = (x: number, y: number) => {
    return (Math.sin(x * 0.01) + Math.cos(y * 0.01)) * Math.PI
  }
  
  // Draw particles following the flow field
  for (let i = 0; i < particleCount; i++) {
    let x = seededRandom(seed) * width
    let y = seededRandom(seed) * height
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    
    for (let j = 0; j < steps; j++) {
      const angle = noiseField(x, y)
      x += Math.cos(angle) * stepSize
      y += Math.sin(angle) * stepSize
      
      if (x < 0 || x > width || y < 0 || y > height) break
      
      ctx.lineTo(x, y)
    }
    
    ctx.strokeStyle = `rgba(255, 255, 255, 0.03)`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 5. Fluid Ripples - concentric circles with interference
function drawFluidRipples(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const centerPoints = []
  const rippleCount = 3 + Math.floor(seededRandom(seed) * 3)
  
  // Create random center points
  for (let i = 0; i < rippleCount; i++) {
    centerPoints.push({
      x: width * (0.2 + seededRandom(seed) * 0.6),
      y: height * (0.2 + seededRandom(seed) * 0.6),
      frequency: 0.05 + seededRandom(seed) * 0.05
    })
  }
  
  // Draw ripples
  for (let radius = 5; radius < Math.max(width, height); radius += 15) {
    ctx.beginPath()
    
    for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
      let totalOffset = 0
      
      // Calculate interference from each center point
      for (const center of centerPoints) {
        const dist = Math.sqrt(
          Math.pow(center.x - (width / 2), 2) + 
          Math.pow(center.y - (height / 2), 2)
        )
        totalOffset += Math.sin(radius * center.frequency + dist * 0.01) * 5
      }
      
      const x = width / 2 + Math.cos(angle) * (radius + totalOffset)
      const y = height / 2 + Math.sin(angle) * (radius + totalOffset)
      
      if (angle === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    ctx.closePath()
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 + (radius / Math.max(width, height)) * 0.03})`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 6. Ethereal Waves - subtle wave patterns
function drawEtherealWaves(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const waveCount = 10
  const layerCount = 3
  
  for (let layer = 0; layer < layerCount; layer++) {
    const amplitude = 10 + seededRandom(seed) * 15
    const frequency = 0.005 + seededRandom(seed) * 0.01
    const phaseOffset = seededRandom(seed) * Math.PI * 2
    
    for (let i = 0; i < waveCount; i++) {
      const yOffset = height * (0.2 + (i / waveCount) * 0.6)
      
      ctx.beginPath()
      
      for (let x = 0; x < width; x += 2) {
        const y = yOffset + Math.sin(x * frequency + phaseOffset) * amplitude
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.01 + layer * 0.01})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }
  
  ctx.globalCompositeOperation = 'source-over'
} 