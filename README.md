## E-Commerce-TS

E-Commerce-TS is a minimal e-commerce backend written in TypeScript using Express and Prisma. It's intended as a prototype/service backend for small projects, demos, or as a starting scaffold for production-ready applications.

## What the application does

-   Manages users (registration, login, profile) with JWT authentication and roles.
-   Manages products and categories (CRUD + search/filters).
-   Handles images for users and products (local disk helpers included).
-   Implements `PurchasedProduct` as cart/pending items and converts them to `Order` records.
-   Supports soft-delete/restore flows for several entities.
-   Provides Swagger API documentation at `/api-docs`.

## Tech stack

-   Node.js + TypeScript
-   Express
-   Prisma (Postgres recommended)
-   Zod for input validation
-   Multer for file uploads
-   Swagger (`swagger-jsdoc` + `swagger-ui-express`) for API docs

## Features

-   JWT authentication and role-based authorization (ADMIN / USER)
-   User registration, login, profile
-   Product CRUD with search, filtering and pagination
-   Category CRUD
-   Image upload for user profile and product images (disk-based helpers provided)
-   Cart/pending items via `PurchasedProduct`, order creation and status management
-   Soft-delete and restore operations on core entities

## Quick start

1. Install dependencies

```bash
npm install
```

2. Provide environment variables (create a `.env` file):

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=4005
PROTOCOL=http://
HOST=localhost:
JWT_SECRET=your_jwt_secret
```

3. Generate Prisma client and push the schema to the database

```bash
npm run pg
```

4. Start in development

```bash
npm run dev
```

5. Open Swagger UI at:

```
http://localhost:4000/api-docs
```

Notes:

-   The `start` script compiles TypeScript to `dist` and runs `node dist/server.ts`.
-   Adjust `PORT`, `HOST`, and `PROTOCOL` env vars as needed; `server.ts` uses them when printing the Swagger URL.

## File uploads

-   Uploaded files are stored on disk under `uploads/` by default. For production, replace the storage helpers with an S3-compatible implementation.

## Useful scripts

-   `npm run dev` — run with `tsx` in watch mode (recommended for development)
-   `npm run pg` — generate Prisma client and push DB schema
-   `npm start` — build then run compiled output

## Contributing and next steps

-   Add tests (Jest + Supertest) covering auth, product stock updates and order creation flows.
-   Add CI (GitHub Actions) to run lint and tests.
-   Consider moving image storage to object storage (S3) and adding virus scan/validation for uploads.

## Troubleshooting

-   If Swagger shows empty/incorrect schemas, ensure `src/utils/swagger/*.ts` files are present and `server.ts` `apis` path matches.
-   If Prisma client generation fails, check `DATABASE_URL` and Prisma schema at `prisma/schema.prisma`.

If you'd like, I can add an example `.env.example` and a Postgres docker-compose snippet.
