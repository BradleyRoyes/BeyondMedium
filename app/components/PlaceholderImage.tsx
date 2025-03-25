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
      uniquePattern.current = Math.floor(Math.random() * 8) // Increased to 8 pattern types
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