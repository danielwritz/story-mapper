## Summary
Set up the monorepo structure using npm workspaces with three packages: `apps/web` (React frontend), `apps/api` (Express backend), and `packages/shared` (shared types and utilities). This is the foundational issue — everything else builds on this structure.

## Who This Is For
**Founder perspective**: This gives us a clean, scalable project structure where frontend, backend, and shared code each live in their own space but can easily share code.
**Agent perspective**: This establishes the workspace root, package.json configs, and TypeScript project references that all subsequent issues depend on.

## Acceptance Criteria
- [ ] Root `package.json` with npm workspaces configured for `apps/*` and `packages/*`
- [ ] `apps/web/package.json` exists with name `@story-mapper/web`
- [ ] `apps/api/package.json` exists with name `@story-mapper/api`
- [ ] `packages/shared/package.json` exists with name `@story-mapper/shared`
- [ ] Root `tsconfig.json` with TypeScript project references to all three packages
- [ ] Each package has its own `tsconfig.json` extending a shared `tsconfig.base.json`
- [ ] `tsconfig.base.json` at root with strict mode, ES2022 target, ESM module resolution
- [ ] Root scripts: `dev`, `build`, `test`, `lint` that run across all workspaces
- [ ] `.nvmrc` file pinning Node.js 20 LTS
- [ ] `packages/shared/src/index.ts` exports a placeholder (e.g., `export const APP_NAME = 'Story Mapper'`)
- [ ] Both `apps/web` and `apps/api` can import from `@story-mapper/shared`
- [ ] Running `npm install` from root installs all workspace dependencies
- [ ] Running `npm test` from root executes tests across all workspaces (even if no tests yet, the command should not error)

## Technical Specification

### Root `package.json`
```json
{
  "name": "story-mapper",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present"
  }
}
```

### `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Directory Structure After Completion
```
story-mapper/
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   └── api/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
├── package.json
├── tsconfig.json
├── tsconfig.base.json
├── .nvmrc
├── .gitignore
├── AGENTS.md
└── README.md
```

## Test Requirements

### Test: Workspace resolution
```
File: packages/shared/src/index.test.ts

Test: "APP_NAME is exported and equals Story Mapper"
- Import { APP_NAME } from './index'
- Assert APP_NAME === 'Story Mapper'
```

### Test: Cross-package imports
```
File: apps/web/src/shared-import.test.ts

Test: "can import from @story-mapper/shared"
- Import { APP_NAME } from '@story-mapper/shared'
- Assert APP_NAME is defined
- Assert typeof APP_NAME === 'string'
```

```
File: apps/api/src/shared-import.test.ts

Test: "can import from @story-mapper/shared"
- Import { APP_NAME } from '@story-mapper/shared'
- Assert APP_NAME is defined
- Assert typeof APP_NAME === 'string'
```

### Test: npm scripts
```
Manual verification (CI will validate):
- `npm install` completes without errors
- `npm test` runs and all tests pass
- `npm run build` completes (once build scripts exist)
```

## Dependencies
None — this is the first issue.

## Files to Create/Modify
- `package.json` (create)
- `tsconfig.json` (create)
- `tsconfig.base.json` (create)
- `.nvmrc` (create)
- `apps/web/package.json` (create)
- `apps/web/tsconfig.json` (create)
- `apps/web/src/` (create directory)
- `apps/api/package.json` (create)
- `apps/api/tsconfig.json` (create)
- `apps/api/src/` (create directory)
- `packages/shared/package.json` (create)
- `packages/shared/tsconfig.json` (create)
- `packages/shared/src/index.ts` (create)
- `packages/shared/src/index.test.ts` (create)
- `apps/web/src/shared-import.test.ts` (create)
- `apps/api/src/shared-import.test.ts` (create)
