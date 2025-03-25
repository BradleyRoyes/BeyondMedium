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
      case 0: // Rorschach Inkblot Classic
        drawRorschachInkblot(ctx, width, height, seedValue.current)
        break
      case 1: // Symmetrical Butterfly
        drawSymmetricalButterfly(ctx, width, height, seedValue.current)
        break
      case 2: // Mirrored Abstract
        drawMirroredAbstract(ctx, width, height, seedValue.current)
        break
      case 3: // Bilateral Flow Field
        drawBilateralFlowField(ctx, width, height, seedValue.current)
        break
      case 4: // Organic Symmetry
        drawOrganicSymmetry(ctx, width, height, seedValue.current)
        break
      case 5: // Fractal Mirror
        drawFractalMirror(ctx, width, height, seedValue.current)
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

// 1. Rorschach Inkblot Classic - symmetrical inkblot pattern
function drawRorschachInkblot(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  // Draw only on one half, then mirror
  const halfWidth = width / 2
  const splatCount = 5 + Math.floor(seededRandom(seed) * 5)
  
  let rndSeed = seed;
  
  // Draw the blots
  for (let i = 0; i < splatCount; i++) {
    // Generate random blot properties
    const centerX = halfWidth * (0.3 + seededRandom(rndSeed++) * 0.7)
    const centerY = height * (0.2 + seededRandom(rndSeed++) * 0.6)
    
    // Create a few connected nodes for each blot
    const nodeCount = 4 + Math.floor(seededRandom(rndSeed++) * 3)
    const nodes = []
    
    for (let j = 0; j < nodeCount; j++) {
      nodes.push({
        x: centerX + (seededRandom(rndSeed++) - 0.5) * (halfWidth * 0.5),
        y: centerY + (seededRandom(rndSeed++) - 0.5) * (height * 0.3)
      })
    }
    
    // Draw blot shape with bezier curves
    ctx.beginPath()
    ctx.moveTo(nodes[0].x, nodes[0].y)
    
    for (let j = 1; j < nodes.length; j++) {
      const prevNode = nodes[j-1]
      const currNode = nodes[j]
      
      // Control points for bezier curve
      const cp1x = prevNode.x + (currNode.x - prevNode.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 30
      const cp1y = prevNode.y + (seededRandom(rndSeed++) - 0.5) * 40
      const cp2x = currNode.x - (currNode.x - prevNode.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 30
      const cp2y = currNode.y + (seededRandom(rndSeed++) - 0.5) * 40
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, currNode.x, currNode.y)
    }
    
    // Connect back to first node
    const firstNode = nodes[0]
    const lastNode = nodes[nodes.length - 1]
    
    const cp1x = lastNode.x + (firstNode.x - lastNode.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 30
    const cp1y = lastNode.y + (seededRandom(rndSeed++) - 0.5) * 40
    const cp2x = firstNode.x - (firstNode.x - lastNode.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 30
    const cp2y = firstNode.y + (seededRandom(rndSeed++) - 0.5) * 40
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, firstNode.x, firstNode.y)
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.07 + seededRandom(rndSeed++) * 0.05})`
    ctx.fill()
    
    // Draw mirror image on right side
    ctx.save()
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.fill()
    ctx.restore()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 2. Symmetrical Butterfly - butterfly-like pattern with symmetry
function drawSymmetricalButterfly(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  const wingCount = 3 + Math.floor(seededRandom(rndSeed++) * 3)
  
  // Generate "wings" that are symmetrical
  for (let i = 0; i < wingCount; i++) {
    // Wing properties
    const baseY = centerY + (seededRandom(rndSeed++) - 0.5) * (height * 0.6)
    const wingLength = halfWidth * (0.5 + seededRandom(rndSeed++) * 0.4)
    const wingHeight = height * (0.1 + seededRandom(rndSeed++) * 0.3)
    const wingCurve = 0.3 + seededRandom(rndSeed++) * 0.4
    
    // Draw left wing
    ctx.beginPath()
    ctx.moveTo(halfWidth, baseY)
    
    // Control points for bezier
    const cp1x = halfWidth - wingLength * 0.3
    const cp1y = baseY - wingHeight * wingCurve
    const cp2x = halfWidth - wingLength * 0.7
    const cp2y = baseY + wingHeight * (1 - wingCurve)
    const endX = halfWidth - wingLength
    const endY = baseY + (seededRandom(rndSeed++) - 0.5) * 20
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
    
    // Return curve for wing shape
    const backCp1x = cp2x + (seededRandom(rndSeed++) - 0.5) * 20
    const backCp1y = cp2y + wingHeight * (seededRandom(rndSeed++) * 0.2 + 0.1)
    const backCp2x = cp1x + (seededRandom(rndSeed++) - 0.5) * 20
    const backCp2y = cp1y + wingHeight * (seededRandom(rndSeed++) * 0.2 + 0.1)
    
    ctx.bezierCurveTo(backCp1x, backCp1y, backCp2x, backCp2y, halfWidth, baseY)
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + seededRandom(rndSeed++) * 0.05})`
    ctx.fill()
    
    // Draw mirrored right wing
    ctx.save()
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.fill()
    ctx.restore()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 3. Mirrored Abstract - symmetrical abstract patterns
function drawMirroredAbstract(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const halfWidth = width / 2
  let rndSeed = seed;
  
  // Create multiple blob-like shapes
  const shapeCount = 4 + Math.floor(seededRandom(rndSeed++) * 4)
  
  for (let s = 0; s < shapeCount; s++) {
    // For each shape, draw multiple layers that evolve
    const layers = 3 + Math.floor(seededRandom(rndSeed++) * 3)
    const centerX = halfWidth * (0.2 + seededRandom(rndSeed++) * 0.8)
    const centerY = height * (0.2 + seededRandom(rndSeed++) * 0.6)
    const maxRadius = halfWidth * (0.2 + seededRandom(rndSeed++) * 0.3)
    
    for (let l = 0; l < layers; l++) {
      ctx.beginPath()
      
      const pointCount = 10 + Math.floor(seededRandom(rndSeed++) * 6)
      const layerRadiusMod = 0.7 + (l / layers) * 0.3
      
      // Create deformed circle with random fluctuations
      for (let i = 0; i <= pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2
        const radiusNoise = (0.8 + seededRandom(rndSeed++) * 0.4) * layerRadiusMod
        const radius = maxRadius * radiusNoise
        
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          const prevAngle = ((i - 1) / pointCount) * Math.PI * 2
          const prevX = centerX + Math.cos(prevAngle) * (maxRadius * (0.8 + seededRandom(rndSeed++ - 1) * 0.4) * layerRadiusMod)
          const prevY = centerY + Math.sin(prevAngle) * (maxRadius * (0.8 + seededRandom(rndSeed++ - 1) * 0.4) * layerRadiusMod)
          
          const cpDist = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2)) * 0.3
          const cpAngle1 = prevAngle + Math.PI / 2
          const cpAngle2 = angle - Math.PI / 2
          
          const cp1x = prevX + Math.cos(cpAngle1) * cpDist
          const cp1y = prevY + Math.sin(cpAngle1) * cpDist
          const cp2x = x + Math.cos(cpAngle2) * cpDist
          const cp2y = y + Math.sin(cpAngle2) * cpDist
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        }
      }
      
      const opacity = 0.02 + (l / layers) * 0.03
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.fill()
      
      // Mirror to right side
      ctx.save()
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
      ctx.fill()
      ctx.restore()
    }
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 4. Bilateral Flow Field - symmetrical particle trails
function drawBilateralFlowField(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const halfWidth = width / 2
  const particleCount = 40
  const stepSize = 5
  const steps = 30
  let rndSeed = seed
  
  // Create a noise field that respects symmetry
  const noiseField = (x: number, y: number, seed: number) => {
    return (Math.sin(x * 0.05 + seed * 0.1) + Math.cos(y * 0.05)) * Math.PI
  }
  
  // Draw particles following the flow field - only on left half
  for (let i = 0; i < particleCount; i++) {
    let x = seededRandom(rndSeed++) * halfWidth * 0.9
    let y = seededRandom(rndSeed++) * height
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    
    for (let j = 0; j < steps; j++) {
      const angle = noiseField(x, y, rndSeed++)
      x += Math.cos(angle) * stepSize
      y += Math.sin(angle) * stepSize
      
      // Keep within left half
      if (x < 0 || x > halfWidth || y < 0 || y > height) break
      
      ctx.lineTo(x, y)
    }
    
    ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`
    ctx.lineWidth = 0.5
    ctx.stroke()
    
    // Draw mirrored version on right half
    ctx.save()
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.stroke()
    ctx.restore()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 5. Organic Symmetry - symmetrical organic forms
function drawOrganicSymmetry(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  let rndSeed = seed
  
  // Draw multiple layers of organic forms
  const formCount = 5 + Math.floor(seededRandom(rndSeed++) * 3)
  
  for (let i = 0; i < formCount; i++) {
    const startY = height * (0.2 + seededRandom(rndSeed++) * 0.6)
    const controlCount = 3 + Math.floor(seededRandom(rndSeed++) * 3)
    const maxWidth = halfWidth * (0.5 + seededRandom(rndSeed++) * 0.5)
    
    ctx.beginPath()
    ctx.moveTo(halfWidth, startY)
    
    const controlPoints = []
    
    // Create control points for one half
    for (let j = 0; j < controlCount; j++) {
      const t = j / (controlCount - 1)
      controlPoints.push({
        x: halfWidth - maxWidth * t,
        y: startY + (seededRandom(rndSeed++) - 0.5) * height * 0.5
      })
    }
    
    // Draw path using control points
    for (let j = 0; j < controlPoints.length; j++) {
      const point = controlPoints[j]
      
      if (j === 0) {
        ctx.lineTo(point.x, point.y)
      } else {
        const prev = controlPoints[j - 1]
        const mid = {
          x: (prev.x + point.x) / 2,
          y: (prev.y + point.y) / 2
        }
        ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y)
      }
    }
    
    // Return to center
    ctx.lineTo(halfWidth, controlPoints[controlPoints.length - 1].y + (seededRandom(rndSeed++) - 0.5) * 30)
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + seededRandom(rndSeed++) * 0.03})`
    ctx.fill()
    
    // Mirror to right side
    ctx.save()
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.fill()
    ctx.restore()
  }
  
  ctx.globalCompositeOperation = 'source-over'
}

// 6. Fractal Mirror - symmetrical fractal-like patterns
function drawFractalMirror(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  let rndSeed = seed
  
  // Draw recursive branching pattern that's mirrored
  const drawBranch = (x: number, y: number, length: number, angle: number, depth: number, seed: number) => {
    if (depth <= 0 || length < 5) return
    
    const endX = x + Math.cos(angle) * length
    const endY = y + Math.sin(angle) * length
    
    // Only draw branches on the left half
    if (endX <= halfWidth) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 - depth * 0.01})`
      ctx.lineWidth = 0.7
      ctx.stroke()
      
      // Draw mirrored version on right half
      const mirrorX = width - x
      const mirrorEndX = width - endX
      
      ctx.beginPath()
      ctx.moveTo(mirrorX, y)
      ctx.lineTo(mirrorEndX, endY)
      ctx.stroke()
    }
    
    // Recursive branches
    const branchAngle = 0.4 + seededRandom(seed) * 0.6
    drawBranch(endX, endY, length * 0.75, angle + branchAngle, depth - 1, seed + 1)
    drawBranch(endX, endY, length * 0.75, angle - branchAngle, depth - 1, seed + 2)
  }
  
  // Start branches from different points along center line
  const startPoints = 2 + Math.floor(seededRandom(rndSeed++) * 3)
  
  for (let i = 0; i < startPoints; i++) {
    const y = height * (0.3 + (i / startPoints) * 0.4)
    const length = halfWidth * (0.3 + seededRandom(rndSeed++) * 0.2)
    const angle = Math.PI + (seededRandom(rndSeed++) - 0.5) * 0.5
    
    drawBranch(halfWidth, y, length, angle, 4, rndSeed++)
  }
  
  ctx.globalCompositeOperation = 'source-over'
} 