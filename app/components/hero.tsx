"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [titleFaded, setTitleFaded] = useState(false)

  // Check if device is mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // For mobile devices, create a subtle pulsing effect on the "dium" part
    if (window.innerWidth < 768) {
      const interval = setInterval(() => {
        setTitleFaded(prev => !prev)
      }, 8000) // Slower pulse every 8 seconds for subtlety
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('resize', checkMobile)
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 150 // Increased particle count for more mystery
    const mouseRadius = 100 // Area of influence around the mouse

    class Particle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      opacity: number
      baseOpacity: number
      originalX: number
      originalY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseSize = Math.random() * 2.5 + 0.1
        this.size = this.baseSize
        this.speedX = Math.random() * 1.5 - 0.75
        this.speedY = Math.random() * 1.5 - 0.75
        this.baseOpacity = Math.random() * 0.5 + 0.1
        this.opacity = this.baseOpacity
        this.originalX = this.x
        this.originalY = this.y
      }

      update(mouseX: number, mouseY: number, isHovering: boolean) {
        // Normal particle movement
        this.x += this.speedX
        this.y += this.speedY

        // Screen wrapping
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
        
        // Update original position for tracking
        this.originalX += this.speedX
        this.originalY += this.speedY
        
        if (this.originalX > canvas.width) this.originalX = 0
        if (this.originalX < 0) this.originalX = canvas.width
        if (this.originalY > canvas.height) this.originalY = 0
        if (this.originalY < 0) this.originalY = canvas.height

        // Mouse interaction if hovering
        if (isHovering) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // If particle is within mouse radius, create interactive effects
          if (distance < mouseRadius) {
            // Calculate force based on distance (closer = stronger)
            const force = (mouseRadius - distance) / mouseRadius
            
            // Push particles away from mouse
            const angleToMouse = Math.atan2(dy, dx)
            const pushX = Math.cos(angleToMouse) * force * 2
            const pushY = Math.sin(angleToMouse) * force * 2
            
            this.x += pushX
            this.y += pushY
            
            // Increase size and opacity when near mouse
            this.size = this.baseSize + (force * 3)
            this.opacity = Math.min(1, this.baseOpacity + force * 0.5)
          } else {
            // Gradually return to normal
            this.size = this.baseSize
            this.opacity = this.baseOpacity
          }
        } else {
          // No mouse interaction, return to normal
          this.size = this.baseSize
          this.opacity = this.baseOpacity
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsHovering(true)
    }
    
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update(mousePosition.x, mousePosition.y, isHovering)
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mousePosition, isHovering])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full enigma-gradient cursor-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full mystery-glow"></div>
      </motion.div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 inset-x-0 mt-8 sm:mt-16"
        >
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60">Unveiling in Berlin • 2025</p>
        </motion.div>
        
        <motion.h1
          className="mb-4 font-light gradient-text relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onMouseEnter={() => !isMobile && setIsTitleHovered(true)}
          onMouseLeave={() => !isMobile && setIsTitleHovered(false)}
        >
          <span>Beyond</span>
          <span>Me</span>
          <span 
            className="inline-block"
            style={{
              opacity: (isTitleHovered || (isMobile && titleFaded)) ? 0 : 1,
              transform: (isTitleHovered || (isMobile && titleFaded)) ? 'scale(0.98) translateY(1px)' : 'scale(1) translateY(0)',
              textShadow: (isTitleHovered || (isMobile && titleFaded)) ? '0 0 15px rgba(255,255,255,0.2)' : 'none',
              transformOrigin: 'left center',
              transition: 'opacity 2.8s cubic-bezier(0.4, 0.0, 0.2, 1), transform 3s cubic-bezier(0.4, 0.0, 0.2, 1), text-shadow 2.5s ease'
            }}
          >
            dium
          </span>
        </motion.h1>
        
        <motion.p
          className="max-w-[600px] text-lg font-light text-gray-400 sm:text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Bespoke Sensory Integration Lab
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="inline-block py-2 px-6 border border-white/20 text-white/90 text-sm tracking-widest uppercase backdrop-blur-sm bg-black/30 rounded-sm">
            Coming Soon
          </span>
        </motion.div>
      </div>
    </div>
  )
}

