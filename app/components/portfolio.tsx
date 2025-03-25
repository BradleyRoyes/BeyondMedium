"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderImage } from "./PlaceholderImage"

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "workshops", "experiences", "toys"]

  const works = [
    {
      id: 1,
      title: "Sensory Design Workshop",
      category: "workshops",
      year: "Daily",
    },
    {
      id: 2,
      title: "Children's Sensory Play",
      category: "workshops",
      year: "Weekends",
    },
    {
      id: 3,
      title: "Immersive Sound Experience",
      category: "experiences",
      year: "Evenings",
    },
    {
      id: 4,
      title: "Sensory Integration Tools",
      category: "toys",
      year: "Coming Soon",
    },
    {
      id: 5,
      title: "Ambient Sound Environment",
      category: "experiences",
      year: "Weekly",
    },
    {
      id: 6,
      title: "Neurodiversity Solutions",
      category: "toys",
      year: "Monthly",
    },
  ]

  const filteredWorks = works.filter((work) => (selectedCategory === "all" ? true : work.category === selectedCategory))

  // Custom button styling based on category - using softer, earthy colors
  const getButtonStyle = (category: string) => {
    if (selectedCategory === category) {
      // These are the active button styles - more subtle, earthy tones
      switch(category) {
        case 'workshops':
          return 'bg-gradient-to-r from-[#a18daa] to-[#c9b6de] text-zinc-800 border-none';
        case 'experiences':
          return 'bg-gradient-to-r from-[#7e9a9a] to-[#a4c2c2] text-zinc-800 border-none';
        case 'toys':
          return 'bg-gradient-to-r from-[#aa9b84] to-[#d4c9bb] text-zinc-800 border-none';
        default: // 'all'
          return 'bg-[#94a897] text-zinc-800 border-none font-medium';
      }
    } else {
      // These are the inactive button styles - more subtle background and hover
      return 'bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-zinc-500';
    }
  };

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-light">Our Offerings</h2>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm capitalize px-5 py-2 rounded-lg transition-all duration-300 ${getButtonStyle(category)}`}
            >
              {category}
            </Button>
          ))}
        </div>
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredWorks.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden bg-zinc-900">
                  <CardContent className="p-0">
                    <div className="group relative">
                      <PlaceholderImage
                        width={600}
                        height={400}
                        title={work.title}
                        category={work.category}
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <h3 className="text-xl font-light text-white">{work.title}</h3>
                        <p className="mt-2 text-sm text-gray-300">{work.year}</p>
                        <p className="mt-3 text-sm text-[#a4c2c2] font-light">Coming Soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

