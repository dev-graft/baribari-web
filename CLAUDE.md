# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev                  # Start development server on port 3000
npm run build               # Build for production (TypeScript compile + Vite build)
npm run preview             # Preview production build
npm run type-check          # TypeScript type checking without emit
```

### Code Quality
```bash
npm run lint                # ESLint with TypeScript support
```

### Storybook
```bash
npm run storybook           # Start Storybook dev server on port 6006
npm run build-storybook     # Build Storybook for production
```

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router DOM v6
- **Internationalization**: i18next with browser language detection
- **Icons**: Lucide React
- **Charts**: Recharts
- **Development**: ESLint + Prettier + Storybook

### Directory Structure
```
src/
├── components/
│   ├── layout/              # Header, Footer, Layout components
│   ├── tools/              # Tool-specific components (Base64Converter, JsonPrettyFormatter)
│   └── common/             # Shared components (LanguageSelector)
├── pages/                  # Route page components
├── i18n/                   # Internationalization setup
├── App.tsx                 # Main router configuration
└── main.tsx               # Application entry point
```

### Key Architecture Patterns

#### Routing Structure
The app uses nested routing with a Layout wrapper:
- `/` - HomePage
- `/tools` - ToolsPage (tool listing)
- `/tools/:toolId` - ToolDetailPage (individual tool)
- `/login` - LoginPage
- `/dashboard` - DashboardPage

#### Internationalization Setup
- Uses i18next with browser language detection
- Locale files stored in `public/locales/` (ko.json, en.json)
- Fallback language: English
- Language preference cached in localStorage

#### Component Organization
- Layout components in `src/components/layout/`
- Tool components in `src/components/tools/` with corresponding Storybook stories
- Each major component has `.stories.tsx` files for Storybook documentation

### Build Configuration

#### Vite Configuration
- Path alias: `@` maps to `./src`
- Development server runs on port 3000 with auto-open
- Uses `@vitejs/plugin-react` for React support

#### TypeScript Configuration
- Strict mode enabled
- Uses modern ES2020 target
- Separate config for Node.js tooling (`tsconfig.node.json`)

#### ESLint Rules
- Extends recommended TypeScript and React hooks rules
- Custom rules:
  - Unused vars error with `_` prefix ignore pattern
  - `@typescript-eslint/no-explicit-any` as warning
  - React refresh component export warnings

### Development Conventions

#### Code Style
- Component names: PascalCase
- File names: PascalCase for components, kebab-case for utilities
- Functional components with hooks pattern
- TypeScript strict mode compliance

#### Styling Approach
- Tailwind CSS utility-first approach
- Responsive design with mobile-first approach
- Component-level styling using Tailwind classes

#### Storybook Integration
- Stories for all layout and tool components
- Uses Vite as build tool for Storybook
- Autodocs enabled with "tag" strategy

## Tool Development

### Adding New Tools
1. Create component in `src/components/tools/`
2. Create corresponding `.stories.tsx` file
3. Add tool to the routing system if needed
4. Update locale files for internationalization

### Tool Categories
Based on existing tools:
- **Converters**: Base64, URL encoding, unit conversion
- **Formatters**: JSON formatting, text case conversion
- **Time/Date**: Timestamp conversion, Cron parsing
- **Utilities**: Various developer and general-purpose tools

### Internationalization for Tools
- All tool names and descriptions should be in locale files
- Use `useTranslation` hook for runtime translation
- Support both Korean (`ko`) and English (`en`) locales