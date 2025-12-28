# Koa + Vla Example

This example demonstrates how to use Vla with Koa.js.

## Running the example

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Type-safe data layer with Vla
- Server-side rendering with EJS templates
- API Endpoints
- Form submissions for post creation
- Session management with cookies

## Endpoints

- `GET /` - HTML page with posts listing and creation form
- `POST /posts` - Create a new post (form submission)
- `GET /api/posts` - Get posts as JSON

## Project Structure

- `src/server.ts` - Koa server setup and routes
- `src/data/` - Data layer with Vla classes
- `src/views/` - Views (ejs)
