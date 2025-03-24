"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { OpArt } from "./OpArt"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  // Interactive background ref for handling mouse movement
  const bgRef = useRef<HTMLDivElement>(null)
  
  // Handle mouse movement for interactive background effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return
      
      const rect = bgRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      bgRef.current.style.setProperty('--x', `${x}%`)
      bgRef.current.style.setProperty('--y', `${y}%`)
    }
    
    const bg = bgRef.current
    if (bg) {
      bg.addEventListener('mousemove', handleMouseMove)
    }
    
    return () => {
      if (bg) {
        bg.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden perspective-container" ref={bgRef}>
      {/* Primary OpArt background */}
      <div className="absolute inset-0">
        <OpArt 
          variant="grid" 
          intensity={1.3} 
          speed={0.6} 
          colorScheme="dusk" 
          className="w-full h-full"
        />
      </div>
      
      {/* Secondary OpArt layer for depth */}
      <div className="absolute inset-0 opacity-25 mix-blend-soft-light">
        <OpArt 
          variant="circles" 
          intensity={0.7} 
          speed={0.4} 
          colorScheme="lavender" 
          className="w-full h-full"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      
      {/* Subtle fog effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 opacity-40"></div>
      
      <motion.div 
        className="absolute inset-0 opacity-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2.5 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full mystery-glow"></div>
      </motion.div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-0 inset-x-0 mt-8 sm:mt-16"
        >
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/50">Unveiling in Berlin • 2025</p>
        </motion.div>
        
        <motion.h1
          className="mb-4 font-light shimmer-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          BeyondMedium
        </motion.h1>
        
        <motion.p
          className="max-w-[600px] text-lg font-extralight text-gray-400 sm:text-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          A Bespoke Sensory Integration Lab
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="glow-effect"
        >
          <span className="inline-block py-2 px-8 border border-white/10 text-white/80 text-sm tracking-widest uppercase backdrop-blur-md bg-black/20 rounded-sm">
            Coming Soon
          </span>
        </motion.div>
        
        {/* Floating elements - updated for more mystery */}
        <motion.div 
          className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-[#8667a8]/10 backdrop-blur-md"
          animate={{
            y: [0, -15, 0],
            x: [0, 8, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute top-32 right-1/4 w-12 h-12 rounded-full bg-[#2a4d4a]/10 backdrop-blur-md"
          animate={{
            y: [0, 12, 0],
            x: [0, -7, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 right-1/6 w-8 h-8 rounded-full bg-[#38366b]/10 backdrop-blur-md"
          animate={{
            y: [0, 8, 0],
            x: [0, -4, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      
      {/* Scan line effect - more subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        {Array.from({ length: 60 }).map((_, i) => (
          <div 
            key={i} 
            className="h-px w-full bg-white/30" 
            style={{ 
              marginTop: `${(i * 2.5)}vh`,
              opacity: 0.1 + Math.random() * 0.2
            }}
          />
        ))}
      </div>
    </div>
  )
}

