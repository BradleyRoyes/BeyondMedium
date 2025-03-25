"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { PlaceholderImage } from "./PlaceholderImage"

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const images = [
    {
      alt: "Sensory workshop",
      title: "Daily Workshops",
      category: "workshops"
    },
    {
      alt: "Listening session",
      title: "Evening Listening Sessions",
      category: "experiences"
    },
    {
      alt: "Unique tools and toys",
      title: "Unique Tools & Toys",
      category: "toys"
    },
    {
      alt: "Berlin location",
      title: "Coming Soon to Berlin",
      category: ""
    },
  ]

  return (
    <section className="relative py-20">
      <div ref={ref} className="container mx-auto px-4">
        {/* Sensory Room Information */}
        <motion.div 
          className="mb-16 border-l-4 border-zinc-700 pl-6 py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl text-white mb-4 font-light">
            What is a Sensory Room?
          </h2>
          <div className="text-zinc-400 max-w-4xl space-y-3 text-lg">
            <p>• A sensory room is a space built to help you balance your senses.</p>
            <p>• It uses controlled light, sound, and textures to ease sensory overload.</p>
            <p>• It offers relief for anyone who finds everyday stimuli too much.</p>
            <p className="pt-2 text-zinc-500 text-sm">
              <a 
                href="https://www.ot-innovations.com/clinical-practice/sensory-modulation/sensory-rooms-in-mental-health-3/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#a4c2c2] hover:underline"
              >
                Learn more about sensory rooms and their benefits →
              </a>
            </p>
          </div>
        </motion.div>

        <div className="mb-8 md:mb-12">
          <h3 className="text-3xl md:text-4xl text-white mb-2 md:mb-4 font-medium">
            Bringing 20+ Years of Collective Experience
          </h3>
          <p className="mt-4 max-w-lg text-gray-400">
            We're building Berlin's first dedicated space for sensory-inclusive design. Our team combines expertise in cognitive science, design, healthcare and movement practices to create meaningful tools and experiences.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="aspect-[2/3] overflow-hidden">
                <PlaceholderImage
                  width={400}
                  height={600}
                  title={image.title}
                  category={image.category}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="w-full">
                  <h3 className="text-xl font-light text-white">{image.title}</h3>
                  <p className="text-sm text-[#a4c2c2] mt-2 font-light">Coming Soon</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

