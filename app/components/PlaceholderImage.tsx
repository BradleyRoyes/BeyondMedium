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
  const seedValue = useRef<number | null>(null)
  
  useEffect(() => {
    if (seedValue.current === null) {
      // Create a seed based on the title for consistency
      seedValue.current = hashString(title) || Math.floor(Math.random() * 10000)
    }
    
    const canvas = canvasRef.current
    if (!canvas || seedValue.current === null) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    canvas.width = width
    canvas.height = height
    
    // Create gradient background based on category
    let gradientColors: string[] = []
    
    switch(category?.toLowerCase()) {
      case 'workshops':
        gradientColors = ['#a18daa', '#c9b6de'] // Purple gradient
        break
      case 'experiences':
        gradientColors = ['#7e9a9a', '#a4c2c2'] // Teal gradient
        break
      case 'toys':
        gradientColors = ['#aa9b84', '#d4c9bb'] // Tan gradient
        break
      default:
        gradientColors = ['#94a897', '#b5c5b8'] // Sage green gradient
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, gradientColors[0])
    gradient.addColorStop(1, gradientColors[1])
    
    // Fill background
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Draw mycelial/neural network pattern
    drawMycelialPattern(ctx, width, height, seedValue.current)
    
  }, [width, height, title, category])
  
  return (
    <canvas ref={canvasRef} className={className} />
  )
}

// Simple string hash function to generate a seed value from title
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Simple seeded random function
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Draw mycelial/neural network pattern
function drawMycelialPattern(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  let nodeSeed = seed
  
  // Set up drawing styles - increased line width for more prominence
  ctx.lineWidth = 1.2
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
  
  // Determine number of nodes based on canvas size - increased density
  const nodeCount = Math.floor(Math.min(width, height) / 15)
  
  // Create nodes (neurons)
  const nodes: {x: number, y: number, size: number}[] = []
  
  // Create some primary nodes
  for (let i = 0; i < nodeCount; i++) {
    nodeSeed += 1
    const x = seededRandom(nodeSeed) * width
    nodeSeed += 1
    const y = seededRandom(nodeSeed + i) * height
    nodeSeed += 1
    const size = 2 + seededRandom(nodeSeed) * 8 // Larger nodes
    
    nodes.push({ x, y, size })
  }
  
  // Draw connections between nodes (axons/dendrites)
  let connectionSeed = seed + 1000 // Different seed for connections
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    
    // Each node connects to several others - increased connections
    const connectionCount = 3 + Math.floor(seededRandom(connectionSeed + i) * 4)
    
    for (let j = 0; j < connectionCount; j++) {
      connectionSeed += 1
      
      // Find another node to connect to
      const targetIndex = Math.floor(seededRandom(connectionSeed) * nodes.length)
      if (targetIndex === i) continue // Skip self-connections
      
      const target = nodes[targetIndex]
      
      // Draw with varying opacity for more organic look
      const opacity = 0.3 + seededRandom(connectionSeed * j) * 0.5
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      
      // Start the path from the current node
      ctx.moveTo(node.x, node.y)
      
      // Create a curved connection path with control points
      const controlX1 = node.x + (target.x - node.x) * (0.3 + seededRandom(connectionSeed + 1) * 0.4)
      const controlY1 = node.y + (target.y - node.y) * (0.3 + seededRandom(connectionSeed + 2) * 0.4)
      
      const controlX2 = node.x + (target.x - node.x) * (0.6 + seededRandom(connectionSeed + 3) * 0.4)
      const controlY2 = node.y + (target.y - node.y) * (0.6 + seededRandom(connectionSeed + 4) * 0.4)
      
      // Add some random deviation to control points
      const deviation = Math.min(width, height) * 0.25
      const devX1 = (seededRandom(connectionSeed + 5) - 0.5) * deviation
      const devY1 = (seededRandom(connectionSeed + 6) - 0.5) * deviation
      const devX2 = (seededRandom(connectionSeed + 7) - 0.5) * deviation
      const devY2 = (seededRandom(connectionSeed + 8) - 0.5) * deviation
      
      // Draw the curved path
      ctx.bezierCurveTo(
        controlX1 + devX1, controlY1 + devY1,
        controlX2 + devX2, controlY2 + devY2,
        target.x, target.y
      )
      
      ctx.stroke()
    }
  }
  
  // Draw nodes (neuron bodies)
  for (const node of nodes) {
    // Draw a subtle glow for all nodes
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(
      node.x, node.y, node.size * 0.5,
      node.x, node.y, node.size * 3
    )
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Draw the node itself
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fill()
  }
  
  // Add some secondary, smaller branches for mycelial appearance
  ctx.lineWidth = 0.6
  
  let branchSeed = seed + 2000 // Different seed for branches
  
  for (let i = 0; i < nodes.length; i++) {
    if (seededRandom(branchSeed + i) < 0.4) continue // More nodes have secondary branches
    
    const node = nodes[i]
    const branchCount = 2 + Math.floor(seededRandom(branchSeed + i) * 4) // More branches
    
    for (let j = 0; j < branchCount; j++) {
      branchSeed += 1
      
      // Vary opacity for more organic look
      const opacity = 0.3 + seededRandom(branchSeed * j) * 0.4
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      
      // Start at the node
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      
      // Define branch length
      const branchLength = 40 + seededRandom(branchSeed) * 90 // Longer branches
      
      // Calculate end point
      const angle = seededRandom(branchSeed + 1) * Math.PI * 2
      const endX = node.x + Math.cos(angle) * branchLength
      const endY = node.y + Math.sin(angle) * branchLength
      
      // Draw a curved branch
      const cp1x = node.x + Math.cos(angle + seededRandom(branchSeed + 2) * 0.5) * branchLength * 0.3
      const cp1y = node.y + Math.sin(angle + seededRandom(branchSeed + 3) * 0.5) * branchLength * 0.3
      
      const cp2x = node.x + Math.cos(angle + seededRandom(branchSeed + 4) * 0.5) * branchLength * 0.6
      const cp2y = node.y + Math.sin(angle + seededRandom(branchSeed + 5) * 0.5) * branchLength * 0.6
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
      ctx.stroke()
      
      // Add sub-branches for more mycelial appearance
      if (seededRandom(branchSeed + 8) > 0.6) {
        const subBranchLength = branchLength * 0.5
        const subAngle = angle + (seededRandom(branchSeed + 9) - 0.5) * Math.PI * 0.5
        
        const subEndX = endX + Math.cos(subAngle) * subBranchLength
        const subEndY = endY + Math.sin(subAngle) * subBranchLength
        
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        
        const subCp1x = endX + Math.cos(subAngle) * subBranchLength * 0.3
        const subCp1y = endY + Math.sin(subAngle) * subBranchLength * 0.3
        
        const subCp2x = endX + Math.cos(subAngle) * subBranchLength * 0.6
        const subCp2y = endY + Math.sin(subAngle) * subBranchLength * 0.6
        
        ctx.bezierCurveTo(subCp1x, subCp1y, subCp2x, subCp2y, subEndX, subEndY)
        ctx.stroke()
      }
      
      // Maybe add a small node at the end
      if (seededRandom(branchSeed + 6) > 0.3) {
        const nodeSize = 1 + seededRandom(branchSeed + 7) * 3
        
        // Add glow
        ctx.beginPath()
        ctx.arc(endX, endY, nodeSize * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          endX, endY, nodeSize * 0.5,
          endX, endY, nodeSize * 2
        )
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Add node
        ctx.beginPath()
        ctx.arc(endX, endY, nodeSize, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.fill()
      }
    }
  }
} 