"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const diumRef = useRef<HTMLSpanElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDiumActive, setIsDiumActive] = useState(false)
  const [particles, setParticles] = useState<JSX.Element[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Ensure dium is visible initially then handle auto-fade for mobile
  useEffect(() => {
    if (!diumRef.current) return
    
    // Make sure dium is visible on first load
    if (isInitialLoad) {
      gsap.to(diumRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1, 
        y: 0,
        duration: 0,
        onComplete: () => setIsInitialLoad(false)
      });
    }

    // Auto-fade for mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // For mobile, create an auto fade animation
      if (mobile && diumRef.current) {
        // Clear any existing animations
        gsap.killTweensOf(diumRef.current)
        
        // Create repeating timeline
        const timeline = gsap.timeline({repeat: -1})
        
        // First make sure it's visible
        timeline.to(diumRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 0.1
        })
        
        // Then stay visible for a moment
        timeline.to(diumRef.current, {
          opacity: 1,
          duration: 3
        })
        
        // Then fade out
        timeline.to(diumRef.current, {
          opacity: 0,
          filter: "blur(8px)",
          scale: 0.8,
          y: 5,
          duration: 2.5,
          ease: "power2.inOut",
        })
        
        // Stay invisible for a moment
        timeline.to(diumRef.current, {
          opacity: 0,
          duration: 2
        })
        
        // Return to visible state
        timeline.to(diumRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 2.5,
          ease: "power2.inOut",
        })
      }
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => {
      window.removeEventListener("resize", checkMobile)
      if (diumRef.current) {
        gsap.killTweensOf(diumRef.current)
      }
    }
  }, [isInitialLoad])

  // Create particles for the void effect
  const createVoidParticles = () => {
    if (!diumRef.current || !titleContainerRef.current) return;

    const diumRect = diumRef.current.getBoundingClientRect();
    const titleRect = titleContainerRef.current.getBoundingClientRect();

    // Calculate relative position within the title container
    const centerX = diumRect.left - titleRect.left + diumRect.width / 2;
    const centerY = diumRect.top - titleRect.top + diumRect.height / 2;
    
    const newParticles: JSX.Element[] = [];
    
    // Create 15 particles
    for (let i = 0; i < 15; i++) {
      const x = centerX + (Math.random() - 0.5) * diumRect.width;
      const y = centerY + (Math.random() - 0.5) * diumRect.height;
      
      // Calculate a random position to animate to (towards the center/void)
      const toX = centerX;
      const toY = centerY;
      
      // Random delay and duration
      const delay = Math.random() * 0.5;
      const duration = 0.5 + Math.random() * 1;
      
      const size = 1 + Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.7;
      
      const particleStyle = {
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')',
      };
      
      // Use GSAP to animate the particle
      const particleRef = React.createRef<HTMLDivElement>();
      
      newParticles.push(
        <div 
          key={`particle-${i}`}
          ref={particleRef}
          className="void-particles absolute"
          style={particleStyle}
        />
      );
      
      // Animate after rendering
      setTimeout(() => {
        if (particleRef.current) {
          gsap.to(particleRef.current, {
            left: toX,
            top: toY,
            opacity: 0,
            scale: 0.5,
            duration: duration,
            delay: delay,
            ease: "power2.in",
            onComplete: () => {
              // Remove this particle when animation completes
              setParticles(prev => prev.filter(p => p.key !== `particle-${i}`));
            }
          });
        }
      }, 10);
    }
    
    setParticles(newParticles);
  };

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

  // Handle the hover effect for the "dium" part
  const handleTitleHover = () => {
    if (isMobile) return;
    if (!diumRef.current) return;
    
    // Set active state for CSS animation
    setIsDiumActive(true);
    
    // Generate void particles
    createVoidParticles();
    
    // Create a timeline to return the dium after a delay
    const timeline = gsap.timeline();
    
    // First fade out with particles (CSS handles this)
    // Then wait 4 seconds
    timeline.to({}, { duration: 4 });
    
    // Then restore visibility by removing the active class
    timeline.to({}, { 
      duration: 0.1,
      onComplete: () => setIsDiumActive(false)
    });
  };

  const handleTitleLeave = () => {
    // Do nothing on leave - we want the full cycle to complete
    // The automatic timeline will handle restoring visibility
  };

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
          ref={titleContainerRef}
          className="mb-4 font-light gradient-text relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onMouseEnter={handleTitleHover}
          onMouseLeave={handleTitleLeave}
        >
          <span className="inline-block">Beyond</span>
          <span className="inline-block">Me</span>
          <span 
            ref={diumRef} 
            className={`void-text ${isDiumActive ? 'void-text-active' : ''}`}
            style={{opacity: 1, filter: 'blur(0px)', transform: 'scale(1) translateY(0)'}}
          >dium</span>
          {/* Void particles container */}
          {particles}
        </motion.h1>
        
        <motion.p
          className="max-w-[600px] text-lg font-light text-gray-400 sm:text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A Bespoke Sensory Integration Lab
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

