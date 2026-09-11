# Meso Manufacturing Website

The public website for Meso Manufacturing.

## Local development

Use Node.js 22 or newer, then install and run the project:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run build
```

## Project structure

- `src/app` — pages, layouts, metadata, and route handlers.
- `src/components` — reusable interface components.
- `src/lib` — shared utilities and server-side integrations.
- `public` — static files that are safe to publish.

## Configuration and secrets

Copy `.env.example` to `.env.local` when configuration is needed. `.env.local` is ignored by Git.

Values prefixed with `NEXT_PUBLIC_` are bundled for the browser. Do not place passwords, API keys, or other secrets in them.

## Working agreement

- Create a branch for each change and review its Vercel preview before merging to `main`.
- Keep company IP, credentials, customer information, and private source material out of the public repository.
