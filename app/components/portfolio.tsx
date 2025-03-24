"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderImage } from "./PlaceholderImage"

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "workshops", "listening", "events"]

  const works = [
    {
      id: 1,
      title: "Morning Sensory Workshop",
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
      title: "Deep Listening Session",
      category: "listening",
      year: "Evenings",
    },
    {
      id: 4,
      title: "Sensory Integration Products",
      category: "events",
      year: "Coming Soon",
    },
    {
      id: 5,
      title: "Ambient Sound Bath",
      category: "listening",
      year: "Weekly",
    },
    {
      id: 6,
      title: "Neurodiversity Fair",
      category: "events",
      year: "Monthly",
    },
  ]

  const filteredWorks = works.filter((work) => (selectedCategory === "all" ? true : work.category === selectedCategory))

  // Custom button styling based on category
  const getButtonStyle = (category: string) => {
    if (selectedCategory === category) {
      // These are the active button styles
      switch(category) {
        case 'workshops':
          return 'bg-gradient-to-r from-[#271557] via-[#433399] to-[#8d54b0] text-white border-none shadow-[0_0_15px_rgba(137,84,176,0.25)]';
        case 'listening':
          return 'bg-gradient-to-r from-[#0d1433] via-[#1a2e63] to-[#324f94] text-white border-none shadow-[0_0_15px_rgba(50,79,148,0.25)]';
        case 'events':
          return 'bg-gradient-to-r from-[#1a1542] via-[#2c2b68] to-[#40387b] text-white border-none shadow-[0_0_15px_rgba(64,56,123,0.25)]';
        default: // 'all'
          return 'bg-gradient-to-r from-zinc-100 to-white text-zinc-800 border-none font-medium shadow-[0_0_15px_rgba(255,255,255,0.15)]';
      }
    } else {
      // These are the inactive button styles
      return 'bg-transparent hover:bg-zinc-800/50 text-zinc-300 border border-zinc-700 hover:text-white hover:shadow-[0_0_15px_rgba(137,84,176,0.15)] hover:border-zinc-500 backdrop-blur-sm';
    }
  };

  return (
    <section className="bg-gradient-to-b from-black to-[#0c0a1a] py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-light gradient-text">Our Offerings</h2>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm capitalize px-5 py-2 rounded-md transition-all duration-300 ${getButtonStyle(category)}`}
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
                <Card className="overflow-hidden bg-zinc-900 border border-zinc-800/50">
                  <CardContent className="p-0">
                    <div className="group relative">
                      <PlaceholderImage
                        width={600}
                        height={400}
                        title={work.title}
                        category={work.category}
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
                        <h3 className="text-xl font-light text-white">{work.title}</h3>
                        <p className="mt-2 text-sm text-gray-300">{work.year}</p>
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

