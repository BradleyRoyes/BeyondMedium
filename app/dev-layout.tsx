"use client"

import "@/styles/globals.css"
import { Space_Grotesk } from "next/font/google"
import type React from "react"
import FormDiagnostics from "./components/FormDiagnostics"
import { useState } from "react"

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
})

export default function DevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showDiagnostics, setShowDiagnostics] = useState(true)
  
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        {children}
        {showDiagnostics && <FormDiagnostics />}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'BeyondMedium | Development Mode',
  description: 'Development mode with diagnostics enabled',
}; 