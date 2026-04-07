# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Run dev server at http://localhost:3000
npm test         # Run tests in watch mode
npm test -- --testPathPattern=App  # Run a single test file
npm run build    # Production build
```

## Architecture

This is a Create React App project (React 19) that renders a Jira-like project board UI backed by a local API.

**Views and navigation:** `App` holds `selectedProject` state and conditionally renders either `ProjectList` (project browser) or `ProjectBoard` (ticket board for a selected project). Navigation is stateful — no router.

**Data flow:**
- Project list: `App` → `ProjectList` (fetches, manages loading/error) → `ProjectCard` (click to select)
- Board view: `App` → `ProjectBoard` (fetches tickets, groups by status) → `TicketCard`

**API layer** (`src/api/`): Both modules call `http://localhost:8080/api/v1/projects`. The backend must be running locally.
- `projects.js`: `GET /projects` — expects `{ id, title, description }`
- `tickets.js`: `GET /projects/:id/tickets` — expects `{ id, key, title, type, status, priority, assignee }`

**Status normalization** (`ProjectBoard.js`): The `STATUS_MAP` normalizes varied status strings (e.g. `"to do"`, `"to_do"`, `"closed"`) into four canonical columns: `todo`, `in_progress`, `in_review`, `done`.

**Ticket types/priorities** (`TicketCard.js`): Types (`bug`, `story`, `task`, `epic`) and priorities (`highest`–`lowest`) are rendered as colored badges. Unknown types fall back to `task`.

**Component/style co-location:** Each component in `src/components/` has a paired `.css` file with the same name.
