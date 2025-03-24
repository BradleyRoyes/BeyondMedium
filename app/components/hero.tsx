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
          intensity={1.5} 
          speed={0.5} 
          colorScheme="custom"
          customColors={['#2a2642', '#3e3a5c', '#5d517a']} 
          className="w-full h-full"
        />
      </div>
      
      {/* Secondary OpArt layer for depth */}
      <div className="absolute inset-0 opacity-20">
        <OpArt 
          variant="circles" 
          intensity={0.8} 
          speed={0.4} 
          colorScheme="custom"
          customColors={['#403a5f', '#695e8a', '#7a6c9c']}
          className="w-full h-full"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
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
          className="mb-4 font-light shimmer-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BeyondMedium
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="glow-effect"
        >
          <span className="inline-block py-2 px-6 border border-white/20 text-white/90 text-sm tracking-widest uppercase backdrop-blur-sm bg-black/30 rounded-sm">
            Coming Soon
          </span>
        </motion.div>
        
        {/* Floating elements */}
        <motion.div 
          className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-violet-400/10 backdrop-blur-md"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute top-32 right-1/4 w-12 h-12 rounded-full bg-indigo-300/10 backdrop-blur-md"
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
      
      {/* Scan line effect - Fixed opacity values to prevent hydration errors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        {Array.from({ length: 50 }).map((_, i) => {
          // Deterministic opacity pattern based on index
          const opacity = 0.2 + (i % 5) * 0.06
          
          return (
            <div 
              key={i} 
              className="h-px w-full bg-white/30" 
              style={{ 
                marginTop: `${(i * 3)}vh`,
                opacity
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

