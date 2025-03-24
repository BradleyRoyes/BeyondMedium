# Beyond Medium

A modern web platform for showcasing workshops, listening sessions, and events, featuring programmatically generated placeholder images and a clean, responsive design.

## Features

- Dynamic programmatic placeholder images that adapt to content category
- Responsive design with mobile-first approach
- Interactive UI elements with smooth animations
- Category filtering in the portfolio section
- Cross-platform compatibility

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Animation**: Framer Motion

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Deployment

This project is configured for automatic deployment with Vercel:

1. Push your changes to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy your application

The `vercel.json` configuration file is already set up for optimal deployment with pnpm.

## Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

- `/app`: Next.js app directory containing routes and main components
- `/components`: Reusable UI components
- `/public`: Static assets
- `/styles`: Global CSS styles
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and helpers 