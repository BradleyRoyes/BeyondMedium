import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock components to avoid issues with server components
jest.mock('@/app/components/hero', () => ({
  __esModule: true,
  default: () => <div data-testid="hero-component">Hero Component</div>
}));

jest.mock('@/app/components/gallery', () => ({
  __esModule: true,
  default: () => <div data-testid="gallery-component">Gallery Component</div>
}));

jest.mock('@/app/components/portfolio', () => ({
  __esModule: true,
  default: () => <div data-testid="portfolio-component">Portfolio Component</div>
}));

// Add missing mocks for Contact and Footer components
jest.mock('@/app/components/contact', () => ({
  __esModule: true,
  default: () => <div data-testid="contact-component">Contact Component</div>
}));

jest.mock('@/app/components/footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer-component">Footer Component</div>
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => <img data-testid="next-image" alt="mocked image" />
}));

describe('Home Page', () => {
  it('renders without crashing', async () => {
    render(<Home />);
    
    // Check if the page renders without throwing errors
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
}); 