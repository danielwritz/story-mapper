## Summary
Set up the React frontend application with Vite, TypeScript, Tailwind CSS, and the Vitest testing framework. This creates the development environment for the web app where the canvas and all UI will live.

## Who This Is For
**Founder perspective**: This is the shell of our web app — the blank screen that will become our story mapping canvas. It sets up hot-reload development, modern styling, and testing.
**Agent perspective**: Install and configure Vite + React 18 + TypeScript + Tailwind CSS v4 + Vitest + React Testing Library in `apps/web`. Ensure `npm run dev` starts the dev server and `npm test` runs Vitest.

## Acceptance Criteria
- [ ] `apps/web` is a Vite + React + TypeScript application
- [ ] Tailwind CSS v4 is installed and configured with a base theme
- [ ] Vitest is configured with React Testing Library and jsdom environment
- [ ] `apps/web/src/App.tsx` renders a minimal shell with the text "Story Mapper"
- [ ] `apps/web/src/main.tsx` mounts the React app to `#root`
- [ ] `apps/web/index.html` exists with a `<div id="root">` and proper meta tags
- [ ] `npm run dev` in `apps/web` starts Vite dev server on port 5173
- [ ] `npm test` in `apps/web` runs Vitest and passes
- [ ] Tailwind utility classes work (verified by test)
- [ ] Hot module replacement (HMR) works in dev mode

## Technical Specification

### Dependencies to Install (apps/web)
```
Production: react, react-dom
Dev: @types/react, @types/react-dom, @vitejs/plugin-react, typescript, vite,
     tailwindcss, @tailwindcss/vite, vitest, @testing-library/react, 
     @testing-library/jest-dom, @testing-library/user-event, jsdom
```

### `apps/web/vite.config.ts`
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
```

### `apps/web/src/test-setup.ts`
```ts
import '@testing-library/jest-dom/vitest';
```

### `apps/web/src/App.tsx`
Simple shell component with Tailwind styling — centered "Story Mapper" heading on a gray background.

### `apps/web/src/index.css`
```css
@import "tailwindcss";
```

## Test Requirements

### Test: App renders correctly
```
File: apps/web/src/App.test.tsx

Test: "renders the Story Mapper heading"
- Render <App />
- Assert screen.getByText('Story Mapper') is in the document

Test: "heading has correct styling classes"  
- Render <App />
- Assert the heading element has the expected Tailwind classes applied (check computed styles or class names)

Test: "app container is present"
- Render <App />
- Assert a container div with role="application" or a data-testid="app-shell" exists
```

## Dependencies
- Requires Issue #1 (monorepo setup) to be completed first

## Files to Create/Modify
- `apps/web/package.json` (modify — add dependencies and scripts)
- `apps/web/vite.config.ts` (create)
- `apps/web/tsconfig.json` (modify if needed)
- `apps/web/index.html` (create)
- `apps/web/src/main.tsx` (create)
- `apps/web/src/App.tsx` (create)
- `apps/web/src/App.test.tsx` (create)
- `apps/web/src/index.css` (create)
- `apps/web/src/test-setup.ts` (create)
