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

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

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
    console.log(values)
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
            Be among the first to experience our sensory integration space in Berlin in 2025.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-md"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-light">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} className="font-light" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-light">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} className="font-light" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-light">Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="I'm interested in..." className="min-h-[120px] font-light" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-light">
                Join the Waitlist
              </Button>
              <p className="mt-4 text-center text-sm font-light text-gray-400">
                Or email us directly at{" "}
                <a href="mailto:connect@beyondmedium.com" className="text-white hover:underline">
                  connect@beyondmedium.com
                </a>
              </p>
            </form>
          </Form>
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

