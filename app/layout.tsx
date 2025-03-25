import "@/styles/globals.css"
import { Space_Grotesk } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "./providers"
import { ThemeToggle } from "./components/ThemeToggle"

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
})

export const metadata = {
  title: 'BeyondMedium | Sensory Exploration & Integration Center',
  description: 'BeyondMedium is a sensory exploration & integration center offering innovative tools and immersive experiences for neurodiverse people in Berlin.',
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
