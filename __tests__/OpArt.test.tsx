import React from 'react'
import { render, screen } from '@testing-library/react'
import { OpArt } from '../app/components/OpArt'

// Mock canvas functionality since JSDOM doesn't support canvas operations
jest.mock('react', () => {
  const originalReact = jest.requireActual('react')
  return {
    ...originalReact,
    useRef: jest.fn().mockImplementation(() => ({
      current: {
        getContext: jest.fn().mockReturnValue({
          clearRect: jest.fn(),
          createLinearGradient: jest.fn().mockReturnValue({
            addColorStop: jest.fn()
          }),
          fillRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          stroke: jest.fn(),
          lineTo: jest.fn(),
          moveTo: jest.fn(),
          fill: jest.fn(),
          createRadialGradient: jest.fn().mockReturnValue({
            addColorStop: jest.fn()
          }),
        }),
        width: 500,
        height: 500,
        parentElement: {
          getBoundingClientRect: jest.fn().mockReturnValue({
            width: 500,
            height: 500,
          }),
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    })),
  }
})

// Mock framer-motion to avoid test issues
jest.mock('framer-motion', () => {
  return {
    motion: {
      canvas: ({ className, children, ...props }: any) => (
        <canvas className={className} {...props}>
          {children}
        </canvas>
      ),
    },
    useSpring: jest.fn().mockImplementation(() => 0),
    useMotionValue: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      get: jest.fn().mockReturnValue(0),
    })),
    useTransform: jest.fn().mockImplementation(() => 0),
  }
})

describe('OpArt Component', () => {
  it('renders the canvas element', () => {
    render(<OpArt />)
    
    // Find the canvas element - we'll need to use a different approach since 
    // testing-library doesn't expose canvas elements directly
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
  
  it('applies the provided className', () => {
    render(<OpArt className="test-class" />)
    
    const canvas = document.querySelector('canvas.test-class')
    expect(canvas).toBeInTheDocument()
  })
  
  it('uses the correct variant based on props', () => {
    const { rerender } = render(<OpArt variant="circles" />)
    
    // We can't directly test the drawing functions, but we can verify
    // that the component doesn't crash with different variants
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt variant="moiré" />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt variant="waves" />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt variant="grid" />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
  })
  
  it('accepts color scheme props', () => {
    const { rerender } = render(<OpArt colorScheme="purple" />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt colorScheme="blue" />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt colorScheme="cyan" />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt colorScheme="custom" customColors={['#111', '#222', '#333']} />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
  })
  
  it('handles interactive prop', () => {
    const { rerender } = render(<OpArt interactive={true} />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
    
    rerender(<OpArt interactive={false} />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
  })
}) 