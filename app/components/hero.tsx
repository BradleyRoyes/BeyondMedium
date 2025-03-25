"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// Simple hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount and when window resizes
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isDiumFading, setIsDiumFading] = useState(false)
  const diumFadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()
  const diumTextRef = useRef<HTMLSpanElement>(null)
  const diumPositionRef = useRef({ x: 0, y: 0, width: 0, height: 0, active: false })

  // Timer for mobile auto-fade effect
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setIsDiumFading(true);
        
        const timer = setTimeout(() => {
          setIsDiumFading(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  // Effect to track the position of the "dium" text element
  useEffect(() => {
    if (!diumTextRef.current) return;

    const updateDiumPosition = () => {
      if (!diumTextRef.current) return;
      
      const rect = diumTextRef.current.getBoundingClientRect();
      diumPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        active: isDiumFading
      };
    };
    
    // Initial update and then on resize
    updateDiumPosition();
    window.addEventListener('resize', updateDiumPosition);
    
    return () => {
      window.removeEventListener('resize', updateDiumPosition);
    };
  }, [isDiumFading]);

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = isMobile ? 80 : 150 // Reduce particle count on mobile for better performance
    const mouseRadius = 100 // Area of influence around the mouse
    // Special particles to form "dium" when needed
    const diumParticles: Particle[] = []
    const diumParticleCount = isMobile ? 60 : 120

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
      connectionRadius: number
      hue: number
      saturation: number
      phase: number
      phaseSpeed: number
      // For "dium" reformation effect
      isDiumParticle: boolean
      targetX: number
      targetY: number
      isReturning: boolean
      returnSpeed: number
      angleOffset: number

      constructor(isDiumParticle = false) {
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
        this.connectionRadius = Math.random() * 120 + 60
        this.hue = Math.random() * 60 - 30 // Subtle hue variation
        this.saturation = Math.random() * 10 // Very slight saturation
        this.phase = Math.random() * Math.PI * 2
        this.phaseSpeed = 0.01 + Math.random() * 0.02
        // For "dium" reformation effect
        this.isDiumParticle = isDiumParticle
        this.targetX = 0
        this.targetY = 0
        this.isReturning = false
        this.returnSpeed = 0.05 + Math.random() * 0.05
        this.angleOffset = Math.random() * Math.PI * 2
      }

      update(mouseX: number, mouseY: number, isHovering: boolean, diumPosition: { x: number, y: number, width: number, height: number, active: boolean }) {
        // Update phase for oscillation effects
        this.phase += this.phaseSpeed
        
        // Special behavior for dium particles when activated
        if (this.isDiumParticle && diumPosition.active) {
          // Calculate a target position within the "dium" text area
          if (!this.isReturning) {
            // Assign a random position within the dium text area when becoming active
            const spreadX = diumPosition.width / 2
            const spreadY = diumPosition.height / 2
            
            this.targetX = diumPosition.x + (Math.cos(this.angleOffset) * spreadX * Math.random())
            this.targetY = diumPosition.y + (Math.sin(this.angleOffset) * spreadY * Math.random())
            this.isReturning = true
          }
          
          // Move toward the target position
          const dx = this.targetX - this.x
          const dy = this.targetY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 1) {
            this.x += dx * this.returnSpeed
            this.y += dy * this.returnSpeed
          }
          
          // Increase size and opacity for dium particles when active
          this.size = Math.max(0.1, this.baseSize * 1.5 + Math.sin(this.phase) * 0.3)
          this.opacity = Math.min(0.9, this.baseOpacity * 2)
          
          return // Skip normal movement when reforming dium
        } else if (this.isDiumParticle && this.isReturning) {
          // Reset returning state when dium is no longer active
          this.isReturning = false
        }
        
        // Normal particle movement with subtle oscillation
        this.x += this.speedX + Math.sin(this.phase) * 0.2
        this.y += this.speedY + Math.cos(this.phase) * 0.2

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
            
            // Create more complex movement patterns
            const angle = Math.atan2(dy, dx) + (Math.sin(this.phase) * 0.5)
            const pushX = Math.cos(angle) * force * 2
            const pushY = Math.sin(angle) * force * 2
            
            this.x += pushX + Math.sin(this.phase + distance * 0.01) * force * 0.5
            this.y += pushY + Math.cos(this.phase + distance * 0.01) * force * 0.5
            
            // Ensure size is always positive by using Math.max with a minimum value
            const oscillation = Math.sin(this.phase) * force * 0.6
            this.size = Math.max(0.1, this.baseSize + (force * 3) + oscillation)
            this.opacity = Math.min(1, this.baseOpacity + force * 0.5)
          } else {
            // Ensure size is always positive by using Math.max with a minimum value
            const oscillation = Math.sin(this.phase) * 0.2
            this.size = Math.max(0.1, this.baseSize + oscillation)
            this.opacity = this.baseOpacity + Math.sin(this.phase) * 0.05
          }
        } else {
          // Ensure size is always positive by using Math.max with a minimum value
          const oscillation = Math.sin(this.phase) * 0.2
          this.size = Math.max(0.1, this.baseSize + oscillation)
          this.opacity = this.baseOpacity + Math.sin(this.phase) * 0.05
        }
      }

      draw() {
        if (!ctx) return
        
        // Safety check: only draw if size is positive
        if (this.size <= 0) return
        
        // Create slight color variations for a sophisticated look
        const colorShift = Math.sin(this.phase) * 10
        const colorBase = this.isDiumParticle && this.isReturning ? 190 : 210 // Slightly different color for dium particles
        ctx.fillStyle = `hsla(${colorBase + this.hue + colorShift}, ${this.saturation}%, 100%, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize regular particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Initialize special particles for dium reformation
    for (let i = 0; i < diumParticleCount; i++) {
      diumParticles.push(new Particle(true));
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

    // Function to draw connections between particles
    function drawConnections(particles: Particle[]) {
      if (!ctx) return
      
      // Limit connections on mobile for performance
      const connectionLimit = isMobile ? 3 : 6
      
      for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i]
        let connectionsCount = 0
        
        for (let j = i + 1; j < particles.length; j++) {
          // Stop after reaching connection limit for this particle
          if (connectionsCount >= connectionLimit) break
          
          const particleB = particles[j]
          
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Only draw connections if particles are close enough
          if (distance < particleA.connectionRadius) {
            // Calculate connection opacity based on distance
            const opacity = (1 - distance / particleA.connectionRadius) * 0.15
            
            // Draw connection line with gradient
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            
            // Create dynamic gradient for connection
            const gradient = ctx.createLinearGradient(particleA.x, particleA.y, particleB.x, particleB.y)
            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * particleA.opacity})`)
            gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * particleB.opacity})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = Math.max(0.1, Math.min(particleA.size, particleB.size) * 0.3)
            ctx.stroke()
            
            connectionsCount++
          }
        }
      }
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw regular particles
      for (const particle of particles) {
        particle.update(mousePosition.x, mousePosition.y, isHovering, diumPositionRef.current)
        particle.draw()
      }
      
      // Update and draw dium particles
      for (const particle of diumParticles) {
        particle.update(mousePosition.x, mousePosition.y, isHovering, diumPositionRef.current)
        particle.draw()
      }
      
      // Draw connections between particles - skip on mobile for better performance
      if (!isMobile || (isMobile && Math.random() > 0.7)) {
        drawConnections([...particles, ...diumParticles.filter(p => !p.isReturning)]);
        
        // Draw additional connections between dium particles when reforming
        if (diumPositionRef.current.active) {
          drawConnections(diumParticles.filter(p => p.isReturning));
        }
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
  }, [mousePosition, isHovering, isMobile])

  const handleDiumMouseEnter = () => {
    if (diumFadeTimerRef.current) {
      clearTimeout(diumFadeTimerRef.current);
    }
    setIsDiumFading(true);
  }

  const handleDiumMouseLeave = () => {
    if (diumFadeTimerRef.current) {
      clearTimeout(diumFadeTimerRef.current);
    }
    
    // Set a delay before fading back in for a ghostly effect
    diumFadeTimerRef.current = setTimeout(() => {
      setIsDiumFading(false);
    }, 3000);
  }

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
          className="mb-4 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="gradient-text">Beyond</span>
          <span className="gradient-text">Me</span>
          <span 
            ref={diumTextRef}
            className="inline-block relative gradient-text"
            style={{
              opacity: isDiumFading ? 0.1 : 1,
              transition: 'opacity 1.5s ease-in-out'
            }}
            onMouseEnter={!isMobile ? handleDiumMouseEnter : undefined}
            onMouseLeave={!isMobile ? handleDiumMouseLeave : undefined}
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
          Sensory Exploration & Integration Center
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

