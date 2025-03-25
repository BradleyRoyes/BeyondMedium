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
        <div className="mb-8 md:mb-12">
          <h3 className="text-3xl md:text-4xl text-white mb-2 md:mb-4 font-medium">
            20 Years of Collective Experience Design
          </h3>
          <p className="text-zinc-400 max-w-2xl text-lg md:text-xl">
            Bringing innovative accessibility tools and our Sensory Room & Integration Lab to Berlin for people of all ages and neurotypes.
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

