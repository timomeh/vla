# TanStack Start + Vla Example

This example demonstrates how to use Vla with Tanstack Start.

## Running the example

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Type-safe data layer with Vla
- Server Functions and Loaders with Tanstack Start
- Session management with cookies

## Endpoints

- `GET /` - HTML page with posts listing and creation form
- `GET /api/posts` - Get posts as JSON

## Project Structure

- `app/routes/` - Tanstack Start route files
- `app/data/` - Data layer with Vla classes

## How it works

- `src/start.ts` adds a middleware and injects context
- `src/routes/*` can invoke Vla's actions