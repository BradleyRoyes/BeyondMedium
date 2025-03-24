"use client"

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface HoverButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'accent'
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
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  // Transform the x/y values into rotation values
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-8, 8])
  
  // Shadow effect based on rotation
  const boxShadow = useTransform(
    [rotateX, rotateY],
    ([latestRotateX, latestRotateY]) => {
      const shadowX = latestRotateY * -0.5
      const shadowY = latestRotateX * 0.5
      return isHovered && !disabled
        ? `${shadowX}px ${shadowY}px 15px rgba(42, 38, 66, 0.25)`
        : '0px 2px 4px rgba(0, 0, 0, 0.15)'
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
  const baseStyles = "relative overflow-hidden transition-colors font-light"
  
  // Variant styles with more subtle pastel hues
  const variantStyles = {
    primary: !disabled
      ? "bg-gradient-to-br from-[#534a73] to-[#655987] text-white"
      : "bg-zinc-600 text-zinc-300",
    secondary: !disabled
      ? "bg-[#2a2642] hover:bg-[#352f50] text-white border border-[#534a73]/30"
      : "bg-zinc-600 text-zinc-300 border border-zinc-700",
    accent: !disabled
      ? "bg-gradient-to-r from-[#534a73] via-[#6f5fa9] to-[#655987] text-white"
      : "bg-zinc-600 text-zinc-300",
  }
  
  // Size styles
  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-6 text-md",
    lg: "py-3 px-8 text-lg",
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
      {/* Inner glare effect */}
      {!disabled && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-8 pointer-events-none"
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
          transform: isHovered && !disabled ? "translateZ(2px)" : "none",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.button>
  )
} 