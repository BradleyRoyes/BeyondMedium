"use client"

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface HoverButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'lavender' | 'mint'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function HoverButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled = false
}: HoverButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Motion values for the 3D effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Smooth springs for the animation
  const springConfig = { damping: 18, stiffness: 120 } // More gentle springs
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  // Transform the x/y values into rotation values (reduced for subtlety)
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-6, 6])
  
  // Shadow effect based on rotation
  const boxShadow = useTransform(
    [rotateX, rotateY],
    ([latestRotateX, latestRotateY]) => {
      const shadowX = latestRotateY * -0.5 // Reduced for subtlety
      const shadowY = latestRotateX * 0.5
      return isHovered && !disabled
        ? `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.15)`
        : '0px 2px 4px rgba(0, 0, 0, 0.1)'
    }
  )

  // Handle the mouse move event to update the x/y motion values
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Normalize the position from -0.5 to 0.5
    const normalizedX = (e.clientX - centerX) / rect.width
    const normalizedY = (e.clientY - centerY) / rect.height
    
    x.set(normalizedX)
    y.set(normalizedY)
  }
  
  // Handle the mouse leave event to reset the x/y motion values
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }
  
  // Base styles
  const baseStyles = "relative overflow-hidden transition-colors duration-300 font-light tracking-wide"
  
  // Updated variant styles with pastel colors
  const variantStyles = {
    primary: !disabled
      ? "bg-gradient-to-br from-[#2d2157]/90 to-[#38366b]/90 text-white/90"
      : "bg-zinc-600/80 text-zinc-300/80",
    secondary: !disabled
      ? "bg-zinc-800/60 hover:bg-zinc-700/60 text-white/80 border border-zinc-700/30"
      : "bg-zinc-600/60 text-zinc-300/80 border border-zinc-700/30",
    accent: !disabled
      ? "bg-gradient-to-r from-[#4c3a78]/90 via-[#554046]/80 to-[#38366b]/90 text-white/90"
      : "bg-zinc-600/80 text-zinc-300/80",
    lavender: !disabled
      ? "bg-gradient-to-r from-[#4c3a78]/80 to-[#8667a8]/70 text-white/85"
      : "bg-zinc-600/80 text-zinc-300/80",
    mint: !disabled
      ? "bg-gradient-to-r from-[#193732]/90 to-[#2a4d4a]/80 text-white/85"
      : "bg-zinc-600/80 text-zinc-300/80",
  }
  
  // Size styles
  const sizeStyles = {
    sm: "py-1.5 px-4 text-sm",
    md: "py-2.5 px-7 text-md",
    lg: "py-3.5 px-9 text-lg",
  }
  
  // Width style
  const widthStyle = fullWidth ? "w-full" : ""
  
  // Complete class name
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`
  
  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: !disabled ? rotateX : 0,
        rotateY: !disabled ? rotateY : 0,
        transformStyle: "preserve-3d",
        boxShadow,
        borderRadius: "4px",
      }}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Subtle glare effect */}
      {!disabled && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10 pointer-events-none"
          style={{
            rotateX: rotateX.get() * -1,
            rotateY: rotateY.get() * -1,
            transformStyle: "preserve-3d",
          }}
        />
      )}
      
      {/* Button content with slight 3D lift */}
      <motion.div
        style={{
          transform: isHovered && !disabled ? "translateZ(1.5px)" : "none", // Reduced for subtlety
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.button>
  )
} 