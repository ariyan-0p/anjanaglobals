# Anjana Globals — Backend API

Node.js + Express + Mongoose backend for the Anjana Globals website.

## Stack
- Node.js (ESM), Express 4
- MongoDB via Mongoose
- JWT auth (admin)
- Helmet, CORS, rate limiting, morgan
- Nodemailer (optional, for lead notifications)

## Setup

```bash
cd server
cp .env.example .env   # then edit .env with your values
npm install
npm run dev            # nodemon, http://localhost:5000
```

Required env vars: `MONGO_URI`, `JWT_SECRET`. See `.env.example`.

## Create the first admin

```bash
node src/scripts/createAdmin.js "Admin" admin@anjanaglobals.com YourStrongPassword
```

## Folder layout

```
server/
  src/
    app.js              Express app setup (middleware, routes mount)
    index.js            Entry: connects DB, starts server
    config/
      env.js            Loads & validates .env
      db.js             Mongo connection
    middleware/
      auth.js           requireAuth, requireRole
      error.js          ApiError, asyncHandler, notFound, errorHandler
      validate.js       express-validator wrapper
    models/             Mongoose schemas
    controllers/        Route handlers
    routes/             Express routers, mounted under /api
    utils/
      jwt.js
      mailer.js
    scripts/
      createAdmin.js
```

## API surface (current)

Public:
- `POST   /api/leads`                     submit lead (popup/contact/package)
- `POST   /api/subscribers`               newsletter subscribe
- `POST   /api/subscribers/unsubscribe`
- `POST   /api/testimonials/submit`       submit testimonial (unapproved)
- `POST   /api/b2b/register`              B2B agent application
- `GET    /api/destinations`              list active
- `GET    /api/destinations/:idOrSlug`
- `GET    /api/packages`
- `GET    /api/packages/:idOrSlug`
- `GET    /api/services`
- `GET    /api/services/:idOrSlug`
- `GET    /api/testimonials`              approved only
- `GET    /api/hotel-partners`

Auth:
- `POST   /api/auth/login`                returns JWT
- `GET    /api/auth/me`                   bearer required

Admin (require `Authorization: Bearer <token>`):
- `GET/PATCH/DELETE /api/leads/...`
- `GET    /api/subscribers`
- CRUD for destinations, packages, services, testimonials, hotel-partners
- `GET/PATCH/DELETE /api/b2b/...`

Health check: `GET /health`.

## Notes
- All write endpoints validate input via `express-validator`.
- Public mutating endpoints (`/leads`, `/b2b/register`, `/auth/login`) have stricter rate limits.
- Errors flow through `errorHandler` and return `{ error, details? }` JSON.
