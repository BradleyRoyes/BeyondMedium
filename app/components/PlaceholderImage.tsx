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
    
    // Analyze title text to determine pattern characteristics
    const patternCharacteristics = analyzeText(title)
    
    // Draw mycelial/neural network pattern with text-derived characteristics
    drawMycelialPattern(ctx, width, height, seedValue.current, patternCharacteristics)
    
  }, [width, height, title, category])
  
  return (
    <canvas ref={canvasRef} className={className} />
  )
}

// Analyze text to determine pattern characteristics
interface PatternCharacteristics {
  density: number        // How dense the network is (0-1)
  complexity: number     // How complex the branching is (0-1)
  connectivity: number   // How interconnected nodes are (0-1)
  brightness: number     // How bright/prominent the pattern is (0-1)
  organicity: number     // How organic vs geometric the pattern is (0-1)
  focusPoints: number    // Number of focal points in the pattern
}

function analyzeText(text: string): PatternCharacteristics {
  // Default mid-range values
  const characteristics: PatternCharacteristics = {
    density: 0.5,
    complexity: 0.5, 
    connectivity: 0.5,
    brightness: 0.5,
    organicity: 0.5,
    focusPoints: 3
  }
  
  if (!text || text.length === 0) return characteristics
  
  // Text length affects density
  // Longer texts create denser patterns
  characteristics.density = Math.min(0.3 + (text.length / 50), 0.9)
  
  // Count special characters (affects complexity)
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length
  characteristics.complexity = Math.min(0.4 + (specialChars / text.length) * 3, 0.9)
  
  // Count uppercase letters (affects brightness)
  const uppercaseChars = (text.match(/[A-Z]/g) || []).length
  characteristics.brightness = 0.4 + (uppercaseChars / text.length) * 0.6
  
  // Count vowels (affects organicity - more vowels = more organic flows)
  const vowels = (text.match(/[aeiouAEIOU]/g) || []).length
  characteristics.organicity = 0.3 + (vowels / text.length) * 0.8
  
  // Count words (affects connectivity and focus points)
  const words = text.split(/\s+/).filter(word => word.length > 0)
  characteristics.connectivity = Math.min(0.3 + (words.length / 10), 0.9)
  
  // Focus points based on sentence structure and word count
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  characteristics.focusPoints = Math.max(1, Math.min(7, Math.ceil(sentences.length * 1.5)))
  
  return characteristics
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

// Draw mycelial/neural network pattern with text-derived characteristics
function drawMycelialPattern(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  seed: number,
  characteristics: PatternCharacteristics
) {
  let nodeSeed = seed
  
  // Apply text-derived characteristics to pattern
  
  // Set up drawing styles - line width affected by brightness
  const lineWidth = 0.8 + characteristics.brightness * 0.8
  ctx.lineWidth = lineWidth
  
  const baseOpacity = 0.4 + characteristics.brightness * 0.3
  ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`
  
  // Determine number of nodes based on canvas size and density
  const baseNodeCount = Math.floor(Math.min(width, height) / 20)
  const nodeCount = Math.floor(baseNodeCount * (0.7 + characteristics.density * 0.8))
  
  // Create nodes (neurons) with focus points
  const nodes: {x: number, y: number, size: number, isFocal: boolean}[] = []
  
  // First create focus points
  const focusSize = 4 + characteristics.organicity * 8
  for (let i = 0; i < characteristics.focusPoints; i++) {
    nodeSeed += 1
    
    // Place focal points more deliberately - avoid edges
    const margin = width * 0.2
    const x = margin + seededRandom(nodeSeed) * (width - margin * 2)
    nodeSeed += 1
    const y = margin + seededRandom(nodeSeed + i) * (height - margin * 2)
    
    nodes.push({ 
      x, 
      y, 
      size: focusSize + seededRandom(nodeSeed + 2) * 4, 
      isFocal: true 
    })
  }
  
  // Then add regular nodes
  for (let i = 0; i < nodeCount - characteristics.focusPoints; i++) {
    nodeSeed += 1
    const x = seededRandom(nodeSeed) * width
    nodeSeed += 1
    const y = seededRandom(nodeSeed + i) * height
    nodeSeed += 1
    
    // Node size affected by organicity
    const size = 1 + characteristics.organicity * 4 + seededRandom(nodeSeed) * 3
    
    nodes.push({ x, y, size, isFocal: false })
  }
  
  // Draw connections between nodes (axons/dendrites)
  let connectionSeed = seed + 1000
  
  // Connection count affected by connectivity
  const maxConnections = 2 + Math.floor(characteristics.connectivity * 6)
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    
    // Focal points have more connections
    const connectionFactor = node.isFocal ? 1.5 : 1
    const connectionCount = 1 + Math.floor(seededRandom(connectionSeed + i) * maxConnections * connectionFactor)
    
    for (let j = 0; j < connectionCount; j++) {
      connectionSeed += 1
      
      // Find another node to connect to
      // Focal points tend to connect to other nodes more
      const targetPool = node.isFocal ? 
        nodes : 
        nodes.filter(n => seededRandom(connectionSeed + n.x) < 0.7 || n.isFocal)
      
      if (targetPool.length === 0) continue
      
      const targetIndex = Math.floor(seededRandom(connectionSeed) * targetPool.length)
      const target = targetPool[targetIndex]
      
      if (target === node) continue // Skip self-connections
      
      // Draw with varying opacity based on brightness
      const opacity = (0.2 + characteristics.brightness * 0.4) * 
                      (0.7 + seededRandom(connectionSeed * j) * 0.5)
      
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      
      // Line width varies slightly with importance of connection
      const connectionImportance = (node.isFocal || target.isFocal) ? 1.3 : 1
      ctx.lineWidth = lineWidth * (0.7 + seededRandom(connectionSeed + 3) * 0.6) * connectionImportance
      
      // Start the path from the current node
      ctx.moveTo(node.x, node.y)
      
      // Create a curved connection path with control points
      // Curve complexity affected by organicity
      const curveFactor = 0.2 + characteristics.organicity * 0.6
      
      const controlX1 = node.x + (target.x - node.x) * (0.3 + seededRandom(connectionSeed + 1) * 0.4)
      const controlY1 = node.y + (target.y - node.y) * (0.3 + seededRandom(connectionSeed + 2) * 0.4)
      
      const controlX2 = node.x + (target.x - node.x) * (0.6 + seededRandom(connectionSeed + 3) * 0.4)
      const controlY2 = node.y + (target.y - node.y) * (0.6 + seededRandom(connectionSeed + 4) * 0.4)
      
      // Add random deviation to control points based on organicity
      const deviation = Math.min(width, height) * 0.15 * curveFactor
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
    // Draw a subtle glow for all nodes, stronger for focal points
    const glowSize = node.isFocal ? node.size * 4 : node.size * 2.5
    const glowOpacity = node.isFocal ? 
                         0.3 + characteristics.brightness * 0.4 : 
                         0.2 + characteristics.brightness * 0.3
    
    ctx.beginPath()
    ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(
      node.x, node.y, node.size * 0.5,
      node.x, node.y, glowSize
    )
    gradient.addColorStop(0, `rgba(255, 255, 255, ${glowOpacity})`)
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Draw the node itself
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
    const nodeOpacity = node.isFocal ? 
                        0.7 + characteristics.brightness * 0.3 : 
                        0.5 + characteristics.brightness * 0.4
    ctx.fillStyle = `rgba(255, 255, 255, ${nodeOpacity})`
    ctx.fill()
  }
  
  // Add branches based on complexity
  const branchProbability = 0.4 * characteristics.complexity
  const branchCount = 1 + Math.floor(characteristics.complexity * 5)
  
  ctx.lineWidth = 0.5 + characteristics.complexity * 0.3
  
  let branchSeed = seed + 2000
  
  for (let i = 0; i < nodes.length; i++) {
    if (seededRandom(branchSeed + i) > branchProbability && !nodes[i].isFocal) continue
    
    const node = nodes[i]
    // Focal points have more branches
    const nodeBranchCount = node.isFocal ? 
                           branchCount + 2 : 
                           Math.max(1, Math.floor(seededRandom(branchSeed) * branchCount))
    
    for (let j = 0; j < nodeBranchCount; j++) {
      branchSeed += 1
      
      // Vary opacity
      const opacity = (0.2 + characteristics.brightness * 0.4) * 
                      (0.5 + seededRandom(branchSeed * j) * 0.5)
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      
      // Start at the node
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      
      // Branch length affected by complexity
      const branchLength = 30 + characteristics.complexity * 70 + seededRandom(branchSeed) * 40
      
      // Calculate end point
      const angle = seededRandom(branchSeed + 1) * Math.PI * 2
      const endX = node.x + Math.cos(angle) * branchLength
      const endY = node.y + Math.sin(angle) * branchLength
      
      // Branch curvature affected by organicity
      const curveFactor = 0.3 + characteristics.organicity * 0.7
      
      // Draw a curved branch
      const cp1x = node.x + Math.cos(angle + seededRandom(branchSeed + 2) * curveFactor) * branchLength * 0.3
      const cp1y = node.y + Math.sin(angle + seededRandom(branchSeed + 3) * curveFactor) * branchLength * 0.3
      
      const cp2x = node.x + Math.cos(angle + seededRandom(branchSeed + 4) * curveFactor) * branchLength * 0.6
      const cp2y = node.y + Math.sin(angle + seededRandom(branchSeed + 5) * curveFactor) * branchLength * 0.6
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
      ctx.stroke()
      
      // Add sub-branches based on complexity
      if (seededRandom(branchSeed + 8) < characteristics.complexity * 0.8) {
        const subBranchLength = branchLength * (0.3 + characteristics.complexity * 0.4)
        const subAngle = angle + (seededRandom(branchSeed + 9) - 0.5) * Math.PI * 0.5
        
        const subEndX = endX + Math.cos(subAngle) * subBranchLength
        const subEndY = endY + Math.sin(subAngle) * subBranchLength
        
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        
        // Sub-branch curvature
        const subCp1x = endX + Math.cos(subAngle + seededRandom(branchSeed + 10) * curveFactor) * subBranchLength * 0.3
        const subCp1y = endY + Math.sin(subAngle + seededRandom(branchSeed + 11) * curveFactor) * subBranchLength * 0.3
        
        const subCp2x = endX + Math.cos(subAngle + seededRandom(branchSeed + 12) * curveFactor) * subBranchLength * 0.6
        const subCp2y = endY + Math.sin(subAngle + seededRandom(branchSeed + 13) * curveFactor) * subBranchLength * 0.6
        
        ctx.bezierCurveTo(subCp1x, subCp1y, subCp2x, subCp2y, subEndX, subEndY)
        ctx.stroke()
      }
      
      // Add terminal nodes with probability based on complexity
      if (seededRandom(branchSeed + 6) < 0.3 + characteristics.complexity * 0.4) {
        const nodeSize = 1 + seededRandom(branchSeed + 7) * 2
        
        // Add glow
        ctx.beginPath()
        ctx.arc(endX, endY, nodeSize * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          endX, endY, nodeSize * 0.5,
          endX, endY, nodeSize * 2
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 + characteristics.brightness * 0.2})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Add node
        ctx.beginPath()
        ctx.arc(endX, endY, nodeSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + characteristics.brightness * 0.3})`
        ctx.fill()
      }
    }
  }
} 