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
      case 0: // Classic Rorschach Inkblot
        drawClassicRorschach(ctx, width, height, seedValue.current)
        break
      case 1: // Bat-like Form
        drawBatlikeForm(ctx, width, height, seedValue.current)
        break
      case 2: // Face/Mask Pattern
        drawFaceMaskPattern(ctx, width, height, seedValue.current)
        break
      case 3: // Anatomical Form
        drawAnatomicalForm(ctx, width, height, seedValue.current)
        break
      case 4: // Animal Silhouette
        drawAnimalSilhouette(ctx, width, height, seedValue.current)
        break
      case 5: // Abstract Rorschach
        drawAbstractRorschach(ctx, width, height, seedValue.current)
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

// 1. Classic Rorschach Inkblot - resembling the first card in the official test
function drawClassicRorschach(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  // Draw only on one half, then mirror
  const halfWidth = width / 2
  
  let rndSeed = seed;
  
  // Create a central form with satellite elements
  ctx.beginPath()
  
  // Main central blob (classic Rorschach card I style)
  const centerY = height * 0.5
  const formHeight = height * 0.6
  
  // Base points
  const points = [
    { x: halfWidth, y: centerY - formHeight * 0.4 },
    { x: halfWidth - halfWidth * 0.3, y: centerY - formHeight * 0.2 },
    { x: halfWidth - halfWidth * 0.4, y: centerY },
    { x: halfWidth - halfWidth * 0.25, y: centerY + formHeight * 0.2 },
    { x: halfWidth, y: centerY + formHeight * 0.4 },
  ]
  
  // Add randomness to points
  const randomizedPoints = points.map(point => ({
    x: point.x + (seededRandom(rndSeed++) - 0.5) * 20,
    y: point.y + (seededRandom(rndSeed++) - 0.5) * 20
  }))
  
  // Draw the main shape
  ctx.moveTo(randomizedPoints[0].x, randomizedPoints[0].y)
  
  // Use bezier curves for smooth, organic shape
  for (let i = 0; i < randomizedPoints.length - 1; i++) {
    const current = randomizedPoints[i]
    const next = randomizedPoints[i+1]
    
    const cp1x = current.x + (next.x - current.x) * 0.5 - (seededRandom(rndSeed++) - 0.5) * 40
    const cp1y = current.y + (seededRandom(rndSeed++) - 0.5) * 30
    const cp2x = next.x - (next.x - current.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 40
    const cp2y = next.y + (seededRandom(rndSeed++) - 0.5) * 30
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
  }
  
  // Add some "satellite" blobs for more complex shape
  for (let i = 0; i < 3; i++) {
    const basePoint = randomizedPoints[Math.floor(seededRandom(rndSeed++) * randomizedPoints.length)]
    const blobSize = 20 + seededRandom(rndSeed++) * 40
    
    const offsetX = (seededRandom(rndSeed++) - 0.3) * blobSize
    const offsetY = (seededRandom(rndSeed++) - 0.5) * blobSize
    
    ctx.moveTo(basePoint.x + offsetX, basePoint.y + offsetY)
    ctx.arc(basePoint.x + offsetX, basePoint.y + offsetY, blobSize, 0, Math.PI * 2)
  }
  
  // Fill with higher contrast than before
  ctx.fillStyle = `rgba(255, 255, 255, 0.15)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 2. Bat-like Form - resembling card V in the official test
function drawBatlikeForm(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Create main bat-like form
  ctx.beginPath()
  
  // Central body
  const bodyWidth = halfWidth * 0.25
  const bodyHeight = height * 0.4
  
  // Start at top of body
  ctx.moveTo(halfWidth, centerY - bodyHeight/2)
  
  // Left wing (complex)
  const wingSpan = halfWidth * 0.8
  const wingHeight = bodyHeight * 1.2
  
  // Wing top curve
  ctx.bezierCurveTo(
    halfWidth - bodyWidth * 0.5, centerY - bodyHeight * 0.6,
    halfWidth - wingSpan * 0.5, centerY - wingHeight * 0.5,
    halfWidth - wingSpan, centerY - wingHeight * 0.3
  )
  
  // Wing middle indentation (bat wing finger effect)
  const fingerCount = 2 + Math.floor(seededRandom(rndSeed++) * 2)
  
  let lastX = halfWidth - wingSpan
  let lastY = centerY - wingHeight * 0.3
  
  for (let i = 0; i < fingerCount; i++) {
    const fingerDepth = (seededRandom(rndSeed++) * 0.15 + 0.05) * wingSpan
    const fingerPos = (i + 1) / (fingerCount + 1)
    
    const indentX = lastX + wingSpan * fingerPos * 0.8
    const indentY = centerY - wingHeight * 0.1 + (seededRandom(rndSeed++) - 0.5) * 20
    
    // Curve out
    ctx.bezierCurveTo(
      lastX + (indentX - lastX) * 0.3, lastY,
      indentX - fingerDepth, indentY - fingerDepth,
      indentX, indentY
    )
    
    lastX = indentX
    lastY = indentY
  }
  
  // Complete wing bottom curve to body
  ctx.bezierCurveTo(
    halfWidth - wingSpan * 0.5, centerY + wingHeight * 0.3,
    halfWidth - bodyWidth * 0.3, centerY + bodyHeight * 0.3,
    halfWidth, centerY + bodyHeight/2
  )
  
  // Fill with higher contrast
  ctx.fillStyle = `rgba(255, 255, 255, 0.18)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 3. Face/Mask Pattern - resembling interpretation of faces in Rorschach tests
function drawFaceMaskPattern(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Draw face/mask outline
  ctx.beginPath()
  
  // Head outline
  const headHeight = height * 0.5
  const headWidth = halfWidth * 0.7
  
  // Oval for face
  ctx.ellipse(
    halfWidth - headWidth * 0.2, 
    centerY, 
    headWidth, 
    headHeight / 2, 
    0, 0, Math.PI * 2
  )
  
  // Add eye-like circular void (negative space)
  const eyeSize = headWidth * 0.3
  const eyeX = halfWidth - headWidth * 0.4
  const eyeY = centerY - headHeight * 0.1
  
  ctx.moveTo(eyeX + eyeSize, eyeY)
  ctx.arc(eyeX, eyeY, eyeSize, 0, Math.PI * 2, true) // counterclockwise creates hole
  
  // Add second eye-like element
  const eye2Size = eyeSize * 0.7
  const eye2X = halfWidth - headWidth * 0.1
  const eye2Y = centerY - headHeight * 0.15
  
  ctx.moveTo(eye2X + eye2Size, eye2Y)
  ctx.arc(eye2X, eye2Y, eye2Size, 0, Math.PI * 2, true)
  
  // Add "mouth" or bottom element
  const mouthWidth = headWidth * 0.5
  const mouthHeight = headHeight * 0.2
  const mouthY = centerY + headHeight * 0.2
  
  ctx.ellipse(
    halfWidth - headWidth * 0.3, 
    mouthY, 
    mouthWidth, 
    mouthHeight, 
    0, 0, Math.PI * 2
  )
  
  // Fill with higher contrast
  ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 4. Anatomical Form - resembling interpretations of human anatomy in Rorschach tests
function drawAnatomicalForm(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Draw base shape resembling internal anatomy/pelvic structure
  ctx.beginPath()
  
  // Central column (vertebral-like)
  const colWidth = halfWidth * 0.1
  const colHeight = height * 0.6
  
  // Start at top
  ctx.moveTo(halfWidth, centerY - colHeight/2)
  ctx.lineTo(halfWidth, centerY + colHeight/2)
  
  // Add horizontal elements (rib/wing-like)
  const wingCount = 3 + Math.floor(seededRandom(rndSeed++) * 2)
  
  for (let i = 0; i < wingCount; i++) {
    const y = centerY - colHeight/2 + colHeight * (i / (wingCount - 1))
    const wingWidth = halfWidth * (0.3 + seededRandom(rndSeed++) * 0.4)
    const wingHeight = colHeight * 0.15
    
    // Left side wing/rib
    ctx.moveTo(halfWidth, y)
    ctx.bezierCurveTo(
      halfWidth - wingWidth * 0.3, y - wingHeight * 0.2,
      halfWidth - wingWidth * 0.7, y - wingHeight * 0.1,
      halfWidth - wingWidth, y + wingHeight * 0.2
    )
    
    // Back to center
    ctx.bezierCurveTo(
      halfWidth - wingWidth * 0.6, y + wingHeight * 0.5,
      halfWidth - wingWidth * 0.3, y + wingHeight * 0.3,
      halfWidth, y + wingHeight * 0.1
    )
  }
  
  // Add rounded elements at the bottom (basin-like)
  ctx.moveTo(halfWidth, centerY + colHeight/2)
  ctx.bezierCurveTo(
    halfWidth - colWidth * 2, centerY + colHeight/2,
    halfWidth - halfWidth * 0.6, centerY + colHeight/2 + colHeight * 0.2,
    halfWidth - halfWidth * 0.2, centerY + colHeight/2 + colHeight * 0.1
  )
  
  // Fill with higher contrast
  ctx.fillStyle = `rgba(255, 255, 255, 0.17)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 5. Animal Silhouette - resembling animal interpretations in Rorschach tests
function drawAnimalSilhouette(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Draw animal-like form (butterfly, moth, or beetle-like)
  ctx.beginPath()
  
  // Body
  const bodyWidth = halfWidth * 0.1
  const bodyHeight = height * 0.4
  
  // Draw central body
  ctx.ellipse(
    halfWidth - bodyWidth/2, 
    centerY, 
    bodyWidth, 
    bodyHeight/2, 
    0, 0, Math.PI * 2
  )
  
  // Add wing-like projections
  const wingPairs = 2 + Math.floor(seededRandom(rndSeed++) * 2)
  
  for (let i = 0; i < wingPairs; i++) {
    const segmentPos = i / (wingPairs - 1)
    const y = centerY - bodyHeight/2 + bodyHeight * segmentPos
    
    const wingWidth = halfWidth * (0.6 - segmentPos * 0.3)
    const wingHeight = bodyHeight * (0.3 - segmentPos * 0.1)
    
    // Left wing
    ctx.moveTo(halfWidth - bodyWidth/2, y)
    ctx.bezierCurveTo(
      halfWidth - wingWidth * 0.3, y - wingHeight,
      halfWidth - wingWidth * 0.7, y - wingHeight * 0.5,
      halfWidth - wingWidth, y
    )
    
    ctx.bezierCurveTo(
      halfWidth - wingWidth * 0.7, y + wingHeight * 0.5,
      halfWidth - wingWidth * 0.3, y + wingHeight,
      halfWidth - bodyWidth/2, y
    )
  }
  
  // Add antenna or horn-like projections at top
  const antennaLength = bodyHeight * 0.3
  
  ctx.moveTo(halfWidth - bodyWidth/2, centerY - bodyHeight/2)
  ctx.bezierCurveTo(
    halfWidth - bodyWidth, centerY - bodyHeight/2 - antennaLength * 0.5,
    halfWidth - bodyWidth * 2, centerY - bodyHeight/2 - antennaLength * 0.7,
    halfWidth - bodyWidth * 3, centerY - bodyHeight/2 - antennaLength
  )
  
  // Fill with higher contrast
  ctx.fillStyle = `rgba(255, 255, 255, 0.19)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 6. Abstract Rorschach - inspired by later cards in the official test
function drawAbstractRorschach(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Create multiple abstract forms with smaller details
  ctx.beginPath()
  
  // Main central shape
  const mainHeight = height * 0.7
  const mainWidth = halfWidth * 0.8
  
  // Create a complex, multi-node shape
  const nodeCount = 6 + Math.floor(seededRandom(rndSeed++) * 4)
  const nodes = []
  
  // Generate nodes in a rough oval pattern
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2
    
    // Base position on oval
    const x = halfWidth - (Math.cos(angle) * mainWidth * 0.5)
    const y = centerY + (Math.sin(angle) * mainHeight * 0.4)
    
    // Add randomness
    const randomX = x + (seededRandom(rndSeed++) - 0.5) * mainWidth * 0.4
    const randomY = y + (seededRandom(rndSeed++) - 0.5) * mainHeight * 0.2
    
    nodes.push({ x: randomX, y: randomY })
  }
  
  // Connect the nodes with bezier curves for smooth shape
  ctx.moveTo(nodes[0].x, nodes[0].y)
  
  for (let i = 0; i < nodes.length; i++) {
    const current = nodes[i]
    const next = nodes[(i + 1) % nodes.length]
    
    const cp1x = current.x + (next.x - current.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 50
    const cp1y = current.y + (seededRandom(rndSeed++) - 0.5) * 70
    const cp2x = next.x - (next.x - current.x) * 0.5 + (seededRandom(rndSeed++) - 0.5) * 50
    const cp2y = next.y + (seededRandom(rndSeed++) - 0.5) * 70
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
  }
  
  // Add some smaller details/offshoots
  for (let i = 0; i < 4; i++) {
    const baseNode = nodes[Math.floor(seededRandom(rndSeed++) * nodes.length)]
    const detailSize = 10 + seededRandom(rndSeed++) * 30
    
    // Add a smaller shape connected to main form
    ctx.moveTo(baseNode.x, baseNode.y)
    
    const angle = seededRandom(rndSeed++) * Math.PI * 2
    const detailX = baseNode.x + Math.cos(angle) * detailSize * 2
    const detailY = baseNode.y + Math.sin(angle) * detailSize * 2
    
    ctx.bezierCurveTo(
      baseNode.x + Math.cos(angle) * detailSize * 0.5, baseNode.y + Math.sin(angle) * detailSize * 0.5,
      detailX - Math.cos(angle) * detailSize * 0.3, detailY - Math.sin(angle) * detailSize * 0.3,
      detailX, detailY
    )
    
    // Complete the small shape
    ctx.bezierCurveTo(
      detailX + Math.cos(angle + Math.PI/2) * detailSize * 0.5, detailY + Math.sin(angle + Math.PI/2) * detailSize * 0.5,
      detailX - Math.cos(angle - Math.PI/2) * detailSize * 0.5, detailY - Math.sin(angle - Math.PI/2) * detailSize * 0.5,
      baseNode.x, baseNode.y
    )
  }
  
  // Fill with higher contrast
  ctx.fillStyle = `rgba(255, 255, 255, 0.18)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
} 