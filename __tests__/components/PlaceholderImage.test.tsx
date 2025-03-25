import { render } from '@testing-library/react';
import { PlaceholderImage } from '@/app/components/PlaceholderImage';

// Mock the useEffect hook to prevent canvas rendering
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useEffect: jest.fn(),
  };
});

describe('PlaceholderImage Component', () => {
  it('renders with minimum props', () => {
    const { container } = render(
      <PlaceholderImage category="workshops" title="Test Workshop" />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    const { container } = render(
      <PlaceholderImage category="workshops" title="Test Workshop" width={300} height={200} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom styles', () => {
    const { container } = render(
      <PlaceholderImage 
        category="workshops" 
        title="Test Workshop"
        className="custom-class"
      />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('custom-class');
  });
}); 