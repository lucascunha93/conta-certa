# Copilot Instructions for conta-certa

## Project Overview
This is an Ionic React mobile application for cash flow control, built with:
- **Ionic React 8.5** with React 19 and TypeScript
- **Capacitor 7.4** for native mobile features 
- **Vite 5.2** as build tool with legacy browser support
- **React Router 5.3** for navigation
- **Vitest + Cypress** for unit and e2e testing

## Architecture Patterns

### Component Structure
- **Pages**: Located in `src/pages/` - full-page components using Ionic page structure
- **Components**: Reusable UI components in `src/components/` with co-located CSS files
- **Theming**: Custom CSS variables in `src/theme/variables.css` with dark mode support

### Ionic Conventions
- All pages must use `IonPage` wrapper with `IonHeader`, `IonToolbar`, and `IonContent`
- Import Ionic components from `@ionic/react` (e.g., `IonContent`, `IonHeader`)
- Use `setupIonicReact()` initialization in main App component
- Dark mode configured via `@ionic/react/css/palettes/dark.system.css`

### Routing Pattern
- Uses React Router 5.3 with `IonReactRouter` and `IonRouterOutlet`
- Default route redirects to `/home` - see `src/App.tsx`
- Route definitions: `<Route exact path="/home"><Home /></Route>`

## Development Workflows

### Key Commands
```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # TypeScript compile + Vite build
npm run test.unit    # Vitest unit tests
npm run test.e2e     # Cypress e2e tests
npm run lint         # ESLint with TypeScript config
```

### Testing Setup  
- **Unit tests**: Vitest with jsdom, React Testing Library, setup in `src/setupTests.ts`
- **E2E tests**: Cypress targeting `http://localhost:5173`, config in `cypress.config.ts`
- Mock `window.matchMedia` required for Ionic components in tests

### Build Configuration
- **Capacitor**: Native builds via `capacitor.config.ts` (webDir: 'dist')
- **Vite**: Legacy browser support enabled, test globals configured
- **ESLint**: Flat config format with React hooks and TypeScript rules

## Code Style
- TypeScript strict mode with React 19 types
- React functional components with `React.FC` typing
- Co-located CSS files for components (e.g., `ExploreContainer.tsx` + `ExploreContainer.css`)
- Ionic CSS utility classes preferred over custom styling