"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OpArt } from "./OpArt"
import { HoverButton } from "./HoverButton"

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

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  // Animation variants for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-28">
      {/* OpArt background */}
      <div className="absolute inset-0 z-0">
        <OpArt 
          variant="moiré"
          intensity={1.0}
          speed={0.6}
          colorScheme="mint"
          className="w-full h-full opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>
      </div>
      
      {/* Secondary layer for depth */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-soft-light">
        <OpArt 
          variant="waves"
          intensity={0.8}
          speed={0.4}
          colorScheme="peach"
          className="w-full h-full"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 1.2 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 font-extralight gradient-text text-4xl sm:text-5xl tracking-wider">Connect With Us</h2>
          <p className="mb-10 text-gray-400 font-light">
            Be among the first to experience our sensory integration space in Berlin in 2025.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-md backdrop-blur-lg bg-zinc-900/30 p-10 rounded-lg border border-white/5 shadow-2xl"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-extralight text-white/70 tracking-wider">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          className="font-light bg-zinc-800/40 border-zinc-700/30 focus:border-[#8667a8]/70 transition-all duration-500 placeholder:text-zinc-500/50" 
                        />
                      </FormControl>
                      <FormMessage className="text-[#d76d77]/90" />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-extralight text-white/70 tracking-wider">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          {...field} 
                          className="font-light bg-zinc-800/40 border-zinc-700/30 focus:border-[#8667a8]/70 transition-all duration-500 placeholder:text-zinc-500/50" 
                        />
                      </FormControl>
                      <FormMessage className="text-[#d76d77]/90" />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-extralight text-white/70 tracking-wider">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I'm interested in..." 
                          className="min-h-[140px] font-light bg-zinc-800/40 border-zinc-700/30 focus:border-[#8667a8]/70 transition-all duration-500 placeholder:text-zinc-500/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[#d76d77]/90" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <HoverButton type="submit" variant="accent" fullWidth>
                  Join the Waitlist
                </HoverButton>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="mt-6 text-center text-sm font-extralight text-gray-400"
              >
                Or email us directly at{" "}
                <a href="mailto:connect@beyondmedium.com" className="text-white/80 hover:underline hover:text-[#8667a8]/90 transition-colors duration-300">
                  connect@beyondmedium.com
                </a>
              </motion.p>
            </form>
          </Form>
        </motion.div>
      </div>
      
      {/* Interactive shapes - more subtle, pastel colors */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 overflow-hidden">
        <motion.div 
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 bg-[#4c3a78]/80"
          animate={{
            x: [0, 8, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -bottom-10 right-1/3 w-48 h-48 rounded-full opacity-8 bg-[#2a4d4a]/80"
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div 
          className="absolute -bottom-5 right-1/4 w-32 h-32 rounded-full opacity-8 bg-[#554046]/80"
          animate={{
            x: [0, 12, 0],
            y: [0, 4, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
        
        {/* Additional subtle elements */}
        <motion.div 
          className="absolute top-20 left-1/3 w-24 h-24 rounded-full opacity-6 bg-[#38366b]/80"
          animate={{
            x: [0, -10, 0],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </section>
  )
}

