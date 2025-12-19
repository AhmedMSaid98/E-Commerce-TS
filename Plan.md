## Project Plan & Roadmap

### Goals

-   Ship a documented, consistent and testable backend for simple e-commerce flows.
-   Align controllers/services to consistent validation, FK checks and response format.
-   Provide clear next steps and roadmap for production hardening.

### Phase A — Stabilize (0–2 days)

1. Finish Swagger docs for all endpoints (address, user, category, image, product, purchasedProduct, order).
2. Fix logic bugs and implement missing controller flows (already done in core areas).
3. Add `.env.example`, `README.md` and `Plan.md` (this change).

### Phase B — Hardening (1–2 weeks)

-   Centralize response formatting and error middleware (`resTransformer` everywhere).
-   Add unit and integration tests (Jest + Supertest). Focus: auth, product stock, order creation.
-   Add request size limits, rate limiting and input sanitization.
-   Replace local image storage with S3 (or compatible) and add upload validation.

### Phase C — Production (ongoing)

-   Add payments (Stripe), invoicing, notifications and analytics events.
-   Add CI/CD, containerization and infrastructure as code (Docker + Terraform).

### Route map (detailed)

-   `/ecommerce-user`

    -   `POST /register-user` — register
    -   `POST /login` — login
    -   `GET /get-user-profile` — auth user profile
    -   Admin: `GET /get-user`, `GET /get-users`, `PATCH /update-user/admin`, `DELETE /delete-user`, `PATCH /restore-user`

-   `/ecommerce-product`

    -   `POST /create-product`
    -   `GET /get-product` — by id
    -   `GET /get-products` — filters + pagination
    -   `PATCH /update-product`
    -   `PATCH /change-product-stock`
    -   `DELETE /delete-product`, `PATCH /soft-delete-product`, `PATCH /restore-product`

-   `/ecommerce-category`

    -   `POST /create-category`, `GET /get-category`, `GET /get-categories`, `PATCH /update-category`, `DELETE /delete-category`

-   `/ecommerce-image`

    -   `POST /upload-user-image`, `PATCH /update-user-image`, `DELETE /delete-user-image`, `GET /get-user-image`
    -   `POST /upload-product-images`, `GET /get-product-images`, `DELETE /delete-product-images`, `DELETE /delete-product-image`

-   `/ecommerce-purchased-product`

    -   `POST /create-purchased-product`, `POST /create-many-purchased-product`
    -   `GET /get-purchased-product`, `GET /get-purchased-products`, `GET /get-purchased-product-by-user`
    -   `PATCH /update-order-id`, `PATCH /update-purchased-product-status`
    -   `DELETE /delete-purchased-product`, `PATCH /soft-delete-purchased-product`, `PATCH /restore-purchased-product`

-   `/ecommerce-order`
    -   `POST /create-order`, `POST /create-order-by-user-id`
    -   `GET /get-orders`, `GET /get-orders-auth`
    -   `PATCH /update-order-status`

### Recommended tickets

1. Add `env.example` and `docker-compose` for local Postgres.
2. Add end-to-end tests for order creation lifecycle.
3. Improve Swagger with response examples and request/response schemas generated from Prisma models.

### KPIs / Acceptance

-   Endpoints should return consistent `success`, `statusCode`, `message`, and `data` shapes.
-   All FK checks must be awaited and return 4xx on missing FK.
-   Major flows covered by integration tests: register -> add products -> add purchased products -> create order -> cancel order.

If you want, I can wire up a basic `docker-compose.yml` and `env.example` next — shall I proceed?
