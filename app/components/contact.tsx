"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-black/30 p-8 rounded-lg backdrop-blur-sm border border-zinc-800 shadow-[0_0_35px_rgba(93,63,211,0.15)]">
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
              <Button type="submit" className="w-full font-light bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 hover:from-indigo-800 hover:to-purple-900 hover:shadow-[0_0_15px_rgba(93,63,211,0.3)] transition-all duration-300">
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
      <div className="absolute inset-0">
        {/* Primary background layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#14162c] to-black opacity-80"></div>
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[40vh] h-[40vh] rounded-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 blur-[80px]"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[30vh] h-[30vh] rounded-full bg-gradient-to-r from-indigo-900/20 to-purple-800/20 blur-[80px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Vertical lines */}
            {Array.from({ length: 50 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 2} y1="0" x2={i * 2} y2="100" stroke="white" strokeWidth="0.1" />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 25 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 4} x2="100" y2={i * 4} stroke="white" strokeWidth="0.1" />
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}

