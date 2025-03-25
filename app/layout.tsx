import "@/styles/globals.css"
import { Space_Grotesk } from "next/font/google"
import type React from "react" // Import React

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: 'BeyondMedium | Sensory Integration Lab',
  description: 'BeyondMedium is a sensory room & integration lab offering innovative tools and immersive experiences for neurodiverse people in Berlin.',
  generator: 'v0.dev'
};
