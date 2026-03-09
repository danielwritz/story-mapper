# Story Mapper

A canvas-based story mapping tool for creating technical requirements and functional user requirements.

## Vision

Story Mapper is an interactive visual tool that allows product teams to:
- Create and organize user stories on a drag-and-drop canvas
- Define epics, user activities, and user stories in a hierarchical map
- Automatically generate technical requirements from user stories
- Automatically generate functional user requirements documents
- Collaborate on requirement gathering and prioritization
- Define releases by grouping stories into horizontal swim lanes

## Tech Stack (v1)

- **Frontend**: React 18+ with TypeScript
- **Canvas**: React Flow (node-based canvas library)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library + Playwright (E2E)
- **Build**: Vite
- **Backend**: Node.js + Express (API)
- **Database**: SQLite via better-sqlite3 (local-first, portable)
- **AI Integration**: OpenAI API for requirement generation

## Project Structure

```
story-mapper/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Express API server
├── packages/
│   └── shared/       # Shared types, utilities, validation
├── docs/             # Generated requirements docs
├── .github/
│   └── workflows/    # CI/CD and automation
├── AGENTS.md         # Codex agent instructions
└── README.md
```

## Getting Started

```bash
npm install
npm run dev
```

## Development Workflow

1. Issues are created in GitHub with detailed acceptance criteria and test specifications
2. Issues are automatically assigned to Codex 5.3 for implementation
3. Codex pulls from `main`, implements the change with tests, and pushes directly to `main`
4. All changes require passing tests before push

## License

MIT
