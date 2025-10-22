# AI Chatbot Application

## Overview

This is a real-time AI chatbot web application that provides conversational interactions using advanced language models through the OpenRouter API. The application features a clean, modern chat interface inspired by Linear, ChatGPT, and Discord design patterns, with support for both light and dark themes.

The application uses a full-stack TypeScript architecture with React on the frontend and Express on the backend, providing a responsive and mobile-friendly chat experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **React 18** with TypeScript for UI components
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query (React Query)** for server state management and API caching
- **Tailwind CSS** for styling with custom design system

**UI Component Library:**
- **shadcn/ui** components built on Radix UI primitives
- Follows the "new-york" style variant
- Comprehensive component library including buttons, dialogs, forms, tooltips, and more

**Design System:**
- Custom color palette optimized for chat interfaces with distinct dark/light modes
- Typography using Inter (primary) and JetBrains Mono (code blocks) from Google Fonts
- Message bubbles with different styling for user vs assistant messages
- Sophisticated theme system with CSS variables for easy customization

**State Management:**
- Local state for chat messages and UI interactions
- React Query for API response caching and error handling
- Theme preference persisted in localStorage

### Backend Architecture

**Core Technology Stack:**
- **Express.js** as the web server framework
- **TypeScript** for type safety across the entire backend
- **Node.js** runtime environment

**API Integration:**
- **OpenAI SDK** configured to use OpenRouter as the base URL
- Model: `cognitivecomputations/dolphin-mistral-24b-venice-edition:free`
- Stateless API design - chat history managed client-side

**Request/Response Flow:**
1. Client sends message with full conversation history
2. Server validates request using Zod schemas
3. Server adds system prompt on first message
4. OpenRouter API processes the conversation
5. Response streamed back to client

**Validation & Type Safety:**
- **Zod** schemas for runtime validation of API requests/responses
- Shared schema definitions between client and server (`shared/schema.ts`)
- Type-safe API contracts using TypeScript inference

**Development Features:**
- Custom request logging middleware for API endpoints
- Vite integration for hot module replacement in development
- Error handling with structured responses

### Data Architecture

**Storage Strategy:**
- **In-memory storage** implementation (`MemStorage`) for user data
- No persistent database configured (database setup prepared but not active)
- Chat history maintained client-side in component state
- Drizzle ORM configured with PostgreSQL schema definitions (ready for future use)

**Message Schema:**
```typescript
- role: "user" | "assistant" | "system"
- content: string
- timestamp: number (optional)
```

**Rationale:** The stateless approach simplifies deployment and reduces infrastructure requirements. Chat history is ephemeral and lives only in the browser session. This design choice prioritizes simplicity and reduces latency, though it means conversations are lost on page refresh.

### External Dependencies

**Third-Party APIs:**
- **OpenRouter API** - Primary AI service provider
  - Base URL: `https://openrouter.ai/api/v1`
  - Authentication via API key (environment variable: `OPENROUTER_API_KEY`)
  - Compatible with OpenAI SDK interface

**Database (Prepared but Inactive):**
- **PostgreSQL** via Neon serverless driver
- **Drizzle ORM** for database operations and migrations
- Connection configured via `DATABASE_URL` environment variable
- Schema defined but migrations not yet applied

**UI Libraries:**
- **Radix UI** - Unstyled, accessible component primitives (17+ packages)
- **Lucide React** - Icon library for UI elements
- **class-variance-authority** - CSS class variance utilities
- **tailwind-merge** - Intelligent Tailwind class merging

**Development Tools:**
- **Replit plugins** - Runtime error modal, cartographer, dev banner (development only)
- **tsx** - TypeScript execution for development server
- **esbuild** - Production build bundler for server code

**Form & Data Management:**
- **React Hook Form** with resolvers for form state
- **Zod** for schema validation and type inference
- **date-fns** for date manipulation

**Session Management (Available):**
- **connect-pg-simple** - PostgreSQL session store (configured but not currently used)

### Build & Deployment

**Development:**
- `npm run dev` - Starts Vite dev server with HMR
- Server runs on Express with custom Vite middleware integration
- TypeScript compilation checked via `npm run check`

**Production:**
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static files served by Express in production mode
4. Single entry point for deployment

**Environment Variables Required:**
- `OPENROUTER_API_KEY` - API key for OpenRouter service
- `DATABASE_URL` - PostgreSQL connection string (optional, prepared for future use)
- `NODE_ENV` - Environment mode (development/production)