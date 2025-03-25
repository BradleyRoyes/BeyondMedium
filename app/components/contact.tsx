"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { subscribeToWaitlist } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
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
      email: "",
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

  // Track if we're mounted to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate the line patterns on component mount - client-side only
  useEffect(() => {
    if (!isMounted) return;
    
    const patterns = []
    // Vertical lines with slight variations
    for (let i = 0; i < 40; i++) {
      patterns.push({
        x1: i * 2.5,
        y1: 0,
        x2: i * 2.5,
        y2: 100,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 20,
        opacity: 0.05 + Math.random() * 0.1
      })
    }
    
    // Add some diagonal lines for more interest
    for (let i = 0; i < 15; i++) {
      const startX = Math.random() * 100
      patterns.push({
        x1: startX,
        y1: 0,
        x2: startX + (Math.random() * 40 - 20),
        y2: 100,
        delay: Math.random() * 5,
        duration: 25 + Math.random() * 15,
        opacity: 0.03 + Math.random() * 0.05
      })
    }
    
    setLinePatterns(patterns)
  }, [isMounted])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    // Call the API to subscribe to the waitlist
    subscribeToWaitlist(values.email)
      .then((response) => {
        console.log('Subscription response:', response);
        
        // Reset form and show success message
        form.reset();
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      })
      .catch((error) => {
        console.error('Error subscribing to waitlist:', error);
        setIsSubmitting(false);
        // Could add error state handling here if needed
      });
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
          <h2 className="mb-4 font-light gradient-text">Join Our Waitlist</h2>
          <p className="mb-8 text-gray-400">
            Be the first to experience our Sensory Exploration & Integration Center when we open in Berlin. Enter your email to receive exclusive updates on our progress.
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
              <h3 className="mb-2 text-xl font-medium text-white">You're on the list!</h3>
              <p className="text-zinc-400">
                Thanks for joining. We'll keep you updated on our progress.
              </p>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-stretch rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 transition-all hover:border-[#a4c2c2]/50 focus-within:border-[#a4c2c2]/70 focus-within:ring-2 focus-within:ring-[#a4c2c2]/20">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1 m-0">
                        <FormControl>
                          <Input 
                            placeholder="Enter your email address" 
                            {...field} 
                            className="flex-1 border-0 h-12 bg-transparent font-light text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400" 
                          />
                        </FormControl>
                        <FormMessage className={errorStyles.experiences} />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="m-0 h-12 rounded-l-none px-5 font-light bg-gradient-to-r from-[#7e9a9a] to-[#a4c2c2] text-zinc-800 hover:text-white hover:from-[#7e9a9a] hover:to-[#8aa3a3] border-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </span>
                    ) : "Join"}
                  </Button>
                </div>
                <p className="mt-4 text-center text-sm font-light text-gray-400">
                  Want to get in touch directly? Email us at{" "}
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
            {linePatterns.map((line, i) => (
              <motion.line 
                key={i} 
                x1={line.x1} 
                y1={line.y1} 
                x2={line.x2} 
                y2={line.y2} 
                stroke="white" 
                strokeWidth="0.1"
                opacity={line.opacity}
                animate={{
                  x1: [line.x1, line.x1 + (Math.random() * 3 - 1.5)],
                  x2: [line.x2, line.x2 + (Math.random() * 5 - 2.5)],
                  opacity: [line.opacity, line.opacity * 1.5, line.opacity]
                }}
                transition={{
                  duration: line.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: line.delay,
                }}
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => {
              // Pre-calculate random values to avoid generating new ones during render
              const radius = 0.3 + (0.5 * (i / 15))
              const cx = 10 + ((100 - 20) * (i / 15))
              const cy = 10 + ((100 - 20) * ((15 - i) / 15))
              const opacity = 0.1 + (0.2 * (i / 15))
              const duration = 20 + (30 * (i / 15))
              const delay = 5 * (i / 15)
              
              return (
                <motion.circle
                  key={`particle-${i}`}
                  r={radius}
                  fill="white"
                  initial={{ 
                    cx: cx, 
                    cy: cy,
                    opacity: opacity
                  }}
                  animate={{ 
                    cx: [cx, cx + 20, cx - 10, cx],
                    cy: [cy, cy -.15, cy + 25, cy],
                    opacity: [opacity, opacity * 2, opacity]
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: delay
                  }}
                />
              )
            })}
          </svg>
        )}
      </div>
    </section>
  )
}

