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
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#1a1729] py-24">
      {/* OpArt background */}
      <div className="absolute inset-0 z-0">
        <OpArt 
          variant="moiré"
          intensity={1}
          speed={0.6}
          colorScheme="custom"
          customColors={['#2a2642', '#3e3a5c', '#534a73']}
          className="w-full h-full opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1729]/60 via-transparent to-[#1a1729]/80"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 font-light gradient-text">Connect With Us</h2>
          <p className="mb-8 text-[#a79fc2]">
            Be among the first to experience our sensory integration space in Berlin in 2025.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-md backdrop-blur-md bg-[#2b2640]/50 p-8 rounded-lg border border-[#534a73]/20 shadow-xl"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light text-white/80">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          className="font-light bg-[#2a2642]/60 border-[#534a73]/30 focus:border-[#8a7fb2] transition-all duration-300" 
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="font-light text-white/80">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          {...field} 
                          className="font-light bg-[#2a2642]/60 border-[#534a73]/30 focus:border-[#8a7fb2] transition-all duration-300" 
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="font-light text-white/80">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I'm interested in..." 
                          className="min-h-[120px] font-light bg-[#2a2642]/60 border-[#534a73]/30 focus:border-[#8a7fb2] transition-all duration-300" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
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
                className="mt-4 text-center text-sm font-light text-[#a79fc2]"
              >
                Or email us directly at{" "}
                <a href="mailto:connect@beyondmedium.com" className="text-white hover:underline hover:text-[#c0b9de] transition-colors">
                  connect@beyondmedium.com
                </a>
              </motion.p>
            </form>
          </Form>
        </motion.div>
      </div>
      
      {/* Interactive shapes with opacity defined by constants, not random values */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 overflow-hidden">
        <motion.div 
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 bg-[#6f5fa9]"
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -bottom-10 right-1/3 w-48 h-48 rounded-full opacity-10 bg-[#8674bd]"
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div 
          className="absolute -bottom-5 right-1/4 w-32 h-32 rounded-full opacity-10 bg-[#9e90c9]"
          animate={{
            x: [0, 15, 0],
            y: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </div>
    </section>
  )
}

