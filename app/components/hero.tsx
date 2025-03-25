"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// Simple hook to detect screen size for responsive optimization
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  });
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width < 480,
        isTablet: width >= 480 && width < 768,
        isLaptop: width >= 768 && width < 1200,
        isDesktop: width >= 1200
      });
    };
    
    // Check on mount and when window resizes
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  return screenSize;
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isDiumFading, setIsDiumFading] = useState(false)
  const diumFadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const screenSize = useScreenSize()
  const diumTextRef = useRef<HTMLSpanElement>(null)
  const diumPositionRef = useRef({ x: 0, y: 0, width: 0, height: 0, active: false })
  
  // Background color animation variables - using CSS custom properties for better performance
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  
  // Very subtly changing colors for ultra-smooth transitions
  const colorPairs = [
    // Start with teal/mint range
    { from: 'rgba(5, 20, 20, 0.95)', to: 'rgba(5, 21, 21, 0.95)' },
    { from: 'rgba(5, 21, 21, 0.95)', to: 'rgba(5, 22, 22, 0.95)' },
    { from: 'rgba(5, 22, 22, 0.95)', to: 'rgba(6, 23, 23, 0.95)' },
    { from: 'rgba(6, 23, 23, 0.95)', to: 'rgba(7, 24, 24, 0.95)' },
    { from: 'rgba(7, 24, 24, 0.95)', to: 'rgba(8, 25, 25, 0.95)' }, 
    { from: 'rgba(8, 25, 25, 0.95)', to: 'rgba(9, 27, 27, 0.95)' },
    { from: 'rgba(9, 27, 27, 0.95)', to: 'rgba(10, 29, 29, 0.95)' },
    { from: 'rgba(10, 29, 29, 0.95)', to: 'rgba(10, 30, 30, 0.95)' },
    
    // Transition to blue range
    { from: 'rgba(10, 30, 30, 0.95)', to: 'rgba(11, 28, 32, 0.95)' },
    { from: 'rgba(11, 28, 32, 0.95)', to: 'rgba(12, 26, 33, 0.95)' },
    { from: 'rgba(12, 26, 33, 0.95)', to: 'rgba(13, 24, 34, 0.95)' },
    { from: 'rgba(13, 24, 34, 0.95)', to: 'rgba(14, 22, 35, 0.95)' },
    { from: 'rgba(14, 22, 35, 0.95)', to: 'rgba(15, 20, 36, 0.95)' },
    { from: 'rgba(15, 20, 36, 0.95)', to: 'rgba(16, 16, 37, 0.95)' },
    { from: 'rgba(16, 16, 37, 0.95)', to: 'rgba(18, 10, 38, 0.95)' },
    { from: 'rgba(18, 10, 38, 0.95)', to: 'rgba(20, 5, 40, 0.95)' },
    
    // Dark purple range
    { from: 'rgba(20, 5, 40, 0.95)', to: 'rgba(19, 6, 38, 0.95)' },
    { from: 'rgba(19, 6, 38, 0.95)', to: 'rgba(18, 7, 36, 0.95)' },
    { from: 'rgba(18, 7, 36, 0.95)', to: 'rgba(17, 8, 34, 0.95)' },
    { from: 'rgba(17, 8, 34, 0.95)', to: 'rgba(16, 8, 32, 0.95)' },
    { from: 'rgba(16, 8, 32, 0.95)', to: 'rgba(15, 9, 30, 0.95)' },
    { from: 'rgba(15, 9, 30, 0.95)', to: 'rgba(14, 9, 28, 0.95)' },
    { from: 'rgba(14, 9, 28, 0.95)', to: 'rgba(13, 10, 26, 0.95)' },
    { from: 'rgba(13, 10, 26, 0.95)', to: 'rgba(12, 10, 24, 0.95)' },
    
    // Transition back to blue
    { from: 'rgba(12, 10, 24, 0.95)', to: 'rgba(11, 10, 22, 0.95)' },
    { from: 'rgba(11, 10, 22, 0.95)', to: 'rgba(10, 10, 20, 0.95)' },
    { from: 'rgba(10, 10, 20, 0.95)', to: 'rgba(9, 11, 20, 0.95)' },
    { from: 'rgba(9, 11, 20, 0.95)', to: 'rgba(8, 12, 20, 0.95)' },
    { from: 'rgba(8, 12, 20, 0.95)', to: 'rgba(7, 14, 20, 0.95)' },
    { from: 'rgba(7, 14, 20, 0.95)', to: 'rgba(6, 16, 20, 0.95)' },
    { from: 'rgba(6, 16, 20, 0.95)', to: 'rgba(5, 18, 20, 0.95)' },
    { from: 'rgba(5, 18, 20, 0.95)', to: 'rgba(5, 20, 20, 0.95)' },
  ];
  
  // Effect to update CSS variables when background index changes
  useEffect(() => {
    const { from, to } = colorPairs[backgroundIndex];
    document.documentElement.style.setProperty('--bg-from', from);
    document.documentElement.style.setProperty('--bg-to', to);
  }, [backgroundIndex]);
  
  // Effect to handle initial setup and background color animation
  useEffect(() => {
    // Set initial custom properties on :root - start with mint tint
    document.documentElement.style.setProperty('--bg-from', 'rgba(5, 20, 20, 0.95)');
    document.documentElement.style.setProperty('--bg-to', 'rgba(5, 20, 20, 0.95)');
    
    // Function to advance the gradient to the next state
    const nextGradient = () => {
      setBackgroundIndex(prev => (prev + 1) % colorPairs.length);
    };
    
    // Set up a longer interval to ensure super-smooth transitions
    const transitionInterval = setInterval(nextGradient, 8000);
    
    return () => clearInterval(transitionInterval);
  }, []);

  // Timer for mobile auto-fade effect
  useEffect(() => {
    if (screenSize.isMobile) {
      // On mobile, don't use the fading effect at all
      setIsDiumFading(false);
      
      return () => {};
    }
  }, [screenSize.isMobile]);

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
        // Only activate the gravity effect on desktop
        active: !screenSize.isMobile && isDiumFading
      };
    };
    
    // Initial update and then on resize or scroll
    updateDiumPosition();
    window.addEventListener('resize', updateDiumPosition);
    window.addEventListener('scroll', updateDiumPosition);
    
    // Schedule multiple position updates at staggered intervals for desktop only
    const initialTimeouts: NodeJS.Timeout[] = [];
    if (!screenSize.isMobile) {
      // Position updates only needed for desktop gravity effect
      [50, 100, 300, 500, 1000, 2000].forEach(delay => {
        const timeoutId = setTimeout(updateDiumPosition, delay);
        initialTimeouts.push(timeoutId);
      });
    }
    
    // Update position more frequently on desktop where the effect is used
    const positionInterval = setInterval(updateDiumPosition, 100);
    
    // Also update position when isDiumFading changes (desktop only)
    const diumFadingObserver = () => {
      if (screenSize.isMobile) return; // Skip on mobile
      
      // Update position immediately when fading state changes
      updateDiumPosition();
      
      // Then update again after a short delay to catch any layout shifts
      setTimeout(updateDiumPosition, 50);
      setTimeout(updateDiumPosition, 300);
    };
    
    // Run the observer when the fading state changes
    diumFadingObserver();
    
    return () => {
      window.removeEventListener('resize', updateDiumPosition);
      window.removeEventListener('scroll', updateDiumPosition);
      clearInterval(positionInterval);
      initialTimeouts.forEach(clearTimeout);
    };
  }, [isDiumFading, screenSize]);

  // Add a reference for the center area to create a repulsion zone
  const centerAreaRef = useRef({
    x: 0,
    y: 0,
    radius: 0,
    active: true
  });
  
  // Update center area position and size
  const updateCenterArea = () => {
    if (canvasRef.current) {
      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;
      
      // Center of the canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      
      // Size the repulsion zone based on screen size
      // Make it proportionally larger on smaller screens to ensure full text coverage
      let repulsionFactor;
      if (screenSize.isMobile) {
        repulsionFactor = 0.4; // Larger zone on mobile
      } else if (screenSize.isTablet) {
        repulsionFactor = 0.35; // Slightly smaller on tablets
      } else {
        repulsionFactor = 0.3; // Normal size on desktop
      }
      
      const repulsionRadius = Math.min(canvasWidth, canvasHeight) * repulsionFactor;
      
      centerAreaRef.current = {
        x: centerX,
        y: centerY,
        radius: repulsionRadius,
        active: true
      };
    }
  };
  
  // Update center area when resizing
  useEffect(() => {
    if (!canvasRef.current) return;
    
    updateCenterArea();
    
    const handleResize = () => {
      updateCenterArea();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screenSize.isMobile]);

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Initialize the center area repulsion zone
    updateCenterArea()

    // Scale particle count based on screen size for better performance
    let particleCount, diumParticleCount;
    
    if (screenSize.isMobile) {
      // Very small screens (phones)
      particleCount = 40;
      diumParticleCount = 30;
    } else if (screenSize.isTablet) {
      // Tablet sized screens
      particleCount = 60;
      diumParticleCount = 45;
    } else if (screenSize.isLaptop) {
      // Laptop sized screens
      particleCount = 100;
      diumParticleCount = 80;
    } else {
      // Large desktop screens
      particleCount = 150;
      diumParticleCount = 120;
    }
    
    const mouseRadius = 100 // Area of influence around the mouse
    // Special particles to form "dium" when needed
    const diumParticles: Particle[] = []
    const particles: Particle[] = []
    
    // Track previous frame time for smoother animations
    let lastFrameTime = 0
    
    // Connection cache to reduce flicker
    const connectionCache: {from: number, to: number, opacity: number}[] = []

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
      // Add unique ID for connection stability
      id: number
      // Special property for rare particles that can ignore repulsion
      canIgnoreRepulsion: boolean
      // Timer for occasional special behavior
      specialBehaviorTimer: number
      // Current special behavior state
      isInSpecialState: boolean
      // Type of special behavior (0: none, 1: through center, 2: spiral, 3: zigzag)
      specialBehaviorType: number

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
        // Slower return speed for more gradual movement
        this.returnSpeed = 0.02 + Math.random() * 0.03
        this.angleOffset = Math.random() * Math.PI * 2
        // Add unique ID for stable connection references
        this.id = Math.random() * 100000 | 0
        
        // Only non-dium particles can occasionally ignore repulsion (1% chance)
        this.canIgnoreRepulsion = !isDiumParticle && Math.random() < 0.01
        
        // Initialize special behavior timer with random values
        // This ensures special behaviors occur at different times
        this.specialBehaviorTimer = Math.random() * 1000
        this.isInSpecialState = false
        this.specialBehaviorType = 0
      }

      update(mouseX: number, mouseY: number, isHovering: boolean, diumPosition: { x: number, y: number, width: number, height: number, active: boolean }) {
        // Update phase for oscillation effects
        this.phase += this.phaseSpeed
        
        // Update special behavior timer
        if (this.canIgnoreRepulsion) {
          this.specialBehaviorTimer -= 1
          
          // Reset timer and possibly trigger special behavior
          if (this.specialBehaviorTimer <= 0) {
            // Reset timer (occur approximately every 1000-3000 frames)
            this.specialBehaviorTimer = 1000 + Math.random() * 2000
            
            // 20% chance to trigger special behavior when timer expires
            if (Math.random() < 0.2) {
              this.isInSpecialState = true
              // Choose a random special behavior type
              this.specialBehaviorType = Math.floor(Math.random() * 3) + 1
              // Special state lasts between 100-300 frames
              setTimeout(() => {
                this.isInSpecialState = false
                this.specialBehaviorType = 0
              }, 2000 + Math.random() * 3000)
            }
          }
        }
        
        // Check distance from center area for repulsion
        const centerArea = centerAreaRef.current;
        const dxFromCenter = this.x - centerArea.x;
        const dyFromCenter = this.y - centerArea.y;
        const distanceFromCenter = Math.sqrt(dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter);
        
        // Handle special behavior for particles that can ignore repulsion
        if (this.isInSpecialState && this.canIgnoreRepulsion) {
          // Temporarily increase size and opacity for these special particles
          this.size = this.baseSize * (1.5 + Math.sin(this.phase) * 0.5)
          this.opacity = Math.min(0.9, this.baseOpacity * 2)
          
          // Different special behaviors
          switch (this.specialBehaviorType) {
            case 1: // Travel through center
              // Calculate angle to center
              const angleToCenter = Math.atan2(centerArea.y - this.y, centerArea.x - this.x)
              // Move directly through center
              this.speedX = Math.cos(angleToCenter) * 1.0
              this.speedY = Math.sin(angleToCenter) * 1.0
              break
              
            case 2: // Spiral around center
              // Create spiral motion
              const spiralAngle = this.phase * 2
              const spiralRadius = Math.max(5, distanceFromCenter * 0.8)
              this.x = centerArea.x + Math.cos(spiralAngle) * spiralRadius
              this.y = centerArea.y + Math.sin(spiralAngle) * spiralRadius
              return // Skip normal movement
              
            case 3: // Zigzag through
              // Create zigzag motion through center
              const zigzagFactor = Math.sin(this.phase * 5) * 20
              const zigzagAngle = Math.atan2(centerArea.y - this.y, centerArea.x - this.x)
              const perpAngle = zigzagAngle + Math.PI/2
              this.speedX = Math.cos(zigzagAngle) * 1.0 + Math.cos(perpAngle) * zigzagFactor * 0.05
              this.speedY = Math.sin(zigzagAngle) * 1.0 + Math.sin(perpAngle) * zigzagFactor * 0.05
              break
          }
          
          // Normal movement with updated speeds
        this.x += this.speedX
        this.y += this.speedY

          // Screen wrapping
          if (this.x > canvas.width) this.x = 0
          if (this.x < 0) this.x = canvas.width
          if (this.y > canvas.height) this.y = 0
          if (this.y < 0) this.y = canvas.height
          
          return // Skip the rest of update logic during special state
        }
        
        // Apply repulsion from center area - with stronger effect on mobile
        if (distanceFromCenter < centerArea.radius && !this.isInSpecialState) {
          // Calculate repulsion force - stronger near the center and on mobile
          const repulsionForce = (centerArea.radius - distanceFromCenter) / centerArea.radius;
          const adjustedForce = screenSize.isMobile ? repulsionForce * 1.3 : repulsionForce;
          
          if (adjustedForce > 0.05) { // Only apply if force is significant
            // Calculate angle from center to particle
            const angle = Math.atan2(dyFromCenter, dxFromCenter);
            
            // Apply repulsion force - stronger on mobile for better avoidance
            const repulsionStrength = screenSize.isMobile ? 2.0 : 1.5;
            const repulsionX = Math.cos(angle) * adjustedForce * repulsionStrength;
            const repulsionY = Math.sin(angle) * adjustedForce * repulsionStrength;
            
            // Move particle away from center
            this.x += repulsionX;
            this.y += repulsionY;
            
            // Adjust velocity more significantly on mobile
            const velocityInfluence = screenSize.isMobile ? 0.15 : 0.1;
            this.speedX = this.speedX * (1 - velocityInfluence) + repulsionX * velocityInfluence;
            this.speedY = this.speedY * (1 - velocityInfluence) + repulsionY * velocityInfluence;
            
            // Additional position adjustment for immediate effect on mobile
            if (screenSize.isMobile && distanceFromCenter < centerArea.radius * 0.7) {
              this.x += repulsionX * 0.5;
              this.y += repulsionY * 0.5;
            }
          }
        }
        
        // Skip dium particle special behavior on mobile completely
        if (screenSize.isMobile && this.isDiumParticle) {
          // Just use normal particle behavior on mobile
          this.x += this.speedX + Math.sin(this.phase) * 0.2
          this.y += this.speedY + Math.cos(this.phase) * 0.2

          // Screen wrapping
          if (this.x > canvas.width) this.x = 0
          if (this.x < 0) this.x = canvas.width
          if (this.y > canvas.height) this.y = 0
          if (this.y < 0) this.y = canvas.height
          
          // Regular size and opacity fluctuations
          const oscillation = Math.sin(this.phase) * 0.2
          this.size = Math.max(0.1, this.baseSize + oscillation)
          this.opacity = this.baseOpacity + Math.sin(this.phase) * 0.05
          
          return // Skip the rest of the update logic
        }
        
        // Special behavior for dium particles when activated (desktop only)
        if (this.isDiumParticle && diumPosition.active) {
          // Desktop behavior: calculate a target position within the "dium" text area
          if (!this.isReturning) {
            // Assign a random position within the dium text area when becoming active
            const spreadX = diumPosition.width / 2
            const spreadY = diumPosition.height / 2
            
            // Create more focused gravitational target positions
            this.targetX = diumPosition.x + (Math.cos(this.angleOffset) * spreadX * 0.8)
            this.targetY = diumPosition.y + (Math.sin(this.angleOffset) * spreadY * 0.8)
            this.isReturning = true
          }
          
          // Move toward the target position with improved tracking
          const dx = this.targetX - this.x
          const dy = this.targetY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 0.5) {
            // Use slower movement for a more gradual effect on desktop
            this.x += dx * this.returnSpeed * 0.8
            this.y += dy * this.returnSpeed * 0.8
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
        
        // Special color for particles in special state
        if (this.isInSpecialState && this.canIgnoreRepulsion) {
          // Use a more noticeable but still elegant color
          let specialHue = 180 + this.specialBehaviorType * 30 // Each behavior type gets slightly different hue
          let specialSaturation = 20 + Math.sin(this.phase * 2) * 10 // Pulsing saturation
          ctx.fillStyle = `hsla(${specialHue + colorShift}, ${specialSaturation}%, 100%, ${this.opacity})`
        } else {
          // Normal color logic
          const colorBase = this.isDiumParticle && this.isReturning ? 190 : 210 // Slightly different color for dium particles
          ctx.fillStyle = `hsla(${colorBase + this.hue + colorShift}, ${this.saturation}%, 100%, ${this.opacity})`
        }
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize regular particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle();
      
      // For mobile, ensure particles start outside the center area
      if (screenSize.isMobile) {
        const centerArea = centerAreaRef.current;
        const distanceToCenter = Math.sqrt(
          Math.pow(particle.x - centerArea.x, 2) + 
          Math.pow(particle.y - centerArea.y, 2)
        );
        
        // If particle is inside the repulsion zone, reposition it
        if (distanceToCenter < centerArea.radius) {
          // Generate a random angle
          const angle = Math.random() * Math.PI * 2;
          // Position just outside the repulsion zone
          const distance = centerArea.radius + Math.random() * 50;
          
          particle.x = centerArea.x + Math.cos(angle) * distance;
          particle.y = centerArea.y + Math.sin(angle) * distance;
        }
      }
      
      particles.push(particle);
    }
    
    // Initialize special particles for dium reformation
    for (let i = 0; i < diumParticleCount; i++) {
      const particle = new Particle(true);
      
      // On mobile, initialize particles away from the center
      if (screenSize.isMobile) {
        const centerArea = centerAreaRef.current;
        
        // Generate a random angle
        const angle = Math.random() * Math.PI * 2;
        // Position outside the repulsion zone
        const distance = centerArea.radius + 20 + Math.random() * 100;
        
        particle.x = centerArea.x + Math.cos(angle) * distance;
        particle.y = centerArea.y + Math.sin(angle) * distance;
      }
      // On desktop: position particles around the dium text for the gravity effect
      else if (diumPositionRef.current.x && diumPositionRef.current.y) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = Math.random() * canvas.width / 4;
        
        particle.x = diumPositionRef.current.x + Math.cos(randomAngle) * randomDistance;
        particle.y = diumPositionRef.current.y + Math.sin(randomAngle) * randomDistance;
      }
      
      diumParticles.push(particle);
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
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        // Get touch position relative to canvas
        const rect = canvas.getBoundingClientRect()
        setMousePosition({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        })
        setIsHovering(true)
      }
    }
    
    const handleTouchEnd = () => {
      setIsHovering(false)
    }
    
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    // Function to draw connections between particles
    function drawConnections(particles: Particle[]) {
      if (!ctx) return
      
      // Limit connections on mobile for performance
      const connectionLimit = screenSize.isMobile ? 3 : 6
      
      // Clear the connection cache periodically but not every frame
      // This helps maintain some consistency while still allowing for updates
      if (Date.now() % 30 === 0) {
        connectionCache.length = 0
      }
      
      // For better stability, use a fixed sampling of particles for connections
      // This reduces the flickering effect caused by constantly changing connection patterns
      const sampleSize = Math.min(particles.length, screenSize.isMobile ? 40 : 80)
      const sampledParticles = particles.slice(0, sampleSize)
      
      for (let i = 0; i < sampledParticles.length; i++) {
        const particleA = sampledParticles[i]
        let connectionsCount = 0
        
        for (let j = i + 1; j < sampledParticles.length; j++) {
          // Stop after reaching connection limit for this particle
          if (connectionsCount >= connectionLimit) break
          
          const particleB = sampledParticles[j]
          
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Only draw connections if particles are close enough
          if (distance < particleA.connectionRadius) {
            // Calculate connection opacity based on distance with a more stable formula
            // Using a power function to make changes more gradual
            const opacity = Math.pow((1 - distance / particleA.connectionRadius), 1.5) * 0.15
            
            // Check if this connection is in the cache
            const connectionKey = `${particleA.id}-${particleB.id}`
            const cacheIndex = connectionCache.findIndex(c => c.from === particleA.id && c.to === particleB.id)
            
            // If already in cache, use a blend of the cached and new opacity for stability
            let finalOpacity = opacity
            if (cacheIndex >= 0) {
              finalOpacity = connectionCache[cacheIndex].opacity * 0.7 + opacity * 0.3
              connectionCache[cacheIndex].opacity = finalOpacity
            } else {
              // Add to cache
              connectionCache.push({ from: particleA.id, to: particleB.id, opacity: finalOpacity })
            }
            
            // Draw connection line with gradient
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            
            // Create dynamic gradient for connection with smoother transitions
            const gradient = ctx.createLinearGradient(particleA.x, particleA.y, particleB.x, particleB.y)
            gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * particleA.opacity})`)
            gradient.addColorStop(1, `rgba(255, 255, 255, ${finalOpacity * particleB.opacity})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = Math.max(0.1, Math.min(particleA.size, particleB.size) * 0.3)
            ctx.stroke()
            
            connectionsCount++
          }
        }
      }
    }

    function animate(currentTime = 0) {
      if (!ctx) return
      
      // Calculate delta time for smoother animation
      const deltaTime = currentTime - lastFrameTime
      lastFrameTime = currentTime
      
      // Skip the mobile-specific startup frame positioning
      // since we're removing the gravity effect on mobile
      
      // Only clear with a semi-transparent overlay for smoother transitions on connections
      // This creates a trail effect that reduces flickering
      if (screenSize.isMobile) {
        // Clear fully on mobile for performance
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        // Use semi-transparent overlay for smooth trails on desktop
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

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
      
      // Fix flickering by using stable subsets of particles for connections
      // and by reducing the frequency of connection updates on mobile
      
      // Create stable subsets for connection drawing to reduce flickering
      const regularParticlesForConnections = particles.slice(0, screenSize.isMobile ? 30 : 60);
      const diumParticlesForConnections = diumParticles.filter(p => !p.isReturning).slice(0, screenSize.isMobile ? 15 : 30);
      
      // On mobile, skip some frames for connections to improve performance
      const shouldDrawConnections = !screenSize.isMobile || (Date.now() % 3 === 0);
      
      if (shouldDrawConnections) {
        // Draw connections between regular particles
        drawConnections([...regularParticlesForConnections, ...diumParticlesForConnections]);
        
        // Draw additional connections between dium particles when reforming
        if (diumPositionRef.current.active) {
          // Use a stable subset of returning dium particles
          const returningDiumParticles = diumParticles
            .filter(p => p.isReturning)
            .slice(0, screenSize.isMobile ? 30 : 60);
            
          drawConnections(returningDiumParticles);
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvasRef.current) return
      
      // Update canvas dimensions when window resizes
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      
      // Update the center area repulsion zone
      updateCenterArea()
      
      // Also update dium position when resizing
      if (diumTextRef.current) {
        const rect = diumTextRef.current.getBoundingClientRect()
        diumPositionRef.current = {
          ...diumPositionRef.current,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        }
      }
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("touchcancel", handleTouchEnd)
    
    // Add scroll event listener to update particle positions relative to viewport
    // Modify to avoid refreshing on mobile
    window.addEventListener("scroll", () => {
      // Only force redraw on scroll for desktop - skip this for mobile to avoid refresh flicker
      if (!screenSize.isMobile && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      
      // Simply update the center area and dium position on scroll without full redraw
      updateCenterArea();
      if (diumTextRef.current) {
        const rect = diumTextRef.current.getBoundingClientRect();
        diumPositionRef.current = {
          ...diumPositionRef.current,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
    })
    
    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("touchcancel", handleTouchEnd)
      window.removeEventListener("scroll", () => {})
    }
  }, [mousePosition, isHovering, screenSize.isMobile])

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
      {/* Ultra-smooth animated background gradient using CSS variables */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(180deg, var(--bg-from), var(--bg-to))',
          transition: 'background 8s cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}
      />
      
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      {/* Make the center glow extremely subtle - almost imperceptible */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
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
          className="mb-4 font-normal sm:font-normal text-5xl sm:text-5xl md:text-6xl lg:text-7xl"
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
              // Keep opacity at 1 on mobile devices, only use the fading effect on desktop
              opacity: (!screenSize.isMobile && isDiumFading) ? 0.1 : 1,
              transition: 'opacity 1.5s ease-in-out'
            }}
            onMouseEnter={!screenSize.isMobile ? handleDiumMouseEnter : undefined}
            onMouseLeave={!screenSize.isMobile ? handleDiumMouseLeave : undefined}
          >
            dium
          </span>
        </motion.h1>
        
        <motion.p
          className="max-w-[600px] text-xl font-light text-gray-400 sm:text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Sensory Integration Center
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

