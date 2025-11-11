# Sandbox Hub

A production-ready MVP of a sandbox + mini-games hub for 16-year-old creators, inspired by Roblox but simplified. The repository is a Turborepo monorepo that contains a Next.js front-end (`apps/web`), an Express + Socket.IO backend (`apps/server`), and shared packages for UI and game utilities.

## Monorepo structure

```
apps/
  web/        # Next.js 15 app with NextAuth, Zustand, TailwindCSS, Three.js mini-games
  server/     # Express + Socket.IO backend with Prisma ORM and moderation APIs
packages/
  ui/         # Reusable UI components (buttons, cards, accessibility helpers)
  game-core/  # Shared types, game loop utilities, profanity filter, i18n dictionaries
  config/     # Shared lint/tsconfig/tailwind/prettier configs
```

## Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+

## Environment variables

Copy `.env.example` to `.env` and adjust as needed.

```bash
cp .env.example .env
```

Important variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: secret used by NextAuth
- `NEXTAUTH_URL`: public URL of the web app
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `BACKEND_URL` / `SOCKET_URL`: Express + Socket.IO endpoints

## Installation

```bash
pnpm install
```

Generate the Prisma schema and seed demo data:

```bash
pnpm db:push
pnpm db:seed
```

This seeds two demo rooms and three demo worlds, plus admin/player accounts.

## Development

Run both web and server apps simultaneously:

```bash
pnpm dev
```

- Web app: http://localhost:3000
- Backend API + Socket.IO: http://localhost:4000

Default credentials:

- Admin: `admin@example.com` / `admin1234`
- Player: `player@example.com` / `password123`

## Scripts

- `pnpm lint` – run ESLint across all packages
- `pnpm test` – run Vitest unit tests (UI, game-core, server) and Playwright e2e (see CI)
- `pnpm build` – build all apps/packages
- `pnpm db:push` – apply Prisma schema
- `pnpm db:seed` – seed demo data

## Testing

Unit tests use Vitest. End-to-end tests live in `tests/e2e` and use Playwright.

To run Playwright locally (requires running `pnpm dev` in another terminal):

```bash
pnpm exec playwright test
```

## Backend modules

- **Auth**: JWT-powered credential login used by NextAuth + OAuth support.
- **Lobby**: Room CRUD, matchmaking (`/api/rooms/quick-play`), and Socket.IO presence.
- **Worlds**: Creator endpoints with JSON schema storage and publishing.
- **Chat**: Room chat logs with profanity filtering and flagged message metadata.
- **Moderation**: Reports, bans, audit logging, and soft-ban workflow.
- **Games**: Socket namespaces (`/lobby`, `/room:{id}`) dispatching events such as `state_update`, `finish_time`, and `report_user`.

## Front-end features

- Multiplayer lobby with quick join, room list, and presence updates.
- 3D obstacle course (`react-three-fiber` + `drei`) and 2D canvas platformer.
- Drag-and-drop world creator with palette/grid snap and DB persistence.
- Chat panel with profanity filter, rate-limited API, and report dialog.
- Role-based moderation dashboard and reports list.
- Cosmetic coin shop (virtual currency only), accessibility-friendly UI, and EN/EL localisation.

## GitHub Actions

`.github/workflows/ci.yml` runs lint, tests, builds, and Playwright smoke tests.

## Production build

1. Set environment variables for production (`NEXTAUTH_URL`, `DATABASE_URL`, etc.).
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm db:push` followed by `pnpm db:seed` (optional).
4. Run `pnpm build`.
5. Start backend: `pnpm --filter @sandbox/server start` (exposes port 4000).
6. Start frontend: `pnpm --filter @sandbox/web start` (exposes port 3000).

## Accessibility & localisation

- All interactive controls are keyboard-focusable with visible focus styles.
- High-contrast palettes and Tailwind colour utilities ensure colour-blind friendly UI.
- Localisation dictionaries live in `packages/game-core/src/i18n.ts` (English + Greek).

## Future improvements

- Persistent matchmaking queues and presence-based matchmaking.
- Full physics server-authoritative simulation per room.
- Enhanced moderation tooling (mute durations, analytics, escalations).
- Marketplace for user-generated content.
