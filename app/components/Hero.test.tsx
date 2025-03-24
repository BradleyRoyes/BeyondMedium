import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Hero from './hero';

jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn(),
    timeline: jest.fn().mockReturnValue({
      to: jest.fn().mockReturnThis()
    })
  }
}));

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title with Beyond and Medium parts', () => {
    render(<Hero />);
    expect(screen.getByText('Beyond')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
    expect(screen.getByText('dium')).toBeInTheDocument();
  });

  it('applies void-text-active class when hovering over title', () => {
    render(<Hero />);
    
    const title = screen.getByText('Beyond').parentElement;
    const diumPart = screen.getByText('dium');
    
    // Initially, the void-text-active class should not be present
    expect(diumPart).not.toHaveClass('void-text-active');
    
    // Hover over the title
    if (title) {
      fireEvent.mouseEnter(title);
      
      // Now the void-text-active class should be added
      expect(diumPart).toHaveClass('void-text-active');
      
      // Leave the title
      fireEvent.mouseLeave(title);
      
      // The void-text-active class should be removed
      expect(diumPart).not.toHaveClass('void-text-active');
    }
  });
}); 