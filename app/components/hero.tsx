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
    if (isMobile) {
      // On mobile, don't use the fading effect at all
      setIsDiumFading(false);
      
      return () => {};
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
        // Only activate the gravity effect on desktop
        active: !isMobile && isDiumFading
      };
    };
    
    // Initial update and then on resize or scroll
    updateDiumPosition();
    window.addEventListener('resize', updateDiumPosition);
    window.addEventListener('scroll', updateDiumPosition);
    
    // Schedule multiple position updates at staggered intervals for desktop only
    const initialTimeouts: NodeJS.Timeout[] = [];
    if (!isMobile) {
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
      if (isMobile) return; // Skip on mobile
      
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
  }, [isDiumFading, isMobile]);

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
      // Make it proportionally larger on mobile to ensure full text coverage
      const repulsionRadius = Math.min(canvasWidth, canvasHeight) * (isMobile ? 0.35 : 0.3);
      
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
  }, [isMobile]);

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Initialize the center area repulsion zone
    updateCenterArea()

    const particles: Particle[] = []
    const particleCount = isMobile ? 40 : 75 // Reduced from 80/150 to 40/75
    const mouseRadius = 100 // Area of influence around the mouse
    // Special particles to form "dium" when needed
    const diumParticles: Particle[] = []
    const diumParticleCount = isMobile ? 30 : 60 // Reduced from 60/120 to 30/60
    
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
      
      // Add property to determine if this particle ignores repulsion (rare chance)
      ignoresRepulsion: boolean

      constructor(isDiumParticle = false) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseSize = Math.random() * 2 + 0.1 // Slightly smaller base size
        this.size = this.baseSize
        this.speedX = Math.random() * 0.8 - 0.4 // Reduced from 1.5 to 0.8
        this.speedY = Math.random() * 0.8 - 0.4 // Reduced from 1.5 to 0.8
        this.baseOpacity = Math.random() * 0.4 + 0.1 // Slightly reduced max opacity
        this.opacity = this.baseOpacity
        this.originalX = this.x
        this.originalY = this.y
        this.connectionRadius = Math.random() * 100 + 50 // Reduced from 120 to 100
        this.hue = Math.random() * 60 - 30 // Subtle hue variation
        this.saturation = Math.random() * 10 // Very slight saturation
        this.phase = Math.random() * Math.PI * 2
        this.phaseSpeed = 0.005 + Math.random() * 0.01 // Reduced from 0.01-0.03 to 0.005-0.015
        // For "dium" reformation effect
        this.isDiumParticle = isDiumParticle
        this.targetX = 0
        this.targetY = 0
        this.isReturning = false
        // Slower return speed for more gradual movement
        this.returnSpeed = 0.01 + Math.random() * 0.02 // Reduced from 0.02-0.05 to 0.01-0.03
        this.angleOffset = Math.random() * Math.PI * 2
        // Add unique ID for stable connection references
        this.id = Math.random() * 100000 | 0
        
        // Add property to determine if this particle ignores repulsion (rare chance)
        this.ignoresRepulsion = Math.random() < 0.02 // Reduced from 3% to 2%
      }

      update(mouseX: number, mouseY: number, isHovering: boolean, diumPosition: { x: number, y: number, width: number, height: number, active: boolean }) {
        // Update phase for oscillation effects
        this.phase += this.phaseSpeed
        
        // Check distance from center area for repulsion
        const centerArea = centerAreaRef.current;
        const dxFromCenter = this.x - centerArea.x;
        const dyFromCenter = this.y - centerArea.y;
        const distanceFromCenter = Math.sqrt(dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter);
        
        // Apply repulsion from center area - with stronger effect on mobile
        // Skip repulsion for special particles that ignore the restriction
        if (distanceFromCenter < centerArea.radius && !this.ignoresRepulsion) {
          // Calculate repulsion force - stronger near the center and on mobile
          const repulsionForce = (centerArea.radius - distanceFromCenter) / centerArea.radius;
          const adjustedForce = isMobile ? repulsionForce * 1.3 : repulsionForce;
          
          if (adjustedForce > 0.05) { // Only apply if force is significant
            // Calculate angle from center to particle
            const angle = Math.atan2(dyFromCenter, dxFromCenter);
            
            // Apply repulsion force - stronger on mobile for better avoidance
            const repulsionStrength = isMobile ? 2.0 : 1.5;
            const repulsionX = Math.cos(angle) * adjustedForce * repulsionStrength;
            const repulsionY = Math.sin(angle) * adjustedForce * repulsionStrength;
            
            // Move particle away from center
            this.x += repulsionX;
            this.y += repulsionY;
            
            // Adjust velocity more significantly on mobile
            const velocityInfluence = isMobile ? 0.15 : 0.1;
            this.speedX = this.speedX * (1 - velocityInfluence) + repulsionX * velocityInfluence;
            this.speedY = this.speedY * (1 - velocityInfluence) + repulsionY * velocityInfluence;
            
            // Additional position adjustment for immediate effect on mobile
            if (isMobile && distanceFromCenter < centerArea.radius * 0.7) {
              this.x += repulsionX * 0.5;
              this.y += repulsionY * 0.5;
            }
          }
        } 
        // For particles that ignore repulsion, do something interesting when in the center
        else if (distanceFromCenter < centerArea.radius && this.ignoresRepulsion) {
          // Create orbital or spiral motion near the center
          // Calculate angle and adjust slightly
          const currentAngle = Math.atan2(dyFromCenter, dxFromCenter);
          const orbitSpeed = 0.005 + (0.01 * (1 - distanceFromCenter / centerArea.radius)); // Reduced from 0.01/0.02 to 0.005/0.01
          const orbitAngle = currentAngle + orbitSpeed;
          
          // Maintain similar distance but change angle for orbital effect
          const orbitDistance = distanceFromCenter * 0.998; // Very slight inward spiral
          
          // Set new position based on orbital movement
          this.x = centerArea.x + Math.cos(orbitAngle) * orbitDistance;
          this.y = centerArea.y + Math.sin(orbitAngle) * orbitDistance;
          
          // Increase size and opacity slightly for visual interest
          this.size = this.baseSize * (1.5 + Math.sin(this.phase) * 0.5);
          this.opacity = Math.min(0.8, this.baseOpacity * 2);
          
          // Adjust speed for when it exits the center
          this.speedX = Math.cos(orbitAngle) * 0.3; // Reduced from 0.5 to 0.3
          this.speedY = Math.sin(orbitAngle) * 0.3; // Reduced from 0.5 to 0.3
        }
        
        // Skip dium particle special behavior on mobile completely
        if (isMobile && this.isDiumParticle) {
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
        this.x += this.speedX + Math.sin(this.phase) * 0.1 // Reduced oscillation from 0.2 to 0.1
        this.y += this.speedY + Math.cos(this.phase) * 0.1 // Reduced oscillation from 0.2 to 0.1

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
        
        // Special styling for particles that ignore repulsion
        if (this.ignoresRepulsion) {
          // Create a more vibrant but still subtle appearance
          const specialColorBase = 200 // Slight blue-ish tint
          ctx.fillStyle = `hsla(${specialColorBase + colorShift}, ${20 + Math.sin(this.phase) * 10}%, 100%, ${this.opacity})`
          
          // Draw a slightly larger particle with a subtle glow
          ctx.shadowBlur = 3
          ctx.shadowColor = `hsla(${specialColorBase + colorShift}, 50%, 90%, 0.3)`
          
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 1.2, 0, Math.PI * 2)
          ctx.fill()
          
          // Reset shadow for other particles
          ctx.shadowBlur = 0
        } else {
          // Regular particle styling
          const colorBase = this.isDiumParticle && this.isReturning ? 190 : 210 // Slightly different color for dium particles
          ctx.fillStyle = `hsla(${colorBase + this.hue + colorShift}, ${this.saturation}%, 100%, ${this.opacity})`
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Initialize regular particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle();
      
      // For mobile, ensure particles start outside the center area
      if (isMobile) {
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
      if (isMobile) {
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
      const connectionLimit = isMobile ? 2 : 4 // Reduced from 3/6 to 2/4
      
      // Clear the connection cache periodically but not every frame
      // This helps maintain some consistency while still allowing for updates
      if (Date.now() % 30 === 0) {
        connectionCache.length = 0
      }
      
      // For better stability, use a fixed sampling of particles for connections
      // This reduces the flickering effect caused by constantly changing connection patterns
      const sampleSize = Math.min(particles.length, isMobile ? 25 : 50) // Reduced from 40/80 to 25/50
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
            gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * particleA.opacity * 0.8})`) // Reduced opacity by 20%
            gradient.addColorStop(1, `rgba(255, 255, 255, ${finalOpacity * particleB.opacity * 0.8})`) // Reduced opacity by 20%
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = Math.max(0.1, Math.min(particleA.size, particleB.size) * 0.25) // Reduced from 0.3 to 0.25
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
      if (isMobile) {
        // Clear fully on mobile for performance
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        // Use partial transparency clearing for desktop to reduce flicker
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
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
      const regularParticlesForConnections = particles.slice(0, isMobile ? 20 : 40); // Reduced from 30/60 to 20/40
      const diumParticlesForConnections = diumParticles.filter(p => !p.isReturning).slice(0, isMobile ? 10 : 20); // Reduced from 15/30 to 10/20
      
      // On mobile, skip some frames for connections to improve performance
      const shouldDrawConnections = !isMobile || (Date.now() % 4 === 0); // Increased skip rate from 3 to 4
      
      if (shouldDrawConnections) {
        // Draw connections between regular particles
        drawConnections([...regularParticlesForConnections, ...diumParticlesForConnections]);
        
        // Draw additional connections between dium particles when reforming
        if (diumPositionRef.current.active) {
          // Use a stable subset of returning dium particles
          const returningDiumParticles = diumParticles
            .filter(p => p.isReturning)
            .slice(0, isMobile ? 20 : 40); // Reduced from 30/60 to 20/40
            
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
      if (!isMobile && canvasRef.current) {
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
              opacity: (!isMobile && isDiumFading) ? 0.1 : 1,
              transition: 'opacity 1.5s ease-in-out'
            }}
            onMouseEnter={!isMobile ? handleDiumMouseEnter : undefined}
            onMouseLeave={!isMobile ? handleDiumMouseLeave : undefined}
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

