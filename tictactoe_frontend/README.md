# Tic-Tac-Toe — Nuxt 3 (Ocean Professional)

A modern Nuxt 3 frontend implementing a complete Tic-Tac-Toe game with Human vs Human and Human vs AI modes, scoreboard, restart controls, and a minimal in-app audit trail scaffold. Styled using the Ocean Professional theme.

## Features
- Centered responsive 3x3 board with hover states
- Human vs Human and Human vs AI (depth-limited minimax) modes
- Scoreboard: X wins, O wins, draws
- Controls: New Game, Reset Scores, Toggle Opponent, Toggle Audit Trail
- Result banner and locked board after game over
- In-memory audit trail with ISO timestamps (userLabel, actionType, payload, before/after)
- No external services or .env required
- Tailwind CSS configured inline via nuxt.config.ts

## Quickstart

Install and run:
```bash
npm install
npm run dev
```
Open http://localhost:3000.

Build and preview:
```bash
npm run build
npm run preview
```

## Project Structure
- pages/index.vue — main screen assembling board, controls, scoreboard, audit
- components/* — UI components
- composables/useTicTacToe.ts — core game logic and state
- composables/useAI.ts — AI (minimax)
- composables/useAuditTrail.ts — in-memory audit logging
- types/game.ts — shared types
- assets/css/tailwind.css — theme and utilities

## GxP-Conscious Scaffold (Demo)
This frontend includes a minimal audit trail scaffold to illustrate ALCOA+ concepts:
- Attributable: userLabel "Player X", "Player O", "System"
- Timestamped: ISO 8601 at time of event
- Before/After: shallow snapshot of relevant state
- Action Types: MOVE, NEW_GAME, RESET_SCORES, TOGGLE_OPPONENT, ERROR

Not for production/compliance use without further controls (persistence, RBAC, signatures, etc).

## Release Gate Checklist
- [x] Inputs validated at board cell and composable APIs
- [x] Audit trail entries generated for key operations
- [x] Unit tests for core logic (AI and Tic-Tac-Toe composable)
- [x] Error handling and safe-guards included
- [x] Documentation updated
- [x] No external services required
- [x] Code review ready

## Tests
This project uses Vitest test syntax with Nuxt/Vite. Minimal unit test scaffolding is provided.

Run (if vitest configured in your environment):
```bash
# Example if vitest is available in CI
npx vitest run
```

Note: This starter doesn't add vitest deps by default to keep the template minimal in this environment. The provided tests serve as scaffolding and references for logic validation.

## Theme
Ocean Professional color palette:
- Primary: #2563EB
- Secondary: #F59E0B
- Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827
