"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

// Custom styles for form error messages to match the pastel theme
const errorStyles = {
  workshops: 'text-[#c9b6de]',
  experiences: 'text-[#a4c2c2]',
  aids: 'text-[#d4c9bb]',
  default: 'text-[#b5c5b8]'
}

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  // Add form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Animation state for the background pattern
  const [linePatterns, setLinePatterns] = useState<Array<{ 
    x1: number; 
    y1: number; 
    x2: number; 
    y2: number;
    delay: number;
    duration: number;
    opacity: number;
  }>>([])

  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    direction: number;
  }>>([])

  // Track if we're mounted to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate optimized background elements - client-side only
  useEffect(() => {
    if (!isMounted) return;
    
    // Generate fewer, more interesting lines
    const patterns = []
    
    // Create a grid pattern with occasional breaks
    for (let i = 0; i < 15; i++) {
      const xPos = i * 7;
      patterns.push({
        x1: xPos,
        y1: 0,
        x2: xPos + (i % 3 === 0 ? 15 : 0),
        y2: 100,
        delay: i * 0.2,
        duration: 20 + (i % 5) * 8,
        opacity: 0.05 + (i % 3) * 0.03
      });
    }
    
    // Add horizontal connecting lines for a more structured feel
    for (let i = 0; i < 8; i++) {
      const yPos = i * 15;
      patterns.push({
        x1: 0,
        y1: yPos,
        x2: 100,
        y2: yPos + (i % 2 === 0 ? 5 : -5),
        delay: i * 0.3,
        duration: 25 + (i % 4) * 8,
        opacity: 0.06 + (i % 3) * 0.02
      });
    }

    // Add a few diagonal accent lines for visual interest
    for (let i = 0; i < 5; i++) {
      patterns.push({
        x1: i * 25,
        y1: 0,
        x2: (i + 1) * 25,
        y2: 100,
        delay: i * 0.4,
        duration: 30,
        opacity: 0.08
      });
    }
    
    setLinePatterns(patterns);

    // Generate fewer, more interesting floating particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      speed: 0.5 + Math.random() * 1,
      opacity: 0.2 + Math.random() * 0.4,
      direction: Math.random() > 0.5 ? 1 : -1
    }));
    
    setParticles(newParticles);
  }, [isMounted]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    // Simulate an API call with setTimeout
    setTimeout(() => {
      // Log the form values (replace with actual API call in production)
      console.log(values)
      
      // Reset form and show success message
      form.reset()
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <section className="relative overflow-hidden bg-zinc-900 py-20">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 font-light gradient-text">Connect With Us</h2>
          <p className="mb-8 text-gray-400">
            Be the first to experience our Sensory Exploration & Integration Center when we open in Berlin. Sign up for updates on our progress or get in touch if you'd like to collaborate.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-md"
        >
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-zinc-800 p-8 text-center border border-[#a4c2c2]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-[#a4c2c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mb-2 text-xl font-medium text-white">Thank You!</h3>
              <p className="text-zinc-400">
                We've received your message and will be in touch soon.
              </p>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light text-white">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          className="font-light text-white bg-zinc-800 border-zinc-700 focus-visible:ring-[#a4c2c2] placeholder:text-zinc-400" 
                        />
                      </FormControl>
                      <FormMessage className={errorStyles.experiences} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          {...field} 
                          className="font-light text-white bg-zinc-800 border-zinc-700 focus-visible:ring-[#a4c2c2] placeholder:text-zinc-400" 
                        />
                      </FormControl>
                      <FormMessage className={errorStyles.experiences} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light text-white">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I'm interested in..." 
                          className="min-h-[120px] font-light text-white bg-zinc-800 border-zinc-700 focus-visible:ring-[#a4c2c2] placeholder:text-zinc-400" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={errorStyles.experiences} />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full font-light bg-gradient-to-r from-[#7e9a9a] to-[#a4c2c2] text-zinc-800 hover:text-white hover:from-[#7e9a9a] hover:to-[#8aa3a3] border-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : "Join the Waitlist"}
                </Button>
                <p className="mt-4 text-center text-sm font-light text-gray-400">
                  Or email us directly at{" "}
                  <a href="mailto:connect@beyondmedium.com" className="text-white hover:underline">
                    connect@beyondmedium.com
                  </a>
                </p>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[70vh] h-[70vh] rounded-full mystery-glow opacity-20"></div>
        {isMounted && (
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Structured line patterns */}
            {linePatterns.map((line, i) => (
              <motion.line 
                key={`line-${i}`}
                x1={line.x1} 
                y1={line.y1} 
                x2={line.x2} 
                y2={line.y2} 
                stroke="white" 
                strokeWidth="0.15"
                opacity={line.opacity}
                animate={{
                  x1: [line.x1, line.x1 + (Math.sin(i) * 4)],
                  x2: [line.x2, line.x2 + (Math.cos(i) * 4)],
                  opacity: [line.opacity, line.opacity * 1.5, line.opacity]
                }}
                transition={{
                  duration: line.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: line.delay,
                }}
              />
            ))}

            {/* More interesting moving particles */}
            {particles.map(particle => (
              <motion.g key={`particle-${particle.id}`}>
                {/* Main circle */}
                <motion.circle
                  r={particle.size}
                  fill="white"
                  initial={{ cx: particle.x, cy: particle.y, opacity: particle.opacity }}
                  animate={{ 
                    cx: [
                      particle.x, 
                      particle.x + (15 * particle.direction), 
                      particle.x
                    ],
                    cy: [
                      particle.y, 
                      particle.y + (Math.sin(particle.x) * 10), 
                      particle.y
                    ],
                    opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity]
                  }}
                  transition={{
                    duration: 20 / particle.speed,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                />
                
                {/* Occasional particle with a halo effect */}
                {particle.id % 3 === 0 && (
                  <motion.circle
                    r={particle.size * 3}
                    initial={{ 
                      cx: particle.x, 
                      cy: particle.y, 
                      opacity: particle.opacity * 0.3,
                      fill: "transparent",
                      stroke: "white",
                      strokeWidth: 0.05
                    }}
                    animate={{ 
                      cx: [
                        particle.x, 
                        particle.x + (15 * particle.direction), 
                        particle.x
                      ],
                      cy: [
                        particle.y, 
                        particle.y + (Math.sin(particle.x) * 10), 
                        particle.y
                      ],
                      opacity: [particle.opacity * 0.2, particle.opacity * 0.4, particle.opacity * 0.2],
                      r: [particle.size * 3, particle.size * 4, particle.size * 3]
                    }}
                    transition={{
                      duration: 25 / particle.speed,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.g>
            ))}
          </svg>
        )}
      </div>
    </section>
  )
}

