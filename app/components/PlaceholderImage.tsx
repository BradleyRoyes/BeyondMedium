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
      uniquePattern.current = Math.floor(Math.random() * 12) // Increased to 12 pattern types
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
      case 6: // Geometric Pattern
        drawGeometricPattern(ctx, width, height, seedValue.current)
        break
      case 7: // Sacred Geometry
        drawSacredGeometry(ctx, width, height, seedValue.current)
        break
      case 8: // Impossible Geometry (new)
        drawImpossibleGeometry(ctx, width, height, seedValue.current)
        break
      case 9: // Visual Drift (new)
        drawVisualDrift(ctx, width, height, seedValue.current)
        break
      case 10: // Moiré Pattern (new)
        drawMoirePattern(ctx, width, height, seedValue.current)
        break
      case 11: // Chromatic Flow (new)
        drawChromaticFlow(ctx, width, height, seedValue.current)
        break
    }
    
    // Draw the letter in an abstract way
    drawAbstractLetter(ctx, width, height, title.charAt(0).toUpperCase(), seedValue.current)
    
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
  ctx.globalCompositeOperation = 'multiply'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Create more geometric abstract pattern
  ctx.beginPath()
  
  // Base pattern height
  const patternHeight = height * 0.7
  
  // Add a central line with geometric elements branching off
  ctx.moveTo(halfWidth, centerY - patternHeight/2)
  ctx.lineTo(halfWidth, centerY + patternHeight/2)
  
  // Add geometric branches
  const branchCount = 4 + Math.floor(seededRandom(rndSeed++) * 3)
  
  for (let i = 0; i < branchCount; i++) {
    const yPos = centerY - patternHeight/2 + patternHeight * (i / (branchCount - 1))
    const branchLength = halfWidth * (0.3 + seededRandom(rndSeed++) * 0.4)
    
    // Choose a geometric pattern type
    const patternType = Math.floor(seededRandom(rndSeed++) * 3)
    
    if (patternType === 0) {
      // Angular zigzag branch
      const zigzagCount = 2 + Math.floor(seededRandom(rndSeed++) * 3)
      const segmentLength = branchLength / zigzagCount
      
      ctx.moveTo(halfWidth, yPos)
      
      for (let j = 0; j < zigzagCount; j++) {
        const x = halfWidth - segmentLength * (j + 1)
        const yOffset = (j % 2 === 0) ? 
          segmentLength * 0.5 * seededRandom(rndSeed++) : 
          -segmentLength * 0.5 * seededRandom(rndSeed++);
        
        ctx.lineTo(x, yPos + yOffset)
      }
    } 
    else if (patternType === 1) {
      // Stepped geometric branch
      const stepCount = 3 + Math.floor(seededRandom(rndSeed++) * 2)
      const stepWidth = branchLength / stepCount
      const stepHeight = branchLength * 0.2
      
      ctx.moveTo(halfWidth, yPos)
      
      for (let j = 0; j < stepCount; j++) {
        const x1 = halfWidth - stepWidth * j
        const x2 = halfWidth - stepWidth * (j + 1)
        const y1 = yPos
        const y2 = yPos + (j % 2 === 0 ? stepHeight : -stepHeight)
        
        ctx.lineTo(x1, y2)
        ctx.lineTo(x2, y2)
      }
    } 
    else {
      // Diamond chain
      const diamondCount = 2 + Math.floor(seededRandom(rndSeed++) * 2)
      const diamondWidth = branchLength / diamondCount
      const diamondHeight = diamondWidth * (0.5 + seededRandom(rndSeed++) * 0.5)
      
      ctx.moveTo(halfWidth, yPos)
      
      for (let j = 0; j < diamondCount; j++) {
        const centerX = halfWidth - diamondWidth * (j + 0.5)
        
        ctx.lineTo(centerX + diamondWidth * 0.5, yPos)
        ctx.lineTo(centerX, yPos + diamondHeight * 0.5)
        ctx.lineTo(centerX - diamondWidth * 0.5, yPos)
        ctx.lineTo(centerX, yPos - diamondHeight * 0.5)
        ctx.lineTo(centerX + diamondWidth * 0.5, yPos)
      }
    }
  }
  
  // Fill with slightly higher opacity for better visibility
  ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
  ctx.fill()
  
  // Draw mirror image on right side
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 6. Geometric Pattern - complex geometric shapes and patterns
function drawGeometricPattern(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Draw symmetric geometric pattern
  ctx.beginPath()
  
  // Set base opacity
  ctx.fillStyle = `rgba(255, 255, 255, 0.15)`
  
  // Create a hexagonal grid
  const hexSize = width * 0.12
  const rows = Math.ceil(height / (hexSize * 1.5)) + 1
  const cols = Math.ceil(halfWidth / hexSize) + 1
  
  for (let row = -1; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Staggered grid
      const x = halfWidth - (col * hexSize * 1.5)
      const y = centerY - (height / 2) + (row * hexSize * 1.732) + (col % 2 === 0 ? hexSize * 0.866 : 0)
      
      // Variation based on seed
      const sizeVariation = 0.7 + seededRandom(rndSeed++) * 0.6
      const actualSize = hexSize * sizeVariation
      
      // Various geometric shapes based on position
      const shapeType = (col + row * 3 + Math.floor(seededRandom(rndSeed++) * 2)) % 3
      
      switch(shapeType) {
        case 0: // Hexagon
          drawHexagon(ctx, x, y, actualSize)
          break
        case 1: // Triangle
          drawTriangle(ctx, x, y, actualSize * 1.2)
          break
        case 2: // Circle with rings
          drawCircleWithRings(ctx, x, y, actualSize, rndSeed)
          rndSeed += 2
          break
      }
    }
  }
  
  // Mirror the pattern
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fillStyle = `rgba(255, 255, 255, 0.15)`
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// Helper function to draw a hexagon
function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0))
  
  for (let i = 1; i <= 6; i++) {
    const angle = (Math.PI * 2 / 6) * i
    ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle))
  }
}

// Helper function to draw a triangle
function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const height = size * 0.866
  
  ctx.moveTo(x, y - height / 2)
  ctx.lineTo(x - size / 2, y + height / 2)
  ctx.lineTo(x + size / 2, y + height / 2)
  ctx.lineTo(x, y - height / 2)
}

// Helper function to draw a circle with rings
function drawCircleWithRings(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: number) {
  let rndSeed = seed
  
  // Main circle
  ctx.moveTo(x + size, y)
  ctx.arc(x, y, size, 0, Math.PI * 2)
  
  // Add inner ring
  const innerRingRadius = size * 0.65
  ctx.moveTo(x + innerRingRadius, y)
  ctx.arc(x, y, innerRingRadius, 0, Math.PI * 2, true) // Counterclockwise creates a hole
  
  // Add center dot
  const centerDotRadius = size * 0.15
  ctx.moveTo(x + centerDotRadius, y)
  ctx.arc(x, y, centerDotRadius, 0, Math.PI * 2)
}

// 7. Sacred Geometry - featuring mandalas and sacred geometry patterns
function drawSacredGeometry(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'multiply'
  
  const halfWidth = width / 2
  const centerY = height / 2
  
  let rndSeed = seed;
  
  // Draw mandala-like sacred geometry pattern
  ctx.beginPath()
  
  // Choose number of iterations and petals
  const iterations = 3 + Math.floor(seededRandom(rndSeed++) * 3) // 3-5 iterations
  const mainPetals = 6 + Math.floor(seededRandom(rndSeed++) * 6) * 2 // 6, 8, 10, 12, 14, 16
  
  // Base radius for the mandala
  const maxRadius = Math.min(halfWidth, centerY) * 0.8
  
  // Draw radial lines (spokes)
  for (let i = 0; i < mainPetals; i++) {
    const angle = (Math.PI * 2 / mainPetals) * i
    const endX = halfWidth - maxRadius * Math.cos(angle)
    const endY = centerY + maxRadius * Math.sin(angle)
    
    ctx.moveTo(halfWidth, centerY)
    ctx.lineTo(endX, endY)
  }
  
  // Draw concentric circles
  for (let i = 1; i <= iterations; i++) {
    const radius = maxRadius * (i / iterations)
    ctx.moveTo(halfWidth - radius, centerY)
    ctx.arc(halfWidth, centerY, radius, 0, Math.PI * 2)
  }
  
  // Draw flower of life pattern
  const flowerPetals = mainPetals * 2
  const flowerRadius = maxRadius * 0.7
  
  for (let i = 0; i < flowerPetals; i++) {
    const angle = (Math.PI * 2 / flowerPetals) * i
    const petalRadius = flowerRadius * 0.3
    const distance = flowerRadius * 0.6
    
    const x = halfWidth - distance * Math.cos(angle)
    const y = centerY + distance * Math.sin(angle)
    
    ctx.moveTo(x + petalRadius, y)
    ctx.arc(x, y, petalRadius, 0, Math.PI * 2)
  }
  
  // Add central element
  const centerRadius = maxRadius * 0.15
  ctx.moveTo(halfWidth + centerRadius, centerY)
  ctx.arc(halfWidth, centerY, centerRadius, 0, Math.PI * 2)
  
  // Fill pattern
  ctx.fillStyle = `rgba(255, 255, 255, 0.18)`
  ctx.fill()
  
  // Mirror the pattern (though a mandala is already symmetric)
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.fillStyle = `rgba(255, 255, 255, 0.18)`
  ctx.fill()
  ctx.restore()
  
  ctx.globalCompositeOperation = 'source-over'
}

// 8. Impossible Geometry - inspired by M.C. Escher and impossible objects
function drawImpossibleGeometry(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'multiply';
  
  const centerX = width / 2;
  const centerY = height / 2;
  let rndSeed = seed;
  
  // Size of the impossible shape
  const size = Math.min(width, height) * 0.4;
  
  // Draw the impossible triangle (Penrose triangle)
  ctx.beginPath();
  
  // Calculate points for the impossible triangle
  const points = [];
  
  // Generate the three corner points of the triangle
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 / 3) * i + Math.PI / 6;
    points.push({
      x: centerX + Math.cos(angle) * size,
      y: centerY + Math.sin(angle) * size
    });
  }
  
  // Create the three sides of the impossible triangle
  for (let i = 0; i < 3; i++) {
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % 3];
    
    // Width of the beam
    const beamWidth = size * 0.15;
    
    // Calculate angle for this side
    const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
    
    // Calculate perpendicular offset
    const perpX = Math.sin(angle) * beamWidth;
    const perpY = -Math.cos(angle) * beamWidth;
    
    // Draw the paradoxical connection at corners
    ctx.save();
    ctx.translate(currentPoint.x, currentPoint.y);
    ctx.rotate(angle);
    
    const sideLength = Math.sqrt(
      Math.pow(nextPoint.x - currentPoint.x, 2) + 
      Math.pow(nextPoint.y - currentPoint.y, 2)
    );
    
    // Draw a beam with "impossible" connection
    const gradient = ctx.createLinearGradient(0, -beamWidth, 0, beamWidth);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
    
    ctx.fillStyle = gradient;
    
    // Draw the beam with a notch to create the impossible effect
    ctx.beginPath();
    
    // First part - a simple rectangle
    ctx.rect(0, -beamWidth/2, sideLength * 0.7, beamWidth);
    
    // Create the "impossible" connection effect
    if (i === 0) {
      ctx.rect(sideLength * 0.7, -beamWidth * 0.8, sideLength * 0.3, beamWidth * 1.6);
    } else if (i === 1) {
      ctx.rect(sideLength * 0.7, -beamWidth * 0.5, sideLength * 0.3, beamWidth * 1.3);
    } else {
      ctx.rect(sideLength * 0.7, -beamWidth * 0.3, sideLength * 0.3, beamWidth);
    }
    
    ctx.fill();
    ctx.restore();
  }
  
  // Add some geometric details to enhance the impossible appearance
  const detailCount = 5 + Math.floor(seededRandom(rndSeed++) * 5);
  
  ctx.beginPath();
  for (let i = 0; i < detailCount; i++) {
    const angle = seededRandom(rndSeed++) * Math.PI * 2;
    const distance = size * (0.4 + seededRandom(rndSeed++) * 0.6);
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    const detailSize = size * (0.05 + seededRandom(rndSeed++) * 0.15);
    
    // Random impossible detail
    if (seededRandom(rndSeed++) > 0.5) {
      // Small cube
      drawImpossibleCube(ctx, x, y, detailSize, rndSeed);
      rndSeed += 3;
    } else {
      // Circle with impossible shadow
      ctx.moveTo(x + detailSize, y);
      ctx.arc(x, y, detailSize, 0, Math.PI * 2);
      
      // Add shadow that defies light logic
      const shadowAngle = angle + Math.PI / 2 + seededRandom(rndSeed++) * Math.PI;
      const shadowX = x + Math.cos(shadowAngle) * detailSize * 2;
      const shadowY = y + Math.sin(shadowAngle) * detailSize * 2;
      
      ctx.moveTo(shadowX + detailSize * 0.7, shadowY);
      ctx.arc(shadowX, shadowY, detailSize * 0.7, 0, Math.PI * 2);
    }
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fill();
  
  ctx.globalCompositeOperation = 'source-over';
}

// Helper function to draw a small impossible cube
function drawImpossibleCube(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: number) {
  let rndSeed = seed;
  
  // Draw cube that violates perspective rules
  ctx.save();
  ctx.translate(x, y);
  
  // Rotation to make it look impossible
  const rotate = seededRandom(rndSeed++) * Math.PI;
  ctx.rotate(rotate);
  
  // Front face
  ctx.beginPath();
  ctx.rect(-size/2, -size/2, size, size);
  
  // Top face (perspective should make this a parallelogram, but we'll make it rectangular)
  ctx.moveTo(-size/2, -size/2);
  ctx.lineTo(-size/2 - size/3, -size/2 - size/3);
  ctx.lineTo(size/2 - size/3, -size/2 - size/3);
  ctx.lineTo(size/2, -size/2);
  
  // Right face (another impossible connection)
  ctx.moveTo(size/2, -size/2);
  ctx.lineTo(size/2, size/2);
  ctx.lineTo(size/2 - size/3, size/2 + size/3);
  ctx.lineTo(size/2 - size/3, -size/2 - size/3);
  
  ctx.restore();
}

// 9. Visual Drift - creating the illusion of movement
function drawVisualDrift(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'soft-light';
  
  const centerX = width / 2;
  const centerY = height / 2;
  let rndSeed = seed;
  
  // Choose pattern type
  const patternType = Math.floor(seededRandom(rndSeed++) * 3);
  
  if (patternType === 0) {
    // Concentric circles with phase shift
    const ringCount = 10 + Math.floor(seededRandom(rndSeed++) * 20);
    const maxRadius = Math.min(width, height) * 0.4;
    
    ctx.beginPath();
    
    for (let i = 0; i < ringCount; i++) {
      const radius = maxRadius * (i / ringCount);
      const lineWidth = 3 + seededRandom(rndSeed++) * 2;
      
      // Phase shift creates illusion of movement
      const phase = seededRandom(rndSeed++) * Math.PI * 2;
      
      // Draw a slightly broken circle
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const gapChance = seededRandom(rndSeed++);
        if (gapChance > 0.9) continue; // create random gaps
        
        const modulation = Math.sin(angle * 6 + phase) * lineWidth;
        const actualRadius = radius + modulation;
        
        const x = centerX + Math.cos(angle) * actualRadius;
        const y = centerY + Math.sin(angle) * actualRadius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  else if (patternType === 1) {
    // Radial drift lines
    const lineCount = 30 + Math.floor(seededRandom(rndSeed++) * 50);
    const maxLength = Math.min(width, height) * 0.4;
    
    ctx.beginPath();
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (Math.PI * 2 / lineCount) * i;
      const length = maxLength * (0.3 + seededRandom(rndSeed++) * 0.7);
      
      // Starting point slight offset from center
      const startDistance = maxLength * seededRandom(rndSeed++) * 0.3;
      const startX = centerX + Math.cos(angle) * startDistance;
      const startY = centerY + Math.sin(angle) * startDistance;
      
      // End point
      const endX = centerX + Math.cos(angle) * (startDistance + length);
      const endY = centerY + Math.sin(angle) * (startDistance + length);
      
      // Draw line with varying thickness
      ctx.moveTo(startX, startY);
      
      // Add some curve for visual interest
      const controlOffsetX = Math.sin(angle) * length * 0.1;
      const controlOffsetY = -Math.cos(angle) * length * 0.1;
      
      ctx.quadraticCurveTo(
        startX + (endX - startX) * 0.5 + controlOffsetX,
        startY + (endY - startY) * 0.5 + controlOffsetY,
        endX, endY
      );
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  else {
    // Spiral drift
    const spiralCount = 2 + Math.floor(seededRandom(rndSeed++) * 3);
    const spiralTurns = 3 + Math.floor(seededRandom(rndSeed++) * 5);
    const maxRadius = Math.min(width, height) * 0.4;
    
    for (let j = 0; j < spiralCount; j++) {
      ctx.beginPath();
      
      // Each spiral has an offset start angle
      const startAngle = (Math.PI * 2 / spiralCount) * j;
      
      // Draw each spiral
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        
        // Spiral equations
        const angle = startAngle + spiralTurns * Math.PI * 2 * t;
        const radius = maxRadius * t;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Add some oscillation for visual drift effect
          const oscillationAngle = angle * 7;
          const oscillationAmount = 2 + Math.sin(oscillationAngle) * 5 * t;
          
          const oscillateX = Math.sin(angle + Math.PI/2) * oscillationAmount;
          const oscillateY = -Math.cos(angle + Math.PI/2) * oscillationAmount;
          
          ctx.lineTo(x + oscillateX, y + oscillateY);
        }
      }
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + j * 0.05})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  
  ctx.globalCompositeOperation = 'source-over';
}

// Abstract letter drawing function
function drawAbstractLetter(ctx: CanvasRenderingContext2D, width: number, height: number, letter: string, seed: number) {
  let rndSeed = seed;
  const letterStyle = Math.floor(seededRandom(rndSeed++) * 5); // 5 different letter styles
  
  // Save context state before drawing letter
  ctx.save();
  
  switch(letterStyle) {
    case 0: // Fragmented letter
      drawFragmentedLetter(ctx, width, height, letter, rndSeed);
      break;
    case 1: // Glitch letter
      drawGlitchLetter(ctx, width, height, letter, rndSeed);
      break;
    case 2: // Contour letter
      drawContourLetter(ctx, width, height, letter, rndSeed);
      break;
    case 3: // Liquid letter
      drawLiquidLetter(ctx, width, height, letter, rndSeed);
      break;
    case 4: // Geometric letter
      drawGeometricLetter(ctx, width, height, letter, rndSeed);
      break;
  }
  
  // Restore context state after drawing letter
  ctx.restore();
}

// Draw a letter broken into fragments
function drawFragmentedLetter(ctx: CanvasRenderingContext2D, width: number, height: number, letter: string, seed: number) {
  let rndSeed = seed;
  const fragmentCount = 5 + Math.floor(seededRandom(rndSeed++) * 8);
  
  // Draw base letter into offscreen canvas to sample from
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  
  if (!offCtx) return;
  
  // Draw the letter large on the offscreen canvas
  offCtx.font = 'bold 300px sans-serif';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = 'white';
  offCtx.fillText(letter, width / 2, height / 2);
  
  // Create fragments from random portions of the letter
  ctx.globalCompositeOperation = 'overlay';
  
  for (let i = 0; i < fragmentCount; i++) {
    // Random position within the text bounds
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    const x = centerX + (seededRandom(rndSeed++) - 0.5) * radius;
    const y = centerY + (seededRandom(rndSeed++) - 0.5) * radius;
    
    // Random fragment size
    const fragmentSize = 20 + seededRandom(rndSeed++) * 80;
    
    // Offset the fragment slightly
    const offsetX = (seededRandom(rndSeed++) - 0.5) * 30;
    const offsetY = (seededRandom(rndSeed++) - 0.5) * 30;
    
    // Get the data from the original letter canvas
    try {
      const imgData = offCtx.getImageData(
        x - fragmentSize/2, 
        y - fragmentSize/2, 
        fragmentSize, 
        fragmentSize
      );
      
      // Draw the fragment with slight offset
      ctx.putImageData(imgData, x - fragmentSize/2 + offsetX, y - fragmentSize/2 + offsetY);
    } catch (e) {
      // Skip if fragment is out of bounds
      continue;
    }
  }
  
  // Restore the normal composite operation
  ctx.globalCompositeOperation = 'source-over';
}

// Draw a letter with glitch effect
function drawGlitchLetter(ctx: CanvasRenderingContext2D, width: number, height: number, letter: string, seed: number) {
  let rndSeed = seed;
  const glitchCount = 3 + Math.floor(seededRandom(rndSeed++) * 5);
  
  // Base letter style
  ctx.globalAlpha = 0.2;
  ctx.font = 'bold 300px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw glitch layers
  for (let i = 0; i < glitchCount; i++) {
    // RGB channels with slight offset
    const rgb = [
      seededRandom(rndSeed++) > 0.5 ? 255 : 200,
      seededRandom(rndSeed++) > 0.5 ? 255 : 200,
      seededRandom(rndSeed++) > 0.5 ? 255 : 200
    ];
    
    const offsetX = (seededRandom(rndSeed++) - 0.5) * 15;
    const offsetY = (seededRandom(rndSeed++) - 0.5) * 15;
    
    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.15)`;
    ctx.fillText(letter, width / 2 + offsetX, height / 2 + offsetY);
  }
  
  // Reset alpha
  ctx.globalAlpha = 1.0;
}

// Draw a letter with contour effect
function drawContourLetter(ctx: CanvasRenderingContext2D, width: number, height: number, letter: string, seed: number) {
  let rndSeed = seed;
  
  // Draw base letter into offscreen canvas to sample from
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  
  if (!offCtx) return;
  
  // Draw the letter large on the offscreen canvas
  offCtx.font = 'bold 300px sans-serif';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = 'white';
  offCtx.fillText(letter, width / 2, height / 2);
  
  // Get image data to sample
  let imageData;
  try {
    imageData = offCtx.getImageData(0, 0, width, height);
  } catch (e) {
    return;
  }
  
  // Draw topographic contours
  const contourCount = 5 + Math.floor(seededRandom(rndSeed++) * 5);
  const contourSpacing = 255 / contourCount;
  
  ctx.globalCompositeOperation = 'overlay';
  
  // Draw contours at different alpha levels
  for (let c = 1; c <= contourCount; c++) {
    const threshold = c * contourSpacing;
    
    ctx.beginPath();
    
    // Sample grid
    const gridStep = 5;
    
    for (let y = 0; y < height; y += gridStep) {
      for (let x = 0; x < width; x += gridStep) {
        const index = (y * width + x) * 4;
        const alpha = imageData.data[index + 3];
        
        // Check if this point is near the contour threshold
        if (alpha > threshold - 5 && alpha < threshold + 5) {
          ctx.rect(x, y, 2, 2);
        }
      }
    }
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + c * 0.02})`;
    ctx.fill();
  }
  
  ctx.globalCompositeOperation = 'source-over';
}

// Draw a letter with liquid/fluid effect
function drawLiquidLetter(ctx: CanvasRenderingContext2D, width: number, height: number, letter: string, seed: number) {
  let rndSeed = seed;
  
  // Base letter with drips
  ctx.font = 'bold 300px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  
  // Draw the base letter
  ctx.fillText(letter, width / 2, height / 2);
  
  // Draw liquid droplets and splashes
  const dropletCount = 10 + Math.floor(seededRandom(rndSeed++) * 15);
  
  // Draw base letter into offscreen canvas to sample from
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  
  if (!offCtx) return;
  
  // Draw the letter large on the offscreen canvas
  offCtx.font = 'bold 300px sans-serif';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = 'white';
  offCtx.fillText(letter, width / 2, height / 2);
  
  // Create drips from the letter
  ctx.beginPath();
  
  for (let i = 0; i < dropletCount; i++) {
    // Find a random position within the letter
    const testX = Math.floor(width * 0.3 + seededRandom(rndSeed++) * width * 0.4);
    const testY = Math.floor(height * 0.3 + seededRandom(rndSeed++) * height * 0.4);
    
    // Sample to check if we're in the letter
    let pixelData;
    try {
      pixelData = offCtx.getImageData(testX, testY, 1, 1).data;
    } catch (e) {
      continue;
    }
    
    if (pixelData[3] > 0) {
      // We're in the letter - create a drip
      const dripLength = 20 + seededRandom(rndSeed++) * 80;
      const dripWidth = 3 + seededRandom(rndSeed++) * 10;
      
      // Random direction but biased downward
      const angle = Math.PI / 2 + (seededRandom(rndSeed++) - 0.5) * Math.PI * 0.8;
      
      // Path for the drip
      ctx.moveTo(testX, testY);
      
      const controlX1 = testX + Math.cos(angle) * dripLength * 0.3;
      const controlY1 = testY + Math.sin(angle) * dripLength * 0.3;
      
      const controlX2 = testX + Math.cos(angle) * dripLength * 0.6;
      const controlY2 = testY + Math.sin(angle) * dripLength * 0.6;
      
      const endX = testX + Math.cos(angle) * dripLength;
      const endY = testY + Math.sin(angle) * dripLength;
      
      ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
      
      // Add droplet at the end
      ctx.moveTo(endX + dripWidth * 0.8, endY);
      ctx.arc(endX, endY, dripWidth * 0.8, 0, Math.PI * 2);
    }
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
}

// Draw a letter composed of geometric shapes
function drawGeometricLetter(ctx: CanvasRenderingContext2D, width: number, height: number, letter: string, seed: number) {
  let rndSeed = seed;
  
  // Draw base letter into offscreen canvas to sample from
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  
  if (!offCtx) return;
  
  // Draw the letter large on the offscreen canvas
  offCtx.font = 'bold 300px sans-serif';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = 'white';
  offCtx.fillText(letter, width / 2, height / 2);
  
  // Get image data to sample
  let imageData;
  try {
    imageData = offCtx.getImageData(0, 0, width, height);
  } catch (e) {
    return;
  }
  
  // Geometric shape type
  const shapeType = Math.floor(seededRandom(rndSeed++) * 3);
  
  // Draw geometric shapes arranged to form the letter
  const gridStep = shapeType === 0 ? 12 : (shapeType === 1 ? 15 : 18);
  
  ctx.beginPath();
  
  for (let y = 0; y < height; y += gridStep) {
    for (let x = 0; x < width; x += gridStep) {
      const index = (y * width + x) * 4;
      const alpha = imageData.data[index + 3];
      
      // Only place shapes where the letter is
      if (alpha > 30) {
        const shapeSize = gridStep * (0.5 + seededRandom(rndSeed++) * 0.5);
        
        if (shapeType === 0) {
          // Rectangles
          ctx.rect(
            x - shapeSize/2, 
            y - shapeSize/2, 
            shapeSize, 
            shapeSize
          );
        } 
        else if (shapeType === 1) {
          // Circles
          ctx.moveTo(x + shapeSize/2, y);
          ctx.arc(x, y, shapeSize/2, 0, Math.PI * 2);
        }
        else {
          // Triangles
          const height = shapeSize * 0.866;
          
          ctx.moveTo(x, y - height/2);
          ctx.lineTo(x - shapeSize/2, y + height/2);
          ctx.lineTo(x + shapeSize/2, y + height/2);
          ctx.closePath();
        }
      }
    }
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
}

// 10. Moiré Pattern - interference patterns that create optical illusions
function drawMoirePattern(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'screen';
  
  let rndSeed = seed;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Choose pattern type
  const patternType = Math.floor(seededRandom(rndSeed++) * 3);
  
  if (patternType === 0) {
    // Concentric circles with offset centers
    const circleCount = 20 + Math.floor(seededRandom(rndSeed++) * 30);
    const spacing = Math.min(width, height) * 0.02;
    
    // Draw first set of concentric circles
    ctx.beginPath();
    const offset1X = centerX + (seededRandom(rndSeed++) - 0.5) * spacing * 4;
    const offset1Y = centerY + (seededRandom(rndSeed++) - 0.5) * spacing * 4;
    
    for (let i = 0; i < circleCount; i++) {
      const radius = i * spacing;
      ctx.moveTo(offset1X + radius, offset1Y);
      ctx.arc(offset1X, offset1Y, radius, 0, Math.PI * 2);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw second set of concentric circles with offset
    ctx.beginPath();
    const offset2X = centerX + (seededRandom(rndSeed++) - 0.5) * spacing * 4;
    const offset2Y = centerY + (seededRandom(rndSeed++) - 0.5) * spacing * 4;
    
    for (let i = 0; i < circleCount; i++) {
      const radius = i * spacing;
      ctx.moveTo(offset2X + radius, offset2Y);
      ctx.arc(offset2X, offset2Y, radius, 0, Math.PI * 2);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  }
  else if (patternType === 1) {
    // Linear grid moiré
    const lineCount = 40 + Math.floor(seededRandom(rndSeed++) * 30);
    const spacing = width / lineCount;
    
    // First grid - vertical
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const x = i * spacing;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Second grid - vertical with rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(seededRandom(rndSeed++) * 0.05); // Small rotation angle
    ctx.translate(-centerX, -centerY);
    
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const x = i * spacing;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
    ctx.restore();
    
    // Third grid - horizontal
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const y = i * spacing;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
    
    // Fourth grid - horizontal with rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(seededRandom(rndSeed++) * 0.05); // Small rotation angle
    ctx.translate(-centerX, -centerY);
    
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const y = i * spacing;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
    ctx.restore();
  }
  else {
    // Radial moiré
    const lineCount = 60 + Math.floor(seededRandom(rndSeed++) * 40);
    const maxRadius = Math.min(width, height) * 0.5;
    
    // First radial set
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const angle = (Math.PI * 2 / lineCount) * i;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Second radial set with offset center
    const offset2X = centerX + (seededRandom(rndSeed++) - 0.5) * 20;
    const offset2Y = centerY + (seededRandom(rndSeed++) - 0.5) * 20;
    
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const angle = (Math.PI * 2 / lineCount) * i;
      const x = offset2X + Math.cos(angle) * maxRadius;
      const y = offset2Y + Math.sin(angle) * maxRadius;
      
      ctx.moveTo(offset2X, offset2Y);
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  }
  
  ctx.globalCompositeOperation = 'source-over';
}

// 11. Chromatic Flow - color and pattern flow resembling synesthesia or neural patterns
function drawChromaticFlow(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
  ctx.globalCompositeOperation = 'overlay';
  
  let rndSeed = seed;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Flow pattern type
  const flowType = Math.floor(seededRandom(rndSeed++) * 3);
  
  if (flowType === 0) {
    // Neural network flow
    const nodeCount = 15 + Math.floor(seededRandom(rndSeed++) * 20);
    const connectionChance = 0.3;
    
    // Create nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = seededRandom(rndSeed++) * Math.PI * 2;
      const distance = seededRandom(rndSeed++) * Math.min(width, height) * 0.4;
      
      nodes.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: 3 + seededRandom(rndSeed++) * 8
      });
    }
    
    // Draw connections
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (seededRandom(rndSeed++) < connectionChance) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          
          // Calculate distance
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect relatively close nodes
          if (distance < Math.min(width, height) * 0.25) {
            ctx.moveTo(nodeA.x, nodeA.y);
            
            // Flow curve with control points
            const midX = (nodeA.x + nodeB.x) / 2;
            const midY = (nodeA.y + nodeB.y) / 2;
            
            const controlOffsetX = (seededRandom(rndSeed++) - 0.5) * distance * 0.5;
            const controlOffsetY = (seededRandom(rndSeed++) - 0.5) * distance * 0.5;
            
            ctx.quadraticCurveTo(
              midX + controlOffsetX,
              midY + controlOffsetY,
              nodeB.x, nodeB.y
            );
          }
        }
      }
    }
    
    // Style the connections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw the nodes
    ctx.beginPath();
    for (const node of nodes) {
      ctx.moveTo(node.x + node.size, node.y);
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    }
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
  }
  else if (flowType === 1) {
    // Flowing waves
    const waveCount = 5 + Math.floor(seededRandom(rndSeed++) * 7);
    const amplitude = Math.min(width, height) * 0.1;
    const ySpacing = height / (waveCount + 1);
    
    for (let i = 0; i < waveCount; i++) {
      const y = ySpacing * (i + 1);
      const frequency = 0.01 + seededRandom(rndSeed++) * 0.03;
      const phase = seededRandom(rndSeed++) * Math.PI * 2;
      
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += 3) {
        const waveY = y + Math.sin(x * frequency + phase) * amplitude;
        
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + i * 0.02})`;
      ctx.lineWidth = 2 + i * 0.5;
      ctx.stroke();
    }
  }
  else {
    // Color field flow
    const fieldSize = 20;
    const cols = Math.ceil(width / fieldSize);
    const rows = Math.ceil(height / fieldSize);
    
    // Generate a flow field
    const flowField = [];
    for (let y = 0; y < rows; y++) {
      flowField[y] = [];
      for (let x = 0; x < cols; x++) {
        // Use perlin-like approach for smooth angles
        const nx = x / cols;
        const ny = y / rows;
        
        // Generate angle based on position
        const angle = (
          Math.sin(nx * 5 + seed * 0.1) + 
          Math.cos(ny * 5 + seed * 0.2)
        ) * Math.PI;
        
        flowField[y][x] = angle;
      }
    }
    
    // Draw flow particles
    const particleCount = 100 + Math.floor(seededRandom(rndSeed++) * 150);
    
    for (let i = 0; i < particleCount; i++) {
      // Random starting position
      let x = seededRandom(rndSeed++) * width;
      let y = seededRandom(rndSeed++) * height;
      
      const steps = 10 + Math.floor(seededRandom(rndSeed++) * 20);
      const stepLength = 3 + seededRandom(rndSeed++) * 5;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      // Follow the flow field
      for (let j = 0; j < steps; j++) {
        // Get grid position
        const col = Math.min(cols - 1, Math.max(0, Math.floor(x / fieldSize)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor(y / fieldSize)));
        
        // Get flow angle
        const angle = flowField[row][col];
        
        // Move along the field
        x += Math.cos(angle) * stepLength;
        y += Math.sin(angle) * stepLength;
        
        // Stop if out of bounds
        if (x < 0 || x >= width || y < 0 || y >= height) break;
        
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1 + seededRandom(rndSeed++) * 2;
      ctx.stroke();
    }
  }
  
  ctx.globalCompositeOperation = 'source-over';
} 