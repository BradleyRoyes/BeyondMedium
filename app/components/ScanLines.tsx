"use client"

import { useState } from "react"

interface ScanLinesProps {
  count?: number
  opacity?: number
  className?: string
}

export function ScanLines({ count = 60, opacity = 0.05, className = "" }: ScanLinesProps) {
  // Generate deterministic opacity values on client-side only
  const [opacityValues] = useState(() => 
    Array.from({ length: count }, (_, i) => 0.1 + (i % 5) * 0.04)
  );
  
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      {opacityValues.map((lineOpacity, i) => (
        <div 
          key={i} 
          className="h-px w-full bg-white/30" 
          style={{ 
            marginTop: `${(i * (100 / count))}vh`,
            opacity: lineOpacity
          }}
        />
      ))}
    </div>
  );
} 