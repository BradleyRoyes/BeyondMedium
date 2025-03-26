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
  style: "neural" | "mycelial" | "hybrid" // Pattern style
}

function analyzeText(text: string): PatternCharacteristics {
  // Default mid-range values
  const characteristics: PatternCharacteristics = {
    density: 0.5,
    complexity: 0.5, 
    connectivity: 0.5,
    brightness: 0.5,
    organicity: 0.5,
    focusPoints: 3,
    style: "hybrid"
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
  
  // Determine pattern style based on text characteristics
  // We'll use consonant/vowel ratio and word length to determine style
  const consonants = (text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length
  const isLongWords = words.some(word => word.length > 8)
  const avgWordLength = words.length ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0
  
  if (consonants > vowels * 1.8 || isLongWords || avgWordLength > 7) {
    // More technical, structured texts get neural patterns
    characteristics.style = "neural"
  } else if (vowels > consonants * 0.8 || text.length < 15) {
    // More flowing, organic texts get mycelial patterns
    characteristics.style = "mycelial"
  } else {
    // Mix of both characteristics
    characteristics.style = "hybrid"
  }
  
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
  
  // Set up drawing styles - line width affected by brightness and style
  const lineWidth = characteristics.style === "neural" 
    ? 1.0 + characteristics.brightness * 0.6
    : 0.6 + characteristics.brightness * 0.8
  
  ctx.lineWidth = lineWidth
  
  const baseOpacity = characteristics.style === "neural"
    ? 0.5 + characteristics.brightness * 0.3 // Neural patterns are more defined
    : 0.3 + characteristics.brightness * 0.4 // Mycelial patterns more ethereal
  
  ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`
  
  // Determine number of nodes based on canvas size, density and style
  const baseNodeCount = Math.floor(Math.min(width, height) / 20)
  const nodeCount = Math.floor(baseNodeCount * (0.7 + characteristics.density * 0.8))
  
  // Create nodes (neurons) with focus points
  const nodes: {x: number, y: number, size: number, isFocal: boolean}[] = []
  
  // First create focus points
  const focusSize = characteristics.style === "neural"
    ? 5 + characteristics.organicity * 4 // Neural focus points are distinct
    : 3 + characteristics.organicity * 7 // Mycelial focus points have more spread
  
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
  const regularNodeSize = characteristics.style === "neural"
    ? 1.5 + characteristics.organicity * 2 // Neural nodes more uniform
    : 0.8 + characteristics.organicity * 4 // Mycelial nodes more varied

  // Distribute nodes differently based on style
  if (characteristics.style === "neural") {
    // Neural networks have more structured node placement
    const gridSize = Math.ceil(Math.sqrt(nodeCount - characteristics.focusPoints))
    const cellWidth = width / gridSize
    const cellHeight = height / gridSize
    
    for (let i = 0; i < nodeCount - characteristics.focusPoints; i++) {
      nodeSeed += 1
      // Place with some structure but allow deviation
      const gridX = i % gridSize
      const gridY = Math.floor(i / gridSize)
      
      const jitter = 0.7 // How much randomness in the grid
      const x = (gridX + 0.5) * cellWidth + (seededRandom(nodeSeed) - 0.5) * cellWidth * jitter
      nodeSeed += 1
      const y = (gridY + 0.5) * cellHeight + (seededRandom(nodeSeed + i) - 0.5) * cellHeight * jitter
      nodeSeed += 1
      
      const size = regularNodeSize + seededRandom(nodeSeed) * 3
      
      nodes.push({ x, y, size, isFocal: false })
    }
  } else {
    // Mycelial patterns have more organic, clustered placement
    // First determine some "growth centers"
    const clusterCount = 2 + Math.floor(seededRandom(seed + 888) * 3)
    const clusters = []
    
    for (let i = 0; i < clusterCount; i++) {
      clusters.push({
        x: seededRandom(seed + i * 100) * width,
        y: seededRandom(seed + i * 200) * height,
        radius: width * (0.2 + seededRandom(seed + i * 300) * 0.3)
      })
    }
    
    for (let i = 0; i < nodeCount - characteristics.focusPoints; i++) {
      nodeSeed += 1
      
      // Decide if this node follows mycelial growth pattern
      const isClusterNode = seededRandom(nodeSeed + i * 50) < 0.7
      
      let x, y
      
      if (isClusterNode) {
        // Choose a random cluster
        const cluster = clusters[Math.floor(seededRandom(nodeSeed) * clusters.length)]
        // Position node within cluster radius, with higher probability near the center
        const angle = seededRandom(nodeSeed + 1) * Math.PI * 2
        const distance = seededRandom(nodeSeed + 2) * seededRandom(nodeSeed + 3) * cluster.radius
        x = cluster.x + Math.cos(angle) * distance
        y = cluster.y + Math.sin(angle) * distance
      } else {
        // Some random nodes throughout
        x = seededRandom(nodeSeed) * width
        y = seededRandom(nodeSeed + i) * height
      }
      
      nodeSeed += 1
      const size = regularNodeSize + seededRandom(nodeSeed) * 3
      
      // Keep nodes within canvas
      x = Math.max(5, Math.min(width - 5, x))
      y = Math.max(5, Math.min(height - 5, y))
      
      nodes.push({ x, y, size, isFocal: false })
    }
  }
  
  // Draw connections between nodes (axons/dendrites)
  let connectionSeed = seed + 1000
  
  // Connection count affected by connectivity and style
  const maxConnections = characteristics.style === "neural" 
    ? 3 + Math.floor(characteristics.connectivity * 4) // Neural networks can be highly connected
    : 1 + Math.floor(characteristics.connectivity * 5) // Mycelial networks branch differently
  
  // Determine maximum connection distance based on style
  const maxDistanceFactor = characteristics.style === "neural" ? 0.8 : 0.4
  const maxDistance = Math.min(width, height) * maxDistanceFactor
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    
    // Focal points have more connections
    const connectionFactor = node.isFocal ? 1.5 : 1
    const connectionCount = 1 + Math.floor(seededRandom(connectionSeed + i) * maxConnections * connectionFactor)
    
    // Neural networks connect differently than mycelial
    if (characteristics.style === "neural") {
      // Neural networks connect more systematically
      for (let j = 0; j < connectionCount; j++) {
        connectionSeed += 1
        
        // Find another node to connect to
        // Neural networks prioritize connections regardless of distance
        const targetPool = node.isFocal ? 
          nodes : 
          nodes.filter(n => seededRandom(connectionSeed + n.x) < 0.7 || n.isFocal)
        
        if (targetPool.length === 0) continue
        
        // For neural style, we may connect to more distant nodes
        const targetIndex = Math.floor(seededRandom(connectionSeed) * targetPool.length)
        const target = targetPool[targetIndex]
        
        if (target === node) continue // Skip self-connections
        
        // Draw with neural-style opacity
        const opacity = (0.2 + characteristics.brightness * 0.4) * 
                        (0.7 + seededRandom(connectionSeed * j) * 0.3)
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        
        // Neural networks have more direct connections with less variation
        const connectionImportance = (node.isFocal || target.isFocal) ? 1.3 : 1
        ctx.lineWidth = lineWidth * (0.8 + seededRandom(connectionSeed + 3) * 0.4) * connectionImportance
        
        // Start the path from the current node
        ctx.moveTo(node.x, node.y)
        
        // Create a curved connection path with control points
        // Neural patterns have less curve variance
        const curveFactor = 0.1 + characteristics.organicity * 0.4
        
        const controlX1 = node.x + (target.x - node.x) * (0.3 + seededRandom(connectionSeed + 1) * 0.2)
        const controlY1 = node.y + (target.y - node.y) * (0.3 + seededRandom(connectionSeed + 2) * 0.2)
        
        const controlX2 = node.x + (target.x - node.x) * (0.6 + seededRandom(connectionSeed + 3) * 0.2)
        const controlY2 = node.y + (target.y - node.y) * (0.6 + seededRandom(connectionSeed + 4) * 0.2)
        
        // Add less deviation for neural networks
        const deviation = Math.min(width, height) * 0.08 * curveFactor
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
    } else {
      // Mycelial networks connect based on proximity
      for (let j = 0; j < connectionCount; j++) {
        connectionSeed += 1
        
        // Find nearby nodes to connect to
        const nearbyNodes = nodes.filter(other => {
          if (other === node) return false
          
          // Calculate distance
          const dx = other.x - node.x
          const dy = other.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Mycelial networks connect to nearby nodes, with occasional longer connections
          return distance < maxDistance * (seededRandom(connectionSeed + other.x) < 0.2 ? 1.5 : 0.7)
        })
        
        if (nearbyNodes.length === 0) continue
        
        // Prefer closer nodes for mycelial patterns
        const sortedNodes = nearbyNodes.sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.x - node.x, 2) + Math.pow(a.y - node.y, 2))
          const distB = Math.sqrt(Math.pow(b.x - node.x, 2) + Math.pow(b.y - node.y, 2))
          // Add some randomness to sorting
          return distA - distB + (seededRandom(connectionSeed + a.x + b.y) - 0.5) * maxDistance * 0.2
        })
        
        // Connect to a nearby node
        const targetIndex = Math.min(
          Math.floor(seededRandom(connectionSeed) * 3), // Prefer closest nodes
          sortedNodes.length - 1
        )
        const target = sortedNodes[targetIndex]
        
        // Draw with mycelial-style opacity - more ethereal
        const opacity = (0.15 + characteristics.brightness * 0.3) * 
                        (0.6 + seededRandom(connectionSeed * j) * 0.4)
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        
        // Mycelial connections have more variation in width
        ctx.lineWidth = lineWidth * (0.4 + seededRandom(connectionSeed + 3) * 0.8)
        
        // Start the path from the current node
        ctx.moveTo(node.x, node.y)
        
        // Create a curved connection path with more organic curves
        // Mycelial patterns have high curve variance
        const curveFactor = 0.3 + characteristics.organicity * 0.7
        
        // Calculate distance between nodes
        const dx = target.x - node.x
        const dy = target.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Create more pronounced curves for shorter connections
        const curveIntensity = Math.min(1.5, 20 / distance)
        
        // Mycelial connections have more pronounced curves
        const controlX1 = node.x + (target.x - node.x) * 0.3 + (seededRandom(connectionSeed + 1) - 0.5) * distance * 0.5 * curveIntensity
        const controlY1 = node.y + (target.y - node.y) * 0.3 + (seededRandom(connectionSeed + 2) - 0.5) * distance * 0.5 * curveIntensity
        
        const controlX2 = node.x + (target.x - node.x) * 0.6 + (seededRandom(connectionSeed + 3) - 0.5) * distance * 0.5 * curveIntensity
        const controlY2 = node.y + (target.y - node.y) * 0.6 + (seededRandom(connectionSeed + 4) - 0.5) * distance * 0.5 * curveIntensity
        
        // Draw the curved path
        ctx.bezierCurveTo(
          controlX1, controlY1,
          controlX2, controlY2,
          target.x, target.y
        )
        
        ctx.stroke()
      }
    }
  }
  
  // Draw nodes (neuron bodies)
  for (const node of nodes) {
    // Neural and mycelial nodes look different
    const isNeural = characteristics.style === "neural"
    
    // Draw a subtle glow for all nodes, stronger for focal points
    const glowSize = node.isFocal 
      ? node.size * (isNeural ? 3 : 4.5) 
      : node.size * (isNeural ? 2 : 3)
    
    const glowOpacity = node.isFocal 
      ? (isNeural ? 0.4 : 0.3) + characteristics.brightness * 0.3
      : (isNeural ? 0.3 : 0.2) + characteristics.brightness * 0.3
    
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
    
    // Draw the node itself - neural nodes are more defined
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
    const nodeOpacity = node.isFocal 
      ? (isNeural ? 0.8 : 0.7) + characteristics.brightness * 0.2
      : (isNeural ? 0.6 : 0.5) + characteristics.brightness * 0.3
    ctx.fillStyle = `rgba(255, 255, 255, ${nodeOpacity})`
    ctx.fill()
    
    // For neural style, add a small inner highlight
    if (isNeural && node.size > 2) {
      ctx.beginPath()
      ctx.arc(
        node.x - node.size * 0.2, 
        node.y - node.size * 0.2, 
        node.size * 0.4, 
        0, Math.PI * 2
      )
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + characteristics.brightness * 0.4})`
      ctx.fill()
    }
  }
  
  // Add branches based on style and complexity
  const branchProbability = characteristics.style === "neural" 
    ? 0.3 * characteristics.complexity // Neural networks have fewer branches
    : 0.5 * characteristics.complexity // Mycelial networks have more branches
  
  const branchCount = characteristics.style === "neural"
    ? 1 + Math.floor(characteristics.complexity * 3)
    : 2 + Math.floor(characteristics.complexity * 5)
  
  ctx.lineWidth = characteristics.style === "neural"
    ? 0.7 + characteristics.complexity * 0.3
    : 0.4 + characteristics.complexity * 0.4
  
  let branchSeed = seed + 2000
  
  for (let i = 0; i < nodes.length; i++) {
    // Skip nodes that don't branch
    if (seededRandom(branchSeed + i) > branchProbability && !nodes[i].isFocal) continue
    
    const node = nodes[i]
    
    // Focal points have more branches
    const nodeBranchCount = node.isFocal 
      ? characteristics.style === "neural" ? branchCount + 1 : branchCount + 3
      : Math.max(1, Math.floor(seededRandom(branchSeed) * branchCount))
    
    for (let j = 0; j < nodeBranchCount; j++) {
      branchSeed += 1
      
      // Vary opacity based on style
      const opacity = characteristics.style === "neural"
        ? (0.25 + characteristics.brightness * 0.4) * (0.7 + seededRandom(branchSeed * j) * 0.3)
        : (0.15 + characteristics.brightness * 0.3) * (0.5 + seededRandom(branchSeed * j) * 0.5)
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      
      // Start at the node
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      
      // Branch length affected by style and complexity
      const branchLength = characteristics.style === "neural"
        ? 30 + characteristics.complexity * 50 + seededRandom(branchSeed) * 30 // Shorter for neural
        : 40 + characteristics.complexity * 80 + seededRandom(branchSeed) * 40 // Longer for mycelial
      
      // Calculate end point
      const angle = seededRandom(branchSeed + 1) * Math.PI * 2
      const endX = node.x + Math.cos(angle) * branchLength
      const endY = node.y + Math.sin(angle) * branchLength
      
      // Branch curvature affected by style and organicity
      const curveFactor = characteristics.style === "neural"
        ? 0.2 + characteristics.organicity * 0.5 // Less curve for neural
        : 0.4 + characteristics.organicity * 0.8 // More curve for mycelial
      
      // Draw a curved branch
      const cp1x = node.x + Math.cos(angle + seededRandom(branchSeed + 2) * curveFactor) * branchLength * 0.3
      const cp1y = node.y + Math.sin(angle + seededRandom(branchSeed + 3) * curveFactor) * branchLength * 0.3
      
      const cp2x = node.x + Math.cos(angle + seededRandom(branchSeed + 4) * curveFactor) * branchLength * 0.6
      const cp2y = node.y + Math.sin(angle + seededRandom(branchSeed + 5) * curveFactor) * branchLength * 0.6
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
      ctx.stroke()
      
      // Add sub-branches based on style and complexity
      if (seededRandom(branchSeed + 8) < (characteristics.style === "neural" ? 0.4 : 0.7) * characteristics.complexity) {
        const subBranchLength = branchLength * (0.2 + characteristics.complexity * 0.4)
        
        // Neural patterns have more uniform branching angles
        const branchAngleVariance = characteristics.style === "neural" ? 0.3 : 0.7
        const subAngle = angle + (seededRandom(branchSeed + 9) - 0.5) * Math.PI * branchAngleVariance
        
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
        
        // For mycelial patterns, sometimes add a third level branch
        if (characteristics.style === "mycelial" && seededRandom(branchSeed + 14) < 0.4 * characteristics.complexity) {
          const tertiaryBranchLength = subBranchLength * 0.6
          const tertiaryAngle = subAngle + (seededRandom(branchSeed + 15) - 0.5) * Math.PI * 0.8
          
          const tertiaryEndX = subEndX + Math.cos(tertiaryAngle) * tertiaryBranchLength
          const tertiaryEndY = subEndY + Math.sin(tertiaryAngle) * tertiaryBranchLength
          
          ctx.beginPath()
          ctx.moveTo(subEndX, subEndY)
          
          const tertiaryCp1x = subEndX + Math.cos(tertiaryAngle + seededRandom(branchSeed + 16) * curveFactor) * tertiaryBranchLength * 0.3
          const tertiaryCp1y = subEndY + Math.sin(tertiaryAngle + seededRandom(branchSeed + 17) * curveFactor) * tertiaryBranchLength * 0.3
          
          const tertiaryCp2x = subEndX + Math.cos(tertiaryAngle + seededRandom(branchSeed + 18) * curveFactor) * tertiaryBranchLength * 0.6
          const tertiaryCp2y = subEndY + Math.sin(tertiaryAngle + seededRandom(branchSeed + 19) * curveFactor) * tertiaryBranchLength * 0.6
          
          ctx.bezierCurveTo(tertiaryCp1x, tertiaryCp1y, tertiaryCp2x, tertiaryCp2y, tertiaryEndX, tertiaryEndY)
          ctx.stroke()
        }
      }
      
      // Add terminal nodes with probability based on style and complexity
      const terminalNodeProbability = characteristics.style === "neural" ? 0.25 : 0.4
      if (seededRandom(branchSeed + 6) < terminalNodeProbability + characteristics.complexity * 0.3) {
        const nodeSize = characteristics.style === "neural" 
          ? 1 + seededRandom(branchSeed + 7) * 1.5
          : 0.8 + seededRandom(branchSeed + 7) * 2
        
        // Add glow
        ctx.beginPath()
        ctx.arc(endX, endY, nodeSize * (characteristics.style === "neural" ? 1.5 : 2.5), 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          endX, endY, nodeSize * 0.5,
          endX, endY, nodeSize * (characteristics.style === "neural" ? 1.5 : 2.5)
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 + characteristics.brightness * 0.2})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Add node
        ctx.beginPath()
        ctx.arc(endX, endY, nodeSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${characteristics.style === "neural" ? 0.6 : 0.4 + characteristics.brightness * 0.3})`
        ctx.fill()
      }
    }
  }
  
  // For hybrid style, blend aspects of both
  if (characteristics.style === "hybrid") {
    // Add some mycelial tendrils emanating from the bottom
    ctx.lineWidth = 0.3 + characteristics.complexity * 0.2
    
    const tendrilCount = 3 + Math.floor(characteristics.complexity * 4)
    let tendrilSeed = seed + 5000
    
    for (let i = 0; i < tendrilCount; i++) {
      tendrilSeed += 1
      
      // Start positions along the bottom edge
      const startX = width * (0.2 + 0.6 * seededRandom(tendrilSeed))
      const startY = height * (0.8 + 0.15 * seededRandom(tendrilSeed + 1))
      
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      
      // Create a tendril path
      const tendrilLength = height * (0.2 + 0.4 * characteristics.complexity)
      const segments = 5 + Math.floor(seededRandom(tendrilSeed + 2) * 5)
      
      let currentX = startX
      let currentY = startY
      
      // Generate an upward growing pattern
      for (let j = 0; j < segments; j++) {
        tendrilSeed += 1
        
        // Each segment curves upward and to the side
        const segmentLength = tendrilLength / segments
        const angle = -Math.PI / 2 + (seededRandom(tendrilSeed + j) - 0.5) * Math.PI * 0.5
        
        const nextX = currentX + Math.cos(angle) * segmentLength
        const nextY = currentY + Math.sin(angle) * segmentLength * (1.2 - j / segments)
        
        const controlX = currentX + (seededRandom(tendrilSeed + 100 + j) - 0.5) * segmentLength * 0.8
        const controlY = (currentY + nextY) / 2
        
        ctx.quadraticCurveTo(controlX, controlY, nextX, nextY)
        
        currentX = nextX
        currentY = nextY
        
        // Add some small branches
        if (j > 0 && seededRandom(tendrilSeed + 200 + j) < 0.6) {
          const branchAngle = angle + (seededRandom(tendrilSeed + 300 + j) - 0.5) * Math.PI
          const branchLength = segmentLength * (0.3 + seededRandom(tendrilSeed + 400 + j) * 0.5)
          
          const branchEndX = currentX + Math.cos(branchAngle) * branchLength
          const branchEndY = currentY + Math.sin(branchAngle) * branchLength
          
          ctx.save()
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + characteristics.brightness * 0.1})`
          ctx.beginPath()
          ctx.moveTo(currentX, currentY)
          ctx.lineTo(branchEndX, branchEndY)
          ctx.stroke()
          ctx.restore()
        }
      }
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + characteristics.brightness * 0.2})`
      ctx.stroke()
    }
  }
} 