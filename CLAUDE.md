# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node.js is not on the default PATH in the bash shell. Prefix commands with the path to the local Node installation:

```bash
export PATH="/c/Users/uzivatel/node-v22.15.0-win-x64:$PATH"
```

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` → output in `dist/` |
| Preview build | `npm run preview` |

No test runner is configured.

## Architecture

**Mravenci** is an Arcomage-inspired card game (React + TypeScript + Vite).

### Engine (`src/engine/`) — pure logic, no React

- **`types.ts`** — all shared types: `PlayerState`, `CardDefinition`, `CardInstance`, `GameState`, `GameAction`
- **`constants.ts`** — game balance values (starting stats, win thresholds)
- **`cards.ts`** — 30 `CardDefinition` objects with inline `effect` functions. Each effect receives `GameState` and `playerIndex`, mutates a clone, and returns it. `dealDamage()` hits wall first, then castle.
- **`deck.ts`** — deck of 90 cards (3 copies × 30 definitions), shuffle, draw. Uses a module-level `globalUid` counter (reset via `resetUid()` on each new game) to give each `CardInstance` a unique `uid`.
- **`turnManager.ts`** — `initGame`, `playCard`, `discardCard`, `generateResources`, `checkWinConditions`, `deepCloneState`. Resources are generated at the *start* of each player's turn (after `START_GAME` and after each action that switches turns).
- **`ai.ts`** — greedy one-ply scorer: simulates each playable card, picks highest `scoreCard()` result. Weights: opponent castle damage > own castle gain > generator changes > wall. Falls back to discarding the cheapest card when nothing is affordable.

### State management (`src/hooks/useGame.ts`)

Single `useReducer` with actions: `START_GAME | PLAY_CARD | DISCARD_CARD | AI_TURN | RETURN_TO_MENU`. The AI turn is triggered by a `useEffect` watching `currentPlayer === 1` with an 800 ms `setTimeout`.

`deepCloneState` (`JSON.parse(JSON.stringify(...))`) is called before every mutation to avoid reducer impurity.

### Win conditions

- Opponent castle reaches 0 → you win
- Your castle reaches `WIN_CASTLE` (100) → you win  
- Any of your resources reaches `WIN_RESOURCES` (100) → you win

### Cards with `playAgain: true`

Only **Lučištník** (archer) has this flag. After playing it, `currentPlayer` does not switch — the same player takes another turn.

### Game modes

- `'ai'` — player is index 0, AI is index 1; only player 0's hand is shown
- `'local'` — both players share one screen, hand label shows whose turn it is
